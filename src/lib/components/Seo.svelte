<script lang="ts">
	import { page } from '$app/state';

	const SITE_URL = 'https://lettr.com';
	const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

	interface Props {
		/** Full <title> text, including any " | Lettr" suffix. */
		title: string;
		description: string;
		/** Open Graph / Twitter title. Defaults to {@link title}. */
		ogTitle?: string;
		/** Open Graph / Twitter description. Defaults to {@link description}. */
		ogDescription?: string;
		type?: 'website' | 'article';
		/** Social share image — absolute URL or root-relative path. */
		image?: string;
		/** Canonical path (e.g. "/about/") or absolute URL. Defaults to the current route. */
		canonical?: string;
	}

	let {
		title,
		description,
		ogTitle,
		ogDescription,
		type = 'website',
		image = DEFAULT_IMAGE,
		canonical
	}: Props = $props();

	function absolute(value: string): string {
		return value.startsWith('http') ? value : `${SITE_URL}${value}`;
	}

	const url = $derived(absolute(canonical ?? page.url.pathname));
	const imageUrl = $derived(absolute(image));
	const socialTitle = $derived(ogTitle ?? title);
	const socialDescription = $derived(ogDescription ?? description);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={socialTitle} />
	<meta property="og:description" content={socialDescription} />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content="Lettr" />
	<meta property="og:locale" content="en_US" />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={url} />
	<meta name="twitter:title" content={socialTitle} />
	<meta name="twitter:description" content={socialDescription} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
