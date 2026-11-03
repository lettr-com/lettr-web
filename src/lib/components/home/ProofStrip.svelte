<script lang="ts">
	import { ecomailOrganizations, emailInfraYears, topolCompanies } from '$lib/data/company';

	const stats = [
		{ value: topolCompanies, label: 'companies use our email editor' },
		{ value: ecomailOrganizations, label: 'organizations run campaigns with us' },
		{ value: `${emailInfraYears} years`, label: 'running email infrastructure' }
	];
</script>

<section aria-label="Email infrastructure experience" class="py-10 md:py-16">
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
					{stat.label}
				</p>
			</div>
		{/each}
	</div>
</section>
