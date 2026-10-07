<script lang="ts">
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	interface Props {
		description: string;
		/** Lit up when the slider is at the enterprise stop. */
		selected?: boolean;
		tone?: 'primary' | 'green';
		placement: string;
		volumeLabel: string;
	}

	let { description, selected = false, tone = 'primary', placement, volumeLabel }: Props = $props();

	function track() {
		void capturePosthogEvent('cta_clicked', {
			placement,
			label: 'Contact sales',
			href: '/demo/',
			destination_type: 'internal',
			volume_label: volumeLabel
		});
	}
</script>

<div
	class="flex flex-col gap-5 px-5 py-6 transition-colors duration-300 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-7 {selected
		? tone === 'primary'
			? 'bg-[#23020b]'
			: 'bg-[#002010]'
		: 'bg-white'}"
>
	<div class="flex flex-col gap-1.5">
		<h3 class="m-0 font-heading text-base leading-5 font-semibold {selected ? 'text-white' : 'text-surface'}">Enterprise</h3>
		<p class="m-0 text-[0.9375rem] leading-[22px] {selected ? 'text-white/80' : 'text-muted'}">{description}</p>
	</div>
	<a
		href="/demo/"
		onclick={track}
		class="flex h-12 shrink-0 items-center justify-center gap-2.5 border px-[22px] text-[0.9375rem] font-semibold transition-colors {selected
			? tone === 'primary'
				? 'border-primary bg-primary text-white hover:bg-primary-strong'
				: 'border-green bg-green text-white hover:brightness-95'
			: 'border-surface text-surface hover:border-primary hover:text-primary'}"
	>
		Contact sales <span class="text-lg" aria-hidden="true">→</span>
	</a>
</div>
