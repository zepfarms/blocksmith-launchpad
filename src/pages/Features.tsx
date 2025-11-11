import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Layout, 
  Store, 
  CreditCard, 
  FileText, 
  Mail, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  CheckCircle2,
  Rocket,
  Building2,
  Palette,
  Globe,
  MessageSquare,
  Calendar,
  TrendingUp,
  Lock,
  Clock
} from "lucide-react";

const Features = () => {
  const navigate = useNavigate();

  const coreFeatures = [
    {
      icon: Sparkles,
      title: "AI-Powered Business Planning",
      description: "Our AI analyzes your business idea and creates a personalized roadmap. Get intelligent recommendations for what you need to launch, tailored to your specific business type."
    },
    {
      icon: Palette,
      title: "Complete Brand Identity",
      description: "Professional logo designs, brand colors, typography, and visual guidelines. We create a cohesive brand that stands out and resonates with your target audience."
    },
    {
      icon: Layout,
      title: "Custom Website Builder",
      description: "Beautiful, responsive websites built specifically for your business. Mobile-optimized, SEO-ready, and designed to convert visitors into customers."
    },
    {
      icon: Store,
      title: "E-Commerce Setup",
      description: "Complete online store with product catalog, shopping cart, checkout, and inventory management. Start selling online in days, not months."
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Integrated payment solutions supporting credit cards, digital wallets, and more. Secure, compliant, and ready to accept money from day one."
    },
    {
      icon: FileText,
      title: "Legal & Compliance",
      description: "Business registration, LLC formation, EIN filing, terms of service, privacy policies, and all legal documents you need to operate legitimately."
    },
    {
      icon: Mail,
      title: "Email Marketing System",
      description: "Professional email templates, automated campaigns, customer lists, and analytics. Build relationships and drive repeat business."
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "CRM system to track customers, manage contacts, follow up on leads, and build lasting relationships that grow your business."
    },
    {
      icon: BarChart3,
      title: "Marketing Strategy",
      description: "Complete marketing plan including social media strategy, content calendar, advertising recommendations, and growth tactics."
    },
    {
      icon: MessageSquare,
      title: "Social Media Kit",
      description: "Profile images, cover photos, post templates, and content ideas for all major platforms. Maintain a professional presence everywhere."
    },
    {
      icon: Globe,
      title: "Domain & Hosting",
      description: "Custom domain recommendations, professional email addresses, and reliable hosting. Your online presence, professionally managed."
    },
    {
      icon: Calendar,
      title: "Booking & Scheduling",
      description: "Online appointment booking, calendar integration, automated reminders, and client management for service-based businesses."
    }
  ];

  const additionalServices = [
    {
      icon: Building2,
      title: "Business Plan Documents",
      description: "Comprehensive business plans, financial projections, and pitch decks for investors or loan applications."
    },
    {
      icon: TrendingUp,
      title: "Growth & Scaling Tools",
      description: "Advanced analytics, conversion optimization, A/B testing, and strategies to scale from first customer to 100+."
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "SSL certificates, GDPR compliance, data protection, and security audits to keep your business and customers safe."
    },
    {
      icon: Zap,
      title: "Automation & Integrations",
      description: "Connect your tools, automate workflows, and integrate with popular platforms to save time and reduce manual work."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Tell Us Your Idea",
      description: "Share your business vision. Our AI analyzes it and creates a personalized plan with exactly what you need."
    },
    {
      step: "2",
      title: "Choose Your Blocks",
      description: "Select from our comprehensive catalog of services. Start with essentials or go all-in with advanced features."
    },
    {
      step: "3",
      title: "We Build Everything",
      description: "Our team and AI work together to create your complete business infrastructure. You review and approve each component."
    },
    {
      step: "4",
      title: "Launch & Grow",
      description: "When you're ready, launch with one click. Your website goes live, payments activate, and you're ready for customers."
    }
  ];

  const benefits = [
    { icon: Clock, text: "Launch in days, not months" },
    { icon: CheckCircle2, text: "No technical skills required" },
    { icon: Lock, text: "You own everything we create" },
    { icon: Users, text: "Real human support available" },
    { icon: Zap, text: "AI + expert team working for you" },
    { icon: Shield, text: "Secure and compliant from day one" }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden">
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "100px 100px"
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white">
            Everything You Need
            <br />
            <span className="text-white/80">To Launch Your Business</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto">
            From idea to first customer in days. We handle the tech, legal, marketing, and everything in between.
          </p>
          <button
            onClick={() => navigate("/start")}
            className="group px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
          >
            Start Building
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything included to launch and grow a professional business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 group"
              >
                <feature.icon className="w-12 h-12 text-white mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 px-4 sm:px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Advanced Services</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Scale and optimize your business with professional-grade tools
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((service, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
              >
                <service.icon className="w-10 h-10 text-white mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-gray-950 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Four simple steps from idea to launch
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Why Choose SpaceBlocks</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <benefit.icon className="w-8 h-8 text-white flex-shrink-0" />
                <span className="text-white font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white">
            Ready to Build Your Business?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join hundreds of entrepreneurs who turned their ideas into real businesses with SpaceBlocks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/start")}
              className="group px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              Start Building Free
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <button
              onClick={() => navigate("/start/browse")}
              className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 inline-flex items-center gap-2"
            >
              Browse Business Ideas
              <span>→</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 pt-4">
            No credit card required • Pay only when you're ready to launch
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;
