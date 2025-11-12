// Custom premium visual elements for each business type
const CustomShapeLocal = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="30" fill="url(#gradient1)" opacity="0.2"/>
    <circle cx="40" cy="40" r="20" fill="url(#gradient1)" opacity="0.4"/>
    <circle cx="40" cy="40" r="10" fill="url(#gradient1)"/>
    <defs>
      <linearGradient id="gradient1" x1="10" y1="10" x2="70" y2="70">
        <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#556270" stopOpacity="0.9"/>
      </linearGradient>
    </defs>
  </svg>
);

const CustomShapeStore = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="25" width="40" height="30" rx="4" fill="url(#gradient2)" opacity="0.3"/>
    <rect x="25" y="30" width="30" height="20" rx="3" fill="url(#gradient2)" opacity="0.5"/>
    <rect x="30" y="35" width="20" height="10" rx="2" fill="url(#gradient2)"/>
    <defs>
      <linearGradient id="gradient2" x1="20" y1="25" x2="60" y2="55">
        <stop offset="0%" stopColor="#667eea"/>
        <stop offset="100%" stopColor="#764ba2"/>
      </linearGradient>
    </defs>
  </svg>
);

const CustomShapeBrand = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 20 L60 35 L60 55 L40 70 L20 55 L20 35 Z" fill="url(#gradient3)" opacity="0.3"/>
    <path d="M40 27 L54 37 L54 53 L40 63 L26 53 L26 37 Z" fill="url(#gradient3)" opacity="0.5"/>
    <circle cx="40" cy="45" r="8" fill="url(#gradient3)"/>
    <defs>
      <linearGradient id="gradient3" x1="20" y1="20" x2="60" y2="70">
        <stop offset="0%" stopColor="#f093fb"/>
        <stop offset="100%" stopColor="#f5576c"/>
      </linearGradient>
    </defs>
  </svg>
);

const CustomShapeCoaching = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polygon points="40,20 60,35 55,60 25,60 20,35" fill="url(#gradient4)" opacity="0.3"/>
    <polygon points="40,28 54,39 50,56 30,56 26,39" fill="url(#gradient4)" opacity="0.5"/>
    <polygon points="40,35 48,43 45,52 35,52 32,43" fill="url(#gradient4)"/>
    <defs>
      <linearGradient id="gradient4" x1="20" y1="20" x2="60" y2="60">
        <stop offset="0%" stopColor="#a8edea"/>
        <stop offset="100%" stopColor="#fed6e3"/>
      </linearGradient>
    </defs>
  </svg>
);

const CustomShapeHustle = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M40 15 L50 30 L65 35 L55 50 L60 65 L40 57 L20 65 L25 50 L15 35 L30 30 Z" fill="url(#gradient5)" opacity="0.3"/>
    <path d="M40 25 L47 35 L57 38 L50 48 L53 58 L40 52 L27 58 L30 48 L23 38 L33 35 Z" fill="url(#gradient5)" opacity="0.5"/>
    <circle cx="40" cy="42" r="6" fill="url(#gradient5)"/>
    <defs>
      <linearGradient id="gradient5" x1="15" y1="15" x2="65" y2="65">
        <stop offset="0%" stopColor="#fa709a"/>
        <stop offset="100%" stopColor="#fee140"/>
      </linearGradient>
    </defs>
  </svg>
);

const CustomShapeGrowth = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="50" width="12" height="20" rx="2" fill="url(#gradient6)" opacity="0.4"/>
    <rect x="30" y="40" width="12" height="30" rx="2" fill="url(#gradient6)" opacity="0.6"/>
    <rect x="45" y="30" width="12" height="40" rx="2" fill="url(#gradient6)" opacity="0.8"/>
    <rect x="60" y="20" width="12" height="50" rx="2" fill="url(#gradient6)"/>
    <defs>
      <linearGradient id="gradient6" x1="15" y1="70" x2="72" y2="20">
        <stop offset="0%" stopColor="#30cfd0"/>
        <stop offset="100%" stopColor="#330867"/>
      </linearGradient>
    </defs>
  </svg>
);

const businessTypes = [
  {
    title: "Start a Local Service Business",
    description: "Dog walking, lawn care, cleaning, hauling, handyman & more",
    gradient: "linear-gradient(135deg, hsl(var(--neon-cyan)) 0%, hsl(var(--neon-blue)) 100%)",
    shape: CustomShapeLocal,
  },
  {
    title: "Start an Online Store",
    description: "Sell physical or digital products — we build it with you",
    gradient: "linear-gradient(135deg, hsl(var(--neon-blue)) 0%, hsl(var(--electric-indigo)) 100%)",
    shape: CustomShapeStore,
  },
  {
    title: "Start a Personal Brand",
    description: "Creators, influencers, streamers, authors, musicians",
    gradient: "linear-gradient(135deg, hsl(var(--electric-indigo)) 0%, hsl(var(--neon-purple)) 100%)",
    shape: CustomShapeBrand,
  },
  {
    title: "Start a Coaching / Consulting Business",
    description: "Turn expertise into income with booking + brand systems",
    gradient: "linear-gradient(135deg, hsl(var(--neon-purple)) 0%, hsl(var(--neon-cyan)) 100%)",
    shape: CustomShapeCoaching,
  },
  {
    title: "Start a Side Hustle",
    description: "Turn ideas into income — we'll help you choose and build it",
    gradient: "linear-gradient(135deg, hsl(var(--neon-cyan)) 0%, hsl(var(--electric-indigo)) 100%)",
    shape: CustomShapeHustle,
  },
  {
    title: "Grow My Existing Business",
    description: "Add branding, automation, marketing & systems",
    gradient: "linear-gradient(135deg, hsl(var(--electric-indigo)) 0%, hsl(var(--neon-cyan)) 100%)",
    shape: CustomShapeGrowth,
  },
];

export const WhySection = () => {
  return (
    <section className="relative pt-16 pb-32 px-4 sm:px-6 overflow-hidden max-w-full">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background-elevated to-background" />
      <div className="absolute top-1/2 left-1/2 w-[90vw] max-w-[1000px] h-[90vw] max-h-[1000px] bg-neon-purple/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessTypes.map((type, index) => {
            const ShapeComponent = type.shape;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[28px] cursor-pointer transition-all duration-700 hover:scale-[1.03]"
              >
                {/* Glass card base */}
                <div className="relative glass-card border border-white/10 p-10 h-full backdrop-blur-xl">
                  {/* Gradient overlay that appears on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-[28px]"
                    style={{ background: type.gradient }}
                  />
                  
                  {/* Accent gradient border on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[28px] p-[1px]"
                    style={{ 
                      background: type.gradient,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude'
                    }}
                  />

                  {/* Custom shape icon */}
                  <div className="mb-8 relative transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-700">
                    <ShapeComponent />
                  </div>

                  {/* Content */}
                  <div className="relative space-y-4">
                    <h3 className="text-2xl font-bold text-foreground leading-tight">
                      {type.title}
                    </h3>
                    <p className="text-muted-foreground/80 leading-relaxed font-light">
                      {type.description}
                    </p>
                  </div>

                  {/* Subtle glow effect on bottom */}
                  <div 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-px opacity-0 group-hover:opacity-50 transition-opacity duration-700"
                    style={{ background: type.gradient }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
