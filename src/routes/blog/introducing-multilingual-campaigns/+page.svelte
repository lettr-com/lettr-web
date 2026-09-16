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
</script>

<BlogPost
	category="Product"
	title="Introducing multilingual campaigns"
	excerpt="Lettr campaigns can now send one email in several languages, with each contact receiving the version that matches their language: how the template, the contact property, and the campaign fit together, how loosely written values like de-AT or german are matched, what the Review & Send panel shows, and why content is locked at scheduling time."
	metaDescription="Lettr campaigns now send one email in several languages. How the template, contact property, and campaign fit together, how values are matched, and what recipients get."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="September 16, 2026"
	datetime="2026-09-16"
	readTime="6 min read"
	slug="introducing-multilingual-campaigns"
>
	<Lead>
		A Lettr campaign can now go out in more than one language. The template holds an English and a
		German version, the campaign targets one audience, and each contact receives the language stored
		on their contact record. Until now the same newsletter meant two campaigns, two segments, and two
		reports to add up afterwards. The feature is automatic: a campaign whose template has more than
		one language is multilingual, and there is no switch to turn on.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Three pieces make a multilingual campaign</strong>: a template with several
				languages, a contact property that holds each person's language, and the campaign itself.
				Only the first two need setup.
			</li>
			<li>
				<strong>Matching is forgiving.</strong> de, DE, de-AT, german, and Deutsch all resolve to the
				same template language, and a contact with no usable value gets the primary language.
			</li>
			<li>
				<strong>Content is locked at scheduling.</strong> Lettr stores every language version the
				moment a campaign is scheduled or started, so later template edits never change what was
				reviewed.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>One campaign instead of one per language</Heading>

	<Paragraph>
		Before this release, a bilingual audience in Lettr needed a campaign per language. Each one had its
		own template, its own segment filtering on a language property, and its own results page.
		<strong>Every extra language doubled the setup and split the reporting</strong>, and a contact
		whose language field was empty or misspelled fell out of every segment and received nothing.
	</Paragraph>

	<Paragraph>
		A multilingual campaign collapses that into one object. It has one audience, one schedule, one
		results page, and a table on it showing how many people received each language. A contact the
		matching cannot place still receives the primary language, so the send covers the whole audience
		by construction.
	</Paragraph>

	<Heading level={2}>The three pieces</Heading>

	<Paragraph>
		The campaign picks a language for each recipient by reading a value off the contact and comparing
		it with the languages the template contains. That takes a template with languages and a property
		to read; the campaign step needs nothing beyond linking the template.
	</Paragraph>

	<List>
		<li>
			<strong>A template with more than one language.</strong> Languages are added in the email
			editor through the Multilingual control in the top bar. The language the template started in is
			the primary language, every other one is secondary, and the language picker switches between
			them while writing. All versions share one layout; only the text differs.
		</li>
		<li>
			<strong>A contact property that holds the language.</strong> Under Audience → Properties, any
			string property can be marked with "Use as communication language". A team can designate one
			property, and it gets a "Communication language" badge in the list. Without a designated
			property, Lettr looks for one named communication_language, communication_lang, language, lang,
			or locale, in that order, so an audience imported from a CSV with a lang column works with no
			setup at all.
		</li>
		<li>
			<strong>The campaign.</strong> Linking a multilingual template in the Compose step is enough.
			The template's languages show up immediately, before the draft is saved, and the rest of the
			four steps (Compose, Audience, Schedule, Review & Send) stay the same.
		</li>
	</List>

	<Callout variant="info">
		A campaign can only send the languages its template has. An English-and-German template sends English
		or German; a Spanish contact receives the primary language. The
		<a href="https://docs.lettr.com/learn/multilingual-campaigns/template-languages">template
		languages docs</a> cover how primary and secondary languages behave in the editor.
	</Callout>

	<Heading level={2}>How a contact's value is matched</Heading>

	<Paragraph>
		Language values in real audiences are inconsistent. One import writes de, another de_AT, a signup
		form stores German, and someone typed Deutsch by hand. <strong>Lettr compares each value with the
		template's languages from the strictest rule to the loosest</strong>, and the first rule that
		matches wins.
	</Paragraph>

	<List>
		<li>
			<strong>Same tag.</strong> Case, surrounding spaces, and the choice between a hyphen and an
			underscore are ignored, so DE and de both match a template language de.
		</li>
		<li>
			<strong>Same base language.</strong> The region part is dropped in both directions. A contact
			with en-US matches a template language en, and a contact with en matches a template language
			en-GB.
		</li>
		<li>
			<strong>Same language by name.</strong> An alias table maps common names and spellings to codes:
			german, deu, and Deutsch match de, français matches fr, english matches en.
		</li>
	</List>

	<Paragraph>
		A value that survives none of the rules, such as klingon, falls through to the primary language,
		and so does an empty value. Both cases are counted separately on the review panel, so a data
		problem is visible before the send rather than after. Segments also gained "is empty" and "is not
		empty" conditions in this release, which makes a "contacts without a language" segment a
		one-condition filter.
	</Paragraph>

	<Callout variant="info">
		The designated property also decides the language of the hosted preferences page and the
		unsubscribe and web-version pages, so one setting covers every recipient-facing surface. The full
		alias table and the matching rules are in the
		<a href="https://docs.lettr.com/learn/multilingual-campaigns/contact-language">contact language
		docs</a>.
	</Callout>

	<Heading level={2}>Per-language subject and sender</Heading>

	<Paragraph>
		The Compose step has a new "Per-language subject and sender" section under the regular subject and
		sender fields, with one expandable row per secondary language. Each row can carry its own subject,
		from name, from email, and reply-to. <strong>An empty field inherits the primary value</strong>, so
		a translated subject alone is enough, and the German version can go out from the same address as
		the English one without repeating it.
	</Paragraph>

	<Paragraph>
		A per-language from email has to use one of the team's verified sending domains, and Lettr checks
		this when the draft is saved rather than at send time.
	</Paragraph>

	<!-- SCREENSHOT: Compose step, "Per-language subject and sender" section with the DE row expanded. -->

	<Heading level={2}>The Review & Send panel</Heading>

	<Paragraph>
		The last step before sending has a "Multi-language send" panel that answers the question a sender
		actually has at that point: who is getting what. It names the property the language is read from
		and whether it was designated or matched by name. Below that, a table lists each language with its
		recipient count and the subject and sender it will use, marking the ones that were customized.
		<strong>The fallback summary at the bottom shows how many contacts get the primary language and
		why</strong>, split into contacts with no value and contacts whose value matched nothing, with the
		unmatched values and their counts listed.
	</Paragraph>

	<Paragraph>
		When no property holds a language at all, the panel shows a warning instead of the table, because
		the whole audience would receive the primary version. The warning links to Audience → Properties.
	</Paragraph>

	<!-- SCREENSHOT: Review & Send step, "Multi-language send" panel with three languages and the fallback summary. -->

	<Paragraph>
		The "Send a test email" box on the same step has a language picker. A test in a secondary language
		uses that language's content, subject, and sender, so each version can be checked in a real inbox
		before the campaign goes out.
	</Paragraph>

	<Heading level={2}>What each recipient gets</Heading>

	<Paragraph>
		Everything that is visible to the recipient follows their language, not only the body. The email
		content, the subject, the sender and reply-to (custom or inherited), and the automatic unsubscribe
		footer are all in the matched language. <strong>The footer is translated for 19 languages</strong>;
		any other language gets the English footer. The "view in browser" link opens the same language the
		recipient received.
	</Paragraph>

	<Paragraph>
		After the send, the campaign detail page shows the same language panel with final counts, and the
		activity list marks each secondary-language recipient with a small language badge next to their
		address. The badge records the language at the time of sending, so a contact who later switches
		language keeps an accurate history.
	</Paragraph>

	<!-- SCREENSHOT: Campaign detail, activity list with DE badges next to recipient addresses. -->

	<Heading level={2}>Content is locked when the campaign is scheduled</Heading>

	<Paragraph>
		<strong>Scheduling or starting a campaign stores a copy of the template's content in every
		language.</strong> A template edited or deleted after that point does not affect the campaign; it
		sends what was reviewed. Unscheduling removes the stored copy, so a rescheduled campaign picks up
		the current template again. A duplicated campaign starts as a normal draft with no stored copy.
	</Paragraph>

	<Paragraph>
		Campaigns sent before this release keep behaving as they did. Their content was stored in one
		language and cannot be rebuilt in others.
	</Paragraph>

	<Heading level={2}>Smaller changes in the same release</Heading>

	<List>
		<li>
			<strong>Audience merge tags.</strong> The editor's merge-tag menu for campaigns has an
			"Audience" group listing every contact property, so a property can be dropped into the content
			without typing its key.
		</li>
		<li>
			<strong>Language field over the API.</strong> The communication-language flag can be set when a
			property is created or updated through the API, which matters for teams that provision their
			audience schema from code.
		</li>
		<li>
			<strong>Abuse screening per language.</strong> Screening runs on every language that has
			recipients, and the review report shows the version with the highest risk score if any is
			flagged.
		</li>
		<li>
			<strong>Reply-To fix.</strong> The Reply-To set on a campaign is now used on the sent emails. It
			was being dropped before.
		</li>
	</List>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="Do I have to enable multilingual campaigns?">
			<strong>No. A campaign is multilingual whenever its template has more than one language.</strong>
			The only setup is adding languages to the template in the editor and making sure a contact
			property holds each contact's language, either by designating one or by naming it language,
			lang, or locale.
		</FaqItem>
		<FaqItem question="What happens to a contact with no language, or a value like klingon?">
			<strong>They receive the primary language.</strong> Nobody is skipped. The Review & Send panel
			counts both groups separately and lists the values that did not match, so the data can be fixed
			before the send if it matters.
		</FaqItem>
		<FaqItem question="Does a contact stored as en-GB get my en template?">
			<strong>Yes.</strong> Matching tries the exact tag first, then the base language, then common
			names and spellings. Case and the hyphen-versus-underscore choice never matter.
		</FaqItem>
		<FaqItem question="Can I give the German version a different subject and sender?">
			<strong>Yes. Each secondary language has its own optional subject, from name, from email, and
			reply-to.</strong> Any field left empty inherits the primary value, and a per-language from email
			must belong to one of the team's verified sending domains.
		</FaqItem>
		<FaqItem question="What if someone edits the template after I schedule the campaign?">
			<strong>The campaign is unaffected.</strong> Lettr stores every language version when the campaign
			is scheduled or started. Unscheduling drops the stored copy, so rescheduling picks up the
			current template.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		A newsletter for a bilingual audience is one campaign again: one template with two languages, one
		audience, one results page, and every contact receiving the version they asked for.
		<strong>The free tier covers 500 contacts, which is enough to add a second language to a template
		and send a real multilingual campaign.</strong>
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> to try it, or read the
		<a href="https://docs.lettr.com/learn/multilingual-campaigns/introduction">multilingual campaigns
		docs</a> for the full matching rules and setup.
	</Paragraph>
</BlogPost>
