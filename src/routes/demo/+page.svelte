<script lang="ts">
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { onMount } from 'svelte';
	import { capturePosthogEvent, identifyPosthogUser } from '$lib/analytics/posthog';
	import BookingAlerts from '$lib/components/booking/BookingAlerts.svelte';
	import ContactFormCard from '$lib/components/booking/ContactFormCard.svelte';
	import SelfServeCard from '$lib/components/booking/SelfServeCard.svelte';
	import SlotPicker from '$lib/components/booking/SlotPicker.svelte';
	import VolumePicker from '$lib/components/booking/VolumePicker.svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import type { InitData, InitResponse, ReservationResponse, TimeSlot } from '$lib/zaptime/types';

	let config: InitData | null = $state(null);
	let slots: TimeSlot[] = $state([]);
	let selectedDay: string = $state('');
	let selectedSlot: TimeSlot | null = $state(null);
	let isVolumePickerCollapsed: boolean = $state(false);
	let section: HTMLElement | undefined = $state();
	let selectedVolumeRange: string = $state('');
	let routingDecision: 'pending' | 'qualified' | 'selfServe' = $state('pending');
	let hasInitializedBooking: boolean = $state(false);
	let isPriorityRoutingVolume: boolean = $state(false);

	let email: string = $state('');
	let firstName: string = $state('');
	let lastName: string = $state('');
	let companyName: string = $state('');
	let turnstileToken: string = $state('');
	let turnstileResetKey: number = $state(0);

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
	const funnelName = 'booking_funnel';
	const funnelVersion = 1;

	type BookingEventProperties = Record<string, string | number | boolean | null | undefined>;

	function trackBookingEvent(eventName: string, properties: BookingEventProperties = {}) {
		void capturePosthogEvent(eventName, {
			funnel_name: funnelName,
			funnel_version: funnelVersion,
			page: '/demo',
			timezone,
			...properties
		});
	}

	function setSelectedSlot(slot: TimeSlot, source: 'manual') {
		const previousSlotStart = selectedSlot?.start;
		selectedSlot = slot;
		confirmationUuid = null;

		if (previousSlotStart === slot.start) {
			return;
		}

		trackBookingEvent('book_slot_selected', {
			step_number: 7,
			slot_start: slot.start,
			slot_end: slot.end,
			selection_source: source
		});
	}

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

	const selectedSlotSummary = $derived.by(() => {
		if (!selectedSlot) {
			return '';
		}

		return `${formatDay(selectedDay)} at ${formatTime(selectedSlot.start)}`;
	});

	const isConfirmed = $derived(Boolean(confirmationUuid));
	const canConfirm = $derived(Boolean(selectedSlot && !isLoadingSlots));
	const selectedRange = $derived.by(() =>
		volumeRanges.find((range) => range.value === selectedVolumeRange)
	);

	onMount(() => {
		let animationCleanup = () => {};

		trackBookingEvent('book_page_viewed', {
			step_number: 1
		});

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
			animationCleanup();
		};
	});

	async function initializeBooking() {
		errorMessage = '';
		infoMessage = '';

		try {
			const configResponse = await requestJson<InitResponse>('/api/zaptime/config');
			config = configResponse.data;
			trackBookingEvent('book_config_loaded', {
				step_number: 4
			});
		} catch (error) {
			const message = toErrorMessage(error, 'Could not load booking configuration.');
			errorMessage = message;
			trackBookingEvent('book_config_load_failed', {
				step_number: 4,
				error_message: message
			});
		} finally {
			isLoadingConfig = false;
		}

		await loadSlots();
	}

	async function routeRequest(rangeOverride?: (typeof volumeRanges)[number]) {
		const activeRange = rangeOverride ?? selectedRange;

		if (!activeRange) {
			errorMessage = 'Please choose your monthly transactional email volume.';
			trackBookingEvent('book_routing_validation_failed', {
				step_number: 3,
				reason: 'missing_volume_range'
			});
			return;
		}

		errorMessage = '';
		infoMessage = '';

		isPriorityRoutingVolume = activeRange.route === 'priorityDemo';
		trackBookingEvent('book_routing_decided', {
			step_number: 3,
			volume_range: activeRange.value,
			route: activeRange.route,
			is_priority_routing: activeRange.route === 'priorityDemo'
		});

		if (activeRange.route === 'selfServe') {
			trackBookingEvent('book_routed_self_serve', {
				step_number: 4,
				volume_range: activeRange.value
			});
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
			trackBookingEvent('book_slots_loaded', {
				step_number: 5,
				slot_count: slots.length
			});

			if (slots.length > 0) {
				selectedDay = toDayKey(slots[0].start);
				selectedSlot = null;
			}
		} catch (error) {
			const message = toErrorMessage(error, 'Could not load available booking slots.');
			errorMessage = message;
			trackBookingEvent('book_slots_load_failed', {
				step_number: 5,
				error_message: message
			});
		} finally {
			isLoadingSlots = false;
		}
	}

	function selectDay(day: string) {
		selectedDay = day;
		selectedSlot = null;
		confirmationUuid = null;

		trackBookingEvent('book_day_selected', {
			step_number: 6,
			day,
			slot_count_for_day: getDaySlotCount(day)
		});
	}

	function selectSlot(slot: TimeSlot) {
		setSelectedSlot(slot, 'manual');
	}

	async function confirmReservation() {
		if (!selectedSlot) {
			errorMessage = 'Please select a time slot first.';
			trackBookingEvent('book_confirm_validation_failed', {
				step_number: 8,
				reason: 'missing_slot'
			});
			return;
		}

		if (!email.trim()) {
			errorMessage = 'Email is required to confirm booking.';
			trackBookingEvent('book_confirm_validation_failed', {
				step_number: 8,
				reason: 'missing_email'
			});
			return;
		}

		if (!companyName.trim()) {
			errorMessage = 'Company name is required to confirm booking.';
			trackBookingEvent('book_confirm_validation_failed', {
				step_number: 8,
				reason: 'missing_company_name'
			});
			return;
		}

		if (!turnstileToken) {
			errorMessage = 'Please complete the verification challenge.';
			trackBookingEvent('book_confirm_validation_failed', {
				step_number: 8,
				reason: 'missing_turnstile_token'
			});
			return;
		}

		errorMessage = '';
		infoMessage = '';
		isConfirming = true;
		trackBookingEvent('book_confirm_started', {
			step_number: 8,
			volume_range: selectedVolumeRange,
			is_priority_routing: isPriorityRoutingVolume
		});

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
					companyName,
					emailsVolume: selectedVolumeRange,
					timeSlot: selectedSlot,
					timezone,
					turnstileToken
				})
			});

			confirmationUuid = confirmation.data.uuid;
			infoMessage = 'Booking confirmed. We have sent your booking details to your email.';
			trackBookingEvent('book_reservation_confirmed', {
				step_number: 9,
				confirmation_uuid: confirmation.data.uuid,
				slot_start: selectedSlot.start,
				slot_end: selectedSlot.end,
				is_priority_routing: isPriorityRoutingVolume,
				volume_range: selectedVolumeRange
			});
			void identifyPosthogUser(email.trim().toLowerCase());
		} catch (error) {
			const message = toErrorMessage(error, 'Could not confirm reservation.');
			errorMessage = message;
			turnstileToken = '';
			turnstileResetKey += 1;
			trackBookingEvent('book_reservation_failed', {
				step_number: 9,
				error_message: message,
				volume_range: selectedVolumeRange,
				is_priority_routing: isPriorityRoutingVolume
			});
		} finally {
			isConfirming = false;
		}
	}

	async function selectVolumeRange(rangeValue: string) {
		selectedVolumeRange = rangeValue;
		isVolumePickerCollapsed = true;
		trackBookingEvent('book_volume_selected', {
			step_number: 2,
			volume_range: rangeValue
		});

		const pickedRange = volumeRanges.find((range) => range.value === rangeValue);
		await routeRequest(pickedRange);
	}

	function handleSelfServeCreateAccountClick() {
		trackBookingEvent('book_self_serve_create_account_clicked', {
			step_number: 5,
			volume_range: selectedVolumeRange
		});
	}

	function handleSelfServeDocsClick() {
		trackBookingEvent('book_self_serve_docs_clicked', {
			step_number: 5,
			volume_range: selectedVolumeRange
		});
	}

	function getDaySlotCount(day: string) {
		return slotGroups.get(day)?.length ?? 0;
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
		const count = getDaySlotCount(day);
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

		<BookingAlerts {errorMessage} {infoMessage} />

		{#if !isConfirmed}
			<VolumePicker
				{volumeRanges}
				{selectedVolumeRange}
				{isVolumePickerCollapsed}
				onselectrange={selectVolumeRange}
				onexpand={() => {
					isVolumePickerCollapsed = false;
				}}
			/>

			{#if routingDecision === 'selfServe'}
				<SelfServeCard
					oncreateaccountclick={handleSelfServeCreateAccountClick}
					ondocsclick={handleSelfServeDocsClick}
				/>
			{/if}

			{#if routingDecision === 'qualified'}
				<SlotPicker
					{isPriorityRoutingVolume}
					isLoading={isLoadingConfig || isLoadingSlots}
					{slots}
					{selectedDay}
					{selectedDayLabel}
					{dayOptions}
					{visibleSlots}
					{selectedSlot}
					{selectedSlotSummary}
					{formatDay}
					{formatTime}
					{getDaySlotCount}
					onselectday={selectDay}
					onselectslot={selectSlot}
				/>

				<ContactFormCard
					bind:email
					bind:firstName
					bind:lastName
					bind:companyName
					bind:turnstileToken
					turnstileSiteKey={PUBLIC_TURNSTILE_SITE_KEY}
					{turnstileResetKey}
					{canConfirm}
					{isConfirming}
					{isConfirmed}
					redirectUrl={config?.configuration.redirectAfterBookingUrl}
					onconfirm={confirmReservation}
				/>
			{/if}
		{/if}
	</div>
</section>
