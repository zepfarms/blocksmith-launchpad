import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { toast } from "sonner";
import { QRData, QRStyle } from "@/pages/dashboard/QRCodeGenerator";

interface QRPreviewProps {
  data: QRData;
  style: QRStyle;
  onSave: (dataUrl: string) => void;
}

export const QRPreview = ({ data, style, onSave }: QRPreviewProps) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = (format: "png" | "svg") => {
    if (!data.content) {
      toast.error("Please enter content first");
      return;
    }

    if (format === "png") {
      const canvas = document.createElement("canvas");
      const svg = qrRef.current?.querySelector("svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        canvas.width = style.size;
        canvas.height = style.size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        
        canvas.toBlob((blob) => {
          if (!blob) return;
          const link = document.createElement("a");
          link.download = `qr-code-${data.type}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          toast.success("QR code downloaded!");
        });
      };
      
      img.src = url;
    } else {
      const svg = qrRef.current?.querySelector("svg");
      if (!svg) return;

      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.download = `qr-code-${data.type}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("QR code downloaded!");
    }
  };

  const handleSave = () => {
    if (!data.content) {
      toast.error("Please enter content first");
      return;
    }

    const canvas = document.createElement("canvas");
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = style.size;
      canvas.height = style.size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      const dataUrl = canvas.toDataURL("image/png");
      onSave(dataUrl);
    };
    
    img.src = url;
  };

  return (
    <Card className="p-6 glass-card">
      <h2 className="text-xl font-semibold mb-4">Preview</h2>
      
      <div className="bg-background rounded-lg p-8 flex items-center justify-center mb-6">
        <div ref={qrRef} className="bg-white p-4 rounded-lg shadow-lg">
          {data.content ? (
            <QRCodeSVG
              value={data.content}
              size={style.size}
              fgColor={style.fgColor}
              bgColor={style.bgColor}
              level={style.level}
              includeMargin={style.includeMargin}
            />
          ) : (
            <div
              className="flex items-center justify-center border-2 border-dashed border-muted"
              style={{ width: style.size, height: style.size }}
            >
              <p className="text-muted-foreground text-center text-sm">
                Enter content to<br />generate QR code
              </p>
            </div>
          )}
        </div>
      </div>

      {data.content && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => downloadQRCode("png")}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              PNG
            </Button>
            <Button
              onClick={() => downloadQRCode("svg")}
              variant="outline"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              SVG
            </Button>
          </div>
          <Button onClick={handleSave} className="w-full" variant="default">
            <Save className="mr-2 h-4 w-4" />
            Save to Library
          </Button>
        </div>
      )}

      {data.content && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Content Type: {data.type.toUpperCase()}
          </p>
          <p className="text-sm break-all">{data.content}</p>
        </div>
      )}
    </Card>
  );
};
