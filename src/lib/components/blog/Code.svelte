<script lang="ts">
	import { onMount } from 'svelte';
	import { getHighlighter } from '$lib/utils/shiki';

	interface Props {
		code: string;
		/** A language loaded by the shiki highlighter; `ts` and `text` are accepted aliases. */
		lang?: string;
		filename?: string;
	}

	let { code, lang = 'bash', filename }: Props = $props();

	const aliases: Record<string, string> = { ts: 'typescript', js: 'javascript', sh: 'bash' };
	const supported = ['php', 'javascript', 'typescript', 'json', 'python', 'go', 'ruby', 'java', 'bash', 'shell'];
	const grammar = $derived(aliases[lang] ?? lang);
	const label = $derived(filename ?? (lang === 'text' ? '' : lang));

	let highlighted: string = $state('');
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(code.trim());
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			copied = false;
		}
	}

	onMount(() => {
		if (!supported.includes(grammar)) return;
		getHighlighter().then((hl) => {
			highlighted = hl.codeToHtml(code.trim(), { lang: grammar, theme: 'lettr' });
		});
	});
</script>

<div class="bg-surface">
	<div class="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2">
		<span class="font-code text-[13px] text-gray-400">{label}</span>
		<button
			type="button"
			onclick={copy}
			class="text-[13px] font-semibold text-background transition-colors hover:text-primary-outline"
			aria-label={copied ? 'Copied' : 'Copy code'}
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</div>
	<div class="overflow-x-auto p-4">
		{#if highlighted}
			<div
				class="font-code [&_code]:!text-[14px] [&_code]:!leading-[1.65] [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!leading-[1.65]"
			>
				{@html highlighted}
			</div>
		{:else}
			<pre class="font-code text-[14px] leading-[1.65] text-gray-100"><code>{code.trim()}</code></pre>
		{/if}
	</div>
</div>
