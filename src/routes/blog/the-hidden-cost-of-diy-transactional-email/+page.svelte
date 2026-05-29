<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		Quote,
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
	excerpt="Rolling your own email stack feels cheap until you count the dev hours, the deliverability surprises, and the 2 a.m. pages. Here's what it actually costs."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="May 13, 2026"
	datetime="2026-05-13"
	readTime="6 min read"
	slug="the-hidden-cost-of-diy-transactional-email"
>
	<Lead>
		Almost every SaaS starts the same way: a single <code>Mail::send()</code> call, an SMTP server
		picked in a hurry, and a quiet hope that the welcome email lands somewhere useful. It works — right
		up until it doesn't.
	</Lead>

	<Paragraph>
		Transactional email looks like a solved problem from the outside. You wire up a mail driver, drop
		in some credentials, and emails go out. But the moment your product grows past a few hundred
		users, the cracks start to show — and they rarely show up where you're looking.
	</Paragraph>

	<Heading level={2}>The bill you can see</Heading>

	<Paragraph>
		The obvious cost is infrastructure: a sending service, a couple of DNS records, maybe a queue
		worker. That's the part teams budget for. It's also the cheapest part. Here's the setup most
		teams reach for first:
	</Paragraph>

	<Code lang="php" filename="app/Notifications/WelcomeMail.php" code={phpExample} />

	<Paragraph>
		Clean enough. The problem isn't the code you write on day one — it's everything that surrounds it
		on day ninety.
	</Paragraph>

	<Heading level={2}>The bill you can't see</Heading>

	<Paragraph>
		The real expense of DIY transactional email is the work that never makes it onto a roadmap. It
		hides in interruptions, in debugging sessions, and in revenue you never knew you lost.
	</Paragraph>

	<List
		items={[
			'Deliverability drift — open rates quietly fall as your sender reputation erodes, and nobody notices until a customer does.',
			'No visibility — when a user swears they never got the password reset, you have no log to check and no way to prove otherwise.',
			'On-call tax — bounces, blocklists, and DNS misconfigurations become 2 a.m. pages for engineers who should be shipping features.',
			'Template sprawl — every email lives in a different Blade file, and changing a footer means a deploy.'
		]}
	/>

	<Callout variant="warning" title="Deliverability is not a one-time setup">
		SPF, DKIM, and DMARC aren't checkboxes you tick once. Mailbox providers continuously re-evaluate
		your reputation, and a single bad sending day can take weeks to recover from.
	</Callout>

	<Heading level={2}>What good looks like</Heading>

	<Paragraph>
		The fix isn't to hire an email-ops engineer. It's to treat transactional email as a product
		surface — something observable, editable, and monitored — instead of a fire-and-forget side
		effect.
	</Paragraph>

	<Quote cite="Every developer who has debugged a missing receipt email">
		You shouldn't have to choose between shipping features and knowing whether your emails arrive.
	</Quote>

	<Paragraph>
		That means delivery logs you can actually search, alerts when open rates drop before customers
		complain, and templates your marketing team can edit without filing a dev ticket. The mechanics
		of authentication and warmup should be handled for you — not assembled by hand from a dozen
		Stack Overflow answers.
	</Paragraph>

	<Callout variant="tip" title="Start with observability">
		Before optimizing anything, make sure you can answer one question for every email your app sends:
		<em>did it arrive, and if not, why?</em> Everything else follows from that.
	</Callout>

	<Divider />

	<Paragraph>
		DIY transactional email is rarely a deliberate decision — it's the default you never revisited.
		The cost isn't a line item; it's spread across every engineer who gets pulled away to chase a
		bounce. Counting it honestly is usually enough to change the plan.
	</Paragraph>

	<Paragraph>
		That's exactly the problem we built <a href="/">Lettr</a> to solve: one platform for
		transactional and marketing email, with the deliverability work handled and a clear view of
		everything your app sends.
	</Paragraph>
</BlogPost>
