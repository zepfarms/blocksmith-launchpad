import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockCard } from "./BlockCard";

// Icon components from BlockSelector
const IconCircuit = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-neon-cyan">
    <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M16 3V13M16 19V29M3 16H13M19 16H29" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="3" r="2" fill="currentColor" />
    <circle cx="16" cy="29" r="2" fill="currentColor" />
    <circle cx="3" cy="16" r="2" fill="currentColor" />
    <circle cx="29" cy="16" r="2" fill="currentColor" />
  </svg>
);

const IconModule = ({ color = "currentColor" }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="20" height="20" stroke={color} strokeWidth="2" rx="2" />
    <path d="M6 16H26M16 6V26" stroke={color} strokeWidth="2" />
    <circle cx="16" cy="16" r="2" fill={color} />
  </svg>
);

const IconCube = ({ color = "currentColor" }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L28 10V22L16 28L4 22V10L16 4Z" stroke={color} strokeWidth="2" fill="none" />
    <path d="M16 4V16M16 16L28 10M16 16L4 10" stroke={color} strokeWidth="2" />
    <circle cx="16" cy="16" r="2" fill={color} />
  </svg>
);

const IconHex = ({ color = "currentColor" }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 3L28 9.5V22.5L16 29L4 22.5V9.5L16 3Z" stroke={color} strokeWidth="2" />
    <circle cx="16" cy="16" r="4" stroke={color} strokeWidth="2" />
  </svg>
);

const IconGrid = ({ color = "currentColor" }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="5" y="5" width="8" height="8" stroke={color} strokeWidth="2" rx="1" />
    <rect x="19" y="5" width="8" height="8" stroke={color} strokeWidth="2" rx="1" />
    <rect x="5" y="19" width="8" height="8" stroke={color} strokeWidth="2" rx="1" />
    <rect x="19" y="19" width="8" height="8" stroke={color} strokeWidth="2" rx="1" />
  </svg>
);

const IconNetwork = ({ color = "currentColor" }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="6" r="3" stroke={color} strokeWidth="2" />
    <circle cx="8" cy="26" r="3" stroke={color} strokeWidth="2" />
    <circle cx="24" cy="26" r="3" stroke={color} strokeWidth="2" />
    <path d="M15 9L9 23M17 9L23 23" stroke={color} strokeWidth="2" />
  </svg>
);

interface Block {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
}

// All available blocks with icons
const allBlocks: Block[] = [
  { id: "idea", title: "Business Idea", category: "Start", icon: <IconCircuit /> },
  { id: "name-logo", title: "Name & Logo", category: "Brand", icon: <IconCube color="#A78BFA" /> },
  { id: "logo-design", title: "Logo Design", category: "Brand", icon: <IconHex color="#A78BFA" /> },
  { id: "business-cards", title: "Business Cards", category: "Brand", icon: <IconModule color="#A78BFA" /> },
  { id: "custom-tshirts", title: "Custom T-Shirts", category: "Brand", icon: <IconGrid color="#A78BFA" /> },
  { id: "website", title: "Website", category: "Site", icon: <IconModule color="#22D3EE" /> },
  { id: "custom-website", title: "Custom Website", category: "Site", icon: <IconCube color="#22D3EE" /> },
  { id: "products", title: "Products", category: "Commerce", icon: <IconHex color="#22D3EE" /> },
  { id: "store-setup", title: "Store Setup", category: "Commerce", icon: <IconGrid color="#22D3EE" /> },
  { id: "payments", title: "Payments", category: "Commerce", icon: <IconNetwork color="#22D3EE" /> },
  { id: "legal-setup", title: "Legal Setup", category: "Legal", icon: <IconHex color="#60A5FA" /> },
  { id: "ein-irs", title: "EIN & IRS Help", category: "Legal", icon: <IconCube color="#60A5FA" /> },
  { id: "insurance", title: "Insurance", category: "Legal", icon: <IconNetwork color="#60A5FA" /> },
  { id: "social-media", title: "Social Media Kit", category: "Marketing", icon: <IconModule color="#A78BFA" /> },
  { id: "email-setup", title: "Email Setup", category: "Marketing", icon: <IconCircuit /> },
  { id: "marketing-plan", title: "Marketing Plan", category: "Marketing", icon: <IconCube color="#A78BFA" /> },
  { id: "ads-starter", title: "Ads Starter", category: "Growth", icon: <IconModule color="#22D3EE" /> },
  { id: "customer-support", title: "Customer Support", category: "Support", icon: <IconHex color="#22D3EE" /> },
  { id: "booking-system", title: "Booking System", category: "Sales", icon: <IconGrid color="#22D3EE" /> },
  { id: "automations", title: "Automations", category: "Automation", icon: <IconNetwork color="#60A5FA" /> },
  { id: "sba-help", title: "SBA Help", category: "Finance", icon: <IconCube color="#60A5FA" /> },
  { id: "loans", title: "Loans", category: "Finance", icon: <IconModule color="#60A5FA" /> },
  { id: "grants", title: "Grants & Funding", category: "Finance", icon: <IconGrid color="#60A5FA" /> },
  { id: "business-plan", title: "Business Plans", category: "Start", icon: <IconHex color="#A78BFA" /> },
  { id: "pitch-deck", title: "Pitch Decks", category: "Start", icon: <IconCube color="#A78BFA" /> },
  { id: "hiring", title: "Hiring", category: "Operations", icon: <IconNetwork color="#60A5FA" /> },
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
    <section className="relative py-20 px-4 sm:px-6">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 w-[800px] h-[800px] bg-neon-cyan/10 rounded-full blur-[150px] -translate-x-1/2" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-6 animate-slide-up-fade">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">Recommended for You</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter">
            <span className="block text-foreground mb-2">Pick the blocks</span>
            <span className="block bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
              you need help with
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Based on your answers, we recommend starting with these
          </p>

          {selectedBlocks.length > 0 && (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan to-electric-indigo flex items-center justify-center text-background font-bold text-sm">
                {selectedBlocks.length}
              </div>
              <span className="text-sm font-semibold">
                {selectedBlocks.length === 1 ? "Block" : "Blocks"} Selected
              </span>
            </div>
          )}
        </div>

        {/* Recommended Blocks Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {recommendedBlocks.map((block, index) => (
            <div
              key={block.id}
              className="animate-module-snap"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <BlockCard
                title={block.title}
                category={block.category}
                icon={block.icon}
                isSelected={selectedBlocks.includes(block.id)}
                onToggle={() => toggleBlock(block.id)}
                index={index}
              />
            </div>
          ))}
        </div>

        {/* View More Blocks Toggle */}
        <div className="text-center pt-8">
          <Button
            variant="glass"
            size="lg"
            onClick={() => setShowAllBlocks(!showAllBlocks)}
            className="group"
          >
            {showAllBlocks ? (
              <>
                Show Less
                <ChevronUp className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                View More Blocks
                <ChevronDown className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* All Other Blocks */}
        {showAllBlocks && (
          <div className="space-y-8 animate-slide-up-fade">
            <div className="text-center space-y-3">
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                All Available Blocks
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground font-light">
                Get ideas and add anything else you might need
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {otherBlocks.map((block, index) => (
                <div
                  key={block.id}
                  className="animate-module-snap"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <BlockCard
                    title={block.title}
                    category={block.category}
                    icon={block.icon}
                    isSelected={selectedBlocks.includes(block.id)}
                    onToggle={() => toggleBlock(block.id)}
                    index={index + recommendedBlocks.length}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Continue Button */}
        {selectedBlocks.length > 0 && (
          <div className="text-center space-y-6 pt-12 animate-slide-up-fade">
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
    </section>
  );
};
