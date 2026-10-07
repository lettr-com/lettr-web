<script lang="ts">
	import DitherSide from '$lib/components/home/DitherSide.svelte';
	import type { Mode } from '$lib/data/pricing';

	interface Props {
		value: Mode;
		onChange?: (mode: Mode) => void;
	}

	let { value = $bindable('transactional'), onChange }: Props = $props();

	const modes: Mode[] = ['transactional', 'marketing'];

	function select(mode: Mode) {
		if (value === mode) return;
		value = mode;
		onChange?.(mode);
	}

	function onKeydown(event: KeyboardEvent, index: number) {
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = modes[(index + step + modes.length) % modes.length];
		select(next);
		document.getElementById(`pricing-tab-${next}`)?.focus();
	}
</script>

<div role="tablist" aria-label="Pricing mode" class="grid gap-2 sm:grid-cols-2 sm:gap-4">
	{#each modes as mode, index}
		{@const isActive = value === mode}
		{@const isTransactional = mode === 'transactional'}
		<button
			type="button"
			role="tab"
			id="pricing-tab-{mode}"
			aria-selected={isActive}
			tabindex={isActive ? 0 : -1}
			onclick={() => select(mode)}
			onkeydown={(event) => onKeydown(event, index)}
			class="relative flex cursor-pointer items-center gap-4 overflow-hidden border-2 p-4 text-left transition-colors sm:gap-5 sm:px-6 sm:py-[22px] {isActive
				? isTransactional
					? 'border-primary bg-[#23020b]'
					: 'border-green bg-[#002010]'
				: 'border-white bg-white hover:border-primary-outline'}"
		>
			<span
				aria-hidden="true"
				class="relative flex h-12 w-12 shrink-0 items-center justify-center {isTransactional ? 'bg-primary' : 'bg-green'}"
			>
				{#if isTransactional}
					<svg width="20" height="26" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M11.39 13.83L15 17.33L12.25 20L9.5 17.33L6.75 20L4 17.33L6.75 14.67L9.5 12L11.39 13.83ZM15 6.67L11.75 9.82L9.5 12L6.75 9.33L4 6.67L6.75 4L9.5 6.67L12.25 4L15 6.67Z"
							fill="#FFEFF4"
						/>
					</svg>
				{:else}
					<svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M11 15L7 19L3 15L7 11L11 15ZM19 15L15 19L11 15L15 11L19 15ZM11 7L7 11L3 7L7 3L11 7ZM19 7L15 11L11 7L15 3L19 7Z"
							fill="#FFFFFF"
						/>
					</svg>
				{/if}
			</span>
			{#if isActive}
				<DitherSide
					color={isTransactional ? '#ec104b' : '#00c851'}
					variant={isTransactional ? 'ripple' : 'noise'}
					edge="bottom"
					width={18}
					cell={6}
				/>
			{/if}
			<span class="relative flex min-w-0 flex-col gap-1">
				<span
					class="leading-[26px] {isTransactional
						? 'font-heading text-xl tracking-[-0.03em] sm:text-[1.375rem]'
						: 'font-serif text-[1.375rem] font-medium tracking-[-0.03em] sm:text-2xl'} {isActive ? 'text-white' : 'text-surface'}"
				>
					{isTransactional ? 'Transactional' : 'Marketing'}
				</span>
				<span
					class="text-[0.9375rem] leading-[22px] {isActive ? (isTransactional ? 'text-primary-outline' : 'text-[#aaffd5]') : 'text-muted'}"
				>
					{isTransactional ? 'Automated, event-triggered emails.' : 'Campaigns to promote your SaaS.'}
				</span>
			</span>
		</button>
	{/each}
</div>
