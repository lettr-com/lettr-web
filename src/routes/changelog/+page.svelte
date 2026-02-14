<script lang="ts">
	import { onMount } from 'svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';

	interface ChangelogEntry {
		date: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		authors: Array<{ name: string; initials: string; avatar?: string }>;
		tag?: string;
	}

	const changelog: ChangelogEntry[] = [
		{
			date: 'Feb 14, 2026',
			title: 'Introducing Lettr — Email API for Artisans',
			slug: 'introducing-lettr',
			summary:
				'After 10 years and 500M+ emails per month, we built the email service we always wished existed.',
			tag: 'Launch',
			authors: [{ name: 'Jan from Lettr', initials: 'J', avatar: '/images/authors/jan.jpg' }],
			content: `Hey there 👋

We're a European company that's been running an email marketing and automation platform for over a decade. Over the years, our infrastructure has handled more than **500 million emails per month** across the globe — and we've learned a thing or two along the way.

We built [Topol.io](https://topol.io), a drag-and-drop email template editor used by thousands of companies to design beautiful emails without touching HTML tables. We also created [DMARCeye.com](https://dmarceye.com), helping businesses protect their sender reputation with DMARC monitoring, SPF, and DKIM management.

And through all of that, we kept running into the same frustration.

## Why we built Lettr

If you've ever started a new Laravel project and reached the part where you need to set up transactional emails, you know the feeling. You wire up a mail driver, pick a third-party service, wrestle with DNS records, design templates in some clunky external tool, and then… you just hope for the best. There's no easy way to see what your app is actually sending. No way to know if your welcome emails are landing in inboxes or spam folders. No alerts when something breaks.

We wanted something different. Something that felt like it belonged in the Laravel ecosystem — elegant, opinionated, and just *works*.

So we built Lettr.

## What makes Lettr different

**It's Laravel-first.** Not a generic email API with a PHP wrapper bolted on. We built a dedicated Laravel package that feels native. \`composer require lettr/laravel\`, add your API key, and you're sending emails in under a minute. No boilerplate, no config files longer than your actual application code.

**Templates, your way.** Create templates in our visual drag-and-drop editor (yes, we brought over the best parts of Topol.io), or write them in Blade like you always have. Either way, Lettr keeps them in sync — push from Laravel to Lettr, or pull from Lettr to Laravel. Edit where you're comfortable.

**You can see what your app sends.** This is the part we're most excited about. Lettr gives you a clear dashboard of every transactional email type your application sends — welcome emails, password resets, invoices, notifications — with delivery rates, open rates, and trend data. You'll actually know if something's off.

**Alerts that matter.** Set up deliverability alerts so you get notified the moment open rates drop, bounce rates spike, or something looks wrong. No more discovering three days later that your password reset emails have been going to spam.

**Deliverability we can back up.** With our background in DMARC and email security, we've baked deliverability best practices into every layer. Dedicated IPs with automatic warmup, DKIM/SPF setup in one click, blocklist monitoring, custom SSL tracking domains — all the stuff that usually requires a dedicated email ops person.

## Start for free

We're launching today in public beta. The Hobby tier is completely free — 3,000 emails per month, no credit card required. We'd love for you to try it, break it, and tell us what you think.

We're passionate developers who genuinely enjoy what we do. We care about craft, we want our tools to be as polished as the code you write, and we think sending emails shouldn't be the worst part of building an application.

Welcome to Lettr. Let's make email not suck.

— Jan & The Lettr Team`
		}
	];

	function formatContent(content: string): string {
		return content
			.replace(/\*\*(.+?)\*\*/g, '<strong class="text-surface font-semibold">$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(
				/`([^`]+)`/g,
				'<code class="border border-border/50 bg-background px-1.5 py-0.5 font-code text-[13px] text-primary">$1</code>'
			)
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">$1</a>'
			)
			.replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-4 text-h2">$1</h2>')
			.replace(/\n\n/g, '</p><p class="mt-4 leading-[1.8] text-muted">')
			.replace(/\n/g, '<br />');
	}

	let header: HTMLElement | undefined = $state();
	let entriesSection: HTMLElement | undefined = $state();

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

		if (entriesSection) {
			cleanups.push(
				createScrollRevealCleanup({
					scope: entriesSection,
					targets: '[data-reveal]'
				})
			);
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<svelte:head>
	<title>Changelog | Lettr</title>
	<meta name="description" content="All the latest updates, improvements, and fixes to Lettr." />
	<link rel="canonical" href="https://lettr.com/changelog" />
	<meta property="og:title" content="Lettr Changelog" />
	<meta property="og:description" content="All the latest updates, improvements, and fixes to Lettr." />
</svelte:head>

<section class="px-4 pt-32 pb-24">
	<div class="mx-auto max-w-[550px]">
		<!-- Header -->
		<div bind:this={header} class="mb-16">
			<h1 data-animate class="font-heading text-4xl text-surface">Changelog</h1>
			<p data-animate class="mt-4 max-w-xl text-body leading-[1.7] text-muted">
				New updates and improvements to Lettr. Follow along as we build the email service we always wished existed.
			</p>
		</div>

		<!-- Entries -->
		<div bind:this={entriesSection} class="space-y-10">
			{#each changelog as entry}
				<article data-reveal class="relative grid gap-6 md:grid-cols-[200px_1fr]">
					<!-- Left: date column + timeline -->
					<div class="relative">
						<div class="absolute top-0 -bottom-8 left-[5px] hidden w-px bg-border/50 md:block"></div>
						<div
							class="absolute top-[6px] left-0 hidden h-[11px] w-[11px] rounded-full border-2 border-primary bg-background md:block"
						></div>

						<div class="md:pl-7">
							<time class="font-code text-[13px] text-muted">{entry.date}</time>
							{#if entry.tag}
								<div class="mt-2">
									<span
										class="bg-primary/10 px-3 py-0.5 font-heading text-[11px] tracking-[0.05em] text-primary"
									>
										{entry.tag}
									</span>
								</div>
							{/if}
							<!-- Authors on desktop -->
							<div class="mt-4 hidden md:block">
								{#each entry.authors as author}
									<div class="flex items-center gap-2">
										{#if author.avatar}
											<img src={author.avatar} alt={author.name} class="h-7 w-7 rounded-full object-cover" />
										{:else}
											<div
												class="flex h-7 w-7 items-center justify-center rounded-full bg-background font-code text-[10px] font-semibold text-muted"
											>
												{author.initials}
											</div>
										{/if}
										<span class="text-[13px] text-muted">{author.name}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Right: content card -->
					<div class="border border-border/50 bg-white p-6 transition-colors hover:border-primary/20 md:p-8">
						<h2 class="mb-3 text-2xl leading-tight font-semibold text-surface">{entry.title}</h2>
						<p class="mb-6 text-body leading-[1.7] text-muted">{entry.summary}</p>

						<div class="changelog-content">
							{@html `<p class="mt-4 leading-[1.8] text-muted">${formatContent(entry.content)}</p>`}
						</div>

						<!-- Authors on mobile -->
						<div class="mt-8 flex items-center gap-3 border-t border-border/30 pt-6 md:hidden">
							{#each entry.authors as author}
								<div class="flex items-center gap-2">
									{#if author.avatar}
										<img src={author.avatar} alt={author.name} class="h-8 w-8 rounded-full object-cover" />
									{:else}
										<div
											class="flex h-8 w-8 items-center justify-center rounded-full bg-background font-code text-[11px] font-semibold text-muted"
										>
											{author.initials}
										</div>
									{/if}
									<span class="text-sm font-medium text-surface">{author.name}</span>
								</div>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
