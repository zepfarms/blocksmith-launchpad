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
