import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle, Calendar, Mail, Loader2, ExternalLink, Send } from "lucide-react";
import { toast } from "sonner";

interface PaymentFailure {
  id: string;
  user_id: string;
  subscription_id: string;
  stripe_invoice_id: string;
  failure_reason: string;
  attempt_count: number;
  next_retry_date: string | null;
  resolved: boolean;
  resolved_at: string | null;
  created_at: string;
  last_reminder_sent_at: string | null;
  reminder_count: number;
  profiles: {
    email: string;
  };
  user_subscriptions: {
    block_name: string;
    monthly_price_cents: number;
    grace_period_end: string | null;
    status: string;
  };
}

export default function FailedPayments() {
  const navigate = useNavigate();
  const [failures, setFailures] = useState<PaymentFailure[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchEmail, setSearchEmail] = useState<string>("");

  useEffect(() => {
    checkAdminAccess();
    loadFailures();
  }, [statusFilter, dateFrom, dateTo, searchEmail]);

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

  const loadFailures = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("subscription_payment_failures")
        .select(`
          *,
          profiles!inner(email),
          user_subscriptions!inner(block_name, monthly_price_cents, grace_period_end, status)
        `)
        .order("created_at", { ascending: false });

      // Apply status filter
      if (statusFilter === "unresolved") {
        query = query.eq("resolved", false);
      } else if (statusFilter === "resolved") {
        query = query.eq("resolved", true);
      }

      // Apply date filters
      if (dateFrom) {
        query = query.gte("created_at", new Date(dateFrom).toISOString());
      }
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        query = query.lte("created_at", endDate.toISOString());
      }

      // Apply email search
      if (searchEmail) {
        query = query.ilike("profiles.email", `%${searchEmail}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      setFailures(data || []);
    } catch (error) {
      console.error("Error loading payment failures:", error);
      toast.error("Failed to load payment failures");
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (failureId: string, userEmail: string) => {
    setSendingReminder(failureId);
    try {
      const { error } = await supabase.functions.invoke('send-payment-reminder', {
        body: { failureId }
      });

      if (error) throw error;

      toast.success(`Reminder email sent to ${userEmail}`);
      await loadFailures();
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder email');
    } finally {
      setSendingReminder(null);
    }
  };

  const getGracePeriodDays = (gracePeriodEnd: string | null) => {
    if (!gracePeriodEnd) return 0;
    const now = new Date();
    const end = new Date(gracePeriodEnd);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canSendReminder = (failure: PaymentFailure) => {
    if (failure.resolved) return false;
    if (!failure.last_reminder_sent_at) return true;
    
    const lastReminderTime = new Date(failure.last_reminder_sent_at).getTime();
    const now = Date.now();
    const hoursSinceLastReminder = (now - lastReminderTime) / (1000 * 60 * 60);
    
    return hoursSinceLastReminder >= 24;
  };

  const getTimeSinceLastReminder = (lastReminderDate: string | null) => {
    if (!lastReminderDate) return null;
    
    const lastTime = new Date(lastReminderDate).getTime();
    const now = Date.now();
    const hoursSince = Math.floor((now - lastTime) / (1000 * 60 * 60));
    
    if (hoursSince < 1) return 'Less than 1 hour ago';
    if (hoursSince < 24) return `${hoursSince} hour${hoursSince !== 1 ? 's' : ''} ago`;
    
    const daysSince = Math.floor(hoursSince / 24);
    return `${daysSince} day${daysSince !== 1 ? 's' : ''} ago`;
  };

  const calculateStats = () => {
    const total = failures.length;
    const unresolved = failures.filter((f) => !f.resolved).length;
    const resolved = failures.filter((f) => f.resolved).length;
    const totalLost = failures
      .filter((f) => !f.resolved)
      .reduce((sum, f) => sum + f.user_subscriptions.monthly_price_cents, 0);

    return { total, unresolved, resolved, totalLost };
  };

  const stats = calculateStats();

  if (loading && failures.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Failed Payments</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage subscription payment failures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total Failures</div>
            <div className="text-2xl font-bold text-foreground mt-1">{stats.total}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Unresolved</div>
            <div className="text-2xl font-bold text-red-400 mt-1">{stats.unresolved}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Resolved</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{stats.resolved}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">At Risk MRR</div>
            <div className="text-2xl font-bold text-orange-400 mt-1">
              ${(stats.totalLost / 100).toFixed(2)}
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

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

            <div>
              <Label htmlFor="email">Search Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="user@example.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Failures Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Block</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Reminders</TableHead>
                <TableHead>Grace Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {failures.length === 0 ? (
                <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No payment failures found
                </TableCell>
                </TableRow>
              ) : (
                failures.map((failure) => {
                  const graceDays = getGracePeriodDays(
                    failure.user_subscriptions.grace_period_end
                  );

                  return (
                    <TableRow key={failure.id}>
                      <TableCell>
                        <div className="font-medium">{failure.profiles.email}</div>
                        <div className="text-xs text-muted-foreground">
                          {failure.user_id.substring(0, 8)}...
                        </div>
                      </TableCell>
                      <TableCell>{failure.user_subscriptions.block_name}</TableCell>
                      <TableCell>
                        ${(failure.user_subscriptions.monthly_price_cents / 100).toFixed(2)}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={failure.failure_reason}>
                          {failure.failure_reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{failure.attempt_count}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="font-mono">
                            {failure.reminder_count || 0}
                          </Badge>
                          {failure.last_reminder_sent_at && (
                            <div className="text-xs text-muted-foreground">
                              {getTimeSinceLastReminder(failure.last_reminder_sent_at)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {graceDays > 0 ? (
                          <Badge
                            variant="outline"
                            className="border-orange-500/30 text-orange-400"
                          >
                            {graceDays} days left
                          </Badge>
                        ) : failure.resolved ? (
                          <span className="text-xs text-muted-foreground">N/A</span>
                        ) : (
                          <Badge variant="destructive">Expired</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {failure.resolved ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            Resolved
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Failed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(failure.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!failure.resolved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendReminder(failure.id, failure.profiles.email)}
                              disabled={sendingReminder === failure.id || !canSendReminder(failure)}
                              title={
                                !canSendReminder(failure) && failure.last_reminder_sent_at
                                  ? `Wait 24 hours between reminders. Last sent: ${getTimeSinceLastReminder(failure.last_reminder_sent_at)}`
                                  : "Send payment reminder"
                              }
                              className={!canSendReminder(failure) ? "opacity-50" : ""}
                            >
                              {sendingReminder === failure.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `https://dashboard.stripe.com/invoices/${failure.stripe_invoice_id}`,
                                "_blank"
                              )
                            }
                            title="View in Stripe"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
