// One-time image pipeline: converts the original photos in /images-src to
// resized WebP files in /public/images, and builds the logo/favicon assets.
// Originals are not committed (too large); the WebP output is.
// Run with: npm run images
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SRC = "images-src";
const OUT = "public/images";
const WIDTHS = [480, 640, 800, 1280, 1600];

// source file -> clean, descriptive output name
const PHOTOS = {
  "asian-man-cutting-trees-using-electrical-chainsaw.jpg": "chainsaw-cutting-tree-stump",
  "man-with-chainsaw-cuts-tree.jpg": "chainsaw-cutting-felled-trunk",
  "garden-tools-leaning-pine-tree-garden-garden-space-cleaning-outdoor-park-copy-space-with-garden-tools-necessary-ongoing-maintenance-park-public-space.jpg": "pine-tree-pole-saw-yard",
  "tree-stumps-surrounded-by-greenery-forest-sunlight.jpg": "tree-stump-cleared-lot",
  "pexels-mikebird-5351110.jpg": "fallen-tree-blocking-road",
  "pexels-gaion-30387775.jpg": "uprooted-tree-after-storm",
  "closeup-lumberjack-with-chainsaw-forest.jpg": "cutting-log-land-clearing",
  "man-chopping-wood-with-chainsaw.jpg": "chainsaw-on-cut-logs",
  "pexels-helen1-7812846.jpg": "crew-cutting-tree-trunk-sections",
  "man-chopping-wood-with-axe.jpg": "splitting-logs-backyard",
  "pexels-matreding-6835301.jpg": "chainsaw-cutting-log-section",
  "pexels-helen1-7812853.jpg": "cutting-trunk-with-crane-truck",
  "professional-lumberjack-forest-cutting-oak-trunk-with-chainsaw.jpg": "chainsaw-operator-oak-tree",
  "pexels-gaston-mousist-57404286-10079904.jpg": "decayed-tree-trunk-inspection",
  "chain-saw-log.jpg": "chainsaw-resting-on-stump",
};

await fs.mkdir(OUT, { recursive: true });
const manifest = {};

for (const [file, name] of Object.entries(PHOTOS)) {
  const input = path.join(SRC, file);
  const img = sharp(input).rotate();
  const meta = await img.metadata();
  const ratio = (meta.height ?? 1) / (meta.width ?? 1);
  manifest[name] = { ratio: Number(ratio.toFixed(4)), widths: [] };
  for (const w of WIDTHS) {
    if (meta.width && w > meta.width) continue;
    if (ratio > 1 && w > 800) continue;
    const out = path.join(OUT, `${name}-${w}.webp`);
    await sharp(input).rotate().resize({ width: w }).webp({ quality: w >= 1280 ? 66 : 60, effort: 6 }).toFile(out);
    manifest[name].widths.push(w);
  }
  // Open Graph / social share version (JPG for widest support)
  await sharp(input).rotate().resize(1200, 630, { fit: "cover" }).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(OUT, `${name}-og.jpg`));
  console.log("ok", name);
}

// Logo: full logo (square), tree mark crop for header + favicons.
const logo = "images-src/logo-source.webp";
await sharp(logo).resize(480).webp({ quality: 90 }).toFile(`${OUT}/macon-tree-removal-co-logo.webp`);
await sharp(logo).resize(480).png({ compressionLevel: 9 }).toFile(`${OUT}/macon-tree-removal-co-logo.png`);
// tree + chainsaw mark sits roughly in x 330..920, y 75..790 of the 1254px source
const mark = sharp(logo).extract({ left: 300, top: 60, width: 650, height: 740 });
const markBuf = await mark.toBuffer();
const square = await sharp({ create: { width: 760, height: 760, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: markBuf, left: 55, top: 10 }])
  .png()
  .toBuffer();
await sharp(markBuf).resize({ height: 112 }).webp({ quality: 90 }).toFile(`${OUT}/logo-mark.webp`);
await sharp(square).resize(512).png().toFile("public/icon-512.png");
await sharp(square).resize(192).png().toFile("public/icon-192.png");
await sharp(square).resize(180).png().toFile("public/apple-touch-icon.png");
await sharp(square).resize(48).png().toFile("public/favicon-48.png");
await sharp(square).resize(32).png().toFile("public/favicon-32.png");

// Open Graph default image 1200x630: logo on white, brand bar
const ogLogo = await sharp(logo).resize(560).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
  .composite([{ input: ogLogo, left: 320, top: 35 }])
  .jpeg({ quality: 82 })
  .toFile(`${OUT}/og-default.jpg`);

await fs.writeFile("lib/image-manifest.json", JSON.stringify(manifest, null, 2));
console.log("done");
