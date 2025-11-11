import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BetaSection } from "@/components/BetaSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StartBuildingModal } from "@/components/StartBuildingModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleHeroCTA = () => {
    setShowModal(true);
  };

  const handleFormComplete = async (data: {
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
  }) => {
    setShowModal(false);
    
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session?.user) {
      navigate("/");
      return;
    }

    const { error } = await supabase.from('user_businesses').insert({
      user_id: session.user.id,
      business_name: "New Business",
      business_idea: data.businessIdea,
      ai_analysis: data.aiAnalysis,
      selected_blocks: [],
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
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection onCTAClick={handleHeroCTA} />
      
      <div id="business-ideas">
        <BetaSection />
      </div>
      
      <Footer />

      <StartBuildingModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onComplete={handleFormComplete}
      />
    </div>
  );
};
export default Index;