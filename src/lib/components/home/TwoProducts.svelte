<script lang="ts">
	import { onMount } from 'svelte';
	import CodeSnippet from '$lib/components/CodeSnippet.svelte';
	import EditorPreview from '$lib/components/EditorPreview.svelte';
	import SectionLabel from './SectionLabel.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} class="border-b border-border/30 py-20">
	<div data-reveal class="mb-12 max-w-[720px]">
		<SectionLabel index={1} total={5} label="One platform, two teams" />
		<h2 class="mb-4 text-[2rem] leading-[1.15] tracking-[-0.02em] text-surface sm:text-[2.5rem]">
			Devs integrate. <span class="text-primary">Teams create.</span>
		</h2>
		<p class="text-body text-muted">
			A clean API that developers enjoy, connected to a visual editor your whole team can use
			independently. Nobody files a ticket to change a button color.
		</p>
	</div>

	<div class="grid gap-6 lg:grid-cols-2">
		<div data-reveal class="flex flex-col border border-border/40 bg-white">
			<div class="flex items-center justify-between border-b border-border/30 px-5 py-4">
				<div>
					<p class="text-sm font-semibold text-surface">Transactional</p>
					<p class="text-sm text-muted">REST API and SMTP, SDKs for six languages</p>
				</div>
				<a href="/email-api/" class="text-sm font-semibold text-primary hover:underline">Email API &rarr;</a>
			</div>
			<div class="flex flex-1 items-start bg-gray-950 p-4">
				<CodeSnippet shadow={false} />
			</div>
		</div>

		<div data-reveal class="flex flex-col border border-border/40 bg-white">
			<div class="flex items-center justify-between border-b border-border/30 px-5 py-4">
				<div>
					<p class="text-sm font-semibold text-surface">Marketing</p>
					<p class="text-sm text-muted">Drag-and-drop editor, campaigns, lists and segments</p>
				</div>
				<a href="/email-marketing/" class="text-sm font-semibold text-primary hover:underline">Campaigns &rarr;</a>
			</div>
			<div class="flex flex-1 items-start bg-background p-4">
				<EditorPreview />
			</div>
		</div>
	</div>

	<p data-reveal class="mt-6 text-sm text-muted">
		Both products share one account, one sending reputation, and one bill.
	</p>
</section>
