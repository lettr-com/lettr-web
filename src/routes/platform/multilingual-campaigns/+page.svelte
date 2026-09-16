<script lang="ts">
	import { onMount } from 'svelte';
	import TranslateIcon from 'phosphor-svelte/lib/TranslateIcon';
	import UsersThreeIcon from 'phosphor-svelte/lib/UsersThreeIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import TextAaIcon from 'phosphor-svelte/lib/TextAaIcon';
	import ArrowsClockwiseIcon from 'phosphor-svelte/lib/ArrowsClockwiseIcon';
	import LifebuoyIcon from 'phosphor-svelte/lib/LifebuoyIcon';
	import GlobeSimpleIcon from 'phosphor-svelte/lib/GlobeSimpleIcon';
	import FlaskIcon from 'phosphor-svelte/lib/FlaskIcon';
	import TableIcon from 'phosphor-svelte/lib/TableIcon';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let stepsSection: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();
	let previewSection: HTMLElement | undefined = $state();
	let detailsSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [stepsSection, featuresSection, previewSection, detailsSection]) {
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

	const steps = [
		{
			icon: TranslateIcon,
			title: 'Add languages to the template',
			description:
				'In the email editor, add a second language to any template. One language is primary, the others are secondary, and you switch between them in the language picker while you write.'
		},
		{
			icon: UsersThreeIcon,
			title: 'Tell Lettr where each contact’s language lives',
			description:
				'Mark one contact property as the communication language, or do nothing and Lettr picks up a property named language, lang, or locale. A CSV imported with a lang column already works.'
		},
		{
			icon: PaperPlaneTiltIcon,
			title: 'Send the campaign as usual',
			description:
				'Pick the template in Compose and the campaign becomes multilingual on its own. There is no switch to turn on. Each contact gets the version that matches their language.'
		}
	];

	const features = [
		{
			icon: TextAaIcon,
			title: 'Per-language subject and sender',
			description:
				'Give each language its own subject, from name, from email, and reply-to. Leave a field empty and it inherits the primary value, so a translated subject alone is enough.'
		},
		{
			icon: ArrowsClockwiseIcon,
			title: 'Forgiving language matching',
			description:
				'cs, CS, cs-CZ, czech, česky, and cz all resolve to the same template language. A contact with en-US gets your en version, and the reverse works too.'
		},
		{
			icon: LifebuoyIcon,
			title: 'Nobody gets left out',
			description:
				'A contact with no language, or one your template does not have, receives the primary version. Every recipient always gets an email.'
		},
		{
			icon: GlobeSimpleIcon,
			title: 'Localized footer and web version',
			description:
				'The automatic unsubscribe footer is translated for 19 languages, and the view-in-browser link opens the same language the recipient received.'
		},
		{
			icon: FlaskIcon,
			title: 'Test any language before you send',
			description:
				'The test email box has a language picker. Send yourself the Czech version with its Czech subject and sender, then the English one, before anything goes out.'
		},
		{
			icon: TableIcon,
			title: 'A review panel that shows the split',
			description:
				'Before sending, see how many contacts get each language, which subject and sender each one uses, and how many fall back to the primary language and why.'
		}
	];

	const previewRows = [
		{ code: 'CS', name: 'Czech', role: 'Primary', recipients: '2,418', subject: 'Novinky v Lettr: kampaně ve více jazycích', sender: 'Lettr <novinky@lettr.com>', custom: false },
		{ code: 'EN', name: 'English', role: 'Secondary', recipients: '1,906', subject: 'What’s new in Lettr: multilingual campaigns', sender: 'Lettr <news@lettr.com>', custom: true },
		{ code: 'DE', name: 'German', role: 'Secondary', recipients: '731', subject: 'Neu in Lettr: mehrsprachige Kampagnen', sender: 'Lettr <novinky@lettr.com>', custom: true }
	];

	const details = [
		{
			question: 'What if a contact has no language set?',
			answer:
				'They get the primary language. The same happens for a value that does not match any template language, such as klingon. The Review & Send panel lists both groups separately, with the unmatched values and their counts, so you can fix the data before you send.'
		},
		{
			question: 'Does a contact with en-GB get my en template?',
			answer:
				'Yes. Lettr tries an exact match first, then the base language, then common names and spellings. Case and the choice between a hyphen and an underscore never matter.'
		},
		{
			question: 'What happens if someone edits the template after I schedule?',
			answer:
				'Nothing changes for that campaign. When you schedule or start a send, Lettr stores a copy of the content in every language. Editing or deleting the template afterwards does not affect it. Unscheduling drops the copy, so rescheduling picks up the current template.'
		},
		{
			question: 'Can a campaign send a language the template does not have?',
			answer:
				'No. A campaign can only send the languages its template contains. If the template is Czech and English, a German contact gets the primary language.'
		},
		{
			question: 'Do my existing campaigns change?',
			answer:
				'No. Campaigns sent before this feature keep working exactly as before. Only campaigns that use a template with more than one language become multilingual.'
		},
		{
			question: 'Can I see which language each person received?',
			answer:
				'Yes. The campaign detail page shows how many people received each language, and the activity list marks each secondary-language recipient with a small language badge. The badge reflects the language at the time of sending, even if the contact changes it later.'
		}
	];
</script>

<FeaturePageLayout
	title="Multilingual Campaigns"
	metaDescription="Send one campaign in several languages. Each contact gets the version that matches their language, with per-language subject, sender, footer, and web version."
	label="Campaigns"
	description="One campaign, every language your audience speaks. Add languages to the template, point Lettr at the contact property that holds each person’s language, and send once."
	related={[
		{ href: '/email-marketing/', label: 'Email Marketing', description: 'Campaigns, audiences, and segments, billed per contact.' },
		{ href: '/platform/templates/', label: 'Visual Editor', description: 'Drag-and-drop email editor powered by Topol.' },
		{ href: '/platform/analytics/', label: 'Analytics & Logs', description: 'Delivery metrics, searchable logs, and webhooks.' }
	]}
>
	{#snippet heading()}
		One campaign.<br />Every contact’s language.
	{/snippet}

	{#snippet children()}
		<!-- How it works -->
		<div bind:this={stepsSection} class="mx-auto max-w-4xl">
			<h2 data-reveal class="mb-3 text-center">How it works</h2>
			<p data-reveal class="mx-auto mb-10 max-w-lg text-center text-body text-muted">
				Three pieces, and the third one needs no setup at all.
			</p>
			<div class="grid gap-5 md:grid-cols-3">
				{#each steps as step, i}
					<div data-reveal class="relative border border-border/50 bg-white p-6">
						<span class="absolute top-6 right-6 font-heading text-xs tracking-[0.15em] text-muted">
							0{i + 1}
						</span>
						<div class="mb-4 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<step.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{step.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{step.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Review & Send preview -->
		<div bind:this={previewSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Know the split before you send</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				The Review & Send step shows which property the language comes from, who gets which version, and who falls back.
			</p>
			<div data-reveal class="border border-border/50 bg-white">
				<div class="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 bg-background px-5 py-3">
					<span class="font-heading text-xs font-semibold text-surface uppercase">Multi-language send</span>
					<span class="text-xs text-muted">
						Language read from <span class="font-code text-surface">communication_language</span>
						<span class="ml-1 border border-border/50 px-1.5 py-0.5 text-[10px] tracking-wide text-muted uppercase">designated</span>
					</span>
				</div>
				<div class="overflow-x-auto">
					<table class="w-full min-w-[560px] text-left text-sm">
						<thead>
							<tr class="border-b border-border/50 text-xs text-muted">
								<th class="px-5 py-2.5 font-medium">Language</th>
								<th class="px-5 py-2.5 font-medium">Recipients</th>
								<th class="px-5 py-2.5 font-medium">Subject</th>
								<th class="px-5 py-2.5 font-medium">Sender</th>
							</tr>
						</thead>
						<tbody>
							{#each previewRows as row}
								<tr class="border-b border-border/50 last:border-b-0">
									<td class="px-5 py-3 whitespace-nowrap">
										<span class="mr-2 inline-block bg-surface px-1.5 py-0.5 font-code text-[10px] font-semibold text-white">{row.code}</span>
										<span class="text-surface">{row.name}</span>
										<span class="ml-1 text-xs text-muted">{row.role}</span>
									</td>
									<td class="px-5 py-3 font-code text-surface">{row.recipients}</td>
									<td class="px-5 py-3 text-surface">
										{row.subject}
										{#if row.custom}
											<span class="ml-1 border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-[10px] tracking-wide text-primary uppercase">custom</span>
										{/if}
									</td>
									<td class="px-5 py-3 whitespace-nowrap text-muted">{row.sender}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-border/50 bg-background px-5 py-3 text-xs text-muted">
					<span><span class="font-code text-surface">312</span> contacts fall back to Czech</span>
					<span>no value <span class="font-code text-surface">×289</span></span>
					<span>unmatched <span class="font-code text-surface">"klingon" ×3</span>, <span class="font-code text-surface">"sk" ×20</span></span>
				</div>
			</div>
		</div>

		<!-- Feature grid -->
		<div bind:this={featuresSection} class="mx-auto mt-20 max-w-4xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Everything travels with the language</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Content, subject, sender, footer, and web version all follow the recipient’s language.
			</p>
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<feature.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{feature.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Details -->
		<div bind:this={detailsSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">The details that matter</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				What happens at the edges: missing values, misspellings, and templates that change after scheduling.
			</p>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each details as item}
					<div data-reveal class="border border-border/50 bg-white p-5">
						<h3 class="mb-2 text-sm font-semibold text-surface">{item.question}</h3>
						<p class="text-sm leading-relaxed text-muted">{item.answer}</p>
					</div>
				{/each}
			</div>
			<p data-reveal class="mt-8 text-center text-sm text-muted">
				Read the launch post:
				<a class="text-primary underline underline-offset-2" href="/blog/introducing-multilingual-campaigns/">Introducing multilingual campaigns</a>
			</p>
		</div>
	{/snippet}
</FeaturePageLayout>
