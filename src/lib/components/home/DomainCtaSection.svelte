<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	// Sprout, one of the demo brands in BrandSection, setting up its root domain
	const domain = 'sprout.app';

	// The three records a root domain publishes; a subdomain swaps SPF for a CNAME
	const records = [
		{ type: 'TXT, DKIM', host: `…._domainkey.${domain}` },
		{ type: 'TXT, SPF', host: domain },
		{ type: 'TXT, DMARC', host: `_dmarc.${domain}` }
	];

	let registerHref: string = $state(registerUrl);

	function trackCta() {
		void capturePosthogEvent('cta_clicked', {
			placement: 'home_domain',
			label: 'Add your domain',
			href: registerHref,
			variant: 'primary',
			destination_type: /^https?:\/\//.test(registerHref) ? 'external' : 'internal'
		});
		trackSignupClick('home_domain', registerHref);
	}

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});
</script>

<section aria-labelledby="domain-heading" class="section-y">
	<div class="mx-auto flex max-w-wide flex-col overflow-hidden bg-white xl:min-h-[480px] xl:flex-row">
		<div class="flex flex-col justify-between gap-12 p-8 sm:p-12 xl:flex-1 xl:p-16">
			<h2
				id="domain-heading"
				class="text-[2.25rem] leading-[42px] tracking-[-0.03em] text-surface sm:text-[3.5rem] sm:leading-[60px]"
			>
				Get your<br />domain ready<br />to send.
			</h2>
			<div class="flex flex-col items-start gap-6">
				<p class="m-0 text-base leading-6 text-pretty text-subtle">Add three DNS records. Lettr checks them.</p>
				<Button variant="primary" size="lg" href={registerHref} onclick={trackCta}>Add your domain</Button>
			</div>
		</div>

		<div data-markdown="skip" class="flex flex-col justify-center bg-inset py-10 pl-8 sm:py-12 sm:pl-12 xl:w-[600px] xl:shrink-0 xl:py-0 xl:pl-16">
			<div class="bg-white shadow-[0_0_0_1px_var(--color-hairline)]">
				<div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-hairline px-6 py-6 sm:px-10 sm:py-8">
					<p class="m-0 font-heading text-[1.75rem] leading-[34px] tracking-[-0.02em] text-surface sm:text-4xl sm:leading-[42px]">
						{domain}
					</p>
					<p class="m-0 flex items-center gap-2 bg-live-soft px-3 py-1.5 text-sm leading-5 font-semibold text-live">
						<span class="h-2 w-2 shrink-0 bg-live" aria-hidden="true"></span>
						Ready to send
					</p>
				</div>
				{#each records as record, i}
					<div
						class="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 px-6 py-5 sm:grid-cols-[136px_1fr_auto] sm:gap-y-0 sm:px-10 {i <
						records.length - 1
							? 'border-b border-hairline'
							: ''}"
					>
						<span class="text-base leading-6 text-surface">{record.type}</span>
						<span class="order-last col-span-2 min-w-0 truncate font-code text-sm leading-6 text-subtle sm:order-none sm:col-span-1">
							{record.host}
						</span>
						<span class="text-base leading-6 text-live">Verified</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
