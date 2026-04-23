<script lang="ts">
	import { onMount } from 'svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { EnvelopeSimpleIcon, GithubLogoIcon, LinkedinLogoIcon, XLogoIcon } from 'phosphor-svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	let registerHref: string = $state(registerUrl);

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});

	function trackFooterLinkClick(column: string, label: string, href: string) {
		void capturePosthogEvent('footer_link_clicked', {
			column,
			label,
			href,
			is_external: /^https?:\/\//.test(href)
		});
	}

	function trackFooterLegalClick(label: string, href: string) {
		void capturePosthogEvent('footer_link_clicked', {
			column: 'legal',
			label,
			href,
			is_external: false
		});
	}

	function trackFooterSocialClick(label: string, href: string) {
		void capturePosthogEvent('footer_social_clicked', { label, href });
	}

	function trackFooterCtaClick() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'footer',
			label: 'Start sending in minutes',
			href: registerHref,
			destination_type: 'internal'
		});
	}

	const columns = [
		{
			title: 'Product',
			links: [
				{ label: 'Laravel Integration', href: '/platform/laravel' },
				{ label: 'Template Builder', href: '/platform/templates' },
				{ label: 'Analytics', href: '/platform/analytics' },
				{ label: 'Deliverability', href: '/platform/deliverability' },
				{ label: 'MCP Server', href: '/platform/mcp' }
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
				{ label: 'Support', href: '/support' }
			]
		}
	];

	const socials = [
		{ label: 'Email', href: 'mailto:hello@lettr.com', icon: EnvelopeSimpleIcon },
		{ label: 'GitHub', href: 'https://github.com/lettr-com', icon: GithubLogoIcon, external: true },
		{ label: 'X', href: 'https://x.com/lettr_com', icon: XLogoIcon, external: true },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/company/lettr-com', icon: LinkedinLogoIcon, external: true }
	];
</script>

<footer class="border-t border-border/30 bg-white px-6 py-12">
	<div class="mx-auto max-w-4xl">
		<!-- Logo + Columns -->
		<div class="flex flex-col gap-8">
			<div>
				<a href="/" class="flex items-center">
					<img src="/logo.svg" alt="Lettr" class="h-5" />
				</a>
				<p class="mt-2 max-w-xs text-sm text-muted">
					The email platform built for SaaS.
				</p>
			</div>

			<div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-8">
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
									onclick={() => trackFooterLinkClick(column.title, link.label, link.href)}
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
		<div id="signup" class="mt-8 border-t border-border/30 pt-6">
			<div class="flex flex-col items-start gap-4">
				<h3 class="text-surface">Ready to get started?</h3>
				<p class="text-sm text-muted">Start sending for free. No credit card required.</p>
				<a
					href={registerHref}
					class="bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
					onclick={trackFooterCtaClick}
				>
					Start sending in minutes
				</a>
			</div>
		</div>

		<!-- Legal -->
		<div class="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-4 text-xs text-muted">
			<div class="flex flex-wrap items-center gap-x-4 gap-y-2">
				<span>&copy; {new Date().getFullYear()} Lettr. All rights reserved.</span>
				<a
					href="/privacy-policy/"
					class="transition-colors hover:text-surface"
					onclick={() => trackFooterLegalClick('Privacy Policy', '/privacy-policy/')}
				>Privacy Policy</a>
				<a
					href="/terms/"
					class="transition-colors hover:text-surface"
					onclick={() => trackFooterLegalClick('Terms of Use', '/terms/')}
				>Terms of Use</a>
				<a
					href="/accessibility-statement/"
					class="transition-colors hover:text-surface"
					onclick={() => trackFooterLegalClick('Accessibility Statement', '/accessibility-statement/')}
				>Accessibility Statement</a>
			</div>
			<div class="flex items-center gap-3">
				{#each socials as social}
					<a
						href={social.href}
						class="text-muted transition-colors hover:text-surface"
						target={social.external ? '_blank' : undefined}
						rel={social.external ? 'noopener noreferrer' : undefined}
						aria-label={social.label}
						onclick={() => trackFooterSocialClick(social.label, social.href)}
					>
						<social.icon size={20} />
					</a>
				{/each}
			</div>
		</div>
	</div>
</footer>
