---
term: UTM Parameters
question: What are
description: "UTM parameters are query string tags on email links that let analytics tools credit a site visit to an email. How they work with click tracking in Lettr."
related: [click-tracking, tracking-domain, merge-tag, email-engagement, marketing-email]
reading:
  - title: Tracking
    href: https://docs.lettr.com/learn/sending/tracking
  - title: Template Language
    href: https://docs.lettr.com/learn/templates/template-language
---

**UTM parameters** are tags added to the query string of a link so that web analytics tools can tell where a visit came from. UTM stands for Urchin Tracking Module, named after Urchin, the analytics product Google acquired and rebuilt as Google Analytics. A link such as `https://example.com/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=spring-launch` reaches the same page as the untagged address, but the visit is credited to that email campaign instead of showing up as direct traffic.

## How UTM parameters work

Five standard parameters exist, and **analytics tools read them from the landing page URL** when the visit starts:

- **`utm_source`:** the sender or list the visit came from, such as `newsletter`.
- **`utm_medium`:** the channel, which for email is usually `email`.
- **`utm_campaign`:** the name of the campaign or message, such as `spring-launch`.
- **`utm_content`:** a label that tells apart links pointing to the same page, such as a header button and a footer link.
- **`utm_term`:** originally meant for paid search keywords and rarely needed in email.

The tags matter for email because many mail clients pass no referrer when a link opens. Desktop and mobile apps in particular hand the browser a bare URL, so without parameters an analytics tool has no way to connect the visit to the message that produced it.

The parameters do not change which page loads or how the message is delivered. Only the analytics script on the destination site reads them, so a site without analytics simply ignores them.

## UTM parameters vs click tracking

[Click tracking](/glossary/click-tracking/) and UTM parameters measure different ends of the same click. **Click tracking records the click at the sending platform**, per recipient, by routing the link through a redirect on a [tracking domain](/glossary/tracking-domain/). UTM parameters record the visit on the destination site, where it can be tied to sign-ups and purchases.

The two work together without special setup. A tracking redirect sends the recipient to the original URL, and a tagged URL keeps its query string, so the analytics tool still sees the parameters. Click data answers which recipients clicked, and analytics data answers what those visitors did after they arrived.

## Common problems with UTM parameters

**Inconsistent values split the reports.** Google Analytics treats parameter values as case-sensitive, so `Email` and `email` appear as two separate mediums, and a campaign tagged `spring_launch` in one message and `spring-launch` in another shows up twice. A fixed naming convention, applied through templates rather than typed by hand, keeps the data in one place.

Tagging the wrong links is the second problem. Password resets, email verification and other account messages are not campaigns, and parameters on them mix account traffic into [marketing email](/glossary/marketing-email/) reports. These URLs often carry one-time tokens as well, which analytics tools then store along with the rest of the page address.

Personal data is the most serious mistake. Putting an email address or a customer ID in a parameter such as `utm_content` sends that data to the analytics provider, and Google Analytics policies prohibit sending personally identifiable information to it. A campaign or segment label identifies the email without identifying the person.

## UTM parameters in Lettr

**UTM parameters in Lettr are part of the link URLs themselves**, written into the template or the HTML of the send. Lettr's template language requires a link URL to start with a literal `https://` or `http://` in the template, not inside a variable, for the link to be recognized and tracked. [Merge tags](/glossary/merge-tag/) inside a link URL are URL-encoded by default, so a value inserted with `utm_campaign={{campaign}}` stays valid in the query string, and expressions inside a query string must not contain spaces.

Click tracking works independently of the parameters. Lettr rewrites links to route through its tracking servers, records each click with its timestamp and link URL, and redirects the recipient immediately to the original destination. Each click fires an `engagement.click` webhook event, and the Events dashboard shows the specific URL that was clicked. For campaigns, `GET /campaigns/{campaignId}/events` returns click events with the clicked link in `target_link_url`.

A send request can turn click tracking off with `options.click_tracking: false`, and a single link can opt out with `data-msys-clicktrack="0"`. The [Tracking](https://docs.lettr.com/learn/sending/tracking) page covers the tracking options, and the [Template Language](https://docs.lettr.com/learn/templates/template-language) page covers merge tags in links.
