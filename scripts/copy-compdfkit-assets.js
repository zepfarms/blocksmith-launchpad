#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const sourceRoot = path.join(__dirname, "../node_modules/@compdfkit_pdf_sdk/webviewer");
const destRoot = path.join(__dirname, "../public/compdfkit");

const candidates = ["public", "dist", "lib", "resources", "static", "build"];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return false;
  
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    for (const file of files) {
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
    return true;
  } else {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    return true;
  }
}

function main() {
  console.log("[ComPDFKit] Postinstall: Copying assets to public/compdfkit...");

  if (!fs.existsSync(sourceRoot)) {
    console.warn(`[ComPDFKit] Package not found at ${sourceRoot}, skipping asset copy.`);
    return;
  }

  // Clean destination
  if (fs.existsSync(destRoot)) {
    fs.rmSync(destRoot, { recursive: true, force: true });
  }
  fs.mkdirSync(destRoot, { recursive: true });

  let copied = false;
  for (const candidate of candidates) {
    const srcPath = path.join(sourceRoot, candidate);
    if (fs.existsSync(srcPath)) {
      console.log(`[ComPDFKit] Copying from ${candidate}/...`);
      const files = fs.readdirSync(srcPath);
      for (const file of files) {
        copyRecursive(path.join(srcPath, file), path.join(destRoot, file));
      }
      copied = true;
    }
  }

  if (!copied) {
    console.log("[ComPDFKit] No known subfolder found, copying entire package...");
    const files = fs.readdirSync(sourceRoot);
    for (const file of files) {
      if (file !== "node_modules") {
        copyRecursive(path.join(sourceRoot, file), path.join(destRoot, file));
      }
    }
  }

  console.log("[ComPDFKit] Asset copy complete ✓");
}

main();
