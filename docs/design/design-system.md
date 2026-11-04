# Lettr design system: typography, spacing and components

The tokens live in [`src/styles/app.css`](../../src/styles/app.css). Run `vp dev` and open `/design-system/` for the live specimen; that page is dev-only (see "Playground" below). This file records the rules and the reasons for them. If it disagrees with `app.css`, the CSS wins, so fix this file.

## Typography

### Roles

Every heading uses one role utility. The role sets family, weight (always 400), size, line height and tracking, with one step at `md` (768px). A bare `h1`–`h6` gets the role of the same level from `@layer base`. To make a heading look like another level, keep the semantic tag and add the role class (`<h3 class="type-h1">` in the footer CTA, `<h2 class="type-h3">` for "Compare plans").

| Role           | Mobile → desktop            | Line height | Tracking | Use                                                                                                |
| -------------- | --------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------- |
| `type-display` | `clamp(32px, 10.2vw, 56px)` | 1.15        | −0.025em | Marketing hero h1: homepage, pricing, Laravel, product landing pages                               |
| `type-h1`      | 32 → 44px                   | 1.17 → 1.14 | −0.025em | Title of a reading or utility page: blog post and index, changelog, legal, about, compare, support |
| `type-h2`      | 30 → 42px                   | 1.27 → 1.19 | −0.02em  | Section heading. The live homepage's 42px heading                                                  |
| `type-h3`      | 24 → 28px                   | 1.25        | −0.015em | Subsection, article section heading, large card or panel title                                     |
| `type-h4`      | 20 → 22px                   | 1.35        | −0.01em  | Card title, list group heading, article subheading                                                 |
| `type-h5`      | 18px                        | 1.4         | 0        | Small block heading, link-list heading                                                             |
| `type-h6`      | 16px                        | 1.4         | 0        | Compact heading; wrappers around accordion triggers that style their own text                      |

Body and UI text use single-size tokens: `type-lead` (17 → 19px / 1.6, intro paragraph), `text-body` (19px / 1.6, page default), `text-prose` (17px / 1.65, article paragraphs), `text-base` (16px), `text-body-sm` (15px / 1.55), `text-sm` (14px), `text-caption` (13px / 1.45), `text-xs` (12px). `type-label` is the small uppercase label (12px, 600, `tracking-label` = 0.12em) for table heads and tags.

Single-property utilities still override a role (`leading-none`, `text-white`, `text-balance`). Do that for a reason you could explain, not to tune one heading.

### Typefaces

- **Zalando Sans SemiExpanded** (`font-heading`): headings and display, weight 400 only. The roles enforce this; do not add `font-medium`/`font-semibold` to Zalando text.
- **Manrope** (`font-body`): body and interface. 600–700 for emphasis and buttons.
- **DM Mono** (`font-code`): code, terminals, tabular numbers.
- **Redaction** (`font-serif`): the smooth editorial accent, always italic.
- **Redaction 20** (`font-pixel`): the only pixelated Redaction cut. Cuts 10, 35, 50, 70 and 100 are not loaded and must not be added. Use it for one accent per view at most (Framework section, Laravel hero, footer CTA).

### The accent

`type-accent` (Redaction italic) and `type-accent-pixel` (Redaction 20 italic) size themselves from the heading they sit in: 1.1× in h1–h6, 1.15× inside `type-display` (the display role sets `--accent-scale`). An accent therefore never carries its own font size. Start a pink accent phrase on its own line (`block`), as the homepage does.

### Illustrations are exempt

Product UI drawn in Svelte (editor previews, branded emails, the version-history widget, pricing slider UI) is drawn at object scale and keeps its own small sizes (8–13px). Those regions are marked `data-markdown="skip"` or live in illustration components. Do not "fix" them to the text scale.

## Spacing and layout

- Tailwind's 4px unit stays. Layout uses even steps (the 8px grid): 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 128. Compact UI and optical fixes may use 4px steps. No odd or off-grid values (18, 22, 26, 30px) outside illustrations.
- Section padding: `section-y` (56 → 96px) is the default; `section-y-sm` (40 → 64px) for strips; `section-y-lg` (64 → 128px) for editorial sections. The Laravel page keeps its own 120/136px tops, which are on the 8px grid.
- `stack-section`: the gap between a section's heading block and its content (40 → 56px).
- Containers: `max-w-page` 1200 (the frame), `max-w-wide` 1100, `max-w-content` 820 (centred hero), `max-w-measure` 640 (lead paragraphs), `max-w-article` 550 (article body). Page gutter `px-gutter` 24px.
- Elevation: flat by default; `shadow-panel`, `shadow-float`, `shadow-offset` are the three shadows the site uses.

## Buttons

One component, [`Button.svelte`](../../src/lib/components/Button.svelte), for every marketing action, with three sizes:

| Size | Height    | Text           | Use                                                               |
| ---- | --------- | -------------- | ----------------------------------------------------------------- |
| `lg` | 68 → 76px | 18 → 20px bold | Hero and section CTAs, closing CTAs, the footer                   |
| `md` | 48px      | 16px bold      | Inside cards and forms: pricing plans, Topol bundle, support chat |
| `sm` | 36px      | 14px semibold  | Navigation, blog end card, compact rows                           |

The brief asked for two sizes (large from the hero, small from the navbar). Two do not cover pricing cards and form submits: a 76px full-width button inside a 380px plan card is heavier than the price, and a 36px one undersells the purchase. `md` exists for those two contexts only.

Variants: `primary`, `secondary` (white on blush), `outline` (white surfaces), `ink` (neutral dark), `green` (marketing pricing), `ghost` (dark surfaces). Every size and variant shares a 2px hover lift, an ink focus-visible outline (white on `ghost`), `disabled` (50% opacity, no pointer) and `loading` (square spinner, label kept for width). Heights are fixed, so an icon or spinner never changes the size.

[`ui/button`](../../src/lib/components/ui/button/button.svelte) stays as the form-control button for the booking flow (select triggers, time slots). It is not for marketing actions.

## Playground

`src/routes/design-system/` renders every role, family, colour, spacing step, button state, badge, card surface and code block, plus a section and a plan card in context. Its `+page.ts` sets `prerender = false` and throws a 404 outside `dev`, so the page is not in the build, the sitemap or the agents' Markdown, and a client-side visit on the live site shows the 404 page.

## Audit, 4 November 2026

What the overhaul found before it changed anything:

- **Headings:** seven h1 sizes (30, 40, 40/46, 44, 56, 60, 64px) and section h2s at 26, 28, 36, 40 and 42px. The newer pages (homepage, Laravel) repeated one 42px recipe as a 90-character class string in 15 places; the older pages used the base h2 at 26px, so their section headings were smaller than some card titles elsewhere. On the older landing pages the 40px hero h1 also sat close to the section headings, so the hierarchy was flat.
- **Sizes:** 56 distinct literal font sizes across 516 uses, and 29 letter-spacing variants (eyebrow tracking alone ranged 0.12–0.28em).
- **Weights:** 60 headings set Zalando to 500–700 against the "always Regular" rule.
- **Redaction:** three cuts loaded (smooth, 35, 50); the pixel cuts were used once each, at unrelated sizes.
- **Buttons:** `Button.svelte` (whose default size inherited the 19px body size), `ui/button`, a hand-built navbar CTA, a hand-built footer CTA and about a dozen hand-rolled page CTAs (`px-7 py-3 text-[15px]`), most without a focus style.
- **Spacing:** legacy sections at `py-20`, homepage sections at `py-14 md:py-24`, Laravel at `py-16 md:pt-[136px]`; off-grid 18/22/26px paddings in FAQ rows and Laravel cards.
- **Responsive:** the homepage scrolled sideways at 768px (the orbit hero's globe ran past the frame); 40px h1s did not scale down on phones.

## Open decisions

- **Eyebrows:** the older landing and platform pages still have small "— SMTP RELAY" labels above headings. The owner's rule is no eyebrows; removing them changes those pages' content, so it waits for a decision. Their tracking is unified (`tracking-label`) meanwhile.
- **Pricing components on the open slider work** (`PricingSlider`, `MarketingPricing`, `ModeTabs`, `TransactionalPricing`, `VolumeCard`) were left untouched to avoid conflicts. Move them onto the roles after that work merges; its `GetStartedButton` call sites need `size="lg"` instead of `"hero"`.
- **Cookie banner** buttons keep their own neutral outline style.
