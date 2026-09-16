<script lang="ts">
	import { onMount } from 'svelte';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import CaretRightIcon from 'phosphor-svelte/lib/CaretRightIcon';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let stepsSection: HTMLElement | undefined = $state();
	let matcherSection: HTMLElement | undefined = $state();
	let reviewSection: HTMLElement | undefined = $state();
	let composeSection: HTMLElement | undefined = $state();
	let travelsSection: HTMLElement | undefined = $state();
	let detailsSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [stepsSection, matcherSection, reviewSection, composeSection, travelsSection, detailsSection]) {
			if (section) {
				cleanups.push(
					createScrollRevealCleanup({
						scope: section,
						targets: '[data-reveal]'
					})
				);
			}
		}

		return () => cleanups.forEach((fn) => fn());
	});

	/* ---------- Hero routing diagram ---------- */

	interface Inbox {
		initials: string;
		name: string;
		stored: string;
		code: string;
		subject: string;
		sender: string;
	}

	const inboxes: Inbox[] = [
		{ initials: 'JN', name: 'Jana Nováková', stored: 'cs-CZ', code: 'CS', subject: 'Novinky v Lettr: kampaně ve více jazycích', sender: 'Lettr <novinky@lettr.com>' },
		{ initials: 'TW', name: 'Tom Walker', stored: 'english', code: 'EN', subject: 'What\'s new in Lettr: multilingual campaigns', sender: 'Lettr <news@lettr.com>' },
		{ initials: 'LB', name: 'Lena Berger', stored: 'de_AT', code: 'DE', subject: 'Neu in Lettr: mehrsprachige Kampagnen', sender: 'Lettr <novinky@lettr.com>' }
	];

	const routePaths = [
		'M 0 120 C 55 120, 65 32, 120 32',
		'M 0 120 C 55 120, 65 120, 120 120',
		'M 0 120 C 55 120, 65 208, 120 208'
	];

	/* ---------- Live matcher ---------- */

	interface TemplateLanguage {
		code: string;
		name: string;
		primary?: boolean;
	}

	const templateLanguages: TemplateLanguage[] = [
		{ code: 'cs', name: 'Czech', primary: true },
		{ code: 'en', name: 'English' },
		{ code: 'de', name: 'German' }
	];

	const aliases: Record<string, string[]> = {
		cs: ['czech', 'cz', 'cze', 'ces', 'česky', 'cesky', 'čeština', 'cestina', 'czech republic'],
		en: ['english', 'eng', 'anglicky', 'englisch'],
		de: ['german', 'deutsch', 'ger', 'deu', 'německy', 'nemecky']
	};

	const sampleValues = ['cs-CZ', 'Czech', 'česky', 'en_US', 'Deutsch', 'sk', 'klingon', ''];

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

	const ruleLabels: Record<1 | 2 | 3, string> = {
		1: 'Rule 1 · same tag',
		2: 'Rule 2 · same base language',
		3: 'Rule 3 · known name or spelling'
	};

	let matcherInput = $state('cs-CZ');
	const matchResult = $derived(matchLanguage(matcherInput));
	const primaryLanguage = templateLanguages.find((l) => l.primary) ?? templateLanguages[0];

	/* ---------- Review & Send panel ---------- */

	interface ReviewRow {
		code: string;
		name: string;
		role: 'Primary' | 'Secondary';
		recipients: number;
		subject: string;
		sender: string;
		customSubject: boolean;
		customSender: boolean;
	}

	const reviewRows: ReviewRow[] = [
		{ code: 'CS', name: 'Czech', role: 'Primary', recipients: 2418, subject: 'Novinky v Lettr: kampaně ve více jazycích', sender: 'novinky@lettr.com', customSubject: false, customSender: false },
		{ code: 'EN', name: 'English', role: 'Secondary', recipients: 1906, subject: 'What\'s new in Lettr: multilingual campaigns', sender: 'news@lettr.com', customSubject: true, customSender: true },
		{ code: 'DE', name: 'German', role: 'Secondary', recipients: 731, subject: 'Neu in Lettr: mehrsprachige Kampagnen', sender: 'novinky@lettr.com', customSubject: true, customSender: false }
	];

	const fallbackNoValue = 289;
	const fallbackUnmatched = [
		{ value: 'sk', count: 20 },
		{ value: 'klingon', count: 3 }
	];
	const fallbackTotal = fallbackNoValue + fallbackUnmatched.reduce((sum, u) => sum + u.count, 0);
	const totalRecipients = reviewRows.reduce((sum, r) => sum + r.recipients, 0);
	const format = (n: number) => n.toLocaleString('en-US');
	const share = (n: number) => `${((n / totalRecipients) * 100).toFixed(1)}%`;

	/* ---------- Compose mock ---------- */

	const composeFields = [
		{ label: 'Subject', value: 'What\'s new in Lettr: multilingual campaigns', inherited: false },
		{ label: 'From email', value: 'news@lettr.com', inherited: false },
		{ label: 'From name', value: 'Lettr', inherited: true },
		{ label: 'Reply-to', value: 'novinky@lettr.com', inherited: true }
	];

	/* ---------- Copy ---------- */

	const steps = [
		{
			title: 'Add languages to the template',
			description:
				'The Multilingual control in the email editor adds a language to any template. The language the template started in is primary; every other one is secondary. All versions share one layout, only the text differs.'
		},
		{
			title: 'Point Lettr at the language property',
			description:
				'One contact property is marked as the communication language. With no property marked, Lettr reads a property named language, lang, or locale, so an audience imported with a lang column needs no setup.'
		},
		{
			title: 'Send once',
			description:
				'Linking the template in Compose makes the campaign multilingual. There is no switch to turn on. Each contact receives the version that matches the value on their record.'
		}
	];

	const travels = [
		{ term: 'Content', description: 'The template version in the recipient\'s language, from the copy stored when the campaign was scheduled.' },
		{ term: 'Subject, sender, reply-to', description: 'The per-language values where set, the primary ones where not.' },
		{ term: 'Unsubscribe footer', description: 'Translated for 19 languages. Anything else receives the English footer.' },
		{ term: 'View in browser', description: 'Opens the same language the recipient received.' },
		{ term: 'Preferences page', description: 'The hosted preferences, unsubscribe, and web-version pages render in the designated language.' },
		{ term: 'Activity badge', description: 'Secondary-language recipients carry a language badge in the activity list, fixed at send time.' }
	];

	const details = [
		{
			question: 'What does a contact with no language get?',
			answer:
				'The primary language, and so does a value that matches nothing, such as klingon. The Review & Send panel counts both groups separately and lists the unmatched values, so the data can be fixed before the send.'
		},
		{
			question: 'Does en-GB match an en template?',
			answer:
				'Yes. Matching tries the exact tag, then the base language, then common names and spellings. Case and the choice between a hyphen and an underscore never matter.'
		},
		{
			question: 'What if the template changes after scheduling?',
			answer:
				'Nothing changes for that campaign. Scheduling or starting a send stores a copy of every language version. Unscheduling drops the copy, so rescheduling picks up the current template.'
		},
		{
			question: 'Can a campaign send a language the template lacks?',
			answer:
				'No. A campaign sends only the languages its template contains. With a Czech and English template, a German contact receives the primary language.'
		},
		{
			question: 'Do existing campaigns change?',
			answer:
				'No. Campaigns sent before this feature behave exactly as they did. Only a campaign whose template has more than one language becomes multilingual.'
		},
		{
			question: 'Can each version be tested before sending?',
			answer:
				'Yes. The test email box has a language picker, and a test in a secondary language uses that language\'s content, subject, and sender.'
		}
	];
</script>

<FeaturePageLayout
	title="Multilingual Campaigns"
	metaDescription="Send one campaign in several languages. Each contact gets the version that matches their language, with per-language subject, sender, footer, and web version."
	label="Campaigns"
	description="One campaign, every language in the audience. The template holds the languages, a contact property holds each person's choice, and Lettr picks the version for every recipient."
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
		<!-- Hero routing diagram -->
		<div class="mlc-hero mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-stretch gap-6 lg:grid-cols-[minmax(0,300px)_minmax(80px,1fr)_minmax(0,420px)] lg:gap-0">
			<!-- Campaign -->
			<div class="flex flex-col justify-center border border-border/50 bg-white p-6">
				<div class="mb-5 flex items-center justify-between">
					<span class="font-heading text-[11px] tracking-[0.15em] text-muted uppercase">Campaign</span>
					<span class="border border-border/50 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted uppercase">Scheduled</span>
				</div>
				<p class="font-heading text-lg text-surface">September product update</p>
				<p class="mt-1 text-sm text-muted">{format(totalRecipients)} recipients · one audience</p>
				<div class="mt-6 border-t border-border/40 pt-5">
					<p class="mb-2 text-[11px] font-medium tracking-wide text-muted uppercase">Template languages</p>
					<div class="flex flex-wrap gap-1.5">
						{#each templateLanguages as lang}
							<span class="inline-flex items-center gap-1.5 border border-border/50 bg-background px-2 py-1 font-code text-xs text-surface">
								{lang.code.toUpperCase()}
								{#if lang.primary}<span class="text-[10px] text-primary">primary</span>{/if}
							</span>
						{/each}
					</div>
				</div>
				<div class="mt-5 border-t border-border/40 pt-5">
					<p class="mb-1 text-[11px] font-medium tracking-wide text-muted uppercase">Language read from</p>
					<p class="font-code text-xs text-surface">communication_language</p>
				</div>
			</div>

			<!-- Routes -->
			<div class="relative hidden lg:block" aria-hidden="true">
				<svg class="absolute inset-0 h-full w-full" viewBox="0 0 120 240" preserveAspectRatio="none" fill="none">
					{#each routePaths as d}
						<path {d} class="stroke-border" stroke-width="1" vector-effect="non-scaling-stroke" />
					{/each}
					{#each routePaths as d, i}
						<path
							{d}
							class="mlc-comet stroke-primary"
							style="animation-delay:{i * 2.5}s"
							stroke-width="2"
							stroke-linecap="round"
							vector-effect="non-scaling-stroke"
							pathLength="1"
						/>
					{/each}
				</svg>
				<span class="absolute top-1/2 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 bg-primary"></span>
			</div>

			<p class="text-center text-xs text-muted lg:hidden">Routed by each contact's language value</p>

			<!-- Inboxes -->
			<div class="flex flex-col justify-between gap-3">
				{#each inboxes as inbox, i}
					<div class="mlc-inbox relative border border-border/50 bg-white p-4" style="animation-delay:{i * 2.5}s">
						<div class="flex items-start gap-3">
							<span class="flex h-9 w-9 shrink-0 items-center justify-center bg-surface font-heading text-xs text-white">{inbox.initials}</span>
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5">
									<span class="truncate text-sm font-medium text-surface">{inbox.name}</span>
									<span class="shrink-0 font-code text-[11px] text-muted">
										communication_language: <span class="text-surface">{inbox.stored}</span>
									</span>
								</div>
								<p class="mt-1.5 truncate text-sm text-surface">{inbox.subject}</p>
								<div class="mt-1 flex items-center justify-between gap-2">
									<span class="truncate text-xs text-muted">{inbox.sender}</span>
									<span class="mlc-badge shrink-0 border border-border/50 px-1.5 py-0.5 font-code text-[10px] font-semibold text-surface">{inbox.code}</span>
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- How it works -->
		<div bind:this={stepsSection} class="mx-auto mt-24 max-w-5xl md:mt-32">
			<div data-reveal class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary/80 uppercase">
				<span class="block h-px w-6 bg-primary/60"></span>
				How it works
			</div>
			<h2 data-reveal class="mb-12 max-w-[24ch] text-surface">
				Three pieces.<br /><span class="text-primary">Two need setup.</span>
			</h2>
			<ol class="grid gap-x-10 gap-y-10 md:grid-cols-3">
				{#each steps as step, i}
					<li data-reveal class="border-t border-surface/80 pt-5">
						<span class="font-code text-xs text-muted">0{i + 1}</span>
						<h3 class="mt-3 text-base font-semibold text-surface">{step.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
					</li>
				{/each}
			</ol>
		</div>

		<!-- Live matcher -->
		<div bind:this={matcherSection} class="mx-auto mt-24 grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-12 md:mt-32 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
			<div>
				<div data-reveal class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary/80 uppercase">
					<span class="block h-px w-6 bg-primary/60"></span>
					Matching
				</div>
				<h2 data-reveal class="mb-5 text-surface">
					Real audiences are messy.<br /><span class="text-primary">Matching is forgiving.</span>
				</h2>
				<p data-reveal class="mb-8 max-w-[48ch] text-body text-muted">
					The same language arrives as cs, cs_CZ, Czech, or česky, depending on the import, the form, and the person filling it in. Each value is compared with the template's languages from the strictest rule to the loosest, and the first match wins.
				</p>
				<ol data-reveal class="space-y-4 border-l border-border/60 pl-5">
					<li>
						<p class="text-sm font-semibold text-surface">1. Same tag</p>
						<p class="text-sm text-muted">Case, spaces, and hyphen versus underscore are ignored.</p>
					</li>
					<li>
						<p class="text-sm font-semibold text-surface">2. Same base language</p>
						<p class="text-sm text-muted">The region is dropped in both directions: en-US matches en, and en matches en-GB.</p>
					</li>
					<li>
						<p class="text-sm font-semibold text-surface">3. Known name or spelling</p>
						<p class="text-sm text-muted">czech, cz, česky, and Deutsch are looked up in an alias table.</p>
					</li>
				</ol>
			</div>

			<div data-reveal class="border border-border/50 bg-white">
				<div class="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-background px-5 py-3">
					<span class="font-heading text-xs font-semibold text-surface uppercase">Try a value</span>
					<span class="flex items-center gap-1.5 text-xs text-muted">
						Template:
						{#each templateLanguages as lang}
							<span class="font-code text-surface">{lang.code}</span>
						{/each}
					</span>
				</div>
				<div class="p-5">
					<label class="block">
						<span class="mb-1.5 block text-[11px] font-medium tracking-wide text-muted uppercase">Contact's language value</span>
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
								onclick={() => (matcherInput = sample)}
								class="border px-2 py-1 font-code text-xs transition-colors {matcherInput === sample ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 text-muted hover:border-surface/40 hover:text-surface'}"
							>
								{sample === '' ? '(empty)' : sample}
							</button>
						{/each}
					</div>

					<div class="mt-6 grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 border-t border-border/40 pt-5">
						<span class="text-[11px] font-medium tracking-wide text-muted uppercase">Resolves to</span>
						{#if matchResult.kind === 'match'}
							<span class="flex items-center gap-2">
								<span class="bg-surface px-1.5 py-0.5 font-code text-[11px] font-semibold text-white">{matchResult.language.code.toUpperCase()}</span>
								<span class="text-sm font-medium text-surface">{matchResult.language.name}</span>
								{#if matchResult.language.primary}<span class="text-xs text-muted">primary</span>{/if}
							</span>
							<span class="text-[11px] font-medium tracking-wide text-muted uppercase">Because</span>
							<span class="text-sm text-muted">{ruleLabels[matchResult.rule]}</span>
						{:else}
							<span class="flex items-center gap-2">
								<span class="bg-surface px-1.5 py-0.5 font-code text-[11px] font-semibold text-white">{primaryLanguage.code.toUpperCase()}</span>
								<span class="text-sm font-medium text-surface">{primaryLanguage.name}</span>
								<span class="border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[10px] tracking-wide text-primary uppercase">fallback</span>
							</span>
							<span class="text-[11px] font-medium tracking-wide text-muted uppercase">Because</span>
							<span class="text-sm text-muted">
								{matchResult.reason === 'empty' ? 'No value on the contact. Counted under "no value" in the review panel.' : 'No template language matches. Counted under "unmatched" in the review panel.'}
							</span>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Review & Send -->
		<div bind:this={reviewSection} class="mx-auto mt-24 min-w-0 max-w-5xl md:mt-32">
			<div class="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-end">
				<div>
					<div data-reveal class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary/80 uppercase">
						<span class="block h-px w-6 bg-primary/60"></span>
						Review &amp; Send
					</div>
					<h2 data-reveal class="text-surface">
						The split,<br /><span class="text-primary">before the send.</span>
					</h2>
				</div>
				<p data-reveal class="max-w-[52ch] text-body text-muted lg:justify-self-end">
					The last step names the property the language is read from, lists who receives which version with the subject and sender each one uses, and counts everyone who falls back to the primary language and why.
				</p>
			</div>

			<div data-reveal class="mt-10 min-w-0 max-w-full border border-border/50 bg-white">
				<div class="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-background px-5 py-3">
					<span class="font-heading text-xs font-semibold text-surface uppercase">Multi-language send</span>
					<span class="text-xs text-muted">
						Language read from <span class="font-code text-surface">communication_language</span>
						<span class="ml-1 border border-border/50 px-1.5 py-0.5 text-[10px] tracking-wide text-muted uppercase">designated</span>
					</span>
				</div>

				<div class="px-5 pt-5">
					<div class="flex h-2 w-full gap-px overflow-hidden">
						{#each reviewRows as row, i}
							<div class="h-full {i === 0 ? 'bg-surface' : i === 1 ? 'bg-primary' : 'bg-primary/40'}" style="width:{share(row.recipients)}"></div>
						{/each}
					</div>
					<div class="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
						{#each reviewRows as row, i}
							<span class="flex items-center gap-1.5">
								<span class="inline-block h-2 w-2 {i === 0 ? 'bg-surface' : i === 1 ? 'bg-primary' : 'bg-primary/40'}"></span>
								{row.name} <span class="font-code text-surface">{share(row.recipients)}</span>
							</span>
						{/each}
					</div>
				</div>

				<div class="mt-4 overflow-x-auto">
					<table class="w-full min-w-[600px] text-left text-sm">
						<thead>
							<tr class="border-y border-border/50 text-xs text-muted">
								<th class="px-5 py-2.5 font-medium">Language</th>
								<th class="px-5 py-2.5 text-right font-medium">Recipients</th>
								<th class="px-5 py-2.5 font-medium">Subject</th>
								<th class="px-5 py-2.5 font-medium">From</th>
							</tr>
						</thead>
						<tbody>
							{#each reviewRows as row}
								<tr class="border-b border-border/40">
									<td class="px-5 py-3.5 whitespace-nowrap">
										<span class="mr-2 inline-block bg-surface px-1.5 py-0.5 font-code text-[10px] font-semibold text-white">{row.code}</span>
										<span class="text-surface">{row.name}</span>
										<span class="ml-1.5 text-xs text-muted">{row.role}</span>
									</td>
									<td class="px-5 py-3.5 text-right font-code text-surface tabular-nums">{format(row.recipients)}</td>
									<td class="px-5 py-3.5 text-surface">
										{row.subject}
										{#if row.customSubject}
											<span class="ml-1.5 border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[10px] tracking-wide text-primary uppercase">custom</span>
										{/if}
									</td>
									<td class="px-5 py-3.5 whitespace-nowrap text-muted">
										{row.sender}
										{#if row.customSender}
											<span class="ml-1.5 border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[10px] tracking-wide text-primary uppercase">custom</span>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="grid gap-x-8 gap-y-2 bg-background px-5 py-4 text-xs text-muted sm:grid-cols-[auto_1fr]">
					<span class="text-surface">
						<span class="font-code">{format(fallbackTotal)}</span> of the {format(totalRecipients)} receive Czech as a fallback
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

		<!-- Per-language subject and sender -->
		<div bind:this={composeSection} class="mx-auto mt-24 grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-12 md:mt-32 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center">
			<div data-reveal class="order-2 border border-border/50 bg-white lg:order-1">
				<div class="border-b border-border/50 bg-background px-5 py-3">
					<span class="font-heading text-xs font-semibold text-surface uppercase">Compose</span>
				</div>
				<div class="space-y-3 p-5">
					<div>
						<span class="mb-1 block text-[11px] font-medium tracking-wide text-muted uppercase">Subject</span>
						<div class="border border-border/60 px-3 py-2 text-sm text-surface">Novinky v Lettr: kampaně ve více jazycích</div>
					</div>
					<div class="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
						<div class="min-w-0">
							<span class="mb-1 block text-[11px] font-medium tracking-wide text-muted uppercase">From</span>
							<div class="truncate border border-border/60 px-3 py-2 text-sm text-surface">Lettr &lt;novinky@lettr.com&gt;</div>
						</div>
						<div>
							<span class="mb-1 block text-[11px] font-medium tracking-wide text-muted uppercase">Reply-to</span>
							<div class="truncate border border-border/60 px-3 py-2 text-sm text-surface">novinky@lettr.com</div>
						</div>
					</div>
				</div>
				<div class="border-t border-border/50 px-5 py-3">
					<span class="text-[11px] font-medium tracking-wide text-muted uppercase">Per-language subject and sender</span>
				</div>
				<div class="border-t border-border/40">
					<div class="flex items-center gap-2 bg-background/60 px-5 py-2.5 text-sm text-surface">
						<CaretDownIcon size={12} class="text-muted" />
						<span class="bg-surface px-1.5 py-0.5 font-code text-[10px] font-semibold text-white">EN</span>
						English
					</div>
					<div class="grid grid-cols-[minmax(0,1fr)] gap-3 px-5 py-4 sm:grid-cols-2">
						{#each composeFields as field}
							<div class="min-w-0 {field.label === 'Subject' ? 'sm:col-span-2' : ''}">
								<span class="mb-1 block text-[11px] font-medium tracking-wide text-muted uppercase">{field.label}</span>
								{#if field.inherited}
									<div class="flex items-center justify-between gap-2 border border-dashed border-border/70 px-3 py-2 text-sm text-muted/70">
										<span class="truncate">{field.value}</span>
										<span class="shrink-0 text-[10px] tracking-wide uppercase">inherited</span>
									</div>
								{:else}
									<div class="flex items-center justify-between gap-2 border border-border/60 px-3 py-2 text-sm text-surface">
										<span class="truncate">{field.value}</span>
										<span class="shrink-0 text-[10px] tracking-wide text-primary uppercase">custom</span>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
				<div class="flex items-center gap-2 border-t border-border/40 px-5 py-2.5 text-sm text-surface">
					<CaretRightIcon size={12} class="text-muted" />
					<span class="bg-surface px-1.5 py-0.5 font-code text-[10px] font-semibold text-white">DE</span>
					German
					<span class="ml-auto text-xs text-muted">1 of 4 set</span>
				</div>
			</div>

			<div class="order-1 lg:order-2">
				<div data-reveal class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary/80 uppercase">
					<span class="block h-px w-6 bg-primary/60"></span>
					Compose
				</div>
				<h2 data-reveal class="mb-5 text-surface">
					Translate the subject.<br /><span class="text-primary">Inherit the rest.</span>
				</h2>
				<p data-reveal class="max-w-[46ch] text-body text-muted">
					Each secondary language has an optional subject, from name, from email, and reply-to. An empty field takes the primary value, so a translated subject alone is a complete setup.
				</p>
				<p data-reveal class="mt-4 max-w-[46ch] text-sm text-muted">
					A per-language from email has to belong to a verified sending domain, and Lettr checks that when the draft is saved rather than at send time.
				</p>
			</div>
		</div>

		<!-- Everything travels -->
		<div bind:this={travelsSection} class="mx-auto mt-24 max-w-5xl md:mt-32">
			<div class="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
				<div>
					<div data-reveal class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary/80 uppercase">
						<span class="block h-px w-6 bg-primary/60"></span>
						What recipients get
					</div>
					<h2 data-reveal class="text-surface">
						Everything follows<br /><span class="text-primary">the language.</span>
					</h2>
					<p data-reveal class="mt-5 max-w-[40ch] text-body text-muted">
						Not only the body. Every recipient-facing surface renders in the matched language.
					</p>
				</div>
				<dl class="grid sm:grid-cols-2">
					{#each travels as item}
						<div data-reveal class="border-t border-border/60 py-5 sm:pr-8">
							<dt class="text-sm font-semibold text-surface">{item.term}</dt>
							<dd class="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</dd>
						</div>
					{/each}
				</dl>
			</div>
		</div>

		<!-- Details -->
		<div bind:this={detailsSection} class="mx-auto mt-24 max-w-5xl md:mt-32">
			<div data-reveal class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-primary/80 uppercase">
				<span class="block h-px w-6 bg-primary/60"></span>
				Edge cases
			</div>
			<h2 data-reveal class="mb-10 text-surface">
				Missing values, misspellings,<br /><span class="text-primary">and templates that change.</span>
			</h2>
			<dl class="grid gap-x-12 md:grid-cols-2">
				{#each details as item}
					<div data-reveal class="border-t border-border/60 py-5">
						<dt class="text-sm font-semibold text-surface">{item.question}</dt>
						<dd class="mt-2 text-sm leading-relaxed text-muted">{item.answer}</dd>
					</div>
				{/each}
			</dl>
			<p data-reveal class="mt-10 text-sm text-muted">
				The launch post covers the property-name fallback order, content locking, and the smaller changes shipped alongside:
				<a class="text-primary underline underline-offset-2" href="/blog/introducing-multilingual-campaigns/">Introducing multilingual campaigns</a>
			</p>
		</div>
	{/snippet}
</FeaturePageLayout>

<style>
	/*
	 * The hero diagram loops through the three routes: a comet travels along a
	 * path, then the matching inbox lights up. One 7.5s cycle, 2.5s per route,
	 * staggered through animation-delay on each element.
	 */
	.mlc-comet {
		stroke-dasharray: 0.18 1;
		stroke-dashoffset: 1.18;
		animation: mlc-travel 7.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
	}

	@keyframes mlc-travel {
		0% {
			stroke-dashoffset: 1.18;
			opacity: 0;
		}
		2% {
			opacity: 1;
		}
		16% {
			stroke-dashoffset: -0.18;
			opacity: 1;
		}
		17%,
		100% {
			stroke-dashoffset: -0.18;
			opacity: 0;
		}
	}

	.mlc-inbox {
		animation: mlc-light 7.5s ease-out infinite;
	}

	.mlc-inbox .mlc-badge {
		animation: mlc-badge 7.5s ease-out infinite;
		animation-delay: inherit;
	}

	@keyframes mlc-light {
		0%,
		12% {
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
		}
		16%,
		30% {
			border-color: var(--color-primary);
		}
		40%,
		100% {
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
		}
	}

	/* The 4px nudge only runs beside the routes on desktop; on narrow screens it would push the card past the gutter. */
	@media (min-width: 1024px) {
		.mlc-inbox {
			animation-name: mlc-light-lg;
		}
	}

	@keyframes mlc-light-lg {
		0%,
		12% {
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
			transform: translateX(0);
		}
		16%,
		30% {
			border-color: var(--color-primary);
			transform: translateX(4px);
		}
		40%,
		100% {
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
			transform: translateX(0);
		}
	}

	@keyframes mlc-badge {
		0%,
		12% {
			background-color: transparent;
			color: var(--color-surface);
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
		}
		16%,
		30% {
			background-color: var(--color-primary);
			color: white;
			border-color: var(--color-primary);
		}
		40%,
		100% {
			background-color: transparent;
			color: var(--color-surface);
			border-color: color-mix(in oklch, var(--color-border) 50%, transparent);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.mlc-comet {
			animation: none;
			stroke-dasharray: none;
			stroke-dashoffset: 0;
			opacity: 0.5;
		}
		.mlc-inbox,
		.mlc-inbox .mlc-badge {
			animation: none;
		}
	}
</style>
