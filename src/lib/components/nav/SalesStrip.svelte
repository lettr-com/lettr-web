<script lang="ts">
	import ArrowRight from 'phosphor-svelte/lib/ArrowRight';
	import X from 'phosphor-svelte/lib/X';
	import { salesHref } from '$lib/navigation/menu';
	import type { SalesPrompt } from '$lib/navigation/salesStrip';

	interface Props {
		visible: boolean;
		prompt: SalesPrompt;
		onContact: () => void;
		onDismiss: () => void;
	}

	let { visible, prompt, onContact, onDismiss }: Props = $props();
</script>

<!-- Sits under the bar (z-0) and slides out from behind it; open menus (z-20) draw over it. -->
<aside
	aria-label="Contact sales"
	data-visible={visible}
	class="nav-strip absolute inset-x-0 top-full z-0 border-b border-primary-outline bg-primary-soft"
>
	<div
		class="mx-auto flex h-11 max-w-[1200px] items-center justify-between gap-4 pr-1 pl-4 lg:px-6"
	>
		<p class="flex min-w-0 items-baseline gap-2">
			<span class="truncate text-[13px] leading-[18px] font-medium text-surface lg:hidden">
				{prompt.short}
			</span>
			<span class="hidden text-sm leading-[21px] font-medium text-surface lg:inline">{prompt.question}</span>
			<span class="hidden font-serif text-base leading-[21px] text-[#B00C38] italic lg:inline">
				{prompt.answer}
			</span>
		</p>
		<div class="flex shrink-0 items-center gap-0.5 lg:gap-2">
			<a
				href={salesHref}
				class="group flex items-center gap-1.5 px-2 py-1.5 text-[13px] leading-[19px] font-semibold text-primary-strong transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface lg:border lg:border-primary-strong lg:bg-fade-white lg:px-3 lg:py-[5px] lg:hover:bg-fade-primary-strong lg:hover:text-white"
				onclick={onContact}
			>
				Contact sales
				<ArrowRight size={12} class="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
			</a>
			<button
				type="button"
				class="flex size-10 items-center justify-center text-subtle transition-colors hover:text-surface focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-primary lg:size-7"
				aria-label="Hide this message"
				onclick={onDismiss}
			>
				<X size={14} aria-hidden="true" />
			</button>
		</div>
	</div>
</aside>
