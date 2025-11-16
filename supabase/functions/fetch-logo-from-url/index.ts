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
    const { companyUrl } = await req.json();
    
    if (!companyUrl) {
      return new Response(
        JSON.stringify({ error: 'Company URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract domain from URL
    let domain = companyUrl;
    try {
      const url = new URL(companyUrl.startsWith('http') ? companyUrl : `https://${companyUrl}`);
      domain = url.hostname.replace('www.', '');
    } catch (e) {
      console.error('Invalid URL:', e);
    }

    console.log(`Fetching logo for domain: ${domain}`);

    // Try multiple logo sources
    const logoSources = [
      `https://logo.clearbit.com/${domain}`,
      `https://img.logo.dev/${domain}?token=pk_X-1ZO13CQ8y5vN8bwKNgbA`, // Logo.dev free tier
      `https://unavatar.io/${domain}`,
    ];

    let logoUrl = null;

    // Try each source until we find a working one
    for (const source of logoSources) {
      try {
        const response = await fetch(source, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          logoUrl = source;
          console.log(`Found logo at: ${source}`);
          break;
        }
      } catch (err) {
        const error = err as Error;
        console.log(`Failed to fetch from ${source}:`, error.message);
        continue;
      }
    }

    if (!logoUrl) {
      // Fallback: use domain favicon
      logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      console.log(`Using favicon fallback: ${logoUrl}`);
    }

    return new Response(
      JSON.stringify({ 
        logoUrl,
        domain,
        source: logoUrl.includes('clearbit') ? 'clearbit' : 
                logoUrl.includes('logo.dev') ? 'logo.dev' :
                logoUrl.includes('unavatar') ? 'unavatar' : 'favicon'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching logo:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});