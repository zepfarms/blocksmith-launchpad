import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DomainAvailabilityRequest {
  domainName: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { domainName }: DomainAvailabilityRequest = await req.json();
    console.log('Checking domain availability:', domainName);

    if (!domainName || !domainName.includes('.')) {
      return new Response(
        JSON.stringify({ error: 'Invalid domain name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const CLOUDFLARE_API_KEY = Deno.env.get('CLOUDFLARE_API_KEY');
    const CLOUDFLARE_ACCOUNT_ID = Deno.env.get('CLOUDFLARE_ACCOUNT_ID');

    if (!CLOUDFLARE_API_KEY || !CLOUDFLARE_ACCOUNT_ID) {
      console.error('Missing Cloudflare credentials');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check domain availability using Cloudflare Registrar API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/registrar/domains/${domainName}/availability`,
      {
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    console.log('Cloudflare API response:', data);

    if (!response.ok) {
      console.error('Cloudflare API error:', data);
      
      // For authentication errors, return a mock response so users can still test
      if (data.errors?.some((e: any) => e.code === 10001)) {
        console.warn('Cloudflare auth failed - returning mock availability check');
        return new Response(
          JSON.stringify({
            available: Math.random() > 0.5, // Random for testing
            price: 1000, // $10.00
            domainName,
            alternatives: [
              `get${domainName.split('.')[0]}.com`,
              `${domainName.split('.')[0]}hq.com`,
              `${domainName.split('.')[0]}.co`,
            ].slice(0, 3),
            mock: true, // Indicate this is a mock response
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Failed to check domain availability', details: data }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate alternative suggestions if domain is taken
    const alternatives: string[] = [];
    if (!data.result?.available) {
      const baseName = domainName.split('.')[0];
      const tld = domainName.split('.').slice(1).join('.');
      
      alternatives.push(`${baseName}-site.${tld}`);
      alternatives.push(`get${baseName}.${tld}`);
      alternatives.push(`${baseName}hq.${tld}`);
      
      // Try different TLDs
      if (tld === 'com') {
        alternatives.push(`${baseName}.net`);
        alternatives.push(`${baseName}.co`);
      }
    }

    return new Response(
      JSON.stringify({
        available: data.result?.available || false,
        price: data.result?.price || 915, // Default $9.15 for .com
        domainName,
        alternatives: alternatives.filter((_, i) => i < 3), // Limit to 3 suggestions
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-domain-availability:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
