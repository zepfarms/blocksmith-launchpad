import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Subscription {
  id: string;
  block_name: string;
  stripe_subscription_id: string;
  status: string;
  monthly_price_cents: number;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    checkAuth();
    loadSubscriptions();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/');
    }
  };

  const loadSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (subscription: Subscription) => {
    setSelectedSubscription(subscription);
    setShowCancelDialog(true);
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscription) return;

    setCancellingId(selectedSubscription.id);
    
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId: selectedSubscription.stripe_subscription_id }
      });

      if (error) throw error;

      toast.success('Subscription cancelled. Access will continue until the end of the billing period.');
      loadSubscriptions();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setCancellingId(null);
      setShowCancelDialog(false);
      setSelectedSubscription(null);
    }
  };

  const getStatusBadge = (status: string, cancelAtPeriodEnd: boolean) => {
    if (cancelAtPeriodEnd) {
      return <Badge variant="outline" className="border-orange-500/30 text-orange-400">Cancelling</Badge>;
    }
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>;
      case 'cancelled':
      case 'canceled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const totalMonthly = subscriptions
    .filter(s => s.status === 'active' && !s.cancel_at_period_end)
    .reduce((sum, s) => sum + s.monthly_price_cents, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
              My Subscriptions
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your monthly block subscriptions
            </p>
          </div>
          <Button onClick={() => navigate('/dashboard/app-store')}>
            Browse Blocks
          </Button>
        </div>

        {/* Summary Card */}
        {totalMonthly > 0 && (
          <Card className="p-6 border-white/10 bg-gradient-to-br from-neon-cyan/5 to-neon-purple/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Monthly Cost</p>
                <p className="text-3xl font-bold text-neon-cyan">
                  ${(totalMonthly / 100).toFixed(2)}/mo
                </p>
              </div>
              <CreditCard className="h-12 w-12 text-neon-cyan/50" />
            </div>
          </Card>
        )}

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <Card className="p-12 text-center border-white/10">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Active Subscriptions</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to monthly blocks to unlock ongoing features and updates
            </p>
            <Button onClick={() => navigate('/dashboard/app-store')}>
              Browse Available Blocks
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className="p-6 border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{subscription.block_name}</h3>
                      {getStatusBadge(subscription.status, subscription.cancel_at_period_end)}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Next billing: {formatDate(subscription.current_period_end)}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">
                          ${(subscription.monthly_price_cents / 100).toFixed(2)}
                        </span>
                        /month
                      </div>
                    </div>

                    {subscription.cancel_at_period_end && (
                      <div className="mt-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <p className="text-sm text-orange-400">
                          This subscription will end on {formatDate(subscription.current_period_end)}. 
                          You'll have access until then.
                        </p>
                      </div>
                    )}
                  </div>

                  {subscription.status === 'active' && !subscription.cancel_at_period_end && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelClick(subscription)}
                      disabled={cancellingId === subscription.id}
                      className="gap-2"
                    >
                      {cancellingId === subscription.id ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Cancel
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel your subscription to <strong>{selectedSubscription?.block_name}</strong>?
                <br /><br />
                You'll continue to have access until the end of your current billing period on{' '}
                {selectedSubscription && formatDate(selectedSubscription.current_period_end)}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction onClick={handleCancelSubscription}>
                Yes, Cancel Subscription
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
