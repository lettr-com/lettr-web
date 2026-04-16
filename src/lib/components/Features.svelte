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
			description: 'Laravel, PHP, Node.js, Python, Go, Java, Rust.'
		},
		{
			icon: GlobeIcon,
			title: 'One domain, one reputation',
			description: 'Transactional and marketing from the same domain.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'SPF, DKIM, DMARC',
			description: 'Guided auth setup. Custom tracking domains from day one.'
		},
		{
			icon: LinkIcon,
			title: 'Webhooks for every event',
			description: 'Delivered, opened, clicked, bounced. Real-time.'
		},
		{
			icon: MagnifyingGlassIcon,
			title: 'Searchable logs',
			description: 'Find any email instantly. Debug in seconds.'
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
		<div class="mb-10" data-feature>
			<h2 class="mb-3 text-white">Integrate in minutes. <span class="text-primary">Forget about it forever.</span></h2>
			<p class="text-body text-gray-400 max-w-[50ch]">
				Everything you need to send emails from your SaaS. Nothing you don't.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-3">
			{#each features as feature}
				<div data-feature class="border border-white/[0.06] bg-white/[0.03] p-5">
					<div class="mb-3 flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[0.05]">
						<feature.icon size={16} class="text-primary" />
					</div>
					<h3 class="text-sm text-white font-medium mb-1">{feature.title}</h3>
					<p class="text-[13px] text-gray-500 leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
</section>
