<script lang="ts">
	import { onMount } from 'svelte';
	import { BookOpenIcon, GithubLogoIcon } from 'phosphor-svelte';
	import Button from './Button.svelte';
	import CodeSnippet from './CodeSnippet.svelte';
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

<section bind:this={section} class="px-4 pt-30 pb-16 border-b border-border/30" id="hero">
	<div class="mx-auto max-w-[550px]">
		<div class="grid gap-12 lg:grid-cols-1">
			<div class="flex flex-col">
				<h1 data-animate class="text-surface mb-4">
					Transactional emails that<br />
					<span class="text-primary">feel like Laravel</span>
				</h1>

				<p data-animate class="max-w-md text-body text-muted mb-10">
					Lettr is the developer-first email API. Send transactional emails at scale with a simple
					REST API, SDKs for every language, and real-time delivery analytics.
				</p>

				<div data-animate class="flex flex-wrap items-center mb-3 gap-2">
					<Button variant="primary" href={registerHref}>Register</Button>
					<Button variant="secondary" href="#pricing">Book a demo </Button>
				</div>
				<p data-animate class="max-w-md text-sm text-gray-400">
					3,000 emails/month free. No credit card required.
				</p>

				<div data-animate class="mt-12">
					<CodeSnippet />
				</div>

				<div data-animate class="flex items-center gap-4 mt-5">
					<a
						href="https://docs.lettr.com/introduction"
						class="inline-flex items-center gap-1.5 text-sm transition-colors text-surface hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						<BookOpenIcon size={18} class="text-primary" />
						Read the docs
					</a>
					<span class="text-sm text-gray-400">or</span>
					<a
						href="https://github.com/lettr-com"
						class="inline-flex items-center gap-1.5 text-sm transition-colors text-surface hover:underline"
						target="_blank"
						rel="noopener noreferrer"
					>
						<GithubLogoIcon size={18} class="text-primary" />
						view on GitHub
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
