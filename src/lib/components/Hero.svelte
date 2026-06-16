<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import EditorPreview from './EditorPreview.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

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

	let section: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});
</script>

<!--
	Hero entrance is pure CSS (no gsap) so the LCP heading never waits on the
	animation library to download/parse. The animation runs immediately at first
	paint and is disabled under prefers-reduced-motion.
-->
<style>
	@keyframes hero-enter {
		from {
			opacity: 0;
			transform: translateY(28px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	[data-animate] {
		animation: hero-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
	}

	@media (prefers-reduced-motion: reduce) {
		[data-animate] {
			animation: none;
		}
	}
</style>

<section bind:this={section} class="pt-30 pb-16 border-b border-border/30" id="hero">
	<div class="grid gap-12 lg:grid-cols-1">
		<div class="flex flex-col">
				<a
					data-animate
					style="animation-delay:0s"
					href="/email-marketing/"
					class="group mb-6 inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/5 p-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
					onclick={() => void capturePosthogEvent('hero_announcement_clicked', { href: '/email-marketing/', label: 'Introducing Campaigns' })}
				>
					<span class="bg-primary px-2 py-0.5 text-xs font-bold text-white">New</span>
					Introducing Campaigns — run marketing from the same account
					<span class="transition-transform group-hover:translate-x-0.5">&rarr;</span>
				</a>
				<h1 data-animate style="animation-delay:0.06s" class="text-surface mb-4">
					The email platform<br />
					<span class="text-primary">built for SaaS</span>
				</h1>

				<p data-animate style="animation-delay:0.12s" class="max-w-[650px] text-body text-muted mb-10">
					Build every email in one drag-and-drop editor. Send transactional via API, marketing
					via campaigns. One platform, one bill.
				</p>

				<div data-animate style="animation-delay:0.18s" class="flex flex-wrap items-center mb-3 gap-2">
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
				<p data-animate style="animation-delay:0.24s" class="max-w-md text-sm text-muted">
					3,000 emails/month free. No credit card required.
				</p>

		</div>

		<div data-animate style="animation-delay:0.12s">
			<EditorPreview />
		</div>

		<div data-animate style="animation-delay:0.3s" class="flex flex-col items-center gap-4 py-10 text-sm text-muted">
			<span>Part of the <a href="https://biggood.io/" target="_blank" rel="noopener noreferrer" class="font-semibold text-surface hover:text-primary transition-colors">Big Good</a> group. Sending millions of emails.</span>
			<div class="flex items-center gap-8 opacity-20">
				<img src="/images/logos/topol-icon.svg" alt="Topol" class="h-6" />
				<img src="/images/logos/ecomail-icon.svg" alt="Ecomail" class="h-5" />
				<img src="/images/logos/dmarceye-icon.svg" alt="DMARCeye" class="h-6" />
			</div>
		</div>
	</div>
</section>
