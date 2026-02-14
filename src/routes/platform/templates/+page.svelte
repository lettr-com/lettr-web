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

	const sidebarComponents = [
		'Header',
		'Hero Image',
		'Text Block',
		'Button',
		'Divider',
		'Two Columns',
		'Product Card',
		'Footer',
		'Social Links',
		'Spacer'
	];

	const canvasBlocks = [
		{ type: 'header', label: 'Company Logo', height: 'h-12' },
		{ type: 'hero', label: 'Hero Image', height: 'h-32' },
		{ type: 'text', label: 'Welcome, {{ name }}', height: 'h-16' },
		{ type: 'button', label: 'Verify Email', height: 'h-10' },
		{ type: 'footer', label: 'Footer & Unsubscribe', height: 'h-14' }
	];

	const features = [
		{
			icon: DotsSixVerticalIcon,
			title: 'Drag & Drop Editor',
			description:
				'Build email templates visually. Drag components onto the canvas, rearrange blocks, and preview across devices in real time.'
		},
		{
			icon: SparkleIcon,
			title: 'AI-Powered Copywriting',
			description:
				'Generate subject lines, preview text, and body copy with AI. Trained on high-performing transactional emails to match your tone.'
		},
		{
			icon: StackIcon,
			title: '200+ Templates',
			description:
				'Start from a library of professionally designed templates. Welcome emails, password resets, invoices, shipping notifications and more.'
		},
		{
			icon: ExportIcon,
			title: 'Export to Blade',
			description:
				'One-click export to Laravel Blade templates. Your designs become production-ready code that syncs back to your repository.'
		},
		{
			icon: PaletteIcon,
			title: 'Brand Kit',
			description:
				'Set your brand colors, fonts, and logo once. Every template automatically inherits your brand identity across all emails.'
		},
		{
			icon: BracketsAngleIcon,
			title: 'Smart Variables',
			description:
				'Use Blade syntax directly in the editor. Variables like {{ $user->name }} are highlighted and validated before sending.'
		}
	];

	const templatePreviews = [
		{ name: 'Welcome Email', category: 'Onboarding' },
		{ name: 'Password Reset', category: 'Authentication' },
		{ name: 'Invoice', category: 'Billing' },
		{ name: 'Shipping Update', category: 'E-commerce' },
		{ name: 'Team Invite', category: 'Collaboration' },
		{ name: 'Verify Email', category: 'Authentication' }
	];
</script>

<FeaturePageLayout
	title="Email Templates"
	metaDescription="Design beautiful transactional email templates with a drag-and-drop editor. AI copywriting, 200+ templates, and one-click Blade export."
	label="TEMPLATES"
	description="Design, edit, and manage your transactional email templates visually. Export to Blade with one click."
>
	{#snippet heading()}
		Beautiful emails.<br />Zero HTML tables.
	{/snippet}

	{#snippet children()}
		<!-- Editor Mockup -->
		<div bind:this={editorSection} class="mx-auto max-w-3xl">
			<h2 data-reveal class="mb-8 text-center">Visual editor built for developers</h2>
			<div data-reveal class="border border-border/50 bg-white">
				<!-- Editor toolbar -->
				<div class="flex items-center justify-between border-b border-border/50 px-4 py-2.5">
					<div class="flex items-center gap-3">
						<div class="h-2.5 w-2.5 bg-primary/60"></div>
						<span class="font-code text-xs text-muted">welcome-email.blade.php</span>
					</div>
					<div class="flex items-center gap-2">
						<span class="border border-border/50 px-2 py-0.5 text-xs text-muted">Desktop</span>
						<span class="border border-border/50 px-2 py-0.5 text-xs text-muted">Mobile</span>
						<span class="bg-primary px-2 py-0.5 text-xs text-white">Preview</span>
					</div>
				</div>
				<div class="flex">
					<!-- Sidebar -->
					<div class="w-48 shrink-0 border-r border-border/50 p-4">
						<p class="mb-3 font-heading text-xs tracking-wide text-muted uppercase">Components</p>
						<div class="space-y-1.5">
							{#each sidebarComponents as component}
								<div class="border border-border/30 bg-background px-3 py-2 text-xs text-surface transition-colors hover:border-primary/30">
									{component}
								</div>
							{/each}
						</div>
					</div>
					<!-- Canvas -->
					<div class="flex-1 bg-background/50 p-6">
						<div class="mx-auto max-w-sm space-y-2">
							{#each canvasBlocks as block}
								<div class="border border-dashed border-border/60 bg-white p-3 transition-colors hover:border-primary/40">
									<div class="flex items-center justify-between">
										<span class="text-xs text-muted">{block.label}</span>
										{#if block.type === 'button'}
											<span class="bg-primary px-4 py-1.5 text-xs text-white">Verify Email</span>
										{/if}
									</div>
									{#if block.type === 'hero'}
										<div class="mt-2 flex h-24 items-center justify-center bg-background">
											<span class="text-xs text-muted">1200 x 400</span>
										</div>
									{/if}
									{#if block.type === 'text'}
										<div class="mt-2 space-y-1">
											<div class="h-2 w-3/4 bg-border/30"></div>
											<div class="h-2 w-full bg-border/30"></div>
											<div class="h-2 w-1/2 bg-border/30"></div>
										</div>
									{/if}
									{#if block.type === 'header'}
										<div class="mt-2 flex items-center justify-center">
											<div class="h-6 w-20 bg-border/30"></div>
										</div>
									{/if}
									{#if block.type === 'footer'}
										<div class="mt-2 flex items-center justify-center gap-2">
											<div class="h-2 w-16 bg-border/30"></div>
											<span class="text-[10px] text-muted">|</span>
											<div class="h-2 w-16 bg-border/30"></div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Feature Cards -->
		<div bind:this={featuresSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Everything you need to build emails</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				A complete template toolkit designed for transactional emails, not marketing campaigns.
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

		<!-- Template Gallery Preview -->
		<div bind:this={gallerySection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Start from a template</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Pick a professionally designed starting point. Customize it to match your brand in minutes.
			</p>
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each templatePreviews as template}
					<div data-reveal class="group border border-border/50 bg-white transition-colors hover:border-primary/30">
						<!-- Template preview placeholder -->
						<div class="border-b border-border/50 bg-background p-4">
							<div class="mx-auto max-w-[120px] space-y-2">
								<div class="h-3 w-full bg-border/40"></div>
								<div class="h-12 w-full bg-border/30"></div>
								<div class="h-2 w-3/4 bg-border/40"></div>
								<div class="h-2 w-full bg-border/40"></div>
								<div class="h-2 w-1/2 bg-border/40"></div>
								<div class="mx-auto mt-2 h-4 w-16 bg-primary/20"></div>
								<div class="h-2 w-full bg-border/30"></div>
							</div>
						</div>
						<div class="p-4">
							<p class="text-sm font-semibold text-surface">{template.name}</p>
							<p class="mt-0.5 text-xs text-muted">{template.category}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
