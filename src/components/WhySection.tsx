// VisionOS-style 3D icon components
const LocalServiceIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="service-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(78, 139, 255, 0.3)" />
        <stop offset="100%" stopColor="rgba(123, 97, 255, 0.2)" />
      </linearGradient>
    </defs>
    <rect x="12" y="20" width="40" height="28" rx="4" fill="url(#service-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <rect x="16" y="24" width="12" height="12" rx="2" fill="rgba(78, 139, 255, 0.4)" />
    <rect x="32" y="24" width="16" height="4" rx="1" fill="rgba(255,255,255,0.2)" />
    <rect x="32" y="32" width="16" height="4" rx="1" fill="rgba(255,255,255,0.15)" />
  </svg>
);

const OnlineStoreIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="store-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(78, 139, 255, 0.3)" />
        <stop offset="100%" stopColor="rgba(123, 97, 255, 0.2)" />
      </linearGradient>
    </defs>
    <path d="M18 28 L32 18 L46 28 L46 48 L18 48 Z" fill="url(#store-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <rect x="28" y="36" width="8" height="12" fill="rgba(78, 139, 255, 0.4)" />
    <rect x="22" y="30" width="6" height="6" rx="1" fill="rgba(255,255,255,0.2)" />
    <rect x="36" y="30" width="6" height="6" rx="1" fill="rgba(255,255,255,0.2)" />
  </svg>
);

const PersonalBrandIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(123, 97, 255, 0.3)" />
        <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="26" r="8" fill="url(#brand-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <path d="M20 42 Q20 34 32 34 Q44 34 44 42 L44 48 L20 48 Z" fill="url(#brand-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <circle cx="32" cy="26" r="4" fill="rgba(123, 97, 255, 0.4)" />
  </svg>
);

const CoachingIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="coaching-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
        <stop offset="100%" stopColor="rgba(78, 139, 255, 0.2)" />
      </linearGradient>
    </defs>
    <circle cx="32" cy="32" r="16" fill="url(#coaching-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <circle cx="32" cy="32" r="12" fill="none" stroke="rgba(78, 139, 255, 0.4)" strokeWidth="1.5"/>
    <circle cx="32" cy="32" r="4" fill="rgba(123, 97, 255, 0.5)" />
  </svg>
);

const SideHustleIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="hustle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(78, 139, 255, 0.3)" />
        <stop offset="100%" stopColor="rgba(123, 97, 255, 0.2)" />
      </linearGradient>
    </defs>
    <path d="M32 16 L40 28 L32 28 L32 48 L24 36 L32 36 Z" fill="url(#hustle-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <circle cx="32" cy="32" r="18" fill="none" stroke="rgba(78, 139, 255, 0.2)" strokeWidth="0.5"/>
  </svg>
);

const GrowthIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" className="w-full h-full">
    <defs>
      <linearGradient id="growth-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(123, 97, 255, 0.3)" />
        <stop offset="100%" stopColor="rgba(78, 139, 255, 0.2)" />
      </linearGradient>
    </defs>
    <path d="M16 44 L24 36 L32 40 L40 28 L48 32 L48 48 L16 48 Z" fill="url(#growth-grad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5"/>
    <polyline points="16,44 24,36 32,40 40,28 48,32" stroke="rgba(78, 139, 255, 0.6)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="36" r="2" fill="rgba(123, 97, 255, 0.6)" />
    <circle cx="32" cy="40" r="2" fill="rgba(123, 97, 255, 0.6)" />
    <circle cx="40" cy="28" r="2" fill="rgba(123, 97, 255, 0.6)" />
  </svg>
);

const businessTypes = [
  {
    title: "Start a Local Service Business",
    description: "Dog walking, lawn care, cleaning, hauling, handyman & more",
    gradient: "from-neon-cyan to-neon-blue",
    icon: <LocalServiceIcon />,
  },
  {
    title: "Start an Online Store",
    description: "Sell physical or digital products — we build it with you",
    gradient: "from-neon-blue to-electric-indigo",
    icon: <OnlineStoreIcon />,
  },
  {
    title: "Start a Personal Brand",
    description: "Creators, influencers, streamers, authors, musicians",
    gradient: "from-electric-indigo to-neon-purple",
    icon: <PersonalBrandIcon />,
  },
  {
    title: "Start a Coaching / Consulting Business",
    description: "Turn expertise into income with booking + brand systems",
    gradient: "from-neon-purple to-neon-cyan",
    icon: <CoachingIcon />,
  },
  {
    title: "Start a Side Hustle",
    description: "Turn ideas into income — we'll help you choose and build it",
    gradient: "from-neon-cyan to-electric-indigo",
    icon: <SideHustleIcon />,
  },
  {
    title: "Grow My Existing Business",
    description: "Add branding, automation, marketing & systems",
    gradient: "from-electric-indigo to-neon-cyan",
    icon: <GrowthIcon />,
  },
];

export const WhySection = () => {
  return (
    <section className="relative pt-16 pb-32 px-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businessTypes.map((type, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-[32px] cursor-pointer animate-module-snap"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* VisionOS Glass Card Base */}
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.12)] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)] transition-all duration-500" />
              
              {/* Neon edge glow */}
              <div className={`absolute inset-0 rounded-[32px] bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500`} />
              <div className={`absolute inset-0 rounded-[32px] border border-transparent bg-gradient-to-br ${type.gradient} bg-clip-border opacity-0 group-hover:opacity-30 transition-all duration-500`} style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1px' }} />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container - Floating 3D tile */}
                <div className="mb-8 relative">
                  <div className="w-20 h-20 mx-auto relative">
                    {/* Icon depth shadow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Icon tile */}
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.1)] group-hover:shadow-[0_8px_32px_rgba(78,139,255,0.3)] group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 flex items-center justify-center backdrop-blur-sm">
                      <div className="w-14 h-14">
                        {type.icon}
                      </div>
                    </div>
                    
                    {/* Floating indicator */}
                    <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-100 shadow-[0_0_16px_rgba(78,139,255,0.6)] transition-all duration-500`} />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-4 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-neon-cyan group-hover:to-electric-indigo group-hover:bg-clip-text group-hover:text-transparent">
                  {type.title}
                </h3>
                <p className="text-muted-foreground/80 font-light leading-relaxed text-sm">
                  {type.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
