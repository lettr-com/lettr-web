<script lang="ts">
	import { onMount } from 'svelte';
	import {
		LightningIcon,
		EnvelopeSimpleIcon,
		ShieldCheckIcon,
		ArrowsLeftRightIcon
	} from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let diagramSection: HTMLElement | undefined = $state();
	let benefitsSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [diagramSection, benefitsSection]) {
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

	const transactionalEmails = [
		{ name: 'Password Reset', trigger: 'API call' },
		{ name: 'Email Verification', trigger: 'API call' },
		{ name: 'Usage Alert', trigger: 'Webhook' },
		{ name: 'Billing Receipt', trigger: 'API call' }
	];

	const marketingEmails = [
		{ name: 'Product Update', trigger: 'Campaign' },
		{ name: 'Feature Announcement', trigger: 'Campaign' },
		{ name: 'Onboarding Sequence', trigger: 'Automation' },
		{ name: 'Changelog Digest', trigger: 'Campaign' }
	];

	const benefits = [
		{
			icon: ArrowsLeftRightIcon,
			title: 'One vendor, not two',
			description:
				'No more juggling Postmark for transactional and Mailchimp for marketing. One integration, one billing relationship, one set of docs.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Unified sending reputation',
			description:
				'Transactional and marketing emails share the same domain and IP reputation. Better deliverability for everything, with no reputation fragmentation.'
		},
		{
			icon: LightningIcon,
			title: 'API-driven transactional',
			description:
				'Send password resets, verification emails, and usage alerts through a clean REST API or SMTP relay. Automatic retries, queuing, and delivery optimization built in.'
		},
		{
			icon: EnvelopeSimpleIcon,
			title: 'Visual campaigns',
			description:
				'Your product and marketing team builds and sends updates, announcements, and onboarding sequences using the drag-and-drop editor — no code required.'
		}
	];
</script>

<FeaturePageLayout
	title="Transactional + Marketing"
	metaDescription="Send transactional and marketing emails from one platform, one domain, one reputation. No more managing two vendors for your SaaS emails."
	label="UNIFIED SENDING"
	description="Send password resets and product newsletters from the same place, on the same domain, with the same reputation. No more managing two email vendors."
>
	{#snippet heading()}
		One platform. One domain.<br />One reputation.
	{/snippet}

	{#snippet children()}
		<!-- Unified Sending Diagram -->
		<div bind:this={diagramSection} class="mx-auto max-w-3xl">
			<h2 data-reveal class="mb-8 text-center">Everything through one domain</h2>
			<div data-reveal class="border border-border/50 bg-white p-6 md:p-8">
				<div class="grid items-start gap-6 md:grid-cols-[1fr,auto,1fr]">
					<!-- Transactional Side -->
					<div>
						<div class="mb-4 flex items-center gap-2">
							<div class="flex h-5 w-5 items-center justify-center bg-surface">
								<LightningIcon size={12} class="text-white" />
							</div>
							<span class="font-heading text-sm font-semibold text-surface">Transactional</span>
						</div>
						<div class="border border-border/50 bg-background p-4">
							<p class="mb-3 text-xs text-muted">Triggered by your app via API</p>
							<div class="space-y-2">
								{#each transactionalEmails as email}
									<div class="flex items-center justify-between border border-border/50 bg-white px-3 py-2">
										<span class="text-xs font-medium text-surface">{email.name}</span>
										<span class="font-code text-[10px] text-muted">{email.trigger}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Domain Center -->
					<div class="flex items-center justify-center self-center">
						<div class="flex flex-col items-center gap-2 py-4 md:py-0">
							<div class="flex h-10 w-10 items-center justify-center bg-primary">
								<span class="text-sm font-bold text-white">L</span>
							</div>
							<span class="font-code text-[11px] text-primary">your-app.com</span>
						</div>
					</div>

					<!-- Marketing Side -->
					<div>
						<div class="mb-4 flex items-center gap-2">
							<div class="flex h-5 w-5 items-center justify-center bg-surface">
								<EnvelopeSimpleIcon size={12} class="text-white" />
							</div>
							<span class="font-heading text-sm font-semibold text-surface">Marketing</span>
						</div>
						<div class="border border-border/50 bg-background p-4">
							<p class="mb-3 text-xs text-muted">Sent by your team from the dashboard</p>
							<div class="space-y-2">
								{#each marketingEmails as email}
									<div class="flex items-center justify-between border border-border/50 bg-white px-3 py-2">
										<span class="text-xs font-medium text-surface">{email.name}</span>
										<span class="font-code text-[10px] text-muted">{email.trigger}</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Benefits -->
		<div bind:this={benefitsSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Why unified sending matters</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Most SaaS teams manage two email vendors — one for transactional, one for marketing. That means two integrations, two domains, two reputations to manage. Lettr eliminates the split.
			</p>
			<div class="grid gap-5 sm:grid-cols-2">
				{#each benefits as benefit}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-4 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<benefit.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{benefit.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{benefit.description}</p>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
