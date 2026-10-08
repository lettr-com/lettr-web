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

	const apiKeyConnect = `claude mcp add --transport http lettr https://app.lettr.com/mcp \\
  --header "Authorization: Bearer lttr_xxxxxxxxx"`;

	// Single source for the visible FAQ and the FAQPage structured data.
	const faqItems = [
		{
			question: "Which AI assistants can connect to Lettr's MCP server?",
			lead: "Claude.ai, Claude Desktop, Claude Code, ChatGPT, Cursor, and GitHub Copilot all connect by signing in.",
			rest: "Any other client that supports a streamable HTTP MCP server with custom headers can connect with an API key instead."
		},
		{
			question: "Can the remote MCP server run campaigns and change the audience?",
			lead: "Yes, since the September 2026 release.",
			rest: "It sends, schedules, and reports on campaigns built in the dashboard, and manages contacts, lists, topics, properties, and segments. Tools that send email right away, overwrite data, or delete it are marked as destructive, so a client such as Claude can ask before calling one."
		},
		{
			question: "Can I limit what an agent is allowed to do?",
			lead: "Yes, by connecting it with an API key scoped to the tools it needs.",
			rest: "A tool outside the key's scopes is not listed at all, and a sending-only key sees only the tools that send, schedule, and cancel email, plus the two that report its team."
		},
		{
			question: "Do I still need the lettr-mcp npm package?",
			lead: "No. The local server is deprecated.",
			rest: "The remote server now accepts the same lttr_ API key, which was the one thing the local package offered that a browser sign-in could not."
		},
		{
			question: "Will Lettr add more MCP tools?",
			lead: "Yes. New tools land on the remote server as new Lettr features ship.",
			rest: "The tools reference always lists the current set, and a connected client picks up new tools the next time it starts a session."
		}
	];
	const faqs = faqItems.map(({ question, lead, rest }) => ({ question, answer: `${lead} ${rest}` }));
</script>

<BlogPost
	category="Product"
	title="Manage an email platform from your AI assistant: Lettr's 79 MCP tools"
	seoTitle="Manage an email platform from your AI assistant with MCP"
	excerpt="An AI assistant such as Claude, ChatGPT, or Cursor can operate Lettr through 79 MCP tools, from sending and scheduling to campaigns, audience management, and delivery diagnostics, with more added as Lettr ships new features. This article covers what the tools do, the two ways to connect, and the guardrails that limit what an assistant can send or change."
	metaDescription="Manage an email platform from Claude, ChatGPT, or Cursor. Lettr's MCP server gives an AI assistant 79 tools, and counting, for sending, campaigns, and audience."
	author={{ name: 'Jack Zagorski', role: 'Content specialist', avatar: '/images/authors/jack.jpg' }}
	date="October 6, 2026"
	datetime="2026-10-06"
	readTime="5 min read"
	slug="lettr-mcp-server-tools"
	{faqs}
>
	<Lead>
		Lettr hosts a remote MCP server at <code>app.lettr.com/mcp</code> that AI assistants such as
		Claude, ChatGPT, and Cursor connect to. It has 79 tools across ten areas of the product, up from
		18 before the September 2026 release, and covers most day-to-day work in Lettr: sending,
		scheduling, campaigns, the audience, and delivery diagnostics. The count keeps
		rising, because new tools ship alongside new Lettr features.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Campaigns and the audience are now in reach</strong>: the remote server could not
				touch either before September 2026.
			</li>
			<li>
				<strong>Sign in for chat, use a scoped API key for anything unattended</strong>: CI jobs, cron
				scripts, and headless agents.
			</li>
			<li>
				<strong>Destructive tools are flagged for confirmation</strong>, a key only sees the tools its
				scopes allow, and every call made with a key lands in the API logs.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What the Lettr MCP server covers</Heading>

	<Paragraph>
		<strong>Every tool with a REST counterpart reuses that endpoint's action</strong>, so a tool call
		reads and writes the same data an API client would. The ten areas are emails, scheduled emails,
		templates with their folders and projects, sending domains, the other domain types (tracking,
		inbound, and storage), webhooks, campaigns, the audience, analytics and monitoring, and the
		account itself.
	</Paragraph>

	<Paragraph>
		When we <a href="/blog/managing-lettr-from-your-ai-assistant/">wrote about the MCP integration
		in May 2026</a>, the remote server had 16 tools, mostly for reading account data, plus sending
		email and creating and updating templates. The September release brought it to
		<strong>parity with the <code>lettr-mcp</code> npm package</strong>, adding campaigns, the
		audience, scheduling, domains, and webhooks. Once the remote server also accepted API keys, the
		one thing the npm package offered that a sign-in could not, the package was deprecated.
	</Paragraph>

	<Heading level={2}>What an assistant can do with the full set</Heading>

	<Paragraph>
		<strong>The largest additions are campaigns and the audience.</strong> A question like "How did
		last week's newsletter campaign perform?" returns the campaign's engagement stats, and "create an
		opt-in topic called Product updates" creates the topic. Campaigns are still built in the
		dashboard; the assistant sends, schedules, and reports on them.
	</Paragraph>

	<Paragraph>
		The remote server also carries <strong>four diagnostic tools</strong> the npm package never had:
		DNS diagnosis, a sending health check, analytics, and API logs. Together with each email's
		delivery timeline, they answer questions such as why a message failed to deliver, or whether a
		domain is verified and ready to send, in the same conversation that sent the email.
	</Paragraph>

	<Callout variant="info">
		The <a href="https://docs.lettr.com/learn/mcp/tools-reference">tools reference</a> lists every
		tool by area, with a short description and whether it is destructive.
	</Callout>

	<Heading level={2}>Two ways to connect: sign in or use an API key</Heading>

	<Paragraph>
		<strong>Signing in connects the server through OAuth</strong>, and every tool then acts as the
		signed-in user, in the team they choose. Each call goes through the same team permission checks
		as the dashboard, and two account tools, <code>list_teams</code> and <code>current_team</code>,
		show which teams the connection can reach and which one a call would act on. The sign-in flow works from Claude.ai, Claude Desktop, Claude Code, ChatGPT,
		Cursor, and GitHub Copilot, and it is the right choice for interactive use.
	</Paragraph>

	<Paragraph>
		<strong>An API key suits anything unattended</strong>, such as CI jobs, cron scripts, and headless
		agents, because it needs no browser and no sign-in. The client sends the key as a bearer header,
		and the key's scopes decide which tools the assistant can use. In Claude Code, that is one
		command:
	</Paragraph>

	<Code lang="bash" filename="terminal" code={apiKeyConnect} />

	<Paragraph>
		The same server can be connected twice, signed in for chat and with a scoped key for automation,
		under <strong>different names</strong> so their tools stay easy to tell apart.
	</Paragraph>

	<Callout variant="info">
		<a href="https://docs.lettr.com/learn/mcp/setup">Remote server setup</a> covers the sign-in flow
		for each client, and <a href="https://docs.lettr.com/learn/mcp/api-key-auth">Connect with an API
		key</a> covers headers, scopes, and rate limits.
	</Callout>

	<Heading level={2}>What stops an assistant from sending email by mistake?</Heading>

	<Paragraph>
		<strong>Four guardrails</strong> limit what an assistant can do. The first applies to every
		connection, and the other three apply to connections made with an API key.
	</Paragraph>

	<List>
		<li>
			<strong>Destructive annotations.</strong> Tools that send email right away, overwrite data, or
			delete it carry the MCP destructive annotation, so a client such as Claude can ask for
			confirmation before calling one.
		</li>
		<li>
			<strong>Scopes.</strong> When nobody is present to confirm, the key's scopes do the restricting.
			The server does not list a tool the scopes exclude, so a headless agent cannot call it.
		</li>
		<li>
			<strong>Sandbox keys.</strong> Every email sent with a sandbox key has its sender and recipient
			rewritten, so an agent holding one cannot email a real customer, whatever its prompt says.
		</li>
		<li>
			<strong>API logs.</strong> Every call made with an API key is recorded in the API logs with the
			key's ID, so an agent's actions can be reviewed afterwards. Calls made by signing in belong to a
			person rather than a key and don't appear there.
		</li>
	</List>

	<Paragraph>
		The remote server also runs in <a href="/blog/why-lettr-runs-on-lambda-with-bref/">its own Lambda
		function</a>, so the functions serving the web app and the REST API <strong>have no access to the
		OAuth signing keys</strong>.
	</Paragraph>

	<Paragraph>
		<strong>An AI client sends everything a tool returns to its model provider</strong>, contact
		details included, and that part is outside Lettr's control, so check the provider's data terms
		before managing the audience from an assistant. Connect only AI clients you trust, and review an action before
		confirming anything sensitive.
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
		<strong>An assistant can now send campaigns and manage the audience</strong>, on top of the
		sending, templates, and diagnostics it already handled. Sign in for chat, and give anything unattended
		a scoped key so its scopes and the API logs keep it in check.
	</Paragraph>

	<Paragraph>
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> to connect an assistant;
		the free plan needs no credit card, and the MCP server works on it. Once you're in, the
		<a href="https://docs.lettr.com/learn/mcp/introduction">MCP docs</a> walk through each client.
	</Paragraph>
</BlogPost>
