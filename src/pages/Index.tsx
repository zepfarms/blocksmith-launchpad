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
      
      
      <div id="business-ideas">
        <BetaSection />
      </div>
      <Footer />

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} defaultView="signup" onSuccess={handleAuthSuccess} />
    </div>;
};
export default Index;