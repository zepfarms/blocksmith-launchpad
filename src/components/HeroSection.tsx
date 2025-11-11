import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export const HeroSection = ({ onCTAClick }: { onCTAClick: () => void }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
      {/* Ambient background orbs with parallax */}
      <div 
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-neon-cyan/20 blur-[120px] animate-float parallax-float"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.5s ease-out"
        }}
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-electric-indigo/20 blur-[120px] animate-float"
        style={{
          transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
          transition: "transform 0.5s ease-out",
          animationDelay: "2s"
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-neon-purple/15 blur-[100px] animate-float"
        style={{
          transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: "transform 0.5s ease-out",
          animationDelay: "4s"
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px"
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto text-center space-y-12 animate-slide-up-fade">
        {/* Empire badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card border border-neon-cyan/20">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
          <span className="text-sm font-semibold text-foreground/90 tracking-wide">
            FIRST 100 FOUNDERS PROGRAM
          </span>
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
        </div>

        {/* Cinematic hero typography */}
        <div className="space-y-8">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]">
            <span className="block text-foreground">Meet your new</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-neon-blue to-electric-indigo bg-clip-text text-transparent">
              business partner
            </span>
          </h1>

          {/* Subheading with luxury spacing */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-foreground/80 leading-relaxed">
              We help you turn your idea into a real business —
              <br />
              brand, products, website, marketing, customers.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
              Just choose the blocks you need, and we build it with you.
            </p>
          </div>
        </div>

        {/* CTA with empire aesthetic */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Button 
            variant="empire" 
            onClick={onCTAClick}
            className="group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Picking Blocks
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
          <Button variant="glass" size="xl" className="text-foreground">
            See how it works →
          </Button>
        </div>

        {/* Trust line with modular aesthetic */}
        <div className="pt-16 space-y-4">
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
      </div>
    </section>
  );
};
