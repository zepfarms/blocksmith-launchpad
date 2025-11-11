import { LogoCard } from "./LogoCard";

interface Logo {
  file_url: string;
  thumbnail_url: string;
  logo_number: number;
}

interface LogoGridProps {
  logos: Logo[];
  selectedLogos: number[];
  onToggleSelection: (logoNumber: number) => void;
}

export function LogoGrid({ logos, selectedLogos, onToggleSelection }: LogoGridProps) {
  if (logos.length === 0) {
    return (
      <div className="glass-card p-12 rounded-3xl border border-white/10 text-center">
        <p className="text-muted-foreground">No logos generated yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {logos.map((logo) => (
        <LogoCard
          key={logo.logo_number}
          logo={logo}
          isSelected={selectedLogos.includes(logo.logo_number)}
          onToggle={() => onToggleSelection(logo.logo_number)}
        />
      ))}
    </div>
  );
}