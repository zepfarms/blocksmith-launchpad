import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Check, X, Sparkles, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DomainSelectorProps {
  domainType: 'new' | 'existing';
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
}

interface DomainAvailability {
  available: boolean;
  price?: number;
  alternatives?: string[];
}

export const DomainSelector = ({
  domainType,
  selectedDomain,
  onDomainChange,
}: DomainSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<any>(null);
  
  // AI Generation states
  const [generatedDomains, setGeneratedDomains] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkedDomains, setCheckedDomains] = useState<Map<string, DomainAvailability>>(new Map());
  const [checkingDomain, setCheckingDomain] = useState<string | null>(null);

  const checkAvailability = async (domainName?: string) => {
    const domainToCheck = domainName || (searchTerm.includes('.') ? searchTerm : `${searchTerm}.com`);
    
    if (!domainToCheck.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    setIsChecking(true);
    if (!domainName) {
      setAvailabilityResult(null);
    }
    if (domainName) {
      setCheckingDomain(domainName);
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        'check-domain-availability',
        {
          body: { domainName: domainToCheck },
        }
      );

      if (error) throw error;

      if (domainName) {
        // Checking from AI suggestions
        setCheckedDomains(prev => new Map(prev).set(domainName, {
          available: data.available,
          price: data.price,
          alternatives: data.alternatives,
        }));
        
        if (data.available) {
          toast.success(`${domainToCheck} is available!`);
        } else {
          toast.error(`${domainToCheck} is not available`);
        }
      } else {
        // Manual search
        setAvailabilityResult(data);
        if (data?.available) {
          onDomainChange(domainToCheck);
          toast.success(`${domainToCheck} is available!`);
        } else {
          toast.error(`${domainToCheck} is not available`);
        }
      }
    } catch (error) {
      console.error('Error checking domain:', error);
      toast.error("Failed to check domain availability");
    } finally {
      setIsChecking(false);
      setCheckingDomain(null);
    }
  };

  const generateDomains = async () => {
    // Try to get business name from context or use a placeholder
    const businessName = selectedDomain || "business";
    
    setIsGenerating(true);
    setGeneratedDomains([]);
    setCheckedDomains(new Map());

    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-domain-names',
        {
          body: { businessName },
        }
      );

      if (error) throw error;

      if (data?.domains && Array.isArray(data.domains)) {
        setGeneratedDomains(data.domains);
        toast.success(`Generated ${data.domains.length} domain suggestions!`);
      } else {
        throw new Error("Invalid response from domain generator");
      }
    } catch (error) {
      console.error('Error generating domains:', error);
      toast.error("Failed to generate domain suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectDomain = (domain: string) => {
    onDomainChange(domain);
    toast.success(`Selected ${domain}`);
  };

  if (domainType === 'existing') {
    return (
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="existingDomain">Your Domain Name</Label>
          <Input
            id="existingDomain"
            placeholder="e.g., yourbusiness.com"
            value={selectedDomain}
            onChange={(e) => onDomainChange(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            We'll help you connect this domain in the next steps
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* AI Domain Generation Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-lg">AI-Generated Domain Ideas</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Let AI suggest creative, brandable domains for your business
            </p>
          </div>
          <Button
            onClick={generateDomains}
            disabled={isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Domain Ideas
              </>
            )}
          </Button>
        </div>

        {generatedDomains.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {generatedDomains.map((domain, idx) => {
              const checked = checkedDomains.get(domain);
              const isCheckingThis = checkingDomain === domain;

              return (
                <Card 
                  key={idx}
                  className={`p-4 transition-all ${
                    checked?.available 
                      ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                      : checked 
                        ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'hover:border-primary'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="font-medium text-sm truncate">{domain}</div>
                    
                    {!checked && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => checkAvailability(domain)}
                        disabled={isCheckingThis}
                      >
                        {isCheckingThis ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Checking...
                          </>
                        ) : (
                          <>
                            <Search className="h-3 w-3 mr-2" />
                            Check Availability
                          </>
                        )}
                      </Button>
                    )}

                    {checked && (
                      <div className="space-y-2">
                        <div className={`flex items-center gap-2 text-sm font-medium ${
                          checked.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {checked.available ? (
                            <>
                              <Check className="h-4 w-4" />
                              Available
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4" />
                              Not Available
                            </>
                          )}
                        </div>
                        
                        {checked.available && checked.price && (
                          <p className="text-xs text-muted-foreground">
                            ${(checked.price / 100).toFixed(2)}/year
                          </p>
                        )}

                        {checked.available && (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => selectDomain(domain)}
                          >
                            Select This Domain
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Search Section */}
      <div className="space-y-4 pt-6 border-t">
        <Label className="text-lg">Or Search for a Specific Domain</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your desired domain name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAvailability()}
          />
          <Button
            onClick={() => checkAvailability()}
            disabled={isChecking || !searchTerm.trim()}
          >
            {isChecking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {availabilityResult && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {availabilityResult.available ? (
                <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-full p-2">
                  <Check className="h-5 w-5" />
                </div>
              ) : (
                <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-full p-2">
                  <X className="h-5 w-5" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-lg">
                  {availabilityResult.domainName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {availabilityResult.available
                    ? `Available for $${(availabilityResult.price / 100).toFixed(2)}/year`
                    : 'Not available'}
                </p>
              </div>
            </div>

            {!availabilityResult.available && availabilityResult.alternatives?.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Try these alternatives:</p>
                <div className="space-y-2">
                  {availabilityResult.alternatives.map((alt: string, idx: number) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        setSearchTerm(alt.split('.')[0]);
                        checkAvailability(alt);
                      }}
                    >
                      {alt}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
