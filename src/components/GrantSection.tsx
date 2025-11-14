import { Link } from "react-router-dom";

export const GrantSection = () => {
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
                Acari Startup Grant
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] break-words">
                Every Month we will give away <span className="text-acari-green">$1,000</span> to someone to Launch their business
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

            {/* Terms Link */}
            <div className="pt-4 sm:pt-6 text-center">
              <Link 
                to="/grant-terms" 
                className="text-xs sm:text-sm text-muted-foreground hover:text-neon-cyan transition-colors duration-200 underline underline-offset-4"
              >
                View Grant Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
