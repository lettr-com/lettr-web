<script lang="ts">
	import { onMount } from 'svelte';
	import type { IntegrationCategory } from '$lib/integrations/types';

	interface Props {
		/** The hub's sections; each one present gets its object on the board. */
		sections: { id: IntegrationCategory; heading: string }[];
	}

	let { sections }: Props = $props();

	interface Placement {
		src: string;
		/** Centre of the sprite, in % of the square stage (also the viewBox units of the cables). */
		x: number;
		y: number;
		/** Sprite width in % of the stage; larger reads nearer. */
		size: number;
		rotate: number;
		/** Where the cable turns on its way to the envelope; level with the object for a straight run. */
		corner: [number, number];
	}

	const centre: [number, number] = [50, 50];

	// One dithered object per section, from Paper's sprite sheets, wired into Lettr in the middle.
	const placements: Record<IntegrationCategory, Placement> = {
		agents: { src: '/integrations/hero/cursor.png', x: 18, y: 17, size: 24, rotate: -6, corner: [50, 17] },
		sdks: { src: '/integrations/hero/braces.png', x: 84, y: 20, size: 27, rotate: 8, corner: [84, 50] },
		platforms: { src: '/integrations/hero/plug.png', x: 88, y: 76, size: 21, rotate: -4, corner: [50, 76] },
		everything: { src: '/integrations/hero/server.png', x: 40, y: 88, size: 22, rotate: 4, corner: [40, 50] },
		connectors: { src: '/integrations/hero/puzzle.png', x: 11, y: 62, size: 22, rotate: 10, corner: [11, 50] }
	};

	const nodes = $derived(
		sections.map((section, index) => ({ ...section, ...placements[section.id], index }))
	);

	const packets: SVGRectElement[] = $state([]);
	const lanes = [0, 1];

	function routeLength(points: [number, number][]) {
		return points.slice(1).reduce((sum, [x, y], i) => sum + Math.hypot(x - points[i][0], y - points[i][1]), 0);
	}

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		// Each packet hops from its object, round the corner, into the envelope, in dither-sized steps.
		const animations = packets.map((packet, i) => {
			const node = nodes[Math.floor(i / lanes.length)];
			const lane = i % lanes.length;
			const route: [number, number][] = [[node.x, node.y], node.corner, centre];
			const total = routeLength(route);
			const turn = total === 0 ? 0.5 : routeLength(route.slice(0, 2)) / total;
			const at = ([x, y]: [number, number]) => `translate(${x}px, ${y}px)`;
			return packet.animate(
				[
					{ transform: at(route[0]), opacity: 0, offset: 0 },
					{ opacity: 1, offset: 0.08 },
					{ transform: at(route[1]), offset: turn },
					{ opacity: 1, offset: 0.9 },
					{ transform: at(route[2]), opacity: 0, offset: 1 }
				],
				{
					duration: total * 70,
					delay: node.index * 650 + lane * total * 35,
					iterations: Infinity,
					easing: `steps(${Math.round(total / 2)}, end)`
				}
			);
		});

		return () => {
			for (const animation of animations) animation.cancel();
		};
	});
</script>

<!-- The switchboard: every family of integrations wired into the Lettr envelope, packets running inward. -->
<div class="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[440px] lg:max-w-none" data-markdown="skip">
	<svg class="absolute inset-0 size-full overflow-visible" viewBox="0 0 100 100" aria-hidden="true">
		<defs>
			<pattern id="board-dots" width="4" height="4" patternUnits="userSpaceOnUse">
				<rect width="0.8" height="0.8" fill="var(--color-primary-outline)" />
			</pattern>
			<radialGradient id="board-fade">
				<stop offset="0.35" stop-color="white" stop-opacity="0.9" />
				<stop offset="1" stop-color="white" stop-opacity="0" />
			</radialGradient>
			<mask id="board-mask">
				<rect width="100" height="100" fill="url(#board-fade)" />
			</mask>
		</defs>
		<rect width="100" height="100" fill="url(#board-dots)" mask="url(#board-mask)" opacity="0.7" />

		{#each nodes as node (node.id)}
			<polyline
				class="cable"
				points="{node.x},{node.y} {node.corner[0]},{node.corner[1]} {centre[0]},{centre[1]}"
			/>
		{/each}
		{#each nodes as node, n (node.id)}
			{#each lanes as lane (lane)}
				<rect
					bind:this={packets[n * lanes.length + lane]}
					class="packet"
					x="-0.8"
					y="-0.8"
					width="1.6"
					height="1.6"
				/>
			{/each}
		{/each}
	</svg>

	<img
		class="absolute top-1/2 left-1/2 w-[54%] -translate-1/2 [image-rendering:pixelated]"
		src="/integrations/hero/envelope.png"
		alt=""
		width="384"
		height="384"
		fetchpriority="high"
		draggable="false"
	/>

	{#each nodes as node (node.id)}
		<a
			href="#{node.id}"
			class="group absolute -translate-1/2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface"
			style:left="{node.x}%"
			style:top="{node.y}%"
			style:width="{node.size}%"
			aria-label={node.heading}
		>
			<img
				class="bob block w-full transition-transform duration-200 ease-out group-hover:scale-105 [image-rendering:pixelated] motion-reduce:transition-none"
				style:rotate="{node.rotate}deg"
				style:animation-delay="{node.index * -1.1}s"
				src={node.src}
				alt=""
				width="384"
				height="384"
				draggable="false"
			/>
			<span
				class="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 bg-white px-2 py-1 text-caption whitespace-nowrap text-surface opacity-0 shadow-panel transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
				aria-hidden="true"
			>
				{node.heading}
			</span>
		</a>
	{/each}
</div>

<style>
	/* Dashes about the size of a dither dot, so the cables read as part of the art. */
	.cable {
		fill: none;
		stroke: var(--color-primary-outline);
		stroke-width: 0.8;
		stroke-dasharray: 1.6 1.6;
	}

	.packet {
		fill: var(--color-primary);
		opacity: 0;
	}

	.bob {
		animation: bob 5.5s ease-in-out infinite;
	}

	@keyframes bob {
		0%,
		100% {
			translate: 0 0;
		}
		50% {
			translate: 0 -5%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.bob {
			animation: none;
		}
	}
</style>
