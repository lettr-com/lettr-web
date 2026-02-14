export interface PricingTier {
	volume: string;
	lettrPrice: number;
	competitorPrice: number;
}

export interface ProviderFeature {
	label: string;
	iconName: string;
	description: string;
	learnMoreUrl?: string;
	lettr: boolean;
	competitor: boolean;
	competitorNote?: string;
}

export interface ProviderData {
	name: string;
	slug: string;
	logo: string;
	tagline: string;
	description: string;
	averageSavings: number;
	pricingTiers: PricingTier[];
	features: ProviderFeature[];
}

export const providers: Record<string, ProviderData> = {
	resend: {
		name: 'Resend',
		slug: 'resend',
		logo: '/images/compare/resend.svg',
		tagline: 'Move beyond basic email APIs',
		description:
			'Resend offers a clean developer experience for sending emails, but Lettr goes further with built-in per-email analytics, a professional template builder, secure infrastructure, and proactive deliverability monitoring.',
		averageSavings: 46,
		pricingTiers: [
			{ volume: '50,000', lettrPrice: 15, competitorPrice: 20 },
			{ volume: '100,000', lettrPrice: 30, competitorPrice: 90 }
		],
		features: [
			{
				label: 'Per-email statistics',
				iconName: 'ChartBar',
				description:
					'Track opens, clicks, bounces, and deliverability for every single email — not just aggregated metrics.',
				lettr: true,
				competitor: false,
				competitorNote: 'Only aggregated domain-level stats'
			},
			{
				label: 'State-of-the-art template builder',
				iconName: 'PaintBrush',
				description:
					'Drag-and-drop editor with AI copy assistance, 200+ templates, and two-way Blade sync. No more wrestling with HTML tables.',
				lettr: true,
				competitor: false,
				competitorNote: 'Simple email editor'
			},
			{
				label: 'Secure tracking domains',
				iconName: 'ShieldCheck',
				description:
					'Custom tracking domains with full HTTPS support. Your brand, your domain — no third-party redirects leaking data.',
				lettr: true,
				competitor: false,
				competitorNote: 'No custom tracking domains'
			},
			{
				label: 'Secure storage with custom domains',
				iconName: 'Lock',
				description:
					'Store email content securely on your own custom domain. Full data ownership with encrypted storage and EU hosting options.',
				lettr: true,
				competitor: false,
				competitorNote: 'Generic email storage'
			},
			{
				label: 'Smart deliverability alerts',
				iconName: 'Bell',
				description:
					'Get notified instantly when bounce rates spike, domains get blocklisted, or reputation drops — before it impacts your users.',
				lettr: true,
				competitor: false,
				competitorNote: 'No proactive alerting'
			},
			{
				label: 'AMP for Email',
				iconName: 'Lightning',
				description:
					'Send interactive, dynamic emails with AMP — let recipients take action, browse content, and respond directly inside their inbox.',
				learnMoreUrl: 'https://amp.dev/about/email.html',
				lettr: true,
				competitor: false,
				competitorNote: 'No AMP for Email support'
			},
			{
				label: 'Rich template language',
				iconName: 'CodeBlock',
				description:
					'Full-featured template syntax with conditionals, loops, arithmetic and relational operators, macros, dynamic content, and reusable snippets — all built in.',
				lettr: true,
				competitor: false,
				competitorNote: 'Only primitive variable substitution'
			}
		]
	},
	postmark: {
		name: 'Postmark',
		slug: 'postmark',
		logo: '/images/compare/postmark.svg',
		tagline: 'Everything Postmark does, and more',
		description:
			'Postmark is known for reliable transactional email delivery, but Lettr combines that same reliability with a full-featured template builder, granular per-email analytics, and smart deliverability alerts — all in one platform.',
		averageSavings: 75,
		pricingTiers: [
			{ volume: '50,000', lettrPrice: 15, competitorPrice: 60 },
			{ volume: '100,000', lettrPrice: 30, competitorPrice: 126 }
		],
		features: [
			{
				label: 'Per-email statistics',
				iconName: 'ChartBar',
				description:
					'Track opens, clicks, bounces, and deliverability for every single email — not just aggregated metrics.',
				lettr: true,
				competitor: false,
				competitorNote: 'Stats limited to streams and tags'
			},
			{
				label: 'State-of-the-art template builder',
				iconName: 'PaintBrush',
				description:
					'Drag-and-drop editor with AI copy assistance, 200+ templates, and two-way Blade sync. No more wrestling with HTML tables.',
				lettr: true,
				competitor: false,
				competitorNote: 'Basic code-only templates'
			},
			{
				label: 'Secure tracking domains',
				iconName: 'ShieldCheck',
				description:
					'Custom tracking domains with full HTTPS support. Your brand, your domain — no third-party redirects leaking data.',
				lettr: true,
				competitor: false,
				competitorNote: 'Tracking domains without HTTPS'
			},
			{
				label: 'Secure storage with custom domains',
				iconName: 'Lock',
				description:
					'Store email content securely on your own custom domain. Full data ownership with encrypted storage and EU hosting options.',
				lettr: true,
				competitor: false,
				competitorNote: 'No custom domain storage'
			},
			{
				label: 'Smart deliverability alerts',
				iconName: 'Bell',
				description:
					'Get notified instantly when bounce rates spike, domains get blocklisted, or reputation drops — before it impacts your users.',
				lettr: true,
				competitor: false,
				competitorNote: 'Basic bounce notifications only'
			},
			{
				label: 'AMP for Email',
				iconName: 'Lightning',
				description:
					'Send interactive, dynamic emails with AMP — let recipients take action, browse content, and respond directly inside their inbox.',
				learnMoreUrl: 'https://amp.dev/about/email.html',
				lettr: true,
				competitor: false,
				competitorNote: 'No AMP for Email support'
			}
		]
	},
	sendgrid: {
		name: 'SendGrid',
		slug: 'sendgrid',
		logo: '/images/compare/sendgrid.svg',
		tagline: 'A modern alternative to SendGrid',
		description:
			'SendGrid has been around for years, but its complexity and legacy architecture show their age. Lettr offers a cleaner developer experience with per-email analytics, a modern template builder, and proactive deliverability monitoring.',
		averageSavings: 62,
		pricingTiers: [
			{ volume: '50,000', lettrPrice: 15, competitorPrice: 34.95 },
			{ volume: '100,000', lettrPrice: 30, competitorPrice: 89.95 }
		],
		features: [
			{
				label: 'Per-email statistics',
				iconName: 'ChartBar',
				description:
					'Track opens, clicks, bounces, and deliverability for every single email — not just aggregated metrics.',
				lettr: true,
				competitor: false,
				competitorNote: 'Only category-level aggregated stats'
			},
			{
				label: 'State-of-the-art template builder',
				iconName: 'PaintBrush',
				description:
					'Drag-and-drop editor with AI copy assistance, 200+ templates, and two-way Blade sync. No more wrestling with HTML tables.',
				lettr: true,
				competitor: false,
				competitorNote: 'Outdated and clunky editor'
			},
			{
				label: 'Secure tracking domains',
				iconName: 'ShieldCheck',
				description:
					'Custom tracking domains with full HTTPS support. Your brand, your domain — no third-party redirects leaking data.',
				lettr: true,
				competitor: false,
				competitorNote: 'Tracking domains require manual SSL setup'
			},
			{
				label: 'Secure storage with custom domains',
				iconName: 'Lock',
				description:
					'Store email content securely on your own custom domain. Full data ownership with encrypted storage and EU hosting options.',
				lettr: true,
				competitor: false,
				competitorNote: 'No custom domain storage option'
			},
			{
				label: 'Smart deliverability alerts',
				iconName: 'Bell',
				description:
					'Get notified instantly when bounce rates spike, domains get blocklisted, or reputation drops — before it impacts your users.',
				lettr: true,
				competitor: false,
				competitorNote: 'Requires higher-tier plans for alerts'
			}
		]
	},
	mailgun: {
		name: 'Mailgun',
		slug: 'mailgun',
		logo: '/images/compare/mailgun.svg',
		tagline: 'More than just an email API',
		description:
			'Mailgun offers solid email infrastructure, but Lettr goes beyond API-only workflows with an integrated template builder, per-email analytics, and smart alerts — so you spend less time debugging and more time building.',
		averageSavings: 59,
		pricingTiers: [
			{ volume: '50,000', lettrPrice: 15, competitorPrice: 35 },
			{ volume: '100,000', lettrPrice: 30, competitorPrice: 75 }
		],
		features: [
			{
				label: 'Per-email statistics',
				iconName: 'ChartBar',
				description:
					'Track opens, clicks, bounces, and deliverability for every single email — not just aggregated metrics.',
				lettr: true,
				competitor: false,
				competitorNote: 'Event-based logs, no per-email dashboard'
			},
			{
				label: 'State-of-the-art template builder',
				iconName: 'PaintBrush',
				description:
					'Drag-and-drop editor with AI copy assistance, 200+ templates, and two-way Blade sync. No more wrestling with HTML tables.',
				lettr: true,
				competitor: false,
				competitorNote: 'Basic HTML template storage only'
			},
			{
				label: 'Secure tracking domains',
				iconName: 'ShieldCheck',
				description:
					'Custom tracking domains with full HTTPS support. Your brand, your domain — no third-party redirects leaking data.',
				lettr: true,
				competitor: false,
				competitorNote: 'HTTPS tracking requires extra configuration'
			},
			{
				label: 'Secure storage with custom domains',
				iconName: 'Lock',
				description:
					'Store email content securely on your own custom domain. Full data ownership with encrypted storage and EU hosting options.',
				lettr: true,
				competitor: false,
				competitorNote: 'No custom domain storage'
			},
			{
				label: 'Smart deliverability alerts',
				iconName: 'Bell',
				description:
					'Get notified instantly when bounce rates spike, domains get blocklisted, or reputation drops — before it impacts your users.',
				lettr: true,
				competitor: false,
				competitorNote: 'Alerting only on higher-tier plans'
			}
		]
	},
	mailersend: {
		name: 'MailerSend',
		slug: 'mailersend',
		logo: '/images/compare/mailersend.svg',
		tagline: 'Built for developers who care about email',
		description:
			'MailerSend provides a developer-friendly email service, but Lettr offers deeper analytics at the individual email level, a more powerful template builder with AI assistance, and proactive deliverability monitoring built in from day one.',
		averageSavings: 78,
		pricingTiers: [
			{ volume: '50,000', lettrPrice: 15, competitorPrice: 88 },
			{ volume: '100,000', lettrPrice: 30, competitorPrice: 112 }
		],
		features: [
			{
				label: 'Per-email statistics',
				iconName: 'ChartBar',
				description:
					'Track opens, clicks, bounces, and deliverability for every single email — not just aggregated metrics.',
				lettr: true,
				competitor: false,
				competitorNote: 'Analytics at domain level only'
			},
			{
				label: 'State-of-the-art template builder',
				iconName: 'PaintBrush',
				description:
					'Drag-and-drop editor with AI copy assistance, 200+ templates, and two-way Blade sync. No more wrestling with HTML tables.',
				lettr: true,
				competitor: false,
				competitorNote: 'Basic drag-and-drop editor, no AI or Blade sync'
			},
			{
				label: 'Secure tracking domains',
				iconName: 'ShieldCheck',
				description:
					'Custom tracking domains with full HTTPS support. Your brand, your domain — no third-party redirects leaking data.',
				lettr: true,
				competitor: false,
				competitorNote: 'Limited tracking domain customization'
			},
			{
				label: 'Secure storage with custom domains',
				iconName: 'Lock',
				description:
					'Store email content securely on your own custom domain. Full data ownership with encrypted storage and EU hosting options.',
				lettr: true,
				competitor: false,
				competitorNote: 'No custom domain storage'
			},
			{
				label: 'Smart deliverability alerts',
				iconName: 'Bell',
				description:
					'Get notified instantly when bounce rates spike, domains get blocklisted, or reputation drops — before it impacts your users.',
				lettr: true,
				competitor: false,
				competitorNote: 'No proactive deliverability alerting'
			},
			{
				label: 'AMP for Email',
				iconName: 'Lightning',
				description:
					'Send interactive, dynamic emails with AMP — let recipients take action, browse content, and respond directly inside their inbox.',
				learnMoreUrl: 'https://amp.dev/about/email.html',
				lettr: true,
				competitor: false,
				competitorNote: 'No AMP for Email support'
			},
			{
				label: 'Rich template language',
				iconName: 'CodeBlock',
				description:
					'Full-featured template syntax with conditionals, loops, arithmetic and relational operators, macros, dynamic content, and reusable snippets — all built in.',
				lettr: true,
				competitor: false,
				competitorNote: 'Only basic variable substitution with defaults'
			}
		]
	}
};

export const providerList = Object.values(providers);
export const providerSlugs = Object.keys(providers);
