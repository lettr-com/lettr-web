<script lang="ts">
	import { onMount } from 'svelte';
	import {
		DotsSixVerticalIcon,
		SparkleIcon,
		StackIcon,
		ExportIcon,
		PaletteIcon,
		BracketsAngleIcon
	} from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import EditorPreview from '$lib/components/EditorPreview.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let editorSection: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();
	let gallerySection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [editorSection, featuresSection, gallerySection]) {
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

	const features = [
		{
			icon: DotsSixVerticalIcon,
			title: 'Drag & Drop Editor',
			description:
				'Build email templates visually. Drag components onto the canvas, rearrange blocks, and preview across devices — no HTML knowledge needed.'
		},
		{
			icon: SparkleIcon,
			title: 'AI-Powered Copywriting',
			description:
				'Generate subject lines, preview text, and body copy with AI. Tuned for the emails SaaS companies actually send.'
		},
		{
			icon: StackIcon,
			title: 'SaaS Template Library',
			description:
				'Start from professionally designed templates for onboarding, password resets, trial expiry, product updates, and feature announcements.'
		},
		{
			icon: ExportIcon,
			title: 'Synced Sections',
			description:
				'Update a header, footer, or any shared block once — changes apply everywhere. No more editing 40 templates to change your logo.'
		},
		{
			icon: PaletteIcon,
			title: 'Brand Kit',
			description:
				'Set your brand colors, fonts, and logo once. Every template automatically inherits your brand identity across all emails.'
		},
		{
			icon: BracketsAngleIcon,
			title: 'Dynamic Placeholders',
			description:
				'Add personalization variables directly in the editor. Your team can insert and preview {{ name }}, {{ company }}, and custom data without touching code.'
		}
	];

	type DetailBlock =
		| { kind: 'link'; label: string; url: string }
		| { kind: 'list'; label: string; items: { key: string; value: string }[] };

	interface Template {
		category: 'Teams' | 'Subscriptions' | 'Authentication' | 'Payments';
		cardLabel: string;
		title: string;
		greeting: string;
		body: string;
		cta: string;
		detail: DetailBlock;
		notice: { highlight: string; rest: string };
		disclaimer: string;
	}

	const templates: Template[] = [
		{
			category: 'Teams',
			cardLabel: 'Team invitation',
			title: "You've been invited to a team",
			greeting: 'Hi {{email}},',
			body: '{{inviter_name}} has invited you to join the {{team_name}} team on {{company_name}}.',
			cta: 'Accept invitation',
			detail: { kind: 'link', label: 'Confirmation link', url: '{{team_invite_url}}' },
			notice: {
				highlight: 'This invitation expires in {{expiry_time}}.',
				rest: " After that, you'll need to request a new invite."
			},
			disclaimer:
				"If you weren't expecting this invitation, you can safely ignore this email."
		},
		{
			category: 'Subscriptions',
			cardLabel: 'Trial expired',
			title: 'Your free trial has ended',
			greeting: 'Hi {{name}},',
			body: 'Your free trial of {{plan_name}} has ended. To keep using all features and avoid losing access, you can upgrade to a paid plan at any time.',
			cta: 'Upgrade now',
			detail: {
				kind: 'list',
				label: 'Trial details',
				items: [
					{ key: 'Plan', value: '{{plan_name}}' },
					{ key: 'Trial ended on', value: '{{trial_end_date}}' }
				]
			},
			notice: {
				highlight: 'No charges have been made.',
				rest: " You'll only be billed once you choose a paid plan."
			},
			disclaimer:
				'Not ready yet? You can continue browsing limited features or upgrade later from your account.'
		},
		{
			category: 'Subscriptions',
			cardLabel: 'Subscription renewal',
			title: 'Your subscription has been renewed',
			greeting: 'Hi {{name}},',
			body: "Thanks! We've successfully renewed your {{plan_name}} subscription. You'll continue to have uninterrupted access to your account.",
			cta: 'View billing details',
			detail: {
				kind: 'list',
				label: 'Renewal details',
				items: [
					{ key: 'Plan', value: '{{plan_name}}' },
					{ key: 'Amount', value: '{{amount}}' },
					{ key: 'Next billing', value: '{{next_billing_date}}' }
				]
			},
			notice: {
				highlight: 'Need to make changes?',
				rest: ' You can update your plan or payment method from billing settings.'
			},
			disclaimer:
				"If you don't recognize this renewal, please contact our support team immediately."
		},
		{
			category: 'Authentication',
			cardLabel: 'Email confirmation',
			title: 'Confirm your email address',
			greeting: 'Hi {{name}},',
			body: 'Thanks for signing up! Please confirm your email address to activate your account and get full access.',
			cta: 'Confirm email',
			detail: { kind: 'link', label: 'Confirmation link', url: '{{email_confirmation_url}}' },
			notice: {
				highlight: 'This link expires in {{expiry_time}}.',
				rest: " After that, you'll need to request a new confirmation."
			},
			disclaimer:
				"If you didn't create an account with {{company_name}}, you can safely ignore this email."
		},
		{
			category: 'Authentication',
			cardLabel: 'Password reset',
			title: 'Reset your password',
			greeting: 'Hi {{name}},',
			body: 'We received a request to reset the password for your account. Click the button below to create a new password.',
			cta: 'Reset password',
			detail: { kind: 'link', label: 'Reset link', url: '{{reset_password_url}}' },
			notice: {
				highlight: 'This link expires in {{expiry_time}}.',
				rest: " After that, you'll need to request a new password reset."
			},
			disclaimer:
				"If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged."
		},
		{
			category: 'Payments',
			cardLabel: 'Invoice ready',
			title: 'Your invoice is ready',
			greeting: 'Hi {{name}},',
			body: 'Thanks for your business. Your invoice for the recent billing period is now available. You can view or download it using the link below.',
			cta: 'View invoice',
			detail: {
				kind: 'list',
				label: 'Invoice',
				items: [
					{ key: 'Invoice #', value: '{{invoice_number}}' },
					{ key: 'Due date', value: '{{due_date}}' },
					{ key: 'Amount due', value: '{{amount_due}}' }
				]
			},
			notice: {
				highlight: 'Status: {{invoice_status}}.',
				rest: ' If you have already paid this invoice, you can ignore this email.'
			},
			disclaimer: 'Questions about your invoice? Reply to this email and our team will help.'
		},
		{
			category: 'Payments',
			cardLabel: 'Card expired',
			title: 'Your card has expired',
			greeting: 'Hi {{name}},',
			body: 'We were unable to process your recent payment because the card on file has expired. To avoid any interruption to your service, please update your payment details.',
			cta: 'Update payment method',
			detail: { kind: 'link', label: 'Billing portal', url: '{{update_payment_url}}' },
			notice: {
				highlight: 'Your subscription may be paused if payment is not updated.',
				rest: ' Please update your card as soon as possible to continue uninterrupted access.'
			},
			disclaimer:
				"If you've already updated your payment details, you can safely ignore this email."
		},
		{
			category: 'Payments',
			cardLabel: 'Payment failed',
			title: "We couldn't process your payment",
			greeting: 'Hi {{name}},',
			body: 'We attempted to process your recent payment, but it was declined by your bank or card provider. This can happen for a variety of reasons, such as insufficient funds or temporary authorization issues.',
			cta: 'Update payment method',
			detail: { kind: 'link', label: 'Confirmation link', url: '{{update_payment_url}}' },
			notice: {
				highlight: "Your access may be interrupted if payment isn't resolved.",
				rest: ' Please update your payment details or contact your bank to avoid service disruption.'
			},
			disclaimer:
				"If you've already updated your payment details, you can safely ignore this email."
		}
	];
</script>

<FeaturePageLayout
	title="Visual Editor"
	metaDescription="Best-in-class drag-and-drop email editor powered by Topol. Your team designs, edits, and manages templates — no dev tickets required."
	label="VISUAL EDITOR"
	description="The same drag-and-drop editor trusted by 40,000+ companies. Your team manages templates, content, and campaigns — without filing a single dev ticket."
>
	{#snippet heading()}
		Your team edits.<br />No dev tickets required.
	{/snippet}

	{#snippet children()}
		<!-- Editor Mockup -->
		<div bind:this={editorSection} class="mx-auto">
			<h2 data-reveal class="mb-8 text-center">Drag-and-drop editor powered by Topol</h2>
			<div data-reveal>
				<EditorPreview />
			</div>
		</div>

		<!-- Feature Cards -->
		<div bind:this={featuresSection} class="mx-auto mt-20 md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Everything your team needs</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				A complete template toolkit your whole team can use — designers, marketers, and product people. Powered by the Topol editor trusted by 40,000+ companies.
			</p>
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each features as feature}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<feature.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{feature.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{feature.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Template Gallery -->
		<div bind:this={gallerySection} class="mx-auto mt-20 md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Start from a template</h2>
			<p data-reveal class="mx-auto mb-10 max-w-lg text-center text-body text-muted">
				Professionally designed SaaS emails — ready to customize for onboarding, billing, authentication, and team workflows.
			</p>
			<div class="grid gap-6 sm:grid-cols-2">
				{#each templates as template}
					<div data-reveal class="flex flex-col">
						<article class="flex flex-1 flex-col border border-border/50 bg-white transition-colors hover:border-primary/40">
							<div class="flex-1 p-5 text-[11px] leading-relaxed text-muted">
								<!-- Category pill + divider -->
								<div class="mb-4 flex items-center gap-2">
									<span class="bg-background border border-border/50 px-2 py-0.5 text-[9px] font-medium tracking-wide text-surface uppercase">{template.category}</span>
									<div class="h-px flex-1 bg-border/50"></div>
								</div>

								<!-- Heading -->
								<h3 class="mb-2 text-[13px] font-bold text-surface">{template.title}</h3>

								<!-- Greeting -->
								<p class="mb-2">{template.greeting}</p>

								<!-- Body -->
								<p class="mb-4">{template.body}</p>

								<!-- CTA -->
								<div class="mb-4">
									<span class="inline-block bg-surface px-3 py-1.5 text-[10px] font-semibold text-white">{template.cta}</span>
								</div>

								<!-- Divider -->
								<div class="my-4 flex items-center gap-2">
									<div class="h-px flex-1 bg-border/40"></div>
									<span class="text-[8px] font-semibold tracking-[0.15em] text-muted uppercase">Or click the link below</span>
									<div class="h-px flex-1 bg-border/40"></div>
								</div>

								<!-- Detail block -->
								<div class="mb-3 border border-border/40 bg-background/60 p-2.5">
									<p class="mb-1 text-[8px] font-semibold tracking-[0.12em] text-muted uppercase">{template.detail.label}</p>
									{#if template.detail.kind === 'link'}
										<p class="font-code text-[9px] break-all text-surface">{template.detail.url}</p>
									{:else}
										<div class="space-y-0.5">
											{#each template.detail.items as item}
												<p class="text-[9px] text-surface">
													<span class="text-muted">{item.key}:</span>
													<span class="font-code">{item.value}</span>
												</p>
											{/each}
										</div>
									{/if}
								</div>

								<!-- Notice -->
								<div class="mb-3 border-l-2 border-border/60 py-0.5 pl-2.5">
									<p class="text-[9px]">
										<span class="font-semibold text-surface">{template.notice.highlight}</span>{template.notice.rest}
									</p>
								</div>

								<!-- Disclaimer -->
								<p class="mb-3 text-[9px] text-muted/80">{template.disclaimer}</p>

								<!-- Contact + company -->
								<p class="mb-2 text-[9px]">Questions? Contact us at {'{{support_email}}'}</p>
								<p class="text-[9px] text-muted/80">{'{{company_name}}'}</p>
								<p class="mb-3 text-[9px] text-muted/80">{'{{company_address}}'}</p>

								<!-- Footer links -->
								<div class="flex flex-wrap gap-x-3 gap-y-1 border-t border-border/40 pt-3 text-[9px] font-medium text-surface">
									<span>Help Center</span>
									<span>Privacy Policy</span>
									<span>Terms of Service</span>
								</div>
							</div>
						</article>
						<p class="mt-3 text-sm font-medium text-surface">{template.cardLabel}</p>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
