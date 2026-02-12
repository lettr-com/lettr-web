<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { CopyIcon, CheckIcon, CaretDownIcon } from 'phosphor-svelte';
	import { codeTabs as defaultTabs, type CodeTab } from '$lib/utils/shiki';
	import { getHighlighter } from '$lib/utils/shiki';
	import { createSingleTimeoutManager } from '$lib/utils/timeoutManager';

	interface Props {
		tabs?: CodeTab[];
		primaryTabIndices?: number[];
		moreTabIndices?: number[];
		shadow?: boolean;
		filename?: string;
	}

	let {
		tabs = defaultTabs,
		primaryTabIndices = [0, 2],
		moreTabIndices = [1, 3, 4, 5, 6],
		shadow = true,
		filename
	}: Props = $props();

	let activeTab: number = $state(0);
	let highlightedCode: string = $state('');
	let copied: boolean = $state(false);
	let container: HTMLElement | undefined = $state();
	let codeEl: HTMLElement | undefined = $state();
	let moreOpen: boolean = $state(false);
	const copyResetTimeout = createSingleTimeoutManager();

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
		moreOpen = false;
		activeTab = index;

		if (!codeEl) {
			highlight(tabs[index]);
			return;
		}

		gsap.killTweensOf(codeEl);
		gsap.to(codeEl, {
			opacity: 0,
			y: 4,
			duration: 0.15,
			ease: 'power2.in',
			onComplete: () => {
				highlight(tabs[index]).then(() => {
					gsap.fromTo(codeEl!, { opacity: 0, y: -4 }, {
						opacity: 1,
						y: 0,
						duration: 0.2,
						ease: 'power2.out'
					});
				});
			}
		});
	}

	function toggleMore() {
		moreOpen = !moreOpen;
	}

	function handleClickOutside(e: MouseEvent) {
		if (container && !container.contains(e.target as Node)) {
			moreOpen = false;
		}
	}

	async function copyCode() {
		await navigator.clipboard.writeText(tabs[activeTab].code);
		copied = true;
		copyResetTimeout.schedule(() => {
			copied = false;
		}, 3000);
	}

	onMount(() => {
		highlight(tabs[0]);
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
			copyResetTimeout.clear();
		};
	});
</script>

<div bind:this={container} class="relative w-full overflow-visible bg-gray-950 p-[6px] pt-[2px] {shadow ? 'shadow-[0_0_40px_-10px_rgba(236,16,75,0.15)]' : ''}">
	<div class="flex items-center justify-between">
		{#if filename}
			<div class="px-3 py-2 text-[12px] text-gray-400">{filename}</div>
		{:else}
			<div class="flex items-center gap-0">
				{#each primaryTabIndices as tabIndex}
					<button
						class="whitespace-nowrap border-b-2 px-8 py-2 text-[13px] transition-colors {activeTab === tabIndex
							? 'border-primary text-white'
							: 'border-transparent text-gray-400 hover:text-gray-200'}"
						onclick={() => selectTab(tabIndex)}
					>
						{tabs[tabIndex].label}
					</button>
				{/each}
				<div class="relative">
					<button
						class="flex items-center gap-1 whitespace-nowrap border-b-2 px-8 py-2 text-[13px] transition-colors {isMoreActive
							? 'border-primary text-white'
							: 'border-transparent text-gray-400 hover:text-gray-200'}"
						onclick={toggleMore}
					>
						{isMoreActive ? tabs[activeTab].label : 'More'}
						<CaretDownIcon size={10} />
					</button>
					{#if moreOpen}
						<div class="absolute top-full left-0 z-50 mt-1 min-w-[140px] border border-white/10 bg-surface/95 py-1 shadow-xl backdrop-blur-xl">
							{#each moreTabIndices as tabIndex}
								<button
									class="block w-full px-3 py-1.5 text-left text-[13px] transition-colors {activeTab === tabIndex
										? 'text-white'
										: 'text-gray-400 hover:text-white'}"
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
		<button
			class="ml-2 flex shrink-0 items-center gap-1.5 p-1.5 text-gray-400 transition-colors hover:text-white text-[12px]"
			onclick={copyCode}
			aria-label="Copy code"
		>
			{#if copied}
				<CheckIcon size={14} />
				Copied
			{:else}
				<CopyIcon size={14} />
				Copy code
			{/if}
		</button>
	</div>

	<div class="overflow-x-auto border-t border-gray-700 p-4 pb-8 bg-gray-800">
		<div bind:this={codeEl} class="font-code [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!leading-[1.5] [&_code]:!text-[13px] [&_code]:!leading-[1.5]">
			{@html highlightedCode}
		</div>
	</div>
</div>
