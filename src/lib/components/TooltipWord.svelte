<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		/** What the tooltip says. */
		tip: string;
		children: Snippet;
	}

	let { tip, children }: Props = $props();

	function dismiss(event: KeyboardEvent) {
		if (event.key === 'Escape') (event.currentTarget as HTMLElement).blur();
	}
</script>

<!--
	Underlines a word with a dotted line and shows a short explanation on hover,
	keyboard focus or tap. Wrap any inline text: <TooltipWord tip="...">word</TooltipWord>
	The tip is drawn from `data-tip` with pseudo-elements, so it never becomes text in
	the page (a tooltip inside a heading would otherwise end up in the heading's text).
-->
<span
	class="relative inline-block cursor-help underline decoration-primary decoration-dotted decoration-2 underline-offset-[0.2em] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary
		before:pointer-events-none before:invisible before:absolute before:bottom-[calc(100%+0.25rem)] before:left-1/2 before:z-20 before:h-0 before:w-0 before:-translate-x-1/2 before:translate-y-1 before:border-x-[6px] before:border-t-[6px] before:border-x-transparent before:border-t-surface before:opacity-0 before:transition before:duration-150 before:ease-out before:content-['']
		after:pointer-events-none after:invisible after:absolute after:bottom-[calc(100%+0.625rem)] after:left-1/2 after:z-20 after:w-[min(17rem,calc(100vw-3rem))] after:-translate-x-1/2 after:translate-y-1 after:bg-surface after:px-4 after:py-3 after:text-left after:font-body after:text-[0.9375rem] after:leading-[1.45] after:font-normal after:tracking-normal after:text-white after:opacity-0 after:transition after:duration-150 after:ease-out after:content-[attr(data-tip)]
		hover:before:visible hover:before:translate-y-0 hover:before:opacity-100 hover:after:visible hover:after:translate-y-0 hover:after:opacity-100
		focus:before:visible focus:before:translate-y-0 focus:before:opacity-100 focus:after:visible focus:after:translate-y-0 focus:after:opacity-100
		motion-reduce:before:transition-none motion-reduce:after:transition-none"
	tabindex="0"
	role="button"
	data-tip={tip}
	{...{ 'aria-description': tip }}
	onkeydown={dismiss}
>
	{@render children()}
</span>
