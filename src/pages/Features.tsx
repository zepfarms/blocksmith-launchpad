import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  Building2, 
  Megaphone, 
  Cog, 
  Shield, 
  Wallet, 
  Headphones,
  Sparkles, 
  FileText, 
  Globe, 
  Mail, 
  CreditCard, 
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Palette,
  MessageSquare,
  QrCode,
  BadgeCheck,
  Share2,
  BarChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Features = () => {
  const navigate = useNavigate();

  const quickAccessTools = [
    {
      icon: Palette,
      name: "Logo Generator",
      description: "AI-powered logo designs for your brand",
      category: "Branding",
      route: "/dashboard/logo-generation",
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: Sparkles,
      name: "Business Name Generator",
      description: "Find the perfect name for your business",
      category: "Branding",
      route: "/dashboard/business-name",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: FileText,
      name: "Business Plan Generator",
      description: "Professional business plans in minutes",
      category: "Planning",
      route: "/dashboard/business-plan",
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: QrCode,
      name: "QR Code Generator",
      description: "Custom QR codes for your business",
      category: "Marketing",
      route: "/dashboard/qr-code",
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      icon: Mail,
      name: "Email Signature",
      description: "Professional email signatures",
      category: "Branding",
      route: "/dashboard/email-signature",
      color: "from-indigo-500/20 to-purple-500/20"
    },
    {
      icon: Share2,
      name: "Social Media Checker",
      description: "Check handle availability across platforms",
      category: "Marketing",
      route: "/dashboard/social-media",
      color: "from-pink-500/20 to-rose-500/20"
    }
  ];

  const featureCategories = [
    {
      icon: Building2,
      title: "Foundation & Setup",
      features: [
        "Business Registration & Legal Structure",
        "Logo & Brand Identity Design",
        "Professional Website Development",
        "Comprehensive Business Plan",
        "Domain & Email Setup"
      ]
    },
    {
      icon: Megaphone,
      title: "Marketing & Growth",
      features: [
        "Social Media Account Setup",
        "Email Marketing Automation",
        "SEO & Content Strategy",
        "Ad Campaign Templates",
        "Analytics & Tracking"
      ]
    },
    {
      icon: Cog,
      title: "Operations & Tools",
      features: [
        "Payment Processing Integration",
        "CRM & Customer Management",
        "Inventory & Order Management",
        "Workflow Automation",
        "Project Management Tools"
      ]
    },
    {
      icon: Shield,
      title: "Legal & Compliance",
      features: [
        "Terms of Service & Privacy Policy",
        "Business Contracts & Agreements",
        "Compliance Documentation",
        "Tax Setup Guidance",
        "Insurance Recommendations"
      ]
    },
    {
      icon: Wallet,
      title: "Finance & Banking",
      features: [
        "Business Bank Account Setup",
        "Accounting Software Integration",
        "Invoice & Payment Systems",
        "Financial Planning Tools",
        "Expense Tracking"
      ]
    },
    {
      icon: Headphones,
      title: "Support & Resources",
      features: [
        "24/7 Human Support Access",
        "Launch Roadmap & Timeline",
        "Educational Resources",
        "Community Access",
        "Ongoing Business Guidance"
      ]
    }
  ];

  const useCaseExamples = [
    {
      name: "E-commerce Store",
      description: "Launch your online shop with complete payment processing, inventory management, and marketing automation",
      tools: ["Shopify", "Stripe", "Mailchimp"],
      timeframe: "48 hours",
      gradient: "from-purple-500/10 to-pink-500/10"
    },
    {
      name: "Consulting Business",
      description: "Professional website, booking system, client management, and automated workflows",
      tools: ["Website", "Calendly", "HubSpot"],
      timeframe: "24 hours",
      gradient: "from-blue-500/10 to-cyan-500/10"
    },
    {
      name: "Local Service Business",
      description: "Google My Business setup, local SEO, website, payment processing, and scheduling",
      tools: ["GMB", "Square", "Jobber"],
      timeframe: "36 hours",
      gradient: "from-green-500/10 to-emerald-500/10"
    },
    {
      name: "SaaS Product",
      description: "Full tech stack setup, user authentication, payment integration, and customer support tools",
      tools: ["AWS", "Stripe", "Intercom"],
      timeframe: "48 hours",
      gradient: "from-orange-500/10 to-red-500/10"
    },
    {
      name: "Content Creator",
      description: "Website, social media setup, email list building, and monetization tools",
      tools: ["WordPress", "Patreon", "ConvertKit"],
      timeframe: "24 hours",
      gradient: "from-indigo-500/10 to-purple-500/10"
    },
    {
      name: "Restaurant / Cafe",
      description: "Online ordering system, reservation platform, menu management, and delivery integration",
      tools: ["Toast", "OpenTable", "DoorDash"],
      timeframe: "36 hours",
      gradient: "from-pink-500/10 to-rose-500/10"
    }
  ];

  const stats = [
    { number: "200+", label: "Tools & Services" },
    { number: "500+", label: "Business Ideas" },
    { number: "48hrs", label: "Avg. Launch Time" },
    { number: "100%", label: "You Own Everything" }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 px-4 bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_50%)]" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-8 text-acari-green border-acari-green/30">
            <Sparkles className="w-3 h-3 mr-2" />
            Everything You Need to Launch
          </Badge>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-white to-acari-green bg-clip-text text-transparent">
            What Can You Build?
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            From idea to launch in 48 hours. Access 200+ tools and services to build, launch, and grow your business.
          </p>
          
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 justify-center">
            <button 
              onClick={() => navigate("/start")}
              className="group px-5 py-3 sm:px-10 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-sm sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => navigate("/tools")}
              className="px-5 py-3 sm:px-10 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-sm sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Browse Tools
            </button>
          </div>
        </div>
      </section>

      {/* Quick Access Tools Grid */}
      <section className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Start Creating <span className="text-acari-green">Right Now</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Try our free tools instantly - no signup required
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickAccessTools.map((tool) => (
              <Card 
                key={tool.name}
                className="group bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-acari-green/50 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => navigate(tool.route)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-acari-green/20 to-acari-green/5 group-hover:from-acari-green/30 group-hover:to-acari-green/10 transition-all duration-300">
                      <tool.icon className="w-6 h-6 text-acari-green" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {tool.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-acari-green transition-colors">
                    {tool.name}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="relative pt-0">
                  <button className="text-sm text-acari-green font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    Try It Free
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tools Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              <span className="text-acari-green">Partner</span> Tools
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful integrations from trusted partners
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Lovable Website Builder Card */}
            <Card className="group bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-acari-green/50 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-acari-green/20 to-acari-green/5">
                    <Globe className="w-6 h-6 text-acari-green" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-acari-green/20 text-acari-green border-acari-green/30">
                    Partner
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <img src="/lovable-icon.png" alt="Lovable" className="w-8 h-8 rounded" />
                  <CardTitle className="text-xl group-hover:text-acari-green transition-colors">
                    Lovable Website Builder
                  </CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Build beautiful websites with AI - no coding required. The most powerful AI web builder.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative pt-0">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-acari-green" />
                  <span className="text-sm text-muted-foreground">No-code AI builder</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-acari-green" />
                  <span className="text-sm text-muted-foreground">Free to start</span>
                </div>
              </CardContent>
            </Card>

            {/* Tailor Brands Card */}
            <Card className="group bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-acari-green/50 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-acari-green/20 to-acari-green/5">
                    <Shield className="w-6 h-6 text-acari-green" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-acari-green/20 text-acari-green border-acari-green/30">
                    Partner
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <img src="/tailor-brands-logo.png" alt="Tailor Brands" className="w-8 h-8 rounded" />
                  <CardTitle className="text-xl group-hover:text-acari-green transition-colors">
                    Tailor Brands LLC Formation
                  </CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Start your LLC for $0 in 3 Steps. Pay only the state fee. We'll guide you through every step.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative pt-0">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-acari-green" />
                  <span className="text-sm text-muted-foreground">$0 platform fee</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="w-4 h-4 text-acari-green" />
                  <span className="text-sm text-muted-foreground">State fee only</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="text-acari-green">Launch</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We handle the complexity so you can focus on building your business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCategories.map((category) => (
              <Card key={category.title} className="bg-card/50 border-border/50 hover:border-acari-green/30 transition-all duration-300">
                <CardHeader>
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-acari-green/20 to-acari-green/5 w-fit">
                    <category.icon className="w-8 h-8 text-acari-green" />
                  </div>
                  <CardTitle className="text-xl mb-4">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {category.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-acari-green flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Case Examples */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Real Businesses You Can <span className="text-acari-green">Launch</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what's possible with our platform - these are just a few examples
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCaseExamples.map((example) => (
              <Card key={example.name} className={`bg-gradient-to-br ${example.gradient} border-border/50 hover:border-acari-green/50 transition-all duration-300 group`}>
                <CardHeader>
                  <CardTitle className="text-xl mb-2 group-hover:text-acari-green transition-colors">
                    {example.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {example.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {example.tools.map((tool) => (
                      <Badge key={tool} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-acari-green">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Launch in {example.timeframe}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-acari-green mb-2">
                  {stat.number}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <BadgeCheck className="w-16 h-16 text-acari-green mx-auto mb-4" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your Business?
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the first 100 entrepreneurs building real businesses with Acari.ai. Start for free, pay only when you're ready to launch.
          </p>
          
          <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 justify-center mb-8">
            <button 
              onClick={() => navigate("/start")}
              className="group px-5 py-3 sm:px-10 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-sm sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => navigate("/tools")}
              className="px-5 py-3 sm:px-10 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-sm sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Browse Tools
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Build first, pay when ready</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Launch in 48 hours</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Features;