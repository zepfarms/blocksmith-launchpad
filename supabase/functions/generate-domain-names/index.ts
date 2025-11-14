import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractDomains(rawContent: string): string[] {
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
    const { businessName } = await req.json();

    if (!businessName) {
      return new Response(
        JSON.stringify({ error: 'Business name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-lite',
        messages: [
          {
            role: 'system',
            content: `You are a domain name expert. Generate EXACTLY 15 creative, brandable domain names.

STRICT GUIDELINES:
- Generate EXACTLY 15 unique domain names
- Keep domains SHORT (8-20 characters before TLD)
- Use common TLDs (.com, .co, .io, .net)
- Make them memorable and easy to spell
- Mix styles: exact match, abbreviated, creative variations
- NO hyphens or numbers
- Include the business name or creative variations
- Each should be brandable and professional

OUTPUT FORMAT:
Return ONLY a valid JSON array of exactly 15 strings with TLDs included. NO MARKDOWN, NO BACKTICKS, NO CODE FENCES - just the raw JSON array.

Example: ["businessname.com", "getbusinessname.co", "businessname.io", "trybusinessname.com"]`
          },
          {
            role: 'user',
            content: `Generate 15 domain names for business: ${businessName}`
          }
        ]
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
    let domains = extractDomains(content)
      .filter(v => typeof v === 'string')
      .map(s => s.trim())
      .filter(Boolean);
    
    // Deduplicate and ensure exactly 15 domains
    domains = [...new Set(domains)].slice(0, 15);

    if (domains.length < 5) {
      console.error('Parse failed. Content preview:', content.substring(0, 300));
      throw new Error('Invalid AI response format');
    }

    return new Response(
      JSON.stringify({ domains }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in generate-domain-names:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
