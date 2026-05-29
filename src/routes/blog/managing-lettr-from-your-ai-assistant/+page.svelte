<script lang="ts">
	import { BlogPost, Lead, Heading, Paragraph, List, Code } from '$lib/components/blog';

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
	title="Managing Lettr from your AI assistant: the MCP integration"
	excerpt="A bounce report comes in and you tab between dashboard, terminal, and editor copying IDs. MCP turns that into a sentence in the AI assistant you already have open. Here's how the integration works."
	author={{ name: 'Erik Vlčák', role: 'Customer Success', avatar: '/images/authors/erik.jpg' }}
	date="May 27, 2026"
	datetime="2026-05-27"
	readTime="5 min read"
	slug="managing-lettr-from-your-ai-assistant"
>
	<Lead>
		A lot of the time you spend on email isn't actually spent on email. It's spent moving between the
		dashboard, your editor, and a terminal, copying an ID from one to another. A bounce report comes
		in, you tab to the dashboard to find the message ID, paste it into a curl call to inspect the
		events, then tab back to verify the template. None of the steps are hard, but they accumulate
		over a day, and the context switching costs more than the work itself.
	</Lead>

	<Paragraph>
		MCP turns that into a sentence in whatever AI assistant you already have open (Claude, ChatGPT,
		Cursor, Copilot). The assistant talks to Lettr's API for you, and the response shows up in the
		same pane. You can ask for last week's bounces, have it create a template, or have it send a
		test, all without leaving the window. The same conversation you were already using to draft
		welcome-email copy can now also send the test version of it.
	</Paragraph>

	<Paragraph>
		The rest of this post covers what the integration does, the two servers Lettr ships, and how to
		set up whichever one fits where you work.
	</Paragraph>

	<Heading level={2}>What is MCP?</Heading>

	<Paragraph>
		MCP (Model Context Protocol) is an open standard that enables AI assistants to call external
		services. Without it, an assistant only sees what's in the conversation: pasted text, open files,
		prior turns. With it, it can hit a real API and act on real data. "Show me my sending domains" is
		no longer a guess; it's a request to Lettr.
	</Paragraph>

	<Paragraph>
		Concretely, an MCP server advertises a list of named tools (functions with typed parameters and a
		description). The assistant reads the list, picks the one that matches your sentence, fills in the
		arguments, and shows you the response. You don't see the JSON unless you want to. Lettr's servers
		expose tools across the same areas the dashboard does: domains, templates, transmissions,
		suppression, webhooks, and event lookups.
	</Paragraph>

	<Heading level={2}>What it looks like in practice</Heading>

	<Paragraph>A few things you can type:</Paragraph>

	<List>
		<li>
			<code>list bounce events for user@example.com from the last 24 hours</code>. Useful when a user
			says they didn't get their verification email and you want to know whether it was a bounce, a
			deferral, or just slow.
		</li>
		<li>
			<code>add example.com as a sending domain and show me the DNS records</code>, followed by
			<code>verify example.com</code> once DNS has propagated.
		</li>
		<li>
			<code
				>create a template called order-confirmation with merge tags customer_name, order_id,
				total</code
			>
			and then
			<code
				>send a test of order-confirmation to me@example.com with customer_name=Alex,
				order_id=ORD-123, total=$42</code
			>.
		</li>
		<li>
			<code>list my webhooks</code> or <code>show recent failed deliveries for webhook X</code>.
		</li>
		<li>
			<code>what's the suppression reason for hello@example.com</code> when a customer asks why they
			aren't receiving anything, with a follow-up of
			<code>remove that address from suppression</code> once they've confirmed the original complaint
			was a mistake.
		</li>
	</List>

	<Paragraph>
		You don't memorize endpoints or flags. You describe what you want; the assistant picks the
		matching tool; the response shows up where you're already working. Because the same chat keeps
		the prior calls in context, follow-ups are cheap. After listing bounce events, you can ask "which
		of these were over quota?" and the assistant filters the list it just retrieved instead of
		re-querying the API.
	</Paragraph>

	<Heading level={2}>Remote vs. local: pick one (or both)</Heading>

	<Paragraph>
		Lettr ships two MCP servers. Which to use depends on where you're working.
	</Paragraph>

	<div data-reveal class="overflow-x-auto">
		<table class="w-full border-collapse text-body text-muted">
			<thead>
				<tr class="border-b border-gray-200">
					<th class="px-3 py-2 text-left font-semibold text-primary"></th>
					<th class="px-3 py-2 text-left font-semibold text-primary">Remote server</th>
					<th class="px-3 py-2 text-left font-semibold text-primary">Local server</th>
				</tr>
			</thead>
			<tbody>
				<tr class="border-b border-gray-100">
					<td class="px-3 py-2 font-semibold text-primary">Best for</td>
					<td class="px-3 py-2">Claude.ai, ChatGPT, GitHub Copilot</td>
					<td class="px-3 py-2">Claude Code</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="px-3 py-2 font-semibold text-primary">Also works with</td>
					<td class="px-3 py-2">Cursor, Claude Desktop</td>
					<td class="px-3 py-2">Cursor, Claude Desktop</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="px-3 py-2 font-semibold text-primary">Auth</td>
					<td class="px-3 py-2">OAuth 2.1 login</td>
					<td class="px-3 py-2">API key in env var</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="px-3 py-2 font-semibold text-primary">Where it runs</td>
					<td class="px-3 py-2">Lettr's servers</td>
					<td class="px-3 py-2">Your machine</td>
				</tr>
				<tr class="border-b border-gray-100">
					<td class="px-3 py-2 font-semibold text-primary">Write access</td>
					<td class="px-3 py-2">Limited (no destructive ops)</td>
					<td class="px-3 py-2">Full</td>
				</tr>
				<tr>
					<td class="px-3 py-2 font-semibold text-primary">API key in chat</td>
					<td class="px-3 py-2">Never</td>
					<td class="px-3 py-2">Never (stays local)</td>
				</tr>
			</tbody>
		</table>
	</div>

	<Paragraph>
		Rough rule: use the remote server from chat tools and the local server from your editor. Both can
		be connected to the same account if you switch contexts.
	</Paragraph>

	<Paragraph>
		The remote server is intentionally read-only. Domain changes are infrastructure decisions, and
		you don't want them to happen in a chat thread that might be stored or shared. The local server
		runs on your machine with your own key, so it can safely expose the full API, including create,
		delete, and webhook inspection.
	</Paragraph>

	<Heading level={2}>Setup</Heading>

	<Paragraph>
		<strong>Remote server (Claude.ai, ChatGPT, GitHub Copilot, Cursor, Claude Desktop):</strong> add
		<code>https://app.lettr.com/mcp</code> as a remote MCP server in your tool's settings, complete
		OAuth, and approve the connection. Tools are available immediately.
	</Paragraph>

	<Paragraph>
		<strong>Local server (Claude Code, Cursor, Claude Desktop):</strong> add this to
		<code>.mcp.json</code> (Claude Code) or <code>.cursor/mcp.json</code> (Cursor):
	</Paragraph>

	<Code lang="text" filename=".mcp.json" code={mcpJsonExample} />

	<Paragraph><code>lettr-mcp</code> is fetched on the first run.</Paragraph>

	<Paragraph>
		If you're new to Lettr, <a href="https://app.lettr.com/register">sign up</a> first. Setup is free.
		Before connecting MCP, you'll want to add a
		<a href="https://docs.lettr.com/learn/domains/sending-domains">sending domain</a> and create an
		<a href="https://docs.lettr.com/learn/api-keys/introduction">API key</a> so the tools have
		something to act on. Per-client setup details for every supported AI tool are in the
		<a href="https://docs.lettr.com/learn/mcp/introduction">MCP docs</a>.
	</Paragraph>

	<Heading level={2}>Why two servers exist</Heading>

	<Paragraph>Chat and editor have different threat models.</Paragraph>

	<Paragraph>
		A chat conversation might be stored, replayed, or shared. Pasting an API key into one is a bad
		idea regardless of how much you trust the vendor. The remote server avoids the problem with
		OAuth: you authorize once, the tool gets a scoped token, no secret in the transcript.
	</Paragraph>

	<Paragraph>
		A code editor runs locally. The API key sits in an env var or config file, the same place
		credentials for every other service live. The key never leaves your machine, which is why the
		local server can safely expose write operations that the remote one withholds.
	</Paragraph>

	<Paragraph>
		Both servers honor your existing Lettr permissions. If your account can't see a team's domains in
		the dashboard, MCP can't either.
	</Paragraph>

	<Heading level={2}>Where this fits</Heading>

	<Paragraph>
		This isn't a replacement for the dashboard. Analytics charts, suppression management, anything
		with a complex filter UI is still better there. The dashboard is also still the right place for
		tasks that need eyes on a lot of data at once, where scrolling and sorting beat asking a series
		of follow-up questions.
	</Paragraph>

	<Paragraph>
		MCP is good at the smaller stuff: the lookups and one-off actions that happen dozens of times
		during a working session and aren't worth opening another tab for. Status checks ("did the
		password reset to that address actually leave?"), debugging helpers ("why was this transmission
		rejected?"), and the kind of mid-task setup that would otherwise interrupt what you were already
		doing in the editor.
	</Paragraph>

	<Paragraph>
		It's also worth being honest about what to avoid. Bulk operations on real production data are a
		poor fit for a chat interface, even with the local server's full write access. If you're about to
		delete two hundred templates or rotate every webhook secret, that's a script and a code review,
		not a sentence. The remote server's read-only posture is a feature here: it removes the option to
		make a destructive change in a place where mistakes are easy to make and hard to undo.
	</Paragraph>

	<Paragraph>
		The integration doesn't replace the dashboard, the editor, or the API. It just lets you stay in
		whichever one you're already in while still being able to reach the other two with a sentence.
	</Paragraph>
</BlogPost>
