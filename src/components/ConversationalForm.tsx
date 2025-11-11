import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles, Loader2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ConversationalFormProps {
  onComplete: (data: {
    businessIdea: string;
    aiAnalysis: string;
    experienceLevel?: string;
    additionalContext?: string;
  }) => void;
}

export const ConversationalForm = ({ onComplete }: ConversationalFormProps) => {
  const [step, setStep] = useState<"input" | "understanding" | "experience" | "details">("input");
  const [businessIdea, setBusinessIdea] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const handleSubmitIdea = async () => {
    if (!businessIdea.trim()) {
      toast.error("Please share your business idea");
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('analyze-business-idea', {
        body: { idea: businessIdea }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast.error("Couldn't analyze your idea. Please try again.");
        setIsAnalyzing(false);
        return;
      }

      setAiAnalysis(analysisData.analysis);
      setIsAnalyzing(false);
      setStep("understanding");
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error("Couldn't analyze your idea. Please try again.");
      setIsAnalyzing(false);
    }
  };

  const handleConfirmUnderstanding = () => {
    // AI decides if we need more info or go straight to blocks
    // For now, let's ask about experience level
    setStep("experience");
  };

  const handleEditIdea = () => {
    setStep("input");
  };

  const handleExperienceSelect = (level: string) => {
    setExperienceLevel(level);
    // If experienced, might skip to blocks; if beginner, ask more questions
    if (level === "experienced") {
      onComplete({ businessIdea, aiAnalysis, experienceLevel: level });
    } else {
      setStep("details");
    }
  };

  const handleDetailsSubmit = () => {
    onComplete({ 
      businessIdea, 
      aiAnalysis, 
      experienceLevel,
      additionalContext 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-12 space-y-8">
        {/* Step 1: Input */}
        {step === "input" && (
          <div className="space-y-6 animate-scale-in">
            <div className="space-y-3">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to start or build your business?
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground font-light">
                Tell us a little bit about your idea
              </p>
            </div>

            <Textarea
              placeholder="E.g., I want to start a dog walking business or I have a dog walking business and need more customers..."
              value={businessIdea}
              onChange={(e) => setBusinessIdea(e.target.value)}
              className="min-h-[120px] text-base md:text-lg glass-card border-white/10 bg-white/[0.02]"
              autoFocus
            />

            <Button
              variant="empire"
              size="xl"
              onClick={handleSubmitIdea}
              disabled={isAnalyzing}
              className="w-full group"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Analyzing your idea...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 2: Understanding */}
        {step === "understanding" && (
          <div className="space-y-6 animate-scale-in">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm font-semibold">AI Analysis</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Here's what we understand
              </h3>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-neon-cyan/5 to-electric-indigo/5 border border-neon-cyan/20">
              <p className="text-lg md:text-xl text-foreground font-light leading-relaxed">
                {aiAnalysis}
              </p>
            </div>

            <p className="text-base text-muted-foreground">
              Does this look right?
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="empire"
                size="xl"
                onClick={handleConfirmUnderstanding}
                className="flex-1 group"
              >
                <span className="flex items-center justify-center gap-3">
                  Yes, that's right!
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>
              <Button
                variant="glass"
                size="xl"
                onClick={handleEditIdea}
                className="flex-1"
              >
                <Edit3 className="w-5 h-5 mr-3" />
                Let me edit
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Experience Level */}
        {step === "experience" && (
          <div className="space-y-6 animate-scale-in">
            <div className="space-y-3">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                What's your experience level?
              </h3>
              <p className="text-lg text-muted-foreground font-light">
                This helps us customize the best path for you
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => handleExperienceSelect("first-time")}
                className={cn(
                  "p-6 rounded-2xl text-left transition-all duration-300",
                  "glass-card border border-white/10 hover:border-neon-cyan/30",
                  "hover:bg-neon-cyan/5 group"
                )}
              >
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  First-time entrepreneur
                </h4>
                <p className="text-muted-foreground font-light">
                  I'm new to this and want guidance every step of the way
                </p>
              </button>

              <button
                onClick={() => handleExperienceSelect("some-experience")}
                className={cn(
                  "p-6 rounded-2xl text-left transition-all duration-300",
                  "glass-card border border-white/10 hover:border-electric-indigo/30",
                  "hover:bg-electric-indigo/5 group"
                )}
              >
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  I've tried before
                </h4>
                <p className="text-muted-foreground font-light">
                  I have some experience but need help with specific parts
                </p>
              </button>

              <button
                onClick={() => handleExperienceSelect("experienced")}
                className={cn(
                  "p-6 rounded-2xl text-left transition-all duration-300",
                  "glass-card border border-white/10 hover:border-neon-purple/30",
                  "hover:bg-neon-purple/5 group"
                )}
              >
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  I have an existing business
                </h4>
                <p className="text-muted-foreground font-light">
                  I want to grow, improve, or add new capabilities
                </p>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Additional Details (for beginners) */}
        {step === "details" && (
          <div className="space-y-6 animate-scale-in">
            <div className="space-y-3">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                Tell us a bit more
              </h3>
              <p className="text-lg text-muted-foreground font-light">
                What's your biggest challenge or goal right now?
              </p>
            </div>

            <Textarea
              placeholder="E.g., I don't know how to get my first customers, I need a professional website, I want to accept payments online..."
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              className="min-h-[120px] text-base md:text-lg glass-card border-white/10 bg-white/[0.02]"
              autoFocus
            />

            <Button
              variant="empire"
              size="xl"
              onClick={handleDetailsSubmit}
              className="w-full group"
            >
              <span className="flex items-center justify-center gap-3">
                Continue
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>
          </div>
        )}

        {/* Trust indicator */}
        <div className="pt-6 border-t border-white/5">
          <p className="text-sm text-muted-foreground/70 text-center font-light">
            Powered by AI & real humans • Takes less than 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
};
