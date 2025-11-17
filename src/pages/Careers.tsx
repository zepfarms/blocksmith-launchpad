import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Rocket, Globe, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { useToast } from "@/hooks/use-toast";

export default function Careers() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, subscription_source: "careers" });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "We'll notify you when new positions open up.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Failed to subscribe",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const culture = [
    {
      icon: Globe,
      title: "Remote-First",
      description: "Work from anywhere in the world. We believe in flexibility and trust."
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "We care about results, not when you're online. Set your own schedule."
    },
    {
      icon: TrendingUp,
      title: "Growth Opportunities",
      description: "Learn, grow, and advance your career in a fast-paced startup environment."
    },
    {
      icon: Rocket,
      title: "Make an Impact",
      description: "Your work directly helps entrepreneurs launch and grow their businesses."
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
              Build the Future with Acari
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our mission to democratize entrepreneurship and help millions launch their dream businesses.
            </p>
          </div>

          {/* Culture */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Why Join Acari?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {culture.map((item) => (
                <div key={item.title} className="glass-card p-6">
                  <item.icon className="w-12 h-12 text-acari-green mb-4" />
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="glass-card p-8 text-center">
            <Rocket className="w-16 h-16 text-acari-green mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Opportunities Coming Soon</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're growing fast and will be adding new positions soon. Leave your email to be the first to know when we're hiring.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Subscribing..." : "Notify Me"}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-muted-foreground mb-4">
                In the meantime, connect with us on LinkedIn to stay updated
              </p>
              <Button
                variant="outline"
                onClick={() => window.open("https://linkedin.com/company/acari-ai", "_blank")}
              >
                Follow on LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}