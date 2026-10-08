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
			question: "Is the remote MCP server still read-only?",
			lead: "No. Since the September 2026 release it can send email, run campaigns, and change the audience.",
			rest: "The tools that send, overwrite, or delete are marked as destructive, so a client such as Claude asks before calling one."
		},
		{
			question: "Can I limit what an agent is allowed to do?",
			lead: "Yes, by connecting it with an API key scoped to the tools it needs.",
			rest: "A tool outside the key's scopes is not listed at all, and a sending-only key sees just the four send and schedule tools."
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
	excerpt="An AI assistant such as Claude, ChatGPT, or Cursor can operate Lettr through 79 MCP tools, from sending and scheduling to campaigns, audience management, and delivery diagnostics, with more added as Lettr ships new features. This article covers what the tools do, the two ways to connect, and the guardrails that keep an assistant from sending anything by mistake."
	metaDescription="Manage an email platform from Claude, ChatGPT, or Cursor. Lettr's MCP server gives an AI assistant 79 tools, and counting, for sending, campaigns, and audience."
	author={{ name: 'Jack Zagorski', role: 'Content specialist', avatar: '/images/authors/jack.jpg' }}
	date="October 6, 2026"
	datetime="2026-10-06"
	readTime="4 min read"
	slug="lettr-mcp-server-tools"
	{faqs}
>
	<Lead>
		Lettr hosts a remote MCP server at <code>app.lettr.com/mcp</code> that AI assistants such as
		Claude, ChatGPT, and Cursor connect to. It has 79 tools across ten areas of the product, up from
		18 before the September 2026 release, which is enough for an assistant to operate the whole of
		Lettr: sending, scheduling, campaigns, the audience, and delivery diagnostics. The count keeps
		rising, because new tools ship alongside new Lettr features.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>The remote server now covers the whole product</strong>, including campaigns and
				audience management, which used to need the dashboard.
			</li>
			<li>
				<strong>Sign in for chat, use a scoped API key for anything unattended</strong>: CI jobs, cron
				scripts, and headless agents.
			</li>
			<li>
				<strong>Destructive tools ask first</strong>, a key only sees the tools its scopes allow, and
				every call lands in the API logs.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What the Lettr MCP server covers</Heading>

	<Paragraph>
		<strong>Each tool does exactly what the matching API endpoint does</strong>, so a tool call reads
		and writes the same data an API client would. The ten areas are emails, scheduled emails,
		templates with their folders and projects, sending domains, the other domain types (tracking,
		inbound, and storage), webhooks, campaigns, the audience, analytics and monitoring, and the
		account itself.
	</Paragraph>

	<Paragraph>
		We introduced <a href="/blog/managing-lettr-from-your-ai-assistant/">the MCP integration in May
		2026</a> with a smaller, read-only set. The September release added everything that writes, so the
		remote server now <strong>matches the <code>lettr-mcp</code> npm package</strong>, and the npm
		package is deprecated.
	</Paragraph>

	<Heading level={2}>What an assistant can do with the full set</Heading>

	<Paragraph>
		<strong>The clearest additions are campaigns and audience management</strong>, the parts of an
		email platform that normally need a dashboard. A question like "How did last week's newsletter
		campaign perform?" gets the campaign's numbers, and "create an opt-in topic called Product
		updates" creates it. Neither needs the dashboard open.
	</Paragraph>

	<Paragraph>
		The remote server also carries <strong>four diagnostic tools</strong>: DNS diagnosis, a sending
		health check, analytics, and API logs. They answer questions such as why a message failed to
		deliver, or whether a domain is verified and ready to send, in the same conversation that sent the
		email.
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
		<strong>Four guardrails</strong> apply to every connection: two stop a call before it runs, one
		limits where a test email can go, and one records what happened.
	</Paragraph>

	<List>
		<li>
			<strong>Destructive annotations.</strong> Tools that send email, overwrite data, or remove data
			in a way that can't be undone carry the MCP destructive annotation, so a client such as Claude
			asks before calling one, and even a misread request needs a confirmation before any email goes
			out.
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
			<strong>API logs.</strong> Every call an agent makes is recorded in the API logs with its key's
			ID, so its actions can be reviewed afterwards.
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
		<strong>The dashboard is no longer the only way to operate Lettr</strong>, since campaigns and
		audience work now take a plain-language request. Sign in for chat and give anything unattended a
		scoped key; the same guardrails apply to both.
	</Paragraph>

	<Paragraph>
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> to connect an assistant;
		the free plan needs no credit card and includes the full API. Once you're in, the
		<a href="https://docs.lettr.com/learn/mcp/introduction">MCP docs</a> walk through each client.
	</Paragraph>
</BlogPost>
