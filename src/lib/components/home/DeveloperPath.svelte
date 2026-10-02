<script lang="ts">
	import { onMount } from 'svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import LargeFeatureCard from './LargeFeatureCard.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} id="features" class="-mx-6 border-b border-white/10 bg-surface px-6 py-20 sm:py-24">
	<div data-reveal class="mb-12 max-w-[850px]">
		<h2 class="home-section-heading text-white">
			Integrate in minutes.<span class="block text-primary">Forget about it forever.</span>
		</h2>
	</div>

	<div class="grid gap-5 lg:grid-cols-2">
		<LargeFeatureCard title="Send with your stack." description="REST API or SMTP. The choice is yours." href="/email-api/" surface="dark">
			<div class="flex w-full max-w-[470px] items-center justify-center gap-3 sm:gap-6">
				<div class="flex w-[42%] flex-col gap-3">
					<div class="border border-white/15 bg-surface px-4 py-4 font-code text-sm text-white sm:px-6 sm:text-base">REST API</div>
					<div class="border border-white/15 bg-surface px-4 py-4 font-code text-sm text-white sm:px-6 sm:text-base">SMTP</div>
				</div>
				<ArrowRightIcon size={28} class="shrink-0 text-primary" />
				<div class="flex h-24 w-24 shrink-0 items-center justify-center border-2 border-primary bg-surface font-heading text-xl text-white sm:h-40 sm:w-40 sm:text-3xl">Lettr</div>
			</div>
		</LargeFeatureCard>

		<LargeFeatureCard title="Your domain, authenticated." description="Guided SPF, DKIM, and DMARC setup." href="/platform/deliverability/" surface="dark">
			<div class="w-full max-w-[430px] border border-white/15 bg-surface p-5 sm:p-7">
				<div class="mb-5 border-b border-white/15 pb-4 font-heading text-xl text-white">yourapp.com</div>
				<div class="space-y-3">
					{#each ['SPF', 'DKIM', 'DMARC'] as record}
						<div class="flex items-center justify-between border border-white/20 px-5 py-3 font-code text-sm text-white sm:text-base">
							<span>{record}</span><CheckIcon size={20} class="text-primary" />
						</div>
					{/each}
				</div>
			</div>
		</LargeFeatureCard>

		<LargeFeatureCard title="React to every event." description="Signed webhooks keep your app in the loop." href="/platform/analytics/" surface="dark">
			<div class="w-full max-w-[445px] border border-white/15 bg-surface p-5 sm:p-7">
				<div class="flex items-center gap-4 border-b border-white/15 pb-5">
					<span class="h-3 w-3 bg-primary"></span><span class="text-base text-white">Delivered</span>
				</div>
				<div class="flex items-center gap-4 border-b border-white/15 py-5">
					<span class="h-3 w-3 bg-primary"></span><span class="text-base text-white">Opened</span>
				</div>
				<div class="flex items-center justify-between pt-5 text-sm text-white/70 sm:text-base">
					<span>Your app</span><ArrowRightIcon size={24} class="text-primary" />
				</div>
			</div>
		</LargeFeatureCard>

		<LargeFeatureCard title="Find any email." description="Search logs to see exactly what happened." href="/platform/analytics/" surface="dark">
			<div class="w-full max-w-[445px] border border-white/15 bg-surface p-5 sm:p-7">
				<div class="mb-5 flex items-center gap-4 border border-white/25 px-5 py-4 text-white/60">
					<MagnifyingGlassIcon size={23} class="shrink-0 text-primary" /><span class="font-code text-sm sm:text-base">welcome@example.com</span>
				</div>
				<div class="flex items-center justify-between gap-4 border-l-4 border-primary bg-muted px-5 py-5">
					<span class="text-sm text-white sm:text-base">Welcome email</span><span class="text-sm text-white/70">Delivered</span>
				</div>
			</div>
		</LargeFeatureCard>
	</div>
</section>
