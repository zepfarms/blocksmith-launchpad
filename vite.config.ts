import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { viteStaticCopy } from "vite-plugin-static-copy";

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
      targets: [
        // Try multiple possible source locations for ComPDFKit assets
        {
          src: "node_modules/@compdfkit_pdf_sdk/webviewer/public/**/*",
          dest: "compdfkit",
        },
        {
          src: "node_modules/@compdfkit_pdf_sdk/webviewer/lib/**/*",
          dest: "compdfkit",
        },
        {
          src: "node_modules/@compdfkit_pdf_sdk/webviewer/dist/**/*",
          dest: "compdfkit",
        },
      ],
      structured: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
