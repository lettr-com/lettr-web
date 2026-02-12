<script lang="ts">
	import { onMount } from 'svelte';
	import { List, X } from 'phosphor-svelte';
	import { createFromAnimationCleanup } from '$lib/utils/gsap';

	let nav: HTMLElement | undefined = $state();
	let mobileOpen: boolean = $state(false);

	onMount(() => {
		if (!nav) return;

		return createFromAnimationCleanup({
			scope: nav,
			targets: nav,
			vars: { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' }
		});
	});

	function toggleMobile() {
		mobileOpen = !mobileOpen;
	}

	function closeMobile() {
		mobileOpen = false;
	}

	const navLinks = [
		{ label: 'Features', href: '/#features' },
		{ label: 'Pricing', href: '/#pricing' }
	];

	const rightLinks = [
		{ label: 'Docs', href: 'https://docs.lettr.com/introduction' },
		{ label: 'Sign Up', href: 'https://app.lettr.com/register', primary: true }
	];
</script>

<div class="fixed border border-border/30 top-[-1px] right-0 left-0 z-50 flex justify-center px-4 narrow:px-0">
	<nav
		bind:this={nav}
		class="glass flex flex-col w-full max-w-[600px] narrow:max-w-none border-r border-l border-border/30 narrow:border-x-0 shadow-[0_0_40px_-10px_rgba(236,16,75,0.15)]"
		aria-label="Main navigation"
	>
		<div class="flex h-[60px] w-full items-center justify-between px-4 py-2.5">
			<div class="hidden w-[120px] md:flex">
				<a href="/" class="flex items-center">
					<img src="/logo.svg" alt="Lettr" class="h-5" />
				</a>
			</div>
			<a href="/" class="flex items-center md:hidden">
				<img src="/logo.svg" alt="Lettr" class="h-5" />
			</a>

			<div class="hidden flex-1 items-center justify-center gap-4 pr-3 md:flex">
				<div class="flex items-center justify-center w-[60px]">
					<a href="/#features" class="text-sm text-muted transition-colors hover:text-surface">
						Features
					</a>
				</div>
				<div class="flex items-center justify-center w-[60px]">
					<a href="/#pricing" class="text-sm text-muted transition-colors hover:text-surface">
						Pricing
					</a>
				</div>
			</div>

			<div class="hidden w-[120px] items-center justify-end gap-6 md:flex">
				{#each rightLinks as link}
					{#if link.primary}
						<a
							href={link.href}
							target={link.href.startsWith('http') ? '_blank' : undefined}
							rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
							class="text-primary text-sm font-bold transition-colors hover:text-primary/90"
						>
							{link.label}
						</a>
					{:else}
					<div class="relative">
						<a
							href={link.href}
							target={link.href.startsWith('http') ? '_blank' : undefined}
							rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
							class="text-sm text-muted transition-colors hover:text-surface"
						>
							{link.label}
						</a>
						<div class="absolute top-0 right-[-8px] h-[6px] w-[6px] rotate-45 bg-primary"></div>
					</div>
					{/if}
				{/each}
			</div>

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

		{#if mobileOpen}
			<div class="border-t border-border/30 px-4 pb-6 md:hidden">
				<div class="flex flex-col gap-5 pt-5">
					{#each [...navLinks, ...rightLinks] as link}
						{#if 'primary' in link && link.primary}
							<a
								href={link.href}
								class="font-bold text-primary transition-colors hover:text-primary/90"
								onclick={closeMobile}
							>
								{link.label}
							</a>
						{:else if link.label === 'Docs'}
							<div class="relative w-fit">
								<a
									href={link.href}
									target={link.href.startsWith('http') ? '_blank' : undefined}
									rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
									class="font-normal text-surface transition-colors"
									onclick={closeMobile}
								>
									{link.label}
								</a>
								<div class="absolute top-0 right-[-8px] h-[6px] w-[6px] rotate-45 bg-primary"></div>
							</div>
						{:else}
							<a
								href={link.href}
								class="font-normal text-surface transition-colors"
								onclick={closeMobile}
							>
								{link.label}
							</a>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</nav>
</div>
