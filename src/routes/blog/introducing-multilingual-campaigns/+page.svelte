<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Callout,
		Faq,
		FaqItem
	} from '$lib/components/blog';

	// Single source for the visible FAQ and the FAQPage structured data.
	const faqItems = [
		{
			question: "Do I have to enable multilingual campaigns?",
			lead: "No. A campaign is multilingual whenever its template has more than one language.",
			rest: "The only setup is adding languages to the template and making sure a contact property holds each contact's language, either by marking one as the communication language or by naming it language, lang, or locale."
		},
		{
			question: "What happens to a contact with no language, or a value like klingon?",
			lead: "They receive the primary language.",
			rest: "Nobody is skipped. Lettr counts both groups before the send and lists the values that did not match, so the data can be fixed first."
		},
		{
			question: "Can the language property be set up through the API?",
			lead: "Yes. The communication-language flag can be set when a property is created or updated through the API.",
			rest: "Language values written in the usual formats, such as de, de-AT, or en_US, are matched as they are."
		},
		{
			question: "Can I give the German version a different subject and sender?",
			lead: "Yes. Each secondary language has its own optional subject, from name, from email, and reply-to.",
			rest: "Any field left empty inherits the primary value, and a per-language from email must belong to one of the team's verified sending domains."
		},
		{
			question: "What if someone edits the template after I schedule the campaign?",
			lead: "The campaign is unaffected.",
			rest: "Lettr stores every language version when the campaign is scheduled or started. Unscheduling drops the stored copy, so rescheduling picks up the current template."
		},
	];
	const faqs = faqItems.map(({ question, lead, rest }) => ({ question, answer: `${lead} ${rest}` }));
</script>

<BlogPost
	category="Product"
	title="Introducing multilingual campaigns"
	seoTitle="Multilingual email campaigns in Lettr"
	excerpt="Lettr campaigns can now send one email in several languages, and each contact receives the version that matches their language. This post covers which audiences benefit, what replaces the one-campaign-per-language setup, how messy language values like de-AT or german are handled, and what recipients see."
	metaDescription="Lettr campaigns now send one email in several languages. Who it is for, how messy language values are matched, and what each recipient sees."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="September 16, 2026"
	datetime="2026-09-16"
	dateModified="2026-09-17"
	readTime="5 min read"
	slug="introducing-multilingual-campaigns"
	{faqs}
>
	<Lead>
		A Lettr campaign can now send one email in several languages. The template holds every language
		version (English, German, and French, for example), the campaign targets one audience, and each
		contact receives the version that matches the language stored on their contact record. Nothing
		has to be enabled: a campaign is multilingual whenever its template has more than one language.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>One campaign covers every language.</strong> It has one template, one audience, and
				one results page, so a second language costs a translation and no extra campaign setup.
			</li>
			<li>
				<strong>It works with the language data already in the audience.</strong> de, DE, de-AT,
				german, and Deutsch all resolve to German, and a contact with no usable value gets the primary
				language, so nobody is skipped.
			</li>
			<li>
				<strong>The whole email is localized.</strong> The subject, the sender, the unsubscribe
				footer, and the unsubscribe and preferences pages follow the recipient's language along with
				the content.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Who multilingual campaigns are for</Heading>

	<Paragraph>
		Multilingual campaigns are for any audience that does not share one language. The feature fits
		<strong>three kinds of audience</strong> in particular.
	</Paragraph>

	<List>
		<li>
			<strong>Countries with more than one language.</strong> A shop or service in Switzerland,
			Belgium, or Canada has one customer base that reads German, French, Dutch, or English. The
			customers already sit in one audience, and the newsletter can now be one campaign too.
		</li>
		<li>
			<strong>Products sold across borders.</strong> A product with users in several countries can
			send a release announcement or a newsletter to the whole user base at once, and each user reads
			it in their own language.
		</li>
		<li>
			<strong>Audiences with a language minority.</strong> A smaller group of German readers inside a
			mostly English audience no longer needs a campaign of its own. Adding German costs a translation
			of the text, and the campaign setup stays the same.
		</li>
	</List>

	<Heading level={2}>One campaign instead of one per language</Heading>

	<Paragraph>
		Before this release, sending the same newsletter in two languages took a separate campaign for
		each language, and each campaign had its own template, its own segment filtered by language, and
		its own results page.
		<strong>Every extra language repeated the setup and split the reporting</strong>, and the results
		of one newsletter had to be added up by hand.
	</Paragraph>

	<Paragraph>
		A multilingual campaign has <strong>one audience, one schedule, and one results page</strong>,
		with a table showing how many people received each language. The template works the same way:
		all language versions share one layout and only the text differs, so a design change is made once
		and applies to every language.
		The <a href="/platform/multilingual-campaigns/">Multilingual Campaigns page</a> shows the whole
		flow, with a live matcher for trying language values.
	</Paragraph>

	<Heading level={2}>It works with the language data already in the audience</Heading>

	<Paragraph>
		Language values in real audiences are inconsistent: one import writes de, another writes de_AT,
		and a signup form stores German. <strong>Lettr accepts all of these without a data cleanup.</strong>
		Matching ignores case and the choice between a hyphen and an underscore, drops the region where
		needed (de-AT matches a German template, and en matches en-GB), and recognizes common names such
		as german, Deutsch, or français.
	</Paragraph>

	<Paragraph>
		The property that holds the language needs little setup. A property named language, lang, or
		locale is picked up automatically, so an audience imported from a CSV with a lang column works as
		it is, and any other string property can be marked as the
		<a href="/glossary/communication-language/">communication language</a>.
		<strong>The same flag can be set through the API</strong> when a property is created or updated,
		so a team that manages its audience schema from code can set up the language property in the same
		script.
	</Paragraph>

	<Callout variant="info">
		The full list of accepted language names and the matching rules are in the
		<a href="https://docs.lettr.com/learn/multilingual-campaigns/contact-language">contact language
		docs</a>.
	</Callout>

	<Heading level={2}>Every contact still gets the email</Heading>

	<Paragraph>
		With one campaign per language, a contact whose language field was empty or misspelled matched no
		segment and received nothing. In a multilingual campaign,
		<strong>a contact whose language is missing or unrecognized receives the
			<a href="/glossary/primary-language/">primary language</a></strong
		>,
		so the send always covers the whole audience.
	</Paragraph>

	<Paragraph>
		The fallback is visible before the send. Lettr shows how many contacts will get the primary
		language and why, with the unrecognized values listed, so a data gap can be fixed while it still
		matters. Segments also have new "is empty" and "is not empty" conditions, which makes the contacts
		without a language a one-condition segment.
	</Paragraph>

	<Callout variant="info">
		A campaign can only send the languages its template has. An English-and-German template sends
		English or German, and a Spanish contact receives the primary language. The
		<a href="https://docs.lettr.com/learn/multilingual-campaigns/template-languages">template
		languages docs</a> cover how primary and secondary languages work.
	</Callout>

	<Heading level={2}>The whole email is in the recipient's language</Heading>

	<Paragraph>
		<strong>Everything the recipient sees follows their language</strong>: the content, the subject,
		the sender, and the automatic unsubscribe footer, which is translated for 19 languages (any other
		language gets the English footer). The "view in browser" link opens the language the recipient
		received, and the hosted unsubscribe and preferences pages open in that language too.
	</Paragraph>

	<Paragraph>
		Each secondary language can have its own subject, from name, from email, and reply-to.
		<strong>An empty field inherits the primary value</strong>, so translating the subject alone is
		enough. A separate reply-to is useful when replies should reach people who speak the language,
		such as a German support inbox.
	</Paragraph>

	<Heading level={2}>Safe to schedule ahead</Heading>

	<Paragraph>
		A scheduled campaign sends exactly what was reviewed.
		<strong>Scheduling or starting a campaign stores a copy of the template's content in every
		language</strong>, and a template edited after that point does not affect the campaign. Work on
		the next issue can continue in the same template while the current one waits to send.
		Unscheduling removes the stored copy, so a rescheduled campaign picks up the current template
		again.
	</Paragraph>

	<Paragraph>
		Each language version can also be sent as a test email first, with its own content, subject, and
		sender, and checked in a real inbox before the campaign goes out.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		{#each faqItems as item}
			<FaqItem question={item.question}>
				<strong>{item.lead}</strong>
				{item.rest}
			</FaqItem>
		{/each}
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		A newsletter for a multilingual audience is one campaign: one template with several languages,
		one audience, one results page, and every contact receiving the version in their language.
		<strong>The free tier covers 500 contacts, which is enough to add a second language to a template
		and send a real multilingual campaign.</strong>
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> to try it. Once you're
		in, the
		<a href="https://docs.lettr.com/learn/multilingual-campaigns/introduction">multilingual campaigns
		docs</a> walk through the setup with screenshots.
	</Paragraph>
</BlogPost>
