"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Button } from "@/components/ui/Button";
import { NAVIGATION } from "@/lib/constants";

const SECTION_IDS = ["layanan", "cara-kerja", "portfolio", "tentang"];

export default function Navbar() {
  const { locale, setLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const activeSection = useActiveSection(SECTION_IDS);

  const navItems = useMemo(() => NAVIGATION[locale], [locale]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const scrollTo = (href: string) => {
    setDrawerOpen(false);
    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-midnight/95 backdrop-blur-md border-b border-slate-grey/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <button
            onClick={() => scrollTo("#top")}
            className="font-[family-name:var(--font-space-mono)] font-bold text-lg md:text-xl cursor-pointer"
          >
            <span className="text-pistachio">rampung</span>
            <span className="text-pistachio-deep">.</span>
            <span className="text-pistachio">space</span>
          </button>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              return (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`relative text-sm font-[family-name:var(--font-dm-sans)] transition-colors cursor-pointer ${
                    isActive ? "text-pistachio" : "text-slate-grey hover:text-pistachio"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-pistachio transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <div className="flex items-center bg-navy-light rounded-full p-0.5">
              {(["id", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`relative px-3 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer uppercase ${
                    locale === l ? "text-midnight" : "text-slate-grey hover:text-white"
                  }`}
                >
                  {locale === l && (
                    <motion.div
                      layoutId="lang-indicator"
                      className="absolute inset-0 bg-pistachio rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{l.toUpperCase()}</span>
                </button>
              ))}
            </div>

            {/* CTA */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => scrollTo("#diagnostic")}
            >
              {t.nav.cta}
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden text-white p-2 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-50 bg-midnight/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-navy border-l border-white/5 md:hidden flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <span className="font-[family-name:var(--font-space-mono)] font-bold text-pistachio">
                  rampung<span className="text-pistachio-deep">.</span>space
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-slate-grey hover:text-white p-1 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollTo(item.href)}
                    className={`text-left px-4 py-3 rounded-xl text-base transition-colors cursor-pointer ${
                      activeSection === item.href.replace("#", "")
                        ? "text-pistachio bg-pistachio/5"
                        : "text-slate-grey hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="p-4 space-y-4 border-t border-white/5">
                {/* Language Toggle */}
                <div className="flex items-center justify-center bg-navy-light rounded-full p-0.5">
                  {(["id", "en"] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocale(l)}
                      className={`relative flex-1 px-3 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer uppercase text-center ${
                        locale === l ? "text-midnight" : "text-slate-grey"
                      }`}
                    >
                      {locale === l && (
                        <motion.div
                          layoutId="lang-indicator-mobile"
                          className="absolute inset-0 bg-pistachio rounded-full"
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                      )}
                      <span className="relative z-10">{l.toUpperCase()}</span>
                    </button>
                  ))}
                </div>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => scrollTo("#diagnostic")}
                >
                  {t.nav.cta}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
