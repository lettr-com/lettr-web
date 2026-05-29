<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		Callout,
		Code,
		Divider
	} from '$lib/components/blog';

	const spfRecord = `v=spf1 include:spf.lettr.com include:_spf.google.com ~all`;

	const spfDig = `dig TXT yourapp.com +short`;

	const dkimSignature = `DKIM-Signature: v=1; a=rsa-sha256; d=yourapp.com; s=lettr;
h=from:to:subject:date:message-id;
bh=2jUSOH9NhtVGCQWNr9BrIAPreKQjO6Sn7XIkfJVOzv8=;
b=AuUoFEfDxTDkHlLXSZEpZj79LICEps6eda7W3deTVFOk2...`;

	const dkimDig = `dig TXT lettr._domainkey.yourapp.com +short`;

	const dkimPublicKey = `"v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4..."`;

	const dmarcRecord = `v=DMARC1; p=none; rua=mailto:dmarc-reports@yourapp.com; pct=100`;

	const dmarcDig = `dig TXT _dmarc.yourapp.com +short`;

	const dmarcSubdomain = `v=DMARC1; p=reject; sp=reject; rua=mailto:dmarc-reports@yourapp.com`;

	const dmarcNone = `v=DMARC1; p=none; rua=mailto:dmarc-reports@yourapp.com`;

	const dmarcReportXml = `<record>
<row>
<source_ip>198.51.100.42</source_ip>
<count>1523</count>
<policy_evaluated>
<disposition>none</disposition>
<dkim>pass</dkim>
<spf>fail</spf>
</policy_evaluated>
</row>
<identifiers>
<header_from>yourapp.com</header_from>
</identifiers>
</record>`;

	const dmarcQuarantine = `v=DMARC1; p=quarantine; pct=25; rua=mailto:dmarc-reports@yourapp.com`;

	const dmarcReject = `v=DMARC1; p=reject; rua=mailto:dmarc-reports@yourapp.com`;

	const verifyDig = `# Check SPF
dig TXT yourapp.com +short | grep spf

# Check DKIM (replace 'lettr' with your selector)
dig TXT lettr._domainkey.yourapp.com +short

# Check DMARC
dig TXT _dmarc.yourapp.com +short`;

	const authResults = `Authentication-Results: mx.google.com;
dkim=pass header.d=yourapp.com header.s=lettr;
spf=pass (google.com: domain of bounce+abc123@mail.yourapp.com
designates 192.0.2.1 as permitted sender)
smtp.mailfrom=bounce+abc123@mail.yourapp.com;
dmarc=pass (p=REJECT dis=NONE) header.from=yourapp.com`;
</script>

<BlogPost
	category="Deliverability"
	title="SPF, DKIM, and DMARC explained for developers"
	excerpt="Open a terminal and you can send mail claiming to be from support@stripe.com — SMTP won't stop you. Three DNS-based standards close that gap. Here's what each one does and how to tell if it's working."
	author={{ name: 'Erik Vlčák', role: 'Customer Success', avatar: '/images/authors/erik.jpg' }}
	date="March 4, 2026"
	datetime="2026-03-04"
	readTime="10 min read"
	slug="spf-dkim-dmarc-explained-for-developers"
>
	<Lead>
		Open a terminal, and you can send an email claiming to be from <code>support@stripe.com</code>.
		SMTP won't stop you. The protocol was designed in the early 1980s with no built-in way to verify
		the sender, and that gap is still there.
	</Lead>

	<Paragraph>
		Three standards have been retrofitted on top to close it: SPF, DKIM, and DMARC. Together, they
		decide whether mail claiming to be from your domain actually deserves to land in someone's inbox.
		Most guides on this topic are written for IT or network admins. This one is for developers who
		just want to know what these DNS records do, how they fit together, and how to tell whether
		they're working.
	</Paragraph>

	<Heading level={2}>The 30-second mental model</Heading>

	<Paragraph>Before the details, the shape of the system is as follows:</Paragraph>

	<List>
		<li>
			<strong>SPF</strong> is an IP allowlist. A DNS record that lists which servers are allowed to send
			mail for your domain.
		</li>
		<li>
			<strong>DKIM</strong> is a cryptographic signature. Your provider signs each outgoing message with
			a private key, and receivers verify it using a public key in your DNS.
		</li>
		<li>
			<strong>DMARC</strong> is the policy layer. It tells receivers what to do when SPF and DKIM fail
			and where to send reports about it.
		</li>
	</List>

	<Paragraph>
		SPF and DKIM each answer "Is this message legitimate?" in different ways. DMARC sits on top, ties
		them to the <code>From</code> header users actually see, and provides a feedback loop. The rest of
		this article explains what each part means in practice.
	</Paragraph>

	<Heading level={2}>SPF: declaring who can send for you</Heading>

	<Paragraph>
		Sender Policy Framework is the simplest of the three: a DNS TXT record that lists which IP
		addresses are allowed to send email on behalf of your domain.
	</Paragraph>

	<Paragraph>
		Think of it as a guest list. When a receiving server receives a message claiming to be from
		<code>yourapp.com</code>, it looks up that domain's SPF record and checks whether the sending IP
		is on the list. If not, the message fails SPF.
	</Paragraph>

	<Paragraph>A typical SPF record looks like this:</Paragraph>

	<Code lang="text" code={spfRecord} />

	<Paragraph>Breaking it down:</Paragraph>

	<List>
		<li><code>v=spf1</code>: version identifier, always <code>spf1</code></li>
		<li><code>include:spf.lettr.com</code>: authorize all IPs in Lettr's SPF record</li>
		<li>
			<code>include:_spf.google.com</code>: also authorize Google Workspace IPs (if you use Gmail for
			corporate mail)
		</li>
		<li><code>~all</code>: soft-fail anything else (see below)</li>
	</List>

	<Paragraph>
		The <code>all</code> mechanism is the catch-all verdict for IPs that didn't match earlier rules.
		<code>-all</code> hard-fails (rejects), <code>~all</code> soft-fails (accepts but marks suspicious),
		and <code>?all</code> is neutral. Most setups use <code>~all</code>. A hard fail will bounce legitimate
		mail on the day you forget to include a service, and that day always comes.
	</Paragraph>

	<Paragraph>Check your record with <code>dig</code>:</Paragraph>

	<Code lang="bash" code={spfDig} />

	<Paragraph>
		Look for the entry that starts with <code>v=spf1</code>. If you see two, that's already a bug. The
		spec allows exactly one, as multiple records produce undefined behavior because receivers may evaluate
		either.
	</Paragraph>

	<Heading level={3}>SPF's limitations</Heading>

	<Paragraph>
		SPF checks the envelope sender (the <code>MAIL FROM</code> in the SMTP conversation), not the
		<code>From</code> header that users actually see. Those can be completely different addresses. A phishing
		email can fail SPF on its real sending domain but still display any <code>From</code> address it wants
		in the header. Users only see the header, which alone is why SPF can't be the whole story.
	</Paragraph>

	<Paragraph>
		SPF also fails when forwarding is involved. If <code>old@company.com</code> forwards to
		<code>personal@gmail.com</code>, the forwarder's IP isn't included in your SPF record, so the message
		fails even though it's legitimate. Mailing lists and corporate forwards do this constantly.
	</Paragraph>

	<Paragraph>
		Then there's the 10-DNS-lookup limit. Every <code>include</code>, <code>a</code>, <code>mx</code>,
		and <code>redirect</code> mechanism counts. Nested includes count as well: if
		<code>include:spf.lettr.com</code> includes two other domains, that's three lookups before you've
		added anything else. If the lookup count exceeds 10, the whole evaluation returns
		<code>permerror</code>, which most receivers treat as a failure. Trace your lookup count with online
		tools or recursively with <code>dig</code>. Trim unused services aggressively.
	</Paragraph>

	<Callout variant="warning" title="Mind the 10-lookup limit">
		Every <code>include</code>, <code>a</code>, <code>mx</code>, and <code>redirect</code> mechanism
		counts toward SPF's hard cap of 10 DNS lookups — and nested includes count too. Exceed it and the
		whole record returns <code>permerror</code>, which most receivers treat as a failure.
	</Callout>

	<Heading level={2}>DKIM: signing each message cryptographically</Heading>

	<Paragraph>
		DomainKeys Identified Mail takes a different approach. Instead of checking server IPs, it signs
		each outgoing message with a private key. The public key is published in DNS so any receiving
		server can verify the signature.
	</Paragraph>

	<Paragraph>
		When your provider sends a message, it computes a hash of selected headers and the body, then
		signs the hash with the private key. The signature is included in a <code>DKIM-Signature</code> header
		on the message:
	</Paragraph>

	<Code lang="text" code={dkimSignature} />

	<Paragraph>The fields that matter:</Paragraph>

	<List>
		<li><code>d=yourapp.com</code>: the domain that claims responsibility</li>
		<li><code>s=lettr</code>: the selector indicating where receivers can locate the public key</li>
		<li><code>h=from:to:subject:date:message-id</code>: the headers included in the signature</li>
		<li><code>bh=...</code>: the hash of the message body</li>
		<li><code>b=...</code>: the actual signature</li>
	</List>

	<Paragraph>
		To verify, the receiver looks up the public key at
		<code>&lt;selector&gt;._domainkey.&lt;domain&gt;</code> (in this case,
		<code>lettr._domainkey.yourapp.com</code>), recalculates the hash, and compares it. If anything was
		tampered with along the way, even a single character in the subject or body, the signature won't match.
		You can fetch the public key yourself:
	</Paragraph>

	<Code lang="bash" code={dkimDig} />

	<Paragraph>You'll see something like:</Paragraph>

	<Code lang="text" code={dkimPublicKey} />

	<Paragraph>
		The selector exists specifically to enable key rotation. Providers publish a new key under a new
		selector (<code>lettr2._domainkey...</code>), start signing with it, and retire the old key once mail
		in flight has cleared.
	</Paragraph>

	<Heading level={3}>Why DKIM matters more than SPF</Heading>

	<Paragraph>
		DKIM survives forwarding. The signature is attached to the message itself, so it doesn't matter
		how many hops it takes. As long as no relay rewrites the signed headers or body, the signature
		still verifies. That's its main advantage over SPF.
	</Paragraph>

	<Paragraph>
		DKIM also signs the visible <code>From</code> header, not just the envelope sender. It directly protects
		the address users actually see, making convincing spoofing much harder.
	</Paragraph>

	<Paragraph>
		The trade-off is that you don't manage any of this yourself. Your provider generates the keys,
		signs outgoing messages, and provides you with the DNS records to publish. When you
		<a href="https://docs.lettr.com/learn/domains/sending-domains">add a sending domain in Lettr</a>,
		DKIM records are generated automatically. You copy them to your DNS, and you're done.
	</Paragraph>

	<Heading level={2}>DMARC: policy and reporting</Heading>

	<Paragraph>
		Domain-based Message Authentication, Reporting, and Conformance (DMARC) ties SPF and DKIM
		together. Without it, a message can fail both checks and still land in the inbox, as each
		receiver decides for itself. DMARC lets the domain owner publish a policy that answers: "If
		something claiming to be from my domain fails authentication, what should you do with it?" It also
		provides a feedback channel so you can see what's actually happening.
	</Paragraph>

	<Paragraph>
		A DMARC record is a DNS TXT record at <code>_dmarc.yourapp.com</code>:
	</Paragraph>

	<Code lang="text" code={dmarcRecord} />

	<Paragraph>The fields:</Paragraph>

	<List>
		<li><code>v=DMARC1</code>: version</li>
		<li><code>p=none</code>: policy (what to do with failing messages)</li>
		<li>
			<code>rua=mailto:dmarc-reports@yourapp.com</code>: where to send aggregate reports
		</li>
		<li><code>pct=100</code>: percentage of failing messages the policy applies to</li>
	</List>

	<Paragraph>Check it with:</Paragraph>

	<Code lang="bash" code={dmarcDig} />

	<Heading level={3}>DMARC alignment</Heading>

	<Paragraph>
		This is the concept that makes the whole system work. A message passes DMARC if it passes either
		SPF or DKIM, <strong>and</strong> the domain that passes aligns with the <code>From</code> header domain
		users see.
	</Paragraph>

	<Paragraph>Two flavors of alignment:</Paragraph>

	<List>
		<li>
			<strong>SPF alignment</strong>: the envelope sender domain matches the <code>From</code> header domain
			or is a subdomain of it.
		</li>
		<li>
			<strong>DKIM alignment</strong>: the <code>d=</code> domain in the DKIM signature matches the
			<code>From</code> header domain.
		</li>
	</List>

	<Paragraph>
		This is what closes the gap that SPF left wide open. Earlier, we noted that SPF only checks the
		envelope, not the <code>From</code> header, so an attacker could pass SPF checks on their own domain
		and still display your domain in the <code>From</code> header. DMARC alignment causes that to fail.
		Passing SPF or DKIM for the wrong domain no longer counts. The authenticated domain must match what
		the user sees.
	</Paragraph>

	<Heading level={3}>Don't forget subdomains</Heading>

	<Paragraph>
		A DMARC record for <code>yourapp.com</code> covers the apex by default, and subdomains inherit unless
		you specify otherwise. The <code>sp=</code> tag lets you set a separate policy for subdomains:
	</Paragraph>

	<Code lang="text" code={dmarcSubdomain} />

	<Paragraph>
		Without <code>sp=</code>, subdomains fall back to whatever <code>p=</code> specifies. That's usually
		fine, but attackers love spoofing subdomains like <code>mail.yourapp.com</code> or
		<code>support.yourapp.com</code> because organizations often forget to authenticate them. If you have
		legitimate subdomains that send mail (e.g., <code>notifications.yourapp.com</code>), they need their
		own SPF and DKIM setup. Otherwise, <code>sp=reject</code> will block them.
	</Paragraph>

	<Heading level={3}>The three stages of deployment</Heading>

	<Paragraph>
		DMARC deployment should be gradual. We have seen teams jump straight to <code>p=reject</code> and lose
		entire categories of transactional mail overnight, including forwarded messages, messages from unauthorized
		third parties, and messages from misconfigured subdomains.
	</Paragraph>

	<Paragraph>
		<strong>Stage 1: <code>p=none</code> (monitor only)</strong>
	</Paragraph>

	<Code lang="text" code={dmarcNone} />

	<Callout variant="tip" title="Always start at p=none">
		Deploy <code>p=none</code> first and review the reports for a few weeks before enforcing anything.
		You'll discover every service sending mail from your domain — some you expected, some you didn't —
		without risking a single legitimate message.
	</Callout>

	<Paragraph>
		This tells receivers to send you reports but to take no action on failed messages. Deploy it first
		and review the reports for a few weeks. You'll discover every service sending mail from your
		domain, some you expected, some you didn't.
	</Paragraph>

	<Paragraph>
		Aggregate reports arrive as XML files (usually gzipped) at the <code>rua</code> address:
	</Paragraph>

	<Code lang="text" code={dmarcReportXml} />

	<Paragraph>
		That record says: 1,523 messages from IP <code>198.51.100.42</code> claimed to be from
		<code>yourapp.com</code>; DKIM passed, SPF failed. You'd then look up the IP to determine whether
		it's a legitimate sender (maybe a forwarder) or someone spoofing you.
	</Paragraph>

	<Paragraph>
		<strong>Stage 2: <code>p=quarantine</code> (mark as suspicious)</strong>
	</Paragraph>

	<Code lang="text" code={dmarcQuarantine} />

	<Paragraph>
		Once your legitimate senders pass authentication, move to <code>quarantine</code>. Use
		<code>pct</code> to ramp up: start by quarantining 25% of failing messages (usually routed to spam),
		then increase to 100% as confidence grows.
	</Paragraph>

	<Paragraph>
		One caveat: <code>pct</code> is being deprecated. Some major receivers (notably Google since 2024) ignore
		it when <code>p=reject</code> and treat it as 100%. It still works for <code>p=quarantine</code>, but
		plan for short staging periods rather than long partial rollouts.
	</Paragraph>

	<Paragraph>
		<strong>Stage 3: <code>p=reject</code> (block outright)</strong>
	</Paragraph>

	<Code lang="text" code={dmarcReject} />

	<Paragraph>
		Now, receivers reject messages that fail DMARC, so they won't be delivered at all. Be confident
		that every legitimate sender is properly authenticated before you flip this switch.
	</Paragraph>

	<Paragraph>
		The full progression usually takes 4–8 weeks, depending on the number of sending services you have
		and how quickly you can verify each one.
	</Paragraph>

	<Heading level={2}>Forwarding, mailing lists, and ARC</Heading>

	<Paragraph>
		DMARC has one persistent enemy: forwarding. Mailing lists rewrite subjects (<code
			>[my-list] ...</code
		>), append footers, or modify headers, and any of those break DKIM. SPF is already broken by
		forwarding, so nothing remains to authenticate.
	</Paragraph>

	<Paragraph>
		Authenticated Received Chain (ARC) is the workaround. Each forwarder adds a signed seal that
		records the auth results it observed before touching the message. The next hop can trust that
		chain even when SPF and DKIM no longer pass directly.
	</Paragraph>

	<Paragraph>
		Most large receivers (Gmail, Microsoft 365) honor ARC. You don't need to configure anything on
		your sending domain (sealing is the forwarder's job), but this explains why some forwarded mail
		clears <code>p=reject</code> while other forwarded mail doesn't.
	</Paragraph>

	<Paragraph>
		The takeaway: before you reach <code>p=reject</code>, monitor your DMARC reports for failures from
		forwarding sources. You may need to nudge mailing list operators toward ARC or move that traffic to
		a different domain.
	</Paragraph>

	<Heading level={2}>Verifying everything is working</Heading>

	<Paragraph>
		Once all three records are in DNS, confirm they're actually doing what you expect. Start with
		<code>dig</code>:
	</Paragraph>

	<Code lang="bash" code={verifyDig} />

	<Paragraph>
		Then send yourself a test email and inspect the headers. In Gmail, open the message and click
		"Show original." The header you want is <code>Authentication-Results</code>, added by the recipient:
	</Paragraph>

	<Code lang="text" code={authResults} />

	<Paragraph>
		You want <code>dkim=pass</code>, <code>spf=pass</code>, and <code>dmarc=pass</code>. If any show
		<code>fail</code> or <code>softfail</code>, here's how to trace the issue:
	</Paragraph>

	<List>
		<li>
			<strong>SPF fail</strong> → the sending IP isn't listed in your record. Identify the server that
			actually sent the message and add its IP or an <code>include</code> directive.
		</li>
		<li>
			<strong>DKIM fail</strong> → the signature didn't verify. Usually, a DNS record is incorrect, a key
			was rotated without updating DNS, or an intermediary (often a mailing list) modified the message in
			transit.
		</li>
		<li>
			<strong>DMARC fail</strong> → either both SPF and DKIM failed, or neither aligned with the
			<code>From</code> domain. Check alignment first; mismatched domains are the more common cause.
		</li>
	</List>

	<Paragraph>
		If you're using Lettr, the
		<a href="https://docs.lettr.com/learn/domains/sending-domains">domain verification flow</a> runs these
		checks for you and flags any missing records before you start sending.
	</Paragraph>

	<Heading level={2}>Common mistakes</Heading>

	<Paragraph>
		<strong>Forgetting a sending service.</strong> You set up SPF for your primary provider but missed that
		your billing system sends invoices through a different provider. Those emails quietly fail, and at
		<code>p=reject</code> they disappear. The <code>p=none</code> phase exists to catch exactly this.
	</Paragraph>

	<Paragraph>
		<strong>Not reading DMARC reports.</strong> Pointing <code>rua</code> at an address nobody checks defeats
		the purpose. DMARC reports tell you who's sending from your domain, whether it's a service you forgot
		about or someone overseas spoofing you. Either way, you want to know. Use a DMARC reporting tool if XML
		isn't your idea of a good time.
	</Paragraph>

	<Paragraph>
		<strong>Expired or rotated DKIM keys.</strong> Providers rotate keys; if your DNS record becomes stale
		(or someone deletes it because "we don't use that anymore"), DKIM silently fails. Stage 1 monitoring catches
		this at later stages. Customers stop receiving mail with no obvious cause.
	</Paragraph>

	<Paragraph>
		<strong>Overly broad SPF includes.</strong> <code>include:_spf.google.com</code> when you don't use
		Google Workspace, or stale entries for services you stopped years ago. Each one expands the set of IPs
		authorized to send as you and consumes a slot toward the 10-lookup limit.
	</Paragraph>

	<Paragraph>
		<strong>Treating <code>p=quarantine</code> as good enough.</strong> Quarantined mail still ends up in
		spam folders, where users see it and sometimes interact with it. <code>p=reject</code> is the only setting
		that actually prevents spoofed mail from reaching the recipient.
	</Paragraph>

	<Heading level={2}>What's next: BIMI</Heading>

	<Paragraph>
		Once you're at <code>p=quarantine</code> or <code>p=reject</code>, you can publish a BIMI record (Brand
		Indicators for Message Identification). It tells supporting clients (Gmail, Yahoo Mail, and Apple Mail)
		to display your logo next to authenticated messages.
	</Paragraph>

	<Paragraph>
		Most clients require a Verified Mark Certificate (VMC) tied to a registered trademark, even though
		it costs money and isn't worth it for most teams. However, for consumer brands whose customers are
		often phished, the visible signal is worth the cost. It's not part of authentication itself (DMARC
		enforcement is the prerequisite), but it's the natural next step once your domain is secured.
	</Paragraph>

	<Heading level={2}>None of this is optional anymore</Heading>

	<Divider />

	<Paragraph>
		Gmail and Yahoo both
		<a href="https://blog.google/products/gmail/gmail-security-authentication-spam-protection/"
			>require all three</a
		> for bulk senders, and inbox providers increasingly penalize domains that lack them. Without these
		records, anyone can send an email that appears to come from your domain, and your users won't examine
		the headers. They'll assume it was you.
	</Paragraph>

	<Paragraph>
		The actual work involves a handful of DNS records and a few weeks of monitoring. Set up SPF, let
		your provider handle DKIM, deploy DMARC with <code>p=none</code>, review the reports, and ratchet up
		enforcement as confidence grows.
	</Paragraph>
</BlogPost>
