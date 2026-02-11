<script lang="ts">
	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import BorderLinesCanvas from '$lib/components/BorderLinesCanvas.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Lettr — Email delivery that just works</title>
	<link rel="icon" href="/logo-icon.svg" type="image/svg+xml" />
	<script type="module" src="https://unpkg.com/@splinetool/viewer@1.12.52/build/spline-viewer.js"></script>
</svelte:head>

<Navbar />

<div class="relative z-10 mb-[30vh] bg-background">
	<div class="relative mx-auto min-h-screen max-w-[600px] narrow:max-w-none border-x border-border/30 narrow:border-x-0">
		<BorderLinesCanvas />
		<main class="relative z-10">
			{@render children()}
		</main>
	</div>
</div>

<div class="fixed inset-x-0 bottom-0 z-0 h-[30vh]">
	<spline-viewer url="https://prod.spline.design/dMdfll98hZskLD9o/scene.splinecode" style="width: 100%; height: 100%;"></spline-viewer>
</div>
