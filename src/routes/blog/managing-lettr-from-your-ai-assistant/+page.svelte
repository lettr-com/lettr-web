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

	const mcpJsonExample = `{
  "mcpServers": {
    "lettr": {
      "command": "npx",
      "args": ["-y", "lettr-mcp"],
      "env": {
        "LETTR_API_KEY": "lttr_your_api_key_here"
      }
    }
  }
}`;
</script>

<BlogPost
	category="Product"
	title="Managing Lettr from your AI assistant"
	excerpt="How Lettr's MCP integration lets an AI assistant call the Lettr API in plain language: what MCP is, what the tools cover, the difference between the remote and local servers, how to set up each one, and which tasks suit a chat interface versus the dashboard."
	metaDescription="How Lettr's MCP integration lets an AI assistant run the Lettr API in plain language: what MCP covers, remote vs local servers, and how to set it up."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="May 27, 2026"
	datetime="2026-05-27"
	readTime="4 min read"
	slug="managing-lettr-from-your-ai-assistant"
>
	<Lead>
		Lettr has an MCP integration which lets an AI assistant call the Lettr API on your behalf. Ask it
		in plain language to list last week's bounces, add a sending domain, or send a test, and it picks
		the right API call and returns the result in the same window.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li><strong>MCP lets an AI assistant call the Lettr API in plain language</strong>, against real data.</li>
			<li>
				<strong>Lettr ships two servers</strong>: a remote one (OAuth, read-only) for chat tools, a local
				one (API key, full access) for editors.
			</li>
			<li>
				<strong>It complements the dashboard, it doesn't replace it</strong>: quick lookups yes, bulk
				production changes no.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>What is MCP?</Heading>

	<Paragraph>
		<strong>MCP (Model Context Protocol) is an open standard that lets AI assistants call external
		services.</strong> Without it, an assistant only sees what's in the conversation (pasted text,
		open files, prior turns). With it, the assistant can reach a real API and act on real data, so
		"show me my sending domains" returns the actual list from the account.
	</Paragraph>

	<Paragraph>
		An MCP server advertises a list of <strong>named tools</strong> (functions with typed parameters and a
		description). The assistant reads the list, picks the one that matches the request, fills in the
		arguments, and surfaces the response, with the raw JSON hidden unless asked for.
	</Paragraph>

	<Heading level={2}>What it looks like in practice</Heading>

	<Paragraph>
		The requests that come up most while debugging deliverability or setting things up each map to a
		tool. Asked in plain language, the assistant picks the matching call and returns real data from
		the account:
	</Paragraph>

	<List>
		<li>
			<strong>Why did an email not arrive?</strong> The assistant lists recent bounce events for the
			address and shows whether it was a hard bounce, a deferral, or just a slow accept.
		</li>
		<li>
			<strong>Why has an address stopped receiving anything?</strong> It returns the suppression
			status and the reason, and can lift the suppression once the original complaint turns out to
			have been a mistake.
		</li>
		<li>
			<strong>Add a sending domain.</strong> It registers the domain and hands back the DNS records to
			add, then verifies the domain once DNS has propagated.
		</li>
		<li>
			<strong>Create and test a template.</strong> It creates a template with a set of merge tags and
			sends a test render to a real address, all in one request.
		</li>
	</List>

	<Paragraph>
		Each request is a plain-language description of the goal, with the assistant translating it into
		the matching endpoint and arguments. And because the chat keeps the prior calls in context,
		<strong>follow-ups are cheap</strong>: after a list of bounce events, a question like "which of
		these were over quota?" filters the results the assistant already retrieved instead of querying
		the API again.
	</Paragraph>

	<Heading level={2}>Remote vs. local server</Heading>

	<Paragraph>
		<strong>Lettr ships two MCP servers because chat and editor have different threat models.</strong>
		A chat conversation might be stored, replayed, or shared, so the remote server uses OAuth and
		keeps write access narrow. A code editor runs locally, so the local server can hold a real API
		key and expose the full API. Which to reach for depends on where the work is happening.
	</Paragraph>

	<div data-reveal class="grid gap-4 sm:grid-cols-2">
		<div class="border border-border/50 bg-white p-5 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]">
			<div class="mb-3 text-base font-semibold text-surface">Remote server</div>
			<dl class="space-y-2.5 text-sm text-muted">
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Best for</dt>
					<dd>Claude.ai, ChatGPT, GitHub Copilot</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Also works with</dt>
					<dd>Cursor, Claude Desktop</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Auth</dt>
					<dd>OAuth 2.1 login</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Where it runs</dt>
					<dd>Lettr's servers</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Write access</dt>
					<dd>Limited (no destructive ops)</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">API key in chat</dt>
					<dd>Never</dd>
				</div>
			</dl>
		</div>
		<div class="border border-border/50 bg-white p-5 shadow-[0_20px_50px_-45px_rgba(17,24,39,0.6)]">
			<div class="mb-3 text-base font-semibold text-surface">Local server</div>
			<dl class="space-y-2.5 text-sm text-muted">
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Best for</dt>
					<dd>Claude Code</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Also works with</dt>
					<dd>Cursor, Claude Desktop</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Auth</dt>
					<dd>API key in env var</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Where it runs</dt>
					<dd>Local machine</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">Write access</dt>
					<dd>Full</dd>
				</div>
				<div class="flex flex-col gap-0.5">
					<dt class="text-xs font-semibold uppercase tracking-wide text-primary/70">API key in chat</dt>
					<dd>Never (stays local)</dd>
				</div>
			</dl>
		</div>
	</div>

	<Paragraph>
		The rough rule is <strong>the remote server from chat tools</strong> and the <strong>local server from an editor</strong>, and both
		can connect to the same account <strong>at once</strong>. With the <strong>remote server</strong>, OAuth hands the tool a scoped
		token and no secret ever reaches the transcript. With the <strong>local server</strong>, the key sits in an env
		var or config file alongside every other service's credentials and never leaves the machine,
		which is what lets it safely expose create, delete, and webhook inspection.
	</Paragraph>

	<Paragraph>
		<strong>The remote server is intentionally read-only.</strong> Domain changes are infrastructure
		decisions, and a chat thread that might be stored or shared is the wrong place for them. Both
		servers also honor existing Lettr permissions: an account that can't see a team's domains in the
		dashboard can't see them through MCP either.
	</Paragraph>

	<Heading level={2}>Setup</Heading>

	<Paragraph>
		Connecting takes a few minutes, and the steps differ by server. New to Lettr?
		<a href="https://app.lettr.com/register">Sign up</a> first (setup is free); the integration works
		best once the account has two things in place:
	</Paragraph>

	<List>
		<li>A <a href="https://docs.lettr.com/learn/domains/sending-domains">sending domain</a> to send from.</li>
		<li>
			An <a href="https://docs.lettr.com/learn/api-keys/introduction">API key</a> so the tools have
			something to act on.
		</li>
	</List>

	<Paragraph>From there, pick the server that matches the tool in use.</Paragraph>

	<Paragraph>
		<strong>1. Remote server</strong> (Claude.ai, ChatGPT, GitHub Copilot, Cursor, Claude Desktop):
	</Paragraph>

	<List>
		<li>Add <code>https://app.lettr.com/mcp</code> as a remote MCP server in the tool's settings.</li>
		<li>Complete OAuth and approve the connection.</li>
		<li>Tools are available immediately.</li>
	</List>

	<Paragraph><strong>2. Local server</strong> (Claude Code, Cursor, Claude Desktop):</Paragraph>

	<List>
		<li>
			Add the snippet below to <code>.mcp.json</code> (Claude Code) or
			<code>.cursor/mcp.json</code> (Cursor).
		</li>
	</List>

	<Code lang="text" filename=".mcp.json" code={mcpJsonExample} />

	<List>
		<li>Start the assistant. <code>lettr-mcp</code> is fetched on the first run.</li>
	</List>

	<Paragraph>
		Per-client setup details for every supported AI tool live in the
		<a href="https://docs.lettr.com/learn/mcp/introduction">MCP docs</a>.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is MCP?">
			<strong>MCP (Model Context Protocol) is an open standard that lets AI assistants call external
			services.</strong> Without it, an assistant only sees what is in the conversation. With it, the
			assistant can reach a real API and act on real data, so a request like "show me my sending
			domains" returns the actual list from the account.
		</FaqItem>

		<FaqItem question="Which AI assistants work with Lettr's MCP?">
			<strong>The remote server suits chat tools like Claude.ai, ChatGPT, and GitHub Copilot; the local
			server suits editors like Claude Code.</strong> Cursor and Claude Desktop work with either. The
			remote server connects over OAuth, while the local one runs on your machine with an API key in a
			config file.
		</FaqItem>

		<FaqItem question="Is it safe to put my API key in a chat?">
			<strong>The key never reaches the chat. The remote server uses OAuth and hands the tool a scoped
			token, and the local server keeps the key in an env var on your machine.</strong> The remote
			server is also read-only, so a stored or shared transcript cannot trigger a destructive change.
			Both servers honor existing Lettr permissions.
		</FaqItem>

		<FaqItem question="Does MCP replace the Lettr dashboard?">
			<strong>No. It complements the dashboard for quick lookups and one-off actions, not bulk
			production work.</strong> Analytics charts, suppression management, and anything with a complex
			filter UI stay better in the dashboard, where seeing a lot of data at once beats a series of
			follow-up questions.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		<strong>The dashboard stays the better tool for some work.</strong> Analytics charts, suppression
		management, and anything with a complex filter UI belong there, as does any task that needs eyes
		on a lot of data at once, where scrolling and sorting beat a series of follow-up questions.
	</Paragraph>

	<Paragraph>
		<strong>MCP is good at the smaller stuff:</strong> the lookups and one-off actions that happen
		dozens of times during a working session and aren't worth opening another tab for. Status checks
		("did the password reset to that address actually leave?"), debugging helpers ("why was this
		transmission rejected?"), and the kind of mid-task setup that would otherwise interrupt the work
		in the editor.
	</Paragraph>

	<Paragraph>
		<strong>The sweet spot is the dozens of small interactions in a working day</strong>. Set it
		up in whatever assistant is already open, keep the dashboard a click away for the heavy lifting,
		and most of the context switching disappears. Learn more about
		<a href="/platform/mcp/">Lettr's MCP integration</a>, or
		<a href="https://app.lettr.com/register">create a free Lettr account</a> to connect it.
	</Paragraph>
</BlogPost>
