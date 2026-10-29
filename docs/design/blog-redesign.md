# Blog redesign: audit, research, image system and design (October 2026)

Status on 2026-10-29: the design was approved and is implemented on branch `feature/blog-redesign` (not yet committed or deployed). See "Implementation status" at the end.

- Paper: file "lettr", page **web · new blog - oct 2026** (index desktop and mobile, article desktop and mobile, contents states, comparison end CTA, image system, internal art picker).
- Prototype renderer: `prototypes/blog-images/` (untracked). `node render.mjs scenes.json out` renders 14 real articles.

## 1. Audit: what to fix

Measured on the live site, 2026-10-29.

| Finding                                                     | Evidence                                                                                                                          | Fix in the design                                                                                                            |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Article body starts below the fold on phones                | 375×812: lead paragraph at **1,032px**, first H2 at 1,979px. Desktop 1440×900: lead at 621px                                      | Compact header. Body starts at ~480px mobile, ~500px desktop                                                                 |
| Body type is too large and grey next to headings            | Body 19px/1.8 in `#1f2937`, H2 26px: a ratio of 1.37. Lead and excerpt are 22px                                                   | Body 17/1.65, H2 28px (1.65 ratio), dek 19px                                                                                 |
| Line length too long                                        | 768px column ≈ 80 characters per line                                                                                             | 680px column ≈ 70 characters                                                                                                 |
| Excerpt and lead say the same thing                         | The header excerpt (3–4 lines at 22px) repeats the `<Lead>` paragraph                                                             | Header uses the existing `metaDescription` as a one- or two-line dek                                                         |
| No article images; every share shows the generic site image | 0 of 30 posts set `coverImage`. `og:image` falls back to `/og-image.png` and so does the `BlogPosting.image` JSON-LD              | Generated cover, OG and thumbnail per post                                                                                   |
| Category is an eyebrow label                                | Uppercase crimson label above the title, against the no-eyebrow rule                                                              | Category moves into the breadcrumb: `Blog / Product`                                                                         |
| Every body link opens a new tab, internal ones too          | `openLinksInNewTab` (`src/lib/utils/blogLinks.ts`)                                                                                | Internal links stay in the same tab, external ones open new. This keeps the session together and makes navigation measurable |
| Paragraphs fade in on scroll                                | `data-reveal` on every `<Paragraph>`/`<Heading>` hides text until GSAP runs                                                       | Remove reveal from prose: reading text should never animate in                                                               |
| JSON code samples are not highlighted                       | `Code.svelte` supports php/js/go/ruby/java/bash only, and posts use `lang="json"`                                                 | Add json/ts/python to the highlighter                                                                                        |
| In-article signup links are not tracked                     | 26 posts link to `app.lettr.com/register` in body copy. `signup_clicked` fires only from nav, hero, pricing and footer components | Track body links by placement (section 7)                                                                                    |
| Index has no images, filters or search                      | Text cards only; 30 posts in one list                                                                                             | Topic filter, search, featured slot, collection, archive                                                                     |

Working well, so keep it: per-post `BlogPosting` and FAQPage JSON-LD, canonical URLs, `postLinks` (glossary and product links per post), RSS feed, sitemap dates from `posts.ts`, the markdown twin for agents, and the TOC scroll-spy logic (it gets a new shell, not a rewrite).

## 2. Analytics (PostHog, Lettr Main, queried 2026-10-29)

Window: the last 90 days (from 2026-07-31), compared with the 90 days before. Host `lettr.com`, paths `/blog/*`. Three caveats apply to every number:

- **Only consenting visitors are counted.** PostHog opts out until the cookie banner is accepted, so EU readers are under-counted. Treat every figure as a lower bound.
- **Bots are removed.** About 104 visitors to the top comparison post used a fixed 1024×768 or 1026×769 viewport on Windows Chrome; the 139 suspect visitors made 5 clicks between them. They are excluded below.
- **Small samples.** Per-article numbers under about 30 views are directional only.

### Audience and traffic

| Metric                            | Last 90 days           | Previous 90 | Note                                                                      |
| --------------------------------- | ---------------------- | ----------- | ------------------------------------------------------------------------- |
| Blog readers (people)             | **683**                | 201         | 3.4×. All lettr.com: 2,538 people                                         |
| Blog pageviews                    | 1,089                  | 328         | About 24% of lettr.com pageviews                                          |
| Sessions that start on an article | **717 of 3,233** (22%) |             | The blog is a front door to the site                                      |
| Weekly readers                    | 30–45 baseline         |             | One spike: 185 in the week of 24 Aug (Laravel post on X and LaravelDaily) |

**Channels** (people, before the bot filter): direct 334 (inflated by the bots above), search 159, social 147 (almost all `t.co`, to the Laravel post), **AI assistants 79** (ChatGPT, via `utm_source=chatgpt.com`), other referrals 48, newsletter 31.

**Devices:** desktop 73%, mobile 26%, tablet 1%. **Viewports:** 1440–1919px is the largest group (214 people, median height 905px). Under 400px comes next (111, median height 728px), then 1280–1439 (110) and 1920+ (94). Design for 1440×900 and 390×730 first.

**Countries:** US 238, then CN 64, SG 40, IN 33, HK 28. The CN, SG and HK traffic may include more automated visits; not checked further. CZ has only 14, but Czech visitors fall under the consent banner.

**Top articles (people, bots excluded):** Why we built Lettr on Laravel (224, mostly from X and newsletters), Best transactional email services (154; 259 before the bot filter), Email attachment size limits (60), Email signature size (35), Mailer Daemon errors (31), How to send bulk email (21), SendGrid alternatives (16). Every other post has fewer than 15. The four newest product posts (MCP, campaigns) have 5–9 each.

### Reading behaviour

|                           | Desktop (365 views) | Mobile (127 views) |
| ------------------------- | ------------------- | ------------------ |
| Median max scroll         | 23%                 | 16%                |
| Left before scrolling 10% | **44%**             | **43%**            |
| Scrolled past 50%         | 35%                 | 30%                |
| Scrolled past 75%         | 27%                 | 20%                |
| Median time on article    | 24 s                | 19 s               |

- **Almost half of article views end inside the header and the first screen.** On a phone, the first 10% of the live MCP article is roughly the header alone. This is consistent with the oversized header, though PostHog can't show cause. It is the strongest data point behind the compact header.
- **Readers who keep going tend to finish.** Bref post: median 85% scroll and 8.5 minutes. Bulk email: 47% pass 75%. Spam guide: median 87%.
- **One article per session.** 778 blog sessions viewed 835 articles (1.07 each). Blog-to-blog clicks: 24 in 21 sessions. The blog index leads to 1.3 articles per session (100 sessions).
- **Where readers go next:** 23.5% of blog sessions visit another lettr.com page, 1% reach the docs, 1.7% reach the app. Inside articles, the most-clicked element is the logo (71 clicks), then Pricing (33), All posts (13), and in-article product links (/smtp-relay/, /email-api/, compare pages: 3–6 each).
- **The table of contents is almost unused:** 6 clicks in 5 sessions across about 370 desktop views where it is visible. Readers who open FAQ questions outnumber them ("What is Lettr?", "Do I need the SDK…?", "Which Mailgun alternative has a free plan?").
- **Signups:** 6 of 660 identifiable blog readers signed up (`user_signed_up`) within 7 days of their first article (0.9%), and 7 at any later time. That is assisted, not caused. Signup clicks tracked on blog pages: 4, all from the nav or footer. The 26 in-article `/register` links are not tracked.

### Session recordings (7 longest of 25 blog recordings from the last 30 days, read as event timelines)

- **The product was found through the footer.** A mobile reader of the Laravel post (LaravelDaily sponsor link) opened the "What is Lettr?" FAQ, read the related Bref post, then used a _footer_ link to reach /email-api/. From there they compared providers in the FAQ and opened /free-email-api/. Nothing in the article offered that path.
- **Finishing leads to a dead end.** A bulk-email reader spent 10 minutes and reached 95% scroll, clicked "All posts", then went straight back to the article.
- **Comparison readers want contact or pricing.** A reader of the comparison post went from the footer to /support/ and clicked hello@lettr.com twice within 30 seconds.
- **Long, quiet reading happens:** a 360px mobile reader of the Mailer Daemon article spent 203 active seconds with no clicks. Answer-seeking readers read and leave satisfied.

### What changes in the design because of this

1. **Header compactness is the top priority**, backed by the 44% early-exit rate. It is already in the design.
2. **A product note after the first section**, plus an end CTA that matches the article type. Readers currently reach product pages through the logo, Pricing and the footer.
3. **Comparison posts end on pricing and compare, not signup.** This applies to the second most-read post, which is also the page ChatGPT sends readers to.
4. **"Start here" becomes "Most read this quarter"** with real data (Laravel, comparison, attachment limits).
5. **The TOC gets smaller, not bigger.** The rail appears on any post with 4+ sections (first limited to 7+ minute posts, relaxed after review); the mobile pill appears after the header and hides while the reader scrolls down. The Substack-style panel is kept as a hover detail, not a feature.
6. **Read-next sits directly after the conclusion,** to catch the readers who finish.
7. **FAQ accordions stay;** readers use them more than the TOC.

### Still not justified

- **A/B tests:** about 230 readers a month. A test of the end CTA (baseline about 1% click) would need tens of thousands of readers per variant. Compare before and after instead.
- **Personalisation:** rules by article type do the job (section 6).

## 3. Competitive research (Mobbin and live sites)

Patterns worth taking, and from whom:

- **Featured post next to a dense list**: [GitHub blog](https://mobbin.com/sites/sections/6001f7e3-be45-45c6-b674-a011beaae38a). One large story, then scannable rows with small thumbnails. Better for 30 posts than a uniform card grid.
- **Monochrome, consistent illustration**: [Linear "Now"](https://mobbin.com/sites/sections/32351256-278b-4627-b807-8e70534c9d39) uses a single treatment for every cover. Consistency, not variety, is what makes it recognisable.
- **A competitor already uses dithered covers**: [Speakeasy](https://mobbin.com/sites/sections/2d40bc76-7554-4fc2-b902-423e54780da0) uses black halftone noise with a tag. Lettr's system has to differ through colour, recognisable objects and a category-coded ground, not texture alone.
- **Title-in-image covers**: [Resend](https://mobbin.com/sites/sections/daa01559-d583-4ca7-b010-2d5f79046c02). This reads well on social but repeats the title on the index. We use it for OG only.
- **Mobile contents control**: [Apple Books "Contents · 0%"](https://mobbin.com/screens/deb26c2b-9819-41c6-8d6a-bb53b14ed2c4) puts a bottom pill with progress that opens the sections. Adopted for mobile.
- **Collapsible inline TOC on mobile**: [Finimize](https://mobbin.com/screens/6aef933a-e3de-4ae3-bd63-c06cdb6e99af). We rejected it as the primary pattern because it pushes the body down; it is the fallback if the pill tests poorly.
- **Sticky right-side TOC with related reads**: [GetYourGuide](https://mobbin.com/screens/1e654ccf-6ad7-4821-8ea6-20b86cd353b8). This needs a wider frame than Lettr's 896px shell, so the TOC goes into the left page margin instead, Substack style.

## 4. Editorial image system

### How it works

One **scene** per post: `{ object, rotate }` stored next to the post's metadata, with the palette derived from the category. A deterministic renderer turns the scene into every variant:

1. Place the object sprite on a cell grid with 4× supersampling, rotated and scaled for the variant.
2. Hard silhouette (cells more than 50% covered), then stretch the object's own luminance range into the palette's object band.
3. Bayer 8×8 ordered dither into a 4–5 step ramp. It is the **same matrix as `EnvelopeDither.svelte`**, so the blog and the homepage hero share one texture.
4. Nearest-neighbour upscale. For OG, add the title layer: satori lays out Zalando Sans SemiExpanded, with a line-balancing pass so titles never end in a widow.

The source is the homepage hero's sprite library in `static/hero/sprites/` (key, check, open envelope, paper plane, stamp, @). These are the objects in the reference image.

Outputs per post (MCP key example):

| File         | Size                     | Use                                                                       |
| ------------ | ------------------------ | ------------------------------------------------------------------------- |
| `cover.png`  | 200×112 grid, **0.6 KB** | Index cards and featured slot. Rendered with `image-rendering: pixelated` |
| `og.png`     | 1200×630, 12 KB          | `og:image`, `twitter:image`, JSON-LD `image`. Includes the title          |
| `square.png` | 1080×1080, 2.5 KB        | Article header visual, square social                                      |
| `thumb.png`  | 48×48 grid, 0.6 KB       | List rows, "Start here", read-next                                        |
| `strip.png`  | 130×32 grid              | Mobile article band                                                       |

Shipping the cell grid and upscaling in CSS keeps covers under 1 KB and avoids resampling moiré. Dithers alias badly when a browser scales a full-size image by a non-integer factor.

### Palettes (tokens only)

The **ground follows the category and the object follows the topic.** This gives the index a readable rhythm and makes the palette carry meaning.

| Category       | Ramp, dark → light                                      | Ground       |
| -------------- | ------------------------------------------------------- | ------------ |
| Product        | plum, plum-raised, primary, primary-outline, background | plum         |
| Deliverability | surface, muted, green, background                       | surface      |
| Engineering    | surface, muted, subtle, border, background              | surface      |
| Fundamentals   | plum-raised, primary, primary-outline, primary-soft     | primary-soft |
| Case study     | surface, subtle, border, white                          | white        |

Two places where I'm pushing back on the brief: **there is no dark-green or light-green token**, so "green on dark green" would invent colours. Green appears only as the object colour on ink, where it means "landed in the inbox". "Mixed red and green" (green on plum) rendered fine but reads as festive; I recommend not using it.

### Architecture decision

|                   | A. Standalone mini-app               | B. Admin route on the site          | C. Generate on publish (CI) | **D. Scene in `posts.ts` + CLI + dev-only preview** |
| ----------------- | ------------------------------------ | ----------------------------------- | --------------------------- | --------------------------------------------------- |
| Ease for writers  | Good                                 | Good                                | Invisible                   | Good: pick in a local page, paste one line          |
| Build effort      | High (auth, hosting, storage)        | Medium (auth on a prerendered site) | Low                         | **Low**                                             |
| Maintenance       | A second app                         | Auth and secrets on a static site   | Low                         | **Low**                                             |
| Abuse risk        | Public endpoint                      | Public endpoint                     | None                        | **None: localhost only**                            |
| Cost per image    | Same                                 | Same                                | Same                        | **$0** (no model at render time)                    |
| Consistency       | Depends                              | Depends                             | High                        | **High: deterministic, reviewable in the PR**       |
| Fits the workflow | No: posts are `.svelte` files in git | Partly                              | Yes                         | **Yes**                                             |

**Recommendation: D.** Posts are already written as code in this repo, mostly with a coding agent, so a hosted tool would add auth, storage and an attack surface to solve a problem the repo already solves. The writer (or the agent) adds `art: { object, rotate }` to `posts.ts`, previews it in a dev-only page that runs the same dither in the browser, and `vp run blog:images` writes `static/blog/<slug>/*` for review in the PR. Images are files: no runtime generation, no effect on page speed.

**Where AI fits:**

- **Choosing the object:** keyword rules first, with an optional Claude Haiku call from the local CLI. One call is about 500 input and 100 output tokens, a fraction of a cent. The key stays in the writer's shell and is never deployed. The coding agent writing the post can also simply choose the object.
- **Growing the library:** an image model generates a new sprite in the existing glossy-clay style, with key.png and envelope-open.png as references. A human removes the background and approves it once, and the sprite is reused forever. This is the only place a model draws. It costs a few cents per object, once.

**Not tested end to end:** generating new sprites. Higgsfield rejects generation on the free plan, and the Figma route would spend Figma AI credits without taking reference images. Six objects across 30 posts already repeat (three planes and three envelopes in the 14 renders), so **the library needs about 15 more objects before launch**: padlock, shield, server, inbox tray, bell, clock, lightning, document, folder, megaphone, mailbox, globe, cursor, chart, webhook/plug.

## 5. Design (Paper)

### Blog index

Compact header (title, one-line intro, search), topic filter with counts, featured post (defaults to the newest) next to **"Most read this quarter"** from PostHog, a 2-column "Latest" grid with dithered covers, a dark **"Reach the inbox, in four reads"** collection ending in a product link, and a dense archive list with thumbnails. It stays inside the 896px site frame.

### Article

- **Header:** breadcrumb with category; H1 44/50 (mobile 30/35); dek from `metaDescription`, 19/29; one-line byline (avatar, name, date, read time); square cover to the right on desktop, a 96px strip on mobile.
- **Body:** 680px column; body Manrope 17/28; H2 Zalando 28/35 (mobile 24/30); H3 Zalando 500 20/27; lead 19/30. The TL;DR becomes a crimson-ruled "In short" block instead of a boxed callout.
- **Contents:** a collapsed rail (one dash per H2, the active one crimson) floats in the left page margin, outside the frame, so it never takes reading width. Hover or focus expands it into a panel with sections, progress and minutes left. A 2px reading-progress line sits under the nav. On mobile, a bottom pill shows the current section and progress and opens the section list.
- **Components shown:** code block with filename and copy, table, docs card, the end-of-article contextual CTA, and "Read next" with glossary links.

## 6. Reader journeys and CTAs

Map each post's intent to one next step, using data that already exists in `postLinks`:

| Post intent                     | Primary next step                | Secondary                     |
| ------------------------------- | -------------------------------- | ----------------------------- |
| Product how-to (MCP, campaigns) | The matching docs page           | Signup                        |
| Deliverability guide            | Next post in the collection      | Deliverability product page   |
| Engineering / API               | Docs quickstart or API reference | Email API page                |
| Comparison / alternatives       | Pricing                          | Compare page; hello@lettr.com |
| Fundamentals                    | Next post in its path            | Newsletter (when one exists)  |

Patterns: an inline docs card where the article already cites docs, one end-of-article contextual CTA, and "Read next" chosen by topic. No popups, no sticky signup bar.

**Personalisation is not justified yet.** At this volume, rules based on the current article's topic and category do the same job without tracking. Revisit at roughly 5,000 readers a month.

## 7. Measurement plan

Extend the existing `capturePosthogEvent` helper. It is consent-gated, so the numbers stay lower bounds.

- `blog_article_viewed` {slug, category, read_minutes}
- `blog_read_progress` {slug, depth: 25|50|75|100}, fired once per depth
- `blog_toc_clicked` {slug, section, surface: rail|panel|mobile_pill}
- `blog_related_clicked` {slug, target_slug, placement}
- `blog_docs_clicked` {slug, href, placement}
- `blog_cta_viewed` / `blog_cta_clicked` {slug, cta, placement}
- In-article signup links reuse `signup_clicked` with `placement: blog_body | blog_end_cta`. No separate `blog_signup_started`, to avoid duplicate tracking.
- `blog_signup_completed` is not a new event. It is a funnel from blog `signup_clicked` to the app's registration event, with a 7-day window, and is reported as "assisted", never as caused.

Dashboard: blog visitors, top posts, reads reaching 75%, internal navigation, docs referrals, the blog → signup funnel, and a breakdown by device and by channel. Every insight excludes the 1024×768 and 1026×769 bot viewports. Before launch, record a baseline from the section 2 numbers so the redesign can be compared before and after.

## 8. Implementation plan (after approval)

1. **Image pipeline:** move `prototypes/blog-images` to `tools/blog-images`, add `art` to `PostMeta`, render all 30 posts, and wire `coverImage` and OG into `BlogPost.svelte`, `Seo.svelte` and the JSON-LD.
2. **Article template:** new header, type scale, prose components, contents rail and mobile pill, same-tab internal links, no prose reveal, json highlighting.
3. **Index:** filter, search (client-side over `posts.ts`), featured, collection, archive.
4. **CTAs and read-next:** driven by `postLinks` plus a `next` field per post.
5. **Instrumentation and dashboard.**
6. **Validation:** `vp check`, `vp test`, `vp build`; OG previews checked with the X, LinkedIn and Slack validators; mobile and desktop screenshots.

## Decisions needed

1. Approve the Paper direction for the index and the article, or mark what to change.
2. Approve architecture D (scene in `posts.ts` + CLI + dev-only preview) over a hosted mini-app.
3. Approve category → palette, including no mixed red/green.
4. Choose how to grow the object library: a paid image-model plan, an OpenAI key in the local CLI, or a designer drawing about 15 sprites.

## Implementation status (2026-10-29)

Built on `feature/blog-redesign`:

- **Art pipeline:** `tools/blog-images/render.mjs` reads `art` from `posts.ts` and the palettes from `src/lib/blog/art.ts`. It writes `static/blog/<slug>/{cover,square,thumb,strip,og}.png` for all 30 posts (about 870 KB in total). Run it with `vp run blog:images -- <slug>`. A unit test fails when a post is missing art or images.
- **SEO:** `og:image`, `twitter:image` and `BlogPosting.image` use the post's OG image, and `og:image:alt` and `twitter:image:alt` are set. The SEO gate passes on 246 pages.
- **Article:** compact header (breadcrumb with category, dek from `metaDescription`, one-line byline, square art on desktop, strip on mobile); the new type scale; no fade-in on prose; TypeScript and JSON highlighting with a copy button; same-tab internal links. `<ProductNote />` sits before each post's second section; the end block is pricing/compare for comparison posts and the product otherwise; "Read next" is followed by glossary links.
- **Contents:** rail plus hover/focus panel on desktop, and a pill plus section list on mobile, on any post with 4+ sections. Reading progress fills down the rail's edge on desktop and runs along the bottom of the screen on mobile, clear of the navbar's sales strip.
- **Index:** topic filter (also `?topic=`), search (`/` focuses it), newest post featured, "Most read this quarter" (`src/lib/blog/collections.ts`), Latest grid, the deliverability reading path, archive.
- **Events:** `blog_article_viewed`, `blog_read_progress`, `blog_toc_clicked`, `blog_related_clicked`, `blog_docs_clicked`, `blog_cta_viewed`, `blog_cta_clicked`, plus `signup_clicked` with a `blog_*` placement (`src/lib/analytics/blog.ts`).

Not done:

- **PostHog dashboard:** the saved key lacks dashboard and insight write access (403). The dashboard definition (nine HogQL insights, bots excluded) is ready to create once the key has those scopes.
- **Events not verified live:** they were not checked end to end in PostHog, because that needs accepted cookies in a browser. The link classification and read-depth logic are unit-tested.
- **Dev-only art preview page:** not built. The CLI renders one post in about 1.5 seconds, which covers the need for now.
- **Object library:** still the six hero sprites; about 15 more are needed to stop repetition.
