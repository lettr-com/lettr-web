# Hero loop dither pipeline

Turns a rendered envelope loop into the four-colour ordered-dither used by the
homepage hero, the same way Browserbase pre-renders its mountain loop.

## One-time setup

```bash
cd tools/dither
pnpm install
```

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
