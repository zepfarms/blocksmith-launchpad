import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BetaSection } from "@/components/BetaSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StartBuildingModal } from "@/components/StartBuildingModal";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingBusinessData, setPendingBusinessData] = useState<{
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
    businessName?: string;
    selectedBlocks?: string[];
  } | null>(null);

  const handleHeroCTA = () => {
    setShowModal(true);
  };

  const saveBusinessData = async (data: {
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
    businessName?: string;
    selectedBlocks?: string[];
  }, user: any) => {
    const { error } = await supabase.from('user_businesses').insert({
      user_id: user.id,
      business_name: data.businessName || "New Business",
      business_idea: data.businessIdea,
      ai_analysis: data.aiAnalysis,
      selected_blocks: data.selectedBlocks || [],
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
          businessName: "Your Business",
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
          businessName: "New Business",
          businessIdea: data.businessIdea,
          selectedBlocks: [],
          aiAnalysis: data.aiAnalysis
        }
      });
    } catch (emailError) {
      console.error('Error sending admin notification:', emailError);
    }

    toast.success("Welcome! 🎉", {
      description: "Your business is being created."
    });
    navigate("/dashboard");
  };

  const handleFormComplete = async (data: {
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
    businessName?: string;
    selectedBlocks?: string[];
  }) => {
    setShowModal(false);
    
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      // Store the data and show auth modal
      setPendingBusinessData(data);
      setShowAuthModal(true);
      return;
    }

    // Save business data if user is logged in
    await saveBusinessData(data, session.user);
  };

  const handleAuthSuccess = async () => {
    if (pendingBusinessData) {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      
      if (session?.user) {
        await saveBusinessData(pendingBusinessData, session.user);
        setPendingBusinessData(null);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection 
        onCTAClick={handleHeroCTA} 
        onSignInClick={() => setShowAuthModal(true)}
      />
      
      <div id="business-ideas">
        <BetaSection />
      </div>
      
      <Footer />

      <StartBuildingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleFormComplete}
      />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};
export default Index;
