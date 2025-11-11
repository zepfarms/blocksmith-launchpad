import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ConversationalForm } from "./ConversationalForm";

interface StartBuildingModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: {
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
  }) => void;
}

export const StartBuildingModal = ({ open, onClose, onComplete }: StartBuildingModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          Start Building Your Business
        </DialogHeader>
        <ConversationalForm onComplete={onComplete} />
      </DialogContent>
    </Dialog>
  );
};
