import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

type BuilderStep = 'option' | 'template' | 'describe' | 'customize' | 'domain' | 'preview';

interface DomainOption {
  type: 'new' | 'existing';
}

const WebsiteBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BuilderStep>('option');
  const [domainOption, setDomainOption] = useState<DomainOption | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleBack = () => {
    if (currentStep === 'option') {
      navigate('/dashboard');
    } else if (currentStep === 'template') {
      setCurrentStep('option');
    } else if (currentStep === 'describe') {
      setCurrentStep('template');
    } else if (currentStep === 'customize') {
      setCurrentStep('describe');
    } else if (currentStep === 'domain') {
      setCurrentStep('customize');
    } else if (currentStep === 'preview') {
      setCurrentStep('domain');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'option':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Create Your Website</h1>
              <p className="text-xl text-muted-foreground">
                Choose how you'd like to get started
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="p-8 cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  setDomainOption({ type: 'new' });
                  setCurrentStep('template');
                  toast.success('Great! Let\'s find you the perfect domain');
                }}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🌐</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Buy a New Domain</h3>
                  <p className="text-muted-foreground">
                    We'll help you find and register the perfect domain name for your business
                  </p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">$20 to start</p>
                    <p className="text-sm text-muted-foreground">
                      $10 domain + $10 first month
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Then $10/month
                    </p>
                  </div>
                </div>
              </Card>

              <Card 
                className="p-8 cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  setDomainOption({ type: 'existing' });
                  setCurrentStep('template');
                  toast.success('Perfect! We\'ll help you connect your domain');
                }}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Use Your Own Domain</h3>
                  <p className="text-muted-foreground">
                    Already have a domain? Connect it to your new professional website
                  </p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">$10 to start</p>
                    <p className="text-sm text-muted-foreground">
                      First month payment
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Then $10/month
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 'template':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Choose Your Template</h1>
              <p className="text-xl text-muted-foreground">
                Select a design that fits your business style
              </p>
            </div>
            
            <div className="text-center py-12">
              <p className="text-muted-foreground">Template gallery coming soon...</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-muted-foreground">Step content coming soon...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {renderStepContent()}
      </div>
    </div>
  );
};

export default WebsiteBuilder;
