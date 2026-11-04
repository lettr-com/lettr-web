<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';

	interface Props {
		/** Where the button sits, sent with the click events (for example `home_brand`). */
		placement: string;
		variant?: 'primary' | 'secondary' | 'green';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}

	let { placement, variant = 'primary', size = 'lg', class: className = '' }: Props = $props();

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

<Button {variant} {size} href={registerHref} onclick={track} class={className}>Get started</Button>
