import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Sparkles, CheckCircle2, Search } from "lucide-react";

interface BusinessIdea {
  id: string;
  category: string;
  name: string;
  description: string;
  starter_blocks: string;
  growth_blocks: string;
}

interface ConversationalFormProps {
  onComplete: (data: {
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: BusinessIdea;
  }) => void;
}

export const ConversationalForm = ({ onComplete }: ConversationalFormProps) => {
  const [step, setStep] = useState(1); // 1: has idea?, 2: describe or browse, 3: AI understanding
  const [hasIdea, setHasIdea] = useState<boolean | null>(null);
  const [businessIdea, setBusinessIdea] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<BusinessIdea[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedIdeaRow, setSelectedIdeaRow] = useState<BusinessIdea | null>(null);

  // Load business ideas from CSV
  useEffect(() => {
    fetch('/data/business_ideas.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1); // Skip header
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
        setFilteredIdeas(ideas);
      });
  }, []);

  // Filter ideas based on search and category
  useEffect(() => {
    let filtered = businessIdeas;
    
    if (selectedFilter !== "all") {
      filtered = filtered.filter(idea => idea.category === selectedFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(idea => 
        idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        idea.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIdeas(filtered);
  }, [searchTerm, selectedFilter, businessIdeas]);

  const handleSubmitIdea = async () => {
    if (!businessIdea.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-business-idea', {
        body: { businessIdea }
      });

      if (error) throw error;

      setAiAnalysis(data.analysis);
      
      // Try to match with a business idea row
      const lowerIdea = businessIdea.toLowerCase();
      const matchedIdea = businessIdeas.find(idea => 
        lowerIdea.includes(idea.name.toLowerCase()) ||
        lowerIdea.includes(idea.category.toLowerCase()) ||
        idea.description.toLowerCase().split(' ').some(word => lowerIdea.includes(word))
      );
      
      setSelectedIdeaRow(matchedIdea || null);
      setStep(3);
    } catch (error) {
      console.error('Error analyzing idea:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectIdeaFromList = (idea: BusinessIdea) => {
    setBusinessIdea(idea.name);
    setAiAnalysis(`Looks like you want to start a ${idea.name}. ${idea.description}`);
    setSelectedIdeaRow(idea);
    setStep(3);
  };

  const handleSurpriseMe = () => {
    const randomIdea = businessIdeas[Math.floor(Math.random() * businessIdeas.length)];
    handleSelectIdeaFromList(randomIdea);
  };

  const handleConfirmUnderstanding = () => {
    onComplete({
      businessIdea,
      aiAnalysis,
      selectedIdeaRow: selectedIdeaRow || undefined,
    });
  };

  const handleEditIdea = () => {
    setStep(2);
    setAiAnalysis("");
  };

  const categories = Array.from(new Set(businessIdeas.map(idea => idea.category)));

  return (
    <section className="relative py-16 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Step 1: Do you have an idea? */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">
                Ready to start or build your business?
              </h2>
              <p className="text-xl text-muted-foreground">
                Tell us a little bit about your idea
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="empire"
                size="xl"
                onClick={() => {
                  setHasIdea(true);
                  setStep(2);
                }}
                className="flex-1 sm:flex-initial"
              >
                Yes, I have an idea
              </Button>
              <Button
                variant="glass"
                size="xl"
                onClick={() => {
                  setHasIdea(false);
                  setStep(2);
                }}
                className="flex-1 sm:flex-initial"
              >
                No, show me ideas
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Describe idea OR browse ideas */}
        {step === 2 && hasIdea && (
          <div className="space-y-8 animate-fade-in">
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
              />

              <div className="flex gap-3">
                <Button
                  variant="empire"
                  size="lg"
                  onClick={handleSubmitIdea}
                  disabled={!businessIdea.trim() || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Continue
                    </>
                  )}
                </Button>
                <Button
                  variant="glass"
                  size="lg"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && !hasIdea && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Browse Business Ideas
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose from {businessIdeas.length}+ proven business ideas
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="empire"
                  onClick={handleSurpriseMe}
                  className="whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Surprise me
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter("all")}
                >
                  All
                </Button>
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={selectedFilter === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              <div className="grid gap-3 max-h-[500px] overflow-y-auto p-1">
                {filteredIdeas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => handleSelectIdeaFromList(idea)}
                    className="group relative p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all text-left"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                          {idea.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {idea.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {idea.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <Button
                variant="glass"
                size="lg"
                onClick={() => setStep(1)}
                className="w-full"
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: AI Understanding Confirmation */}
        {step === 3 && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold">Here's what we understand</span>
              </div>
              
              <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-card border border-border">
                <p className="text-lg leading-relaxed">{aiAnalysis}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="empire"
                size="xl"
                onClick={handleConfirmUnderstanding}
                className="flex-1 sm:flex-initial"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Yes, that's right!
              </Button>
              <Button
                variant="glass"
                size="xl"
                onClick={handleEditIdea}
                className="flex-1 sm:flex-initial"
              >
                Let me edit
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Next: Pick the blocks you need help with for your business
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
