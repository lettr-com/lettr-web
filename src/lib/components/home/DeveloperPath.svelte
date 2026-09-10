<script lang="ts">
	import { onMount } from 'svelte';
	import CodeIcon from 'phosphor-svelte/lib/CodeIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
	import GlobeIcon from 'phosphor-svelte/lib/GlobeIcon';
	import LinkIcon from 'phosphor-svelte/lib/LinkIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import TerminalCommand from '$lib/components/TerminalCommand.svelte';
	import SectionLabel from './SectionLabel.svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const sdks = [
		{ label: 'Laravel', src: '/images/icons/laravel.svg', href: 'https://docs.lettr.com/sdks/laravel' },
		{ label: 'PHP', src: '/images/icons/php.svg', href: 'https://docs.lettr.com/sdks/php' },
		{ label: 'Node.js', src: '/images/icons/node-js.svg', href: 'https://docs.lettr.com/sdks/node' },
		{ label: 'Go', src: '/images/icons/golang.svg', href: 'https://docs.lettr.com/sdks/go' },
		{ label: 'Java', src: '/images/icons/java.svg', href: 'https://docs.lettr.com/sdks/java' },
		{ label: 'Rust', src: '/images/icons/rust.svg', href: 'https://docs.lettr.com/sdks/rust' },
		{ label: 'REST', src: '/images/icons/api.svg', href: 'https://docs.lettr.com/api-reference/introduction' },
		{ label: 'SMTP', src: '/images/icons/smtp.svg', href: '/smtp-relay/' },
		{ label: 'MCP', src: '/images/icons/mcp.svg', href: '/platform/mcp/' }
	];

	const features = [
		{
			icon: CodeIcon,
			stage: 'Integrate',
			title: 'Clean REST API + SMTP',
			description:
				'Send your first email with a single API call. Or swap your SMTP credentials and keep your existing setup, no code changes needed.'
		},
		{
			icon: LightningIcon,
			stage: 'Install',
			title: 'SDKs for every language',
			description:
				'First-class Laravel package with one-command install. Official SDKs for PHP, Node.js, Go, Java, and Rust, all typed and documented.'
		},
		{
			icon: ShieldCheckIcon,
			stage: 'Authenticate',
			title: 'SPF, DKIM, DMARC',
			description:
				'Step-by-step DNS wizard walks you through authentication in minutes. Custom tracking domains included on every plan.'
		},
		{
			icon: GlobeIcon,
			stage: 'Send',
			title: 'Transactional and marketing, together',
			description:
				'Stop splitting transactional and marketing across two vendors. Send both from one platform, built in the same editor.'
		},
		{
			icon: LinkIcon,
			stage: 'React',
			title: 'Webhooks for every event',
			description:
				'Get notified the moment an email is delivered, opened, clicked, or bounced. Build automations or trigger in-app flows.'
		},
		{
			icon: MagnifyingGlassIcon,
			stage: 'Debug',
			title: 'Searchable logs',
			description:
				'Full-text search across every email you have sent. Find exactly why that one email bounced in seconds, not hours.'
		}
	];

	onMount(() => {
		if (!section) return;
		return createScrollRevealCleanup({ scope: section, targets: '[data-reveal]' });
	});
</script>

<section bind:this={section} id="features" class="-mx-6 border-b border-white/10 bg-surface px-6 py-20 sm:py-24">
	<div data-reveal class="mb-12 max-w-[720px]">
		<SectionLabel index={2} total={5} label="The developer path" light />
		<h2 class="mb-4 text-[2rem] leading-[1.15] tracking-[-0.02em] text-white sm:text-[2.5rem]">
			Integrate in minutes. <span class="text-primary">Forget about it forever.</span>
		</h2>
		<p class="text-body text-gray-300">
			Everything you need to send emails from your SaaS. Nothing you don't.
		</p>
	</div>

	<div data-reveal class="mb-4 grid grid-cols-3 gap-px border border-white/10 bg-white/10 sm:grid-cols-5 lg:grid-cols-9">
		{#each sdks as sdk}
			<a
				href={sdk.href}
				target={sdk.href.startsWith('http') ? '_blank' : undefined}
				rel={sdk.href.startsWith('http') ? 'noopener noreferrer' : undefined}
				class="group flex flex-col items-center gap-3 bg-surface px-3 py-5 transition-colors hover:bg-primary/10"
			>
				<img src={sdk.src} alt="" class="h-7 w-7 opacity-80 brightness-0 invert transition-opacity group-hover:opacity-100" />
				<span class="text-xs font-medium text-gray-300 group-hover:text-white">{sdk.label}</span>
			</a>
		{/each}
	</div>

	<div data-reveal class="mb-14">
		<TerminalCommand commands={['composer require lettr/lettr-laravel', 'php artisan lettr:install']} />
	</div>

	<div class="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
		{#each features as feature, i}
			<div data-reveal class="bg-surface p-6">
				<div class="mb-5 flex items-center justify-between">
					<span class="flex h-9 w-9 items-center justify-center border border-white/10 text-primary">
						<feature.icon size={18} />
					</span>
					<span class="text-sm text-white/40 tabular-nums">{String(i + 1).padStart(2, '0')} · {feature.stage}</span>
				</div>
				<h3 class="mb-2 text-lg font-medium text-white">{feature.title}</h3>
				<p class="text-sm leading-relaxed text-gray-400">{feature.description}</p>
			</div>
		{/each}
	</div>
</section>
