<script lang="ts">
	import { onMount } from 'svelte';
	import List from 'phosphor-svelte/lib/List';
	import X from 'phosphor-svelte/lib/X';
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import SparkleIcon from 'phosphor-svelte/lib/SparkleIcon';
	import ChartBarIcon from 'phosphor-svelte/lib/ChartBarIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
	import RobotIcon from 'phosphor-svelte/lib/RobotIcon';
	import HeadsetIcon from 'phosphor-svelte/lib/HeadsetIcon';
	import BookOpenIcon from 'phosphor-svelte/lib/BookOpenIcon';
	import ScalesIcon from 'phosphor-svelte/lib/ScalesIcon';
	import PulseIcon from 'phosphor-svelte/lib/PulseIcon';
	import InfoIcon from 'phosphor-svelte/lib/InfoIcon';
	import EnvelopeSimpleIcon from 'phosphor-svelte/lib/EnvelopeSimpleIcon';
	import ChatDotsIcon from 'phosphor-svelte/lib/ChatDotsIcon';
	import WhatsappLogoIcon from 'phosphor-svelte/lib/WhatsappLogoIcon';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSigninClick, trackSignupClick } from '$lib/analytics/posthog';

	interface DropdownItem {
		icon?: typeof CodeIcon;
		iconSrc?: string;
		badge?: 'transactional' | 'marketing';
		label: string;
		description: string;
		href: string;
		external?: boolean;
		comingSoon?: boolean;
	}

	interface DropdownSection {
		label: string;
		items: DropdownItem[];
		iconGrid?: boolean;
	}

	interface DropdownConfig {
		items?: DropdownItem[];
		sections?: DropdownSection[];
		footer?: { label: string; href: string };
		wide?: boolean;
		align?: 'center' | 'left';
	}

	interface NavLink {
		label: string;
		href: string;
		dropdownKey?: string;
	}

	let nav: HTMLElement | undefined = $state();
	let mobileOpen: boolean = $state(false);
	let openDropdown: string | null = $state(null);
	let mobileExpanded: string | null = $state(null);
	let closeTimer: ReturnType<typeof setTimeout> | null = null;
	let registerHref: string = $state(registerUrl);

	const platformSections: DropdownSection[] = [
		{
			label: 'Products',
			items: [
				{ badge: 'transactional', label: 'Transactional Email', description: 'Send via REST API & SMTP — pay per email', href: '/email-api/' },
				{ badge: 'marketing', label: 'Email Marketing', description: 'Campaigns, lists & segments — pay per contact', href: '/email-marketing/' },
				{ label: 'Transactional + Marketing', description: 'Run both from one platform and one editor', href: '/platform/sync/' }
			]
		},
		{
			label: 'Features',
			items: [
				{ icon: CodeIcon, label: 'Developer API', description: 'REST API, SMTP, and SDKs', href: '/platform/laravel/' },
				{ icon: SparkleIcon, label: 'Visual Editor', description: 'Drag-and-drop editor powered by Topol', href: '/platform/templates/' },
				{ icon: ChartBarIcon, label: 'Analytics & Logs', description: 'Delivery metrics, logs, and webhooks', href: '/platform/analytics/' },
				{ icon: ShieldCheckIcon, label: 'Deliverability', description: 'SPF, DKIM, DMARC, dedicated IPs', href: '/platform/deliverability/' },
				{ icon: RobotIcon, label: 'MCP Integration', description: 'Connect AI agents and LLMs to Lettr', href: '/platform/mcp/' },
				{ icon: EnvelopeSimpleIcon, label: 'Email Channel', description: 'Multi-region delivery infrastructure', href: '/channels/email/' }
			]
		}
	];

	const resourcesItems: DropdownItem[] = [
		{ icon: HeadsetIcon, label: 'Support & Contact', description: 'Get help or reach out to our team', href: '/support/' },
		{ icon: BookOpenIcon, label: 'Docs', description: 'Guides, API reference, and examples', href: 'https://docs.lettr.com', external: true },
		{ icon: ScalesIcon, label: 'Compare & Migrate', description: 'See how Lettr compares to other providers', href: '/compare/' },
		{ icon: PulseIcon, label: 'Status', description: 'System uptime and incident history', href: 'https://status.lettr.com', external: true },
		{ icon: EnvelopeSimpleIcon, label: 'Changelog', description: 'Latest updates and improvements', href: '/changelog/' }
	];

	const companyItems: DropdownItem[] = [
		{ icon: InfoIcon, label: 'About', description: 'Our story, team, and mission', href: '/about/' },
		{ iconSrc: '/images/logos/lettr-icon.svg', label: 'Lettr', description: 'The email platform built for SaaS', href: '/' },
		{ iconSrc: '/images/logos/topol-icon.svg', label: 'Topol', description: 'Email editor trusted by 40,000+ companies', href: 'https://topol.io', external: true },
		{ iconSrc: '/images/logos/dmarceye-icon.svg', label: 'DMARCeye', description: 'DMARC monitoring and reporting', href: 'https://dmarceye.com', external: true }
	];

	const integrationsSections: DropdownSection[] = [
		{
			label: 'SDKs',
			iconGrid: true,
			items: [
				{ iconSrc: '/images/icons/laravel.svg', label: 'Laravel', description: 'First-class Laravel package', href: 'https://docs.lettr.com/quickstart/laravel/introduction', external: true },
				{ iconSrc: '/images/icons/php.svg', label: 'PHP', description: 'Standalone PHP SDK', href: 'https://docs.lettr.com/quickstart/php/introduction', external: true },
				{ iconSrc: '/images/icons/node-js.svg', label: 'Node.js', description: 'JavaScript & TypeScript', href: 'https://docs.lettr.com/quickstart/nodejs/introduction', external: true },
				{ iconSrc: '/images/icons/golang.svg', label: 'Go', description: 'Go client library', href: 'https://docs.lettr.com/quickstart/go/quickstart', external: true },
				{ iconSrc: '/images/icons/java.svg', label: 'Java', description: 'Java client library', href: 'https://docs.lettr.com/quickstart/java/quickstart', external: true },
				{ iconSrc: '/images/icons/rust.svg', label: 'Rust', description: 'Rust client library', href: 'https://docs.lettr.com/quickstart/rust/quickstart', external: true }
			]
		},
		{
			label: 'Integrations',
			items: [
				{ iconSrc: '/images/icons/api.svg', label: 'API', description: 'RESTful HTTP API', href: 'https://docs.lettr.com/api-reference/introduction', external: true },
				{ iconSrc: '/images/icons/smtp.svg', label: 'SMTP', description: 'Standard SMTP relay', href: 'https://docs.lettr.com/quickstart/smtp/introduction', external: true },
				{ iconSrc: '/images/icons/mcp.svg', label: 'MCP', description: 'Model Context Protocol', href: 'https://docs.lettr.com/mcp/introduction', external: true }
			]
		}
	];

	const dropdownConfigs: Record<string, DropdownConfig> = {
		platform: { sections: platformSections, wide: true, align: 'left', footer: { label: 'View all features', href: '/#features' } },
		docs: { sections: [
			{
				label: 'Documentation',
				items: [
					{ icon: BookOpenIcon, label: 'Getting Started', description: 'Quick start guides', href: 'https://docs.lettr.com/introduction', external: true },
					{ icon: CodeIcon, label: 'API Reference', description: 'Full API documentation', href: 'https://docs.lettr.com/api-reference/introduction', external: true },
					{ icon: EnvelopeSimpleIcon, label: 'Changelog', description: 'Latest updates', href: '/changelog/' }
				]
			},
			...integrationsSections
		], wide: true, footer: { label: 'View full documentation', href: 'https://docs.lettr.com' } },
		company: { items: companyItems },
		resources: { items: resourcesItems, footer: { label: 'Visit documentation', href: 'https://docs.lettr.com' } }
	};

	const navLinks: NavLink[] = [
		{ label: 'Platform', href: '/#features', dropdownKey: 'platform' },
		{ label: 'Docs', href: 'https://docs.lettr.com', dropdownKey: 'docs' },
		{ label: 'Pricing', href: '/pricing/' },
		{ label: 'Blog', href: '/blog/' },
		{ label: 'Company', href: '#', dropdownKey: 'company' }
	];

	function getAllItems(config: DropdownConfig): DropdownItem[] {
		if (config.items) return config.items;
		if (config.sections) return config.sections.flatMap((s) => s.items);
		return [];
	}

	function handleMouseEnter(key: string) {
		if (closeTimer) {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
		if (openDropdown !== key) {
			void capturePosthogEvent('nav_dropdown_opened', { dropdown: key, device: 'desktop' });
		}
		openDropdown = key;
	}

	function handleMouseLeave() {
		closeTimer = setTimeout(() => {
			openDropdown = null;
		}, 150);
	}

	function toggleMobile() {
		mobileOpen = !mobileOpen;
		void capturePosthogEvent('nav_mobile_toggled', { open: mobileOpen });
	}

	function closeMobile() {
		mobileOpen = false;
		mobileExpanded = null;
	}

	function toggleMobileMenu(key: string) {
		const willOpen = mobileExpanded !== key;
		mobileExpanded = willOpen ? key : null;
		if (willOpen) {
			void capturePosthogEvent('nav_dropdown_opened', { dropdown: key, device: 'mobile' });
		}
	}

	function trackNavItemClick(
		location: 'dropdown' | 'dropdown_footer' | 'mobile_dropdown' | 'mobile_link' | 'top_level',
		label: string,
		href: string,
		dropdownKey?: string
	) {
		void capturePosthogEvent('nav_link_clicked', {
			location,
			label,
			href,
			dropdown: dropdownKey ?? null,
			is_external: /^https?:\/\//.test(href)
		});
	}

	function trackNavCtaClick(label: string, href: string, placement: 'desktop' | 'mobile') {
		void capturePosthogEvent('cta_clicked', {
			placement: `navbar_${placement}`,
			label,
			href,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (label === 'Sign in') {
			trackSigninClick(`navbar_${placement}`, href);
		} else if (label === 'Start sending') {
			trackSignupClick(`navbar_${placement}`, href);
		}
	}

	function trackLogoClick() {
		void capturePosthogEvent('nav_link_clicked', {
			location: 'logo',
			label: 'Lettr logo',
			href: '/',
			dropdown: null,
			is_external: false
		});
	}

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		if (!nav) return;

		return createFromAnimationCleanup({
			scope: nav,
			targets: nav,
			vars: { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' }
		});
	});
</script>

{#snippet brandBadge(mode: 'transactional' | 'marketing')}
	{#if mode === 'transactional'}
		<span class="flex h-10 w-10 shrink-0 items-center justify-center bg-[#EC104B]">
			<svg width="16" height="20" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="block">
				<path
					d="M11.3896 13.832L15 17.334L12.251 20L9.5 17.334L6.75098 20L4 17.334L6.75098 14.666L9.5 12L11.3896 13.832ZM15 6.66602L11.748 9.82031L9.5 12L6.75098 9.33398L4 6.66602L6.75098 4L9.5 6.66602L12.251 4L15 6.66602Z"
					fill="url(#nav_tx_grad)"
				/>
				<defs>
					<linearGradient id="nav_tx_grad" x1="9.5" y1="4" x2="9.5" y2="20" gradientUnits="userSpaceOnUse">
						<stop stop-color="#FFEFF4" />
						<stop offset="1" stop-color="#FF90AE" />
					</linearGradient>
				</defs>
			</svg>
		</span>
	{:else}
		<span class="flex h-10 w-10 shrink-0 items-center justify-center bg-[#00D46B]">
			<svg width="20" height="20" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="block">
				<path
					d="M11 15L7 19L3 15L7 11L11 15ZM19 15L15 19L11 15L15 11L19 15ZM11 7L7 11L3 7L7 3L11 7ZM19 7L15 11L11 7L15 3L19 7Z"
					fill="url(#nav_mk_grad)"
				/>
				<defs>
					<linearGradient id="nav_mk_grad" x1="11" y1="3" x2="11" y2="19" gradientUnits="userSpaceOnUse">
						<stop stop-color="white" />
						<stop offset="1" stop-color="#AAFFD5" />
					</linearGradient>
				</defs>
			</svg>
		</span>
	{/if}
{/snippet}

<div class="fixed top-0 right-0 left-0 z-50 flex justify-center">
<nav
	bind:this={nav}
	class="flex flex-col w-full max-w-4xl narrow:max-w-none bg-white border-x border-b border-border/30 narrow:border-x-0"
	aria-label="Main navigation"
>
	<div class="flex h-[60px] w-full items-center justify-between px-6">
		<!-- Logo -->
		<a href="/" class="flex items-center shrink-0" onclick={trackLogoClick}>
			<img src="/logo.svg" alt="Lettr" class="h-5" />
		</a>

		<!-- Desktop nav links -->
		<div class="hidden items-center gap-1 md:flex ml-8 flex-1">
				{#each navLinks as link}
					{#if link.dropdownKey}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="relative"
							onmouseenter={() => link.dropdownKey && handleMouseEnter(link.dropdownKey)}
							onmouseleave={handleMouseLeave}
						>
							<button
								class="flex items-center gap-1 px-2.5 py-2 text-sm text-muted transition-colors hover:text-surface"
								onclick={() => (openDropdown = openDropdown === link.dropdownKey ? null : link.dropdownKey ?? null)}
								aria-expanded={openDropdown === link.dropdownKey}
								aria-haspopup="true"
							>
								{link.label}
								<CaretDown
									size={12}
									class="transition-transform duration-200 {openDropdown === link.dropdownKey ? 'rotate-180' : ''}"
								/>
							</button>

							{#if openDropdown === link.dropdownKey && link.dropdownKey}
								{@const ddConfig = dropdownConfigs[link.dropdownKey]}
								<div
									class="absolute top-full mt-2 border border-border/50 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.1)] {ddConfig?.align === 'left' ? 'left-0' : 'left-1/2 -translate-x-1/2'} {ddConfig?.wide ? 'w-[580px]' : 'w-[300px]'}"
								>
									{#if ddConfig?.sections}
										<div class="grid {ddConfig.sections.length > 2 ? 'sm:grid-cols-3' : ddConfig.sections.length > 1 ? 'sm:grid-cols-2' : ''}">
											{#each ddConfig.sections as section, si}
												<div class="p-3 {si > 0 ? 'border-t border-border/30 sm:border-t-0 sm:border-l' : ''}">
													<div class="mb-1 px-3 py-1.5 font-heading text-[10px] tracking-[0.12em] text-muted uppercase">
														{section.label}
													</div>
													{#if section.iconGrid}
														<div class="grid grid-cols-3 gap-2 px-2 py-1">
															{#each section.items as item}
																{#if item.comingSoon}
																	<span class="flex items-center justify-center h-12 w-12 opacity-30 cursor-default" title="{item.label} (Coming soon)">
																		{#if item.iconSrc}
																			<img src={item.iconSrc} alt={item.label} class="h-8 w-8" />
																		{/if}
																	</span>
																{:else}
																	<a
																		href={item.href}
																		target={item.external ? '_blank' : undefined}
																		rel={item.external ? 'noopener noreferrer' : undefined}
																		class="flex items-center justify-center h-12 w-12 opacity-60 hover:opacity-100 transition-opacity"
																		title={item.label}
																		onclick={() => {
																			trackNavItemClick('dropdown', item.label, item.href, link.dropdownKey);
																			openDropdown = null;
																		}}
																	>
																		{#if item.iconSrc}
																			<img src={item.iconSrc} alt={item.label} class="h-8 w-8" />
																		{/if}
																	</a>
																{/if}
															{/each}
														</div>
													{:else}
														{#each section.items as item}
															{#if item.comingSoon}
																<span class="flex items-start gap-3 px-3 py-2 opacity-40 cursor-default">
																	<div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-border/50 bg-background">
																		{#if item.iconSrc}
																			<img src={item.iconSrc} alt="" class="h-4 w-4" />
																		{/if}
																	</div>
																	<div>
																		<div class="flex items-center gap-2">
																			<span class="text-[13px] font-medium text-surface">{item.label}</span>
																			<span class="border border-border/50 bg-background px-1.5 py-0.5 font-heading text-[9px] tracking-wider text-muted">SOON</span>
																		</div>
																		<div class="mt-0.5 text-[12px] leading-snug text-muted">{item.description}</div>
																	</div>
																</span>
															{:else}
																<a
																	href={item.href}
																	target={item.external ? '_blank' : undefined}
																	rel={item.external ? 'noopener noreferrer' : undefined}
																	class="group flex {item.badge ? 'items-center' : 'items-start'} gap-3 px-3 py-2 transition-colors hover:bg-background"
																	onclick={() => {
																		trackNavItemClick('dropdown', item.label, item.href, link.dropdownKey);
																		openDropdown = null;
																	}}
																>
																	{#if item.badge}
																		{@render brandBadge(item.badge)}
																	{:else}
																		<div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-border/50 bg-background transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
																			{#if item.iconSrc}
																				<img src={item.iconSrc} alt="" class="h-4 w-4" />
																			{:else if item.icon}
																				{@const Icon = item.icon}
																				<Icon size={14} class="text-muted transition-colors group-hover:text-primary" />
																			{/if}
																		</div>
																	{/if}
																	<div>
																		<span class="text-[13px] font-medium text-surface">{item.label}</span>
																		<div class="mt-0.5 text-[12px] leading-snug text-muted">{item.description}</div>
																	</div>
																</a>
															{/if}
														{/each}
													{/if}
												</div>
											{/each}
										</div>
									{:else if ddConfig?.items}
										<div class="p-2">
											{#each ddConfig.items as item}
												<a
													href={item.href}
													target={item.external ? '_blank' : undefined}
													rel={item.external ? 'noopener noreferrer' : undefined}
													class="group flex items-start gap-3 px-3 py-2 transition-colors hover:bg-background"
													onclick={() => {
														trackNavItemClick('dropdown', item.label, item.href, link.dropdownKey);
														openDropdown = null;
													}}
												>
													<div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-border/50 bg-background transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
														{#if item.iconSrc}
															<img src={item.iconSrc} alt="" class="h-3.5 w-3.5" />
														{:else if item.icon}
															{@const Icon = item.icon}
															<Icon size={14} class="text-muted transition-colors group-hover:text-primary" />
														{/if}
													</div>
													<div>
														<div class="flex items-center gap-2">
															<span class="text-[13px] font-medium text-surface">{item.label}</span>
															{#if item.external}
																<svg class="h-2.5 w-2.5 text-muted/50" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
																	<path d="M3.5 1.5H10.5V8.5" />
																	<path d="M10.5 1.5L1.5 10.5" />
																</svg>
															{/if}
														</div>
														<div class="mt-0.5 text-[12px] leading-snug text-muted">{item.description}</div>
													</div>
												</a>
											{/each}
										</div>
									{/if}

									{#if ddConfig?.footer}
										<div class="border-t border-border/30 bg-background px-5 py-3">
											<a
												href={ddConfig.footer.href}
												target={ddConfig.footer.href.startsWith('http') ? '_blank' : undefined}
												rel={ddConfig.footer.href.startsWith('http') ? 'noopener noreferrer' : undefined}
												class="flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors hover:text-primary"
												onclick={() => {
													if (ddConfig.footer) {
														trackNavItemClick('dropdown_footer', ddConfig.footer.label, ddConfig.footer.href, link.dropdownKey);
													}
													openDropdown = null;
												}}
											>
												{ddConfig.footer.label} &rarr;
											</a>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{:else}
						<a
							href={link.href}
							class="px-2.5 py-2 text-sm text-muted transition-colors hover:text-surface"
							onclick={() => trackNavItemClick('top_level', link.label, link.href)}
						>
							{link.label}
						</a>
					{/if}
				{/each}

			</div>

			<!-- Desktop CTAs -->
			<div class="hidden md:flex items-center gap-5">
				<a
					href="https://app.lettr.com"
					class="text-sm text-muted transition-colors hover:text-surface"
					onclick={() => trackNavCtaClick('Sign in', 'https://app.lettr.com', 'desktop')}
				>
					Sign in
				</a>
				<a
					href={registerHref}
					class="flex items-center justify-center px-4 py-2 text-sm font-semibold bg-primary text-white transition-colors hover:bg-primary/90"
					onclick={() => trackNavCtaClick('Start sending', registerHref, 'desktop')}
				>
					Start sending
				</a>
			</div>

			<!-- Mobile toggle -->
			<button
				class="ml-auto flex items-center justify-center md:hidden"
				onclick={toggleMobile}
				aria-label="Toggle menu"
				aria-expanded={mobileOpen}
			>
				{#if mobileOpen}
					<X size={24} />
				{:else}
					<List size={24} />
				{/if}
			</button>
		</div>

		<!-- Mobile menu -->
		{#if mobileOpen}
			<div class="border-t border-border/30 px-4 pb-6 md:hidden max-h-[calc(100vh-60px)] overflow-y-auto">
				<div class="flex flex-col gap-2 pt-4">
					{#each navLinks as link}
						{#if link.dropdownKey}
							<div>
								<button
									class="flex w-full items-center justify-between py-3 text-surface"
									onclick={() => link.dropdownKey && toggleMobileMenu(link.dropdownKey)}
								>
									{link.label}
									<CaretDown
										size={16}
										class="transition-transform duration-200 {mobileExpanded === link.dropdownKey ? 'rotate-180' : ''}"
									/>
								</button>
								{#if mobileExpanded === link.dropdownKey}
									<div class="pb-2 pl-2">
										{#if dropdownConfigs[link.dropdownKey].sections}
											{#each dropdownConfigs[link.dropdownKey].sections as section}
												<div class="px-2 pt-2 pb-1 font-heading text-[10px] tracking-[0.12em] text-muted uppercase">
													{section.label}
												</div>
												{#each section.items as item}
													{#if !item.comingSoon}
														<a
															href={item.href}
															target={item.external ? '_blank' : undefined}
															rel={item.external ? 'noopener noreferrer' : undefined}
															class="flex items-center gap-3 px-2 py-2 text-muted transition-colors hover:text-surface"
															onclick={() => {
																trackNavItemClick('mobile_dropdown', item.label, item.href, link.dropdownKey);
																closeMobile();
															}}
														>
															{#if item.badge}
																{@render brandBadge(item.badge)}
															{:else if item.iconSrc}
																<img src={item.iconSrc} alt="" class="h-4 w-4" />
															{:else if item.icon}
																{@const Icon = item.icon}
																<Icon size={16} class="text-muted" />
															{/if}
															<span class="text-sm">{item.label}</span>
														</a>
													{/if}
												{/each}
											{/each}
										{:else}
											{#each getAllItems(dropdownConfigs[link.dropdownKey]) as item}
												<a
													href={item.href}
													target={item.external ? '_blank' : undefined}
													rel={item.external ? 'noopener noreferrer' : undefined}
													class="flex items-center gap-3 px-2 py-2.5 text-muted transition-colors hover:text-surface"
													onclick={() => {
														trackNavItemClick('mobile_dropdown', item.label, item.href, link.dropdownKey);
														closeMobile();
													}}
												>
													{#if item.iconSrc}
														<img src={item.iconSrc} alt="" class="h-4 w-4" />
													{:else if item.icon}
														{@const Icon = item.icon}
														<Icon size={16} class="text-muted" />
													{/if}
													<span class="text-sm">{item.label}</span>
												</a>
											{/each}
										{/if}
									</div>
								{/if}
							</div>
						{:else}
							<a
								href={link.href}
								class="py-3 text-surface transition-colors"
								onclick={() => {
									trackNavItemClick('mobile_link', link.label, link.href);
									closeMobile();
								}}
							>
								{link.label}
							</a>
						{/if}
					{/each}

					<div class="mt-2 border-t border-border/30 pt-4">
						<a
							href={registerHref}
							class="block font-bold text-primary transition-colors hover:text-primary/90"
							onclick={() => {
								trackNavCtaClick('Start sending', registerHref, 'mobile');
								closeMobile();
							}}
						>
							Start sending
						</a>
					</div>
				</div>
			</div>
		{/if}
	</nav>
</div>
