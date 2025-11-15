import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteId, prompt } = await req.json();

    if (!websiteId || !prompt) {
      throw new Error('Missing required fields');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const { createClient } = await import('jsr:@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user is admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) {
      throw new Error('Admin access required');
    }

    // Get current website content
    const { data: website, error: websiteError } = await supabase
      .from('user_websites')
      .select('site_content')
      .eq('id', websiteId)
      .single();

    if (websiteError) throw websiteError;

    // Call Lovable AI to generate updated content
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a website content editor AI. You will be given the current website content and instructions for changes.
Return ONLY a JSON object with the updated content fields. Do not include any markdown formatting or explanations.

Current content:
${JSON.stringify(website.site_content, null, 2)}

Return the updated content as a JSON object with these fields:
{
  "heroTitle": "string",
  "heroSubtitle": "string",
  "aboutText": "string",
  "servicesText": "string",
  "contactEmail": "string",
  "contactPhone": "string"
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "update_website_content",
              description: "Update website content fields",
              parameters: {
                type: "object",
                properties: {
                  heroTitle: { type: "string" },
                  heroSubtitle: { type: "string" },
                  aboutText: { type: "string" },
                  servicesText: { type: "string" },
                  contactEmail: { type: "string" },
                  contactPhone: { type: "string" }
                },
                required: ["heroTitle", "heroSubtitle", "aboutText", "servicesText", "contactEmail", "contactPhone"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "update_website_content" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const updatedContent = JSON.parse(aiData.choices[0].message.tool_calls[0].function.arguments);

    // Update website with new content
    const { error: updateError } = await supabase
      .from('user_websites')
      .update({
        site_content: updatedContent,
        edited_by_admin: true,
        last_admin_edit_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', websiteId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        updatedContent,
        message: 'Content updated successfully via AI'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in admin-ai-website-edit:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});