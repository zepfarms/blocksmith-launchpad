const features = [
  {
    title: "AI Command Center",
    description: "Neural networks orchestrate your empire's foundation",
    gradient: "from-neon-cyan to-neon-blue",
  },
  {
    title: "Autonomous Design",
    description: "Self-assembling brand systems with zero manual input",
    gradient: "from-neon-blue to-electric-indigo",
  },
  {
    title: "Live Infrastructure",
    description: "Real-time deployment of commerce-ready platforms",
    gradient: "from-electric-indigo to-neon-purple",
  },
  {
    title: "Quantum Workflows",
    description: "Parallel processing of business operations",
    gradient: "from-neon-purple to-neon-cyan",
  },
  {
    title: "Launch Protocol",
    description: "Zero-friction customer acquisition systems",
    gradient: "from-neon-cyan to-electric-indigo",
  },
  {
    title: "Human Override",
    description: "Expert founders on-demand for strategic guidance",
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
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass-card border border-neon-cyan/20">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              The System
            </span>
          </div>

          <h2 className="text-6xl md:text-7xl font-black tracking-tighter">
            <span className="block text-foreground mb-4">Not a Website Builder</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-electric-indigo to-neon-purple bg-clip-text text-transparent">
              An Empire OS
            </span>
          </h2>

          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            You bring the vision. We deploy the infrastructure.
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
              Mission Statement
            </span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-cyan/50" />
          </div>
          
          <p className="text-3xl md:text-4xl font-light text-foreground/90">
            Don't wait for someday.
          </p>
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
            Launch your empire.
          </p>
        </div>
      </div>
    </section>
  );
};
