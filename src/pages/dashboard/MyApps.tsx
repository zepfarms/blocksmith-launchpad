import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, PackageOpen, Search } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppBlockCard } from "@/components/dashboard/AppBlockCard";

interface BlockData {
  name: string;
  category: string;
  subtitle: string;
  description: string;
  isFree: boolean;
  isAffiliate: boolean;
  affiliateLink: string;
  logoUrl: string;
  completionStatus: 'not_started' | 'in_progress' | 'completed';
}

type CategoryFilter = 'all' | 'foundation' | 'growth' | 'partnerships';

export default function MyApps() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

  useEffect(() => {
    loadUserBlocks();
  }, []);

  const loadBlocksCatalog = async (): Promise<Map<string, any>> => {
    const response = await fetch('/data/blocks_catalog.csv');
    const text = await response.text();
    const lines = text.split('\n').slice(1);
    
    const catalogMap = new Map();
    
    lines.filter(line => line.trim()).forEach(line => {
      const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
      if (!matches || matches.length < 7) return;
      
      const clean = (str: string) => str.replace(/^,?"?|"?$/g, '').trim();
      const name = clean(matches[0]);
      const category = clean(matches[1]);
      const subtitle = clean(matches[2]);
      const description = clean(matches[3]);
      const isFreeRaw = clean(matches[4]) || 'TRUE';
      const isAffiliateRaw = clean(matches[8]) || 'FALSE';
      const affiliateLink = clean(matches[9]) || '';
      const logoUrl = clean(matches[10]) || '';
      
      catalogMap.set(name, {
        category,
        subtitle,
        description,
        isFree: isFreeRaw.toUpperCase() === 'TRUE',
        isAffiliate: isAffiliateRaw.toUpperCase() === 'TRUE',
        affiliateLink,
        logoUrl
      });
    });
    
    return catalogMap;
  };

  const loadUserBlocks = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data: business } = await supabase
        .from('user_businesses')
        .select('selected_blocks')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: unlockedBlocks } = await supabase
        .from('user_block_unlocks')
        .select('block_name, completion_status')
        .eq('user_id', user.id);

      const legacyBlocks = business?.selected_blocks || [];
      const appStoreBlocks = unlockedBlocks?.map(u => u.block_name) || [];
      const allBlockNames = [...new Set([...legacyBlocks, ...appStoreBlocks])];

      const blocksCatalog = await loadBlocksCatalog();

      const blocksData: BlockData[] = allBlockNames.map(blockName => {
        const unlock = unlockedBlocks?.find(u => u.block_name === blockName);
        const catalogInfo = blocksCatalog.get(blockName);
        
        return {
          name: blockName,
          category: catalogInfo?.category || 'Foundation',
          subtitle: catalogInfo?.subtitle || '',
          description: catalogInfo?.description || '',
          isFree: catalogInfo?.isFree ?? true,
          isAffiliate: catalogInfo?.isAffiliate ?? false,
          affiliateLink: catalogInfo?.affiliateLink || '',
          logoUrl: catalogInfo?.logoUrl || '',
          completionStatus: (unlock?.completion_status || 'not_started') as 'not_started' | 'in_progress' | 'completed',
        };
      });

      setBlocks(blocksData);
    } catch (error) {
      console.error('Error loading blocks:', error);
      toast.error('Failed to load your apps');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockClick = (block: BlockData) => {
    if (block.isAffiliate && block.affiliateLink) {
      window.open(block.affiliateLink, '_blank');
      return;
    }

    const routeMap: Record<string, string> = {
      'Logo Generator': '/dashboard/logos',
      'Business Name Generator': '/dashboard/business-name-generator',
      'Business Plan Generator': '/dashboard/business-plan-generator',
      'Social Media Handle Checker': '/dashboard/social-media-checker',
      'QR Code Generator': '/dashboard/qr-code-generator',
      'Email Signature Generator': '/dashboard/email-signature-generator',
    };

    const route = routeMap[block.name];
    if (route) {
      navigate(route);
    } else {
      toast.info(`${block.name} coming soon!`);
    }
  };

  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           block.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryCounts = () => {
    return {
      all: blocks.length,
      foundation: blocks.filter(b => b.category.toLowerCase() === 'foundation').length,
      growth: blocks.filter(b => b.category.toLowerCase() === 'growth').length,
      partnerships: blocks.filter(b => b.category.toLowerCase() === 'partnerships').length,
    };
  };

  const counts = getCategoryCounts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-4 sm:mt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Apps</h1>
        <p className="text-muted-foreground">
          Your unlocked tools and applications
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as CategoryFilter)}>
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="all" className="data-[state=active]:bg-white/10">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="foundation" className="data-[state=active]:bg-white/10">
              Foundation ({counts.foundation})
            </TabsTrigger>
            <TabsTrigger value="growth" className="data-[state=active]:bg-white/10">
              Growth ({counts.growth})
            </TabsTrigger>
            <TabsTrigger value="partnerships" className="data-[state=active]:bg-white/10">
              Partnerships ({counts.partnerships})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {filteredBlocks.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <PackageOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No apps found</h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Visit the App Store to unlock your first app'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredBlocks.map((block) => (
            <AppBlockCard
              key={block.name}
              block={block}
              onClick={() => handleBlockClick(block)}
            />
          ))}
        </div>
      )}
    </div>
  );
}