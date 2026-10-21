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
			question: 'Do I need an API key to connect ChatGPT or Claude?',
			lead: 'No. ChatGPT and Claude connect by signing in to Lettr.',
			rest: 'API keys are for unattended automation, such as a script or an agent that runs without a person present.'
		},
		{
			question: 'Can the assistant write the campaign for me?',
			lead: "No. A campaign's content, sender, and audience are set in Lettr's editor.",
			rest: 'From the chat, an assistant reads a campaign and its results, builds the segments, lists, and topics, and schedules, sends, or unschedules a ready draft.'
		},
		{
			question: 'Can a campaign be stopped after it is sent?',
			lead: 'No. Once a campaign starts sending, it cannot be paused or cancelled.',
			rest: 'A scheduled campaign can still be unscheduled back to a draft at any point before its send time.'
		},
		{
			question: 'Does the free plan include the MCP server?',
			lead: 'Yes. Every plan includes the MCP server.',
			rest: 'Sending a campaign also needs a verified sending domain, the same as sending from the dashboard.'
		}
	];
	const faqs = faqItems.map(({ question, lead, rest }) => ({ question, answer: `${lead} ${rest}` }));
</script>

<BlogPost
	category="Product"
	title="For marketers: check, schedule, and send email campaigns from ChatGPT or Claude"
	seoTitle="Email campaigns from ChatGPT or Claude via MCP"
	excerpt="ChatGPT and Claude connect to Lettr with one sign-in, and from the chat an assistant can report a campaign's results, build its segments, and schedule or send the campaign. This article covers the sign-in, what the assistant can do before and after a send, and the confirmation step before anything goes out."
	metaDescription="Connect ChatGPT or Claude to Lettr with one sign-in, then check campaign results, build segments, and schedule campaigns from the chat."
	author={{ name: 'Jack Zagorski', role: 'Content specialist', avatar: '/images/authors/jack.jpg' }}
	date="October 21, 2026"
	datetime="2026-10-21"
	readTime="4 min read"
	slug="email-campaigns-from-chatgpt-or-claude"
	{faqs}
>
	<Lead>
		Lettr, an email platform for transactional and marketing email, hosts an MCP server, and one
		sign-in connects ChatGPT or Claude to it. MCP is the open standard that connects AI assistants to
		outside services. Once connected, an assistant can report how a campaign performed, build the
		segments and topics for the next one, and schedule or send a draft from the chat. The campaign
		itself is still designed in Lettr's editor.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Connecting is a sign-in</strong>: there is nothing to install and no API key to copy.
			</li>
			<li>
				<strong>The chat covers the work around a campaign</strong>: results, segments, topics, and
				the schedule. Content, sender, and audience are set in Lettr's editor.
			</li>
			<li>
				<strong>Sending and scheduling are marked destructive</strong>, so ChatGPT or Claude can ask
				for confirmation before a campaign goes out.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Connect ChatGPT or Claude by signing in</Heading>

	<Paragraph>
		The connection needs a Lettr account and the server URL,
		<code>https://app.lettr.com/mcp</code>. <strong>Signing in to Lettr</strong> authorizes the
		assistant, and the free plan includes the MCP server.
	</Paragraph>

	<Heading level={3}>In ChatGPT</Heading>

	<Paragraph>
		Custom MCP servers are available on ChatGPT Business, Enterprise, and Edu on the web, and
		workspace admins decide who can add one, as
		<a href="https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt"
			>OpenAI's guide to custom MCP servers</a
		> explains.
	</Paragraph>

	<List>
		<li>Open Plugins, select the plus button, and choose "Add custom MCP server".</li>
		<li>
			Enter a name, add <code>https://app.lettr.com/mcp</code> as the server URL, and choose OAuth
			for authentication.
		</li>
		<li>Confirm the risk warning, select "Create as a plugin", and sign in to Lettr.</li>
	</List>

	<Heading level={3}>In Claude</Heading>

	<List>
		<li>Open Customize, then Connectors, and select "Add custom connector".</li>
		<li>Enter <code>https://app.lettr.com/mcp</code> as the server URL and select "Add".</li>
		<li>Sign in to Lettr when Claude asks to connect.</li>
	</List>

	<Paragraph>
		On Claude's Team and Enterprise plans, an Owner adds the connector for the organization first,
		and each member then connects with their own Lettr account.
	</Paragraph>

	<Callout variant="info">
		The <a href="https://docs.lettr.com/learn/mcp/setup">MCP setup guide</a> covers other AI tools,
		such as Claude Code, Cursor, and GitHub Copilot. API keys are for unattended automation, which
		<a href="/blog/lettr-mcp-server-tools/">our MCP server article</a> covers.
	</Callout>

	<Heading level={2}>How did the campaign perform?</Heading>

	<Paragraph>
		<strong>Every campaign carries its stats</strong>, so a question like "how did last week's
		newsletter do?" returns its deliveries, bounces, opens, clicks, and unsubscribes. The assistant
		can also list one campaign's individual events, such as each open, click, and bounce, and narrow
		them to one recipient or a date range.
	</Paragraph>

	<Paragraph>
		For the account as a whole, Lettr's <strong>sending-health check</strong> returns delivery trends,
		recent problems, suppression hints, and links to the matching dashboard pages. The
		<a href="https://docs.lettr.com/learn/mcp/tools-reference">tools reference</a> lists every tool
		the assistant can call.
	</Paragraph>

	<Heading level={2}>Who will the send reach?</Heading>

	<Paragraph>
		The assistant can build the <strong>segments, lists, and topics</strong> a campaign sends to.
		A segment is created by describing its conditions in plain language ("contacts in Germany who
		joined this year"), and conditions can match contact fields, custom properties, topics, and
		lists. Lettr returns the segment's contact count when it is created, and the assistant can look up
		the count for any list or segment.
	</Paragraph>

	<Paragraph>
		An <strong>opt-in topic</strong> (a topic contacts only receive after choosing it) also takes one
		request. Which segment or list a campaign targets is chosen in Lettr's editor, along with the
		content and sender.
	</Paragraph>

	<Paragraph>
		<strong>An AI assistant sends everything it gets from Lettr to its provider</strong>, contact
		details included, so check that provider's data terms before asking about individual contacts or
		their activity.
	</Paragraph>

	<Heading level={2}>Schedule the send from the chat</Heading>

	<Paragraph>
		<strong>Scheduling a ready draft is one request.</strong> A draft is ready once it has a
		subject, a sender, content, and an audience, all set in Lettr's editor. Asking for a new time
		reschedules a scheduled campaign directly, and unscheduling returns it to a draft.
	</Paragraph>

	<Paragraph>
		A campaign that starts sending goes out to its whole audience right away and
		<strong>cannot be paused or cancelled</strong>. Sending and scheduling therefore carry the MCP
		destructive annotation, which lets ChatGPT or Claude ask for confirmation first, so a misread
		request can be stopped before anything goes out.
	</Paragraph>

	<Heading level={2}>Why else use Lettr?</Heading>

	<Paragraph>
		Lettr has <a href="/email-marketing/">the rest of a campaign program</a> outside the chat. Its
		editor has <strong>synced sections</strong> that update every template using them,
		multilingual templates, and version history. One campaign can go out in
		<a href="/blog/introducing-multilingual-campaigns/">several languages</a>, and double opt-in,
		unsubscribe handling, and a record of each contact's consent changes are built in.
	</Paragraph>

	<Paragraph>
		The same account also sends <a href="/email-api/">transactional email</a>, so marketing and
		transactional email share one editor and one bill.
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
		<strong>The work around a campaign moves into the chat</strong>: results, segments, topics, and
		the schedule. The campaign itself stays in Lettr's editor, and the destructive annotation lets
		the assistant ask before anything goes out.
	</Paragraph>

	<Paragraph>
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> to try it on your own
		campaigns; the free plan includes the MCP server. Once you're in, the
		<a href="https://docs.lettr.com/learn/mcp/setup">setup guide</a> walks through each assistant.
	</Paragraph>
</BlogPost>
