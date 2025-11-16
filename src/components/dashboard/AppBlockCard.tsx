import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";

interface BlockData {
  name: string;
  category: string;
  subtitle: string;
  description: string;
  isFree: boolean;
  isAffiliate: boolean;
  affiliateLink: string;
  logoUrl: string;
  completionStatus: 'not_started' | 'in_progress' | 'completed';
}

interface AppBlockCardProps {
  block: BlockData;
  onClick: () => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    foundation: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    growth: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    partnerships: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };
  return colors[category.toLowerCase()] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

const getStatusConfig = (status: string) => {
  const configs = {
    not_started: {
      icon: Circle,
      color: 'text-gray-400',
      label: 'Not Started',
      buttonText: 'Get Started',
    },
    in_progress: {
      icon: Clock,
      color: 'text-blue-400',
      label: 'In Progress',
      buttonText: 'Continue',
    },
    completed: {
      icon: CheckCircle2,
      color: 'text-green-400',
      label: 'Completed',
      buttonText: 'Launch',
    },
  };
  return configs[status as keyof typeof configs] || configs.not_started;
};

export function AppBlockCard({ block, onClick }: AppBlockCardProps) {
  const statusConfig = getStatusConfig(block.completionStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="glass-card p-2 hover:scale-[1.02] transition-all duration-200 group cursor-pointer">
      {/* Logo/Icon */}
      <div className="relative mb-1.5 h-12 sm:h-16 rounded-md bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
        {block.logoUrl ? (
          <img
            src={block.logoUrl}
            alt={block.name}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <div className="text-lg sm:text-xl font-bold text-primary">
            {block.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-1.5">
        <Badge className={`text-[10px] px-1 py-0 ${getCategoryColor(block.category)}`}>
          {block.category}
        </Badge>
        {block.isFree && (
          <Badge className="text-[10px] px-1 py-0 bg-green-500/20 text-green-400 border-green-500/30">
            FREE
          </Badge>
        )}
        {block.isAffiliate && (
          <Badge className="text-[10px] px-1 py-0 bg-orange-500/20 text-orange-400 border-orange-500/30">
            PARTNER
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="mb-1.5">
        <h3 className="text-xs font-semibold text-foreground line-clamp-1">
          {block.name}
        </h3>
        <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
          {block.description}
        </p>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center gap-1 mb-1.5 pb-1.5 border-b border-white/10">
        <StatusIcon className={`w-2.5 h-2.5 ${statusConfig.color}`} />
        <span className={`text-[10px] ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Action Button */}
      <Button
        onClick={onClick}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-[10px] h-6 px-2"
        size="sm"
      >
        {block.isAffiliate ? (
          <>
            Visit
            <ExternalLink className="w-2.5 h-2.5 ml-1" />
          </>
        ) : (
          statusConfig.buttonText
        )}
      </Button>
    </div>
  );
}