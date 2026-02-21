import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";
import ServicesSection from "@/components/sections/ServicesSection";
import HowItWorks from "@/components/sections/HowItWorks";
import LogicalLogic from "@/components/sections/LogicalLogic";
import TestimonialSection from "@/components/sections/TestimonialSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import AboutSection from "@/components/sections/AboutSection";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustStrip />
        <ServicesSection />
        <HowItWorks />
        <LogicalLogic />
        <TestimonialSection />
        <PortfolioSection />
        <AboutSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}
