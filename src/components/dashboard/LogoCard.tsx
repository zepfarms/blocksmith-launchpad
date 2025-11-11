import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Logo {
  file_url: string;
  thumbnail_url: string;
  logo_number: number;
}

interface LogoCardProps {
  logo: Logo;
  isSelected: boolean;
  onToggle: () => void;
}

export function LogoCard({ logo, isSelected, onToggle }: LogoCardProps) {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "glass-card rounded-2xl border overflow-hidden cursor-pointer transition-all duration-200 hover:scale-[1.02]",
        isSelected
          ? "border-primary shadow-lg shadow-primary/20"
          : "border-white/10 hover:border-white/20"
      )}
    >
      <div className="relative aspect-square bg-gradient-to-br from-white/5 to-white/10 p-8">
        {/* Checkerboard background to show transparency */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(45deg, #ccc 25%, transparent 25%),
              linear-gradient(-45deg, #ccc 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #ccc 75%),
              linear-gradient(-45deg, transparent 75%, #ccc 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />
        
        <img
          src={logo.file_url}
          alt={`Logo ${logo.logo_number}`}
          className="relative w-full h-full object-contain"
        />
        
        <div className="absolute top-4 right-4">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <Checkbox checked={isSelected} />
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <p className="text-sm text-muted-foreground text-center">
          Logo {logo.logo_number}
        </p>
      </div>
    </div>
  );
}