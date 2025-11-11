import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationalForm } from "./ConversationalForm";
import { SmartBlockSelector } from "./SmartBlockSelector";

interface StartBuildingModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: {
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
    businessName?: string;
    selectedBlocks?: string[];
  }) => void;
}

export const StartBuildingModal = ({ open, onClose, onComplete }: StartBuildingModalProps) => {
  const [step, setStep] = useState<"idea" | "name" | "blocks">("idea");
  const [ideaData, setIdeaData] = useState<{
    businessIdea: string;
    aiAnalysis: string;
    selectedIdeaRow?: any;
  } | null>(null);
  const [businessName, setBusinessName] = useState("");

  const handleIdeaComplete = (data: { businessIdea: string; aiAnalysis: string; selectedIdeaRow?: any; }) => {
    setIdeaData(data);
    setStep("name");
  };

  const handleBlocksComplete = (selectedBlocks: string[]) => {
    if (!ideaData) return;
    onComplete({
      ...ideaData,
      businessName: businessName.trim() || undefined,
      selectedBlocks,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">Start Building Your Business</DialogHeader>

        {step === "idea" && (
          <ConversationalForm onComplete={handleIdeaComplete} />
        )}

        {step === "name" && (
          <section className="py-10 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                Do you have a name for your business?
              </h2>
              <p className="text-muted-foreground">
                You can enter it now or skip and add it later. We'll use this to personalize your plan.
              </p>
              <Input
                placeholder="Enter your business name (optional)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep("blocks")}>Skip</Button>
                <Button variant="default" onClick={() => setStep("blocks")}>Continue</Button>
              </div>
            </div>
          </section>
        )}

        {step === "blocks" && (
          <SmartBlockSelector
            starterBlocks={ideaData?.selectedIdeaRow?.starter_blocks || ""}
            growthBlocks={ideaData?.selectedIdeaRow?.growth_blocks || ""}
            onComplete={handleBlocksComplete}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
