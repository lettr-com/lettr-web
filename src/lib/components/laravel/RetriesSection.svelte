<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowClockwiseIcon from 'phosphor-svelte/lib/ArrowClockwiseIcon';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	interface Props {
		/** The synchronous send snippet, one highlighted HTML line per entry. */
		syncSend: string[];
	}

	let { syncSend }: Props = $props();

	let stage: HTMLElement | undefined = $state();

	const facts = [
		{ label: 'Applies to', value: 'queued sends, by default' },
		{ label: 'Key kept for', value: '24 hours' },
		{ label: 'Replay reported as', value: '$response->replayed' }
	];

	const worker = [
		{ time: '14:02:11', status: 'RUNNING', tone: 'text-[#f0f0f0]/75' },
		{ time: '14:02:41', status: '30s FAIL', tone: 'text-[#ff6b8f]' },
		{ time: '14:02:44', status: 'RUNNING', tone: 'text-[#f0f0f0]/75' },
		{ time: '14:02:45', status: '812ms DONE', tone: 'text-green' }
	];

	/*
	 * The story plays in steps: 1 the job starts, 2 it times out after the API
	 * accepted the email, 3 the worker retries, 4 the retry finishes. The
	 * prerendered page shows the last step, so nothing depends on scripts.
	 */
	const LAST = 4;
	let step = $state(LAST);
	let idempotent = $state(true);
	let playing = $state(false);
	let reduced = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	const emails = $derived(step < 2 ? 0 : step >= 4 && !idempotent ? 2 : 1);

	function play() {
		timers.forEach(clearTimeout);
		if (reduced) {
			step = LAST;
			return;
		}
		playing = true;
		step = 0;
		timers = [1, 2, 3, 4].map((n) =>
			setTimeout(() => {
				step = n;
				if (n === LAST) playing = false;
			}, n * 650)
		);
	}

	function replay() {
		play();
		void capturePosthogEvent('laravel_retry_demo_played', { idempotent });
	}

	function toggleIdempotency() {
		idempotent = !idempotent;
		play();
		void capturePosthogEvent('laravel_retry_demo_toggled', { idempotent });
	}

	const shown = (from: number) =>
		step >= from ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1';

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const cleanups: (() => void)[] = [];

		if (stage && !reduced) {
			// Play once when the graphic comes into view; it sits below the fold, so the reset is unseen.
			step = 0;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (!entry.isIntersecting) return;
					observer.disconnect();
					play();
				},
				{ threshold: 0.4 }
			);
			observer.observe(stage);
			cleanups.push(() => observer.disconnect());
		}

		return () => {
			timers.forEach(clearTimeout);
			cleanups.forEach((fn) => fn());
		};
	});
</script>

<section aria-labelledby="retries-heading" class="bleed bg-white">
	<div class="mx-auto flex w-full max-w-[1148px] flex-col gap-12 px-6 py-16 md:py-[136px] xl:flex-row xl:gap-[72px]">
		<div class="flex flex-col xl:w-[440px] xl:shrink-0">
			<h2
				id="retries-heading"
				class="m-0 pb-5 font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-surface md:pb-6 md:text-[2.625rem] md:leading-[50px]"
			>
				A retried job
				<em class="block font-serif text-[2.125rem] leading-[1.1] text-primary md:text-[2.875rem] md:leading-[50px]">never sends twice.</em>
			</h2>
			<p class="m-0 text-pretty max-w-[560px] text-[1.0625rem] leading-[27.2px] text-muted md:text-[1.1875rem] md:leading-[30.4px]">
				Queued sends carry an idempotency key built from the job's uuid. When the API accepted an email but the response timed out,
				the retry replays the original result instead of emailing your customer again. Nothing to configure.
			</p>

			<dl class="m-0 mt-7 flex max-w-[560px] flex-col border-t border-surface">
				{#each facts as fact}
					<div class="flex items-baseline justify-between gap-4 border-b border-[#eee7ea] py-3">
						<dt class="text-sm leading-[18px] text-muted">{fact.label}</dt>
						<dd class="m-0 text-right font-code text-[13px] leading-4 text-surface">{fact.value}</dd>
					</div>
				{/each}
			</dl>

			<pre
				class="m-0 mt-7 max-w-[560px] overflow-x-auto bg-[#0c111d] px-5 py-[18px] font-code text-[13px] leading-[1.7] text-[#f0f0f0]"><code>{@html syncSend.join('\n')}</code></pre>
		</div>

		<div bind:this={stage} data-markdown="skip" class="relative flex grow flex-col gap-4 xl:block xl:h-[600px]">
			<p class="sr-only">
				A queue worker runs SendQueuedMailable, times out after 30 seconds and retries. With the idempotency key, the Lettr API
				answers the retry with the first result, marked replayed, and the customer's inbox holds one email. Without it, the
				retry sends a second email.
			</p>
			<div class="absolute top-10 left-10 hidden h-[560px] w-[548px] bg-background xl:block" aria-hidden="true"></div>

			<!-- queue:work -->
			<div class="flex flex-col bg-[#0c111d] xl:absolute xl:top-0 xl:left-0 xl:w-[588px]">
				<div class="flex items-center gap-2.5 border-b border-white/10 py-2 pr-2 pl-[18px]">
					<span class="h-2 w-2 shrink-0 bg-primary {playing ? 'animate-pulse' : ''}" aria-hidden="true"></span>
					<span class="font-code text-xs leading-4 text-[#f0f0f0]/50" aria-hidden="true">php artisan queue:work</span>
					<button
						type="button"
						onclick={replay}
						disabled={playing}
						class="ml-auto inline-flex cursor-pointer items-center gap-1.5 px-2.5 py-1.5 font-code text-[11px] leading-[14px] tracking-[0.04em] text-[#f0f0f0]/70 transition-colors hover:text-white disabled:cursor-default disabled:text-[#f0f0f0]/30"
					>
						<ArrowClockwiseIcon size={13} weight="bold" class={playing ? 'animate-spin motion-reduce:animate-none' : ''} aria-hidden="true" />
						REPLAY
					</button>
				</div>
				<div class="flex flex-col gap-2 px-[18px] pt-[18px] pb-5" aria-hidden="true">
					{#each worker as row, i}
						<div class="flex justify-between gap-3 font-code text-[11px] leading-[1.5] transition-[opacity,translate] duration-300 motion-reduce:transition-none sm:text-xs {shown(i + 1)}">
							<span class="min-w-0 truncate {i === worker.length - 1 ? 'text-white' : 'text-[#f0f0f0]/75'}">
								{row.time} <span class="hidden sm:inline">Illuminate\Mail\</span>SendQueuedMailable
							</span>
							<span class="shrink-0 {row.tone}">{row.status}</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- API responses -->
			<div class="flex flex-col bg-white shadow-[0_0_0_1px_#eee7ea,0_24px_48px_rgb(17_24_39/0.08)] xl:absolute xl:top-[214px] xl:left-[120px] xl:w-[468px]">
				<div class="flex items-center justify-between gap-3 border-b border-[#eee7ea] py-2.5 pr-2.5 pl-5">
					<span class="font-heading text-base leading-5 text-surface" aria-hidden="true">Lettr API responses</span>
					<button
						type="button"
						role="switch"
						aria-checked={idempotent}
						onclick={toggleIdempotency}
						class="inline-flex cursor-pointer items-center gap-2 px-2.5 py-1.5 font-code text-[11px] leading-[14px] tracking-[0.06em] text-muted transition-colors hover:text-surface"
					>
						IDEMPOTENCY KEY
						<span class="relative h-4 w-7 shrink-0 transition-colors {idempotent ? 'bg-primary' : 'bg-border'}" aria-hidden="true">
							<span class="absolute top-0.5 h-3 w-3 bg-white transition-[left] duration-200 motion-reduce:transition-none {idempotent ? 'left-[14px]' : 'left-0.5'}"></span>
						</span>
					</button>
				</div>
				<div class="flex gap-4 border-b border-[#eee7ea] px-5 py-4 transition-[opacity,translate] duration-300 motion-reduce:transition-none {shown(2)}" aria-hidden="true">
					<span class="w-[72px] shrink-0 font-code text-xs leading-4 text-muted">attempt 1</span>
					<span class="flex flex-col gap-1">
						<span class="font-code text-xs leading-4 text-surface">accepted: 1, replayed: false</span>
						<span class="text-xs leading-4 text-muted">Response lost to the worker timeout</span>
					</span>
				</div>
				<div
					class="flex gap-4 px-5 py-4 transition-[opacity,translate] duration-300 motion-reduce:transition-none {idempotent
						? 'bg-primary-soft shadow-[inset_3px_0_0_#ec104b]'
						: 'bg-[#fff4e5] shadow-[inset_3px_0_0_#b45309]'} {shown(4)}"
					aria-hidden="true"
				>
					<span class="w-[72px] shrink-0 font-code text-xs leading-4 {idempotent ? 'text-primary' : 'text-[#b45309]'}">attempt 2</span>
					<span class="flex flex-col gap-1">
						<span class="font-code text-xs leading-4 text-surface">accepted: 1, replayed: {idempotent ? 'true' : 'false'}</span>
						<span class="text-xs leading-4 text-muted">
							{idempotent ? 'The first result, returned again. No second send.' : 'No key, so the API sends the email again.'}
						</span>
					</span>
				</div>
			</div>

			<!-- Inbox -->
			<div class="flex flex-col bg-white shadow-[0_0_0_1px_#eee7ea,0_24px_48px_rgb(17_24_39/0.08)] sm:max-w-[400px] xl:absolute xl:top-[446px] xl:left-0 xl:w-[400px]" aria-hidden="true">
				<div class="flex items-center justify-between border-b border-[#eee7ea] px-[18px] py-3.5">
					<span class="text-[13px] leading-4 font-semibold text-surface">jana@northwind.io</span>
					<span class="flex items-center gap-1.5">
						<span class="h-1.5 w-1.5 shrink-0 {emails > 1 ? 'bg-[#b45309]' : 'bg-green'}"></span>
						<span class="font-code text-[11px] leading-[14px] {emails > 1 ? 'text-[#b45309]' : 'text-muted'}">
							{emails} {emails === 1 ? 'EMAIL' : 'EMAILS'}
						</span>
					</span>
				</div>
				{#each [0, 1] as copy}
					{#if copy < emails || (copy === 0 && step < 2)}
						<div
							class="flex flex-col gap-1 px-[18px] py-3.5 transition-opacity duration-300 motion-reduce:transition-none {copy === 1 ? 'border-t border-[#eee7ea] bg-[#fff4e5]' : ''} {copy < emails ? 'opacity-100' : 'opacity-0'}"
						>
							<span class="flex justify-between">
								<span class="text-sm leading-[18px] font-bold text-surface">Northwind</span>
								<span class="text-xs leading-4 text-muted">{copy === 0 ? '14:02' : '14:03'}</span>
							</span>
							<span class="text-[13px] leading-4 text-surface">Your order is on its way</span>
							<span class="truncate text-xs leading-4 text-muted">Hi Jana, good news. Order NW-20418 left our warehouse today.</span>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</section>
