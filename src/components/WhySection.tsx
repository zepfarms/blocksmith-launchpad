const features = [
  {
    title: "You're not doing this alone",
    description: "Your AI co-founder + our team builds your business with you",
    gradient: "from-neon-cyan to-neon-blue",
  },
  {
    title: "No tech skills needed",
    description: "No coding. No design tools. No stress.",
    gradient: "from-neon-blue to-electric-indigo",
  },
  {
    title: "Real business. Real customers.",
    description: "We help you get your first sale faster",
    gradient: "from-electric-indigo to-neon-purple",
  },
  {
    title: "Built-with-you, not DIY",
    description: "We build each piece step-by-step with you",
    gradient: "from-neon-purple to-neon-cyan",
  },
  {
    title: "Perfect for first-time entrepreneurs",
    description: "Turn your idea into something real",
    gradient: "from-neon-cyan to-electric-indigo",
  },
  {
    title: "You own everything we create",
    description: "Your brand, your business, your assets",
    gradient: "from-electric-indigo to-neon-cyan",
  },
];

export const WhySection = () => {
  return (
    <section className="relative py-32 px-6">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-elevated to-background" />
      <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-neon-purple/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-8">
          <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
            <span className="block text-foreground mb-4">Start or Grow</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-electric-indigo to-neon-purple bg-clip-text text-transparent">
              your Business
            </span>
          </h2>

          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            Turn your idea into something real. Get your first sale faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-3xl glass-card-hover border border-white/5 animate-module-snap"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Module indicator */}
              <div className={`absolute top-6 right-6 w-3 h-3 rounded-full bg-gradient-to-br ${feature.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Module number */}
              <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10">
                <span className="text-sm font-bold text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-4 group-hover:text-neon-cyan transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                {feature.description}
              </p>

              {/* Connection line */}
              <div className="absolute bottom-0 left-1/2 w-px h-8 bg-gradient-to-t from-neon-cyan/30 to-transparent -translate-x-1/2 translate-y-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom statement */}
        <div className="text-center space-y-6 pt-12">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-cyan/50" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
              Our Promise
            </span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-cyan/50" />
          </div>
          
          <p className="text-3xl md:text-4xl font-light text-foreground/90">
            We help you build each piece step-by-step
          </p>
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
            So you can launch fast
          </p>
        </div>
      </div>
    </section>
  );
};
