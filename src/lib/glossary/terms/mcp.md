---
term: MCP
fullName: Model Context Protocol
heading: "What is MCP?"
description: "MCP is an open protocol that connects AI assistants to external tools and data. How MCP servers work and what Lettr's remote and local MCP servers can do."
published: 2026-09-14
updated: 2026-09-14
related: [api-key, webhook, template-slug, esp]
reading:
  - title: MCP Introduction
    href: https://docs.lettr.com/learn/mcp/introduction
  - title: Remote Server
    href: https://docs.lettr.com/learn/mcp/setup
  - title: Local Server
    href: https://docs.lettr.com/learn/mcp/local-setup
  - title: Tools Reference
    href: https://docs.lettr.com/learn/mcp/tools-reference
---

**MCP (Model Context Protocol)** is an open protocol that lets AI assistants connect to external tools and data sources through one common interface. Anthropic announced it in November 2024, and it has since been adopted by other AI assistants and developer tools. A service that implements an MCP server once becomes usable from every compatible assistant, instead of needing a separate plugin or integration for each one.

## How MCP works

MCP describes three roles. **The host is the AI application a person works in**, such as a chat app, a desktop assistant or a code editor. Inside the host, a client keeps a connection to one server, and the server exposes what an external system can do. A host can run several clients at once, so one assistant can reach many servers.

Servers offer three kinds of capability. Tools are functions the model can call, such as sending an email or listing domains. Resources are data the application can load into the model's context, and prompts are reusable templates for common tasks. Messages between client and server use JSON-RPC 2.0.

Two transports cover most setups. A local server runs as a process on the user's machine and talks over standard input and output (stdio), usually reading a credential from an environment variable. A remote server is reached over HTTP, often with server-sent events for streaming, and typically authenticates the user with OAuth. When a request arrives in plain language, the model selects a tool and its arguments, the server executes the call against the underlying API, and the result returns to the model as context.

## MCP vs a direct API integration

A direct integration is code written against one service's API, and it is still the right choice for anything that runs unattended. An application that sends password resets calls an [ESP](/glossary/esp/) through its REST API on every signup and does not need a language model in the loop.

**MCP suits interactive work**: lookups, debugging and one-off actions a developer or operator would otherwise do by switching to a dashboard or writing a throwaway script. Checking whether a domain is verified, finding out why a specific message bounced or sending a test email become requests typed into the assistant already open. The server translates each request into the same API calls a direct integration would make, so MCP adds a new way to reach an API without replacing it.

## Best practices for MCP

**Give an MCP server the narrowest credentials that cover the job.** A local server acts with whatever [API key](/glossary/api-key/) it is configured with, so a restricted key that only allows the needed actions limits what a mistaken or misunderstood request can do. Keys belong in environment variables or a secrets manager, never in configuration files committed to a repository.

Review consequential actions before confirming them. An assistant connected to an email platform can send real messages and change real configuration, and most hosts ask for approval before a tool runs, a prompt worth reading every time. Connect only trusted clients, and remove connections that are no longer used.

## MCP in Lettr

**Lettr provides two MCP servers.** The remote server is hosted at `https://app.lettr.com/mcp`, authenticates with OAuth 2.1 through the user's Lettr session over HTTP/SSE, and connects from Claude.ai, ChatGPT, Cursor, Claude Desktop and GitHub Copilot. The local server is the open-source `lettr-mcp` npm package, run through `npx`, which authenticates with an API key set as `LETTR_API_KEY`, communicates over stdio, and works with Claude Code, Cursor and Claude Desktop.

Both servers can send emails directly or from a template identified by its [template slug](/glossary/template-slug/), list, view, create and update templates, and list sending domains and [webhooks](/glossary/webhook/). Analytics, template statistics, email events and API logs are available only on the remote server. Deleting templates, inspecting merge tags, creating, verifying and deleting domains, and inspecting webhook details are available only on the local server.

Remote access is tied to the user's Lettr session and team permissions, and the assistant loses access when the user signs out. The local server's API key stays on the user's machine, and the docs recommend restricted API keys to limit what the AI can do. The docs also warn that MCP allows assistants to send email on the user's behalf, so only trusted clients should be connected. The [Tools Reference](https://docs.lettr.com/learn/mcp/tools-reference) lists every tool on both servers.
