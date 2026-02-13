<script lang="ts">
	import { onMount } from 'svelte';
	import { Label } from '$lib/components/ui/label';

	interface Props {
		token?: string;
		siteKey?: string;
		resetKey?: number;
		label?: string;
	}

	type TurnstileRenderOptions = {
		sitekey: string;
		callback?: (token: string) => void;
		'expired-callback'?: () => void;
		'error-callback'?: () => void;
	};

	type TurnstileApi = {
		render: (container: string | HTMLElement, options: TurnstileRenderOptions) => string;
		reset: (widgetId?: string) => void;
		remove: (widgetId?: string) => void;
	};

	type TurnstileWindow = Window & {
		turnstile?: TurnstileApi;
	};

	let container: HTMLDivElement | undefined = $state();
	let widgetId: string | null = $state(null);
	let loadError: string = $state('');
	let handledResetKey: number = $state(0);

	let { token = $bindable(''), siteKey = '', resetKey = 0, label = 'Verification' }: Props = $props();

	const hasSiteKey = $derived(Boolean(siteKey.trim()));

	$effect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		if (!widgetId || resetKey < 1 || resetKey === handledResetKey) {
			return;
		}

		handledResetKey = resetKey;

		const turnstile = (window as TurnstileWindow).turnstile;
		if (!turnstile) {
			return;
		}

		turnstile.reset(widgetId);
		token = '';
	});

	onMount(() => {
		if (!hasSiteKey) {
			loadError = 'Captcha is unavailable. Please try again later.';
			return;
		}

		let isDisposed = false;

		void (async () => {
			try {
				const turnstile = await loadTurnstile();
				if (isDisposed || !container) {
					return;
				}

				widgetId = turnstile.render(container, {
					sitekey: siteKey,
					callback: (value: string) => {
						token = value;
						loadError = '';
					},
					'expired-callback': () => {
						token = '';
					},
					'error-callback': () => {
						token = '';
						loadError = 'Could not load captcha challenge. Please refresh the page.';
					}
				});
			} catch {
				token = '';
				loadError = 'Could not load captcha challenge. Please refresh the page.';
			}
		})();

		return () => {
			isDisposed = true;

			const turnstile = (window as TurnstileWindow).turnstile;
			if (turnstile && widgetId) {
				turnstile.remove(widgetId);
			}
		};
	});

	function loadTurnstile(): Promise<TurnstileApi> {
		const existing = (window as TurnstileWindow).turnstile;
		if (existing) {
			return Promise.resolve(existing);
		}

		const existingScript = document.querySelector<HTMLScriptElement>('#turnstile-script');
		if (existingScript) {
			return waitForTurnstile();
		}

		const script = document.createElement('script');
		script.id = 'turnstile-script';
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
		script.async = true;
		script.defer = true;
		document.head.append(script);

		return waitForTurnstile();
	}

	function waitForTurnstile() {
		return new Promise<TurnstileApi>((resolve, reject) => {
			let attempts = 0;
			const maxAttempts = 100;
			const interval = window.setInterval(() => {
				const turnstile = (window as TurnstileWindow).turnstile;

				if (turnstile) {
					window.clearInterval(interval);
					resolve(turnstile);
					return;
				}

				attempts += 1;
				if (attempts >= maxAttempts) {
					window.clearInterval(interval);
					reject(new Error('Timed out while loading Turnstile'));
				}
			}, 50);
		});
	}
</script>

<div class="space-y-2">
	<Label for="turnstile">{label}</Label>
	<div id="turnstile" bind:this={container}></div>
	{#if loadError}
		<p class="text-sm text-primary">{loadError}</p>
	{/if}
</div>
