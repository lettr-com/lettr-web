<script lang="ts">
	import { onMount } from 'svelte';
	import {
		EnvelopeSimpleIcon,
		BookOpenIcon,
		ClockIcon,
		ArrowSquareOutIcon,
		ChatCircleTextIcon
	} from 'phosphor-svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { openIntercomNewMessage } from '$lib/intercom';

	let hero: HTMLElement | undefined = $state();
	let channelsSection: HTMLElement | undefined = $state();
	let contactSection: HTMLElement | undefined = $state();

	const channels = [
		{
			icon: EnvelopeSimpleIcon,
			title: 'Email',
			description: "Send us an email and we'll get back to you within a few hours.",
			action: 'hello@lettr.com',
			actionHref: 'mailto:hello@lettr.com',
			external: false
		},
		{
			icon: BookOpenIcon,
			title: 'Documentation',
			description: 'Guides, API reference, and examples to help you integrate quickly.',
			action: 'Visit docs',
			actionHref: 'https://docs.lettr.com',
			external: true
		},
		{
			icon: ClockIcon,
			title: 'Response Time',
			description: 'We aim to respond to all inquiries within 4 hours during business days.',
			action: 'Check status',
			actionHref: 'https://status.lettr.com',
			external: true
		}
	];

	const faqs = [
		{ q: 'How do I set up SPF and DKIM?', href: 'https://docs.lettr.com/learn/domains/sending-domains' },
		{
			q: 'How do I get started with Laravel?',
			href: 'https://docs.lettr.com/quickstart/laravel/introduction'
		},
		{ q: 'How does template sync work?', href: 'https://docs.lettr.com/quickstart/laravel/templates' },
		{
			q: 'Can I send via SMTP instead of API?',
			href: 'https://docs.lettr.com/quickstart/smtp/introduction'
		},
		{
			q: 'How do I set up a custom tracking domain?',
			href: 'https://docs.lettr.com/learn/domains/tracking-domains'
		},
		{ q: 'What are the API error codes?', href: 'https://docs.lettr.com/api-reference/introduction' }
	];

	function openChat() {
		void capturePosthogEvent('support_chat_opened', { source: 'support_page' });
		openIntercomNewMessage();
	}

	function trackChannelClick(title: string, href: string, external: boolean) {
		void capturePosthogEvent('support_channel_clicked', {
			channel: title,
			href,
			is_external: external
		});
	}

	function trackFaqLinkClick(question: string, href: string) {
		void capturePosthogEvent('support_faq_link_clicked', { question, href });
	}

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (hero) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: hero,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
				})
			);
		}

		for (const section of [channelsSection, contactSection]) {
			if (section) {
				cleanups.push(
					createScrollRevealCleanup({
						scope: section,
						targets: '[data-reveal]'
					})
				);
			}
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<svelte:head>
	<title>Support & Contact | Lettr</title>
	<meta
		name="description"
		content="Get help from the Lettr team. Technical support, billing questions, or just say hi."
	/>
	<link rel="canonical" href="https://lettr.com/support" />
	<meta property="og:title" content="Lettr Support & Contact" />
	<meta
		property="og:description"
		content="Get help from the Lettr team. Technical support, billing questions, or just say hi."
	/>
</svelte:head>

<section class="pt-32 pb-24">
	<!-- Hero -->
	<div bind:this={hero} class="text-center">
		<span
			data-animate
			class="mb-4 inline-block font-heading text-xs tracking-[0.15em] text-primary uppercase"
		>
			SUPPORT
		</span>
		<h1 data-animate>
			How can we<br />help you?
		</h1>
		<p data-animate class="mx-auto mt-5 max-w-xl text-body leading-[1.7] text-muted">
			We're a small team that cares about every developer using Lettr. Reach out — we typically respond
			within a few hours.
		</p>
	</div>

	<!-- Channel Cards -->
	<div bind:this={channelsSection} class="mt-16 grid gap-5 md:mt-20">
		{#each channels as channel}
			<a
				data-reveal
				href={channel.actionHref}
				target={channel.external ? '_blank' : undefined}
				rel={channel.external ? 'noopener noreferrer' : undefined}
				class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
				onclick={() => trackChannelClick(channel.title, channel.actionHref, channel.external)}
			>
				<div
					class="mb-4 flex h-11 w-11 items-center justify-center border border-border/50 bg-background transition-colors duration-200 group-hover:border-primary/30 group-hover:bg-primary/5"
				>
					<channel.icon
						size={20}
						class="text-muted transition-colors duration-200 group-hover:text-primary"
					/>
				</div>
				<h3 class="mb-1 text-base font-semibold text-surface">{channel.title}</h3>
				<p class="mb-4 flex-1 text-sm leading-relaxed text-muted">{channel.description}</p>
				<span
					class="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80"
				>
					{channel.action}
					{#if channel.external}
						<ArrowSquareOutIcon size={14} />
					{/if}
				</span>
			</a>
		{/each}
	</div>

	<!-- Chat + FAQ -->
	<div bind:this={contactSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
		<!-- Common questions -->
		<div data-reveal class="mb-16">
			<div class="border border-border/50 bg-white p-6">
				<h3 class="mb-4 text-sm font-semibold text-surface">Common questions</h3>
				<div class="space-y-3">
					{#each faqs as faq}
						<a
							href={faq.href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center justify-between px-3 py-2 text-sm text-muted transition-all duration-200 hover:bg-background hover:text-surface"
							onclick={() => trackFaqLinkClick(faq.q, faq.href)}
						>
							{faq.q}
							<ArrowSquareOutIcon size={12} class="shrink-0 text-muted" />
						</a>
					{/each}
				</div>
			</div>
		</div>

		<!-- Live chat CTA -->
		<div data-reveal class="border border-border/50 bg-white p-8 text-center">
			<div class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
				<ChatCircleTextIcon size={28} class="text-primary" />
			</div>
			<h2 class="mb-2">Talk to us directly</h2>
			<p class="mx-auto mb-6 max-w-md text-muted">
				Open a live chat with the team. We reply fast and can help with anything from setup to
				billing.
			</p>
			<button
				type="button"
				onclick={openChat}
				class="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
			>
				<ChatCircleTextIcon size={16} />
				Start a chat
			</button>
			<p class="mt-6 text-[13px] text-muted">
				Prefer email? Reach us at
				<a
					href="mailto:hello@lettr.com"
					class="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
				>
					hello@lettr.com
				</a>
			</p>
		</div>
	</div>
</section>
