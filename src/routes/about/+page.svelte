<script lang="ts">
	import { onMount } from 'svelte';
	import {
		SparkleIcon,
		ShieldCheckIcon,
		EnvelopeSimpleIcon,
		GlobeSimpleIcon,
		ArrowRightIcon
	} from 'phosphor-svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';

	let hero: HTMLElement | undefined = $state();
	let statsSection: HTMLElement | undefined = $state();
	let storySection: HTMLElement | undefined = $state();
	let valuesSection: HTMLElement | undefined = $state();
	let productsSection: HTMLElement | undefined = $state();
	let ctaSection: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		const cleanups: (() => void)[] = [];

		if (hero) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: hero,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
				})
			);
		}

		for (const section of [statsSection, storySection, valuesSection, productsSection, ctaSection]) {
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

	const stats = [
		{ value: '10+', label: 'Years in email infrastructure' },
		{ value: '500M+', label: 'Emails sent per month' },
		{ value: 'Global', label: 'Multi-region delivery' }
	];

	const values = [
		{
			icon: SparkleIcon,
			title: 'Developer experience first',
			description:
				'Every feature starts with "how would a developer want this to work?" If it takes more than 60 seconds to set up, we failed.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Deliverability is not optional',
			description:
				"Sending an email means nothing if it doesn't reach the inbox. We bake deliverability best practices into every layer."
		},
		{
			icon: EnvelopeSimpleIcon,
			title: 'Visibility over black boxes',
			description:
				'You should see exactly what your app sends, how it performs, and when something goes wrong. No more guessing.'
		},
		{
			icon: GlobeSimpleIcon,
			title: 'Honest and transparent',
			description:
				"Simple pricing, no vendor lock-in, open about our limitations. We'd rather tell you what we can't do yet than pretend."
		}
	];

	const products = [
		{
			icon: '/images/logos/lettr-icon.svg',
			name: 'Lettr',
			description:
				'The email API for developer artisans. Send transactional emails, monitor deliverability, and manage templates — all from a single platform built for Laravel.',
			href: 'https://lettr.com'
		},
		{
			icon: '/images/logos/topol-icon.svg',
			name: 'Topol.io',
			description:
				'Drag-and-drop email template editor used by thousands of companies. Design beautiful, responsive emails without touching HTML tables.',
			href: 'https://topol.io'
		},
		{
			icon: '/images/logos/dmarceye-icon.svg',
			name: 'DMARCeye',
			description:
				'Email security and deliverability monitoring. DMARC reporting, SPF and DKIM management, and sender reputation protection.',
			href: 'https://dmarceye.com'
		}
	];
</script>

<svelte:head>
	<title>About | Lettr</title>
	<meta
		name="description"
		content="The story behind Lettr — built by a team with 10+ years in email infrastructure, sending 500M+ emails monthly across the globe."
	/>
	<link rel="canonical" href="https://lettr.com/about" />
	<meta property="og:title" content="About Lettr" />
	<meta
		property="og:description"
		content="Built by a team with 10+ years in email infrastructure, sending 500M+ emails monthly across the globe."
	/>
</svelte:head>

<section class="px-4 pt-32 pb-24">
	<!-- Hero -->
	<div bind:this={hero} class="mx-auto max-w-[550px]">
		<span data-animate class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase">
			ABOUT
		</span>
		<h1 data-animate>
			We've been doing<br />email for a while
		</h1>
		<p data-animate class="mt-6 text-body leading-[1.8] text-muted">
			Lettr is built by a European company that's been running an email marketing and automation platform for over a
			decade. Our infrastructure handles more than 500 million emails per month across the globe — built by passionate
			developers who genuinely enjoy what they do.
		</p>
	</div>

	<!-- Stats -->
	<div bind:this={statsSection} class="mx-auto mt-16 grid max-w-[550px] gap-4 sm:grid-cols-3">
		{#each stats as stat}
			<div data-reveal class="border border-border/50 bg-white p-6 text-center">
				<div class="font-heading text-3xl text-primary">{stat.value}</div>
				<div class="mt-2 text-sm text-muted">{stat.label}</div>
			</div>
		{/each}
	</div>

	<!-- Story: Where we come from -->
	<div bind:this={storySection} class="mx-auto mt-20 max-w-[550px] md:mt-28">
		<div data-reveal class="space-y-6 text-body leading-[1.8] text-muted">
			<h2>Where we come from</h2>
			<p>
				Along the way, we built tools that thousands of companies rely on every day.
				<a
					href="https://topol.io"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
				>
					Topol.io
				</a>
				— a drag-and-drop email template editor used by teams who need to design beautiful emails without wrestling with HTML
				tables and inline CSS. And
				<a
					href="https://dmarceye.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
				>
					DMARCeye.com
				</a>
				— helping businesses protect their sender reputation through DMARC monitoring, SPF, and DKIM management.
			</p>
			<p>
				Through all of that, we kept running into the same frustration. Setting up transactional email in a new project was
				always the worst part. Wire up a mail driver, pick a third-party service, wrestle with DNS records, design templates
				in some clunky external tool, and then just… hope for the best. No easy way to see what your app is actually sending.
				No way to know if your welcome emails are landing in inboxes or spam folders. No alerts when something breaks.
			</p>
		</div>

		<div data-reveal class="mt-12 space-y-6 text-body leading-[1.8] text-muted">
			<h2>Why we built Lettr</h2>
			<p>
				We wanted something different. Something that felt like it belonged in the Laravel ecosystem — elegant, opinionated,
				and just works. Not a generic email API with a PHP wrapper bolted on, but a tool built by people who are passionate
				about getting email right.
			</p>
			<p>
				So we built Lettr. We combined everything we know about email templates from Topol.io, everything we know about
				deliverability from DMARCeye, and over a decade of running email infrastructure at scale into a single, cohesive
				platform.
			</p>
		</div>

		<!-- Values -->
		<div bind:this={valuesSection} class="mt-16">
			<h2 class="mb-8">What we believe in</h2>
			<div class="grid gap-5 sm:grid-cols-2">
				{#each values as value}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<value.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{value.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{value.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Products -->
		<div bind:this={productsSection} class="mt-16">
			<h2 class="mb-3">Our products</h2>
			<p class="mb-8 text-body leading-[1.8] text-muted">
				Lettr is part of a family of email tools, each focused on solving a specific problem really well.
			</p>
			<div class="space-y-4">
				{#each products as product}
					<a
						data-reveal
						href={product.href}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex items-start gap-4 border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
					>
						<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border/50 bg-background">
							<img src={product.icon} alt="" class="h-6 w-6" />
						</div>
						<div>
							<div class="flex items-center gap-2">
								<span class="text-base font-semibold text-surface">{product.name}</span>
								<ArrowRightIcon
									size={14}
									class="text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
								/>
							</div>
							<p class="mt-1 text-sm leading-relaxed text-muted">{product.description}</p>
						</div>
					</a>
				{/each}
			</div>
		</div>

		<!-- CTA -->
		<div bind:this={ctaSection} class="mt-20">
			<div data-reveal class="border border-border/50 bg-white p-8 text-center md:p-12">
				<h2>We'd love to hear from you</h2>
				<p class="mx-auto mt-3 max-w-lg text-body leading-[1.7] text-muted">
					Whether you have questions, feedback, or just want to say hi — our inbox is always open.
				</p>
				<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<a
						href={registerHref}
						class="bg-primary px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
					>
						Try Lettr free &rarr;
					</a>
					<a
						href="mailto:hello@lettr.com"
						class="flex items-center gap-2 px-4 py-3 text-[15px] font-medium text-muted transition-colors hover:text-surface"
					>
						<EnvelopeSimpleIcon size={16} />
						hello@lettr.com
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
