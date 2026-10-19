<script lang="ts">
	import type { Lane } from '$lib/navigation/menu';

	interface Props {
		lane: Lane;
		size?: 'sm' | 'md';
	}

	let { lane, size = 'md' }: Props = $props();

	const box = $derived(size === 'sm' ? 'size-6' : 'size-8');
</script>

<!-- The same glyphs the pricing page uses for its Transactional and Marketing tabs. -->
<span
	class="flex shrink-0 items-center justify-center {box} {lane === 'transactional'
		? 'bg-primary'
		: lane === 'marketing'
			? 'bg-green'
			: 'bg-surface'}"
	aria-hidden="true"
>
	{#if lane === 'transactional'}
		<svg width={size === 'sm' ? 10 : 13} viewBox="0 0 19 24" fill="none">
			<path
				d="M11.39 13.83L15 17.33L12.25 20L9.5 17.33L6.75 20L4 17.33L6.75 14.67L9.5 12L11.39 13.83ZM15 6.67L11.75 9.82L9.5 12L6.75 9.33L4 6.67L6.75 4L9.5 6.67L12.25 4L15 6.67Z"
				fill="#FFEFF4"
			/>
		</svg>
	{:else if lane === 'marketing'}
		<svg width={size === 'sm' ? 11 : 15} viewBox="0 0 22 22" fill="none">
			<path
				d="M11 15L7 19L3 15L7 11L11 15ZM19 15L15 19L11 15L15 11L19 15ZM11 7L7 11L3 7L7 3L11 7ZM19 7L15 11L11 7L15 3L19 7Z"
				fill="#FFFFFF"
			/>
		</svg>
	{:else}
		<svg width={size === 'sm' ? 11 : 15} viewBox="0 0 19 19" fill="none">
			<path
				d="M4.73 16.561L2.365 18.927L0 16.561L2.365 14.196L4.73 16.561ZM11.09 13.455L14.195 16.561L11.83 18.927L9.464 16.561L7.099 18.927L4.731 16.561L7.099 14.195L9.464 11.83L11.09 13.455ZM18.927 16.561L16.561 18.927L14.195 16.561L16.561 14.196L18.927 16.561ZM4.73 11.829L2.365 14.194L0 11.829L2.365 9.464L4.73 11.829ZM18.927 11.829L16.561 14.194L14.195 11.829L16.561 9.464L18.927 11.829ZM11.828 9.464L9.463 11.829L7.098 9.464L9.463 7.099L11.828 9.464ZM4.73 7.098L2.365 9.463L0 7.098L2.365 4.732L4.73 7.098ZM18.927 7.098L16.561 9.463L14.195 7.098L16.561 4.732L18.927 7.098ZM14.195 2.365L11.398 5.163L9.464 7.098L7.099 4.731L4.731 2.365L7.099 0L9.464 2.365L11.83 0L14.195 2.365ZM4.73 2.366L2.365 4.731L0 2.366L2.365 0.001L4.73 2.366ZM18.927 2.366L16.561 4.731L14.195 2.366L16.561 0.001L18.927 2.366Z"
				fill="#FFFFFF"
			/>
		</svg>
	{/if}
</span>
