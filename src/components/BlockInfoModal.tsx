import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ExternalLink } from "lucide-react";

interface BlockInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  isFree: boolean;
  price: number;
  icon: React.ReactNode;
  onAdd: () => void;
  isSelected: boolean;
  isAffiliate?: boolean;
  affiliateLink?: string;
  logoUrl?: string;
  showAffiliateButton?: boolean; // Control whether to show "Visit Partner Website" button
}

export const BlockInfoModal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  category,
  isFree,
  price,
  icon,
  onAdd,
  isSelected,
  isAffiliate = false,
  affiliateLink,
  logoUrl,
  showAffiliateButton = true // Default to true (show in dashboard)
}: BlockInfoModalProps) => {
  const handleAction = () => {
    // Only allow affiliate link navigation if showAffiliateButton is true
    if (isAffiliate && affiliateLink && showAffiliateButton) {
      window.open(affiliateLink, '_blank', 'noopener,noreferrer');
      onClose();
    } else {
      onAdd();
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center">
              {isAffiliate && logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={`${title} logo`}
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : (
                icon
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{title}</DialogTitle>
              {subtitle && (
                <p className="text-sm text-neon-cyan/80 mb-2">{subtitle}</p>
              )}
              <div className="flex gap-2">
                {!isAffiliate && (
                  <Badge variant="outline" className="text-xs">
                    {category}
                  </Badge>
                )}
                {!isFree && (
                  <Badge variant="outline" className="text-xs">
                    ${(price / 100).toFixed(2)}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            {description || "No description available for this block."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={handleAction}
            className="rounded-full w-full"
            variant={isAffiliate && showAffiliateButton ? "default" : (isSelected ? "outline" : "default")}
          >
            {isAffiliate && showAffiliateButton ? (
              <>
                Visit Partner Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </>
            ) : isSelected ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Selected
              </>
            ) : (
              "Add to Selection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
