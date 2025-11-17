import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Save,
  Sparkles,
  ArrowLeft
} from "lucide-react";

interface PlatformResult {
  platform: string;
  displayName: string;
  status: 'available' | 'taken' | 'unknown' | 'error' | 'checking';
  url: string;
  icon: string;
  httpStatus?: number;
  error?: string;
}

const SocialMediaChecker = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [results, setResults] = useState<PlatformResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data: business } = await supabase
        .from('user_businesses')
        .select('business_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (business?.business_name) {
        setBusinessName(business.business_name);
        // Pre-fill with sanitized business name
        const sanitized = business.business_name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '');
        setUsername(sanitized);
      }
    } catch (error) {
      console.error('Error loading business data:', error);
    }
  };

  const validateUsername = (value: string): boolean => {
    return /^[a-zA-Z0-9._-]{1,30}$/.test(value);
  };

  const checkAllPlatforms = async () => {
    if (!username.trim()) {
      toast.error("Please enter a username to check");
      return;
    }

    if (!validateUsername(username)) {
      toast.error("Username must be 1-30 characters and contain only letters, numbers, periods, underscores, and hyphens");
      return;
    }

    setIsChecking(true);
    setHasChecked(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke('check-social-handles', {
        body: { username: username.trim() }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        setIsChecking(false);
        return;
      }

      setResults(data.results);
      
      const availableCount = data.summary.available;
      const totalCount = data.summary.total;
      
      if (availableCount === totalCount) {
        toast.success(`Great news! "${username}" is available on all platforms! 🎉`);
      } else if (availableCount > totalCount / 2) {
        toast.success(`"${username}" is available on ${availableCount}/${totalCount} platforms`);
      } else {
        toast.info(`"${username}" is available on ${availableCount}/${totalCount} platforms`);
      }
    } catch (error: any) {
      console.error('Error checking handles:', error);
      toast.error(error.message || "Failed to check availability");
    } finally {
      setIsChecking(false);
    }
  };

  const generateAlternatives = (): string[] => {
    const base = username.toLowerCase();
    return [
      `${base}_`,
      `${base}_io`,
      `${base}_official`,
      `get_${base}`,
      `${base}_hq`,
      `${base}_app`,
      `${base}hq`,
      `the_${base}`,
      `${base}_inc`,
      `${base}official`,
    ].slice(0, 5);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const saveResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('user_businesses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!business) {
        toast.error("No business found");
        return;
      }

      const summary = {
        username,
        checked_at: new Date().toISOString(),
        platforms: results,
        available_count: results.filter(r => r.status === 'available').length,
        total_count: results.length,
      };

      const { error } = await supabase
        .from('user_assets')
        .insert([{
          user_id: user.id,
          business_id: business.id,
          asset_type: 'social_handles',
          file_url: JSON.stringify(summary),
          metadata: summary as any,
        }]);

      if (error) throw error;

      toast.success("Results saved to your briefcase!");
    } catch (error: any) {
      console.error('Error saving results:', error);
      toast.error("Failed to save results");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'taken':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'checking':
        return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />;
      case 'unknown':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Available</Badge>;
      case 'taken':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Taken</Badge>;
      case 'unknown':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Unknown</Badge>;
      case 'error':
        return <Badge className="bg-muted text-muted-foreground">Error</Badge>;
      default:
        return <Badge>Checking...</Badge>;
    }
  };

  const availableCount = results.filter(r => r.status === 'available').length;
  const totalCount = results.length;
  const hasResults = results.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Social Media Handle Checker</h1>
            <p className="text-muted-foreground text-lg">
              Check if your business name is available across all major social platforms
            </p>
          </div>

          {/* Input Section */}
          <Card className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username/Handle to check</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="text-lg"
                    maxLength={30}
                    onKeyDown={(e) => e.key === 'Enter' && checkAllPlatforms()}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {username.length}/30
                  </span>
                </div>
                <Button
                  onClick={checkAllPlatforms}
                  disabled={isChecking || !username.trim()}
                  size="lg"
                  className="min-w-32"
                >
                  {isChecking ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Check All
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium">💡 Tips:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Keep it short (15 characters or less is ideal)</li>
                <li>Use letters, numbers, periods, underscores, and hyphens</li>
                <li>Avoid special characters that may not be supported</li>
                <li>Make it memorable and easy to spell</li>
              </ul>
            </div>
          </Card>

          {/* Results Section */}
          {hasResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Availability Results
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={saveResults}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Results
                  </Button>
                </div>
              </div>

              {/* Summary */}
              <Card className="p-4 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Summary</p>
                    <p className="text-2xl font-bold">
                      {availableCount}/{totalCount} Available
                    </p>
                  </div>
                  {availableCount === totalCount && (
                    <div className="text-4xl">🎉</div>
                  )}
                </div>
              </Card>

              {/* Platform Results */}
              <div className="grid gap-3">
                {results.map((result) => (
                  <Card
                    key={result.platform}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{result.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <span className="font-semibold">{result.displayName}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            @{username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(result.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.url)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Alternatives Section */}
              {availableCount < totalCount && (
                <Card className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Alternative Suggestions</h3>
                  <p className="text-sm text-muted-foreground">
                    Try these variations of your username:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {generateAlternatives().map((alt) => (
                      <Button
                        key={alt}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setUsername(alt);
                          checkAllPlatforms();
                        }}
                      >
                        @{alt}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Disclaimer */}
              <Card className="p-4 bg-muted/30">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Note</p>
                    <p>
                      Results are approximate and based on public profile checks. Some platforms may restrict automated checking or return false results. Always verify availability by attempting to register on the platform directly.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Empty State */}
          {!hasResults && !isChecking && (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🔍</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Ready to check availability?
                  </h3>
                  <p className="text-muted-foreground">
                    Enter a username above and click "Check All" to see where it's available
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialMediaChecker;
