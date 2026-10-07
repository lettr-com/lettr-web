# SEO gate

A check that reads the built site and stops an SEO regression before it ships. It is phase 0 of the SEO and GEO upgrade: the safety net the later phases (redirects, new titles, new page types) lean on.

```bash
pnpm build
pnpm seo:check                       # fails on anything that is not already known
node src/lib/seo/gate/check.ts --strict         # fails on every issue
node src/lib/seo/gate/check.ts --update-known   # record today's issues, drop fixed ones
node src/lib/seo/gate/check.ts --write-baseline # re-snapshot the built site as the baseline
```

Rules and command live in `src/lib/seo/gate/` (rules tested in `gate.test.ts`); the command is `src/lib/seo/gate/check.ts`.

## The three data files

- `baseline.json`: every page of the deployed site on 2026-10-07 (242 pages: the 240 in the sitemap plus the `/book/` redirect and the old terms version), with its title, H1, canonical and structured-data types. Each of these URLs must be built or redirected, forever.
- `terraform/redirects.json`: old path to new path, both lowercase with trailing slashes. Empty today. Terraform inlines it into the CloudFront function (`terraform/cloudfront/viewer-request.js`), which answers each entry with a 301; the gate reads the same file, so the map and the check cannot drift.
- `known-issues.json`: the ratchet. Today's problems, by rule and URL. A new problem fails the gate. A problem that was fixed has to be removed from this file (`--update-known`), so it cannot quietly return. The file should only ever get shorter.

## What it checks

| Rule                                                                                                    | Fails when                                                                                                                                |
| ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `baseline-url-lost`                                                                                     | a baseline URL is neither built nor in `redirects.json` (always fails)                                                                    |
| `structured-data-lost`                                                                                  | a page no longer carries a schema.org type it had in the baseline (always fails)                                                          |
| `noindex-added`                                                                                         | a page gains `noindex` (always fails)                                                                                                     |
| `sitemap-url-without-page`, `redirect-target-missing`, `redirect-chain`, `redirect-stub-target-missing` | the sitemap or a redirect points nowhere (always fails)                                                                                   |
| `title-missing` / `-short` (<30) / `-long` (>60) / `title-duplicate`                                    | title is absent, outside 30 to 60 characters, or shared by two pages                                                                      |
| `description-missing` / `description-long`                                                              | no meta description, or over 160 characters                                                                                               |
| `canonical-missing` / `canonical-not-self`                                                              | no canonical, or not `https://lettr.com` + the page's own path with a trailing slash                                                      |
| `h1-count`                                                                                              | the page does not have exactly one H1                                                                                                     |
| `heading-in-mockup`, `heading-widget-glyph`                                                             | a heading comes from a UI mockup (inside `aria-hidden` or `data-markdown="skip"`), or ends in an accordion `+` or `−`                     |
| `internal-link-without-slash`, `internal-link-broken`                                                   | an on-site link lacks the trailing slash or points at a page that does not exist                                                          |
| `json-ld-invalid`                                                                                       | a JSON-LD block does not parse                                                                                                            |
| `nav-links-missing`                                                                                     | the server-rendered header lacks the product links (home page only)                                                                       |
| `glossary-term-without-product-link`, `glossary-term-without-post-link`                                 | a glossary term does not link, from its own body, to a product page and to a blog post                                                    |
| `blog-post-without-glossary-links`, `blog-post-without-product-link`                                    | a blog post links fewer than two glossary terms, or no product page, from its own body                                                    |
| `product-page-without-docs-link`, `product-page-without-compare-link`                                   | one of the five core product pages has no link into the docs or to a comparison page                                                      |
| `page-missing-from-sitemap`, `sitemap-url-without-slash`                                                | the sitemap and the built pages disagree                                                                                                  |
| `site-file-missing`, `sitemap-lastmod-invalid`                                                          | `sitemap.xml`, `robots.txt`, `llms.txt`, `favicon.ico` or `blog/feed.xml` is not in the build, or a sitemap date is not a real YYYY-MM-DD |
| `llms-txt-link-without-slash`, `llms-txt-link-broken`                                                   | a link in `llms.txt` lacks the slash or is dead                                                                                           |
| `robots-txt`                                                                                            | `robots.txt` is missing, has no Sitemap line, or disallows everything                                                                     |

Redirect stubs (a page that is only a meta refresh, like `/book/`) are held to the redirect rules, not the page rules.

## Not covered

The report's launch gate also asks to keep the PostHog events on the signup buttons. That is click behaviour, so the gate cannot see it; check it by hand in the browser before launch.
