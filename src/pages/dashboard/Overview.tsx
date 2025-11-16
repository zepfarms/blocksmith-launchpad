import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckCircle, 
  Palette, 
  FileText, 
  QrCode,
  Mail,
  Sparkles
} from "lucide-react";

export default function Overview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBlocks: 0,
    completedBlocks: 0,
    savedAssets: 0,
    businessName: "",
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Get business info
    const { data: business } = await supabase
      .from('user_businesses')
      .select('business_name')
      .eq('user_id', session.user.id)
      .maybeSingle();

    // Get unlocked blocks
    const { data: unlocks } = await supabase
      .from('user_block_unlocks')
      .select('block_name, completion_status')
      .eq('user_id', session.user.id);

    // Get saved assets
    const { data: assets } = await supabase
      .from('user_assets')
      .select('id')
      .eq('user_id', session.user.id);

    const completed = unlocks?.filter(u => u.completion_status === 'completed').length || 0;

    setStats({
      totalBlocks: unlocks?.length || 0,
      completedBlocks: completed,
      savedAssets: assets?.length || 0,
      businessName: business?.business_name || "Your Business",
    });
  };

  const quickActions = [
    { label: "Generate Logo", icon: Palette, path: "/dashboard/logos" },
    { label: "Business Plan", icon: FileText, path: "/dashboard/business-plan-generator" },
    { label: "QR Codes", icon: QrCode, path: "/dashboard/qr-code-generator" },
    { label: "Email Signature", icon: Mail, path: "/dashboard/email-signature-generator" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Welcome Header */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-border/40 bg-gradient-to-br from-acari-green/5 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-6 w-6 text-acari-green" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back!
            </h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">
            Building <span className="text-acari-green font-semibold">{stats.businessName}</span>
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <StatsCard
            title="Total Apps"
            value={stats.totalBlocks}
            icon={LayoutDashboard}
            description="Unlocked tools"
          />
          <StatsCard
            title="Completed"
            value={stats.completedBlocks}
            icon={CheckCircle}
            description="Finished setup"
          />
          <StatsCard
            title="Saved Assets"
            value={stats.savedAssets}
            icon={Briefcase}
            description="In your briefcase"
          />
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.label}
                onClick={() => navigate(action.path)}
                variant="outline"
                className="glass-card h-24 md:h-28 flex flex-col items-center justify-center gap-3 border-border/40 hover:border-acari-green/50 hover:bg-acari-green/5 transition-all duration-200 group"
              >
                <action.icon className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground group-hover:text-acari-green transition-colors" />
                <span className="text-sm font-medium text-foreground group-hover:text-acari-green transition-colors">
                  {action.label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-border/40">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Recent Activity</h2>
          <p className="text-muted-foreground text-sm">
            Your recent activity will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
