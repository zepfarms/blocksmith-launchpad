import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessDescription } = await req.json();

    if (!businessDescription?.trim()) {
      throw new Error('Business description is required');
    }

    const response = await fetch('https://api.lovable.app/ai/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are a creative business naming expert. Generate exactly 20 catchy, memorable, and professional business names.

STRICT GUIDELINES:
- Generate EXACTLY 20 unique names
- Keep names SHORT (2-4 words maximum)
- Make them easy to spell and pronounce
- Incorporate location if mentioned in description
- Mix styles: playful, professional, descriptive, modern
- Avoid generic names (avoid "Best", "Quality", "Pro")
- Make them brandable (could see it on a storefront sign)
- NO special characters, numbers, or hyphens
- Each name should be distinctly different

OUTPUT FORMAT:
Return ONLY a valid JSON array of exactly 20 strings. No explanation, no markdown, just the array.

Example: ["Creative Name 1", "Creative Name 2", "Creative Name 20"]`
          },
          {
            role: 'user',
            content: `Generate 20 business names for: ${businessDescription}`
          }
        ],
        temperature: 0.9,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('AI generation failed');
    }

    const aiResult = await response.json();
    const content = aiResult.choices[0].message.content;
    
    // Parse the JSON array from AI response
    const names = JSON.parse(content);

    if (!Array.isArray(names) || names.length !== 20) {
      throw new Error('Invalid AI response format');
    }

    console.log(`Generated ${names.length} business names for: ${businessDescription}`);

    return new Response(
      JSON.stringify({ names }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating business names:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
