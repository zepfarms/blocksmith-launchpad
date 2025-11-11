import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlockCardProps {
  title: string;
  icon: React.ReactNode;
  category: string;
  isSelected: boolean;
  onToggle: () => void;
}

export const BlockCard = ({ title, icon, category, isSelected, onToggle }: BlockCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative p-6 rounded-2xl transition-all duration-300",
        "glass-card hover:shadow-xl",
        isSelected && "ring-2 ring-primary glow-effect",
        isHovered && !isSelected && "scale-105"
      )}
    >
      {/* Selection indicator */}
      <div
        className={cn(
          "absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-ion-blue to-cosmic-purple",
          "flex items-center justify-center transition-all duration-300",
          isSelected ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check className="w-5 h-5 text-white" />
      </div>

      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-ion-blue/10 to-cosmic-purple/10",
          "flex items-center justify-center transition-all duration-300",
          isSelected && "from-ion-blue/20 to-cosmic-purple/20"
        )}
      >
        <div className={cn("transition-all duration-300", isSelected && "scale-110")}>
          {icon}
        </div>
      </div>

      {/* Category badge */}
      <div className="inline-block px-3 py-1 mb-2 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
        {category}
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
    </button>
  );
};
