<script lang="ts">
	interface Props {
		code: string;
		/** Shown as the label when there is no filename; `text` shows none. */
		lang?: string;
		filename?: string;
		/** `code` highlighted at prerender time (`highlightCode` in the page's server load); without it the code shows uncoloured. */
		html?: string;
	}

	let { code, lang = 'bash', filename, html }: Props = $props();

	const label = $derived(filename ?? (lang === 'text' ? '' : lang));

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
		{#if html}
			<div
				class="font-code [&_code]:!text-[14px] [&_code]:!leading-[1.65] [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!leading-[1.65]"
			>
				{@html html}
			</div>
		{:else}
			<pre class="font-code text-[14px] leading-[1.65] text-gray-100"><code>{code.trim()}</code></pre>
		{/if}
	</div>
</div>
