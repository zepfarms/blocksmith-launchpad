import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Search, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DomainSelectorProps {
  domainType: 'new' | 'existing';
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
}

export const DomainSelector = ({
  domainType,
  selectedDomain,
  onDomainChange,
}: DomainSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<any>(null);

  const checkAvailability = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a domain name");
      return;
    }

    const domainToCheck = searchTerm.includes('.')
      ? searchTerm
      : `${searchTerm}.com`;

    setIsChecking(true);
    setAvailabilityResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        'check-domain-availability',
        {
          body: { domainName: domainToCheck },
        }
      );

      if (error) throw error;

      setAvailabilityResult(data);
      if (data?.available) {
        onDomainChange(domainToCheck);
        toast.success(`${domainToCheck} is available!`);
      } else {
        toast.error(`${domainToCheck} is not available`);
      }
    } catch (error) {
      console.error('Error checking domain:', error);
      toast.error("Failed to check domain availability");
    } finally {
      setIsChecking(false);
    }
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
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <Label>Search for Your Perfect Domain</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Enter your desired domain name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkAvailability()}
          />
          <Button
            onClick={checkAvailability}
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
                <div className="bg-green-100 text-green-600 rounded-full p-2">
                  <Check className="h-5 w-5" />
                </div>
              ) : (
                <div className="bg-red-100 text-red-600 rounded-full p-2">
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
                        checkAvailability();
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
