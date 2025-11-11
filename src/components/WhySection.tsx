const businessTypes = [
  {
    title: "Start a Local Service Business",
    description: "Dog walking, lawn care, cleaning, hauling, handyman & more",
    gradient: "from-neon-cyan to-neon-blue",
    icon: "🏘️",
  },
  {
    title: "Start an Online Store",
    description: "Sell physical or digital products — we build it with you",
    gradient: "from-neon-blue to-electric-indigo",
    icon: "🛍️",
  },
  {
    title: "Start a Personal Brand",
    description: "Creators, influencers, streamers, authors, musicians",
    gradient: "from-electric-indigo to-neon-purple",
    icon: "✨",
  },
  {
    title: "Start a Coaching / Consulting Business",
    description: "Turn expertise into income with booking + brand systems",
    gradient: "from-neon-purple to-neon-cyan",
    icon: "🎯",
  },
  {
    title: "Start a Side Hustle",
    description: "Turn ideas into income — we'll help you choose and build it",
    gradient: "from-neon-cyan to-electric-indigo",
    icon: "💡",
  },
  {
    title: "Grow My Existing Business",
    description: "Add branding, automation, marketing & systems",
    gradient: "from-electric-indigo to-neon-cyan",
    icon: "📈",
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
            No matter where you are, we help you build the pieces you need to grow.
          </p>
        </div>

        {/* Business Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTypes.map((type, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl glass-card-hover border border-white/5 animate-module-snap cursor-pointer hover:scale-[1.02] transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient glow on hover */}
              <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              {/* Icon */}
              <div className="mb-5 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10 text-3xl group-hover:scale-110 transition-transform duration-300">
                {type.icon}
              </div>

              {/* Indicator dot */}
              <div className={`absolute top-6 right-6 w-2.5 h-2.5 rounded-full bg-gradient-to-br ${type.gradient} opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500`} />

              <h3 className="text-xl font-bold mb-3 group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-electric-indigo group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {type.title}
              </h3>
              <p className="text-muted-foreground font-light leading-relaxed text-sm">
                {type.description}
              </p>

              {/* Hover line effect */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-6 pt-12">
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
      </div>
    </section>
  );
};
