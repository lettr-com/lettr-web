<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';

	interface VolumeRange {
		value: string;
		label: string;
		description: string;
		route: string;
	}

	interface Props {
		volumeRanges: readonly VolumeRange[];
		selectedVolumeRange: string;
		isVolumePickerCollapsed: boolean;
		onselectrange?: (rangeValue: string) => void | Promise<void>;
		onexpand?: () => void;
	}

	let {
		volumeRanges,
		selectedVolumeRange,
		isVolumePickerCollapsed,
		onselectrange,
		onexpand
	}: Props = $props();

	const selectedRange = $derived.by(() =>
		volumeRanges.find((range) => range.value === selectedVolumeRange)
	);
</script>

<Card data-animate-intro>
	<CardHeader>
		<CardTitle>See how Lettr handles your email volume</CardTitle>
		<CardDescription>We'll match you with the right plan and a dedicated specialist.</CardDescription>
	</CardHeader>
	<CardContent class="space-y-3">
		<div class="space-y-2">
			<Label for="monthly-volume">Monthly email volume</Label>
			{#if isVolumePickerCollapsed && selectedRange}
				<div transition:slide={{ duration: 180 }} class="border border-border/70 bg-white/70 p-3">
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-xs uppercase tracking-[0.12em] text-muted">Selected volume</p>
							<p class="text-sm font-medium text-surface">{selectedRange.label}</p>
						</div>
						<Button variant="ghost" size="sm" onclick={onexpand}>Change</Button>
					</div>
				</div>
			{:else}
				<div id="monthly-volume" class="grid grid-cols-2 gap-2 narrow:grid-cols-1">
					{#each volumeRanges as range}
						<button
							type="button"
							class="border p-3 text-left transition-colors hover:border-primary/60 hover:bg-primary/5 {selectedVolumeRange === range.value
								? 'border-primary bg-primary/10'
								: 'border-border bg-white'}"
							onclick={() => onselectrange?.(range.value)}
						>
							<p class="text-sm font-semibold text-surface">{range.label}</p>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</CardContent>
	<CardFooter>
		<p class="text-xs text-muted">Takes 2 minutes · No credit card required</p>
	</CardFooter>
</Card>
