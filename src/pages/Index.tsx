import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BlockSelector } from "@/components/BlockSelector";
import { WhySection } from "@/components/WhySection";
import { BetaSection } from "@/components/BetaSection";
import { Footer } from "@/components/Footer";
import { JourneyFlow } from "@/components/JourneyFlow";
import { Header } from "@/components/Header";
import { toast } from "sonner";

const Index = () => {
  const blockSelectorRef = useRef<HTMLDivElement>(null);
  const [showJourney, setShowJourney] = useState(false);
  const [journeyData, setJourneyData] = useState<{
    name: string;
    vision: string;
    industry: string;
  } | null>(null);

  const handleHeroCTA = () => {
    setShowJourney(true);
  };

  const handleJourneyComplete = (data: { name: string; vision: string; industry: string }) => {
    setJourneyData(data);
    setShowJourney(false);
    toast.success(`Welcome, ${data.name}!`, {
      description: "Your business is being built. Check your dashboard.",
    });
  };

  const handleJourneyBack = () => {
    setShowJourney(false);
  };

  const handleBlocksComplete = (selectedBlocks: string[]) => {
    const empireName = journeyData?.name || "Your Empire";
    toast.success("Assembly initiated!", {
      description: `${empireName} is ready for launch with ${selectedBlocks.length} modules.`,
    });
  };

  if (showJourney) {
    return <JourneyFlow onComplete={handleJourneyComplete} onBack={handleJourneyBack} />;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection onCTAClick={handleHeroCTA} />
      
      <WhySection />
      
      <div ref={blockSelectorRef}>
        <BlockSelector onComplete={handleBlocksComplete} />
      </div>
      
      <BetaSection />
      
      <Footer />
    </div>
  );
};

export default Index;
