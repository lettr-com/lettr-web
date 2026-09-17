<script lang="ts">
	import { onMount } from 'svelte';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import CaretRightIcon from 'phosphor-svelte/lib/CaretRightIcon';
	import TranslateIcon from 'phosphor-svelte/lib/TranslateIcon';
	import IdentificationCardIcon from 'phosphor-svelte/lib/IdentificationCardIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import ArticleIcon from 'phosphor-svelte/lib/ArticleIcon';
	import EnvelopeOpenIcon from 'phosphor-svelte/lib/EnvelopeOpenIcon';
	import SignpostIcon from 'phosphor-svelte/lib/SignpostIcon';
	import BrowserIcon from 'phosphor-svelte/lib/BrowserIcon';
	import SlidersHorizontalIcon from 'phosphor-svelte/lib/SlidersHorizontalIcon';
	import TagIcon from 'phosphor-svelte/lib/TagIcon';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let stepsSection: HTMLElement | undefined = $state();
	let matcherSection: HTMLElement | undefined = $state();
	let reviewSection: HTMLElement | undefined = $state();
	let composeSection: HTMLElement | undefined = $state();
	let travelsSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [stepsSection, matcherSection, reviewSection, composeSection, travelsSection]) {
			if (section) {
				cleanups.push(
					createScrollRevealCleanup({
						scope: section,
						targets: '[data-reveal]'
					})
				);
			}
		}

		// Observing fires the callback once straight away, so no explicit first measure.
		const observer = new ResizeObserver(measureRoutes);
		if (routesEl) observer.observe(routesEl);
		inboxEls.forEach((el) => observer.observe(el));

		return () => {
			observer.disconnect();
			cleanups.forEach((fn) => fn());
		};
	});

	/* ---------- Hero routing diagram ---------- */

	interface Inbox {
		initials: string;
		name: string;
		code: string;
		subject: string;
		sender: string;
	}

	const inboxes: Inbox[] = [
		{ initials: 'TW', name: 'Tom Walker', code: 'EN', subject: 'What\'s new in Lettr: multilingual campaigns', sender: 'Lettr <news@lettr.com>' },
		{ initials: 'LB', name: 'Lena Berger', code: 'DE', subject: 'Neu in Lettr: mehrsprachige Kampagnen', sender: 'Lettr <hallo@lettr.com>' },
		{ initials: 'CL', name: 'Camille Laurent', code: 'FR', subject: 'Nouveautés Lettr : campagnes multilingues', sender: 'Lettr <news@lettr.com>' }
	];

	/*
	 * The routes are drawn in real pixels, measured from the layout, instead of a
	 * stretched viewBox. A stretched SVG with non-scaling strokes measures the
	 * dash in one coordinate space and draws it in another, so the comet stopped
	 * short of the cards.
	 */
	let routesEl: HTMLElement | undefined = $state();
	let inboxEls: HTMLElement[] = $state([]);
	let routeBox = $state({ width: 120, height: 240, targets: [32, 120, 208] });

	function measureRoutes() {
		if (!routesEl) return;
		const box = routesEl.getBoundingClientRect();
		if (!box.width || !box.height) return;
		routeBox = {
			width: box.width,
			height: box.height,
			targets: inboxEls.map((el) => {
				const rect = el.getBoundingClientRect();
				return rect.top + rect.height / 2 - box.top;
			})
		};
	}

	const routePaths = $derived(
		routeBox.targets.map((y) => {
			const { width, height } = routeBox;
			return `M 0 ${height / 2} C ${width / 2} ${height / 2}, ${width / 2} ${y}, ${width} ${y}`;
		})
	);

	/* ---------- Live matcher ---------- */

	interface TemplateLanguage {
		code: string;
		name: string;
		primary?: boolean;
	}

	const templateLanguages: TemplateLanguage[] = [
		{ code: 'en', name: 'English', primary: true },
		{ code: 'de', name: 'German' },
		{ code: 'fr', name: 'French' }
	];

	// A subset of CommunicationLanguage::ALIASES in lettr-app.
	const aliases: Record<string, string[]> = {
		en: ['eng', 'english'],
		de: ['deu', 'ger', 'german', 'deutsch', 'germany'],
		fr: ['fra', 'fre', 'french', 'francais', 'français']
	};

	const sampleValues = ['de-AT', 'German', 'français', 'en_US', 'Deutsch', 'it', 'klingon', ''];

	type MatchResult =
		| { kind: 'match'; language: TemplateLanguage; rule: 1 | 2 | 3 }
		| { kind: 'fallback'; reason: 'empty' | 'unmatched' };

	function matchLanguage(raw: string): MatchResult {
		const value = raw.trim().toLowerCase().replace(/_/g, '-').replace(/\s+/g, ' ');
		if (!value) return { kind: 'fallback', reason: 'empty' };

		const exact = templateLanguages.find((l) => l.code === value);
		if (exact) return { kind: 'match', language: exact, rule: 1 };

		const base = value.split('-')[0];
		const byBase = templateLanguages.find((l) => l.code.split('-')[0] === base);
		if (byBase) return { kind: 'match', language: byBase, rule: 2 };

		const byAlias = templateLanguages.find((l) => aliases[l.code]?.includes(value));
		if (byAlias) return { kind: 'match', language: byAlias, rule: 3 };

		return { kind: 'fallback', reason: 'unmatched' };
	}

	const matchRules = [
		{ title: 'Same tag', description: 'Ignores case, spaces, and _ versus -, so DE matches de' },
		{ title: 'Same base language', description: 'Drops the region, so de-AT matches de' },
		{ title: 'Known name or spelling', description: 'Looks up names such as German or français' }
	];

	function ruleState(result: MatchResult, index: number): 'match' | 'miss' | 'skipped' {
		if (result.kind === 'fallback') return result.reason === 'empty' ? 'skipped' : 'miss';
		const rule = index + 1;
		if (rule === result.rule) return 'match';
		return rule < result.rule ? 'miss' : 'skipped';
	}

	const primaryLanguage = templateLanguages.find((l) => l.primary) ?? templateLanguages[0];
	let matcherInput = $state('de-AT');
	const matchResult = $derived(matchLanguage(matcherInput));
	const resolvedLanguage = $derived(matchResult.kind === 'match' ? matchResult.language : primaryLanguage);

	/* ---------- Review & Send panel ---------- */

	interface ReviewRow {
		code: string;
		name: string;
		recipients: number;
		subject: string;
		sender: string;
		customSubject: boolean;
		customSender: boolean;
	}

	const reviewRows: ReviewRow[] = [
		{ code: 'EN', name: 'English', recipients: 2418, subject: 'What\'s new in Lettr: multilingual campaigns', sender: 'news@lettr.com', customSubject: false, customSender: false },
		{ code: 'DE', name: 'German', recipients: 1906, subject: 'Neu in Lettr: mehrsprachige Kampagnen', sender: 'hallo@lettr.com', customSubject: true, customSender: true },
		{ code: 'FR', name: 'French', recipients: 731, subject: 'Nouveautés Lettr : campagnes multilingues', sender: 'news@lettr.com', customSubject: true, customSender: false }
	];

	const fallbackNoValue = 289;
	const fallbackUnmatched = [
		{ value: 'it', count: 20 },
		{ value: 'klingon', count: 3 }
	];
	const fallbackTotal = fallbackNoValue + fallbackUnmatched.reduce((sum, u) => sum + u.count, 0);
	const totalRecipients = reviewRows.reduce((sum, r) => sum + r.recipients, 0);
	const format = (n: number) => n.toLocaleString('en-US');
	const share = (n: number) => `${((n / totalRecipients) * 100).toFixed(1)}%`;
	/** Bar and legend colour per review row, in row order. */
	const shareColors = ['bg-surface', 'bg-primary', 'bg-primary/40'];

	/* ---------- Compose mock ---------- */

	const composeFields = [
		{ label: 'Subject', value: 'Neu in Lettr: mehrsprachige Kampagnen', inherited: false },
		{ label: 'From email', value: 'hallo@lettr.com', inherited: false },
		{ label: 'From name', value: 'Lettr', inherited: true },
		{ label: 'Reply-to', value: 'news@lettr.com', inherited: true }
	];
	const composeCustomCount = composeFields.filter((field) => !field.inherited).length;

	/* ---------- Copy ---------- */

	const steps = [
		{
			icon: TranslateIcon,
			title: 'Add languages to the template',
			description:
				'Use the Multilingual control in the editor. The original language is primary. Every version shares one layout and differs only in its text.'
		},
		{
			icon: IdentificationCardIcon,
			title: 'Mark the language property',
			description:
				'Tick Use as communication language on one contact property, or name it communication_language, language, lang, or locale and Lettr finds it.'
		},
		{
			icon: PaperPlaneTiltIcon,
			title: 'Send once',
			description:
				'Link a multilingual template in Compose. There is no separate setting, and each contact receives the version matching their record.'
		}
	];

	const travels = [
		{ icon: ArticleIcon, title: 'Content', description: 'The template version in their language, rendered from the copy stored when the campaign was scheduled.' },
		{ icon: EnvelopeOpenIcon, title: 'Subject and sender', description: 'Per-language subject, from name, from email, and reply-to where set, the primary values where not.' },
		{ icon: SignpostIcon, title: 'Unsubscribe footer', description: 'Translated for 19 languages. Anything else receives the English footer.' },
		{ icon: BrowserIcon, title: 'View in browser', description: 'Opens the exact language and merge values the recipient was sent.' },
		{ icon: SlidersHorizontalIcon, title: 'Preferences page', description: 'The unsubscribe and email-preferences pages open in the recipient\'s language.' },
		{ icon: TagIcon, title: 'Activity badge', description: 'Recipients of a secondary language get a code badge in the activity feed, showing the language they actually received.' }
	];
</script>

{#snippet langBadge(code: string, extra = '')}
	<span class="{extra} border border-border/60 px-1.5 py-0.5 font-code text-[10px] font-semibold text-surface">{code}</span>
{/snippet}

{#snippet tag(text: string, tone: 'primary' | 'muted' = 'primary', extra = '')}
	<span class="{extra} text-[10px] font-semibold tracking-wider uppercase {tone === 'primary' ? 'text-primary' : 'text-muted'}">{text}</span>
{/snippet}

{#snippet composeHeader(Icon: typeof CaretDownIcon, code: string, name: string, customCount: number, extra = '')}
	<div class="{extra} flex items-baseline gap-2 px-5 py-3 text-sm font-medium text-surface">
		<Icon size={12} class="self-center text-muted" />
		{@render langBadge(code)}
		{name}
		<span class="ml-auto text-xs font-normal text-muted">{customCount} custom {customCount === 1 ? 'field' : 'fields'}</span>
	</div>
{/snippet}

<FeaturePageLayout
	title="Multilingual Campaigns"
	seoTitle="Multilingual Email Campaigns"
	metaDescription="Send one email campaign in several languages. Each contact gets the version in their language, with a per-language subject, sender, and footer."
	label="MULTILINGUAL CAMPAIGNS"
	description="The template holds the languages, a contact property holds each person's choice, and Lettr sends every recipient the version in their language."
	related={[
		{ href: '/email-marketing/', label: 'Email Marketing', description: 'Campaigns, audiences, and segments, billed per contact.' },
		{ href: '/platform/templates/', label: 'Visual Editor', description: 'Drag-and-drop email editor powered by Topol.' },
		{ href: '/platform/analytics/', label: 'Analytics & Logs', description: 'Delivery metrics, searchable logs, and webhooks.' }
	]}
>
	{#snippet heading()}
		One campaign.<br />Every contact's language.
	{/snippet}

	{#snippet children()}
		<!-- Routing Diagram -->
		<div class="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)] items-stretch gap-3 lg:grid-cols-[minmax(0,272px)_minmax(48px,1fr)_minmax(0,400px)] lg:gap-0">
			<!-- Campaign -->
			<div class="flex flex-col justify-center border border-border/50 bg-white p-5">
				<div class="mb-5">
					{@render tag('Scheduled')}
				</div>
				<p class="font-heading text-lg text-surface">September product update</p>
				<p class="mt-1 text-sm text-muted">{format(totalRecipients)} recipients</p>
				<div class="mt-6 border-t border-border/30 pt-5">
					<div class="flex flex-wrap items-baseline gap-1.5">
						{#each templateLanguages as lang}
							{@render langBadge(lang.code.toUpperCase())}
						{/each}
						<span class="ml-1 text-xs text-muted">{primaryLanguage.name} is primary</span>
					</div>
				</div>
			</div>

			<!-- Routes -->
			<div bind:this={routesEl} class="relative hidden lg:block" aria-hidden="true">
				<svg class="absolute inset-0 h-full w-full" viewBox="0 0 {routeBox.width} {routeBox.height}" fill="none">
					{#each routePaths as d}
						<path {d} class="stroke-border" stroke-width="1" />
					{/each}
					{#each routePaths as d, i}
						<path {d} class="mlc-comet stroke-primary" style="--d:{i * 2.5}s" stroke-width="2" pathLength="1" />
					{/each}
				</svg>
				<span class="absolute top-1/2 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-primary"></span>
			</div>

			<div class="flex flex-col items-center gap-2 lg:hidden">
				<span class="h-5 w-px bg-border" aria-hidden="true"></span>
				<span class="text-xs text-muted">Routed by each contact's language value</span>
				<span class="h-5 w-px bg-border" aria-hidden="true"></span>
			</div>

			<!-- Inboxes -->
			<div class="flex flex-col justify-between gap-3">
				{#each inboxes as inbox, i}
					<div bind:this={inboxEls[i]} class="mlc-inbox relative border border-border/50 bg-white p-5" style="--d:{i * 2.5}s">
						<div class="flex items-start gap-3">
							<span class="flex h-9 w-9 shrink-0 items-center justify-center bg-surface font-heading text-xs text-white">{inbox.initials}</span>
							<div class="min-w-0 flex-1">
								<p class="truncate text-sm font-medium text-surface">{inbox.name}</p>
								<p class="mt-1.5 truncate text-sm text-surface">{inbox.subject}</p>
								<div class="mt-1 flex items-baseline justify-between gap-2">
									<span class="truncate text-xs text-muted">{inbox.sender}</span>
									{@render langBadge(inbox.code, 'mlc-badge shrink-0')}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- How It Works -->
		<div bind:this={stepsSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">How it works</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Add languages to a template, mark which contact property holds the language, and send once.
			</p>
			<ol class="grid gap-5 md:grid-cols-3">
				{#each steps as step}
					<li data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<step.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{step.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{step.description}</p>
					</li>
				{/each}
			</ol>
		</div>

		<!-- Live Matcher -->
		<div bind:this={matcherSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Language matching</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				de_AT, Deutsch, and German all get the German version. Three rules run strictest first, and a value that matches nothing gets the primary language.
			</p>

			<div data-reveal class="border border-border/50 bg-white">
				<div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/50 bg-background px-5 py-3">
					<span class="font-heading text-xs font-semibold text-surface uppercase">Try a value</span>
					<span class="flex items-baseline gap-1.5 text-xs text-muted">
						Template languages
						{#each templateLanguages as lang}
							{@render langBadge(lang.code.toUpperCase())}
						{/each}
					</span>
				</div>
				<div class="p-5">
					<label class="block">
						<span class="mb-1.5 block text-xs font-medium text-muted uppercase">Contact's language value</span>
						<input
							type="text"
							bind:value={matcherInput}
							placeholder="empty"
							spellcheck="false"
							autocomplete="off"
							class="w-full border border-border bg-background px-3 py-2.5 font-code text-sm text-surface outline-none placeholder:text-muted/50 focus:border-primary"
						/>
					</label>
					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each sampleValues as sample}
							<button
								type="button"
								aria-pressed={matcherInput === sample}
								onclick={() => (matcherInput = sample)}
								class="border px-2.5 py-1.5 font-code text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary {matcherInput === sample ? 'border-primary text-primary' : 'border-border/50 text-muted hover:border-surface/40 hover:text-surface'}"
							>
								{sample === '' ? '(empty)' : sample}
							</button>
						{/each}
					</div>
				</div>

				<ol class="divide-y divide-border/30 border-t border-border/50">
					{#each matchRules as rule, i}
						{@const state = ruleState(matchResult, i)}
						<li class="flex items-center gap-3 px-5 py-3 transition-opacity {state === 'skipped' ? 'opacity-40' : ''}">
							<span class="flex h-5 w-5 shrink-0 items-center justify-center font-code text-[10px] {state === 'match' ? 'bg-primary text-white' : 'border border-border/60 text-muted'}">{i + 1}</span>
							<span class="min-w-0 flex-1">
								<span class="block text-sm font-medium text-surface">{rule.title}</span>
								<span class="block text-xs text-muted">{rule.description}</span>
							</span>
							{#if state === 'match'}
								{@render tag('match', 'primary', 'shrink-0')}
							{:else if state === 'miss'}
								{@render tag('no match', 'muted', 'shrink-0')}
							{/if}
						</li>
					{/each}
				</ol>

				<div class="flex items-baseline justify-between gap-3 border-t border-border/50 bg-background px-5 py-3" aria-live="polite">
					<span class="text-xs font-medium text-muted uppercase">Resolves to</span>
					<span class="flex items-baseline gap-2">
						{#if matchResult.kind === 'fallback'}
							{@render tag(matchResult.reason === 'empty' ? 'no value' : 'fallback')}
						{/if}
						{@render langBadge(resolvedLanguage.code.toUpperCase())}
						<span class="text-sm font-medium text-surface">{resolvedLanguage.name}</span>
					</span>
				</div>
			</div>
		</div>

		<!-- Review & Send -->
		<div bind:this={reviewSection} class="mx-auto mt-20 max-w-3xl min-w-0 md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Review before sending</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				See who gets which language, the subject and sender each version uses, and who falls back to the primary language.
			</p>

			<div data-reveal class="max-w-full min-w-0 border border-border/50 bg-white">
				<div class="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/50 bg-background px-5 py-3">
					<span class="font-heading text-xs font-semibold text-surface uppercase">Multi-language send</span>
					<span class="text-xs text-muted">
						Language taken from <span class="font-code text-surface">communication_language</span>
					</span>
				</div>

				<div class="px-5 py-4">
					<div class="flex h-1.5 w-full gap-px overflow-hidden">
						{#each reviewRows as row, i}
							<div class="h-full {shareColors[i]}" style="width:{share(row.recipients)}"></div>
						{/each}
					</div>
					<div class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
						{#each reviewRows as row, i}
							<span class="flex items-center gap-1.5">
								<span class="inline-block h-2 w-2 {shareColors[i]}"></span>
								{row.name} <span class="font-code text-surface">{share(row.recipients)}</span>
							</span>
						{/each}
					</div>
				</div>

				<!--
					A grid rather than a <table>: table cells paint their backgrounds one
					by one, and a column edge on a fractional pixel leaves a hairline seam
					through the header band. A row is one element here.
				-->
				<div class="hidden grid-cols-[auto_auto_minmax(0,1fr)_auto] text-sm lg:grid" role="table">
					<div class="col-span-4 grid grid-cols-subgrid border-y border-border/50 bg-background text-xs font-semibold text-muted uppercase" role="row">
						<span class="py-3 pr-3 pl-5" role="columnheader">Language</span>
						<span class="px-3 py-3 text-right" role="columnheader">Contacts</span>
						<span class="px-3 py-3" role="columnheader">Subject</span>
						<span class="py-3 pr-5 pl-3" role="columnheader">From</span>
					</div>
					{#each reviewRows as row}
						<div class="col-span-4 grid grid-cols-subgrid items-center border-b border-border/30 last:border-b-0" role="row">
							<span class="py-3 pr-3 pl-5 whitespace-nowrap" role="cell">
								{@render langBadge(row.code, 'mr-2')}
								<span class="font-medium text-surface">{row.name}</span>
							</span>
							<span class="px-3 py-3 text-right font-code text-xs text-surface tabular-nums" role="cell">{format(row.recipients)}</span>
							<span class="truncate px-3 py-3 text-surface" role="cell">
								{row.subject}{#if row.customSubject}{@render tag('custom', 'primary', 'ml-2')}{/if}
							</span>
							<span class="py-3 pr-5 pl-3 whitespace-nowrap text-muted" role="cell">
								{row.sender}{#if row.customSender}{@render tag('custom', 'primary', 'ml-2')}{/if}
							</span>
						</div>
					{/each}
				</div>

				<ul class="divide-y divide-border/30 border-t border-border/50 lg:hidden">
					{#each reviewRows as row}
						<li class="px-5 py-4">
							<div class="flex items-baseline justify-between gap-3">
								<span class="flex items-baseline gap-2">
									{@render langBadge(row.code)}
									<span class="text-sm font-medium text-surface">{row.name}</span>
								</span>
								<span class="font-code text-xs text-surface tabular-nums">{format(row.recipients)}</span>
							</div>
							<p class="mt-2 text-sm text-surface">
								{row.subject}{#if row.customSubject}{@render tag('custom', 'primary', 'ml-2')}{/if}
							</p>
							<p class="mt-0.5 text-sm break-all text-muted">
								{row.sender}{#if row.customSender}{@render tag('custom', 'primary', 'ml-2')}{/if}
							</p>
						</li>
					{/each}
				</ul>

				<div class="flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-border/50 bg-background px-5 py-3 text-xs text-muted">
					<span class="text-surface">
						<span class="font-code">{format(fallbackTotal)}</span> of {format(totalRecipients)} get {primaryLanguage.name}, the primary language
					</span>
					<span class="flex flex-wrap gap-x-4 gap-y-1">
						<span>no value <span class="font-code text-surface">×{fallbackNoValue}</span></span>
						{#each fallbackUnmatched as u}
							<span>"{u.value}" <span class="font-code text-surface">×{u.count}</span></span>
						{/each}
					</span>
				</div>
			</div>
		</div>

		<!-- Per-Language Subject and Sender -->
		<div bind:this={composeSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Translate the subject, inherit the rest</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Each secondary language has an optional subject, from name, from email, and reply-to. Empty fields take the primary value.
			</p>

			<div data-reveal class="border border-border/50 bg-white">
				<div class="border-b border-border/50 bg-background px-5 py-3">
					<span class="font-heading text-xs font-semibold text-surface uppercase">Per-language subject and sender</span>
				</div>
				{@render composeHeader(CaretDownIcon, 'DE', 'German', composeCustomCount)}
				<div class="divide-y divide-border/30 border-t border-border/30">
					{#each composeFields as field}
						<div class="grid grid-cols-[4.75rem_minmax(0,1fr)_auto] sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] items-baseline gap-x-3 px-5 py-3">
							<span class="text-xs font-medium text-muted uppercase">{field.label}</span>
							<span class="min-w-0 text-sm break-words sm:truncate {field.inherited ? 'text-muted' : 'text-surface'}">{field.value}</span>
							{#if field.inherited}
								{@render tag('inherited', 'muted')}
							{:else}
								{@render tag('custom')}
							{/if}
						</div>
					{/each}
				</div>
				{@render composeHeader(CaretRightIcon, 'FR', 'French', 1, 'border-t border-border/30')}
				<div class="border-t border-border/50 bg-background px-5 py-3">
					<span class="text-xs text-muted">A per-language from email must use one of your verified domains. Lettr checks it on save and again at send time.</span>
				</div>
			</div>
		</div>

		<!-- What Recipients Get -->
		<div bind:this={travelsSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Everything in their language</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				The footer, web version, and hosted pages follow the same language, recorded per recipient at send time. The <a class="text-primary underline underline-offset-2" href="/blog/introducing-multilingual-campaigns/">launch post</a> covers the details.
			</p>
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each travels as item}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<item.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{item.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{item.description}</p>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>

<style>
	/*
	 * The hero diagram loops through the three routes: a comet travels along a
	 * path, then the matching inbox and its language badge light up. One 7.5s
	 * cycle, 2.5s per route; --d on each route and inbox staggers them.
	 *
	 * With pathLength="1" the dash is 0.18 long and the gap 2, so the pattern
	 * never repeats inside the path. The offset runs from 0.18 (dash just before
	 * the start) to -1 (dash just past the end), so exactly one dash is visible.
	 */
	.mlc-comet {
		stroke-dasharray: 0.18 2;
		stroke-dashoffset: 0.18;
		opacity: 0;
		animation: mlc-travel 7.5s cubic-bezier(0.4, 0, 0.2, 1) var(--d, 0s) infinite backwards;
	}

	@keyframes mlc-travel {
		0% {
			stroke-dashoffset: 0.18;
			opacity: 1;
		}
		16% {
			stroke-dashoffset: -1;
			opacity: 1;
		}
		17%,
		100% {
			stroke-dashoffset: -1;
			opacity: 0;
		}
	}

	.mlc-inbox {
		animation: mlc-light 7.5s ease-out var(--d, 0s) infinite;
	}

	.mlc-badge {
		animation: mlc-badge 7.5s ease-out var(--d, 0s) infinite;
	}

	@keyframes mlc-light {
		0%,
		14% {
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
		}
		17%,
		30% {
			border-color: var(--color-primary);
		}
		40%,
		100% {
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
		}
	}

	@keyframes mlc-badge {
		0%,
		14% {
			background-color: transparent;
			color: var(--color-surface);
			border-color: color-mix(in oklch, var(--color-border) 60%, transparent);
		}
		17%,
		30% {
			background-color: var(--color-primary);
			color: white;
			border-color: var(--color-primary);
		}
		40%,
		100% {
			background-color: transparent;
			color: var(--color-surface);
			border-color: color-mix(in oklch, var(--color-border) 60%, transparent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mlc-comet,
		.mlc-inbox,
		.mlc-badge {
			animation: none;
		}
	}
</style>
