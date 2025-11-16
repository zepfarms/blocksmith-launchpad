import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";


interface PDFEditorViewerProps {
  pdfUrl: string;
}

export function PDFEditorViewer({ pdfUrl }: PDFEditorViewerProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!pdfUrl || !containerRef.current) return;

    let timeoutId: number | undefined;

    const resolveSdkPath = async (): Promise<string> => {
      // First check if the UI bundle is available (preferred path)
      try {
        const uiResponse = await fetch("/compdfkit/ui/index.html", { method: "HEAD" });
        if (uiResponse.ok) {
          console.log("[PDFEditor] Found UI → using /compdfkit");
          return "/compdfkit";
        }
      } catch (e) {
        // UI not found, try other paths
      }

      // Fallback: check other subfolders for webviewer files
      const candidates = [
        "/compdfkit/dist",
        "/compdfkit/public",
        "/compdfkit/lib",
        "/compdfkit/resources",
        "/compdfkit/static",
        "/compdfkit/build",
      ];

      for (const candidate of candidates) {
        for (const fileName of ["webviewer.min.js", "webviewer.js"]) {
          const url = `${candidate}/${fileName}`;
          try {
            const response = await fetch(url, { method: "HEAD" });
            if (response.ok) {
              console.log(`[PDFEditor] Found SDK at ${candidate} → using /compdfkit`);
              return "/compdfkit";
            }
          } catch (e) {
            // Continue to next candidate
          }
        }
      }

      console.warn("[PDFEditor] No SDK path found, defaulting to /compdfkit");
      return "/compdfkit";
    };

    const initializeViewer = async () => {
      try {
        setLoading(true);
        setError(null);
        setTimedOut(false);

        const publicKey = import.meta.env.VITE_COMPDFKIT_PUBLIC_KEY;

        if (!publicKey) {
          toast({
            variant: "destructive",
            title: "Configuration Error",
            description:
              "PDF Editor is not properly configured. Please contact support.",
          });
          setError("PDF Editor is not configured");
          setLoading(false);
          return;
        }

        // Verify PDF is reachable
        console.log("[PDFEditor] Checking PDF reachability:", pdfUrl);
        try {
          const pdfCheck = await fetch(pdfUrl, { method: "HEAD" });
          if (!pdfCheck.ok) {
            setError("Your PDF file couldn't be reached. Please try again.");
            setLoading(false);
            return;
          }
          console.log("[PDFEditor] PDF is reachable");
        } catch (e) {
          setError("Your PDF file couldn't be reached. Please check your connection.");
          setLoading(false);
          return;
        }

        // Wait for container to be ready with proper dimensions
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        if (!containerRef.current) {
          setError("PDF container not ready");
          setLoading(false);
          return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        console.log("[PDFEditor] Container rect", rect);

        // Verify container has valid dimensions
        if (!rect.width || !rect.height || rect.width < 100 || rect.height < 100) {
          console.error("[PDFEditor] Container has invalid dimensions:", rect);
          setError("PDF viewer container not properly sized. Please refresh the page.");
          setLoading(false);
          return;
        }

        // Auto-detect the correct SDK path
        const sdkPath = await resolveSdkPath();

        // Dynamic import from npm package
        const mod: any = await import("@compdfkit_pdf_sdk/webviewer");
        const WebViewer = mod?.default ?? mod;
        if (!WebViewer?.init) {
          console.error("ComPDFKit WebViewer.init not found", { mod });
          toast({
            variant: "destructive",
            title: "PDF SDK not loaded",
            description: "Failed to load ComPDFKit viewer module.",
          });
          setError("Failed to load viewer module");
          setLoading(false);
          return;
        }

        const options = {
          pdfUrl,
          license: publicKey,
          path: "/compdfkit",
        } as const;
        console.log("[PDFEditor] Initializing ComPDFKit", options);

        timeoutId = window.setTimeout(() => {
          console.warn("[PDFEditor] Viewer timed out after 15s");
          setTimedOut(true);
        }, 15000);

        const instance = await WebViewer.init(options, containerRef.current!);
        console.log("[PDFEditor] ComPDFKit ready", { instance });
        if (timeoutId) clearTimeout(timeoutId);
        setLoading(false);
      } catch (error: any) {
        console.error("Error initializing PDF viewer:", error);
        if (timeoutId) clearTimeout(timeoutId);
        setLoading(false);
        setError(error?.message || "Failed to initialize PDF viewer");
        toast({
          variant: "destructive",
          title: "Error loading PDF editor",
          description: error?.message || "Failed to initialize PDF viewer",
        });
      }
    };

    initializeViewer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [pdfUrl, toast]);

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full bg-background overflow-hidden"
        style={{ height: "calc(100vh - 140px)", minHeight: "600px" }}
      >
        {(loading || error || timedOut) && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm">
            {loading && !timedOut && !error && (
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-muted-foreground border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Preparing PDF editor...</p>
              </div>
            )}

            {(error || timedOut) && (
              <div className="flex flex-col items-center gap-3 text-center max-w-sm">
                <p className="text-sm text-muted-foreground">
                  {error || "The editor is taking longer than expected to load."}
                </p>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="sm">Open PDF in new tab</Button>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
