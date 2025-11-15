import { useState } from "react";
import { SignatureData, SignatureStyle } from "@/pages/dashboard/EmailSignatureGenerator";
import { Button } from "@/components/ui/button";
import { Copy, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSignatureHTML } from "./signatureTemplates";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ExportOptionsProps {
  data: SignatureData;
  style: SignatureStyle;
  businessId: string;
}

export const ExportOptions = ({ data, style, businessId }: ExportOptionsProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const html = generateSignatureHTML(data, style);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(html);
      toast({
        title: "Copied!",
        description: "Signature HTML copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const downloadAsHTML = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-signature-${data.fullName.replace(/\s/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "Signature saved as HTML file",
    });
  };

  const saveToLibrary = async () => {
    if (!businessId) {
      toast({
        title: "No business found",
        description: "Please create a business first",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileName = `signature-${Date.now()}.html`;
      const blob = new Blob([html], { type: 'text/html' });
      const filePath = `${user.id}/email-signatures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('business-assets')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('business-assets')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from('user_assets').insert([{
        user_id: user.id,
        business_id: businessId,
        asset_type: 'email_signature',
        file_url: publicUrl,
        metadata: {
          name: data.fullName,
          template: style.template,
        } as any,
      }]);

      if (insertError) throw insertError;

      toast({
        title: "Saved!",
        description: "Email signature saved to your library",
      });
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Button onClick={copyToClipboard} variant="outline" className="w-full">
          <Copy className="mr-2 h-4 w-4" />
          Copy HTML
        </Button>
        
        <Button onClick={downloadAsHTML} variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download HTML
        </Button>
        
        <Button onClick={saveToLibrary} disabled={saving} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save to Library"}
        </Button>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-3">Setup Instructions</h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="gmail">
            <AccordionTrigger>Gmail</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Copy the signature HTML above</li>
                <li>Open Gmail → Settings (gear icon) → See all settings</li>
                <li>Scroll to "Signature" section</li>
                <li>Click "Create new" or edit existing</li>
                <li>Paste the HTML (Ctrl+V or Cmd+V)</li>
                <li>Scroll down and click "Save Changes"</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="outlook">
            <AccordionTrigger>Outlook Desktop</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Copy the signature HTML above</li>
                <li>Open Outlook → File → Options → Mail → Signatures</li>
                <li>Click "New" to create a new signature</li>
                <li>Paste the HTML into the editor</li>
                <li>Click "OK" to save</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="outlook-web">
            <AccordionTrigger>Outlook Web</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Copy the signature HTML above</li>
                <li>Open Outlook Web → Settings → View all Outlook settings</li>
                <li>Go to Mail → Compose and reply</li>
                <li>Under "Email signature", paste the HTML</li>
                <li>Click "Save"</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="apple-mail">
            <AccordionTrigger>Apple Mail</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Download the HTML file above</li>
                <li>Open the HTML file in a browser</li>
                <li>Select and copy the signature</li>
                <li>Open Mail → Preferences → Signatures</li>
                <li>Click "+" to create new signature</li>
                <li>Paste into the signature field</li>
              </ol>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="thunderbird">
            <AccordionTrigger>Thunderbird</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Copy the signature HTML above</li>
                <li>Go to Account Settings → Account → Signature text</li>
                <li>Check "Use HTML"</li>
                <li>Paste the HTML code</li>
                <li>Click "OK"</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};