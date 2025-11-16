import { useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SimplePdfViewer } from "./SimplePdfViewer";
import { RefreshCw } from "lucide-react";


interface PDFEditorViewerProps {
  pdfUrl: string;
}

export function PDFEditorViewer({ pdfUrl }: PDFEditorViewerProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  useLayoutEffect(() => {
    if (!pdfUrl || !containerRef.current) return;

    let timeoutId: number | undefined;
    let fallbackTimeoutId: number | undefined;

const resolveSdkPath = async (): Promise<string> => {
      const bases = ["/@compdfkit/webviewer", "/compdfkit"];

      // Prefer UI bundle check first
      for (const base of bases) {
        try {
          const ui = await fetch(`${base}/ui/index.html`, { method: "HEAD" });
          console.log(`[PDFEditor] Probe ${base}/ui/index.html → ${ui.status}`);
          if (ui.ok) {
            console.log(`[PDFEditor] Found UI → using ${base}`);
            return base;
          }
        } catch (_) {
          // ignore and continue
        }
      }

      // Fallback: probe common subfolders for webviewer files under both bases
      const subfolders = ["dist", "public", "lib", "resources", "static", "build"];
      for (const base of bases) {
        for (const folder of subfolders) {
          for (const fileName of ["webviewer.min.js", "webviewer.js"]) {
            const url = `${base}/${folder}/${fileName}`;
            try {
              const resp = await fetch(url, { method: "HEAD" });
              if (resp.ok) {
                console.log(`[PDFEditor] Found SDK file at ${url} → using ${base}`);
                return base;
              }
            } catch (_) {
              // continue
            }
          }
        }
      }

      console.warn("[PDFEditor] No SDK path found; defaulting to /compdfkit");
      return "/compdfkit";
    };

    const initializeViewer = async () => {
      try {
        setLoading(true);
        setError(null);
        setTimedOut(false);
        setShowFallback(false);
        setEditorReady(false);

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
        const computedWidth = containerRef.current.offsetWidth;
        const computedHeight = containerRef.current.offsetHeight;
        console.log("[PDFEditor] Container dimensions:", { 
          width: computedWidth, 
          height: computedHeight,
          rect 
        });

        // Verify container has valid dimensions
        if (!computedWidth || !computedHeight || computedWidth < 200 || computedHeight < 200) {
          console.error("[PDFEditor] Container has invalid dimensions:", { computedWidth, computedHeight });
          setError("PDF viewer container not properly sized. Please refresh the page.");
          setLoading(false);
          setShowFallback(true);
          return;
        }

        // Try local paths first (from postinstall script)
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
          path: sdkPath,
        } as const;
        console.log("[PDFEditor] Initializing ComPDFKit", options);

        timeoutId = window.setTimeout(() => {
          console.warn("[PDFEditor] Viewer timed out after 15s");
          setTimedOut(true);
          setLoading(false);
        }, 15000);

        // Show fallback after 5s if editor hasn't loaded
        fallbackTimeoutId = window.setTimeout(() => {
          if (!editorReady) {
            console.log("[PDFEditor] Showing fallback viewer after 5s");
            setShowFallback(true);
          }
        }, 5000);

        const instance = await WebViewer.init(options, containerRef.current!);
        console.log("[PDFEditor] ComPDFKit ready", { instance });
        if (timeoutId) clearTimeout(timeoutId);
        if (fallbackTimeoutId) clearTimeout(fallbackTimeoutId);
        setEditorReady(true);
        setLoading(false);
      } catch (error: any) {
        console.error("Error initializing PDF viewer:", error);
        if (timeoutId) clearTimeout(timeoutId);
        if (fallbackTimeoutId) clearTimeout(fallbackTimeoutId);
        setLoading(false);
        setError(error?.message || "Failed to initialize PDF viewer");
        setShowFallback(true);
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
      if (fallbackTimeoutId) clearTimeout(fallbackTimeoutId);
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [pdfUrl, toast]);

  const handleRetry = () => {
    setError(null);
    setTimedOut(false);
    setShowFallback(false);
    setLoading(true);
    window.location.reload();
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      {showFallback && (
        <div className="flex-1">
          <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {loading ? "Editor is loading..." : "Viewing in fallback mode"}
            </p>
            {(error || timedOut) && (
              <Button onClick={handleRetry} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Retry Editor
              </Button>
            )}
          </div>
          <SimplePdfViewer pdfUrl={pdfUrl} />
        </div>
      )}

      <div
        ref={containerRef}
        className={`relative w-full bg-background overflow-hidden min-h-[700px] ${showFallback ? 'hidden' : 'flex-1'}`}
        style={{ height: showFallback ? 0 : "calc(100vh - 140px)" }}
      >
        {(loading || error || timedOut) && !showFallback && (
          <div className="absolute inset-0 grid place-items-center bg-background/60 backdrop-blur-sm z-50">
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
                <div className="flex gap-2">
                  <Button onClick={handleRetry} variant="default" size="sm" className="gap-2">
                    <RefreshCw className="h-3 w-3" />
                    Retry
                  </Button>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm">Open PDF in new tab</Button>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
