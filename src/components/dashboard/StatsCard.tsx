import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <div className="glass-card p-4 md:p-6 rounded-2xl border border-border/40 hover:border-border/60 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="glass-card p-2 md:p-3 rounded-xl border border-border/40">
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-acari-green" />
        </div>
      </div>
    </div>
  );
}
