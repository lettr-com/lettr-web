<script lang="ts">
	interface Props {
		src: string;
		alt?: string;
		caption?: string;
	}

	let { src, alt = '', caption }: Props = $props();
</script>

<figure data-reveal>
	<img {src} {alt} class="w-full border border-border/50 bg-white object-cover" />
	{#if caption}
		<figcaption class="mt-3 text-center text-sm text-muted">{caption}</figcaption>
	{/if}
</figure>
