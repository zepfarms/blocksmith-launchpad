import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.81.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { blockId } = await req.json();
    
    if (!blockId) {
      return new Response(
        JSON.stringify({ error: 'Block ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the block details
    const { data: block, error: blockError } = await supabase
      .from('affiliate_blocks')
      .select('id, name, affiliate_link, click_count')
      .eq('id', blockId)
      .single();

    if (blockError || !block) {
      console.error('Block fetch error:', blockError);
      return new Response(
        JSON.stringify({ error: 'Block not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user info if authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Extract request metadata
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const referrer = req.headers.get('referer') || 'direct';

    // Insert click record
    const { error: clickError } = await supabase
      .from('affiliate_clicks')
      .insert({
        block_id: blockId,
        user_id: userId,
        ip_address: ip,
        user_agent: userAgent,
        referrer: referrer,
      });

    if (clickError) {
      console.error('Click insert error:', clickError);
    }

    // Increment click counter
    const { error: updateError } = await supabase
      .from('affiliate_blocks')
      .update({ click_count: (block.click_count || 0) + 1 })
      .eq('id', blockId);

    if (updateError) {
      console.error('Click count update error:', updateError);
    }

    console.log(`Click tracked: ${block.name} (ID: ${blockId}) by user: ${userId || 'anonymous'}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        affiliateLink: block.affiliate_link,
        clickCount: (block.click_count || 0) + 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error tracking click:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});