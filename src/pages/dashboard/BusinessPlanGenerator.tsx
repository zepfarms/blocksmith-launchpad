import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Sparkles, Download } from "lucide-react";
import { QuestionnaireStep } from "@/components/business-plan/QuestionnaireStep";
import { GenerationProgress } from "@/components/business-plan/GenerationProgress";
import { PlanReviewEditor } from "@/components/business-plan/PlanReviewEditor";
import { generatePDF } from "@/components/business-plan/PDFExporter";

type Step = 'intro' | 'questionnaire' | 'generating' | 'review';

export default function BusinessPlanGenerator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('intro');
  const [business, setBusiness] = useState<any>(null);
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [planId, setPlanId] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const [generationSections, setGenerationSections] = useState<Array<{
    name: string;
    status: 'pending' | 'generating' | 'complete';
  }>>([
    { name: 'Executive Summary', status: 'pending' },
    { name: 'Company Description', status: 'pending' },
    { name: 'Market Analysis', status: 'pending' },
    { name: 'Organization & Management', status: 'pending' },
    { name: 'Products & Services', status: 'pending' },
    { name: 'Marketing & Sales', status: 'pending' },
    { name: 'Financial Projections', status: 'pending' },
  ]);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }

    const { data, error } = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error loading business:', error);
      toast.error("Failed to load business information");
      return;
    }

    setBusiness(data);
  };

  const handleQuestionnaireComplete = async (questionnaireData: any) => {
    setCurrentStep('generating');
    setIsGenerating(true);

    // Simulate section generation progress
    const updateProgress = async () => {
      for (let i = 0; i < generationSections.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationSections(prev => 
          prev.map((section, index) => 
            index === i ? { ...section, status: 'generating' as const } : section
          )
        );
        await new Promise(resolve => setTimeout(resolve, 800));
        setGenerationSections(prev => 
          prev.map((section, index) => 
            index === i ? { ...section, status: 'complete' as const } : section
          )
        );
      }
    };

    updateProgress();

    try {
      const { data, error } = await supabase.functions.invoke('generate-business-plan', {
        body: {
          questionnaireData: {
            ...questionnaireData,
            businessName: business?.business_name || questionnaireData.businessName,
            businessIdea: business?.business_idea || questionnaireData.businessIdea,
          },
          businessId: business?.id
        }
      });

      if (error) throw error;

      setGeneratedPlan(data.generatedContent);
      setPlanId(data.plan.id);
      setCurrentStep('review');
      toast.success("Business plan generated successfully!");
    } catch (error: any) {
      console.error('Error generating plan:', error);
      if (error.message?.includes('Rate limit')) {
        toast.error("Rate limit exceeded. Please try again in a moment.");
      } else {
        toast.error("Failed to generate business plan. Please try again.");
      }
      setCurrentStep('questionnaire');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfBlob = generatePDF(generatedPlan, business?.business_name || 'Business Plan');
      
      // Upload to Supabase Storage
      const fileName = `business-plan-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(`${business?.user_id}/${fileName}`, pdfBlob);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('business-assets')
        .getPublicUrl(uploadData.path);

      // Save to user_assets
      await supabase.from('user_assets').insert({
        user_id: business?.user_id,
        business_id: business?.id,
        asset_type: 'business_plan',
        file_url: urlData.publicUrl,
        metadata: {
          plan_id: planId,
          generated_at: new Date().toISOString()
        }
      });

      // Mark block as completed
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('user_block_unlocks')
          .update({ completion_status: 'completed' })
          .eq('user_id', user.id)
          .eq('block_name', 'Business Plan Generator');
      }

      toast.success("Business plan downloaded and saved to briefcase!");
    } catch (error) {
      console.error('Error saving PDF:', error);
      toast.error("Failed to save PDF. Download completed.");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-acari-green/10 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-acari-green" />
                </div>
              </div>
              <CardTitle className="text-3xl">Business Plan Generator</CardTitle>
              <CardDescription className="text-lg">
                Generate a Professional Business Plan in Minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-acari-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-acari-green text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">SBA-Quality Format</p>
                    <p className="text-sm text-muted-foreground">Professional format suitable for bank loans and grant applications</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-acari-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-acari-green text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Investor-Ready</p>
                    <p className="text-sm text-muted-foreground">Comprehensive analysis and financial projections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-acari-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-acari-green text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Downloadable PDF</p>
                    <p className="text-sm text-muted-foreground">Professional PDF with cover page and table of contents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-acari-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-acari-green text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Editable & Customizable</p>
                    <p className="text-sm text-muted-foreground">Review and edit every section before downloading</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => setCurrentStep('questionnaire')} 
                  className="w-full bg-acari-green hover:bg-acari-green/90"
                  size="lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start New Business Plan
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'questionnaire':
        return (
          <QuestionnaireStep
            initialData={{
              businessName: business?.business_name,
              businessIdea: business?.business_idea
            }}
            onComplete={handleQuestionnaireComplete}
            onBack={() => setCurrentStep('intro')}
          />
        );

      case 'generating':
        return <GenerationProgress sections={generationSections} />;

      case 'review':
        return (
          <PlanReviewEditor
            plan={generatedPlan}
            planId={planId}
            businessName={business?.business_name || 'Your Business'}
            onDownloadPDF={handleDownloadPDF}
            onSave={(editedPlan) => setGeneratedPlan(editedPlan)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {renderStep()}
    </div>
  );
}
