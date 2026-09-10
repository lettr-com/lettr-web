#!/usr/bin/env node
/*
 * Offline ordered dither for the Lettr hero loop.
 *
 * Takes PNG frames (or a single PNG), downsamples to a cell grid, applies a
 * Bayer 8x8 ordered dither into the four-step brand palette, and writes PNG
 * frames back at the original size with hard pixel edges. The maths mirror
 * src/lib/components/home/DitherHero.svelte so the offline loop and the
 * runtime etch trail agree.
 *
 * Usage:
 *   node tools/dither/dither.mjs --in frames --out dithered [--cell 3]
 *       [--amp 0.3] [--levels 0.8,0.58,0.32] [--palette paper,rose,crimson,ink]
 *   node tools/dither/dither.mjs --in poster.png --out poster-dithered.png
 *
 * Full pipeline (run ffmpeg on your machine, this script in between):
 *   ffmpeg -i envelope-loop.mp4 -vf "scale=1600:-2" frames/f_%04d.png
 *   node tools/dither/dither.mjs --in frames --out dithered --cell 3
 *   ffmpeg -framerate 30 -i dithered/f_%04d.png -c:v libx264 -pix_fmt yuv420p \
 *          -crf 18 -movflags +faststart static/hero/envelope-loop.mp4
 *   ffmpeg -i dithered/f_0001.png -quality 90 static/hero/envelope-poster.webp
 *
 * Keep -crf low: video compression smears the dither, and the browser shows
 * every dot at 1:1.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { PNG } from "pngjs";

const PALETTES = {
  paper: [247, 241, 243],
  rose: [244, 168, 190],
  crimson: [236, 16, 75],
  ink: [17, 24, 39],
  white: [255, 255, 255],
  surface: [17, 24, 39],
};

const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28,
  52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7,
  39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
];

function parseArgs(argv) {
  const args = {
    cell: 3,
    amp: 0.3,
    levels: [0.8, 0.58, 0.32],
    palette: ["paper", "rose", "crimson", "ink"],
  };
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    const val = argv[i + 1];
    switch (key) {
      case "--in":
        args.in = val;
        i++;
        break;
      case "--out":
        args.out = val;
        i++;
        break;
      case "--cell":
        args.cell = Number(val);
        i++;
        break;
      case "--amp":
        args.amp = Number(val);
        i++;
        break;
      case "--levels":
        args.levels = val.split(",").map(Number);
        i++;
        break;
      case "--palette":
        args.palette = val.split(",");
        i++;
        break;
      default:
        throw new Error(`Unknown argument ${key}`);
    }
  }
  if (!args.in || !args.out) {
    throw new Error("Both --in and --out are required");
  }
  if (args.levels.length !== args.palette.length - 1) {
    throw new Error("--levels needs exactly one fewer value than --palette");
  }
  return args;
}

function resolvePalette(names) {
  return names.map((n) => {
    if (PALETTES[n]) return PALETTES[n];
    const m = /^#?([0-9a-f]{6})$/i.exec(n);
    if (!m) throw new Error(`Unknown palette colour ${n}`);
    const hex = m[1];
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  });
}

function ditherPng(buffer, { cell, amp, levels, palette }) {
  const src = PNG.sync.read(buffer);
  const cols = Math.floor(src.width / cell);
  const rows = Math.floor(src.height / cell);
  const out = new PNG({ width: cols * cell, height: rows * cell });
  const colours = resolvePalette(palette);

  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      // average luminance over the cell (box filter keeps edges honest)
      let sum = 0;
      for (let y = 0; y < cell; y++) {
        for (let x = 0; x < cell; x++) {
          const p = ((cy * cell + y) * src.width + (cx * cell + x)) * 4;
          sum += src.data[p] * 0.299 + src.data[p + 1] * 0.587 + src.data[p + 2] * 0.114;
        }
      }
      const lum = sum / (cell * cell) / 255;
      const threshold = (BAYER[(cy & 7) * 8 + (cx & 7)] + 0.5) / 64;
      const v = lum + (threshold - 0.5) * amp;
      let level = levels.length;
      for (let i = 0; i < levels.length; i++) {
        if (v > levels[i]) {
          level = i;
          break;
        }
      }
      const c = colours[level];
      for (let y = 0; y < cell; y++) {
        for (let x = 0; x < cell; x++) {
          const q = ((cy * cell + y) * out.width + (cx * cell + x)) * 4;
          out.data[q] = c[0];
          out.data[q + 1] = c[1];
          out.data[q + 2] = c[2];
          out.data[q + 3] = 255;
        }
      }
    }
  }
  return PNG.sync.write(out);
}

function main() {
  const args = parseArgs(process.argv);
  const inStat = statSync(args.in);
  if (inStat.isFile()) {
    writeFileSync(args.out, ditherPng(readFileSync(args.in), args));
    console.log(`dithered ${args.in} -> ${args.out}`);
    return;
  }
  mkdirSync(args.out, { recursive: true });
  const files = readdirSync(args.in)
    .filter((f) => extname(f).toLowerCase() === ".png")
    .sort();
  if (files.length === 0) throw new Error(`No PNG frames found in ${args.in}`);
  const started = Date.now();
  files.forEach((file, i) => {
    const outPath = join(args.out, basename(file));
    writeFileSync(outPath, ditherPng(readFileSync(join(args.in, file)), args));
    if (i % 30 === 0 || i === files.length - 1) {
      console.log(`${i + 1}/${files.length} ${outPath}`);
    }
  });
  console.log(`done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
}

main();
