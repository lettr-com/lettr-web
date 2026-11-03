<script lang="ts">
	import { onMount } from 'svelte';
	import CreditCard from 'phosphor-svelte/lib/CreditCard';
	import GlobeHemisphereWest from 'phosphor-svelte/lib/GlobeHemisphereWest';
	import ShieldCheck from 'phosphor-svelte/lib/ShieldCheck';
	import Button from '$lib/components/Button.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';
	import { createOrbit, orbitBodies, poseAt, type OrbitBody } from './heroOrbit';

	const maxFrameSeconds = 0.1;
	const tooltipMargin = 16;
	const navHeight = 72;

	let registerHref: string = $state(registerUrl);
	let stage: HTMLElement | undefined = $state();
	let stageFrame: HTMLElement | undefined = $state();
	const tooltips: HTMLElement[] = $state([]);
	let activeIndex: number | null = $state(null);
	let isTooltipBelow = false;

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

	// Sprites are placed in % of their own box, so the same pose holds at any stage size,
	// in the prerendered markup as well as in the animation.
	function transformFor(body: OrbitBody, angle: number) {
		const pose = poseAt(body, angle);
		const x = (pose.x / body.size) * 100 - 50;
		const y = (pose.y / body.size) * 100 - 50;
		return `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) scale(${pose.scale.toFixed(4)}) rotate(${pose.rotation.toFixed(2)}deg)`;
	}

	// Behind the globe (z-index 2) or in front of it, nearest on top.
	function layerFor(body: OrbitBody, angle: number) {
		const pose = poseAt(body, angle);
		return pose.isBehind ? 1 : 3 + Math.round(pose.scale * 10);
	}

	const badges = [
		{ label: 'EU-hosted', icon: GlobeHemisphereWest },
		{ label: 'GDPR & CCPA compliant', icon: ShieldCheck },
		{ label: 'No credit card required', icon: CreditCard }
	];

	const initial = createOrbit(orbitBodies).states;

	function closeTooltip(index: number) {
		if (activeIndex === index) activeIndex = null;
	}

	function handleWindowPointerDown(event: PointerEvent) {
		if (!(event.target instanceof Element) || !event.target.closest('[data-orbit-body]')) activeIndex = null;
	}

	// The tooltip rides along with its icon, keeping its side until that side runs off the window.
	function placeTooltip() {
		const tooltip = activeIndex === null ? undefined : tooltips[activeIndex];
		if (activeIndex === null || !tooltip || !stage || !stageFrame) return;
		const sprite = stage.querySelectorAll('[data-orbit-body]')[activeIndex].getBoundingClientRect();
		const frame = stageFrame.getBoundingClientRect();
		const { offsetWidth: width, offsetHeight: height } = tooltip;

		const above = sprite.top - height;
		const below = sprite.bottom;
		const fitsAbove = above >= navHeight;
		const fitsBelow = below + height <= window.innerHeight;
		if (isTooltipBelow ? !fitsBelow && fitsAbove : !fitsAbove && fitsBelow) isTooltipBelow = !isTooltipBelow;

		const centred = sprite.left + sprite.width / 2 - width / 2;
		const left = Math.max(tooltipMargin, Math.min(centred, document.documentElement.clientWidth - width - tooltipMargin));
		const top = isTooltipBelow ? below : above;
		tooltip.style.transform = `translate(${left - frame.left}px, ${top - frame.top}px)`;
	}

	$effect(() => {
		if (activeIndex === null || !stage) return;
		const sprite = stage.querySelectorAll('[data-orbit-body]')[activeIndex].getBoundingClientRect();
		const square = stage.getBoundingClientRect();
		// Left of the globe, the space above an icon belongs to the copy.
		isTooltipBelow = sprite.left + sprite.width / 2 < square.left + square.width / 2;
		placeTooltip();
	});

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		const sprites = stage ? Array.from(stage.querySelectorAll<HTMLElement>('[data-orbit-body]')) : [];
		if (!sprites.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const orbit = createOrbit(orbitBodies);
		let frame = 0;
		let last = 0;

		function tick(now: number) {
			orbit.advance(Math.min((now - last) / 1000, maxFrameSeconds));
			last = now;
			orbit.states.forEach((state, i) => {
				const sprite = sprites[i];
				sprite.style.visibility = state.isParked ? 'hidden' : 'visible';
				if (state.isParked) {
					closeTooltip(i);
					return;
				}
				sprite.style.transform = transformFor(orbitBodies[i], state.angle);
				sprite.style.zIndex = String(layerFor(orbitBodies[i], state.angle));
			});
			placeTooltip();
			frame = requestAnimationFrame(tick);
		}

		const observer = new IntersectionObserver(([entry]) => {
			cancelAnimationFrame(frame);
			if (!entry.isIntersecting) return;
			last = performance.now();
			frame = requestAnimationFrame(tick);
		});
		observer.observe(stage!);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});
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

	/* Orbits run past the 1200px page frame; only the window may clip them. */
	:global(html:has(.orbit-hero)) {
		overflow-x: clip;
	}

	/* --stage is the orbit's square. Everything inside it scales from this one length. */
	.orbit-hero {
		--stage: min(100vw, 640px);
	}

	/* Above the copy and the next section so a tooltip is never cut off; only the icons take the pointer. */
	.orbit-stage {
		position: relative;
		z-index: 30;
		height: calc(var(--stage) * 0.8);
	}

	.orbit-square {
		position: absolute;
		top: 50%;
		left: 50%;
		width: var(--stage);
		height: var(--stage);
		transform: translate(-50%, -50%);
		pointer-events: none;
	}

	/* The art fills 83% of the 384px file, so 81.6% of the stage makes a disc 68% wide. */
	.orbit-globe {
		position: absolute;
		top: 9.2%;
		left: 9.2%;
		z-index: 2;
		width: 81.6%;
		height: 81.6%;
		max-width: none;
		rotate: 5.81deg;
		image-rendering: pixelated;
		/* Round hit area: blocks an icon behind the disc, but not one showing past its edge. */
		clip-path: circle(44%);
		pointer-events: auto;
	}

	.orbit-body {
		position: absolute;
		top: 50%;
		left: 50%;
		aspect-ratio: 1;
		max-width: none;
		cursor: pointer;
		pointer-events: auto;
		will-change: transform;
	}

	.orbit-body:focus-visible {
		outline: 2px solid var(--color-primary);
	}

	.orbit-tooltip {
		position: absolute;
		top: 0;
		left: 0;
		width: min(240px, calc(100vw - 32px));
		pointer-events: none;
		visibility: hidden;
	}

	/* All five stay in the prerendered markup so crawlers and the markdown twin can read them. */
	.orbit-tooltip.is-active {
		visibility: visible;
		animation: tooltip-enter 0.14s ease-out;
	}

	@keyframes tooltip-enter {
		from {
			opacity: 0;
		}
	}

	@media (min-width: 1200px) {
		.orbit-hero {
			--stage: clamp(640px, min(60vw, 105vh), 1040px);
			min-height: calc(var(--stage) * 0.9 + 60px);
		}

		/* Stays off the right edge on small laptops, and near the content on wide screens. */
		.orbit-stage {
			position: absolute;
			top: calc(60px + var(--stage) * 0.47);
			left: calc(50% + min(50vw - var(--stage) * 0.5, 300px));
			height: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		[data-animate],
		.orbit-tooltip.is-active {
			animation: none;
		}
	}
</style>

<svelte:window
	onpointerdown={handleWindowPointerDown}
	onkeydown={(event) => {
		if (event.key === 'Escape') activeIndex = null;
	}}
/>

<section id="hero" class="orbit-hero relative pt-page">
	<div class="relative z-20 flex flex-col items-start gap-6">
		<h1 data-animate class="flex flex-col items-start text-[clamp(2rem,10.2vw,3.5rem)] leading-[1.15] font-normal tracking-[-0.025em] text-surface">
			<span>Transactional and<br />marketing email</span>
			<span class="font-serif text-[clamp(2.3rem,11.7vw,4rem)] text-primary italic">built for SaaS</span>
		</h1>

		<p data-animate style="animation-delay:0.06s" class="max-w-[489px] text-[1.125rem] leading-[1.6] text-surface">
			Your team builds every email in one editor.<br class="hidden sm:inline" />
			You send <span class="font-semibold">transactional</span> by API and <span class="font-semibold">marketing</span> by campaign.<br class="hidden sm:inline" />
			One platform, one bill.
		</p>

		<div data-animate style="animation-delay:0.12s" class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
			<Button
				variant="primary"
				class="h-16 w-full text-body sm:w-[200px]"
				href={registerHref}
				onclick={() => trackHeroCta('Get started', registerHref, 'primary')}
			>Get started</Button>
			<Button
				variant="secondary"
				class="h-16 w-full text-body sm:w-[200px]"
				href="https://docs.lettr.com/introduction"
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => trackHeroCta('See docs', 'https://docs.lettr.com/introduction', 'secondary')}
			>See docs</Button>
		</div>

		<ul data-animate style="animation-delay:0.18s" class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
			{#each badges as badge (badge.label)}
				<li class="inline-flex items-center gap-1.5 last:basis-full">
					<badge.icon size={18} weight="fill" class="shrink-0 text-primary" aria-hidden="true" />
					{badge.label}
				</li>
			{/each}
		</ul>
	</div>

	<div class="orbit-stage mt-4 min-[1200px]:mt-0" bind:this={stageFrame}>
		<div class="orbit-square" data-markdown="skip" bind:this={stage}>
			<img class="orbit-globe" src="/home/orbit/globe.png" alt="" width="384" height="384" fetchpriority="high" />
			{#each orbitBodies as body, i (body.id)}
				<button
					type="button"
					data-orbit-body
					class="orbit-body"
					aria-label={body.title}
					aria-describedby="orbit-tooltip-{body.id}"
					style:width="{body.size * 100}%"
					style:transform={transformFor(body, initial[i].angle)}
					style:z-index={layerFor(body, initial[i].angle)}
					style:visibility={initial[i].isParked ? 'hidden' : 'visible'}
					onmouseenter={() => (activeIndex = i)}
					onmouseleave={() => closeTooltip(i)}
					onfocus={() => (activeIndex = i)}
					onblur={() => closeTooltip(i)}
					onclick={() => (activeIndex = i)}
				>
					<img class="block w-full" src={body.src} alt="" width="384" height="384" draggable="false" />
				</button>
			{/each}
		</div>

		{#each orbitBodies as body, i (body.id)}
			<div
				bind:this={tooltips[i]}
				id="orbit-tooltip-{body.id}"
				role="tooltip"
				class="orbit-tooltip bg-surface p-4 text-white"
				class:is-active={activeIndex === i}
			>
				<p class="font-heading text-[1.0625rem] leading-[1.3] tracking-[-0.01em] text-balance">{body.title}</p>
				<p class="mt-1.5 text-sm leading-[1.5] text-pretty text-white/80">{body.story}</p>
			</div>
		{/each}
	</div>
</section>
