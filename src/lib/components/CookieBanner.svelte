<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { getConsentState, shouldShowBanner, writeConsentCookie } from '$lib/utils/cookieConsent';
	import { fetchGeoDetection } from '$lib/utils/geoDetection';

	interface ConsentProvider {
		name: string;
		purpose: string;
	}

	const consentProviders: ConsentProvider[] = [
		{ name: 'PostHog', purpose: 'Product analytics' },
		{ name: 'Google Analytics', purpose: 'Website analytics' },
		{ name: 'Google Tag Manager (GTM)', purpose: 'Tag management' },
		{ name: 'Reddit Pixel', purpose: 'Ad performance measurement' },
	];

	let visible = $state(false);
	let isServicesModalOpen = $state(false);

	function accept() {
		writeConsentCookie('accepted');
		visible = false;
		isServicesModalOpen = false;
	}

	function reject() {
		writeConsentCookie('rejected');
		visible = false;
		isServicesModalOpen = false;
	}

	function openServicesModal() {
		isServicesModalOpen = true;
	}

	function closeServicesModal() {
		isServicesModalOpen = false;
	}

	onMount(() => {
		const consentState = getConsentState(document.cookie);
		if (consentState.hasConsented) return;

		if (dev) {
			visible = true;
			return;
		}

		fetchGeoDetection('/api/geo').then((geo) => {
			if (shouldShowBanner(consentState, geo.requiresConsent)) {
				visible = true;
			}
		});
	});
</script>

{#if visible}
	<div class="fixed bottom-0 left-0 right-0 z-[60] border-t border-border/30 glass">
		<div class="mx-auto max-w-[600px] narrow:max-w-none px-6 py-4 flex items-start justify-between gap-4 narrow:flex-col narrow:items-stretch">
			<div class="min-w-0">
				<p class="text-sm text-muted">
					We need essential cookies to run the site. Accept optional cookies to help us make it
					better for you.
				</p>
				<button
					onclick={openServicesModal}
					class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
					aria-haspopup="dialog"
					aria-expanded={isServicesModalOpen}
					aria-controls="cookie-services-modal"
				>
					Services ({consentProviders.length})
				</button>
				<a href="/privacy-policy/" class="mt-2 inline-block text-xs text-primary hover:underline">
					Privacy Policy
				</a>
			</div>
			<div class="flex gap-2 shrink-0">
				<button
					onclick={reject}
					class="px-4 py-2 text-sm font-bold border border-border/30 text-surface hover:bg-surface/5 cursor-pointer"
				>
					Accept only essential
				</button>
				<button
					onclick={accept}
					class="px-4 py-2 text-sm font-bold bg-primary text-white hover:bg-primary/90 cursor-pointer"
				>
					Accept
				</button>
			</div>
		</div>
	</div>

	{#if isServicesModalOpen}
		<div class="fixed inset-0 z-[70] flex items-center justify-center bg-surface/45 px-4">
			<div
				id="cookie-services-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="cookie-services-modal-title"
				tabindex="-1"
				class="w-full max-w-[520px] border border-border/30 bg-background p-5 shadow-lg"
			>
				<div class="flex items-start justify-between gap-4">
					<h2 id="cookie-services-modal-title" class="text-h3 text-surface">Services in use</h2>
					<button
						onclick={closeServicesModal}
						class="text-xs font-bold uppercase tracking-wide text-muted hover:text-surface cursor-pointer"
					>
						Close
					</button>
				</div>
				<p class="mt-2 text-sm text-muted">
					Used only after you accept optional cookies.
				</p>
				<ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
					{#each consentProviders as provider}
						<li>
							<span class="text-surface">{provider.name}</span> - {provider.purpose}
						</li>
					{/each}
				</ul>
			</div>
		</div>
	{/if}
{/if}
