<script lang="ts">
	import { ArrowSquareOut, CheckCircle, Clock } from 'phosphor-svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	interface BookingResource {
		name: string;
		description: string;
		href: string;
	}

	interface Props {
		slotSummary: string;
		timezone: string;
		redirectUrl?: string;
		resources: readonly BookingResource[];
		onresourceclick?: (resource: BookingResource) => void;
		oncontinueclick?: () => void;
	}

	let {
		slotSummary,
		timezone,
		redirectUrl,
		resources,
		onresourceclick,
		oncontinueclick
	}: Props = $props();

	function handleContinue() {
		oncontinueclick?.();

		if (!redirectUrl) {
			return;
		}

		window.location.href = redirectUrl;
	}
</script>

<Card data-animate-intro class="overflow-hidden border-primary/25 bg-gradient-to-br from-white to-primary/5">
	<CardHeader class="space-y-3 border-b border-border/60 bg-white/70">
		<div class="inline-flex w-fit items-center gap-2 border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
			<CheckCircle size={14} weight="fill" />
			Booking confirmed
		</div>
		<CardTitle class="text-2xl">Thanks for booking with Lettr</CardTitle>
		<CardDescription class="text-base">
			Your call is scheduled. While you wait, here are practical resources to help you ship faster.
		</CardDescription>
	</CardHeader>

	<CardContent class="space-y-5 pt-5">
		<div class="flex items-center gap-2 bg-white p-3 text-sm text-surface shadow-[0_8px_25px_-20px_rgba(17,24,39,0.5)]">
			<Clock size={16} class="text-primary" />
			<span class="font-medium">{slotSummary}</span>
			<span class="text-muted">({timezone})</span>
		</div>

		<div class="space-y-3">
			<p class="text-sm font-semibold uppercase tracking-[0.1em] text-muted">Before the call</p>
			<div class="grid gap-3">
				{#each resources as resource}
					<a
						href={resource.href}
						target="_blank"
						rel="noopener noreferrer"
						onclick={() => onresourceclick?.(resource)}
						class="group border border-border/80 bg-white p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
					>
						<div class="flex items-start justify-between gap-3">
							<div class="space-y-1">
								<p class="text-sm font-semibold text-surface">{resource.name}</p>
								<p class="text-sm text-muted">{resource.description}</p>
							</div>
							<ArrowSquareOut
								size={16}
								class="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-primary"
							/>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</CardContent>

	{#if redirectUrl}
		<CardFooter class="border-t border-border/60 bg-white/60">
			<Button class="w-full" onclick={handleContinue}>Continue in app</Button>
		</CardFooter>
	{/if}
</Card>
