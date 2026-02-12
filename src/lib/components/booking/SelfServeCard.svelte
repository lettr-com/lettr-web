<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
</script>

<Card>
	<CardHeader>
		<CardTitle>Good news: you can be live today</CardTitle>
		<CardDescription>
			At your current volume, the fastest path is guided self-serve setup.
		</CardDescription>
	</CardHeader>
	<CardContent class="space-y-3 text-sm text-muted">
		<p>
			Most teams send their first emails in about 15 minutes. Start free, test quickly, and reach out
			anytime if you want help.
		</p>
		<div class="flex flex-wrap items-center gap-3">
			<a
				href="https://app.lettr.com/register"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex h-10 items-center justify-center bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
			>
				Create account
			</a>
			<a
				href="https://docs.lettr.com/introduction"
				target="_blank"
				rel="noopener noreferrer"
				class="text-sm font-semibold text-primary hover:underline"
			>
				Read docs
			</a>
		</div>
	</CardContent>
</Card>
