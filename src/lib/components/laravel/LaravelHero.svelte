<script lang="ts">
	import { onMount } from 'svelte';
	import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import Button from '$lib/components/Button.svelte';
	import GetStartedButton from '$lib/components/home/GetStartedButton.svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import type { TileField } from '$lib/laravel/tileField';

	const installCommand = 'composer require lettr/lettr-laravel';
	const docsHref = 'https://docs.lettr.com/quickstart/laravel/introduction';

	let section: HTMLElement | undefined = $state();
	let canvas: HTMLCanvasElement | undefined = $state();
	let fieldReady = $state(false);
	let fallback = $state(false);
	let copied = $state(false);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyInstall() {
		try {
			await navigator.clipboard.writeText(installCommand);
		} catch {
			return;
		}
		copied = true;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copied = false), 1800);
		void capturePosthogEvent('code_copied', { placement: 'laravel_hero', snippet: 'composer_require' });
	}

	function trackDocs() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'laravel_hero',
			label: 'Laravel docs',
			href: docsHref,
			variant: 'secondary',
			destination_type: 'external'
		});
	}

	onMount(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		let field: TileField | null = null;
		let cancelled = false;

		// The field loads after first paint and fades in over the dark hero. The static
		// frame image loads only without WebGL2, so it never competes for the first paint.
		import('$lib/laravel/tileField')
			.then(({ createTileField }) => {
				if (cancelled || !canvas || !section) return;
				field = createTileField(canvas, section, { reduced, onReady: () => (fieldReady = true) });
				if (!field) fallback = true;
			})
			.catch(() => (fallback = true));

		return () => {
			cancelled = true;
			field?.destroy();
			clearTimeout(copiedTimer);
		};
	});
</script>

<section
	bind:this={section}
	aria-labelledby="laravel-hero-heading"
	class="bleed relative isolate mt-[61px] overflow-hidden bg-[#14010a] text-white"
>
	{#if fallback}
		<div
			class="absolute inset-0 -z-10 bg-[url(/laravel/tile-field-mobile.webp)] bg-cover bg-top md:bg-[url(/laravel/tile-field.webp)] md:bg-center"
			aria-hidden="true"
		></div>
	{/if}
	<canvas
		bind:this={canvas}
		class="absolute inset-0 -z-10 h-full w-full transition-opacity duration-700 motion-reduce:transition-none {fieldReady ? 'opacity-100' : 'opacity-0'}"
		aria-hidden="true"
	></canvas>
	<!-- Keeps the copy readable over the field. -->
	<div
		class="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(20_1_10/0)_0%,rgb(20_1_10/0.6)_40%,#14010a_62%)] md:bg-[linear-gradient(90deg,#14010a_0%,rgb(20_1_10/0.85)_32%,rgb(20_1_10/0)_60%)]"
		aria-hidden="true"
	></div>

	<div class="mx-auto flex min-h-[640px] w-full max-w-[1148px] flex-col justify-end px-6 pt-44 pb-12 md:min-h-[720px] md:justify-center md:py-24">
		<div class="flex max-w-[600px] flex-col">
			<h1
				id="laravel-hero-heading"
				class="m-0 font-heading text-[2.25rem] leading-[38px] font-normal tracking-[-0.025em] text-white md:text-[4rem] md:leading-[67.84px]"
			>
				The email API
				<span class="block pb-5 font-serif-35 text-[2.625rem] leading-[1.06] text-primary italic md:pb-6 md:text-[4.5rem]">built for Laravel.</span>
			</h1>
			<p class="m-0 text-pretty max-w-[540px] text-[1.0625rem] leading-[27.2px] text-white/75 md:text-[1.1875rem] md:leading-[30.4px]">
				Keep your Mailables and <code class="font-code text-[0.9em] text-white">Mail::to()</code>. Lettr adds templates your team
				edits without a deploy, generated types for every merge tag, and queued sends that never go out twice.
			</p>

			<div class="mt-8 flex flex-col gap-5 md:mt-9">
				<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
					<GetStartedButton placement="laravel_hero" />
					<Button
						variant="ghost"
						size="hero"
						href={docsHref}
						target="_blank"
						rel="noopener noreferrer"
						onclick={trackDocs}
					>
						Laravel docs
					</Button>
				</div>

				<button
					type="button"
					onclick={copyInstall}
					class="group inline-flex w-full cursor-pointer items-center gap-2.5 bg-fade-white/5 py-3 pr-3.5 pl-4 text-left font-code text-[0.75rem] leading-[18px] sm:gap-3.5 sm:text-[0.875rem] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12)] transition-colors hover:bg-fade-white/10 sm:w-fit md:text-[0.9375rem]"
					aria-label="Copy install command: {installCommand}"
				>
					<span class="text-primary narrow:hidden" aria-hidden="true">$</span>
					<span class="min-w-0 flex-1 truncate text-[#f0f0f0]">{installCommand}</span>
					<span class="ml-1.5 hidden h-[18px] w-px shrink-0 bg-white/15 sm:block" aria-hidden="true"></span>
					<span class="shrink-0 text-primary-outline" aria-hidden="true">
						{#if copied}<CheckIcon size={16} weight="bold" />{:else}<CopyIcon size={16} />{/if}
					</span>
				</button>
				<span class="sr-only" aria-live="polite">{copied ? 'Install command copied' : ''}</span>

				<p class="m-0 text-pretty text-sm leading-[1.5] text-white/60">
					Free for 3,000 emails a month. No credit card. Laravel 10 to 13, PHP 8.4+.
				</p>
			</div>
		</div>
	</div>
</section>
