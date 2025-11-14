import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { BlockCard } from "./BlockCard";
import { BlockInfoModal } from "./BlockInfoModal";
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
  price: number; // price in cents
  pricingType: 'free' | 'one_time' | 'monthly';
  monthlyPrice: number; // monthly price in cents
  description: string;
}

interface BlockPricing {
  block_name: string;
  price_cents: number;
  monthly_price_cents: number;
  is_free: boolean;
  pricing_type: 'free' | 'one_time' | 'monthly';
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [blockCategoryMap, setBlockCategoryMap] = useState<Map<string, string[]>>(new Map());
  const [pricingData, setPricingData] = useState<Map<string, BlockPricing>>(new Map());
  const [infoModalBlock, setInfoModalBlock] = useState<Block | null>(null);

  // Load categories and assignments
  useEffect(() => {
    const loadCategories = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: categoriesData } = await supabase
        .from('block_categories')
        .select('id, name')
        .order('display_order', { ascending: true });

      const { data: assignmentsData } = await supabase
        .from('block_category_assignments')
        .select('block_name, category_id');

      if (categoriesData) {
        setCategories(categoriesData);
      }

      if (assignmentsData) {
        const categoryMap = new Map<string, string[]>();
        assignmentsData.forEach((assignment) => {
          if (!categoryMap.has(assignment.block_name)) {
            categoryMap.set(assignment.block_name, []);
          }
          categoryMap.get(assignment.block_name)!.push(assignment.category_id);
        });
        setBlockCategoryMap(categoryMap);
      }
    };

    loadCategories();
  }, []);

  // Load pricing data from database
  useEffect(() => {
    const loadPricing = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('blocks_pricing')
        .select('*');
      
      if (!error && data) {
        const pricingMap = new Map<string, BlockPricing>();
        data.forEach(item => {
          pricingMap.set(item.block_name, {
            block_name: item.block_name,
            price_cents: item.price_cents,
            monthly_price_cents: (item as any).monthly_price_cents || 0,
            is_free: item.is_free,
            pricing_type: (item as any).pricing_type || 'free'
          });
        });
        setPricingData(pricingMap);
      }
    };
    
    loadPricing();
  }, []);

  // Load blocks from CSV and merge with pricing
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
            
            // Get pricing from database
            const pricing = pricingData.get(name);
            const is_free = pricing?.is_free ?? false;
            const price_cents = pricing?.price_cents ?? 0;
            const monthly_price_cents = pricing?.monthly_price_cents ?? 0;
            const pricing_type = pricing?.pricing_type ?? 'free';
            
            return {
              id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              title: name,
              category,
              description,
              isFree: is_free,
              price: price_cents,
              pricingType: pricing_type,
              monthlyPrice: monthly_price_cents,
              icon: iconMap[category] || <IconCircuit />
            } as Block;
          })
          .filter((block): block is Block => block !== null);
        
        setAllBlocks(blocks);
      });
  }, [pricingData]);

  // Enhanced starter recommendations: always show these essential blocks for any business
  const essentialStarterTitles = [
    "Website Builder",
    "Business Cards", 
    "Social Media Kit",
    "Email Setup",
    "Name & Logo",
    "Payment Processing"
  ];

  const starterBlockNames = starterBlocks.split(',').map(s => s.trim()).filter(Boolean);
  const growthBlockNames = growthBlocks.split(',').map(s => s.trim()).filter(Boolean);
  
  // Combine AI-recommended starters with essential starters
  const combinedStarterNames = [...new Set([...essentialStarterTitles, ...starterBlockNames])];
  
  const starterBlockList = allBlocks.filter(b => combinedStarterNames.includes(b.title));
  const growthBlockList = allBlocks.filter(b => growthBlockNames.includes(b.title) && !combinedStarterNames.includes(b.title));
  const otherBlocks = allBlocks.filter(b => 
    !combinedStarterNames.includes(b.title) && !growthBlockNames.includes(b.title)
  );

  // Filter other blocks by category
  const filteredOtherBlocks = otherBlocks.filter(block => {
    if (selectedCategory === "all") return true;
    return (blockCategoryMap.get(block.title) || []).includes(selectedCategory);
  });

  const freeBlocks = filteredOtherBlocks.filter(b => b.isFree);
  const paidBlocks = filteredOtherBlocks.filter(b => !b.isFree);

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

        {/* Starter Blocks (Recommended but not pre-selected) */}
        {starterBlockList.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold">Recommended Starter Blocks</h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                Essential for launch
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {starterBlockList.map((block, index) => (
                <BlockCard
                  key={block.id}
                  title={block.title}
                  category={block.category}
                  icon={block.icon}
                  description={block.description}
                  isFree={block.isFree}
                  price={block.price}
                  pricingType={block.pricingType}
                  monthlyPrice={block.monthlyPrice}
                  isSelected={selectedBlocks.includes(block.id)}
                  onToggle={() => toggleBlock(block.id)}
                  onInfoClick={() => setInfoModalBlock(block)}
                  index={index}
                />
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
                <BlockCard
                  key={block.id}
                  title={block.title}
                  category={block.category}
                  icon={block.icon}
                  description={block.description}
                  isFree={block.isFree}
                  price={block.price}
                  pricingType={block.pricingType}
                  monthlyPrice={block.monthlyPrice}
                  isSelected={selectedBlocks.includes(block.id)}
                  onToggle={() => toggleBlock(block.id)}
                  onInfoClick={() => setInfoModalBlock(block)}
                  index={index}
                />
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
            {/* Category Filter Pills */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    selectedCategory === "all"
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white border-white/20 hover:border-white/40"
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full border-2 transition-all ${
                      selectedCategory === category.id
                        ? "bg-white text-black border-white"
                        : "bg-transparent text-white border-white/20 hover:border-white/40"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}

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
                    <BlockCard
                      key={block.id}
                      title={block.title}
                      category={block.category}
                      icon={block.icon}
                      description={block.description}
                      isFree={block.isFree}
                      price={block.price}
                      pricingType={block.pricingType}
                      monthlyPrice={block.monthlyPrice}
                      isSelected={selectedBlocks.includes(block.id)}
                      onToggle={() => toggleBlock(block.id)}
                      onInfoClick={() => setInfoModalBlock(block)}
                      index={index}
                    />
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
                    <BlockCard
                      key={block.id}
                      title={block.title}
                      category={block.category}
                      icon={block.icon}
                      description={block.description}
                      isFree={block.isFree}
                      price={block.price}
                      pricingType={block.pricingType}
                      monthlyPrice={block.monthlyPrice}
                      isSelected={selectedBlocks.includes(block.id)}
                      onToggle={() => toggleBlock(block.id)}
                      onInfoClick={() => setInfoModalBlock(block)}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Continue Button */}
        <div className="text-center space-y-6 pt-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border">
            <div className="w-8 h-8 rounded-full bg-acari-green flex items-center justify-center text-black font-bold text-sm">
              {selectedBlocks.length}
            </div>
            <span className="text-sm font-semibold">
              {selectedBlocks.length === 1 ? "Block" : "Blocks"} Selected
            </span>
          </div>

          <button
            onClick={() => onComplete(selectedBlocks)}
            disabled={selectedBlocks.length === 0}
            className="group px-10 py-7 bg-acari-green text-black rounded-full font-bold text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>

          <p className="text-sm text-muted-foreground font-light">
            Save your plan. You'll only pay when you click Launch later.
          </p>
        </div>
      </div>

      {/* Info Modal */}
      {infoModalBlock && (
        <BlockInfoModal
          isOpen={true}
          onClose={() => setInfoModalBlock(null)}
          title={infoModalBlock.title}
          description={infoModalBlock.description}
          category={infoModalBlock.category}
          isFree={infoModalBlock.isFree}
          price={infoModalBlock.price}
          icon={infoModalBlock.icon}
          onAdd={() => toggleBlock(infoModalBlock.id)}
          isSelected={selectedBlocks.includes(infoModalBlock.id)}
        />
      )}
    </section>
  );
};
