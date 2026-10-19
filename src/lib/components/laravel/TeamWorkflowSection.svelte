<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowClockwiseIcon from 'phosphor-svelte/lib/ArrowClockwiseIcon';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	type Tag = 'customer_name' | 'order_number' | 'tracking_url';

	let section: HTMLElement | undefined = $state();
	let terminal: HTMLElement | undefined = $state();

	const mergeTags: { tag: Tag; type: string; sample: string }[] = [
		{ tag: 'customer_name', type: 'string $customerName', sample: 'Jana' },
		{ tag: 'order_number', type: 'string $orderNumber', sample: 'NW-20418' },
		{ tag: 'tracking_url', type: 'string $trackingUrl', sample: 'dhl.com/NW-20418' }
	];
	const samples = Object.fromEntries(mergeTags.map((t) => [t.tag, t.sample])) as Record<Tag, string>;

	const pulled = [
		'views/emails/lettr/order-shipped.blade.php',
		'app/Mail/Lettr/OrderShipped.php',
		'app/Dto/Lettr/OrderShippedData.php'
	];

	// Nothing is highlighted until a tag is hovered or focused; a click pins it.
	let hovered: Tag | null = $state(null);
	let pinned: Tag | null = $state(null);
	const activeTag = $derived(hovered ?? pinned);
	let preview = $state(false);

	// Lines of lettr:pull output on screen; the prerendered page shows them all.
	let pulledCount = $state(pulled.length + 1);
	let pulling = $state(false);
	let reduced = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function runPull() {
		timers.forEach(clearTimeout);
		if (reduced) {
			pulledCount = pulled.length + 1;
			return;
		}
		pulling = true;
		pulledCount = 0;
		timers = Array.from({ length: pulled.length + 1 }, (_, i) =>
			setTimeout(
				() => {
					pulledCount = i + 1;
					if (i === pulled.length) pulling = false;
				},
				350 + i * 420
			)
		);
	}

	function rerun() {
		runPull();
		void capturePosthogEvent('laravel_pull_demo_played', {});
	}

	function togglePreview() {
		preview = !preview;
		void capturePosthogEvent('laravel_editor_demo_previewed', { preview });
	}

	onMount(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const cleanups: (() => void)[] = [];
		if (section) cleanups.push(createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' }));

		if (terminal && !reduced) {
			pulledCount = 0;
			const observer = new IntersectionObserver(
				([entry]) => {
					if (!entry.isIntersecting) return;
					observer.disconnect();
					runPull();
				},
				{ threshold: 0.6 }
			);
			observer.observe(terminal);
			cleanups.push(() => observer.disconnect());
		}

		return () => {
			timers.forEach(clearTimeout);
			cleanups.forEach((fn) => fn());
		};
	});
</script>

{#snippet chip(tag: Tag)}
	{@const active = tag === activeTag}
	<span
		role="presentation"
		onmouseenter={() => (hovered = tag)}
		onmouseleave={() => (hovered = null)}
		class="px-1.5 py-0.5 text-xs leading-4 transition-[color,box-shadow] duration-200 motion-reduce:transition-none {preview
			? 'font-body text-sm font-semibold text-surface'
			: 'font-code'} {preview
			? active
				? 'bg-primary-soft shadow-[inset_0_-2px_0_#ec104b]'
				: ''
			: active
				? 'bg-primary text-white'
				: 'bg-primary-soft text-primary'}"
	>
		{preview ? samples[tag] : `{{${tag}}}`}
	</span>
{/snippet}

<section bind:this={section} aria-labelledby="workflow-heading" class="mx-auto max-w-[1100px] py-16 md:pt-[136px] md:pb-32">
	<div data-reveal class="mb-10 flex flex-col gap-4 md:mb-16 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
		<h2
			id="workflow-heading"
			class="m-0 font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			You own the code.
			<em class="block font-serif text-[2.125rem] leading-[1.1] text-primary md:text-[2.875rem] md:leading-[50px]">Your team owns the words.</em>
		</h2>
		<p class="m-0 text-pretty max-w-[400px] shrink-0 text-[1.0625rem] leading-[27.2px] text-muted md:text-[1.1875rem] md:leading-[30.4px]">
			Copy changes stop being tickets. Your team edits the email in Lettr, and
			<code class="font-code text-[0.88em] text-surface">lettr:pull</code> brings it into your repo as Blade.
		</p>
	</div>

	<div
		data-reveal
		data-markdown="skip"
		class="relative grid gap-4 overflow-hidden bg-[linear-gradient(180deg,#23020b_0%,#3a0716_55%,#8e1b33_100%)] p-4 sm:p-8 md:grid-cols-2 md:items-start xl:block xl:h-[600px] xl:p-0"
	>
		<p class="sr-only">
			The order-shipped email in the Lettr editor uses three merge tags. lettr:generate-dtos types each one as a string in
			OrderShippedData, and lettr:pull writes the Blade view, Mailable and DTO into the app.
		</p>

		<!-- Editor -->
		<div class="flex flex-col bg-white md:col-span-2 xl:absolute xl:top-16 xl:left-16 xl:h-[536px] xl:w-[600px]">
			<div class="flex h-[52px] shrink-0 items-center gap-3 border-b border-[#eee7ea] pr-2.5 pl-4 sm:pl-5">
				<svg width="18" height="18" viewBox="0 0 19 19" class="shrink-0" aria-hidden="true">
					<path
						fill="#ec104b"
						d="M4.73 16.561L2.365 18.927L0 16.561L2.365 14.196L4.73 16.561ZM11.09 13.455L14.195 16.561L11.83 18.927L9.464 16.561L7.099 18.927L4.731 16.561L7.099 14.195L9.464 11.83L11.09 13.455ZM18.927 16.561L16.561 18.927L14.195 16.561L16.561 14.196L18.927 16.561ZM4.73 11.829L2.365 14.194L0 11.829L2.365 9.464L4.73 11.829ZM18.927 11.829L16.561 14.194L14.195 11.829L16.561 9.464L18.927 11.829ZM11.828 9.464L9.463 11.829L7.098 9.464L9.463 7.099L11.828 9.464ZM4.73 7.098L2.365 9.463L0 7.098L2.365 4.732L4.73 7.098ZM18.927 7.098L16.561 9.463L14.195 7.098L16.561 4.732L18.927 7.098ZM14.195 2.365L11.398 5.163L9.464 7.098L7.099 4.731L4.731 2.365L7.099 0L9.464 2.365L11.83 0L14.195 2.365ZM4.73 2.366L2.365 4.731L0 2.366L2.365 0.001L4.73 2.366ZM18.927 2.366L16.561 4.731L14.195 2.366L16.561 0.001L18.927 2.366Z"
					/>
				</svg>
				<span class="text-sm leading-[18px] font-semibold whitespace-nowrap text-surface" aria-hidden="true">order-shipped</span>
				<span class="hidden px-1.5 py-[3px] font-code text-[11px] leading-[14px] tracking-[0.06em] text-primary shadow-[inset_0_0_0_1px_#f9b7c9] sm:inline" aria-hidden="true">TRANSACTIONAL</span>
				<span class="ml-auto hidden text-[13px] leading-4 whitespace-nowrap text-muted lg:inline" aria-hidden="true">Edited 2 min ago</span>
				<button
					type="button"
					aria-pressed={preview}
					onclick={togglePreview}
					class="ml-auto cursor-pointer px-3 py-1.5 text-xs leading-4 font-bold shadow-[inset_0_0_0_1px_#e2d8dc] transition-colors hover:text-primary-strong lg:ml-0 {preview ? 'text-primary-strong' : 'text-surface'}"
				>
					{preview ? 'Edit' : 'Preview'}
				</button>
				<span class="bg-primary px-3 py-1.5 text-xs leading-4 font-bold text-white" aria-hidden="true">Publish</span>
			</div>
			<div class="flex grow justify-center bg-[#f3eef0] p-4 sm:pt-7 sm:pb-0" aria-hidden="true">
				<div class="flex w-full max-w-[400px] flex-col gap-4 bg-white px-5 py-6 sm:px-[30px] sm:py-7">
					<div class="flex items-center gap-2">
						<span class="h-4 w-4 bg-surface"></span>
						<span class="text-sm leading-[18px] font-extrabold text-surface">Northwind</span>
					</div>
					<p class="m-0 text-pretty text-[1.375rem] leading-[1.25] font-bold text-surface sm:text-2xl">Your order is on its way</p>
					<p class="m-0 text-pretty text-sm leading-[26px] text-muted">
						Hi {@render chip('customer_name')}, good news.
					</p>
					<p class="m-0 text-pretty text-sm leading-[26px] text-muted">
						Order {@render chip('order_number')} left our warehouse today.
					</p>
					<div class="flex items-center gap-3 bg-background p-3.5">
						<span class="h-[52px] w-[52px] shrink-0 bg-[linear-gradient(135deg,#f9b7c9_0%,#ec104b_100%)]"></span>
						<span class="flex flex-col gap-1">
							<span class="text-[13px] leading-4 font-semibold text-surface">Ceramic pour-over set</span>
							<span class="text-xs leading-4 text-muted">Qty 1 · Ships with DHL</span>
						</span>
					</div>
					<div
						class="flex w-fit flex-wrap items-center gap-2.5 p-1.5 transition-shadow duration-200 motion-reduce:transition-none {activeTag === 'tracking_url'
							? 'shadow-[inset_0_0_0_1.5px_#ec104b]'
							: 'shadow-[inset_0_0_0_1.5px_transparent]'}"
					>
						<span class="bg-surface px-[18px] py-[11px] text-[13px] leading-4 font-bold text-white">Track package</span>
						{@render chip('tracking_url')}
					</div>
				</div>
			</div>
		</div>

		<!-- Merge tags typed by the generated DTO -->
		<div class="flex flex-col bg-white xl:absolute xl:top-[88px] xl:left-[700px] xl:w-[336px]">
			<div class="flex items-center justify-between border-b border-[#eee7ea] px-[22px] py-[18px]" aria-hidden="true">
				<span class="font-heading text-[17px] leading-[22px] text-surface">Merge tags</span>
				<span class="font-code text-[11px] leading-[14px] tracking-[0.06em] text-muted">3 TAGS</span>
			</div>
			{#each mergeTags as item}
				{@const active = item.tag === activeTag}
				<button
					type="button"
					aria-pressed={pinned === item.tag}
					aria-label="Highlight {item.tag} in the email, typed as {item.type}"
					onclick={() => (pinned = pinned === item.tag ? null : item.tag)}
					onmouseenter={() => (hovered = item.tag)}
					onmouseleave={() => (hovered = null)}
					onfocus={() => (hovered = item.tag)}
					onblur={() => (hovered = null)}
					class="flex cursor-pointer flex-col gap-1.5 border-b border-[#eee7ea] px-[22px] py-3.5 text-left {active
						? 'bg-primary-soft shadow-[inset_3px_0_0_#ec104b]'
						: 'bg-white hover:shadow-[inset_3px_0_0_#f9b7c9]'}"
				>
					<span class="font-code text-[13px] leading-4 text-primary">{item.tag}</span>
					<span class="font-code text-xs leading-4 {active ? 'text-surface' : 'text-muted'}">{item.type}</span>
				</button>
			{/each}
			<div class="flex items-center gap-2 px-[22px] py-3.5" aria-hidden="true">
				<span class="h-1.5 w-1.5 shrink-0 bg-green"></span>
				<span class="text-xs leading-4 text-muted">Typed in OrderShippedData by lettr:generate-dtos</span>
			</div>
		</div>

		<!-- lettr:pull -->
		<div
			bind:this={terminal}
			class="flex flex-col gap-2.5 bg-[#0c111d] py-4 pr-3 pl-[22px] shadow-[0_24px_48px_rgb(0_0_0/0.35)] xl:absolute xl:top-[426px] xl:left-[620px] xl:w-[400px]"
		>
			<div class="flex items-center gap-2.5 font-code text-[13px] leading-4">
				<span class="text-primary" aria-hidden="true">$</span>
				<span class="min-w-0 text-[#f0f0f0]" aria-hidden="true">php artisan lettr:pull --with-mailables</span>
				<button
					type="button"
					onclick={rerun}
					disabled={pulling}
					aria-label="Run lettr:pull again"
					class="ml-auto flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-[#f0f0f0]/60 transition-colors hover:text-white disabled:cursor-default disabled:text-[#f0f0f0]/25"
				>
					<ArrowClockwiseIcon size={14} weight="bold" class={pulling ? 'animate-spin motion-reduce:animate-none' : ''} aria-hidden="true" />
				</button>
			</div>
			<ul class="m-0 flex min-h-[87px] list-none flex-col gap-[5px] p-0" aria-hidden="true">
				<li class="font-code text-xs leading-[1.5] text-[#f0f0f0]/50 {pulledCount > 0 ? 'opacity-100' : 'opacity-0'}">
					Pulling templates from Lettr...
				</li>
				{#each pulled as file, i}
					<li class="flex gap-2.5 font-code text-xs leading-[1.5] {pulledCount > i + 1 ? 'opacity-100' : 'opacity-0'}">
						<span class="w-3 shrink-0 text-green">✓</span>
						<span class="min-w-0 break-all text-[#f0f0f0]/70">{file}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>
