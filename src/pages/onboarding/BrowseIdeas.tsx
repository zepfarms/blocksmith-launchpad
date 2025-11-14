import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";

interface BusinessIdea {
  id: string;
  category: string;
  name: string;
  description: string;
  starter_blocks: string;
  growth_blocks: string;
}

// Priority categories to show by default (most popular/important)
const priorityCategories = [
  "Local Service",
  "Online Store",
  "Creator Business",
  "Consulting",
  "Tech & Digital",
  "Pet Services"
];

export const BrowseIdeas = () => {
  const navigate = useNavigate();
  const { updateData } = useOnboarding();
  const [businessIdeas, setBusinessIdeas] = useState<BusinessIdea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<BusinessIdea[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showAllCategories, setShowAllCategories] = useState(false);

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

  const handleSelectIdea = (idea: BusinessIdea) => {
    const aiAnalysis = `Looks like you want to start a ${idea.name}. ${idea.description}`;
    
    updateData({
      businessIdea: idea.name,
      aiAnalysis,
      selectedIdeaRow: idea,
    });

    navigate("/start/confirm");
  };

  const handleSurpriseMe = () => {
    const randomIdea = businessIdeas[Math.floor(Math.random() * businessIdeas.length)];
    handleSelectIdea(randomIdea);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedFilter(category);
    // Auto-scroll to results on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const categories = Array.from(new Set(businessIdeas.map(idea => idea.category)));
  
  const displayedCategories = showAllCategories 
    ? categories 
    : categories.filter(cat => priorityCategories.includes(cat));

  const getResultCount = (category: string) => {
    if (category === "all") return businessIdeas.length;
    return businessIdeas.filter(idea => idea.category === category).length;
  };

  return (
    <section className="relative min-h-screen pt-32 pb-16 px-4 sm:px-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
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
            <button
              onClick={handleSurpriseMe}
              className="group px-10 py-5 bg-acari-green text-black rounded-full font-medium text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              Surprise me
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedFilter === "all"
                  ? "bg-acari-green text-black"
                  : "border-2 border-white/20 text-white hover:bg-white/5"
              }`}
            >
              All
              <span className="ml-1 text-xs opacity-70">({getResultCount("all")})</span>
            </button>
            {displayedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedFilter === cat
                    ? "bg-acari-green text-black"
                    : "border-2 border-white/20 text-white hover:bg-white/5"
                }`}
              >
                {cat}
                <span className="ml-1 text-xs opacity-70">({getResultCount(cat)})</span>
              </button>
            ))}
            {!showAllCategories && categories.length > displayedCategories.length && (
              <button
                onClick={() => setShowAllCategories(true)}
                className="px-6 py-2 rounded-full border-2 border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all"
              >
                + {categories.length - displayedCategories.length} More
              </button>
            )}
          </div>

          <div id="results-section" className="space-y-3">
            {selectedFilter !== "all" && (
              <div className="flex items-center justify-between animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredIdeas.length}</span> ideas in <span className="font-semibold text-primary">{selectedFilter}</span>
                </p>
                <button
                  onClick={() => handleCategoryClick("all")}
                  className="text-xs text-primary hover:underline"
                >
                  View all →
                </button>
              </div>
            )}
            
            <div className="grid gap-3 lg:max-h-[500px] overflow-y-auto p-1 transition-all duration-300">
              {filteredIdeas.map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => handleSelectIdea(idea)}
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
          </div>

          <button
            onClick={() => navigate("/start")}
            className="w-full px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Back
          </button>
        </div>
      </div>
    </section>
  );
};
