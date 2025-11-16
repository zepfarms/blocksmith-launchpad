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
  const targets: { src: string; dest: string }[] = [];
  try {
    if (fs.existsSync(webviewerRoot)) {
      for (const dir of compdfkitCandidates) {
        const candidatePath = path.join(webviewerRoot, dir);
        if (fs.existsSync(candidatePath)) {
          targets.push({
            src: `node_modules/@compdfkit_pdf_sdk/webviewer/${dir}/**/*`,
            dest: "compdfkit",
          });
        }
      }
      if (targets.length === 0) {
        targets.push({
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
  console.log("[ComPDFKit] static-copy targets:", targets);
  return targets;
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
