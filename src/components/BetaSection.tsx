import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const BetaSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden max-w-full">
      {/* Background ambient effects */}
      <div className="absolute top-1/2 left-1/2 w-[90vw] max-w-[400px] sm:max-w-[600px] md:max-w-[800px] h-[90vw] max-h-[400px] sm:max-h-[600px] md:max-h-[800px] bg-neon-cyan/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="relative p-6 sm:p-10 md:p-16 rounded-2xl sm:rounded-[2rem] glass-card border border-neon-cyan/20 shadow-[0_0_80px_rgba(34,211,238,0.2)] overflow-hidden max-w-full">
          {/* Inner ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5" />

          <div className="relative z-10 space-y-8 sm:space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">
                  Early Access
                </span>
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
              </div>

              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter px-2 break-words max-w-full">
                <span className="block text-foreground mb-2">Join the First</span>
                <span className="block text-acari-green font-bold">
                  100 Entrepreneurs
                </span>
              </h2>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light px-4 break-words">
                Get early access to tools that automate, build, and grow your business
              </p>

              <div className="max-w-3xl mx-auto pt-2 sm:pt-4 px-4">
                <p className="text-sm sm:text-base md:text-lg text-foreground/90 leading-relaxed font-light break-words">
                  Running a business means wearing every hat—marketing, operations, finance, and more. 
                  We've built a platform where you don't have to do it alone. 
                  Access 200+ tools that automate the busy work, so you can focus on growing your business.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex justify-center items-center pt-6 sm:pt-8">
                <button
                  onClick={() => navigate("/start")}
                  className="group relative px-8 py-4 sm:px-12 sm:py-6 bg-gradient-to-r from-acari-green to-neon-cyan text-background rounded-full font-bold text-base sm:text-xl hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] transition-all duration-300 flex items-center justify-center gap-3 animate-glow-pulse"
                >
                  <span className="relative z-10">Be One of the First</span>
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-1 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-acari-green rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
