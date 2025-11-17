import { useState, useEffect } from "react";
import { UnifiedBlockCard } from "@/components/UnifiedBlockCard";
import { supabase } from "@/integrations/supabase/runtimeClient";

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

interface UserUnlock {
  block_name: string;
  completion_status: 'not_started' | 'in_progress' | 'completed';
}

export default function MyApps() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [userUnlocks, setUserUnlocks] = useState<Map<string, UserUnlock>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserApps();
  }, []);

  const loadUserApps = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      // For admins, show all blocks without requiring a business
      if (adminRole) {
        const { data: allBlocks, error } = await supabase
          .from("affiliate_blocks")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (error) throw error;
        setBlocks((allBlocks || []) as Block[]);
        setLoading(false);
        return;
      }

      const { data: business } = await supabase
        .from("user_businesses")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!business) {
        setLoading(false);
        return;
      }

      const { data: unlocks } = await supabase
        .from("user_block_unlocks")
        .select("block_name, completion_status")
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

      const ownedBlockNames = new Set<string>();
      const unlocksMap = new Map<string, UserUnlock>();

      unlocks?.forEach((u) => {
        ownedBlockNames.add(u.block_name);
        unlocksMap.set(u.block_name, u as UserUnlock);
      });
      purchases?.forEach((p) => ownedBlockNames.add(p.block_name));
      subscriptions?.forEach((s) => ownedBlockNames.add(s.block_name));

      const { data: allBlocks, error } = await supabase
        .from("affiliate_blocks")
        .select("*")
        .in("name", Array.from(ownedBlockNames));

      if (error) throw error;

      setBlocks((allBlocks || []) as Block[]);
      setUserUnlocks(unlocksMap);
    } catch (error) {
      console.error("Error loading user apps:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Apps</h1>
        <p className="text-muted-foreground mt-2">
          Access and manage your unlocked business apps
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading your apps...</div>
      ) : blocks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            You haven't unlocked any apps yet. Visit the App Store to get started!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks.map((block) => (
            <UnifiedBlockCard
              key={block.id}
              block={block}
              context="my-apps"
              isOwned={true}
              completionStatus={
                userUnlocks.get(block.name)?.completion_status || "not_started"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
