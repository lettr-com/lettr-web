<script lang="ts">
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { laravelFaqs } from '$lib/laravel/faqs';

	interface Props {
		/** Highlighted code blocks from the page load, one HTML string per line. */
		highlighted: { smtpEnv: string[] };
	}

	let { highlighted }: Props = $props();

	let openIndex: number | null = $state(0);

	function toggle(i: number) {
		const wasOpen = openIndex === i;
		openIndex = wasOpen ? null : i;
		void capturePosthogEvent('faq_toggled', {
			placement: 'laravel_faq',
			index: i,
			question: laravelFaqs[i].question,
			opened: !wasOpen
		});
	}
</script>

<section id="faq" aria-labelledby="faq-heading" class="bleed bg-white">
	<!-- Same frame as the page layout, so its side borders run through the band. -->
	<div class="mx-auto max-w-[1200px] border-x border-border/30 px-6 narrow:max-w-none narrow:border-x-0">
		<div class="mx-auto flex w-full max-w-[1100px] flex-col gap-10 py-16 md:pt-32 md:pb-36 lg:flex-row lg:gap-20">
			<div class="flex flex-col lg:w-[420px] lg:shrink-0">
				<h2
					id="faq-heading"
					class="m-0 pb-8 font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-surface md:pb-10 md:text-[2.625rem] md:leading-[50px]"
				>
					Questions from
					<em class="block font-serif text-[2.125rem] leading-[1.1] text-primary md:text-[2.875rem] md:leading-[50px]">Laravel developers.</em>
				</h2>

				<aside class="flex flex-col bg-background" aria-label="Adamko, Lettr's built-in assistant">
					<div class="flex items-center gap-3 border-b border-[#eae2e5] px-5 py-[18px]">
						<img src="/hero/designer.png" alt="" width="40" height="40" loading="lazy" class="h-10 w-10 shrink-0 bg-primary-soft object-cover" />
						<span class="flex flex-col gap-0.5">
							<span class="text-[0.9375rem] leading-[18px] font-bold text-surface">Adamko</span>
							<span class="text-xs leading-4 text-muted">Lettr's built-in assistant</span>
						</span>
						<span class="ml-auto flex items-center gap-1.5" aria-hidden="true">
							<span class="h-1.5 w-1.5 shrink-0 bg-green"></span>
							<span class="font-code text-[11px] leading-[14px] text-muted">ONLINE</span>
						</span>
					</div>
					<div class="flex flex-col gap-2.5 px-5 py-[18px]" data-markdown="skip" aria-hidden="true">
						<p class="m-0 text-pretty max-w-[270px] self-end bg-surface px-3.5 py-2.5 text-[13px] leading-[1.5] text-white">
							Why do my order emails land in spam?
						</p>
						<p class="m-0 text-pretty max-w-[300px] bg-white px-3.5 py-3 text-[13px] leading-[1.55] text-surface shadow-[0_0_0_1px_#eae2e5]">
							mail.northwind.io has no DMARC record yet. Here is the exact TXT value to add at your registrar.
						</p>
					</div>
					<div class="flex items-center justify-between gap-3 border-t border-[#eae2e5] px-5 py-3.5">
						<span class="text-[13px] leading-4 text-muted">Setup, templates and deliverability</span>
						<a href="/blog/meet-adamko/" class="shrink-0 text-[13px] leading-4 font-bold text-primary-strong hover:underline hover:underline-offset-4">
							Meet Adamko <span aria-hidden="true">→</span>
						</a>
					</div>
				</aside>
			</div>

			<div class="grow border-t border-surface" data-markdown="faq">
				{#each laravelFaqs as faq, i}
					{@const open = openIndex === i}
					<div class="border-b border-[#e5e7eb]">
						<h3 class="m-0">
							<button
								type="button"
								id="laravel-faq-q{i}"
								aria-expanded={open}
								aria-controls="laravel-faq-a{i}"
								onclick={() => toggle(i)}
								class="flex w-full cursor-pointer items-start justify-between gap-6 py-[22px] text-left text-pretty text-base leading-[22px] font-semibold text-surface md:text-[17px]"
							>
								{faq.question}
								<span class="w-4 shrink-0 text-center text-xl leading-6 font-normal {open ? "text-primary after:content-['−']" : "text-surface after:content-['+']"}" aria-hidden="true"></span>
							</button>
						</h3>
						<div id="laravel-faq-a{i}" role="region" aria-labelledby="laravel-faq-q{i}" hidden={!open} class="-mt-2 pb-[26px]">
							<p class="m-0 text-pretty max-w-[600px] text-[0.9375rem] leading-[1.65] text-muted">{faq.lead ?? faq.answer}</p>
							{#if faq.code}
								<pre class="m-0 mt-3.5 max-w-[600px] overflow-x-auto bg-[#0c111d] px-5 py-4 font-code text-[13px] leading-[1.75] text-[#f0f0f0]"><code>{@html highlighted[faq.code].join('\n')}</code></pre>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
