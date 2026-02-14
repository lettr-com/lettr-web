<script lang="ts">
	import { onMount } from 'svelte';
	import {
		List,
		X,
		CaretDown,
		CodeIcon,
		SparkleIcon,
		ArrowsLeftRightIcon,
		ChartBarIcon,
		ShieldCheckIcon,
		RobotIcon,
		HeadsetIcon,
		BookOpenIcon,
		ScalesIcon,
		PulseIcon,
		InfoIcon,
		EnvelopeSimpleIcon,
		ChatDotsIcon,
		WhatsappLogoIcon
	} from 'phosphor-svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';

	interface DropdownItem {
		icon?: typeof CodeIcon;
		iconSrc?: string;
		label: string;
		description: string;
		href: string;
		external?: boolean;
		comingSoon?: boolean;
	}

	interface DropdownSection {
		label: string;
		items: DropdownItem[];
	}

	interface DropdownConfig {
		items?: DropdownItem[];
		sections?: DropdownSection[];
		footer?: { label: string; href: string };
		wide?: boolean;
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

	const platformItems: DropdownItem[] = [
		{ icon: CodeIcon, label: 'Laravel Integration', description: 'One-line install, native facade, zero config', href: '/platform/laravel' },
		{ icon: SparkleIcon, label: 'Email Templates', description: 'Drag-and-drop editor, AI copy, 200+ templates', href: '/platform/templates' },
		{ icon: ArrowsLeftRightIcon, label: 'Template Sync', description: 'Two-way sync between Blade and Lettr', href: '/platform/sync' },
		{ icon: ChartBarIcon, label: 'Analytics & Monitoring', description: 'Real-time delivery metrics and alerts', href: '/platform/analytics' },
		{ icon: ShieldCheckIcon, label: 'Deliverability', description: 'DKIM, DMARC, dedicated IPs, blocklist monitoring', href: '/platform/deliverability' },
		{ icon: RobotIcon, label: 'MCP Integration', description: 'Connect AI agents and LLMs to Lettr', href: '/platform/mcp' }
	];

	const resourcesItems: DropdownItem[] = [
		{ icon: HeadsetIcon, label: 'Support & Contact', description: 'Get help or reach out to our team', href: '/support' },
		{ icon: BookOpenIcon, label: 'Docs', description: 'Guides, API reference, and examples', href: 'https://docs.lettr.com', external: true },
		{ icon: ScalesIcon, label: 'Compare & Migrate', description: 'See how Lettr compares to other providers', href: '/compare' },
		{ icon: PulseIcon, label: 'Status', description: 'System uptime and incident history', href: 'https://status.lettr.com', external: true },
		{ icon: EnvelopeSimpleIcon, label: 'Changelog', description: 'Latest updates and improvements', href: '/changelog' }
	];

	const companyItems: DropdownItem[] = [
		{ icon: InfoIcon, label: 'About', description: 'Our story, team, and mission', href: '/about' },
		{ iconSrc: '/images/logos/lettr-icon.svg', label: 'Lettr', description: 'Email API for developer artisans', href: '/' },
		{ iconSrc: '/images/logos/topol-icon.svg', label: 'Topol', description: 'Email builder for beautiful templates', href: 'https://topol.io', external: true },
		{ iconSrc: '/images/logos/dmarceye-icon.svg', label: 'DMARCeye', description: 'Email security and deliverability', href: 'https://dmarceye.com', external: true }
	];

	const integrationsSections: DropdownSection[] = [
		{
			label: 'SDKs',
			items: [
				{ iconSrc: '/images/icons/laravel.svg', label: 'Laravel', description: 'First-class Laravel package', href: 'https://docs.lettr.com/quickstart/laravel/introduction', external: true },
				{ iconSrc: '/images/icons/php.svg', label: 'PHP', description: 'Standalone PHP SDK', href: 'https://docs.lettr.com/quickstart/php/introduction', external: true },
				{ iconSrc: '/images/icons/node-js.svg', label: 'Node.js', description: 'JavaScript & TypeScript', href: '#', comingSoon: true },
				{ iconSrc: '/images/icons/python.svg', label: 'Python', description: 'Python client library', href: 'https://github.com/lettr-com/lettr-python', external: true },
				{ iconSrc: '/images/icons/golang.svg', label: 'Go', description: 'Go client library', href: 'https://github.com/lettr-com/lettr-go', external: true },
				{ iconSrc: '/images/icons/java.svg', label: 'Java', description: 'Java client library', href: 'https://github.com/lettr-com/lettr-java', external: true },
				{ iconSrc: '/images/icons/rust.svg', label: 'Rust', description: 'Rust client library', href: 'https://github.com/lettr-com/lettr-rust', external: true }
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
		platform: { items: platformItems, footer: { label: 'View all features', href: '/#features' } },
		integrations: { sections: integrationsSections, wide: true, footer: { label: 'View documentation', href: 'https://docs.lettr.com' } },
		company: { items: companyItems },
		resources: { items: resourcesItems, footer: { label: 'Visit documentation', href: 'https://docs.lettr.com' } }
	};

	const navLinks: NavLink[] = [
		{ label: 'Platform', href: '/#features', dropdownKey: 'platform' },
		{ label: 'Integrations', href: '/#code', dropdownKey: 'integrations' },
		{ label: 'Pricing', href: '/#pricing' },
		{ label: 'Company', href: '#', dropdownKey: 'company' },
		{ label: 'Resources', href: '#', dropdownKey: 'resources' }
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
		openDropdown = key;
	}

	function handleMouseLeave() {
		closeTimer = setTimeout(() => {
			openDropdown = null;
		}, 150);
	}

	function toggleMobile() {
		mobileOpen = !mobileOpen;
	}

	function closeMobile() {
		mobileOpen = false;
		mobileExpanded = null;
	}

	function toggleMobileMenu(key: string) {
		mobileExpanded = mobileExpanded === key ? null : key;
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

<div class="fixed top-[-1px] right-0 left-0 z-50 flex items-start justify-center px-4 narrow:px-0">
	<!-- Desktop logo (outer left) -->
	<div class="hidden h-[60px] shrink-0 items-center pr-4 md:flex">
		<a href="/" class="flex items-center">
			<img src="/logo.svg" alt="Lettr" class="h-5" />
		</a>
	</div>

	<nav
		bind:this={nav}
		class="glass flex flex-col w-full max-w-[624px] narrow:max-w-none border-r border-l border-border/30 narrow:border-x-0 shadow-[0_0_40px_-10px_rgba(236,16,75,0.15)]"
		aria-label="Main navigation"
	>
		<div class="flex h-[60px] w-full items-center justify-between px-4 py-2.5 md:justify-center">
			<!-- Mobile logo -->
			<a href="/" class="flex items-center md:hidden">
				<img src="/logo.svg" alt="Lettr" class="h-5" />
			</a>

			<!-- Desktop nav links -->
			<div class="hidden items-center justify-center gap-1 md:flex">
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
									class="absolute top-full left-1/2 mt-2 -translate-x-1/2 border border-border/50 bg-white shadow-[0_16px_48px_rgba(0,0,0,0.1)] {ddConfig?.wide ? 'w-[480px]' : 'w-[300px]'}"
								>
									{#if ddConfig?.sections}
										<div class="grid {ddConfig.sections.length > 1 ? 'sm:grid-cols-2' : ''}">
											{#each ddConfig.sections as section, si}
												<div class="p-3 {si > 0 ? 'border-t border-border/30 sm:border-t-0 sm:border-l' : ''}">
													<div class="mb-1 px-3 py-1.5 font-heading text-[10px] tracking-[0.12em] text-muted uppercase">
														{section.label}
													</div>
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
																class="group flex items-start gap-3 px-3 py-2 transition-colors hover:bg-background"
																onclick={() => (openDropdown = null)}
															>
																<div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-border/50 bg-background transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
																	{#if item.iconSrc}
																		<img src={item.iconSrc} alt="" class="h-4 w-4" />
																	{/if}
																</div>
																<div>
																	<span class="text-[13px] font-medium text-surface">{item.label}</span>
																	<div class="mt-0.5 text-[12px] leading-snug text-muted">{item.description}</div>
																</div>
															</a>
														{/if}
													{/each}
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
													onclick={() => (openDropdown = null)}
												>
													<div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border border-border/50 bg-background transition-colors group-hover:border-primary/30 group-hover:bg-primary/5">
														{#if item.iconSrc}
															<img src={item.iconSrc} alt="" class="h-3.5 w-3.5" />
														{:else if item.icon}
															<svelte:component this={item.icon} size={14} class="text-muted transition-colors group-hover:text-primary" />
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
												onclick={() => (openDropdown = null)}
											>
												{ddConfig.footer.label} &rarr;
											</a>
										</div>
									{/if}
								</div>
							{/if}
						</div>
					{:else}
						<a href={link.href} class="px-2.5 py-2 text-sm text-muted transition-colors hover:text-surface">
							{link.label}
						</a>
					{/if}
				{/each}

				<!-- Docs link -->
				<div class="relative ml-1">
					<a
						href="https://docs.lettr.com/introduction"
						target="_blank"
						rel="noopener noreferrer"
						class="px-2.5 py-2 text-sm text-muted transition-colors hover:text-surface"
					>
						Docs
					</a>
					<div class="absolute top-1.5 right-0 h-[6px] w-[6px] rotate-45 bg-primary"></div>
				</div>
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
															onclick={closeMobile}
														>
															{#if item.iconSrc}
																<img src={item.iconSrc} alt="" class="h-4 w-4" />
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
													onclick={closeMobile}
												>
													{#if item.iconSrc}
														<img src={item.iconSrc} alt="" class="h-4 w-4" />
													{:else if item.icon}
														<svelte:component this={item.icon} size={16} class="text-muted" />
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
								onclick={closeMobile}
							>
								{link.label}
							</a>
						{/if}
					{/each}

					<div class="mt-2 border-t border-border/30 pt-4">
						<div class="relative w-fit">
							<a
								href="https://docs.lettr.com/introduction"
								target="_blank"
								rel="noopener noreferrer"
								class="text-surface transition-colors"
								onclick={closeMobile}
							>
								Docs
							</a>
							<div class="absolute top-0 right-[-8px] h-[6px] w-[6px] rotate-45 bg-primary"></div>
						</div>
						<a
							href={registerHref}
							class="mt-4 block font-bold text-primary transition-colors hover:text-primary/90"
							onclick={closeMobile}
						>
							Sign Up
						</a>
					</div>
				</div>
			</div>
		{/if}
	</nav>

	<!-- Desktop right side (outer right) -->
	<div class="hidden h-[60px] shrink-0 items-center pl-4 md:flex">
		<a
			href={registerHref}
			class="text-primary text-sm font-bold transition-colors hover:text-primary/90"
		>
			Sign Up
		</a>
	</div>
</div>
