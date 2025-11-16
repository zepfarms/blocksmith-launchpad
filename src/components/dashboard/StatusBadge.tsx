import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface StatusBadgeProps {
  status: "not_started" | "in_progress" | "completed";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    completed: {
      label: "Completed",
      icon: CheckCircle2,
      className: "bg-acari-green/10 text-acari-green border-acari-green/20",
    },
    in_progress: {
      label: "In Progress",
      icon: Clock,
      className: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20",
    },
    not_started: {
      label: "Not Started",
      icon: Circle,
      className: "bg-muted/50 text-muted-foreground border-border/40",
    },
  };

  const { label, icon: Icon, className: statusClass } = config[status];

  return (
    <Badge variant="outline" className={`${statusClass} ${className} flex items-center gap-1.5 px-2 py-1`}>
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{label}</span>
    </Badge>
  );
}
