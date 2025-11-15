import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AdmZip: any = require("adm-zip");
import { componentTagger } from "lovable-tagger";

// Auto-unzip user templates from public/templates/*.zip into folders for live previews
function unzipTemplatesPlugin(): Plugin {
  const templatesDir = path.resolve(__dirname, "public", "templates");
  const map: Record<string, string> = {
    "acari-auto-template_2.zip": "automotive",
    "acari-creative-template.zip": "creative",
    "acari-fitness-template.zip": "fitness",
    "acari-legal-template.zip": "professional-services",
    "acari-medical-template.zip": "medical",
    "acari-plumbing-template.zip": "plumbing",
    "acari-realestate-template.zip": "real-estate",
    "acari-restaurant-template.zip": "restaurant",
    "acari-retail-template.zip": "retail",
    "acari-salon-template.zip": "salon-spa",
  };

  const extractAll = () => {
    if (!fs.existsSync(templatesDir)) return;
    const entries = fs.readdirSync(templatesDir);
    for (const file of entries) {
      if (!file.endsWith(".zip")) continue;
      const target = map[file];
      if (!target) continue; // skip unknown zips
      const zipPath = path.join(templatesDir, file);
      const outDir = path.join(templatesDir, target);
      try {
        console.log("[unzip-templates] Extracting:", file, "→", target);
        // Ensure output dir exists and extract (overwrite = true)
        fs.mkdirSync(outDir, { recursive: true });
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outDir, true);
        // Optional: flatten if archive has a single top-level folder
        const contents = fs.readdirSync(outDir);
        if (contents.length === 1) {
          const only = path.join(outDir, contents[0]);
          if (fs.statSync(only).isDirectory()) {
            // Move inner files up one level
            for (const inner of fs.readdirSync(only)) {
              fs.renameSync(path.join(only, inner), path.join(outDir, inner));
            }
            fs.rmSync(only, { recursive: true, force: true });
          }
        }
        console.log("[unzip-templates] Done:", target);
        // We expect index.html to be present after extraction
      } catch (e) {
        console.error("[unzip-templates] Failed:", file, e);
      }
    }
  };

  return {
    name: "unzip-templates",
    buildStart() {
      extractAll();
    },
    configureServer() {
      extractAll();
    },
  } as Plugin;
}


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), unzipTemplatesPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
