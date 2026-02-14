<script lang="ts">
	import { onMount } from 'svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';

	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});

	const columns = [
		{
			title: 'Product',
			links: [
				{ label: 'Laravel Integration', href: '/platform/laravel' },
				{ label: 'Template Builder', href: '/platform/templates' },
				{ label: 'Template Sync', href: '/platform/sync' },
				{ label: 'Analytics', href: '/platform/analytics' },
				{ label: 'Deliverability', href: '/platform/deliverability' },
				{ label: 'MCP Server', href: '/platform/mcp' },
				{ label: 'Email Channel', href: '/channels/email' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ label: 'Documentation', href: 'https://docs.lettr.com', external: true },
				{ label: 'API Reference', href: 'https://docs.lettr.com/api-reference/introduction', external: true },
				{ label: 'Changelog', href: '/changelog' },
				{ label: 'Compare', href: '/compare' },
				{ label: 'Status', href: 'https://status.lettr.com', external: true }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'About', href: '/about' },
				{ label: 'Support', href: '/support' },
				{ label: 'Privacy Policy', href: '/privacy-policy/' },
				{ label: 'Terms of Use', href: '/terms/' },
				{ label: 'Accessibility', href: '/accessibility-statement/' }
			]
		},
		{
			title: 'Connect',
			links: [
				{ label: 'hello@lettr.com', href: 'mailto:hello@lettr.com' },
				{ label: 'GitHub', href: 'https://github.com', external: true },
				{ label: 'X / Twitter', href: 'https://x.com', external: true }
			]
		}
	];
</script>

<footer class="border-t border-border/30 bg-white px-4 py-12">
	<div class="mx-auto max-w-[550px]">
		<!-- Logo + Columns -->
		<div class="flex flex-col gap-10">
			<div>
				<a href="/" class="flex items-center">
					<img src="/logo.svg" alt="Lettr" class="h-5" />
				</a>
				<p class="mt-2 max-w-xs text-sm text-muted">
					Developer-first email delivery that just works. Send transactional emails at scale.
				</p>
			</div>

			<div class="grid grid-cols-2 gap-8 sm:grid-cols-4">
				{#each columns as column}
					<div>
						<span class="mb-3 block text-xs font-semibold uppercase tracking-wider text-surface">
							{column.title}
						</span>
						<div class="flex flex-col gap-2">
							{#each column.links as link}
								<a
									href={link.href}
									class="text-sm text-muted transition-colors hover:text-surface"
									target={link.external ? '_blank' : undefined}
									rel={link.external ? 'noopener noreferrer' : undefined}
								>
									{link.label}
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- CTA -->
		<div id="signup" class="mt-10 border-t border-border/30 pt-6">
			<div class="flex flex-col items-start gap-4">
				<h3 class="text-surface">Ready to get started?</h3>
				<p class="text-sm text-muted">Start sending emails in under 5 minutes. No credit card required.</p>
				<a
					href={registerHref}
					class="bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
				>
					Create free account
				</a>
			</div>
		</div>

		<!-- Legal -->
		<div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
			<span>&copy; {new Date().getFullYear()} Lettr. All rights reserved.</span>
			<a href="/privacy-policy/" class="transition-colors hover:text-surface">Privacy Policy</a>
			<a href="/terms/" class="transition-colors hover:text-surface">Terms of Use</a>
			<a href="/accessibility-statement/" class="transition-colors hover:text-surface">Accessibility Statement</a>
		</div>
	</div>
</footer>
