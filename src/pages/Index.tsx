import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BetaSection } from "@/components/BetaSection";
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

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView="signup"
      />
    </div>
  );
};
export default Index;
