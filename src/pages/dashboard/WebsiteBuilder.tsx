import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { websiteTemplates } from "@/data/websiteTemplates";
import { TemplateGallery } from "@/components/website-builder/TemplateGallery";
import { BusinessDescriptionForm } from "@/components/website-builder/BusinessDescriptionForm";
import { DomainSelector } from "@/components/website-builder/DomainSelector";

type BuilderStep = 'option' | 'template' | 'describe' | 'domain' | 'preview';

interface DomainOption {
  type: 'new' | 'existing';
}

const WebsiteBuilder = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<BuilderStep>('option');
  const [domainOption, setDomainOption] = useState<DomainOption | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState("");

  const handleBack = () => {
    if (currentStep === 'option') {
      navigate('/dashboard');
    } else if (currentStep === 'template') {
      setCurrentStep('option');
    } else if (currentStep === 'describe') {
      setCurrentStep('template');
    } else if (currentStep === 'domain') {
      setCurrentStep('describe');
    } else if (currentStep === 'preview') {
      setCurrentStep('domain');
    }
  };

  const handleContinue = () => {
    if (currentStep === 'template' && selectedTemplate) {
      setCurrentStep('describe');
    } else if (currentStep === 'describe' && generatedContent) {
      setCurrentStep('domain');
    } else if (currentStep === 'domain' && selectedDomain) {
      setCurrentStep('preview');
    }
  };

  const canContinue = () => {
    if (currentStep === 'template') return selectedTemplate !== null;
    if (currentStep === 'describe') return generatedContent !== null;
    if (currentStep === 'domain') return selectedDomain.trim() !== '';
    return false;
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
            
            <TemplateGallery
              templates={websiteTemplates}
              selectedTemplateId={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        );

      case 'describe':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Tell Us About Your Business</h1>
              <p className="text-xl text-muted-foreground">
                Our AI will create professional content for your website
              </p>
            </div>
            
            <div className="flex justify-center">
              <BusinessDescriptionForm
                businessName={businessName}
                industry={industry}
                description={description}
                onBusinessNameChange={setBusinessName}
                onIndustryChange={setIndustry}
                onDescriptionChange={setDescription}
                onGenerateContent={setGeneratedContent}
              />
            </div>

            {generatedContent && (
              <Card className="p-6 max-w-2xl mx-auto">
                <h3 className="font-semibold mb-4">Generated Content Preview</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Tagline:</span>
                    <p className="text-muted-foreground">{generatedContent.tagline}</p>
                  </div>
                  <div>
                    <span className="font-medium">Hero Headline:</span>
                    <p className="text-muted-foreground">{generatedContent.heroHeadline}</p>
                  </div>
                  <div>
                    <span className="font-medium">Services:</span>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {generatedContent.services?.map((service: any, idx: number) => (
                        <li key={idx}>{service.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 'domain':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">
                {domainOption?.type === 'new' ? 'Find Your Domain' : 'Enter Your Domain'}
              </h1>
              <p className="text-xl text-muted-foreground">
                {domainOption?.type === 'new'
                  ? 'Search for the perfect domain name for your business'
                  : 'Enter your existing domain name'}
              </p>
            </div>
            
            <div className="flex justify-center">
              <DomainSelector
                domainType={domainOption?.type || 'new'}
                selectedDomain={selectedDomain}
                onDomainChange={setSelectedDomain}
              />
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Review & Launch</h1>
              <p className="text-xl text-muted-foreground">
                Everything looks great! Ready to launch your website?
              </p>
            </div>
            
            <Card className="p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Business:</span> {businessName}</p>
                    <p><span className="font-medium">Template:</span> {websiteTemplates.find(t => t.id === selectedTemplate)?.name}</p>
                    <p><span className="font-medium">Domain:</span> {selectedDomain}</p>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <div className="space-y-2">
                    {domainOption?.type === 'new' ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Domain Registration (1 year)</span>
                          <span className="font-medium">$10.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Website Hosting & AI (First month)</span>
                          <span className="font-medium">$10.00</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Total Today</span>
                          <span>$20.00</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Then $10/month for hosting and unlimited AI edits
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>Website Hosting & AI (First month)</span>
                          <span className="font-medium">$10.00</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Total Today</span>
                          <span>$10.00</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Then $10/month for hosting and unlimited AI edits
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Launch My Website
                </Button>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
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

        {currentStep !== 'option' && currentStep !== 'preview' && (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <div className="container mx-auto flex justify-end">
              <Button
                onClick={handleContinue}
                disabled={!canContinue()}
                size="lg"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsiteBuilder;
