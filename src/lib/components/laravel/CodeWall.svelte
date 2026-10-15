<script lang="ts">
	import { onMount } from 'svelte';
	import CopyIcon from 'phosphor-svelte/lib/CopyIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import Button from '$lib/components/Button.svelte';
	import { capturePosthogEvent } from '$lib/analytics/posthog';
	import { orderShippedDto, orderShippedMailable, shipOrderCall, templateEnum } from '$lib/laravel/snippets';

	interface Props {
		/** Shiki-highlighted lines, one HTML string per line, from the page load. */
		highlighted: { mailable: string[]; call: string[]; templateEnum: string[]; dto: string[] };
	}

	let { highlighted }: Props = $props();

	const typeSafetyHref = 'https://docs.lettr.com/quickstart/laravel/type-safety';
	const fileLine = (path: string) => `<span style="color:#6b7280">// ${path}</span>`;

	// Each track holds two copies, so drifting by exactly one copy loops seamlessly.
	const twice = (lines: string[]) => [...lines, ...lines].join('\n');
	const front = $derived(
		twice([
			fileLine(orderShippedMailable.path),
			'',
			...highlighted.mailable,
			'',
			'',
			fileLine(shipOrderCall.path),
			'',
			...highlighted.call,
			'',
			''
		])
	);
	const back = $derived(
		twice([
			fileLine(templateEnum.path),
			'',
			...highlighted.templateEnum,
			'',
			'',
			fileLine(orderShippedDto.path),
			'',
			...highlighted.dto,
			'',
			''
		])
	);

	let section: HTMLElement | undefined = $state();
	let stage: HTMLElement | undefined = $state();
	let copied = $state(false);
	// Off screen the drift pauses, so it stops asking the compositor for a frame every vsync.
	let idle = $state(false);
	let copiedTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyMailable() {
		try {
			// The clean file, never the decorated, duplicated display.
			await navigator.clipboard.writeText(`${orderShippedMailable.code}\n`);
		} catch {
			return;
		}
		copied = true;
		clearTimeout(copiedTimer);
		copiedTimer = setTimeout(() => (copied = false), 1800);
		void capturePosthogEvent('code_copied', { placement: 'laravel_code_wall', snippet: 'OrderShipped.php' });
	}

	function trackGuide() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'laravel_code_wall',
			label: 'Type safety guide',
			href: typeSafetyHref,
			variant: 'secondary',
			destination_type: 'external'
		});
	}

	onMount(() => {
		if (!section || !stage) return;
		const target = section;
		const planes = stage;
		const visibility = new IntersectionObserver(([entry]) => (idle = !entry.isIntersecting));
		visibility.observe(target);

		// Browsers with scroll-driven animations run the parallax in CSS, off the main thread.
		if (
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			CSS.supports('animation-timeline: view()')
		) {
			return () => {
				visibility.disconnect();
				clearTimeout(copiedTimer);
			};
		}

		// Fallback: the planes trail the page by a few pixels while it scrolls. `translate`
		// is set on the stage itself; a custom property would restyle every code span.
		let ticking = false;
		const update = () => {
			const rect = target.getBoundingClientRect();
			const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
			planes.style.translate = `0 ${((0.5 - progress) * 120).toFixed(1)}px`;
			ticking = false;
		};
		const onScroll = () => {
			if (!ticking) requestAnimationFrame(update);
			ticking = true;
		};
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				window.addEventListener('scroll', onScroll, { passive: true });
				update();
			} else {
				window.removeEventListener('scroll', onScroll);
			}
		});
		observer.observe(target);

		return () => {
			visibility.disconnect();
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
			clearTimeout(copiedTimer);
		};
	});
</script>

<section
	bind:this={section}
	aria-labelledby="codewall-heading"
	class="codewall bleed relative isolate flex flex-col overflow-hidden bg-[#0c111d] text-white md:h-[900px]"
	class:idle
>
	<div class="glow pointer-events-none absolute inset-0 -z-10" aria-hidden="true"></div>

	<div class="mx-auto flex w-full max-w-[1148px] flex-col justify-between gap-10 px-6 pt-16 md:h-full md:pt-24 md:pb-[88px]">
		<h2
			id="codewall-heading"
			class="m-0 max-w-[680px] font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-white md:text-[2.625rem] md:leading-[50px]"
		>
			The template lives in Lettr.
			<em class="block font-serif text-[2.125rem] leading-[1.1] text-primary-outline md:text-[2.875rem] md:leading-[50px]">The types live in your app.</em>
		</h2>

		<div class="flex max-w-[470px] flex-col gap-6">
			<p class="m-0 text-pretty text-[1.0625rem] leading-[27.2px] text-white/75 md:text-[1.1875rem] md:leading-[30.4px]">
				Behind this text: the enum and DTO that <code class="font-code text-[0.88em] text-white">lettr:generate-dtos</code> writes for
				you. In front: the Mailable that uses them. Your team edits the email in Lettr, your IDE and PHPStan check every variable.
			</p>
			<div class="flex flex-col gap-3 sm:w-max sm:flex-row sm:items-center">
				<Button variant="primary" size="hero" type="button" onclick={copyMailable} class="gap-3">
					{#if copied}<CheckIcon size={20} weight="bold" aria-hidden="true" />{:else}<CopyIcon size={20} aria-hidden="true" />{/if}
					{copied ? 'Copied' : 'Copy OrderShipped.php'}
				</Button>
				<Button variant="ghost" size="hero" href={typeSafetyHref} target="_blank" rel="noopener noreferrer" onclick={trackGuide}>
					Type safety guide
				</Button>
			</div>
			<span class="sr-only" aria-live="polite">{copied ? 'OrderShipped.php copied' : ''}</span>
		</div>
	</div>

	<!-- The real file, for screen readers, search and the Markdown twin. -->
	<pre class="sr-only"><code>{orderShippedMailable.code}</code></pre>

	<div class="stage-host relative mt-10 h-[380px] overflow-hidden md:absolute md:inset-0 md:-z-10 md:mt-0 md:h-auto" data-markdown="skip" aria-hidden="true">
		<div bind:this={stage} class="stage">
			<div class="plane back"><div class="track"><pre>{@html back}</pre></div></div>
			<div class="plane front"><div class="track"><pre>{@html front}</pre></div></div>
		</div>
		<div class="band"></div>
		<div class="veil"></div>
	</div>
</section>

<style>
	.codewall {
		--size: 14px;
		--line: 24px;
	}

	.glow {
		background:
			radial-gradient(48% 60% at 72% 62%, rgb(236 16 75 / 0.2), transparent 70%),
			radial-gradient(30% 40% at 92% 10%, rgb(249 183 201 / 0.08), transparent 70%);
	}

	/* All planes move together with scroll; only their size and direction differ. */
	.codewall {
		view-timeline: --codewall block;
	}

	.stage {
		position: absolute;
		inset: 0;
	}

	/* Same curve as the script fallback: +60px as the section enters, -60px as it leaves. */
	@keyframes parallax {
		from {
			translate: 0 60px;
		}
		to {
			translate: 0 -60px;
		}
	}

	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.stage {
				animation: parallax linear both;
				animation-timeline: --codewall;
			}
		}
	}

	.plane {
		position: absolute;
		inset: -40px 0 -40px 16px;
		pointer-events: none;
	}

	.plane.back {
		display: none;
	}

	.track {
		animation: drift 170s linear infinite;
	}

	.plane.back .track {
		animation-direction: reverse;
		animation-duration: 140s;
	}

	.idle .track {
		animation-play-state: paused;
	}

	@keyframes drift {
		to {
			transform: translate3d(0, -50%, 0);
		}
	}

	pre {
		margin: 0;
		font-family: var(--font-code);
		font-size: var(--size);
		line-height: var(--line);
		letter-spacing: -0.01em;
		white-space: pre;
		background: none;
		padding: 0;
		overflow: visible;
	}

	/*
	 * The reading band: the code is dimmed outside it by the page colour at 78%,
	 * which matches the code at 22% opacity. A static overlay instead of a second,
	 * masked copy of the code keeps the drifting text to one layer to rasterize and
	 * no offscreen render pass per frame.
	 */
	.band,
	.veil {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.band {
		background: linear-gradient(
			180deg,
			rgb(12 17 29 / 0.78) 15%,
			rgb(12 17 29 / 0) 38%,
			rgb(12 17 29 / 0) 64%,
			rgb(12 17 29 / 0.78) 86%
		);
	}

	.veil {
		background: linear-gradient(180deg, #0c111d 0%, rgb(12 17 29 / 0) 22%, rgb(12 17 29 / 0) 78%, #0c111d 100%);
	}

	@media (min-width: 768px) {
		.codewall {
			--size: 30px;
			--line: 50px;
		}

		.plane {
			/* Starts right of the copy and its button row. */
			inset: -80px 0 -80px max(calc(50% + 80px), 654px);
		}

		.plane.back {
			display: block;
			inset: -80px 0 -80px 3%;
		}

		/* On the drifting layer itself, so the fade needs no separate surface. */
		.plane.back .track {
			opacity: 0.16;
		}

		.plane.back pre {
			font-size: 15px;
			line-height: 26px;
		}

		.veil {
			background:
				linear-gradient(90deg, rgb(12 17 29 / 0.9) 0%, rgb(12 17 29 / 0.75) 34%, rgb(12 17 29 / 0) 48%),
				linear-gradient(180deg, #0c111d 0%, rgb(12 17 29 / 0) 14%, rgb(12 17 29 / 0) 86%, #0c111d 100%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.track,
		.plane.back .track {
			animation: none;
			transform: translate3d(0, -180px, 0);
		}

		.stage {
			translate: none;
		}
	}
</style>
