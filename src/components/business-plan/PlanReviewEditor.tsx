import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Download, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BusinessPlan {
  executiveSummary: string;
  companyDescription: {
    overview: string;
    missionStatement: string;
    visionStatement: string;
    legalStructure: string;
    location: string;
  };
  marketAnalysis: {
    industryOverview: string;
    targetMarket: string;
    customerDemographics: string;
    marketSize: string;
    competitiveAnalysis: string;
    competitiveAdvantage: string;
  };
  organizationManagement: {
    organizationalStructure: string;
    managementTeam: string;
    rolesResponsibilities: string;
  };
  productsServices: {
    overview: string;
    detailedDescriptions: string;
    uniqueValueProposition: string;
    pricingStrategy: string;
  };
  marketingSales: {
    marketingStrategy: string;
    salesStrategy: string;
    customerAcquisition: string;
    brandingApproach: string;
  };
  financialProjections: {
    startupCosts: string;
    revenueProjections: string;
    breakEvenAnalysis: string;
    fundingRequirements: string;
  };
}

interface PlanReviewEditorProps {
  plan: BusinessPlan;
  planId: string;
  businessName: string;
  onDownloadPDF: () => void;
  onSave: (editedPlan: BusinessPlan) => void;
}

export const PlanReviewEditor = ({ plan, planId, businessName, onDownloadPDF, onSave }: PlanReviewEditorProps) => {
  const [editedPlan, setEditedPlan] = useState<BusinessPlan>(plan);
  const [isSaving, setIsSaving] = useState(false);

  const updateSection = (section: keyof BusinessPlan, value: any) => {
    setEditedPlan(prev => ({ ...prev, [section]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('business_plans')
        .update({ edited_content: editedPlan as any })
        .eq('id', planId);

      if (error) throw error;

      onSave(editedPlan);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error('Error saving:', error);
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">{businessName} - Business Plan</CardTitle>
              <CardDescription>Review and edit your generated business plan</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button onClick={onDownloadPDF} className="bg-acari-green hover:bg-acari-green/90">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="executive" className="w-full">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full">
          <TabsTrigger value="executive">Executive</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="organization">Team</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="executive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedPlan.executiveSummary}
                onChange={(e) => updateSection('executiveSummary', e.target.value)}
                rows={8}
                className="font-serif"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Overview</label>
                <Textarea
                  value={editedPlan.companyDescription.overview}
                  onChange={(e) => updateSection('companyDescription', { ...editedPlan.companyDescription, overview: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mission Statement</label>
                <Textarea
                  value={editedPlan.companyDescription.missionStatement}
                  onChange={(e) => updateSection('companyDescription', { ...editedPlan.companyDescription, missionStatement: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vision Statement</label>
                <Textarea
                  value={editedPlan.companyDescription.visionStatement}
                  onChange={(e) => updateSection('companyDescription', { ...editedPlan.companyDescription, visionStatement: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Industry Overview</label>
                <Textarea
                  value={editedPlan.marketAnalysis.industryOverview}
                  onChange={(e) => updateSection('marketAnalysis', { ...editedPlan.marketAnalysis, industryOverview: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Target Market</label>
                <Textarea
                  value={editedPlan.marketAnalysis.targetMarket}
                  onChange={(e) => updateSection('marketAnalysis', { ...editedPlan.marketAnalysis, targetMarket: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Competitive Analysis</label>
                <Textarea
                  value={editedPlan.marketAnalysis.competitiveAnalysis}
                  onChange={(e) => updateSection('marketAnalysis', { ...editedPlan.marketAnalysis, competitiveAnalysis: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization & Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Organizational Structure</label>
                <Textarea
                  value={editedPlan.organizationManagement.organizationalStructure}
                  onChange={(e) => updateSection('organizationManagement', { ...editedPlan.organizationManagement, organizationalStructure: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Management Team</label>
                <Textarea
                  value={editedPlan.organizationManagement.managementTeam}
                  onChange={(e) => updateSection('organizationManagement', { ...editedPlan.organizationManagement, managementTeam: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products & Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Overview</label>
                <Textarea
                  value={editedPlan.productsServices.overview}
                  onChange={(e) => updateSection('productsServices', { ...editedPlan.productsServices, overview: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Unique Value Proposition</label>
                <Textarea
                  value={editedPlan.productsServices.uniqueValueProposition}
                  onChange={(e) => updateSection('productsServices', { ...editedPlan.productsServices, uniqueValueProposition: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing & Sales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Marketing Strategy</label>
                <Textarea
                  value={editedPlan.marketingSales.marketingStrategy}
                  onChange={(e) => updateSection('marketingSales', { ...editedPlan.marketingSales, marketingStrategy: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sales Strategy</label>
                <Textarea
                  value={editedPlan.marketingSales.salesStrategy}
                  onChange={(e) => updateSection('marketingSales', { ...editedPlan.marketingSales, salesStrategy: e.target.value })}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Projections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Startup Costs</label>
                <Textarea
                  value={editedPlan.financialProjections.startupCosts}
                  onChange={(e) => updateSection('financialProjections', { ...editedPlan.financialProjections, startupCosts: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Revenue Projections</label>
                <Textarea
                  value={editedPlan.financialProjections.revenueProjections}
                  onChange={(e) => updateSection('financialProjections', { ...editedPlan.financialProjections, revenueProjections: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Funding Requirements</label>
                <Textarea
                  value={editedPlan.financialProjections.fundingRequirements}
                  onChange={(e) => updateSection('financialProjections', { ...editedPlan.financialProjections, fundingRequirements: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
