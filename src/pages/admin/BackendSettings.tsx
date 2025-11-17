import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getBackendHost, setBackendOverrides, clearBackendOverrides } from "@/lib/backendConfig";
import { RefreshCw, Save, Trash2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export const BackendSettings = () => {
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [currentHost, setCurrentHost] = useState("");
  const [hasOverrides, setHasOverrides] = useState(false);

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = () => {
    const overrideUrl = localStorage.getItem('acari.backend.url');
    const overrideKey = localStorage.getItem('acari.backend.key');
    
    setHasOverrides(!!(overrideUrl && overrideKey));
    setUrl(overrideUrl || '');
    setKey(overrideKey || '');
    setCurrentHost(getBackendHost());
  };

  const handleSave = () => {
    if (!url || !key) {
      toast.error("Please enter both URL and publishable key");
      return;
    }

    try {
      new URL(url); // Validate URL format
    } catch {
      toast.error("Invalid URL format");
      return;
    }

    setBackendOverrides(url, key);
    setHasOverrides(true);
    setCurrentHost(getBackendHost());
    toast.error("Backend overrides saved. Reload the page to apply changes.");
  };

  const handleClear = () => {
    clearBackendOverrides();
    setUrl('');
    setKey('');
    setHasOverrides(false);
    setCurrentHost(getBackendHost());
    toast.error("Overrides cleared. Reload the page to use config.json defaults.");
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Backend Settings</h1>
          <p className="text-muted-foreground mt-2">
            Configure which Supabase backend this app connects to
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Current backend: <strong className="text-acari-green">{currentHost}</strong>
            {hasOverrides && <span className="ml-2 text-xs">(using localStorage override)</span>}
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Backend Override</CardTitle>
            <CardDescription>
              Override the backend connection stored in config.json. Changes are stored in localStorage
              and persist across sessions. Leave empty to use config.json defaults.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backend-url">Supabase URL</Label>
              <Input
                id="backend-url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backend-key">Publishable Key (anon)</Label>
              <Input
                id="backend-key"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Override
              </Button>
              {hasOverrides && (
                <Button onClick={handleClear} variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Override
                </Button>
              )}
              <Button onClick={handleReload} variant="secondary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Page
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How This Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-acari-green mt-0.5 flex-shrink-0" />
              <p>
                The app loads backend config from <code className="text-xs bg-muted px-1 py-0.5 rounded">public/config.json</code> by default
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-acari-green mt-0.5 flex-shrink-0" />
              <p>
                LocalStorage overrides take precedence over config.json when present
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-acari-green mt-0.5 flex-shrink-0" />
              <p>
                The <code className="text-xs bg-muted px-1 py-0.5 rounded">.env</code> file is NOT used at runtime (only for builder preview setup)
              </p>
            </div>
            <div className="flex gap-2">
              <CheckCircle className="w-4 h-4 text-acari-green mt-0.5 flex-shrink-0" />
              <p>
                Changes require a page reload to take effect
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
