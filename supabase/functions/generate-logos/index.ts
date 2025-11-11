import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { business_name, business_idea, user_feedback } = await req.json();

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

    // Check generation limit
    const { count } = await supabase
      .from('logo_generation_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    if (count !== null && count >= 2 && business.status !== 'launched') {
      return new Response(
        JSON.stringify({
          error: 'generation_limit',
          message: 'Launch your business to unlock unlimited logo generations',
          generations_used: count,
          generations_allowed: 2,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generationNumber = (count || 0) + 1;

    // Construct AI prompt
    let prompt = '';
    if (user_feedback) {
      prompt = `Create a professional logo for "${business_name}", a ${business_idea} business. User requested: ${user_feedback}. Output as PNG with transparent background. The logo should be clean, modern, and memorable.`;
    } else {
      prompt = `Create a professional logo for "${business_name}", a ${business_idea} business. Style should be clean, modern, and memorable. Output as PNG with transparent background.`;
    }

    console.log('Generating logo with prompt:', prompt);

    // Generate 6 logos
    const logos = [];
    for (let i = 0; i < 6; i++) {
      console.log(`Generating logo ${i + 1}/6...`);
      
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-image-1",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          modalities: ["image", "text"],
          output_format: "png",
          background: "transparent",
          size: "1024x1024"
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`AI gateway error for logo ${i + 1}:`, response.status, errorText);
        
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (response.status === 402) {
          return new Response(JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        throw new Error(`AI gateway error: ${errorText}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        console.error('No image URL in response:', data);
        throw new Error('No image generated');
      }

      // Extract base64 data
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Upload to storage
      const sessionId = crypto.randomUUID();
      const fileName = `${user.id}/logos/${sessionId}/${i + 1}.png`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(fileName, buffer, {
          contentType: 'image/png',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      logos.push({
        file_url: publicUrl,
        thumbnail_url: publicUrl,
        logo_number: i + 1
      });

      console.log(`Logo ${i + 1}/6 generated successfully`);
    }

    // Create session record
    const { data: session, error: sessionError } = await supabase
      .from('logo_generation_sessions')
      .insert({
        user_id: user.id,
        business_id: business.id,
        generation_number: generationNumber,
        user_feedback: user_feedback || null,
        ai_prompt: prompt,
        logo_urls: logos.map(l => l.file_url)
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    // Insert asset records
    const assetInserts = logos.map(logo => ({
      user_id: user.id,
      business_id: business.id,
      asset_type: 'logo',
      file_url: logo.file_url,
      thumbnail_url: logo.thumbnail_url,
      status: 'generated',
      metadata: {
        session_id: session.id,
        generation_number: generationNumber,
        logo_number: logo.logo_number
      }
    }));

    const { error: assetsError } = await supabase
      .from('user_assets')
      .insert(assetInserts);

    if (assetsError) {
      console.error('Assets creation error:', assetsError);
      throw assetsError;
    }

    console.log('All logos generated and saved successfully');

    return new Response(
      JSON.stringify({
        session_id: session.id,
        logos,
        generation_number: generationNumber
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-logos function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});