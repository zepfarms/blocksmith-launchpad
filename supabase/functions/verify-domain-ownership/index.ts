import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyDomainRequest {
  websiteId: string;
  domainName: string;
  action: 'generate' | 'verify';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { websiteId, domainName, action }: VerifyDomainRequest = await req.json();
    console.log(`Domain verification ${action} for:`, domainName);

    // Verify user owns this website
    const { data: website, error: websiteError } = await supabase
      .from('user_websites')
      .select('*')
      .eq('id', websiteId)
      .eq('user_id', user.id)
      .single();

    if (websiteError || !website) {
      return new Response(
        JSON.stringify({ error: 'Website not found or access denied' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'generate') {
      // Generate a unique verification token
      const verificationToken = `acari-verify-${crypto.randomUUID()}`;
      
      // Store in database
      const { error: updateError } = await supabase
        .from('user_websites')
        .update({
          customization_data: {
            ...website.customization_data,
            verification_token: verificationToken,
          },
        })
        .eq('id', websiteId);

      if (updateError) {
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          txtRecord: {
            name: '_acari-verification',
            type: 'TXT',
            value: verificationToken,
          },
          instructions: `Add this TXT record to your domain's DNS settings:\n\nName: _acari-verification.${domainName}\nType: TXT\nValue: ${verificationToken}`,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'verify') {
      const verificationToken = website.customization_data?.verification_token;
      
      if (!verificationToken) {
        return new Response(
          JSON.stringify({ error: 'No verification token found. Please generate one first.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Query DNS for TXT record
      const dnsResponse = await fetch(
        `https://cloudflare-dns.com/dns-query?name=_acari-verification.${domainName}&type=TXT`,
        {
          headers: {
            'Accept': 'application/dns-json',
          },
        }
      );

      const dnsData = await dnsResponse.json();
      console.log('DNS verification response:', dnsData);

      const txtRecords = dnsData.Answer?.filter((record: any) => record.type === 16) || [];
      const verified = txtRecords.some((record: any) => 
        record.data?.includes(verificationToken)
      );

      if (verified) {
        // Update website as verified
        const { error: updateError } = await supabase
          .from('user_websites')
          .update({
            domain_verified: true,
            status: 'verified',
          })
          .eq('id', websiteId);

        if (updateError) {
          throw updateError;
        }

        return new Response(
          JSON.stringify({
            success: true,
            verified: true,
            message: 'Domain ownership verified successfully!',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: false,
          verified: false,
          message: 'Verification TXT record not found. Please ensure you\'ve added the record and wait a few minutes for DNS propagation.',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in verify-domain-ownership:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
