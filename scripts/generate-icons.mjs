import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const svg = readFileSync(path.join(root, "public/favicon.svg"));
const outDir = path.join(root, "public/icons");
mkdirSync(outDir, { recursive: true });

const BG = "#ffffff";

async function renderOnBackground(size, scale, file) {
  const inner = Math.round(size * scale);
  const icon = await sharp(svg, { density: 384 })
    .resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toFile(path.join(outDir, file));
  console.log("wrote", file);
}

await renderOnBackground(192, 0.72, "icon-192.png");
await renderOnBackground(512, 0.72, "icon-512.png");
await renderOnBackground(512, 0.6, "icon-512-maskable.png"); // extra padding for adaptive-icon safe zone
await renderOnBackground(180, 0.72, "apple-touch-icon.png");
