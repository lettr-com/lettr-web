<script lang="ts">
	import type { Snippet } from 'svelte';
	import ArrowUpRightIcon from 'phosphor-svelte/lib/ArrowUpRightIcon';

	interface Props {
		title: string;
		description: string;
		href: string;
		children: Snippet;
		surface?: 'background' | 'white' | 'dark';
		onselect?: () => void;
	}

	let { title, description, href, children, surface = 'background', onselect }: Props = $props();
</script>

<a
	data-reveal
	{href}
	onclick={onselect}
	class="group flex min-h-[450px] min-w-0 flex-col overflow-hidden border p-7 transition-colors hover:border-primary/50 sm:min-h-[540px] sm:p-9 {surface === 'dark' ? 'border-white/15 bg-muted' : surface === 'white' ? 'border-border/40 bg-white' : 'border-border/40 bg-background'}"
>
	<div class="flex items-start justify-between gap-5">
		<h3 class="max-w-[17ch] text-[1.65rem] leading-[1.13] tracking-[-0.02em] sm:text-[2.15rem] {surface === 'dark' ? 'text-white' : 'text-surface'}">
			{title}
		</h3>
		<span class="flex h-11 w-11 shrink-0 items-center justify-center border transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white {surface === 'dark' ? 'border-white/20 bg-surface text-white' : 'border-border/40 bg-white text-surface'}" aria-hidden="true">
			<ArrowUpRightIcon size={20} />
		</span>
	</div>

	<div class="flex min-h-[250px] flex-1 items-center justify-center py-8 sm:min-h-[300px]" aria-hidden="true">
		{@render children()}
	</div>

	<p class="max-w-[37ch] text-sm leading-relaxed sm:text-base {surface === 'dark' ? 'text-white/70' : 'text-muted/75'}">{description}</p>
</a>
