import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface BusinessIdea {
  id: string;
  category: string;
  name: string;
  description: string;
  starter_blocks: string;
  growth_blocks: string;
}

export const DescribeIdea = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();
  const [businessIdea, setBusinessIdea] = useState(data.businessIdea);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);

  // Load business ideas from CSV
  useEffect(() => {
    fetch('/data/business_ideas.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1);
        const ideas: BusinessIdea[] = lines
          .filter(line => line.trim())
          .map((line, index) => {
            const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
            if (!matches || matches.length < 6) return null;
            
            const clean = (str: string) => str.replace(/^,?"?|"?$/g, '').trim();
            
            return {
              id: clean(matches[0]) || String(index + 1),
              category: clean(matches[1]),
              name: clean(matches[2]),
              description: clean(matches[3]),
              starter_blocks: clean(matches[4]),
              growth_blocks: clean(matches[5])
            };
          })
          .filter((idea): idea is BusinessIdea => idea !== null);
        
        setBusinessIdeas(ideas);
      });
  }, []);

  const handleSubmitIdea = async () => {
    if (!businessIdea.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const { data: analysisData, error } = await supabase.functions.invoke('analyze-business-idea', {
        body: { businessIdea }
      });

      if (error) throw error;

      const aiAnalysis = analysisData.analysis;
      
      // Try to match with a business idea row
      const lowerIdea = businessIdea.toLowerCase();
      const matchedIdea = businessIdeas.find(idea => 
        lowerIdea.includes(idea.name.toLowerCase()) ||
        lowerIdea.includes(idea.category.toLowerCase()) ||
        idea.description.toLowerCase().split(' ').some(word => lowerIdea.includes(word))
      );
      
      updateData({
        businessIdea,
        aiAnalysis,
        selectedIdeaRow: matchedIdea || null,
      });

      navigate("/start/confirm");
    } catch (error) {
      console.error('Error analyzing idea:', error);
      toast.error("We couldn't analyze your idea. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in w-full">
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
            autoFocus
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmitIdea}
              disabled={!businessIdea.trim() || isAnalyzing}
              className="group flex-1 px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Continue
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </>
              )}
            </button>
            <button
              onClick={() => navigate("/start")}
              className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
