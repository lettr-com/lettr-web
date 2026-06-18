<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import Seo from '$lib/components/Seo.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeSnippet from '$lib/components/CodeSnippet.svelte';
	import TalkToExpert from '$lib/components/TalkToExpert.svelte';
	import Pricing from '$lib/components/Pricing.svelte';
	import ArrowsClockwiseIcon from 'phosphor-svelte/lib/ArrowsClockwiseIcon';
	import ShieldCheckIcon from 'phosphor-svelte/lib/ShieldCheckIcon';
	import LockKeyIcon from 'phosphor-svelte/lib/LockKeyIcon';
	import LightningIcon from 'phosphor-svelte/lib/LightningIcon';
	import ChartLineUpIcon from 'phosphor-svelte/lib/ChartLineUpIcon';
	import MagnifyingGlassIcon from 'phosphor-svelte/lib/MagnifyingGlassIcon';
	import TrendUpIcon from 'phosphor-svelte/lib/TrendUpIcon';
	import HardDrivesIcon from 'phosphor-svelte/lib/HardDrivesIcon';
	import TerminalWindowIcon from 'phosphor-svelte/lib/TerminalWindowIcon';
	import StackIcon from 'phosphor-svelte/lib/StackIcon';
	import CheckIcon from 'phosphor-svelte/lib/CheckIcon';
	import CaretDownIcon from 'phosphor-svelte/lib/CaretDownIcon';
	import { createFromAnimationCleanup, createScrollRevealCleanup } from '$lib/utils/gsap';
	import { buildRegisterUrl, registerUrl } from '$lib/utils/utm';
	import { capturePosthogEvent, trackSignupClick } from '$lib/analytics/posthog';
	import type { CodeTab } from '$lib/utils/shiki';

	const SMTP_DOCS_URL = 'https://docs.lettr.com/quickstart/smtp/introduction';

	let hero: HTMLElement | undefined = $state();
	let definitionSection: HTMLElement | undefined = $state();
	let whenSection: HTMLElement | undefined = $state();
	let featuresSection: HTMLElement | undefined = $state();
	let setupSection: HTMLElement | undefined = $state();
	let compareSection: HTMLElement | undefined = $state();
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

	// Real, copy-paste SMTP relay configuration. Username is always the literal
	// word "lettr"; the password is a Lettr API key (starts with "lttr_"). Host
	// and ports are the live relay endpoints — 465 implicit TLS (recommended),
	// 587 STARTTLS, with 2465 / 2587 as firewall-friendly alternates.
	const smtpTabs: CodeTab[] = [
		{
			label: 'SMTP settings',
			lang: 'bash',
			code: `# Point any app, server, or framework at Lettr
SMTP_HOST=smtp.lettr.com
SMTP_PORT=465            # implicit TLS (587 STARTTLS; 2465/2587 alt)
SMTP_USERNAME=lettr      # always the literal word "lettr"
SMTP_PASSWORD=lttr_your_api_key_here       # your Lettr API key
SMTP_SECURE=true`
		},
		{
			label: 'Node.js',
			lang: 'javascript',
			code: `import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  host: 'smtp.lettr.com',
  port: 465,
  secure: true,
  auth: { user: 'lettr', pass: process.env.LETTR_API_KEY }
});

await transport.sendMail({
  from: 'you@yourdomain.com',
  to: 'user@example.com',
  subject: 'Your login code',
  text: 'Your code is 123456'
});`
		},
		{
			label: 'PHP',
			lang: 'php',
			code: `$mail = new PHPMailer(true);

$mail->isSMTP();
$mail->Host       = 'smtp.lettr.com';
$mail->Port       = 465;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->SMTPAuth   = true;
$mail->Username   = 'lettr';
$mail->Password   = getenv('LETTR_API_KEY');

$mail->setFrom('you@yourdomain.com');
$mail->addAddress('user@example.com');
$mail->Subject = 'Your login code';
$mail->Body    = 'Your code is 123456';
$mail->send();`
		},
		{
			label: 'Ruby',
			lang: 'ruby',
			code: `require 'mail'

Mail.defaults do
  delivery_method :smtp,
    address:   'smtp.lettr.com',
    port:      465,
    user_name: 'lettr',
    password:  ENV['LETTR_API_KEY'],
    tls:       true
end

Mail.deliver do
  from    'you@yourdomain.com'
  to      'user@example.com'
  subject 'Your login code'
  body    'Your code is 123456'
end`
		},
		{
			label: 'Go',
			lang: 'go',
			code: `package main

import (
    "net/smtp"
    "os"
)

func main() {
    auth := smtp.PlainAuth("", "lettr",
        os.Getenv("LETTR_API_KEY"), "smtp.lettr.com")

    msg := []byte("To: user@example.com\\r\\n" +
        "Subject: Your login code\\r\\n\\r\\n" +
        "Your code is 123456\\r\\n")

    smtp.SendMail("smtp.lettr.com:587", auth,
        "you@yourdomain.com",
        []string{"user@example.com"}, msg)
}`
		}
	];

	const features = [
		{
			icon: ArrowsClockwiseIcon,
			title: 'Drop-in SMTP compatibility',
			description:
				'A fully standards-compliant relay. Point your existing host, port, and credentials at Lettr and send — no code changes, no rewrites, no new SDK to learn.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Deliverability built in',
			description:
				'SPF, DKIM, DMARC, and custom return-paths are first-class. A guided DNS wizard authenticates your domain in minutes so your mail lands in the inbox, not spam.'
		},
		{
			icon: LockKeyIcon,
			title: 'Encrypted on every port',
			description:
				'Implicit TLS on 465 and 2465, STARTTLS on 587 and 2587 — alternate ports for hosts behind restrictive firewalls. API-key authentication, so you can revoke a key anytime without touching a password.'
		},
		{
			icon: LightningIcon,
			title: 'Built to scale',
			description:
				'From the first transactional email to millions a month. Automatic queueing and retries absorb spikes, and dedicated IPs are available when you need to own your reputation.'
		},
		{
			icon: ChartLineUpIcon,
			title: 'Analytics on every send',
			description:
				'Opens, clicks, bounces, and complaints — the visibility a raw SMTP server never gives you. Watch delivery in real time and react to issues before they spread.'
		},
		{
			icon: MagnifyingGlassIcon,
			title: 'Searchable logs',
			description:
				'Full-text search across every message the relay has handled. Filter by recipient, status, or subject and find exactly why one email bounced — in seconds.'
		}
	];

	const whenYouNeedIt = [
		{
			icon: TrendUpIcon,
			title: 'High-volume sending',
			description:
				'Your own mail server chokes past a few thousand messages a day. A relay handles queueing, throttling, and retries so volume never becomes an outage.'
		},
		{
			icon: ShieldCheckIcon,
			title: 'Inbox placement matters',
			description:
				'Reset links, receipts, and alerts have to arrive. A relay brings authentication, reputation monitoring, and feedback loops that a self-hosted server lacks.'
		},
		{
			icon: HardDrivesIcon,
			title: 'Getting off shared IPs',
			description:
				"A neighbor's spam shouldn't tank your delivery. Move to a relay with managed pools — and a dedicated IP when you're ready to own your reputation outright."
		},
		{
			icon: TerminalWindowIcon,
			title: 'Apps & servers that only speak SMTP',
			description:
				'WordPress, legacy CRMs, ERPs, monitoring tools, and appliances expose only an SMTP screen. A relay is the only way to give them modern deliverability.'
		},
		{
			icon: StackIcon,
			title: 'One provider for a mixed stack',
			description:
				'A WordPress site on SMTP next to a Node service on the API — both routed through Lettr keep analytics, suppression lists, and reputation unified.'
		},
		{
			icon: LightningIcon,
			title: 'Serverless & container sending',
			description:
				"When holding an SMTP connection open is awkward, the relay's short-lived auth and our REST API give you a reliable path either way."
		}
	];

	// Snippet-bait FAQ: plain answers that also fold in "gateway" and "best
	// SMTP relay" terminology for search coverage.
	const faqs = [
		{
			question: 'What is an SMTP relay?',
			answer:
				'An SMTP relay is a mail server that accepts email from your application or device over the SMTP protocol and forwards it to recipients on your behalf. Instead of running and maintaining your own mail server, you point your app at the relay (a host, port, username, and password) and it handles delivery, authentication, queueing, retries, and reputation management.'
		},
		{
			question: 'What is the difference between an SMTP relay and an SMTP gateway?',
			answer:
				'The terms are often used interchangeably. An SMTP gateway typically describes a server that routes mail between networks or systems, while an SMTP relay specifically forwards outbound email from your application to external recipients. Lettr acts as an outbound SMTP relay (also called a smart host): your app authenticates and submits a message, and Lettr delivers it with full authentication and deliverability handling.'
		},
		{
			question: 'How do I connect to the Lettr SMTP relay?',
			answer:
				'Use host smtp.lettr.com with port 465 (implicit TLS, recommended) or 587 (STARTTLS); 2465 and 2587 are alternate ports if a firewall blocks the standard ones. Set the username to the literal word "lettr" (lowercase) and the password to your Lettr API key, which starts with "lttr_". Most apps and frameworks accept these four values directly in their email settings — no code changes required.'
		},
		{
			question: 'What makes the best SMTP relay service?',
			answer:
				'The best SMTP relay combines reliable deliverability (SPF, DKIM, DMARC, and reputation monitoring), strong security (encrypted ports and revocable API-key auth), the ability to scale with retries and dedicated IPs, and real visibility through analytics and searchable logs. Lettr provides all of these, plus a REST API so you can use the same provider for both SMTP and API sending.'
		},
		{
			question: 'Is there a free SMTP relay tier?',
			answer:
				'Yes. Lettr includes a free plan with 3,000 emails per month and no credit card required, so you can test the relay in production before upgrading. Paid plans scale up volume, sending domains, and add dedicated IPs.'
		},
		{
			question: 'Can I use the SMTP relay with WordPress or other apps?',
			answer:
				'Yes. Any tool with an SMTP configuration screen works — WordPress (via a plugin like WP Mail SMTP), Supabase Auth, legacy CRMs, ERPs, monitoring systems, and network appliances. Enter the Lettr host, port, username (lettr), and your API key as the password, and the tool sends through Lettr without any code changes.'
		},
		{
			question: 'When should I use the SMTP relay instead of the REST API?',
			answer:
				"Use the SMTP relay when you can't change the sending code — off-the-shelf software, plugins, or appliances that only expose SMTP settings — or when migrating an existing SMTP integration with minimal risk. Use the REST API for new application code, where you get unambiguous responses, idempotency keys, and richer error handling. With Lettr you can mix both and keep one unified set of logs and analytics."
		}
	];

	const comparison = {
		smtp: [
			'Existing apps, plugins, or appliances you can’t modify',
			'Drop-in migration from another SMTP provider',
			'Tools that only expose host / port / user / pass',
			'WordPress, CRMs, ERPs, and monitoring systems'
		],
		api: [
			'New application code you control',
			'Unambiguous responses with a message ID',
			'Idempotency keys to prevent duplicate sends',
			'Webhooks, templates, and richer error handling'
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
			whenSection,
			featuresSection,
			setupSection,
			compareSection,
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
	title="SMTP Relay Service — Lettr"
	description="Lettr's SMTP relay is a drop-in replacement for your mail server or SMTP provider. Point your app at smtp.lettr.com for better deliverability, encrypted ports, analytics, and a free tier."
	ogDescription="A standards-compliant SMTP relay with built-in deliverability, encrypted ports, analytics, and searchable logs. Drop-in setup, free tier, no code changes."
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
				SMTP relay
			</div>
			<h1 data-animate class="text-surface mb-4">
				The SMTP relay<br />
				<span class="text-primary">your app can rely on.</span>
			</h1>

			<p data-animate class="max-w-[650px] text-body text-muted mb-10">
				A drop-in replacement for your mail server or SMTP provider. Point any app, framework, or
				server at <span class="font-code text-surface">smtp.lettr.com</span> and get better
				deliverability, encrypted ports, real-time analytics, and searchable logs — without changing
				a line of code.
			</p>

			<div data-animate class="flex flex-wrap items-center mb-3 gap-2">
				<Button
					variant="primary"
					href={registerHref}
					onclick={() => trackCta('smtp_relay_hero', 'Get SMTP credentials', registerHref, 'primary')}
				>Get SMTP credentials</Button>
				<Button
					variant="secondary"
					href={SMTP_DOCS_URL}
					target="_blank"
					rel="noopener noreferrer"
					onclick={() => trackCta('smtp_relay_hero', 'See SMTP docs', SMTP_DOCS_URL, 'secondary')}
				>See SMTP docs</Button>
			</div>
			<p data-animate class="max-w-md text-sm text-muted">
				3,000 emails/month free. No credit card required.
			</p>
		</div>

		<div data-animate>
			<CodeSnippet
				tabs={smtpTabs}
				primaryTabIndices={[0, 1]}
				moreTabIndices={[2, 3, 4]}
				filename={undefined}
			/>
		</div>
	</div>
</section>

<!-- What is an SMTP relay -->
<section bind:this={definitionSection} class="py-20 border-b border-border/30">
	<div class="grid gap-12 lg:grid-cols-2 lg:items-start">
		<div data-reveal>
			<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
				<span class="block w-6 h-px bg-primary/60"></span>
				The basics
			</div>
			<h2 class="mb-4 text-surface">
				What is an<br /><span class="text-primary">SMTP relay?</span>
			</h2>
			<p class="text-body text-muted mb-4 max-w-[52ch]">
				An <strong class="text-surface">SMTP relay</strong> is a mail server that accepts email from
				your application over the SMTP protocol and forwards it to recipients on your behalf.
			</p>
			<p class="text-body text-muted max-w-[52ch]">
				Instead of running your own mail server, you point your app at the relay — a host, port,
				username, and password — and it handles delivery, authentication, queueing, retries, and
				reputation so your mail reaches the inbox.
			</p>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="text-[11px] uppercase tracking-wider text-muted/70 mb-4">How the hops work</div>
			<ol class="space-y-4">
				<li class="flex items-start gap-3">
					<span class="font-code text-xs text-primary mt-0.5">01</span>
					<span class="text-sm text-muted"><span class="text-surface font-medium">Your app</span> submits a message to the relay over an authenticated SMTP connection.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="font-code text-xs text-primary mt-0.5">02</span>
					<span class="text-sm text-muted"><span class="text-surface font-medium">Lettr</span> signs it (SPF, DKIM, DMARC), queues it, and manages sending reputation.</span>
				</li>
				<li class="flex items-start gap-3">
					<span class="font-code text-xs text-primary mt-0.5">03</span>
					<span class="text-sm text-muted">The <span class="text-surface font-medium">recipient's mail server</span> accepts it — and every event flows back as analytics.</span>
				</li>
			</ol>
			<div class="mt-5 border-t border-border/30 pt-4">
				<p class="text-[13px] text-muted leading-relaxed">
					A relay (or <em>smart host</em>) is sometimes called an <strong class="text-surface">SMTP gateway</strong>.
					The job is the same: take outbound mail and deliver it reliably.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- When you need one -->
<section bind:this={whenSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			When you need one
		</div>
		<h2 class="mb-3 text-surface">
			Signs you've outgrown<br /><span class="text-primary">your own mail server.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			If any of these sound familiar, a managed relay will save you hours of deliverability work — and
			a lot of mail in spam folders.
		</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		{#each whenYouNeedIt as item}
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

<!-- How Lettr's SMTP relay works -->
<section bind:this={featuresSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			How it works
		</div>
		<h2 class="mb-3 text-surface">
			Everything a raw mail server isn't.<br /><span class="text-primary">In one relay.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			The same SMTP protocol your code already speaks, backed by the deliverability, security, and
			visibility a self-hosted server can't give you.
		</p>
	</div>

	<div class="grid gap-5 sm:grid-cols-2">
		{#each features as feature}
			<div data-reveal class="flex items-start gap-5 border border-border/40 bg-white p-6">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border/50 bg-background">
					<feature.icon size={20} class="text-primary" />
				</div>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">{feature.title}</h3>
					<p class="text-sm leading-relaxed text-muted">{feature.description}</p>
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Setup — quick start -->
<section bind:this={setupSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			Quick start
		</div>
		<h2 class="mb-3 text-surface">
			Sending in<br /><span class="text-primary">under five minutes.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Three steps. Copy the credentials below into your app or your provider's SMTP settings and send
			your first email.
		</p>
	</div>

	<div class="grid gap-12 lg:grid-cols-2 lg:items-start">
		<div data-reveal class="flex flex-col gap-6">
			<div class="flex items-start gap-4">
				<span class="flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background font-code text-sm text-primary">1</span>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">Create a free account</h3>
					<p class="text-sm leading-relaxed text-muted">Sign up and generate an API key from the dashboard — it doubles as your SMTP password.</p>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<span class="flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background font-code text-sm text-primary">2</span>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">Authenticate your domain</h3>
					<p class="text-sm leading-relaxed text-muted">The guided DNS wizard walks you through SPF, DKIM, and DMARC in a few minutes — no CNAME guesswork.</p>
				</div>
			</div>
			<div class="flex items-start gap-4">
				<span class="flex h-8 w-8 shrink-0 items-center justify-center border border-border/50 bg-background font-code text-sm text-primary">3</span>
				<div>
					<h3 class="mb-1 text-base font-semibold text-surface">Point your app at the relay</h3>
					<p class="text-sm leading-relaxed text-muted">Drop in the settings on the right. Any language, framework, or app with an SMTP screen works unchanged.</p>
				</div>
			</div>

			<div class="mt-2 border border-border/40 bg-white p-5">
				<div class="text-[11px] uppercase tracking-wider text-muted/70 mb-3">Connection settings</div>
				<dl class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 font-code text-[13px]">
					<dt class="text-muted">Host</dt>
					<dd class="text-surface">smtp.lettr.com</dd>
					<dt class="text-muted">Ports</dt>
					<dd class="text-surface">465 / 2465 (TLS) · 587 / 2587 (STARTTLS)</dd>
					<dt class="text-muted">Username</dt>
					<dd class="text-surface">lettr</dd>
					<dt class="text-muted">Password</dt>
					<dd class="text-surface">your API key (lttr_…)</dd>
				</dl>
			</div>
		</div>

		<div data-reveal>
			<CodeSnippet
				tabs={smtpTabs}
				primaryTabIndices={[0, 1]}
				moreTabIndices={[2, 3, 4]}
				shadow={false}
				filename={undefined}
			/>
		</div>
	</div>
</section>

<!-- SMTP relay vs API -->
<section bind:this={compareSection} class="py-20 border-b border-border/30">
	<div class="mb-12" data-reveal>
		<div class="mb-4 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] uppercase text-primary/80">
			<span class="block w-6 h-px bg-primary/60"></span>
			SMTP relay vs. API
		</div>
		<h2 class="mb-3 text-surface">
			Two ways to send.<br /><span class="text-primary">One provider.</span>
		</h2>
		<p class="text-body text-muted max-w-[55ch]">
			Lettr speaks both SMTP and a REST API, so you never have to pick a provider by transport. Use
			whichever fits each part of your stack — the logs, analytics, and suppression list stay unified.
		</p>
	</div>

	<div class="grid gap-5 lg:grid-cols-2">
		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<ArrowsClockwiseIcon size={18} class="text-primary" />
				<h3 class="text-base font-semibold text-surface">Use the SMTP relay when…</h3>
			</div>
			<ul class="space-y-3">
				{#each comparison.smtp as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>

		<div data-reveal class="border border-border/40 bg-white p-6">
			<div class="mb-4 flex items-center gap-2">
				<TerminalWindowIcon size={18} class="text-primary" />
				<h3 class="text-base font-semibold text-surface">Use the REST API when…</h3>
			</div>
			<ul class="space-y-3">
				{#each comparison.api as item}
					<li class="flex items-start gap-3 text-sm text-muted">
						<CheckIcon size={16} class="mt-0.5 shrink-0 text-primary" />
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<p data-reveal class="mt-6 text-sm text-muted">
		Need the full breakdown? Read
		<a class="text-primary underline underline-offset-2" href="/blog/smtp-vs-rest-api-how-to-choose/">SMTP vs. REST API: how to choose</a>.
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
		<h2 class="mb-3 text-surface">SMTP relay <span class="text-primary">questions</span></h2>
		<p class="text-body text-muted max-w-[55ch]">
			Everything developers ask before pointing their app at a relay.
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

<!-- Final CTA -->
<section bind:this={finalCtaSection} class="py-20">
	<div data-reveal class="flex flex-col items-center text-center">
		<h2 class="mb-3 text-surface">
			Point your app at <span class="text-primary">smtp.lettr.com.</span>
		</h2>
		<p class="mb-8 max-w-[46ch] text-body text-muted">
			Get SMTP credentials in minutes and send your first 3,000 emails a month free — no credit card,
			no code changes.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-2">
			<Button
				variant="primary"
				href={registerHref}
				onclick={() => trackCta('smtp_relay_footer', 'Get SMTP credentials', registerHref, 'primary')}
			>Get SMTP credentials</Button>
			<Button
				variant="secondary"
				href={SMTP_DOCS_URL}
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => trackCta('smtp_relay_footer', 'See SMTP docs', SMTP_DOCS_URL, 'secondary')}
			>See SMTP docs</Button>
		</div>
	</div>
</section>
