<script lang="ts">
	import { Alert, AlertDescription, AlertTitle } from '$lib/components/ui/alert';

	interface Props {
		errorMessage?: string;
		infoMessage?: string;
	}

	let { errorMessage = '', infoMessage = '' }: Props = $props();
</script>

{#if errorMessage}
	<Alert class="border-primary/30 bg-primary/5">
		<AlertTitle>Something went wrong</AlertTitle>
		<AlertDescription class="text-surface">{errorMessage}</AlertDescription>
	</Alert>
{/if}

{#if infoMessage}
	<Alert>
		<AlertTitle>Booking status</AlertTitle>
		<AlertDescription>{infoMessage}</AlertDescription>
	</Alert>
{/if}
