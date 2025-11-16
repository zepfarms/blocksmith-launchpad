import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  QrCode, 
  Mail, 
  Share2, 
  Store
} from "lucide-react";

export function QuickActionsGrid() {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: QrCode,
      label: "QR Code",
      description: "Create QR code",
      onClick: () => navigate("/dashboard/qr-code-generator"),
      color: "text-green-400",
    },
    {
      icon: Mail,
      label: "Email Signature",
      description: "Design signature",
      onClick: () => navigate("/dashboard/email-signature-generator"),
      color: "text-orange-400",
    },
    {
      icon: Share2,
      label: "Social Check",
      description: "Check handles",
      onClick: () => navigate("/dashboard/social-media-checker"),
      color: "text-pink-400",
    },
    {
      icon: Store,
      label: "App Store",
      description: "Browse more tools",
      onClick: () => navigate("/dashboard/app-store"),
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {quickActions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="h-auto p-4 flex flex-col items-start gap-2 border-white/10 hover:bg-white/5 hover:border-white/20 transition-all group"
          onClick={action.onClick}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}