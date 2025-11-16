import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";

// ComPDFKit asset copy helper: probe known subfolders at runtime to avoid copy errors
const webviewerRoot = path.resolve(__dirname, "node_modules/@compdfkit_pdf_sdk/webviewer");
const compdfkitCandidates = ["public", "dist", "lib", "resources", "static", "build", "ui"];

function buildComPDFKitTargets() {
  const baseTargets: { src: string; dest: string }[] = [];
  try {
    if (fs.existsSync(webviewerRoot)) {
      for (const dir of compdfkitCandidates) {
        const candidatePath = path.join(webviewerRoot, dir);
        if (fs.existsSync(candidatePath)) {
          baseTargets.push({
            src: `node_modules/@compdfkit_pdf_sdk/webviewer/${dir}/**/*`,
            dest: "compdfkit",
          });
        }
      }
      if (baseTargets.length === 0) {
        baseTargets.push({
          src: "node_modules/@compdfkit_pdf_sdk/webviewer/**/*",
          dest: "compdfkit",
        });
      }
    } else {
      console.warn("[ComPDFKit] Package not found at", webviewerRoot);
    }
  } catch (e) {
    console.warn("[ComPDFKit] Error building static copy targets:", e);
  }

  // Duplicate targets to also serve under /@compdfkit/webviewer for SDK internal references
  const allTargets: { src: string; dest: string }[] = [];
  for (const t of baseTargets) {
    allTargets.push(t);
    allTargets.push({ src: t.src, dest: "@compdfkit/webviewer" });
  }

  console.log("[ComPDFKit] static-copy targets:", allTargets);
  return allTargets;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/compdfkit": {
        target: "https://unpkg.com/@compdfkit_pdf_sdk@2.8.3/webviewer",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/compdfkit/, ""),
      },
      "/@compdfkit/webviewer": {
        target: "https://unpkg.com/@compdfkit_pdf_sdk@2.8.3/webviewer",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/@compdfkit\/webviewer/, ""),
      },
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    viteStaticCopy({
      targets: buildComPDFKitTargets(),
      structured: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
