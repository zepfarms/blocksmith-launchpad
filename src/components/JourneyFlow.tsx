import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Sparkles, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthModal } from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface JourneyFlowProps {
  onComplete: (data: { name: string; vision: string; industry: string }) => void;
  onBack: () => void;
}

const blocks = [
  "Everything",
  "Logo", 
  "Website",
  "Domain",
  "Emails",
  "Store Setup",
  "Legal",
  "Social Media",
  "Marketing"
];

export const JourneyFlow = ({ onComplete, onBack }: JourneyFlowProps) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    name: "",
    vision: "",
    industry: "",
  });
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analysisConfirmed, setAnalysisConfirmed] = useState(false);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/dashboard");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleNext = async () => {
    if (step === 1 && !data.name.trim()) {
      toast.error("Please enter your business name");
      return;
    }
    
    if (step === 2 && !data.vision.trim()) {
      toast.error("Share your idea with us");
      return;
    }

    if (step === 2) {
      // Set static confirmation message
      setAiAnalysis("Perfect! It seems like you have a solid idea.");
      setStep(3);
      return;
    }

    if (step === 3 && !analysisConfirmed) {
      toast.error("Please confirm if this looks right");
      return;
    }

    if (step === 4 && selectedBlocks.length === 0) {
      toast.error("Please select at least one block");
      return;
    }

    if (step === 5 && !email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (step === 5) {
      // Show auth modal to create account
      setShowAuthModal(true);
      return;
    }

    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleAuthSuccess = async () => {
    // Save business data after successful signup
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { error } = await supabase
        .from('user_businesses')
        .insert({
          user_id: session.user.id,
          business_name: data.name,
          business_idea: data.vision,
          ai_analysis: aiAnalysis,
          selected_blocks: selectedBlocks,
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
            email: session.user.email,
            businessName: data.name,
            userName: data.name
          }
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't block signup if email fails
      }

      // Send admin notification
      try {
        await supabase.functions.invoke('send-admin-notification', {
          body: {
            userEmail: session.user.email,
            businessName: data.name,
            businessIdea: data.vision,
            selectedBlocks: selectedBlocks,
            aiAnalysis: aiAnalysis
          }
        });
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
        // Don't block signup if notification fails
      }

      toast.success("Welcome! 🎉", {
        description: "Your business is being created.",
      });

      // Navigate to dashboard
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      if (step === 3) {
        setAnalysisConfirmed(false);
      }
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const toggleBlock = (block: string) => {
    setSelectedBlocks(prev => 
      prev.includes(block) 
        ? prev.filter(b => b !== block)
        : [...prev, block]
    );
  };

  const totalSteps = 5;

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] rounded-full bg-neon-cyan/20 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] rounded-full bg-electric-indigo/20 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 w-full max-w-3xl space-y-12 animate-slide-up-fade">
        {/* Progress indicator */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-electric-indigo transition-all duration-500 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="glass-card p-12 rounded-3xl border border-neon-cyan/20 space-y-8">
          {/* Step 1: Business Name */}
          {step === 1 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-semibold">Getting Started</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Name Your</span>
                <span className="block bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
                  Business
                </span>
              </h2>

              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                What will you call your business?
              </p>

              <Input
                type="text"
                placeholder="Enter your business name..."
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="h-16 text-lg rounded-2xl glass-card border-white/10 bg-white/[0.02] text-foreground placeholder:text-muted-foreground focus:border-neon-cyan/30 transition-all"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Idea/Vision */}
          {step === 2 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-electric-indigo/10 border border-electric-indigo/30">
                <Sparkles className="w-4 h-4 text-electric-indigo" />
                <span className="text-sm font-semibold">Your Idea</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Tell us about</span>
                <span className="block bg-gradient-to-r from-electric-indigo to-neon-purple bg-clip-text text-transparent">
                  your idea
                </span>
              </h2>

              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                What do you want to build? Who will you help?
              </p>

              <textarea
                placeholder="Describe your business idea..."
                value={data.vision}
                onChange={(e) => setData({ ...data, vision: e.target.value })}
                className="w-full h-40 p-6 text-lg rounded-2xl glass-card border border-white/10 bg-white/[0.02] text-foreground placeholder:text-muted-foreground focus:border-electric-indigo/30 transition-all resize-none"
                autoFocus
              />
            </div>
          )}

          {/* Step 3: AI Analysis & Confirmation */}
          {step === 3 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-sm font-semibold">AI Analysis</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Here's what</span>
                <span className="block bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  we understand
                </span>
              </h2>

              <div className="p-6 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/20">
                <p className="text-xl text-foreground font-light leading-relaxed">
                  {aiAnalysis}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-lg text-muted-foreground font-light">
                  Does this look right?
                </p>
                <div className="flex gap-4">
                  <Button
                    variant={analysisConfirmed ? "neon" : "glass"}
                    onClick={() => setAnalysisConfirmed(true)}
                    className="flex-1"
                  >
                    Yes, that's right!
                  </Button>
                  <Button
                    variant="glass"
                    onClick={() => {
                      setStep(2);
                      setAnalysisConfirmed(false);
                    }}
                    className="flex-1"
                  >
                    Let me edit
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Choose Blocks */}
          {step === 4 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
                <Sparkles className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm font-semibold">Choose Blocks</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Pick the blocks</span>
                <span className="block bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
                  you need help with
                </span>
              </h2>

              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Start simple — you can add more blocks anytime.
              </p>

              {/* Reassurance text */}
              <div className="p-4 rounded-2xl glass-card border border-neon-cyan/10">
                <p className="text-sm text-muted-foreground/80 text-center font-light">
                  Select what you want. We build it. You only pay when you launch.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {blocks.map((block) => (
                  <button
                    key={block}
                    onClick={() => toggleBlock(block)}
                    className={cn(
                      "p-5 rounded-2xl text-center transition-all duration-300",
                      "border glass-card-hover font-semibold",
                      selectedBlocks.includes(block)
                        ? "border-neon-cyan/50 bg-neon-cyan/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                        : "border-white/10 hover:border-neon-cyan/20"
                    )}
                  >
                    {block}
                  </button>
                ))}
              </div>

              {selectedBlocks.length > 0 && (
                <p className="text-sm text-muted-foreground/60 text-center">
                  {selectedBlocks.length} block{selectedBlocks.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>
          )}

          {/* Step 5: Email Signup */}
          {step === 5 && (
            <div className="space-y-6 animate-scale-in">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30">
                <Rocket className="w-4 h-4 text-neon-purple" />
                <span className="text-sm font-semibold">Almost There</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Get</span>
                <span className="block bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
                  Early Access
                </span>
              </h2>

              <p className="text-xl text-muted-foreground font-light leading-relaxed">
                Join the first 100 entrepreneurs. We'll be in touch soon!
              </p>

              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-16 text-lg rounded-2xl glass-card border-white/10 bg-white/[0.02] text-foreground placeholder:text-muted-foreground focus:border-neon-purple/30 transition-all"
                autoFocus
              />

              <div className="p-4 rounded-2xl bg-neon-cyan/5 border border-neon-cyan/20">
                <p className="text-sm text-muted-foreground font-light">
                  ✓ Priority access<br />
                  ✓ Real human help<br />
                  ✓ Special pricing
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between pt-8">
            <Button
              variant="glass"
              size="lg"
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Button>

            <Button
              variant={step === 5 ? "empire" : "neon"}
              size="lg"
              onClick={handleNext}
              className="gap-2"
            >
              {step === 5 ? (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Helper text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground/60">
            Tell us your idea. Pick your blocks. We build it with you.
          </p>
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
