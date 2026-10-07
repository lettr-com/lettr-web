<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	type Feature = 'build' | 'translate';
	type Block = 'text' | 'button' | 'divider';
	type Language = 'en' | 'de';

	let section: HTMLElement | undefined = $state();
	let feature = $state<Feature>('build');
	let selectedBlock = $state<Block>('button');
	let language = $state<Language>('en');
	const blocks: { id: Block; label: string }[] = [
		{ id: 'text', label: 'Text' },
		{ id: 'button', label: 'Button' },
		{ id: 'divider', label: 'Divider' }
	];

	const preview = {
		en: {
			greeting: 'Hi Sarah,',
			title: 'Your trial is live.',
			body: 'Everything you need to get started is waiting in your dashboard.',
			button: 'Open your dashboard'
		},
		de: {
			greeting: 'Hallo Sarah,',
			title: 'Dein Testzeitraum läuft.',
			body: 'In deinem Dashboard findest du alles für den Einstieg.',
			button: 'Dashboard öffnen'
		}
	};

	let current = $derived(preview[feature === 'translate' ? language : 'en']);

	function showFeature(next: Feature) {
		feature = next;
		if (next === 'translate') language = 'de';
	}

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} class="border-b border-border/30 py-20 sm:py-24">
	<div data-reveal class="mb-9 max-w-[760px]">
		<h2 class="home-section-heading text-surface">
			Build visually. <span class="block text-primary">Translate in place.</span>
		</h2>
	</div>

	<div data-reveal class="mb-5 flex gap-2" aria-label="Explore editor capabilities">
		<button type="button" onclick={() => showFeature('build')} aria-pressed={feature === 'build'} class="min-w-32 border px-5 py-3 text-sm font-semibold transition-colors {feature === 'build' ? 'border-primary bg-primary text-white' : 'border-border/50 bg-white text-surface hover:border-primary'}">Build</button>
		<button type="button" onclick={() => showFeature('translate')} aria-pressed={feature === 'translate'} class="min-w-32 border px-5 py-3 text-sm font-semibold transition-colors {feature === 'translate' ? 'border-primary bg-primary text-white' : 'border-border/50 bg-white text-surface hover:border-primary'}">Translate</button>
	</div>

	<div data-reveal class="overflow-hidden border border-border/40 bg-white" aria-label="Interactive Lettr email editor demonstration">
		<div class="flex items-center justify-between gap-4 border-b border-border/40 px-4 py-3 sm:px-6">
			<div class="flex min-w-0 items-center gap-3"><span class="truncate text-sm font-medium text-surface">Welcome email</span><span class="hidden border border-primary/30 px-2 py-0.5 text-xs text-primary sm:inline">Draft</span></div>
			<span class="border border-border/40 px-3 py-1.5 text-xs text-surface">Preview</span>
		</div>

		<div class="grid sm:grid-cols-[210px_1fr]">
			<div class="border-b border-border/40 bg-background p-4 sm:border-r sm:border-b-0 sm:p-6">
				{#if feature === 'build'}
					<p class="mb-4 text-sm font-medium text-surface">Content blocks</p>
					<div class="grid grid-cols-3 gap-2 sm:grid-cols-1">
						{#each blocks as block}
							<button type="button" onclick={() => (selectedBlock = block.id)} aria-pressed={selectedBlock === block.id} class="border px-3 py-3 text-left text-sm transition-colors {selectedBlock === block.id ? 'border-primary bg-primary/5 text-primary' : 'border-border/40 bg-white text-surface hover:border-primary'}">{block.label}</button>
						{/each}
					</div>
				{:else}
					<p class="mb-4 text-sm font-medium text-surface">Languages</p>
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-1">
						<button type="button" onclick={() => (language = 'en')} aria-pressed={language === 'en'} class="border px-3 py-3 text-left text-sm transition-colors {language === 'en' ? 'border-primary bg-primary/5 text-primary' : 'border-border/40 bg-white text-surface hover:border-primary'}">English</button>
						<button type="button" onclick={() => (language = 'de')} aria-pressed={language === 'de'} class="border px-3 py-3 text-left text-sm transition-colors {language === 'de' ? 'border-primary bg-primary/5 text-primary' : 'border-border/40 bg-white text-surface hover:border-primary'}">Deutsch</button>
					</div>
				{/if}
			</div>

			<div class="bg-background/60 p-4 sm:p-8">
				<div class="mx-auto min-h-[360px] max-w-[520px] border border-border/30 bg-white px-6 py-9 sm:min-h-[420px] sm:px-10 sm:py-11" aria-live="polite" lang={feature === 'translate' ? language : 'en'}>
					<div class="mb-9 h-2 w-20 bg-primary"></div>
					<div class="-mx-3 px-3 py-2 sm:-mx-4 sm:px-4 {feature === 'build' && selectedBlock === 'text' ? 'border-2 border-primary' : 'border-2 border-transparent'}">
						<p class="mb-4 text-sm text-muted">{current.greeting}</p>
						<p class="mb-4 font-heading text-2xl leading-tight text-surface sm:text-3xl">{current.title}</p>
						<p class="max-w-[38ch] text-sm leading-relaxed text-muted sm:text-base">{current.body}</p>
					</div>
					<div class="mt-5 -ml-3 inline-flex p-1.5 sm:-ml-4 {feature === 'build' && selectedBlock === 'button' ? 'border-2 border-primary' : 'border-2 border-transparent'}">
						<span class="bg-surface px-5 py-3 text-sm font-semibold text-white">{current.button}</span>
					</div>
					<div class="mt-8 border-t-2 pt-4 text-xs text-muted {feature === 'build' && selectedBlock === 'divider' ? 'border-primary' : 'border-border/30'}">Sent by your team, powered by Lettr</div>
				</div>
			</div>
		</div>
	</div>

	<div data-reveal class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<p class="max-w-[46ch] text-sm text-muted sm:text-base" aria-live="polite">{feature === 'build' ? 'Arrange content without touching HTML.' : 'Keep each language in the same template.'}</p>
		<a href="/platform/templates/" class="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Explore the editor <ArrowRightIcon size={18} /></a>
	</div>
</section>
