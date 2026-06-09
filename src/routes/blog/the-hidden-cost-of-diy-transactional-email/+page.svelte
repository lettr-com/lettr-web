<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		Callout,
		Code,
		Divider
	} from '$lib/components/blog';

	// Every post is just data + composed typography components.
	// Copy this file as a starting point for the next post.
	const phpExample = `use Lettr\\Laravel\\Facades\\Lettr;

Lettr::to($user->email)
    ->template('welcome')
    ->with(['name' => $user->name])
    ->send();`;
</script>

<BlogPost
	category="Deliverability"
	title="The hidden cost of DIY transactional email"
	excerpt="The real cost of running your own transactional email stack: deliverability drift, no delivery logs, on-call time spent on bounces and blocklists, and template changes that require a deploy. What DIY actually costs beyond infrastructure, and what a managed alternative replaces."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="May 13, 2026"
	datetime="2026-05-13"
	readTime="5 min read"
	slug="the-hidden-cost-of-diy-transactional-email"
>
	<Lead>
		Most products send their first transactional emails the cheap way: an SMTP server or a provider
		API wired straight into the app, with authentication, deliverability, logging, and templates all
		handled in-house. The sending itself stays cheap, but the work that grows up around it is where
		the real cost hides, and that cost almost never shows up on a budget.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<List>
			<li>
				<strong>Infrastructure is the cheap part.</strong> A sending service and a few DNS records are
				easy to budget for; the recurring engineering work around them is not.
			</li>
			<li>
				<strong>The real cost is the work no roadmap shows.</strong> Deliverability drift, missing
				delivery logs, on-call bounces, and template changes that need a deploy.
			</li>
			<li>
				<strong>The fix is visibility.</strong> Make email observable, editable, and monitored
				instead of a fire-and-forget side effect.
			</li>
		</List>
	</Callout>

	<Heading level={2}>What it costs on day one</Heading>

	<Paragraph>
		The obvious cost is <strong>infrastructure</strong>: a sending service, a couple of DNS records,
		and maybe a queue worker. In any modern framework the actual send is a handful of chained method
		calls, and it stays that small no matter how the product grows:
	</Paragraph>

	<Code lang="php" filename="app/Notifications/WelcomeMail.php" code={phpExample} />

	<Paragraph>
		That snippet never gets more complicated. <strong>Everything around it does</strong>: the
		authentication, sender reputation, delivery logging, and template maintenance that the application
		needs once it is sending real volume to real recipients, none of which a setup tutorial covers.
	</Paragraph>

	<Heading level={2}>What it costs in the long run</Heading>

	<Paragraph>
		That surrounding work shows up as <strong>unplanned engineering hours</strong>. None of it is hard
		in isolation, but it recurs, never makes the roadmap, and tends to land on whoever is on call.
		Four costs account for most of it:
	</Paragraph>

	<List>
		<li>
			<strong>Deliverability drift.</strong> Open rates fall as sender reputation erodes, and the
			decline goes unnoticed until a customer reports a missing email.
		</li>
		<li>
			<strong>No visibility.</strong> A disputed password reset has no log to check and no way to
			prove whether it was sent or delivered.
		</li>
		<li>
			<strong>On-call tax.</strong> Bounces, blocklists, and DNS misconfigurations turn into pages for
			engineers who should be shipping features.
		</li>
		<li>
			<strong>Template sprawl.</strong> Every email lives in a different Blade file, so changing a
			footer requires a deploy.
		</li>
	</List>

	<Callout variant="warning" title="Deliverability is not a one-time setup">
		SPF, DKIM, and DMARC aren't checkboxes you tick once. Mailbox providers continuously re-evaluate
		your reputation, and a single bad sending day can take weeks to recover from.
	</Callout>

	<Heading level={2}>Make email observable and maintainable</Heading>

	<Paragraph>
		The durable fix is to give transactional email the same <strong>visibility and tooling</strong>
		as any other part of the application: a record of what happened to each message, alerts when
		something degrades, and templates that can change without a deploy. That generally matters more
		than hiring a dedicated email-ops engineer.
	</Paragraph>

	<Paragraph>
		In practice that means delivery logs that are actually searchable, alerts when open rates drop
		before customers complain, and templates a marketing team can edit without filing a dev ticket.
		<strong>Authentication and warmup should be handled by the platform</strong>, not assembled by
		hand from a dozen Stack Overflow answers.
	</Paragraph>

	<Callout variant="tip" title="Start with observability">
		Before optimizing anything, make sure you can answer one question for every email your app sends:
		<em>did it arrive, and if not, why?</em> Everything else follows from that.
	</Callout>

	<Heading level={2}>When DIY is the right call</Heading>

	<Paragraph>
		Rolling your own is not always the wrong choice. At <strong>low and predictable volume</strong>,
		a handful of internal notifications a day where nobody outside the team ever waits on the message,
		the maintenance burden is small and a managed platform buys little. The same is true for
		<strong>throwaway prototypes</strong> that may never reach real users.
	</Paragraph>

	<Paragraph>
		The calculation changes once an email becomes something a <strong>customer is actively waiting
		for</strong>: a password reset, a receipt, a login code. Silent spam placement on those messages
		costs support time and sometimes revenue, and diagnosing the cause without delivery logs quickly
		outweighs the price of the sending service itself.
	</Paragraph>

	<Divider />

	<Paragraph>
		DIY transactional email usually persists as an unrevisited default, and the case for changing it
		rarely comes from a single dramatic failure. It comes from <strong>adding up the scattered
		hours</strong> already spent on it and asking whether that time is better spent elsewhere.
	</Paragraph>

	<Paragraph>
		That is the problem we built <a href="/">Lettr</a> to solve: one platform for transactional and
		marketing email, with the deliverability work handled and a clear view of everything the
		application sends.
	</Paragraph>
</BlogPost>
