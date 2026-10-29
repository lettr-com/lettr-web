# Hero dither pipelines

## One-time setup

```bash
cd tools/dither
pnpm install --ignore-workspace
```

## Hero stills (current homepage)

The homepage hero (`HeroArtStatic.svelte`) is the envelope field from
`src/lib/hero/envelopeField.ts`, dithered offline into still images:

```bash
vp run hero:bake
```

It writes `static/hero/baked/`: one field image per breakpoint at one pixel per
dither cell (3 px cells on desktop, 2 px on mobile), the ragged top edge, and the
designer portrait. The page scales the fields up with
`image-rendering: pixelated`, so they stay a few KB and the dots never blur. Keep
them as palette PNGs: lossy formats smear single-cell dots.

Re-bake after changing the layout, the palette or a sprite in `static/hero/`,
look at the homepage at a desktop and a phone width, and commit the files. The
output is deterministic.

`EnvelopeDither.svelte` renders the same field live on a canvas from the same
module; the homepage no longer mounts it.

## Hero loop (retired)

Turns a rendered envelope loop into the four-colour ordered-dither used by the
earlier `DitherHero.svelte`, the same way Browserbase pre-renders its mountain loop.

`ffmpeg` must be on your PATH for the split and encode steps.

## Pipeline

```bash
# 1. Split the Spline export into frames (1600 wide, even height)
ffmpeg -i envelope-loop.mp4 -vf "scale=1600:-2" frames/f_%04d.png

# 2. Dither every frame into paper / rose / crimson / ink at 3px cells
node dither.mjs --in frames --out dithered --cell 3

# 3. Encode the loop. Keep crf low or the dots smear.
ffmpeg -framerate 30 -i dithered/f_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 \
  -movflags +faststart ../../static/hero/envelope-loop.mp4

# 4. Poster for LCP and for reduced-motion users
ffmpeg -i dithered/f_0001.png -quality 90 ../../static/hero/envelope-poster.webp
```

## Tuning

- `--cell` 2 is finer and closer to Browserbase's poster, 3 reads as pixel art, 4 is chunky.
- `--amp` is the dither strength. 0.3 keeps flat areas clean; 0.45 adds texture everywhere.
- `--levels` are the luminance cuts between palette steps, highest first.
- `--palette` accepts the named brand colours or hex values, e.g. `paper,crimson,ink` for a three-step look.

The browser component `DitherHero.svelte` uses the same Bayer matrix, amplitude
and levels, so the runtime etch trail matches the baked loop.
