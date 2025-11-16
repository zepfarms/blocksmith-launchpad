import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface AssetStatus {
  path: string;
  status: "checking" | "ok" | "missing";
  statusCode?: number;
}

export function PDFDiagnosticsPanel() {
  const [assets, setAssets] = useState<AssetStatus[]>([
    { path: "/compdfkit/webviewer.js", status: "checking" },
    { path: "/compdfkit/ui/", status: "checking" },
    { path: "/compdfkit/lib/", status: "checking" },
  ]);
  const [sdkVersion, setSdkVersion] = useState<string>("Unknown");

  useEffect(() => {
    const checkAssets = async () => {
      const results = await Promise.all(
        assets.map(async (asset) => {
          try {
            const response = await fetch(asset.path, { method: "HEAD" });
            return {
              path: asset.path,
              status: response.ok ? ("ok" as const) : ("missing" as const),
              statusCode: response.status,
            };
          } catch (error) {
            return {
              path: asset.path,
              status: "missing" as const,
              statusCode: 0,
            };
          }
        })
      );
      setAssets(results);
    };

    const checkVersion = async () => {
      try {
        const mod = await import("@compdfkit_pdf_sdk/webviewer");
        const version = (mod as any)?.version || (mod as any)?.default?.version || "Unknown";
        setSdkVersion(version);
      } catch (error) {
        setSdkVersion("Not installed");
      }
    };

    checkAssets();
    checkVersion();
  }, []);

  if (import.meta.env.PROD) return null;

  return (
    <Card className="fixed top-4 right-4 p-3 w-80 bg-background/95 backdrop-blur-sm border-2 z-40">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">ComPDFKit Diagnostics</h3>
          <Badge variant="outline" className="text-xs">DEV</Badge>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">SDK Version</div>
          <div className="text-sm">{sdkVersion}</div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Asset Status</div>
          <div className="space-y-1">
            {assets.map((asset) => (
              <div key={asset.path} className="flex items-center gap-2 text-sm">
                {asset.status === "checking" && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {asset.status === "ok" && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {asset.status === "missing" && (
                  <XCircle className="h-4 w-4 text-destructive" />
                )}
                <span className="font-mono text-xs flex-1">{asset.path}</span>
                {asset.statusCode !== undefined && (
                  <Badge
                    variant={asset.status === "ok" ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {asset.statusCode}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <div>Asset Path: <span className="font-mono">/compdfkit</span></div>
          <div className="mt-1">
            License Key: {import.meta.env.VITE_COMPDFKIT_PUBLIC_KEY ? "✓ Set" : "✗ Missing"}
          </div>
        </div>
      </div>
    </Card>
  );
}
