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
	category="Deliverability"
	title="Hard bounce vs. soft bounce: what email bounces mean and how to handle them"
	excerpt="What an email bounce is, the difference between a hard bounce (a permanent failure such as an address that does not exist) and a soft bounce (a temporary one such as a full mailbox), the common causes of each, why a bounce rate above roughly 2% damages sender reputation, and how to handle both kinds correctly."
	metaDescription="Hard bounce vs. soft bounce explained: what each email bounce means, what causes them, how they affect sender reputation, and how to handle them."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 24, 2026"
	datetime="2026-06-24"
	readTime="7 min read"
	slug="hard-bounce-vs-soft-bounce"
>
	<Lead>
		An email bounce is a delivery failure: the receiving mail server rejected the message and returned
		it instead of placing it in the inbox. Bounces come in two kinds. A hard bounce is permanent,
		caused by something that will not change on its own such as an address that does not exist. A soft
		bounce is temporary, caused by something that usually clears such as a full mailbox or a server
		that is briefly down.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>A hard bounce is permanent and a soft bounce is temporary.</strong> Hard means the
				address is dead or unreachable for good; soft means a transient problem that often clears on a
				later attempt.
			</li>
			<li>
				<strong>Bounce rate is a reputation signal.</strong> A hard bounce rate above roughly 2% gets a
				sender throttled or blocked, and repeatedly hitting dead addresses compounds the damage.
			</li>
			<li>
				<strong>The handling differs by type.</strong> Remove hard bounces immediately and never resend
				to them; let soft bounces retry a few times before giving up. A good platform does both
				automatically.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What is an email bounce?</Heading>

	<Paragraph>
		An email bounce is a message that was rejected by the receiving server and returned to the sender
		instead of being delivered. <strong>A bounce means the email did not reach the inbox, and the
		server sent back a notice explaining why</strong>. That notice is the bounce-back, formally a
		non-delivery report, and it arrives from a sender like "Mail Delivery Subsystem" or
		"Mailer-Daemon".
	</Paragraph>

	<Paragraph>
		Every bounce carries a status code that classifies the failure, and the first digit is the part
		that matters most. <strong>A code starting with 5 is a permanent failure (a hard bounce), and a
		code starting with 4 is a temporary one (a soft bounce)</strong>. That single digit is what
		separates a problem to fix now from one that often resolves on its own.
	</Paragraph>

	<Heading level={2}>Hard bounce vs. soft bounce</Heading>

	<Paragraph>
		The two differ in one thing: whether the failure is permanent. <strong>A hard bounce is a
		permanent rejection, so the same message sent again will fail the same way</strong>. The address
		does not exist, the domain is invalid, or the recipient server has permanently refused the mail.
		Retrying achieves nothing and sends a bad signal to the receiving server.
	</Paragraph>

	<Paragraph>
		<strong>A soft bounce is a temporary rejection, so the same message may go through on a later
		attempt</strong>. The mailbox is full, the server is briefly down, or the message was deferred
		under load. A well-behaved sender retries a soft bounce for a while before treating it as a real
		failure.
	</Paragraph>

	<table class="bounce-compare">
		<thead>
			<tr>
				<th></th>
				<th>Hard bounce</th>
				<th>Soft bounce</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Nature</td>
				<td>Permanent</td>
				<td>Temporary</td>
			</tr>
			<tr>
				<td>Status code</td>
				<td>5xx (e.g. 550 5.1.1)</td>
				<td>4xx (e.g. 452 4.2.2)</td>
			</tr>
			<tr>
				<td>Typical cause</td>
				<td>Address does not exist, invalid domain</td>
				<td>Full mailbox, server down, message too large</td>
			</tr>
			<tr>
				<td>Will retry succeed?</td>
				<td>No</td>
				<td>Often</td>
			</tr>
			<tr>
				<td>Correct response</td>
				<td>Remove the address immediately</td>
				<td>Retry, then suppress if it persists</td>
			</tr>
		</tbody>
	</table>

	<Heading level={2}>Common causes of each</Heading>

	<Paragraph>
		Most bounces trace back to a short list of causes, and the bounce itself names which one applies.
		<strong>Sorting the cause into hard or soft tells you whether to act now or wait</strong>. The
		split below covers the failures that show up in almost every real bounce.
	</Paragraph>

	<Paragraph>
		<strong>Hard bounces</strong> come from a permanent problem with the address or domain:
	</Paragraph>

	<List>
		<li>
			<strong>The address does not exist.</strong> A typo, or a mailbox that was closed. The recipient
			server has nowhere to deliver the message and rejects it for good.
		</li>
		<li>
			<strong>The domain is invalid.</strong> The part after the @ has no mail server, often a
			misspelled domain or one that has lapsed.
		</li>
		<li>
			<strong>The recipient server blocked the sender permanently.</strong> The sending domain or IP
			is on a blocklist, or the receiver refuses it by policy.
		</li>
	</List>

	<Paragraph>
		<strong>Soft bounces</strong> come from a temporary condition that usually clears:
	</Paragraph>

	<List>
		<li>
			<strong>The mailbox is full.</strong> The recipient is over quota and cannot accept new mail
			until space is freed.
		</li>
		<li>
			<strong>The server is down or unreachable.</strong> The receiving server is offline or
			overloaded and is deferring mail for now.
		</li>
		<li>
			<strong>The message is too large.</strong> The email and its attachments exceed the recipient
			server's per-message limit. The
			<a href="/blog/email-attachment-size-limits/">attachment size limits by provider</a> are lower
			than they look.
		</li>
	</List>

	<Heading level={2}>Why bounces matter: your sender reputation</Heading>

	<Paragraph>
		Bounces are not just failed deliveries; they are a signal mailbox providers use to judge whether a
		sender is trustworthy. <strong>Every send to a dead address tells the receiving server that the
		sender does not maintain a clean list</strong>, and a sender that does not clean its list is the
		profile of a spammer. The damage is to reputation, and reputation determines whether future mail
		reaches the inbox at all.
	</Paragraph>

	<Paragraph>
		There is a concrete line to stay under. <strong>A hard bounce rate above roughly 2% points to a
		list-quality problem and gets a sender throttled or blocked</strong> by the major providers.
		Complaints are watched even more closely: Gmail's published spam-complaint threshold is 0.3%, and
		the goal is to stay an order of magnitude below it, at 0.1% or lower.
	</Paragraph>

	<Paragraph>
		The harm compounds. <strong>Repeatedly hitting bad addresses pushes the bounce rate higher,
		lowers the sender's reputation score, and makes the next batch of legitimate mail more likely to
		land in spam</strong>, which produces more failures and more complaints. A list that is not kept
		clean degrades faster the longer it runs. The
		<a href="/blog/email-deliverability-checklist/">email deliverability checklist</a> covers the full
		set of metrics to watch alongside bounce rate.
	</Paragraph>

	<Heading level={2}>How to handle bounces</Heading>

	<Paragraph>
		Handling bounces well comes down to treating the two types differently and watching the rate.
		<strong>The rule is simple: drop hard bounces at once, give soft bounces a few tries, and keep the
		list clean as you go</strong>.
	</Paragraph>

	<List>
		<li>
			<strong>Remove hard bounces immediately.</strong> A permanent failure means the address is dead,
			so resending is pure risk with no upside. Suppress it on the first hard bounce and never send to
			it again.
		</li>
		<li>
			<strong>Let soft bounces retry.</strong> A temporary failure often clears, so retry over the
			following hours rather than removing the address. If the soft bounces keep coming over several
			sends, treat the address as dead and suppress it.
		</li>
		<li>
			<strong>Monitor your bounce rate.</strong> Watch the hard bounce rate against the 2% line and the
			complaint rate against 0.1%. A rising rate is an early warning that catches a list-quality
			problem before it turns into a block.
		</li>
		<li>
			<strong>Keep lists clean.</strong> Collect addresses through confirmed opt-in, validate them at
			signup, and remove addresses that have gone quiet. A clean list is what keeps the bounce rate low
			in the first place.
		</li>
	</List>

	<Heading level={2}>How to handle bounces automatically (the better way)</Heading>

	<Paragraph>
		Doing all of that by hand does not scale past a small list, which is what a suppression list is
		for. <strong>A suppression list is a record of addresses that should never be sent to again, and
		a good platform maintains it automatically</strong> so a dead address is filtered out of every
		future send without anyone tracking it manually.
	</Paragraph>

	<List>
		<li>
			<strong>Hard bounces are suppressed on the first failure.</strong> The address is added to the
			suppression list the moment it bounces permanently, so the next campaign skips it and the bounce
			rate never accumulates from re-hitting dead addresses.
		</li>
		<li>
			<strong>Soft bounces are retried before suppression.</strong> A temporary failure is retried over
			a window, and only an address that keeps failing is moved to the suppression list, so a full
			mailbox does not cost a real recipient.
		</li>
		<li>
			<strong>A webhook fires on every bounce.</strong> Each event is pushed to the application in real
			time with the address and reason attached, so the application's own database stays in sync with
			the suppression list instead of drifting out of date.
		</li>
	</List>

	<Callout variant="info">
		On <a href="https://docs.lettr.com/learn/suppressions/introduction">Lettr</a>, hard bounces are
		added to the suppression list automatically on the first failure, soft bounces are retried before
		being suppressed, and every bounce streams through
		<a href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a> in real time with the
		reason and status code attached. Sender reputation is protected without manual list cleaning. See
		the <a href="https://docs.lettr.com/learn/suppressions/bounces">bounce handling docs</a> for how
		it works, or <a href="https://app.lettr.com/register">create a free account</a>.
	</Callout>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="How many bounces is too many?">
			<strong>A hard bounce rate above roughly 2% is too high</strong> and risks being throttled or
			blocked by the major mailbox providers. A clean, well-maintained list usually sits well below
			that. A sudden rise in the rate is the signal to stop and check list quality before sending more.
		</FaqItem>

		<FaqItem question="Do soft bounces hurt my reputation?">
			<strong>An occasional soft bounce is normal and does not hurt reputation</strong>, since it
			reflects a temporary condition on the recipient's side. Soft bounces become a problem only when
			they persist to the same address across many sends, which means the address is effectively dead
			and should be suppressed like a hard bounce.
		</FaqItem>

		<FaqItem question="How do I reduce my bounce rate?">
			<strong>Keep the recipient list clean and suppress dead addresses.</strong> Collect addresses
			through confirmed opt-in, validate them at signup, remove every hard-bounced address on the first
			failure, and suppress soft bounces that keep failing. Authenticating the sending domain with SPF,
			DKIM, and DMARC also prevents the authentication failures that show up as bounces.
		</FaqItem>

		<FaqItem question="What is the difference between a hard bounce and a soft bounce?">
			<strong>A hard bounce is a permanent failure and a soft bounce is a temporary one.</strong> Hard
			bounces use 5xx status codes and mean something that will not succeed on retry, such as an address
			that does not exist. Soft bounces use 4xx codes and mean a transient problem, such as a full
			mailbox or a server that is briefly unavailable, which often resolves on its own.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		A bounce is the receiving server returning a message instead of delivering it, and the type tells
		you what to do. <strong>Remove hard bounces immediately, retry soft bounces before giving up, and
		keep the hard bounce rate under roughly 2% to protect sender reputation</strong>. The status code
		on the bounce says which type it is.
	</Paragraph>

	<Paragraph>
		At any real volume this is suppression-list work, and it should be automatic. Lettr suppresses
		hard bounces on the first failure, retries soft bounces before suppressing them, and reports every
		bounce through a webhook, so reputation stays protected without manual list cleaning.
		<a href="https://app.lettr.com/register">Create a free account</a>, or read the
		<a href="https://docs.lettr.com/learn/suppressions/introduction">suppressions docs</a> to see how
		bounce handling works.
	</Paragraph>
</BlogPost>

<style>
	/* Keep the status-code examples (e.g. "550 5.1.1") from wrapping mid-code. */
	.bounce-compare :global(td),
	.bounce-compare :global(th) {
		vertical-align: top;
	}
</style>
