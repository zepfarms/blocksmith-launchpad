import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Target, Users, Lightbulb, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We leverage cutting-edge AI technology to make entrepreneurship accessible to everyone."
    },
    {
      icon: Users,
      title: "Empowerment",
      description: "We believe in empowering entrepreneurs with the tools and knowledge they need to succeed."
    },
    {
      icon: Target,
      title: "Partnership",
      description: "We build meaningful partnerships that create value for entrepreneurs and businesses alike."
    },
    {
      icon: Shield,
      title: "Transparency",
      description: "We operate with honesty and integrity in all our business relationships."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-acari-green to-neon-cyan bg-clip-text text-transparent">
              Building the Future of Entrepreneurship
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acari combines AI technology with human expertise to help entrepreneurs launch and grow their businesses.
            </p>
          </div>

          {/* Mission */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We're on a mission to democratize entrepreneurship by providing accessible, intelligent tools that simplify the business launch process. Every entrepreneur deserves the opportunity to turn their ideas into reality, and we're here to make that journey easier.
            </p>
          </div>

          {/* Story */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Acari was born from a simple observation: starting a business is harder than it should be. The traditional path requires navigating complex legal requirements, creating professional assets, building a digital presence, and so much more.
              </p>
              <p>
                We saw an opportunity to leverage AI technology to streamline this process, making it faster, more affordable, and more accessible to everyone. By combining intelligent automation with carefully curated partnerships, we've created a platform that guides entrepreneurs from idea to launch.
              </p>
              <p>
                Today, we're proud to serve thousands of entrepreneurs, helping them launch businesses across diverse industries and geographies.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div key={value.title} className="glass-card p-6">
                  <value.icon className="w-12 h-12 text-acari-green mb-4" />
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="glass-card p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Us on Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Whether you're an entrepreneur, partner, or team member, there's a place for you at Acari.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => navigate("/start")} size="lg">
                Start Your Business
              </Button>
              <Button onClick={() => navigate("/careers")} variant="outline" size="lg">
                View Careers
              </Button>
              <Button onClick={() => navigate("/partners")} variant="outline" size="lg">
                Become a Partner
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}