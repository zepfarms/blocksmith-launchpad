import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignatureForm } from "@/components/email-signature/SignatureForm";
import { SignaturePreview } from "@/components/email-signature/SignaturePreview";
import { TemplateSelector } from "@/components/email-signature/TemplateSelector";
import { StyleCustomizer } from "@/components/email-signature/StyleCustomizer";
import { ExportOptions } from "@/components/email-signature/ExportOptions";

export interface SignatureData {
  fullName: string;
  jobTitle: string;
  company: string;
  department?: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  website?: string;
  address?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  youtube?: string;
  photoUrl?: string;
  logoUrl?: string;
  bannerUrl?: string;
  disclaimer?: string;
  tagline?: string;
}

export interface SignatureStyle {
  template: 'classic' | 'modern' | 'creative' | 'compact' | 'banner';
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'Arial' | 'Helvetica' | 'Georgia' | 'Times New Roman' | 'Verdana';
  primaryColor: string;
  secondaryColor: string;
  includePhoto: boolean;
  includeLogo: boolean;
  includeSocial: boolean;
  iconStyle: 'color' | 'grayscale' | 'outlined';
}

const EmailSignatureGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [businessId, setBusinessId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [signatureData, setSignatureData] = useState<SignatureData>({
    fullName: "",
    jobTitle: "",
    company: "",
    email: "",
  });

  const [signatureStyle, setSignatureStyle] = useState<SignatureStyle>({
    template: 'classic',
    fontSize: 'medium',
    fontFamily: 'Arial',
    primaryColor: '#1a1a1a',
    secondaryColor: '#666666',
    includePhoto: true,
    includeLogo: true,
    includeSocial: true,
    iconStyle: 'color',
  });

  useEffect(() => {
    const loadBusinessData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: business } = await supabase
        .from('user_businesses')
        .select('id, business_name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (business && profile) {
        setSignatureData(prev => ({
          ...prev,
          company: business.business_name,
          email: profile.email,
        }));
        setBusinessId(business.id);
      }
    };

    loadBusinessData();
  }, []);

  const uploadImage = async (file: File, type: 'photo' | 'logo' | 'banner') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload images",
        variant: "destructive",
      });
      return null;
    }

    const fileName = `${type}-${Date.now()}.${file.name.split('.').pop()}`;
    const filePath = `${user.id}/email-signatures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('business-assets')
      .upload(filePath, file);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive",
      });
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('business-assets')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Professional Email Signature Generator</h1>
          <p className="text-muted-foreground">
            Create a branded signature for all your emails with custom templates and export options
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Form */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <SignatureForm
                data={signatureData}
                onChange={setSignatureData}
                onImageUpload={uploadImage}
              />
            </Card>
          </div>

          {/* Center Panel - Preview */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <SignaturePreview
                data={signatureData}
                style={signatureStyle}
              />
            </Card>

            <Card className="p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Choose Template</h2>
              <TemplateSelector
                selected={signatureStyle.template}
                onChange={(template) => setSignatureStyle(prev => ({ ...prev, template: template as SignatureStyle['template'] }))}
              />
            </Card>
          </div>

          {/* Right Panel - Customization & Export */}
          <div className="lg:col-span-1">
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Customize Style</h2>
              <StyleCustomizer
                style={signatureStyle}
                onChange={setSignatureStyle}
              />
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Export</h2>
              <ExportOptions
                data={signatureData}
                style={signatureStyle}
                businessId={businessId}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSignatureGenerator;