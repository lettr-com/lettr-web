<script lang="ts">
	import { Check, CaretDown } from 'phosphor-svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { InitData, InitResponse, ReservationResponse, TimeSlot } from '$lib/zaptime/types';

	let config: InitData | null = $state(null);
	let slots: TimeSlot[] = $state([]);
	let selectedDay: string = $state('');
	let selectedSlot: TimeSlot | null = $state(null);
	let isDayPickerOpen: boolean = $state(false);
	let isSlotPickerCollapsed: boolean = $state(false);
	let isVolumePickerCollapsed: boolean = $state(false);
	let section: HTMLElement | undefined = $state();
	let dayPickerRef: HTMLDivElement | null = $state(null);
	let selectedVolumeRange: string = $state('');
	let routingDecision: 'pending' | 'qualified' | 'selfServe' = $state('pending');
	let hasInitializedBooking: boolean = $state(false);
	let isPriorityRoutingVolume: boolean = $state(false);

	let email: string = $state('');
	let firstName: string = $state('');
	let lastName: string = $state('');
	let phone: string = $state('');

	let confirmationUuid: string | null = $state(null);

	let isLoadingConfig: boolean = $state(true);
	let isLoadingSlots: boolean = $state(true);
	let isConfirming: boolean = $state(false);

	let infoMessage: string = $state('');
	let errorMessage: string = $state('');

	const volumeRanges = [
		{
			value: 'under-100k',
			label: 'Under 100K',
			description: 'Fast self-serve onboarding',
			route: 'selfServe'
		},
		{
			value: '100k-1m',
			label: '100K-1M',
			description: 'Great fit for a regular demo',
			route: 'demo'
		},
		{
			value: '2m-5m',
			label: '2M-5M',
			description: 'Regular demo with our team',
			route: 'demo'
		},
		{
			value: '5m-plus',
			label: '5M+',
			description: 'Priority routing volume',
			route: 'priorityDemo'
		}
	] as const;

	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

	const slotGroups = $derived.by(() => {
		const grouped = new Map<string, TimeSlot[]>();

		for (const slot of slots) {
			const dayKey = toDayKey(slot.start);
			const daySlots = grouped.get(dayKey) ?? [];
			daySlots.push(slot);
			grouped.set(dayKey, daySlots);
		}

		for (const daySlots of grouped.values()) {
			daySlots.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
		}

		return grouped;
	});

	const dayOptions = $derived(
		Array.from(slotGroups.keys()).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
	);

	const visibleSlots = $derived.by(() => {
		if (!selectedDay) {
			return [] as TimeSlot[];
		}

		return slotGroups.get(selectedDay) ?? [];
	});
	const selectedDayLabel = $derived.by(() => {
		if (!selectedDay) {
			return 'Select a day';
		}

		return formatDayWithAvailability(selectedDay);
	});

	const isConfirmed = $derived(Boolean(confirmationUuid));
	const canConfirm = $derived(Boolean(selectedSlot && !isLoadingSlots));
	const selectedRange = $derived.by(() =>
		volumeRanges.find((range) => range.value === selectedVolumeRange)
	);
	const selectedVolumeLabel = $derived(selectedRange?.label ?? '');
	const canRoute = $derived(Boolean(selectedRange));

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

		let animationCleanup = () => {};

		if (section) {
			animationCleanup = createFromAnimationCleanup({
				scope: section,
				targets: '[data-animate-intro]',
				vars: {
					y: 18,
					opacity: 0,
					duration: 0.55,
					stagger: 0.08,
					ease: 'power3.out'
				}
			});
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			animationCleanup();
		};
	});

	async function initializeBooking() {
		errorMessage = '';
		infoMessage = '';

		try {
			const configResponse = await requestJson<InitResponse>('/api/zaptime/config');
			config = configResponse.data;
		} catch (error) {
			errorMessage = toErrorMessage(error, 'Could not load booking configuration.');
		} finally {
			isLoadingConfig = false;
		}

		await loadSlots();
	}

	async function routeRequest(rangeOverride?: (typeof volumeRanges)[number]) {
		const activeRange = rangeOverride ?? selectedRange;

		if (!activeRange) {
			errorMessage = 'Please choose your monthly transactional email volume.';
			return;
		}

		errorMessage = '';
		infoMessage = '';

		isPriorityRoutingVolume = activeRange.route === 'priorityDemo';

		if (activeRange.route === 'selfServe') {
			routingDecision = 'selfServe';

			return;
		}

		routingDecision = 'qualified';

		if (!hasInitializedBooking) {
			hasInitializedBooking = true;
			await initializeBooking();
		}
	}

	async function loadSlots() {
		isLoadingSlots = true;

		const from = new Date();
		const until = new Date();
		until.setDate(until.getDate() + 21);

		const params = new URLSearchParams({
			from: from.toISOString(),
			until: until.toISOString()
		});

		try {
			const response = await requestJson<{ success: boolean; data: TimeSlot[] }>(
				`/api/zaptime/slots?${params.toString()}`
			);

			slots = response.data;

			if (slots.length > 0) {
				selectedDay = toDayKey(slots[0].start);
				selectedSlot = slots[0];
			}
		} catch (error) {
			errorMessage = toErrorMessage(error, 'Could not load available booking slots.');
		} finally {
			isLoadingSlots = false;
		}
	}

	function selectDay(day: string) {
		selectedDay = day;
		isDayPickerOpen = false;
		isSlotPickerCollapsed = false;
		confirmationUuid = null;
		const firstSlotForDay = slotGroups.get(day)?.[0];
		if (firstSlotForDay) {
			selectedSlot = firstSlotForDay;
		}
	}

	function selectSlot(slot: TimeSlot) {
		selectedSlot = slot;
		isSlotPickerCollapsed = true;
		isDayPickerOpen = false;
		confirmationUuid = null;
	}

	async function confirmReservation() {
		if (!selectedSlot) {
			errorMessage = 'Please select a time slot first.';
			return;
		}

		if (!email.trim()) {
			errorMessage = 'Email is required to confirm booking.';
			return;
		}

		errorMessage = '';
		infoMessage = '';
		isConfirming = true;

		try {
			const confirmation = await requestJson<ReservationResponse>('/api/zaptime/book', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					firstName,
					lastName,
					phone,
					timeSlot: selectedSlot,
					timezone
				})
			});

			confirmationUuid = confirmation.data.uuid;
			infoMessage = 'Booking confirmed. We have sent your booking details to your email.';
		} catch (error) {
			errorMessage = toErrorMessage(error, 'Could not confirm reservation.');
		} finally {
			isConfirming = false;
		}
	}

	async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
		const response = await fetch(url, init);
		const body = (await response.json().catch(() => null)) as
			| { message?: string; error?: string }
			| null;

		if (!response.ok) {
			throw new Error(body?.message ?? body?.error ?? 'Request failed');
		}

		return body as T;
	}

	function toDayKey(isoDateTime: string) {
		return new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(new Date(isoDateTime));
	}

	function formatDay(day: string) {
		const date = new Date(`${day}T00:00:00`);

		return new Intl.DateTimeFormat('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric'
		}).format(date);
	}

	function formatDayWithAvailability(day: string) {
		const count = slotGroups.get(day)?.length ?? 0;
		const label = formatDay(day);

		return `${label} (${count} free)`;
	}

	function formatTime(isoDateTime: string) {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			timeZone: timezone
		}).format(new Date(isoDateTime));
	}

	function selectedSlotSummary() {
		if (!selectedSlot) {
			return '';
		}

		return `${formatDay(selectedDay)} at ${formatTime(selectedSlot.start)}`;
	}

	async function selectVolumeRange(rangeValue: string) {
		selectedVolumeRange = rangeValue;
		isVolumePickerCollapsed = true;

		const pickedRange = volumeRanges.find((range) => range.value === rangeValue);
		await routeRequest(pickedRange);
	}

	function toErrorMessage(error: unknown, fallback: string) {
		if (error instanceof Error && error.message) {
			return error.message;
		}

		return fallback;
	}
</script>

<section class="border-b border-border/30 px-4 pb-16 pt-30">
	<div bind:this={section} class="mx-auto max-w-[550px] space-y-5">
		<header data-animate-intro class="space-y-3">
			<p class="text-sm font-medium uppercase tracking-[0.14em] text-primary">Step 2 of 3</p>
		</header>

		{#if errorMessage}
			<Alert class="border-primary/30 bg-primary/5">
				<AlertTitle>Something went wrong</AlertTitle>
				<AlertDescription class="text-surface">{errorMessage}</AlertDescription>
			</Alert>
		{/if}

		{#if infoMessage}
			<Alert>
				<AlertTitle>Booking status</AlertTitle>
				<AlertDescription>{infoMessage}</AlertDescription>
			</Alert>
		{/if}

		<Card data-animate-intro>
			<CardHeader>
				<CardTitle>See how Lettr handles your email volume</CardTitle>
				<CardDescription>
					We'll match you with the right plan and a dedicated specialist.
				</CardDescription>
			</CardHeader>
			<CardContent class="space-y-3">
				<div class="space-y-2">
					<Label for="monthly-volume">Monthly email volume</Label>
					{#if isVolumePickerCollapsed && selectedRange}
						<div transition:slide={{ duration: 180 }} class="border border-border/70 bg-white/70 p-3">
							<div class="flex items-center justify-between gap-3">
								<div>
									<p class="text-xs uppercase tracking-[0.12em] text-muted">Selected volume</p>
									<p class="text-sm font-medium text-surface">{selectedVolumeLabel}</p>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onclick={() => {
										isVolumePickerCollapsed = false;
									}}
								>
									Change
								</Button>
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
									onclick={() => selectVolumeRange(range.value)}
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

		{#if routingDecision === 'selfServe'}
			<Card>
				<CardHeader>
					<CardTitle>Good news: you can be live today</CardTitle>
					<CardDescription>
						At your current volume, the fastest path is guided self-serve setup.
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-3 text-sm text-muted">
					<p>
						Most teams send their first emails in about 15 minutes. Start free, test quickly, and reach
						out anytime if you want help.
					</p>
					<div class="flex flex-wrap items-center gap-3">
						<a
							href="https://app.lettr.com/register"
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex h-10 items-center justify-center bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
						>
							Create account
						</a>
						<a
							href="https://docs.lettr.com/introduction"
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm font-semibold text-primary hover:underline"
						>
							Read docs
						</a>
					</div>
				</CardContent>
			</Card>
		{/if}

		{#if routingDecision === 'qualified'}
			<Card>
			<CardHeader>
				<CardTitle>Choose your slot</CardTitle>
				<CardDescription>
					{#if isPriorityRoutingVolume}
						You are currently booked through the standard demo calendar.
					{:else if isLoadingConfig || isLoadingSlots}
						Loading availability...
					{:else if slots.length === 0}
						No slots are available for the next 21 days.
					{:else}
						Pick a day and time that works best for you.
					{/if}
				</CardDescription>
			</CardHeader>

			<CardContent class="space-y-4">
				{#if isLoadingConfig || isLoadingSlots}
					<div class="space-y-2">
						<div class="h-4 w-10 animate-pulse bg-border/70"></div>
						<div class="h-10 w-full animate-pulse bg-border/60"></div>
					</div>
					<div class="grid grid-cols-2 gap-2 narrow:grid-cols-1">
						{#each Array.from({ length: 8 }) as _, index}
							<div
								class="h-10 animate-pulse bg-border/60"
								style={`animation-delay: ${index * 40}ms`}
							></div>
						{/each}
					</div>
				{:else}
				{#if selectedSlot && isSlotPickerCollapsed}
					<div class="border border-border/70 bg-white/70 p-3">
						<div class="flex items-center justify-between gap-3">
							<div>
								<p class="text-xs uppercase tracking-[0.12em] text-muted">Selected slot</p>
								<p class="text-sm font-medium text-surface">{selectedSlotSummary()}</p>
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
												onclick={() => selectDay(day)}
											>
												<div class="flex items-center gap-2">
													<span>{formatDay(day)}</span>
													<span class="text-xs text-muted">{slotGroups.get(day)?.length ?? 0} free</span>
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
							<Button
								variant={selectedSlot?.start === slot.start ? 'default' : 'outline'}
								size="sm"
								onclick={() => selectSlot(slot)}
							>
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

			<Card>
			<CardHeader>
				<CardTitle>Your details</CardTitle>
				<CardDescription>We only use these details for your booking.</CardDescription>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" bind:value={email} placeholder="you@company.com" required />
				</div>

				<div class="grid grid-cols-2 gap-3 narrow:grid-cols-1">
					<div class="space-y-2">
						<Label for="first-name">First name</Label>
						<Input id="first-name" bind:value={firstName} placeholder="John" />
					</div>
					<div class="space-y-2">
						<Label for="last-name">Last name</Label>
						<Input id="last-name" bind:value={lastName} placeholder="Doe" />
					</div>
				</div>

				<div class="space-y-2">
					<Label for="phone">Phone (optional)</Label>
					<Input id="phone" type="tel" bind:value={phone} placeholder="+1 555 555 5555" />
				</div>
			</CardContent>

			<Separator />

			<CardFooter class="flex flex-col items-stretch gap-2 narrow:gap-3">
				<Button onclick={confirmReservation} disabled={!canConfirm || isConfirming || isConfirmed}>
					{#if isConfirmed}
						Confirmed
					{:else}
						{isConfirming ? 'Confirming...' : 'Confirm booking'}
					{/if}
				</Button>

				{#if config?.configuration.redirectAfterBookingUrl && isConfirmed}
					<a
						href={config.configuration.redirectAfterBookingUrl}
						class="text-center text-sm font-medium text-primary hover:underline"
					>
						Continue
					</a>
				{/if}
			</CardFooter>
			</Card>
		{/if}
	</div>
</section>
