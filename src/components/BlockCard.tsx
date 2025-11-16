import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Check, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlockCardProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  category: string;
  description: string;
  isFree: boolean;
  price: number;
  monthlyPrice: number;
  pricingType: 'free' | 'one_time' | 'monthly';
  isSelected: boolean;
  onToggle: () => void;
  onInfoClick: () => void;
  index: number;
  isUnlocked?: boolean;
  isPurchased?: boolean;
  hasActiveSubscription?: boolean;
  isAffiliate?: boolean;
  logoUrl?: string;
}

export const BlockCard = ({ 
  title,
  subtitle,
  icon, 
  category, 
  description, 
  isFree, 
  price, 
  monthlyPrice, 
  pricingType, 
  isSelected, 
  onToggle, 
  onInfoClick, 
  index,
  isUnlocked = false,
  isPurchased = false,
  hasActiveSubscription = false,
  isAffiliate = false,
  logoUrl
}: BlockCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if block is already owned
  const isOwned = isUnlocked || isPurchased || hasActiveSubscription;
  const ownershipLabel = hasActiveSubscription 
    ? 'SUBSCRIBED' 
    : isPurchased 
    ? 'PURCHASED' 
    : isUnlocked 
    ? 'UNLOCKED' 
    : null;

  return (
    <button
      onClick={isOwned ? undefined : onToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isOwned}
      className={cn(
        "group relative p-5 md:p-7 rounded-2xl transition-all duration-500",
        "glass-card-hover",
        "border border-white/5",
        "h-full flex flex-col items-center text-center",
        "shadow-[0_0_20px_rgba(34,211,238,0.15)]",
        isOwned && "opacity-75 cursor-not-allowed",
        !isOwned && isSelected && "neon-border shadow-[0_0_30px_rgba(34,211,238,0.3)]",
        !isOwned && isHovered && !isSelected && "border-neon-cyan/20"
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Permanent ambient glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 animate-glow-pulse opacity-50" />

      {/* Info icon - top left */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onInfoClick();
        }}
        className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all z-10"
      >
        <Info className="h-3.5 w-3.5 text-white" />
      </button>

      {/* Ownership/Selection indicator - top right */}
      {isOwned ? (
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full transition-all duration-300 z-10 flex items-center justify-center border-2 bg-green-500 border-green-500">
          <Check className="h-4 w-4 text-white" />
        </div>
      ) : (
        <div
          className={cn(
            "absolute -top-2 -right-2 w-7 h-7 rounded-full transition-all duration-300 z-10",
            "flex items-center justify-center",
            "border-2",
            isSelected 
              ? "bg-neon-cyan border-neon-cyan" 
              : "bg-white/10 border-white/20 backdrop-blur-sm"
          )}
        >
          {isSelected ? (
            <Check className="h-4 w-4 text-black" />
          ) : (
            <Plus className="h-4 w-4 text-white" />
          )}
        </div>
      )}

      {/* Icon or Logo container */}
      <div
        className={cn(
          "relative w-14 h-14 md:w-16 md:h-16 mb-3 rounded-xl transition-all duration-500",
          "bg-gradient-to-br from-white/5 to-white/[0.02]",
          "border border-white/10",
          "flex items-center justify-center",
          "shadow-[0_4px_16px_rgba(0,0,0,0.3)]",
          isAffiliate && "border-purple-500/30",
          isSelected && !isAffiliate && "shadow-[0_0_20px_rgba(34,211,238,0.3)] border-neon-cyan/30 scale-110",
          isSelected && isAffiliate && "shadow-[0_0_20px_rgba(168,85,247,0.4)] border-purple-500/50 scale-110",
          isHovered && !isSelected && !isAffiliate && "scale-105",
          isHovered && !isSelected && isAffiliate && "scale-105 border-purple-500/40"
        )}
      >
        {/* Inner glow */}
        <div className={cn(
          "absolute inset-1 rounded-lg bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          isAffiliate ? "from-purple-500/10 to-purple-600/10" : "from-neon-cyan/10 to-neon-purple/10"
        )} />
        
        {isAffiliate && logoUrl ? (
          <img 
            src={logoUrl} 
            alt={`${title} logo`}
            className="relative w-10 h-10 md:w-12 md:h-12 object-contain rounded-lg"
          />
        ) : (
          <div className={cn(
            "relative transition-all duration-500 scale-75",
            isSelected && "scale-90"
          )}>
            {icon}
          </div>
        )}
      </div>

      {/* Category badge */}
      <div className="inline-flex items-center px-2 py-1 mb-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
        <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {category}
        </span>
      </div>

      {/* Ownership or Pricing badge */}
      <div className="mb-2">
        {pricingType === 'free' || isFree ? (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] md:text-xs">
            FREE
          </Badge>
        ) : isOwned ? (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] md:text-xs">
            {ownershipLabel}
          </Badge>
        ) : pricingType === 'monthly' ? (
          <Badge variant="outline" className="text-neon-purple border-neon-purple/30 text-[10px] md:text-xs">
            ${(monthlyPrice / 100).toFixed(2)}/month
          </Badge>
        ) : (
          <Badge variant="outline" className="text-neon-cyan border-neon-cyan/30 text-[10px] md:text-xs">
            ${(price / 100).toFixed(2)} one-time
          </Badge>
        )}
      </div>

      {/* Title - compact */}
      <h3 className={cn(
        "text-xs md:text-sm font-bold transition-all duration-300 leading-tight",
        isSelected && "text-neon-cyan"
      )}>
        {title}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
          {subtitle}
        </p>
      )}

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
