<script lang="ts">
	import { onMount } from 'svelte';
	import GetStartedButton from './GetStartedButton.svelte';
	import StageGlow from './StageGlow.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	type Target = 'headline' | 'intro' | 'button' | 'image';

	interface Version {
		id: number;
		title: string;
		/** The original change a restored version points back to. */
		base?: string;
		author: string;
		when: string;
		/** The part of the email this version changed. */
		target: Target;
		note: string;
	}

	const initialVersions: Version[] = [
		{ id: 4, title: 'Reworded the button', author: 'Anna', when: '2 min ago', target: 'button', note: 'Anna changed this · 2 min ago' },
		{ id: 3, title: 'Swapped hero image', author: 'Tom', when: 'Yesterday', target: 'image', note: 'Tom changed this · Yesterday' },
		{ id: 2, title: 'Added German translation', author: 'Mia', when: 'Tue, 14:20', target: 'headline', note: 'Mia changed this · Tue, 14:20' },
		{ id: 1, title: 'Shortened the intro', author: 'Leo', when: 'Mon, 09:05', target: 'intro', note: 'Leo changed this · Mon, 09:05' }
	];
	const VISIBLE = 4;

	/** Authors in the demo. Photos live in static/avatars; no photo (or a missing file) shows the initial. */
	const authors: Record<string, { src?: string; bg: string }> = {
		Anna: { src: '/avatars/anna.jpg', bg: 'bg-primary' },
		Tom: { src: '/avatars/tom.jpg', bg: 'bg-surface' },
		Mia: { src: '/avatars/mia.jpg', bg: 'bg-muted' },
		Leo: { bg: 'bg-surface' },
		You: { bg: 'bg-primary' }
	};
	let brokenAvatars: string[] = $state([]);

	let section: HTMLElement | undefined = $state();
	let versions: Version[] = $state(initialVersions);
	let selectedId = $state(initialVersions[1].id);
	let total = $state(12);
	let nextId = 5;

	const selected = $derived(versions.find((v) => v.id === selectedId) ?? versions[0]);
	const isCurrent = $derived(selected.id === versions[0].id);
	const shown = $derived(versions.slice(0, VISIBLE));

	function select(id: number) {
		selectedId = id;
	}

	function restore() {
		if (isCurrent) return;
		const restored: Version = {
			id: nextId++,
			title: `Restored “${selected.base ?? selected.title}”`,
			base: selected.base ?? selected.title,
			author: 'You',
			when: 'Just now',
			target: selected.target,
			note: 'You restored this · just now'
		};
		versions = [restored, ...versions];
		total += 1;
		selectedId = restored.id;
		void capturePosthogEvent('version_history_demo_restored', { restored: selected.base ?? selected.title });
	}

	const highlight = (target: Target) =>
		selected.target === target
			? `outline-2 outline-dashed outline-primary ${target === 'image' ? 'outline-offset-0' : 'outline-offset-4'}`
			: '';

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

{#snippet tag(target: Target)}
	{#if selected.target === target}
		<span class="absolute z-10 {target === 'image' ? 'top-2 left-2' : '-top-[22px] left-0'} flex items-center gap-2 bg-primary-strong px-3 py-1.5 text-xs leading-4 font-bold whitespace-nowrap text-white">
			<span class="h-1.5 w-1.5 bg-white"></span>
			{selected.note}
		</span>
	{/if}
{/snippet}

<section bind:this={section} aria-labelledby="versions-heading" class="pt-14 pb-14 md:pt-24 md:pb-16">
	<div data-reveal class="mx-auto mb-10 flex max-w-[860px] flex-col items-center gap-4 text-center md:mb-14">
		<p class="m-0 font-code text-[0.8125rem] leading-4 tracking-[0.08em] text-primary-strong uppercase">Version history</p>
		<h2
			id="versions-heading"
			class="font-heading text-balance text-[1.875rem] leading-[1.27] tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			Every edit is saved.<br />
			Roll back in
			<em class="block font-serif text-[2.125rem] leading-none font-medium text-primary md:inline md:text-[2.875rem]">one click.</em>
		</h2>
		<p class="max-w-[440px] text-[1.0625rem] leading-[1.5] text-surface md:text-[1.1875rem]">
			See who changed what and when. Restore any earlier version if a change didn't work out.
		</p>
	</div>

	<div data-reveal class="mx-auto max-w-[1100px]">
		<div data-markdown="skip" class="relative overflow-hidden bg-[#23020b] px-5 pt-10 pb-8 md:px-12 lg:h-[516px] lg:pt-12 lg:pb-0">
			<StageGlow />
			<div class="relative mx-auto flex max-w-[902px] flex-col gap-10 lg:h-full lg:flex-row lg:items-start lg:gap-7">
				<!-- Email, cropped at the stage edge -->
				<div class="flex h-[380px] justify-center overflow-hidden lg:h-full lg:w-[494px] lg:shrink-0" role="img" aria-label="An email with the section changed by the selected version highlighted">
					<div class="flex h-full w-full max-w-[494px] shrink-0 flex-col bg-white" aria-hidden="true">
						<div class="flex items-center gap-2 px-[22px] py-4">
							<span class="h-[18px] w-[18px] bg-green"></span>
							<span class="font-heading text-[15px] leading-5 font-semibold text-surface">sprout</span>
						</div>
						<div class="flex flex-col gap-2.5 px-[22px] pt-3.5 pb-[18px]">
							<div class="relative {highlight('headline')}">
								{@render tag('headline')}
								<p class="m-0 font-heading text-[23px] leading-[30px] tracking-[-0.02em] text-surface">
									{selected.target === 'headline' ? 'Willkommen bei Sprout, Sarah.' : 'Welcome to Sprout, Sarah.'}
								</p>
							</div>
							<div class="relative {highlight('intro')}">
								{@render tag('intro')}
								<p class="m-0 max-w-[285px] text-[13px] leading-5 text-muted">
									Your workspace is ready. Add your first project and invite your team in under two minutes.
								</p>
							</div>
						</div>
						<div class="px-[22px] pt-1 pb-6">
							<div class="relative inline-flex {highlight('button')}">
								{@render tag('button')}
								<span class="bg-surface px-5 py-3 text-[13px] leading-[18px] font-bold text-white">Start your first project</span>
							</div>
						</div>
						<div class="min-h-0 flex-1 px-[18px] pb-[18px]">
							<div class="relative flex h-full gap-2.5 px-1 pt-1 {highlight('image')}">
								{@render tag('image')}
								<span class="flex-1 bg-green/10"></span>
								<span class="flex-1 bg-green/20"></span>
							</div>
						</div>
					</div>
				</div>

				<!-- Version list -->
				<div class="w-full bg-white shadow-[0_0_40px_-12px_rgba(17,24,39,0.2)] lg:w-[380px] lg:shrink-0 lg:self-start">
					<div class="flex items-center justify-between border-b border-[#f3e6ea] px-6 py-5">
						<h3 class="m-0 font-heading text-lg leading-6 tracking-[-0.02em] text-surface">Version history</h3>
						<p class="m-0 font-code text-xs leading-4 tracking-[0.08em] text-muted uppercase" aria-live="polite">{total} versions</p>
					</div>
					<ul class="m-0 list-none p-0">
						{#each shown as version, i (version.id)}
							{@const isSelected = version.id === selectedId}
							<li class="border-b border-[#f3e6ea]">
								<button
									type="button"
									onclick={() => select(version.id)}
									aria-pressed={isSelected}
									class="flex w-full cursor-pointer items-center gap-3.5 border-l-[3px] px-6 py-4 text-left transition-colors {isSelected ? 'border-primary bg-primary-soft' : 'border-transparent hover:bg-primary-soft/50'}"
								>
									<span class="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden text-[13px] font-bold text-white {authors[version.author].bg}">
										{#if authors[version.author].src && !brokenAvatars.includes(version.author)}
											<img
												src={authors[version.author].src}
												alt=""
												class="absolute inset-0 h-full w-full object-cover"
												onerror={() => brokenAvatars.push(version.author)}
											/>
										{/if}
										{version.author[0]}
									</span>
									<span class="flex min-w-0 flex-1 flex-col gap-0.5">
										<span class="truncate text-[15px] leading-5 {isSelected ? 'font-bold' : 'font-semibold'} text-surface">{version.title}</span>
										<span class="text-[13px] leading-[18px] text-muted">{version.author} · {version.when}</span>
									</span>
									<span class="w-16 shrink-0 text-right font-code text-[11px] leading-[14px] tracking-[0.08em] text-primary">
										{#if i === 0}CURRENT{:else if isSelected}VIEWING{/if}
									</span>
								</button>
							</li>
						{/each}
					</ul>
					<div class="px-6 pt-5 pb-6">
						<button
							type="button"
							onclick={restore}
							disabled={isCurrent}
							class="flex w-full cursor-pointer items-center justify-center bg-primary-strong px-6 py-3.5 text-[15px] leading-5 font-bold text-white transition duration-200 ease-out enabled:hover:-translate-y-0.5 enabled:hover:bg-primary-strong/90 disabled:cursor-default disabled:bg-border disabled:text-muted motion-reduce:transition-none"
						>
							{isCurrent ? 'This is the current version' : 'Restore this version'}
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div data-reveal class="mt-10 flex justify-center md:mt-14">
		<GetStartedButton placement="home_version_history" />
	</div>
</section>
