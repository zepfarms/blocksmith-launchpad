import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  onCTAClick: () => void;
}

export const HeroSection = ({ onCTAClick }: HeroSectionProps) => {
  const navigate = useNavigate();

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
            Get matched with apps to Start, Run and Grow Your Business
          </p>
        </div>

        {/* CTA buttons */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-4 items-center justify-center pt-4 md:pt-8 px-4 w-full max-w-full">
          <button
            onClick={onCTAClick}
            className="group px-5 py-3 sm:px-10 sm:py-5 bg-black border-2 border-acari-green text-acari-green rounded-full font-medium text-sm sm:text-lg hover:bg-acari-green/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Build Your Stack
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <button
            onClick={() => navigate("/tools")}
            className="px-5 py-3 sm:px-10 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-sm sm:text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Browse Tools
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
