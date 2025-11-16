import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, ExternalLink, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AffiliateBlock {
  id: string;
  name: string;
  subtitle: string | null;
  category: string;
  description: string;
  logo_url: string | null;
  affiliate_link: string | null;
  tags: string[] | null;
  click_count: number | null;
  is_active: boolean | null;
}

export default function Tools() {
  const [blocks, setBlocks] = useState<AffiliateBlock[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<AffiliateBlock[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlocks();
  }, []);

  useEffect(() => {
    filterBlocks();
  }, [blocks, searchQuery, selectedCategory]);

  const fetchBlocks = async () => {
    const { data, error } = await supabase
      .from("affiliate_blocks")
      .select("*")
      .eq("is_active", true)
      .order("click_count", { ascending: false });

    if (error) {
      toast({
        title: "Error loading tools",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setBlocks(data || []);
    
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(data?.map((block) => block.category) || [])
    );
    setCategories(uniqueCategories);
  };

  const filterBlocks = () => {
    let filtered = blocks;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((block) => block.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (block) =>
          block.name.toLowerCase().includes(query) ||
          block.description.toLowerCase().includes(query) ||
          block.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredBlocks(filtered);
  };

  const handleBlockClick = async (block: AffiliateBlock) => {
    if (!block.affiliate_link) return;

    try {
      // Track the click
      await supabase.functions.invoke("track-affiliate-click", {
        body: { blockId: block.id },
      });

      // Open affiliate link in new tab
      window.open(block.affiliate_link, "_blank");
    } catch (error) {
      console.error("Error tracking click:", error);
      // Still open the link even if tracking fails
      window.open(block.affiliate_link, "_blank");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Foundation: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Partnership: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      Finance: "bg-green-500/10 text-green-500 border-green-500/20",
      Development: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      Marketing: "bg-pink-500/10 text-pink-500 border-pink-500/20",
      "E-commerce": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "AI & Automation": "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    };
    return colors[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-acari-green to-green-400 bg-clip-text text-transparent">
              Business Tools Directory
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover the best tools to launch and grow your business. All curated and tested by our team.
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background border-white/20">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-sm text-gray-400">
            Showing {filteredBlocks.length} of {blocks.length} tools
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlocks.map((block) => (
              <Card
                key={block.id}
                onClick={() => handleBlockClick(block)}
                className="bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="p-6">
                  {/* Logo & Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {block.logo_url ? (
                        <img
                          src={block.logo_url}
                          alt={block.name}
                          className="w-12 h-12 rounded-lg object-contain bg-white/10 p-2"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-acari-green to-green-600 flex items-center justify-center text-black font-bold">
                          {block.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-acari-green transition-colors">
                          {block.name}
                        </h3>
                        {block.subtitle && (
                          <p className="text-xs text-gray-400">{block.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-acari-green transition-colors" />
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                    {block.description}
                  </p>

                  {/* Category & Click Count */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={`${getCategoryColor(block.category)} border`}
                    >
                      {block.category}
                    </Badge>
                    {block.click_count && block.click_count > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <TrendingUp className="w-3 h-3" />
                        {block.click_count} clicks
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {block.tags && block.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {block.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredBlocks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No tools found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
