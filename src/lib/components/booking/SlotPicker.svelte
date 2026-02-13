<script lang="ts">
	import { CaretDown, Check } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import type { TimeSlot } from '$lib/zaptime/types';

	interface Props {
		isPriorityRoutingVolume: boolean;
		isLoading: boolean;
		slots: TimeSlot[];
		selectedDay: string;
		selectedDayLabel: string;
		dayOptions: string[];
		visibleSlots: TimeSlot[];
		selectedSlot: TimeSlot | null;
		selectedSlotSummary: string;
		formatDay: (day: string) => string;
		formatTime: (isoDateTime: string) => string;
		getDaySlotCount: (day: string) => number;
		onselectday?: (day: string) => void;
		onselectslot?: (slot: TimeSlot) => void;
	}

	let {
		isPriorityRoutingVolume,
		isLoading,
		slots,
		selectedDay,
		selectedDayLabel,
		dayOptions,
		visibleSlots,
		selectedSlot,
		selectedSlotSummary,
		formatDay,
		formatTime,
		getDaySlotCount,
		onselectday,
		onselectslot
	}: Props = $props();

	let isDayPickerOpen = $state(false);
	let isSlotPickerCollapsed = $state(false);
	let dayPickerRef: HTMLDivElement | null = $state(null);

	onMount(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (!dayPickerRef) {
				return;
			}

			if (!dayPickerRef.contains(event.target as Node)) {
				isDayPickerOpen = false;
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	});

	function handleSelectDay(day: string) {
		onselectday?.(day);
		isDayPickerOpen = false;
		isSlotPickerCollapsed = false;
	}

	function handleSelectSlot(slot: TimeSlot) {
		onselectslot?.(slot);
		isSlotPickerCollapsed = true;
		isDayPickerOpen = false;
	}
</script>

<Card>
	<CardHeader>
		<CardTitle>Choose your slot</CardTitle>
		<CardDescription>
			{#if isPriorityRoutingVolume}
				You are currently booked through the standard demo calendar.
			{:else if isLoading}
				Loading availability...
			{:else if slots.length === 0}
				No slots are available for the next 21 days.
			{:else}
				Pick a day and time that works best for you.
			{/if}
		</CardDescription>
	</CardHeader>

	<CardContent class="space-y-4">
		{#if isLoading}
			<div class="space-y-2">
				<div class="h-4 w-10 animate-pulse bg-border/70"></div>
				<div class="h-10 w-full animate-pulse bg-border/60"></div>
			</div>
			<div class="grid grid-cols-2 gap-2 narrow:grid-cols-1">
				{#each Array.from({ length: 8 }) as _, index}
					<div class="h-10 animate-pulse bg-border/60" style={`animation-delay: ${index * 40}ms`}></div>
				{/each}
			</div>
		{:else}
			{#if selectedSlot && isSlotPickerCollapsed}
				<div class="border border-border/70 bg-white/70 p-3">
					<div class="flex items-center justify-between gap-3">
						<div>
							<p class="text-xs uppercase tracking-[0.12em] text-muted">Selected slot</p>
							<p class="text-sm font-medium text-surface">{selectedSlotSummary}</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onclick={() => {
								isSlotPickerCollapsed = false;
							}}
						>
							Change
						</Button>
					</div>
				</div>
			{/if}

			{#if !isSlotPickerCollapsed}
				<div transition:slide={{ duration: 180 }} class="space-y-4">
					{#if !selectedSlot}
						<p class="text-sm text-muted">No slot selected yet. Choose a time to continue.</p>
					{/if}

					{#if dayOptions.length > 0}
						<div class="space-y-2">
							<Label for="day-picker">Day</Label>
							<div class="relative" bind:this={dayPickerRef}>
								<Button
									id="day-picker"
									variant="outline"
									class="h-10 w-full justify-between bg-white px-3 text-left font-medium"
									onclick={() => {
										isDayPickerOpen = !isDayPickerOpen;
									}}
									aria-expanded={isDayPickerOpen}
									aria-haspopup="listbox"
								>
									{selectedDayLabel}
									<CaretDown size={16} class="text-muted" />
								</Button>

								{#if isDayPickerOpen}
									<div
										class="absolute left-0 right-0 z-20 mt-1 border border-border bg-white p-1 shadow-[0_16px_35px_-16px_rgba(17,24,39,0.35)]"
										role="listbox"
									>
										<div class="max-h-64 overflow-y-auto">
											{#each dayOptions as day}
												<button
													type="button"
													class="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-surface transition-colors hover:bg-surface/5"
													onclick={() => handleSelectDay(day)}
												>
													<div class="flex items-center gap-2">
														<span>{formatDay(day)}</span>
														<span class="text-xs text-muted">{getDaySlotCount(day)} free</span>
													</div>
													{#if selectedDay === day}
														<Check size={16} class="text-primary" />
													{/if}
												</button>
											{/each}
										</div>
									</div>
								{/if}
							</div>
						</div>

						<div class="grid grid-cols-2 gap-2 narrow:grid-cols-1">
							{#each visibleSlots as slot}
								{@const isSelected = selectedSlot?.start === slot.start}
								<Button
									variant={isSelected ? 'default' : 'outline'}
									size="sm"
									class={isSelected ? 'ring-2 ring-primary/30 ring-offset-1' : 'bg-white'}
									aria-pressed={isSelected}
									onclick={() => handleSelectSlot(slot)}
								>
									{#if isSelected}
										<Check size={14} weight="bold" aria-hidden="true" />
									{/if}
									{formatTime(slot.start)}
								</Button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		{/if}
	</CardContent>
</Card>
