<script lang="ts">
	import { onMount } from 'svelte';
	import {
		EnvelopeSimpleIcon,
		BookOpenIcon,
		ClockIcon,
		ArrowSquareOutIcon,
		PaperPlaneRightIcon,
		CheckCircleIcon,
		WarningCircleIcon
	} from 'phosphor-svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';

	let hero: HTMLElement | undefined = $state();
	let channelsSection: HTMLElement | undefined = $state();
	let formSection: HTMLElement | undefined = $state();

	// Form state
	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let category = $state('general');
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');

	const categories = [
		{ value: 'general', label: 'General' },
		{ value: 'technical', label: 'Technical Issue' },
		{ value: 'billing', label: 'Billing' },
		{ value: 'partnership', label: 'Partnership' }
	];

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

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		error = '';
		submitting = true;

		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, subject, message, category })
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Something went wrong.';
				return;
			}

			submitted = true;
			name = '';
			email = '';
			subject = '';
			message = '';
			category = 'general';
		} catch {
			error = 'Something went wrong. Please try again or email us directly.';
		} finally {
			submitting = false;
		}
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

		for (const section of [channelsSection, formSection]) {
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

<section class="px-4 pt-32 pb-24">
	<!-- Hero -->
	<div bind:this={hero} class="mx-auto max-w-[550px] text-center">
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
	<div bind:this={channelsSection} class="mx-auto mt-16 grid max-w-[550px] gap-5 md:mt-20">
		{#each channels as channel}
			<a
				data-reveal
				href={channel.actionHref}
				target={channel.external ? '_blank' : undefined}
				rel={channel.external ? 'noopener noreferrer' : undefined}
				class="group flex flex-col border border-border/50 bg-white p-6 transition-colors hover:border-primary/30"
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

	<!-- Form + FAQ -->
	<div bind:this={formSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
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
						>
							{faq.q}
							<ArrowSquareOutIcon size={12} class="shrink-0 text-muted" />
						</a>
					{/each}
				</div>
			</div>
		</div>

		<!-- Form -->
		<div data-reveal>
			<h2 class="mb-2">Send us a message</h2>
			<p class="mb-8 text-muted">Fill out the form below and we'll get back to you shortly.</p>

			{#if submitted}
				<div class="flex flex-col items-center justify-center border border-primary/20 bg-primary/5 px-6 py-16 text-center">
					<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
						<CheckCircleIcon size={28} class="text-primary" />
					</div>
					<h3 class="text-xl font-semibold text-surface">Message sent!</h3>
					<p class="mt-2 max-w-sm text-sm leading-relaxed text-muted">
						We'll get back to you as soon as possible. You can also reach us directly at
						<a href="mailto:hello@lettr.com" class="text-primary underline underline-offset-4">
							hello@lettr.com
						</a>
					</p>
					<button
						onclick={() => (submitted = false)}
						class="mt-6 text-sm font-medium text-primary transition-colors hover:text-primary/80"
					>
						Send another message
					</button>
				</div>
			{:else}
				<form onsubmit={handleSubmit} class="space-y-5">
					{#if error}
						<div class="flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600">
							<WarningCircleIcon size={16} class="shrink-0" />
							{error}
						</div>
					{/if}

					<!-- Category -->
					<div>
						<label class="mb-2 block text-sm font-medium text-surface">What can we help with?</label>
						<div class="flex flex-wrap gap-2">
							{#each categories as opt}
								<button
									type="button"
									onclick={() => (category = opt.value)}
									class="border px-4 py-2 text-sm font-medium transition-all duration-200 {category ===
									opt.value
										? 'border-primary bg-primary/10 text-primary'
										: 'border-border/50 bg-white text-muted hover:border-primary/30 hover:text-surface'}"
								>
									{opt.label}
								</button>
							{/each}
						</div>
					</div>

					<!-- Name & Email -->
					<div class="grid gap-4 sm:grid-cols-2">
						<div>
							<label for="name" class="mb-2 block text-sm font-medium text-surface">Name</label>
							<input
								id="name"
								type="text"
								required
								bind:value={name}
								placeholder="Your name"
								class="w-full border border-border/50 bg-white px-4 py-3 text-sm text-surface placeholder-muted/60 transition-all duration-200 outline-none focus:border-primary/50"
							/>
						</div>
						<div>
							<label for="email" class="mb-2 block text-sm font-medium text-surface">Email</label>
							<input
								id="email"
								type="email"
								required
								bind:value={email}
								placeholder="you@company.com"
								class="w-full border border-border/50 bg-white px-4 py-3 text-sm text-surface placeholder-muted/60 transition-all duration-200 outline-none focus:border-primary/50"
							/>
						</div>
					</div>

					<!-- Subject -->
					<div>
						<label for="subject" class="mb-2 block text-sm font-medium text-surface">Subject</label>
						<input
							id="subject"
							type="text"
							required
							bind:value={subject}
							placeholder="How can we help?"
							class="w-full border border-border/50 bg-white px-4 py-3 text-sm text-surface placeholder-muted/60 transition-all duration-200 outline-none focus:border-primary/50"
						/>
					</div>

					<!-- Message -->
					<div>
						<label for="message" class="mb-2 block text-sm font-medium text-surface">Message</label>
						<textarea
							id="message"
							required
							rows="5"
							bind:value={message}
							placeholder="Tell us more about your question or issue..."
							class="w-full resize-none border border-border/50 bg-white px-4 py-3 text-sm leading-relaxed text-surface placeholder-muted/60 transition-all duration-200 outline-none focus:border-primary/50"
						></textarea>
					</div>

					<!-- Submit -->
					<button
						type="submit"
						disabled={submitting}
						class="flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{#if submitting}
							<div class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
							Sending...
						{:else}
							<PaperPlaneRightIcon size={16} />
							Send message
						{/if}
					</button>

					<p class="text-center text-[13px] text-muted">
						Or email us directly at
						<a
							href="mailto:hello@lettr.com"
							class="text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
						>
							hello@lettr.com
						</a>
					</p>
				</form>
			{/if}
		</div>
	</div>
</section>
