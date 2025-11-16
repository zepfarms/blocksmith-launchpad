import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedBlockCard } from "@/components/UnifiedBlockCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Helmet } from "react-helmet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Block {
  id: string;
  name: string;
  subtitle?: string | null;
  description: string;
  category: string;
  logo_url?: string | null;
  affiliate_link?: string | null;
  block_type: 'internal' | 'affiliate';
  internal_route?: string | null;
  pricing_type: 'free' | 'one_time' | 'monthly';
  price_cents: number;
  monthly_price_cents: number;
  click_count?: number | null;
  tags?: string[] | null;
  is_featured?: boolean;
}

export default function Tools() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [filteredBlocks, setFilteredBlocks] = useState<Block[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlocks();
  }, []);

  useEffect(() => {
    filterBlocks();
  }, [blocks, searchQuery, selectedCategory]);

  const loadBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliate_blocks")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      setBlocks((data || []) as Block[]);
      
      const uniqueCategories = Array.from(
        new Set(data?.map((block) => block.category) || [])
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error loading blocks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterBlocks = () => {
    let filtered = blocks;

    if (selectedCategory !== "all") {
      filtered = filtered.filter((block) => block.category === selectedCategory);
    }

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

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Business Tools & Apps - ACARI</title>
        <meta
          name="description"
          content="Explore powerful business tools and partner integrations to help build and grow your business"
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Business Tools & Apps
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover powerful tools and partner integrations to accelerate your business growth
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools and apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading tools...</div>
          ) : filteredBlocks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No tools found matching your criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlocks.map((block) => (
                <UnifiedBlockCard
                  key={block.id}
                  block={block}
                  context="public"
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
