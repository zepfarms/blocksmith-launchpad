import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface BlockInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  category: string;
  isFree: boolean;
  price: number;
  icon: React.ReactNode;
  onAdd: () => void;
  isSelected: boolean;
}

export const BlockInfoModal = ({
  isOpen,
  onClose,
  title,
  description,
  category,
  isFree,
  price,
  icon,
  onAdd,
  isSelected,
}: BlockInfoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-background border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center">
              {icon}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold mb-2">{title}</DialogTitle>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {category}
                </Badge>
                {isFree ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    FREE
                  </Badge>
                ) : (
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
            onClick={() => {
              onAdd();
              onClose();
            }}
            className="rounded-full w-full"
            variant={isSelected ? "outline" : "default"}
          >
            {isSelected ? (
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
