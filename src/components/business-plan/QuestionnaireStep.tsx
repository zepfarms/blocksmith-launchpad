import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface QuestionnaireData {
  businessName: string;
  businessIdea: string;
  legalStructure: string;
  location: string;
  foundingDate: string;
  missionStatement: string;
  visionStatement: string;
  productsServices: Array<{ name: string; description: string; pricing: string }>;
  uniqueValueProposition: string;
  targetMarket: string;
  customerDemographics: string;
  marketSize: string;
  competitors: string;
  competitiveAdvantage: string;
  founders: Array<{ name: string; role: string; experience: string }>;
  startupCosts: string;
  fundingNeeded: string;
  fundingSource: string;
  year1Revenue: string;
  year2Revenue: string;
  year3Revenue: string;
  marketingChannels: string[];
  salesStrategy: string;
  customerAcquisitionCost: string;
}

interface QuestionnaireStepProps {
  initialData: Partial<QuestionnaireData>;
  onComplete: (data: QuestionnaireData) => void;
  onBack: () => void;
}

export const QuestionnaireStep = ({ initialData, onComplete, onBack }: QuestionnaireStepProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<QuestionnaireData>({
    businessName: initialData.businessName || "",
    businessIdea: initialData.businessIdea || "",
    legalStructure: "",
    location: "",
    foundingDate: new Date().toISOString().split('T')[0],
    missionStatement: "",
    visionStatement: "",
    productsServices: [{ name: "", description: "", pricing: "" }],
    uniqueValueProposition: "",
    targetMarket: "",
    customerDemographics: "",
    marketSize: "",
    competitors: "",
    competitiveAdvantage: "",
    founders: [{ name: "", role: "", experience: "" }],
    startupCosts: "",
    fundingNeeded: "",
    fundingSource: "",
    year1Revenue: "",
    year2Revenue: "",
    year3Revenue: "",
    marketingChannels: [],
    salesStrategy: "",
    customerAcquisitionCost: "",
  });

  const steps = [
    { title: "Business Basics", description: "Tell us about your business" },
    { title: "Mission & Vision", description: "Define your purpose" },
    { title: "Products & Services", description: "What you offer" },
    { title: "Market Analysis", description: "Your target market" },
    { title: "Team", description: "Key people" },
    { title: "Financials", description: "Numbers & projections" },
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Business Basics
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateFormData("businessName", e.target.value)}
                placeholder="Enter your business name"
              />
            </div>
            <div>
              <Label htmlFor="legalStructure">Legal Structure *</Label>
              <Select value={formData.legalStructure} onValueChange={(value) => updateFormData("legalStructure", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select legal structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LLC">Limited Liability Company (LLC)</SelectItem>
                  <SelectItem value="Corporation">Corporation</SelectItem>
                  <SelectItem value="S-Corp">S-Corporation</SelectItem>
                  <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData("location", e.target.value)}
                placeholder="City, State"
              />
            </div>
            <div>
              <Label htmlFor="foundingDate">Founding Date</Label>
              <Input
                id="foundingDate"
                type="date"
                value={formData.foundingDate}
                onChange={(e) => updateFormData("foundingDate", e.target.value)}
              />
            </div>
          </div>
        );

      case 1: // Mission & Vision
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="missionStatement">Mission Statement *</Label>
              <Textarea
                id="missionStatement"
                value={formData.missionStatement}
                onChange={(e) => updateFormData("missionStatement", e.target.value)}
                placeholder="What is your company's purpose and primary objectives?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="visionStatement">Vision Statement *</Label>
              <Textarea
                id="visionStatement"
                value={formData.visionStatement}
                onChange={(e) => updateFormData("visionStatement", e.target.value)}
                placeholder="Where do you see your company in 5-10 years?"
                rows={3}
              />
            </div>
          </div>
        );

      case 2: // Products & Services
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="productName">Primary Product/Service Name *</Label>
              <Input
                id="productName"
                value={formData.productsServices[0]?.name || ""}
                onChange={(e) => {
                  const updated = [...formData.productsServices];
                  updated[0] = { ...updated[0], name: e.target.value };
                  updateFormData("productsServices", updated);
                }}
                placeholder="Product or service name"
              />
            </div>
            <div>
              <Label htmlFor="productDescription">Description *</Label>
              <Textarea
                id="productDescription"
                value={formData.productsServices[0]?.description || ""}
                onChange={(e) => {
                  const updated = [...formData.productsServices];
                  updated[0] = { ...updated[0], description: e.target.value };
                  updateFormData("productsServices", updated);
                }}
                placeholder="Detailed description of your product/service"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="pricing">Pricing *</Label>
              <Input
                id="pricing"
                value={formData.productsServices[0]?.pricing || ""}
                onChange={(e) => {
                  const updated = [...formData.productsServices];
                  updated[0] = { ...updated[0], pricing: e.target.value };
                  updateFormData("productsServices", updated);
                }}
                placeholder="e.g., $99/month, $50 per unit"
              />
            </div>
            <div>
              <Label htmlFor="uvp">Unique Value Proposition *</Label>
              <Textarea
                id="uvp"
                value={formData.uniqueValueProposition}
                onChange={(e) => updateFormData("uniqueValueProposition", e.target.value)}
                placeholder="What makes your offering unique? Why should customers choose you?"
                rows={3}
              />
            </div>
          </div>
        );

      case 3: // Market Analysis
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetMarket">Target Market *</Label>
              <Textarea
                id="targetMarket"
                value={formData.targetMarket}
                onChange={(e) => updateFormData("targetMarket", e.target.value)}
                placeholder="Who are your ideal customers?"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="customerDemographics">Customer Demographics</Label>
              <Textarea
                id="customerDemographics"
                value={formData.customerDemographics}
                onChange={(e) => updateFormData("customerDemographics", e.target.value)}
                placeholder="Age, income, location, interests, etc."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="marketSize">Market Size *</Label>
              <Input
                id="marketSize"
                value={formData.marketSize}
                onChange={(e) => updateFormData("marketSize", e.target.value)}
                placeholder="e.g., $10B industry, 50,000 potential customers"
              />
            </div>
            <div>
              <Label htmlFor="competitors">Main Competitors</Label>
              <Textarea
                id="competitors"
                value={formData.competitors}
                onChange={(e) => updateFormData("competitors", e.target.value)}
                placeholder="List 3-5 main competitors"
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="competitiveAdvantage">Competitive Advantage *</Label>
              <Textarea
                id="competitiveAdvantage"
                value={formData.competitiveAdvantage}
                onChange={(e) => updateFormData("competitiveAdvantage", e.target.value)}
                placeholder="What gives you an edge over competitors?"
                rows={3}
              />
            </div>
          </div>
        );

      case 4: // Team
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="founderName">Founder/Owner Name *</Label>
              <Input
                id="founderName"
                value={formData.founders[0]?.name || ""}
                onChange={(e) => {
                  const updated = [...formData.founders];
                  updated[0] = { ...updated[0], name: e.target.value };
                  updateFormData("founders", updated);
                }}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="founderRole">Role/Title *</Label>
              <Input
                id="founderRole"
                value={formData.founders[0]?.role || ""}
                onChange={(e) => {
                  const updated = [...formData.founders];
                  updated[0] = { ...updated[0], role: e.target.value };
                  updateFormData("founders", updated);
                }}
                placeholder="e.g., CEO, Founder, Owner"
              />
            </div>
            <div>
              <Label htmlFor="founderExperience">Relevant Experience *</Label>
              <Textarea
                id="founderExperience"
                value={formData.founders[0]?.experience || ""}
                onChange={(e) => {
                  const updated = [...formData.founders];
                  updated[0] = { ...updated[0], experience: e.target.value };
                  updateFormData("founders", updated);
                }}
                placeholder="Years of experience, key achievements, relevant background"
                rows={3}
              />
            </div>
          </div>
        );

      case 5: // Financials
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="startupCosts">Estimated Startup Costs *</Label>
              <Input
                id="startupCosts"
                value={formData.startupCosts}
                onChange={(e) => updateFormData("startupCosts", e.target.value)}
                placeholder="e.g., $50,000"
              />
            </div>
            <div>
              <Label htmlFor="fundingNeeded">Funding Needed *</Label>
              <Input
                id="fundingNeeded"
                value={formData.fundingNeeded}
                onChange={(e) => updateFormData("fundingNeeded", e.target.value)}
                placeholder="e.g., $100,000"
              />
            </div>
            <div>
              <Label htmlFor="fundingSource">Funding Source</Label>
              <Select value={formData.fundingSource} onValueChange={(value) => updateFormData("fundingSource", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How will you fund this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Savings">Personal Savings</SelectItem>
                  <SelectItem value="Bank Loan">Bank Loan</SelectItem>
                  <SelectItem value="Investors">Investors</SelectItem>
                  <SelectItem value="Grants">Grants</SelectItem>
                  <SelectItem value="Mixed">Mixed Sources</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year1Revenue">Year 1 Revenue Target *</Label>
              <Input
                id="year1Revenue"
                value={formData.year1Revenue}
                onChange={(e) => updateFormData("year1Revenue", e.target.value)}
                placeholder="e.g., $250,000"
              />
            </div>
            <div>
              <Label htmlFor="year2Revenue">Year 2 Revenue Target *</Label>
              <Input
                id="year2Revenue"
                value={formData.year2Revenue}
                onChange={(e) => updateFormData("year2Revenue", e.target.value)}
                placeholder="e.g., $500,000"
              />
            </div>
            <div>
              <Label htmlFor="year3Revenue">Year 3 Revenue Target *</Label>
              <Input
                id="year3Revenue"
                value={formData.year3Revenue}
                onChange={(e) => updateFormData("year3Revenue", e.target.value)}
                placeholder="e.g., $1,000,000"
              />
            </div>
            <div>
              <Label htmlFor="salesStrategy">Sales Strategy *</Label>
              <Textarea
                id="salesStrategy"
                value={formData.salesStrategy}
                onChange={(e) => updateFormData("salesStrategy", e.target.value)}
                placeholder="How will you sell your product/service?"
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="text-sm">
            Step {currentStep + 1} of {steps.length}
          </Badge>
          <div className="flex-1 mx-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-acari-green transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <CardDescription>{steps[currentStep].description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {renderStepContent()}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {currentStep === 0 ? "Back" : "Previous"}
            </Button>
            <Button onClick={handleNext} className="bg-acari-green hover:bg-acari-green/90">
              {currentStep === steps.length - 1 ? "Generate Plan" : "Next"}
              {currentStep < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
