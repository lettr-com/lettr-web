<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import {
		TranslateIcon,
		GitForkIcon,
		PaintBrushIcon,
		ArrowsClockwiseIcon,
		TextboxIcon,
		SquaresFourIcon,
		PencilSimpleIcon,
		ArrowCounterClockwiseIcon,
		ArrowClockwiseIcon,
		EyeIcon,
		CaretDownIcon,
		DeviceMobileIcon,
		MonitorIcon
	} from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();
	let activeIndex = $state(0);
	let mobileIndex = $state(0);
	let mobileTrack: HTMLElement | undefined = $state();
	let mobileTabStrip: HTMLElement | undefined = $state();
	let mobileTabButtons: HTMLButtonElement[] = $state([]);
	let intervalId: ReturnType<typeof setInterval> | undefined;
	let isDesktop = $state(true);

	const features = [
		{
			icon: PaintBrushIcon,
			title: 'Drag-and-drop editor',
			description: 'Powered by Topol, used by 40,000+ companies. Best-in-class email building.'
		},
		{
			icon: ArrowsClockwiseIcon,
			title: 'Synced sections',
			description: 'Update a header or footer once, apply it everywhere. No manual copying.'
		},
		{
			icon: GitForkIcon,
			title: 'Draft & publish workflow',
			description: 'Version history built in. Preview, approve, publish with confidence.'
		},
		{
			icon: TranslateIcon,
			title: 'Multilingual templates',
			description: 'Manage translations in one place. Send the right language automatically.'
		},
		{
			icon: TextboxIcon,
			title: 'Dynamic placeholders',
			description: 'Personalize every email with user data. No code needed from your team.'
		},
		{
			icon: SquaresFourIcon,
			title: 'SaaS template library',
			description: 'Pre-built templates for onboarding, alerts, updates, and more.'
		}
	];

	function selectFeature(index: number) {
		activeIndex = index;
		startAutoRotation();
	}

	function centerActiveTab(index: number) {
		const btn = mobileTabButtons[index];
		if (!btn || !mobileTabStrip) return;
		const stripRect = mobileTabStrip.getBoundingClientRect();
		const btnRect = btn.getBoundingClientRect();
		const target =
			btnRect.left - stripRect.left + mobileTabStrip.scrollLeft - stripRect.width / 2 + btnRect.width / 2;
		mobileTabStrip.scrollTo({ left: target, behavior: 'smooth' });
	}

	async function scrollMobileTo(index: number) {
		mobileIndex = index;
		if (!mobileTrack) return;
		const width = mobileTrack.clientWidth;
		mobileTrack.scrollTo({ left: width * index, behavior: 'smooth' });
		await tick();
		centerActiveTab(index);
	}

	function handleMobileScroll() {
		if (!mobileTrack) return;
		const width = mobileTrack.clientWidth;
		if (width === 0) return;
		const next = Math.round(mobileTrack.scrollLeft / width);
		if (next !== mobileIndex) {
			mobileIndex = next;
			centerActiveTab(next);
		}
	}

	function startAutoRotation() {
		if (intervalId) clearInterval(intervalId);
		if (!isDesktop) return;
		intervalId = setInterval(() => {
			activeIndex = (activeIndex + 1) % features.length;
		}, 5000);
	}

	onMount(() => {
		const mq = window.matchMedia('(min-width: 768px)');
		isDesktop = mq.matches;
		const mqHandler = (e: MediaQueryListEvent) => {
			isDesktop = e.matches;
			if (e.matches) {
				startAutoRotation();
			} else if (intervalId) {
				clearInterval(intervalId);
				intervalId = undefined;
			}
		};
		mq.addEventListener('change', mqHandler);

		startAutoRotation();

		let cleanup: (() => void) | undefined;
		if (section) {
			cleanup = createScrollRevealCleanup({
				scope: section,
				targets: '[data-feature]'
			});
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
			mq.removeEventListener('change', mqHandler);
			cleanup?.();
		};
	});
</script>

<section bind:this={section} class="py-16 border-b border-border/30">
	<div class="mb-10" data-feature>
		<h2 class="mb-3 text-surface">
			Your team edits. <span class="text-primary">No dev tickets required.</span>
		</h2>
		<p class="text-body text-muted max-w-[50ch]">
			A full visual editor your marketing and product team can use independently.
		</p>
	</div>

	<!-- Desktop: side-by-side list + preview -->
	<div class="hidden md:grid md:grid-cols-[260px_1fr] gap-6 items-start" data-feature>
		<div class="flex flex-col">
			{#each features as feature, i}
				<button
					onclick={() => selectFeature(i)}
					class="text-left px-4 py-3 border-l-2 transition-all duration-200
						{activeIndex === i
						? 'border-primary bg-primary/[0.04]'
						: 'border-transparent hover:bg-background'}"
				>
					<div class="flex items-start gap-3">
						<feature.icon
							size={16}
							class="shrink-0 mt-0.5 transition-colors {activeIndex === i ? 'text-primary' : 'text-muted/60'}"
						/>
						<div>
							<span class="text-sm font-medium transition-colors block {activeIndex === i ? 'text-surface' : 'text-muted'}">
								{feature.title}
							</span>
							{#if activeIndex === i}
								<p class="text-[12px] text-muted mt-1 leading-relaxed" in:fade={{ duration: 150 }}>
									{feature.description}
								</p>
							{/if}
						</div>
					</div>
				</button>
			{/each}
		</div>

		{@render previewPanel(activeIndex, true, 350)}
	</div>

	<!-- Mobile: tab strip + swipeable preview carousel -->
	<div class="md:hidden" data-feature>
		<!-- Horizontal tab strip (scrolls, click to jump) -->
		<div
			bind:this={mobileTabStrip}
			class="-mx-6 mb-5 flex gap-2 overflow-x-auto scroll-smooth px-6 pb-1 no-scrollbar"
		>
			{#each features as feature, i}
				<button
					bind:this={mobileTabButtons[i]}
					onclick={() => scrollMobileTo(i)}
					class="shrink-0 flex items-center gap-1.5 border px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors
						{mobileIndex === i
						? 'border-primary bg-primary/5 text-primary'
						: 'border-border/40 bg-white text-muted'}"
				>
					<feature.icon size={13} />
					{feature.title}
				</button>
			{/each}
		</div>

		<!-- Current feature description (above preview, large and readable) -->
		<div class="mb-4 min-h-[48px]">
			{#key mobileIndex}
				<p class="text-[13px] leading-relaxed text-muted" in:fade={{ duration: 180 }}>
					{features[mobileIndex].description}
				</p>
			{/key}
		</div>

		<!-- Snap-scroll carousel of previews -->
		<div
			bind:this={mobileTrack}
			onscroll={handleMobileScroll}
			class="-mx-6 flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar overscroll-x-contain"
		>
			{#each features as _, i}
				<div class="w-screen shrink-0 snap-center px-6">
					{@render previewPanel(i, false, 300)}
				</div>
			{/each}
		</div>

		<!-- Pagination dots + progress -->
		<div class="mt-5 flex items-center justify-center gap-1.5">
			{#each features as _, i}
				<button
					onclick={() => scrollMobileTo(i)}
					aria-label="Show feature {i + 1}"
					class="h-1.5 rounded-full transition-all
						{mobileIndex === i ? 'w-6 bg-primary' : 'w-1.5 bg-border'}"
				></button>
			{/each}
		</div>
	</div>
</section>

{#snippet previewPanel(idx: number, animate: boolean, minHeight: number)}
	<div class="border border-border/30 overflow-hidden bg-[#fafafa]">
		<!-- Editor toolbar -->
		<div class="flex items-center justify-between border-b border-border/20 bg-white px-3 py-2">
			<div class="flex min-w-0 items-center gap-2">
				<span class="truncate text-[11px] font-medium text-surface">trial-welcome-email</span>
				<PencilSimpleIcon size={11} class="shrink-0 text-muted" />
				<span class="hidden shrink-0 border border-green-200 bg-green-50 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-green-600 uppercase sm:inline">Draft</span>
			</div>
			<div class="flex items-center gap-1.5">
				<div class="flex items-center gap-0.5 border border-border/30 bg-gray-50">
					<span class="flex h-5 w-5 items-center justify-center text-muted"><ArrowCounterClockwiseIcon size={10} /></span>
					<span class="h-3 w-px bg-border/40"></span>
					<span class="flex h-5 w-5 items-center justify-center text-muted"><ArrowClockwiseIcon size={10} /></span>
				</div>
				<div class="hidden items-center gap-1 border border-border/30 bg-gray-50 px-1.5 py-0.5 text-[9px] font-medium text-surface md:flex">
					<EyeIcon size={10} />
					<span>Preview</span>
				</div>
				<div class="hidden items-center gap-1 border border-border/30 bg-gray-50 px-1.5 py-0.5 text-[9px] font-medium text-surface lg:flex">
					<span>Create mutation</span>
					<CaretDownIcon size={9} />
				</div>
				<div class="flex items-center gap-0.5 border border-border/30 bg-gray-50">
					<span class="flex h-5 w-5 items-center justify-center text-muted"><DeviceMobileIcon size={10} /></span>
					<span class="flex h-5 w-5 items-center justify-center border border-primary/60 bg-primary/5 text-primary"><MonitorIcon size={10} /></span>
				</div>
			</div>
		</div>

		<div class="relative" style="min-height: {minHeight}px">
			{#if animate}
				{#key idx}
					<div class="absolute inset-0 p-6" in:fade={{ duration: 180 }}>
						{@render previewContent(idx)}
					</div>
				{/key}
			{:else}
				<div class="p-5 sm:p-6">
					{@render previewContent(idx)}
				</div>
			{/if}
		</div>
	</div>
{/snippet}

{#snippet previewContent(idx: number)}
	{#if idx === 0}
		<!-- Drag-and-drop editor -->
		<div class="space-y-2.5">
			<div class="flex items-center gap-2">
				<div class="flex flex-col gap-[3px] opacity-30"><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span></div>
				<div class="flex-1 h-14 border border-primary/20 bg-primary/[0.06] p-3 flex items-center">
					<div class="h-3 w-24 bg-primary/20"></div>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<div class="flex flex-col gap-[3px] opacity-30"><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span></div>
				<div class="flex-1 border border-border/20 bg-white p-3 space-y-1.5">
					<div class="h-2 w-full bg-border/20"></div>
					<div class="h-2 w-4/5 bg-border/15"></div>
					<div class="h-2 w-3/5 bg-border/10"></div>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<div class="flex flex-col gap-[3px] opacity-30"><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span></div>
				<div class="flex-1 h-20 border border-border/20 bg-white flex items-center justify-center">
					<div class="w-12 h-12 bg-border/10 flex items-center justify-center text-border/40 text-lg">&#9634;</div>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<div class="flex flex-col gap-[3px] opacity-30"><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span><span class="block w-1 h-1 bg-current"></span></div>
				<div class="flex-1 border border-border/20 bg-white p-3 flex justify-center">
					<div class="px-5 py-2 bg-primary text-white text-[10px] font-medium">Get Started</div>
				</div>
			</div>
		</div>

	{:else if idx === 1}
		<!-- Synced sections -->
		<div class="grid grid-cols-2 gap-4">
			{#each ['Welcome Email', 'Trial Ending'] as label}
				<div class="border border-border/30 bg-white overflow-hidden">
					<div class="px-3 py-1.5 border-b border-border/15 text-[10px] text-muted font-medium">{label}</div>
					<div class="p-3 space-y-2">
						<div class="h-7 bg-primary/10 border border-primary/20 flex items-center justify-center">
							<span class="text-[9px] text-primary font-medium">Synced Header</span>
						</div>
						<div class="space-y-1">
							<div class="h-1.5 w-full bg-border/15"></div>
							<div class="h-1.5 w-3/4 bg-border/10"></div>
						</div>
						<div class="h-5 w-14 bg-border/15 mx-auto"></div>
						<div class="space-y-1">
							<div class="h-1.5 w-full bg-border/15"></div>
							<div class="h-1.5 w-1/2 bg-border/10"></div>
						</div>
						<div class="h-7 bg-primary/10 border border-primary/20 flex items-center justify-center">
							<span class="text-[9px] text-primary font-medium">Synced Footer</span>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<p class="text-center text-[11px] text-muted/70 mt-4">Edit once, synced across all templates</p>

	{:else if idx === 2}
		<!-- Draft & publish workflow -->
		<div class="pt-2">
			<div class="flex items-start justify-between mb-8 px-6">
				{#each [
					{ label: 'Draft', done: true },
					{ label: 'Review', active: true },
					{ label: 'Published' }
				] as step, i}
					{#if i > 0}
						<div class="flex-1 h-px mx-3 mt-4 {step.done || step.active ? 'bg-primary/30' : 'bg-border/30'}"></div>
					{/if}
					<div class="flex flex-col items-center gap-2">
						<div class="w-8 h-8 flex items-center justify-center text-[10px] font-medium
							{step.done ? 'bg-primary text-white' : step.active ? 'border-2 border-primary text-primary' : 'border-2 border-border/30 text-muted'}">
							{step.done ? '✓' : i + 1}
						</div>
						<span class="text-[11px] {step.done || step.active ? 'text-surface font-medium' : 'text-muted'}">{step.label}</span>
					</div>
				{/each}
			</div>
			<div class="border border-border/30 bg-white p-4 space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-[12px] font-medium text-surface">Welcome Email v3</span>
					<span class="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-600 font-medium">In Review</span>
				</div>
				<div class="space-y-1.5">
					<div class="h-2 w-full bg-border/15"></div>
					<div class="h-2 w-2/3 bg-border/10"></div>
				</div>
				<div class="flex gap-2 pt-1">
					<div class="px-3 py-1.5 bg-primary text-white text-[10px] font-medium">Approve & Publish</div>
					<div class="px-3 py-1.5 border border-border/30 text-[10px] text-muted">Request Changes</div>
				</div>
			</div>
		</div>

	{:else if idx === 3}
		<!-- Multilingual templates -->
		<div>
			<div class="flex gap-1 mb-4">
				{#each ['EN', 'ES', 'DE', 'FR'] as lang, i}
					<div class="px-3 py-1.5 text-[11px] font-medium transition-colors
						{i === 0 ? 'bg-primary text-white' : 'bg-white border border-border/30 text-muted'}">
						{lang}
					</div>
				{/each}
			</div>
			<div class="border border-border/30 bg-white p-4 space-y-3">
				<div class="h-3 w-28 bg-primary/15"></div>
				<div class="space-y-1.5">
					<div class="h-2 w-full bg-border/20"></div>
					<div class="h-2 w-5/6 bg-border/15"></div>
					<div class="h-2 w-4/5 bg-border/10"></div>
				</div>
				<div class="h-px bg-border/15"></div>
				<div class="space-y-1.5">
					<div class="h-2 w-full bg-border/20"></div>
					<div class="h-2 w-3/4 bg-border/15"></div>
				</div>
				<div class="px-4 py-2 bg-primary/80 text-white text-[10px] font-medium w-fit">Confirm</div>
			</div>
			<div class="flex items-center gap-2 mt-3 text-[10px] text-muted/60">
				<span class="w-1.5 h-1.5 bg-green-400"></span>
				4 languages configured
			</div>
		</div>

	{:else if idx === 4}
		<!-- Dynamic placeholders -->
		<div class="space-y-4">
			<div class="border border-border/30 bg-white p-4">
				<div class="text-[10px] text-muted font-medium mb-2 uppercase tracking-wide">Template</div>
				<div class="text-[12px] text-surface leading-loose space-y-1">
					<p>Hi <span class="inline-flex px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-mono font-medium">{'{{first_name}}'}</span>,</p>
					<p>Your <span class="inline-flex px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-mono font-medium">{'{{plan_name}}'}</span> trial ends in <span class="inline-flex px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-mono font-medium">{'{{days_left}}'}</span> days.</p>
					<p>Upgrade to keep your <span class="inline-flex px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-mono font-medium">{'{{feature_count}}'}</span> active features.</p>
				</div>
			</div>
			<div class="border border-primary/20 bg-primary/[0.03] p-4">
				<div class="text-[10px] text-primary font-medium mb-2 uppercase tracking-wide">Preview</div>
				<div class="text-[12px] text-surface leading-loose space-y-1">
					<p>Hi <strong>Sarah</strong>,</p>
					<p>Your <strong>Growth</strong> trial ends in <strong>3</strong> days.</p>
					<p>Upgrade to keep your <strong>12</strong> active features.</p>
				</div>
			</div>
		</div>

	{:else if idx === 5}
		<!-- SaaS template library -->
		<div class="grid grid-cols-3 gap-2.5">
			{#each [
				{ title: 'Welcome', accent: 'bg-blue-50 border-blue-100' },
				{ title: 'Password Reset', accent: 'bg-emerald-50 border-emerald-100' },
				{ title: 'Invoice', accent: 'bg-violet-50 border-violet-100' },
				{ title: 'Trial Ending', accent: 'bg-amber-50 border-amber-100' },
				{ title: 'Changelog', accent: 'bg-pink-50 border-pink-100' },
				{ title: 'Usage Alert', accent: 'bg-orange-50 border-orange-100' }
			] as tmpl}
				<div class="border {tmpl.accent} p-2.5 hover:shadow-sm transition-shadow cursor-pointer">
					<div class="h-14 bg-white/70 border border-white/80 p-2 space-y-1 mb-2">
						<div class="h-1.5 w-full bg-current opacity-[0.08]"></div>
						<div class="h-1.5 w-3/4 bg-current opacity-[0.06]"></div>
						<div class="h-3 w-8 bg-current opacity-[0.08] mt-1"></div>
					</div>
					<div class="text-[10px] font-medium text-surface">{tmpl.title}</div>
				</div>
			{/each}
		</div>
	{/if}
{/snippet}

<style>
	.no-scrollbar {
		scrollbar-width: none;
		-ms-overflow-style: none;
	}
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
