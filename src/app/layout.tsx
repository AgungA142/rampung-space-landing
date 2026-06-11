import type { Metadata } from "next";
import { Sora, DM_Sans, Space_Mono } from "next/font/google";
import StructuredData from "@/components/seo/StructuredData";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { absoluteUrl, SEO, SITE_URL } from "@/lib/seo";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SEO.title,
    template: `%s | ${SEO.siteName}`,
  },
  description: SEO.description,
  keywords: [...SEO.keywords],
  alternates: {
    canonical: "/",
  },
  authors: [{ name: SEO.siteName, url: SITE_URL }],
  creator: SEO.siteName,
  publisher: SEO.siteName,
  icons: {
    icon: "/rampung_space.png",
    apple: "/rampung_space.png",
  },
  openGraph: {
    title: SEO.title,
    description: SEO.description,
    url: SITE_URL,
    siteName: SEO.siteName,
    type: "website",
    locale: SEO.locale,
    images: [
      {
        url: absoluteUrl("/rampung_space.png"),
        width: 1024,
        height: 1024,
        alt: "Logo rampung.space",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SEO.title,
    description: SEO.description,
    images: [absoluteUrl("/rampung_space.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth" suppressHydrationWarning className={`${sora.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        <StructuredData />
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
