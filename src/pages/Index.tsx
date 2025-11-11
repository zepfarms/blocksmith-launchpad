import { useState, useRef } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BlockSelector } from "@/components/BlockSelector";
import { WhySection } from "@/components/WhySection";
import { BetaSection } from "@/components/BetaSection";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Index = () => {
  const blockSelectorRef = useRef<HTMLDivElement>(null);

  const handleHeroCTA = () => {
    blockSelectorRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBlocksComplete = (selectedBlocks: string[]) => {
    toast.success("Great choices!", {
      description: `You've selected ${selectedBlocks.length} blocks. Ready to launch?`,
    });
    // In a real app, this would proceed to the next step
  };

  return (
    <div className="min-h-screen">
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
