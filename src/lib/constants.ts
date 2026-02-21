export const BRAND = {
  name: "rampung.space",
  tagline: "Make Space. Get Rampung.",
  email: "hello@rampung.space",
  copyright: `© ${new Date().getFullYear()} rampung.space — Make Space. Get Rampung.`,
} as const;

export const COLORS = {
  pistachio: "#A8E66E",
  pistachioDeep: "#6B9B4E",
  pistachioLight: "#C4F09A",
  slateGrey: "#7A8999",
  midnight: "#0F1923",
  navy: "#141E2B",
  navyLight: "#1A2736",
} as const;

export const NAVIGATION = {
  id: [
    { label: "Layanan", href: "#layanan" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Tentang Kami", href: "#tentang" },
  ],
  en: [
    { label: "Services", href: "#layanan" },
    { label: "How It Works", href: "#cara-kerja" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About Us", href: "#tentang" },
  ],
} as const;

export const SCORING = {
  budget: {
    idr: [
      { max: 10_000_000, score: 1 },
      { max: 50_000_000, score: 2 },
      { max: 150_000_000, score: 3 },
      { max: 500_000_000, score: 4 },
      { max: Infinity, score: 5 },
    ],
    usd: [
      { max: 700, score: 1 },
      { max: 3_500, score: 2 },
      { max: 10_000, score: 3 },
      { max: 35_000, score: 4 },
      { max: Infinity, score: 5 },
    ],
  },
  platform: {
    web_app: 2,
    mobile_android: 3,
    other: 3,
  },
  targetUser: {
    internal: 1,
    b2b: 2,
    b2c: 4,
    marketplace: 5,
    unknown: 0,
  },
  featureWeights: {
    auth: 1,
    payment: 3,
    realtime: 3,
    dashboard: 2,
    file_upload: 1,
    third_party_api: 2,
    admin_panel: 2,
    geolocation: 2,
  },
  featureNormalization: [
    { max: 3, score: 1 },
    { max: 6, score: 2 },
    { max: 9, score: 3 },
    { max: 12, score: 4 },
    { max: Infinity, score: 5 },
  ],
  timeline: {
    urgent: 5,
    normal: 3,
    flexible: 2,
    long_term: 1,
    undecided: 0,
  },
  complexity: [
    { max: 8, level: "Low" as const },
    { max: 14, level: "Medium" as const },
    { max: 19, level: "High" as const },
    { max: Infinity, level: "Enterprise" as const },
  ],
} as const;
