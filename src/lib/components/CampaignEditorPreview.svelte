<script lang="ts">
	import { onMount } from 'svelte';
	import PencilSimpleIcon from 'phosphor-svelte/lib/PencilSimpleIcon';
	import ArrowCounterClockwiseIcon from 'phosphor-svelte/lib/ArrowCounterClockwiseIcon';
	import ArrowClockwiseIcon from 'phosphor-svelte/lib/ArrowClockwiseIcon';
	import EyeIcon from 'phosphor-svelte/lib/EyeIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import DeviceMobileIcon from 'phosphor-svelte/lib/DeviceMobileIcon';
	import MonitorIcon from 'phosphor-svelte/lib/MonitorIcon';
	import TextAaIcon from 'phosphor-svelte/lib/TextAaIcon';
	import ImageIcon from 'phosphor-svelte/lib/ImageIcon';
	import CursorClickIcon from 'phosphor-svelte/lib/CursorClickIcon';
	import MinusIcon from 'phosphor-svelte/lib/MinusIcon';
	import ArrowsOutLineVerticalIcon from 'phosphor-svelte/lib/ArrowsOutLineVerticalIcon';
	import ShareNetworkIcon from 'phosphor-svelte/lib/ShareNetworkIcon';
	import PlayCircleIcon from 'phosphor-svelte/lib/PlayCircleIcon';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import RepeatIcon from 'phosphor-svelte/lib/RepeatIcon';
	import UsersThreeIcon from 'phosphor-svelte/lib/UsersThreeIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';

	const HEADING = "What's new in March 🚀";
	const BODY_PREFIX = 'Hey ';
	const BODY_SUFFIX =
		", we shipped a lot this month — real-time dashboards, an upgraded API, and faster onboarding. Here's the rundown.";

	let headingText = $state(HEADING);
	let bodyPrefix = $state(BODY_PREFIX);
	let bodySuffix = $state(BODY_SUFFIX);
	let showVariable = $state(true);
	let cursorTarget: 'heading' | 'body' | null = $state(null);
	let blocksRevealed = $state(true);
	let showButton = $state(true);
	let showImage = $state(true);
	let activeBlock: string | null = $state(null);

	const blocks: { label: string; Icon: typeof TextAaIcon }[] = [
		{ label: 'Text', Icon: TextAaIcon },
		{ label: 'Image', Icon: ImageIcon },
		{ label: 'Button', Icon: CursorClickIcon },
		{ label: 'Divider', Icon: MinusIcon },
		{ label: 'Spacer', Icon: ArrowsOutLineVerticalIcon },
		{ label: 'Social', Icon: ShareNetworkIcon },
		{ label: 'Video', Icon: PlayCircleIcon },
		{ label: 'HTML', Icon: CodeIcon },
		{ label: 'Loop', Icon: RepeatIcon }
	];

	onMount(() => {
		const mq = window.matchMedia('(min-width: 1024px)');
		if (!mq.matches) return;

		headingText = '';
		bodyPrefix = '';
		bodySuffix = '';
		showVariable = false;
		blocksRevealed = false;
		showButton = false;
		showImage = false;
		cursorTarget = 'heading';

		let alive = true;

		const wait = (ms: number) =>
			new Promise<void>((resolve, reject) => {
				setTimeout(() => (alive ? resolve() : reject()), ms);
			});

		const typeChars = async (setter: (v: string) => void, text: string, speed: number) => {
			for (let i = 1; i <= text.length; i++) {
				setter(text.slice(0, i));
				await wait(speed);
			}
		};

		(async () => {
			try {
				await wait(800);
				blocksRevealed = true;
				await wait(500);

				activeBlock = 'Image';
				await wait(280);
				showImage = true;
				await wait(450);
				activeBlock = null;
				await wait(300);

				await typeChars((v) => (headingText = v), HEADING, 45);
				await wait(350);

				cursorTarget = 'body';
				await typeChars((v) => (bodyPrefix = v), BODY_PREFIX, 40);
				showVariable = true;
				await wait(500);
				await typeChars((v) => (bodySuffix = v), BODY_SUFFIX, 18);

				await wait(700);
				cursorTarget = null;

				activeBlock = 'Button';
				await wait(280);
				showButton = true;
				await wait(450);
				activeBlock = null;

				await wait(800);
			} catch {
				/* component destroyed during animation */
			}
		})();

		return () => {
			alive = false;
		};
	});
</script>

<div class="w-full overflow-hidden border border-border/40 bg-white shadow-[0_0_60px_-15px_rgba(236,16,75,0.12)]">
	<!-- Top bar -->
	<div class="flex items-center justify-between border-b border-border/30 bg-white px-3 py-2">
		<div class="flex min-w-0 items-center gap-2">
			<span class="truncate text-[12px] font-medium text-surface">march-product-update</span>
			<PencilSimpleIcon size={12} class="shrink-0 text-muted" />
			<span class="hidden shrink-0 border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-amber-600 uppercase sm:inline">Campaign</span>
		</div>
		<div class="flex items-center gap-1.5 sm:gap-2">
			<div class="flex items-center gap-0.5 border border-border/30 bg-gray-50">
				<span class="flex h-6 w-6 items-center justify-center text-muted"><ArrowCounterClockwiseIcon size={11} /></span>
				<span class="h-4 w-px bg-border/40"></span>
				<span class="flex h-6 w-6 items-center justify-center text-muted"><ArrowClockwiseIcon size={11} /></span>
			</div>
			<div class="hidden items-center gap-1 border border-border/30 bg-gray-50 px-2 py-1 text-[10px] font-medium text-surface sm:flex">
				<EyeIcon size={11} />
				<span>Preview</span>
			</div>
			<div class="hidden items-center gap-1 border border-primary/40 bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary md:flex">
				<PaperPlaneTiltIcon size={11} />
				<span>Schedule send</span>
				<CaretDownIcon size={10} />
			</div>
			<div class="flex items-center gap-0.5 border border-border/30 bg-gray-50">
				<span class="flex h-6 w-6 items-center justify-center text-muted"><DeviceMobileIcon size={11} /></span>
				<span class="flex h-6 w-6 items-center justify-center border border-primary/60 bg-primary/5 text-primary"><MonitorIcon size={11} /></span>
			</div>
		</div>
	</div>

	<!-- Audience bar -->
	<div class="hidden items-center justify-between border-b border-border/30 bg-gray-50/70 px-3 py-1.5 text-[10px] sm:flex">
		<div class="flex items-center gap-1.5 text-muted">
			<UsersThreeIcon size={12} class="text-primary" />
			<span class="text-surface">To:</span>
			<span class="border border-border/40 bg-white px-1.5 py-0.5 font-medium text-surface">Product newsletter · Active</span>
			<span>8,920 recipients</span>
		</div>
		<span class="text-muted/70">Send time-optimized</span>
	</div>

	<div class="flex">
		<!-- Left sidebar: tabs + block grid -->
		<div class="hidden w-[210px] shrink-0 flex-col border-r border-border/30 bg-white sm:flex">
			<!-- Primary tabs -->
			<div class="flex border-b border-border/30 text-[10px] font-medium">
				<div class="relative flex-1 px-3 py-2 text-center text-surface">
					Content
					<span class="absolute inset-x-3 -bottom-px h-[2px] bg-primary"></span>
				</div>
				<div class="flex-1 px-3 py-2 text-center text-muted/70">Structure</div>
				<div class="flex-1 px-3 py-2 text-center text-muted/70">Settings</div>
			</div>

			<div class="p-3">
				<!-- Sub tabs -->
				<div class="mb-3 flex gap-0.5 bg-gray-100 p-0.5">
					<div class="flex-1 bg-white py-1 text-center text-[10px] font-medium text-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)]">Basic</div>
					<div class="flex-1 py-1 text-center text-[10px] text-muted/70">Premade</div>
					<div class="flex-1 py-1 text-center text-[10px] text-muted/70">Saved</div>
				</div>

				<!-- Block grid -->
				<div class="grid grid-cols-3 gap-1.5 transition-opacity duration-500" style:opacity={blocksRevealed ? 1 : 0}>
					{#each blocks as block (block.label)}
						{@const Icon = block.Icon}
						{@const isActive = activeBlock === block.label}
						<div
							class="flex aspect-square flex-col items-center justify-center gap-1 border border-border/30 bg-gray-50/60 text-muted transition-all duration-150 hover:border-primary/30 hover:bg-primary/[0.03] hover:text-primary"
							class:block-active={isActive}
						>
							<Icon size={14} />
							<span class="text-[9px] font-medium">{block.label}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Canvas -->
		<div class="relative flex-1 overflow-hidden bg-gray-50 p-4 sm:p-8">
			<div class="mx-auto max-w-[420px]">
				<!-- Brand header block -->
				<div class="flex items-center justify-between border-b border-border/30 pb-3">
					<div class="flex items-center gap-1.5">
						<span class="flex h-4 w-4 items-center justify-center bg-primary text-[9px] font-bold text-white">A</span>
						<span class="font-heading text-[14px] font-bold tracking-tight text-surface">Acme</span>
					</div>
					<span class="text-[10px] text-muted/70">View in browser</span>
				</div>

				<!-- Hero image block (reserves space to prevent layout shift) -->
				<div class="mt-4 min-h-[120px]">
					{#if showImage}
						<div class="relative flex h-[120px] items-center justify-center overflow-hidden border border-border/30 bg-gradient-to-br from-primary/15 via-primary/5 to-indigo-100/50 image-fade-in">
							<ImageIcon size={26} class="text-primary/40" />
							<span class="absolute bottom-2 left-2 bg-white/80 px-1.5 py-0.5 text-[9px] font-medium text-muted">product-update.png</span>
						</div>
					{/if}
				</div>

				<!-- Heading -->
				<h2 class="mt-5 font-heading text-[20px] font-semibold text-surface leading-tight min-h-[24px]">
					{headingText}{#if cursorTarget === 'heading'}<span class="typing-cursor"></span>{/if}
				</h2>

				<!-- Body -->
				<p class="mt-3 text-[12px] leading-relaxed text-muted min-h-[44px]">
					{bodyPrefix}{#if showVariable}<span class="inline-flex items-center border border-dashed border-primary/50 bg-primary/[0.04] px-1 font-code text-[11px] text-primary variable-pop">{'{{first_name}}'}</span>{/if}{bodySuffix}{#if cursorTarget === 'body'}<span class="typing-cursor"></span>{/if}
				</p>

				<!-- CTA button slot (reserves space to prevent layout shift) -->
				<div class="mt-6 min-h-[44px]">
					{#if showButton}
						<div class="bg-surface px-5 py-3 text-center text-[13px] font-semibold text-white button-drop-in">
							See what's new
						</div>
					{/if}
				</div>

				<!-- Footer with unsubscribe (campaign requirement) -->
				<div class="mt-6 border-t border-border/30 pt-3 text-center">
					<p class="text-[9px] leading-relaxed text-muted/70">
						You're receiving this because you have an Acme account.<br />
						<span class="underline">Unsubscribe</span> · <span class="underline">Update preferences</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.typing-cursor {
		display: inline-block;
		width: 1.5px;
		height: 0.85em;
		background-color: var(--color-surface);
		vertical-align: text-bottom;
		margin-left: 1px;
		animation: cursor-blink 0.75s steps(1) infinite;
	}

	@keyframes cursor-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
	}

	.variable-pop {
		animation: pop-in 0.25s ease-out;
	}

	@keyframes pop-in {
		0% { opacity: 0; transform: scale(0.85); }
		100% { opacity: 1; transform: scale(1); }
	}

	.block-active {
		border-color: color-mix(in oklab, var(--color-primary) 60%, transparent);
		background-color: color-mix(in oklab, var(--color-primary) 8%, transparent);
		color: var(--color-primary);
		animation: block-tap 0.35s ease-out;
	}

	@keyframes block-tap {
		0% { transform: scale(1); }
		40% { transform: scale(0.92); }
		100% { transform: scale(1); }
	}

	.button-drop-in {
		animation: button-drop-in 0.45s cubic-bezier(0.16, 1, 0.3, 1);
		transform-origin: top center;
	}

	@keyframes button-drop-in {
		0% { opacity: 0; transform: translateY(-8px) scaleY(0.85); }
		60% { opacity: 1; }
		100% { opacity: 1; transform: translateY(0) scaleY(1); }
	}

	.image-fade-in {
		animation: image-fade-in 0.45s ease-out;
	}

	@keyframes image-fade-in {
		0% { opacity: 0; transform: scale(0.96); }
		100% { opacity: 1; transform: scale(1); }
	}
</style>
