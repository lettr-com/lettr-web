<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { CodeIcon, CursorClickIcon, CaretDownIcon, MinusIcon, PlusIcon, TextBIcon, TextItalicIcon, TextUnderlineIcon, TextStrikethroughIcon, TextTIcon, TextAlignLeftIcon, TextAlignCenterIcon, TextAlignRightIcon, TextAlignJustifyIcon, LinkIcon, ListNumbersIcon, ListBulletsIcon } from 'phosphor-svelte';
	import { getHighlighter } from '$lib/utils/shiki';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();
	let containerEl: HTMLElement | undefined = $state();
	let activeTab: 'developer' | 'team' = $state('developer');
	let highlightedCode: string = $state('');

	const code = `use Illuminate\Support\Facades\Mail;

Mail::lettr()
    ->to($user->email)
    ->sendTemplate('welcome-email', [
        'name' => $user->name,
    ]);`;

	async function highlightCode() {
		const highlighter = await getHighlighter();
		highlightedCode = highlighter.codeToHtml(code, {
			lang: 'php',
			theme: 'lettr'
		});
	}

	function animateIn(tab: 'developer' | 'team') {
		if (!containerEl) return;
		if (tab === 'developer') {
			const codeBlock = containerEl.querySelector('[data-animate-in]');
			if (!codeBlock) return;
			gsap.fromTo(codeBlock, { opacity: 0, y: -4 }, {
				opacity: 1,
				y: 0,
				duration: 0.2,
				ease: 'power2.out'
			});
		} else {
			const items = containerEl.querySelectorAll('[data-animate-in]');
			if (!items.length) return;
			gsap.fromTo(items, { opacity: 0, x: -10 }, {
				opacity: 1,
				x: 0,
				duration: 0.25,
				stagger: 0.03,
				ease: 'power2.out'
			});
		}
	}

	function switchTab(tab: 'developer' | 'team') {
		if (tab === activeTab) return;
		activeTab = tab;
		requestAnimationFrame(() => animateIn(tab));
	}

	onMount(() => {
		highlightCode();

		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-animate]',
			vars: {
				stagger: 0.1
			}
		});
	});
</script>

<section bind:this={section} class="px-4 py-16 border-b border-border/30">
	<div class="mx-auto max-w-[550px]">
		<div class="mb-10" data-animate>
			<h2 class="mb-3 text-surface">
				Set it up <span class="text-primary">once</span> — never be<br />the bottleneck again
			</h2>
			<p class="text-body text-muted max-w-[50ch]">
				The visual editor isn't just for marketers — it's a developer benefit. Let your team iterate on emails while you ship features.
			</p>
		</div>

		<div data-animate class="shadow-[0_0_40px_-10px_rgba(236,16,75,0.15)]">
			<div class="flex">
				<button
					class="flex flex-1 items-center justify-center gap-2 py-3 text-md transition-colors {activeTab === 'developer'
						? 'bg-gray-950 text-white'
						: 'bg-gray-200 text-gray-500 hover:text-gray-700'}"
					onclick={() => switchTab('developer')}
				>
					<CodeIcon size={18} class={activeTab === 'developer' ? 'text-primary' : 'text-gray-500'} />
					Developer
				</button>
				<button
					class="flex flex-1 items-center justify-center gap-2 py-3 text-md transition-colors {activeTab === 'team'
						? 'bg-white text-surface'
						: 'bg-gray-200 text-gray-500 hover:text-gray-700'}"
					onclick={() => switchTab('team')}
				>
					<CursorClickIcon size={18} class={activeTab === 'team' ? 'text-primary' : 'text-gray-500'} />
					Your team
				</button>
			</div>

			<div bind:this={containerEl} class="relative h-[250px] overflow-hidden {activeTab === 'developer' ? 'bg-gray-950' : 'bg-white'}">
				{#if activeTab === 'developer'}
					<div class="absolute inset-0 p-[6px]">
						<div class="bg-gray-800 border-t border-gray-700 h-full p-4 pb-8">
							<div class="font-code [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!leading-[1.4] [&_code]:!text-[13px] [&_code]:!leading-[1.4]" data-animate-in>
								<p class="text-xs text-gray-500 mb-6">example/WelcomeMail.php</p>
								{@html highlightedCode}
							</div>
						</div>
					</div>
				{:else}
					<div class="absolute inset-0 overflow-y-auto">
						<!-- Toolbar row 1: font, size, formatting -->
						<div data-animate-in class="flex items-center gap-1 border-b border-border/30 p-[6px]">
							<div class="flex items-center gap-1 bg-gray-50 px-2 py-1 text-xs text-gray-500">
								Helvetica
								<CaretDownIcon size={12} class="text-gray-400" />
							</div>
							<div class="flex items-center bg-gray-50 gap-1 px-1.5 py-1 text-xs text-gray-500">
								<MinusIcon size={12} class="text-gray-400" />
								<span class="px-1">14px</span>
								<PlusIcon size={12} class="text-gray-400" />
							</div>
							<div class="ml-2 flex items-center gap-2 text-gray-400">
								<TextBIcon size={16} />
								<TextItalicIcon size={16} />
								<TextUnderlineIcon size={16} />
								<TextStrikethroughIcon size={16} />
								<TextTIcon size={16} />
							</div>
						</div>

						<!-- Toolbar row 2: alignment, link, lists -->
						<div data-animate-in class="flex items-center gap-2 border-b border-border/30 p-[6px] text-gray-400">
							<TextAlignLeftIcon size={16} />
							<TextAlignCenterIcon size={16} />
							<TextAlignRightIcon size={16} />
							<TextAlignJustifyIcon size={16} />
							<LinkIcon size={16} />
							<ListNumbersIcon size={16} />
							<ListBulletsIcon size={16} />
						</div>

						<!-- Email template content -->
						<div class="p-4">
							<p data-animate-in class="text-[10px] tracking-widest text-gray-800 uppercase">Welcome</p>
							<p data-animate-in class="mt-1 text-xl font-bold text-gray-900">Your order is confirmed!</p>
							<p data-animate-in class="mt-2 text-sm text-gray-500">
								Hi <span class="inline-flex items-center gap-0.5 rounded bg-gray-100 px-1.5 py-0.5 font-code text-xs text-gray-600">{'{{ name }}'}</span>, thanks for your order.
							</p>
							<button data-animate-in class="mt-5 bg-surface px-5 py-2 rounded-lg text-sm font-semibold text-white">
								View Order
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>
