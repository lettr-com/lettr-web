<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ChatCircleDotsIcon from 'phosphor-svelte/lib/ChatCircleDotsIcon';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	function trackTalkToExpert() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'talk_to_expert',
			label: 'Talk to an expert',
			href: '/demo/',
			destination_type: 'internal'
		});
	}
</script>

<section class="border-b border-border/30 py-8 md:py-16">
	<div class="flex flex-col items-center text-center">
		<ChatCircleDotsIcon size={24} class="mb-4 text-primary" />
		<h2 class="mb-2 text-surface">Need help deciding?</h2>
		<p class="mb-6 max-w-[40ch] text-sm text-muted">
			Talk to our team about your email infrastructure, volume needs, or migration from another provider.
		</p>
		<Button size="sm" variant="ink" href="/demo/" onclick={trackTalkToExpert}>Talk to an expert</Button>
	</div>
</section>
