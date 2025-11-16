import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QRPreview } from "@/components/qr/QRPreview";
import { QRContentForm } from "@/components/qr/QRContentForm";
import { QRStyleCustomizer } from "@/components/qr/QRStyleCustomizer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export type ContentType = "url" | "vcard" | "text" | "wifi" | "email" | "sms" | "phone";

export interface QRData {
  type: ContentType;
  content: string;
}

export interface QRStyle {
  size: number;
  fgColor: string;
  bgColor: string;
  level: "L" | "M" | "Q" | "H";
  includeMargin: boolean;
}

const QRCodeGenerator = () => {
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>("");
  const [qrData, setQRData] = useState<QRData>({
    type: "url",
    content: "",
  });
  const [qrStyle, setQRStyle] = useState<QRStyle>({
    size: 256,
    fgColor: "#000000",
    bgColor: "#ffffff",
    level: "M",
    includeMargin: true,
  });

  useEffect(() => {
    const loadBusinessData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data: business } = await supabase
        .from("user_businesses")
        .select("id, business_name")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (business) {
        setBusinessId(business.id);
        setBusinessName(business.business_name);
      }
    };

    loadBusinessData();
  }, [navigate]);

  const handleSaveQRCode = async (dataUrl: string) => {
    if (!businessId) {
      toast.error("No business found");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileName = `qr-${qrData.type}-${Date.now()}.png`;
      const base64Data = dataUrl.split(",")[1];
      const blob = await fetch(dataUrl).then(r => r.blob());

      const { error: uploadError } = await supabase.storage
        .from("qr-codes")
        .upload(`${user.id}/${fileName}`, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("qr-codes")
        .getPublicUrl(`${user.id}/${fileName}`);

      const { error: insertError } = await supabase
        .from("user_assets")
        .insert([{
          user_id: user.id,
          business_id: businessId,
          asset_type: "qr_code",
          file_url: publicUrl,
          metadata: {
            type: qrData.type,
            content: qrData.content,
            style: qrStyle,
          } as any,
        }]);

      if (insertError) throw insertError;

      // Update completion status
      const { error: updateError } = await supabase
        .from('user_block_unlocks')
        .update({ completion_status: 'completed' })
        .eq('user_id', user.id)
        .eq('business_id', businessId)
        .eq('block_name', 'QR Code Generator');

      if (updateError) {
        console.error('Error updating completion status:', updateError);
      }

      toast.success("QR code saved to your library!");
    } catch (error) {
      console.error("Error saving QR code:", error);
      toast.error("Failed to save QR code");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6 hover:bg-primary/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Create custom QR codes for your business
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6 glass-card">
              <h2 className="text-xl font-semibold mb-4">Content Type</h2>
              <Tabs
                value={qrData.type}
                onValueChange={(value) =>
                  setQRData({ type: value as ContentType, content: "" })
                }
              >
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="url">URL</TabsTrigger>
                  <TabsTrigger value="vcard">Contact</TabsTrigger>
                  <TabsTrigger value="text">Text</TabsTrigger>
                  <TabsTrigger value="wifi">WiFi</TabsTrigger>
                </TabsList>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="sms">SMS</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>

                <TabsContent value={qrData.type} className="mt-0">
                  <QRContentForm
                    type={qrData.type}
                    businessName={businessName}
                    onChange={(content) => setQRData({ ...qrData, content })}
                  />
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="p-6 glass-card">
              <h2 className="text-xl font-semibold mb-4">Customize Style</h2>
              <QRStyleCustomizer style={qrStyle} onChange={setQRStyle} />
            </Card>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <QRPreview
              data={qrData}
              style={qrStyle}
              onSave={handleSaveQRCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
