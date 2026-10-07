<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import '../styles/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import { bootIntercom } from '$lib/intercom';
	import { persistUtmParamsFromUrl } from '$lib/utils/utm';

	let { children } = $props();

	const isHomeRoute = $derived(page.url.pathname === '/');

	onMount(() => {
		persistUtmParamsFromUrl(new URL(window.location.href));
		bootIntercom();
	});
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="48x48" />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="icon" href="/favicon.png" type="image/png" />
	<link rel="alternate" type="application/atom+xml" title="Lettr Blog" href="/blog/feed.xml" />
	{#if isHomeRoute}
		<title>Lettr — The Email Platform Built for SaaS</title>
		<link rel="canonical" href="https://lettr.com/" />

		<!-- Primary Meta Tags -->
		<meta name="title" content="Lettr — The Email Platform Built for SaaS" />
		<meta name="description" content="Transactional and marketing email in one platform. Developers integrate once via a clean API; your team ships content with a drag-and-drop editor." />
		<meta name="keywords" content="SaaS email platform, transactional email API, email for SaaS, developer email API, marketing email SaaS, email delivery, REST API email, SMTP relay, drag-and-drop email editor, email infrastructure" />
		<meta name="author" content="Lettr" />
		<meta name="robots" content="index, follow" />

		<!-- Open Graph / Facebook -->
		<meta property="og:type" content="website" />
		<meta property="og:url" content="https://lettr.com/" />
		<meta property="og:title" content="Lettr — The Email Platform Built for SaaS" />
		<meta property="og:description" content="Transactional and marketing email in one platform. Developers integrate once via a clean API; your team ships content with a drag-and-drop editor." />
		<meta property="og:image" content="https://lettr.com/og-image.png" />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
		<meta property="og:site_name" content="Lettr" />
		<meta property="og:locale" content="en_US" />

		<!-- Twitter -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:url" content="https://lettr.com/" />
		<meta name="twitter:title" content="Lettr — The Email Platform Built for SaaS" />
		<meta name="twitter:description" content="Transactional and marketing email in one platform. Developers integrate once via a clean API; your team ships content with a drag-and-drop editor." />
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
					"description": "Transactional and marketing email in one platform. Developers integrate once via a clean API; your team ships content with a drag-and-drop editor.",
					"applicationCategory": "BusinessApplication",
					"operatingSystem": "Web"
				}
			]
		})}<\/script>`}
	{/if}

</svelte:head>

<a
	href="#main-content"
	class="fixed top-3 left-3 z-[100] -translate-y-24 bg-white px-4 py-2 text-sm font-semibold text-surface shadow-lg transition-transform focus:translate-y-0 focus:outline-2 focus:outline-offset-2 focus:outline-primary motion-reduce:transition-none"
>
	Skip to content
</a>

<Navbar />

<div class="relative z-10 bg-background">
	<div class="relative mx-auto max-w-[1200px] narrow:max-w-none border-x border-border/30 narrow:border-x-0 px-6">
		<main id="main-content" tabindex="-1" class="relative z-10 focus:outline-none">
			{@render children()}
		</main>
	</div>
	<Footer />
</div>


<CookieBanner />
