<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		/** What the tooltip says. */
		tip: string;
		children: Snippet;
	}

	let { tip, children }: Props = $props();

	const id = `tip-${Math.random().toString(36).slice(2, 9)}`;

	function dismiss(event: KeyboardEvent) {
		if (event.key === 'Escape') (event.currentTarget as HTMLElement).blur();
	}
</script>

<!--
	Underlines a word with a dotted line and shows a short explanation on hover,
	keyboard focus or tap. Wrap any inline text: <TooltipWord tip="...">word</TooltipWord>
-->
<span
	class="group relative inline-block cursor-help underline decoration-primary decoration-dotted decoration-2 underline-offset-[0.2em] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
	tabindex="0"
	role="button"
	aria-describedby={id}
	onkeydown={dismiss}
>
	{@render children()}
	<span
		{id}
		role="tooltip"
		aria-hidden="true"
		class="pointer-events-none invisible absolute bottom-[calc(100%+0.625rem)] left-1/2 z-20 w-[min(17rem,calc(100vw-3rem))] -translate-x-1/2 translate-y-1 bg-surface px-4 py-3 text-left font-body text-[0.9375rem] leading-[1.45] font-normal tracking-normal text-white no-underline opacity-0 transition duration-150 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus:visible group-focus:translate-y-0 group-focus:opacity-100 motion-reduce:transition-none"
	>
		{tip}
		<span class="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-t-[6px] border-x-transparent border-t-surface" aria-hidden="true"></span>
	</span>
</span>
