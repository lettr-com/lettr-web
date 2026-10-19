<script lang="ts">
	import { onMount } from 'svelte';
	import DitherEdge from '$lib/components/home/DitherEdge.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	// Each row is checked against lettr/lettr-laravel 2.8.0.
	const rows = [
		{ title: 'Mailables and notifications', code: 'MAIL_MAILER=lettr', description: 'Delivered over the HTTP API. No SMTP.' },
		{ title: 'One email at a time', code: "Mail::mailer('lettr')", description: 'Keep your default mailer while you move over.' },
		{ title: 'Templates as Blade', code: 'lettr:pull / lettr:push', description: 'Move templates between the editor and your repo.' },
		{ title: 'Tests', code: 'Mail::fake()', description: 'Assertions you already write keep passing.' },
		{ title: 'Scheduled sends', code: '->scheduleAt(now()->addDay())', description: 'Five minutes to thirty days ahead, cancellable.' },
		{ title: 'Typed errors', code: 'RateLimitException', description: 'One exception class per failure, with retryAfter.' },
		{ title: 'Marketing, same account', code: 'Lettr::campaigns()', description: 'Audiences, segments and campaigns too.' }
	];

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} aria-labelledby="index-heading" class="bleed relative bg-white">
	<div class="absolute inset-x-0 top-0 h-6 rotate-180" aria-hidden="true">
		<DitherEdge placement="inside" color="#23020b" cell={8} />
	</div>

	<div class="mx-auto flex w-full max-w-[1148px] flex-col gap-10 px-6 py-16 md:gap-14 md:pt-[136px] md:pb-[120px]">
		<div data-reveal class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
			<h2
				id="index-heading"
				class="m-0 font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
			>
				Everything else<br />
				stays Laravel.
			</h2>
			<p class="m-0 text-pretty max-w-[400px] shrink-0 text-[1.0625rem] leading-[27.2px] text-muted md:text-[1.1875rem] md:leading-[30.4px]">
				Lettr is a mail transport and a facade. Everything else in your app stays where it is.
			</p>
		</div>

		<ol data-reveal class="m-0 flex list-none flex-col border-t border-surface p-0">
			{#each rows as row, i}
				<li
					class="grid grid-cols-[32px_1fr] items-baseline gap-x-4 gap-y-2 border-b border-[#eee7ea] py-5 md:grid-cols-[40px_300px_1fr] md:gap-x-6 lg:grid-cols-[40px_300px_300px_1fr]"
				>
					<span class="font-code text-[13px] leading-4 text-primary" aria-hidden="true">0{i + 1}</span>
					<h3 class="m-0 font-heading text-[1.25rem] leading-[1.4] font-normal text-surface md:text-[1.375rem] md:leading-[30.8px]">
						{row.title}
					</h3>
					<code class="col-start-2 font-code text-sm leading-[18px] break-all text-surface md:col-start-3 lg:col-start-auto">{row.code}</code>
					<p class="col-start-2 m-0 text-[0.9375rem] leading-[1.5] text-muted md:col-start-3 lg:col-start-auto">{row.description}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
