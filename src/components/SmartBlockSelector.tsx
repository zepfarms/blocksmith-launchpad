import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// All available blocks
const allBlocks = [
  { id: "idea", title: "Business Idea", category: "Start", color: "neon-cyan" },
  { id: "name-logo", title: "Name & Logo", category: "Brand", color: "electric-indigo" },
  { id: "logo-design", title: "Logo Design", category: "Brand", color: "electric-indigo" },
  { id: "business-cards", title: "Business Cards", category: "Brand", color: "electric-indigo" },
  { id: "custom-tshirts", title: "Custom T-Shirts", category: "Brand", color: "electric-indigo" },
  { id: "website", title: "Website", category: "Site", color: "neon-cyan" },
  { id: "custom-website", title: "Custom Website", category: "Site", color: "neon-cyan" },
  { id: "products", title: "Products", category: "Commerce", color: "neon-purple" },
  { id: "store-setup", title: "Store Setup", category: "Commerce", color: "neon-purple" },
  { id: "payments", title: "Payments", category: "Commerce", color: "neon-purple" },
  { id: "legal-setup", title: "Legal Setup", category: "Legal", color: "electric-blue" },
  { id: "ein-irs", title: "EIN & IRS Help", category: "Legal", color: "electric-blue" },
  { id: "insurance", title: "Insurance", category: "Legal", color: "electric-blue" },
  { id: "social-media", title: "Social Media Kit", category: "Marketing", color: "neon-cyan" },
  { id: "email-setup", title: "Email Setup", category: "Marketing", color: "neon-cyan" },
  { id: "marketing-plan", title: "Marketing Plan", category: "Marketing", color: "neon-cyan" },
  { id: "ads-starter", title: "Ads Starter", category: "Growth", color: "electric-indigo" },
  { id: "customer-support", title: "Customer Support", category: "Support", color: "neon-purple" },
  { id: "booking-system", title: "Booking System", category: "Sales", color: "neon-purple" },
  { id: "automations", title: "Automations", category: "Automation", color: "electric-indigo" },
  { id: "sba-help", title: "SBA Help", category: "Finance", color: "electric-blue" },
  { id: "loans", title: "Loans", category: "Finance", color: "electric-blue" },
  { id: "grants", title: "Grants & Funding", category: "Finance", color: "electric-blue" },
  { id: "business-plan", title: "Business Plans", category: "Start", color: "neon-cyan" },
  { id: "pitch-deck", title: "Pitch Decks", category: "Start", color: "neon-cyan" },
  { id: "hiring", title: "Hiring", category: "Operations", color: "electric-indigo" },
];

interface SmartBlockSelectorProps {
  recommendedBlockIds: string[];
  onComplete: (selectedBlocks: string[]) => void;
}

export const SmartBlockSelector = ({ recommendedBlockIds, onComplete }: SmartBlockSelectorProps) => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>(recommendedBlockIds);
  const [showAllBlocks, setShowAllBlocks] = useState(false);

  const recommendedBlocks = allBlocks.filter(b => recommendedBlockIds.includes(b.id));
  const otherBlocks = allBlocks.filter(b => !recommendedBlockIds.includes(b.id));

  const toggleBlock = (id: string) => {
    setSelectedBlocks(prev =>
      prev.includes(id) ? prev.filter(blockId => blockId !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* Recommended Blocks */}
      <div className="space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
            <span className="text-sm font-semibold">Recommended for You</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground">
            Pick the blocks you need help with
          </h3>
          <p className="text-lg text-muted-foreground font-light">
            Based on your answers, we recommend starting with these
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recommendedBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => toggleBlock(block.id)}
              className={cn(
                "p-5 rounded-2xl text-center transition-all duration-300",
                "glass-card border font-semibold",
                selectedBlocks.includes(block.id)
                  ? `border-${block.color}/50 bg-${block.color}/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]`
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <span className="text-sm md:text-base">{block.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* View More Blocks Toggle */}
      <div className="text-center">
        <Button
          variant="glass"
          onClick={() => setShowAllBlocks(!showAllBlocks)}
          className="group"
        >
          {showAllBlocks ? (
            <>
              Show Less
              <ChevronUp className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              View More Blocks
              <ChevronDown className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* All Other Blocks */}
      {showAllBlocks && (
        <div className="space-y-6 animate-slide-up-fade">
          <div className="text-center space-y-3">
            <h4 className="text-2xl md:text-3xl font-bold text-foreground">
              All Available Blocks
            </h4>
            <p className="text-base text-muted-foreground font-light">
              Get ideas and add anything else you might need
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {otherBlocks.map((block) => (
              <button
                key={block.id}
                onClick={() => toggleBlock(block.id)}
                className={cn(
                  "p-5 rounded-2xl text-center transition-all duration-300",
                  "glass-card border font-semibold",
                  selectedBlocks.includes(block.id)
                    ? `border-${block.color}/50 bg-${block.color}/10 shadow-[0_0_30px_rgba(34,211,238,0.3)]`
                    : "border-white/10 hover:border-white/20"
                )}
              >
                <span className="text-sm md:text-base">{block.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {selectedBlocks.length > 0 && (
        <div className="text-center space-y-6 pt-8 animate-slide-up-fade">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-cyan/50" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
              {selectedBlocks.length} Block{selectedBlocks.length !== 1 ? "s" : ""} Selected
            </span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-cyan/50" />
          </div>

          <Button
            variant="empire"
            size="xl"
            onClick={() => onComplete(selectedBlocks)}
            className="group"
          >
            <span className="flex items-center gap-3">
              Continue
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </Button>

          <p className="text-sm text-muted-foreground/70 font-light">
            You only pay when you're ready to launch
          </p>
        </div>
      )}
    </div>
  );
};
