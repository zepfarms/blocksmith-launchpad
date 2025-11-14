import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractNames(rawContent: string): string[] {
  let content = (rawContent || '').trim();
  
  // Strip markdown code fences
  content = content.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  
  // Try direct JSON parse
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  
  // Try to extract first JSON array with regex
  const match = content.match(/\[[\s\S]*?\]/);
  if (match) {
    try {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  
  // Fallback: split by newlines/commas and clean
  return content
    .split(/[\n,]/)
    .map(s => s.replace(/^[-*\d.\s"'`]+/, '').replace(/["'`]+$/g, '').trim())
    .filter(Boolean);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessDescription } = await req.json();

    if (!businessDescription?.trim()) {
      throw new Error('Business description is required');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
Return ONLY a valid JSON array of exactly 20 strings. NO MARKDOWN, NO BACKTICKS, NO CODE FENCES - just the raw JSON array.

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
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required, please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'AI generation failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiResult = await response.json();
    const content = aiResult.choices[0].message.content;
    
    // Parse the JSON array from AI response with robust parsing
    let names = extractNames(content)
      .filter(v => typeof v === 'string')
      .map(s => s.trim())
      .filter(Boolean);
    
    // Deduplicate and ensure exactly 20 names
    names = [...new Set(names)].slice(0, 20);

    if (names.length < 5) {
      console.error('Parse failed. Content preview:', content.substring(0, 300));
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
