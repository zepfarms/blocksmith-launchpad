import { useState } from "react";
import { BlockCard } from "./BlockCard";
import { Button } from "@/components/ui/button";

// Custom minimal futuristic icons using SVG paths
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

const blocks: Block[] = [
  { id: "idea", title: "Business Idea", category: "Start", icon: <IconCircuit /> },
  { id: "brand", title: "Name & Logo", category: "Brand", icon: <IconCube color="#A78BFA" /> },
  { id: "logos", title: "Logos", category: "Brand", icon: <IconHex color="#A78BFA" /> },
  { id: "cards", title: "Business Cards", category: "Brand", icon: <IconModule color="#A78BFA" /> },
  { id: "products", title: "Products", category: "Commerce", icon: <IconHex color="#22D3EE" /> },
  { id: "store", title: "Store Setup", category: "Commerce", icon: <IconGrid color="#22D3EE" /> },
  { id: "website", title: "Website", category: "Site", icon: <IconModule color="#22D3EE" /> },
  { id: "payments", title: "Payments", category: "Commerce", icon: <IconNetwork color="#22D3EE" /> },
  { id: "legal", title: "Legal Setup", category: "Legal", icon: <IconHex color="#60A5FA" /> },
  { id: "sba", title: "SBA Help", category: "Legal", icon: <IconCube color="#60A5FA" /> },
  { id: "loans", title: "Loans", category: "Finance", icon: <IconModule color="#60A5FA" /> },
  { id: "grants", title: "Grants", category: "Finance", icon: <IconGrid color="#60A5FA" /> },
  { id: "insurance", title: "Insurance", category: "Legal", icon: <IconNetwork color="#60A5FA" /> },
  { id: "plans", title: "Business Plans", category: "Start", icon: <IconHex color="#A78BFA" /> },
  { id: "pitch", title: "Pitch Decks", category: "Start", icon: <IconCube color="#A78BFA" /> },
  { id: "social", title: "Social Media Kit", category: "Marketing", icon: <IconModule color="#A78BFA" /> },
  { id: "email", title: "Email Setup", category: "Marketing", icon: <IconCircuit /> },
  { id: "marketing", title: "Marketing", category: "Marketing", icon: <IconCube color="#A78BFA" /> },
  { id: "ads", title: "Ads Starter", category: "Growth", icon: <IconModule color="#22D3EE" /> },
  { id: "hiring", title: "Hiring", category: "Operations", icon: <IconNetwork color="#60A5FA" /> },
  { id: "support", title: "Customer Support", category: "Support", icon: <IconHex color="#22D3EE" /> },
  { id: "booking", title: "Booking System", category: "Sales", icon: <IconGrid color="#22D3EE" /> },
  { id: "automation", title: "Automations", category: "Automation", icon: <IconNetwork color="#60A5FA" /> },
];

export const BlockSelector = ({ onComplete }: { onComplete: (selectedBlocks: string[]) => void }) => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  const toggleBlock = (id: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(id) ? prev.filter((blockId) => blockId !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative min-h-screen py-32 px-6 overflow-hidden max-w-full">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 w-[90vw] max-w-[800px] h-[90vw] max-h-[800px] bg-neon-cyan/10 rounded-full blur-[150px] -translate-x-1/2" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-8 animate-slide-up-fade">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter">
            <span className="block text-foreground">Choose your</span>
            <span className="block bg-gradient-to-r from-neon-cyan via-electric-indigo to-neon-purple bg-clip-text text-transparent">
              blocks
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Pick the parts of your business you want help with.
            <br />
            Let AI handle these tasks so you can focus on what you do best.
          </p>

          <p className="text-sm text-muted-foreground/60 font-light">
            Start simple — you can add more blocks anytime.
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

        {/* Block Grid - Compact grid for more blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              className="animate-module-snap"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <BlockCard
                title={block.title}
                category={block.category}
                icon={block.icon}
                description=""
                isFree={true}
                price={0}
                monthlyPrice={0}
                pricingType="free"
                isSelected={selectedBlocks.includes(block.id)}
                onToggle={() => toggleBlock(block.id)}
                onInfoClick={() => {}}
                index={index}
                isUnlocked={false}
                isPurchased={false}
                hasActiveSubscription={false}
              />
            </div>
          ))}
        </div>

        {/* Assembly CTA */}
        {selectedBlocks.length > 0 && (
          <div className="w-full flex flex-col items-center gap-6 pt-12 animate-slide-up-fade">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-neon-cyan/50" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.2em]">
                Ready to Build
              </span>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-neon-cyan/50" />
            </div>

            <Button 
              variant="empire"
              onClick={() => onComplete(selectedBlocks)}
              className="group inline-flex items-center justify-center"
            >
              <span className="flex items-center gap-3">
                Continue
                <div className="w-6 h-6 rounded-lg border-2 border-current flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
                  <div className="w-2 h-2 bg-current rounded-sm" />
                </div>
              </span>
            </Button>

            <p className="text-sm text-muted-foreground font-light text-center">
              {selectedBlocks.length} block{selectedBlocks.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
