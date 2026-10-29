# Blog art

Renders every blog post's cover, thumbnail, mobile strip and Open Graph image
from the `art` scene in `src/lib/data/posts.ts`. The output lands in
`static/blog/<slug>/` and is committed with the post.

## One-time setup

```bash
cd tools/blog-images
pnpm install --ignore-workspace
```

## Adding art to a new post

1. Give the post an `art` entry in `posts.ts`: one object from `blogObjects` in
   `src/lib/blog/art.ts` and a tilt between about -25 and 25 degrees. Pick the
   object for the post's subject (a key for API keys, a check for checklists).
   The category already decides the colours.
2. Render it:

   ```bash
   vp run blog:images -- <slug>
   ```

   Leave out the slug to re-render every post (about 45 seconds).

3. Look at `static/blog/<slug>/og.png` and `cover.png`, then commit them.

## How it works

The sprite (the hero's six in `static/hero/sprites/`, blog-only ones in
`tools/blog-images/sprites/`) is placed on a cell grid, its shading is
stretched into the category's palette (tokens from `app.css` only), and the grid
is ordered-dithered with the same Bayer 8x8 matrix as the homepage hero
(`EnvelopeDither.svelte`). Grid images stay at one pixel per cell and the site
scales them with `image-rendering: pixelated`, so a cover is under 1 KB. The OG
image adds the title in Zalando Sans SemiExpanded, with balanced line breaks.

The output is deterministic: the same scene renders the same bytes.

## Adding an object

Draw it with an image model, in the library's style, using two existing sprites
as references:

```bash
node tools/blog-images/new-object.mjs padlock "closed padlock with a rounded shackle"
```

The OpenAI key comes from `OPENAI_API_KEY` or `~/.config/openai-key`. The script
writes `tools/blog-images/sprites/<name>.png` (384x384, object about 330px on its
longest side, like the others) and keeps the untouched model output in
`tools/blog-images/raw/` (git-ignored), so the sprite can be re-processed for
free; set `REGENERATE=1` to draw it again.

Then, in `src/lib/blog/art.ts`, add the name to `blogObjects`, give it a hover
motion in `objectMotion` and an alt-text name in `objectNames`. Look at the
sprite before using it: reject anything off-style, with a shadow, or with more
than one object. A new sprite is a one-time cost; nothing is generated per post.
