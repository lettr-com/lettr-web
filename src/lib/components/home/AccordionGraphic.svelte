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

	const isGreen = $derived(id === 'segments' || id === 'campaigns' || id === 'analytics');
	const rowList = $derived(rows[id]);
	const chipList = $derived(id === 'sdks' ? sdks : id === 'multilingual' ? languages : null);
	const activeChip = $derived(id === 'sdks' ? 0 : 1);
	const tileLayout = $derived(
		id === 'rest-smtp' || id === 'sdks' ? 'center' : id === 'analytics' ? 'bars' : 'text'
	);
</script>

<div bind:clientWidth={available} class="w-full" style="height: {HEIGHT * scale}px" aria-hidden="true">
	<div
		class="flex h-[180px] w-[490px] origin-top-left items-center gap-[18px] bg-surface p-5"
		style="transform: scale({scale})"
	>
		<!-- left column -->
		{#if id === 'rest-smtp'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each ['REST API', 'SMTP'] as label}
					<div class="flex h-[62px] items-center border border-[#5a6576] px-4 font-code text-[15px] leading-5 text-white">{label}</div>
				{/each}
			</div>
		{:else if chipList}
			<div class="flex w-[210px] shrink-0 flex-wrap gap-2.5">
				{#each chipList as label, i}
					<div class="flex h-10 w-[100px] items-center border px-3 font-code text-sm leading-5 text-white {i === activeChip ? 'border-primary bg-primary/12' : 'border-[#5a6576]'}">{label}</div>
				{/each}
			</div>
		{:else if id === 'webhooks'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each events as event}
					<div class="flex h-10 items-center gap-3 border border-[#5a6576] px-3 font-code text-sm leading-5 text-white">
						<span class="h-2 w-2 shrink-0 {event.color}"></span>{event.label}
					</div>
				{/each}
			</div>
		{:else if id === 'security'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each securityEvents as label}
					<div class="flex h-10 items-center gap-3 border border-[#5a6576] px-3 font-code text-[13px] leading-5 text-white">
						<span class="h-2 w-2 shrink-0 bg-primary"></span>{label}
					</div>
				{/each}
			</div>
		{:else if id === 'synced'}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each syncedBars as bar}
					<div class="flex h-10 flex-col justify-between border border-[#5a6576] px-1.5 pt-1.5">
						<span class="h-1.5 bg-[#5a6576] {bar}"></span>
						<span class="h-3.5 w-full bg-primary"></span>
					</div>
				{/each}
			</div>
		{:else if rowList}
			<div class="flex w-[210px] shrink-0 flex-col gap-2.5">
				{#each rowList as row}
					<div
						class="flex h-10 items-center justify-between border px-3.5 font-code text-[13px] leading-5 {row.active === 'primary'
							? 'border-primary bg-primary/12'
							: row.active === 'green'
								? 'border-green bg-green/12'
								: 'border-[#5a6576]'}"
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
		<div class="flex h-[140px] w-7 shrink-0 items-center justify-center text-[28px] leading-8 font-medium text-border">
			{#if id === 'synced'}<ArrowLeftIcon size={28} />{:else}<ArrowRightIcon size={28} />{/if}
		</div>

		<!-- right tile -->
		<div
			class="flex h-[140px] w-[176px] shrink-0 {isGreen ? 'bg-green text-white' : 'bg-primary text-white'} {tileLayout === 'center'
				? 'items-center justify-center'
				: tileLayout === 'bars'
					? 'items-end gap-2.5 px-[22px] py-6'
					: 'flex-col justify-center gap-2.5 px-4'}"
		>
			{#if id === 'rest-smtp'}
				<svg width="76" height="56" viewBox="0 0 76 56" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="2" width="72" height="52" fill="none" stroke="#fff" stroke-width="3" />
					<path d="M3 4L38 31L73 4" fill="none" stroke="#fff" stroke-width="3" />
				</svg>
			{:else if id === 'sdks'}
				<svg width="84" height="56" viewBox="0 0 84 56" xmlns="http://www.w3.org/2000/svg">
					<path d="M26 10L6 28L26 46" fill="none" stroke="#fff" stroke-width="5" />
					<path d="M58 10L78 28L58 46" fill="none" stroke="#fff" stroke-width="5" />
					<path d="M48 6L36 50" fill="none" stroke="#fff" stroke-width="5" />
				</svg>
			{:else if id === 'webhooks'}
				<span class="w-fit text-[13px] leading-[18px] opacity-70">Your app</span>
				<span class="font-code text-sm leading-5">POST /webhooks</span>
				<span class="flex items-center gap-2 font-code text-xs leading-4"><span class="h-2 w-2 shrink-0 bg-white"></span>signed</span>
			{:else if id === 'synced'}
				<span class="w-fit text-[13px] leading-[18px] opacity-70">Shared footer</span>
				<span class="font-heading text-[17px] leading-5 font-semibold tracking-[-0.01em]">Edit once, updates everywhere</span>
			{:else if id === 'multilingual'}
				<span class="w-fit text-[13px] leading-[18px] opacity-70">Hallo Sarah,</span>
				<span class="font-heading text-[17px] leading-5 font-semibold tracking-[-0.01em]">Dein Testzeitraum läuft.</span>
				<span class="h-2 w-20 bg-white/40"></span>
			{:else if id === 'placeholders'}
				<span class="font-heading text-[17px] leading-5 font-semibold tracking-[-0.01em]">Hi Sarah, your Pro trial has 14 days left.</span>
				<span class="h-2 w-20 bg-white/40"></span>
			{:else if id === 'onboarding'}
				<span class="w-fit text-[13px] leading-[18px] opacity-70">Sign-up sequence</span>
				<span class="font-heading text-[17px] leading-5 font-semibold tracking-[-0.01em]">Sends itself, day by day</span>
				<span class="h-2 w-20 bg-white/40"></span>
			{:else if id === 'security'}
				<span class="w-fit text-[13px] leading-[18px] opacity-70">Priority lane</span>
				<span class="font-heading text-[17px] leading-5 font-semibold tracking-[-0.01em]">Never stuck behind a campaign</span>
			{:else if id === 'trial'}
				<span class="font-heading text-[17px] leading-5 font-semibold tracking-[-0.01em]">Your trial ends tomorrow.</span>
				<span class="w-fit bg-white px-3.5 py-2 text-[13px] leading-4 font-bold text-primary">Upgrade to Pro</span>
			{:else if id === 'segments'}
				<span class="w-fit text-[13px] leading-[18px] opacity-70">Segment</span>
				<span class="font-heading text-[17px] leading-5 font-semibold tracking-[-0.01em]">Trial users, 1,320 people</span>
				<span class="h-2 w-20 bg-white/40"></span>
			{:else if id === 'campaigns'}
				<span class="font-heading text-[56px] leading-[56px] font-semibold tracking-[-0.02em]">∞</span>
				<span class="text-[15px] leading-5 font-semibold">Send as many as you like</span>
			{:else}
				{#each [40, 64, 52, 92, 76] as bar, i}
					<span class="w-5 {i === 3 ? 'bg-white' : 'bg-white/50'}" style="height: {bar}px"></span>
				{/each}
			{/if}
		</div>
	</div>
</div>
