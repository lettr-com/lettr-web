<script lang="ts">
	import { onMount } from 'svelte';
	import { LinkIcon, GlobeIcon, LightningIcon, CodeIcon, ShieldCheckIcon, MagnifyingGlassIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: CodeIcon,
			title: 'Clean REST API + SMTP',
			description: 'Simple, well-documented API. Or just point your SMTP config and go.'
		},
		{
			icon: LightningIcon,
			title: 'SDKs for every language',
			description: 'Laravel, PHP, Node.js, Python, Go, Java, Rust. First-class support.'
		},
		{
			icon: GlobeIcon,
			title: 'One domain, one reputation',
			description: 'Transactional and marketing emails from the same domain. No split reputation.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'SPF, DKIM, DMARC setup',
			description: 'Guided authentication setup. Custom tracking domains from day one.'
		},
		{
			icon: LinkIcon,
			title: 'Webhooks for every event',
			description: 'Delivered, opened, clicked, bounced. Real-time event notifications.'
		},
		{
			icon: MagnifyingGlassIcon,
			title: 'Searchable logs',
			description: 'Find any email instantly. Debug delivery issues in seconds, not hours.'
		}
	];

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-feature]'
		});
	});
</script>

<section bind:this={section} id="features" class="-mx-6 px-6 py-16 bg-surface border-b border-white/10">
		<div class="mb-8" data-feature>
			<h2 class="mb-3 text-white">Integrate in minutes. <span class="text-primary">Forget about it forever.</span></h2>
			<p class="text-body text-gray-400 max-w-[50ch]">
				Everything you need to send emails from your SaaS. Nothing you don't.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-x-4 gap-y-12">
			{#each features as feature}
				<div data-feature>
					<feature.icon size={18} class="text-primary mb-2" />
					<h3 class="text-base text-white font-medium mb-1">{feature.title}</h3>
					<p class="max-w-[30ch] text-sm text-gray-400 leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
</section>
