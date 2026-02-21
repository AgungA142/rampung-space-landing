import type { Metadata } from "next";
import { Sora, DM_Sans, Space_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
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
  title: "rampung.space — Make Space. Get Rampung.",
  description:
    "Dari ide mentah ke produk siap rilis. Kami bantu wujudkan software impianmu — tuntas, tanpa ribet.",
  keywords: [
    "software house",
    "MVP development",
    "web development",
    "mobile app",
    "rampung space",
  ],
  openGraph: {
    title: "rampung.space — Make Space. Get Rampung.",
    description:
      "Dari ide mentah ke produk siap rilis. Kami bantu wujudkan software impianmu — tuntas, tanpa ribet.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${sora.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
