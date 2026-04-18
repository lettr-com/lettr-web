<script lang="ts">
	import { onMount } from 'svelte';
	import { LinkIcon, GlobeIcon, LightningIcon, CodeIcon, ShieldCheckIcon, MagnifyingGlassIcon } from 'phosphor-svelte';
	import { createScrollRevealCleanup } from '$lib/utils/gsap';

	let section: HTMLElement | undefined = $state();

	const features = [
		{
			icon: CodeIcon,
			title: 'Clean REST API + SMTP',
			description: 'Send your first email with a single API call. Or swap your SMTP credentials and keep your existing setup — no code changes needed.'
		},
		{
			icon: LightningIcon,
			title: 'SDKs for every language',
			description: 'First-class Laravel package with one-command install. Official SDKs for PHP, Node.js, Go, Java, and Rust — all typed and documented.'
		},
		{
			icon: GlobeIcon,
			title: 'One domain, one reputation',
			description: 'Stop splitting transactional and marketing across two vendors. One sending domain, one deliverability reputation, one place to monitor it all.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'SPF, DKIM, DMARC',
			description: 'Step-by-step DNS wizard walks you through authentication in minutes. Custom tracking domains included on every plan — no CNAME guesswork.'
		},
		{
			icon: LinkIcon,
			title: 'Webhooks for every event',
			description: 'Get notified the moment an email is delivered, opened, clicked, or bounced. Build automations, sync with your database, or trigger in-app flows.'
		},
		{
			icon: MagnifyingGlassIcon,
			title: 'Searchable logs',
			description: 'Full-text search across every email you have sent. Filter by recipient, status, or tag. Find exactly why that one email bounced — in seconds, not hours.'
		}
	];

	onMount(() => {
		if (!section) return;

		return createScrollRevealCleanup({
			scope: section,
			targets: '[data-feature]'
		});
	});
</script>

<section bind:this={section} id="features" class="-mx-6 px-6 py-16 bg-surface border-b border-white/10">
		<div class="mb-10" data-feature>
			<h2 class="mb-3 text-white">Integrate in minutes.<br /><span class="text-primary">Forget about it forever.</span></h2>
			<p class="text-body text-gray-300 max-w-[50ch]">
				Everything you need to send emails from your SaaS.<br />Nothing you don't.
			</p>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			{#each features as feature}
				<div data-feature class="border border-white/[0.06] bg-white/[0.03] p-5">
					<div class="mb-3 flex h-8 w-8 items-center justify-center border border-white/10 bg-white/[0.05]">
						<feature.icon size={16} class="text-primary" />
					</div>
					<h3 class="text-sm text-white font-medium mb-1">{feature.title}</h3>
					<p class="text-[13px] text-gray-500 leading-relaxed">{feature.description}</p>
				</div>
			{/each}
		</div>
</section>
