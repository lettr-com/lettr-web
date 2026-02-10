<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { List, X } from 'phosphor-svelte';

	let nav: HTMLElement | undefined = $state();
	let mobileOpen: boolean = $state(false);

	onMount(() => {
		if (!nav) return;
		gsap.from(nav, { y: -20, opacity: 0, duration: 0.6, ease: 'power2.out' });
	});

	function toggleMobile() {
		mobileOpen = !mobileOpen;
	}

	function closeMobile() {
		mobileOpen = false;
	}

	const navLinks = [
		{ label: 'Features', href: '#features' },
		{ label: 'Pricing', href: '#pricing' }
	];

	const rightLinks = [
		{ label: 'Docs', href: '#docs' },
		{ label: 'Sign Up', href: '#signup', primary: true }
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

			<div class="hidden flex-1 items-center justify-center gap-6 md:flex">
				{#each navLinks as link}
					<a href={link.href} class="text-sm text-muted transition-colors hover:text-surface">
						{link.label}
					</a>
				{/each}
			</div>

			<div class="hidden w-[120px] items-center justify-end gap-4 md:flex">
				{#each rightLinks as link}
					{#if link.primary}
						<a
							href={link.href}
							class="text-primary text-sm font-bold transition-colors hover:text-primary/90"
						>
							{link.label}
						</a>
					{:else}
						<a href={link.href} class="text-sm text-muted transition-colors hover:text-surface">
							{link.label}
						</a>
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
						<a
							href={link.href}
							class="text-base transition-colors hover:text-surface {'primary' in link && link.primary ? 'font-bold text-primary' : 'font-normal text-muted'}"
							onclick={closeMobile}
						>
							{link.label}
						</a>
					{/each}
				</div>
			</div>
		{/if}
	</nav>
</div>
