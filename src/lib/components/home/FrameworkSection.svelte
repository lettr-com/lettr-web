<script lang="ts">
	import TerminalDemo from './TerminalDemo.svelte';
	import StageGlow from './StageGlow.svelte';
	import { terminalScripts } from '$lib/home/terminalScripts';

	let activeId = $state(terminalScripts[0].id);

	const active = $derived(terminalScripts.find((s) => s.id === activeId) ?? terminalScripts[0]);

	function onTabKeydown(event: KeyboardEvent, index: number) {
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const next = terminalScripts[(index + step + terminalScripts.length) % terminalScripts.length];
		activeId = next.id;
		document.getElementById(`framework-tab-${next.id}`)?.focus();
	}
</script>

<section aria-labelledby="framework-heading" class="py-14 md:py-24">
	<div class="mx-auto mb-10 flex max-w-[860px] flex-col items-center gap-4 text-center md:mb-14">
		<h2
			id="framework-heading"
			class="font-heading text-balance text-[1.875rem] leading-[1.27] tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			Built for
			<em class="font-pixel text-[2.125rem] leading-none font-medium text-primary md:text-[2.875rem]">Laravel.</em><br />
			Compatible with most.
		</h2>
		<p class="max-w-[480px] text-[1.0625rem] leading-[1.5] text-surface md:text-[1.1875rem]">
			<a href="/laravel/" class="underline decoration-primary-outline underline-offset-4 hover:decoration-primary">Laravel gets a first-party package.</a>
			Everything else works with our SDKs, REST API or SMTP.
		</p>
	</div>

	<div class="relative mx-auto max-w-[1100px] overflow-hidden bg-surface px-4 pt-5 sm:px-6">
		<StageGlow />
		<div class="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
			<div role="tablist" aria-label="Framework" class="-mx-1 flex gap-1 overflow-x-auto">
				{#each terminalScripts as script, index}
					{@const isActive = script.id === activeId}
					<button
						type="button"
						role="tab"
						id="framework-tab-{script.id}"
						aria-selected={isActive}
						aria-controls="framework-panel"
						tabindex={isActive ? 0 : -1}
						onclick={() => (activeId = script.id)}
						onkeydown={(event) => onTabKeydown(event, index)}
						class="shrink-0 cursor-pointer border-b-2 px-3 py-2 font-heading text-base transition-colors md:px-4 md:text-xl {isActive ? 'border-primary text-white' : 'border-transparent text-white/60 hover:text-white'}"
					>
						{script.label}
					</button>
				{/each}
			</div>
		</div>

		<div
			id="framework-panel"
			role="tabpanel"
			aria-labelledby="framework-tab-{active.id}"
			class="relative mx-auto mt-8 -mb-px max-w-[600px] sm:mt-12"
		>
			<TerminalDemo script={active} />
		</div>
	</div>
</section>
