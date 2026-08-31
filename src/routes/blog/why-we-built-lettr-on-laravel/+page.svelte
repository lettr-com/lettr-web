<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Callout,
		Code,
		Faq,
		FaqItem
	} from '$lib/components/blog';

	const installCommands = `composer require lettr/lettr-laravel
php artisan lettr:init`;

	const envConfig = `MAIL_MAILER=lettr
LETTR_API_KEY=...`;

	const mailableExample = `use App\\Mail\\WelcomeEmail;
use Illuminate\\Support\\Facades\\Mail;

Mail::to('user@example.com')->queue(new WelcomeEmail());`;
</script>

<BlogPost
	category="Engineering"
	title="Why we built Lettr on Laravel"
	excerpt="Why Lettr runs on Laravel and why our Laravel SDK is the most direct integration we offer: the defaults an experienced team would have picked anyway, the mail layer the SDK registers into as a native transport, the packages we run in production (Pest, Cashier, Bref, Spatie), the conventions that make a Laravel codebase legible to a coding assistant, and the community that has kept us on the framework since Laravel 4."
	metaDescription="Why Lettr runs on Laravel and why our SDK integrates with it most directly: the defaults, the packages we run in production, and the community."
	author={{ name: 'Jakub Gause', role: 'CEO', avatar: '/images/authors/jakub.jpg' }}
	date="August 11, 2026"
	datetime="2026-08-11"
	readTime="6 min read"
	slug="why-we-built-lettr-on-laravel"
>
	<Lead>
		Lettr, our email API, is a Laravel application, and our
		<a href="https://packagist.org/packages/lettr/lettr-laravel">Laravel SDK</a> is the most direct
		integration we offer. Why? Three reasons: Laravel's defaults are the decisions an experienced
		team would have made anyway, its packages are built by people who run them in production, and
		its conventions make a Laravel codebase one of the easiest to work in, for a new developer and,
		increasingly, for a coding assistant. We have worked in Laravel since Laravel 4, released in
		2013; aside from Lettr, we've built <a href="https://topol.io">Topol</a>,
		<a href="https://ecomail.cz/">Ecomail</a>, and <a href="https://dmarceye.com/">DMARCeye</a> on
		it. This article is about what has kept us there.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Laravel's defaults are the decisions an experienced team would make anyway</strong>,
				so the hours go into the product instead of into infrastructure no customer ever sees.
			</li>
			<li>
				<strong>The packages are built by people who run them in production</strong>: Pest, Cashier,
				Bref, and Spatie's tools cover problems we have never had to solve ourselves.
			</li>
			<li>
				<strong>Convention over configuration turned out to be an AI strategy</strong>: the same
				predictability that helps a new developer makes a codebase legible to a coding assistant.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Defaults you don't have to fight</Heading>

	<Paragraph>
		A serious Laravel application can reach production quickly, because <strong>the defaults are the
		ones an experienced team would have picked anyway</strong>. Sessions, queues, validation,
		migrations, testing, mail: these are decisions every web application has to make, and Laravel
		has already made them in ways that will not need replacing as traffic grows.
	</Paragraph>

	<Paragraph>
		That sounds like a beginner's benefit. In practice it is a senior one: it means the hours go
		into <strong>the thing that makes your product different</strong> instead of into the same
		infrastructure every product needs and no customer ever sees.
	</Paragraph>

	<Paragraph>
		Authentication is a good example. There is an official starter kit that gives you registration,
		login, password reset and two-factor out of the box, and underneath it the same pieces are
		available separately: Fortify for the backend logic, Sanctum for API tokens, and Passport when
		you need OAuth2. Start with the default and <strong>drop down a layer only when requirements
		demand it</strong>. Most applications never need to.
	</Paragraph>

	<Heading level={2}>Mail is the case we care most about</Heading>

	<Paragraph>
		Laravel's mail layer is driver-based and sits on Symfony Mailer, so a transport is <strong>a
		class plus a config entry</strong>. Swapping where your mail goes is a configuration change, not
		a refactor.
	</Paragraph>

	<Paragraph>
		That is why our SDK, which covers Laravel 10 through 13, registers itself as a mail transport
		rather than asking you to rewrite anything:
	</Paragraph>

	<Code lang="bash" code={installCommands} />

	<Code lang="text" filename=".env" code={envConfig} />

	<Paragraph>Existing Mailables keep working unchanged:</Paragraph>

	<Code lang="php" code={mailableExample} />

	<Paragraph>
		There is a second reason mail and Laravel fit together. Sending at volume is <strong>a queue
		problem</strong> (retries, backoff, failed job handling, rate limiting), and Laravel includes
		all of it, with Horizon on top for visibility. We send through Laravel's own queue system rather
		than replacing it, and so does every application that integrates with us.
	</Paragraph>

	<Callout variant="info" title="Sending from Laravel through Lettr">
		The SDK registers <code>lettr</code> as a native mail transport, so existing Mailables and
		queued sends keep working unchanged. The
		<a href="https://docs.lettr.com/quickstart/laravel/introduction">Laravel quickstart</a> covers
		everything from install to the first send.
	</Callout>

	<Heading level={2}>Packages built by people who run them</Heading>

	<Paragraph>
		The package ecosystem is the part of Laravel we rate most highly. The good packages are built by
		people who also <strong>run them in production</strong>, so a package's failure modes tend to be
		found by its authors before they reach your application.
	</Paragraph>

	<Paragraph>Some of what we run in Lettr:</Paragraph>

	<List>
		<li>
			<strong>pestphp/pest</strong> runs our whole test suite: parallel runs, readable assertions,
			and the browser tests we use for the editor.
		</li>
		<li>
			<strong>laravel/cashier</strong> handles Stripe billing for Lettr's plans. Subscriptions,
			proration and webhook handling would otherwise be weeks of work and a long tail of edge cases
			that only show up in production.
		</li>
		<li>
			<strong>bref/bref</strong> deploys the whole Lettr application to Lambda. Running a full
			Laravel app serverless used to be a project in itself; with Bref it is a deployment target,
			and we get the scaling characteristics an email API needs without operating servers for it.
		</li>
		<li>
			<strong>laravel/boost</strong> and <strong>laravel/mcp</strong> are the AI tooling. More on
			this below.
		</li>
	</List>

	<Paragraph>
		Not all of the good work is first-party. <strong><a href="https://spatie.be/">Spatie</a></strong>
		is a web agency from Antwerp that has open-sourced hundreds of the Laravel and PHP packages it
		built for its own client work, and their output holds to the same pattern. We run their
		packages for permissions, media handling, backups and health checks, four problems we have
		never had to solve ourselves. Open any serious Laravel
		<code>composer.json</code> and you will find several of theirs in it.
	</Paragraph>

	<Heading level={2}>The conventions turned out to be an AI strategy</Heading>

	<Paragraph>
		The same conventions that make Laravel readable for a new developer make it <strong>readable for
		a coding assistant</strong>. An assistant working in a Laravel codebase can rely on the same file
		layout, the same naming, the same idioms it has seen in every other Laravel codebase, and on
		documentation thorough enough to reason from. There is a right way to do most things and it is
		written down.
	</Paragraph>

	<Paragraph>
		Laravel has <strong>built for this rather than resisted it</strong>. Boost gives an assistant a
		first-party view of your application and version-correct guidelines instead of whatever it
		half-remembers about Laravel 8. The MCP package lets you expose your own application to an
		assistant as a set of tools, which is
		<a href="/blog/managing-lettr-from-your-ai-assistant/">how we let you run Lettr from an
		assistant</a>.
	</Paragraph>

	<Paragraph>
		This is one reason we expect Laravel to still be a sensible choice in a decade. The bet on
		convention over configuration, made back in 2011, turns out to have produced exactly the
		property that makes a codebase <strong>legible to a machine</strong>. The other reason is the
		community.
	</Paragraph>

	<Heading level={2}>The community is the reason the framework lasted</Heading>

	<Paragraph>
		Laravel is community-driven in a way that shows in ordinary work: the answer to a specific
		problem usually comes from <strong>someone who has hit it themselves</strong>.
	</Paragraph>

	<Paragraph>
		None of this happened by accident. <a href="https://x.com/taylorotwell">Taylor Otwell</a> and
		the Laravel team have given the framework <strong>continuous direction for over a
		decade</strong>, which is rare in open source. Most projects that age this well have already
		drifted, fragmented, or been abandoned by their original maintainers. Laravel's releases arrive
		when the core team says they will, the direction is consistent, and the people making those
		calls are the same people running Laravel applications in production.
		<a href="https://x.com/jeffrey_way">Jeffrey Way</a> and
		<a href="https://laracasts.com">Laracasts</a> deserve a large share of the credit too, having
		taught Laravel continuously since the framework's early years.
	</Paragraph>

	<Paragraph>
		The clearest evidence of this stewardship is <strong>longevity</strong>. We have carried
		applications from Laravel 4 to Laravel 13. Some of it was painful, and the 4 to 5 transition was
		close to a rewrite. What matters is what came after: a predictable annual release, upgrade
		guides written in advance, majors that are deliberately boring, and tooling like Laravel Shift
		for the mechanical parts. Topol and Ecomail have both been through it and are both still in
		active development.
	</Paragraph>

	<Paragraph>
		For infrastructure like email, this matters more than any individual feature. We are asking
		customers to depend on us for something they cannot afford to have break, and we would rather
		make that promise on <strong>a foundation that has already survived its own major
		versions</strong>.
	</Paragraph>

	<Paragraph>
		This is also why we sponsor Laravel-focused events. Lettr is a Platinum sponsor of
		<a href="https://laravellive.dk/">Laravel Live Denmark</a> and Ecomail is a Gold sponsor. We
		built commercial products on top of this community's work, and funding its events is one way to
		contribute back.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is Lettr?">
			<strong>Lettr is an email platform built for SaaS products.</strong> Transactional email goes
			out through a REST API or SMTP, marketing email goes out through campaigns and audiences, and
			both are built in the same drag-and-drop editor. The editor is
			<a href="https://topol.io">Topol</a>, which 40,000+ companies use to build email. The free
			tier is <a href="/pricing/">3,000 emails a month</a>, with no credit card required.
		</FaqItem>

		<FaqItem question="Do I need the SDK to send email from Laravel?">
			<strong>No. Lettr works over SMTP with a credential swap, or over the REST API
			directly.</strong> The SDK adds native mailer registration and type-safe references to your
			templates, and neither is required to send. The
			<a href="/blog/smtp-vs-rest-api-how-to-choose/">SMTP vs. REST API comparison</a> covers how
			to choose between the two.
		</FaqItem>

		<FaqItem question="What happens if I move to another provider later?">
			<strong>The Mailables stay standard Laravel classes, so moving means changing the mailer in
			config, not rewriting the mail layer.</strong> The SDK registers as a mail transport rather
			than asking you to adopt a new way of composing mail.
		</FaqItem>

		<FaqItem question="Can I send marketing email from the same account?">
			<strong>Yes. Campaigns and audiences run from the same account</strong>, using the same
			templates and the same verified sending domains, so
			<a href="/blog/separate-transactional-and-marketing-email/">adding marketing email later</a>
			does not mean a second vendor or a second template system.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Laravel's packages and its people make it <strong>easier to build on and more
		future-proof</strong> than most alternatives. That is why Lettr runs on it, and why our Laravel
		SDK is the integration we point developers to first.
	</Paragraph>

	<Paragraph>
		For a Laravel application that needs an API for transactional and marketing email, including the
		drag-and-drop editor behind Topol,
		<a href="https://app.lettr.com/register">create a free Lettr account</a> and start with the
		<a href="https://docs.lettr.com/quickstart/laravel/introduction">Laravel quickstart</a>.
	</Paragraph>
</BlogPost>
