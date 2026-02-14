<script lang="ts">
	import { onMount } from 'svelte';
	import {
		PaperPlaneRightIcon,
		BugIcon,
		GlobeIcon,
		ChartBarIcon,
		ShieldCheckIcon,
		CodeIcon,
		WebhooksLogoIcon,
		KeyIcon,
		EnvelopeSimpleIcon,
		MagnifyingGlassIcon,
		ListBulletsIcon,
		LinkIcon,
		LockKeyIcon,
		RobotIcon
	} from 'phosphor-svelte';
	import FeaturePageLayout from '$lib/components/FeaturePageLayout.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let toolsSection: HTMLElement | undefined = $state();
	let conversationSection: HTMLElement | undefined = $state();
	let actionsSection: HTMLElement | undefined = $state();
	let flowSection: HTMLElement | undefined = $state();
	let setupSection: HTMLElement | undefined = $state();
	let securitySection: HTMLElement | undefined = $state();

	onMount(() => {
		const cleanups: (() => void)[] = [];

		for (const section of [toolsSection, conversationSection, actionsSection, flowSection, setupSection, securitySection]) {
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

	const compatibleTools = [
		{ name: 'Claude', icon: '/images/icons/claude.svg' },
		{ name: 'ChatGPT', icon: '/images/icons/chat-gpt.svg' },
		{ name: 'Cursor', icon: '/images/icons/cursor.svg' },
		{ name: 'Windsurf', icon: '/images/icons/windsurf.svg' }
	];

	const conversations = [
		{
			label: 'Send emails',
			prompt: 'Send a welcome email to john@example.com using the welcome-v2 template with their name and activation link.',
			response: 'Email sent successfully to john@example.com using template welcome-v2. Message ID: msg_a1b2c3d4. Delivery status: accepted.'
		},
		{
			label: 'Debug delivery',
			prompt: 'Why did the email to sarah@company.com bounce yesterday?',
			response: 'The email to sarah@company.com bounced at 2024-01-15 14:32 UTC with a 550 5.1.1 error: recipient mailbox does not exist. The address has been added to your suppression list.'
		},
		{
			label: 'Check domains',
			prompt: 'Are all my sending domains properly authenticated?',
			response: 'You have 3 sending domains configured. app.yoursite.com: DKIM verified, SPF verified, DMARC verified. mail.yoursite.com: DKIM verified, SPF verified, DMARC pending. notify.yoursite.com: All records verified.'
		},
		{
			label: 'Monitor API',
			prompt: 'Show me the API errors from the last 24 hours.',
			response: 'Found 3 API errors in the last 24 hours. 2x 422 validation errors on /v1/send (missing "to" field). 1x 429 rate limit exceeded at 03:14 UTC from IP 192.168.1.50. All other 12,847 requests returned 200.'
		}
	];

	const actions = [
		{ name: 'send_email', description: 'Send a raw email with full control over headers, body, and attachments', icon: EnvelopeSimpleIcon },
		{ name: 'send_template_email', description: 'Send an email using a pre-built template with dynamic variables', icon: PaperPlaneRightIcon },
		{ name: 'browse_email_events', description: 'Search and filter email events like deliveries, opens, and bounces', icon: MagnifyingGlassIcon },
		{ name: 'browse_api_logs', description: 'View API request and response logs with full payloads', icon: ListBulletsIcon },
		{ name: 'list_sending_domains', description: 'List all configured sending domains and their authentication status', icon: GlobeIcon },
		{ name: 'list_tracking_domains', description: 'View tracking domains used for open and click tracking', icon: LinkIcon },
		{ name: 'list_api_keys', description: 'List all API keys with their permissions and last used timestamps', icon: KeyIcon },
		{ name: 'list_webhooks', description: 'View configured webhook endpoints and their delivery status', icon: WebhooksLogoIcon }
	];

	const useCases = [
		{
			icon: PaperPlaneRightIcon,
			title: 'Send test emails from chat',
			description: 'Ask your AI assistant to send a test email to any address using any template. Perfect for QA workflows.'
		},
		{
			icon: BugIcon,
			title: 'Debug delivery issues',
			description: 'Paste a recipient email and ask why it bounced. Get bounce codes, timestamps, and suppression status instantly.'
		},
		{
			icon: GlobeIcon,
			title: 'Audit domain authentication',
			description: 'Ask your agent to verify all sending domains have proper DKIM, SPF, and DMARC records configured.'
		},
		{
			icon: ChartBarIcon,
			title: 'Monitor API health',
			description: 'Query recent API logs for errors, rate limits, and response times without leaving your editor.'
		},
		{
			icon: CodeIcon,
			title: 'Generate integration code',
			description: 'Describe what email you want to send and get working code with the correct template IDs and variables.'
		},
		{
			icon: RobotIcon,
			title: 'Automate email ops',
			description: 'Build AI-powered workflows that react to delivery events, clean up suppression lists, and rotate API keys.'
		}
	];

	const mcpConfig = `{
  "mcpServers": {
    "lettr": {
      "url": "https://mcp.lettr.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}`;
</script>

<FeaturePageLayout
	title="MCP Server"
	metaDescription="Control Lettr from any AI assistant. Send emails, debug delivery, and monitor your infrastructure through natural language via MCP."
	label="MCP"
	description="Control your email infrastructure from any AI assistant. Send emails, debug delivery, and monitor domains through natural language."
>
	{#snippet heading()}
		Your email API,<br />AI-native.
	{/snippet}

	{#snippet children()}
		<!-- Compatible Tools Bar -->
		<div bind:this={toolsSection} class="mx-auto max-w-3xl">
			<div data-reveal class="border border-border/50 bg-white p-6">
				<p class="mb-4 text-center text-xs font-medium text-muted uppercase">Works with your favorite AI tools</p>
				<div class="flex items-center justify-center gap-8">
					{#each compatibleTools as tool}
						<div class="flex flex-col items-center gap-2">
							<div class="flex h-12 w-12 items-center justify-center border border-border/50 bg-background">
								<img src={tool.icon} alt={tool.name} class="h-6 w-6" />
							</div>
							<span class="text-xs font-medium text-muted">{tool.name}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Conversation Demo Panels -->
		<div bind:this={conversationSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Talk to your email infrastructure</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Natural language commands that translate into real API actions.
			</p>
			<div class="grid gap-5 sm:grid-cols-2">
				{#each conversations as convo}
					<div data-reveal class="border border-border/50 bg-white">
						<div class="border-b border-border/50 bg-background px-4 py-2.5">
							<span class="font-heading text-xs font-semibold text-surface uppercase">{convo.label}</span>
						</div>
						<div class="space-y-3 p-4">
							<!-- User message -->
							<div class="flex gap-2">
								<div class="mt-0.5 h-5 w-5 shrink-0 bg-surface"></div>
								<p class="text-sm text-surface">{convo.prompt}</p>
							</div>
							<!-- AI response -->
							<div class="flex gap-2">
								<div class="mt-0.5 h-5 w-5 shrink-0 bg-primary"></div>
								<p class="font-code text-xs leading-relaxed text-muted">{convo.response}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Available Actions Grid -->
		<div bind:this={actionsSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Available actions</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Every action maps to a real Lettr API endpoint. Your AI agent gets the same capabilities as your code.
			</p>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each actions as action}
					<div data-reveal class="flex items-start gap-3 border border-border/50 bg-white px-4 py-3.5">
						<div class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background">
							<action.icon size={16} class="text-primary" />
						</div>
						<div>
							<p class="font-code text-sm font-medium text-surface">{action.name}</p>
							<p class="mt-0.5 text-xs leading-relaxed text-muted">{action.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Agent Flow Cards -->
		<div bind:this={flowSection} class="mx-auto mt-20 max-w-3xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">What you can build</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Use the MCP server as a building block for AI-powered email workflows.
			</p>
			<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{#each useCases as useCase}
					<div data-reveal class="border border-border/50 bg-white p-6">
						<div class="mb-3 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
							<useCase.icon size={20} class="text-primary" />
						</div>
						<h3 class="mb-2 text-base font-semibold text-surface">{useCase.title}</h3>
						<p class="text-sm leading-relaxed text-muted">{useCase.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Setup Steps -->
		<div bind:this={setupSection} class="mx-auto mt-20 max-w-2xl md:mt-28">
			<h2 data-reveal class="mb-3 text-center">Get started in 30 seconds</h2>
			<p data-reveal class="mx-auto mb-8 max-w-lg text-center text-body text-muted">
				Add the Lettr MCP server to your AI tool configuration. One endpoint, one API key.
			</p>
			<div data-reveal class="border border-border/50 bg-surface p-6">
				<div class="mb-3 flex items-center gap-2">
					<div class="h-2.5 w-2.5 bg-primary/60"></div>
					<span class="font-code text-xs text-white/50">mcp.json</span>
				</div>
				<pre class="overflow-x-auto font-code text-sm leading-relaxed text-white/90">{mcpConfig}</pre>
			</div>
		</div>

		<!-- Security Note -->
		<div bind:this={securitySection} class="mx-auto mt-12 max-w-2xl">
			<div data-reveal class="flex items-start gap-4 border border-border/50 bg-white p-6">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
					<LockKeyIcon size={20} class="text-primary" />
				</div>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">Security by design</h3>
					<p class="text-sm leading-relaxed text-muted">
						The MCP server uses your existing API key with the same permissions and rate limits as direct API calls. All actions are logged and auditable. Scoped API keys let you limit what your AI agent can do -- read-only access for monitoring, or full write access for automation.
					</p>
				</div>
			</div>
		</div>
	{/snippet}
</FeaturePageLayout>
