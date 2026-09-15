import type { ChangelogMonth } from "../types";

export const month: ChangelogMonth = {
  id: "2026-07",
  published: "2026-07-24",

  features: [
    {
      title: "Adamko Builds A Branded Set Of Transactional Emails",
      modules: ["platform", "transactional"],
      tags: ["AI"],
      lead:
        "Describe what your product does and he picks the transactional emails that suit it, then" +
        " builds each one in your colors, your fonts and your logo.",
      body: [
        "He starts from our premade bases and restyles them rather than generating markup from" +
          " nothing. That was a deliberate call. Email clients are genuinely hostile and the" +
          " premades have already been through them; asking a language model to invent nested" +
          " table markup that survives Outlook is a bet we did not want to place. The theming" +
          " that follows is deterministic rather than model-driven, and one design family is" +
          " chosen per team and then held, so your transactional emails and your campaign drafts" +
          " do not drift apart.",
        "The copy comes back in your website's language rather than in English, subject lines" +
          " included. Czech site, Czech emails. The brand kit had been detecting the site language" +
          " all along and nothing was consuming it. For a European company that was never really" +
          " optional, and out of everything here it is the piece we are happiest to have got to." +
          " A translation that fails keeps the English original rather than handing you half a" +
          " translated email.",
        "Generation runs in the background, because it cannot do anything else: the whole chain" +
          " takes minutes and a request is killed long before that. The first version showed" +
          " three bouncing dots and no sign of whether the job was still alive. It always was," +
          " but nobody watching could have told you that, which is why there is now a progress" +
          " bar and a rough countdown that stops short of claiming it has finished.",
        "The Emails list shows the same thing happening. The emails you picked appear immediately" +
          " as real rows with a Finalizing badge and an animated placeholder, rather than" +
          " materialising one at a time. A row that is still being worked on cannot be opened," +
          " because editing it would race the job still writing to it.",
      ],
      docs: {
        label: "Content creation",
        href: "https://docs.lettr.com/learn/ai-assistant/content-creation",
      },
    },
    {
      title: "A Brand Kit Read From Your Website",
      modules: ["platform"],
      tags: ["AI"],
      lead: "Give Adamko a URL and he reads the site for its colors, fonts and logo.",
      body: [
        "That was much harder than it sounds. An early attempt collected every color on the page" +
          " and concluded that a company's palette was mostly the grey of a disabled control plus" +
          " whatever blue the browser paints behind selected text. It was extremely confident" +
          " about this. Interaction states are now weighted down rather than trusted at face" +
          " value — though not removed outright, because deleting them cost dark-themed sites" +
          " their actual accent color.",
        "Several other things had to be taught. A site declaring a color by name matched nothing" +
          " at all, so extraction fell through to guessing by frequency. A framework's own" +
          " palette, compiled into the site's stylesheet, would outvote the brand — on one site" +
          " two stock theme colors tied exactly, and which one won was decided by nothing more" +
          " than the order they happened to be listed in. A single decorative gradient could beat" +
          " a color used fourteen times.",
        "Fonts had their own problem. A site builder ships its entire font catalogue whether or" +
          " not the page uses any of it, and a stylesheet lists fallbacks besides, so reading the" +
          " CSS tells you what a site would like to render in rather than what a visitor has" +
          " actually seen. Ranking now prefers the families that are both declared and genuinely" +
          " loaded.",
        "Logos are often not images at all. Many sites draw their mark as inline vector artwork," +
          " so there is nothing to download; that artwork is now found through the link that" +
          " points back at the homepage and turned into a proper standalone file. Looking for the" +
          " word “logo” instead finds things like `search-logo` and `close-logo`.",
      ],
    },
    {
      title: "Everything Adamko Creates Can Be Undone",
      modules: ["platform"],
      tags: ["AI", "Security"],
      lead:
        "Every template, campaign, brand kit, domain, API key and property he touches lands in an" +
        " activity view, and anything he made can be reversed from that one place.",
      body: [
        "We wrote the undo before we wrote most of the generation, because nobody should hand an" +
          " assistant write access to their account without a cheap way back out. It shipped" +
          " nineteen days before the work it protects.",
        "Each entry carries the prompt that caused it, and a bulk operation is one row with a" +
          " count rather than five you have to piece together. What is safe to undo is decided on" +
          " our side, per type: a campaign has to still be an untouched draft, a template" +
          " untouched including its versions, a sending domain not yet verified — because" +
          " verifying it means you adopted it — and an API key still present. When something" +
          " cannot be undone you get the reason rather than a failure, and the log entry survives" +
          " either way.",
      ],
      docs: {
        label: "Activity log and undo",
        href: "https://docs.lettr.com/learn/ai-assistant/activity-log-and-undo",
      },
    },
    {
      title: "Adamko Reads Your Account, And Advises On What He Finds",
      modules: ["platform", "transactional", "campaigns"],
      tags: ["AI", "Deliverability"],
      lead:
        "A set of read-only tools closed the “I cannot see that” dead ends, and a set of advisory" +
        " ones turn what he reads into an answer.",
      body: [
        "He can now look at your plan and quota, templates, API keys, webhooks with their last" +
          " success and failure, team members and pending invitations, per-message delivery" +
          " events, API request logs, a contact and its history, import history, and the real" +
          " suppression list including whether one specific recipient is on it. API keys come" +
          " back as metadata only; the key itself is never serialised.",
        "On top of that: ask why a particular address did not get your email and you get one" +
          " classified cause — suppressed, complained, hard bounced, blocked by the provider," +
          " delayed, rejected at send, still in flight, or delivered — with the evidence and what" +
          " to do, rather than three tool calls you have to chain yourself. He will review a" +
          " template for broken merge tags, a missing unsubscribe link, images with no alt text," +
          " fixed widths that break on phones, a body large enough for Gmail to clip it, and" +
          " subject lines that will read as spam. He will compare recent campaigns, recommend a" +
          " list or segment for a stated goal while explaining the reach-against-engagement" +
          " tradeoff, and sketch a lifecycle or campaign plan that fits inside the sending quota" +
          " you actually have left.",
        "Rates come back as unknown rather than as a confident 0% when there is nothing to divide" +
          " by, and he is explicitly forbidden from claiming he scheduled something, because no" +
          " tool of his can.",
      ],
      docs: {
        label: "Troubleshooting and diagnostics",
        href: "https://docs.lettr.com/learn/ai-assistant/troubleshooting-and-diagnostics",
      },
    },
    {
      title: "Adamko Helps You Import A CSV",
      modules: ["audience"],
      tags: ["AI"],
      lead:
        "Drop a file on the chat and it goes straight to the import flow as an attachment — the" +
        " model never receives it.",
      body: [
        "On the mapping step, unmapped columns offer a review that names what is actually wrong" +
          " with your file: no email column, invalid addresses, duplicates inside the file," +
          " contacts you already have, no consent signal, statuses it does not recognise —" +
          " quoting the real values it found. Asking him to map them opens a confirmation" +
          " explaining which custom fields will be created and with what type, which existing" +
          " ones get reused, and how your status column will be read. Every field he creates is" +
          " recorded with an undo.",
      ],
      docs: {
        label: "Audience and imports",
        href: "https://docs.lettr.com/learn/ai-assistant/audience-and-imports",
      },
    },
    {
      title: "Secrets And Personal Data Are Stripped Before Any AI Request",
      modules: ["platform"],
      tags: ["AI", "Security"],
      lead:
        "Redaction moved to the wire, so it covers every AI feature in the product rather than" +
        " each one separately.",
      body: [
        "Keys, bearer tokens, private keys and long secret-shaped strings are masked" +
          " irreversibly, in system prompts, your messages, the assistant's history and tool" +
          " results alike. Recipient details inside email HTML are replaced with stable" +
          " placeholders that are put back in the response, so an “edit this HTML” round trip" +
          " does not come back full of tokens.",
        "Details in ordinary conversation are deliberately left alone — asking why delivery to a" +
          " named address bounced cannot work if the address is removed on the way — and that" +
          " transfer is covered in the data processing agreement. Two older editor AI endpoints" +
          " that predate Adamko were brought under the same access model, throttle and spend cap" +
          " at the same time.",
      ],
      docs: {
        label: "Privacy and limits",
        href: "https://docs.lettr.com/learn/ai-assistant/privacy-and-limits",
      },
    },
    {
      title: "Daily DNS Health Checks On Every Domain",
      modules: ["platform"],
      tags: ["Deliverability"],
      lead:
        "Verified domains are re-checked once a day, and you are told when one stops resolving or" +
        " stops pointing at us.",
      body: [
        "A domain that verified months ago and quietly broke since used to go unnoticed until a" +
          " send failed. The check is strictly read-only and never writes a status back, so" +
          " monitoring cannot disable a live domain. A control lookup runs first, because every" +
          " failed lookup otherwise reads as “the record is gone” and one sick resolver would" +
          " page every customer at once.",
        "Broken records show in the app as well as arriving by email — on the dashboard, and as a" +
          " badge on the domain, email and campaign lists saying which records are failing and" +
          " for how long. A team with several broken domains gets one digest rather than one" +
          " email per domain.",
      ],
      docs: {
        label: "Alerts",
        href: "https://docs.lettr.com/learn/settings/alerts",
      },
    },
  ],

  improvements: [
    {
      title: "Adamko Speaks Up When Something Is Wrong",
      modules: ["platform"],
      tags: ["AI"],
      lead:
        "Five situations now raise a single inline notice on the relevant page without being" +
        " asked: a failing domain, a bounce spike, a stalled setup, a missing API key, and a" +
        " draft he started that nobody came back to.",
      body: [
        "The restraint is enforced on our side rather than in the browser. At most one notice per" +
          " place, dismissals stick for days or weeks depending on the type, a domain dismissed" +
          " by one teammate goes quiet for everyone, and dismissing three in a week buys you" +
          " silence for a while.",
      ],
    },
    {
      title: "Guided Walkthroughs Cover The Whole Job",
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      lead:
        "The add-domain tour used to stop at the first record while the reply told you to add" +
        " three more.",
      body: [
        "It now walks DKIM, CNAME, SPF, DMARC and verification in order, skipping the card a" +
          " given domain type structurally does not have instead of stalling on an anchor that" +
          " will never appear. Tracking, inbound and storage domains reached the same standard —" +
          " storage had no walkthrough at all. A record step now completes when you copy the" +
          " value rather than only when you click the text, which is the inverse of how anyone" +
          " actually uses it.",
      ],
    },
    {
      title: "Adamko's Answers Are Easier To Act On",
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      lead:
        "Naming a section in an answer now offers a link to it, instead of bolding the name and" +
        " leaving you to ask.",
      body: [
        "Destinations still resolve on our side from a fixed list, so the model never writes a" +
          " URL. Links stay clickable in later turns and survive a reload rather than being wiped" +
          " by your next message. Every answer has a copy button, tables render as tables instead" +
          " of arriving as pipe characters, and the composer grows as you type.",
      ],
    },
    {
      title: "Onboarding Survives A Refresh",
      modules: ["platform"],
      tags: ["AI"],
      lead:
        "The cards attached to Adamko's replies — the brand kit preview, the email picker, the" +
        " API key, the domain — used to vanish on reload, leaving plain text behind.",
      body: [
        "They are stored in a redacted form and restored in a finished state: a restored key card" +
          " is masked and has no copy button. The API key itself is still never written to the" +
          " database. The email picker also stopped hiding how much it was offering — it names" +
          " how many of the available emails it will create, and the next option peeks out below" +
          " the fold, because most people were only ever creating the preselected batch.",
      ],
    },
    {
      title: "Adamko's Data Windows Are Honest",
      modules: ["platform"],
      tags: ["AI", "Deliverability"],
      lead:
        "He claimed 90 days everywhere, while one of the sources behind that answer only keeps" +
        " about ten.",
      body: [
        "Past that point the underlying call simply failed, nothing caught it, and the whole" +
          " answer died with “something went wrong on my side”. Trends still cover the full" +
          " window; recent examples are limited to what actually exists and say so, and a failure" +
          " there costs you the examples rather than the verdict.",
      ],
    },
    {
      title: "Editing A Synced Section Versions The Emails It Changes",
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      lead:
        "Every email using a synced header or footer already re-rendered; each now gets a new" +
        " version rather than being overwritten in place.",
      body: [
        "The editor offers to publish them together, or to leave them as drafts until you have" +
          " looked.",
      ],
    },
    {
      title: "Creating A Marketing Email Opens The Editor",
      modules: ["campaigns"],
      tags: ["UI/UX"],
      lead:
        "Both the grid and the list open the editor on click, so the detail page in between was a" +
        " detour.",
      body: [
        "Saving now lands you on the newest version rather than an older one, and the folder" +
          " picker only offers folders of the kind you are browsing.",
      ],
    },
  ],

  bugfixes: [
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed one-time codes failing for everyone in production. Codes were stored as bare" +
        " numbers, so `042931` came back as `42931` and could never match again — which meant" +
        " every action behind a code, including changing a password, changing an email address," +
        " setting up two-factor and deleting a team, rejected every correct code as invalid or" +
        " expired.",
    },
    {
      modules: ["platform"],
      tags: ["Security"],
      text:
        "Fixed the resend cooldown on those codes leaving you with no code at all: the ten-second" +
        " limit stopped the send before a code had been generated, and verifying one cleared the" +
        " code without clearing the cooldown. The endpoint reported success regardless, so" +
        " nothing on screen showed it. The code email also got its own queue, so it can no longer" +
        " arrive after expiring from behind a backlog of other mail.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed deleting a folder permanently deleting every email inside it, against a dialog" +
        " that explicitly promised the opposite. Emails now move to another folder of their own" +
        " kind before the folder is removed, so a folder holding both transactional and marketing" +
        " emails is split correctly rather than taken down with it.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed moving a marketing email into a folder looking as though it had been duplicated —" +
        " the copy at the top level was the same email listed twice. That is how one report" +
        " ended with a template deleted along with the folder.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed duplicating a marketing email always producing a transactional copy, whichever" +
        " folder was chosen, which left it sitting in a campaign folder and missing from the" +
        " campaigns list. The copy now takes its kind from the folder you put it in.",
    },
    {
      modules: ["transactional"],
      tags: ["Deliverability"],
      text:
        "Fixed open rates above 100% on the dashboard and in tag stats. Opens are bucketed by" +
        " when they happened, so opens of emails sent before the window could outnumber the sends" +
        " inside it.",
    },
    {
      modules: ["platform"],
      tags: ["UI/UX"],
      text:
        "Fixed a double-click on Sign up creating two accounts, or a server error. The form's own" +
        " guard only engaged once the request was sent, leaving the button live during the check" +
        " that runs first.",
    },
    {
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      text:
        "Fixed the whole screen flashing and the assistant panel jumping every time Adamko" +
        " navigated you somewhere — raised as a problem for anyone sensitive to flashing. Each" +
        " page was rebuilding the drawer's overlay and slide-in from scratch; it now stays put" +
        " while the page behind it changes.",
    },
    {
      modules: ["transactional", "campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the editor's file manager listing only the first thousand files in a folder," +
        " reporting a successful delete for a file that reappeared on the next listing, and" +
        " writing uploads into a made-up top-level folder when you uploaded from inside a" +
        " subfolder.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed pasting a URL into the chat coming back with “please try again in a moment”." +
        " Adamko held a page-fetch tool whose outbound call reliably failed, and the failure" +
        " surfaced as a generic error. He now says plainly that he cannot open external pages," +
        " and offers to build a brand kit from your own site instead, which is a different and" +
        " working path.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed Adamko naming his own internal tooling in a reply — offering to “pull the result" +
        " with `get_brand_kit`”, which means nothing to anyone outside the codebase. It was" +
        " written into a tool result rather than invented.",
    },
    {
      modules: ["platform"],
      tags: ["AI"],
      text:
        "Fixed a walkthrough reply repeating its closing sentence. An earlier attempt only caught" +
        " byte-identical copies, so a curly quote, a capital letter or a stray emphasis was" +
        " enough to slip past it. Genuinely different closing sentences are still left alone.",
    },
    {
      modules: ["platform"],
      tags: ["AI", "UI/UX"],
      text:
        "Fixed the closing “Guide me” button merging into the paragraph above it in" +
        " non-English replies, stranding one English label inside a block of another language.",
    },
    {
      modules: ["campaigns"],
      tags: ["UI/UX"],
      text:
        "Fixed the campaigns list not scrolling, and the email preview collapsing to nothing when" +
        " the window is too narrow for a side-by-side layout.",
    },
  ],
};
