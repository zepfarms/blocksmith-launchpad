import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface HeroSectionProps {
  onCTAClick: () => void;
  onSignInClick?: () => void;
}

export const HeroSection = ({ onCTAClick, onSignInClick }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignInClick = () => {
    if (user) {
      navigate("/dashboard");
    } else if (onSignInClick) {
      onSignInClick();
    }
  };
  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden bg-black max-w-full">
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 max-w-full"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "100px 100px"
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8 md:space-y-12 w-full">
        {/* Main headline */}
        <div className="space-y-4 md:space-y-6 pt-20 px-4 max-w-full">
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-full break-words px-2">
            <span className="block text-white">
              Turn Ideas Into
            </span>
            <span className="block text-white">
              Companies — With AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-gray-400 max-w-3xl mx-auto font-light pt-4 px-2 break-words">
            Curated Tools to Start, Run, and Grow Your Company
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 md:pt-8 px-4 w-full max-w-full">
          <button
            onClick={onCTAClick}
            className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-acari-green text-black rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            Match and Grow Now
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={handleSignInClick}
            className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-base sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {user ? "Dashboard" : "Sign In"}
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
