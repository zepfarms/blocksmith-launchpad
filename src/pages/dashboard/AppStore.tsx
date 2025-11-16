import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Search, ShoppingCart } from "lucide-react";
import { BlockCard } from "@/components/BlockCard";
import { BlockInfoModal } from "@/components/BlockInfoModal";

// Icon components
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

const iconMap: Record<string, React.ReactNode> = {
  "Brand": <IconModule color="#A78BFA" />,
  "Foundation": <IconModule color="#22D3EE" />,
  "Legal": <IconCircuit />,
  "Finance": <IconModule color="#60A5FA" />,
  "Web": <IconModule color="#22D3EE" />,
  "Commerce": <IconCircuit />,
  "Scheduling": <IconModule color="#22D3EE" />,
  "CRM": <IconCircuit />,
  "Growth": <IconModule color="#A78BFA" />,
  "Email": <IconModule color="#A78BFA" />,
  "Social": <IconCircuit />,
  "Media": <IconModule color="#A78BFA" />,
  "Automation": <IconCircuit />,
  "Support": <IconCircuit />,
};

interface Block {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  icon: React.ReactNode;
  isFree: boolean;
  price: number;
  monthlyPrice: number;
  pricingType: 'free' | 'one_time' | 'monthly';
  description: string;
  isAffiliate?: boolean;
  logoUrl?: string;
}

interface BlockPricing {
  block_name: string;
  price_cents: number;
  monthly_price_cents: number;
  pricing_type: string;
  is_free: boolean;
  description: string | null;
}

interface AppStoreProps {
  onDataChanged?: () => void;
}

export default function AppStore({ onDataChanged }: AppStoreProps = {}) {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);
  const [blockCategoryMap, setBlockCategoryMap] = useState<Map<string, string[]>>(new Map());
  const [cart, setCart] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [infoModalBlock, setInfoModalBlock] = useState<Block | null>(null);
  const [pricingData, setPricingData] = useState<Map<string, BlockPricing>>(new Map());
  const [unlockedBlocks, setUnlockedBlocks] = useState<Set<string>>(new Set());
  const [purchasedBlocks, setPurchasedBlocks] = useState<Set<string>>(new Set());
  const [subscribedBlocks, setSubscribedBlocks] = useState<Set<string>>(new Set());

  // Load user's unlocked/purchased blocks
  useEffect(() => {
    const loadUserBlocks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Load unlocks
      const { data: unlocks } = await supabase
        .from('user_block_unlocks')
        .select('block_name')
        .eq('user_id', user.id);
      
      if (unlocks) {
        setUnlockedBlocks(new Set(unlocks.map(u => u.block_name)));
      }

      // Load one-time purchases
      const { data: purchases } = await supabase
        .from('user_block_purchases')
        .select('block_name')
        .eq('user_id', user.id);
      
      if (purchases) {
        setPurchasedBlocks(new Set(purchases.map(p => p.block_name)));
      }

      // Load active subscriptions
      const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('block_name')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      if (subscriptions) {
        setSubscribedBlocks(new Set(subscriptions.map(s => s.block_name)));
      }
    };

    loadUserBlocks();
  }, []);

  // Load categories and assignments
  useEffect(() => {
    const loadCategories = async () => {
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

  // Load pricing data
  useEffect(() => {
    const loadPricing = async () => {
      const { data, error } = await supabase
        .from('blocks_pricing')
        .select('*');
      
      if (!error && data) {
        const pricingMap = new Map<string, BlockPricing>();
        data.forEach((item: any) => {
          pricingMap.set(item.block_name, {
            block_name: item.block_name,
            price_cents: item.price_cents,
            monthly_price_cents: item.monthly_price_cents || 0,
            pricing_type: item.pricing_type || 'free',
            is_free: item.is_free,
            description: item.description || null
          });
        });
        setPricingData(pricingMap);
      }
    };
    
    loadPricing();
  }, []);

  // Load blocks from CSV and merge with pricing
  useEffect(() => {
    if (pricingData.size === 0) return;

    fetch('/data/blocks_catalog.csv')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').slice(1);
        const blocksData: Block[] = lines
          .filter(line => line.trim())
          .map((line) => {
            const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
            if (!matches || matches.length < 11) return null;
            
            const clean = (str: string) => str.replace(/^,?"?|"?$/g, '').trim();
            const name = clean(matches[0]);
            const category = clean(matches[1]);
            const subtitle = clean(matches[2]);
            const csvDescription = clean(matches[3]);
            const isAffiliate = clean(matches[8]) === 'TRUE';
            const affiliateLink = clean(matches[9]);
            const logoUrl = clean(matches[10]);
            
            const pricing = pricingData.get(name);
            const is_free = pricing?.is_free ?? false;
            const price_cents = pricing?.price_cents ?? 0;
            const monthly_price_cents = pricing?.monthly_price_cents ?? 0;
            const pricing_type = pricing?.pricing_type ?? 'free';
            const dbDescription = pricing?.description;
            
            return {
              id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              title: name,
              subtitle: subtitle || undefined,
              category,
              description: dbDescription || csvDescription,
              isFree: is_free,
              price: price_cents,
              monthlyPrice: monthly_price_cents,
              pricingType: pricing_type as 'free' | 'one_time' | 'monthly',
              icon: iconMap[category] || <IconCircuit />,
              isAffiliate,
              logoUrl: logoUrl || undefined
            } as Block;
          })
          .filter((block): block is Block => block !== null);
        
        setBlocks(blocksData);
        setLoading(false);
      });
  }, [pricingData]);

  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      block.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      (blockCategoryMap.get(block.title) || []).includes(selectedCategory);
    
    // Exclude blocks user already owns
    const isOwned = unlockedBlocks.has(block.title) || 
                    purchasedBlocks.has(block.title) || 
                    subscribedBlocks.has(block.title);
    
    return matchesSearch && matchesCategory && !isOwned;
  });

  const toggleCart = (blockId: string) => {
    setCart(prev =>
      prev.includes(blockId)
        ? prev.filter(b => b !== blockId)
        : [...prev, blockId]
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    const selectedBlocks = cart.map(id => blocks.find(b => b.id === id)).filter(Boolean) as Block[];

    // Check for Domain + Website block
    const hasWebsiteBlock = selectedBlocks.some(b => b.title === "Domain + Website");

    // Separate blocks by type
    const freeBlocks = selectedBlocks.filter(b => b.isFree || b.pricingType === 'free');
    const oneTimeBlocks = selectedBlocks.filter(b => b.pricingType === 'one_time' && !b.isFree);
    const monthlyBlocks = selectedBlocks.filter(b => b.pricingType === 'monthly' && !b.isFree);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Please sign in to continue');
        navigate('/');
        return;
      }

      // Get user's business
      const { data: business } = await supabase
        .from('user_businesses')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (!business) {
        toast.error('Business not found');
        return;
      }

      // Function to unlock free blocks
      const unlockFreeBlocks = async () => {
        if (freeBlocks.length === 0) return;

        const unlockPromises = freeBlocks.map(block => 
          supabase.from('user_block_unlocks').insert({
            user_id: session.user.id,
            business_id: business.id,
            block_name: block.title,
            unlock_type: 'free',
            completion_status: 'not_started'
          })
        );

        await Promise.all(unlockPromises);
      };

      // Unlock free blocks first
      await unlockFreeBlocks();

      // Case 1: ONLY free blocks
      if (freeBlocks.length > 0 && oneTimeBlocks.length === 0 && monthlyBlocks.length === 0) {
        await unlockFreeBlocks();
        toast.success(`${freeBlocks.length} free block${freeBlocks.length > 1 ? 's' : ''} added to your dashboard!`);
        setCart([]);
        // Trigger dashboard refresh and switch to My Apps tab
        if (onDataChanged) {
          onDataChanged();
        }
        return;
      }

      // Case 2: Only monthly blocks (unlock free ones first if any)
      if (monthlyBlocks.length > 0 && oneTimeBlocks.length === 0) {
        await unlockFreeBlocks();
        const monthlyNames = monthlyBlocks.map(b => b.title).join(',');
        navigate(`/dashboard/subscription-checkout?blocks=${monthlyNames}`);
        return;
      }

      // Case 3: Only one-time blocks (unlock free ones first if any)
      if (oneTimeBlocks.length > 0 && monthlyBlocks.length === 0) {
        await unlockFreeBlocks();
        const oneTimeNames = oneTimeBlocks.map(b => b.title).join(',');
        navigate(`/start/checkout?blocks=${oneTimeNames}`);
        return;
      }

      // Case 4: Mixed one-time and monthly (not allowed)
      if (oneTimeBlocks.length > 0 && monthlyBlocks.length > 0) {
        toast.error('Please checkout one-time and monthly blocks separately');
        return;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to add blocks');
    }
  };

  const totalCost = cart.reduce((sum, blockId) => {
    const block = blocks.find(b => b.id === blockId);
    return sum + (block?.price || 0);
  }, 0);

  // Check if all selected blocks are free
  const allFree = cart.length > 0 && cart.every(blockId => {
    const block = blocks.find(b => b.id === blockId);
    return block?.isFree || block?.pricingType === 'free';
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="rounded-full mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            App Store
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Browse and add new blocks to your business
          </p>

          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search blocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-white/5 border-white/20"
            />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
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
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
          {filteredBlocks.map((block, index) => (
            <BlockCard
              key={block.id}
              title={block.title}
              subtitle={block.subtitle}
              category={block.category}
              icon={block.icon}
              description={block.description}
              isFree={block.isFree}
              price={block.price}
              monthlyPrice={block.monthlyPrice}
              pricingType={block.pricingType}
              isSelected={cart.includes(block.id)}
              onToggle={() => toggleCart(block.id)}
              onInfoClick={() => setInfoModalBlock(block)}
              index={index}
              isUnlocked={unlockedBlocks.has(block.title)}
              isPurchased={purchasedBlocks.has(block.title)}
              hasActiveSubscription={subscribedBlocks.has(block.title)}
              isAffiliate={block.isAffiliate}
              logoUrl={block.logoUrl}
            />
          ))}
        </div>

        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/95 border-t border-white/10 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ShoppingCart className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{cart.length} blocks in cart</p>
                  <p className="text-sm text-gray-400">
                    Total: ${(totalCost / 100).toFixed(2)}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                size="lg"
                className="rounded-full"
              >
                {allFree ? 'Add to Dashboard' : 'Proceed to Checkout'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {infoModalBlock && (
        <BlockInfoModal
          isOpen={true}
          onClose={() => setInfoModalBlock(null)}
          title={infoModalBlock.title}
          subtitle={infoModalBlock.subtitle}
          description={infoModalBlock.description}
          category={infoModalBlock.category}
          isFree={infoModalBlock.isFree}
          price={infoModalBlock.price}
          icon={infoModalBlock.icon}
          onAdd={() => toggleCart(infoModalBlock.id)}
          isSelected={cart.includes(infoModalBlock.id)}
        />
      )}
    </div>
  );
}
