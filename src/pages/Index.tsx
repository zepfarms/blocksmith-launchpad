import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import AcariCapabilitiesSection from "@/components/AcariCapabilitiesSection";
import { IdeaToLaunchFlow } from "@/components/IdeaToLaunchFlow";
import { GrantSection } from "@/components/GrantSection";
import { BetaSection } from "@/components/BetaSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FeaturedTemplates } from "@/components/templates/FeaturedTemplates";
import { AuthModal } from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleHeroCTA = () => {
    navigate("/start");
  };

  const handleAuthSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Save minimal business data for homepage signups
      const { error } = await supabase
        .from('user_businesses')
        .insert({
          user_id: session.user.id,
          business_name: "New Business",
          business_idea: "Quick signup from homepage",
          selected_blocks: [],
          status: 'building'
        });

      if (error) {
        console.error('Error saving business data:', error);
      }

      // Send welcome email
      try {
        await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: session.user.email,
            businessName: "New Business",
            userName: session.user.email?.split('@')[0] || "there"
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
            businessIdea: "Quick signup from homepage - no onboarding completed yet",
            selectedBlocks: [],
            aiAnalysis: "N/A - Direct homepage signup"
          }
        });
      } catch (emailError) {
        console.error('Error sending admin notification:', emailError);
      }

      toast.success("Welcome! 🎉", {
        description: "Let's get started building your business.",
      });
      
      navigate("/dashboard");
    }
  };


  return (
    <div className="min-h-screen overflow-x-hidden max-w-full w-full">
      <Header />
      <HeroSection onCTAClick={handleHeroCTA} />
      
      <AcariCapabilitiesSection />
      
      <IdeaToLaunchFlow />
      
     
      
      <div id="business-ideas">
      
      </div>
    
      
      <CTASection />
      
      <Footer />

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
