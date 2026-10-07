<script lang="ts">
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	function track(label: string, href: string, external: boolean) {
		void capturePosthogEvent('cta_clicked', {
			placement: 'pricing_bundle',
			label,
			href,
			destination_type: external ? 'external' : 'internal'
		});
	}
</script>

<section aria-labelledby="bundle-heading" class="mx-auto max-w-[1100px]">
	<div class="flex flex-col gap-8 border border-primary-outline bg-white p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
		<div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
			<span
				class="flex h-12 w-12 shrink-0 items-center justify-center border border-primary-outline bg-primary-soft font-heading text-xl leading-6 font-bold text-primary"
				aria-hidden="true">T</span
			>
			<div class="flex flex-col gap-3">
				<h2 id="bundle-heading" class="m-0 flex flex-wrap items-baseline gap-x-3 font-heading text-[1.75rem] leading-[34px] tracking-[-0.025em] text-surface sm:text-4xl sm:leading-[42px]">
					Bundle
					<em class="font-serif text-[2rem] leading-[34px] font-medium text-primary sm:text-[2.5rem] sm:leading-[42px]">with Topol.</em>
				</h2>
				<p class="m-0 max-w-[520px] text-[1.0625rem] leading-[27px] text-muted">
					Topol Plugin is our drag-and-drop email editor, built to embed in your own app. Users design emails inside your product, and Lettr sends them.
				</p>
			</div>
		</div>
		<div class="flex shrink-0 flex-col gap-3 sm:flex-row lg:w-[180px] lg:flex-col">
			<a
				href="/demo/"
				onclick={() => track('Talk to us', '/demo/', false)}
				class="flex h-12 flex-1 items-center justify-center gap-2.5 bg-primary text-[0.9375rem] font-semibold text-white transition-colors hover:bg-primary-strong"
			>
				Talk to us <span class="text-lg" aria-hidden="true">→</span>
			</a>
			<a
				href="https://topol.io"
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => track('Explore Topol', 'https://topol.io', true)}
				class="flex h-12 flex-1 items-center justify-center gap-2.5 border border-border text-[0.9375rem] font-semibold text-surface transition-colors hover:border-primary hover:text-primary"
			>
				Explore Topol <span aria-hidden="true">↗</span>
			</a>
		</div>
	</div>
</section>
