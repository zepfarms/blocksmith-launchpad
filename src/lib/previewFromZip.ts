import JSZip from "jszip";

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function previewTemplateFromZip(zipPath: string) {
  try {
    const res = await fetch(zipPath);
    if (!res.ok) throw new Error(`Failed to load zip: ${zipPath}`);
    const buf = await res.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);

    // Find main files (case-insensitive)
    const findFile = (name: string) => {
      const lower = name.toLowerCase();
      const entry = Object.values(zip.files).find(f => f.name.toLowerCase().endsWith(lower) && !f.dir);
      return entry || null;
    };

    const indexEntry = findFile("index.html");
    if (!indexEntry) throw new Error("index.html not found in zip");

    let html = await indexEntry.async("string");

    const cssEntry = findFile("styles.css");
    const jsEntry = findFile("script.js");

    let css = "";
    if (cssEntry) css = await cssEntry.async("string");

    let js = "";
    if (jsEntry) js = await jsEntry.async("string");

    // Inline CSS and JS
    if (css) {
      html = html.replace(/<link[^>]*href=[\"'].*styles\.css[\"'][^>]*>/i, "");
      html = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
    }
    if (js) {
      html = html.replace(/<script[^>]*src=[\"'].*script\.js[\"'][^>]*><\/script>/i, "");
      html = html.replace(/<\/body>/i, `<script>${js}</script></body>`);
    }

    // Replace image src with data URLs when available in zip
    const srcRegex = /src=[\"']([^\"']+)[\"']/gi;
    const replacements: Array<Promise<void>> = [];
    const seen = new Set<string>();

    html.replace(srcRegex, (_m, srcPath) => {
      if (seen.has(srcPath)) return _m;
      seen.add(srcPath);
      replacements.push((async () => {
        // ignore absolute URLs
        if (/^https?:\/\//i.test(srcPath)) return;
        // normalize path, try to find in zip
        const entry = Object.values(zip.files).find(f => f.name.toLowerCase().endsWith(srcPath.toLowerCase()) && !f.dir);
        if (!entry) return;
        const blob = await entry.async("blob");
        const dataUrl = await toDataUrl(blob);
        html = html.replace(new RegExp(srcPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), dataUrl);
      })());
      return _m;
    });

    await Promise.all(replacements);

    const win = window.open("", "_blank");
    if (!win) throw new Error("Popup blocked");
    win.document.open();
    win.document.write(html);
    win.document.close();
  } catch (e) {
    console.error("previewTemplateFromZip error", e);
    alert("Failed to preview template from ZIP. " + (e as Error).message);
  }
}
