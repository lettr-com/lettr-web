<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import SplineFooter from '$lib/components/SplineFooter.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import { persistUtmParamsFromUrl } from '$lib/utils/utm';

	let { children } = $props();

	const splineSceneUrl = 'https://prod.spline.design/dMdfll98hZskLD9o/scene.splinecode';
	const isHomeRoute = $derived(page.url.pathname === '/');

	onMount(() => {
		persistUtmParamsFromUrl(new URL(window.location.href));
	});
</script>

<svelte:head>
	<link rel="icon" href="/logo-icon.svg" type="image/svg+xml" />
	{#if isHomeRoute}
		<title>Lettr — Developer-Friendly Transactional Email API for Laravel</title>
		<link rel="canonical" href="https://lettr.com" />

		<!-- Primary Meta Tags -->
		<meta name="title" content="Lettr — Developer-Friendly Transactional Email API for Laravel" />
		<meta name="description" content="Send transactional emails at scale with Lettr. A developer-first email delivery API built for Laravel developers. Reliable, fast, and easy to integrate." />
		<meta name="keywords" content="transactional email, email API, Laravel email, email delivery, developer email, Laravel mail driver, email service provider, SMTP alternative, email infrastructure, send email API" />
		<meta name="author" content="Lettr" />
		<meta name="robots" content="index, follow" />

		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://lettr.com" />
		<meta property="og:title" content="Lettr — Developer-Friendly Transactional Email API for Laravel" />
		<meta property="og:description" content="Send transactional emails at scale with Lettr. A developer-first email delivery API built for Laravel developers. Reliable, fast, and easy to integrate." />
		<meta property="og:image" content="https://lettr.com/og-image.png" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:site_name" content="Lettr" />
		<meta property="og:locale" content="en_US" />

		<!-- Twitter -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:url" content="https://lettr.com" />
		<meta name="twitter:title" content="Lettr — Developer-Friendly Transactional Email API for Laravel" />
		<meta name="twitter:description" content="Send transactional emails at scale with Lettr. A developer-first email delivery API built for Laravel developers. Reliable, fast, and easy to integrate." />
		<meta name="twitter:image" content="https://lettr.com/og-image.png" />

		<!-- Structured Data -->
		{@html `<script type="application/ld+json">${JSON.stringify({
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			"name": "Lettr",
			"url": "https://lettr.com",
			"logo": "https://lettr.com/logo.svg",
			"description": "Developer-friendly transactional email API built for Laravel developers. Send emails at scale with a reliable, fast, and easy-to-integrate email delivery service.",
			"applicationCategory": "DeveloperApplication",
			"operatingSystem": "Web",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"creator": {
				"@type": "Organization",
				"name": "Lettr",
				"url": "https://lettr.com",
				"logo": "https://lettr.com/logo.svg",
				"contactPoint": {
					"@type": "ContactPoint",
					"email": "support@lettr.com",
					"contactType": "customer support"
				}
			}
		})}</script>`}
	{/if}

</svelte:head>

<Navbar />

<div class="relative z-10 mb-[30vh] bg-background">
	<div class="relative mx-auto min-h-screen max-w-[624px] narrow:max-w-none border-x border-border/30 narrow:border-x-0">
		<main class="relative z-10">
			{@render children()}
		</main>
	</div>
</div>

<SplineFooter sceneUrl={splineSceneUrl} />

<CookieBanner />
