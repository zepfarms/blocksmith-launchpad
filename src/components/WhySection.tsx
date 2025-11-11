import { Store, Briefcase, User, GraduationCap, Zap, TrendingUp } from "lucide-react";

const businessTypes = [
  {
    title: "Start a Local Service Business",
    description: "Dog walking, lawn care, cleaning, hauling, handyman & more",
    gradient: "linear-gradient(135deg, hsl(var(--neon-cyan)) 0%, hsl(var(--neon-blue)) 100%)",
    icon: Briefcase,
  },
  {
    title: "Start an Online Store",
    description: "Sell physical or digital products — we build it with you",
    gradient: "linear-gradient(135deg, hsl(var(--neon-blue)) 0%, hsl(var(--electric-indigo)) 100%)",
    icon: Store,
  },
  {
    title: "Start a Personal Brand",
    description: "Creators, influencers, streamers, authors, musicians",
    gradient: "linear-gradient(135deg, hsl(var(--electric-indigo)) 0%, hsl(var(--neon-purple)) 100%)",
    icon: User,
  },
  {
    title: "Start a Coaching / Consulting Business",
    description: "Turn expertise into income with booking + brand systems",
    gradient: "linear-gradient(135deg, hsl(var(--neon-purple)) 0%, hsl(var(--neon-cyan)) 100%)",
    icon: GraduationCap,
  },
  {
    title: "Start a Side Hustle",
    description: "Turn ideas into income — we'll help you choose and build it",
    gradient: "linear-gradient(135deg, hsl(var(--neon-cyan)) 0%, hsl(var(--electric-indigo)) 100%)",
    icon: Zap,
  },
  {
    title: "Grow My Existing Business",
    description: "Add branding, automation, marketing & systems",
    gradient: "linear-gradient(135deg, hsl(var(--electric-indigo)) 0%, hsl(var(--neon-cyan)) 100%)",
    icon: TrendingUp,
  },
];

export const WhySection = () => {
  return (
    <section className="relative pt-16 pb-32 px-4 sm:px-6">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-elevated to-background" />
      <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] bg-neon-purple/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-8 px-4">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter">
            <span className="block text-foreground mb-4">Start or Grow</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-electric-indigo to-neon-purple bg-clip-text text-transparent">
              your Business
            </span>
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light">
            No matter where you are, we help you build the pieces you need to grow.
          </p>
        </div>

        {/* Business Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {businessTypes.map((type, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-3xl cursor-pointer bg-gradient-to-br transition-all duration-500 hover:scale-[1.02] shadow-lg hover:shadow-2xl"
              style={{
                background: type.gradient,
              }}
            >
              {/* Icon */}
              <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-md">
                <type.icon className="w-8 h-8" />
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white">
                  {type.title}
                </h3>
                <p className="text-white/80 font-light leading-relaxed">
                  {type.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
