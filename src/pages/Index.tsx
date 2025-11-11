import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { WhySection } from "@/components/WhySection";
import { BetaSection } from "@/components/BetaSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ConversationalForm } from "@/components/ConversationalForm";
import { SmartBlockSelector } from "@/components/SmartBlockSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  const ideaInputRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState("");
  const [businessData, setBusinessData] = useState<{
    businessIdea: string;
    aiAnalysis: string;
    experienceLevel?: string;
    additionalContext?: string;
  } | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  const handleHeroCTA = () => {
    ideaInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    setTimeout(() => setShowForm(true), 300);
  };

  const handleFormComplete = (data: {
    businessIdea: string;
    aiAnalysis: string;
    experienceLevel?: string;
    additionalContext?: string;
  }) => {
    setBusinessData(data);
    
    // AI decides recommended blocks based on the analysis
    const recommendedBlocks = getRecommendedBlocks(data);
    setSelectedBlocks(recommendedBlocks);
    
    setShowForm(false);
    setShowBlockSelector(true);
  };

  const getRecommendedBlocks = (data: any): string[] => {
    // Smart AI-driven block recommendations
    const idea = data.businessIdea.toLowerCase();
    const recommended: string[] = [];

    // Always recommend basics
    recommended.push("name-logo", "website");

    // Business type detection
    if (idea.includes("store") || idea.includes("sell") || idea.includes("product")) {
      recommended.push("store-setup", "payments", "products");
    }
    if (idea.includes("service") || idea.includes("consultation") || idea.includes("coaching")) {
      recommended.push("booking-system", "payments");
    }
    if (idea.includes("local") || idea.includes("dog walking") || idea.includes("cleaning")) {
      recommended.push("booking-system", "customer-support", "business-cards");
    }

    // Marketing needs
    if (data.experienceLevel === "first-time" || idea.includes("customers") || idea.includes("marketing")) {
      recommended.push("marketing-plan", "social-media");
    }

    // Legal/admin
    if (idea.includes("new") || idea.includes("start") || data.experienceLevel === "first-time") {
      recommended.push("legal-setup", "ein-irs");
    }

    return recommended;
  };

  const handleBlocksComplete = (blocks: string[]) => {
    setSelectedBlocks(blocks);
    setShowBlockSelector(false);
    // Scroll to email input section
    setTimeout(() => {
      document.getElementById("email-section")?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 100);
  };

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setShowAuthModal(true);
  };

  const handleAuthSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user && businessData) {
      const { error } = await supabase
        .from('user_businesses')
        .insert({
          user_id: session.user.id,
          business_name: "New Business",
          business_idea: businessData.businessIdea,
          ai_analysis: businessData.aiAnalysis,
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
            businessName: "Your Business",
            userName: session.user.email?.split('@')[0]
          }
        });
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
      }

      // Send admin notification
      try {
        await supabase.functions.invoke('send-admin-notification', {
          body: {
            userEmail: session.user.email,
            businessName: "New Business",
            businessIdea: businessData.businessIdea,
            selectedBlocks: selectedBlocks,
            aiAnalysis: businessData.aiAnalysis
          }
        });
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
      }

      toast.success("Welcome! 🎉", {
        description: "Your business is being created.",
      });

      navigate("/dashboard");
    }
  };
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection onCTAClick={handleHeroCTA} />
      
      {/* Conversational Form Section */}
      <section ref={ideaInputRef} className="relative py-16 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background-elevated" />
        
        <div className="relative z-10">
          {!showForm && !showBlockSelector && !businessData && (
            <div className="text-center space-y-6 mb-12 px-4 animate-slide-up-fade">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 sm:w-24 bg-gradient-to-r from-transparent to-neon-cyan/50" />
                <span className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  Not Sure?
                </span>
                <div className="h-px w-12 sm:w-24 bg-gradient-to-l from-transparent to-neon-cyan/50" />
              </div>
              
              <p className="text-2xl sm:text-3xl md:text-4xl font-light text-foreground/90">
                Tell us your idea
              </p>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
                We'll guide you
              </p>
            </div>
          )}
          
          {showForm && <ConversationalForm onComplete={handleFormComplete} />}
          
          {showBlockSelector && (
            <SmartBlockSelector
              recommendedBlockIds={selectedBlocks}
              onComplete={handleBlocksComplete}
            />
          )}
          
          {/* Email Section - Shows after blocks selected */}
          {!showBlockSelector && businessData && !showAuthModal && (
            <div id="email-section" className="max-w-4xl mx-auto animate-slide-up-fade">
              <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-12 space-y-8">
                <div className="space-y-3 text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground">
                    Almost there!
                  </h3>
                  <p className="text-lg text-muted-foreground font-light">
                    Enter your email to create your account
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 text-lg glass-card border-white/10 bg-white/[0.02]"
                    autoFocus
                  />

                  <Button
                    variant="empire"
                    size="xl"
                    onClick={handleEmailSubmit}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground/70">
                  You only pay when you're ready to launch
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <WhySection />
      <BetaSection />
      <Footer />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
        onSuccess={handleAuthSuccess}
        prefillEmail={email}
      />
    </div>
  );
};
export default Index;