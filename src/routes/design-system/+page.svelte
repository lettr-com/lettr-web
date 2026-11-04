<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import Button from '$lib/components/Button.svelte';
	import TerminalCommand from '$lib/components/TerminalCommand.svelte';
	import ChangelogBadge from '$lib/components/changelog/ChangelogBadge.svelte';
	import { Callout, Code } from '$lib/components/blog';
	import { Input } from '$lib/components/ui/input';

	interface Role {
		name: string;
		className: string;
		spec: string;
		use: string;
		sample: string;
	}

	const headingRoles: Role[] = [
		{ name: 'Display', className: 'type-display', spec: 'clamp(32px, 10.2vw, 56px) / 1.15 · −0.025em', use: 'Marketing hero h1: homepage, pricing, product landing pages', sample: 'Email built for SaaS' },
		{ name: 'H1', className: 'type-h1', spec: '32 → 44px / 1.17 → 1.14 · −0.025em', use: 'Title of a reading or utility page: blog post, changelog, legal, about', sample: 'What is transactional email?' },
		{ name: 'H2', className: 'type-h2', spec: '30 → 42px / 1.27 → 1.19 · −0.02em', use: 'Section heading (the 42px homepage heading)', sample: 'Send from your app in minutes' },
		{ name: 'H3', className: 'type-h3', spec: '24 → 28px / 1.25 · −0.015em', use: 'Subsection, article section, large card or panel title', sample: 'Retries that never send twice' },
		{ name: 'H4', className: 'type-h4', spec: '20 → 22px / 1.35 · −0.01em', use: 'Card title, list group heading, article subheading', sample: 'Dedicated IPs' },
		{ name: 'H5', className: 'type-h5', spec: '18px / 1.4', use: 'Small block heading, link-list heading', sample: 'Set up, compare, learn' },
		{ name: 'H6', className: 'type-h6', spec: '16px / 1.4', use: 'Compact heading, wrappers around accordion triggers', sample: 'Most read this quarter' }
	];

	const bodyRoles: Role[] = [
		{ name: 'Lead', className: 'type-lead', spec: '17 → 19px / 1.6', use: 'Intro paragraph under a page or section heading', sample: 'Your team builds every email in one editor. You send transactional by API and marketing by campaign.' },
		{ name: 'Body', className: 'text-body', spec: '19px / 1.6', use: 'Page default; long paragraphs on landing pages', sample: 'Lettr is an EU-hosted transactional email API for developers.' },
		{ name: 'Prose', className: 'text-prose', spec: '17px / 1.65', use: 'Article paragraphs (blog Paragraph)', sample: 'A soft bounce is temporary. The mailbox exists, but the message could not be delivered right now.' },
		{ name: 'Base', className: 'text-base', spec: '16px / 1.5', use: 'Card descriptions, UI copy, form fields', sample: 'Up to 10 sending domains, with DKIM and SPF checked for you.' },
		{ name: 'Body small', className: 'text-body-sm', spec: '15px / 1.55', use: 'Secondary copy in cards and excerpts', sample: 'Guides, product notes and engineering stories.' },
		{ name: 'Small', className: 'text-sm', spec: '14px / 1.5', use: 'Navigation, meta rows, helper text, small buttons', sample: '3,000 emails a month free. No credit card required.' },
		{ name: 'Caption', className: 'text-caption', spec: '13px / 1.45', use: 'Captions, footnotes, fine print', sample: 'Prices exclude VAT. Billed monthly.' },
		{ name: 'XS', className: 'text-xs', spec: '12px / 1.4', use: 'Badges, timestamps, table meta', sample: 'Updated 4 November 2026' },
		{ name: 'Label', className: 'type-label', spec: '12px / 1.4 · 600 · uppercase · 0.12em', use: 'Table heads and tags. Never as an eyebrow above a heading', sample: 'Monthly volume' }
	];

	const families = [
		{ name: 'Zalando Sans SemiExpanded', token: 'font-heading', className: 'font-heading', rule: 'Headings and display. Always weight 400.' },
		{ name: 'Manrope', token: 'font-body', className: 'font-body', rule: 'Body and interface. 400 for copy, 600 to 700 for emphasis and buttons.' },
		{ name: 'DM Mono', token: 'font-code', className: 'font-code', rule: 'Code, terminals, numbers in tables.' },
		{ name: 'Redaction (italic)', token: 'font-serif · type-accent', className: 'font-serif italic', rule: 'The editorial accent inside a heading.' },
		{ name: 'Redaction 20', token: 'font-pixel · type-accent-pixel', className: 'font-pixel italic', rule: 'The only pixelated cut. Use sparingly, for one accent per view.' }
	];

	const colors = [
		{ token: 'background', value: '#f7f1f3', note: 'Page' },
		{ token: 'primary', value: '#ec104b', note: 'Accent, links' },
		{ token: 'primary-strong', value: '#e90f49', note: 'Button fill (AA)' },
		{ token: 'primary-soft', value: '#fde7ed', note: 'Tint, hover' },
		{ token: 'primary-outline', value: '#f9b7c9', note: 'Outline, accent on dark' },
		{ token: 'surface', value: '#111827', note: 'Ink, dark panels' },
		{ token: 'muted', value: '#1f2937', note: 'Body copy' },
		{ token: 'subtle', value: '#39485f', note: 'Secondary copy' },
		{ token: 'border', value: '#d1d5db', note: 'Lines (use /30 to /60)' },
		{ token: 'hairline', value: '#eee7ea', note: 'Nav and card hairlines' },
		{ token: 'plum', value: '#23020b', note: 'Footer, dark bands' },
		{ token: 'plum-raised', value: '#3a0716', note: 'Raised on plum' },
		{ token: 'inset', value: '#fbf8f9', note: 'Product UI inset' },
		{ token: 'live', value: '#0f766e', note: 'Verified status' },
		{ token: 'green', value: '#00c851', note: 'Success' },
		{ token: 'warning', value: '#b91c1c', note: 'Breaking, errors' }
	];

	const buttonSizes = ['lg', 'md', 'sm'] as const;

	const spacing = [4, 8, 12, 16, 24, 32, 40, 48, 56, 64, 80, 96, 128];

	const layout = [
		{ token: 'section-y', value: '56 → 96px', use: 'Standard section padding' },
		{ token: 'section-y-sm', value: '40 → 64px', use: 'Strips and compact bands' },
		{ token: 'section-y-lg', value: '64 → 128px', use: 'Editorial sections (Laravel page)' },
		{ token: 'stack-section', value: 'gap 40 → 56px', use: 'Heading block to section content' },
		{ token: 'px-gutter', value: '24px', use: 'Page side gutter' },
		{ token: 'max-w-page', value: '1200px', use: 'Page frame' },
		{ token: 'max-w-wide', value: '1100px', use: 'Wide content (footer, pricing, Laravel)' },
		{ token: 'max-w-content', value: '820px', use: 'Centred hero block' },
		{ token: 'max-w-measure', value: '640px', use: 'Lead paragraphs' },
		{ token: 'max-w-article', value: '550px', use: 'Article body column' }
	];

	const sections = ['Type', 'Body', 'Fonts', 'Colour', 'Space', 'Buttons', 'Labels', 'Cards', 'Code', 'In context'];

	const sampleCode = `await lettr.emails.send({
  from: 'hello@acme.com',
  to: 'ada@example.com',
  template: 'welcome',
});`;
</script>

<svelte:head>
	<title>Design system · Lettr (internal)</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="pt-page pb-24">
	<header class="flex max-w-measure flex-col gap-4">
		<p class="text-sm text-subtle">Internal · dev server only</p>
		<h1 class="text-surface">Lettr design system</h1>
		<p class="type-lead text-muted">
			The tokens and roles in <code class="font-code text-[0.9em]">src/styles/app.css</code>, shown as they render. Change the CSS and this page follows.
		</p>
	</header>

	<nav aria-label="Sections" class="sticky top-16 z-20 -mx-6 mt-10 overflow-x-auto border-y border-border/30 bg-background/90 px-6 py-3 backdrop-blur">
		<ul class="flex gap-5 text-sm whitespace-nowrap text-subtle">
			{#each sections as section (section)}
				<li><a class="hover:text-primary" href="#{section.toLowerCase().replace(' ', '-')}">{section}</a></li>
			{/each}
		</ul>
	</nav>

	<!-- Headings -->
	<section id="type" class="section-y border-b border-border/30">
		<div class="stack-section">
			<div class="flex flex-col gap-3">
				<h2 class="text-surface">Heading roles</h2>
				<p class="max-w-measure type-lead text-muted">
					One utility per role. Bare <code class="font-code text-[0.9em]">h1</code>–<code class="font-code text-[0.9em]">h6</code> get their role by default; a class gives a heading a different look without changing its level.
				</p>
			</div>
			<div class="flex flex-col">
				{#each headingRoles as role (role.name)}
					<div class="grid gap-3 border-t border-border/40 py-6 md:grid-cols-[220px_1fr] md:gap-8">
						<dl class="flex flex-col gap-1 text-sm">
							<dt class="font-semibold text-surface">{role.name} <code class="ml-1 font-code text-xs text-primary">{role.className}</code></dt>
							<dd class="text-caption text-subtle">{role.spec}</dd>
							<dd class="text-caption text-subtle">{role.use}</dd>
						</dl>
						<p class="{role.className} text-balance text-surface">{role.sample}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Accent -->
	<section class="section-y border-b border-border/30">
		<div class="stack-section">
			<div class="flex flex-col gap-3">
				<h2 class="text-surface">The accent</h2>
				<p class="max-w-measure type-lead text-muted">
					<code class="font-code text-[0.9em]">type-accent</code> scales from the heading it sits in (1.1×, or 1.15× in display), so an accent never needs its own size. Start a pink phrase on its own line.
				</p>
			</div>
			<div class="grid gap-10 md:grid-cols-2">
				<p class="type-display text-surface">Email API pricing <em class="type-accent block text-primary">that grows with you.</em></p>
				<p class="type-h2 text-surface">Built for <em class="type-accent-pixel text-primary">Laravel.</em><br />Compatible with most.</p>
				<p class="type-h1 text-surface">Email, <em class="type-accent text-primary">written down</em></p>
				<div class="bg-plum p-8">
					<p class="type-h1 text-white">Ready to <em class="type-accent-pixel block leading-[1.15] text-primary-outline">get started?</em></p>
				</div>
			</div>
		</div>
	</section>

	<!-- Body -->
	<section id="body" class="section-y border-b border-border/30">
		<div class="stack-section">
			<h2 class="text-surface">Body and supporting text</h2>
			<div class="flex flex-col">
				{#each bodyRoles as role (role.name)}
					<div class="grid gap-3 border-t border-border/40 py-5 md:grid-cols-[220px_1fr] md:gap-8">
						<dl class="flex flex-col gap-1 text-sm">
							<dt class="font-semibold text-surface">{role.name} <code class="ml-1 font-code text-xs text-primary">{role.className}</code></dt>
							<dd class="text-caption text-subtle">{role.spec}</dd>
							<dd class="text-caption text-subtle">{role.use}</dd>
						</dl>
						<p class="{role.className} max-w-measure text-muted">{role.sample}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Families -->
	<section id="fonts" class="section-y border-b border-border/30">
		<div class="stack-section">
			<h2 class="text-surface">Typefaces</h2>
			<div class="grid gap-px bg-border/40 sm:grid-cols-2 lg:grid-cols-3">
				{#each families as family (family.name)}
					<div class="flex flex-col gap-4 bg-background p-6">
						<p class="{family.className} text-[3rem] leading-none text-surface">Aa Gg 20</p>
						<div class="flex flex-col gap-1">
							<p class="text-base font-semibold text-surface">{family.name}</p>
							<code class="font-code text-xs text-primary">{family.token}</code>
							<p class="text-body-sm text-subtle">{family.rule}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Colour -->
	<section id="colour" class="section-y border-b border-border/30">
		<div class="stack-section">
			<h2 class="text-surface">Colour tokens</h2>
			<ul class="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
				{#each colors as color (color.token)}
					<li class="flex flex-col gap-2">
						<span class="block h-16 border border-border/40" style="background-color: {color.value}"></span>
						<span class="text-caption font-semibold text-surface">{color.token}</span>
						<span class="font-code text-xs text-subtle">{color.value}</span>
						<span class="text-xs text-subtle">{color.note}</span>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- Spacing -->
	<section id="space" class="section-y border-b border-border/30">
		<div class="stack-section">
			<div class="flex flex-col gap-3">
				<h2 class="text-surface">Spacing and layout</h2>
				<p class="max-w-measure type-lead text-muted">
					An 8px grid on Tailwind's 4px unit: even steps for layout, 4px steps for compact UI and optical fixes. No odd pixel values.
				</p>
			</div>
			<ul class="flex flex-col gap-2">
				{#each spacing as step (step)}
					<li class="grid grid-cols-[72px_1fr] items-center gap-4">
						<span class="font-code text-xs text-subtle">{step}px · {step / 4}</span>
						<span class="block h-3 bg-primary" style="width: {step * 2}px"></span>
					</li>
				{/each}
			</ul>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[520px] text-left text-sm">
					<thead>
						<tr class="border-b border-surface/20">
							<th class="py-2 pr-4 type-label text-subtle">Token</th>
							<th class="py-2 pr-4 type-label text-subtle">Value</th>
							<th class="py-2 type-label text-subtle">Use</th>
						</tr>
					</thead>
					<tbody>
						{#each layout as row (row.token)}
							<tr class="border-b border-border/40">
								<td class="py-2.5 pr-4 font-code text-xs text-primary">{row.token}</td>
								<td class="py-2.5 pr-4 text-surface">{row.value}</td>
								<td class="py-2.5 text-subtle">{row.use}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</section>

	<!-- Buttons -->
	<section id="buttons" class="section-y border-b border-border/30">
		<div class="stack-section">
			<div class="flex flex-col gap-3">
				<h2 class="text-surface">Buttons</h2>
				<p class="max-w-measure type-lead text-muted">
					One component, three sizes. <strong class="font-semibold text-surface">lg</strong> for hero and section CTAs, <strong class="font-semibold text-surface">md</strong> inside cards and forms, <strong class="font-semibold text-surface">sm</strong> in navigation and compact rows. Square, fixed heights, a 2px lift on hover, an ink focus outline.
				</p>
			</div>

			{#each buttonSizes as size (size)}
				<div class="flex flex-col gap-4">
					<h3 class="type-h5 text-surface">size="{size}"</h3>
					<div class="flex flex-wrap items-center gap-3">
						<Button {size} variant="primary">Get started</Button>
						<Button {size} variant="secondary">See docs</Button>
						<Button {size} variant="outline">Contact sales</Button>
						<Button {size} variant="ink">Talk to an expert</Button>
						<Button {size} variant="green">Start for free</Button>
					</div>
				</div>
			{/each}

			<div class="flex flex-col gap-4">
				<h3 class="type-h5 text-surface">States and icons</h3>
				<div class="flex flex-wrap items-center gap-3">
					<Button size="md">Read the guide <ArrowRightIcon /></Button>
					<Button size="md" disabled>Disabled</Button>
					<Button size="md" loading>Saving</Button>
					<Button size="md" class="outline-2 outline-offset-2 outline-surface">Focus-visible</Button>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-3 bg-plum p-8">
				<Button size="lg">Get started</Button>
				<Button size="lg" variant="ghost">Laravel docs</Button>
				<Button size="sm" variant="ghost">Small ghost</Button>
			</div>
		</div>
	</section>

	<!-- Labels and badges -->
	<section id="labels" class="section-y border-b border-border/30">
		<div class="stack-section">
			<h2 class="text-surface">Badges and labels</h2>
			<div class="flex flex-wrap items-center gap-3">
				<span class="bg-primary-strong px-2 py-0.5 text-xs font-bold text-white">New</span>
				<span class="border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-semibold text-primary">Recommended</span>
				<span class="border border-border/40 bg-white px-3 py-1.5 text-sm font-medium text-surface">3,000 emails / month</span>
				<ChangelogBadge module="transactional" />
				<ChangelogBadge module="campaigns" />
				<ChangelogBadge module="audience" />
				<ChangelogBadge module="platform" />
				<ChangelogBadge tag="API" />
				<ChangelogBadge tag="Breaking" />
			</div>
			<label class="flex max-w-sm flex-col gap-2">
				<span class="text-sm font-semibold text-surface">Work email</span>
				<Input type="email" placeholder="ada@example.com" />
				<span class="text-caption text-subtle">Helper text uses the caption size.</span>
			</label>
		</div>
	</section>

	<!-- Cards -->
	<section id="cards" class="section-y border-b border-border/30">
		<div class="stack-section">
			<div class="flex flex-col gap-3">
				<h2 class="text-surface">Cards and surfaces</h2>
				<p class="max-w-measure type-lead text-muted">
					Cards stay different on purpose. They share square corners, padding on the 8px grid (24 / 32 / 40), an h4 title and one of three shadows. Flat is the default.
				</p>
			</div>
			<div class="grid gap-6 md:grid-cols-3">
				<article class="flex flex-col gap-3 bg-white p-6 md:p-8">
					<h3 class="type-h4 text-surface">Flat card</h3>
					<p class="text-body-sm text-subtle">White on blush, no border. The default feature card.</p>
				</article>
				<article class="flex flex-col gap-3 border border-border/50 bg-white p-6 shadow-panel md:p-8">
					<h3 class="type-h4 text-surface">Panel <code class="font-code text-xs text-primary">shadow-panel</code></h3>
					<p class="text-body-sm text-subtle">Legal documents and long white panels.</p>
				</article>
				<article class="flex flex-col gap-3 bg-white p-6 shadow-float md:p-8">
					<h3 class="type-h4 text-surface">Float <code class="font-code text-xs text-primary">shadow-float</code></h3>
					<p class="text-body-sm text-subtle">Menus, popovers, product UI lifted off the page.</p>
				</article>
				<article class="flex flex-col gap-3 border border-primary bg-white p-6 shadow-offset md:p-8">
					<h3 class="type-h4 text-surface">Emphasis <code class="font-code text-xs text-primary">shadow-offset</code></h3>
					<p class="text-body-sm text-subtle">The one card a section wants you to pick.</p>
				</article>
				<article class="flex flex-col gap-3 bg-surface p-6 md:p-8">
					<h3 class="type-h4 text-white">Ink card</h3>
					<p class="text-body-sm text-white/70">Dark sections keep their cards dark.</p>
				</article>
				<article class="flex flex-col gap-3 bg-plum p-6 md:p-8">
					<h3 class="type-h4 text-white">Plum card</h3>
					<p class="text-body-sm text-primary-outline">Footer and transactional bands.</p>
				</article>
			</div>
			<Callout variant="tip" title="Callout">Blog callouts are cards too, with their own tint per variant.</Callout>
		</div>
	</section>

	<!-- Code -->
	<section id="code" class="section-y border-b border-border/30">
		<div class="stack-section">
			<h2 class="text-surface">Code and terminals</h2>
			<div class="grid gap-6 md:grid-cols-2">
				<Code code={sampleCode} lang="ts" filename="send.ts" />
				<div class="flex flex-col gap-4">
					<TerminalCommand commands={['composer require lettr/lettr-laravel']} />
					<p class="text-body-sm text-subtle">
						Inline code is <code class="bg-surface/5 px-1.5 py-0.5 font-code text-[0.875em] text-surface">font-code</code> at 0.875em of its sentence.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- In context -->
	<section id="in-context" class="section-y">
		<div class="stack-section">
			<h2 class="text-surface">In context</h2>
			<div class="grid gap-10 border border-border/40 bg-white p-6 md:grid-cols-2 md:p-10">
				<div class="flex flex-col gap-6">
					<h3 class="type-h2 text-balance text-surface">
						Send from your app <em class="type-accent block text-primary">in minutes.</em>
					</h3>
					<p class="type-lead text-muted">A section heading uses h2, an accent on its own line, a lead paragraph and one large action.</p>
					<div><Button size="lg">Get started</Button></div>
				</div>
				<div class="flex flex-col gap-4 bg-background p-6">
					<span class="type-label text-subtle">Plan</span>
					<p class="type-h4 text-surface">Pro <span class="font-code text-base text-subtle">$15/mo</span></p>
					<p class="text-body-sm text-subtle">50k emails, 10 sending domains, 30-day retention.</p>
					<Button size="md" class="w-full">Choose Pro</Button>
					<p class="text-caption text-subtle">Cards and forms take the md button.</p>
				</div>
			</div>
		</div>
	</section>
</div>
