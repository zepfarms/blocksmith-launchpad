import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockCard } from "./BlockCard";
import { Badge } from "@/components/ui/badge";

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
  isFree: boolean;
  price: string;
  description: string;
}

interface CatalogBlock {
  name: string;
  category: string;
  description: string;
  is_free: string;
  typical_price: string;
  dependencies: string;
  tags: string;
}

const iconMap: Record<string, React.ReactNode> = {
  "Brand": <IconCube color="#A78BFA" />,
  "Foundation": <IconModule color="#22D3EE" />,
  "Legal": <IconHex color="#60A5FA" />,
  "Finance": <IconCube color="#60A5FA" />,
  "Web": <IconModule color="#22D3EE" />,
  "Commerce": <IconHex color="#22D3EE" />,
  "Scheduling": <IconGrid color="#22D3EE" />,
  "CRM": <IconNetwork color="#60A5FA" />,
  "Growth": <IconCube color="#A78BFA" />,
  "Email": <IconModule color="#A78BFA" />,
  "Social": <IconHex color="#A78BFA" />,
  "Media": <IconGrid color="#A78BFA" />,
  "Automation": <IconNetwork color="#60A5FA" />,
  "Support": <IconHex color="#22D3EE" />,
};

interface SmartBlockSelectorProps {
  starterBlocks?: string;
  growthBlocks?: string;
  onComplete: (selectedBlocks: string[]) => void;
}

export const SmartBlockSelector = ({ starterBlocks = "", growthBlocks = "", onComplete }: SmartBlockSelectorProps) => {
  const [allBlocks, setAllBlocks] = useState<Block[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [showAllBlocks, setShowAllBlocks] = useState(false);

  // Load blocks from CSV
  useEffect(() => {
    fetch('/data/blocks_catalog.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1); // Skip header
        const blocks: Block[] = lines
          .filter(line => line.trim())
          .map((line, index) => {
            const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
            if (!matches || matches.length < 7) return null;
            
            const clean = (str: string) => str.replace(/^,?"?|"?$/g, '').trim();
            const name = clean(matches[0]);
            const category = clean(matches[1]);
            const description = clean(matches[2]);
            const is_free = clean(matches[3]).toLowerCase() === 'true';
            const typical_price = clean(matches[4]);
            
            return {
              id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              title: name,
              category,
              description,
              isFree: is_free,
              price: typical_price,
              icon: iconMap[category] || <IconCircuit />
            } as Block;
          })
          .filter((block): block is Block => block !== null);
        
        setAllBlocks(blocks);
        
        // Auto-select starter blocks
        const starterNames = starterBlocks.split(',').map(s => s.trim());
        const starterIds = blocks
          .filter(b => starterNames.some(name => b.title === name))
          .map(b => b.id);
        setSelectedBlocks(starterIds);
      });
  }, [starterBlocks]);

  const starterBlockNames = starterBlocks.split(',').map(s => s.trim()).filter(Boolean);
  const growthBlockNames = growthBlocks.split(',').map(s => s.trim()).filter(Boolean);
  
  const starterBlockList = allBlocks.filter(b => starterBlockNames.includes(b.title));
  const growthBlockList = allBlocks.filter(b => growthBlockNames.includes(b.title));
  const otherBlocks = allBlocks.filter(b => 
    !starterBlockNames.includes(b.title) && !growthBlockNames.includes(b.title)
  );

  const freeBlocks = otherBlocks.filter(b => b.isFree);
  const paidBlocks = otherBlocks.filter(b => !b.isFree);

  const toggleBlock = (id: string) => {
    setSelectedBlocks(prev =>
      prev.includes(id) ? prev.filter(blockId => blockId !== id) : [...prev, id]
    );
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Here's your starter plan
          </h2>
          <p className="text-xl text-muted-foreground">
            You can add or remove blocks now
          </p>

        </div>

        {/* Starter Blocks (Pre-selected) */}
        {starterBlockList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold">Starter Blocks</h3>
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/30">
                Pre-selected for you
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {starterBlockList.map((block, index) => (
                <div key={block.id} className="relative">
                  <BlockCard
                    title={block.title}
                    category={block.category}
                    icon={block.icon}
                    isSelected={selectedBlocks.includes(block.id)}
                    onToggle={() => toggleBlock(block.id)}
                    index={index}
                  />
                  {block.isFree && (
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0 text-xs">
                      FREE
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Growth Blocks (Recommended next) */}
        {growthBlockList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold">Recommended Next</h3>
              <Badge variant="outline">Growth blocks</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {growthBlockList.map((block, index) => (
                <div key={block.id} className="relative">
                  <BlockCard
                    title={block.title}
                    category={block.category}
                    icon={block.icon}
                    isSelected={selectedBlocks.includes(block.id)}
                    onToggle={() => toggleBlock(block.id)}
                    index={index}
                  />
                  {block.isFree && (
                    <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0 text-xs">
                      FREE
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View More Blocks Toggle */}
        <div className="text-center pt-4">
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
                See More Blocks
                <ChevronDown className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* All Other Blocks (Free vs Paid split) */}
        {showAllBlocks && (
          <div className="space-y-8 animate-slide-up-fade">
            {/* Free Blocks */}
            {freeBlocks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">Free Blocks</h3>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                    No cost
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {freeBlocks.map((block, index) => (
                    <div key={block.id} className="relative">
                      <BlockCard
                        title={block.title}
                        category={block.category}
                        icon={block.icon}
                        isSelected={selectedBlocks.includes(block.id)}
                        onToggle={() => toggleBlock(block.id)}
                        index={index}
                      />
                      <Badge className="absolute -top-2 -right-2 bg-green-500 text-white border-0 text-xs">
                        FREE
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Paid Blocks */}
            {paidBlocks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">Add-on Blocks</h3>
                  <Badge variant="outline">Paid features</Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {paidBlocks.map((block, index) => (
                    <div key={block.id} className="relative">
                      <BlockCard
                        title={block.title}
                        category={block.category}
                        icon={block.icon}
                        isSelected={selectedBlocks.includes(block.id)}
                        onToggle={() => toggleBlock(block.id)}
                        index={index}
                      />
                      <Badge className="absolute -top-2 -right-2 bg-primary/10 text-primary border-0 text-xs">
                        Add-on
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm">
              {selectedBlocks.length}
            </div>
            <span className="text-sm font-semibold">
              {selectedBlocks.length === 1 ? "Block" : "Blocks"} Selected
            </span>
          </div>

          <Button
            variant="empire"
            size="xl"
            onClick={() => onComplete(selectedBlocks)}
            disabled={selectedBlocks.length === 0}
            className="group"
          >
            <span className="flex items-center gap-3">
              Continue
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </span>
          </Button>

          <p className="text-sm text-muted-foreground font-light">
            Save your plan. You'll only pay when you click Launch later.
          </p>
        </div>
      </div>
    </section>
  );
};
