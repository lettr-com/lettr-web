<script lang="ts">
	import { onMount } from 'svelte';
	import {
		LinkIcon,
		GlobeIcon,
		LightningIcon,
		CodeIcon,
		ShieldCheckIcon,
		MagnifyingGlassIcon
	} from 'phosphor-svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { ensureGsapPlugins } from '$lib/utils/gsap';
	import { createGsapContextCleanup } from '$lib/utils/gsapContext';

	let section: HTMLElement | undefined = $state();
	let timeline: HTMLElement | undefined = $state();
	let progressLine: HTMLElement | undefined = $state();

	const features = [
		{
			icon: CodeIcon,
			stage: 'Integrate',
			title: 'Clean REST API + SMTP',
			description:
				'Send your first email with a single API call. Or swap your SMTP credentials and keep your existing setup — no code changes needed.'
		},
		{
			icon: LightningIcon,
			stage: 'Install',
			title: 'SDKs for every language',
			description:
				'First-class Laravel package with one-command install. Official SDKs for PHP, Node.js, Go, Java, and Rust — all typed and documented.'
		},
		{
			icon: ShieldCheckIcon,
			stage: 'Authenticate',
			title: 'SPF, DKIM, DMARC',
			description:
				'Step-by-step DNS wizard walks you through authentication in minutes. Custom tracking domains included on every plan — no CNAME guesswork.'
		},
		{
			icon: GlobeIcon,
			stage: 'Send',
			title: 'One domain, one reputation',
			description:
				'Stop splitting transactional and marketing across two vendors. One sending domain, one deliverability reputation, one place to monitor it all.'
		},
		{
			icon: LinkIcon,
			stage: 'React',
			title: 'Webhooks for every event',
			description:
				'Get notified the moment an email is delivered, opened, clicked, or bounced. Build automations, sync with your database, or trigger in-app flows.'
		},
		{
			icon: MagnifyingGlassIcon,
			stage: 'Debug',
			title: 'Searchable logs',
			description:
				'Full-text search across every email you have sent. Filter by recipient, status, or tag. Find exactly why that one email bounced — in seconds, not hours.'
		}
	];

	onMount(() => {
		if (!section || !timeline || !progressLine) return;
		ensureGsapPlugins();

		const scopedSection = section;
		const scopedTimeline = timeline;
		const scopedProgress = progressLine;

		return createGsapContextCleanup(
			gsap,
			() => {
				gsap.fromTo(
					scopedSection.querySelectorAll('[data-reveal]'),
					{ y: 20, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						duration: 0.5,
						stagger: 0.06,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: scopedSection,
							start: 'top 90%',
							toggleActions: 'play none none none'
						}
					}
				);

				gsap.fromTo(
					scopedProgress,
					{ height: '0%' },
					{
						height: '100%',
						ease: 'none',
						scrollTrigger: {
							trigger: scopedTimeline,
							start: 'top 75%',
							end: 'bottom 80%',
							scrub: 0.4
						}
					}
				);

				scopedSection.querySelectorAll('[data-node]').forEach((node) => {
					ScrollTrigger.create({
						trigger: node,
						start: 'top 80%',
						onEnter: () => node.classList.add('is-active')
					});
				});
			},
			scopedSection
		);
	});
</script>

<section
	bind:this={section}
	id="features"
	class="-mx-6 px-6 py-20 sm:py-24 bg-surface border-b border-white/10 overflow-hidden"
>
	<div class="mb-14 sm:mb-16 max-w-2xl" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			The developer path
		</div>
		<h2 class="mb-4 text-white">
			Integrate in minutes.<br /><span class="text-primary">Forget about it forever.</span>
		</h2>
		<p class="text-body text-gray-300 max-w-[52ch]">
			Everything you need to send emails from your SaaS. Nothing you don't.
		</p>
	</div>

	<ol bind:this={timeline} class="timeline relative pl-14 sm:pl-20 max-w-3xl">
		<div
			class="absolute left-[19px] sm:left-[39px] top-5 bottom-5 w-px bg-white/10"
			aria-hidden="true"
		></div>
		<div
			bind:this={progressLine}
			class="timeline-progress absolute left-[19px] sm:left-[39px] top-5 w-px"
			style="height: 0%"
			aria-hidden="true"
		></div>

		{#each features as feature, i}
			<li
				data-reveal
				data-node
				class="timeline-node relative mb-12 last:mb-0"
			>
				<div
					class="timeline-icon absolute -left-14 sm:-left-20 top-0 flex h-10 w-10 items-center justify-center border border-white/10 bg-surface text-white/40 transition-all duration-700"
				>
					<feature.icon size={18} />
					<span class="timeline-pulse" aria-hidden="true"></span>
				</div>

				<div class="timeline-stage mb-2 flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-white/35 transition-colors duration-700">
					<span class="text-primary/70 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
					<span class="block w-3 h-px bg-white/20"></span>
					<span>{feature.stage}</span>
				</div>
				<h3 class="text-white font-medium mb-2">{feature.title}</h3>
				<p class="text-sm text-gray-400 leading-relaxed max-w-[52ch]">{feature.description}</p>
			</li>
		{/each}
	</ol>
</section>

<style>
	.timeline-progress {
		background: linear-gradient(
			to bottom,
			rgba(236, 16, 75, 0) 0%,
			rgba(236, 16, 75, 0.9) 20%,
			rgba(236, 16, 75, 1) 100%
		);
		box-shadow: 0 0 8px rgba(236, 16, 75, 0.5);
	}

	.timeline-icon {
		position: absolute;
		overflow: visible;
	}

	.timeline-pulse {
		position: absolute;
		inset: -1px;
		border: 1px solid var(--color-primary);
		opacity: 0;
		pointer-events: none;
		transform: scale(1);
	}

	.timeline-node.is-active .timeline-icon {
		border-color: var(--color-primary);
		background-color: rgba(236, 16, 75, 0.08);
		color: var(--color-primary);
		box-shadow:
			0 0 0 4px rgba(236, 16, 75, 0.08),
			0 0 24px rgba(236, 16, 75, 0.3);
	}

	.timeline-node.is-active .timeline-stage {
		color: rgba(255, 255, 255, 0.7);
	}

	.timeline-node.is-active .timeline-pulse {
		animation: timeline-pulse 1.4s ease-out 0.1s 1 forwards;
	}

	@keyframes timeline-pulse {
		0% {
			opacity: 0.6;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(2);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.timeline-node.is-active .timeline-pulse {
			animation: none;
		}
	}
</style>
