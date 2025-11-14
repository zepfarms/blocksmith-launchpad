import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { subscriptionId, action, newBlockName } = await req.json();

    console.log(`Processing subscription ${action} for user:`, user.id);

    // Get current subscription details
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      throw new Error('Subscription not found');
    }

    if (action === 'upgrade' || action === 'downgrade') {
      // Get new pricing details
      const { data: newPricing } = await supabase
        .from('blocks_pricing')
        .select('*')
        .eq('block_name', newBlockName || subscription.block_name)
        .eq('pricing_type', 'monthly')
        .single();

      if (!newPricing || !newPricing.stripe_monthly_price_id) {
        throw new Error('New pricing tier not found');
      }

      // Get the Stripe subscription
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);

      // Update the subscription with the new price
      // Stripe automatically handles proration
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: stripeSubscription.items.data[0].id,
          price: newPricing.stripe_monthly_price_id,
        }],
        proration_behavior: 'always_invoice', // Create invoice for proration
        metadata: {
          user_id: user.id,
          business_id: subscription.business_id,
          block_name: newBlockName || subscription.block_name,
        },
      });

      console.log('Subscription updated in Stripe:', updatedSubscription.id);

      // Update our database
      await supabase
        .from('user_subscriptions')
        .update({
          block_name: newBlockName || subscription.block_name,
          monthly_price_cents: newPricing.monthly_price_cents,
          stripe_subscription_item_id: updatedSubscription.items.data[0].id,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId);

      // Update unlock if block changed
      if (newBlockName && newBlockName !== subscription.block_name) {
        // Remove old unlock
        await supabase
          .from('user_block_unlocks')
          .delete()
          .eq('user_id', user.id)
          .eq('block_name', subscription.block_name)
          .eq('subscription_id', subscriptionId);

        // Create new unlock
        await supabase
          .from('user_block_unlocks')
          .insert({
            user_id: user.id,
            business_id: subscription.business_id,
            block_name: newBlockName,
            unlock_type: 'subscription',
            subscription_id: subscriptionId,
          });
      }

      // Get upcoming invoice to show proration
      const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
        customer: stripeSubscription.customer as string,
        subscription: subscriptionId,
      });

      console.log('Subscription change processed successfully');

      return new Response(
        JSON.stringify({
          success: true,
          message: `Subscription ${action}d successfully`,
          prorationAmount: upcomingInvoice.amount_due,
          nextBillingDate: new Date(updatedSubscription.current_period_end * 1000).toISOString(),
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else if (action === 'switch-to-onetime') {
      // Cancel subscription and process one-time payment
      const { data: oneTimePricing } = await supabase
        .from('blocks_pricing')
        .select('*')
        .eq('block_name', subscription.block_name)
        .eq('pricing_type', 'one_time')
        .single();

      if (!oneTimePricing || !oneTimePricing.stripe_price_id) {
        throw new Error('One-time pricing not available for this block');
      }

      // Get customer ID
      const stripeSubscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId = stripeSubscription.customer as string;

      // Create checkout session for one-time payment
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [{
          price: oneTimePricing.stripe_price_id,
          quantity: 1,
        }],
        mode: 'payment',
        success_url: `${supabaseUrl.replace('supabase.co', 'lovable.app')}/dashboard/subscriptions?upgrade=success`,
        cancel_url: `${supabaseUrl.replace('supabase.co', 'lovable.app')}/dashboard/subscriptions?upgrade=cancelled`,
        metadata: {
          user_id: user.id,
          business_id: subscription.business_id,
          block_name: subscription.block_name,
          payment_type: 'one_time',
          replacing_subscription: subscriptionId,
        },
      });

      // Cancel the subscription at period end
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      await supabase
        .from('user_subscriptions')
        .update({
          cancel_at_period_end: true,
        })
        .eq('stripe_subscription_id', subscriptionId);

      console.log('Switching to one-time payment, session created');

      return new Response(
        JSON.stringify({
          success: true,
          checkoutUrl: session.url,
          message: 'Redirecting to payment...',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } else {
      throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error updating subscription:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});