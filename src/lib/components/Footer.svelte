<script lang="ts">
	import { onMount } from 'svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import DitherEdge from '$lib/components/home/DitherEdge.svelte';
	import EnvelopeSimpleIcon from 'phosphor-svelte/lib/EnvelopeSimpleIcon';
	import GithubLogoIcon from 'phosphor-svelte/lib/GithubLogoIcon';
	import LinkedinLogoIcon from 'phosphor-svelte/lib/LinkedinLogoIcon';
	import XLogoIcon from 'phosphor-svelte/lib/XLogoIcon';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

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
			label: 'Get started',
			href: registerHref,
			destination_type: 'internal'
		});
		trackSignupClick('footer', registerHref);
	}

	const columns = [
		{
			title: 'Product',
			links: [
				{ label: 'Transactional Email', href: '/email-api/' },
				{ label: 'Free Email API', href: '/free-email-api/' },
				{ label: 'Email Marketing', href: '/email-marketing/' },
				{ label: 'Multilingual Campaigns', href: '/platform/multilingual-campaigns/' },
				{ label: 'Template Builder', href: '/platform/templates/' },
				{ label: 'Analytics', href: '/platform/analytics/' },
				{ label: 'Deliverability', href: '/platform/deliverability/' },
				{ label: 'SMTP Relay', href: '/smtp-relay/' },
				{ label: 'Inbound Email API', href: '/inbound-email-api/' },
				{ label: 'Email Channel', href: '/channels/email/' },
				{ label: 'MCP Server', href: '/platform/mcp/' }
			]
		},
		{
			title: 'Resources',
			links: [
				{ label: 'Documentation', href: 'https://docs.lettr.com', external: true },
				{ label: 'API Reference', href: 'https://docs.lettr.com/api-reference/introduction', external: true },
				{ label: 'Blog', href: '/blog/' },
				{ label: 'Changelog', href: '/changelog/' },
				{ label: 'Compare', href: '/compare/' },
				{ label: 'Email glossary', href: '/glossary/' },
				{ label: 'Status', href: 'https://status.lettr.com', external: true }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'About', href: '/about/' },
				{ label: 'Support', href: '/support/' }
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

<footer class="relative overflow-hidden bg-[#23020b] text-white">
	<div class="mx-auto max-w-[1100px] px-6 pt-14 md:pt-24">
		<!-- CTA -->
		<div id="signup" class="flex flex-col gap-6 pb-9 md:flex-row md:items-end md:justify-between md:gap-10 md:pb-16">
			<div class="flex flex-col gap-3 md:gap-4">
				<h3 class="m-0 flex flex-col font-heading text-[2rem] leading-[38px] font-normal tracking-[-0.025em] text-white md:text-[3rem] md:leading-[54px]">
					Ready to
					<em class="font-pixel text-[2.375rem] leading-10 font-medium text-primary-outline md:text-[3.375rem] md:leading-[54px]">get started?</em>
				</h3>
				<p class="m-0 text-[1.0625rem] leading-[1.5] text-white/80 md:text-[1.1875rem]">
					Start sending for free. No credit card required.
				</p>
			</div>
			<a
				href={registerHref}
				class="relative after:absolute after:inset-x-0 after:top-full after:h-0.5 after:content-[''] inline-flex items-center justify-center bg-fade-primary-strong px-6 py-4 text-lg font-bold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-fade-primary-strong/90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-10 md:py-5 md:text-[1.375rem]"
				onclick={trackFooterCtaClick}
			>
				Get started
			</a>
		</div>

		<!-- Brand + columns -->
		<div class="flex flex-col gap-8 border-t border-white/15 py-9 md:gap-10 md:py-14 lg:flex-row">
			<div class="flex shrink-0 flex-col gap-3.5 md:gap-5 lg:w-[300px]">
				<a href="/" class="flex items-center" aria-label="Lettr home">
					<svg class="h-5 w-auto md:h-[25px]" viewBox="0 0 90 19" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M55.4609 15.4534H51.9756V10.137H55.4609V15.4534ZM67.4053 15.4534H63.9209V10.137H67.4053V15.4534ZM50.5371 6.13599H41.3896V8.10376H48.9297V10.6526H41.3896V12.7727L41.3887 12.7737H50.7246V15.4426H37.9531V3.46704H50.5371V6.13599ZM84.1914 3.46704C87.2512 3.46704 89.6277 4.81888 89.6279 7.55591C89.6279 9.55745 88.3629 10.8233 86.4824 11.3704L90.0049 15.4426H85.9521L82.7891 11.6614H79.2676V15.4426H75.7959V3.46704H84.1914ZM29.5 12.637H36.6406V15.4417H26.0117V3.46704H29.5V12.637ZM62.5967 6.10767H58.9453V10.136H55.4609V6.10767H51.9678V3.44849H62.5967V6.10767ZM74.5371 3.44849V6.10767H70.8867V10.136H67.4014V6.10767H63.9082V3.44849H74.5371ZM79.25 9.13013H83.9346C85.1832 9.13007 86.0887 8.78776 86.0889 7.62524C86.0889 6.46252 85.1833 6.12042 83.9346 6.12036H79.25V9.13013Z" fill="#fff" />
						<path d="M4.73047 16.5615L2.36523 18.9268L0 16.5615L2.36523 14.1963L4.73047 16.5615ZM11.0898 13.4551L14.1953 16.5615L11.8301 18.9268L9.46387 16.5615L7.09863 18.9268L4.73145 16.5615L7.09863 14.1953L9.46387 11.8301L11.0898 13.4551ZM18.9268 16.5615L16.5605 18.9268L14.1953 16.5615L16.5605 14.1963L18.9268 16.5615ZM4.73047 11.8291L2.36523 14.1943L0 11.8291L2.36523 9.46387L4.73047 11.8291ZM18.9268 11.8291L16.5605 14.1943L14.1953 11.8291L16.5605 9.46387L18.9268 11.8291ZM11.8281 9.46387L9.46289 11.8291L7.09766 9.46387L9.46289 7.09863L11.8281 9.46387ZM4.73047 7.09766L2.36523 9.46289L0 7.09766L2.36523 4.73242L4.73047 7.09766ZM18.9268 7.09766L16.5615 9.46289L14.1953 7.09766L16.5615 4.73242L18.9268 7.09766ZM14.1953 2.36523L11.3975 5.16309L9.46387 7.09766L7.09863 4.73145L4.73145 2.36523L7.09863 0L9.46387 2.36523L11.8301 0L14.1953 2.36523ZM4.73047 2.36621L2.36523 4.73145L0 2.36621L2.36523 0.000976562L4.73047 2.36621ZM18.9268 2.36621L16.5615 4.73145L14.1953 2.36621L16.5615 0.000976562L18.9268 2.36621Z" fill="#EC104B" />
					</svg>
				</a>
				<p class="m-0 max-w-[240px] text-[0.9375rem] leading-[1.5] text-white/70">
					The email platform built for SaaS.
				</p>
			</div>

			<div class="grid flex-1 grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 md:gap-10">
				{#each columns as column, i}
					<div class="flex flex-col gap-4 md:gap-[18px] {i === 0 ? 'row-span-2 md:row-span-1' : ''}">
						<span class="text-sm leading-5 font-semibold text-primary-outline">{column.title}</span>
						<div class="flex flex-col gap-3">
							{#each column.links as link}
								<a
									href={link.href}
									class="text-[0.9375rem] leading-5 text-white/85 transition-colors hover:text-white"
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

		<!-- Legal + socials -->
		<div class="flex flex-col gap-5 border-t border-white/15 pt-6 pb-8 md:flex-row md:items-center md:justify-between md:pt-7 md:pb-10">
			<div class="flex flex-col gap-5 md:flex-row md:items-center md:gap-7">
				<div class="order-2 text-[0.8125rem] leading-5 text-white/60 md:order-none">
					&copy; {new Date().getFullYear()} Lettr. All rights reserved.
				</div>
				<div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] leading-5 text-white/80 md:gap-x-7">
					<a href="/privacy-policy/" class="transition-colors hover:text-white" onclick={() => trackFooterLegalClick('Privacy Policy', '/privacy-policy/')}>Privacy Policy</a>
					<a href="/terms/" class="transition-colors hover:text-white" onclick={() => trackFooterLegalClick('Terms of Use', '/terms/')}>Terms of Use</a>
					<a href="/accessibility-statement/" class="transition-colors hover:text-white" onclick={() => trackFooterLegalClick('Accessibility Statement', '/accessibility-statement/')}>Accessibility Statement</a>
				</div>
			</div>
			<div class="flex items-center gap-2.5">
				{#each socials as social}
					<a
						href={social.href}
						class="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-primary hover:bg-primary md:h-9 md:w-9"
						target={social.external ? '_blank' : undefined}
						rel={social.external ? 'noopener noreferrer' : undefined}
						aria-label={social.label}
						onclick={() => trackFooterSocialClick(social.label, social.href)}
					>
						<social.icon aria-hidden="true" size={18} />
					</a>
				{/each}
			</div>
		</div>
	</div>

	<!-- Giant tonal wordmark (type only), with flames licking up through it -->
	<div class="relative h-[96px] overflow-hidden md:h-[210px]" aria-hidden="true">
		<div class="mx-auto max-w-[1100px] px-6">
			<svg class="block h-auto w-full" viewBox="26 3.4 64 12.1" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M55.4609 15.4534H51.9756V10.137H55.4609V15.4534ZM67.4053 15.4534H63.9209V10.137H67.4053V15.4534ZM50.5371 6.13599H41.3896V8.10376H48.9297V10.6526H41.3896V12.7727L41.3887 12.7737H50.7246V15.4426H37.9531V3.46704H50.5371V6.13599ZM84.1914 3.46704C87.2512 3.46704 89.6277 4.81888 89.6279 7.55591C89.6279 9.55745 88.3629 10.8233 86.4824 11.3704L90.0049 15.4426H85.9521L82.7891 11.6614H79.2676V15.4426H75.7959V3.46704H84.1914ZM29.5 12.637H36.6406V15.4417H26.0117V3.46704H29.5V12.637ZM62.5967 6.10767H58.9453V10.136H55.4609V6.10767H51.9678V3.44849H62.5967V6.10767ZM74.5371 3.44849V6.10767H70.8867V10.136H67.4014V6.10767H63.9082V3.44849H74.5371ZM79.25 9.13013H83.9346C85.1832 9.13007 86.0887 8.78776 86.0889 7.62524C86.0889 6.46252 85.1833 6.12042 83.9346 6.12036H79.25V9.13013Z" fill="#4a0f22" />
			</svg>
		</div>
		<div class="absolute inset-x-0 bottom-0 md:hidden">
			<DitherEdge mode="fire" color="#ec104b" placement="inside" height={64} cell={6} />
		</div>
		<div class="absolute inset-x-0 bottom-0 hidden md:block">
			<DitherEdge mode="fire" color="#ec104b" placement="inside" height={140} cell={8} />
		</div>
	</div>
</footer>
