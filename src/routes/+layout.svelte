<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import SplineFooter from '$lib/components/SplineFooter.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import { bootIntercom } from '$lib/intercom';
	import { persistUtmParamsFromUrl } from '$lib/utils/utm';

	let { children } = $props();

	const splineSceneUrl = 'https://prod.spline.design/dMdfll98hZskLD9o/scene.splinecode';
	const isHomeRoute = $derived(page.url.pathname === '/');

	onMount(() => {
		persistUtmParamsFromUrl(new URL(window.location.href));
		bootIntercom();
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
			"@graph": [
				{
					"@type": "Organization",
					"@id": "https://lettr.com/#organization",
					"name": "Lettr",
					"url": "https://lettr.com",
					"logo": {
						"@type": "ImageObject",
						"url": "https://lettr.com/logo.svg"
					},
					"description": "Lettr is built by the Big Good group — the team behind Topol (40,000+ companies), Ecomail (12,000+ organizations, 12 years of infrastructure), and DMARCeye.",
					"contactPoint": {
						"@type": "ContactPoint",
						"email": "support@lettr.com",
						"contactType": "customer support"
					}
				},
				{
					"@type": "WebSite",
					"@id": "https://lettr.com/#website",
					"name": "Lettr",
					"url": "https://lettr.com",
					"publisher": { "@id": "https://lettr.com/#organization" }
				},
				{
					"@type": "SoftwareApplication",
					"@id": "https://lettr.com/#software",
					"name": "Lettr",
					"url": "https://lettr.com",
					"description": "Lettr is an email platform built exclusively for SaaS companies, combining a clean REST API for developers with a drag-and-drop visual editor for marketing and product teams. Send both transactional and marketing emails from one platform, one domain, one sending reputation.",
					"applicationCategory": "DeveloperApplication",
					"operatingSystem": "Web",
					"offers": [
						{
							"@type": "Offer",
							"name": "Free",
							"price": "0",
							"priceCurrency": "USD",
							"description": "3,000 emails per month, 100 per day limit"
						},
						{
							"@type": "Offer",
							"name": "Pro",
							"price": "15",
							"priceCurrency": "USD",
							"description": "Up to 100,000 emails per month, 10 sending domains"
						},
						{
							"@type": "Offer",
							"name": "Business",
							"price": "110",
							"priceCurrency": "USD",
							"description": "Up to 200,000 emails per month, unlimited domains, dedicated IPs"
						}
					],
					"featureList": [
						"REST API and SMTP relay",
						"Drag-and-drop email editor powered by Topol",
						"SDKs for Laravel, PHP, Node.js, Go, Java, and Rust",
						"Transactional and marketing emails from one platform",
						"SPF, DKIM, and DMARC authentication",
						"Real-time webhooks for delivery events",
						"Searchable email logs",
						"Multilingual template management",
						"Synced sections across templates",
						"Draft and publish workflow with version history",
						"Custom tracking domains"
					],
					"creator": { "@id": "https://lettr.com/#organization" }
				}
			]
		})}<\/script>`}
	{/if}

</svelte:head>

<Navbar />

<div class="relative z-10 bg-background lg:mb-[30vh]">
	<div class="relative mx-auto max-w-4xl narrow:max-w-none border-x border-border/30 narrow:border-x-0 px-6">
		<main class="relative z-10 ">
			{@render children()}
		</main>
	</div>
	<Footer />
</div>

<SplineFooter sceneUrl={splineSceneUrl} />

<CookieBanner />
