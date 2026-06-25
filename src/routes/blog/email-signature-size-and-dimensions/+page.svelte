<script lang="ts">
	import {
		BlogPost,
		Lead,
		Heading,
		Paragraph,
		List,
		TldrList,
		Callout,
		Faq,
		FaqItem
	} from '$lib/components/blog';
</script>

<BlogPost
	category="Fundamentals"
	title="Email signature size and dimensions"
	excerpt="The recommended pixel dimensions, file size, and format for an email signature, how signatures render in Gmail, Outlook, and Apple Mail, and the common mistakes that make them break on mobile or load slowly."
	metaDescription="Recommended email signature dimensions and file size: the right width and height in pixels, PNG vs JPG, how signatures render across clients, and what to avoid."
	author={{ name: 'Erik Vlčák', role: 'Customer Success Engineer', avatar: '/images/authors/erik.jpg' }}
	date="June 6, 2026"
	datetime="2026-06-06"
	readTime="5 min read"
	slug="email-signature-size-and-dimensions"
>
	<Lead>
		An email signature is the block of contact details, branding, and sometimes a logo or headshot
		that sits at the bottom of an email. Getting its size right matters because email clients render
		images very differently from a browser, and a signature that looks correct in one inbox can
		overflow, blur, or break entirely in another. Two numbers decide whether it holds up: <strong>the
		pixel dimensions of the image and the file size in kilobytes</strong>.
	</Lead>

	<Callout variant="info" title="TL;DR">
		<TldrList>
			<li>
				<strong>Keep the signature under 600px wide</strong> so it fits the standard email content
				column without horizontal scrolling.
			</li>
			<li>
				<strong>Keep image height modest</strong>: a logo around 100-150px tall and a headshot around
				100px square read well without dominating the message.
			</li>
			<li>
				<strong>Keep every image light</strong>: aim for under 50KB per image and under 100KB total,
				which keeps the signature fast and avoids clipping.
			</li>
		</TldrList>
	</Callout>

	<Heading level={2}>Recommended email signature dimensions</Heading>

	<Paragraph>
		The single constraint that drives every other number is <strong>the email content column, which
		is conventionally 600px wide</strong>. Most templates and clients render the body at or near that
		width, so a signature wider than 600px forces horizontal scrolling on desktop and shrinks
		unpredictably on mobile. These dimensions stay inside that column and render consistently across
		clients:
	</Paragraph>

	<table>
		<thead>
			<tr>
				<th>Element</th>
				<th>Recommended width</th>
				<th>Recommended height</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>Full signature block</td>
				<td>300-600px</td>
				<td>70-150px</td>
			</tr>
			<tr>
				<td>Company logo</td>
				<td>150-300px</td>
				<td>50-100px</td>
			</tr>
			<tr>
				<td>Headshot / avatar</td>
				<td>100px</td>
				<td>100px</td>
			</tr>
			<tr>
				<td>Social media icons</td>
				<td>24-32px</td>
				<td>24-32px</td>
			</tr>
			<tr>
				<td>Banner / CTA image</td>
				<td>up to 600px</td>
				<td>50-150px</td>
			</tr>
		</tbody>
	</table>

	<Paragraph>
		Sharpness depends on one more step. <strong>Export images at twice the display size and constrain
		them down in the HTML</strong>. A 100px headshot should be a 200px image displayed at 100px,
		because many recipients read mail on high-density (Retina) screens that render a 1x image soft. Set
		the intended size with <code>width</code> and <code>height</code> attributes on the image so the
		layout holds even before the image loads.
	</Paragraph>

	<Heading level={2}>File size and format</Heading>

	<Paragraph>
		Image weight affects more than load time. <strong>Gmail clips any message larger than
		102KB</strong>, hiding the rest behind a "View entire message" link, and a heavy signature on a
		long thread can push a message past that limit. Keep each image under 50KB and the whole signature
		under 100KB.
	</Paragraph>

	<Paragraph>
		Format choice comes down to what the image contains. <strong>PNG is right for logos, icons, and
		anything with text or a transparent background</strong>, because it keeps edges crisp and
		supports transparency. <strong>JPG is right for photographs and headshots</strong>, where its
		compression produces a much smaller file than PNG at the same visual quality. SVG is tempting for
		logos, but most email clients strip it, so it is not a safe choice for sent mail.
	</Paragraph>

	<Callout variant="tip" title="Host images, don't embed them">
		Reference images by an absolute <code>https</code> URL rather than embedding them as base64 in the
		HTML. Embedded images inflate the message size, count against Gmail's 102KB clipping limit, and
		are stripped by some clients. A hosted image on a reliable CDN loads once and caches.
	</Callout>

	<Paragraph>
		Lighter images also help deliverability. A high image-to-text ratio is one of the signals spam
		filters weigh, and oversized images slow rendering on mobile connections. The same discipline
		that keeps a signature crisp also keeps it from working against the inbox, which is part of the
		broader case for
		<a href="/blog/the-hidden-cost-of-diy-transactional-email/">treating image weight as a
		deliverability concern</a>.
	</Paragraph>

	<Heading level={2}>How signatures render across clients</Heading>

	<Paragraph>
		There is no shared rendering engine across email clients, so a signature has to survive several
		different ones. <strong>The three that cover most recipients are Gmail, Outlook, and Apple
		Mail</strong>, and each has a quirk worth designing around.
	</Paragraph>

	<List>
		<li>
			<strong>Gmail</strong> clips messages over 102KB and strips most embedded styles, so a light,
			image-hosted signature with inline styling renders most reliably.
		</li>
		<li>
			<strong>Outlook</strong> on Windows uses Microsoft Word's rendering engine, which ignores many
			CSS properties and can add unwanted spacing around images. Explicit <code>width</code> and
			<code>height</code> attributes (not CSS sizing) keep images at the intended dimensions here.
		</li>
		<li>
			<strong>Apple Mail</strong> renders close to a real browser and scales images for Retina
			displays, which is exactly why exporting at 2x matters: a 1x image that looks fine in Outlook
			can look soft here.
		</li>
	</List>

	<Paragraph>
		Across all three, <strong>the most conservative choice renders everywhere</strong>: fixed
		pixel dimensions on hosted images, inline styles, and a layout that does not depend on CSS the
		stricter clients discard.
	</Paragraph>

	<Heading level={2}>Common mistakes</Heading>

	<Paragraph>
		Most broken signatures come down to three avoidable errors, all of them about size in one form or
		another.
	</Paragraph>

	<List>
		<li>
			<strong>Oversized image files.</strong> A multi-megabyte logo exported straight from a design
			tool slows loading, gets the message clipped in Gmail, and counts against spam filters. Compress
			every image before it goes into the signature.
		</li>
		<li>
			<strong>A signature wider than the content column.</strong> Anything past 600px forces
			horizontal scrolling on desktop and gets scaled down on mobile, often shrinking the text to an
			unreadable size.
		</li>
		<li>
			<strong>No mobile consideration.</strong> Fixed-width tables and tiny tap targets that work on a
			desktop monitor fall apart on a phone, where more than half of email is now read. Keep the
			layout simple and the touch targets reasonable.
		</li>
	</List>

	<Heading level={2}>FAQ</Heading>

	<Faq>
		<FaqItem question="What is the best size for an email signature?">
			<strong>A width between 300 and 600px and a height between 70 and 150px</strong> suits most
			signatures. Staying at or below 600px keeps the block inside the standard email content column so
			it does not force horizontal scrolling.
		</FaqItem>

		<FaqItem question="What are the correct dimensions for an email signature logo?">
			<strong>Around 150-300px wide and 50-100px tall</strong> works for most logos. Export the image
			at twice those dimensions and display it at the intended size so it stays sharp on high-density
			screens.
		</FaqItem>

		<FaqItem question="How large should an email signature file be?">
			<strong>Under 50KB per image and under 100KB total.</strong> Gmail clips any message over 102KB,
			so a heavy signature on a long thread can get cut off mid-message.
		</FaqItem>

		<FaqItem question="Should an email signature use PNG or JPG?">
			<strong>PNG for logos, icons, and anything with transparency or sharp edges; JPG for
			photographs and headshots.</strong> JPG compresses photos to a far smaller file than PNG at the
			same quality.
		</FaqItem>

		<FaqItem question="What size should social media icons be in an email signature?">
			<strong>Between 24 and 32px square.</strong> That keeps them legible without crowding the contact
			details, and at 2x export they stay crisp on Retina displays.
		</FaqItem>
	</Faq>

	<Heading level={2}>Bottom line</Heading>

	<Paragraph>
		Two constraints cover almost every case. <strong>Keep the signature within the 600px content
		column</strong> so it never forces horizontal scrolling, and <strong>keep every image light and
		exported at 2x</strong> so it loads fast, stays sharp on Retina screens, and never trips Gmail's
		102KB clip. Hosted PNGs for logos and icons, hosted JPGs for photos, and fixed pixel dimensions on
		each one will render consistently across Gmail, Outlook, and Apple Mail.
	</Paragraph>
</BlogPost>
