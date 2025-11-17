import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { toast } from "sonner";

interface DownloadButtonProps {
  templateId: string;
  fileUrl: string | null;
  fileType: string;
  title: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function DownloadButton({
  templateId,
  fileUrl,
  fileType,
  title,
  variant = "default",
  size = "default",
}: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const trackDownload = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from("document_analytics").insert({
        document_id: templateId,
        action_type: "download",
        user_id: user?.id || null,
      });

      // Increment download count
      const { data: currentTemplate } = await supabase
        .from("document_templates")
        .select("download_count")
        .eq("id", templateId)
        .single();
      
      if (currentTemplate) {
        await supabase
          .from("document_templates")
          .update({ download_count: currentTemplate.download_count + 1 })
          .eq("id", templateId);
      }
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) {
      toast.error("File not available for download");
      return;
    }

    setDownloading(true);
    
    try {
      // Track the download
      await trackDownload();

      // For Google Docs, open in new tab
      if (fileType === "google-docs") {
        window.open(fileUrl, "_blank");
        toast.success("Opening in Google Docs...");
      } else {
        // For other files, trigger download
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `${title}.${fileType}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download started!");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download template");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={downloading || !fileUrl}
      variant={variant}
      size={size}
    >
      {downloading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : fileType === "google-docs" ? (
        <>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Google Docs
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2" />
          Download {fileType.toUpperCase()}
        </>
      )}
    </Button>
  );
}
