import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";
import { Header } from "@/components/Header";

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    // Get user email from session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      } else {
        toast.error("Please log in first");
        navigate("/");
      }
    };
    getUser();
  }, [navigate]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => {
        setCooldownSeconds(cooldownSeconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      // Update profile to mark as verified
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ email_verified: true })
          .eq('id', user.id);
      }

      setVerified(true);
      
      // Trigger confetti celebration
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00FF94', '#00D4FF', '#A78BFA']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00FF94', '#00D4FF', '#A78BFA']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      toast.success("Email verified successfully!");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Verification error:", error);
      toast.error("Failed to verify code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      setResendCount(resendCount + 1);
      
      // Start cooldown after first resend
      if (resendCount >= 0) {
        setCooldownSeconds(60);
      }

      toast.success("Verification code sent! Check your email.");
    } catch (error: any) {
      console.error("Resend error:", error);
      toast.error("Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-background">
        <div className="max-w-md w-full text-center space-y-6 animate-fade-in">
          <CheckCircle2 className="w-16 h-16 mx-auto text-acari-green" />
          <h1 className="text-3xl font-black">Email Verified!</h1>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4 bg-background pt-[72px] sm:pt-[80px]">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-acari-green/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-acari-green" />
            </div>
            <h1 className="text-3xl font-black">Verify Your Email</h1>
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground/80">
                Don't see it? Check your spam or junk folder
              </p>
            </div>
          </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              className="text-center text-2xl tracking-widest font-bold"
              maxLength={6}
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-center">
              Code expires in 10 minutes
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-acari-green text-black hover:bg-acari-green/90 h-12 text-lg font-medium"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={resendLoading || cooldownSeconds > 0}
              className="text-acari-green hover:text-acari-green/80"
            >
              {resendLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : cooldownSeconds > 0 ? (
                `Resend in ${cooldownSeconds}s`
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>
        </form>

        </div>
      </div>
    </>
  );
};