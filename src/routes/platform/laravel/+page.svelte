<script lang="ts">
	import { onMount } from 'svelte';
	import { TerminalIcon, PackageIcon, LightningIcon } from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let stepsSection: HTMLElement | undefined = $state();
	let codeSection: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [stepsSection, codeSection, featuresSection]) {
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

	const steps = [
		{
			number: '1',
			label: 'Install the package',
			command: 'composer require lettr/laravel'
		},
		{
			number: '2',
			label: 'Add your API key',
			command: 'LETTR_API_KEY=your-api-key'
		},
		{
			number: '3',
			label: 'Test your setup',
			command: 'php artisan lettr:test'
		}
	];

	const codeExample = `use Lettr\\Mail\\LettrMessage;

class WelcomeEmail extends Mailable
{
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
            with: [
                'user' => $this->user,
                'activationUrl' => $this->activationUrl,
            ],
        );
    }
}

// Send it
Mail::to($user->email)->send(new WelcomeEmail($user));`;

	const features = [
		{
			icon: TerminalIcon,
			title: 'Zero Configuration',
			description:
				'Lettr auto-configures your Laravel mail driver. Install the package, set your API key, and start sending. No config files to edit, no service providers to register.'
		},
		{
			icon: PackageIcon,
			title: 'Native Mail Support',
			description:
				'Use standard Laravel Mailables and Notifications as you always have. Lettr works with the native Mail facade, Markdown mailables, and queued mail out of the box.'
		},
		{
			icon: LightningIcon,
			title: 'Artisan Commands',
			description:
				'Test your connection, verify your domain, and inspect delivery status directly from the terminal. Built-in artisan commands for every step of the workflow.'
		}
	];
</script>

<FeaturePageLayout
	title="Laravel Integration"
	metaDescription="Send transactional emails from Laravel in under 60 seconds. Native mail driver, zero configuration, and built-in artisan commands."
	label="LARAVEL"
	description="Send transactional emails from your Laravel app in under 60 seconds. Native mail driver, zero config, artisan commands included."
>
	{#snippet heading()}
		Built for Laravel.<br />Loved by artisans.
	{/snippet}

	{#snippet children()}
		<!-- Install Steps -->
		<div bind:this={stepsSection} class="mx-auto max-w-2xl">
			<h2 data-reveal class="mb-8 text-center">Up and running in 3 steps</h2>
			<div class="space-y-4">
				{#each steps as step}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="flex items-center gap-4">
							<div class="flex h-8 w-8 shrink-0 items-center justify-center bg-primary text-sm font-semibold text-white">
								{step.number}
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-sm font-medium text-surface">{step.label}</p>
								<code class="mt-1 block bg-surface px-4 py-2.5 font-code text-sm text-white">{step.command}</code>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Code Example -->
		<div bind:this={codeSection} class="mx-auto mt-20 max-w-2xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Use your existing Mailables</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				No proprietary APIs to learn. Lettr works as a native Laravel mail transport, so your existing code just works.
			</p>
			<div data-reveal class="border border-border/50 bg-surface p-6">
				<div class="mb-3 flex items-center gap-2">
					<div class="h-2.5 w-2.5 bg-primary/60"></div>
					<span class="font-code text-xs text-white/50">app/Mail/WelcomeEmail.php</span>
				</div>
				<pre class="overflow-x-auto font-code text-sm leading-relaxed text-white/90">{codeExample}</pre>
			</div>
		</div>

		<!-- Feature Cards -->
		<div bind:this={featuresSection} class="mx-auto mt-20 max-w-2xl md:mt-28">
			<div class="grid gap-5">
				{#each features as feature}
					<div data-reveal class="flex items-start gap-5 border border-border/50 bg-white p-6">
						<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
							<feature.icon size={20} class="text-primary" />
						</div>
						<div>
							<h3 class="mb-1 text-base font-semibold text-surface">{feature.title}</h3>
							<p class="text-sm leading-relaxed text-muted">{feature.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
