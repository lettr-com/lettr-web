<script lang="ts">
	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import BorderLinesCanvas from '$lib/components/BorderLinesCanvas.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Lettr — Email delivery that just works</title>
	<link rel="icon" href="/logo-icon.svg" type="image/svg+xml" />
</svelte:head>

<Navbar />

<div class="relative mx-auto min-h-screen max-w-[600px] narrow:max-w-none border-x border-border/30 narrow:border-x-0">
	<BorderLinesCanvas />
	<main class="relative z-10">
		{@render children()}
	</main>
</div>
