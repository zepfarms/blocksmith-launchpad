import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateContentRequest {
  businessDescription: string;
  industry: string;
  businessName: string;
  templateId?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { businessDescription, industry, businessName, templateId = 'local-business' }: GenerateContentRequest = await req.json();
    console.log('Generating website content for:', businessName, 'with template:', templateId);

    // Template-specific styling guidance
    const templatePrompts: Record<string, string> = {
      'local-business': 'Focus on emergency services, trust, and local expertise. Emphasize quick response and reliability. Use action-oriented language.',
      'professional-services': 'Use sophisticated language. Highlight credentials, expertise, and professionalism. Focus on results and client success.',
      'restaurant': 'Make it appetizing! Focus on food quality, ambiance, and dining experience. Use sensory language and create excitement.',
      'salon-spa': 'Emphasize relaxation, luxury, and transformation. Use elegant, soothing language. Focus on the experience and results.',
      'medical': 'Professional and trustworthy tone. Emphasize patient care, expertise, and modern facilities. Use reassuring language.',
      'retail': 'Create excitement about products. Focus on quality, selection, and customer satisfaction. Use engaging, persuasive language.',
      'fitness': 'Energetic and motivational tone. Focus on transformation, results, and community. Use action verbs and inspiring language.',
      'real-estate': 'Professional and knowledgeable. Focus on finding the perfect home, expertise in the market, and personalized service.',
      'automotive': 'Trustworthy and expert. Emphasize quality service, fair pricing, and customer satisfaction. Use confident language.',
      'creative': 'Showcase creativity and unique vision. Focus on bringing ideas to life, attention to detail, and artistic excellence.'
    };

    const styleGuide = templatePrompts[templateId] || templatePrompts['local-business'];

    // Use Lovable AI to generate content
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `Generate professional website content for this business:

Business Name: ${businessName}
Industry: ${industry}
Description: ${businessDescription}
Template Style: ${templateId}

Style Guidelines: ${styleGuide}

Please generate:
1. A compelling tagline (5-8 words)
2. Hero headline (10-15 words)
3. Hero subheadline (20-30 words)
4. About section (150-200 words)
5. List of 4-5 key services/products with short descriptions (20-30 words each)
6. Contact call-to-action text (5-10 words)
7. SEO meta description (150-160 characters)

Format as JSON with keys: tagline, heroHeadline, heroSubheadline, aboutText, services (array of {name, description}), ctaText, metaDescription`;

    const aiResponse = await fetch('https://api.lovable.app/v1/ai/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json();
      console.error('Lovable AI error:', errorData);
      throw new Error('Failed to generate content with AI');
    }

    const aiData = await aiResponse.json();
    const content = JSON.parse(aiData.choices[0].message.content);

    console.log('Generated content successfully');

    return new Response(
      JSON.stringify({
        success: true,
        content: {
          tagline: content.tagline,
          heroHeadline: content.heroHeadline,
          heroSubheadline: content.heroSubheadline,
          aboutText: content.aboutText,
          services: content.services || [],
          ctaText: content.ctaText,
          metaDescription: content.metaDescription,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-website-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
