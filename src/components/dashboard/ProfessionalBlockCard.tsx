import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { ExternalLink, PlayCircle, Sparkles } from "lucide-react";

interface ProfessionalBlockCardProps {
  id: string;
  title: string;
  description: string;
  completionStatus: "not_started" | "in_progress" | "completed";
  category?: string;
  isFree?: boolean;
  isAffiliate?: boolean;
  logoUrl?: string;
  onAction: () => void;
}

export function ProfessionalBlockCard({
  title,
  description,
  completionStatus,
  category,
  isFree,
  isAffiliate,
  logoUrl,
  onAction,
}: ProfessionalBlockCardProps) {
  const getActionLabel = () => {
    if (isAffiliate) return "Visit Partner";
    if (completionStatus === "completed") return "Launch";
    if (completionStatus === "in_progress") return "Continue";
    return "Get Started";
  };

  const ActionIcon = isAffiliate ? ExternalLink : completionStatus === "completed" ? Sparkles : PlayCircle;

  return (
    <div className="glass-card rounded-2xl border border-border/40 overflow-hidden hover:border-border/60 transition-all duration-200 hover:-translate-y-1 group">
      {/* Logo Section */}
      <div className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/10 p-8 flex items-center justify-center">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={title}
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
          />
        ) : (
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-acari-green/20 to-acari-green/5 border border-acari-green/20 flex items-center justify-center">
            <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-acari-green" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isFree && (
            <Badge className="bg-acari-green text-background font-semibold text-xs">
              FREE
            </Badge>
          )}
          {isAffiliate && (
            <Badge className="bg-neon-purple text-background font-semibold text-xs">
              PARTNER
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg md:text-xl text-foreground line-clamp-1 group-hover:text-acari-green transition-colors">
              {title}
            </h3>
            {category && (
              <Badge variant="outline" className="text-xs shrink-0 border-border/40 text-muted-foreground">
                {category}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>

        {/* Status & Action */}
        <div className="flex items-center gap-3 pt-2">
          <StatusBadge status={completionStatus} className="flex-1" />
          <Button
            onClick={onAction}
            size="sm"
            className="bg-acari-green hover:bg-acari-green/90 text-background font-semibold rounded-full px-4 shadow-lg hover:shadow-acari-glow-subtle transition-all duration-200"
          >
            <ActionIcon className="h-4 w-4 mr-1.5" />
            {getActionLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
}
