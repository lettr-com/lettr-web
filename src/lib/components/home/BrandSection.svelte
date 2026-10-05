<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import BrandedEmail from './BrandedEmail.svelte';
	import GetStartedButton from './GetStartedButton.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import {
		brands,
		defaultLayout,
		initialBrandIds,
		pickBrands,
		randomLayout,
		type Brand,
		type EmailKind,
		type Layout
	} from '$lib/home/brands';

	interface Slot {
		kind: EmailKind;
		label: string;
		brand: Brand;
		layout: Layout;
		/** Bumped on every rebrand so the email re-mounts and replays its entrance. */
		run: number;
	}

	const FONTS_HREF =
		'https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bricolage+Grotesque:wght@500;700&family=DM+Serif+Display&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&family=Lora:ital,wght@0,500;1,500&family=Playfair+Display:ital,wght@0,600;1,600&family=Sora:wght@600;700&family=Space+Grotesk:wght@500;700&family=Syne:wght@700;800&display=swap';

	const kinds: { kind: EmailKind; label: string }[] = [
		{ kind: 'marketing', label: 'Marketing email' },
		{ kind: 'ecommerce', label: 'E-commerce email' },
		{ kind: 'transactional', label: 'Transactional email' }
	];

	let slots: Slot[] = $state(
		kinds.map(({ kind, label }, i) => {
			const brand = brands.find((b) => b.id === initialBrandIds[i]) ?? brands[i];
			return { kind, label, brand, layout: defaultLayout(brand), run: 0 };
		})
	);
	let section: HTMLElement | undefined = $state();
	let announcement = $state('');

	function rebrand() {
		const next = pickBrands(slots.length, slots.map((s) => s.brand.id));
		slots = slots.map((slot, i) => ({
			...slot,
			brand: next[i],
			layout: randomLayout(next[i]),
			run: slot.run + 1
		}));
		announcement = `Rebranded as ${next.map((b) => b.name).join(', ')}`;
		void capturePosthogEvent('brand_demo_rebranded', { brands: next.map((b) => b.id).join(',') });
	}

	function loadFonts() {
		if (document.getElementById('brand-demo-fonts')) return;
		const link = document.createElement('link');
		link.id = 'brand-demo-fonts';
		link.rel = 'stylesheet';
		link.href = FONTS_HREF;
		document.head.appendChild(link);
	}

	onMount(() => {
		if (!section) return;
		// The demo fonts are only needed here, so fetch them as the section nears the viewport
		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				loadFonts();
				observer.disconnect();
			},
			{ rootMargin: '900px 0px' }
		);
		observer.observe(section);
		const cleanupReveal = createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
		return () => {
			observer.disconnect();
			cleanupReveal?.();
		};
	});
</script>

<style>
	@keyframes email-enter {
		from {
			opacity: 0;
			transform: translateY(16px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.email-enter {
		animation: email-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
	}

	@media (prefers-reduced-motion: reduce) {
		.email-enter {
			animation: none;
		}
	}
</style>

<section bind:this={section} aria-labelledby="brand-heading" class="pt-14 pb-14 md:pt-24 md:pb-16">
	<div data-reveal class="mx-auto mb-10 flex max-w-[860px] flex-col items-center gap-4 text-center md:mb-14">
		<h2
			id="brand-heading"
			class="font-heading text-balance text-[1.875rem] leading-[1.27] tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			Brand all your emails,
			<em class="block font-serif text-[2.125rem] leading-none font-medium text-primary md:text-[2.875rem]">with a click of a button.</em>
		</h2>
		<p class="max-w-[480px] text-[1.0625rem] leading-[1.5] text-surface md:text-[1.1875rem]">
			Set your brand once. Every email, marketing or transactional, picks it up.
		</p>
	</div>

	<div data-reveal class="mx-auto flex max-w-[1100px] flex-col items-center gap-8 md:gap-10">
		<div
			class="-mx-6 flex w-[calc(100%+3rem)] snap-x snap-mandatory gap-3 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:w-full lg:snap-none lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0"
		>
			{#each slots as slot, i (slot.kind)}
				<figure
					class="relative m-0 h-[400px] w-[min(86vw,340px)] shrink-0 snap-center overflow-hidden bg-primary-soft lg:w-auto"
					aria-label="{slot.label}, {slot.brand.name}"
				>
					{#key slot.run}
						<div class="email-enter absolute top-9 left-1/2 -ml-[150px]" style="animation-delay: {i * 70}ms">
							<BrandedEmail brand={slot.brand} kind={slot.kind} layout={slot.layout} />
						</div>
					{/key}
				</figure>
			{/each}
		</div>

		<div class="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
			<Button variant="secondary" size="hero" onclick={rebrand}>Try another brand</Button>
			<GetStartedButton placement="home_brand" />
		</div>
		<p class="sr-only" aria-live="polite">{announcement}</p>
	</div>
</section>
