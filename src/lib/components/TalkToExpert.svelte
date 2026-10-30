<script lang="ts">
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
		<a
			href="/demo/"
			class="bg-surface px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-surface/90"
			onclick={trackTalkToExpert}
		>
			Talk to an expert
		</a>
	</div>
</section>
