import { useNavigate } from "react-router-dom";

export const BrowseIdeas = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen pt-32 pb-16 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <span>←</span>
          <span>Back to Home</span>
        </button>
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Browse Business Ideas
          </h2>
          <p className="text-lg text-muted-foreground">
            This feature has been removed. Please describe your business idea instead.
          </p>
          <button
            onClick={() => navigate("/start/describe")}
            className="mt-8 px-8 py-4 bg-acari-green text-black rounded-full font-medium text-lg hover:bg-acari-green/90 transition-all"
          >
            Describe Your Idea
          </button>
        </div>
      </div>
    </section>
  );
};
