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
		'error-callback'?: (code?: string) => void;
		'timeout-callback'?: () => void;
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

	const activeSiteKey = $derived(siteKey.trim());

	$effect(() => {
		if (typeof window === 'undefined') {
			return;
		}

		if (!widgetId || resetKey < 1 || resetKey === handledResetKey) {
			return;
		}

		handledResetKey = resetKey;

		const turnstile = (window as TurnstileWindow).turnstile;
		if (!isTurnstileApi(turnstile)) {
			return;
		}

		turnstile.reset(widgetId);
		token = '';
	});

	onMount(() => {
		if (!activeSiteKey) {
			loadError = 'Captcha is unavailable. Please try again later.';
			return;
		}

		let isDisposed = false;

		loadTurnstileScript()
			.then((turnstile) => {
				if (isDisposed || !container) {
					return;
				}

				try {
					widgetId = turnstile.render(container, {
						sitekey: activeSiteKey,
						callback: (value: string) => {
							token = value;
							loadError = '';
						},
						'expired-callback': () => {
							token = '';
						},
						'timeout-callback': () => {
							token = '';
							loadError = 'Captcha challenge timed out. Please try again.';
						},
						'error-callback': (errorCode?: string) => {
							token = '';
							if (errorCode) {
								loadError = `Captcha challenge failed (${errorCode}). Please try again.`;
								return;
							}

							loadError = 'Could not load captcha challenge. Please refresh the page.';
						}
					});
				} catch {
					token = '';
					loadError = 'Could not load captcha challenge. Please refresh the page.';
				}
			})
			.catch(() => {
				token = '';
				loadError = 'Could not load captcha script. Please refresh the page.';
			});

		return () => {
			isDisposed = true;

			const turnstile = (window as TurnstileWindow).turnstile;
			if (isTurnstileApi(turnstile) && widgetId) {
				turnstile.remove(widgetId);
			}
		};
	});

	function isTurnstileApi(value: unknown): value is TurnstileApi {
		return typeof value === 'object' && value !== null && typeof (value as TurnstileApi).render === 'function';
	}

	function loadTurnstileScript(): Promise<TurnstileApi> {
		const existing = (window as TurnstileWindow).turnstile;
		if (isTurnstileApi(existing)) {
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
		document.head.append(script);

		return waitForTurnstile();
	}

	function waitForTurnstile(): Promise<TurnstileApi> {
		return new Promise<TurnstileApi>((resolve, reject) => {
			let attempts = 0;
			const maxAttempts = 100;
			const interval = window.setInterval(() => {
				const turnstile = (window as TurnstileWindow).turnstile;

				if (isTurnstileApi(turnstile)) {
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
	<Label for="turnstile-widget">{label}</Label>
	<div id="turnstile-widget" bind:this={container}></div>
	{#if loadError}
		<p class="text-sm text-primary">{loadError}</p>
	{/if}
</div>
