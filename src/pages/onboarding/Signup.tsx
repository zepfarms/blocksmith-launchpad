import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const Signup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, resetData } = useOnboarding();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Check if returning from successful payment
    if (searchParams.get('payment_success') === 'true') {
      setPaymentSuccess(true);
      toast.success('Payment successful! Your blocks have been unlocked.');
    }
    
    if (data.selectedBlocks.length === 0) {
      navigate("/start");
    }
  }, [data.selectedBlocks, navigate, searchParams]);

  const saveBusinessData = async (user: any) => {
    const { error } = await supabase.from('user_businesses').insert({
      user_id: user.id,
      business_name: data.businessName || "New Business",
      business_idea: data.businessIdea,
      ai_analysis: data.aiAnalysis,
      selected_blocks: data.selectedBlocks,
      business_type: data.businessType || null,
      status: 'building'
    });

    if (error) {
      console.error('Error saving business data:', error);
      toast.error("We couldn't save your business information. Please try again.");
      return;
    }

    // Send welcome email
    try {
      await supabase.functions.invoke('send-welcome-email', {
        body: {
          email: user.email,
          businessName: data.businessName || "Your Business",
          userName: user.email?.split('@')[0]
        }
      });
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
    }

    // Send admin notification
    try {
      await supabase.functions.invoke('send-admin-notification', {
        body: {
          userEmail: user.email,
          businessName: data.businessName || "New Business",
          businessIdea: data.businessIdea,
          selectedBlocks: data.selectedBlocks,
          aiAnalysis: data.aiAnalysis
        }
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
    }

    resetData();
    // DO NOT navigate to dashboard here - user needs to verify email first
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms and Conditions");
      return;
    }
    
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
      const redirectUrl = `${window.location.origin}/verify-email`;
      
      const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      if (authData.user) {
        await saveBusinessData(authData.user);
        
        // Navigate to verify-email immediately to prevent flicker
        toast.success("Account created! Check your email for verification code.");
        navigate("/verify-email");
        
        // Send verification email in background (fire-and-forget)
        supabase.functions.invoke('send-verification-email', {
          body: { email: authData.user.email }
        }).catch(error => {
          console.error('Error sending verification email:', error);
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background">
      <div className="max-w-md mx-auto space-y-8 animate-fade-in w-full">
        {/* Payment Success Banner */}
        {paymentSuccess && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-400">Payment Successful!</p>
              <p className="text-sm text-muted-foreground">Your blocks have been unlocked</p>
            </div>
          </div>
        )}
        
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Create your account
          </h2>
          <p className="text-lg text-muted-foreground">
            Almost there! Create an account to save your business plan
          </p>
        </div>

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
                  autoComplete="new-email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="email"
                  name="sb-signup-email"
                  data-1p-ignore="true"
                  data-lpignore="true"
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
            />
          </div>

          <div className="flex items-start gap-3 py-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I agree to the{" "}
              <Link 
                to="/terms" 
                target="_blank"
                className="text-neon-cyan hover:underline"
              >
                Terms and Conditions
              </Link>
            </Label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-8 sm:px-10 py-4 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Create account & save
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/start/blocks")}
            className="w-full px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-base sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Back
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          You only pay when you're ready to launch
        </p>
      </div>
    </section>
  );
};
