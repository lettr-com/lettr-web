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
		FaqItem,
		ProductNote
	} from '$lib/components/blog';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Single source for the visible FAQ and the FAQPage structured data.
	const faqItems = [
		{
			question: 'Can I create a key with custom scopes for an agent?',
			lead: 'No. Lettr API keys are created as Full access or Sending only.',
			rest: 'Each tool checks a finer scope behind the scenes, but the permission level decides which scopes a key holds.'
		},
		{
			question: "Do an agent's MCP calls count against the REST rate limit?",
			lead: "Yes. MCP and REST calls draw on the same per-team budget.",
			rest: 'The MCP endpoint allows up to 10 requests per second against REST\'s 3, because connecting a client alone takes several requests. Sandbox keys sit outside this budget.'
		},
		{
			question: 'Can a sandbox key send or schedule a campaign?',
			lead: 'No. A sandbox key cannot call any tool that writes data.',
			rest: 'It can read the team\'s data and send, schedule, and cancel single emails, which Lettr delivers to the inbox of the key\'s creator.'
		},
		{
			question: 'Does an agent with an API key need to pass a team ID?',
			lead: 'No. The key belongs to one team, so its tools take no team ID.',
			rest: 'Only a signed-in connection whose user belongs to several teams has to name a team.'
		}
	];
	const faqs = faqItems.map(({ question, lead, rest }) => ({ question, answer: `${lead} ${rest}` }));
</script>

<BlogPost
	category="Product"
	title="Scoped API keys for AI agents on Lettr's MCP server"
	seoTitle="Email API for AI agents: scoped MCP API keys"
	excerpt="An AI agent can connect to Lettr's MCP server with its own API key, and the key's permission level fixes which tools the server offers it. This article covers what Full access and Sending only keys give an agent, testing with a sandbox key, and reading one agent's calls in the API logs."
	metaDescription="Give each AI agent its own Lettr API key for the MCP server, see which tools each permission level allows, and test agents safely with a sandbox key."
	author={{ name: 'Jack Zagorski', role: 'Content specialist', avatar: '/images/authors/jack.jpg' }}
	date="October 16, 2026"
	datetime="2026-10-16"
	readTime="5 min read"
	slug="mcp-api-key-scopes"
	{faqs}
>
	<Lead>
		Lettr, a sending platform for transactional and marketing email, runs a remote MCP server that an
		AI agent can connect to with its own API key. The key's permission level, Full access or Sending
		only, fixes the list of tools the server offers the agent, so a Sending only key gives an agent
		no tools for changing templates, domains, webhooks, or the audience.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>A key acts as its team</strong>: the agent reaches only that team, and its tools
				take no team ID.
			</li>
			<li>
				<strong>The permission level decides the tool list</strong>: Sending only gives four sending
				tools and two team tools, and a tool outside the list does not exist for the agent.
			</li>
			<li>
				<strong>A sandbox key makes a safe test</strong>, and one key per agent turns the API logs
				into a record of each agent's calls.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>How an agent connects with an API key</Heading>

	<Paragraph>
		An agent that connects with an API key acts as a <strong>team</strong> (the Lettr workspace that
		holds its own domains, templates, and audience) rather than as a person. The key belongs to one
		team, so the agent can reach no other team, and its tools take no team ID. The client config
		needs the server URL and the key in an Authorization header:
	</Paragraph>

	<Code filename="mcp.json" {...data.code.clientConfig} />

	<Paragraph>
		Anyone who can read a client config file can use the key in it, so
		<strong>keep the key in an environment variable</strong> and keep config files out of version
		control.
	</Paragraph>

	<Paragraph>
		A key's <strong>IP allowlist</strong> applies to its MCP calls exactly as it does to its REST
		calls, and Lettr refuses a call from any other address with a 403 error. MCP and REST calls also
		draw on one per-team rate-limit budget. The MCP endpoint allows up to 10 requests per second
		against REST's 3, because connecting a client alone takes several requests.
	</Paragraph>

	<Paragraph>
		For an assistant a person uses directly, <a href="/blog/lettr-mcp-server-tools/">signing in</a>
		is the better fit. A signed-in connection acts as the person who signed in, so it can reach every
		team they belong to.
	</Paragraph>

	<ProductNote />

	<Heading level={2}>Which tools does each permission level give an agent?</Heading>

	<Paragraph>
		The <a href="/platform/mcp/">remote MCP server</a> builds the tool list from the key's
		<strong>permission level</strong>, and it checks the list again on every request:
	</Paragraph>

	<List>
		<li>
			<strong>Full access</strong> gives every tool except <code>list_api_keys</code> and
			<code>browse_api_logs</code>, which no API key can use.
		</li>
		<li>
			<strong>Sending only</strong> gives <code>send_email</code>, <code>send_template_email</code>,
			<code>schedule_email</code>, and <code>cancel_scheduled_email</code>, plus
			<code>current_team</code> and <code>list_teams</code>, which report the key's team.
		</li>
	</List>

	<Paragraph>
		Behind the two levels, each tool checks one scope, the same one the REST API checks for the
		matching endpoint: listing contacts needs <code>audience:read</code>, and sending a campaign
		needs <code>campaigns:write</code>. The permission level decides which scopes a key holds.
	</Paragraph>

	<Paragraph>
		When an agent calls a tool its key excludes, the call returns a
		<strong>"tool not found" error</strong> rather than one that names a missing scope, because the
		server never registers the tool for that key.
	</Paragraph>

	<Heading level={2}>Choose the permission level for each agent's job</Heading>

	<Paragraph>
		<strong>Give each agent its own key</strong>, so that revoking or
		<a href="/glossary/key-rotation/">rotating</a> one agent's key leaves the other agents working.
		Then choose the narrower level whenever the job allows it.
	</Paragraph>

	<List>
		<li>
			<strong>Sending only</strong> fits an agent that only sends, schedules, or cancels email. A
			leaked Sending only key cannot change the team's templates, domains, webhooks, audience, or
			campaigns.
		</li>
		<li>
			<strong>Full access</strong> fits an agent that manages templates, webhooks, or the audience,
			or that reports on and sends campaigns.
		</li>
	</List>

	<Paragraph>
		A Full access agent can list campaigns, read their stats and events, and send, schedule, or
		unschedule them. <strong>No MCP tool creates a campaign</strong>: campaigns are built in the
		dashboard or through the REST API, and the agent works with them from there.
	</Paragraph>

	<Callout variant="info">
		<a href="https://docs.lettr.com/learn/mcp/api-key-auth">Connect with an API key</a> covers the
		headers, permission levels, and rate limits for MCP clients.
	</Callout>

	<Heading level={2}>Test the agent with a sandbox key</Heading>

	<Paragraph>
		A <a href="/glossary/sandbox-mode/">sandbox key</a>, whose value starts with
		<code>lttr_sandbox_</code>, lets an agent read the team's data and send, schedule, and cancel
		email. It <strong>cannot call any tool that writes data</strong>, so it cannot change templates,
		domains, webhooks, the audience, or campaigns, and it cannot send or schedule a campaign.
	</Paragraph>

	<Paragraph>
		Lettr delivers every email sent with a sandbox key to <strong>the inbox of the key's
		creator</strong>, replaces the domain in the sender address with <code>dev.uselettr.com</code>,
		and drops CC and BCC recipients, so each email the agent writes during the test can be read
		before any customer sees one.
	</Paragraph>

	<Paragraph>
		Sandbox keys have their own <a href="/glossary/rate-limiting/">rate limits</a> of 20 requests
		per second, 120 per minute, and 2,000 per day per key, outside the team's live budget. Once the
		agent behaves as expected, give it a live key at the same permission level. A live Full access
		key also unlocks the write tools a sandbox key never offered, so the test covers reading and
		sending, not changes to the team's data.
	</Paragraph>

	<Heading level={2}>Where do one agent's calls show up?</Heading>

	<Paragraph>
		The Logs page in Lettr's dashboard filters the API logs by key, and <strong>the API logs record
		MCP calls made with a key</strong> alongside its REST calls. With one key per agent, the filter
		shows a single agent's calls. Calls from a signed-in connection belong to a person rather than a
		key and don't appear there.
	</Paragraph>

	<Paragraph>
		No API key can call <code>browse_api_logs</code>, so reading the logs from a chat requires an
		assistant connected by signing in.
	</Paragraph>

	<Heading level={2}>Why else use Lettr?</Heading>

	<Paragraph>
		An agent's key covers one job, and Lettr covers the rest of a team's email:
		<a href="/email-api/">transactional messages</a> that an app triggers through the REST API or
		SMTP, and <a href="/email-marketing/">marketing campaigns</a> sent to the team's audience, on
		<strong>one account</strong>.
	</Paragraph>

	<Paragraph>
		The people who write the emails build them in Lettr's drag-and-drop editor, with synced sections
		that update every template using them, multilingual templates, and merge tags, so a copy change
		needs no developer. <strong>Webhooks</strong> tell an app when an email is delivered, opened, or
		clicked.
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
		<strong>One key per agent, at the narrowest level the job allows</strong>, limits each agent to
		the tools its job needs. Test the agent with a sandbox key, then follow its live calls in the API
		logs.
	</Paragraph>

	<Paragraph>
		<a href="https://app.lettr.com/register">Create a free Lettr account</a> to give your first agent
		its own API key. Once you're in, the
		<a href="https://docs.lettr.com/learn/mcp/api-key-auth">API key guide</a> covers the connection
		for each client.
	</Paragraph>
</BlogPost>
