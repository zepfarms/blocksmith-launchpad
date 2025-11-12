import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const Signup = () => {
  const navigate = useNavigate();
  const { data, resetData } = useOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveTriggered, setSaveTriggered] = useState(false);
  const [step, setStep] = useState<"form" | "verify">("form");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendSeconds, setResendSeconds] = useState(60);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (data.selectedBlocks.length === 0) {
      navigate("/start");
    }
  }, [data.selectedBlocks, navigate]);

  useEffect(() => {
    if (step === "verify" && resendSeconds > 0) {
      const t = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, resendSeconds]);
  // When a real session exists (after verification/login), persist pending business data
  useEffect(() => {
    const processPending = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      const pendingRaw = localStorage.getItem("pendingBusinessData");
      if (session?.user && pendingRaw && !saveTriggered) {
        setSaveTriggered(true);
        try {
          const pending = JSON.parse(pendingRaw);
          await supabase.from('user_businesses').select('id').limit(1); // touch to ensure auth ready
          await saveBusinessData(session.user);
          localStorage.removeItem("pendingBusinessData");
        } catch (e) {
          console.error('Deferred save failed:', e);
          setSaveTriggered(false);
        }
      }
    };

    // Subscribe to auth changes and also check immediately
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      processPending();
    });
    processPending();
    return () => subscription.unsubscribe();
  }, [saveTriggered]);

  const saveBusinessData = async (user: any) => {
    console.log('Attempting to save business data:', {
      user_id: user.id,
      business_name: data.businessName || "New Business",
      business_idea: data.businessIdea,
      selected_blocks: data.selectedBlocks
    });

    // Fallback to pending data stored before signup if context is empty
    let source = { ...data } as typeof data;
    try {
      const pendingRaw = localStorage.getItem('pendingBusinessData');
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        source = { ...source, ...pending };
      }
    } catch {}
    // Ensure we have a valid, matching session before inserting (prevents RLS violation)
    const { data: sessionData } = await supabase.auth.getSession();
    const activeUserId = sessionData.session?.user?.id;
    if (!activeUserId || activeUserId !== user.id) {
      console.warn('Skipped insert: no active session or mismatched user.');
      return;
    }

    const { error } = await supabase.from('user_businesses').insert({
      user_id: user.id,
      business_name: source.businessName || "New Business",
      business_idea: source.businessIdea || "New business idea",
      ai_analysis: source.aiAnalysis,
      selected_blocks: source.selectedBlocks,
      status: 'building'
    });

    if (error) {
      console.error('Database insert error:', error);
      toast.error("We couldn't save your business information. Please try again.");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const authHeader = session?.access_token ? {
      Authorization: `Bearer ${session.access_token}`
    } : undefined;

    // Send welcome email
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: user.email,
          businessName: data.businessName || "Your Business",
          userName: user.email?.split('@')[0]
        },
        headers: authHeader
      });
    } catch (emailError) {
      // Silently fail - email is not critical
    }

    // Send admin notification
    try {
      const { error: notificationError } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          userEmail: user.email,
          businessName: data.businessName || "New Business",
          businessIdea: data.businessIdea,
          selectedBlocks: data.selectedBlocks,
          aiAnalysis: data.aiAnalysis
        },
        headers: authHeader
      });
      
      if (notificationError) {
        console.error('Admin notification failed:', notificationError);
      }
    } catch (emailError) {
      console.error('Admin notification exception:', emailError);
    }

    resetData();
    navigate("/dashboard");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Persist onboarding info for deferred save after verification/login
      try {
        localStorage.setItem('pendingBusinessData', JSON.stringify({
          businessName: data.businessName || "New Business",
          businessIdea: data.businessIdea || "",
          aiAnalysis: data.aiAnalysis || "",
          selectedBlocks: data.selectedBlocks
        }));
      } catch {}

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setVerificationEmail(email);
      setStep("verify");
      setResendSeconds(60);
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      const targetEmail = verificationEmail || email;
      const { data: verifyData, error } = await supabase.auth.verifyOtp({
        email: targetEmail,
        token: code,
        type: 'signup',
      });
      if (error) throw error;

      // After verification, set the password
      const { error: pwError } = await supabase.auth.updateUser({ password });
      if (pwError) throw pwError;
      // Auth listener above will pick up the new session and save pending business data
    } catch (error: any) {
      toast.error(error.message || "Invalid or expired code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0) return;
    setResending(true);
    try {
      const targetEmail = verificationEmail || email;
      const { error } = await supabase.auth.resend({ type: 'signup', email: targetEmail });
      if (error) throw error;
      setResendSeconds(60);
    } catch (error: any) {
      toast.error(error.message || "Could not resend code");
    } finally {
      setResending(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background pt-24 pb-16">
      <div className="max-w-md mx-auto space-y-8 animate-fade-in w-full">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            {step === "verify" ? "Verify your email" : "Create your account"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {step === "verify"
              ? `Enter the 6-digit code we emailed to ${verificationEmail || email}`
              : "Almost there! Create an account to save your business plan"}
          </p>
        </div>

          {step === "verify" ? (
            <form onSubmit={handleVerify} className="space-y-6" autoComplete="off" noValidate>
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={code} onChange={setCode}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-12 w-12 text-xl" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Continue"
                )}
              </button>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="w-full px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendSeconds > 0 || resending}
                  className="w-full px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {resending ? "Sending..." : resendSeconds > 0 ? `Resend in ${resendSeconds}s` : "Resend code"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4" autoComplete="off" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="bg-background/50"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="email"
                  name="sb-email"
                  data-form-type="other"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-background/50 pr-10"
                    autoComplete="new-password"
                    name="sb-pass"
                    data-form-type="other"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-background/50"
                  autoComplete="new-password"
                  name="sb-pass-confirm"
                  data-form-type="other"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/start/blocks")}
                className="w-full px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Back
              </button>
            </form>
          )}

        <p className="text-center text-sm text-muted-foreground">
          You only pay when you're ready to launch
        </p>
      </div>
    </section>
  );
};
