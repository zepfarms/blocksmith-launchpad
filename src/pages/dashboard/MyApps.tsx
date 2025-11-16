import { useState, useEffect } from "react";
import { ProfessionalBlockCard } from "@/components/dashboard/ProfessionalBlockCard";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface DashboardItem {
  id: string;
  title: string;
  completionStatus: "not_started" | "in_progress" | "completed";
  description: string;
  isFree?: boolean;
  category?: string;
  isAffiliate?: boolean;
  affiliateLink?: string;
  logoUrl?: string;
}

export default function MyApps() {
  const navigate = useNavigate();
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyApps();
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

  const loadMyApps = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/");
      return;
    }

    const { data } = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (data) {
      const { data: unlockedBlocks } = await supabase
        .from('user_block_unlocks')
        .select('block_name, completion_status')
        .eq('user_id', session.user.id);
      
      const legacyBlocks = data.selected_blocks || [];
      const appStoreBlocks = unlockedBlocks?.map(u => u.block_name) || [];
      const allBlocks = [...new Set([...legacyBlocks, ...appStoreBlocks])];
        
      const catalogMap = await loadBlocksCatalog();
      const dashboardItems: DashboardItem[] = [];

      for (const blockName of allBlocks) {
        const catalogInfo = catalogMap.get(blockName);
        const unlockInfo = unlockedBlocks?.find(u => u.block_name === blockName);
        
        if (!catalogInfo) continue;

        const status = unlockInfo?.completion_status || 'not_started';
        
        dashboardItems.push({
          id: blockName,
          title: catalogInfo.subtitle || blockName,
          completionStatus: status as "not_started" | "in_progress" | "completed",
          description: catalogInfo.description || '',
          isFree: catalogInfo.isFree,
          category: catalogInfo.category,
          isAffiliate: catalogInfo.isAffiliate,
          affiliateLink: catalogInfo.affiliateLink,
          logoUrl: catalogInfo.logoUrl
        });
      }

      setItems(dashboardItems);
    }
    setLoading(false);
  };

  const handleCompleteBlock = (blockId: string, item?: DashboardItem) => {
    if (item?.isAffiliate && item.affiliateLink) {
      window.open(item.affiliateLink, '_blank');
      return;
    }

    const routeMap: { [key: string]: string } = {
      'Logo Generator': '/dashboard/logos',
      'Business Name Generator': '/dashboard/business-name-generator',
      'Business Plan Generator': '/dashboard/business-plan-generator',
      'Social Media Checker': '/dashboard/social-media-checker',
      'QR Code Generator': '/dashboard/qr-code-generator',
      'Email Signature Generator': '/dashboard/email-signature-generator',
    };

    const route = routeMap[blockId];
    if (route) {
      navigate(route);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-acari-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">My Apps</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Your unlocked business tools
          </p>
        </div>

        {items.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-border/40 text-center">
            <p className="text-muted-foreground mb-4">No apps yet</p>
            <p className="text-sm text-muted-foreground">
              Visit the App Store to add tools to your dashboard
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {items.map((item) => (
              <ProfessionalBlockCard
                key={item.id}
                {...item}
                onAction={() => handleCompleteBlock(item.id, item)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
