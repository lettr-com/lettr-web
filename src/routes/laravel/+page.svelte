<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import LaravelHero from '$lib/components/laravel/LaravelHero.svelte';
	import PipelineSection from '$lib/components/laravel/PipelineSection.svelte';
	import CodeWall from '$lib/components/laravel/CodeWall.svelte';
	import TeamWorkflowSection from '$lib/components/laravel/TeamWorkflowSection.svelte';
	import RetriesSection from '$lib/components/laravel/RetriesSection.svelte';
	import VideoSection from '$lib/components/laravel/VideoSection.svelte';
	import IndexSection from '$lib/components/laravel/IndexSection.svelte';
	import LaravelFaq from '$lib/components/laravel/LaravelFaq.svelte';
	import PricingSlider from '$lib/components/home/PricingSlider.svelte';
	import { absoluteUrl, jsonLdScript, organization } from '$lib/utils/jsonLd';
	import { faqPage, featurePageJsonLd } from '$lib/utils/pageJsonLd';
	import { laravelFaqs } from '$lib/laravel/faqs';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const path = '/laravel/';
	const title = 'Laravel Email API and Mail Driver | Lettr';
	const description =
		'Lettr for Laravel: a mail driver for your Mailables, typed templates your team edits without a deploy, and queued sends that never go out twice.';

	const base = featurePageJsonLd({ path, title: 'Lettr for Laravel', description });
	const structuredData = {
		...base,
		'@graph': [
			...base['@graph'],
			{
				'@type': 'SoftwareSourceCode',
				'@id': `${absoluteUrl(path)}#package`,
				name: 'lettr/lettr-laravel',
				description: 'The official Laravel package for Lettr: a mail transport, typed templates and the Lettr facade.',
				codeRepository: 'https://github.com/TOPOL-io/lettr-laravel',
				programmingLanguage: 'PHP',
				runtimePlatform: 'PHP 8.4',
				license: 'https://opensource.org/licenses/MIT',
				publisher: { '@id': organization['@id'] }
			},
			faqPage(absoluteUrl(path), laravelFaqs.map(({ question, answer }) => ({ question, answer })))
		]
	};
</script>

<Seo
	{title}
	{description}
	ogTitle="The email API built for Laravel | Lettr"
	ogDescription="Keep your Mailables and Mail::to(). Lettr adds templates your team edits without a deploy, generated types for every merge tag, and retry-safe queued sends."
	canonical={path}
/>

<svelte:head>
	{@html jsonLdScript(structuredData)}
</svelte:head>

<LaravelHero />
<PipelineSection />
<CodeWall highlighted={data.highlighted} />
<TeamWorkflowSection />
<RetriesSection syncSend={data.highlighted.syncSend} />
<VideoSection />
<IndexSection />
<PricingSlider placement="laravel_pricing" transactionalQuestion="How many emails does your app send per month?" dither="edge">
	{#snippet header()}
		<div class="mx-auto mb-10 flex max-w-[1100px] flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
			<h2
				id="pricing-heading"
				class="m-0 font-heading text-[1.875rem] leading-[38px] text-balance tracking-[-0.02em] text-surface md:text-[2.625rem] md:leading-[50px]"
			>
				Start free.
				<em class="block font-serif text-[2.125rem] leading-[1.1] text-primary md:text-[2.875rem] md:leading-[50px]">Pay per email after.</em>
			</h2>
			<p class="m-0 text-pretty max-w-[400px] shrink-0 text-[1.0625rem] leading-[27.2px] text-surface md:text-[1.1875rem] md:leading-[30.4px]">
				Transactional email is billed per email, campaigns per contact, both from the same account.
			</p>
		</div>
	{/snippet}
</PricingSlider>
<LaravelFaq highlighted={data.highlighted} />
