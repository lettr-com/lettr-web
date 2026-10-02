<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import DitherEdge from './DitherEdge.svelte';
	import EnvelopeDither from './EnvelopeDither.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});

	function trackHeroCta(label: string, href: string, variant: 'primary' | 'secondary') {
		void capturePosthogEvent('cta_clicked', {
			placement: 'home_hero',
			label,
			href,
			variant,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (label === 'Start sending') {
			trackSignupClick('home_hero', href);
		}
	}

	const badges = ['EU-hosted', 'GDPR & CCPA compliant', 'No credit card required'];
</script>

<style>
	@keyframes hero-enter {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	[data-animate] {
		animation: hero-enter 0.55s cubic-bezier(0.16, 1, 0.3, 1) backwards;
	}

	@media (prefers-reduced-motion: reduce) {
		[data-animate] {
			animation: none;
		}
	}

</style>

<section id="hero" class="relative -mx-6 overflow-hidden border-b border-border/30 px-6 pt-16 pb-0 md:pt-32">
	<div class="pointer-events-none absolute -top-48 left-1/2 h-[360px] w-[min(1100px,140%)] -translate-x-1/2 bg-primary opacity-35 blur-[130px]" aria-hidden="true"></div>

	<div class="relative mx-auto flex max-w-[820px] flex-col items-center text-center">
		<a
			data-animate
			style="animation-delay:0s"
			href="/email-marketing/"
			class="group mb-8 inline-flex items-center gap-2 border border-primary/20 bg-white p-1 pr-3 text-sm text-surface transition-colors hover:border-primary/50"
			onclick={() => void capturePosthogEvent('hero_announcement_clicked', { href: '/email-marketing/', label: 'Introducing Campaigns' })}
		>
			<span class="bg-primary-strong px-2 py-0.5 text-xs font-bold text-white">New</span>
			Introducing Campaigns<span class="hidden sm:inline">: run marketing from the same account</span>
			<span class="text-primary transition-transform group-hover:translate-x-0.5">&rarr;</span>
		</a>

		<h1
			data-animate
			style="animation-delay:0.06s"
			class="mb-6 text-[2.25rem] leading-[1.06] font-normal tracking-[-0.025em] text-surface sm:text-[3.5rem] lg:text-[4rem]"
		>
			The email platform<br />
			<span class="font-serif text-[2.625rem] font-medium text-primary italic sm:text-[4rem] lg:text-[4.5rem]">built for SaaS</span>
		</h1>

		<p data-animate style="animation-delay:0.12s" class="mb-8 max-w-[640px] text-[1.0625rem] text-muted md:text-body">
			Build every email in one drag-and-drop editor. Send transactional via API, marketing via
			campaigns. One platform, one bill.
		</p>

		<div data-animate style="animation-delay:0.18s" class="mb-5 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
			<Button
				variant="primary"
				size="hero"
				href={registerHref}
				onclick={() => trackHeroCta('Start sending', registerHref, 'primary')}
			>Start sending</Button>
			<Button
				variant="secondary"
				size="hero"
				href="https://docs.lettr.com/introduction"
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => trackHeroCta('See docs', 'https://docs.lettr.com/introduction', 'secondary')}
			>See docs</Button>
		</div>

		<ul data-animate style="animation-delay:0.24s" class="mb-10 flex flex-wrap md:mb-14 items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
			{#each badges as badge}
				<li class="inline-flex items-center gap-2">
					<span class="block h-1.5 w-1.5 bg-primary"></span>
					{badge}
				</li>
			{/each}
		</ul>
	</div>

	<div data-animate style="animation-delay:0.3s" class="relative -mx-6 narrow:-mx-6">
		<DitherEdge />
		<EnvelopeDither />
	</div>
</section>
