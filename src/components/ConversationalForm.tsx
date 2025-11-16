import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface BusinessIdea {
  id: string;
  category: string;
  name: string;
  description: string;
  starter_blocks: string;
  growth_blocks: string;
}

interface ConversationalFormProps {
  onComplete: (data: {
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: BusinessIdea;
  }) => void;
}

export const ConversationalForm = ({ onComplete }: ConversationalFormProps) => {
  const [step, setStep] = useState(1);
  const [hasIdea, setHasIdea] = useState<boolean | null>(null);
  const [businessIdea, setBusinessIdea] = useState("");

  const handleSubmitIdea = () => {
    if (!businessIdea.trim()) return;
    
    onComplete({
      businessIdea,
      aiAnalysis: businessIdea,
    });
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Ready to start or build your business?
              </h2>
              <p className="text-xl text-muted-foreground">
                Tell us a little bit about your idea
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setHasIdea(true);
                  setStep(2);
                }}
                className="group px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                Yes, I have an idea
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && hasIdea && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                What business do you want to start?
              </h2>
              <p className="text-lg text-muted-foreground">
                Describe your idea in 1–2 sentences
              </p>
            </div>

            <div className="space-y-4">
              <Textarea
                value={businessIdea}
                onChange={(e) => setBusinessIdea(e.target.value)}
                placeholder="e.g., I want to start a dog walking business in my neighborhood"
                className="min-h-[120px] text-lg"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleSubmitIdea}
                  disabled={!businessIdea.trim()}
                  className="group flex-1 px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-5 h-5" />
                  Continue
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
