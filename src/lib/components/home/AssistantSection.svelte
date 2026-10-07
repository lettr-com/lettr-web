<script lang="ts">
	import { onMount } from 'svelte';
	import DitheredFace from './DitheredFace.svelte';
	import Button from '$lib/components/Button.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	// Chat-style notes from the designer, each indented a little differently
	const notes = [
		{ text: 'Yo.', indent: 'md:ml-[71px]' },
		{ text: 'I designed this site.', indent: 'md:ml-[10px]' },
		{ text: 'You think emails scare me?', indent: 'md:ml-[49px]' }
	];

	let section: HTMLElement | undefined = $state();
	let isVisible = $state(false);
	let registerHref: string = $state(registerUrl);

	function trackCta() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'home_assistant',
			label: 'Get started',
			href: registerHref,
			variant: 'primary',
			destination_type: /^https?:\/\//.test(registerHref) ? 'external' : 'internal'
		});
		trackSignupClick('home_assistant', registerHref);
	}

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
		if (!section) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			isVisible = true;
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				isVisible = true;
				observer.disconnect();
			},
			{ threshold: 0.4 }
		);
		observer.observe(section);
		return () => observer.disconnect();
	});
</script>

<section bind:this={section} aria-labelledby="assistant-heading" class="py-14 md:py-24">
	<h2
		id="assistant-heading"
		class="mx-auto mb-10 flex max-w-[860px] flex-col items-center text-center font-heading text-[1.875rem] leading-[38px] tracking-[-0.02em] text-surface md:mb-14 md:text-[2.625rem] md:leading-[49px]"
	>
		<span>
			Let our AI
			<em class="block font-serif text-[2.125rem] leading-[38px] font-medium text-primary md:inline md:text-[2.875rem] md:leading-[46px]">assistant,</em>
		</span>
		<span>
			set you up in
			<em class="block font-serif text-[2.125rem] leading-[38px] font-medium text-primary md:inline md:text-[2.875rem] md:leading-[46px]">an instant.</em>
		</span>
	</h2>

	<div data-markdown="skip" class="mx-auto mb-10 flex max-w-[640px] items-center justify-center gap-4 md:mb-14 md:gap-0">
		<div
			class="h-[110px] w-[110px] shrink-0 rotate-[9.39deg] transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none md:h-[164px] md:w-[164px] {isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}"
		>
			<DitheredFace src="/hero/designer.png" class="h-full w-full" />
		</div>
		<div class="flex flex-col gap-1 md:gap-3">
			{#each notes as note, i}
				<p
					class="m-0 font-serif text-xl leading-[26px] text-muted italic transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none md:text-2xl md:leading-[30px] {note.indent} {isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}"
					style="transition-delay: {isVisible ? 350 + i * 450 : 0}ms"
				>
					{note.text}
				</p>
			{/each}
		</div>
	</div>

	<div class="mx-auto flex max-w-[1100px] justify-center">
		<Button variant="primary" size="hero" href={registerHref} onclick={trackCta}>Get started</Button>
	</div>
</section>
