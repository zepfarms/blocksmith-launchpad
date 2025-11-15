import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.0";

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
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { questionnaireData, businessId } = await req.json();

    const systemPrompt = `You are a professional business plan consultant with 20+ years of experience writing SBA-quality business plans. 

Generate a comprehensive, professional business plan that could be used for bank loan applications, investor presentations, grant applications, and strategic planning.

Requirements:
- Professional tone, third-person perspective where appropriate
- Data-driven with specific numbers and realistic projections
- Industry-standard formatting
- Realistic financial projections based on provided data
- Actionable strategies and clear milestones
- Professional language suitable for formal submission

Return the plan as structured JSON with the following sections:
{
  "executiveSummary": "2-3 paragraphs summarizing the entire plan",
  "companyDescription": {
    "overview": "Company overview paragraph",
    "missionStatement": "Mission statement",
    "visionStatement": "Vision statement",
    "legalStructure": "Legal structure details",
    "location": "Location information"
  },
  "marketAnalysis": {
    "industryOverview": "Industry overview paragraph",
    "targetMarket": "Target market description",
    "customerDemographics": "Customer demographics details",
    "marketSize": "Market size analysis",
    "competitiveAnalysis": "Competitive landscape analysis",
    "competitiveAdvantage": "Your competitive advantages"
  },
  "organizationManagement": {
    "organizationalStructure": "Structure description",
    "managementTeam": "Management team details",
    "rolesResponsibilities": "Key roles and responsibilities"
  },
  "productsServices": {
    "overview": "Products/services overview",
    "detailedDescriptions": "Detailed descriptions",
    "uniqueValueProposition": "UVP details",
    "pricingStrategy": "Pricing strategy"
  },
  "marketingSales": {
    "marketingStrategy": "Marketing strategy details",
    "salesStrategy": "Sales strategy details",
    "customerAcquisition": "Customer acquisition plan",
    "brandingApproach": "Branding approach"
  },
  "financialProjections": {
    "startupCosts": "Startup costs breakdown",
    "revenueProjections": "3-year revenue projections with specifics",
    "breakEvenAnalysis": "Break-even analysis",
    "fundingRequirements": "Funding needs and use of funds"
  }
}`;

    const userPrompt = `Generate a professional business plan for:

Business Name: ${questionnaireData.businessName}
Business Idea: ${questionnaireData.businessIdea}
Legal Structure: ${questionnaireData.legalStructure || 'Not specified'}
Location: ${questionnaireData.location || 'Not specified'}
Mission Statement: ${questionnaireData.missionStatement || 'To be determined'}
Vision Statement: ${questionnaireData.visionStatement || 'To be determined'}

Target Market: ${questionnaireData.targetMarket || 'General consumers'}
Market Size: ${questionnaireData.marketSize || 'Growing market'}
Competitive Advantage: ${questionnaireData.competitiveAdvantage || 'Unique value proposition'}

Products/Services: ${JSON.stringify(questionnaireData.productsServices || [])}
Unique Value Proposition: ${questionnaireData.uniqueValueProposition || 'Innovative solution'}

Founders/Team: ${JSON.stringify(questionnaireData.founders || [])}

Startup Costs: ${questionnaireData.startupCosts || '$50,000'}
Funding Needed: ${questionnaireData.fundingNeeded || '$100,000'}
Year 1 Revenue Target: ${questionnaireData.year1Revenue || '$250,000'}
Year 2 Revenue Target: ${questionnaireData.year2Revenue || '$500,000'}
Year 3 Revenue Target: ${questionnaireData.year3Revenue || '$1,000,000'}

Marketing Channels: ${JSON.stringify(questionnaireData.marketingChannels || [])}
Sales Strategy: ${questionnaireData.salesStrategy || 'Direct sales'}

Please generate a comprehensive, realistic, and professional business plan.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('AI generation failed');
    }

    const aiData = await aiResponse.json();
    const generatedContent = JSON.parse(aiData.choices[0].message.content);

    // Save to database
    const { data: plan, error: planError } = await supabase
      .from('business_plans')
      .insert({
        user_id: user.id,
        business_id: businessId,
        questionnaire_data: questionnaireData,
        generated_content: generatedContent,
        status: 'draft'
      })
      .select()
      .single();

    if (planError) {
      console.error('Database error:', planError);
      throw planError;
    }

    return new Response(
      JSON.stringify({ plan, generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
