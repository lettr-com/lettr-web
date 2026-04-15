<script lang="ts">
	import { onMount } from 'svelte';
	import { PaperPlaneTiltIcon, UsersIcon, GlobeIcon, ShieldCheckIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const points = [
		{
			icon: PaperPlaneTiltIcon,
			title: 'Transactional via API',
			description: 'Password resets, receipts, alerts — delivered instantly through your API.'
		},
		{
			icon: UsersIcon,
			title: 'Campaigns to audiences',
			description: 'Product updates, newsletters, feature launches — sent to the right users.'
		},
		{
			icon: GlobeIcon,
			title: 'Same sending domain',
			description: 'One domain for everything. No more split reputation across vendors.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Unified deliverability',
			description: 'Build and protect one sender reputation instead of managing two.'
		}
	];

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-unified]'
		});
	});
</script>

<section bind:this={section} class="py-16 border-b border-border/30">
		<div class="mb-8" data-unified>
			<h2 class="mb-3 text-surface">One platform. One domain. <span class="text-primary">One reputation.</span></h2>
			<p class="text-body text-muted max-w-[55ch]">
				No more juggling Postmark for transactional and Mailchimp for marketing. Send everything from one place, on the same domain, with the same deliverability reputation.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-x-4 gap-y-12">
			{#each points as point}
				<div data-unified>
					<point.icon size={18} class="text-primary mb-2" />
					<h3 class="text-base text-surface font-medium mb-1">{point.title}</h3>
					<p class="max-w-[30ch] text-sm text-muted leading-relaxed">{point.description}</p>
				</div>
			{/each}
		</div>
</section>
