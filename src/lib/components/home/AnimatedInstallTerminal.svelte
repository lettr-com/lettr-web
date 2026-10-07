<script lang="ts">
	import { onMount } from 'svelte';

	const lines = [
		{ prompt: '%', text: 'composer require lettr/lettr-laravel' },
		{ prompt: '%', text: 'php artisan lettr:init' },
		{ prompt: '%', text: 'php artisan tinker' },
		{ prompt: '>>>', text: "Mail::to('user@example.com')->queue(new WelcomeEmail());" }
	] as const;

	let terminal: HTMLElement | undefined = $state();
	let currentLine: number = $state(lines.length);
	let typedLines = $state<string[]>(lines.map((line) => line.text));

	onMount(() => {
		if (!terminal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let timer: number | undefined;
		let isCancelled = false;
		let hasStarted = false;
		typedLines = lines.map(() => '');
		currentLine = 0;

		function typeLine(lineIndex: number, characterIndex: number) {
			if (isCancelled || lineIndex >= lines.length) return;

			const line = lines[lineIndex].text;
			typedLines[lineIndex] = line.slice(0, characterIndex);

			if (characterIndex < line.length) {
				timer = window.setTimeout(() => typeLine(lineIndex, characterIndex + 1), 28);
				return;
			}

			timer = window.setTimeout(() => {
				currentLine = lineIndex + 1;
				typeLine(lineIndex + 1, 0);
			}, lineIndex === 2 ? 550 : 420);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting || hasStarted) return;
				hasStarted = true;
				observer.disconnect();
				typeLine(0, 0);
			},
			{ threshold: 0.35 }
		);
		observer.observe(terminal);

		return () => {
			isCancelled = true;
			observer.disconnect();
			if (timer !== undefined) window.clearTimeout(timer);
		};
	});
</script>

<style>
	@keyframes cursor-blink {
		50% { opacity: 0; }
	}

	.cursor {
		animation: cursor-blink 1s steps(1, end) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor { animation: none; }
	}
</style>

<div
	bind:this={terminal}
	role="img"
	aria-label="macOS terminal: composer require lettr/lettr-laravel; php artisan lettr:init; php artisan tinker; Mail::to('user@example.com')->queue(new WelcomeEmail());"
	class="mx-auto w-full max-w-[780px] overflow-hidden border border-white/30 bg-surface shadow-[0_28px_70px_rgba(0,0,0,0.28)]"
>
	<div class="relative flex h-11 items-center justify-center border-b border-white/15 bg-muted px-4 text-[11px] text-white/75" aria-hidden="true">
		<div class="absolute left-4 flex gap-2">
			<span class="h-3 w-3 border border-[#e0443e] bg-[#ff5f57]" style="border-radius: 50%"></span>
			<span class="h-3 w-3 border border-[#d89e24] bg-[#febc2e]" style="border-radius: 50%"></span>
			<span class="h-3 w-3 border border-[#1da83b] bg-[#28c840]" style="border-radius: 50%"></span>
		</div>
		<span class="font-medium">my-saas — zsh</span>
	</div>

	<div class="min-h-[300px] px-5 py-7 sm:min-h-[340px] sm:px-8 sm:py-9" aria-hidden="true">
		<div class="space-y-4 font-code text-xs leading-[1.7] text-white sm:text-base">
			{#each lines as line, index}
				{#if index <= currentLine}
					<div class="flex items-start gap-3">
						<span class="shrink-0 text-primary">{line.prompt}</span>
						<span class="min-w-0 break-all">{typedLines[index]}{#if index === currentLine}<span class="cursor inline-block w-[0.6ch] bg-white align-[-0.1em]">&nbsp;</span>{/if}</span>
					</div>
				{/if}
			{/each}
			{#if currentLine === lines.length}
				<div class="flex items-center gap-3"><span class="text-primary">&gt;&gt;&gt;</span><span class="cursor inline-block w-[0.6ch] bg-white">&nbsp;</span></div>
			{/if}
		</div>
	</div>
</div>
