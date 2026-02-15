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

	const shortTimezone = $derived.by(() => {
		try {
			const formatter = new Intl.DateTimeFormat('en', { timeZoneName: 'short', timeZone: timezone });
			const parts = formatter.formatToParts(new Date());
			return parts.find((p) => p.type === 'timeZoneName')?.value ?? timezone;
		} catch {
			return timezone;
		}
	});

	function handleContinue() {
		oncontinueclick?.();

		if (!redirectUrl) {
			return;
		}

		window.location.href = redirectUrl;
	}
</script>

<Card data-animate-intro class="overflow-hidden border-border/60">
	<CardHeader class="space-y-2 border-b border-border/40 pb-4">
		<div class="inline-flex w-fit items-center gap-1.5 border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
			<CheckCircle size={12} weight="fill" />
			Booking confirmed
		</div>
		<CardTitle class="text-lg">You're all set</CardTitle>
		<CardDescription class="text-sm">
			Here are a few things to check out before your call.
		</CardDescription>
	</CardHeader>

	<CardContent class="space-y-4 pt-4">
		<div class="flex items-center gap-2 rounded bg-muted/10 px-3 py-2 text-xs text-surface">
			<Clock size={14} class="shrink-0 text-primary" />
			<span class="font-medium">{slotSummary}</span>
			<span class="text-muted">({shortTimezone})</span>
		</div>

		<div class="space-y-2">
			<p class="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Before the call</p>
			<div class="grid gap-2">
				{#each resources as resource}
					<a
						href={resource.href}
						target="_blank"
						rel="noopener noreferrer"
						onclick={() => onresourceclick?.(resource)}
						class="group border border-border/60 bg-white px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
					>
						<div class="flex items-center justify-between gap-3">
							<div class="space-y-0.5">
								<p class="text-xs font-semibold text-surface">{resource.name}</p>
								<p class="text-xs text-muted">{resource.description}</p>
							</div>
							<ArrowSquareOut
								size={14}
								class="shrink-0 text-muted transition-colors group-hover:text-primary"
							/>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</CardContent>

	{#if redirectUrl}
		<CardFooter class="border-t border-border/40 bg-white/60 pt-4">
			<Button class="w-full" size="sm" onclick={handleContinue}>Continue in app</Button>
		</CardFooter>
	{/if}
</Card>
