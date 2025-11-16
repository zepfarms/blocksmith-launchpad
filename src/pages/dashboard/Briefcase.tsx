import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Trash2, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Briefcase() {
  const [savedAssets, setSavedAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedAssets();
  }, []);

  const loadSavedAssets = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from('user_assets')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    setSavedAssets(data || []);
    setLoading(false);
  };

  const handleDeleteAsset = async (assetId: string) => {
    const { error } = await supabase
      .from('user_assets')
      .delete()
      .eq('id', assetId);

    if (error) {
      toast.error("Failed to delete asset");
    } else {
      toast.success("Asset deleted");
      loadSavedAssets();
    }
  };

  const handleViewAsset = (asset: any) => {
    window.open(asset.file_url, '_blank');
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
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Briefcase</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Your saved assets and files
          </p>
        </div>

        {savedAssets.length === 0 ? (
          <div className="glass-card p-12 rounded-3xl border border-border/40 text-center">
            <p className="text-muted-foreground">No saved assets yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {savedAssets.map((asset) => (
              <div
                key={asset.id}
                className="glass-card rounded-2xl border border-border/40 overflow-hidden hover:border-border/60 transition-all duration-200 group"
              >
                {/* Preview */}
                <div className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/10 p-4 flex items-center justify-center">
                  {asset.thumbnail_url ? (
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.asset_type}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-acari-green/10 to-transparent rounded-xl flex items-center justify-center">
                      <p className="text-muted-foreground text-sm">No preview</p>
                    </div>
                  )}
                  <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground border-border/40">
                    {asset.asset_type}
                  </Badge>
                </div>

                {/* Actions */}
                <div className="p-4 space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {new Date(asset.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewAsset(asset)}
                      size="sm"
                      variant="outline"
                      className="flex-1 border-border/40 hover:border-acari-green/50 hover:bg-acari-green/5"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDeleteAsset(asset.id)}
                      size="sm"
                      variant="outline"
                      className="border-border/40 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
