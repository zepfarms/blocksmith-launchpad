import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const benefits = [
  "Priority access to platform",
  "Founders badge & recognition",
  "Lifetime discount pricing",
  "Human support & guidance",
  "Custom block bundles",
  "Early Idea-to-Launch Engine access",
];

export const BetaSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("You're on the list!", {
        description: "Welcome to the First 100 Founders. Check your email!",
      });
      setEmail("");
    }
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="relative p-12 rounded-3xl glass-card glow-effect overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-ion-blue/10 via-cosmic-purple/10 to-transparent opacity-50" />

          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-ion-blue/20 to-cosmic-purple/20 text-sm font-medium">
                <Sparkles className="w-4 h-4 text-cosmic-purple" />
                <span>Beta Founder Program</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Join the First <span className="gradient-text">100 Founders</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                We're onboarding our first 100 entrepreneurs to launch with us.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/50 backdrop-blur-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-ion-blue to-cosmic-purple flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 rounded-full glass-card border-border/50"
                />
                <Button type="submit" variant="pill" size="lg" className="whitespace-nowrap">
                  Join the First 100
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
