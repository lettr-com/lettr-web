<script lang="ts">
	import { GithubLogo, BookOpen, EnvelopeSimple, BookOpenIcon, EnvelopeSimpleIcon, GithubLogoIcon } from 'phosphor-svelte';
</script>

<footer id="docs" class="border-t border-border/30 bg-white px-4 py-12">
	<div class="mx-auto max-w-[550px]">
		<div class="flex flex-col gap-8 sm:items-start sm:justify-between">
			<div>
				<a href="/" class="flex items-center">
					<img src="/logo.svg" alt="Lettr" class="h-5" />
				</a>
				<p class="mt-2 max-w-xs text-sm text-muted">
					Developer-first email delivery that just works. Send transactional emails at scale.
				</p>
			</div>

			<div class="flex flex-col gap-3">
				<span class="text-xs font-semibold uppercase tracking-wider text-muted">Resources</span>
				<a
					href="https://docs.lettr.com/introduction"
					class="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-surface"
					target="_blank"
					rel="noopener noreferrer"
				>
					<BookOpenIcon size={14} class="text-primary" />
					Documentation
				</a>
				<a
					href="https://github.com"
					class="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-surface"
					target="_blank"
					rel="noopener noreferrer"
				>
					<GithubLogoIcon size={14} class="text-primary" />
					GitHub
				</a>
				<a
					href="mailto:hello@lettr.dev"
					class="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-surface"
				>
					<EnvelopeSimpleIcon size={14} class="text-primary" />
					Contact
				</a>
			</div>
		</div>

		<div id="signup" class="mt-10 border-t border-border/30 pt-6">
			<div class="flex flex-col items-start gap-4">
				<h3 class="text-surface">Ready to get started?</h3>
				<p class="text-sm text-muted">Start sending emails in under 5 minutes. No credit card required.</p>
				<a
					href="#signup"
					class="bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
				>
					Create free account
				</a>
			</div>
		</div>

		<div class="mt-8 text-xs text-muted">
			&copy; {new Date().getFullYear()} Lettr. All rights reserved.
		</div>
	</div>
</footer>
