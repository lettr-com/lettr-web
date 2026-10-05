<script lang="ts">
	import { onMount, tick, untrack } from 'svelte';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
	import { installCommand, type TerminalScript } from '$lib/home/terminalScripts';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	/*
	 * Terminal that slides in when it scrolls into view, then types a script
	 * out and replays it whenever the script changes. Text is real DOM text, so
	 * it stays selectable, and the Copy button puts just the install command on
	 * the clipboard.
	 */

	interface Props {
		script: TerminalScript;
	}

	interface Line {
		kind: 'cmd' | 'file' | 'out';
		text: string;
		prompt?: string;
		name?: string;
		tone?: 'ok' | 'muted' | 'plain';
	}

	let { script }: Props = $props();

	let lines: Line[] = $state([]);
	let isTyping = $state(false);
	let isMounted = $state(false);
	let hasStarted = $state(false);
	let didCopy = $state(false);
	let host: HTMLElement | undefined = $state();
	let body: HTMLElement | undefined = $state();
	let token = 0;
	let isFirstRun = true;
	let copyTimer: number | undefined;
	let blipTimer: number | undefined;
	// status light in the window bar flares up now and then
	let blip: 'idle' | 'flare' | 'dim' = $state('idle');

	const transcript = $derived(
		script.steps
			.map((step) => {
				if (step.kind === 'cmd') return `${step.prompt ?? '$'} ${step.text}`;
				if (step.kind === 'file') return `${step.name}:\n${step.text}`;
				return step.text;
			})
			.join('\n')
	);

	const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

	async function scrollToEnd() {
		await tick();
		if (body) body.scrollTop = body.scrollHeight;
	}

	function showAll(target: TerminalScript) {
		lines = target.steps.map((step) =>
			step.kind === 'out'
				? { kind: 'out', text: step.text, tone: step.tone }
				: step.kind === 'file'
					? { kind: 'file', text: step.text, name: step.name }
					: { kind: 'cmd', text: step.text, prompt: step.prompt ?? '$' }
		);
		isTyping = false;
		void scrollToEnd();
	}

	async function play(target: TerminalScript, run: number) {
		const stale = () => run !== token;
		lines = [];
		isTyping = true;
		// let the slide-in land before the first keystroke
		if (isFirstRun) {
			isFirstRun = false;
			await sleep(650);
		}
		for (const step of target.steps) {
			if (stale()) return;
			if (step.kind === 'out') {
				await sleep(220);
				if (stale()) return;
				lines.push({ kind: 'out', text: step.text, tone: step.tone });
				void scrollToEnd();
				continue;
			}

			const index = lines.length;
			lines.push(
				step.kind === 'file'
					? { kind: 'file', text: '', name: step.name }
					: { kind: 'cmd', text: '', prompt: step.prompt ?? '$' }
			);
			const perChar = step.kind === 'file' ? 11 : 26;
			for (let i = 1; i <= step.text.length; i++) {
				if (stale()) return;
				lines[index].text = step.text.slice(0, i);
				if (i % 4 === 0) void scrollToEnd();
				await sleep(step.text[i - 1] === '\n' ? 90 : perChar + Math.random() * 14);
			}
			void scrollToEnd();
			await sleep(step.kind === 'file' ? 420 : 300);
		}
		if (!stale()) isTyping = false;
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(installCommand(script));
			didCopy = true;
			clearTimeout(copyTimer);
			copyTimer = window.setTimeout(() => (didCopy = false), 1800);
			void capturePosthogEvent('terminal_code_copied', { framework: script.id });
		} catch {
			didCopy = false;
		}
	}

	// replay whenever the framework changes, once the terminal has scrolled into view
	$effect(() => {
		if (!hasStarted) return;
		const current = script;
		const run = ++token;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			untrack(() => showAll(current));
			return;
		}
		// play() reads and writes `lines`; keep that out of this effect's dependencies
		untrack(() => void play(current, run));
		return () => {
			token++;
		};
	});

	/**
	 * Flare the status light at unpredictable, fairly rare intervals. About half the
	 * time it double-blips: flare, a visible dip, then a second, longer flare.
	 */
	function scheduleBlip() {
		blipTimer = window.setTimeout(async () => {
			if (Math.random() < 0.5) {
				blip = 'flare';
				await sleep(80);
				blip = 'dim';
				await sleep(130);
				blip = 'flare';
				await sleep(150);
			} else {
				blip = 'flare';
				await sleep(110 + Math.random() * 90);
			}
			blip = 'idle';
			scheduleBlip();
		}, 3500 + Math.random() * 8500);
	}

	onMount(() => {
		isMounted = true;
		if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) scheduleBlip();
		if (!host) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				hasStarted = true;
				observer.disconnect();
			},
			{ threshold: 0.3 }
		);
		observer.observe(host);
		return () => {
			observer.disconnect();
			clearTimeout(copyTimer);
			clearTimeout(blipTimer);
			token++;
		};
	});
</script>

<style>
	@keyframes cursor-blink {
		50% {
			opacity: 0;
		}
	}

	.cursor {
		animation: cursor-blink 1s steps(1, end) infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor {
			animation: none;
		}
	}
</style>

<div
	bind:this={host}
	class="relative w-full overflow-hidden border border-white/15 bg-[#070b14] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none {isMounted && !hasStarted ? 'translate-y-16 opacity-0' : 'translate-y-0 opacity-100'}"
>
	<!-- window chrome -->
	<div class="relative flex h-10 items-center justify-between border-b border-white/10 bg-[#030712] pr-2 pl-4">
		<div class="flex items-center gap-3" aria-hidden="true">
			<span
				class="h-2.5 w-2.5 transition-[box-shadow,background-color] duration-100 {blip === 'flare' ? 'bg-[#ff3b6e] shadow-[0_0_14px_4px_rgba(255,59,110,0.9)]' : blip === 'dim' ? 'bg-[#7a0a2a] shadow-none' : 'bg-primary shadow-[0_0_7px_1px_rgba(236,16,75,0.65)]'}"
			></span>
			<span class="font-code text-[11px] text-white/60">{script.title}</span>
		</div>
		<button
			type="button"
			onclick={copy}
			class="flex h-7 cursor-pointer items-center gap-1.5 border border-white/15 px-2.5 text-[12px] font-medium text-white/80 transition-colors hover:border-primary hover:text-white"
			aria-label={didCopy ? 'Copied to clipboard' : `Copy ${script.label} install command`}
		>
			{#if didCopy}
				<CheckIcon aria-hidden="true" size={13} class="text-green" />Copied
			{:else}
				<CopyIcon aria-hidden="true" size={13} />Copy
			{/if}
		</button>
	</div>

	<!-- screen -->
	<div
		bind:this={body}
		class="h-[330px] overflow-hidden px-5 py-5 font-code text-[12.5px] leading-[1.65] text-white sm:h-[351px] sm:px-6 sm:text-[13px]"
		aria-hidden="true"
	>
		{#each lines as line, i}
			{#if line.kind === 'out'}
				<div class="{line.tone === 'ok' ? 'text-green' : line.tone === 'muted' ? 'opacity-60' : ''}">{line.text}</div>
			{:else if line.kind === 'file'}
				<div class="mt-2 mb-2 border-l-2 border-primary/70 pl-3">
					<div class="mb-1 text-[11px] opacity-50">{line.name}</div>
					<pre class="m-0 font-code whitespace-pre-wrap">{line.text}{#if isTyping && i === lines.length - 1}<span class="cursor inline-block w-[0.6ch] bg-current">&nbsp;</span>{/if}</pre>
				</div>
			{:else}
				<div class="flex gap-2.5">
					<span class="shrink-0 text-primary">{line.prompt}</span>
					<span class="min-w-0 break-words whitespace-pre-wrap">{line.text}{#if isTyping && i === lines.length - 1}<span class="cursor inline-block w-[0.6ch] bg-current">&nbsp;</span>{/if}</span>
				</div>
			{/if}
		{/each}
		{#if !isTyping && lines.length}
			<div class="flex gap-2.5">
				<span class="shrink-0 text-primary">$</span>
				<span class="cursor inline-block w-[0.6ch] bg-current">&nbsp;</span>
			</div>
		{/if}
	</div>

	<pre class="sr-only">{transcript}</pre>
</div>
