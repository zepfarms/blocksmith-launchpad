import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    // Parse the webhook event
    const event = JSON.parse(body);

    console.log('Received webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.user_id;
      const businessId = session.metadata.business_id;
      const blockNames = JSON.parse(session.metadata.block_names);
      const paymentType = session.metadata.payment_type || 'one_time';

      console.log('Processing payment for user:', userId, 'Payment type:', paymentType);

      // Get pricing for the blocks
      const { data: pricing } = await supabase
        .from('blocks_pricing')
        .select('*')
        .in('block_name', blockNames);

      if (paymentType === 'one_time') {
        // Handle one-time purchases
        
        // Insert purchase records
        const purchases = pricing
          ?.filter(p => !p.is_free && p.pricing_type === 'one_time' && p.price_cents > 0)
          .map(block => ({
            user_id: userId,
            business_id: businessId,
            block_name: block.block_name,
            pricing_type: 'one_time',
            price_paid_cents: block.price_cents,
            stripe_payment_intent_id: session.payment_intent
          })) || [];

        if (purchases.length > 0) {
          await supabase
            .from('user_block_purchases')
            .insert(purchases);

          // Create unlocks for purchased blocks
          const unlocks = purchases.map(p => ({
            user_id: userId,
            business_id: businessId,
            block_name: p.block_name,
            unlock_type: 'purchase'
          }));

          await supabase
            .from('user_block_unlocks')
            .insert(unlocks);

          console.log('Created', purchases.length, 'one-time purchases and unlocks');
        }
      }

      // Update business payment status
      await supabase
        .from('user_businesses')
        .update({
          payment_status: 'completed'
        })
        .eq('id', businessId);

      // Get user email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      // Send confirmation email
      if (profile?.email) {
        await resend.emails.send({
          from: 'Acari <support@acari.ai>',
          to: profile.email,
          subject: '✅ Payment Confirmed - Blocks Unlocked!',
          html: `
            <h1>Payment Confirmed!</h1>
            <p>Thank you for your purchase. Your blocks have been unlocked and are now available in your account.</p>
            <p>Purchased blocks: ${blockNames.join(', ')}</p>
            <p><a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/dashboard">Access Your Dashboard</a></p>
            <p>Thank you for choosing Acari!</p>
          `
        });
      }

      console.log('Payment processed successfully for user:', userId);
    }

    // Handle subscription creation
    if (event.type === 'customer.subscription.created' || event.type === 'customer.subscription.updated') {
      const subscription = event.data.object;
      const userId = subscription.metadata.user_id;
      const businessId = subscription.metadata.business_id;
      const blockNames = JSON.parse(subscription.metadata.block_names || '[]');

      console.log('Processing subscription for user:', userId, 'Status:', subscription.status);

      // Get pricing for the blocks
      const { data: pricing } = await supabase
        .from('blocks_pricing')
        .select('*')
        .in('block_name', blockNames);

      const monthlyBlocks = pricing?.filter(p => 
        !p.is_free && p.pricing_type === 'monthly'
      ) || [];

      // Create or update subscription records
      for (const block of monthlyBlocks) {
        const subscriptionData = {
          user_id: userId,
          business_id: businessId,
          block_name: block.block_name,
          stripe_subscription_id: subscription.id,
          stripe_subscription_item_id: subscription.items.data[0]?.id || '',
          status: subscription.status,
          monthly_price_cents: block.monthly_price_cents,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end || false,
        };

        // Upsert subscription
        await supabase
          .from('user_subscriptions')
          .upsert(subscriptionData, { onConflict: 'stripe_subscription_id,block_name' });

        // Create unlock if subscription is active
        if (subscription.status === 'active') {
          await supabase
            .from('user_block_unlocks')
            .upsert({
              user_id: userId,
              business_id: businessId,
              block_name: block.block_name,
              unlock_type: 'subscription',
              subscription_id: subscription.id,
            }, { onConflict: 'user_id,block_name,business_id' });
        }
      }

      console.log('Subscription processed for', monthlyBlocks.length, 'blocks');
    }

    // Handle payment failure
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;

      console.log('Payment failed for subscription:', subscriptionId);

      // Get subscription details
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

      if (subscription) {
        // Calculate grace period (7 days from now)
        const gracePeriodEnd = new Date();
        gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 7);

        // Update subscription status
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'past_due',
            last_payment_status: 'failed',
            payment_retry_count: (subscription.payment_retry_count || 0) + 1,
            grace_period_end: gracePeriodEnd.toISOString(),
          })
          .eq('stripe_subscription_id', subscriptionId);

        // Log payment failure
        await supabase
          .from('subscription_payment_failures')
          .insert({
            user_id: subscription.user_id,
            subscription_id: subscription.id,
            stripe_invoice_id: invoice.id,
            failure_reason: invoice.last_payment_error?.message || 'Payment failed',
            attempt_count: invoice.attempt_count || 1,
            next_retry_date: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000).toISOString() : null,
          });

        // Get user email
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', subscription.user_id)
          .single();

        // Send failure notification email
        if (profile?.email) {
          await resend.emails.send({
            from: 'Acari <support@acari.ai>',
            to: profile.email,
            subject: '⚠️ Payment Failed for Your Acari Subscription',
            html: `
              <h1>Payment Failed</h1>
              <p>We were unable to process your payment for the <strong>${subscription.block_name}</strong> subscription.</p>
              
              <p><strong>Reason:</strong> ${invoice.last_payment_error?.message || 'Payment declined'}</p>
              
              <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
                <strong>Grace Period:</strong> You have 7 days to update your payment method. Your access will continue during this time.
              </div>
              
              <p>Stripe will automatically retry your payment. To avoid service interruption, please update your payment method:</p>
              
              <p style="margin: 30px 0;">
                <a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/dashboard/subscriptions" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Update Payment Method
                </a>
              </p>
              
              <p>If you need help, please contact our support team.</p>
            `
          });
        }

        console.log('Payment failure processed and email sent');
      }
    }

    // Handle payment success (including recovery from failure)
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      const subscriptionId = invoice.subscription;

      console.log('Payment succeeded for subscription:', subscriptionId);

      // Get subscription details
      const { data: subscription } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('stripe_subscription_id', subscriptionId)
        .single();

      if (subscription && subscription.last_payment_status === 'failed') {
        // Update subscription to active
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'active',
            last_payment_status: 'succeeded',
            payment_retry_count: 0,
            grace_period_end: null,
          })
          .eq('stripe_subscription_id', subscriptionId);

        // Mark failures as resolved
        await supabase
          .from('subscription_payment_failures')
          .update({
            resolved: true,
            resolved_at: new Date().toISOString(),
          })
          .eq('subscription_id', subscription.id)
          .eq('resolved', false);

        // Get user email
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', subscription.user_id)
          .single();

        // Send recovery email
        if (profile?.email) {
          await resend.emails.send({
            from: 'Acari <support@acari.ai>',
            to: profile.email,
            subject: '✅ Payment Successful - Subscription Restored',
            html: `
              <h1>Payment Successful!</h1>
              <p>Great news! Your payment for the <strong>${subscription.block_name}</strong> subscription has been processed successfully.</p>
              
              <p>Your subscription is now active and your access has been fully restored.</p>
              
              <p><strong>Amount Paid:</strong> $${(subscription.monthly_price_cents / 100).toFixed(2)}</p>
              <p><strong>Next Billing Date:</strong> ${new Date(subscription.current_period_end).toLocaleDateString()}</p>
              
              <p><a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/dashboard">Access Your Dashboard</a></p>
              
              <p>Thank you for your continued support!</p>
            `
          });
        }

        console.log('Payment recovery processed and email sent');
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;

      console.log('Subscription cancelled:', subscription.id);

      // Update subscription status
      await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id);

      // Remove unlocks
      await supabase
        .from('user_block_unlocks')
        .delete()
        .eq('subscription_id', subscription.id);

      console.log('Subscription unlocks removed');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
