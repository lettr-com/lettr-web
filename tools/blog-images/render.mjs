#!/usr/bin/env node
/*
 * Blog art renderer.
 *
 * Every post in src/lib/data/posts.ts carries an `art` scene: one object from
 * the homepage hero's sprite library and a tilt. The post's category picks the
 * palette (src/lib/blog/art.ts). This script places the sprite on a cell grid,
 * ordered-dithers it (Bayer 8x8, the matrix EnvelopeDither.svelte uses) into
 * that palette and writes static/blog/<slug>/:
 *
 *   cover.png   200x112 cells   index cards; the page scales it with image-rendering: pixelated
 *   square.png   96x96 cells    article header
 *   thumb.png    48x48 cells    list rows and read-next, object nearly fills the tile
 *   strip.png   130x32 cells    mobile article band
 *   og.png      1200x630 px     Open Graph / X card, with the title
 *
 * The grid files hold the object alone on a transparent ground: the page
 * paints the category's ground colour behind it, so the object can move on
 * hover without dragging its background along. Objects whose hover is the
 * dither sweep also get <name>-sweep.png, a vertical strip of frames.
 *
 * The grid files stay at one pixel per cell (well under 1 KB each) and the
 * browser scales them, so the dots never get resampled into mush. Output is
 * deterministic: the same scene always gives the same bytes, so the files are
 * committed and reviewed like any other asset.
 *
 *   vp run blog:images               render every post
 *   vp run blog:images -- mcp-api-key-scopes   render one post
 */

import { readFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { posts } from "../../src/lib/data/posts.ts";
import {
  artLayouts as LAYOUTS,
  objectMotion,
  paletteFor,
  sweepFrames,
} from "../../src/lib/blog/art.ts";
import { dither, lightField } from "./dither.mjs";

const here = new URL(".", import.meta.url).pathname;
const root = join(here, "../..");
const OUT = join(root, "static/blog");

/** The object alone on a clear ground, one pixel per cell. */
async function renderLayer(art, palette, layout) {
  const pixels = dither(await lightField(art, palette, layout), palette, layout.cols, layout.rows, {
    transparent: true,
  });
  return sharp(pixels, { raw: { width: layout.cols, height: layout.rows, channels: 4 } });
}

async function renderGrid(art, palette, layout) {
  const pixels = dither(await lightField(art, palette, layout), palette, layout.cols, layout.rows);
  return sharp(pixels, { raw: { width: layout.cols, height: layout.rows, channels: 3 } });
}

/** Frames in a sweep strip; the first and last carry no light, so the strip rests on frame 0. */
const SWEEP_FRAMES = sweepFrames;

/**
 * A diagonal band of light crossing the object, frame by frame, stacked
 * vertically. Re-dithering each frame (rather than brightening pixels) is what
 * makes the dots themselves shimmer as the band passes.
 */
async function renderSweep(art, palette, layout) {
  const field = await lightField(art, palette, layout);
  const { cols, rows } = layout;
  // Measure the band across the object's own bounds, not the tile, so every frame lands on it.
  let [left, top, right, bottom] = [cols, rows, 0, 0];
  field.mask.forEach((on, i) => {
    if (!on) return;
    const x = i % cols;
    const y = Math.floor(i / cols);
    [left, top, right, bottom] = [
      Math.min(left, x),
      Math.min(top, y),
      Math.max(right, x),
      Math.max(bottom, y),
    ];
  });
  const width = Math.max(1, right - left);
  const height = Math.max(1, bottom - top);
  const frames = [];
  for (let f = 0; f < SWEEP_FRAMES; f++) {
    // From just before the top-left corner to just past the bottom-right one.
    const centre = -0.3 + (1.6 * f) / (SWEEP_FRAMES - 1);
    const light = (x, y) => {
      const d = ((x - left) / width + ((y - top) / height) * 0.6) / 1.6 - centre;
      return 0.45 * Math.exp(-(d * d) / 0.02);
    };
    frames.push(dither(field, palette, cols, rows, { transparent: true, light }));
  }
  return sharp(Buffer.concat(frames), {
    raw: { width: cols, height: rows * SWEEP_FRAMES, channels: 4 },
  });
}

const fonts = [
  {
    name: "Zalando",
    data: readFileSync(join(here, "fonts/ZalandoSansSemiExpanded-Regular.ttf")),
    weight: 400,
    style: "normal",
  },
];

function logo(color) {
  const svg = readFileSync(join(root, "static/logo.svg"), "utf8").replace(
    /fill="#1F2937"/g,
    `fill="${color}"`,
  );
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function titleNode(title, fontSize, width, color) {
  return {
    type: "div",
    props: {
      style: {
        width,
        display: "flex",
        fontFamily: "Zalando",
        fontSize,
        lineHeight: 1.12,
        letterSpacing: -0.02 * fontSize,
        color,
      },
      children: title,
    },
  };
}

async function titleHeight(title, fontSize, width) {
  const svg = await satori(titleNode(title, fontSize, width, "#000"), { width, fonts });
  return Number(/height="([\d.]+)"/.exec(svg)[1]);
}

/**
 * Satori has no text-wrap: balance, so narrow the title while its line count
 * holds. The last line then carries its share of words instead of a widow.
 */
async function balancedWidth(title, fontSize, maxWidth) {
  const height = await titleHeight(title, fontSize, maxWidth);
  let width = maxWidth;
  for (let w = maxWidth - 16; w >= maxWidth * 0.55; w -= 16) {
    if ((await titleHeight(title, fontSize, w)) > height) break;
    width = w;
  }
  return width;
}

async function titleLayer(title, palette) {
  const fontSize = title.length > 70 ? 50 : title.length > 48 ? 58 : 66;
  const width = await balancedWidth(title, fontSize, 640);
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          boxSizing: "border-box",
        },
        children: [
          { type: "img", props: { src: logo(palette.text), width: 152, height: 32 } },
          titleNode(title, fontSize, width, palette.text),
        ],
      },
    },
    { width: 1200, height: 630, fonts },
  );
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

async function renderPost(post) {
  const dir = join(OUT, post.slug);
  mkdirSync(dir, { recursive: true });
  const palette = paletteFor(post.category, post.art);
  const png = { palette: true, colors: 8, compressionLevel: 9 };

  for (const name of ["cover", "square", "thumb", "strip"]) {
    const layer = await renderLayer(post.art, palette, LAYOUTS[name]);
    await layer.png(png).toFile(join(dir, `${name}.png`));
  }

  for (const name of ["cover", "square", "thumb"]) {
    const file = join(dir, `${name}-sweep.png`);
    if (objectMotion[post.art.object] === "sweep") {
      const sweep = await renderSweep(post.art, palette, LAYOUTS[name]);
      await sweep.png(png).toFile(file);
    } else {
      // The post's object no longer sweeps; drop the strip it used to have.
      rmSync(file, { force: true });
    }
  }

  const og = await renderGrid(post.art, palette, LAYOUTS.og);
  const base = await og.resize(1200, 630, { kernel: "nearest" }).png().toBuffer();
  await sharp(base)
    .composite([{ input: await titleLayer(post.title, palette) }])
    .png({ palette: true, colors: 32, compressionLevel: 9 })
    .toFile(join(dir, "og.png"));
}

const only = process.argv.slice(2);
const selected = only.length ? posts.filter((post) => only.includes(post.slug)) : posts;
if (only.length && selected.length !== only.length) {
  throw new Error(`Unknown slug in: ${only.join(", ")}`);
}
for (const post of selected) {
  const started = Date.now();
  await renderPost(post);
  console.log(`${post.slug}  ${Date.now() - started}ms`);
}
