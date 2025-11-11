import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Block {
  name: string;
  category: string;
  description: string;
  is_free: boolean;
  typical_price: string;
  tags: string[];
}

const Features = () => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetch("/data/blocks_catalog_200.csv")
      .then((res) => res.text())
      .then((csv) => {
        const lines = csv.split("\n").slice(1);
        const parsed = lines
          .filter((line) => line.trim())
          .map((line) => {
            const parts = line.split(",");
            if (parts.length >= 6) {
              return {
                name: parts[0],
                category: parts[1],
                description: parts[2].replace(/"/g, ""),
                is_free: parts[3] === "True",
                typical_price: parts[4],
                tags: parts[6] ? JSON.parse(parts[6].replace(/'/g, '"')) : [],
              };
            }
            return null;
          })
          .filter((item): item is Block => item !== null);
        setBlocks(parsed);
      });
  }, []);

  const categories = ["all", ...Array.from(new Set(blocks.map((block) => block.category)))];

  const filteredBlocks = selectedCategory === "all"
    ? blocks
    : blocks.filter((block) => block.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 text-center">What We Build For You</h1>
          <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            From branding to launch, we handle everything you need to start and grow your business.
          </p>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  onClick={() => setSelectedCategory(cat)}
                  className="rounded-full"
                >
                  {cat === "all" ? "All Services" : cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredBlocks.map((block, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-6 hover:border-primary transition-colors bg-card"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{block.name}</h3>
                  {block.is_free ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                      FREE
                    </Badge>
                  ) : (
                    <Badge variant="outline">Add-on</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{block.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{block.typical_price}</span>
                  <div className="flex flex-wrap gap-1">
                    {block.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-muted px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate("/start")}
              className="rounded-full px-8"
            >
              Start Building
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
