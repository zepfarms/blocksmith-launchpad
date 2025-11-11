import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Sparkles, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface JourneyFlowProps {
  onComplete: (data: { name: string; vision: string; industry: string }) => void;
  onBack: () => void;
}

const industries = [
  "E-commerce & Retail",
  "SaaS & Technology",
  "Consulting & Services",
  "Content & Media",
  "Health & Wellness",
  "Education & Courses",
  "Finance & Fintech",
  "Creative & Design",
];

export const JourneyFlow = ({ onComplete, onBack }: JourneyFlowProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    vision: "",
    industry: "",
  });

  const handleNext = () => {
    if (step === 1 && !data.name.trim()) {
      toast.error("Please enter your empire name");
      return;
    }
    if (step === 2 && !data.vision.trim()) {
      toast.error("Share your vision with us");
      return;
    }
    if (step === 3 && !data.industry) {
      toast.error("Select your industry");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-neon-cyan/20 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-electric-indigo/20 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 w-full max-w-3xl space-y-12 animate-slide-up-fade">
        {/* Progress indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-electric-indigo transition-all duration-500 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="glass-card p-12 rounded-3xl border border-neon-cyan/20 space-y-8">
          {/* Step 1: Empire Name */}
          {step === 1 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-semibold">Empire Foundation</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Name Your</span>
                <span className="block bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
                  Empire
                </span>
              </h2>

              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Every great empire begins with a name. What will yours be called?
              </p>

              <Input
                type="text"
                placeholder="Enter your empire name..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="h-16 text-lg rounded-2xl glass-card border-white/10 bg-white/[0.02] text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/30 transition-all"
                autoFocus
              />

              <div className="pt-4 text-sm text-muted-foreground/60">
                <p>Examples: NovaTech Solutions, Quantum Commerce, Empire Fitness</p>
              </div>
            </div>
          )}

          {/* Step 2: Vision */}
          {step === 2 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-electric-indigo/10 border border-electric-indigo/30">
                <Sparkles className="w-4 h-4 text-electric-indigo" />
                <span className="text-sm font-semibold">Empire Vision</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Share Your</span>
                <span className="block bg-gradient-to-r from-electric-indigo to-neon-purple bg-clip-text text-transparent">
                  Vision
                </span>
              </h2>

              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                What problem are you solving? Who are you helping?
              </p>

              <textarea
                placeholder="Describe your vision in a few sentences..."
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
                className="w-full h-40 p-6 text-lg rounded-2xl glass-card border border-white/10 bg-white/[0.02] text-foreground placeholder:text-muted-foreground focus:border-electric-indigo/30 transition-all resize-none"
                autoFocus
              />

              <div className="pt-4 text-sm text-muted-foreground/60">
                <p>Be specific about the impact you want to make</p>
              </div>
            </div>
          )}

          {/* Step 3: Industry */}
          {step === 3 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-sm font-semibold">Empire Domain</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Choose Your</span>
                <span className="block bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  Industry
                </span>
              </h2>

              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Select the sector where your empire will dominate
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    onClick={() => setData({ ...data, industry })}
                    className={cn(
                      "p-5 rounded-2xl text-left transition-all duration-300",
                      "border glass-card-hover",
                      data.industry === industry
                        ? "border-neon-cyan/50 bg-neon-cyan/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                        : "border-white/10 hover:border-neon-cyan/20"
                    )}
                  >
                    <span className="font-semibold">{industry}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="glass"
              size="lg"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>

            <Button
              variant={step === 3 ? "empire" : "neon"}
              size="lg"
              onClick={handleNext}
              className="gap-2"
            >
              {step === 3 ? (
                <>
                  Launch Empire
                  <Rocket className="w-5 h-5" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Helper text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground/60">
            Your information helps us customize your empire launch experience
          </p>
        </div>
      </div>
    </div>
  );
};
