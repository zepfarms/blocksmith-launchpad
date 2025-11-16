import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface BlockPricing {
  block_name: string;
  price_cents: number;
  monthly_price_cents: number;
  pricing_type: string;
  is_free: boolean;
  description: string | null;
}

export const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [blocks, setBlocks] = useState<BlockPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const loadBlocks = async () => {
      const blockNames = searchParams.get('blocks')?.split(',') || [];
      
      if (blockNames.length === 0) {
        navigate('/start/blocks');
        return;
      }

      const { data, error } = await supabase
        .from('affiliate_blocks')
        .select('*')
        .in('name', blockNames)
        .eq('block_type', 'internal')
        .eq('pricing_type', 'one_time');

      if (error) {
        console.error('Error loading blocks:', error);
        toast.error('Failed to load blocks');
        navigate('/start/blocks');
        return;
      }

      // Filter only paid one-time blocks
      const paidBlocks = data?.filter(b => b.price_cents && b.price_cents > 0) || [];
      
      if (paidBlocks.length === 0) {
        toast.error('No paid blocks selected');
        navigate('/start/blocks');
        return;
      }

      setBlocks(paidBlocks.map(b => ({
        block_name: b.name,
        price_cents: b.price_cents || 0,
        monthly_price_cents: b.monthly_price_cents || 0,
        pricing_type: b.pricing_type || 'one_time',
        is_free: b.pricing_type === 'free',
        stripe_price_id: b.stripe_price_id,
        stripe_product_id: b.stripe_product_id,
        description: b.description
      })));
      setLoading(false);
    };

    loadBlocks();
  }, [searchParams, navigate]);

  const handleCheckout = async () => {
    setProcessingPayment(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please sign in to continue');
        navigate('/start/signup');
        return;
      }

      const blockNames = blocks.map(b => b.block_name);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { blockNames }
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to create checkout session');
      setProcessingPayment(false);
    }
  };

  const totalCents = blocks.reduce((sum, block) => sum + block.price_cents, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-purple">
              Checkout
            </h1>
            <p className="text-muted-foreground">Review your selected blocks</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            
            {blocks.map((block) => (
              <Card key={block.block_name} className="p-4 border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{block.block_name}</h3>
                      <Badge variant="outline" className="text-neon-cyan border-neon-cyan/30">
                        One-time
                      </Badge>
                    </div>
                    {block.description && (
                      <p className="text-sm text-muted-foreground">{block.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${(block.price_cents / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Payment Summary */}
          <div className="md:col-span-1">
            <Card className="p-6 border-white/10 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(totalCents / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-neon-cyan">${(totalCents / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={processingPayment}
                className="w-full neon-border bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 hover:from-neon-cyan/30 hover:to-neon-purple/30"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Proceed to Payment
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure payment powered by Stripe
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
