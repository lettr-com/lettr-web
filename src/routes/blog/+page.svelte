<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRightIcon, ClockIcon } from 'phosphor-svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';

	interface PostMeta {
		slug: string;
		category: string;
		title: string;
		excerpt: string;
		author: string;
		date: string;
		readTime: string;
	}

	// As you add posts, list their metadata here (newest first).
	const posts: PostMeta[] = [
		{
			slug: 'managing-lettr-from-your-ai-assistant',
			category: 'Product',
			title: 'Managing Lettr from your AI assistant: the MCP integration',
			excerpt:
				'A bounce report comes in and you tab between dashboard, terminal, and editor copying IDs. MCP turns that into a sentence in the AI assistant you already have open. Here’s how the integration works.',
			author: 'Erik Vlčák',
			date: 'May 27, 2026',
			readTime: '5 min read'
		},
		{
			slug: 'the-hidden-cost-of-diy-transactional-email',
			category: 'Deliverability',
			title: 'The hidden cost of DIY transactional email',
			excerpt:
				'Rolling your own email stack feels cheap until you count the dev hours, the deliverability surprises, and the 2 a.m. pages. Here’s what it actually costs.',
			author: 'Erik Vlčák',
			date: 'May 13, 2026',
			readTime: '6 min read'
		},
		{
			slug: 'how-to-warm-up-a-sending-domain',
			category: 'Deliverability',
			title: 'How to warm up a new sending domain',
			excerpt:
				'You set up SPF, DKIM, and DMARC, flip the switch, send 50,000 emails on day one — and half vanish. Nothing is broken. Your domain is just new and untrusted. Here’s how to warm it up.',
			author: 'Erik Vlčák',
			date: 'April 22, 2026',
			readTime: '9 min read'
		},
		{
			slug: 'separate-transactional-and-marketing-email',
			category: 'Deliverability',
			title: 'Why you should separate transactional and marketing email',
			excerpt:
				'Your password reset and your weekly newsletter have almost nothing in common — yet most teams send both from the same domain, then wonder why 2FA codes hit spam after a campaign goes sideways.',
			author: 'Erik Vlčák',
			date: 'April 8, 2026',
			readTime: '7 min read'
		},
		{
			slug: 'smtp-vs-rest-api-how-to-choose',
			category: 'Engineering',
			title: 'SMTP vs. REST API: how to choose and when to switch',
			excerpt:
				'Most developers reach for the email transport they’ve used before — until they’re debugging a recycled SMTP connection in a serverless function at 2 AM. Here’s how to pick the right one and switch if you picked wrong.',
			author: 'Erik Vlčák',
			date: 'March 18, 2026',
			readTime: '8 min read'
		},
		{
			slug: 'spf-dkim-dmarc-explained-for-developers',
			category: 'Deliverability',
			title: 'SPF, DKIM, and DMARC explained for developers',
			excerpt:
				'Open a terminal and you can send mail claiming to be from support@stripe.com — SMTP won’t stop you. Three DNS-based standards close that gap. Here’s what each one does and how to tell if it’s working.',
			author: 'Erik Vlčák',
			date: 'March 4, 2026',
			readTime: '10 min read'
		},
		{
			slug: 'the-journey-of-an-email',
			category: 'Engineering',
			title: 'The journey of an email: from API call to inbox',
			excerpt:
				'You POST /emails, get a 200 OK, and assume it went through. Fifteen minutes later: “I never received my verification email.” Here’s everything that happens between your API call and the recipient’s inbox.',
			author: 'Erik Vlčák',
			date: 'February 18, 2026',
			readTime: '11 min read'
		},
		{
			slug: 'what-is-transactional-email',
			category: 'Fundamentals',
			title: 'How transactional email actually works',
			excerpt:
				'A user clicks “Reset Password,” waits, checks spam, gives up — and files a ticket about an email you didn’t know was broken. If you’re shipping your first signup or receipt flow, the transactional vs. marketing distinction matters.',
			author: 'Erik Vlčák',
			date: 'February 4, 2026',
			readTime: '6 min read'
		}
	];

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

<svelte:head>
	<title>Blog | Lettr</title>
	<meta
		name="description"
		content="Notes on transactional and marketing email, deliverability, and building email infrastructure that SaaS teams can trust."
	/>
	<link rel="canonical" href="https://lettr.com/blog" />
</svelte:head>

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
				href="/blog/{featured.slug}"
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
						href="/blog/{post.slug}"
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
