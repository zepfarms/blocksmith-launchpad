import { Brain, Palette, Globe, Zap, TrendingUp, Users } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "AI-powered planning",
    description: "Smart automation for your business foundation",
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Automated design + assets",
    description: "Professional branding without the designer fees",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Real website & store setup",
    description: "Fully functional, ready to accept payments",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Automations + systems",
    description: "Work smarter with built-in workflows",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Launch + marketing kit",
    description: "Everything to get your first customers",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Human founders support",
    description: "Real people when you need guidance",
  },
];

export const WhySection = () => {
  return (
    <section className="py-20 px-4 bg-background-mist">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Why <span className="gradient-text">It Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            You bring the idea. We bring the infrastructure.
          </p>
          <p className="text-lg font-semibold">
            This isn't a website builder. This is a <span className="gradient-text">Business Launch System</span>.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl glass-card hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-ion-blue/10 to-cosmic-purple/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-2xl font-bold">Don't wait for someday.</p>
          <p className="text-xl gradient-text">Launch today.</p>
        </div>
      </div>
    </section>
  );
};
