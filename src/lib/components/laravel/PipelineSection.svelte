<script lang="ts">
	import { onMount } from 'svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	interface Step {
		command: string[];
		description: string;
		/** Cube positions in the glyph, back to front. */
		cubes: [number, number][];
		/** The last cube turns crimson: the step that sends. */
		sends?: boolean;
	}

	const steps: Step[] = [
		{
			command: ['composer require', 'lettr/lettr-laravel'],
			description: 'Laravel 10 to 13 on PHP 8.4+. Adds the lettr mail transport.',
			cubes: [[36, 14]]
		},
		{
			command: ['php artisan', 'lettr:init'],
			description: "Writes your API key, sets MAIL_MAILER=lettr and checks your domain's DNS.",
			cubes: [
				[24, 21],
				[48, 7]
			]
		},
		{
			command: ['php artisan', 'lettr:generate-dtos'],
			description: 'Typed DTOs from your template merge tags.',
			cubes: [
				[12, 28],
				[36, 14],
				[60, 0]
			]
		},
		{
			command: ['Mail::to($customer)', '  ->queue(new OrderShipped(...))'],
			description: 'Queued and retry-safe by default. A retry replays the original send.',
			cubes: [
				[12, 28],
				[36, 14],
				[60, 0]
			],
			sends: true
		}
	];

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} aria-labelledby="pipeline-heading" class="mx-auto max-w-[1100px] py-16 md:pt-[136px] md:pb-32">
	<div data-reveal class="mb-10 flex flex-col gap-4 md:mb-[72px] lg:flex-row lg:items-end lg:justify-between lg:gap-16">
		<h2
			id="pipeline-heading"
			class="m-0 font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
		>
			From install to a<br class="hidden sm:block" />
			typed, queued send.
		</h2>
		<p class="m-0 text-pretty max-w-[400px] shrink-0 text-[1.0625rem] leading-[27.2px] text-muted md:text-[1.1875rem] md:leading-[30.4px]">
			Four steps. Two of them are artisan commands, and the last one is the code you already write.
		</p>
	</div>

	<ol data-reveal class="m-0 grid list-none border-t border-surface p-0 sm:grid-cols-2 lg:grid-cols-4">
		{#each steps as step, i}
			<li
				class="flex flex-col gap-4 border-b border-[#e2d8dc] py-6 sm:gap-5 sm:py-7 lg:border-b-0 {i % 2 === 1 ? 'sm:border-l sm:pl-7' : 'sm:pr-7'} {i > 0 ? 'lg:border-l lg:pl-7' : ''} {i < 3 ? 'lg:pr-7' : ''}"
			>
				<svg width="120" height="84" viewBox="0 0 120 84" aria-hidden="true" class="shrink-0">
					{#each step.cubes as [x, y], c}
						{@const lit = step.sends && c === step.cubes.length - 1}
						<g transform="translate({x},{y})" stroke="#ec104b" stroke-width="1.5" stroke-linejoin="round">
							<path d="M24 0 L48 14 L24 28 L0 14 Z" fill={lit ? '#ec104b' : '#fde7ed'} />
							<path d="M0 14 L24 28 L24 56 L0 42 Z" fill={lit ? '#b80c3a' : '#f9b7c9'} />
							<path d="M24 28 L48 14 L48 42 L24 56 Z" fill={lit ? '#d40e43' : '#ffffff'} />
						</g>
					{/each}
				</svg>
				<span class="font-code text-[13px] leading-4 text-primary" aria-hidden="true">0{i + 1}</span>
				<code
					class="block font-code leading-[1.5] whitespace-pre text-surface {step.sends ? 'text-sm lg:text-[13px]' : 'text-base'}"
				>{step.command.join('\n')}</code>
				<p class="m-0 text-pretty text-base leading-[25px] text-muted">{step.description}</p>
			</li>
		{/each}
	</ol>
</section>
