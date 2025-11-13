import { useState } from "react";
import { X, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface VerificationBannerProps {
  email: string;
  onDismiss: () => void;
  onVerified: () => void;
}

export const VerificationBanner = ({ email, onDismiss, onVerified }: VerificationBannerProps) => {
  const navigate = useNavigate();
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-verification-email", {
        body: { email },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Verification code sent! Check your email.");
      setShowCodeInput(true);
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-email", {
        body: { email, code },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Email verified successfully!");
      onVerified();
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-acari-green/10 border-b border-acari-green/20 py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Mail className="w-5 h-5 text-acari-green flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Please verify your email to unlock all features
            </p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {showCodeInput ? (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit code"
                className="w-32 h-9 text-center"
                maxLength={6}
              />
              <Button
                size="sm"
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="bg-acari-green text-black hover:bg-acari-green/90"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
              </Button>
            </div>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleResend}
                disabled={resendLoading}
                className="border-acari-green/30 hover:bg-acari-green/10"
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Send Code"
                )}
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/verify-email")}
                className="bg-acari-green text-black hover:bg-acari-green/90"
              >
                Verify Now
              </Button>
            </>
          )}
          <button
            onClick={onDismiss}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};