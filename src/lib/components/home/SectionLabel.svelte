<script lang="ts">
	interface Props {
		index: number;
		total?: number;
		label: string;
		light?: boolean;
	}

	let { index, total = 7, label, light = false }: Props = $props();

	const pad = (n: number) => String(n).padStart(2, '0');
</script>

<div class="mb-5 flex items-center gap-3 text-sm font-semibold {light ? 'text-white/60' : 'text-muted'}">
	<span class="text-primary tabular-nums">{pad(index)}</span>
	<span class="tabular-nums {light ? 'text-white/30' : 'text-border'}">/ {pad(total)}</span>
	<span class="block h-px w-6 {light ? 'bg-white/20' : 'bg-border'}"></span>
	<span>{label}</span>
</div>
