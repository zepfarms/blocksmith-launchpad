import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, ImageIcon, Rocket } from "lucide-react";

export function AnalyticsCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalLogos: 0,
    launchedBusinesses: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const profilesData = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });
      
      const businessesData = await supabase
        .from("user_businesses")
        .select("id", { count: "exact", head: true });
      
      const logosData = await (supabase as any)
        .from("logo_generation_sessions")
        .select("id", { count: "exact", head: true });
      
      const launchedData = await supabase
        .from("user_businesses")
        .select("id", { count: "exact", head: true })
        .eq("status", "launched");

      setStats({
        totalUsers: profilesData.count || 0,
        totalBusinesses: businessesData.count || 0,
        totalLogos: logosData.count || 0,
        launchedBusinesses: launchedData.count || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Total Businesses",
      value: stats.totalBusinesses,
      icon: Building2,
      color: "text-purple-500",
    },
    {
      title: "Logo Sessions",
      value: stats.totalLogos,
      icon: ImageIcon,
      color: "text-green-500",
    },
    {
      title: "Launched",
      value: stats.launchedBusinesses,
      icon: Rocket,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
