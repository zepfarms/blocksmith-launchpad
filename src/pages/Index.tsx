import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import AcariCapabilitiesSection from "@/components/AcariCapabilitiesSection";
import { IdeaToLaunchFlow } from "@/components/IdeaToLaunchFlow";
import { ExampleIdeasSection } from "@/components/ExampleIdeasSection";
import { BetaSection } from "@/components/BetaSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { AuthModal } from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleHeroCTA = () => {
    navigate("/start");
  };


  return (
    <div className="min-h-screen overflow-x-hidden max-w-full w-full">
      <Header />
      <HeroSection
        onCTAClick={handleHeroCTA} 
        onSignInClick={() => setShowAuthModal(true)}
      />
      
      <AcariCapabilitiesSection />
      
      <IdeaToLaunchFlow />
      
      <ExampleIdeasSection />
      
      <div id="business-ideas">
        <BetaSection />
      </div>
      
      <CTASection />
      
      <Footer />

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
      />
    </div>
  );
};
export default Index;
