import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const HeroSection = ({ onCTAClick }: { onCTAClick: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-ion-blue/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cosmic-purple/20 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 animate-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm font-medium">
          <Sparkles className="w-4 h-4 text-cosmic-purple" />
          <span>First 100 Founders Program</span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          Don't just build a website.
          <br />
          <span className="gradient-text">Launch a real business.</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Pick your blocks. We assemble everything.
          <br />
          Get your first customer in <span className="text-foreground font-semibold">days, not months</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            variant="hero" 
            size="xl"
            onClick={onCTAClick}
            className="group"
          >
            Start Choosing Blocks
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="pill-outline" size="xl">
            Watch Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="pt-12 flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">Idea → Plan → Brand → Store → Legal → Customers</p>
          <p className="text-xs text-muted-foreground font-medium">Every step? Just a block away.</p>
        </div>
      </div>
    </section>
  );
};
