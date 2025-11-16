import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AssetCard } from "@/components/dashboard/AssetCard";
import { AssetPreviewModal } from "@/components/dashboard/AssetPreviewModal";
import { Loader2, FileX } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Asset {
  id: string;
  user_id: string;
  business_id: string;
  asset_type: string;
  file_url: string;
  thumbnail_url: string | null;
  metadata: any;
  created_at: string;
  status: string;
}

type AssetFilter = 'all' | 'logo' | 'business_plan' | 'qr_code' | 'email_signature' | 'social_handles';

export default function Briefcase() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<AssetFilter>('all');
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAssets(data || []);
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('user_assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;

      toast.success('Asset deleted successfully');
      loadAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('Failed to delete asset');
    }
  };

  const getAssetTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      logo: 'Logos',
      business_plan: 'Business Plans',
      qr_code: 'QR Codes',
      email_signature: 'Email Signatures',
      social_handles: 'Social Handles',
    };
    return labels[type] || type;
  };

  const getAssetTypeCounts = () => {
    const counts = {
      all: assets.length,
      logo: 0,
      business_plan: 0,
      qr_code: 0,
      email_signature: 0,
      social_handles: 0,
    };

    assets.forEach((asset) => {
      if (counts.hasOwnProperty(asset.asset_type)) {
        counts[asset.asset_type as keyof typeof counts]++;
      }
    });

    return counts;
  };

  const filteredAssets = selectedFilter === 'all'
    ? assets
    : assets.filter(asset => asset.asset_type === selectedFilter);

  const counts = getAssetTypeCounts();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl mt-4 sm:mt-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Briefcase</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage and download all your saved assets
        </p>
      </div>

      {/* Filter Tabs - Scrollable on mobile */}
      <div className="mb-6 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <Tabs value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as AssetFilter)}>
          <TabsList className="w-max min-w-full sm:w-full bg-white/5 border border-white/10 inline-flex">
            <TabsTrigger value="all" className="whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-white/10">
              All Assets ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="logo" className="whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-white/10">
              Logos ({counts.logo})
            </TabsTrigger>
            <TabsTrigger value="business_plan" className="whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-white/10">
              Business Plans ({counts.business_plan})
            </TabsTrigger>
            <TabsTrigger value="qr_code" className="whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-white/10">
              QR Codes ({counts.qr_code})
            </TabsTrigger>
            <TabsTrigger value="email_signature" className="whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-white/10">
              Signatures ({counts.email_signature})
            </TabsTrigger>
            <TabsTrigger value="social_handles" className="whitespace-nowrap px-3 sm:px-4 text-xs sm:text-sm data-[state=active]:bg-white/10">
              Social ({counts.social_handles})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Assets Grid */}
      {filteredAssets.length === 0 ? (
        <div className="glass-card p-8 sm:p-12 text-center">
          <FileX className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No assets found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
            {selectedFilter === 'all'
              ? 'Start creating assets using the tools in My Apps'
              : `No ${getAssetTypeLabel(selectedFilter).toLowerCase()} have been created yet`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onView={() => setPreviewAsset(asset)}
              onDelete={() => handleDelete(asset.id)}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewAsset && (
        <AssetPreviewModal
          asset={previewAsset}
          open={!!previewAsset}
          onClose={() => setPreviewAsset(null)}
        />
      )}
    </div>
  );
}