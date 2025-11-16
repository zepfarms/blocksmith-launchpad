import { formatDistanceToNow } from "date-fns";
import { Package, FileImage, Clock, CheckCircle2 } from "lucide-react";

interface Activity {
  type: string;
  description: string;
  timestamp: string;
}

interface RecentActivityFeedProps {
  activities: Activity[];
}

export function RecentActivityFeed({ activities }: RecentActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'block_unlocked':
        return Package;
      case 'asset_created':
        return FileImage;
      case 'block_completed':
        return CheckCircle2;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'block_unlocked':
        return 'text-blue-400';
      case 'asset_created':
        return 'text-green-400';
      case 'block_completed':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No recent activity yet</p>
        <p className="text-xs mt-1">Start using your tools to see activity here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const color = getActivityColor(activity.type);
        
        return (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}