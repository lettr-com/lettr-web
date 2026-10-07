<script lang="ts">
	import { onMount } from 'svelte';
	import { loadGsap } from '$lib/utils/gsap';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
	import { codeTabs as defaultTabs, type CodeTab } from '$lib/utils/shiki';
	import { getHighlighter } from '$lib/utils/shiki';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	interface Props {
		tabs?: CodeTab[];
		primaryTabIndices?: number[];
		moreTabIndices?: number[];
		shadow?: boolean;
		filename?: string;
		/** Show a Copy button that copies the code of the active tab. */
		copyable?: boolean;
	}

	let {
		tabs = defaultTabs,
		primaryTabIndices = [0, 2],
		moreTabIndices = [1, 3, 4, 5, 6],
		shadow = true,
		filename,
		copyable = false
	}: Props = $props();

	let activeTab: number = $state(0);
	let highlightedCode: string = $state('');
	let container: HTMLElement | undefined = $state();
	let codeEl: HTMLElement | undefined = $state();
	let moreOpen: boolean = $state(false);
	let didCopy: boolean = $state(false);
	let copyTimer: number | undefined;

	const tabPadding = $derived(copyable ? 'px-4' : 'px-8');

	let isMoreActive = $derived(moreTabIndices.includes(activeTab));

	async function highlight(tab: CodeTab) {
		const highlighter = await getHighlighter();
		const isPhp = tab.lang === 'php' && !tab.code.trimStart().startsWith('<?');
		const code = isPhp ? `<?php\n${tab.code}` : tab.code;
		let html = highlighter.codeToHtml(code, {
			lang: tab.lang,
			theme: 'lettr'
		});
		if (isPhp) {
			html = html.replace(/(<code[^>]*>).*?\n/, '$1');
		}
		highlightedCode = html;
	}

	function selectTab(index: number) {
		if (index === activeTab) return;
		const source = primaryTabIndices.includes(index) ? 'primary' : 'more';
		void capturePosthogEvent('code_snippet_tab_selected', {
			tab_index: index,
			tab_label: tabs[index].label,
			tab_lang: tabs[index].lang,
			source,
			filename: filename ?? null
		});
		moreOpen = false;
		activeTab = index;

		if (!codeEl) {
			highlight(tabs[index]);
			return;
		}

		const target = codeEl;
		// gsap loads on demand (first tab switch); fall back to an instant swap
		// if the chunk isn't available.
		void loadGsap()
			.then(({ gsap }) => {
				gsap.killTweensOf(target);
				gsap.to(target, {
					opacity: 0,
					y: 4,
					duration: 0.15,
					ease: 'power2.in',
					onComplete: () => {
						highlight(tabs[index]).then(() => {
							gsap.fromTo(target, { opacity: 0, y: -4 }, {
								opacity: 1,
								y: 0,
								duration: 0.2,
								ease: 'power2.out'
							});
						});
					}
				});
			})
			.catch(() => void highlight(tabs[index]));
	}

	async function copyCode() {
		try {
			await navigator.clipboard.writeText(tabs[activeTab].code);
			didCopy = true;
			clearTimeout(copyTimer);
			copyTimer = window.setTimeout(() => (didCopy = false), 1800);
			void capturePosthogEvent('code_snippet_copied', {
				tab_label: tabs[activeTab].label,
				tab_lang: tabs[activeTab].lang
			});
		} catch {
			didCopy = false;
		}
	}

	function toggleMore() {
		moreOpen = !moreOpen;
	}

	function handleClickOutside(e: MouseEvent) {
		if (container && !container.contains(e.target as Node)) {
			moreOpen = false;
		}
	}

	onMount(() => {
		highlight(tabs[0]);
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
			clearTimeout(copyTimer);
		};
	});
</script>

<div bind:this={container} class="relative max-w-2xl w-full overflow-visible bg-gray-950 p-[6px] pt-[2px] {shadow ? 'shadow-[0_0_40px_-10px_rgba(236,16,75,0.15)]' : ''}">
	<div class="flex items-center {copyable ? 'flex-wrap gap-x-2 gap-y-1 sm:gap-x-3' : 'justify-between'}">
		{#if filename}
			<div class="px-3 py-2 text-[12px] text-gray-300">{filename}</div>
		{:else}
			<div class="flex items-center gap-0">
				{#each primaryTabIndices as tabIndex}
					<button
						class="whitespace-nowrap border-b-2 {tabPadding} py-2 text-[13px] transition-colors {activeTab === tabIndex
							? 'border-primary text-white'
							: 'border-transparent text-gray-300 hover:text-gray-200'}"
						onclick={() => selectTab(tabIndex)}
					>
						{tabs[tabIndex].label}
					</button>
				{/each}
				<div class="relative">
					<button
						class="flex items-center gap-1 whitespace-nowrap border-b-2 {tabPadding} py-2 text-[13px] transition-colors {isMoreActive
							? 'border-primary text-white'
							: 'border-transparent text-gray-300 hover:text-gray-200'}"
						onclick={toggleMore}
					>
						{isMoreActive ? tabs[activeTab].label : 'More'}
						<CaretDownIcon aria-hidden="true" size={10} />
					</button>
					{#if moreOpen}
						<div class="absolute top-full left-0 z-50 mt-1 min-w-[140px] border border-white/10 bg-surface/95 py-1 shadow-xl backdrop-blur-xl">
							{#each moreTabIndices as tabIndex}
								<button
									class="block w-full px-3 py-1.5 text-left text-[13px] transition-colors {activeTab === tabIndex
										? 'text-white'
										: 'text-gray-300 hover:text-white'}"
									onclick={() => selectTab(tabIndex)}
								>
									{tabs[tabIndex].label}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
		{#if copyable}
			<button
				type="button"
				onclick={copyCode}
				class="ml-auto flex h-7 shrink-0 cursor-pointer items-center justify-center gap-1.5 border border-white/15 px-2 text-[12px] font-medium sm:px-2.5 text-white/80 transition-colors hover:border-primary hover:text-white"
				aria-label={didCopy ? 'Copied to clipboard' : `Copy ${tabs[activeTab].label} code`}
			>
				{#if didCopy}
					<CheckIcon aria-hidden="true" size={13} class="text-green" /><span class="hidden sm:inline">Copied</span>
				{:else}
					<CopyIcon aria-hidden="true" size={13} /><span class="hidden sm:inline">Copy</span>
				{/if}
			</button>
		{/if}
	</div>

	<div class="overflow-x-auto border-t border-gray-700 p-4 pb-8 bg-gray-800">
		<div bind:this={codeEl} class="font-code [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!leading-[1.5] [&_code]:!text-[13px] [&_code]:!leading-[1.5]">
			{@html highlightedCode}
		</div>
	</div>
</div>
