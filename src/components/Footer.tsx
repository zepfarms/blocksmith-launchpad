import { Link } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, subscription_source: "footer" });

      if (error) throw error;

      await supabase.functions.invoke("send-newsletter-confirmation", {
        body: { email },
      });

      toast({
        title: "Thanks for subscribing!",
        description: "Check your email for confirmation.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-t border-white/5 overflow-hidden max-w-full">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 sm:gap-12 mb-8 sm:mb-12 max-w-full">
          <div className="space-y-3 sm:space-y-4 text-center md:text-left w-full md:w-auto max-w-full">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-acari-green break-words">
              Acari
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground font-light tracking-wide break-words">
              Build your business with AI + real humans
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 w-full md:w-auto max-w-full">
            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Product</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link to="/features" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/tools" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Tools Directory
                  </Link>
                </li>
                <li>
                  <Link to="/start/browse" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Business Ideas
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Resources</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link to="/blog" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Company</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link to="/about" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/partners" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Partners
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li>
                  <Link to="/privacy" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>

            <div className="hidden md:block">
              <h4 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Connect</h4>
              <div className="flex items-center gap-3 mb-4">
                <a
                  href="https://discord.com/invite/spaceblocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Join our Discord"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/AcariAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Follow us on X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-8 text-xs"
                />
                <Button 
                  type="submit" 
                  size="sm" 
                  className="w-full h-8 text-xs"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="text-center md:text-left space-y-2 sm:space-y-3 mb-8 sm:mb-0 md:hidden max-w-full px-2">
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-acari-green break-words">
            Real business.
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground break-words">
            Real results.
          </p>
        </div>

        <div className="hidden md:block text-center md:text-right space-y-3 mb-8 max-w-full">
          <p className="text-2xl font-bold text-acari-green break-words">
            Real business.
          </p>
          <p className="text-2xl font-bold text-foreground break-words">
            Real results.
          </p>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 max-w-full">
          <p className="text-xs sm:text-sm text-muted-foreground/60 font-light text-center md:text-left">
            &copy; 2025 Acari. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-neon-cyan/30" />
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-neon-cyan/30" />
          </div>
        </div>
      </div>
    </footer>
  );
};
