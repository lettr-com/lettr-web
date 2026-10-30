<script lang="ts" module>
	/** Set when the live field ran too slowly; holds until the next full page load. */
	let liveArtTooSlow = false;
</script>

<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import HeroArtStatic from './HeroArtStatic.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	let registerHref: string = $state(registerUrl);
	let artHost: HTMLElement | undefined = $state();
	let LiveArt: Component<{ onfail?: () => void }> | null = $state(null);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
		return enhanceArt();
	});

	/*
	 * The baked stills are the hero. On a large screen with a mouse, once the art is in view
	 * and the browser is idle, the live canvas (its own chunk, with its sprites) loads over
	 * them. Phones, reduced motion and Save-Data never download it. The media query is
	 * followed live, so resizing or toggling reduced motion switches between the two.
	 */
	function enhanceArt(): (() => void) | undefined {
		const host = artHost;
		const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
		if (!host || saveData) return;
		const query = window.matchMedia(
			'(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
		);

		let io: IntersectionObserver | undefined;
		let cancelIdle: (() => void) | undefined;
		const load = () => {
			import('./EnvelopeDither.svelte')
				.then((module) => {
					if (query.matches && !liveArtTooSlow) LiveArt = module.default;
				})
				.catch(() => {});
		};
		const arm = () => {
			if (io || LiveArt || liveArtTooSlow) return;
			io = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				io?.disconnect();
				// Safari has no requestIdleCallback
				if ('requestIdleCallback' in window) {
					const handle = requestIdleCallback(load, { timeout: 3000 });
					cancelIdle = () => cancelIdleCallback(handle);
				} else {
					const handle = setTimeout(load, 200);
					cancelIdle = () => clearTimeout(handle);
				}
			});
			io.observe(host);
		};
		const disarm = () => {
			io?.disconnect();
			io = undefined;
			cancelIdle?.();
			cancelIdle = undefined;
			LiveArt = null;
		};
		const onChange = () => (query.matches ? arm() : disarm());

		onChange();
		query.addEventListener('change', onChange);
		return () => {
			query.removeEventListener('change', onChange);
			disarm();
		};
	}

	function stopLiveArt() {
		liveArtTooSlow = true;
		LiveArt = null;
	}

	function trackHeroCta(label: string, href: string, variant: 'primary' | 'secondary') {
		void capturePosthogEvent('cta_clicked', {
			placement: 'home_hero',
			label,
			href,
			variant,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (label === 'Get started') {
			trackSignupClick('home_hero', href);
		}
	}

	const badges = ['EU-hosted', 'GDPR & CCPA compliant', 'No credit card required'];
</script>

<section id="hero" class="relative -mx-6 overflow-hidden border-b border-border/30 px-6 pt-16 pb-0 md:pt-32">
	<div class="pointer-events-none absolute -top-48 left-1/2 h-[360px] w-[min(1100px,140%)] -translate-x-1/2 bg-primary opacity-35 blur-[130px]" aria-hidden="true"></div>

	<div class="relative mx-auto flex max-w-[820px] flex-col items-center text-center">
		<a
			href="/email-marketing/"
			class="group mb-8 inline-flex items-center gap-2 border border-primary/20 bg-white p-1 pr-3 text-sm text-surface transition-colors hover:border-primary/50"
			onclick={() => void capturePosthogEvent('hero_announcement_clicked', { href: '/email-marketing/', label: 'Introducing Campaigns' })}
		>
			<span class="bg-primary-strong px-2 py-0.5 text-xs font-bold text-white">New</span>
			Introducing Campaigns<span class="hidden sm:inline">: run marketing from the same account</span>
			<span class="text-primary transition-transform group-hover:translate-x-0.5">&rarr;</span>
		</a>

		<h1
			class="mb-6 text-[2.25rem] leading-[1.06] font-normal tracking-[-0.025em] text-surface sm:text-[3.5rem] lg:text-[4rem]"
		>
			Transactional and marketing email<br />
			<span class="font-serif text-[2.625rem] font-medium text-primary italic sm:text-[4rem] lg:text-[4.5rem]">built for SaaS</span>
		</h1>

		<p class="mb-8 max-w-[640px] text-[1.0625rem] text-muted md:text-body">
			Your team builds every email in one editor. You send transactional by API and marketing by
			campaign. One platform, one bill.
		</p>

		<div class="mb-5 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
			<Button
				variant="primary"
				size="hero"
				href={registerHref}
				onclick={() => trackHeroCta('Get started', registerHref, 'primary')}
			>Get started</Button>
			<Button
				variant="secondary"
				size="hero"
				href="https://docs.lettr.com/introduction"
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => trackHeroCta('See docs', 'https://docs.lettr.com/introduction', 'secondary')}
			>See docs</Button>
		</div>

		<ul class="mb-10 flex flex-wrap md:mb-14 items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
			{#each badges as badge}
				<li class="inline-flex items-center gap-2">
					<span class="block h-1.5 w-1.5 bg-primary"></span>
					{badge}
				</li>
			{/each}
		</ul>
	</div>

	<div bind:this={artHost} class="relative -mx-6 narrow:-mx-6">
		<HeroArtStatic />
		{#if LiveArt}
			<div class="absolute inset-0">
				<LiveArt onfail={stopLiveArt} />
			</div>
		{/if}
	</div>
</section>
