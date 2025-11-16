import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";

export const IdeaStep = () => {
  const navigate = useNavigate();
  const { updateData } = useOnboarding();

  const handleExistingBusiness = () => {
    updateData({ businessIdea: "", aiAnalysis: "", businessType: "existing" });
    navigate("/start/describe");
  };

  const handleNewBusiness = () => {
    updateData({ businessIdea: "", aiAnalysis: "", businessType: "new" });
    navigate("/start/describe");
  };

  return (
    <section className="relative flex flex-col px-4 sm:px-6 bg-background py-12 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
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
            onClick={handleExistingBusiness}
            className="group px-8 sm:px-10 py-4 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Already have a business
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={handleNewBusiness}
            className="px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-base sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            I want to start a business
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
