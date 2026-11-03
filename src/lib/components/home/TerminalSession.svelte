<script lang="ts">
	import { onMount } from 'svelte';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
	import TerminalWindowIcon from 'phosphor-svelte/lib/TerminalWindowIcon';
	import type { TerminalScript } from '$lib/home/terminalScripts';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	/*
	 * A terminal session that types once when it scrolls into view and again
	 * when the script changes. Every line is laid out from the start and only
	 * revealed, so the window never changes height. The server render and
	 * reduced motion show the finished session.
	 */

	interface Props {
		script: TerminalScript;
	}

	let { script }: Props = $props();

	const commands = $derived(script.lines.filter((l) => l.kind === 'cmd').map((l) => l.text));

	let revealed = $state(Infinity);
	let typed = $state(0);
	let isRunning = $state(false);
	let hasStarted = false;
	let copied: number | 'all' | null = $state(null);
	let host: HTMLElement | undefined = $state();
	let timers: number[] = [];
	let copyTimer: number | undefined;

	const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	function stop() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	function run() {
		stop();
		if (reducedMotion()) {
			revealed = Infinity;
			isRunning = false;
			return;
		}
		revealed = 0;
		typed = 0;
		isRunning = true;
		let t = 250;
		script.lines.forEach((line, i) => {
			if (line.kind === 'cmd') {
				const step = Math.min(24, 620 / line.text.length);
				for (let c = 1; c <= line.text.length; c++) {
					timers.push(window.setTimeout(() => (typed = c), t + c * step));
				}
				t += line.text.length * step + 260;
			} else {
				t += line.kind === 'ok' ? 380 : 110;
			}
			timers.push(
				window.setTimeout(() => {
					revealed = i + 1;
					typed = 0;
				}, t)
			);
		});
		timers.push(window.setTimeout(() => (isRunning = false), t + 50));
	}

	async function copy(text: string, which: number | 'all') {
		try {
			await navigator.clipboard.writeText(text);
			copied = which;
			clearTimeout(copyTimer);
			copyTimer = window.setTimeout(() => (copied = null), 1600);
			void capturePosthogEvent('terminal_code_copied', { framework: script.id, scope: which === 'all' ? 'all' : 'line' });
		} catch {
			copied = null;
		}
	}

	// Replay when the reader switches framework, once the session has played.
	$effect(() => {
		void script;
		if (hasStarted) run();
	});

	onMount(() => {
		if (!host || reducedMotion()) return;
		revealed = 0;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				hasStarted = true;
				run();
			},
			{ threshold: 0.4 }
		);
		observer.observe(host);
		return () => {
			observer.disconnect();
			stop();
			clearTimeout(copyTimer);
		};
	});
</script>

{#snippet copyIcon(active: boolean)}
	<span class="swap" aria-hidden="true">
		<CopyIcon size={14} data-off={active ? '' : undefined} />
		<CheckIcon size={14} weight="bold" class="text-green" data-off={active ? undefined : ''} />
	</span>
{/snippet}

<div bind:this={host} class="term">
	<div class="term-bar">
		<span class="flex items-center gap-2 font-code text-[12px] text-white/60">
			<TerminalWindowIcon size={15} aria-hidden="true" />{script.title}
		</span>
		<button
			type="button"
			class="term-btn ml-auto"
			onclick={() => copy(commands.join('\n'), 'all')}
			aria-label="Copy {script.label} {commands.length > 1 ? 'commands' : 'command'}"
		>
			{@render copyIcon(copied === 'all')}
			<span class="swap" aria-hidden="true">
				<span data-off={copied === 'all' ? '' : undefined}>{commands.length > 1 ? 'Copy all' : 'Copy'}</span>
				<span data-off={copied === 'all' ? undefined : ''}>Copied</span>
			</span>
		</button>
		<span class="sr-only" aria-live="polite">{copied !== null ? 'Copied to clipboard' : ''}</span>
	</div>

	<div class="term-body">
		{#each script.lines as line, i (`${script.id}-${i}`)}
			{@const shown = i < revealed}
			{@const typing = !shown && i === revealed && line.kind === 'cmd' && isRunning}
			<div class="term-line" data-kind={line.kind} data-hidden={shown || typing ? undefined : ''}>
				{#if line.kind === 'cmd'}
					<span class="prompt" aria-hidden="true">$</span>
					<span class="cmd"
						>{#if typing}<span>{line.text.slice(0, typed)}</span><span class="caret" aria-hidden="true"></span><span class="ghost">{line.text.slice(typed)}</span>{:else}{line.text}{/if}</span
					>
					{#if commands.length > 1}
						<button type="button" class="term-btn line-copy" onclick={() => copy(line.text, i)} aria-label="Copy command: {line.text}">
							{@render copyIcon(copied === i)}
						</button>
					{/if}
				{:else if line.kind === 'ok'}
					<span class="badge"><CheckIcon size={12} weight="bold" aria-hidden="true" />{line.text}</span>
				{:else}
					<span class="out">{line.text}</span>
				{/if}
			</div>
		{/each}
		<div class="term-line" data-kind="cmd" data-hidden={revealed >= script.lines.length ? undefined : ''} aria-hidden="true">
			<span class="prompt">$</span><span class="caret idle"></span>
		</div>
	</div>
</div>

<style>
	/* A slate window: lighter than the ink stage, so it separates by surface, not by shadow. */
	.term {
		background: #1c2434;
		box-shadow: 0 0 0 1px rgb(247 241 243 / 0.1);
	}
	.term-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		height: 44px;
		padding: 0 6px 0 16px;
		background: #151c2a;
		box-shadow: inset 0 -1px 0 #2a3447;
	}
	.term-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 30px;
		min-width: 30px;
		padding-inline: 8px;
		justify-content: center;
		font-size: 12.5px;
		font-weight: 500;
		color: rgb(255 255 255 / 0.7);
		cursor: pointer;
		transition:
			color 120ms ease,
			background-color 120ms ease;
	}
	.term-btn:hover {
		color: #fff;
		background: #222b3d;
	}
	.term-btn:focus-visible {
		outline: 2px solid #f9b7c9;
		outline-offset: -2px;
	}
	.swap {
		display: inline-grid;
		place-items: center;
	}
	.swap > :global(*) {
		grid-area: 1 / 1;
		transition:
			opacity 160ms ease,
			transform 200ms cubic-bezier(0.25, 0.8, 0.25, 1);
	}
	.swap > :global([data-off]) {
		opacity: 0;
		transform: scale(0.7);
	}

	.term-body {
		min-height: 268px;
		padding: 20px 20px 40px;
		font-family: var(--font-code);
		font-size: 13px;
		line-height: 1.7;
		color: #ece7ea;
	}
	.term-line {
		display: flex;
		align-items: flex-start;
		gap: 1ch;
		min-height: 1.7em;
	}
	.term-line[data-hidden] {
		visibility: hidden;
	}
	.term-line:not([data-hidden]):not([data-kind='cmd']) {
		animation: rise 260ms cubic-bezier(0.25, 0.8, 0.25, 1);
	}
	.term-line[data-kind='cmd']:not(:first-child) {
		margin-top: 0.55em;
	}
	.term-line[data-kind='dim'] {
		color: #7c8596;
	}
	.term-line[data-kind='out'] {
		color: #b5bcc8;
	}
	.term-line[data-kind='code'] {
		padding-left: 2ch;
		color: #f9a8b8;
	}
	.term-line[data-kind='ok'] {
		margin-block: 0.35em;
	}
	.prompt {
		flex: none;
		color: #ff4d7a;
		user-select: none;
	}
	.cmd,
	.out {
		flex: 1;
		min-width: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.ghost {
		visibility: hidden;
	}
	.caret {
		display: inline-block;
		width: 0.6em;
		height: 1.15em;
		margin-bottom: -0.2em;
		background: #ece7ea;
		opacity: 0.85;
	}
	.caret.idle {
		animation: blink 1.1s steps(1) 4;
	}
	.badge {
		display: inline-flex;
		align-items: center;
		gap: 0.6ch;
		padding: 0 0.8ch;
		background: var(--color-green);
		color: #04140b;
	}
	.line-copy {
		flex: none;
		height: 1.7em;
		min-width: 28px;
		margin-left: auto;
		padding-inline: 6px;
		color: rgb(255 255 255 / 0.4);
	}
	@media (pointer: coarse) {
		.term-btn {
			height: 40px;
			min-width: 40px;
		}
		.line-copy {
			height: 32px;
			margin-block: -4px;
		}
	}
	@media (max-width: 500px) {
		.term-body {
			padding: 16px 16px 32px;
			font-size: 12.5px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.term-line,
		.caret.idle,
		.swap > :global(*) {
			animation: none !important;
			transition: none !important;
		}
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
