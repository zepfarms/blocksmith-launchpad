import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";

export const BusinessName = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const [businessName, setBusinessName] = useState(data.businessName);

  const handleContinue = () => {
    updateData({ businessName });
    navigate("/start/blocks");
  };

  const handleSkip = () => {
    updateData({ businessName: "" });
    navigate("/start/blocks");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in w-full">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {data.businessType === 'existing'
              ? 'What is the name of your business?'
              : 'Do you have a name for your new business?'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {data.businessType === 'existing'
              ? 'This helps us personalize your experience'
              : "Don't worry, you can always change it later"}
          </p>
        </div>

        <div className="space-y-4">
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g., Pawsome Walks"
            className="text-lg text-center"
            autoFocus
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleContinue}
              disabled={!businessName.trim()}
              className="group flex-1 px-8 sm:px-10 py-4 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={handleSkip}
              className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-base sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
