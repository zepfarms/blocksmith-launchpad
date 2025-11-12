import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  useEffect(() => {
    if (data.selectedBlocks.length === 0) {
      navigate("/start");
    }
  }, [data.selectedBlocks, navigate]);

  const saveBusinessData = async (user: any) => {
    console.log('Attempting to save business data:', {
      user_id: user.id,
      business_name: data.businessName || "New Business",
      business_idea: data.businessIdea,
      selected_blocks: data.selectedBlocks
    });

    const { error } = await supabase.from('user_businesses').insert({
      user_id: user.id,
      business_name: data.businessName || "New Business",
      business_idea: data.businessIdea || "New business idea",
      ai_analysis: data.aiAnalysis,
      selected_blocks: data.selectedBlocks,
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
      const redirectUrl = `${window.location.origin}/`;
      
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
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-background pt-24 pb-16">
      <div className="max-w-md mx-auto space-y-8 animate-fade-in w-full">
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
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              inputMode="email"
              name="sb-email"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account & save"
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

        <p className="text-center text-sm text-muted-foreground">
          You only pay when you're ready to launch
        </p>
      </div>
    </section>
  );
};
