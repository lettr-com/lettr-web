<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		TldrList,
		Callout,
		Code,
		Faq,
		FaqItem
	} from '$lib/components/blog';

	const spfRecord = `v=spf1 include:spf.lettr.com include:_spf.google.com ~all`;

	const spfDig = `dig TXT yourapp.com +short`;

	const dkimSignature = `DKIM-Signature: v=1; a=rsa-sha256; d=yourapp.com; s=lettr;
h=from:to:subject:date:message-id;
bh=2jUSOH9NhtVGCQWNr9BrIAPreKQjO6Sn7XIkfJVOzv8=;
b=AuUoFEfDxTDkHlLXSZEpZj79LICEps6eda7W3deTVFOk2...`;

	const dkimDig = `dig TXT lettr._domainkey.yourapp.com +short`;

	const dmarcRecord = `v=DMARC1; p=none; rua=mailto:dmarc-reports@yourapp.com`;

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

	const verifyDig = `# Check SPF
dig TXT yourapp.com +short | grep spf

# Check DKIM (replace 'lettr' with your selector)
dig TXT lettr._domainkey.yourapp.com +short

# Check DMARC
dig TXT _dmarc.yourapp.com +short`;

	const authResults = `Authentication-Results: mx.google.com;
dkim=pass header.d=yourapp.com header.s=lettr;
spf=pass smtp.mailfrom=bounce+abc123@mail.yourapp.com;
dmarc=pass (p=REJECT dis=NONE) header.from=yourapp.com`;
</script>

<BlogPost
	category="Deliverability"
	title="SPF, DKIM, and DMARC explained for developers"
	excerpt="What SPF, DKIM, and DMARC each do, how they fit together to stop email spoofing, and how to read the DNS records and authentication headers to tell whether they're working."
	metaDescription="What SPF, DKIM, and DMARC each do, how they work together to stop email spoofing, and how to read the DNS records and headers to confirm they work."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="March 4, 2026"
	datetime="2026-03-04"
	readTime="7 min read"
	slug="spf-dkim-dmarc-explained-for-developers"
>
	<Lead>
		Open a terminal, and you can send an email claiming to be from <code>support@stripe.com</code>.
		SMTP won't stop you. The protocol was designed in the early 1980s with no built-in way to verify
		the sender, and that gap is still there.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>SPF</strong> names allowed servers, <strong>DKIM</strong> signs each message, and
				<strong>DMARC</strong> ties both to the visible <code>From</code> and says what to do on failure.
			</li>
			<li>
				<strong>Alignment closes the spoofing gap</strong>: DMARC passes only when the authenticated domain
				matches the <code>From</code> domain.
			</li>
			<li>
				<strong>Roll out enforcement in stages</strong>: <code>p=none</code>, read the reports, then ratchet
				to <code>p=quarantine</code> and <code>p=reject</code>.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>SPF: declaring who can send for you</Heading>

	<Paragraph>
		<strong>SPF</strong> is the first record receivers check, and the easiest to get right, so it's the place to start.
		<strong>It's a single DNS TXT record listing the IP addresses allowed to send email on behalf of your
		domain</strong>. When a receiving server gets a message claiming to be from <code>yourapp.com</code>, it
		looks up that record and checks whether the sending IP is on the list.
	</Paragraph>

	<Code lang="text" code={spfRecord} />

	<Paragraph>
		The <code>include</code> mechanisms pull in the <strong>IP ranges</strong> of each service that sends for you. The trailing <code>~all</code> is the <strong>catch-all verdict</strong> for everything
		else: <code>~all</code> soft-fails (accept but mark suspicious), <code>-all</code> hard-fails. Stick
		with <code>~all</code>.
	</Paragraph>

	<Paragraph>Check the record with <code>dig</code>, and confirm there's exactly one:</Paragraph>

	<Code lang="bash" code={spfDig} />

	<Paragraph>
		Unfortunately, SPF has <strong>one structural weakness</strong> worth remembering: <strong>it checks the envelope sender</strong> (the <code
			>MAIL FROM</code
		> in the SMTP conversation), not the <code>From</code> header users see. A phishing email can fail SPF
		on its real domain and still display any <code>From</code> address it likes. SPF also breaks under forwarding,
		because the forwarder's IP isn't in your record. Both gaps are why DKIM and DMARC exist.
	</Paragraph>

	<Heading level={2}>DKIM: signing each message cryptographically</Heading>

	<Paragraph>
		Where SPF authorizes servers, <strong>DKIM authenticates the message itself</strong>, which is what lets it survive
		the forwarding that breaks SPF. The provider computes a hash of selected headers and the body,
		signs it with a private key, and attaches the result as a <code>DKIM-Signature</code> header:
	</Paragraph>

	<Code lang="text" code={dkimSignature} />

	<Paragraph>
		Two fields carry the meaning. <code>d=yourapp.com</code> is the <strong>domain claiming responsibility</strong>, and
		<code>s=lettr</code> is the selector that tells receivers <strong>where to find the public key</strong>:
		<code>&lt;selector&gt;._domainkey.&lt;domain&gt;</code>. The receiver fetches that key, recomputes
		the hash, and compares. Change a single character in the subject or body in transit and the
		signature <strong>no longer matches</strong>. Fetch the public key yourself:
	</Paragraph>

	<Code lang="bash" code={dkimDig} />

	<Paragraph>
		The selector exists to enable key rotation: providers publish a new key under a new selector, start
		signing with it, and retire the old one once mail in flight has cleared. Because DKIM signs the
		visible <code>From</code> header and travels with the message, it protects the address users
		actually see far better than SPF does.
	</Paragraph>

	<Callout variant="info">
		None of this is yours to manage. When you
		<a href="https://docs.lettr.com/learn/domains/sending-domains">add a sending domain in Lettr</a>,
		the keys are generated and the DKIM records handed to you. Copy them to your DNS, and you're done.
		See how <a href="/platform/deliverability/">Lettr handles deliverability</a> end to end.
	</Callout>

	<Heading level={2}>DMARC: policy and reporting</Heading>

	<Paragraph>
		SPF and DKIM each produce a <strong>pass</strong> or <strong>fail</strong>, but neither says <strong>what a receiver should do with a failure</strong>,
		and neither guarantees the check covers the domain in the visible <code>From</code> header. <strong>DMARC</strong>
		fills both gaps. It's a DNS TXT record at <code>_dmarc.yourapp.com</code> that publishes a policy
		and a reporting address:
	</Paragraph>

	<Code lang="text" code={dmarcRecord} />

	<Paragraph>
		<code>p=none</code> is the policy (what to do with failing mail), and <code>rua</code> is where aggregate
		reports go. Check it with <code>dig TXT _dmarc.yourapp.com</code>.
	</Paragraph>

	<Heading level={3}>Alignment is the part that matters</Heading>

	<Paragraph>
		<strong>Alignment</strong> is the mechanism that actually closes the spoofing gap, so it's the one DMARC concept
		worth internalizing. <strong>A message passes DMARC only if it passes SPF or DKIM <strong>and</strong> the
		domain that passed matches the <code>From</code> header domain the user sees.</strong> An attacker who passes
		SPF on their own domain while displaying yours in the <code>From</code> header now fails, because
		the authenticated domain and the visible one don't line up.
	</Paragraph>

	<Callout variant="info">
		One consequence worth noting: subdomains inherit your policy by default, and attackers favor
		unauthenticated ones like <code>mail.yourapp.com</code>. If a subdomain sends legitimate mail, give
		it its own SPF and DKIM, or a <code>sp=reject</code> policy on the parent will block it.
	</Callout>

	<Heading level={3}>Roll out enforcement in stages</Heading>

	<Paragraph>
		Jumping straight to <code>p=reject</code> drops entire categories of legitimate mail overnight:
		forwarded messages, mail from services you forgot about, misconfigured subdomains. The policy moves
		through three values, and <strong>the first one must be the a starting point</strong>.
	</Paragraph>

	<Callout variant="tip" title="Always start at p=none">
		Deploy <code>p=none</code> first. It tells receivers to report failures but take no action, so the
		reports surface every service sending as your domain (some you expected, some you didn't) without
		risking a single legitimate message. Review them for a few weeks before enforcing anything.
	</Callout>

	<Paragraph>
		Aggregate reports arrive as gzipped XML at the <code>rua</code> address. One record looks like this:
	</Paragraph>

	<Code lang="text" code={dmarcReportXml} />

	<Paragraph>
		That says 1,523 messages from <code>198.51.100.42</code> claimed to be from <code>yourapp.com</code
		>; DKIM passed, SPF failed. Looking up the IP tells you whether it's a legitimate forwarder or
		someone spoofing you. Once every legitimate sender passes, move to <code>p=quarantine</code> (failing
		mail routed to spam), then to <code>p=reject</code> (failing mail refused outright). The full
		progression usually takes four to eight weeks.
	</Paragraph>

	<Heading level={2}>Verifying everything is working</Heading>

	<Paragraph>
		Two checks confirm the records are live and doing their job. First, read them straight out of DNS
		with <code>dig</code>:
	</Paragraph>

	<Code lang="bash" code={verifyDig} />

	<Paragraph>
		Then send yourself a test email and open "Show original" in Gmail. The recipient adds an
		<code>Authentication-Results</code> header recording all three verdicts:
	</Paragraph>

	<Code lang="text" code={authResults} />

	<Paragraph>
		The goal is <code>dkim=pass</code>, <code>spf=pass</code>, and <code>dmarc=pass</code>. A
		<code>dmarc=fail</code> with SPF and DKIM both passing almost always means an alignment mismatch, so
		check the domains first. If you're using Lettr, the
		<a href="https://docs.lettr.com/learn/domains/sending-domains">domain verification flow</a> runs these
		checks and flags missing records before you start sending.
	</Paragraph>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="Do I need all three of SPF, DKIM, and DMARC?">
			<strong>Yes. The three do different jobs and only close the spoofing gap together.</strong> SPF
			names the servers allowed to send, DKIM signs each message so tampering is detectable, and DMARC
			ties both to the visible <code>From</code> address and says what to do on failure. Gmail and Yahoo
			require all three for bulk senders.
		</FaqItem>

		<FaqItem question="What does DMARC alignment mean?">
			<strong>Alignment means the domain that passed SPF or DKIM matches the domain in the visible
			<code>From</code> header.</strong> Without it, a message could pass SPF for one domain while
			displaying another in the <code>From</code> line, which is exactly the spoofing DMARC exists to
			stop. DMARC passes only when at least one of the two authenticates and aligns with the
			<code>From</code> domain.
		</FaqItem>

		<FaqItem question="Why should I start DMARC at p=none?">
			<strong>Because <code>p=none</code> reports failures without blocking any mail.</strong> The
			aggregate reports surface every service sending as your domain, including ones you forgot about,
			so you can fix legitimate senders before enforcement could send their mail to spam. Review the
			reports for a few weeks, then move to <code>p=quarantine</code> and <code>p=reject</code>.
		</FaqItem>

		<FaqItem question="How do I check whether SPF, DKIM, and DMARC are working?">
			<strong>Read the records from DNS with <code>dig</code>, then send a test email and open "Show
			original" in Gmail.</strong> The receiver records the verdicts in an
			<code>Authentication-Results</code> header, and the goal is <code>dkim=pass</code>,
			<code>spf=pass</code>, and <code>dmarc=pass</code>. A <code>dmarc=fail</code> while SPF and DKIM
			pass almost always points to an alignment mismatch.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Gmail and Yahoo both
		<a href="https://blog.google/products/gmail/gmail-security-authentication-spam-protection/"
			>require all three</a
		> for bulk senders, and inbox providers increasingly penalize domains that lack them. <strong>Without these
		records, anyone can send mail that appears to come from your domain</strong>, and recipients won't inspect the
		headers. They will assume it was you.
	</Paragraph>

	<Paragraph>
		The actual work is <strong>a handful of DNS records and a few weeks of monitoring</strong>. Set up SPF, let your
		provider handle DKIM, deploy DMARC at <code>p=none</code>, read the reports, and ratchet up
		enforcement as confidence grows.
	</Paragraph>

	<Paragraph>
		Or skip the manual setup entirely.
		<a href="https://app.lettr.com/register">Create a free Lettr account</a>, add your sending domain,
		and the SPF and DKIM records are generated and verified for you, with DMARC reporting built in.
	</Paragraph>
</BlogPost>
