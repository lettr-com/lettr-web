<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { Lightning, ChartLine, Code, ShieldCheck, WebhooksLogo, Globe } from 'phosphor-svelte';

	gsap.registerPlugin(ScrollTrigger);

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: Lightning,
			title: 'Blazing fast delivery',
			description: 'Emails delivered in milliseconds with our globally distributed infrastructure.'
		},
		{
			icon: ChartLine,
			title: 'Real-time analytics',
			description: 'Track opens, clicks, bounces, and deliverability in real time.'
		},
		{
			icon: Code,
			title: 'Developer-first SDKs',
			description: 'Official libraries for Node.js, Python, Go, Ruby, PHP, and more.'
		},
		{
			icon: ShieldCheck,
			title: 'Built-in compliance',
			description: 'DKIM, SPF, and DMARC configured automatically for every domain.'
		},
		{
			icon: WebhooksLogo,
			title: 'Webhooks & events',
			description: 'Get notified instantly on delivery, bounce, open, and click events.'
		},
		{
			icon: Globe,
			title: 'Global infrastructure',
			description: 'Multi-region sending with automatic failover and 99.99% uptime SLA.'
		}
	];

	onMount(() => {
		if (!section) return;

		gsap.from(section.querySelectorAll('[data-feature]'), {
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				toggleActions: 'play none none none'
			},
			y: 30,
			opacity: 0,
			duration: 0.6,
			stagger: 0.08,
			ease: 'power3.out'
		});
	});
</script>

<section bind:this={section} id="features" class="px-4 py-20">
	<div class="mx-auto max-w-[550px]">
		<div class="mb-10" data-feature>
			<h2 class="mb-3 text-surface">Built for <span class="text-primary">developers</span></h2>
			<p class="text-body text-muted">
				A complete email delivery platform built for developers who value simplicity.
			</p>
		</div>

		<div class="grid gap-6 sm:grid-cols-2">
			{#each features as feature}
				<div data-feature class="flex gap-3 border border-border/30 bg-white p-4">
					<div class="flex h-8 w-8 shrink-0 items-center justify-center bg-primary/5 text-primary">
						<feature.icon size={18} />
					</div>
					<div>
						<h3 class="text-sm font-semibold text-surface">{feature.title}</h3>
						<p class="mt-1 text-xs text-muted leading-relaxed">{feature.description}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
