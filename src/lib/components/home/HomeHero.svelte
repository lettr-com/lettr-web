<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import DitherHero from './DitherHero.svelte';
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

	.hero-grid {
		background-image:
			linear-gradient(to right, rgba(17, 24, 39, 0.05) 1px, transparent 1px),
			linear-gradient(to bottom, rgba(17, 24, 39, 0.05) 1px, transparent 1px);
		background-size: 48px 48px;
		background-position: center top;
		mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));
	}
</style>

<section id="hero" class="relative -mx-6 border-b border-border/30 px-6 pt-32 pb-0">
	<div class="hero-grid pointer-events-none absolute inset-x-0 top-0 h-[520px]" aria-hidden="true"></div>

	<div class="relative mx-auto flex max-w-[820px] flex-col items-center text-center">
		<a
			data-animate
			style="animation-delay:0s"
			href="/email-marketing/"
			class="group mb-8 inline-flex items-center gap-2 border border-primary/20 bg-white p-1 pr-3 text-sm text-surface transition-colors hover:border-primary/50"
			onclick={() => void capturePosthogEvent('hero_announcement_clicked', { href: '/email-marketing/', label: 'Introducing Campaigns' })}
		>
			<span class="bg-primary px-2 py-0.5 text-xs font-bold text-white">New</span>
			Introducing Campaigns: run marketing from the same account
			<span class="text-primary transition-transform group-hover:translate-x-0.5">&rarr;</span>
		</a>

		<h1
			data-animate
			style="animation-delay:0.06s"
			class="mb-6 text-[2.75rem] leading-[1.06] font-medium tracking-[-0.025em] text-surface sm:text-[3.5rem] lg:text-[4rem]"
		>
			The email platform<br />
			<span class="text-primary">built for SaaS</span>
		</h1>

		<p data-animate style="animation-delay:0.12s" class="mb-8 max-w-[640px] text-body text-muted">
			Build every email in one drag-and-drop editor. Send transactional via API, marketing via
			campaigns. One platform, one bill.
		</p>

		<div data-animate style="animation-delay:0.18s" class="mb-5 flex flex-wrap items-center justify-center gap-3">
			<Button
				variant="primary"
				href={registerHref}
				onclick={() => trackHeroCta('Start sending', registerHref, 'primary')}
			>Start sending</Button>
			<Button
				variant="secondary"
				href="https://docs.lettr.com/introduction"
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => trackHeroCta('See docs', 'https://docs.lettr.com/introduction', 'secondary')}
			>See docs</Button>
		</div>

		<ul data-animate style="animation-delay:0.24s" class="mb-14 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
			{#each badges as badge}
				<li class="inline-flex items-center gap-2">
					<span class="block h-1.5 w-1.5 bg-primary"></span>
					{badge}
				</li>
			{/each}
		</ul>
	</div>

	<div data-animate style="animation-delay:0.3s" class="-mx-6 narrow:-mx-6">
		<DitherHero height={460} cell={3} three />
	</div>
</section>
