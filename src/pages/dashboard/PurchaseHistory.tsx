import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Purchase {
  id: string;
  block_name: string;
  price_paid_cents: number;
  purchased_at: string;
  pricing_type: string;
  stripe_payment_intent_id?: string;
}

interface Subscription {
  id: string;
  block_name: string;
  monthly_price_cents: number;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  cancel_at_period_end: boolean;
}

export const PurchaseHistory = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseHistory();
  }, []);

  const loadPurchaseHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/");
        return;
      }

      // Load one-time purchases
      const { data: purchasesData, error: purchasesError } = await supabase
        .from("user_block_purchases")
        .select("*")
        .eq("user_id", user.id)
        .order("purchased_at", { ascending: false });

      if (purchasesError) throw purchasesError;

      // Load subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (subscriptionsError) throw subscriptionsError;

      setPurchases(purchasesData || []);
      setSubscriptions(subscriptionsData || []);
    } catch (error) {
      console.error("Error loading purchase history:", error);
      toast({
        title: "Error",
        description: "Failed to load purchase history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      past_due: "destructive",
      canceled: "secondary",
      canceling: "secondary",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-muted-foreground">Loading purchase history...</p>
        </div>
      </div>
    );
  }

  const totalSpent = purchases.reduce((sum, p) => sum + p.price_paid_cents, 0);
  const monthlyCommitment = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.monthly_price_cents, 0);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Purchase History</h1>
            <p className="text-muted-foreground mt-2">
              View all your purchases and subscriptions
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalSpent)}</div>
              <p className="text-xs text-muted-foreground">
                From {purchases.length} one-time purchase{purchases.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Commitment</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(monthlyCommitment)}/mo</div>
              <p className="text-xs text-muted-foreground">
                {subscriptions.filter(s => s.status === 'active').length} active subscription{subscriptions.filter(s => s.status === 'active').length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* One-Time Purchases */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">One-Time Purchases</h2>
          {purchases.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No one-time purchases yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{purchase.block_name}</CardTitle>
                        <CardDescription>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4" />
                            {formatDate(purchase.purchased_at)}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {formatPrice(purchase.price_paid_cents)}
                        </div>
                        <Badge variant="secondary" className="mt-2">
                          ONE-TIME
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  {purchase.stripe_payment_intent_id && (
                    <CardContent>
                      <Separator className="mb-4" />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CreditCard className="h-4 w-4" />
                        Payment ID: {purchase.stripe_payment_intent_id.substring(0, 20)}...
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Subscriptions */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Subscriptions</h2>
          {subscriptions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No subscriptions yet</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/dashboard/app-store")}
                >
                  Browse Monthly Blocks
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((subscription) => (
                <Card key={subscription.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{subscription.block_name}</CardTitle>
                          {getStatusBadge(subscription.status)}
                        </div>
                        <CardDescription>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4" />
                              Started {formatDate(subscription.created_at)}
                            </div>
                            {subscription.status === 'active' && (
                              <div className="text-sm">
                                Next billing: {formatDate(subscription.current_period_end)}
                              </div>
                            )}
                            {subscription.cancel_at_period_end && (
                              <div className="text-sm text-destructive">
                                Cancels on {formatDate(subscription.current_period_end)}
                              </div>
                            )}
                          </div>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">
                          {formatPrice(subscription.monthly_price_cents)}
                        </div>
                        <p className="text-sm text-muted-foreground">per month</p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate("/dashboard/app-store")}>
            Browse More Blocks
          </Button>
          <Button variant="outline" onClick={() => navigate("/dashboard/subscriptions")}>
            Manage Subscriptions
          </Button>
        </div>
      </div>
    </div>
  );
};
