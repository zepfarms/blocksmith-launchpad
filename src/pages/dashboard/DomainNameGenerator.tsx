import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Globe, Loader2, Check } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type SelectionMode = 'choose' | 'existing' | 'generate' | 'skip';

export default function DomainNameGenerator() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SelectionMode>('choose');
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [domainName, setDomainName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [generatedDomains, setGeneratedDomains] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/');
      return;
    }

    const { data, error } = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error loading business:', error);
      toast.error("Failed to load business data");
      return;
    }

    if (data) {
      setBusinessName(data.business_name || "");
      setBusinessId(data.id);

      // Check if domain already selected
      const { data: domainData } = await supabase
        .from('user_domain_selections')
        .select('*')
        .eq('business_id', data.id)
        .maybeSingle();

      if (domainData) {
        // Already completed, redirect to dashboard
        navigate('/dashboard');
      }
    }
  };

  const generateDomains = async () => {
    if (!businessName) {
      toast.error("Business name is required");
      return;
    }

    setIsGenerating(true);
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-domain-names', {
        body: { businessName }
      });

      if (functionError) throw functionError;

      if (!functionData?.domains || !Array.isArray(functionData.domains)) {
        throw new Error('Invalid response format');
      }

      setGeneratedDomains(functionData.domains);
      toast.success("Domain ideas generated!");

    } catch (error: any) {
      console.error('Error generating domains:', error);
      const errorMessage = error?.message || error?.error || 'Failed to generate domains. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveExisting = async () => {
    if (!domainName.trim()) {
      toast.error("Please enter your domain name");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_domain_selections')
        .insert({
          user_id: session.user.id,
          business_id: businessId,
          domain_name: domainName.trim(),
          existing_website_url: websiteUrl.trim() || null,
          has_existing_domain: true,
          domain_status: 'selected'
        });

      if (error) throw error;

      toast.success("Domain saved successfully!");
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error saving domain:', error);
      toast.error(error.message || "Failed to save domain");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGenerated = async () => {
    if (!selectedDomain) {
      toast.error("Please select a domain");
      return;
    }

    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_domain_selections')
        .insert({
          user_id: session.user.id,
          business_id: businessId,
          domain_name: selectedDomain,
          has_existing_domain: false,
          domain_status: 'selected'
        });

      if (error) throw error;

      toast.success("Domain selected successfully!");
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error saving domain:', error);
      toast.error(error.message || "Failed to save domain");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('user_domain_selections')
        .insert({
          user_id: session.user.id,
          business_id: businessId,
          domain_status: 'skipped'
        });

      if (error) throw error;

      toast.success("Skipped for now");
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error skipping domain:', error);
      toast.error(error.message || "Failed to skip");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-white/70 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-acari-green font-medium">Step 2 of Foundation Blocks</span>
            <span className="text-white/30">•</span>
            <span className="text-white/50">Business Name ✓ → Domain → Logo</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Domain</h1>
          <p className="text-white/70 mb-1">For: <span className="text-acari-green font-semibold">{businessName}</span></p>
          <p className="text-sm text-white/50">You can enter an existing domain or generate new ideas</p>
        </div>

        {/* Choose Mode */}
        {mode === 'choose' && (
          <>
            {/* Helper text */}
            <div className="glass-card p-4 rounded-xl border border-white/10 bg-white/5 mb-6">
              <p className="text-sm text-white/70">
                💡 <strong className="text-white">Why choose a domain?</strong> Your domain name will be used throughout your branding, logo designs, and other business blocks.
              </p>
            </div>

            <div className="space-y-4">
            <div
              onClick={() => setMode('existing')}
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-acari-green/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-acari-green/10 group-hover:bg-acari-green/20 transition-colors">
                  <Globe className="h-6 w-6 text-acari-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Already Have a Domain</h3>
                  <p className="text-white/70">I already own a domain - let me enter it</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setMode('generate')}
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-acari-green/50 cursor-pointer transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-acari-green/10 group-hover:bg-acari-green/20 transition-colors">
                  <Sparkles className="h-6 w-6 text-acari-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Generate Domain Ideas</h3>
                  <p className="text-white/70">I need a new domain - show me available suggestions</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setShowConfirmDialog(true)}
              className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 cursor-pointer transition-all group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Check className="h-6 w-6 text-white/70" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Skip for Now</h3>
                  <p className="text-white/70">I'll decide later - skip this step for now</p>
                </div>
              </div>
            </div>
          </div>
          </>
        )}

        {/* Existing Domain Mode */}
        {mode === 'existing' && (
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <Button
              variant="ghost"
              onClick={() => setMode('choose')}
              className="mb-6 text-white/70 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <h2 className="text-2xl font-bold text-white mb-6">Enter Your Domain</h2>

            <div className="space-y-6">
              <div>
                <Label htmlFor="domain" className="text-white">Domain Name *</Label>
                <Input
                  id="domain"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  placeholder="example.com"
                  className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <div>
                <Label htmlFor="website" className="text-white">Website URL (Optional)</Label>
                <Input
                  id="website"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                />
              </div>

              <Button
                onClick={handleSaveExisting}
                disabled={isSaving || !domainName.trim()}
                className="w-full bg-acari-green hover:bg-acari-green/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Domain'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Generate Mode */}
        {mode === 'generate' && (
          <div className="glass-card p-8 rounded-2xl border border-white/10">
            <Button
              variant="ghost"
              onClick={() => setMode('choose')}
              className="mb-6 text-white/70 hover:text-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <h2 className="text-2xl font-bold text-white mb-6">Generate Domain Ideas</h2>

            {generatedDomains.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70 mb-6">Click below to generate creative domain name suggestions</p>
                <Button
                  onClick={generateDomains}
                  disabled={isGenerating}
                  className="bg-acari-green hover:bg-acari-green/90"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Ideas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Domain Ideas
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedDomains.map((domain, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedDomain(domain)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedDomain === domain
                          ? 'border-acari-green bg-acari-green/10'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}
                    >
                      <p className="text-white font-medium">{domain}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={generateDomains}
                    disabled={isGenerating}
                    variant="outline"
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      'Regenerate Ideas'
                    )}
                  </Button>
                  <Button
                    onClick={handleSaveGenerated}
                    disabled={isSaving || !selectedDomain}
                    className="flex-1 bg-acari-green hover:bg-acari-green/90"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Select Domain'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Skip Confirmation Dialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="bg-gray-900 border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Skip domain selection?</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                You can add a domain later from your dashboard. This won't affect your other blocks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleSkip}
                disabled={isSaving}
                className="bg-acari-green hover:bg-acari-green/90"
              >
                {isSaving ? 'Skipping...' : 'Skip for Now'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
