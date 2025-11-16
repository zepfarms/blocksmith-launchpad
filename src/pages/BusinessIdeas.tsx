import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, Rocket, TrendingUp, Search, Sparkles, Target, Store, Heart, Laptop, UtensilsCrossed, GraduationCap, Leaf, Dumbbell, Palette, Home, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BusinessIdea {
  name: string;
  description: string;
  difficulty: "Low" | "Medium" | "High";
  targetMarket: string;
}

const BusinessIdeas = () => {
  const [category, setCategory] = useState("");
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category.trim()) {
      toast({
        title: "Category required",
        description: "Please enter a category to generate ideas",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-business-ideas', {
        body: { category: category.trim() }
      });

      if (error) throw error;

      setIdeas(data.ideas);
      toast({
        title: "Ideas generated!",
        description: `Generated ${data.ideas.length} business ideas for ${category}`,
      });
    } catch (error: any) {
      console.error('Error generating ideas:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate business ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const popularCategories = [
    { name: "E-commerce", icon: Store, color: "text-blue-500" },
    { name: "Health & Wellness", icon: Heart, color: "text-pink-500" },
    { name: "Technology", icon: Laptop, color: "text-purple-500" },
    { name: "Food & Beverage", icon: UtensilsCrossed, color: "text-orange-500" },
    { name: "Education", icon: GraduationCap, color: "text-green-500" },
    { name: "Sustainability", icon: Leaf, color: "text-emerald-500" },
    { name: "Fitness", icon: Dumbbell, color: "text-red-500" },
    { name: "Creative Services", icon: Palette, color: "text-indigo-500" },
    { name: "Home Services", icon: Home, color: "text-yellow-500" },
    { name: "Consulting", icon: Users, color: "text-cyan-500" },
  ];

  const difficultyColors = {
    Low: "bg-green-500/10 text-green-500 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    High: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            AI Business Idea Generator
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover your next venture with AI-powered business ideas tailored to any category. 
            Get creative, actionable concepts in seconds.
          </p>
        </div>

        {/* Generator Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Enter a category (e.g., Technology, Health, Food)..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-12 h-14 text-lg"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              className="h-14 px-8 bg-primary hover:bg-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Ideas
                </>
              )}
            </Button>
          </form>

          {/* Popular Categories */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6">Or choose a popular category:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {popularCategories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border hover:border-primary hover:bg-accent/50 transition-all group"
                    disabled={isLoading}
                  >
                    <div className={`p-3 rounded-full bg-background border border-border group-hover:border-primary transition-colors ${cat.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-center">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generated Ideas */}
        {ideas.length > 0 && (
          <div className="max-w-6xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Business Ideas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideas.map((idea, index) => (
                <div
                  key={index}
                  className="border border-border rounded-lg p-6 hover:border-primary transition-all bg-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold flex-1">{idea.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${difficultyColors[idea.difficulty]}`}>
                      {idea.difficulty}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{idea.description}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Target className="w-4 h-4 mr-2" />
                    <span>Target: {idea.targetMarket}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Enter Category</h3>
              <p className="text-muted-foreground">
                Choose any industry or niche you're interested in exploring
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. AI Generates</h3>
              <p className="text-muted-foreground">
                Our AI analyzes market trends and creates unique business concepts
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Start Building</h3>
              <p className="text-muted-foreground">
                Pick your favorite idea and launch your business with Acari
              </p>
            </div>
          </div>
        </div>

        {/* Why Use Our Generator Section */}
        <div className="max-w-4xl mx-auto mb-16 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12 border border-primary/10">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Use Our Business Idea Generator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Lightbulb className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Unlimited Creativity</h3>
                <p className="text-sm text-muted-foreground">
                  Generate endless unique ideas across any industry or niche
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Market-Driven Insights</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered analysis of current market trends and opportunities
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Actionable Concepts</h3>
                <p className="text-sm text-muted-foreground">
                  Every idea includes target markets and difficulty assessments
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Rocket className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Fast & Free</h3>
                <p className="text-sm text-muted-foreground">
                  Get professional business ideas in seconds, completely free
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Business?</h2>
          <p className="text-muted-foreground mb-8">
            Once you've found the perfect idea, let Acari help you bring it to life with AI-powered tools and expert guidance.
          </p>
          <Button size="lg" onClick={() => window.location.href = '/start'} className="bg-primary hover:bg-primary/90">
            Start Building Now
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessIdeas;
