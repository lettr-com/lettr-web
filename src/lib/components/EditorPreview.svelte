<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PencilSimpleIcon,
		ArrowCounterClockwiseIcon,
		ArrowClockwiseIcon,
		EyeIcon,
		CaretDownIcon,
		DeviceMobileIcon,
		MonitorIcon,
		TextAaIcon,
		ImageIcon,
		CursorClickIcon,
		MinusIcon,
		ArrowsOutLineVerticalIcon,
		ShareNetworkIcon,
		PlayCircleIcon,
		CodeIcon,
		RepeatIcon
	} from 'phosphor-svelte';

	const HEADING = 'Your trial is live!';
	const BODY_PREFIX = 'Hi ';
	const BODY_SUFFIX = ', thanks for signing up. You have 14 days to explore everything.';

	let headingText = $state(HEADING);
	let bodyPrefix = $state(BODY_PREFIX);
	let bodySuffix = $state(BODY_SUFFIX);
	let showVariable = $state(true);
	let cursorTarget: 'heading' | 'body' | null = $state(null);
	let blocksRevealed = $state(true);

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
				await wait(600);

				await typeChars((v) => (headingText = v), HEADING, 45);
				await wait(350);

				cursorTarget = 'body';
				await typeChars((v) => (bodyPrefix = v), BODY_PREFIX, 40);
				showVariable = true;
				await wait(500);
				await typeChars((v) => (bodySuffix = v), BODY_SUFFIX, 20);

				await wait(1200);
				cursorTarget = null;
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
			<span class="truncate text-[12px] font-medium text-surface">trial-welcome-email</span>
			<PencilSimpleIcon size={12} class="shrink-0 text-muted" />
			<span class="hidden shrink-0 border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-green-600 uppercase sm:inline">Draft</span>
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
			<div class="hidden items-center gap-1 border border-border/30 bg-gray-50 px-2 py-1 text-[10px] font-medium text-surface md:flex">
				<span>Create mutation</span>
				<CaretDownIcon size={10} />
			</div>
			<div class="flex items-center gap-0.5 border border-border/30 bg-gray-50">
				<span class="flex h-6 w-6 items-center justify-center text-muted"><DeviceMobileIcon size={11} /></span>
				<span class="flex h-6 w-6 items-center justify-center border border-primary/60 bg-primary/5 text-primary"><MonitorIcon size={11} /></span>
			</div>
		</div>
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
						<div class="flex aspect-square flex-col items-center justify-center gap-1 border border-border/30 bg-gray-50/60 text-muted transition-colors hover:border-primary/30 hover:bg-primary/[0.03] hover:text-primary">
							<Icon size={14} />
							<span class="text-[9px] font-medium">{block.label}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Canvas -->
		<div class="relative flex-1 overflow-hidden bg-[#F4F4F2] p-4 sm:p-8">
			<div class="mx-auto max-w-[420px]">
				<!-- Store name header block (selected-variable look) -->
				<div class="border border-dashed border-primary/40 px-3 py-3">
					<p class="font-code text-[13px] font-semibold text-surface">{'{{store_name}}'}</p>
					<p class="mt-0.5 text-[10px] text-muted/80">One quick step, then you're all set.</p>
				</div>

				<!-- Heading -->
				<h2 class="mt-6 font-heading text-[20px] font-semibold text-surface leading-tight min-h-[24px]">
					{headingText}{#if cursorTarget === 'heading'}<span class="typing-cursor"></span>{/if}
				</h2>

				<!-- Body -->
				<p class="mt-3 text-[12px] leading-relaxed text-muted min-h-[44px]">
					{bodyPrefix}{#if showVariable}<span class="inline-flex items-center border border-dashed border-primary/50 bg-primary/[0.04] px-1 font-code text-[11px] text-primary variable-pop">{'{{first_name}}'}</span>{/if}{bodySuffix}{#if cursorTarget === 'body'}<span class="typing-cursor"></span>{/if}
				</p>

				<!-- CTA button -->
				<div class="mt-6 bg-surface px-5 py-3 text-center text-[13px] font-semibold text-white">
					Open your dashboard
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
</style>
