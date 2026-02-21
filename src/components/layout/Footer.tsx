"use client";

import { useMemo } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { BRAND, NAVIGATION } from "@/lib/constants";
import { Braco } from "@/components/braco/Braco";

const socialLinks = [
  { name: "Twitter", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "GitHub", href: "#" },
  { name: "Instagram", href: "#" },
];
/* TODO: Add real social links */

export default function Footer() {
  const { locale, t } = useLanguage();
  const navItems = useMemo(() => NAVIGATION[locale], [locale]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-navy-light border-t border-slate-grey/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <div className="font-[family-name:var(--font-space-mono)] text-pistachio text-xl font-bold">
              rampung<span className="text-pistachio-deep">.</span>space
            </div>
            <p className="text-slate-grey text-sm mt-2">{BRAND.tagline}</p>
            <a
              href={`mailto:${BRAND.email}`}
              className="text-slate-grey hover:text-pistachio text-sm mt-4 inline-block transition-colors"
            >
              {BRAND.email}
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-[family-name:var(--font-sora)] text-sm font-semibold uppercase tracking-wider mb-4">
              {locale === "id" ? "Navigasi" : "Navigation"}
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className="text-slate-grey text-sm hover:text-pistachio transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollTo("#faq")}
                  className="text-slate-grey text-sm hover:text-pistachio transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-[family-name:var(--font-sora)] text-sm font-semibold uppercase tracking-wider mb-4">
              {locale === "id" ? "Ikuti Kami" : "Follow Us"}
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-grey hover:text-pistachio transition-colors text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-grey/10 mt-8 pt-8 flex items-center justify-between">
          <p className="text-slate-grey text-xs">{t.footer.copyright}</p>
          <Braco mood="idle" size={40} showParticles={false} />
        </div>
      </div>
    </footer>
  );
}
