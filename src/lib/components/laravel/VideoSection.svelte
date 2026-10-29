<script lang="ts">
	import { onMount } from 'svelte';
	import PlayIcon from 'phosphor-svelte/lib/PlayIcon';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { createScrollRevealCleanup } from '$lib/utils/reveal';

	const videoId = 'rOOBEdd-1jE';
	const title = 'Custom Laravel Email Templates with DTOs/Enums: Lettr Example';
	const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

	let section: HTMLElement | undefined = $state();
	let playing = $state(false);

	// YouTube loads only on request, from the no-cookie domain.
	function play() {
		playing = true;
		void capturePosthogEvent('video_played', { placement: 'laravel_video', video_id: videoId });
	}

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} aria-labelledby="video-heading" class="bleed bg-[#23020b] text-white">
	<div class="mx-auto flex w-full max-w-[1148px] flex-col gap-8 px-6 py-16 md:gap-10 md:pt-[120px] md:pb-32">
		<div data-reveal class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
			<h2
				id="video-heading"
				class="m-0 font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-white md:text-[2.625rem] md:leading-[50px]"
			>
				Eleven minutes, one real app.
			</h2>
			<p class="m-0 text-pretty shrink-0 font-code text-[13px] leading-[1.7] text-white/55">
				Laravel Daily<br />Templates, DTOs, enums · 11:00
			</p>
		</div>

		<div data-reveal class="relative aspect-video w-full overflow-hidden bg-[#0c111d]">
			{#if playing}
				<iframe
					class="absolute inset-0 h-full w-full"
					src="https://www.youtube-nocookie.com/embed/{videoId}?autoplay=1&rel=0"
					{title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					referrerpolicy="strict-origin-when-cross-origin"
					allowfullscreen
				></iframe>
			{:else}
				<button
					type="button"
					onclick={play}
					class="group absolute inset-0 flex h-full w-full cursor-pointer items-end p-5 text-left md:p-12"
					aria-label="Play video: {title}, Laravel Daily, 11 minutes"
				>
					<span
						class="absolute inset-0 bg-[url(/laravel/tile-field.webp)] bg-cover bg-center opacity-70 transition-opacity duration-300 group-hover:opacity-90 motion-reduce:transition-none"
						aria-hidden="true"
					></span>
					<span class="relative flex items-center gap-4 md:gap-7">
						<span
							class="flex h-14 w-14 shrink-0 items-center justify-center bg-primary transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none md:h-24 md:w-24"
							aria-hidden="true"
						>
							<PlayIcon weight="fill" class="h-5 w-5 md:h-[30px] md:w-[30px]" />
						</span>
						<span class="max-w-[560px] font-heading text-lg leading-[1.25] text-white md:text-[1.75rem]">
							Custom Laravel email templates with DTOs and enums
						</span>
					</span>
				</button>
			{/if}
		</div>

		<p class="m-0 text-pretty text-sm leading-[1.5] text-white/60">
			Prefer YouTube? <a href={watchUrl} target="_blank" rel="noopener noreferrer" class="text-white underline underline-offset-4 hover:text-primary-outline">Watch the walkthrough there</a>.
		</p>
	</div>
</section>
