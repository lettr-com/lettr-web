# Homepage section critique log

This is the place for the owner's upcoming section-by-section observations about `redesign/homepage-2026`. It is page-specific evidence, not a universal rulebook. The live order is in [`src/routes/+page.svelte`](../../src/routes/+page.svelte); section contents remain in their components. Add dated notes under the matching section, preserving the owner's words where possible. If a later review changes an earlier judgment, append the revision rather than erasing the reasoning.

For each observation, capture: **what the section is trying to communicate; what feels wrong; what should be remembered; what may be removed, combined, or hidden; useful visual/interaction idea; evidence or reference; status**. It is fine to leave fields unknown until the owner supplies them. Do not infer critique merely from the existence of a component.

## Current section map

| Order | Component                                                                    | Intended subject from current code                                   | Owner observations                |
| ----- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------- |
| 1     | [`HomeHero.svelte`](../../src/lib/components/home/HomeHero.svelte)           | SaaS category, unified email promise, signup CTA, dithered envelopes | Hero CTAs should be much larger   |
| 2     | [`ProofStrip.svelte`](../../src/lib/components/home/ProofStrip.svelte)       | Credibility statistics                                               | Text too long; revised 2026-09-21 |
| 3     | [`TwoProducts.svelte`](../../src/lib/components/home/TwoProducts.svelte)     | Transactional and marketing in one platform                          | One mode at a time; simplify UI   |
| 4     | [`DeveloperPath.svelte`](../../src/lib/components/home/DeveloperPath.svelte) | Developer integration and sending path                               | Visual cards and shorter text     |
| 5     | [`TeamFeatures.svelte`](../../src/lib/components/TeamFeatures.svelte)        | Visual editor and template/team workflow                             | Focus on one or two features      |
| 6     | [`UseCasesInbox.svelte`](../../src/lib/components/home/UseCasesInbox.svelte) | SaaS lifecycle email examples                                        | Remove numbered section label     |
| 7     | [`CampaignsBand.svelte`](../../src/lib/components/home/CampaignsBand.svelte) | Campaigns and audiences                                              | Remove numbered section label     |
| 8     | [`PricingSlider.svelte`](../../src/lib/components/home/PricingSlider.svelte) | Sending-volume pricing and two product paths                         | Remove numbered section label     |
| 9     | [`TalkToExpert.svelte`](../../src/lib/components/TalkToExpert.svelte)        | Consultation path                                                    | Pending                           |
| 10    | [`FAQSection.svelte`](../../src/lib/components/FAQSection.svelte)            | Objection handling and product details                               | Pending                           |

The global navbar, footer, and Spline footer are in [`src/routes/+layout.svelte`](../../src/routes/+layout.svelte); add a separate dated note below if the owner critiques them.

## Agent baseline — 2026-09-21

These are initial observations from the branch code and rendered desktop view, separate from the owner's critique.

### Hero

- **Intended job:** identify Lettr as SaaS email, connect API sending to campaign creation, and drive signup.
- **Current focal point:** the headline is clear and large. The dithered envelope scene is expressive but represents email in general; it does not yet show the key relationship between transactional and marketing, or developers and teammates.
- **Possible hierarchy issue:** the announcement, explanatory paragraph, two CTAs, three trust details, and the adjacent proof strip ask for attention before the central product mechanism is shown. The visual does not resolve the sentence above it.
- **Potential simplification to test:** keep the category and one primary action; move secondary trust detail into the next section; make a product moment or interaction prove “one platform” rather than repeating it in copy. Preserve the dither treatment only if it advances that story.
- **Status:** awaiting owner critique before choosing a direction or implementing.

### ProofStrip claim resolved

The original [`ProofStrip.svelte`](../../src/lib/components/home/ProofStrip.svelte) labeled a counter “Live” and “emails delivered in the last 7 days,” but its own code called the base count a placeholder and incremented it by a hard-coded rate. The 2026-09-21 revision removed that counter rather than presenting it as a measured fact.

## Owner observations

### 2026-09-21 — ProofStrip

- **Owner observation:** “these texts are too long,” on the caption under `40,000+`; the same concern applies to the statistic captions in this strip.
- **Response:** shortened the proof to three numbers with one short caption each, removed the redundant logo row and repeated EU copy, and removed the placeholder live counter.
- **Status:** implemented on `redesign/homepage-2026`; desktop visual review completed. Narrow-width review remains to do.

<!-- Add further dated owner observations here. Keep observations distinct from proposed solutions. -->

### 2026-09-21 — Hero actions

- **Owner observation:** “these buttons could be comically larger,” referring to Start sending and See docs.
- **Intent:** Make the two actions a conspicuous part of the hero hierarchy.
- **Response:** Added a hero-specific size to the shared Button component; the desktop actions are now substantially wider and taller.
- **Status:** implemented; ready for owner visual review.

### 2026-09-21 — Devs and teams

- **Owner observations:** The simultaneous developer code and marketing editor are cluttered. Show only Devs or Teams at a time. The editor graphic should be simpler. The `01 / 05` label and the sentence below the two panels are clutter.
- **Owner reference:** [Paper Devs/Teams prototype](https://app.paper.design/file/01M261SA1VXSPRXX5BJ6HQQPRF/1-0/376-0). It shows a wide two-state switch, pink active underline, and one large centered visual per state. Its terminal and editor are placeholders, not detailed product UI.
- **Owner request:** Animate installation and integration in a terminal, beginning with `composer require lettr/lettr-laravel`.
- **Claim check:** The old supporting sentence asserted one shared sending reputation. The repo's launch material advises separate sending domains for campaigns; remove the claim. The current blog and changelog use `php artisan lettr:init`, while the existing homepage terminal used `lettr:install`.
- **Response:** Replaced the simultaneous panels with the Paper-style Devs/Teams switch. The developer state has a staged Laravel command sequence and queued-mail example. The team state is one cropped editor moment. Removed the numbered label, long introduction, and inaccurate supporting sentence.
- **Follow-up observation:** The developer visual should look like a real macOS terminal, with text appearing in a typewriter sequence. The earlier CSS animation could finish before the terminal entered view.
- **Follow-up response:** Added macOS window controls and a zsh-style prompt; type the repo-supported install, initialization, and Laravel mail example when the panel enters view. Keep the complete transcript for reduced-motion visitors.
- **Later owner correction:** The pink strip in the Paper prototype indicates time until the mode switches; it is a loading/progress bar, not an active-tab border. The Teams editor can be slightly more detailed than the first simplification.
- **Later response:** The strip now fills under the active mode before automatically switching. Manual selection resets it; keyboard focus, offscreen state, and reduced motion pause or prevent unwanted switching. The compact Teams preview now shows a small block palette, draft/preview chrome, and a selected CTA on the email canvas.
- **Owner follow-up:** The terminal and editor should meet the bottom edge of their visual stage, with no bottom padding. Add a circular Lettr-primary glow behind the terminal.
- **Response:** Bottom-aligned both visuals, removed the stage's bottom padding, and placed a token-driven radial glow behind the terminal.
- **Owner correction:** Both modes must occupy the same height so the page does not jump when the timer or tabs switch. The editor should crop at the stage edge, have no shadow, and never overflow the panel. The primary glow should be much stronger and originate below the terminal.
- **Response:** Set a shared fixed stage height at all widths. The terminal meets its bottom edge; the editor starts below the top inset and is clipped by the stage. Removed its offset shadow and moved the stronger token-driven radial glow below the stage.
- **Owner follow-up:** Use a dark theme for the entire terminal, including the title bar.
- **Response:** Replaced the light title bar with Lettr's muted dark surface, a light title, and a subtle light divider.
- **Status:** implemented; ready for owner visual review.

### 2026-09-21 — Developer path

- **Owner observations:** Put “Forget” on a new line. Remove the `02 / 05` label. This section is mostly text and needs large visual feature treatments, similar in principle to the Butter cards viewed on Mobbin, with shorter copy. Framework buttons and terminal code should either align in width or be recomposed so their widths do not have to align.
- **Message to retain:** Integration is quick; sending infrastructure and visibility are handled after setup.
- **Response:** Forced the requested heading break. Replaced the framework strip, narrow terminal, and six text cards with four large visual stories for sending, domain setup, events, and logs. The install sequence moved to the preceding Devs pane, eliminating the width mismatch.
- **Later owner correction:** The dark section's light cards and dark inset graphics created an unwanted light/dark sandwich. All four cards and their graphics now stay within Lettr's dark surfaces.
- **Status:** implemented; ready for owner visual review.

### 2026-09-22 — Developer accordion card

- **Owner observation:** The “Clean REST API + SMPT” row should behave as a card within a larger accordion. It needs hover and open states; clicking the card expands it to reveal short text and an image, and clicking the header again closes it.
- **Message to retain:** Developers can send through REST API or SMTP.
- **Response:** Designed the hover and open states beside each other in the Paper homepage file. Hover uses a blush fill, pink edge, and expand indicator. Open keeps the header as the close target, adds concise copy and an API/SMTP illustration, and pushes the following rows down. Corrected the title to “SMTP” in the source design and state board.
- **Status:** Paper state design complete; interactive implementation remains to be done.

### 2026-09-21 — Team features

- **Owner observations:** Six features compete. Focus on one or two. Several illustrative graphics use colors outside Lettr's brand palette.
- **Message to retain:** A teammate can change an email without a developer ticket.
- **Response:** Replaced the six-feature selector and complex mock editor with one visual email example and a working EN/DE language switch, using the existing Lettr palette.
- **Later owner correction:** The section repeated the Devs/Teams message and did not make the editor's capabilities clear. Focus on the editor itself; retain a little more believable editor detail.
- **Directions considered:** (1) A static close-up of one selected block would make editing legible but hide localization. (2) A full editor stage with Build and Translate states shows two capabilities in one readable workspace; **chosen**. (3) A before/after email comparison would show the result but not the editor that makes it possible.
- **Later response:** The section now has one large workspace. Build highlights selectable content blocks; Translate changes the same email between English and German. The short state-specific line beneath it explains the action. The redundant “no dev tickets” framing is removed here because the Devs/Teams section already makes that point.
- **Status:** implemented; ready for owner visual review.

### 2026-09-21 — Repeated section labels

- **Owner observations:** `03 / 05 What SaaS actually sends`, `04 / 05 Campaigns`, and `05 / 05 Pricing` are clutter, as are `01 / 05` and `02 / 05`. Remove this numbered eyebrow pattern from the homepage. This is a page-specific judgment; it does not prohibit every section label in other contexts.
- **Response:** Removed all five numbered labels and the now-unused label component.
- **Status:** implemented; ready for owner visual review.

## Concept exploration — 2026-09-21

Three distinct ways to tell the developer/team story were considered before implementation:

1. **Two simultaneous workspaces.** A large API workspace beside a large visual editor, with short copy. The relationship is immediately visible, but both compete and still require two readable UI scenes. This conflicts with the owner's one-at-a-time critique.
2. **One active stage.** A wide Devs/Teams switch controls a single large visual: a real installation sequence for Devs, a deliberately cropped email-editing moment for Teams. The headline states the relationship; interaction reveals each side. On mobile the same two controls stack above the visual. **Chosen** because it follows the owner's Paper prototype and gives each mode a clear focal point.
3. **Scroll handoff.** A developer command animates into a finished email that a teammate edits as the user scrolls. It could make continuity memorable, but adds a complex scroll dependency and is harder to understand or control on touch/reduced motion.

The first developer feature concept was **three large visual stories** (send, authenticate, inspect) with minimal copy. A six-card inventory would preserve too much density; a single carousel would hide important facts and duplicate the Devs/Teams interaction. The section should use large, legible illustrations of real workflows, not tiny dashboard screenshots. This concept was revised after the owner's Butter-card endorsement below. For team features, favor one main visual editor story and one multilingual/synced-content proof, in Lettr's existing palette.

### 2026-09-21 — Owner endorsement of Butter cards

- **Owner observation:** “I love this. We need to create and use more cards like this but in Lettr design. Large, lots of space, graphic per each heading, individual features/points really get to stand out this way.” The supplied screenshot is the [Butter feature-card section](https://mobbin.com/sites/sections/3e1db400-2e9f-477c-bdc7-f9209d245ca5).
- **Principle to retain:** Each independent point gets a spacious card with a short heading, one dominant explanatory graphic, and minimal support copy. This is a specific preference for Lettr feature storytelling, not permission to fill every section with cards.
- **Directions considered:** (1) widen the existing alternating developer bands; they would still read as rows rather than individual feature canvases. (2) build a two-column system of large linked feature cards and use it selectively; **chosen** for its close fit to the owner's reference and the ability to give each point room. (3) show one oversized feature at a time in a carousel; it would hide too many useful facts and repeat the Devs/Teams switch.
- **Response:** Added a reusable large feature card pattern with Lettr typography, background/white surfaces, pink accents, square corners, and an individual graphic. Applied it to the developer capabilities and replaced the Campaigns section's four compact text cards with two large stories: audiences and campaign volume. Kept the team editor and inbox sections in their different layouts to preserve pacing.
- **Status:** implemented; ready for owner visual review.
