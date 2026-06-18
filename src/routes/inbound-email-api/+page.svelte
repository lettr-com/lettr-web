<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeSnippet from '$lib/components/CodeSnippet.svelte';
	import TalkToExpert from '$lib/components/TalkToExpert.svelte';
	import Pricing from '$lib/components/Pricing.svelte';
	import RelatedFeatures from '$lib/components/RelatedFeatures.svelte';
	import TrayIcon from 'phosphor-svelte/lib/TrayIcon';
	import TicketIcon from 'phosphor-svelte/lib/TicketIcon';
	import ArrowBendUpLeftIcon from 'phosphor-svelte/lib/ArrowBendUpLeftIcon';
	import PaperclipIcon from 'phosphor-svelte/lib/PaperclipIcon';
	import TreeStructureIcon from 'phosphor-svelte/lib/TreeStructureIcon';
	import DatabaseIcon from 'phosphor-svelte/lib/DatabaseIcon';
	import GlobeIcon from 'phosphor-svelte/lib/GlobeIcon';
	import LinkIcon from 'phosphor-svelte/lib/LinkIcon';
	import PaperPlaneTiltIcon from 'phosphor-svelte/lib/PaperPlaneTiltIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';
	import type { CodeTab } from '$lib/utils/shiki';

	const INBOUND_DOCS_URL = 'https://docs.lettr.com/learn/receiving/introduction';

	let hero: HTMLElement | undefined = $state();
	let definitionSection: HTMLElement | undefined = $state();
	let useCasesSection: HTMLElement | undefined = $state();
	let flowSection: HTMLElement | undefined = $state();
	let payloadSection: HTMLElement | undefined = $state();
	let setupSection: HTMLElement | undefined = $state();
	let bothWaysSection: HTMLElement | undefined = $state();
	let faqSection: HTMLElement | undefined = $state();
	let finalCtaSection: HTMLElement | undefined = $state();
	let registerHref: string = $state(registerUrl);
	let openFaq: number | null = $state(null);

	function trackCta(
		placement: string,
		label: string,
		href: string,
		variant: 'primary' | 'secondary'
	) {
		void capturePosthogEvent('cta_clicked', {
			placement,
			label,
			href,
			variant,
			destination_type: /^https?:\/\//.test(href) ? 'external' : 'internal'
		});
		if (variant === 'primary' && /register/.test(href)) {
			trackSignupClick(placement, href);
		}
	}

	function toggleFaq(i: number) {
		const wasOpen = openFaq === i;
		openFaq = wasOpen ? null : i;
		void capturePosthogEvent('faq_toggled', {
			index: i,
			question: faqs[i].question,
			opened: !wasOpen
		});
	}

	// What developers actually write — a webhook receiver that turns a parsed
	// inbound email into a ticket. The parsed payload lands as JSON on `data`;
	// every handler reads the same from / subject / text / attachments shape.
	const handlerTabs: CodeTab[] = [
		{
			label: 'Node.js',
			lang: 'javascript',
			code: `import express from 'express';

const app = express();

// Lettr POSTs a parsed inbound email to your endpoint
app.post('/webhooks/inbound', express.json(), (req, res) => {
  const { from, to, subject, text, attachments } = req.body.data;

  // Turn the email into a ticket, reply, or workflow
  createTicket({ from, subject, body: text, attachments });

  // Respond 200 fast; dedupe on the message id
  res.sendStatus(200);
});`
		},
		{
			label: 'PHP',
			lang: 'php',
			code: `// POST /webhooks/inbound
$payload = json_decode(file_get_contents('php://input'), true);
$email   = $payload['data'];

// Turn the parsed inbound email into a ticket
createTicket(
    from:        $email['from'],
    subject:     $email['subject'],
    body:        $email['text'],
    attachments: $email['attachments'],
);

// Respond 200 fast; dedupe on the message id
http_response_code(200);`
		},
		{
			label: 'Ruby',
			lang: 'ruby',
			code: `# POST /webhooks/inbound
post '/webhooks/inbound' do
  email = JSON.parse(request.body.read)['data']

  Ticket.create!(
    from:    email['from'],
    subject: email['subject'],
    body:    email['text']
  )

  # Respond 200 fast; dedupe on the message id
  status 200
end`
		},
		{
			label: 'Go',
			lang: 'go',
			code: `func inbound(w http.ResponseWriter, r *http.Request) {
    var payload struct {
        Data struct {
            From    string \`json:"from"\`
            Subject string \`json:"subject"\`
            Text    string \`json:"text"\`
        } \`json:"data"\`
    }
    json.NewDecoder(r.Body).Decode(&payload)

    // Turn the parsed inbound email into a ticket
    createTicket(payload.Data.From, payload.Data.Subject, payload.Data.Text)

    w.WriteHeader(http.StatusOK)
}`
		}
	];

	const useCases = [
		{
			icon: TicketIcon,
			title: 'Email-to-ticket support',
			description:
				'Route support@ to Lettr and turn every inbound message into a ticket in your help desk — sender, subject, body, and attachments already parsed into JSON.'
		},
		{
			icon: ArrowBendUpLeftIcon,
			title: 'Reply-to-thread handling',
			description:
				'Use variable addressing like reply+ticket_42@inbound.yourdomain.com and read the Message-ID and In-Reply-To headers to thread replies back to the right conversation.'
		},
		{
			icon: TreeStructureIcon,
			title: 'Email-to-app workflows',
			description:
				'Let users forward, file, or trigger actions by email. Each inbound message becomes a webhook your app acts on — create records, kick off jobs, or notify a channel.'
		},
		{
			icon: PaperclipIcon,
			title: 'Parse attachments & data',
			description:
				'Receipts, CSVs, signed PDFs, screenshots. Attachments arrive parsed with filename, content type, and size, plus a secure URL to download and store them.'
		},
		{
			icon: DatabaseIcon,
			title: 'Ticket & CRM sync',
			description:
				'Pipe inbound replies straight into your CRM or database. The structured payload maps cleanly to a contact, deal, or case without writing a MIME parser.'
		},
		{
			icon: TrayIcon,
			title: 'Shared & functional inboxes',
			description:
				'Back sales@, billing@, or hello@ with code instead of a person refreshing a mailbox. Auto-acknowledge, classify, and assign the moment mail lands.'
		}
	];

	const setupProof = [
		'Parsed JSON — from, to, subject, text, HTML, and headers, no MIME parsing',
		'Credential-verified webhooks so you know each POST came from Lettr',
		'Attachments extracted with filename, type, size, and a secure download URL',
		'Message-ID and In-Reply-To headers for reliable conversation threading',
		'Every received message searchable in your logs alongside your sends'
	];

	// Snippet-bait FAQ: plain answers that also fold in "email webhook" and
	// "inbound vs webhook" terminology for search coverage.
	const faqs = [
		{
			question: 'What is an inbound email API?',
			answer:
				'An inbound email API lets your application receive and process incoming email programmatically. Instead of polling an IMAP mailbox and parsing raw MIME, you point a domain or subdomain at the provider via MX records; when mail arrives, the provider parses it and delivers a structured JSON payload — sender, recipients, subject, plain-text and HTML bodies, headers, and attachments — to a webhook endpoint in your app. Lettr handles the receiving, parsing, and delivery so you only handle the data.'
		},
		{
			question: 'How do I route inbound email to my app?',
			answer:
				'Add an inbound route in the Lettr dashboard for a domain or subdomain (for example inbound.yourdomain.com), then add the MX records Lettr gives you to that domain’s DNS. Point your route at an HTTPS webhook endpoint in your app. From then on, any email sent to an address on that domain is parsed and POSTed to your endpoint as JSON. Using a subdomain keeps your root domain’s existing email provider untouched.'
		},
		{
			question: 'What is the difference between an inbound email API and an email webhook?',
			answer:
				'They work together. The inbound email API is the feature that receives and parses incoming mail; the email webhook is the HTTP POST that delivers the parsed result to your application in real time. In Lettr, configuring an inbound route means giving it a webhook URL — when an email arrives, Lettr parses it and fires the webhook so your app can act on it immediately, without polling a mailbox.'
		},
		{
			question: 'Does the inbound API parse attachments?',
			answer:
				'Yes. Attachments are extracted automatically and included in the payload with their filename, content type, and size, plus a secure URL you can use to download the file. Because those URLs are time-limited, download and store any attachments you need to keep as soon as you process the webhook.'
		},
		{
			question: 'How do I verify a webhook came from Lettr?',
			answer:
				'Inbound webhooks are protected with credentials you set when you create the route. Your endpoint checks the Authorization header on each request against the credentials you configured before processing the email, so only requests from Lettr are accepted. Respond with a 200 status quickly and dedupe on the message id to safely handle any repeated delivery.'
		},
		{
			question: 'Can I send and receive email on the same platform?',
			answer:
				'Yes. Lettr is a two-way platform: the same account that sends transactional email over the REST API and SMTP relay also receives inbound email through inbound routes. Sends and receives share one set of logs, one domain setup, and one bill — so a support flow that receives a question and sends a reply lives in a single place instead of two providers.'
		},
		{
			question: 'Is inbound email included in my plan?',
			answer:
				'Inbound routes are available on paid plans: the Pro plan includes 1 inbound route, Business includes 10, and Enterprise is unlimited. Each route can back a domain or subdomain and deliver to its own webhook endpoint. See the pricing page for the full breakdown.'
		}
	];

	const bothWays = {
		send: [
			'Fire transactional email via REST API or SMTP relay',
			'Webhooks for delivered, opened, clicked, and bounced',
			'SPF, DKIM, DMARC, and dedicated IPs built in',
			'Drag-and-drop templates your whole team can edit'
		],
		receive: [
			'Receive inbound email parsed into clean JSON',
			'Route by address, subdomain, or variable patterns',
			'Attachments, headers, and bodies extracted for you',
			'Credential-verified webhooks fired in real time'
		]
	};

	onMount(() => {
		registerHref = buildRegisterUrl(new URL(window.location.href), document.cookie);

		const cleanups: (() => void)[] = [];

		if (hero) {
			cleanups.push(
				createFromAnimationCleanup({
					scope: hero,
					targets: '[data-animate]',
					vars: { y: 30, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' }
				})
			);
		}

		for (const section of [
			definitionSection,
			useCasesSection,
			flowSection,
			payloadSection,
			setupSection,
			bothWaysSection,
			faqSection,
			finalCtaSection
		]) {
			if (section) {
				cleanups.push(
					createScrollRevealCleanup({
						scope: section,
						targets: '[data-reveal]'
					})
				);
			}
		}

		return () => cleanups.forEach((fn) => fn());
	});
</script>

<Seo
	title="Inbound Email API — Receive & Parse Email | Lettr"
	description="Receive and parse inbound email in your app via API and webhooks. Point your domain at Lettr and get every incoming message as clean JSON — sender, body, headers, and attachments — fired to your endpoint."
	ogDescription="Receive inbound email as parsed JSON via webhooks. Build email-to-ticket support, reply handling, and email-to-app workflows on the same platform you send from."
/>

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	})}<\/script>`}
</svelte:head>

<!-- Hero -->
<section bind:this={hero} class="pt-30 pb-16 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-1">
		<div class="flex flex-col">
			<div
				data-animate
				class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80"
			>
				<span class="block w-6 h-px bg-primary/60"></span>
				Inbound email API
			</div>
			<h1 data-animate class="text-surface mb-4">
				Receive and parse email<br />
				<span class="text-primary">right inside your app.</span>
			</h1>

			<p data-animate class="max-w-[650px] text-body text-muted mb-10">
				Point a domain at Lettr and every incoming message arrives as clean JSON — sender, subject,
				body, headers, and attachments — fired to your webhook in real time. No IMAP polling, no MIME
				parsing. Build support inboxes, reply handling, and email-to-app workflows on the same
				platform you send from.
			</p>

			<div data-animate class="flex flex-wrap items-center mb-3 gap-2">
				<Button
					variant="primary"
					href={registerHref}
					onclick={() => trackCta('inbound_api_hero', 'Get started free', registerHref, 'primary')}
				>Get started free</Button>
				<Button
					variant="secondary"
					href={INBOUND_DOCS_URL}
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => trackCta('inbound_api_hero', 'Read inbound docs', INBOUND_DOCS_URL, 'secondary')}
				>Read inbound docs</Button>
			</div>
			<p data-animate class="max-w-md text-sm text-muted">
				Send and receive on one platform. <a class="text-primary underline underline-offset-2" href="/email-api/">See the email API</a>.
			</p>
		</div>

		<div data-animate>
			<CodeSnippet
				tabs={handlerTabs}
				primaryTabIndices={[0, 1]}
				moreTabIndices={[2, 3]}
				filename={undefined}
			/>
		</div>
	</div>
</section>

<!-- What is an inbound email API -->
<section bind:this={definitionSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-start">
		<div data-reveal>
			<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
				<span class="block w-6 h-px bg-primary/60"></span>
				The basics
			</div>
			<h2 class="mb-4 text-surface">
				What is an<br /><span class="text-primary">inbound email API?</span>
			</h2>
			<p class="text-body text-muted mb-4 max-w-[52ch]">
				An <strong class="text-surface">inbound email API</strong> lets your application receive and
				process incoming email programmatically — without running a mail server or polling an IMAP
				mailbox.
			</p>
			<p class="text-body text-muted max-w-[52ch]">
				You point a domain or subdomain at the provider with MX records. When mail arrives, Lettr
				parses it and delivers a structured payload to your app over a <strong class="text-surface">webhook</strong>,
				so you work with clean JSON instead of raw MIME.
			</p>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="text-[11px] uppercase tracking-wider text-muted/70 mb-4">From mailbox to your code</div>
			<ol class="space-y-4">
				<li class="flex items-start gap-3">
					<span class="font-code text-xs text-primary mt-0.5">01</span>
					<span class="text-sm text-muted">Someone emails an address on <span class="text-surface font-medium">your inbound domain</span>.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="font-code text-xs text-primary mt-0.5">02</span>
					<span class="text-sm text-muted">Their mail server follows your <span class="text-surface font-medium">MX records</span> to Lettr.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="font-code text-xs text-primary mt-0.5">03</span>
					<span class="text-sm text-muted"><span class="text-surface font-medium">Lettr parses</span> the message into JSON — body, headers, attachments.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="font-code text-xs text-primary mt-0.5">04</span>
					<span class="text-sm text-muted">A <span class="text-surface font-medium">webhook</span> fires to your endpoint and your app takes over.</span>
				</li>
			</ol>
			<div class="mt-5 border-t border-border/30 pt-4">
				<p class="text-[13px] text-muted leading-relaxed">
					The inbound API does the receiving and parsing; the <strong class="text-surface">email webhook</strong>
					is how the parsed result reaches your code in real time.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- What you can build -->
<section bind:this={useCasesSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			What you can build
		</div>
		<h2 class="mb-3 text-surface">
			Email becomes an<br /><span class="text-primary">input to your product.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Once incoming mail is structured JSON, anything your code can do with an API request, it can do
			with an email.
		</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		{#each useCases as item}
			<div data-reveal class="flex items-start gap-5 border border-border/40 bg-white p-6">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
					<item.icon size={20} class="text-primary" />
				</div>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">{item.title}</h3>
					<p class="text-sm leading-relaxed text-muted">{item.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- How Lettr's inbound works -->
<section bind:this={flowSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			How it works
		</div>
		<h2 class="mb-3 text-surface">
			Three things to set up.<br /><span class="text-primary">Then it just flows.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Create a route, point your domain, and give Lettr an endpoint. Every email to that domain is
			parsed and delivered to your app from then on.
		</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-3">
		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
				<GlobeIcon size={20} class="text-primary" />
			</div>
			<div class="font-code text-xs text-primary mb-1">01</div>
			<h3 class="mb-1 text-base font-semibold text-surface">Add an inbound route</h3>
			<p class="text-sm leading-relaxed text-muted">
				Create a route for a domain or subdomain like <span class="font-code text-surface">inbound.yourdomain.com</span>
				and add the MX records Lettr shows you to its DNS.
			</p>
		</div>
		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
				<TrayIcon size={20} class="text-primary" />
			</div>
			<div class="font-code text-xs text-primary mb-1">02</div>
			<h3 class="mb-1 text-base font-semibold text-surface">Lettr parses the email</h3>
			<p class="text-sm leading-relaxed text-muted">
				Incoming mail is received, validated, and parsed into structured JSON — body, headers, and
				attachments separated out for you.
			</p>
		</div>
		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex h-10 w-10 items-center justify-center border border-border/50 bg-background">
				<LinkIcon size={20} class="text-primary" />
			</div>
			<div class="font-code text-xs text-primary mb-1">03</div>
			<h3 class="mb-1 text-base font-semibold text-surface">A webhook hits your app</h3>
			<p class="text-sm leading-relaxed text-muted">
				Lettr POSTs the parsed message to your HTTPS endpoint in real time. Verify the credentials,
				respond 200, and act on the data.
			</p>
		</div>
	</div>
</section>

<!-- Webhook payload example -->
<section bind:this={payloadSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-center">
		<div data-reveal>
			<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
				<span class="block w-6 h-px bg-primary/60"></span>
				Webhook payload
			</div>
			<h2 class="mb-4 text-surface">
				The shape of a<br /><span class="text-primary">parsed inbound email.</span>
			</h2>
			<p class="text-body text-muted mb-6 max-w-[52ch]">
				This is exactly what lands on your endpoint when an email arrives. No MIME, no encoding
				headaches — just the fields your code needs, ready to read.
			</p>
			<ul class="space-y-3">
				{#each ['from, to, and friendly sender name', 'subject with plain-text and HTML bodies', 'full headers for threading and routing', 'attachments with type, size, and download URL'] as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<span class="mt-2 block h-1.5 w-1.5 rounded-full bg-primary shrink-0"></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<LinkIcon size={16} class="text-primary" />
				<span class="font-code text-xs text-muted">POST your-app.com/webhooks/inbound</span>
			</div>
			<pre class="overflow-x-auto font-code text-[13px] leading-relaxed text-surface">{`{
  "event": "inbound",
  "timestamp": "2026-06-18T10:30:00Z",
  "data": {
    "from": "alex@customer.com",
    "to": ["support@inbound.yourdomain.com"],
    "subject": "Question about my order",
    "text": "Hi — is order #1043 shipped yet?",
    "html": "<p>Hi — is order #1043 shipped yet?</p>",
    "headers": {
      "message-id": "<abc123@customer.com>",
      "in-reply-to": "<ticket-42@yourdomain.com>"
    },
    "attachments": [
      {
        "filename": "receipt.pdf",
        "content_type": "application/pdf",
        "size": 18234,
        "url": "https://…/attachments/…"
      }
    ]
  }
}`}</pre>
		</div>
	</div>
</section>

<!-- Quick start -->
<section bind:this={setupSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Quick start
		</div>
		<h2 class="mb-3 text-surface">
			Receiving your first<br /><span class="text-primary">email in minutes.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Stand up an endpoint, point a route at it, and send a test email. The handler on the right is
			the whole integration.
		</p>
	</div>

	<div class="grid gap-12 lg:grid-cols-2 lg:items-start">
		<div data-reveal class="flex flex-col gap-6">
			<div class="flex items-start gap-4">
				<span class="flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background font-code text-sm text-primary">1</span>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">Expose a webhook endpoint</h3>
					<p class="text-sm leading-relaxed text-muted">Add an HTTPS route in your app that accepts a JSON POST — the handler on the right is all you need.</p>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<span class="flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background font-code text-sm text-primary">2</span>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">Create an inbound route</h3>
					<p class="text-sm leading-relaxed text-muted">In the dashboard, add a route for your domain, paste your endpoint URL, and add the MX records to your DNS.</p>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<span class="flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background font-code text-sm text-primary">3</span>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">Send a test email</h3>
					<p class="text-sm leading-relaxed text-muted">Email an address on your inbound domain and watch the parsed payload hit your endpoint within seconds.</p>
				</div>
			</div>

			<div class="mt-2 border border-border/40 bg-white p-5">
				<div class="text-[11px] uppercase tracking-wider text-muted/70 mb-3">What you get out of the box</div>
				<ul class="space-y-3">
					{#each setupProof as item}
						<li class="flex items-start gap-3 text-sm text-muted">
							<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
							<span>{item}</span>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<div data-reveal>
			<CodeSnippet
				tabs={handlerTabs}
				primaryTabIndices={[0, 1]}
				moreTabIndices={[2, 3]}
				shadow={false}
				filename={undefined}
			/>
		</div>
	</div>
</section>

<!-- Inbound + outbound in one -->
<section bind:this={bothWaysSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Send + receive
		</div>
		<h2 class="mb-3 text-surface">
			Two-way email.<br /><span class="text-primary">One platform.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Most providers only send. Lettr does both — so a flow that receives a question and sends a reply
			lives in one account, with one domain setup, one set of logs, and one bill.
		</p>
	</div>

	<div class="grid gap-5 lg:grid-cols-2">
		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<PaperPlaneTiltIcon size={18} class="text-primary" />
				<h3 class="text-base font-semibold text-surface">Outbound — send</h3>
			</div>
			<ul class="space-y-3">
				{#each bothWays.send as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<TrayIcon size={18} class="text-primary" />
				<h3 class="text-base font-semibold text-surface">Inbound — receive</h3>
			</div>
			<ul class="space-y-3">
				{#each bothWays.receive as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<p data-reveal class="mt-6 text-sm text-muted">
		Already sending with Lettr? Add receiving to the same setup — see the
		<a class="text-primary underline underline-offset-2" href="/email-api/">transactional email API</a> and
		<a class="text-primary underline underline-offset-2" href="/smtp-relay/">SMTP relay</a>.
	</p>
</section>

<TalkToExpert />
<Pricing />

<!-- FAQ -->
<section bind:this={faqSection} class="py-16 border-b border-border/30">
	<div class="mb-10" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			FAQ
		</div>
		<h2 class="mb-3 text-surface">Inbound email <span class="text-primary">questions</span></h2>
		<p class="text-body text-muted max-w-[55ch]">
			Everything developers ask before routing inbound mail through an API.
		</p>
	</div>

	<div class="space-y-0">
		{#each faqs as faq, i}
			<div data-reveal class="{i < faqs.length - 1 ? 'border-b border-border/20' : ''}">
				<button
					onclick={() => toggleFaq(i)}
					class="flex w-full items-center justify-between py-5 text-left"
				>
					<h3 class="text-sm font-medium text-surface">{faq.question}</h3>
					<CaretDownIcon
						size={14}
						class="shrink-0 ml-4 text-muted transition-transform duration-200 {openFaq === i ? 'rotate-180' : ''}"
					/>
				</button>
				{#if openFaq === i}
					<div transition:slide={{ duration: 200 }}>
						<p class="text-[13px] text-muted leading-relaxed max-w-[65ch] pb-5">{faq.answer}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>

<div class="py-16">
	<RelatedFeatures
		links={[
			{ href: '/email-api/', label: 'Transactional Email', description: 'Send via REST API and SMTP, billed per email.' },
			{ href: '/smtp-relay/', label: 'SMTP Relay', description: 'Drop-in SMTP for any app, framework, or server.' },
			{ href: '/platform/analytics/', label: 'Analytics & Logs', description: 'Delivery metrics, searchable logs, and webhooks.' }
		]}
	/>
</div>

<!-- Final CTA -->
<section bind:this={finalCtaSection} class="py-20">
	<div data-reveal class="flex flex-col items-center text-center">
		<h2 class="mb-3 text-surface">
			Start <span class="text-primary">receiving email</span> in your app.
		</h2>
		<p class="mb-8 max-w-[46ch] text-body text-muted">
			Add an inbound route, point your domain, and get parsed email on your webhook — on the same
			platform you already send from.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2">
			<Button
				variant="primary"
				href={registerHref}
				onclick={() => trackCta('inbound_api_footer', 'Get started free', registerHref, 'primary')}
			>Get started free</Button>
			<Button
				variant="secondary"
				href={INBOUND_DOCS_URL}
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => trackCta('inbound_api_footer', 'Read inbound docs', INBOUND_DOCS_URL, 'secondary')}
			>Read inbound docs</Button>
		</div>
	</div>
</section>
