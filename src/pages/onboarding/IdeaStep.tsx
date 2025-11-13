import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";

export const IdeaStep = () => {
  const navigate = useNavigate();
  const { updateData } = useOnboarding();

  const handleYes = () => {
    updateData({ businessIdea: "", aiAnalysis: "" });
    navigate("/start/describe");
  };

  const handleNo = () => {
    navigate("/start/browse");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background">
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
            onClick={handleYes}
            className="group px-10 py-5 bg-acari-green text-black rounded-full font-medium text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            Yes, I have an idea
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={handleNo}
            className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            No, show me ideas
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
