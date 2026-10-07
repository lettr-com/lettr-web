<script lang="ts">
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';

	// twelve stars on a ring, the EU flag motif, drawn once
	const stars = Array.from({ length: 12 }, (_, i) => i * 30);
</script>

<div class="flex flex-col items-center gap-5">
	<span class="flex h-14 w-14 items-center justify-center border border-primary-outline bg-primary-soft" aria-hidden="true">
		<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
			{#each stars as angle}
				<path
					transform="translate(20 20) rotate({angle}) translate(0 -13)"
					d="M0 -3.2L0.95 -0.98L3.3 -0.78L1.5 0.74L2.05 3.05L0 1.8L-2.05 3.05L-1.5 0.74L-3.3 -0.78L-0.95 -0.98Z"
					fill="#ec104b"
				/>
			{/each}
		</svg>
	</span>

	<p class="m-0 text-center text-[1.0625rem] leading-[26px] text-surface">
		<span class="block font-semibold text-primary">Every plan, including the free tier,</span>
		runs on EU-hosted infrastructure. No enterprise gate for data residency.
	</p>

	<ul class="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-2 p-0 text-sm leading-5 text-muted">
		<li class="flex items-center gap-2">
			<ShieldCheckIcon size={18} weight="bold" class="text-primary" aria-hidden="true" />
			GDPR-compliant by default
		</li>
		<li class="flex items-center gap-2">
			<CheckIcon size={18} weight="bold" class="text-primary" aria-hidden="true" />
			Your data stays under EU jurisdiction
		</li>
		<li class="flex items-center gap-2">
			<CheckIcon size={18} weight="bold" class="text-primary" aria-hidden="true" />
			Same on every plan
		</li>
	</ul>
</div>
