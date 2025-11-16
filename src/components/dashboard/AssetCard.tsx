import { FileImage, FileText, QrCode, Mail, Share2, Download, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AssetCardProps {
  asset: {
    id: string;
    asset_type: string;
    file_url: string;
    thumbnail_url: string | null;
    metadata: any;
    created_at: string;
  };
  onView: () => void;
  onDelete: () => void;
}

const getAssetIcon = (type: string) => {
  const icons: Record<string, any> = {
    logo: FileImage,
    business_plan: FileText,
    qr_code: QrCode,
    email_signature: Mail,
    social_handles: Share2,
  };
  return icons[type] || FileImage;
};

const getAssetTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    logo: 'Logo',
    business_plan: 'Business Plan',
    qr_code: 'QR Code',
    email_signature: 'Email Signature',
    social_handles: 'Social Handles',
  };
  return labels[type] || type;
};

const getAssetBadgeColor = (type: string): string => {
  const colors: Record<string, string> = {
    logo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    business_plan: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    qr_code: 'bg-green-500/20 text-green-400 border-green-500/30',
    email_signature: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    social_handles: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  };
  return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

export function AssetCard({ asset, onView, onDelete }: AssetCardProps) {
  const Icon = getAssetIcon(asset.asset_type);
  
  const handleDownload = () => {
    window.open(asset.file_url, '_blank');
  };

  return (
    <div className="glass-card p-6 hover:scale-[1.02] transition-all duration-200 group">
      {/* Thumbnail or Icon */}
      <div className="relative mb-4 aspect-square rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
        {asset.thumbnail_url || (asset.asset_type === 'logo') ? (
          <img
            src={asset.thumbnail_url || asset.file_url}
            alt={getAssetTypeLabel(asset.asset_type)}
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-16 h-16 text-muted-foreground" />
        )}
      </div>

      {/* Type Badge */}
      <Badge className={`mb-3 ${getAssetBadgeColor(asset.asset_type)}`}>
        {getAssetTypeLabel(asset.asset_type)}
      </Badge>

      {/* Metadata */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Created {format(new Date(asset.created_at), 'MMM d, yyyy')}
        </p>
        {asset.metadata?.name && (
          <p className="text-sm font-medium text-foreground mt-1 truncate">
            {asset.metadata.name}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-white/20 hover:bg-white/10"
          onClick={onView}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-white/20 hover:bg-white/10"
          onClick={handleDownload}
        >
          <Download className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background border border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Asset</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this {getAssetTypeLabel(asset.asset_type).toLowerCase()}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/20">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}