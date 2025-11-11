import { useState } from "react";
import { cn } from "@/lib/utils";

interface BlockCardProps {
  title: string;
  icon: React.ReactNode;
  category: string;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

export const BlockCard = ({ title, icon, category, isSelected, onToggle, index }: BlockCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative p-8 rounded-3xl transition-all duration-500",
        "glass-card-hover",
        "border border-white/5",
        isSelected && "neon-border shadow-[0_0_40px_rgba(34,211,238,0.4)]",
        isHovered && !isSelected && "border-neon-cyan/20"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Ambient glow effect */}
      {isSelected && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 animate-glow-pulse" />
      )}

      {/* Selection indicator - modular connection point */}
      <div
        className={cn(
          "absolute -top-3 -right-3 w-12 h-12 rounded-2xl transition-all duration-500",
          "flex items-center justify-center",
          "bg-gradient-to-br from-neon-cyan to-electric-indigo",
          "shadow-[0_0_20px_rgba(34,211,238,0.6)]",
          isSelected ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 rotate-180"
        )}
      >
        <div className="w-6 h-6 rounded-lg bg-background flex items-center justify-center">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-br from-neon-cyan to-electric-indigo" />
        </div>
      </div>

      {/* Icon container - floating module aesthetic */}
      <div
        className={cn(
          "relative w-20 h-20 mb-6 rounded-2xl transition-all duration-500",
          "bg-gradient-to-br from-white/5 to-white/[0.02]",
          "border border-white/10",
          "flex items-center justify-center",
          "shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
          isSelected && "shadow-[0_0_30px_rgba(34,211,238,0.3)] border-neon-cyan/30 scale-110",
          isHovered && !isSelected && "scale-105"
        )}
      >
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className={cn(
          "relative transition-all duration-500",
          isSelected && "scale-110"
        )}>
          {icon}
        </div>
      </div>

      {/* Category badge */}
      <div className="inline-flex items-center px-4 py-1.5 mb-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {category}
        </span>
      </div>

      {/* Title */}
      <h3 className={cn(
        "text-lg font-bold transition-all duration-300",
        isSelected && "text-neon-cyan"
      )}>
        {title}
      </h3>

      {/* Modular connection lines */}
      {isSelected && (
        <>
          <div className="absolute top-0 left-1/2 w-px h-8 bg-gradient-to-b from-neon-cyan/50 to-transparent -translate-x-1/2 -translate-y-8" />
          <div className="absolute bottom-0 left-1/2 w-px h-8 bg-gradient-to-t from-neon-cyan/50 to-transparent -translate-x-1/2 translate-y-8" />
        </>
      )}
    </button>
  );
};
