import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { CheckCircle2, Sparkles, Rocket } from "lucide-react";
import { useEffect } from "react";

export const ConfirmIdea = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  useEffect(() => {
    if (!data.aiAnalysis) {
      navigate("/start");
    }
  }, [data.aiAnalysis, navigate]);

  const handleConfirm = () => {
    navigate("/start/name");
  };

  const handleEdit = () => {
    navigate("/start/describe");
  };


  return (
    <section className="relative flex flex-col px-4 sm:px-6 bg-background py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-3">
          {/* Exciting headline */}
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            {data.businessType === 'existing' 
              ? (
                <span className="flex items-center justify-center gap-2">
                  <Rocket className="w-8 h-8 text-acari-green animate-bounce" />
                  Ready to Supercharge Your Business?
                </span>
              )
              : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-8 h-8 text-acari-green animate-pulse" />
                  Your Business Journey Starts Here!
                </span>
              )}
          </h2>
          
          {/* Exciting confirmation card with gradient */}
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-card via-card to-acari-green/5 border-2 border-acari-green/30 shadow-lg shadow-acari-green/10">
            <p className="text-xl md:text-2xl leading-relaxed font-medium">
              Perfect! It seems like you have a solid idea. Now let's see how we can help get you the tools you need for your business.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            onClick={handleConfirm}
            className="group px-8 sm:px-10 py-4 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Yes, let's do this!
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={handleEdit}
            className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-base sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Make Changes
          </button>
        </div>

        <div className="text-center pt-2">
          <p className="text-base text-muted-foreground">
            <span className="font-semibold text-acari-green">Up next:</span> Choose your power-up tools
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            We'll show you exactly what you need to succeed
          </p>
        </div>
      </div>
    </section>
  );
};
