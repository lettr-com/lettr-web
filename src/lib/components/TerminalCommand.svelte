<script lang="ts">
	import { onDestroy } from 'svelte';
	import { CopyIcon, CheckIcon, TerminalWindowIcon } from 'phosphor-svelte';
	import { createSingleTimeoutManager } from '$lib/utils/timeoutManager';

	interface Props {
		commands: string[];
	}

	let { commands }: Props = $props();

	let copied: boolean = $state(false);
	const copyResetTimeout = createSingleTimeoutManager();

	async function copyCommands() {
		await navigator.clipboard.writeText(commands.join('\n'));
		copied = true;
		copyResetTimeout.schedule(() => {
			copied = false;
		}, 3000);
	}

	onDestroy(() => {
		copyResetTimeout.clear();
	});
</script>

<div class="w-full px-[6px] pb-[6px] pt-[2px] border border-border/30 bg-white">
	<div class="flex items-center justify-between py-2">
		<div class="flex items-center gap-1.5 pl-3 text-[12px] text-muted">
			<TerminalWindowIcon size={14} />
			Terminal
		</div>
		<button
			class="flex shrink-0 items-center gap-1.5 pr-1.5 text-muted transition-colors hover:text-surface text-[12px]"
			onclick={copyCommands}
			aria-label="Copy command"
		>
			{#if copied}
				<CheckIcon size={14} />
				Copied
			{:else}
				<CopyIcon size={14} />
				Copy code
			{/if}
		</button>
	</div>

	<div class="border-t border-gray-200 bg-gray-50 p-4">
		{#each commands as command}
			<div class="flex items-center gap-2 font-code text-[13px] leading-[1.6]">
				<span class="select-none text-primary">$</span>
				<span class="text-surface">{command}</span>
			</div>
		{/each}
	</div>
</div>
