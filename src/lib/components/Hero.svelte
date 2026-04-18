<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import EditorPreview from './EditorPreview.svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';

	let section: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		if (!section) return;

		return createFromAnimationCleanup({
			scope: section,
			targets: '[data-animate]',
			vars: {
				y: 30,
				opacity: 0,
				duration: 0.7,
				stagger: 0.12,
				ease: 'power3.out'
			}
		});
	});
</script>

<section bind:this={section} class="pt-30 pb-16 border-b border-border/30" id="hero">
	<div class="grid gap-12 lg:grid-cols-1">
		<div class="flex flex-col">
				<a
					data-animate
					href="/changelog/"
					class="group mb-6 inline-flex w-fit items-center gap-2 border border-primary/20 bg-primary/5 p-1.5 text-sm text-primary transition-colors hover:bg-primary/10"
				>
					<span class="bg-primary px-2 py-0.5 text-xs font-bold text-white">New</span>
					Announcing Lettr
					<span class="transition-transform group-hover:translate-x-0.5">&rarr;</span>
				</a>
				<h1 data-animate class="text-surface mb-4">
					The email platform<br />
					<span class="text-primary">built for SaaS</span>
				</h1>

				<p data-animate class="max-w-[650px] text-body text-muted mb-10">
					Our marketing team couldn't touch emails without dev tickets. We couldn't tell which transactional email failed or why. Nothing fit — so we built it.
				</p>

				<div data-animate class="flex flex-wrap items-center mb-3 gap-2">
					<Button variant="primary" href={registerHref}>Start sending</Button>
					<Button variant="secondary" href="https://docs.lettr.com/introduction" target="_blank" rel="noopener noreferrer">See docs</Button>
				</div>
				<p data-animate class="max-w-md text-sm text-muted">
					3,000 emails/month free. No credit card required.
				</p>

		</div>

		<div data-animate>
			<EditorPreview />
		</div>

		<div data-animate class="flex flex-col items-center gap-4 py-10 text-sm text-muted">
			<span>Part of the <a href="https://biggood.io/" target="_blank" rel="noopener noreferrer" class="font-semibold text-surface hover:text-primary transition-colors">Big Good</a> group. Sending millions of emails.</span>
			<div class="flex items-center gap-8 opacity-20">
				<img src="/images/logos/topol-icon.svg" alt="Topol" class="h-6" />
				<img src="/images/logos/ecomail-icon.svg" alt="Ecomail" class="h-5" />
				<img src="/images/logos/dmarceye-icon.svg" alt="DMARCeye" class="h-6" />
			</div>
		</div>
	</div>
</section>
