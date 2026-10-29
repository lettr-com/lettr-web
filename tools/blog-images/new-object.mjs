#!/usr/bin/env node
/*
 * Draws a new object for the blog art library with an OpenAI image model,
 * using two of the library's sprites as style references, and writes it to
 * tools/blog-images/sprites/<name>.png at the library's size and padding.
 *
 *   node tools/blog-images/new-object.mjs padlock "closed padlock"
 *
 * With --candidate the result goes to tools/blog-images/candidates/ instead,
 * for side-by-side review before it replaces anything.
 *
 * The key comes from OPENAI_API_KEY or ~/.config/openai-key. The untouched
 * model output is kept in tools/blog-images/raw/ so a sprite can be
 * re-processed without paying for it again. A new sprite still has to be
 * added to blogObjects (and the other maps) in src/lib/blog/art.ts.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const here = new URL(".", import.meta.url).pathname;
const root = join(here, "../..");
/**
 * Style references: the blog's own drawn sprites, whose softer, rounder clay
 * look the team preferred to the hero's originals.
 */
const REFERENCES = [join(here, "sprites/shield.png"), join(here, "sprites/bell.png")];

const args = process.argv.slice(2);
const candidate = args.includes("--candidate");
const [name, subject] = args.filter((arg) => arg !== "--candidate");
const SPRITES = join(here, candidate ? "candidates" : "sprites");
const RAW = join(here, candidate ? "raw/candidates" : "raw");
const MODEL = "gpt-image-2.5-flare";
/** Existing sprites are 384px with the object's longest side about 330px. */
const SIZE = 384;
const OBJECT = 330;

if (!name || !subject || !/^[a-z0-9-]+$/.test(name)) {
  throw new Error('Usage: node new-object.mjs [--candidate] <kebab-name> "<what to draw>"');
}

function apiKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY.trim();
  const file = join(homedir(), ".config/openai-key");
  if (existsSync(file)) return readFileSync(file, "utf8").trim();
  throw new Error("Set OPENAI_API_KEY or save the key to ~/.config/openai-key");
}

const prompt = [
  `A single ${subject}.`,
  "Match the reference images exactly in style: a soft, glossy 3D clay render with rounded, chunky,",
  "slightly inflated shapes, in pink and crimson with soft white highlights and no other colours.",
  "One object only, in a gentle three-quarter view, centred, filling most of the frame.",
  "Transparent background. No shadow, no text, no outline, no extra objects.",
].join(" ");

async function generate() {
  const form = new FormData();
  form.append("model", MODEL);
  form.append("prompt", prompt);
  form.append("size", "1024x1024");
  // The renderer shrinks every sprite to a cell grid, so medium is plenty and roughly 4x cheaper than high.
  form.append("quality", "medium");
  form.append("background", "transparent");
  form.append("output_format", "png");
  for (const reference of REFERENCES) {
    const bytes = readFileSync(reference);
    form.append("image[]", new Blob([bytes], { type: "image/png" }), reference.split("/").pop());
  }
  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey()}` },
    body: form,
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(`${response.status}: ${body.error?.message ?? JSON.stringify(body)}`);
  return Buffer.from(body.data[0].b64_json, "base64");
}

/**
 * Models sometimes leave a faint glow or a near-invisible backdrop around the
 * object; anything under this alpha is cleared before trimming, or the trim
 * keeps the whole canvas and the object comes out small.
 */
const ALPHA_FLOOR = 96;

/** Clear faint pixels, trim to the object, scale its longest side to OBJECT px and centre it on a SIZE px tile. */
async function fit(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < data.length; i += 4) if (data[i] < ALPHA_FLOOR) data[i] = 0;
  const cleaned = await sharp(data, { raw: info }).png().toBuffer();
  const trimmed = await sharp(cleaned).trim({ threshold: 1 }).png().toBuffer();
  const resized = await sharp(trimmed)
    .resize(OBJECT, OBJECT, { fit: "inside", kernel: "lanczos3" })
    .png()
    .toBuffer({ resolveWithObject: true });
  return sharp({
    create: { width: SIZE, height: SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: resized.data,
        left: Math.round((SIZE - resized.info.width) / 2),
        top: Math.round((SIZE - resized.info.height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

mkdirSync(RAW, { recursive: true });
mkdirSync(SPRITES, { recursive: true });
const rawPath = join(RAW, `${name}.png`);
const raw =
  existsSync(rawPath) && process.env.REGENERATE !== "1" ? readFileSync(rawPath) : await generate();
writeFileSync(rawPath, raw);
const out = join(SPRITES, `${name}.png`);
writeFileSync(out, await fit(raw));
console.log(`${name}: ${out}`);
