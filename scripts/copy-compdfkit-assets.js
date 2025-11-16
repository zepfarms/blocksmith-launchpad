#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const sourceRoot = path.join(__dirname, "../node_modules/@compdfkit_pdf_sdk/webviewer");
const destCompdfkit = path.join(__dirname, "../public/compdfkit");
const destAtCompdfkit = path.join(__dirname, "../public/@compdfkit");

const candidates = ["public", "dist", "lib", "resources", "static", "build", "ui"]; // include ui if it's top-level in some versions

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

function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
}

function copyTo(destRoot) {
  let copied = false;
  for (const candidate of candidates) {
    const srcPath = path.join(sourceRoot, candidate);
    if (fs.existsSync(srcPath)) {
      console.log(`[ComPDFKit] Copying from ${candidate}/ to ${destRoot}...`);
      const files = fs.readdirSync(srcPath);
      for (const file of files) {
        copyRecursive(path.join(srcPath, file), path.join(destRoot, file));
      }
      copied = true;
    }
  }
  if (!copied) {
    console.log(`[ComPDFKit] No known subfolder found, copying entire package to ${destRoot}...`);
    const files = fs.readdirSync(sourceRoot);
    for (const file of files) {
      if (file !== "node_modules") {
        copyRecursive(path.join(sourceRoot, file), path.join(destRoot, file));
      }
    }
  }
}

function main() {
  console.log("[ComPDFKit] Postinstall: Copying assets to public/compdfkit and public/@compdfkit...");

  if (!fs.existsSync(sourceRoot)) {
    console.warn(`[ComPDFKit] Package not found at ${sourceRoot}, skipping asset copy.`);
    return;
  }

  cleanDir(destCompdfkit);
  cleanDir(destAtCompdfkit);

  copyTo(destCompdfkit);
  copyTo(destAtCompdfkit);

  console.log("[ComPDFKit] Asset copy complete ✓");
}

main();
