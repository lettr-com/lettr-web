<script lang="ts">
	import { onMount } from 'svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { capturePosthogEvent } from '$lib/analytics/posthog';

	interface ChangelogEntry {
		date: string;
		title: string;
		slug: string;
		summary: string;
		content: string;
		authors: Array<{ name: string; initials: string; avatar?: string }>;
		tag?: string;
	}

	const changelog: ChangelogEntry[] = [
		{
			date: 'Aug 31, 2026',
			title: 'Bulk contact import, and a real preferences page',
			slug: 'bulk-import-and-email-preferences',
			summary:
				'One call now imports a whole batch of contacts with their properties, lists and topics, plus a preferences page that replaces the old unsubscribe screen.',
			tag: 'API',
			authors: [{ name: 'Tom from Lettr', initials: 'T', avatar: '/images/authors/tom.jpg' }],
			content: `Importing contacts over our API used to cost one request per contact, against a per-team throttle of three requests a second. Ten thousand contacts meant roughly thirty thousand requests and the better part of three hours. The new bulk import takes about ten requests and a few seconds.

## Bulk contacts

One call now imports a whole batch, and each contact in it brings its own properties, list memberships and topic subscriptions. The response returns the ids of everything created, so there is no paging through the audience afterwards to find what just landed. Rows that fail validation are skipped and reported individually instead of sinking the whole batch, and a flag lets an import update contacts that already exist rather than duplicating them.

**The old import payload keeps its exact semantics.** Existing integrations keep working, untouched.

## Read this before you upgrade

Same rule as in May: if you built against any of these, you're owed the explanation rather than a silent fix.

**An opt-out inside an import could be silently ignored.** For contacts we already knew about, a row unsubscribing someone only took effect if the update-existing flag happened to be set; the request succeeded and the contact stayed subscribed. Opt-outs are now honoured unconditionally. A withdrawal of consent is not a data field that a request flag gets to override.

**The 50-recipient cap now counts cc and bcc.** It was documented that way all along but enforced only on the To field, so a request could carry, and be billed for, far more addresses than intended. Anything over the cap is now rejected. Check your fan-out before you upgrade.

**API sends skip unsubscribe suppression by default.** That was always the behaviour; the spec now says it out loud. If you're sending anything marketing-shaped through the API, turn the transactional option off.

## A real preferences page

The old unsubscribe screen did exactly one thing. The signed link in your emails now opens a full preferences page instead, aimed at everyone who was never going to build their own.

Recipients see their current status, a checkbox per topic, a pause of 30, 60 or 90 days, and the campaigns they recently received. One button commits it all: untick everything to unsubscribe (behind a reason dialog), tick topics again to come back. Topic opt-outs genuinely suppress sends, and consent is re-checked at send time rather than trusted from an earlier read.

Paused recipients are visible on your side too: a badge and filter in Audiences, the pause end date in exports, and a new nullable field on the API that changes nothing you already parse.

## The rest of the month

Adamko is on for every team now, and he can create an API key or register a sending domain directly in conversation instead of only inside the setup flow. Asked to do either in ordinary chat he used to refuse with reasons he had invented, including that adding a domain requires your registrar login. It never has.

DNS alerts back off instead of firing daily forever. A record that stays broken alerts a few more times at growing intervals and then goes quiet, while the domain keeps showing as failing in the app; a fresh break still alerts immediately.

And brand kit collected a month of fixes: logo detection stopped preferring partner badges to the site's own mark, near-white logos stay visible on light backgrounds, and generated emails no longer ship a pink divider to brands with no pink in them.`
		},
		{
			date: 'Jul 24, 2026',
			title: 'Adamko builds your emails now',
			slug: 'adamko-brand-kit-and-generated-emails',
			summary:
				'Paste a URL, get a set of transactional emails in your brand colors, your fonts, your logo and your language.',
			tag: 'AI',
			authors: [{ name: 'Erik from Lettr', initials: 'E', avatar: '/images/authors/erik.jpg' }],
			content: `Adamko has been answering questions and moving people around the app since June. As of this week he builds things, and what we taught him to build first is a set of transactional emails that already look like they came from you.

## Start with the website

Give him a URL and he reads the site to assemble a brand kit from it: colors, fonts, logo. That was much harder than it sounds. Our first attempt collected every color on the page and concluded that a company's brand palette was mostly the grey of a disabled button plus whatever blue the browser paints over selected text. It was extremely confident about this. **Hover, focus and selection states are now excluded from extraction**, which cleared up most of it.

Fonts had their own problems. A stylesheet lists fallback stacks, so reading the CSS tells you what a site would *like* to render in, not what any visitor has actually seen. We check what's really being served instead. Twelve separate defects went into making a feature this boring behave, which felt absurd at the time and completely worth it now.

## Then the emails

Once there's a brand kit, Adamko scaffolds a full set of transactional emails from it. Describe what your product does and he chooses the types that suit it, starts from our premade bases, and restyles those with your typography, your palette and your logo in the header.

Building on existing templates rather than generating markup from nothing was a deliberate call. Email clients are genuinely hostile and our premades have already been through them. Asking a language model to invent nested table markup that survives Outlook is a bet I did not want to place, and I'd make that same choice again tomorrow.

The copy comes back in your website's language rather than in English. Czech site, Czech emails, subjects included. For a European company that was never really optional, and out of everything in this release it's the piece I'm happiest we got to.

Generation runs in the background behind a progress bar and a rough countdown. The first version showed a bare spinner and no indication of whether the job was still alive. It always was, but nobody watching could have told you that, which is why the countdown exists.

## The part I'd want to read first

Everything Adamko creates goes into an activity log, and anything he made can be undone from one place. We wrote the undo before we wrote most of the generation, because I don't think anyone should hand an AI write access to their account without a cheap way back out. Tool calls are audited, secrets and personal data are stripped before a request reaches the model, and each team gets a token budget it can actually inspect.

He's available on every plan while we're in beta. **Point him at your website and see what comes back.** If he gets your brand wrong I'd really like to hear about it, because that's the kind of bug that only ever turns up on real sites and never in our tests.`
		},
		{
			date: 'Jun 9, 2026',
			title: 'Meet Adamko, and a new app to put him in',
			slug: 'adamko-ai-and-new-layout',
			summary:
				'An AI assistant that knows your account and can act inside it, plus a rebuilt app layout that separates transactional from marketing.',
			tag: 'AI',
			authors: [{ name: 'Jakub from Lettr', initials: 'J', avatar: '/images/authors/jakub.jpg' }],
			content: `Two projects shipped this month. We scoped them as unrelated work, which lasted about a week.

## Modes

Lettr does transactional email and marketing email, and until now both sets of navigation lived in one sidebar. Everyone saw twice the menu they needed and quietly filtered out the half that wasn't theirs. Nobody ever raised it as a problem, which is the difficult kind: a complaint you can act on, whereas people silently using less of your product is something you have to go looking for.

The sidebar now opens with a mode switcher, Transactional or Marketing, and everything below it narrows to the one you picked.

Shared links were the genuinely tricky bit, since a campaign URL says nothing about which mode the person opening it was last in. **Mode is inferred from the URL**, so a pasted link lands correctly regardless, and the choice sticks between sessions after that. Analytics and Events now sit under Metrics together, an arrangement nothing was stopping us from choosing the first time.

We rebuilt the layout against the Figma designs while this was open, including a real mobile drawer. The previous mobile experience was the desktop sidebar, narrower.

## Adamko

Adamko is an AI assistant in a drawer in the app. The part that matters is that he can read your account, which is what separates him from a docs search with a chat box on the front.

Asked which domains are verified, he goes and checks. Asked why some recipient never got their email, he pulls the event trail for that address and tells you what it says. Asked to set up a sending domain, he walks the DNS records one at a time and confirms propagation at the end, rather than wishing you luck halfway through.

Where the right answer is a page in the app, he opens it instead of describing how to get there.

Onboarding runs through him now too. A guided setup that ends with a verified domain and a working API key is a fair improvement on what we had before, which was a checklist sitting next to a link to the docs.

He replies in whatever language you write to him in. He is also banned from using emoji, an instruction that took several attempts to make stick.`
		},
		{
			date: 'May 27, 2026',
			title: 'Audience and campaigns, now over the API',
			slug: 'audience-and-campaigns-api',
			summary:
				'Everything the marketing module does in the UI is available over the REST API, with the OpenAPI spec updated to match.',
			tag: 'API',
			authors: [{ name: 'Tom from Lettr', initials: 'T', avatar: '/images/authors/tom.jpg' }],
			content: `We shipped the marketing module's UI before its API. That was deliberate and I'd do it again, but it left your code unable to do things the app could do, which is a bad place to leave people for long. This release closes it.

Contacts, lists, segments, topics and properties are all addressable over the API now, and so are campaigns: create a draft, attach an audience, schedule it, read the stats back. The OpenAPI spec generates from the same source as the endpoints, so the reference can't quietly disagree with the implementation.

## Read this before you upgrade

Two things were wrong before this release. If you built against either, you're owed a straight explanation rather than a silent fix.

**Segment AND/OR semantics were documented backwards.** The implementation was right; the reference described its exact opposite. Careful reading of our docs therefore produced exactly the wrong conditions, which is worse than having no docs at all. Fixed, and genuine apologies to whoever lost time to it. Boolean conditions also stopped requiring a value, so "this property exists at all" is now expressible.

**Topic opt-in and opt-out were flipped.** The flag means what it says now. Re-check that one field before your next send.

While you're in there, restrict your API keys to a set of allowed domains. It makes a leaked key far less useful to whoever leaked it.

## Unsubscribes

Marketing sends now get an unsubscribe footer and the correct List-Unsubscribe headers automatically, so one-click unsubscribe works in Gmail and Apple Mail without you touching a template. The mailbox providers tighten these rules every year. Treat it as table stakes, not a feature.

The unsubscribe page asks for a reason and offers a way back, because a good number of those clicks are accidents and there's no reason to make them permanent. Czech and English for now.

Use \`{{webversion_link}}\` for a browser-readable copy of any email. Test sends run through the production tracking pipeline now, so a test tells you what recipients actually get instead of approximately what they get.

Recipient communication languages went from a handful to 18.`
		},
		{
			date: 'Apr 29, 2026',
			title: 'Campaigns: compose, schedule, and see what happened',
			slug: 'campaigns',
			summary:
				'A campaign builder with scheduling, per-recipient stats down to individual opens and clicks, and side-by-side comparison.',
			tag: 'Feature',
			authors: [{ name: 'Martin from Lettr', initials: 'M', avatar: '/images/authors/martin.jpg' }],
			content: `Campaigns shipped. Pick an audience, write the email, schedule it, and then get to the part I actually care about, which is finding out what happened afterwards.

Composing runs through a stepper that checks whether a step is genuinely complete rather than whether you clicked past it, so problems surface where they happen instead of arriving as one wall of errors at the end. Drafts save from the first keystroke and name themselves from the subject line. Close the tab whenever you like.

Write in the Topol editor or in raw HTML, whichever suits. The preview is a live iframe render rather than a stale screenshot, which matters because a cached thumbnail is only ever as current as the last time something bothered to regenerate it.

The From field is now a local part plus a dropdown of verified domains. Small change, but it kills the most common way to build a campaign that cannot physically send.

## Numbers that don't lie

We argued about this section more than about everything else in the release put together, so let me lay out the reasoning rather than just the behaviour.

**Unique opens and clicks per recipient are the primary number.** One person opening an email twenty times and twenty people opening it once are not the same event, and a dashboard that reports them identically will eventually talk somebody into a decision they can't defend. Raw totals are still there, one line down. That ordering is deliberate and I'd fight to keep it.

Stat tiles double as filters, so clicking Bounced gets you the bounced recipients with the full bounce reason attached, not one truncated just before the part that tells you anything.

The page polls while a campaign prepares and sends, then keeps polling until events start arriving. An empty activity table and a failed send look identical from the outside, and nobody should have to sit there guessing which one they're looking at.

**Event history runs 30 days, archived to S3 before it expires.**

Multi-select a few campaigns and open the comparison sheet: campaigns as rows, metrics as columns. We built it the other way round first. It was worse, and flipping it cost almost nothing once we stopped defending the original decision.

Scheduled campaigns pull back to draft, and bulk delete and duplicate both work from the same multi-select.`
		},
		{
			date: 'Mar 10, 2026',
			title: 'Audience management',
			slug: 'audience-management',
			summary:
				'Contacts, lists, segments, topics and custom properties, with CSV import that handles the exports your CRM actually produces.',
			tag: 'Feature',
			authors: [{ name: 'Adam from Lettr', initials: 'A', avatar: '/images/authors/adam.jpg' }],
			content: `Lettr was built as a transactional API, so a recipient only ever existed as an address inside one request, with nothing about that person surviving into the next send. For transactional work that model is correct and I'd defend it. It falls apart the moment somebody wants to email a group that was decided in advance.

So we added an Audience section. Four concepts, which took much longer to agree on than to build.

**Contacts** are people: an email address, a status, and whatever custom properties a team decides to record. Properties take fallback values. That sounds like a configuration footnote until a merge tag hits someone who never filled the field in, and the fallback is the only thing between your template and an email that opens "Hi ,".

**Lists** are deliberate groupings, filled by hand, by import, or over the API. They change when somebody changes them, and not otherwise.

**Segments** store a condition instead of a membership, and they're evaluated when read. A segment for contacts in Germany who opened something last month describes different people next week, with nobody touching its definition. That's the whole argument for segments over hand-maintained lists. The builder previews matching contacts while the conditions are still being written, which we added after watching people save a filter just to find out what it caught.

**Topics** record what someone agreed to receive. Product updates, newsletter, release notes. A contact who drops one keeps the others, and I'd argue that distinction earns its extra modelling several times over, because the alternative is a single global unsubscribe that throws away information you can never get back.

## Import

Contacts always live somewhere else first, so the importer decides whether any of this is usable.

It works out the delimiter before parsing anything. A lot of European systems export semicolons, and a parser that assumes commas turns such a file into one long column of nonsense. **Importing the same file twice updates contacts rather than duplicating them**, so re-running an import you're unsure about is safe.

Every contact keeps an activity log covering status changes, property edits and list membership. When somebody eventually asks why a particular person got a particular email, that log is the answer, and recording it continuously is far easier than reconstructing it afterwards. We learned that one the hard way on a different product.

Exports stream rather than building up in memory, arrive by email when they're large, and are capped at 20 per hour per user.

All of it works over the API as well as the interface. Marketing volume bills separately from transactional volume, so adding an audience doesn't change what your existing plan costs.`
		},
		{
			date: 'Feb 14, 2026',
			title: 'Introducing Lettr, an email API for artisans',
			slug: 'introducing-lettr',
			summary:
				'A Laravel-first email API from the team behind Topol.io and DMARCeye, now in public beta.',
			tag: 'Launch',
			authors: [{ name: 'Jan from Lettr', initials: 'J', avatar: '/images/authors/jan.jpg' }],
			content: `We're a European company that's been running an email marketing and automation platform for over a decade. Our infrastructure handles more than **500 million emails per month** across the globe.

We built [Topol.io](https://topol.io), a drag-and-drop email template editor used by thousands of companies to design beautiful emails without touching HTML tables. We also created [DMARCeye.com](https://dmarceye.com), helping businesses protect their sender reputation with DMARC monitoring, SPF, and DKIM management.

Through all of that, we kept running into the same frustration.

## Why we built Lettr

Setting up transactional email in a new Laravel project means wiring a mail driver, picking a third-party service, wrestling DNS records, and designing templates in some external tool. Then the visibility runs out. Nothing shows what the application is actually sending, whether the welcome emails are landing in inboxes or spam folders, or that something broke three days ago.

We wanted something that belonged in the Laravel ecosystem. Elegant, opinionated, and working out of the box.

So we built Lettr.

## What makes Lettr different

**It's Laravel-first.** Not a generic email API with a PHP wrapper bolted on, but a dedicated package that feels native. Run \`composer require lettr/laravel\`, add an API key, and the first email sends in under a minute. No boilerplate, no config file longer than the application it configures.

**Templates, your way.** Build them in our visual drag-and-drop editor (yes, we brought over the best parts of Topol.io) or write them in Blade. Lettr keeps both directions in sync, so templates can move from Laravel to Lettr or back again. Edit wherever you're comfortable.

**Visibility into what your app sends.** This is the part we're most excited about. The dashboard covers every transactional email type an application sends, from welcome messages to password resets and invoices, with delivery rates, open rates and trend data attached to each one.

**Alerts that matter.** Deliverability alerts fire when open rates fall or bounce rates climb, which beats discovering three days later that password resets have been going to spam.

**Deliverability we can back up.** Our background is in DMARC and email security, and those practices are baked into every layer: dedicated IPs with automatic warmup, one-click DKIM and SPF setup, blocklist monitoring, custom SSL tracking domains. The kind of work that usually needs a dedicated email ops person.

## Start for free

We're launching today in public beta. The Hobby tier is free, with 3,000 emails per month and no credit card required. We'd love for you to try it, break it, and tell us what you think.

We're passionate developers who genuinely enjoy what we do. We care about craft, we want our tools to be as polished as the code you write, and we think sending emails shouldn't be the worst part of building an application.

Welcome to Lettr. Let's make email not suck.`
		}
	];

	function formatContent(content: string): string {
		return content
			.replace(/\*\*(.+?)\*\*/g, '<strong class="text-surface font-semibold">$1</strong>')
			.replace(/\*(.+?)\*/g, '<em>$1</em>')
			.replace(
				/`([^`]+)`/g,
				'<code class="border border-border/50 bg-background px-1.5 py-0.5 font-code text-[13px] text-primary">$1</code>'
			)
			.replace(
				/\[([^\]]+)\]\(([^)]+)\)/g,
				'<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">$1</a>'
			)
			.replace(/^## (.+)$/gm, '<h2 class="mt-10 mb-4 text-h2">$1</h2>')
			.replace(/\n\n/g, '</p><p class="mt-4 leading-[1.8] text-muted">')
			.replace(/\n/g, '<br />');
	}

	let header: HTMLElement | undefined = $state();
	let entriesSection: HTMLElement | undefined = $state();

	function handleEntryClick(event: MouseEvent) {
		const anchor = (event.target as HTMLElement | null)?.closest('a');
		if (!anchor) return;
		const href = anchor.getAttribute('href') ?? '';
		if (!href) return;
		const article = anchor.closest('article');
		const entryTitle = article?.querySelector('h2')?.textContent?.trim() ?? null;
		void capturePosthogEvent('changelog_link_clicked', {
			href,
			label: anchor.textContent?.trim() ?? '',
			entry_title: entryTitle,
			is_external: /^https?:\/\//.test(href)
		});
	}

	onMount(() => {
		const cleanups: (() => void)[] = [];

		if (header) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: header,
					targets: '[data-animate]',
					vars: { y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
				})
			);
		}

		if (entriesSection) {
			cleanups.push(
				createScrollRevealCleanup({
					scope: entriesSection,
					targets: '[data-reveal]'
				})
			);

			const section = entriesSection;
			section.addEventListener('click', handleEntryClick);
			cleanups.push(() => section.removeEventListener('click', handleEntryClick));
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<Seo
	title="Changelog | Lettr"
	description="The latest updates, improvements, and fixes to Lettr: new features, API changes, and platform refinements as we ship them."
	ogTitle="Lettr Changelog"
/>

<section class="pt-32 pb-24">
		<!-- Header -->
		<div bind:this={header} class="mb-16">
			<h1 data-animate class="font-heading text-4xl text-surface">Changelog</h1>
			<p data-animate class="mt-4 max-w-xl text-body leading-[1.7] text-muted">
				New updates and improvements to Lettr. Follow along as we build the email service we always wished existed.
			</p>
		</div>

		<!-- Entries -->
		<div bind:this={entriesSection} class="space-y-10">
			{#each changelog as entry}
				<article data-reveal>
					<!-- Meta -->
					<div class="mb-4 flex items-center gap-3">
						<time class="font-code text-[13px] text-muted">{entry.date}</time>
						{#if entry.tag}
							<span
								class="bg-primary/10 px-3 py-0.5 font-heading text-[11px] tracking-[0.05em] text-primary"
							>
								{entry.tag}
							</span>
						{/if}
					</div>

					<!-- Title -->
					<h2 class="mb-6 text-2xl leading-tight font-semibold text-surface">{entry.title}</h2>

					<!-- Content -->
					<div class="changelog-content">
						<p class="leading-[1.8] text-muted">{entry.summary}</p>
						{@html `<p class="mt-4 leading-[1.8] text-muted">${formatContent(entry.content)}</p>`}
					</div>

					<!-- Author -->
					<div class="mt-8 flex items-center gap-3 border-t border-border/30 pt-6">
						{#each entry.authors as author}
							<div class="flex items-center gap-2">
								{#if author.avatar}
									<img src={author.avatar} alt={author.name} class="h-7 w-7 rounded-full object-cover" />
								{:else}
									<div
										class="flex h-7 w-7 items-center justify-center rounded-full bg-background font-code text-[10px] font-semibold text-muted"
									>
										{author.initials}
									</div>
								{/if}
								<span class="text-[13px] text-muted">{author.name}</span>
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</div>
</section>
