import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

export const DescribeIdea = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const [businessIdea, setBusinessIdea] = useState(data.businessIdea);

  const handleSubmitIdea = () => {
    if (!businessIdea.trim()) return;
    
    updateData({
      businessIdea,
      aiAnalysis: businessIdea,
    });

    navigate("/start/confirm");
  };

  return (
    <section className="relative flex flex-col px-4 sm:px-6 bg-background py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in w-full">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {data.businessType === 'existing' 
              ? 'Tell us about your business' 
              : 'Great! Tell us about your idea'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {data.businessType === 'existing'
              ? 'Tell us about what type of business you have in one to two sentences.'
              : 'Tell me what kind of business you want to start in one to two sentences.'}
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            value={businessIdea}
            onChange={(e) => setBusinessIdea(e.target.value)}
            placeholder={data.businessType === 'existing'
              ? 'e.g., I own a dog walking business in Austin, Texas'
              : 'e.g., I want to start a dog walking business in my neighborhood'}
            className="min-h-[120px] text-lg"
            autoFocus
          />

          <div className="flex flex-col gap-3">
            <div className="w-full flex justify-center">
              <button
                onClick={handleSubmitIdea}
                disabled={!businessIdea.trim()}
                className="group px-8 sm:px-10 py-4 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                Continue
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
