# Lettr product and positioning

This is design context, not a fixed homepage outline. The current product and prices must be checked in the relevant routes before public copy is changed. Sources are noted below so claims can be traced.

## Why Lettr exists

**One email platform for SaaS.** A SaaS team needs reliable application email and campaigns for the same customer lifecycle. Splitting these jobs across a transactional provider and a marketing tool creates a second integration, bill, set of contacts and operating habits, while content changes often become developer tickets. Lettr puts the sending infrastructure and the visual content workflow in one account. Developers integrate through REST API, SMTP, or an SDK; product and marketing teammates build and change email in the Topol-powered editor and run campaigns. Lead with this tension and its resolution, then prove it with a concrete product moment.

The repo's original strategy is in [`lettr-positioning-framework.md`](../../lettr-positioning-framework.md). Its strongest durable insight is the developer/team handoff. On `redesign/homepage-2026`, the homepage hero and metadata are in [`HomeHero.svelte`](../../src/lib/components/home/HomeHero.svelte) and [`+layout.svelte`](../../src/routes/+layout.svelte).

## Who is buying and using it

- **Primary buyer:** developer, technical founder, or tech lead at a small SaaS team. They care about a clean integration, delivery, debugging, operational simplicity, and fair scaling. The 2–50-person profile and developer-led buying motion come from the positioning framework; treat them as strategy, not measured customer demographics.
- **Second daily user:** product or marketing teammate who needs to edit templates, maintain content, select audiences, send campaigns, and understand results without waiting for code changes.
- **Business model:** self-serve free entry, paid transactional plans based on sending volume, and marketing pricing based on contacts; enterprise/contact-sales paths also exist. The two modes and current numbers live in [`+page.svelte`](../../src/routes/pricing/+page.svelte), [`Pricing.svelte`](../../src/lib/components/Pricing.svelte), and [`CampaignsPricing.svelte`](../../src/lib/components/CampaignsPricing.svelte). Never copy a price from this document into public copy.

## Message hierarchy

1. Category and outcome: **one email platform for SaaS**.
2. Core tension: teams should not need separate tools for transactional and marketing email.
3. How it works: developers integrate once; the rest of the team can own email content and campaigns in a visual editor.
4. Proof, selected for the specific section: REST API/SMTP/SDKs, Topol editor, shared account and marketing audience, EU-hosted infrastructure, multilingual templates, deliverability tooling, logs and analytics.
5. Lower-priority proof: Big Good/Topol/Ecomail heritage, use cases, and plan details. These should support the central story rather than compete with it.

Use short, concrete SaaS examples: password reset, onboarding, trial expiry, usage alert, product announcement. Show the relationship between a triggering event, an editable template, a target audience, and a sent message when useful. “Fewer developer tickets” is an outcome of the editor and workflow, not a quantified guarantee.

## Supported product story and source map

| Topic                 | Repo evidence                                                                                                                                                                                                                                 | Safe framing for design work                                                                                                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Transactional sending | [`email-api/+page.svelte`](../../src/routes/email-api/+page.svelte), [`Features.svelte`](../../src/lib/components/Features.svelte), [`Navbar.svelte`](../../src/lib/components/Navbar.svelte)                                                 | REST API, SMTP relay, SDKs, authentication, webhooks, and searchable logs are presented on the site. Show a real integration flow if available.                                                                                           |
| Marketing             | [`introducing-lettr-marketing-audiences-and-campaigns/+page.svelte`](../../src/routes/blog/introducing-lettr-marketing-audiences-and-campaigns/+page.svelte), [`email-marketing/+page.svelte`](../../src/routes/email-marketing/+page.svelte) | Audiences and Campaigns are described as launched: contacts, lists, segments, topics, visual creation, scheduling, and reporting. The older framework's “coming soon” language is stale.                                                  |
| Visual editing        | [`platform/templates/+page.svelte`](../../src/routes/platform/templates/+page.svelte), [`EditorPreview.svelte`](../../src/lib/components/EditorPreview.svelte), [`TeamFeatures.svelte`](../../src/lib/components/TeamFeatures.svelte)         | Topol-powered drag-and-drop editor; template work includes placeholders, synced sections, version/draft workflow, and multilingual templates as described by the site. Verify specific behaviors before claiming a particular UI is live. |
| EU-first and trust    | [`Hero.svelte`](../../src/lib/components/Hero.svelte), [`FAQSection.svelte`](../../src/lib/components/FAQSection.svelte)                                                                                                                      | EU-hosted infrastructure is a stated site claim. Keep legal/compliance wording aligned with current approved copy.                                                                                                                        |
| Deliverability        | [`platform/deliverability/+page.svelte`](../../src/routes/platform/deliverability/+page.svelte), [`separate-transactional-and-marketing-email/+page.svelte`](../../src/routes/blog/separate-transactional-and-marketing-email/+page.svelte)   | Emphasize authentication, suppression, monitoring, and domain controls. Do not imply a guaranteed inbox placement or invent a delivery percentage.                                                                                        |

**Important domain nuance:** “One platform” does not mean forcing both streams onto one sending domain or one reputation. Lettr's own launch article recommends a separate marketing sending domain to protect transactional deliverability. Some existing page copy and the old framework say “one domain/one reputation”; resolve that conflict before reusing those phrases. A shared account and toolkit can coexist with separate domains.

**Data nuance:** the launch article documents a single shared pool of _marketing_ contacts with subscription status and engagement history. The repo supports “one place to manage email” and a shared account, but does not establish that every transactional recipient automatically becomes the same unified customer record. Avoid that stronger claim without product confirmation.

**Claim hygiene:** “high deliverability” is a positioning goal, supported by tooling and infrastructure narrative, not a documented rate or guarantee here. Avoid “every campaign lands in the inbox,” “best-in-class,” competitor assertions, customer counts, uptime figures, or performance numbers unless current evidence and approval support them. Do not use illustrative numbers inside UI mockups as real results.
