import { BRAND } from "@/lib/constants";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rampung.space";

export const SITE_URL = rawSiteUrl.replace(/\/$/, "");

export const SEO = {
  siteName: BRAND.name,
  title: "rampung.space - Software House untuk MVP, Web App, dan Mobile App",
  description:
    "rampung.space membantu founder, UMKM, dan tim bisnis membangun MVP, web application, mobile app Android, dan konsultasi teknis dari ide awal sampai produk siap rilis.",
  keywords: [
    "software house Indonesia",
    "jasa pembuatan MVP",
    "MVP development",
    "web application development",
    "mobile app development",
    "jasa pembuatan aplikasi",
    "konsultasi teknologi",
    "rampung space",
  ],
  email: BRAND.email,
  instagram: "https://www.instagram.com/rampung_space",
  locale: "id_ID",
} as const;

export const SERVICES = [
  {
    name: "MVP Development",
    description:
      "Pengembangan minimum viable product untuk validasi ide bisnis dengan produk nyata yang siap diuji pasar.",
  },
  {
    name: "Web Application Development",
    description:
      "Pengembangan aplikasi web modern, responsif, dan scalable untuk kebutuhan operasional atau produk digital.",
  },
  {
    name: "Mobile App Development",
    description:
      "Pengembangan aplikasi mobile Android yang performant dan mudah digunakan.",
  },
  {
    name: "Tech Consultation",
    description:
      "Konsultasi teknis untuk menentukan scope, stack, arsitektur, timeline, dan prioritas pengembangan produk.",
  },
] as const;

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

