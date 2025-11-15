import { SignatureData, SignatureStyle } from "@/pages/dashboard/EmailSignatureGenerator";
import { generateSignatureHTML } from "./signatureTemplates";

interface SignaturePreviewProps {
  data: SignatureData;
  style: SignatureStyle;
}

export const SignaturePreview = ({ data, style }: SignaturePreviewProps) => {
  const html = generateSignatureHTML(data, style);

  return (
    <div className="border rounded-lg p-4 bg-white min-h-[400px]">
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        className="signature-preview"
      />
    </div>
  );
};