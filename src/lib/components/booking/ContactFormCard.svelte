<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';

	interface Props {
		email?: string;
		firstName?: string;
		lastName?: string;
		phone?: string;
		canConfirm: boolean;
		isConfirming: boolean;
		isConfirmed: boolean;
		redirectUrl?: string;
		onconfirm?: () => void | Promise<void>;
	}

	let {
		email = $bindable(''),
		firstName = $bindable(''),
		lastName = $bindable(''),
		phone = $bindable(''),
		canConfirm,
		isConfirming,
		isConfirmed,
		redirectUrl,
		onconfirm
	}: Props = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Your details</CardTitle>
		<CardDescription>We only use these details for your booking.</CardDescription>
	</CardHeader>
	<CardContent class="space-y-4">
		<div class="space-y-2">
			<Label for="email">Email</Label>
			<Input id="email" type="email" bind:value={email} placeholder="you@company.com" required />
		</div>

		<div class="grid grid-cols-2 gap-3 narrow:grid-cols-1">
			<div class="space-y-2">
				<Label for="first-name">First name</Label>
				<Input id="first-name" bind:value={firstName} placeholder="John" />
			</div>
			<div class="space-y-2">
				<Label for="last-name">Last name</Label>
				<Input id="last-name" bind:value={lastName} placeholder="Doe" />
			</div>
		</div>

		<div class="space-y-2">
			<Label for="phone">Phone (optional)</Label>
			<Input id="phone" type="tel" bind:value={phone} placeholder="+1 555 555 5555" />
		</div>
	</CardContent>

	<Separator />

	<CardFooter class="flex flex-col items-stretch gap-2 narrow:gap-3">
		<Button onclick={onconfirm} disabled={!canConfirm || isConfirming || isConfirmed}>
			{#if isConfirmed}
				Confirmed
			{:else}
				{isConfirming ? 'Confirming...' : 'Confirm booking'}
			{/if}
		</Button>

		{#if redirectUrl && isConfirmed}
			<a href={redirectUrl} class="text-center text-sm font-medium text-primary hover:underline">Continue</a>
		{/if}
	</CardFooter>
</Card>
