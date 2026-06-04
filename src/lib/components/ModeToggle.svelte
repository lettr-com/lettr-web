<script lang="ts">
	export type Mode = 'transactional' | 'marketing';

	interface Props {
		value: Mode;
		onChange?: (mode: Mode) => void;
	}

	let { value = $bindable('transactional'), onChange }: Props = $props();

	const options: Array<{
		key: Mode;
		label: string;
		description: string;
	}> = [
		{
			key: 'transactional',
			label: 'Transactional',
			description: 'Repetitive and automatic emails.'
		},
		{
			key: 'marketing',
			label: 'Marketing',
			description: 'Campaigns to promote your SaaS.'
		}
	];

	function select(mode: Mode) {
		if (value === mode) return;
		value = mode;
		onChange?.(mode);
	}
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="tablist" aria-label="Pricing mode">
	{#each options as option}
		{@const isActive = value === option.key}
		{@const isTransactional = option.key === 'transactional'}
		<button
			type="button"
			role="tab"
			aria-selected={isActive}
			onclick={() => select(option.key)}
			class="group relative flex items-start gap-3 border p-4 text-left transition-all duration-200
				{isActive
					? isTransactional
						? 'border-[#EC104B] bg-[#FFEFF4] shadow-[0_8px_24px_-12px_rgba(236,16,75,0.25)]'
						: 'border-[#00D46B] bg-[#E6FBF0] shadow-[0_8px_24px_-12px_rgba(0,212,107,0.25)]'
					: 'border-border/40 bg-white hover:border-border/70'}"
		>
			{#if isTransactional}
				<span
					aria-hidden="true"
					class="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[#EC104B] shadow-[inset_0_0_32px_0_rgba(255,236,241,0.2)]"
				>
					<svg width="16" height="22" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="block">
						<g filter="url(#mt_tx_shadow)">
							<path
								d="M11.3896 13.832L15 17.334L12.251 20L9.5 17.334L6.75098 20L4 17.334L6.75098 14.666L9.5 12L11.3896 13.832ZM15 6.66602L11.748 9.82031L9.5 12L6.75098 9.33398L4 6.66602L6.75098 4L9.5 6.66602L12.251 4L15 6.66602Z"
								fill="url(#mt_tx_grad)"
							/>
						</g>
						<defs>
							<filter id="mt_tx_shadow" x="0" y="0" width="19" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
								<feFlood flood-opacity="0" result="BackgroundImageFix" />
								<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
								<feOffset />
								<feGaussianBlur stdDeviation="2" />
								<feComposite in2="hardAlpha" operator="out" />
								<feColorMatrix type="matrix" values="0 0 0 0 0.101961 0 0 0 0 0 0 0 0 0 0.027451 0 0 0 0.2 0" />
								<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
								<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
							</filter>
							<linearGradient id="mt_tx_grad" x1="9.5" y1="4" x2="9.5" y2="20" gradientUnits="userSpaceOnUse">
								<stop stop-color="#FFEFF4" />
								<stop offset="1" stop-color="#FF90AE" />
							</linearGradient>
						</defs>
					</svg>
				</span>
			{:else}
				<span
					aria-hidden="true"
					class="relative flex h-10 w-10 shrink-0 items-center justify-center bg-[#00D46B] shadow-[inset_0_0_4px_0_#06C767]"
				>
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="block">
						<g filter="url(#mt_mk_shadow)">
							<path
								d="M11 15L7 19L3 15L7 11L11 15ZM19 15L15 19L11 15L15 11L19 15ZM11 7L7 11L3 7L7 3L11 7ZM19 7L15 11L11 7L15 3L19 7Z"
								fill="url(#mt_mk_grad)"
							/>
						</g>
						<defs>
							<filter id="mt_mk_shadow" x="0" y="0" width="22" height="22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
								<feFlood flood-opacity="0" result="BackgroundImageFix" />
								<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
								<feOffset />
								<feGaussianBlur stdDeviation="1.5" />
								<feComposite in2="hardAlpha" operator="out" />
								<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.0980392 0 0 0 0 0.0392157 0 0 0 0.2 0" />
								<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
								<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
							</filter>
							<linearGradient id="mt_mk_grad" x1="11" y1="3" x2="11" y2="19" gradientUnits="userSpaceOnUse">
								<stop stop-color="white" />
								<stop offset="1" stop-color="#AAFFD5" />
							</linearGradient>
						</defs>
					</svg>
				</span>
			{/if}

			<span class="flex min-w-0 flex-1 flex-col">
				<span class="font-heading text-base leading-5 text-surface">{option.label}</span>
				<span class="mt-1 text-sm leading-5 text-muted">{option.description}</span>
			</span>

			{#if isActive}
				<span
					aria-hidden="true"
					class="pointer-events-none absolute inset-0 border-2
						{isTransactional ? 'border-[rgba(236,16,76,0.35)]' : 'border-[rgba(6,223,115,0.35)]'}"
				></span>
			{/if}
		</button>
	{/each}
</div>
