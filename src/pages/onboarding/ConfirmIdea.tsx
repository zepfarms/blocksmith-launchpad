import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { CheckCircle2 } from "lucide-react";
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
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold">Here's what we understand</span>
          </div>
          
          <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-card border border-border">
            <p className="text-lg leading-relaxed">
              {data.businessType === 'existing'
                ? `Got it! I understand you own a ${data.aiAnalysis.replace(/I understand you want to start a |I understand you want to start |business|!|./gi, '').trim()} business. Based on that I can recommend some Tools to help make your business run smoother.`
                : `Got it! I understand you want to start a ${data.aiAnalysis.replace(/I understand you want to start a |I understand you want to start |business|!|./gi, '').trim()} business.`}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleConfirm}
            className="group px-10 py-5 bg-acari-green text-black rounded-full font-medium text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Yes, that's right!
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={handleEdit}
            className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Let me edit
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Next: Pick the blocks you need help with for your business
        </p>
      </div>
    </section>
  );
};
