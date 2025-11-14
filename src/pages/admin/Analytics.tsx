import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AnalyticsData {
  mrr: number;
  activeSubscriptions: number;
  churnRate: number;
  recoveryRate: number;
  mrrTrend: Array<{ date: string; mrr: number; subscriptions: number }>;
  upgradeDowngrade: Array<{ name: string; value: number }>;
  failedPayments: {
    total: number;
    resolved: number;
    pending: number;
  };
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export default function Analytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  useEffect(() => {
    checkAdminAccess();
    loadAnalytics();
  }, [dateFrom, dateTo]);

  const checkAdminAccess = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        navigate("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    }
  };

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      // Get active subscriptions
      const { data: activeSubscriptions } = await supabase
        .from("user_subscriptions")
        .select("monthly_price_cents")
        .eq("status", "active")
        .eq("cancel_at_period_end", false);

      const currentMRR = (activeSubscriptions || []).reduce(
        (sum, sub) => sum + sub.monthly_price_cents,
        0
      );

      // Get subscription history for MRR trend
      const { data: allSubscriptions } = await supabase
        .from("user_subscriptions")
        .select("created_at, monthly_price_cents, status, cancel_at_period_end")
        .gte("created_at", dateFrom)
        .lte("created_at", dateTo)
        .order("created_at");

      // Calculate MRR trend by month
      const mrrByMonth: Record<string, { mrr: number; count: number }> = {};
      
      allSubscriptions?.forEach((sub) => {
        const month = new Date(sub.created_at).toISOString().substring(0, 7);
        if (!mrrByMonth[month]) {
          mrrByMonth[month] = { mrr: 0, count: 0 };
        }
        if (sub.status === 'active' && !sub.cancel_at_period_end) {
          mrrByMonth[month].mrr += sub.monthly_price_cents;
          mrrByMonth[month].count += 1;
        }
      });

      const mrrTrend = Object.entries(mrrByMonth).map(([date, data]) => ({
        date,
        mrr: data.mrr / 100,
        subscriptions: data.count,
      }));

      // Calculate churn rate (cancelled / total active at start of period)
      const { data: cancelledSubs } = await supabase
        .from("user_subscriptions")
        .select("id")
        .eq("status", "cancelled")
        .gte("updated_at", dateFrom)
        .lte("updated_at", dateTo);

      const churnRate = activeSubscriptions?.length
        ? ((cancelledSubs?.length || 0) / (activeSubscriptions.length + (cancelledSubs?.length || 0))) * 100
        : 0;

      // Get failed payment stats
      const { data: failedPayments } = await supabase
        .from("subscription_payment_failures")
        .select("resolved")
        .gte("created_at", dateFrom)
        .lte("created_at", dateTo);

      const totalFailed = failedPayments?.length || 0;
      const resolvedFailed = failedPayments?.filter((f) => f.resolved).length || 0;
      const recoveryRate = totalFailed > 0 ? (resolvedFailed / totalFailed) * 100 : 0;

      // Upgrade/Downgrade metrics (simplified - would need better tracking in production)
      const upgradeDowngrade = [
        { name: "Active", value: activeSubscriptions?.length || 0 },
        { name: "Cancelled", value: cancelledSubs?.length || 0 },
      ];

      setAnalytics({
        mrr: currentMRR / 100,
        activeSubscriptions: activeSubscriptions?.length || 0,
        churnRate,
        recoveryRate,
        mrrTrend,
        upgradeDowngrade,
        failedPayments: {
          total: totalFailed,
          resolved: resolvedFailed,
          pending: totalFailed - resolvedFailed,
        },
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Revenue Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into your subscription revenue
            </p>
          </div>
          <Button onClick={() => loadAnalytics()} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Refresh
          </Button>
        </div>

        {/* Date Range Filter */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                <p className="text-3xl font-bold text-green-400 mt-2">
                  ${analytics.mrr.toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-green-400/50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {analytics.activeSubscriptions}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-400/50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Churn Rate</p>
                <p className="text-3xl font-bold text-red-400 mt-2">
                  {analytics.churnRate.toFixed(1)}%
                </p>
              </div>
              <TrendingDown className="w-10 h-10 text-red-400/50" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payment Recovery Rate</p>
                <p className="text-3xl font-bold text-orange-400 mt-2">
                  {analytics.recoveryRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-400/50" />
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MRR Trend Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">MRR Growth Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.mrrTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="MRR ($)"
                />
                <Line
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Subscriptions"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Subscription Status Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Subscription Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.upgradeDowngrade}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.upgradeDowngrade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Failed Payments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Failed Payment Recovery</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Total Failed", value: analytics.failedPayments.total },
                  { name: "Resolved", value: analytics.failedPayments.resolved },
                  { name: "Pending", value: analytics.failedPayments.pending },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Summary Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Period Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Total Failed Payments</span>
                <span className="text-lg font-semibold">{analytics.failedPayments.total}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg">
                <span className="text-sm text-green-400">Recovered</span>
                <span className="text-lg font-semibold text-green-400">
                  {analytics.failedPayments.resolved}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-orange-500/10 rounded-lg">
                <span className="text-sm text-orange-400">Pending Recovery</span>
                <span className="text-lg font-semibold text-orange-400">
                  {analytics.failedPayments.pending}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg">
                <span className="text-sm text-blue-400">Avg Subscription Value</span>
                <span className="text-lg font-semibold text-blue-400">
                  ${analytics.activeSubscriptions > 0
                    ? (analytics.mrr / analytics.activeSubscriptions).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
