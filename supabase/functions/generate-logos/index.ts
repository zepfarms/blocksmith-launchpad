import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const requestSchema = z.object({
  business_name: z.string().trim().min(1).max(100),
  business_idea: z.string().trim().min(5).max(500),
  user_feedback: z.string().trim().max(500).optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: authData, error: authError } = await supabase.auth.getUser(
      authorization.replace('Bearer ', '')
    );

    if (authError || !authData.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authData.user.id;
    const body = await req.json();
    const { business_name, business_idea, user_feedback } = requestSchema.parse(body);

    const { data: businessData, error: businessError } = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', userId);

    if (businessError || !businessData || businessData.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Business not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: sessionData } = await supabase
      .from('logo_generation_sessions')
      .select('id')
      .eq('user_id', userId);

    const sessionCount = sessionData?.length || 0;

    if (businessData[0].status !== 'launched' && sessionCount >= 2) {
      return new Response(
        JSON.stringify({
          error: 'generation_limit',
          message: 'Free generation limit reached',
          generations_used: sessionCount,
          generations_allowed: 2,
        }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const generationNumber = sessionCount + 1;

    let prompt = `Create a modern, professional logo for "${business_name}" - ${business_idea}. 
Style: Clean, minimal, memorable. PNG with transparent background. No text in the logo.`;

    if (user_feedback) {
      prompt = `${prompt}\n\nUser feedback for refinement: ${user_feedback}`;
    }

    const logos = [];
    for (let i = 0; i < 6; i++) {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
            {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
            {
              status: 402,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
        throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        throw new Error('No image generated');
      }

      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const imageData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      const sessionId = crypto.randomUUID();
      const fileName = `${userId}/logos/${sessionId}/${i + 1}.png`;

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(fileName, imageData, {
          contentType: 'image/png',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(fileName);

      logos.push({
        file_url: publicUrl,
        thumbnail_url: publicUrl,
        logo_number: i + 1
      });
    }

    const { data: session, error: sessionError } = await supabase
      .from('logo_generation_sessions')
      .insert({
        user_id: userId,
        business_id: businessData[0].id,
        prompt,
        user_feedback: user_feedback || null,
      })
      .select()
      .single();

    if (sessionError) {
      throw sessionError;
    }

    const assetInserts = logos.map(logo => ({
      user_id: userId,
      business_id: businessData[0].id,
      asset_type: 'logo',
      file_url: logo.file_url,
      thumbnail_url: logo.thumbnail_url,
      status: 'generated',
      metadata: {
        logo_number: logo.logo_number,
        session_id: session.id,
        generation_number: generationNumber,
      },
    }));

    const { error: assetsError } = await supabase
      .from('user_assets')
      .insert(assetInserts);

    if (assetsError) {
      throw assetsError;
    }

    return new Response(
      JSON.stringify({
        session_id: session.id,
        logos,
        generation_number: generationNumber,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
