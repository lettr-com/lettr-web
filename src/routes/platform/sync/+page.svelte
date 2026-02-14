<script lang="ts">
	import { onMount } from 'svelte';
	import {
		CodeIcon,
		CloudArrowUpIcon,
		CloudArrowDownIcon,
		GitBranchIcon,
		ArrowsLeftRightIcon
	} from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let diagramSection: HTMLElement | undefined = $state();
	let workflowSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [diagramSection, workflowSection]) {
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

	const bladeFiles = [
		{ name: 'welcome.blade.php', status: 'synced' },
		{ name: 'invoice.blade.php', status: 'synced' },
		{ name: 'reset-password.blade.php', status: 'modified' },
		{ name: 'shipping.blade.php', status: 'synced' }
	];

	const dashboardTemplates = [
		{ name: 'Welcome Email', status: 'synced' },
		{ name: 'Invoice', status: 'synced' },
		{ name: 'Password Reset', status: 'modified' },
		{ name: 'Shipping Update', status: 'synced' }
	];

	const workflowSteps = [
		{
			icon: CodeIcon,
			number: '1',
			title: 'Write Blade locally',
			description:
				'Develop your email templates as standard Blade files in your Laravel project. Use your favorite editor, version control, and development workflow as usual.'
		},
		{
			icon: CloudArrowUpIcon,
			number: '2',
			title: 'Push to Lettr',
			description:
				'Run a single artisan command or configure CI to push templates to the Lettr dashboard. Your team can preview and edit them visually without touching code.'
		},
		{
			icon: CloudArrowDownIcon,
			number: '3',
			title: 'Pull changes back',
			description:
				'When your team makes visual edits in the dashboard, pull those changes back into your codebase. The Blade files update automatically while preserving your code structure.'
		},
		{
			icon: GitBranchIcon,
			number: '4',
			title: 'Version everything',
			description:
				'Every sync creates a version snapshot. Roll back to any previous version, compare diffs between template states, and maintain a full audit trail of every change.'
		}
	];
</script>

<FeaturePageLayout
	title="Template Sync"
	metaDescription="Keep your Laravel Blade templates and Lettr dashboard in perfect sync. Two-way sync, version control, and seamless collaboration."
	label="// SYNC"
	description="Two-way sync between your Laravel Blade templates and the Lettr dashboard. Code locally, edit visually, version everything."
>
	{#snippet heading()}
		Blade meets dashboard.<br />Always in sync.
	{/snippet}

	{#snippet children()}
		<!-- Sync Diagram -->
		<div bind:this={diagramSection} class="mx-auto max-w-3xl">
			<h2 data-reveal class="mb-8 text-center">Your templates, everywhere</h2>
			<div data-reveal class="border border-border/50 bg-white p-6 md:p-8">
				<div class="grid items-start gap-6 md:grid-cols-[1fr,auto,1fr]">
					<!-- Laravel App Side -->
					<div>
						<div class="mb-4 flex items-center gap-2">
							<img src="/images/icons/laravel.svg" alt="" class="h-5 w-5" />
							<span class="font-heading text-sm font-semibold text-surface">Laravel App</span>
						</div>
						<div class="border border-border/50 bg-surface p-4">
							<p class="mb-3 font-code text-xs text-white/50">resources/views/emails/</p>
							<div class="space-y-2">
								{#each bladeFiles as file}
									<div class="flex items-center justify-between border border-white/10 bg-white/5 px-3 py-2">
										<span class="font-code text-xs text-white/80">{file.name}</span>
										<span
											class="text-[10px] font-medium uppercase tracking-wider {file.status === 'synced'
												? 'text-green-400'
												: 'text-amber-400'}"
										>
											{file.status}
										</span>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Sync Arrow -->
					<div class="flex items-center justify-center self-center">
						<div class="flex flex-col items-center gap-2 py-4 md:py-0">
							<ArrowsLeftRightIcon size={24} class="text-primary" />
							<span class="font-heading text-xs font-semibold tracking-wider text-primary uppercase">SYNC</span>
						</div>
					</div>

					<!-- Lettr Dashboard Side -->
					<div>
						<div class="mb-4 flex items-center gap-2">
							<div class="flex h-5 w-5 items-center justify-center bg-primary">
								<span class="text-[10px] font-bold text-white">L</span>
							</div>
							<span class="font-heading text-sm font-semibold text-surface">Lettr Dashboard</span>
						</div>
						<div class="border border-border/50 bg-background p-4">
							<p class="mb-3 text-xs text-muted">Templates</p>
							<div class="space-y-2">
								{#each dashboardTemplates as template}
									<div class="flex items-center justify-between border border-border/50 bg-white px-3 py-2">
										<span class="text-xs font-medium text-surface">{template.name}</span>
										<span
											class="text-[10px] font-medium uppercase tracking-wider {template.status === 'synced'
												? 'text-green-600'
												: 'text-amber-600'}"
										>
											{template.status}
										</span>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Workflow Steps -->
		<div bind:this={workflowSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">How it works</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				A simple, bidirectional workflow that keeps developers and non-technical team members in sync.
			</p>
			<div class="grid gap-5 sm:grid-cols-2">
				{#each workflowSteps as step}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-4 flex items-center gap-3">
							<div class="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-sm font-semibold text-white">
								{step.number}
							</div>
							<div class="flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
								<step.icon size={20} class="text-primary" />
							</div>
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{step.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{step.description}</p>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
