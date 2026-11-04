<script module lang="ts">
	export type GraphicId =
		| 'rest-smtp'
		| 'sdks'
		| 'webhooks'
		| 'synced'
		| 'multilingual'
		| 'placeholders'
		| 'onboarding'
		| 'security'
		| 'trial'
		| 'segments'
		| 'campaigns'
		| 'analytics';
</script>

<script lang="ts">
	import ArrowLeftIcon from 'phosphor-svelte/lib/ArrowLeftIcon';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';

	/*
	 * Dark panels shown inside the open accordion rows. Authored at the fixed
	 * 490x180 size from the Paper boards and scaled down to fit narrow cards.
	 * The art on the right is rendered by tools/blog-images/accordion.mjs.
	 */

	interface Props {
		id: GraphicId;
	}

	interface Row {
		label: string;
		/** Right-hand value. */
		value?: string;
		/** Colour of the left label. */
		labelTone?: 'white' | 'pink';
		/** Colour of the right value. */
		valueTone?: 'white' | 'green';
		/** Highlight border, `primary` or `green`. */
		active?: 'primary' | 'green';
		/** Small square at the end of the row. */
		dot?: string;
	}

	let { id }: Props = $props();

	const WIDTH = 490;
	const HEIGHT = 180;

	let available = $state(WIDTH);
	let scale = $derived(Math.min(1, available / WIDTH));

	const sdks = ['Laravel', 'Node.js', 'PHP', 'Python', 'Ruby'];
	const languages = ['EN', 'DE', 'FR', 'ES', 'IT', 'PT'];
	const events = [
		{ label: 'delivered', color: 'bg-green' },
		{ label: 'opened', color: 'bg-primary' },
		{ label: 'clicked', color: 'bg-primary-outline' }
	];
	const securityEvents = ['password_reset', 'new_device_login', '2fa_code'];
	const syncedBars = ['w-[90px]', 'w-[120px]', 'w-[70px]'];

	const rows: Partial<Record<GraphicId, Row[]>> = {
		placeholders: [
			{ label: '{{first_name}}', value: 'Sarah', labelTone: 'pink' },
			{ label: '{{plan}}', value: 'Pro', labelTone: 'pink' },
			{ label: '{{days_left}}', value: '14', labelTone: 'pink' }
		],
		onboarding: [
			{ label: 'Day 0', value: 'Welcome', labelTone: 'pink' },
			{ label: 'Day 2', value: 'Setup tips', labelTone: 'pink' },
			{ label: 'Day 7', value: 'Check-in', labelTone: 'pink' }
		],
		trial: [
			{ label: 'Day 10', value: '4 days left', labelTone: 'pink' },
			{ label: 'Day 13', value: 'Ends tomorrow', labelTone: 'pink' },
			{ label: 'Day 14', value: 'Trial ended', labelTone: 'pink', active: 'primary' }
		],
		segments: [
			{ label: 'All contacts', value: '12,480', valueTone: 'green' },
			{ label: 'Trial users', value: '1,320', valueTone: 'green', active: 'green' },
			{ label: 'Power users', value: '214', valueTone: 'green' }
		],
		campaigns: [
			{ label: 'Spring launch', dot: 'bg-green' },
			{ label: 'Product update', dot: 'bg-primary-outline' },
			{ label: 'Newsletter', dot: 'bg-[#5a6576]' }
		],
		analytics: [
			{ label: 'Delivered', value: '99.2%', valueTone: 'green' },
			{ label: 'Opened', value: '46%', valueTone: 'green' },
			{ label: 'Clicked', value: '8.4%', valueTone: 'green' }
		]
	};

	const onInk = $derived(
		id === 'rest-smtp' || id === 'sdks' || id === 'webhooks' || id === 'segments' || id === 'campaigns' || id === 'analytics'
	);
	const rowList = $derived(rows[id]);
	const chipList = $derived(id === 'sdks' ? sdks : id === 'multilingual' ? languages : null);
	const activeChip = $derived(id === 'sdks' ? 0 : 1);
	const line = $derived(onInk ? 'border-[#5a6576]' : 'border-primary-outline/30');
</script>

<div bind:clientWidth={available} class="w-full" style="height: {HEIGHT * scale}px" aria-hidden="true">
	<div
		class="relative flex h-[180px] w-[490px] origin-top-left items-center gap-[18px] overflow-hidden p-5 {onInk ? 'bg-surface' : 'bg-[#23020b]'}"
		style="transform: scale({scale})"
	>
		<!-- left column -->
		{#if id === 'rest-smtp'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each ['REST API', 'SMTP'] as label}
					<div class="flex h-[62px] items-center border {line} px-4 font-code text-body-sm leading-5 text-white">{label}</div>
				{/each}
			</div>
		{:else if chipList}
			<div class="flex w-[210px] shrink-0 flex-wrap gap-2.5">
				{#each chipList as label, i}
					<div class="flex h-10 w-[100px] items-center border px-3 font-code text-sm leading-5 text-white {i === activeChip ? 'border-primary bg-primary/12' : line}">{label}</div>
				{/each}
			</div>
		{:else if id === 'webhooks'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each events as event}
					<div class="flex h-10 items-center gap-3 border {line} px-3 font-code text-sm leading-5 text-white">
						<span class="h-2 w-2 shrink-0 {event.color}"></span>{event.label}
					</div>
				{/each}
			</div>
		{:else if id === 'security'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each securityEvents as label}
					<div class="flex h-10 items-center gap-3 border {line} px-3 font-code text-caption leading-5 text-white">
						<span class="h-2 w-2 shrink-0 bg-primary"></span>{label}
					</div>
				{/each}
			</div>
		{:else if id === 'synced'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each syncedBars as bar}
					<div class="flex h-10 flex-col justify-between border {line} px-1.5 pt-1.5">
						<span class="h-1.5 bg-primary-outline/40 {bar}"></span>
						<span class="h-3.5 w-full bg-primary"></span>
					</div>
				{/each}
			</div>
		{:else if rowList}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each rowList as row}
					<div
						class="flex h-10 items-center justify-between border px-3.5 font-code text-caption leading-5 {row.active === 'primary'
							? 'border-primary bg-primary/12'
							: row.active === 'green'
								? 'border-green bg-green/12'
								: line}"
					>
						<span class={row.labelTone === 'pink' ? 'text-code-string' : 'text-white'}>{row.label}</span>
						{#if row.dot}
							<span class="h-2 w-2 shrink-0 {row.dot}"></span>
						{:else}
							<span class={row.valueTone === 'green' ? 'text-green' : 'text-white'}>{row.value}</span>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- arrow -->
		<div class="flex h-[140px] w-7 shrink-0 items-center justify-center text-[28px] leading-8 font-medium {onInk ? 'text-border' : 'text-primary-outline'}">
			{#if id === 'synced'}<ArrowLeftIcon size={28} />{:else}<ArrowRightIcon size={28} />{/if}
		</div>

		<!-- art, one pixel per dither cell -->
		<img src="/home/accordion/{id}.png" alt="" width="216" height="180" class="absolute top-0 right-0 [image-rendering:pixelated]" />
	</div>
</div>
