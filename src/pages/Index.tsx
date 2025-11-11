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
  const [businessData, setBusinessData] = useState<{
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
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
    selectedIdeaRow?: any;
  }) => {
    setBusinessData(data);
    setShowForm(false);
    setShowBlockSelector(true);

    // Scroll to block selector
    setTimeout(() => {
      const blockSelector = document.getElementById('block-selector');
      if (blockSelector) {
        blockSelector.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };
  const handleBlocksComplete = (blocks: string[]) => {
    setSelectedBlocks(blocks);
    setShowBlockSelector(false);
    setShowAuthModal(true);
  };
  const handleAuthSuccess = async () => {
    const {
      data: {
        session
      }
    } = await supabase.auth.getSession();
    if (session?.user && businessData) {
      const {
        error
      } = await supabase.from('user_businesses').insert({
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
        description: "Your business is being created."
      });
      navigate("/dashboard");
    }
  };
  return <div className="min-h-screen">
      <Header />
      <HeroSection onCTAClick={handleHeroCTA} />
      
      {/* Conversational Form Section */}
      <section ref={ideaInputRef} className="relative py-16 px-4 sm:px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background-elevated" />
        
        <div className="relative z-10">
          {!showForm && !showBlockSelector && !businessData && <div className="text-center space-y-6 mb-12 px-4 animate-slide-up-fade">
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
            </div>}
          
          {showForm && (
            <ConversationalForm onComplete={handleFormComplete} />
          )}
          
          {showBlockSelector && businessData && <div id="block-selector">
              <SmartBlockSelector starterBlocks={businessData.selectedIdeaRow?.starter_blocks || ""} growthBlocks={businessData.selectedIdeaRow?.growth_blocks || ""} onComplete={handleBlocksComplete} />
            </div>}
        </div>
      </section>
      
      <div id="business-ideas">
        <BetaSection />
      </div>
      <Footer />

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} defaultView="signup" onSuccess={handleAuthSuccess} />
    </div>;
};
export default Index;