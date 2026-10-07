<script lang="ts">
	import type { Brand, EmailKind, Layout } from '$lib/home/brands';

	/*
	 * One fictional email, drawn from a Brand (colours, type, logo, copy) and a
	 * Layout (header, hero, alignment, button and code styles). The same three
	 * templates are re-skinned by swapping the brand and layout.
	 */

	interface Props {
		brand: Brand;
		kind: EmailKind;
		layout: Layout;
	}

	let { brand, kind, layout }: Props = $props();

	function luminance(hex: string) {
		const channel = (i: number) => {
			const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
			return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		};
		return 0.2126 * channel(0) + 0.7152 * channel(1) + 0.0722 * channel(2);
	}

	function contrast(a: string, b: string) {
		const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
		return (hi + 0.05) / (lo + 0.05);
	}

	const c = $derived(brand.colors);
	const f = $derived(brand.fonts);
	const logo = $derived(brand.logo);
	const centered = $derived(layout.align === 'center');

	/** Accent used as text or marks on the email background, falling back to ink when it would vanish. */
	const accentText = $derived(contrast(c.accent, c.bg) >= 3 ? c.accent : c.ink);
	const ctaBg = $derived(c.cta === 'accent' ? c.accent : c.ink);
	const ctaInk = $derived(c.cta === 'accent' ? c.accentInk : c.bg);
	const codeDigits = $derived(
		kind === 'transactional' && brand.copy.transactional.code
			? brand.copy.transactional.code.replace(/\s+/g, '').split('')
			: []
	);
</script>

{#snippet mark(fill: string, knockout: string)}
	{#if logo.mark === 'triangle'}
		<svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true"><path d="M0 14L6 3L9 8L11 5L16 14Z" {fill} /></svg>
	{:else if logo.mark === 'circle'}
		<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="8" {fill} /></svg>
	{:else if logo.mark === 'ring'}
		<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
			<circle cx="11" cy="11" r="11" {fill} />
			<circle cx="11" cy="11" r="4" fill={knockout} />
		</svg>
	{:else if logo.mark === 'square'}
		<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
			<rect width="20" height="20" {fill} />
			<rect x="6" y="6" width="8" height="8" fill={knockout} />
		</svg>
	{:else if logo.mark === 'diamond'}
		<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
			<path d="M13 1L25 13L13 25L1 13Z" {fill} />
			<path d="M13 7L19 13L13 19L7 13Z" fill={knockout} />
		</svg>
	{/if}
{/snippet}

{#snippet wordmark(color: string)}
	<span
		class="block leading-none whitespace-nowrap"
		style:color
		style:font-family={logo.font}
		style:font-weight={logo.weight}
		style:letter-spacing={logo.tracking}
		style:font-size="{logo.size}px"
		style:font-style={logo.italic ? 'italic' : 'normal'}
	>{logo.text}</span>
{/snippet}

{#snippet header()}
	{#if layout.header === 'band'}
		<div class="flex flex-col items-center gap-2.5 px-[18px] py-6" style:background-color={c.accent}>
			{@render mark(c.accentInk, c.accent)}
			{@render wordmark(c.accentInk)}
			{#if logo.sub}<span class="text-[8px] tracking-[0.28em]" style:color={c.accentInk}>{logo.sub}</span>{/if}
		</div>
	{:else if layout.header === 'center'}
		<div class="flex flex-col items-center gap-0.5 border-b px-[18px] py-4" style:border-color={c.line}>
			<div class="flex items-center gap-2">
				{@render mark(accentText, c.bg)}
				{@render wordmark(logo.wordmark === 'accent' ? accentText : c.ink)}
			</div>
			{#if logo.sub}<span class="text-[8px] tracking-[0.28em]" style:color={c.muted}>{logo.sub}</span>{/if}
		</div>
	{:else}
		<div class="flex items-center gap-2 px-[18px] py-4">
			{@render mark(accentText, c.bg)}
			<div class="flex flex-col gap-0.5">
				{@render wordmark(logo.wordmark === 'accent' ? accentText : c.ink)}
				{#if logo.sub}<span class="text-[8px] tracking-[0.28em]" style:color={c.muted}>{logo.sub}</span>{/if}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet headline(text: string, size: number, color: string)}
	<div
		class="m-0 font-normal"
		style:color
		style:font-family={f.display}
		style:font-weight={f.displayWeight}
		style:letter-spacing={f.displayTracking}
		style:text-transform={f.displayCase === 'uppercase' ? 'uppercase' : 'none'}
		style:font-size="{size}px"
		style:line-height="{Math.round(size * 1.08)}px"
	>{text}</div>
{/snippet}

{#snippet cta(label: string)}
	<span
		class="inline-flex items-center justify-center px-4 py-[11px] text-xs leading-4 font-semibold {layout.cta === 'block' ? 'w-full' : centered ? 'self-center' : 'self-start'}"
		style:background-color={layout.cta === 'outline' ? 'transparent' : ctaBg}
		style:color={layout.cta === 'outline' ? c.ink : ctaInk}
		style:border={layout.cta === 'outline' ? `1.5px solid ${c.ink}` : '1.5px solid transparent'}
		style:font-family={f.displayCase === 'uppercase' ? f.display : f.body}
	>{label}</span>
{/snippet}

{#snippet footer(suffix?: string)}
	<div class="mt-1 border-t px-[18px] pt-2.5 pb-4 {centered ? 'text-center' : ''}" style:border-color={c.line}>
		<span class="text-[10px] leading-[14px]" style:color={c.muted} style:font-family={f.body}>
			{brand.footer}{suffix ? ` · ${suffix}` : ''}
		</span>
	</div>
{/snippet}

<div
	aria-hidden="true"
	class="w-[300px] text-left shadow-[0_0_40px_-12px_rgba(17,24,39,0.2)]"
	style:background-color={c.bg}
	style:color={c.ink}
	style:font-family={f.body}
>
	{@render header()}

	{#if kind === 'marketing'}
		{@const copy = brand.copy.marketing}
		{#if layout.hero === 'band'}
			<div
				class="flex flex-col gap-2 px-[18px] pt-6 pb-[26px] {centered ? 'items-center text-center' : ''}"
				style:background-color={c.accent}
				style:color={c.accentInk}
			>
				<span class="text-[10px] leading-[14px] tracking-[0.16em] opacity-75" style:font-family={f.body}>{copy.eyebrow}</span>
				{@render headline(copy.headline, 27, c.accentInk)}
			</div>
		{:else}
			<div class="flex flex-col gap-2 px-[18px] pt-6 {centered ? 'items-center text-center' : ''}">
				<span class="text-[10px] leading-[14px] tracking-[0.16em]" style:color={accentText} style:font-family={f.body}>{copy.eyebrow}</span>
				{@render headline(copy.headline, 27, c.ink)}
			</div>
		{/if}
		<div class="flex flex-col gap-3.5 px-[18px] pt-[18px] pb-[18px] {centered ? 'items-center text-center' : ''}">
			<p class="m-0 text-xs leading-[18px]" style:color={c.muted}>{copy.body}</p>
			{@render cta(copy.cta)}
		</div>
		<div class="flex gap-2.5 px-[18px] pb-[18px]">
			{#each copy.items as item, i}
				<div class="flex flex-1 flex-col gap-1.5">
					<div class="h-[84px]" style:background-color={c.soft} style:opacity={i === 0 ? 1 : 0.7}></div>
					<span class="text-[11px] leading-[14px] font-semibold" style:color={c.ink}>{item.name} · {item.price}</span>
				</div>
			{/each}
		</div>
		{@render footer(copy.suffix)}
	{:else if kind === 'ecommerce'}
		{@const copy = brand.copy.ecommerce}
		<div class="flex flex-col gap-1.5 px-[18px] pt-[22px] pb-4 {centered ? 'items-center text-center' : ''}">
			<span class="text-[10px] leading-[14px] font-medium tracking-[0.12em]" style:color={accentText}>{copy.eyebrow}</span>
			{@render headline(copy.headline, 22, c.ink)}
			<p class="m-0 text-[11px] leading-4" style:color={c.muted}>{copy.sub}</p>
		</div>
		<div class="mx-[18px] flex items-center gap-3 border-y py-3" style:border-color={c.line}>
			<div class="h-16 w-[52px] shrink-0" style:background-color={c.soft}></div>
			<div class="flex flex-1 flex-col gap-[3px] text-left">
				<span class="text-xs leading-4 font-semibold" style:color={c.ink}>{copy.item.name}</span>
				<span class="text-[11px] leading-[14px]" style:color={c.muted}>{copy.item.meta}</span>
			</div>
			<span class="text-xs leading-4 font-semibold" style:color={c.ink}>{copy.item.price}</span>
		</div>
		<div class="flex items-center justify-between px-[18px] pt-3 pb-4">
			<span class="text-xs leading-4 font-semibold" style:color={c.ink}>{copy.totalLabel}</span>
			<span class="text-xs leading-4 font-semibold" style:color={c.ink}>{copy.total}</span>
		</div>
		<div class="flex flex-col px-[18px] pb-[18px]">{@render cta(copy.cta)}</div>
		{@render footer()}
	{:else}
		{@const copy = brand.copy.transactional}
		<div class="flex flex-col gap-2 px-[18px] pt-4 pb-3.5 {centered ? 'items-center text-center' : ''}">
			{@render headline(copy.headline, 20, c.ink)}
			<p class="m-0 text-xs leading-[18px]" style:color={c.muted}>{copy.body}</p>
		</div>
		{#if codeDigits.length}
			{#if layout.code === 'tiles'}
				<div class="flex justify-center gap-1.5 px-[18px] pt-1 pb-4">
					{#each codeDigits as digit}
						<div
							class="flex h-[46px] items-center justify-center border"
							style:width="{Math.min(36, Math.floor(260 / codeDigits.length) - 6)}px"
							style:background-color={c.soft}
							style:border-color="{c.accent}66"
						>
							<span class="text-[22px] leading-7 font-semibold" style:color={c.ink} style:font-family={f.body}>{digit}</span>
						</div>
					{/each}
				</div>
			{:else}
				<div class="mx-[18px] mt-1 mb-4 flex items-center justify-center border px-3 py-[18px]" style:background-color={c.soft} style:border-color={accentText}>
					<span class="text-[30px] leading-9 font-semibold tracking-[0.18em] whitespace-pre" style:color={c.ink} style:font-family={f.body}>{copy.code}</span>
				</div>
			{/if}
		{/if}
		<div class="flex flex-col px-[18px] pb-3.5">{@render cta(copy.cta)}</div>
		<p class="m-0 px-[18px] pb-[18px] text-[11px] leading-4 {centered ? 'text-center' : ''}" style:color={c.muted}>{copy.note}</p>
		{@render footer()}
	{/if}
</div>
