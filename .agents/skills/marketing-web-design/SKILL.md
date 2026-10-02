---
name: marketing-web-design
description: Design or redesign a marketing website, landing page, or section through product understanding, reference research, distinct concept exploration, implementation, and visual critique. Use for substantial marketing design work; skip for copy-only or routine code fixes.
---

# Marketing web design

This workflow is reusable across brands. In a repository, read its project instructions and brand/product context before designing. In Lettr, `AGENTS.md` routes to the focused files under `docs/design/`. The live code remains the token and implementation source of truth.

## Understand before concepts

Establish the product's real capabilities, audience and buyer, business model, positioning, core tension, desired action, and message hierarchy. Inspect the existing page, design tokens, reusable components, responsive constraints, and actual product UI. Distinguish verified claims from aspirations and stale copy. Do not jump from a vague prompt directly into markup.

For an existing page or section, diagnose its current job: what must be understood, what can be removed or combined, what can be hidden until interaction, which idea deserves the focal point, whether words could become a visual or interaction, and whether the section should exist. Preserve content only when it serves the message.

## Research by design problem

For significant visual exploration, inspect relevant references before settling on a direction. Use Refero or Mobbin when available; use other accessible sites, supplied screenshots, or moodboards as appropriate. Search for the mechanism needed (multiple modes, developer/API proof, product demonstrations, comparisons, unified data, progressive disclosure, unusual layouts, typography, subtle motion), not only for industry peers. Look beyond the product category.

Analyze useful references with evidence: what works, the problem solved, underlying principle, what to borrow, what to reject, and how to translate the principle into the current brand. Inspect interaction and responsive states when accessible. Record links/screenshots and limits; never imply tool research happened when it did not. Use a dominant direction rather than averaging references into a safe generic result. In Lettr, keep notes in `docs/design/reference-notes.md`.

## Explore before implementation

Develop at least three genuinely different concepts for substantial page or section redesign. They must change the **composition, hierarchy, interaction model, product visualization, type usage, or storytelling**, not merely colors or card order. For each, state the single remembered idea, focal object, key interaction (or reason to stay static), copy reduction, mobile behavior, and tradeoff. Compare them against the positioning and design taste; choose or combine with an explicit reason. For small routine design work, scale this exploration to the decision's size.

Design in this order: **message → hierarchy → visual concept → interaction → composition → components**. Use real brand tokens. Be creative with composition, not arbitrary with identity. Use actual product evidence; avoid tiny decorative mock UI or claims encoded in fake data.

## Critique and visual QA

Before implementation approval and after each rendered iteration, inspect for unnecessary text/UI, weak hierarchy, density, generic SaaS patterns, repeated layouts, tiny unreadable product UI, competing focal points, purposeless decoration, and missed opportunities for interaction or progressive disclosure. Ask: **What can I remove without weakening the message? What single thing should be remembered?** If the answer is unclear, revise the concept.

After implementation, inspect rendered desktop and narrow/mobile views and interaction states, including keyboard and reduced-motion behavior. Compare the result with the selected concept, useful references, brand rules, and intended hierarchy. Identify drift and iterate. Compilation checks protect code quality; visual inspection determines whether the design worked. Leave page-specific critique in the page-specific record, and promote a rule to brand guidance only with supporting evidence or owner direction.
