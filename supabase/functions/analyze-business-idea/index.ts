import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Analyzing business idea...');

    const systemPrompt = `You are a thoughtful business advisor analyzing someone's business idea or situation. 

Your job is to:
1. Understand what they want to accomplish
2. Identify if they're starting new or growing existing
3. Recognize their main goals and challenges
4. Summarize back in a warm, encouraging way

Format your response naturally, as if talking to a friend:
- Start with "It looks like..." or "I understand you want to..." 
- Be specific about what they're building/improving
- Mention 1-2 key things they'll need help with
- Keep it conversational and encouraging
- Maximum 3 sentences

Examples:
- "It looks like you want to start a dog walking business in your local area. You'll need help getting your first customers and setting up a way for people to book and pay you online."
- "I understand you have an existing dog walking business and want to grow your customer base. You'll benefit from a professional website, marketing help, and maybe some automation for bookings."
- "It sounds like you want to launch an online store selling handmade products. You'll need help with your website, product photos, payment setup, and marketing to get your first sales."

Keep it human, warm, and actionable.`;

    const userPrompt = `Business idea: ${idea}`;

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

    console.log('Analysis complete:', analysis);

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
