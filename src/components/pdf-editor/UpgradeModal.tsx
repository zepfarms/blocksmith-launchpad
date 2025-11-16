import { useState } from "react";
import { Crown, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeModal({ open, onOpenChange }: UpgradeModalProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (type: "monthly" | "lifetime") => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to upgrade",
        });
        return;
      }

      // Get the PDF Editor block
      const { data: block } = await supabase
        .from("affiliate_blocks")
        .select("*")
        .eq("name", "PDF Editor")
        .single();

      if (!block) throw new Error("PDF Editor not found");

      if (type === "monthly") {
        // Create subscription checkout
        const { data, error } = await supabase.functions.invoke(
          "create-subscription-checkout",
          {
            body: {
              blockName: "PDF Editor",
              successUrl: `${window.location.origin}/dashboard/pdf-editor?success=true`,
              cancelUrl: `${window.location.origin}/dashboard/pdf-editor`,
            },
          }
        );

        if (error) throw error;
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        // Create one-time payment checkout
        const { data, error } = await supabase.functions.invoke(
          "create-checkout-session",
          {
            body: {
              blockName: "PDF Editor",
              businessId: user.id, // Using user ID as business ID for simplicity
              successUrl: `${window.location.origin}/dashboard/pdf-editor?success=true`,
              cancelUrl: `${window.location.origin}/dashboard/pdf-editor`,
            },
          }
        );

        if (error) throw error;
        if (data.sessionId) {
          window.location.href = data.url;
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upgrade failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Upgrade to Unlimited Editing
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <p className="text-muted-foreground">
            You've used all 3 free edits. Upgrade to continue editing PDFs with unlimited access.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground">Monthly</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground">$5</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited PDF edits</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>All editing tools</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Cancel anytime</span>
                </li>
              </ul>

              <Button
                onClick={() => handleUpgrade("monthly")}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                Subscribe Monthly
              </Button>
            </div>

            <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Best Value
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground">Lifetime</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-foreground">$29</span>
                  <span className="text-muted-foreground"> once</span>
                </div>
              </div>

              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Unlimited PDF edits</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>All editing tools</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Pay once, use forever</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Priority support</span>
                </li>
              </ul>

              <Button
                onClick={() => handleUpgrade("lifetime")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Processing..." : "Buy Lifetime Access"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
