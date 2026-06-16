<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import Button from '$lib/components/Button.svelte';
	import { createFromAnimationCleanup, loadGsap } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();
	let envelope: HTMLElement | undefined = $state();

	const status = $derived(page.status);
	const isNotFound = $derived(status === 404);

	// The route the visitor tried to "deliver" to — shown in the bounce log.
	let badPath = $state('/the-page-you-wanted');
	$effect(() => {
		badPath = page.url.pathname || badPath;
	});

	const heading = $derived(isNotFound ? 'This page bounced.' : 'Something went sideways.');
	const blurb = $derived(
		isNotFound
			? "We tried to deliver it, but the address doesn't exist. Even our deliverability can't save a route that was never registered."
			: 'Our server choked mid-send. The team has been pinged — try again in a moment.'
	);
	const smtpCode = $derived(isNotFound ? '550 5.1.1' : `${status} 4.0.0`);
	const smtpReason = $derived(
		isNotFound ? 'Page not found: the requested route does not exist' : (page.error?.message ?? 'Temporary server failure')
	);

	let floatTween: { kill: () => void } | undefined;

	onMount(() => {
		// Gently float the envelope, like a letter drifting back to the sender.
		const floatTarget = envelope;
		if (floatTarget) {
			void loadGsap().then(({ gsap }) => {
				floatTween = gsap.to(floatTarget, {
					y: -10,
					rotation: 2,
					duration: 2.4,
					ease: 'sine.inOut',
					repeat: -1,
					yoyo: true
				});
			});
		}

		if (!section) return;
		const cleanup = createFromAnimationCleanup({
			scope: section,
			targets: '[data-animate]',
			vars: {
				y: 30,
				opacity: 0,
				duration: 0.7,
				stagger: 0.1,
				ease: 'power3.out'
			}
		});

		return () => {
			floatTween?.kill();
			cleanup();
		};
	});
</script>

<svelte:head>
	<title>{status} — {isNotFound ? 'Page not found' : 'Error'} | Lettr</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section bind:this={section} class="flex flex-col items-center py-24 text-center sm:py-32">
	<!-- Bouncing envelope with a RETURN TO SENDER stamp -->
	<div data-animate class="relative mb-10">
		<div bind:this={envelope} class="relative">
			<svg
				width="200"
				height="150"
				viewBox="0 0 200 150"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="drop-shadow-sm"
				aria-hidden="true"
			>
				<!-- envelope body -->
				<rect x="8" y="20" width="184" height="120" fill="#fff" stroke="#111827" stroke-width="3" />
				<!-- flap -->
				<path d="M8 20 L100 92 L192 20" fill="none" stroke="#111827" stroke-width="3" />
				<!-- bottom fold lines -->
				<path d="M8 140 L78 80" stroke="#d1d5db" stroke-width="2" />
				<path d="M192 140 L122 80" stroke="#d1d5db" stroke-width="2" />
			</svg>

			<!-- red RETURN TO SENDER stamp, rotated like a postal mark -->
			<div
				class="absolute -top-4 -right-6 -rotate-12 border-2 border-primary px-3 py-1.5 text-primary"
				style="font-family: var(--font-code);"
			>
				<span class="block text-[10px] leading-none font-bold tracking-widest">RETURN TO</span>
				<span class="block text-[10px] leading-none font-bold tracking-widest">SENDER</span>
			</div>
		</div>
	</div>

	<!-- Big status code -->
	<p
		data-animate
		class="text-primary mb-2 font-bold tracking-tight"
		style="font-family: var(--font-heading); font-size: clamp(4rem, 16vw, 7rem); line-height: 1;"
	>
		{status}
	</p>

	<h1 data-animate class="text-surface mb-4">{heading}</h1>

	<p data-animate class="text-body text-muted mb-8 max-w-[520px]">
		{blurb}
	</p>

	<!-- Mock SMTP bounce log -->
	<div
		data-animate
		class="mb-10 w-full max-w-[560px] border border-border/70 bg-surface px-5 py-4 text-left"
		style="font-family: var(--font-code);"
	>
		<div class="mb-3 flex items-center gap-1.5 border-b border-white/10 pb-3">
			<span class="h-2.5 w-2.5 bg-primary"></span>
			<span class="h-2.5 w-2.5 bg-white/30"></span>
			<span class="h-2.5 w-2.5 bg-white/30"></span>
			<span class="ml-2 text-xs text-white/40">mailer-daemon</span>
		</div>
		<pre class="overflow-x-auto text-xs leading-relaxed whitespace-pre-wrap text-white/70"><span class="text-white/40">&gt;</span> MAIL FROM:<span class="text-white">&lt;visitor@lettr.com&gt;</span>
<span class="text-white/40">&gt;</span> RCPT TO:<span class="text-white">&lt;{badPath}&gt;</span>
<span class="text-primary">&lt; {smtpCode}</span> {smtpReason}
<span class="text-white/40">&lt;</span> <span class="text-white/40">connection closed.</span></pre>
	</div>

	<div data-animate class="flex flex-wrap items-center justify-center gap-2">
		<Button variant="primary" href="/">Back to safety</Button>
		<Button
			variant="secondary"
			href="https://docs.lettr.com/introduction"
			target="_blank"
			rel="noopener noreferrer">Browse the docs</Button
		>
	</div>

	<p data-animate class="text-muted mt-6 text-sm">
		Think this address should exist? <a
			href="mailto:support@lettr.com"
			class="text-primary font-semibold hover:underline">Let us know</a
		>.
	</p>
</section>
