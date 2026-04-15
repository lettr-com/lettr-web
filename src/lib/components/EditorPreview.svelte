<script lang="ts">
	import {
		TextBIcon,
		TextItalicIcon,
		TextAlignLeftIcon,
		TextAlignCenterIcon,
		LinkIcon,
		ImageIcon,
		SquareIcon,
		MinusIcon,
		DotsSixVerticalIcon,
		PencilSimpleIcon
	} from 'phosphor-svelte';
</script>

<div class="w-full overflow-hidden border border-border/40 bg-white shadow-[0_0_60px_-15px_rgba(236,16,75,0.12)]">
	<!-- Top bar -->
	<div class="flex items-center justify-between border-b border-border/30 bg-gray-50 px-4 py-2">
		<div class="flex items-center gap-2">
			<div class="flex gap-1.5">
				<div class="h-2.5 w-2.5 rounded-full bg-red-400"></div>
				<div class="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>
				<div class="h-2.5 w-2.5 rounded-full bg-green-400"></div>
			</div>
			<span class="ml-3 text-[11px] font-medium text-muted">trial-welcome-email</span>
			<span class="border border-green-200 bg-green-50 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-green-600 uppercase">Draft</span>
		</div>
		<div class="flex items-center gap-3 text-[11px] text-muted">
			<span>Preview</span>
			<span class="font-medium text-primary">Publish</span>
		</div>
	</div>

	<div class="flex">
		<!-- Block sidebar -->
		<div class="hidden w-[52px] shrink-0 flex-col items-center gap-1 border-r border-border/30 bg-gray-50/50 py-3 sm:flex">
			<div class="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-gray-100">
				<TextBIcon size={14} />
			</div>
			<div class="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-gray-100">
				<ImageIcon size={14} />
			</div>
			<div class="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-gray-100">
				<SquareIcon size={14} />
			</div>
			<div class="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-gray-100">
				<MinusIcon size={14} />
			</div>
			<div class="flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-gray-100">
				<LinkIcon size={14} />
			</div>
		</div>

		<!-- Email canvas -->
		<div class="flex-1 bg-gray-100/50 p-4 sm:p-6">
			<div class="mx-auto max-w-[380px] bg-white shadow-sm">
				<!-- Email header -->
				<div class="group relative border-2 border-transparent px-6 pt-6 pb-4 transition-colors hover:border-primary/20">
					<div class="absolute -top-2.5 -right-2.5 hidden h-5 w-5 items-center justify-center bg-primary text-white group-hover:flex">
						<PencilSimpleIcon size={10} />
					</div>
					<div class="flex items-center gap-2">
						<div class="flex h-6 w-6 items-center justify-center bg-primary text-[10px] font-bold text-white">L</div>
						<span class="text-[11px] font-semibold text-surface">YourApp</span>
					</div>
				</div>

				<!-- Email body -->
				<div class="group relative border-2 border-primary/30 bg-primary/[0.02] px-6 py-5 transition-colors">
					<div class="absolute -top-2.5 -right-2.5 flex h-5 w-5 items-center justify-center bg-primary text-white">
						<PencilSimpleIcon size={10} />
					</div>
					<!-- Inline toolbar -->
					<div class="mb-4 flex items-center gap-1 border border-border/30 bg-white px-2 py-1 shadow-sm w-fit">
						<TextBIcon size={12} class="text-muted" />
						<TextItalicIcon size={12} class="text-muted" />
						<div class="mx-1 h-3 w-px bg-border/50"></div>
						<TextAlignLeftIcon size={12} class="text-primary" />
						<TextAlignCenterIcon size={12} class="text-muted" />
						<div class="mx-1 h-3 w-px bg-border/50"></div>
						<LinkIcon size={12} class="text-muted" />
					</div>
					<p class="text-[10px] font-semibold tracking-widest text-primary uppercase">Welcome</p>
					<h2 class="mt-1 font-heading text-lg font-medium text-surface leading-tight">Your trial is live!</h2>
					<p class="mt-2.5 text-[12px] leading-relaxed text-muted">
						Hi <span class="inline-flex items-center gap-0.5 bg-primary/8 px-1.5 py-0.5 font-code text-[10px] text-primary">{'{{ first_name }}'}</span>, thanks for signing up. You have 14 days to explore everything.
					</p>
				</div>

				<!-- CTA block -->
				<div class="group relative border-2 border-transparent px-6 py-5 transition-colors hover:border-primary/20">
					<div class="absolute -top-2.5 -right-2.5 hidden h-5 w-5 items-center justify-center bg-primary text-white group-hover:flex">
						<PencilSimpleIcon size={10} />
					</div>
					<div class="bg-surface px-5 py-2.5 text-center text-[12px] font-semibold text-white">
						Open your dashboard
					</div>
				</div>

				<!-- Drag handle hint -->
				<div class="flex items-center justify-center border-t border-dashed border-border/40 py-2 text-border/60">
					<DotsSixVerticalIcon size={14} />
				</div>
			</div>
		</div>

		<!-- Properties sidebar -->
		<div class="hidden w-[140px] shrink-0 flex-col border-l border-border/30 bg-gray-50/50 p-3 lg:flex">
			<span class="mb-3 text-[9px] font-semibold tracking-wider text-muted uppercase">Properties</span>
			<div class="flex flex-col gap-2.5">
				<div>
					<span class="text-[10px] text-muted">Font</span>
					<div class="mt-0.5 border border-border/40 bg-white px-2 py-1 text-[10px] text-surface">Inter</div>
				</div>
				<div>
					<span class="text-[10px] text-muted">Size</span>
					<div class="mt-0.5 border border-border/40 bg-white px-2 py-1 text-[10px] text-surface">16px</div>
				</div>
				<div>
					<span class="text-[10px] text-muted">Color</span>
					<div class="mt-0.5 flex items-center gap-1.5 border border-border/40 bg-white px-2 py-1">
						<div class="h-3 w-3 bg-surface"></div>
						<span class="text-[10px] text-surface">#111827</span>
					</div>
				</div>
				<div>
					<span class="text-[10px] text-muted">Padding</span>
					<div class="mt-0.5 border border-border/40 bg-white px-2 py-1 text-[10px] text-surface">24px</div>
				</div>
			</div>
		</div>
	</div>
</div>
