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
    const { businessName, industry } = await req.json();

    if (!businessName) {
      return new Response(
        JSON.stringify({ error: 'Business name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const businessContext = industry ? `${businessName} (${industry})` : businessName;

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
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a domain name expert specializing in creating SHORT, MEMORABLE, BRANDABLE domain names.

CRITICAL RULES:
- Generate EXACTLY 9 domain names (not 15)
- Keep domains VERY SHORT (6-15 characters before TLD)
- Make them EASY TO SPELL and MEMORABLE
- Focus on CREATIVITY and BRANDABILITY
- Use industry-relevant keywords when appropriate
- NO hyphens, NO numbers, NO confusing spellings
- Mix of exact match, creative variations, and industry terms
- Use popular TLDs: .com, .co, .io, .net
- Each domain should sound professional and trustworthy

STYLE MIX:
- 3 exact/close match domains
- 3 creative/brandable variations  
- 3 industry-specific combinations

OUTPUT FORMAT:
Return ONLY a valid JSON array of exactly 9 domain name strings. 
NO MARKDOWN, NO BACKTICKS, NO EXPLANATION - just the raw JSON array.
Example: ["quickauto.com","automax.co","fixmyride.io"]`
          },
          {
            role: 'user',
            content: `Generate 9 SHORT, MEMORABLE domain names for: ${businessContext}`
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
