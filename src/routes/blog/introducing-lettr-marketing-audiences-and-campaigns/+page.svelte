<script lang="ts">
	import { BlogPost, Heading, Paragraph, TldrList, Callout, Figure, Divider } from '$lib/components/blog';
</script>

<BlogPost
	category="Product"
	title="Introducing marketing emails"
	excerpt="Marketing email now lives inside Lettr. The new module adds Audiences for managing who you send to and Campaigns for designing and sending bulk email, all in the same account and on the same domains you already use for transactional sending."
	metaDescription="Marketing email now lives inside Lettr — Audiences to manage who you send to and Campaigns to design and send bulk email, on your existing domains."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 5, 2026"
	datetime="2026-06-02"
	readTime="13 min read"
	slug="introducing-lettr-marketing-audiences-and-campaigns"
>

<Paragraph>
		Lettr started as a way to reliably send <strong>transactional email</strong>: password resets, receipts,
		verification codes, and the messages your product depends on. Sending the occasional product
		update or announcement to those same people is a different job, and most teams reach for a
		separate marketing tool to do it.
	</Paragraph>

	<Paragraph>
		The new <strong>Marketing module</strong> closes that gap inside Lettr itself. It adds two features
		for marketing email: <strong>Audiences</strong> for managing who you send to and <strong
			>Campaigns</strong
		> for designing and sending emails in bulk, all in the same account and on the same domains you already
		use for transactional sending.
	</Paragraph>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>Lettr now sends <strong>marketing email</strong> alongside transactional, same account and domains.</li>
			<li>
				<strong>Audiences</strong> are one shared contact pool, with unsubscribes, bounces, and complaints
				suppressed automatically.
			</li>
			<li>
				<strong>Campaigns</strong> build a bulk email in the Topol editor, send or schedule it, and report
				results in real time.
			</li>
			<li>Keep marketing on its own <strong>sending domain</strong> to protect transactional deliverability.</li>
		</TldrList>
	</Callout>

	

	<Heading level={2}>Introducing Audiences</Heading>

	<Paragraph>
		The Audience is where Lettr
		keeps track of <strong>the people you send marketing emails to</strong>. It stores them as a single, team-wide pool
		of contacts rather than several separate audiences, so there is one shared place to manage who hears
		from you.
	</Paragraph>

	<Paragraph>
		That <strong>single-record rule</strong> is what makes the rest predictable. A contact's subscription status,
		engagement history, and custom properties live in one place, so an unsubscribe or a bounce
		applies everywhere at once, and your reporting counts each person only once. The same holds at
		send time. When a campaign targets several overlapping lists and segments, anyone caught in more
		than one still receives it <strong>exactly once</strong>.
	</Paragraph>

	<Paragraph>
		The point of a single pool is that the audience stays up to date without effort. Organize it
		however you like and target whatever slice a campaign needs; Lettr automatically keeps the
		underlying record of each person accurate for you.
	</Paragraph>

	<Heading level={3}>Lists, segments, and topics</Heading>

	<Paragraph>
		That pool can be grouped in three ways: <strong>lists</strong>, <strong>segments</strong>, and <strong>topics</strong>. A <strong>list</strong> is a hand-curated
		membership, with people added or removed one at a time, so it changes only when someone edits it.
		A <strong>segment</strong> is a membership defined by
		a rule, such as "subscribed contacts on the Pro plan," and it updates automatically as contacts change.
		Lastly, <strong>topics</strong> sit alongside both, allowing recipients to opt into the categories they want to hear
		about rather than being assigned to them by you.
	</Paragraph>

	<Paragraph>
		The difference comes down to who decides. A list is your choice, a segment follows a rule, and a
		topic is the recipient's choice. Most audiences use all three together. Check our <a
			href="https://docs.lettr.com/learn/audience/introduction">Audience docs</a
		> to learn how to build each.
	</Paragraph>

	<Heading level={3}>The wrong people stay off automatically</Heading>

	<Paragraph>
		Just as important as who a campaign reaches is who it <strong>skips</strong>. Lettr automatically excludes anyone
		who has unsubscribed, bounced, or complained, without you having to maintain a suppression list.
		Once someone opts out of one campaign, they stay out of the rest.
	</Paragraph>

	<Paragraph>
		Because this lives on the contact record rather than on each individual list, an opt-out follows
		the person wherever they appear. There is no stale copy on another list that could let a removed
		contact slip back into a future send.
	</Paragraph>

	<Paragraph>
		Taken together, an Audience gives you <strong>one accurate pool of contacts</strong>, organized however you like
		with lists, segments, and topics, and kept clean of anyone who shouldn't be reached. That is the
		who. The next half is the what: turning that audience into an email worth sending.
	</Paragraph>

	<Figure
		src="/images/blog/introducing-audiences-and-campaigns/marketing-features.png"
		alt="The two features of Lettr's Marketing module: Campaigns and Audiences."
		caption="Audiences decide who you reach; Campaigns decide what you send."
	/>

	<Heading level={2}>Introducing Campaigns</Heading>

	<Paragraph>
		Once your audience is in place, the other half of the marketing email is the message itself. A <strong>campaign</strong> is how Lettr sends a single email <strong>to your entire audience in bulk.</strong> All setup steps are described in our <a
			href="https://docs.lettr.com/learn/campaigns/introduction">Campaigns docs</a
		>.
	</Paragraph>

	<Paragraph>
		Target a campaign to the audience you've already built, design something that looks great in
		every inbox with the Topol editor, and send it now or schedule it for later. Lettr takes care of
		the rest.
	</Paragraph>

	<Paragraph>
		Each campaign can even have <strong>its own sending domain and from address</strong>, allowing one team to reach
		multiple customer bases, each arriving in the inbox exactly as designed. That last part is the work of the editor behind every campaign.
	</Paragraph>

	<Heading level={3}>The visual editor is Topol's drag-and-drop builder</Heading>

	<Paragraph>
		That editor is a drag-and-drop email builder powered by <a
			href="https://topol.io/">Topol</a
		>, and it is worth a closer look. Topol is not a generic page builder bolted onto email. Instead,
		it is a <strong>dedicated email design tool</strong>, refined over years for the inbox, and it shows in the
		results. What you see while designing is what arrives, polished and consistent across clients,
		and built with ease.
	</Paragraph>

	<Paragraph>
		That is what makes it the best part of building a campaign. The editor carries the email
		expertise, so your team doesn't have to, which means <strong>anyone can produce a professional email</strong>
		without struggle. And for those who want full control, a <strong>raw HTML editor</strong>
		is right there alongside it, ready to pick up from one of our premade templates or a blank canvas.
	</Paragraph>

	<Heading level={3}>Merge tags and built-in compliance</Heading>

	<Paragraph>
		Lettr also uses the same contact properties that shape your audience to populate the email.
		Simply drop a <strong>merge tag</strong> like <code>{'{{first_name}}'}</code> into the subject or body, and a line
		such as <code>Welcome to Acme, {'{{first_name}}'}!</code> reaches each person with their own details. This way, each campaign reads like it was written for one reader rather than blasted to a list.
	</Paragraph>

	<Paragraph>
		And last but not least, <strong>compliance is handled by default</strong>. The law requires every marketing email
		to include a working unsubscribe link, and Lettr adds one to each send so a campaign can't
		accidentally ship without it.
	</Paragraph>

	<Heading level={3}>Real-time analytics</Heading>

	<Paragraph>
		Getting the email out is one thing; knowing whether it landed is another, and Lettr handles that
		side, too. The moment a campaign goes out, it shows how the send is performing <strong>in real time</strong>, so
		there is no waiting or guessing. Every metric that matters is there the moment it happens.
	</Paragraph>

	<Paragraph>
		Additionally, Lettr retains those results after each campaign finishes, so every send becomes a
		benchmark for the next one. Campaigns can even be compared directly to each other, making it easy
		to see what performed well and carry it forward into the next send.
	</Paragraph>

	<Heading level={2}>Separation of streams</Heading>

	<Paragraph>
		Good numbers only matter if the email reaches inboxes in the first place, and that depends on how
		Lettr protects your <strong>sending reputation</strong>. Mailbox providers judge a sending domain by how all its
		mail behaves collectively, and marketing email naturally draws lower engagement and more
		complaints than transactional email. Lettr encourages you to keep the two streams on <strong>separate sending domains</strong>, each with its own reputation.
		As a result, marketing complaints count only against the marketing domain and
		transactional deliverability stays protected.
	</Paragraph>

	<Figure
		src="/images/blog/introducing-audiences-and-campaigns/stream-switcher.png"
		alt="Lettr workspace switcher showing two separate streams: Transactional for repetitive automatic emails and Marketing for promotional campaigns."
		caption="Switch between your Transactional and Marketing streams."
	/>

	<Paragraph>
		This separation is handled for you, so a failed campaign will <strong>never</strong> affect the transaction emails your users depend on. We
		cover the full reasoning and the migration steps in <a
			href="https://lettr.com/blog/separate-transactional-and-marketing-email"
			>Why you should separate transactional and marketing email</a
		>, so go ahead and give it a read.
	</Paragraph>

	<Heading level={2}>Getting started</Heading>

	<Paragraph>
		The steps are simple: build an <a href="https://docs.lettr.com/learn/audience/introduction"
			>Audience</a
		> by adding contacts and organizing them into lists, topics, and <a
			href="https://docs.lettr.com/learn/audience/segments">segments</a
		>; verify a <a href="https://docs.lettr.com/learn/domains/sending-domains">sending domain</a> (a
		dedicated marketing subdomain for the reputation reasons above); then design a <a
			href="https://docs.lettr.com/learn/campaigns/introduction">campaign</a
		> and send it.
	</Paragraph>

	<Paragraph>
		The best way to get a feel for any of this is to <strong>try it</strong>. See what
		<a href="/email-marketing/">Lettr's email marketing</a> covers and how it's
		<a href="/pricing/">priced</a>. Every Lettr account includes a <strong>free
		500-contact tier</strong>, so you can <a href="https://app.lettr.com/register">create an account</a> at no
		cost, build a small audience, and send a real campaign to yourself in a few minutes.
	</Paragraph>

	<Divider />

	<Paragraph>
		<strong>Ready to send your first campaign?</strong> <a href="https://app.lettr.com/register"
			>Create a free Lettr account</a
		> and try Audiences and Campaigns today.
	</Paragraph>
</BlogPost>
