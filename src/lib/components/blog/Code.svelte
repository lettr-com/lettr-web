<script lang="ts">
	import { onMount } from 'svelte';
	import { getHighlighter } from '$lib/utils/shiki';

	interface Props {
		code: string;
		/** One of the languages loaded by the shiki highlighter (php, javascript, go, ruby, java, bash, shell). */
		lang?: string;
		filename?: string;
	}

	let { code, lang = 'bash', filename }: Props = $props();

	const supported = ['php', 'javascript', 'go', 'ruby', 'java', 'bash', 'shell'];
	let highlighted: string = $state('');

	onMount(() => {
		if (!supported.includes(lang)) return;
		getHighlighter().then((hl) => {
			highlighted = hl.codeToHtml(code.trim(), { lang, theme: 'lettr' });
		});
	});
</script>

<div
	data-reveal
	class="overflow-hidden bg-gray-950 p-[6px] pt-[2px] shadow-[0_0_40px_-10px_rgba(236,16,75,0.15)]"
>
	{#if filename}
		<div class="px-3 py-2 text-[12px] text-gray-300">{filename}</div>
	{/if}
	<div class="overflow-x-auto border-t border-gray-700 bg-gray-800 p-4">
		{#if highlighted}
			<div
				class="font-code [&_code]:!text-[13px] [&_code]:!leading-[1.6] [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!leading-[1.6]"
			>
				{@html highlighted}
			</div>
		{:else}
			<pre class="font-code text-[13px] leading-[1.6] text-gray-100"><code>{code.trim()}</code></pre>
		{/if}
	</div>
</div>
