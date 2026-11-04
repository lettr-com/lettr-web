<script lang="ts">
	import { ecomailOrganizations, emailInfraYears, topolCompanies } from '$lib/data/company';

	interface Stat {
		value: string;
		label: string;
		/** Shown instead of `label` on phones, where three columns leave little room. */
		shortLabel?: string;
	}

	interface Props {
		stats?: Stat[];
	}

	let {
		stats = [
			{ value: topolCompanies, label: 'companies use our email editor' },
			{ value: ecomailOrganizations, label: 'organizations run campaigns with us' },
			{ value: `${emailInfraYears} years`, label: 'running email infrastructure' }
		]
	}: Props = $props();
</script>

<section aria-label="Email infrastructure experience" class="section-y-sm">
	<div class="mx-auto grid max-w-[900px] grid-cols-3">
		{#each stats as stat}
			<div
				class="flex flex-col items-center border-r border-border/30 px-1.5 text-center last:border-r-0 sm:px-6"
			>
				<p
					class="font-heading text-[clamp(0.9375rem,5.2vw,1.25rem)] leading-none tracking-[-0.02em] whitespace-nowrap text-surface tabular-nums sm:text-3xl"
				>
					{stat.value}
				</p>
				<p class="mt-2 text-xs leading-snug text-muted sm:text-sm">
					{#if stat.shortLabel}
						<span class="sm:hidden" data-markdown="skip">{stat.shortLabel}</span>
						<span class="hidden sm:inline">{stat.label}</span>
					{:else}
						{stat.label}
					{/if}
				</p>
			</div>
		{/each}
	</div>
</section>
