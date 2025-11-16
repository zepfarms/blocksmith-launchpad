import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface AssetPreviewModalProps {
  asset: {
    id: string;
    asset_type: string;
    file_url: string;
    thumbnail_url: string | null;
    metadata: any;
    created_at: string;
  };
  open: boolean;
  onClose: () => void;
}

export function AssetPreviewModal({ asset, open, onClose }: AssetPreviewModalProps) {
  const handleDownload = () => {
    window.open(asset.file_url, '_blank');
  };

  const renderPreview = () => {
    switch (asset.asset_type) {
      case 'logo':
        return (
          <div className="flex items-center justify-center bg-white/5 rounded-lg p-8 border border-white/10">
            <img
              src={asset.file_url}
              alt="Logo preview"
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        );

      case 'qr_code':
        return (
          <div className="flex items-center justify-center bg-white rounded-lg p-8">
            <img
              src={asset.file_url}
              alt="QR Code preview"
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        );

      case 'business_plan':
        return (
          <div className="space-y-4">
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">Business Plan Details</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Generated:</span> {format(new Date(asset.created_at), 'PPP')}</p>
                {asset.metadata?.plan_id && (
                  <p><span className="text-muted-foreground">Plan ID:</span> {asset.metadata.plan_id}</p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full border-white/20 hover:bg-white/10"
              onClick={handleDownload}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open PDF in New Tab
            </Button>
          </div>
        );

      case 'email_signature':
        return (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Email Signature Details</h3>
            <div className="space-y-2 text-sm mb-4">
              {asset.metadata?.name && (
                <p><span className="text-muted-foreground">Name:</span> {asset.metadata.name}</p>
              )}
              {asset.metadata?.template && (
                <p><span className="text-muted-foreground">Template:</span> {asset.metadata.template}</p>
              )}
              <p><span className="text-muted-foreground">Created:</span> {format(new Date(asset.created_at), 'PPP')}</p>
            </div>
            <div 
              className="bg-white p-4 rounded border border-gray-200"
              dangerouslySetInnerHTML={{ __html: asset.metadata?.html || 'Preview not available' }}
            />
          </div>
        );

      case 'social_handles':
        const handleData = typeof asset.file_url === 'string' 
          ? JSON.parse(asset.file_url) 
          : asset.metadata;
        
        return (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Social Media Availability</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Username: <span className="text-foreground font-medium">{handleData.username}</span>
              </p>
              <div className="grid gap-2">
                {handleData.platforms?.map((platform: any) => (
                  <div
                    key={platform.name}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <span className="font-medium">{platform.name}</span>
                    <span
                      className={`text-sm px-3 py-1 rounded-full ${
                        platform.status === 'available'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {platform.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Preview not available for this asset type
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {asset.asset_type === 'logo' && 'Logo Preview'}
            {asset.asset_type === 'business_plan' && 'Business Plan'}
            {asset.asset_type === 'qr_code' && 'QR Code Preview'}
            {asset.asset_type === 'email_signature' && 'Email Signature'}
            {asset.asset_type === 'social_handles' && 'Social Media Handles'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {renderPreview()}

          {asset.asset_type !== 'social_handles' && (
            <Button
              onClick={handleDownload}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}