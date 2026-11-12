<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import GetStartedButton from '$lib/components/home/GetStartedButton.svelte';
	import ProofStrip from '$lib/components/home/ProofStrip.svelte';
	import DitherSide from '$lib/components/home/DitherSide.svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { jsonLdScript } from '$lib/utils/jsonLd';
	import { basicPageJsonLd } from '$lib/utils/pageJsonLd';
	import {
		ecomailOrganizations,
		emailInfraSince,
		emailInfraYears,
		monthlyEmails,
		topolCompanies
	} from '$lib/data/company';

	const team = [
		{ name: 'Jakub', role: 'CEO', photo: '/about/team/jakub.webp' },
		{ name: 'Tomas', role: 'CTO', photo: '/about/team/tomas.webp' },
		{ name: 'Martin', role: 'CCO, Commercial', photo: '/about/team/martin.webp' },
		{ name: 'Erik', role: 'Head of Customer Engineering', photo: '/about/team/erik.webp' },
		{ name: 'Adam', role: 'Head of Design & Creative', photo: '/about/team/adam.webp' }
	];

	const stats = [
		{ value: monthlyEmails, label: 'emails our servers send a month', shortLabel: 'emails a month' },
		{ value: topolCompanies, label: 'companies use our email editor', shortLabel: 'companies use Topol' },
		{ value: ecomailOrganizations, label: 'organizations run campaigns with us', shortLabel: 'organizations on Ecomail' }
	];

	const before = [
		'Two integrations.',
		'Two bills.',
		'Two places to edit a template.',
		'A ticket for every button change.'
	];
	const withLettr = [
		'One account.',
		'One integration for developers.',
		'One editor for everyone else.',
		'Separate lanes, so a campaign never holds up a password reset.'
	];

	const products = [
		{
			name: 'Ecomail',
			icon: '/images/logos/ecomail-icon.svg',
			domain: 'ecomail.cz',
			href: 'https://ecomail.cz',
			description: `Email marketing for ${ecomailOrganizations} organizations since ${emailInfraSince}. It taught us to send at volume.`
		},
		{
			name: 'Topol',
			icon: '/images/logos/topol-icon.svg',
			domain: 'topol.io',
			href: 'https://topol.io',
			description: `The drag-and-drop editor ${topolCompanies} companies use, and the one inside Lettr.`
		},
		{
			name: 'DMARCeye',
			icon: '/images/logos/dmarceye-icon.svg',
			domain: 'dmarceye.com',
			href: 'https://dmarceye.com',
			description: 'DMARC monitoring and reporting. It’s why every Lettr domain gets SPF, DKIM and DMARC.'
		}
	];

	const principles = [
		{
			title: 'Email is infrastructure.',
			description:
				'A password reset that arrives ten minutes late is a broken product. We treat sending and logs that way.'
		},
		{
			title: 'Developers integrate once.',
			description:
				'REST API, SMTP relay and SDKs for seven languages. Wire it up once and get back to your product.'
		},
		{
			title: 'Everyone else gets an editor.',
			description:
				'Product and marketing change templates and send campaigns themselves, without a developer ticket.'
		},
		{
			title: 'Your data stays in the EU.',
			description:
				'Every plan runs on EU-hosted infrastructure, including the free one, so your data stays under EU jurisdiction.'
		}
	];

	function trackTalkToUs() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'about_hero',
			label: 'Talk to us',
			href: '/demo/',
			variant: 'secondary',
			destination_type: 'internal'
		});
	}

	function trackProductClick(name: string, href: string) {
		void capturePosthogEvent('cta_clicked', {
			placement: 'about_family',
			label: name,
			href,
			destination_type: 'external'
		});
	}

	const h2Class =
		'type-h2 text-balance text-surface';
	const accentClass = 'type-accent text-primary';
	// One cell of the 72-cell art is 2px on phones and 3px from md up.
	const artClass =
		'pointer-events-none -my-2 w-36 self-end [image-rendering:pixelated] md:absolute md:top-6 md:my-0 md:w-[216px]';
	const introClass = 'type-lead text-pretty text-muted';
</script>

<Seo
	title="About Lettr — the Team Behind Your Email Platform"
	description="The story behind Lettr — built by a team with {emailInfraYears} years in email infrastructure, sending {monthlyEmails} emails monthly across the globe."
	ogTitle="About Lettr"
	ogDescription="Built by a team with {emailInfraYears} years in email infrastructure, sending {monthlyEmails} emails monthly across the globe."
/>

<svelte:head>
	{@html jsonLdScript(basicPageJsonLd({ path: '/about/', name: 'About Lettr', type: 'AboutPage' }))}
</svelte:head>

<section aria-labelledby="about-heading" class="relative -mx-6 overflow-hidden border-b border-border/30 px-6 pt-page pb-14 md:pb-24">
	<div class="pointer-events-none absolute -top-48 left-1/2 h-[360px] w-[min(1100px,140%)] -translate-x-1/2 bg-primary opacity-[0.28] blur-[130px]" aria-hidden="true"></div>

	<div class="relative mx-auto flex max-w-content flex-col items-center text-center">
		<h1
			id="about-heading"
			class="mb-6 type-display text-balance text-surface"
		>
			We’ve been doing email<br />
			<span class="type-accent leading-[1.15] text-primary">since {emailInfraSince}.</span>
		</h1>

		<p class="mb-8 max-w-[620px] type-lead text-muted">
			Lettr is the email platform for SaaS. We build it in Europe, as the team behind Ecomail, Topol and DMARCeye.
		</p>

		<div class="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
			<GetStartedButton placement="about_hero" />
			<Button variant="secondary" size="lg" href="/demo/" onclick={trackTalkToUs}>Talk to us</Button>
		</div>
	</div>

	<ul aria-label="The Lettr team" class="relative mx-auto mt-14 grid max-w-wide grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 md:mt-20 lg:grid-cols-5">
		{#each team as person}
			<li class="flex flex-col gap-3.5">
				<img
					src={person.photo}
					alt=""
					width="480"
					height="480"
					decoding="async"
					class="aspect-square w-full bg-hairline object-cover"
				/>
				<div class="flex flex-col gap-0.5">
					<p class="font-heading text-lg leading-6 text-surface">{person.name}</p>
					<p class="text-sm leading-5 text-subtle">{person.role}</p>
				</div>
			</li>
		{/each}
	</ul>
</section>

<div class="-mx-6 border-b border-border/30 px-6">
	<ProofStrip {stats} />
</div>

<section aria-labelledby="why-heading" class="py-14 md:pt-28 md:pb-26">
	<div class="mx-auto mb-10 flex max-w-[600px] flex-col items-center gap-4 text-center md:mb-14">
		<h2 id="why-heading" class={h2Class}>
			Email shouldn’t need<br />
			<em class={accentClass}>two separate tools.</em>
		</h2>
		<p class={introClass}>
			Setting up email for a SaaS product used to mean an API for password resets and a marketing platform for everything
			else. We built the one platform we wanted instead.
		</p>
	</div>

	<div class="mx-auto grid max-w-wide gap-4 md:grid-cols-2 md:gap-5">
		<div class="relative flex min-h-[340px] flex-col justify-between gap-6 overflow-hidden border border-white/15 bg-muted p-6 md:h-[440px] md:gap-10 md:p-9">
			<h3 class="type-h3 text-white">
				Before.
			</h3>
			<img src="/about/before.png" alt="" width="72" height="72" class="{artClass} md:right-6" />
			<ul class="flex flex-col gap-3 md:gap-3.5">
				{#each before as line}
					<li class="font-heading text-lg leading-6 text-white/72 md:text-[1.375rem] md:leading-7">{line}</li>
				{/each}
			</ul>
		</div>

		<div class="relative flex min-h-[340px] flex-col justify-between gap-6 overflow-hidden bg-primary p-6 md:h-[440px] md:gap-10 md:p-9">
			<DitherSide color="#d40e43" variant="ripple" width={20} />
			<h3 class="relative font-serif text-4xl leading-none text-white italic md:text-[2.5rem]">With Lettr.</h3>
			<img src="/about/with-lettr.png" alt="" width="72" height="72" class="{artClass} md:right-10" />
			<ul class="relative flex flex-col gap-3 pr-4 md:gap-3.5">
				{#each withLettr as line}
					<li class="font-heading text-lg leading-6 text-white md:text-[1.375rem] md:leading-7">{line}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section aria-labelledby="family-heading" class="-mx-6 border-t border-border/30 px-6 py-14 md:py-26">
	<div class="mx-auto mb-10 flex max-w-[760px] flex-col items-center gap-4 text-center md:mb-14">
		<h2 id="family-heading" class={h2Class}>
			From the team behind<br />
			<em class={accentClass}>Ecomail, Topol and DMARCeye.</em>
		</h2>
		<p class="max-w-[560px] {introClass}">
			Lettr is part of the Big Good group. Each of our other products taught us something Lettr is built on.
		</p>
	</div>

	<ul class="mx-auto grid max-w-wide gap-4 md:grid-cols-3 md:gap-5">
		{#each products as product}
			<li>
				<a
					href={product.href}
					target="_blank"
					rel="noopener noreferrer"
					class="group flex h-full flex-col gap-7 border border-border/40 bg-white p-6 transition-colors hover:border-primary/30 md:p-8"
					onclick={() => trackProductClick(product.name, product.href)}
				>
					<div class="flex items-center justify-between">
						<span class="flex h-11 w-11 shrink-0 items-center justify-center border border-border/50 bg-background">
							<img src={product.icon} alt="" class="h-[22px] w-[22px] object-contain" />
						</span>
						<span class="text-sm font-semibold text-primary">
							{product.domain}
							<span class="inline-block transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
						</span>
					</div>
					<div class="flex flex-col gap-2.5">
						<h3 class="type-h3 text-surface">{product.name}</h3>
						<p class="text-base leading-[25px] text-pretty text-muted">{product.description}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</section>

<section aria-labelledby="principles-heading" class="-mx-6 border-t border-border/30 px-6 pt-14 pb-16 md:pt-26 md:pb-30">
	<div class="mx-auto mb-10 flex max-w-[560px] flex-col items-center gap-4 text-center md:mb-14">
		<h2 id="principles-heading" class={h2Class}>
			How we <em class={accentClass}>work.</em>
		</h2>
		<p class={introClass}>People notice email only when it breaks. These are the rules we build Lettr by.</p>
	</div>

	<ul class="mx-auto grid max-w-wide gap-4 md:grid-cols-2 md:gap-5">
		{#each principles as principle}
			<li class="flex flex-col gap-3 border border-border/40 bg-white p-6 md:p-9">
				<h3 class="type-h3 text-balance text-surface">
					{principle.title}
				</h3>
				<p class="text-base leading-[1.6] text-pretty text-muted md:text-[1.0625rem] md:leading-[27px]">{principle.description}</p>
			</li>
		{/each}
	</ul>
</section>
