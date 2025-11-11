import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Sparkles, 
  Zap, 
  Users, 
  CreditCard, 
  Globe, 
  Mail,
  ShieldCheck,
  TrendingUp,
  Package,
  Megaphone,
  FileText,
  Briefcase,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("start");

  const tabs = [
    { id: "start", label: "Getting Started", icon: Sparkles },
    { id: "building", label: "Building", icon: Package },
    { id: "launch", label: "Launch & Grow", icon: TrendingUp },
    { id: "support", label: "Support", icon: Users },
  ];

  const features = {
    start: [
      {
        icon: Sparkles,
        title: "AI-Powered Idea Analysis",
        description: "Tell us your business idea and our AI analyzes it instantly, understanding exactly what you want to build and recommending the perfect blocks for your needs."
      },
      {
        icon: Package,
        title: "Smart Block Selection",
        description: "Choose from 200+ pre-built business blocks covering everything from websites to marketing, legal setup to payment processing. Each block is designed to work together seamlessly."
      },
      {
        icon: Users,
        title: "Personalized Onboarding",
        description: "Our conversational onboarding flow guides you step-by-step, asking the right questions to understand your business and build a customized launch plan just for you."
      },
      {
        icon: Briefcase,
        title: "500+ Business Ideas",
        description: "Browse our curated library of 500+ proven business ideas across 20+ categories. Get inspired or find your perfect match with AI-powered recommendations."
      }
    ],
    building: [
      {
        icon: Globe,
        title: "Professional Website",
        description: "Get a beautiful, mobile-responsive website built for you. No coding required. We handle design, hosting, and setup so you can focus on your business."
      },
      {
        icon: Zap,
        title: "Brand Identity & Logo",
        description: "Receive custom logo designs, brand colors, typography, and complete brand guidelines. Build a professional identity that stands out."
      },
      {
        icon: CreditCard,
        title: "Payment Processing",
        description: "Accept payments instantly with integrated Stripe or PayPal. We set up everything from checkout pages to subscription billing."
      },
      {
        icon: Mail,
        title: "Email Marketing Setup",
        description: "Launch with professional email campaigns. We create templates, set up automation, and connect your email service provider."
      },
      {
        icon: ShieldCheck,
        title: "Legal & Compliance",
        description: "Get essential legal documents including terms of service, privacy policy, and business registration guidance. Stay compliant from day one."
      },
      {
        icon: FileText,
        title: "Business Documentation",
        description: "Receive business cards, letterheads, invoices, contracts, and all the professional documents you need to run your business."
      }
    ],
    launch: [
      {
        icon: Megaphone,
        title: "Marketing Strategy",
        description: "Launch with a complete marketing plan including social media strategy, content calendar, ad templates, and growth tactics tailored to your business."
      },
      {
        icon: TrendingUp,
        title: "Growth Missions",
        description: "Get step-by-step missions designed to help you acquire your first 10, 50, and 100 customers. Each mission includes proven tactics and templates."
      },
      {
        icon: Globe,
        title: "SEO & Online Presence",
        description: "Optimize your site for search engines, claim your Google My Business listing, and establish your presence across relevant online directories."
      },
      {
        icon: Users,
        title: "Customer Acquisition Tools",
        description: "Access lead magnets, conversion-optimized landing pages, and automated follow-up sequences to turn visitors into paying customers."
      }
    ],
    support: [
      {
        icon: Users,
        title: "Real Human Help",
        description: "You're not alone. Get access to real human experts who can answer questions, provide guidance, and help you succeed. Not just AI—actual people who care."
      },
      {
        icon: Sparkles,
        title: "AI Co-Founder",
        description: "Your AI business partner works 24/7 to build, optimize, and improve your business. Ask questions anytime and get intelligent, personalized responses."
      },
      {
        icon: ShieldCheck,
        title: "You Own Everything",
        description: "Every asset we create is 100% yours. Download your logo files, export your website, keep all your content. No lock-in, no hidden fees."
      },
      {
        icon: Zap,
        title: "Fast Turnaround",
        description: "Most businesses are ready to launch within 48 hours. We work fast so you can start getting customers and making money quickly."
      }
    ]
  };

  const TabIcon = tabs.find(t => t.id === activeTab)?.icon || Sparkles;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Knowledge Base</h1>
            <p className="text-xl text-gray-400">
              Everything you need to know about building with SpaceBlocks
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8 bg-white/5 p-2 rounded-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
            {/* Section Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="bg-white/10 rounded-2xl p-4">
                <TabIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-gray-400">
                  {activeTab === "start" && "Everything you need to know to start building amazing businesses"}
                  {activeTab === "building" && "All the tools and services to build your complete business"}
                  {activeTab === "launch" && "Strategies and tools to launch and grow your customer base"}
                  {activeTab === "support" && "The support and resources to ensure your success"}
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="space-y-8">
              {features[activeTab as keyof typeof features].map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div key={index} className="border-b border-white/10 pb-8 last:border-0 last:pb-0">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/20 rounded-xl p-3 flex-shrink-0">
                        <FeatureIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Build Your Business?</h3>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of entrepreneurs who are turning their ideas into real businesses with SpaceBlocks. Start building today.
            </p>
            <button
              onClick={() => navigate("/start")}
              className="px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              Start Building Free
              <span className="transition-transform hover:translate-x-1">→</span>
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Features;
