import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const requestSchema = z.object({
  businessIdea: z.string().trim().min(5).max(500)
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { businessIdea } = requestSchema.parse(body);
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    

    const systemPrompt = `You are an enthusiastic business advisor who gets excited about people's business ideas! 

Your job is to:
1. Identify what type of business they want to start (e.g., Dog Walking, Lawn Care, Photography, etc.)
2. Respond with genuine excitement and encouragement
3. Make it feel personalized and specific to THEIR idea

CRITICAL RULES:
- Start with "Got it! I understand you want to start a [Business Type], that's really exciting!"
- Use the EXACT business type from their description (Dog Walking Business, Lawn Care Company, etc.)
- Add ONE enthusiastic sentence about getting them started
- Keep it to 2 sentences maximum
- Sound genuinely excited for them!

Examples:
Input: "I want to start a dog walking business"
Output: "Got it! I understand you want to start a Dog Walking Business, that's really exciting! Based on that I can recommend some things to get your new Dog Walking business off the ground."

Input: "lawn mowing company in my neighborhood"  
Output: "Got it! I understand you want to start a Lawn Care Business, that's really exciting! Based on that I can recommend some things to get your new Lawn Care business off the ground."

Input: "photography business for weddings"
Output: "Got it! I understand you want to start a Wedding Photography Business, that's really exciting! Based on that I can recommend some things to get your new Wedding Photography business off the ground."

BE EXCITED! BE SPECIFIC! USE THEIR EXACT IDEA!`;

    const userPrompt = `Business idea: ${businessIdea}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
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
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in analyze-business-idea function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
