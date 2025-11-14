import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GrantSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
      {/* Ambient Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content Container */}
      <div className="relative max-w-5xl mx-auto">
        {/* Glass Card */}
        <div className="glass-card p-6 sm:p-10 md:p-16 border border-neon-cyan/20 hover:border-neon-cyan/30 transition-all duration-500">
          <div className="max-w-3xl mx-auto text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="flex items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/20">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-glow-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-glow-pulse" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-glow-pulse" style={{ animationDelay: '0.6s' }} />
                </div>
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-neon-cyan">
                  Monthly Grant
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 sm:space-y-4">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] break-words">
                Acari Startup Micro Grant
              </h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] break-words">
                <span className="text-acari-green">$1,000</span> Every Month to Launch Your Dream
              </h3>
            </div>

            {/* Body Text */}
            <div className="space-y-4 text-base sm:text-lg md:text-xl font-light text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              <p>
                Turn your idea into a real business with help from Acari.ai.
              </p>
              <p>
                Every month, one new founder is selected to receive a $1,000 launch grant — no complex applications, no long wait times.
              </p>
              <p>
                Just build your idea on Acari, submit your starter blocks, and you're in. Start today. You might be our next winner.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4 sm:pt-6">
              <Button
                onClick={() => navigate("/start")}
                className="bg-acari-green hover:bg-acari-green/90 text-background text-base sm:text-lg font-semibold px-8 py-6 rounded-full shadow-[0_0_30px_rgba(107,203,68,0.3)] hover:shadow-[0_0_50px_rgba(107,203,68,0.5)] hover:scale-105 transition-all duration-300"
              >
                Apply Automatically When You Build Your Idea
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
