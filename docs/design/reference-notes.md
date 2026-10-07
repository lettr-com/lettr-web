# Design reference notes

Keep only references that solve a relevant design problem. This file is a research log, not a library of styles to copy.

For each reference, record:

- **Source/link or screenshot path; date viewed; screen and interaction state.** For private tools, provide a stable reference or local artifact teammates can access, or describe the observed state precisely.
- **Design problem searched:** e.g. two product modes, developer/API proof, progressive disclosure, unified data, typography, motion, or complex feature simplification.
- **What works and why:** identify the hierarchy, pacing, composition, interaction, or storytelling mechanism.
- **Borrow:** the principle or mechanism that might solve Lettr's problem.
- **Do not borrow:** colors, type, brand motifs, claims, UI details, or patterns that conflict with Lettr.
- **Lettr translation:** a concrete use of Lettr's tokens, square geometry, product UI, and message.
- **Limits:** what is uncertain from a screenshot alone, including mobile behavior and interaction.

Search across fintech, developer tools, productivity, infrastructure, and creative products when they solve the same design problem. Prefer one strong direction with clearly chosen supporting references over an average of several unrelated styles. Do not claim a source was researched unless it was actually opened and examined.

## 2026-09-21 — unified platform and two-workflow exploration

These Mobbin section previews were examined while diagnosing the `redesign/homepage-2026` hero. They are static previews, so responsive and interactive behavior remains unverified. Refero was not available in this session.

- [Retool — “All the ways you work, in one place”](https://mobbin.com/sites/sections/dcbd55be-58cb-4e0e-9b70-cb4d184fa30a): The short category-level statement leads; an overlapping product composition below implies several operations converging into one surface. Borrow the **single surface as proof of unification**. Do not borrow its dark palette, small UI density, or exact panel treatment. Lettr could show one readable email/content object passing between API and campaign contexts in its blush, pink, ink, and square geometry.
- [Anchor — developer hero](https://mobbin.com/sites/sections/d99917c8-d6a4-42f2-92ce-00e32442c35c): The code panel provides immediate developer credibility; the surrounding forms make code feel embedded in a larger product. Borrow the **code-to-product relationship**, not the floating pastel tiles or rounded panel. For Lettr, a compact real API example could lead into a legible editor or sent-message state.
- [Customer.io — paired workflows](https://mobbin.com/sites/sections/d311cace-b1e5-4a47-8555-fd57684f0761): A section pairs distinct capabilities beneath one framing headline. Borrow the **clear two-part comparison only if the hero needs both modes at once**; avoid duplicating its card layout or tiny UI diagrams. A toggle or sequence may better suit Lettr's preference for one focal point.

## 2026-09-21 — homepage section redesign

- [Owner's Paper Devs/Teams prototype](https://app.paper.design/file/01M261SA1VXSPRXX5BJ6HQQPRF/1-0/376-0): Examined both 900×391 mode frames. The main idea is a full-width two-state switch with a pink active underline and one large centered product visual below. The terminal and editor are explicitly placeholders, so the useful borrowing is **one active mode and one focal visual**, not those placeholders or their exact dimensions. Lettr translates this into a Laravel installation sequence and a cropped visual editing moment. Mobile behavior was not represented in the Paper file.
- [Butter — large paired feature cards](https://mobbin.com/sites/sections/3e1db400-2e9f-477c-bdc7-f9209d245ca5): The two cards each have one short headline, one dominant product visual, and small supporting copy at the base. Each card communicates one capability without a feature inventory. The owner supplied a larger screenshot and explicitly endorsed the **large visual per idea, generous space, and concise copy** for more Lettr feature points. Do not borrow Butter's rounded card geometry, gray palette, effects, or its product images. Lettr uses square geometry, ink/pink surfaces, and simplified API, domain, event, audience, and campaign illustrations. The Mobbin preview is static; interaction and responsive behavior were not verified.

## 2026-09-21 — presenting the email editor

The owner asked for a clearer editor story and pointed to [Refero Styles](https://styles.refero.design/). The style pages below were opened and visually inspected alongside their descriptions. They summarize source sites and their previews are small; detailed interaction and mobile behavior were not verified.

- [Descript](https://styles.refero.design/style/fe955d4a-c56d-4ab0-a6b3-8d985ab9570c): Shows a recognizable editor with real content as the central proof, rather than a list of editing features. Borrow the **product interface as the hero** and a readable crop of the active editing moment. Do not borrow the burgundy palette, serif typography, or floating rounded cards. Lettr translates this into one square, legible email workspace with a selected block.
- [React Email](https://styles.refero.design/style/9905b62f-007b-4b3a-9357-84e85c07ef96): Pairs creation controls with a rendered email, making the relationship between action and output clear. Borrow the **control-to-result pairing**. Do not borrow its dark/cyan developer aesthetic or imply Lettr uses a code-first editor. Lettr's block controls sit beside the resulting email.
- [Webflow](https://styles.refero.design/style/31471407-598a-45fd-a505-d921980d8855): Uses realistic product chrome to demonstrate a visual editor. Borrow only enough chrome to establish an authentic workspace. Do not shrink a complete dashboard into an unreadable screenshot, or borrow Webflow's blue accent and soft geometry. Lettr shows the few controls involved in the chosen editor capability at a readable scale.

## 2026-09-21 — homepage architecture research selection

The fuller research and proposed seven-section sequence are in [homepage-research-and-architecture.md](homepage-research-and-architecture.md). Final references below serve different jobs; they are not a shared style palette.

- **Descript, dominant narrative reference:** [live homepage](https://www.descript.com/) and [Refero style](https://styles.refero.design/style/fe955d4a-c56d-4ab0-a6b3-8d985ab9570c). Reviewed the current homepage's whole-workflow sequence and product scenes. Borrow continuity of one object through a few stages and readable interface crops. Do not borrow the burgundy/coral palette, serif type, long feature inventory, or AI framing. Lettr should use one email example, square panels, blush/ink/white surfaces, and pink action cues. The Refero style is a snapshot; the live page provided the current content order.
- **Clerk, technical/product proof:** [live homepage](https://clerk.com/) and [Refero style](https://styles.refero.design/style/ed10ae04-24ec-4e42-9bf2-ea12a4b58d67). Reviewed the component explorer with selectable examples and concrete UI results. Borrow progressive reveal of a real supported action beside a concise technical cue. Do not borrow violet glass, rounded bento cards, or the inventory's breadth. Lettr can reveal API trigger and editable template in one square product stage. Exact live interaction details were not tested on mobile.
- **Butter, independent feature composition:** [Mobbin desktop section](https://mobbin.com/sites/sections/3e1db400-2e9f-477c-bdc7-f9209d245ca5). Reopened and visually inspected the static 1920×1890 section capture. Two spacious canvases each have a short headline, one large graphic, and restrained support copy; this matches the owner's explicit preference. Borrow selectively for one or two independent proofs, not as an all-page grid. Do not borrow rounded gray surfaces or tiny captions. The source site's current homepage, mobile behavior, and interaction were not verified from this capture.

Other opened candidates included [Linear](https://linear.app/) ([Mobbin section](https://mobbin.com/sites/sections/f8b93019-f62b-4e58-8f0d-e577baa204f3)), [Retool's Mobbin section](https://mobbin.com/sites/sections/dcbd55be-58cb-4e0e-9b70-cb4d184fa30a), [Attio](https://attio.com/), [Stripe](https://stripe.com/), [Mercury](https://mercury.com/), [Figma](https://www.figma.com/), and [Webflow](https://webflow.com/). Their breadth or abstract, dense UI made them less directly useful for Lettr's focused page.
