import { useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { BlockSelector } from "@/components/BlockSelector";
import { WhySection } from "@/components/WhySection";
import { BetaSection } from "@/components/BetaSection";
import { Footer } from "@/components/Footer";
import { JourneyFlow } from "@/components/JourneyFlow";
import { Header } from "@/components/Header";
import { toast } from "sonner";
const Index = () => {
  const ideaInputRef = useRef<HTMLDivElement>(null);
  const blockSelectorRef = useRef<HTMLDivElement>(null);
  const [showJourney, setShowJourney] = useState(false);
  const [journeyData, setJourneyData] = useState<{
    name: string;
    vision: string;
    industry: string;
  } | null>(null);
  const handleHeroCTA = () => {
    ideaInputRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  };
  const handleJourneyComplete = (data: {
    name: string;
    vision: string;
    industry: string;
  }) => {
    setJourneyData(data);
    setShowJourney(false);
    toast.success(`Welcome, ${data.name}!`, {
      description: "Your business is being built. Check your dashboard."
    });
  };
  const handleJourneyBack = () => {
    setShowJourney(false);
  };
  const handleBlocksComplete = (selectedBlocks: string[]) => {
    const empireName = journeyData?.name || "Your Empire";
    toast.success("Assembly initiated!", {
      description: `${empireName} is ready for launch with ${selectedBlocks.length} modules.`
    });
  };
  if (showJourney) {
    return <JourneyFlow onComplete={handleJourneyComplete} onBack={handleJourneyBack} />;
  }
  return <div className="min-h-screen">
      <Header />
      <HeroSection onCTAClick={handleHeroCTA} />
      
      {/* Idea Input Section - Positioned right after hero */}
      <section ref={ideaInputRef} className="relative pt-16 pb-8 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background-elevated my-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center space-y-6 mb-12">
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-cyan/50" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                Not Sure?
              </span>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-cyan/50" />
            </div>
            
            <p className="text-3xl md:text-4xl font-light text-foreground/90">
              Tell us your idea
            </p>
            <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
              We'll guide you
            </p>
          </div>

          <div className="glass-card rounded-3xl border border-white/10 p-8 md:p-12 space-y-6">
            <Button variant="empire" size="xl" onClick={() => setShowJourney(true)} className="w-full group">
              <span className="relative z-10 flex items-center justify-center gap-3">
                Tell us your business idea
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
            
            {/* Trust line with modular aesthetic */}
            <div className="pt-8 space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-neon-cyan/50" />
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                  Powered by AI & real humans
                </p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-neon-cyan/50" />
              </div>
              <p className="text-sm text-muted-foreground/70 font-light">
                Built for everyday entrepreneurs
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground/70">
                Takes less than 2 minutes • No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <WhySection />
      
      <div ref={blockSelectorRef}>
        <BlockSelector onComplete={handleBlocksComplete} />
      </div>
      
      <BetaSection />
      
      <Footer />
    </div>;
};
export default Index;