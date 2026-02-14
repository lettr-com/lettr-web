<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRightIcon } from 'phosphor-svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { providerList } from '$lib/data/providers';

	let hero: HTMLElement | undefined = $state();
	let gridSection: HTMLElement | undefined = $state();
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

		for (const section of [gridSection, ctaSection]) {
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
</script>

<svelte:head>
	<title>Compare | Lettr</title>
	<meta
		name="description"
		content="See how Lettr compares to other email providers. Switch from Resend, Postmark, SendGrid, Mailgun, or MailerSend and save up to 78%."
	/>
	<link rel="canonical" href="https://lettr.com/compare" />
	<meta property="og:title" content="Compare Email Providers | Lettr" />
	<meta
		property="og:description"
		content="See how Lettr compares to other email providers. Switch from Resend, Postmark, SendGrid, Mailgun, or MailerSend."
	/>
</svelte:head>

<section class="px-4 pt-32 pb-24">
	<!-- Hero -->
	<div bind:this={hero} class="mx-auto max-w-[550px]">
		<span data-animate class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase">
			COMPARE & MIGRATE
		</span>
		<h1 data-animate>
			Switch to Lettr from<br />any provider
		</h1>
		<p data-animate class="mt-6 text-body leading-[1.8] text-muted">
			See how Lettr stacks up against the most popular transactional email providers. Better features, better
			pricing, and a migration path that takes minutes.
		</p>
	</div>

	<!-- Provider Grid -->
	<div bind:this={gridSection} class="mx-auto mt-16 max-w-[550px]">
		<div class="grid gap-4 sm:grid-cols-2">
			{#each providerList as provider}
				<a
					data-reveal
					href="/compare/{provider.slug}"
					class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
				>
					<div class="mb-4 flex items-center gap-3">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
							<img src={provider.logo} alt={provider.name} class="h-5 w-5" />
						</div>
						<span class="text-sm font-semibold text-surface">Lettr vs {provider.name}</span>
					</div>
					<p class="mb-4 flex-1 text-sm leading-relaxed text-muted line-clamp-3">
						{provider.tagline}. {provider.description.split('.')[0]}.
					</p>
					<div class="mt-auto flex items-center justify-between">
						<span class="inline-block border border-primary/20 bg-primary/5 px-2 py-1 text-xs font-semibold text-primary">
							Save up to {provider.averageSavings}%
						</span>
						<span class="flex items-center gap-1 text-sm font-medium text-muted transition-colors group-hover:text-primary">
							Compare
							<ArrowRightIcon
								size={14}
								class="transition-transform duration-200 group-hover:translate-x-1"
							/>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</div>

	<!-- CTA -->
	<div bind:this={ctaSection} class="mx-auto mt-20 max-w-[550px]">
		<div data-reveal class="border border-border/50 bg-white p-8 text-center md:p-12">
			<h2>Ready to switch?</h2>
			<p class="mx-auto mt-3 max-w-lg text-body leading-[1.7] text-muted">
				Migrating to Lettr takes less than 5 minutes. Swap out your mail driver, verify your domain, and you're
				live.
			</p>
			<div class="mt-8">
				<a
					href={registerHref}
					class="bg-primary px-7 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
				>
					Try Lettr free &rarr;
				</a>
			</div>
		</div>
	</div>
</section>
