import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConversationalForm } from "./ConversationalForm";
import { SmartBlockSelector } from "./SmartBlockSelector";
import { ArrowLeft } from "lucide-react";

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

  // Reset form when modal closes - but preserve blocks step
  useEffect(() => {
    if (!open && step !== "blocks") {
      // Only reset if we're NOT on the blocks selection step
      // This allows users to close and reopen to continue selecting blocks
      const timer = setTimeout(() => {
        setStep("idea");
        setIdeaData(null);
        setBusinessName("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, step]);

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

  const handleBack = () => {
    if (step === "blocks") {
      setStep("name");
    } else if (step === "name") {
      setStep("idea");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">Start Building Your Business</DialogHeader>

        {/* Back Button - Only show after first step */}
        {step !== "idea" && (
          <button
            onClick={handleBack}
            className="absolute top-6 left-6 z-50 p-2 rounded-full hover:bg-white/10 transition-colors group"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
          </button>
        )}

        {step === "idea" && (
          <ConversationalForm onComplete={handleIdeaComplete} />
        )}

        {step === "name" && (
          <section className="py-16 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                  Do you have a name for your business?
                </h2>
                <p className="text-lg text-muted-foreground">
                  You can enter it now or skip and add it later
                </p>
              </div>
              
              <Input
                placeholder="Enter your business name (optional)"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="text-lg py-6"
              />

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button
                  onClick={() => setStep("blocks")}
                  className="px-10 py-5 border-2 border-white/20 text-white rounded-full font-medium text-lg hover:bg-white/5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => setStep("blocks")}
                  className="group px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  Yes, I have a name
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
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
