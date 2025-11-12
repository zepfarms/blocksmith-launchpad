import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";

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
    
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { blockNames } = await req.json();

    // Get user's business
    const { data: business, error: businessError } = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (businessError || !business) {
      return new Response(JSON.stringify({ error: 'Business not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get pricing for selected blocks
    const { data: pricing, error: pricingError } = await supabase
      .from('blocks_pricing')
      .select('*')
      .in('block_name', blockNames);

    if (pricingError) {
      return new Response(JSON.stringify({ error: 'Error fetching pricing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Filter only paid blocks
    const paidBlocks = pricing?.filter(p => !p.is_free && p.price_cents > 0) || [];
    
    if (paidBlocks.length === 0) {
      return new Response(JSON.stringify({ error: 'No paid blocks selected' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate total
    const totalCents = paidBlocks.reduce((sum, block) => sum + block.price_cents, 0);

    // Create Stripe checkout session
    const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'payment',
        'success_url': `${req.headers.get('origin')}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${req.headers.get('origin')}/dashboard`,
        'customer_email': user.email!,
        'metadata[user_id]': user.id,
        'metadata[business_id]': business.id,
        'metadata[block_names]': JSON.stringify(blockNames),
        ...paidBlocks.reduce((acc, block, idx) => {
          acc[`line_items[${idx}][price_data][currency]`] = 'usd';
          acc[`line_items[${idx}][price_data][unit_amount]`] = block.price_cents.toString();
          acc[`line_items[${idx}][price_data][product_data][name]`] = block.block_name;
          acc[`line_items[${idx}][quantity]`] = '1';
          return acc;
        }, {} as Record<string, string>),
      }),
    });

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error('Stripe error:', session);
      return new Response(JSON.stringify({ error: 'Stripe error', details: session }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update business with session ID and total cost
    await supabase
      .from('user_businesses')
      .update({
        stripe_session_id: session.id,
        total_cost_cents: totalCents,
        payment_status: 'pending'
      })
      .eq('id', business.id);

    return new Response(JSON.stringify({ sessionUrl: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
