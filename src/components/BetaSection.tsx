export const BetaSection = () => {
  return (
    <section className="relative py-32 px-6">
      {/* Background ambient effects */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-neon-cyan/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 animate-glow-pulse" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="relative p-16 rounded-[2rem] glass-card border border-neon-cyan/20 shadow-[0_0_80px_rgba(34,211,238,0.2)] overflow-hidden">
          {/* Inner ambient glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-purple/5" />
          
          {/* Floating particles effect */}
          <div className="absolute top-0 left-0 w-1 h-1 bg-neon-cyan rounded-full animate-float" style={{ top: "20%", left: "10%" }} />
          <div className="absolute w-1 h-1 bg-neon-purple rounded-full animate-float" style={{ top: "60%", right: "15%", animationDelay: "1s" }} />
          <div className="absolute w-1 h-1 bg-electric-indigo rounded-full animate-float" style={{ bottom: "30%", left: "20%", animationDelay: "2s" }} />

          <div className="relative z-10 space-y-12">
            {/* Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30">
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Early Access
                </span>
                <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter">
                <span className="block text-foreground mb-2">Join the First</span>
                <span className="block bg-gradient-to-r from-neon-cyan via-electric-indigo to-neon-purple bg-clip-text text-transparent">
                  100 Entrepreneurs
                </span>
              </h2>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                Be among the first to launch your business with us
              </p>

              <div className="max-w-3xl mx-auto pt-4">
                <p className="text-lg text-foreground/90 leading-relaxed font-light">
                  We're a new startup, and we're excited to help solve the real problems of entrepreneurship. 
                  Starting a business can be overwhelming when you have to do it all alone. 
                  Now you don't — meet your first business partner that works as hard as you do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
