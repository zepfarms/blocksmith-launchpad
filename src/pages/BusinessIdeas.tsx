import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

interface BusinessIdea {
  id: string;
  category: string;
  name: string;
  description: string;
  starter_blocks: string;
  growth_blocks: string;
}

const BusinessIdeas = () => {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<BusinessIdea[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/data/business_ideas_500.csv")
      .then((res) => res.text())
      .then((csv) => {
        const lines = csv.split("\n").slice(1);
        const parsed = lines
          .filter((line) => line.trim())
          .map((line) => {
            const match = line.match(/^(\d+),([^,]+),"([^"]+)","([^"]+)","([^"]+)","([^"]+)"$/);
            if (match) {
              return {
                id: match[1],
                category: match[2],
                name: match[3],
                description: match[4],
                starter_blocks: match[5],
                growth_blocks: match[6],
              };
            }
            return null;
          })
          .filter((item): item is BusinessIdea => item !== null);
        setIdeas(parsed);
        setFilteredIdeas(parsed);
      });
  }, []);

  useEffect(() => {
    let filtered = ideas;

    if (searchTerm) {
      filtered = filtered.filter(
        (idea) =>
          idea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          idea.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((idea) => idea.category === selectedCategory);
    }

    setFilteredIdeas(filtered);
  }, [searchTerm, selectedCategory, ideas]);

  const categories = ["all", ...Array.from(new Set(ideas.map((idea) => idea.category)))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-center">Business Ideas</h1>
          <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            Explore hundreds of proven business ideas. Find inspiration or pick one to get started.
          </p>

          <div className="mb-8 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search ideas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-acari-green text-black"
                      : "border-2 border-white/20 text-white hover:bg-white/5"
                  }`}
                >
                  {cat === "all" ? "All Categories" : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredIdeas.map((idea) => (
              <div
                key={idea.id}
                className="border border-border rounded-lg p-6 hover:border-primary transition-colors bg-card"
              >
                <div className="mb-2">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {idea.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{idea.name}</h3>
                <p className="text-sm text-muted-foreground">{idea.description}</p>
              </div>
            ))}
          </div>

          {filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ideas found matching your search.</p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate("/start")}
              className="group px-10 py-5 bg-acari-green text-black rounded-full font-medium text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              Start Building
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BusinessIdeas;
