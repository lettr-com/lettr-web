<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ArrowRightIcon from 'phosphor-svelte/lib/ArrowRightIcon';
	import ClockIcon from 'phosphor-svelte/lib/ClockIcon';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { posts } from '$lib/data/posts';

	const [featured, ...rest] = posts;

	let header: HTMLElement | undefined = $state();
	let list: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];
		if (header) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: header,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
				})
			);
		}
		if (list) {
			cleanups.push(createScrollRevealCleanup({ scope: list, targets: '[data-reveal]' }));
		}
		return () => cleanups.forEach((fn) => fn());
	});
</script>

<Seo
	title="Lettr Blog — Email Deliverability & Engineering"
	ogTitle="Lettr Blog"
	description="Notes on transactional and marketing email, deliverability, and building email infrastructure that SaaS teams can trust."
/>

<section class="pt-32 pb-24">
	<div bind:this={header}>
		<span data-animate class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase">
			BLOG
		</span>
		<h1 data-animate>Email, written down</h1>
		<p data-animate class="mt-6 max-w-xl text-body leading-[1.8] text-muted">
			Notes on deliverability, transactional and marketing email, and what we’ve learned building
			email infrastructure at scale.
		</p>
	</div>

	<div bind:this={list} class="mt-16">
		{#if featured}
			<a
				data-reveal
				href="/blog/{featured.slug}/"
				class="group block border border-border/50 bg-white p-8 transition-colors hover:border-primary/30 md:p-10"
			>
				<span class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
					{featured.category}
				</span>
				<h2 class="mt-3 transition-colors group-hover:text-primary">{featured.title}</h2>
				<p class="mt-4 max-w-2xl text-body leading-[1.7] text-muted">{featured.excerpt}</p>
				<div class="mt-6 flex items-center gap-3 text-xs text-muted">
					<span class="font-medium text-surface">{featured.author}</span>
					<span>·</span>
					<span>{featured.date}</span>
					<span class="flex items-center gap-1">
						<ClockIcon size={13} />
						{featured.readTime}
					</span>
					<ArrowRightIcon
						size={15}
						class="ml-auto text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary"
					/>
				</div>
			</a>
		{/if}

		{#if rest.length}
			<div class="mt-4 grid gap-4 sm:grid-cols-2">
				{#each rest as post}
					<a
						data-reveal
						href="/blog/{post.slug}/"
						class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
					>
						<span class="font-heading text-xs tracking-[0.15em] text-primary uppercase">
							{post.category}
						</span>
						<h3 class="mt-2 transition-colors group-hover:text-primary">{post.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
						<div class="mt-auto pt-5 flex items-center gap-2 text-xs text-muted">
							<span>{post.date}</span>
							<span class="flex items-center gap-1">
								<ClockIcon size={12} />
								{post.readTime}
							</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
