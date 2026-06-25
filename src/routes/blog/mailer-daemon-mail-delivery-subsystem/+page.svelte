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
	category="Fundamentals"
	title="Mailer Daemon and Mail Delivery Subsystem errors explained (and how to fix them)"
	excerpt="What a Mailer Daemon or Mail Delivery Subsystem bounce-back means, the common reasons an email fails to deliver, how to read the SMTP status code in the message, step-by-step fixes for each cause, Gmail and Yahoo specifics, and what bounces that arrive for mail you never sent are telling you."
	metaDescription="What a Mailer Daemon / Mail Delivery Subsystem bounce means, why your email failed, how to read the error code, and how to fix it for Gmail and Yahoo."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 19, 2026"
	datetime="2026-06-19"
	readTime="8 min read"
	slug="mailer-daemon-mail-delivery-subsystem"
>
	<Lead>
		A Mailer Daemon is the automated program on a mail server that sends a bounce-back message when an
		email cannot be delivered. The message arrives from a sender like "Mail Delivery Subsystem" or
		"Mailer-Daemon", it usually carries a subject such as "Delivery Status Notification (Failure)",
		and it means one specific email did not reach its recipient. <strong>The useful part is the status
		code buried in the body</strong>, which names why the message failed and whether the address is
		dead for good or just temporarily unreachable.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>A Mailer Daemon bounce is an automated failure notice</strong>, not spam and not a
				virus. A specific message you (or someone using your address) tried to send could not be
				delivered, and the daemon is reporting why.
			</li>
			<li>
				<strong>The reason is in the SMTP status code</strong>: a 5xx code (like 550 5.1.1) is a
				permanent failure such as a wrong address, and a 4xx code (like 452 4.2.2) is temporary, such
				as a full mailbox or a server that is briefly unavailable.
			</li>
			<li>
				<strong>Bounces for mail you never sent mean your address was spoofed</strong>, not that your
				account was breached. The fix there is authentication on your domain, not a password reset.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What is a mailer daemon?</Heading>

	<Paragraph>
		A mailer daemon is a background program on a mail server that handles the delivery of outgoing
		email and reports back when a delivery fails. <strong>The word "daemon" is a long-standing
		computing term for a process that runs unattended in the background</strong>, waiting to act when
		it is needed. When an email cannot be delivered, the daemon is the part of the server that
		generates the automated reply explaining what went wrong.
	</Paragraph>

	<Paragraph>
		That automated reply is the message most people mean when they say "I got a mailer daemon email".
		<strong>It is a bounce, formally a non-delivery report</strong>, and it is sent to the original
		sender, not to the intended recipient. Receiving one is normal and routine: it is simply the mail
		system telling the sender that a particular message did not arrive, the same way a returned letter
		comes back with a stamp explaining why.
	</Paragraph>

	<Paragraph>
		Crucially, a mailer daemon message is a symptom report, not a problem in itself. <strong>The
		bounce is the messenger; the cause is somewhere in the address, the recipient's server, or the
		sending setup</strong>. The rest of this article is about reading that report and acting on what
		it says.
	</Paragraph>

	<Heading level={2}>"Mail Delivery Subsystem" and other names for the same thing</Heading>

	<Paragraph>
		The exact name on the bounce depends on which mail system rejected the message, which is why the
		same event shows up under several different senders. <strong>"Mail Delivery Subsystem" is simply
		Gmail's name for its mailer daemon</strong>, and the other major providers each have their own
		label for the identical function. Recognizing them avoids the worry that a strange new sender has
		appeared.
	</Paragraph>

	<List>
		<li>
			<strong>Mail Delivery Subsystem</strong> is what Gmail and Google Workspace call it. The bounce
			arrives from the address <code>mailer-daemon@googlemail.com</code> with that display name.
		</li>
		<li>
			<strong>Mailer-Daemon</strong> is the traditional Unix and sendmail name, still used by many
			mail servers. The address is typically <code>MAILER-DAEMON@</code> followed by the server's
			hostname.
		</li>
		<li>
			<strong>Yahoo and Outlook</strong> use their own variants. A Yahoo bounce comes from a Yahoo
			mailer-daemon address, and Microsoft systems label the failure a non-delivery report, or NDR.
		</li>
	</List>

	<Paragraph>
		All of these are the same mechanism with different branding. <strong>Whatever the sender name, the
		message is an automated delivery failure for one specific email</strong>, and the part that
		actually matters is the reason and the status code inside it, which work the same way across every
		provider.
	</Paragraph>

	<Heading level={2}>Why you got the error: common causes</Heading>

	<Paragraph>
		Most bounces trace back to a short list of causes, and the bounce itself names which one applies.
		<strong>The single most common reason is a recipient address that does not exist</strong>, usually
		a typo or an old address that has since been closed. The others range from problems on the
		recipient's side to issues with how the message was sent.
	</Paragraph>

	<List>
		<li>
			<strong>Wrong or nonexistent address.</strong> The address is misspelled, or the mailbox was
			deleted. The recipient's server has nowhere to put the message, so it rejects it permanently.
		</li>
		<li>
			<strong>Full mailbox.</strong> The recipient is over their storage quota and cannot accept new
			mail until space is freed. This is temporary, and the message may go through on a later attempt.
		</li>
		<li>
			<strong>Blocked or filtered as spam.</strong> The receiving server decided the message looked
			unwanted, either from its content or from the sender's reputation, and refused it.
		</li>
		<li>
			<strong>Failed authentication.</strong> The sending domain is missing or failing SPF, DKIM, or
			DMARC, so the receiver cannot confirm the mail is genuine and rejects it, increasingly the rule
			for bulk senders.
		</li>
		<li>
			<strong>Message too large.</strong> The email, including attachments, exceeds the recipient
			server's per-message size limit.
		</li>
		<li>
			<strong>Recipient server unavailable.</strong> The receiving server is down, unreachable, or
			deferring mail because of load. This is temporary and usually resolves on its own.
		</li>
	</List>

	<Paragraph>
		Two of these (the full mailbox and the unavailable server) are temporary and often clear without
		any action. <strong>The rest need a fix on the sending side</strong>, whether that is correcting
		the address or repairing authentication, which is what the status code helps pin down.
	</Paragraph>

	<Heading level={2}>How to read a bounce message</Heading>

	<Paragraph>
		A bounce looks intimidating because it includes technical headers, but the useful part is small
		and always in the same place. <strong>A bounce is a delivery status notification, and it carries
		three things that matter</strong>: the address that failed, a plain-English reason line, and a
		numeric status code that classifies the failure precisely. Find those three and the rest of the
		message is noise.
	</Paragraph>

	<Paragraph>
		The first thing to read off the code is whether the failure is permanent or temporary, because
		that determines whether action is even needed. <strong>A code starting with 5 is a hard bounce, a
		permanent failure; a code starting with 4 is a soft bounce, a temporary one</strong>. A hard
		bounce will not succeed on retry and points to something that must be fixed, while a soft bounce
		often resolves on its own.
	</Paragraph>

	<Paragraph>
		Each failure carries two codes side by side: a three-digit SMTP code such as <code>550</code>, and
		a more precise enhanced status code such as <code>5.1.1</code> in a class.subject.detail form.
		<strong>The enhanced code is the one that tells you the actual cause</strong>. These are the codes
		that show up most often in a real bounce.
	</Paragraph>

	<table class="bounce-codes">
		<thead>
			<tr>
				<th>Code</th>
				<th>Type</th>
				<th>What it means</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>550 5.1.1</td>
				<td>Hard</td>
				<td>The recipient address does not exist (user unknown). Usually a typo or a closed mailbox.</td>
			</tr>
			<tr>
				<td>550 5.7.1</td>
				<td>Hard</td>
				<td>The message was blocked by policy: refused as spam, relay denied, or sender not allowed.</td>
			</tr>
			<tr>
				<td>550 5.7.26</td>
				<td>Hard</td>
				<td>Authentication failed. The message did not pass SPF or DKIM and was rejected (Gmail).</td>
			</tr>
			<tr>
				<td>552 5.2.2</td>
				<td>Hard</td>
				<td>The recipient mailbox is full and over its quota.</td>
			</tr>
			<tr>
				<td>552 5.3.4</td>
				<td>Hard</td>
				<td>The message is larger than the recipient server's size limit.</td>
			</tr>
			<tr>
				<td>452 4.2.2</td>
				<td>Soft</td>
				<td>The mailbox is temporarily full. The message may deliver on a later attempt.</td>
			</tr>
			<tr>
				<td>421 4.7.0</td>
				<td>Soft</td>
				<td>The message was temporarily deferred, often for volume or reputation. Retried automatically.</td>
			</tr>
		</tbody>
	</table>

	<Paragraph>
		Alongside the code, the bounce includes a human-readable line that often restates the cause in
		plain words, such as "The email account that you tried to reach does not exist." <strong>When the
		code and the reason line disagree or look unfamiliar, trust the enhanced status code</strong>: it
		is defined by a standard and means the same thing on every server, while the wording is whatever
		the receiving administrator chose to write.
	</Paragraph>

	<Heading level={2}>How to fix it</Heading>

	<Paragraph>
		The fix follows directly from the cause the code identified, and most are quick. <strong>Match the
		bounce to one of these and act on that line</strong>; there is no need to work through the whole
		list.
	</Paragraph>

	<List>
		<li>
			<strong>Wrong address (550 5.1.1).</strong> Check the address character by character for a typo,
			confirm it with the recipient through another channel, and resend to the corrected address. If
			it was right and still bounces, the mailbox has likely been closed.
		</li>
		<li>
			<strong>Full mailbox (552 5.2.2 or 452 4.2.2).</strong> Wait and resend later, since only the
			recipient can clear space. A 4xx version of this often clears on its own without a second
			attempt.
		</li>
		<li>
			<strong>Blocked as spam (550 5.7.1).</strong> Read the reason line for a blocklist URL or a
			policy reference, remove anything that reads as promotional from a one-to-one message, and check
			whether the sending domain or IP appears on a public blocklist.
		</li>
		<li>
			<strong>Authentication failure (550 5.7.26).</strong> Set up SPF, DKIM, and DMARC on the sending
			domain so the receiver can verify the mail is genuine. This is the fix for mail sent from a
			custom domain or an application, covered in the prevention section below.
		</li>
		<li>
			<strong>Message too large (552 5.3.4).</strong> Remove or shrink attachments and send large files
			as a link instead. The
			<a href="/blog/email-attachment-size-limits/">attachment size limits by provider</a> cover the
			real ceilings, which are lower than they look.
		</li>
		<li>
			<strong>Temporary deferral (421 4.7.0).</strong> Do nothing. A well-behaved mail server retries a
			4xx failure automatically over the following hours, and the message usually goes through.
		</li>
	</List>

	<Callout variant="tip" title="Check the recipient address first">
		Before anything technical, re-read the failing address against the code. A large share of bounces
		are a single mistyped character or an autocomplete that picked the wrong contact, and a
		<code>550 5.1.1</code> is exactly what that produces. It is the fastest thing to rule out.
	</Callout>

	<Heading level={2}>Gmail and Yahoo specifics</Heading>

	<Paragraph>
		Gmail and Yahoo behave like every other mail system but use their own sender names and error
		codes, and both tightened their rules for bulk senders in 2024. <strong>A Gmail bounce comes from
		"Mail Delivery Subsystem", and a Yahoo bounce from a Yahoo mailer-daemon address</strong>, but the
		codes inside follow the same standard described above.
	</Paragraph>

	<Paragraph>
		The change worth knowing is the authentication requirement. <strong>Since early 2024, Gmail and
		Yahoo require senders of roughly 5,000 or more messages a day to set up SPF, DKIM, and DMARC</strong>,
		offer one-click unsubscribe, and keep their spam-complaint rate under 0.3%. Mail from a high-volume
		sender that skips authentication now bounces with Gmail's <code>550 5.7.26</code> rather than
		landing in spam, so the failure is loud instead of silent.
	</Paragraph>

	<Paragraph>
		Both providers also defer mail temporarily when they see an unusual volume or a reputation
		problem, each with its own code. <strong>Gmail uses <code>421 4.7.28</code> for rate-limited mail,
		and Yahoo uses <code>421 4.7.0</code> for the same kind of volume-based deferral</strong>. These
		are soft, temporary failures rather than rejections, and they are a signal to slow down and check
		sender reputation rather than to keep retrying harder.
	</Paragraph>

	<Heading level={2}>Bounces for mail you didn't send</Heading>

	<Paragraph>
		A mailer daemon message for an email you have no memory of sending is alarming, but it usually has
		a mundane explanation. <strong>A spammer forged your address as the sender, the message bounced,
		and the bounce came back to the real owner of the address: you</strong>. This is called
		backscatter, and it does not mean your account was accessed or your password is compromised.
	</Paragraph>

	<Paragraph>
		The reason it is possible is that the basic email protocol lets anyone put any address in the
		"From" field, the same way a paper envelope can carry any return address. <strong>A sudden burst
		of bounces for mail you never sent is a sign your domain is being spoofed</strong>, not breached.
		Changing the password does nothing, because the password was never involved.
	</Paragraph>

	<Paragraph>
		The real defense is authentication on the domain. <strong>A DMARC policy tells receiving servers
		to reject mail that forges your address, which cuts off the spoofing at the source</strong> and
		stops the backscatter along with it. For how the three records fit together and how to deploy them
		safely, see
		<a href="/blog/spf-dkim-dmarc-explained-for-developers/">SPF, DKIM, and DMARC explained for
		developers</a>.
	</Paragraph>

	<Callout variant="warning" title="A bounce you didn't send is not a breach">
		Backscatter looks like a security incident but is not one. If the only sign of trouble is bounce
		messages for mail you never composed, the account itself is fine and a password change will not
		help. Real account compromise shows up as sent mail in your own sent folder, logins from unfamiliar
		locations, or contacts reporting messages you did not write.
	</Callout>

	<Heading level={2}>How to prevent bounces at scale</Heading>

	<Paragraph>
		A one-off bounce to a mistyped address needs nothing more than a correction, but an application
		sending thousands of messages needs to prevent and handle bounces systematically. <strong>Three
		things keep delivery healthy at volume</strong>: proper authentication, a clean recipient list,
		and active monitoring of failures.
	</Paragraph>

	<List>
		<li>
			<strong>Authenticate the sending domain.</strong> SPF, DKIM, and DMARC are what stop the
			authentication bounces and the spoofing behind backscatter, and they are now required by Gmail
			and Yahoo for bulk mail. They are the highest-leverage fix.
		</li>
		<li>
			<strong>Suppress hard bounces automatically.</strong> A permanent failure means the address is
			dead, so sending to it again is a strong spam signal. Remove every hard-bounced address on the
			first failure and never retry it.
		</li>
		<li>
			<strong>Monitor bounce and complaint rates.</strong> A rising hard-bounce rate points to a
			list-quality problem, and catching it early prevents the reputation damage that turns into more
			bounces. The
			<a href="/blog/email-deliverability-checklist/">email deliverability checklist</a> covers the
			thresholds to watch.
		</li>
	</List>

	<Callout variant="info">
		On <a href="https://docs.lettr.com/learn/domains/sending-domains">Lettr</a>, authentication is
		generated and verified during domain setup, hard bounces are suppressed automatically, and every
		bounce and complaint streams through
		<a href="https://docs.lettr.com/learn/webhooks/introduction">webhooks</a> in real time with the
		full reason and status code attached. That handling is part of
		<a href="/platform/deliverability/">Lettr's deliverability tooling</a>, so a failed delivery is
		surfaced and explained rather than discovered when a customer asks where their email went.
	</Callout>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is a mailer daemon?">
			<strong>A mailer daemon is an automated program on a mail server that sends a bounce-back message
			when an email cannot be delivered.</strong> "Daemon" means a background process, and the message
			it generates is a non-delivery report sent to the original sender explaining why the email
			failed. Receiving one is normal and means a specific message did not reach its recipient.
		</FaqItem>

		<FaqItem question="Why do I keep getting Mail Delivery Subsystem emails?">
			<strong>Each Mail Delivery Subsystem email is a bounce for a specific message that failed to
			deliver.</strong> Repeated ones usually mean an address that no longer works, a recipient server
			that keeps refusing the mail, or, if they are for messages you never sent, that your address is
			being spoofed by a spammer. The reason and the status code inside each message identify which.
		</FaqItem>

		<FaqItem question="Is a mailer daemon email spam or a virus?">
			<strong>No, a genuine mailer daemon email is an automated delivery failure notice, not spam or
			malware.</strong> It is generated by a mail server and is safe to read. Spammers do sometimes
			imitate bounce messages for phishing, so treat any unexpected attachment or login link with the
			usual caution, but the bounce itself is a normal part of how email works.
		</FaqItem>

		<FaqItem question="What does mailer-daemon@yahoo.com mean?">
			<strong>It is the address Yahoo's mail system uses to send bounce-back notices to Yahoo
			users.</strong> A message from it means an email sent through Yahoo could not be delivered, with
			the reason inside. If it is reporting mail you did not send, your address has likely been spoofed
			rather than your account broken into, and the fix is authentication on the domain, not a password
			change.
		</FaqItem>

		<FaqItem question="How do I stop mailer daemon messages?">
			<strong>Fix the underlying delivery failure rather than the bounce itself.</strong> For a wrong
			address, correct it and resend. For authentication failures or spoofing, set up SPF, DKIM, and
			DMARC on the sending domain. There is no way to switch the bounces off, because they are how a
			mail server reports a problem, but resolving the cause stops new ones from arriving.
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
		A mailer daemon or Mail Delivery Subsystem message is a mail server reporting that one email could
		not be delivered, and the fix follows from the code it carries. <strong>Read whether it is a 5xx
		permanent failure or a 4xx temporary one, find the cause in the enhanced status code, and act on
		that single line</strong>: correct the address, wait out the deferral, or repair authentication.
	</Paragraph>

	<Paragraph>
		For a single mistyped address that is the whole job, but an application sending at volume avoids
		most of these errors by authenticating its domain, suppressing dead addresses, and watching its
		bounce rate. Lettr does that automatically: domains are authenticated at setup, hard bounces are
		suppressed, and every failure arrives with its reason and code through webhooks.
		<a href="https://app.lettr.com/register">Create a free account</a>, or read the
		<a href="/platform/deliverability/">deliverability tooling</a> to see how it handles bounces at
		scale.
	</Paragraph>
</BlogPost>

<style>
	/* Keep the SMTP code (e.g. "550 5.1.1") on a single line; the column is
	   narrow enough that it otherwise wraps at the space between the two parts. */
	.bounce-codes :global(th:first-child),
	.bounce-codes :global(td:first-child) {
		white-space: nowrap;
	}
</style>
