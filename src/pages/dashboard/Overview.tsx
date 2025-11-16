import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { useNavigate } from "react-router-dom";
import { Loader2, Package, CheckCircle2, Briefcase, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardStats {
  totalBlocks: number;
  completedBlocks: number;
  savedAssets: number;
  completionPercentage: number;
}

export default function Overview() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBlocks: 0,
    completedBlocks: 0,
    savedAssets: 0,
    completionPercentage: 0,
  });
  const [businessName, setBusinessName] = useState<string>("");
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      // Load business info
      const { data: business } = await supabase
        .from('user_businesses')
        .select('business_name')
        .eq('user_id', user.id)
        .single();

      if (business) {
        setBusinessName(business.business_name);
      }

      // Load unlocked blocks
      const { data: unlocks } = await supabase
        .from('user_block_unlocks')
        .select('block_name, completion_status, unlocked_at')
        .eq('user_id', user.id);

      const totalBlocks = unlocks?.length || 0;
      const completedBlocks = unlocks?.filter(u => u.completion_status === 'completed').length || 0;
      const completionPercentage = totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0;

      // Load saved assets
      const { data: assets } = await supabase
        .from('user_assets')
        .select('id, asset_type, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const savedAssets = assets?.length || 0;

      // Build recent activity from unlocks and assets
      const activities = [];
      
      // Add recent unlocks
      if (unlocks) {
        unlocks
          .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
          .slice(0, 3)
          .forEach(unlock => {
            activities.push({
              type: 'block_unlocked',
              description: `Unlocked ${unlock.block_name}`,
              timestamp: unlock.unlocked_at,
            });
          });
      }

      // Add recent assets
      if (assets) {
        assets.forEach(asset => {
          activities.push({
            type: 'asset_created',
            description: `Created ${asset.asset_type.replace('_', ' ')}`,
            timestamp: asset.created_at,
          });
        });
      }

      // Sort by timestamp and take top 5
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivities(activities.slice(0, 5));

      setStats({
        totalBlocks,
        completedBlocks,
        savedAssets,
        completionPercentage,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Welcome Banner */}
      <div className="glass-card p-6 md:p-8 mb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back{businessName ? `, ${businessName}` : ''}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your business tools
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <StatsCard
          title="Total Blocks"
          value={stats.totalBlocks.toString()}
          description="Tools unlocked"
          icon={Package}
          trend={stats.totalBlocks > 0 ? "+100%" : undefined}
        />
        <StatsCard
          title="Completed"
          value={stats.completedBlocks.toString()}
          description="Blocks finished"
          icon={CheckCircle2}
          trend={stats.completedBlocks > 0 ? `${stats.completionPercentage}%` : undefined}
        />
        <StatsCard
          title="Saved Assets"
          value={stats.savedAssets.toString()}
          description="Files created"
          icon={Briefcase}
        />
        <StatsCard
          title="Progress"
          value={`${stats.completionPercentage}%`}
          description="Overall completion"
          icon={TrendingUp}
          trend={stats.completionPercentage > 50 ? "Great!" : "Keep going!"}
        />
      </div>

      {/* Completion Progress */}
      {stats.totalBlocks > 0 && (
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">
                {stats.completedBlocks} of {stats.totalBlocks} blocks completed
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">
              {stats.completionPercentage}%
            </span>
          </div>
          <Progress value={stats.completionPercentage} className="h-3" />
        </div>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <QuickActionsGrid />
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <RecentActivityFeed activities={recentActivities} />
        </div>
      </div>
    </div>
  );
}