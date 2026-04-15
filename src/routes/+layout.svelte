<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import SplineFooter from '$lib/components/SplineFooter.svelte';
	import Footer from '$lib/components/Footer.svelte';
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
		<title>Lettr — The Email Platform Built for SaaS</title>
		<link rel="canonical" href="https://lettr.com" />

		<!-- Primary Meta Tags -->
		<meta name="title" content="Lettr — The Email Platform Built for SaaS" />
		<meta name="description" content="Developers integrate once. Your team takes over. Transactional and marketing emails in one platform — clean API, drag-and-drop editor, zero dev tickets for content changes." />
		<meta name="keywords" content="SaaS email platform, transactional email API, email for SaaS, developer email API, marketing email SaaS, email delivery, REST API email, SMTP relay, drag-and-drop email editor, email infrastructure" />
		<meta name="author" content="Lettr" />
		<meta name="robots" content="index, follow" />

		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://lettr.com" />
		<meta property="og:title" content="Lettr — The Email Platform Built for SaaS" />
		<meta property="og:description" content="Developers integrate once. Your team takes over. Transactional and marketing emails in one platform — clean API, drag-and-drop editor, zero dev tickets for content changes." />
		<meta property="og:image" content="https://lettr.com/og-image.png" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:site_name" content="Lettr" />
		<meta property="og:locale" content="en_US" />

		<!-- Twitter -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:url" content="https://lettr.com" />
		<meta name="twitter:title" content="Lettr — The Email Platform Built for SaaS" />
		<meta name="twitter:description" content="Developers integrate once. Your team takes over. Transactional and marketing emails in one platform — clean API, drag-and-drop editor, zero dev tickets for content changes." />
		<meta name="twitter:image" content="https://lettr.com/og-image.png" />

		<!-- Structured Data -->
		{@html `<script type="application/ld+json">${JSON.stringify({
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			"name": "Lettr",
			"url": "https://lettr.com",
			"logo": "https://lettr.com/logo.svg",
			"description": "The email platform built for SaaS. Developers integrate once, your team takes over. Transactional and marketing emails — one platform, one reputation, zero dev tickets for content changes.",
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
	<div class="relative mx-auto max-w-4xl narrow:max-w-none border-x border-border/30 narrow:border-x-0 px-6">
		<main class="relative z-10 ">
			{@render children()}
		</main>
		<Footer />
	</div>
</div>

<SplineFooter sceneUrl={splineSceneUrl} />

<CookieBanner />
