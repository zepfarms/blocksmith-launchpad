import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultView?: "login" | "signup";
  onSuccess?: () => void;
  prefillEmail?: string;
}

export const AuthModal = ({ open, onClose, defaultView = "login", onSuccess, prefillEmail = "" }: AuthModalProps) => {
  const [view, setView] = useState<"login" | "signup" | "forgot-password" | "verify-email">(defaultView);
  const [email, setEmail] = useState(prefillEmail);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data?.user && !data.user.email_confirmed_at) {
      toast({
        title: "Email not verified",
        description: "Please verify your email first.",
        variant: "destructive",
      });
      return;
    }

    navigate('/dashboard');
    onSuccess?.();
    onClose();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setLoading(false);
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    // Send verification email
    const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
      body: { email }
    });

    setLoading(false);

    if (emailError) {
      console.error('Failed to send verification email:', emailError);
      toast({
        title: "Warning",
        description: "Account created but verification email failed to send. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    setPendingEmail(email);
    setView("verify-email");
    toast({
      title: "Check your email",
      description: "We sent you a 6-digit verification code.",
    });
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Use custom verify-email edge function instead of Supabase's verifyOtp
    const { data, error } = await supabase.functions.invoke('verify-email', {
      body: { 
        email: pendingEmail,
        code: verificationCode 
      }
    });

    setLoading(false);

    if (error || data?.error) {
      toast({
        title: "Verification failed",
        description: error?.message || data?.error || "Invalid verification code",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email verified!",
      description: "Your account is now active.",
    });
    
    navigate('/dashboard');
    onSuccess?.();
    onClose();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Password reset failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Check your email",
      description: "We sent you a password reset link.",
    });
    setView("login");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-white/10" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {view === "login" ? "Welcome back" : view === "signup" ? "Create your account" : view === "verify-email" ? "Verify your email" : "Reset password"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={view === "login" ? handleLogin : view === "signup" ? handleSignup : view === "verify-email" ? handleVerifyEmail : handleForgotPassword} className="space-y-4" autoComplete="off" noValidate>
          {view !== "verify-email" && (
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
                autoComplete="new-password"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                name="sb-email-unique"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
              />
            </div>
          )}

          {view === "verify-email" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                We sent a 6-digit code to <span className="font-semibold text-foreground">{pendingEmail}</span>
              </p>
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="bg-background/50 text-center text-2xl tracking-widest font-mono"
                  autoComplete="off"
                  inputMode="numeric"
                />
              </div>
            </div>
          )}

          {view !== "forgot-password" && view !== "verify-email" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 pr-10"
                  autoComplete="new-password"
                  name="sb-password-unique"
                  data-form-type="other"
                  data-lpignore="true"
                  data-1p-ignore="true"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {view === "login" && (
                <button
                  type="button"
                  onClick={() => setView("forgot-password")}
                  className="text-xs text-neon-cyan hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
          )}

          {view === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-background/50"
                  autoComplete="off"
                  name="sb-confirm-password-unique"
                  data-form-type="other"
                />
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Please wait..." : view === "login" ? "Log in" : view === "signup" ? "Create account" : view === "verify-email" ? "Verify Email" : "Send reset link"}
          </Button>

          {view !== "forgot-password" && view !== "verify-email" && (
            <div className="text-center text-sm">
              {view === "login" ? (
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("signup")}
                    className="text-neon-cyan hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setView("login")}
                    className="text-neon-cyan hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          )}

          {view === "forgot-password" && (
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-neon-cyan hover:underline"
              >
                Back to login
              </button>
            </div>
          )}

          {view === "verify-email" && (
            <div className="text-center text-sm">
              <p className="text-muted-foreground mb-2">Didn't receive the code?</p>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  await supabase.auth.resend({
                    type: 'signup',
                    email: pendingEmail,
                  });
                  setLoading(false);
                  toast({
                    title: "Code resent",
                    description: "Check your email for a new code.",
                  });
                }}
                className="text-neon-cyan hover:underline"
                disabled={loading}
              >
                Resend code
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
