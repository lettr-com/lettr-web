<script lang="ts">
	import type { Snippet } from 'svelte';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';

	interface Props {
		/** The question text, shown as the always-visible summary. */
		question: string;
		/** The answer, revealed when the item is expanded. */
		children: Snippet;
	}

	let { question, children }: Props = $props();
</script>

<!--
	A single collapsible question/answer pair inside an <Faq> block. Built on the
	native <details>/<summary> element so it expands without any JavaScript, works
	before hydration, and is keyboard-accessible by default. The caret rotates via
	the `group-open` variant, matching the marketing FAQ's CaretDownIcon idiom.
-->
<details class="group">
	<summary
		class="flex cursor-pointer list-none items-start justify-between gap-3 p-5 font-semibold text-surface sm:px-6 [&::-webkit-details-marker]:hidden"
	>
		<span>{question}</span>
		<CaretDownIcon
			size={16}
			class="mt-0.5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
		/>
	</summary>
	<div class="px-5 pb-5 text-body leading-[1.8] text-muted sm:px-6">
		{@render children()}
	</div>
</details>
