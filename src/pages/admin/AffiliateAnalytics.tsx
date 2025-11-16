import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, MousePointerClick, Award } from "lucide-react";

interface ClickStats {
  total_clicks: number;
  clicks_7d: number;
  clicks_30d: number;
  unique_users: number;
}

interface TopBlock {
  id: string;
  name: string;
  category: string;
  click_count: number;
  logo_url: string | null;
}

interface CategoryStats {
  category: string;
  click_count: number;
}

const AffiliateAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ClickStats>({ 
    total_clicks: 0, 
    clicks_7d: 0, 
    clicks_30d: 0,
    unique_users: 0 
  });
  const [topBlocks, setTopBlocks] = useState<TopBlock[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get total clicks and time-based stats
      const { data: clickData } = await supabase
        .from("affiliate_clicks")
        .select("clicked_at, user_id");

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const clicks7d = clickData?.filter(c => new Date(c.clicked_at) >= sevenDaysAgo).length || 0;
      const clicks30d = clickData?.filter(c => new Date(c.clicked_at) >= thirtyDaysAgo).length || 0;
      const uniqueUsers = new Set(clickData?.map(c => c.user_id).filter(Boolean)).size;

      setStats({
        total_clicks: clickData?.length || 0,
        clicks_7d: clicks7d,
        clicks_30d: clicks30d,
        unique_users: uniqueUsers,
      });

      // Get top performing blocks
      const { data: blocksData } = await supabase
        .from("affiliate_blocks")
        .select("id, name, category, click_count, logo_url")
        .gt("click_count", 0)
        .order("click_count", { ascending: false })
        .limit(10);

      setTopBlocks(blocksData || []);

      // Get clicks by category
      const { data: categoryData } = await supabase
        .from("affiliate_blocks")
        .select("category, click_count");

      const categorySums = categoryData?.reduce((acc, block) => {
        const category = block.category;
        acc[category] = (acc[category] || 0) + (block.click_count || 0);
        return acc;
      }, {} as Record<string, number>);

      const categoryArray = Object.entries(categorySums || {})
        .map(([category, click_count]) => ({ category, click_count }))
        .sort((a, b) => b.click_count - a.click_count);

      setCategoryStats(categoryArray);

    } catch (error: any) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Analytics</h1>
        <p className="text-muted-foreground">Track performance of your affiliate blocks</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <MousePointerClick className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold">{stats.total_clicks.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last 7 Days</p>
              <p className="text-2xl font-bold">{stats.clicks_7d.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last 30 Days</p>
              <p className="text-2xl font-bold">{stats.clicks_30d.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Users</p>
              <p className="text-2xl font-bold">{stats.unique_users.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Blocks */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Top Performing Blocks</h2>
          <div className="space-y-3">
            {topBlocks.map((block, index) => (
              <div key={block.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                  #{index + 1}
                </div>
                {block.logo_url && (
                  <img src={block.logo_url} alt={block.name} className="h-10 w-10 object-contain" />
                )}
                <div className="flex-1">
                  <p className="font-medium">{block.name}</p>
                  <Badge variant="outline" className="text-xs">{block.category}</Badge>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{block.click_count.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">clicks</p>
                </div>
              </div>
            ))}
            {topBlocks.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No click data yet</p>
            )}
          </div>
        </Card>

        {/* Category Performance */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Clicks by Category</h2>
          <div className="space-y-4">
            {categoryStats.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{cat.category}</span>
                  <span className="text-sm text-muted-foreground">{cat.click_count} clicks</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(cat.click_count / Math.max(...categoryStats.map(c => c.click_count))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
            {categoryStats.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No category data yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateAnalytics;