<script lang="ts">
	import { onMount } from 'svelte';
	import {
		defaultMinSplineWidth,
		loadSplineViewerScript,
		shouldUseSpline
	} from '$lib/utils/spline';

	interface Props {
		sceneUrl: string;
		minWidth?: number;
		rootMargin?: string;
	}

	let {
		sceneUrl,
		minWidth = defaultMinSplineWidth,
		rootMargin = '400px 0px 400px 0px'
	}: Props = $props();

	let container: HTMLElement | undefined = $state();
	let canUseSpline: boolean = $state(false);
	let isSplineReady: boolean = $state(false);
	let shouldRenderSpline: boolean = $state(false);

	function syncSplineVisibility() {
		canUseSpline = shouldUseSpline({
			width: window.innerWidth,
			prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
			minWidth
		});
		shouldRenderSpline = canUseSpline && isSplineReady;
	}

	onMount(() => {
		syncSplineVisibility();

		const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
		const handleViewportChange = () => syncSplineVisibility();

		window.addEventListener('resize', handleViewportChange, { passive: true });
		reducedMotionMedia.addEventListener('change', handleViewportChange);

		let observer: IntersectionObserver | undefined;
		if (container) {
			observer = new IntersectionObserver(
				(entries) => {
					const isNearViewport = entries.some((entry) => entry.isIntersecting);
					if (!isNearViewport || !canUseSpline || isSplineReady) return;

					loadSplineViewerScript()
						.then(() => {
							isSplineReady = true;
							syncSplineVisibility();
						})
						.catch(() => {
							isSplineReady = false;
							shouldRenderSpline = false;
						});

					observer?.disconnect();
				},
				{ rootMargin }
			);

			observer.observe(container);
		}

		return () => {
			window.removeEventListener('resize', handleViewportChange);
			reducedMotionMedia.removeEventListener('change', handleViewportChange);
			observer?.disconnect();
		};
	});
</script>

<div bind:this={container} class="fixed inset-x-0 bottom-0 z-0 h-[30vh]">
	{#if shouldRenderSpline}
		<spline-viewer url={sceneUrl} style="width: 100%; height: 100%;"></spline-viewer>
	{/if}
</div>
