<script lang="ts">
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { getConsentState, shouldShowBanner, writeConsentCookie } from '$lib/utils/cookieConsent';
	import { fetchGeoDetection } from '$lib/utils/geoDetection';

	let visible = $state(false);

	function accept() {
		writeConsentCookie('accepted');
		visible = false;
	}

	function reject() {
		writeConsentCookie('rejected');
		visible = false;
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
		<div class="mx-auto max-w-[600px] narrow:max-w-none px-6 py-4 flex items-center justify-between gap-4 narrow:flex-col narrow:items-stretch">
			<p class="text-sm text-muted">
				We use cookies to improve your experience. You can accept or reject non-essential cookies.
			</p>
			<div class="flex gap-2 shrink-0">
				<button
					onclick={reject}
					class="px-4 py-2 text-sm font-bold border border-border/30 text-surface hover:bg-surface/5 cursor-pointer"
				>
					Reject
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
{/if}
