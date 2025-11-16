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

  // Extract business type from AI analysis
  const businessType = data.aiAnalysis.replace(/I understand you want to start a |I understand you want to start |business|!|./gi, '').trim();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background pt-24">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="text-center space-y-3">
          {/* Dynamic icon based on business type */}
          <div className="flex justify-center">
            {data.businessType === 'existing' ? (
              <Rocket className="w-12 h-12 text-acari-green animate-bounce" />
            ) : (
              <Sparkles className="w-12 h-12 text-acari-green animate-pulse" />
            )}
          </div>
          
          {/* Exciting headline */}
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            {data.businessType === 'existing' 
              ? '🎯 Ready to Supercharge Your Business?' 
              : '✨ Your Business Journey Starts Here!'}
          </h2>
          
          {/* Exciting confirmation card with gradient */}
          <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-card via-card to-acari-green/5 border-2 border-acari-green/30 shadow-lg shadow-acari-green/10">
            <p className="text-xl md:text-2xl leading-relaxed font-medium">
              {data.businessType === 'existing'
                ? (
                  <>
                    Perfect! We're about to unlock <span className="text-acari-green font-bold">powerful tools</span> tailored specifically for your <span className="text-acari-green font-bold">{businessType}</span> business. 
                    <br /><br />
                    Get ready to <span className="text-acari-green">streamline operations</span>, <span className="text-acari-green">save time</span>, and <span className="text-acari-green">accelerate growth</span>. 🚀
                  </>
                )
                : (
                  <>
                    Exciting! Your <span className="text-acari-green font-bold">{businessType}</span> business is about to come to life. 
                    <br /><br />
                    We're curating the <span className="text-acari-green">perfect toolkit</span> to help you <span className="text-acari-green">launch faster</span> and <span className="text-acari-green">smarter</span>. 🎯
                  </>
                )}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <button
            onClick={handleConfirm}
            className="group px-8 sm:px-10 py-4 sm:py-5 bg-acari-green text-black rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/90 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-acari-green/20"
          >
            <CheckCircle2 className="w-5 h-5" />
            Yes, let's do this!
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={handleEdit}
            className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-base sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Let me refine
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
