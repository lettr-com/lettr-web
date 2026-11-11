<script lang="ts">
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import IntegrationLogo from '$lib/components/integrations/IntegrationLogo.svelte';
	import { integrationHref } from '$lib/integrations';
	import type { Integration } from '$lib/integrations/types';

	interface Props {
		entry: Integration;
	}

	let { entry }: Props = $props();

	const isPartner = $derived(entry.builtBy !== 'Lettr');
</script>

<!-- The list view's row: the same facts as the card, one line per integration. -->
<a
	href={integrationHref(entry)}
	class="group grid grid-cols-[48px_minmax(0,1fr)_auto] items-center gap-4 border-b border-border/50 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-surface md:grid-cols-[56px_minmax(0,16rem)_minmax(0,1fr)_auto] md:gap-6"
>
	<span class="flex size-12 items-center justify-center bg-white md:size-14">
		<IntegrationLogo {entry} size={28} />
	</span>
	<span class="flex min-w-0 flex-col gap-0.5">
		<h3 class="type-h6 text-balance transition-colors group-hover:text-primary">{entry.name}</h3>
		<span class="text-caption text-subtle">
			{entry.type}
			<span aria-hidden="true">·</span>
			<span class="whitespace-nowrap">
				Built by <span class={isPartner ? 'font-semibold text-surface' : ''}>{entry.builtBy}</span>
			</span>
		</span>
	</span>
	<span class="hidden text-body-sm text-pretty text-muted md:block">{entry.summary}</span>
	<ArrowRightIcon
		size={18}
		class="text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary motion-reduce:transition-none"
		aria-hidden="true"
	/>
</a>
