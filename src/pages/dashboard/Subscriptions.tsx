import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard, Calendar, X, AlertCircle, RefreshCcw, ArrowUp, ArrowDown, ShoppingCart } from "lucide-react";
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
  last_payment_status?: string;
  payment_retry_count?: number;
  grace_period_end?: string;
}

export default function Subscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [availableBlocks, setAvailableBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [upgradingId, setUpgradingId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    checkAuth();
    loadSubscriptions();
    loadAvailableBlocks();
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

  const loadAvailableBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_blocks')
        .select('*')
        .eq('block_type', 'internal')
        .eq('pricing_type', 'monthly')
        .order('name');

      if (error) throw error;

      setAvailableBlocks((data || []).map(b => ({
        block_name: b.name,
        price_cents: b.price_cents || 0,
        monthly_price_cents: b.monthly_price_cents || 0,
        pricing_type: b.pricing_type || 'monthly',
        is_free: b.pricing_type === 'free',
        stripe_monthly_price_id: b.stripe_monthly_price_id,
        stripe_product_id: b.stripe_product_id
      })));
    } catch (error) {
      console.error('Error loading available blocks:', error);
    }
  };

  const handleUpgradeDowngrade = async (
    subscriptionId: string,
    currentBlock: string,
    newBlock: string,
    action: 'upgrade' | 'downgrade'
  ) => {
    setUpgradingId(subscriptionId);
    try {
      const { data, error } = await supabase.functions.invoke('update-subscription', {
        body: {
          subscriptionId,
          action,
          newBlockName: newBlock,
        }
      });

      if (error) throw error;

      const prorationAmount = data.prorationAmount / 100;
      const message = prorationAmount > 0
        ? `Subscription ${action}d! You'll be charged $${prorationAmount.toFixed(2)} for the prorated difference.`
        : `Subscription ${action}d! You'll receive a credit of $${Math.abs(prorationAmount).toFixed(2)} on your next invoice.`;

      toast.success(message);
      await loadSubscriptions();
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      toast.error(error.message || 'Failed to update subscription');
    } finally {
      setUpgradingId(null);
    }
  };

  const handleSwitchToOneTime = async (subscriptionId: string, blockName: string) => {
    setUpgradingId(subscriptionId);
    try {
      const { data, error } = await supabase.functions.invoke('update-subscription', {
        body: {
          subscriptionId,
          action: 'switch-to-onetime',
        }
      });

      if (error) throw error;

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (error: any) {
      console.error('Error switching to one-time:', error);
      toast.error(error.message || 'Failed to switch to one-time payment');
      setUpgradingId(null);
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

  const handleUpdatePaymentMethod = async () => {
    setUpdatingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-payment-method');

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening payment portal:', error);
      toast.error('Failed to open payment portal');
      setUpdatingPayment(false);
    }
  };

  const getStatusBadge = (subscription: Subscription) => {
    if (subscription.cancel_at_period_end) {
      return <Badge variant="outline" className="border-orange-500/30 text-orange-400">Cancelling</Badge>;
    }
    
    if (subscription.last_payment_status === 'failed' || subscription.status === 'past_due') {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="w-3 h-3" />
        Payment Failed
      </Badge>;
    }
    
    switch (subscription.status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>;
      case 'cancelled':
      case 'canceled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{subscription.status}</Badge>;
    }
  };

  const getGracePeriodDays = (gracePeriodEnd?: string) => {
    if (!gracePeriodEnd) return 0;
    const now = new Date();
    const end = new Date(gracePeriodEnd);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
            {subscriptions.map((subscription) => {
              const gracePeriodDays = getGracePeriodDays(subscription.grace_period_end);
              const hasPaymentIssue = subscription.last_payment_status === 'failed' || subscription.status === 'past_due';

              return (
                <Card key={subscription.id} className="p-6 border-white/10">
                  {hasPaymentIssue && gracePeriodDays > 0 && (
                    <Alert variant="destructive" className="mb-4 border-red-500/50 bg-red-500/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Payment Failed!</strong> You have {gracePeriodDays} day{gracePeriodDays !== 1 ? 's' : ''} remaining in your grace period.
                        Please update your payment method to continue access.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{subscription.block_name}</h3>
                        {getStatusBadge(subscription)}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-muted-foreground mt-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Next billing: {formatDate(subscription.current_period_end)}</span>
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
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {hasPaymentIssue && (
                      <Button
                        onClick={handleUpdatePaymentMethod}
                        disabled={updatingPayment}
                        className="flex-1 min-w-[200px]"
                      >
                        {updatingPayment ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Opening...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Update Payment Method
                          </>
                        )}
                      </Button>
                    )}

                    {subscription.status === 'active' && !subscription.cancel_at_period_end && !hasPaymentIssue && (
                      <>
                        {/* Upgrade/Switch Options */}
                        {availableBlocks.filter(b => b.block_name !== subscription.block_name).slice(0, 2).map(block => {
                          const isUpgrade = block.monthly_price_cents > subscription.monthly_price_cents;
                          return (
                            <Button
                              key={block.block_name}
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpgradeDowngrade(
                                subscription.stripe_subscription_id,
                                subscription.block_name,
                                block.block_name,
                                isUpgrade ? 'upgrade' : 'downgrade'
                              )}
                              disabled={upgradingId === subscription.id}
                              title={`${isUpgrade ? 'Upgrade' : 'Switch'} to ${block.block_name} - $${(block.monthly_price_cents / 100).toFixed(2)}/mo`}
                            >
                              {upgradingId === subscription.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  {isUpgrade ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                                  {block.block_name.length > 10 ? block.block_name.substring(0, 10) + '...' : block.block_name}
                                </>
                              )}
                            </Button>
                          );
                        })}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSwitchToOneTime(subscription.stripe_subscription_id, subscription.block_name)}
                          disabled={upgradingId === subscription.id}
                          title="Switch to one-time purchase (cancels subscription)"
                        >
                          {upgradingId === subscription.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              One-Time
                            </>
                          )}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelClick(subscription)}
                          disabled={cancellingId === subscription.id}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          {cancellingId === subscription.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
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
