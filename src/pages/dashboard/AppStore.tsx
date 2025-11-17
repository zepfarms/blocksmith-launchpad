import { useState, useEffect } from "react";
import { UnifiedBlockCard } from "@/components/UnifiedBlockCard";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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

export default function AppStore() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [ownedBlocks, setOwnedBlocks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([loadBlocks(), loadOwnedBlocks()]).finally(() =>
      setLoading(false)
    );
  }, []);

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
    }
  };

  const loadOwnedBlocks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin - admins have access to all blocks
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (adminRole) {
        // Admins have access to everything
        const allBlockNames = blocks.map(b => b.name);
        setOwnedBlocks(new Set(allBlockNames));
        return;
      }

      const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!business) return;

      const { data: unlocks } = await supabase
        .from("user_block_unlocks")
        .select("block_name")
        .eq("business_id", business.id);

      const { data: purchases } = await supabase
        .from("user_block_purchases")
        .select("block_name")
        .eq("business_id", business.id);

      const { data: subscriptions } = await supabase
        .from("user_subscriptions")
        .select("block_name")
        .eq("business_id", business.id)
        .eq("status", "active");

      const owned = new Set<string>();
      unlocks?.forEach((u) => owned.add(u.block_name));
      purchases?.forEach((p) => owned.add(p.block_name));
      subscriptions?.forEach((s) => owned.add(s.block_name));

      setOwnedBlocks(owned);
    } catch (error) {
      console.error("Error loading owned blocks:", error);
    }
  };

  const filteredBlocks = blocks.filter((block) => {
    const isOwned = ownedBlocks.has(block.name);
    if (isOwned) return false;

    if (selectedCategory !== "all" && block.category !== selectedCategory) {
      return false;
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        block.name.toLowerCase().includes(query) ||
        block.description.toLowerCase().includes(query) ||
        block.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">App Store</h1>
        <p className="text-muted-foreground mt-2">
          Discover and add new capabilities to your business
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
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
        <div className="text-center py-12">Loading available apps...</div>
      ) : filteredBlocks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {ownedBlocks.size > 0
              ? "You own all available apps! 🎉"
              : "No apps found matching your criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlocks.map((block) => (
            <UnifiedBlockCard key={block.id} block={block} context="app-store" />
          ))}
        </div>
      )}
    </div>
  );
}
