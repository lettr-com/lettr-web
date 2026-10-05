<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	interface Props {
		/** Where the button sits, sent with the click events (for example `home_brand`). */
		placement: string;
		variant?: 'primary' | 'secondary';
		size?: 'default' | 'hero';
	}

	let { placement, variant = 'primary', size = 'hero' }: Props = $props();

	let registerHref: string = $state(registerUrl);

	function track() {
		void capturePosthogEvent('cta_clicked', {
			placement,
			label: 'Get started',
			href: registerHref,
			variant,
			destination_type: /^https?:\/\//.test(registerHref) ? 'external' : 'internal'
		});
		trackSignupClick(placement, registerHref);
	}

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);
	});
</script>

<Button {variant} {size} href={registerHref} onclick={track}>Get started</Button>
