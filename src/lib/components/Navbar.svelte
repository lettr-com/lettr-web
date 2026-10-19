<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import CaretDown from 'phosphor-svelte/lib/CaretDown';
	import List from 'phosphor-svelte/lib/List';
	import X from 'phosphor-svelte/lib/X';
	import MobileMenu from '$lib/components/nav/MobileMenu.svelte';
	import NavPanel from '$lib/components/nav/NavPanel.svelte';
	import SalesStrip from '$lib/components/nav/SalesStrip.svelte';
	import {
		activeSection,
		menus,
		pricingHref,
		salesHref,
		signInHref,
		type MenuKey,
		type NavItem
	} from '$lib/navigation/menu';
	import { isStripAllowed, nextStripVisibility, salesPromptFor } from '$lib/navigation/salesStrip';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSigninClick, trackSignupClick } from '$lib/analytics/posthog';

	const openDelay = 80;
	const closeDelay = 180;
	// Match the keyframes in app.css: menus slide for 250ms, the viewport tilts away in 200ms.
	const exitDuration = 250;
	const closeDuration = 200;

	type Motion = 'none' | 'from-start' | 'from-end' | 'to-start' | 'to-end';
	interface MenuLayer {
		key: MenuKey;
		motion: Motion;
	}
	const closeOnScrollDistance = 40;
	const stripDismissKey = 'lettr_sales_strip_dismissed';

	let header: HTMLElement | undefined = $state();
	let mobileToggle: HTMLButtonElement | undefined = $state();
	let openMenu: MenuKey | null = $state(null);
	// One shared viewport (as on laravel.com): it stays mounted while the visitor moves between
	// menus, morphs its height, and slides the new content in from the side of the new trigger.
	let layers: MenuLayer[] = $state([]);
	let viewportState: 'open' | 'closed' | null = $state(null);
	let viewportHeight = $state(0);
	let isHeightInstant = $state(true);
	const layerEls: Partial<Record<MenuKey, HTMLElement>> = {};
	let mobileOpen = $state(false);
	let isScrolled = $state(false);
	let stripReached = $state(false);
	let stripDismissed = $state(false);
	let footerInView = $state(false);
	let registerHref = $state(registerUrl);

	let openTimer: ReturnType<typeof setTimeout> | null = null;
	let unmountTimer: ReturnType<typeof setTimeout> | null = null;
	let closeTimer: ReturnType<typeof setTimeout> | null = null;
	let openedByHoverAt = 0;
	let scrollYAtOpen = 0;
	let stripTracked = false;

	const menuOrder = menus.map((menu) => menu.key);
	const menuByKey = Object.fromEntries(menus.map((menu) => [menu.key, menu])) as Record<
		MenuKey,
		(typeof menus)[number]
	>;
	const layerMotion: Record<Motion, string> = {
		none: '',
		'from-start': 'nav-enter-from-left',
		'from-end': 'nav-enter-from-right',
		'to-start': 'nav-exit-to-left',
		'to-end': 'nav-exit-to-right'
	};

	const pathname = $derived(page.url.pathname);
	const current = $derived(activeSection(pathname));
	const prompt = $derived(salesPromptFor(pathname));
	const showStrip = $derived(
		isStripAllowed(pathname) && stripReached && !stripDismissed && !footerInView && !mobileOpen
	);

	const focusRing =
		'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

	function clearTimers() {
		if (openTimer) clearTimeout(openTimer);
		if (closeTimer) clearTimeout(closeTimer);
		openTimer = null;
		closeTimer = null;
	}

	function setMenu(key: MenuKey | null, device: 'desktop' | 'mobile' = 'desktop') {
		if (key === openMenu) return;
		const previous = openMenu;
		if (unmountTimer) clearTimeout(unmountTimer);
		unmountTimer = null;

		if (key && previous) {
			// Moving right slides the new menu in from the right and the old one out to the left.
			const forward = menuOrder.indexOf(key) > menuOrder.indexOf(previous);
			isHeightInstant = false;
			layers = [
				{ key: previous, motion: forward ? 'to-start' : 'to-end' },
				{ key, motion: forward ? 'from-end' : 'from-start' }
			];
			unmountTimer = setTimeout(() => {
				layers = layers.filter((layer) => layer.key === openMenu);
			}, exitDuration);
		} else if (key) {
			isHeightInstant = viewportState === null;
			layers = [{ key, motion: 'none' }];
			viewportState = 'open';
		} else {
			viewportState = 'closed';
			unmountTimer = setTimeout(() => {
				viewportState = null;
				layers = [];
			}, closeDuration);
		}

		if (key) {
			scrollYAtOpen = window.scrollY;
			void capturePosthogEvent('nav_dropdown_opened', { dropdown: key, device });
		}
		openMenu = key;
	}

	function focusables(root: HTMLElement | null | undefined): HTMLElement[] {
		return root ? [...root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')] : [];
	}

	function triggerFor(key: MenuKey): HTMLElement | null {
		return document.querySelector<HTMLElement>(`[aria-controls="nav-panel-${key}"]`);
	}

	// The viewport sits after the triggers in the DOM, so Tab is routed by hand:
	// open trigger -> its links -> the next trigger, and Shift+Tab back out to the trigger.
	function handleViewportKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab' || !openMenu) return;
		const links = focusables(layerEls[openMenu]);
		const target = event.target as HTMLElement;
		if (event.shiftKey && target === links[0]) {
			event.preventDefault();
			triggerFor(openMenu)?.focus();
		} else if (!event.shiftKey && target === links.at(-1)) {
			event.preventDefault();
			const index = menuOrder.indexOf(openMenu);
			const next =
				index < menuOrder.length - 1
					? triggerFor(menuOrder[index + 1])
					: header?.querySelector<HTMLElement>(`a[href="${pricingHref}"]`);
			closeAll();
			next?.focus();
		}
	}

	function handleHeaderFocusOut(event: FocusEvent) {
		const next = event.relatedTarget as Node | null;
		if (openMenu && next && header && !header.contains(next)) closeAll();
	}

	function handlePointerEnter(event: PointerEvent, key: MenuKey) {
		if (event.pointerType !== 'mouse') return;
		clearTimers();
		if (openMenu) {
			setMenu(key);
			return;
		}
		openTimer = setTimeout(() => {
			openedByHoverAt = Date.now();
			setMenu(key);
		}, openDelay);
	}

	function handlePointerLeave(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		clearTimers();
		closeTimer = setTimeout(() => setMenu(null), closeDelay);
	}

	function handleTriggerClick(key: MenuKey) {
		clearTimers();
		// A click that lands right after hover opened the menu should not close it again.
		if (openMenu === key && Date.now() - openedByHoverAt < 400) return;
		setMenu(openMenu === key ? null : key);
	}

	async function focusFirstLink(key: MenuKey) {
		await tick();
		document.getElementById(`nav-panel-${key}`)?.querySelector<HTMLElement>('a')?.focus();
	}

	function handleTriggerKeydown(event: KeyboardEvent, key: MenuKey) {
		const intoPanel = event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey && openMenu === key);
		if (!intoPanel) return;
		event.preventDefault();
		clearTimers();
		setMenu(key);
		void focusFirstLink(key);
	}

	// Keep the viewport height in step with the menu being shown, including on resize.
	$effect(() => {
		if (!openMenu || !viewportState) return;
		const element = layerEls[openMenu];
		if (!element) return;
		viewportHeight = element.offsetHeight;
		const observer = new ResizeObserver(() => {
			viewportHeight = element.offsetHeight;
		});
		observer.observe(element);
		return () => observer.disconnect();
	});

	function closeAll(returnFocus = false) {
		const wasOpen = openMenu;
		clearTimers();
		setMenu(null);
		if (returnFocus && wasOpen) {
			document.querySelector<HTMLElement>(`[aria-controls="nav-panel-${wasOpen}"]`)?.focus();
		}
	}

	function toggleMobile() {
		mobileOpen = !mobileOpen;
		void capturePosthogEvent('nav_mobile_toggled', { open: mobileOpen });
	}

	function closeMobile(returnFocus = false) {
		if (!mobileOpen) return;
		mobileOpen = false;
		if (returnFocus) mobileToggle?.focus();
	}

	function trackLink(
		item: NavItem,
		location: 'dropdown' | 'mobile_dropdown' | 'mobile_link' | 'top_level' | 'logo',
		dropdown: MenuKey | null
	) {
		void capturePosthogEvent('nav_link_clicked', {
			location,
			label: item.label,
			href: item.href,
			dropdown,
			is_external: /^https?:\/\//.test(item.href)
		});
	}

	function trackCta(
		label: 'Sign in' | 'Get started' | 'Contact sales',
		href: string,
		placement: 'desktop' | 'mobile' | 'sales_strip'
	) {
		void capturePosthogEvent('cta_clicked', {
			placement: `navbar_${placement}`,
			label,
			href,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (label === 'Sign in') trackSigninClick(`navbar_${placement}`, href);
		if (label === 'Get started') trackSignupClick(`navbar_${placement}`, href);
	}

	function dismissStrip() {
		stripDismissed = true;
		try {
			sessionStorage.setItem(stripDismissKey, '1');
		} catch {
			// Private mode or blocked storage: the strip stays hidden for this page view only.
		}
		void capturePosthogEvent('nav_sales_strip_dismissed', { page_path: pathname });
	}

	function measureScroll() {
		const root = document.documentElement;
		const snapshot = {
			scrollY: window.scrollY,
			scrollHeight: root.scrollHeight,
			viewportHeight: window.innerHeight
		};
		isScrolled = snapshot.scrollY > 8;
		stripReached = nextStripVisibility(stripReached, snapshot);
		if (openMenu && Math.abs(snapshot.scrollY - scrollYAtOpen) > closeOnScrollDistance) {
			setMenu(null);
		}
	}

	$effect(() => {
		if (!showStrip || stripTracked) return;
		stripTracked = true;
		void capturePosthogEvent('nav_sales_strip_shown', { page_path: pathname });
	});

	// Lock page scroll behind the mobile sheet.
	$effect(() => {
		if (!mobileOpen) return;
		const root = document.documentElement;
		const previous = root.style.overflow;
		root.style.overflow = 'hidden';
		return () => {
			root.style.overflow = previous;
		};
	});

	afterNavigate(() => {
		closeAll();
		mobileOpen = false;
		stripReached = false;
		stripTracked = false;
		requestAnimationFrame(measureScroll);
	});

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
		try {
			stripDismissed = sessionStorage.getItem(stripDismissKey) === '1';
		} catch {
			stripDismissed = false;
		}

		// One measurement per frame at most, and state only changes when a threshold
		// is crossed, so scrolling does not re-render the header.
		let frame = 0;
		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(() => {
				frame = 0;
				measureScroll();
			});
		};

		const onKeydown = (event: KeyboardEvent) => {
			if (event.key !== 'Escape') return;
			if (mobileOpen) closeMobile(true);
			else if (openMenu) closeAll(true);
		};

		const onPointerDown = (event: PointerEvent) => {
			if (openMenu && header && !header.contains(event.target as Node)) closeAll();
		};

		const desktopQuery = window.matchMedia('(min-width: 1024px)');
		const onBreakpoint = () => {
			if (desktopQuery.matches) mobileOpen = false;
			else closeAll();
		};

		// The footer has its own sign-up block; the strip steps aside while it is on screen.
		const footer = document.querySelector('footer');
		const footerObserver = footer
			? new IntersectionObserver(([entry]) => {
					footerInView = entry.isIntersecting;
				})
			: null;
		if (footer) footerObserver?.observe(footer);

		measureScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });
		window.addEventListener('keydown', onKeydown);
		document.addEventListener('pointerdown', onPointerDown);
		desktopQuery.addEventListener('change', onBreakpoint);

		return () => {
			cancelAnimationFrame(frame);
			clearTimers();
			footerObserver?.disconnect();
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			window.removeEventListener('keydown', onKeydown);
			document.removeEventListener('pointerdown', onPointerDown);
			desktopQuery.removeEventListener('change', onBreakpoint);
		};
	});
</script>

<header bind:this={header} class="fixed inset-x-0 top-0 z-50" onfocusout={handleHeaderFocusOut}>
	<nav
		aria-label="Main"
		class="relative z-10 border-b bg-white transition-colors duration-200 {isScrolled || openMenu || mobileOpen
			? 'border-[#E9E2E5]'
			: 'border-transparent'}"
	>
		<div
			class="mx-auto flex h-[55px] max-w-[1200px] items-center justify-between pr-3 pl-4 lg:h-[59px] lg:px-6"
		>
			<div class="flex items-center gap-9">
				<a
					href="/"
					class="flex shrink-0 items-center {focusRing}"
					onclick={() => trackLink({ label: 'Lettr logo', href: '/' }, 'logo', null)}
				>
					<img src="/logo.svg" alt="Lettr home" class="h-5" />
				</a>

				<ul class="hidden items-center gap-0.5 lg:flex">
					{#each menus as menu (menu.key)}
						{@const isOpen = openMenu === menu.key}
						<li
							class="flex h-[59px] items-center"
							onpointerenter={(event) => handlePointerEnter(event, menu.key)}
							onpointerleave={handlePointerLeave}
						>
							<button
								type="button"
								class="relative flex h-9 items-center gap-1.5 px-3 text-sm transition-colors {focusRing} {isOpen
									? 'bg-background text-surface'
									: 'text-[#1F2937] hover:bg-background hover:text-surface'} {current === menu.key
									? 'font-semibold text-surface'
									: 'font-medium'}"
								aria-expanded={isOpen}
								aria-controls="nav-panel-{menu.key}"
								onclick={() => handleTriggerClick(menu.key)}
								onkeydown={(event) => handleTriggerKeydown(event, menu.key)}
							>
								{menu.label}
								<CaretDown
									size={12}
									class="text-subtle transition-transform duration-200 motion-reduce:transition-none {isOpen
										? 'rotate-180'
										: ''}"
									aria-hidden="true"
								/>
								{#if current === menu.key}
									<span class="absolute inset-x-3 -bottom-3 h-0.5 bg-primary" aria-hidden="true"></span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>

			<div class="flex items-center gap-1.5 lg:gap-5">
				<a
					href={pricingHref}
					aria-current={current === 'pricing' ? 'page' : undefined}
					class="group relative flex h-10 items-center gap-2 px-2 text-sm font-semibold transition-colors lg:px-1 {focusRing} {current ===
					'pricing'
						? 'text-primary'
						: 'text-surface hover:text-primary'}"
					onclick={() => trackLink({ label: 'Pricing', href: pricingHref }, 'top_level', null)}
				>
					<span
						class="size-1.5 bg-primary transition-transform duration-150 group-hover:rotate-45 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"
						aria-hidden="true"
					></span>
					Pricing
					{#if current === 'pricing'}
						<span class="absolute inset-x-0 -bottom-2.5 hidden h-0.5 bg-primary lg:block" aria-hidden="true"
						></span>
					{/if}
				</a>

				<span class="hidden h-5 w-px bg-[#E3DCDF] lg:block" aria-hidden="true"></span>

				<a
					href={signInHref}
					class="hidden text-sm font-medium text-[#1F2937] underline-offset-4 transition-colors hover:text-surface hover:underline lg:block {focusRing}"
					onclick={() => trackCta('Sign in', signInHref, 'desktop')}
				>
					Sign in
				</a>

				<a
					href={registerHref}
					class="flex items-center bg-fade-primary-strong px-3 py-[7px] text-[13px] leading-5 font-semibold text-white transition-colors hover:bg-fade-primary-strong/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface max-[359px]:hidden lg:px-4 lg:py-2 lg:text-sm lg:leading-[21px]"
					onclick={() =>
						trackCta(
							'Get started',
							registerHref,
							window.matchMedia('(min-width: 1024px)').matches ? 'desktop' : 'mobile'
						)}
				>
					Get started
				</a>

				<button
					bind:this={mobileToggle}
					type="button"
					class="flex size-10 items-center justify-center text-surface transition-colors lg:hidden {focusRing} {mobileOpen
						? 'bg-background'
						: ''}"
					aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileOpen}
					aria-controls="mobile-menu"
					onclick={toggleMobile}
				>
					{#if mobileOpen}
						<X size={20} aria-hidden="true" />
					{:else}
						<List size={22} aria-hidden="true" />
					{/if}
				</button>
			</div>
		</div>

		{#if viewportState}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="absolute inset-x-0 top-full z-20 hidden perspective-[2000px] lg:block"
				onpointerenter={(event) => event.pointerType === 'mouse' && clearTimers()}
				onpointerleave={handlePointerLeave}
				onkeydown={handleViewportKeydown}
			>
				<div
					data-state={viewportState}
					class="relative origin-top overflow-hidden border-y border-t-hairline border-b-[#E9E2E5] bg-white shadow-[0_24px_48px_-24px_rgba(35,2,11,0.18)] {viewportState ===
					'open'
						? 'nav-scale-in'
						: 'nav-scale-out'} {isHeightInstant
						? ''
						: 'transition-[height] duration-250 ease-out motion-reduce:transition-none'}"
					style:height="{viewportHeight}px"
				>
					{#each layers as layer (layer.key)}
						<div
							bind:this={layerEls[layer.key]}
							class="absolute inset-x-0 top-0 {layerMotion[layer.motion]}"
							inert={layer.key !== openMenu}
						>
							<NavPanel
								menu={menuByKey[layer.key]}
								id="nav-panel-{layer.key}"
								{pathname}
								onLinkClick={(item) => {
									trackLink(item, 'dropdown', layer.key);
									closeAll();
								}}
							/>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</nav>

	{#if isStripAllowed(pathname)}
		<SalesStrip
			visible={showStrip}
			{prompt}
			onContact={() => trackCta('Contact sales', salesHref, 'sales_strip')}
			onDismiss={dismissStrip}
		/>
	{/if}

	{#if mobileOpen}
		<MobileMenu
			id="mobile-menu"
			{pathname}
			{registerHref}
			onDrill={(key) => void capturePosthogEvent('nav_dropdown_opened', { dropdown: key, device: 'mobile' })}
			onLinkClick={(item, menu) => {
				trackLink(item, menu ? 'mobile_dropdown' : 'mobile_link', menu);
				closeMobile();
			}}
			onCta={(label, href) => {
				trackCta(label, href, 'mobile');
				closeMobile();
			}}
		/>
	{/if}
</header>
