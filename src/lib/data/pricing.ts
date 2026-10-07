// Pricing numbers for the /pricing page. Transactional tiers match the Stripe plans
// the site already advertised; marketing tiers are the lettr_marketing Stripe tiers.

export type Mode = "transactional" | "marketing";
export type PlanKey = "free" | "pro" | "business" | "enterprise";

// ---- Transactional ----

/** Slider stops, in order. `volume` is the headline number shown above the slider. */
export const transactionalSteps = [
  { label: "3k", volume: "3,000", plan: "free" as PlanKey, name: "Free", price: "$0" },
  { label: "50k", volume: "50,000", plan: "pro" as PlanKey, name: "Pro", price: "$15" },
  { label: "100k", volume: "100,000", plan: "pro" as PlanKey, name: "Pro", price: "$30" },
  {
    label: "200k",
    volume: "200,000",
    plan: "business" as PlanKey,
    name: "Business",
    price: "$110",
  },
  {
    label: "500k",
    volume: "500,000",
    plan: "business" as PlanKey,
    name: "Business",
    price: "$250",
  },
  {
    label: "1M",
    volume: "1,000,000",
    plan: "business" as PlanKey,
    name: "Business",
    price: "$450",
  },
  {
    label: "2M+",
    volume: "2,000,000+",
    plan: "enterprise" as PlanKey,
    name: "Enterprise",
    price: "Custom",
  },
];

export interface PlanFeature {
  text: string;
  excluded?: boolean;
}

export interface Plan {
  key: Exclude<PlanKey, "enterprise">;
  name: string;
  price: string;
  blurb: string;
  features: PlanFeature[];
  cta: string;
}

export function transactionalPlans(step: number): Plan[] {
  const pro =
    step <= 1
      ? { price: "$15", blurb: "50K emails · $0.80 / 1,000 extra" }
      : { price: "$30", blurb: "100K emails · $0.80 / 1,000 extra" };
  const business =
    step <= 3
      ? { price: "$110", blurb: "200K emails · $0.80 / 1,000 extra" }
      : step === 4
        ? { price: "$250", blurb: "500K emails · $0.80 / 1,000 extra" }
        : { price: "$450", blurb: "1M emails · $0.80 / 1,000 extra" };
  return [
    {
      key: "free",
      name: "Free",
      price: "$0",
      blurb: "3,000 emails/month · 100/day",
      features: [
        { text: "3,000 emails per month" },
        { text: "100 emails per day" },
        { text: "1 sending domain" },
        { text: "Email API & SMTP" },
        { text: "Basic analytics" },
        { text: "7-day data retention" },
      ],
      cta: "Start for free",
    },
    {
      key: "pro",
      name: "Pro",
      ...pro,
      features: [
        { text: "Up to 10 sending domains" },
        { text: "1 inbound route" },
        { text: "Up to 10 webhook endpoints" },
        { text: "No daily sending limit" },
        { text: "Advanced analytics" },
        { text: "30-day data retention" },
        { text: "No dedicated IPs", excluded: true },
      ],
      cta: "Get started",
    },
    {
      key: "business",
      name: "Business",
      ...business,
      features: [
        { text: "Unlimited sending domains" },
        { text: "10 inbound routes" },
        { text: "Unlimited webhook endpoints" },
        { text: "Everything in Pro" },
        { text: "30-day data retention" },
        { text: "Dedicated IPs (add-on)" },
        { text: "Priority support" },
        { text: "Dedicated account manager" },
        { text: "Deliverability consultation" },
      ],
      cta: "Get started",
    },
  ];
}

export type CellValue = string | boolean;

export const comparisonRows: {
  feature: string;
  values: [CellValue, CellValue, CellValue, CellValue];
}[] = [
  { feature: "Monthly emails", values: ["3,000", "100K emails", "200K emails", "Unlimited"] },
  { feature: "Daily limit", values: ["100 / day", "No limit", "No limit", "No limit"] },
  { feature: "Sending domains", values: ["1 domain", "10 domains", "Unlimited", "Unlimited"] },
  { feature: "Inbound routes", values: [false, "1", "10", "Unlimited"] },
  { feature: "Webhook endpoints", values: ["1", "10", "Unlimited", "Unlimited"] },
  { feature: "Email API & SMTP", values: [true, true, true, true] },
  { feature: "Analytics", values: ["Basic", "Advanced", "Advanced", "Advanced"] },
  { feature: "Data retention", values: ["7 days", "30 days", "30 days", "90 days"] },
  { feature: "Team members", values: [true, true, true, true] },
  { feature: "Dedicated IPs", values: [false, false, "Add-on", true] },
  { feature: "Priority support", values: [false, false, true, true] },
  { feature: "SLA guarantee", values: [false, false, false, true] },
];

// ---- Marketing ----

export const marketingSteps = [
  { label: "500", volume: "500", price: "$0", contacts: "500 contacts" },
  { label: "2k", volume: "2,000", price: "$10", contacts: "2,000 contacts" },
  { label: "5k", volume: "5,000", price: "$30", contacts: "5,000 contacts" },
  { label: "10k", volume: "10,000", price: "$50", contacts: "10,000 contacts" },
  { label: "15k", volume: "15,000", price: "$75", contacts: "15,000 contacts" },
  { label: "20k", volume: "20,000", price: "$100", contacts: "20,000 contacts" },
  { label: "30k", volume: "30,000", price: "$140", contacts: "30,000 contacts" },
  { label: "40k+", volume: "40,000+", price: "$180", contacts: "40,000 contacts" },
];

export const marketingFeatures = [
  "Unlimited campaigns",
  "Drag-and-drop editor",
  "Lists & segments",
  "Advanced analytics",
];
