<script lang="ts">
	import { BlogPost, Lead, Heading, Paragraph, List, TldrList, Callout, Faq, FaqItem } from '$lib/components/blog';
</script>

<BlogPost
	category="Fundamentals"
	title="Email attachment size limits by provider (and how to send large files)"
	excerpt="The attachment size limits for Gmail, Outlook, Yahoo, and iCloud Mail, why the real ceiling is lower than the number suggests because of encoding overhead, and the practical ways to send a file that is too big to attach, including large video."
	metaDescription="Email attachment size limits for Gmail, Outlook, Yahoo, and iCloud, why the real limit is lower than advertised, and how to send large files and videos."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 24, 2026"
	datetime="2026-06-24"
	readTime="6 min read"
	slug="email-attachment-size-limits"
>
	<Lead>
		Every email provider caps how large an attachment can be, and the caps are lower than most people
		expect. The number a provider advertises is also not the number that actually applies, because
		attachments are encoded for transit and the encoding adds roughly a third to the file size. This
		article lists the real limits for the major providers, explains why the effective ceiling is
		lower, and covers the practical ways to send a file that is too big to attach.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Most providers cap attachments at 20-25 MB</strong>: Gmail and Yahoo at 25 MB, Outlook
				and iCloud at 20 MB.
			</li>
			<li>
				<strong>The usable limit is lower than the headline number</strong> because attachments are
				Base64-encoded, which inflates them by about 33%, so a 25 MB cap holds roughly an 18 MB file.
			</li>
			<li>
				<strong>For anything larger, send a link, not the file</strong>: a cloud-storage share link, a
				file-transfer service, or a compressed archive all sidestep the limit.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Email attachment size limits by provider</Heading>

	<Paragraph>
		The limit that matters is whichever is smaller: the sender's outgoing cap or the recipient's
		incoming cap. <strong>A message has to clear both, so the lower of the two wins</strong>. These are
		the published limits for the major consumer providers, and they cover the recipient side as well
		as the sender side unless noted.
	</Paragraph>

	<table>
		<thead>
			<tr>
				<th>Provider</th>
				<th>Attachment limit</th>
				<th>What happens above the limit</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Gmail</td>
				<td>25 MB</td>
				<td>Offers to upload the file to Google Drive and insert a link instead</td>
			</tr>
			<tr>
				<td>Outlook / Outlook.com</td>
				<td>20 MB</td>
				<td>Prompts to share via OneDrive as a link</td>
			</tr>
			<tr>
				<td>Yahoo Mail</td>
				<td>25 MB</td>
				<td>Blocks the send; the file has to be linked or shrunk</td>
			</tr>
			<tr>
				<td>iCloud Mail</td>
				<td>20 MB</td>
				<td>Mail Drop uploads the file (up to 5 GB) and sends a download link</td>
			</tr>
		</tbody>
	</table>

	<Paragraph>
		Business and self-hosted mail can differ. <strong>Microsoft 365 defaults to 25 MB but an
		administrator can raise it to 150 MB</strong>, and a company running its own mail server sets its
		own ceiling. The consumer figures above are the safe assumption when the recipient is unknown,
		since a file that fits Gmail and Outlook fits almost everywhere.
	</Paragraph>

	<Heading level={2}>Why the limits exist and what counts toward them</Heading>

	<Paragraph>
		Attachments are not sent as raw binary. <strong>Email was designed to carry plain text, so a file
		is encoded into text with Base64 before it travels</strong>, and that encoding inflates the data
		by about 33%. A 20 MB file becomes roughly 27 MB on the wire. The provider's limit applies to the
		encoded size, which is why a file that looks comfortably under the cap can still be rejected.
	</Paragraph>

	<Paragraph>
		The practical effect is a gap between the advertised number and the usable one. <strong>A 25 MB
		limit holds a real file of around 18 MB once encoding is accounted for</strong>, and a 20 MB limit
		holds about 14 MB. Treating the headline figure as the true ceiling is the most common reason a
		send that should have worked bounces back.
	</Paragraph>

	<Paragraph>
		The limits themselves exist because large attachments are expensive for providers to store and
		relay, and because multiplying a big file across many recipients strains the receiving servers.
		<strong>Storing one shared copy and distributing a link is far cheaper than storing a full copy in
		every recipient's mailbox</strong>, which is exactly what the workarounds below do.
	</Paragraph>

	<Heading level={2}>How to send large files</Heading>

	<Paragraph>
		When a file is over the limit, the answer is to send a reference to the file rather than the file
		itself. <strong>The recipient gets a link, the file lives in storage, and the email stays small
		enough to deliver</strong>. Three approaches cover almost every case.
	</Paragraph>

	<List>
		<li>
			<strong>Share a cloud-storage link.</strong> Upload the file to Google Drive, OneDrive, Dropbox,
			or iCloud, then paste a share link into the message. Gmail and Outlook do this automatically when
			a file exceeds the limit, and it keeps the email tiny regardless of how large the file is.
		</li>
		<li>
			<strong>Use a file-transfer service.</strong> Tools like WeTransfer, Smash, or Send Anywhere
			upload the file and email a download link, with no recipient account needed. They suit one-off
			large transfers, often handle several gigabytes, and expire the link after a set period.
		</li>
		<li>
			<strong>Compress the file into an archive.</strong> Zipping a file, or several files, shrinks the
			total and bundles everything into one attachment. This helps most with documents and
			already-uncompressed data; media that is already compressed, like a JPEG or an MP4, barely
			shrinks.
		</li>
	</List>

	<Paragraph>
		The link approach has a quieter benefit beyond fitting the limit. <strong>A linked file can be
		updated, revoked, or tracked after the email is sent</strong>, while an attachment is a frozen copy
		sitting in an inbox forever. For anything that might change or that should not circulate
		indefinitely, a link is the better default even when the file would have fit.
	</Paragraph>

	<Heading level={2}>How to send large videos</Heading>

	<Paragraph>
		Video almost never fits as an attachment, because <strong>even a short clip in modern quality runs
		well past 25 MB</strong>. A minute of 1080p video is commonly 50-100 MB, and 4K is several times
		that. Attaching it directly is rarely an option, so video is the clearest case for sending a link.
	</Paragraph>

	<List>
		<li>
			<strong>Upload to a video host and share the link.</strong> YouTube (as an unlisted or private
			video), Vimeo, or Loom give the recipient a player that streams rather than downloads, which is
			usually what they want anyway. This is the smoothest option for anything meant to be watched.
		</li>
		<li>
			<strong>Use cloud storage or a transfer service for the raw file.</strong> When the recipient
			needs the original file rather than a stream, for editing or archiving, a Google Drive or Dropbox
			link, or a WeTransfer send, delivers the full-quality file without touching the attachment limit.
		</li>
		<li>
			<strong>Compress or trim before sending.</strong> Lowering the resolution, shortening the clip, or
			re-encoding to a more efficient codec can bring a borderline file under the limit. This works for
			a short, low-stakes clip, though for most video a link is simpler than fighting the file size.
		</li>
	</List>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="How big of a file can you email?">
			<strong>Plan for about 20 MB to be safe across every provider.</strong> Gmail and Yahoo allow 25
			MB and Outlook and iCloud allow 20 MB, but because attachments are encoded for transit and grow
			by roughly a third, the real file size that fits a 20 MB cap is closer to 14 MB. Anything larger
			should be sent as a link.
		</FaqItem>

		<FaqItem question="What is the maximum email attachment size for Gmail?">
			<strong>Gmail's attachment limit is 25 MB.</strong> A file larger than that triggers an offer to
			upload it to Google Drive and insert a share link instead, so the message still sends. The 25 MB
			ceiling applies to the encoded size, which means a real file of around 18 MB is the practical
			maximum.
		</FaqItem>

		<FaqItem question="What is the Yahoo Mail attachment size limit?">
			<strong>Yahoo Mail caps attachments at 25 MB.</strong> Above that, Yahoo blocks the send rather
			than offering automatic cloud upload, so a larger file has to be shared as a link from cloud
			storage or compressed below the limit first.
		</FaqItem>

		<FaqItem question="How do I email a video that is too large to attach?">
			<strong>Upload the video and send a link instead of attaching it.</strong> A video host like
			YouTube, Vimeo, or Loom gives the recipient a stream, and cloud storage or a transfer service like
			WeTransfer delivers the raw file at full quality. Both avoid the attachment limit entirely, which
			a typical 1080p clip would exceed within a minute.
		</FaqItem>

		<FaqItem question="Does zipping a file make it small enough to email?">
			<strong>Sometimes, depending on the file type.</strong> Compressing documents, spreadsheets, or
			other uncompressed data can shrink them significantly. Media that is already compressed, such as
			JPEG images or MP4 video, barely changes size when zipped, so for those a link is the more
			reliable route.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		The working rule is simple: <strong>keep attachments under about 20 MB of real file size, and send
		anything larger as a link</strong>. The providers all sit between 20 and 25 MB, encoding overhead
		eats into that, and cloud-storage links or transfer services handle whatever does not fit without
		the recipient ever hitting a limit.
	</Paragraph>

	<Paragraph>
		This applies to manual, person-to-person email. Sending attachments programmatically, through a
		transactional email API, follows the same physics but with the provider's own per-message ceiling,
		so large files belong behind a hosted link there too.
		<a href="https://docs.lettr.com/learn/sending/attachments">Lettr's attachment handling</a> documents
		those limits for API sends, and a <a href="https://app.lettr.com/register">free account</a> covers
		the common case of a receipt or report with a modest PDF attached.
	</Paragraph>
</BlogPost>
