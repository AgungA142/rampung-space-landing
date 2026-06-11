import { absoluteUrl, SEO, SERVICES, SITE_URL } from "@/lib/seo";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SEO.siteName,
    url: SITE_URL,
    logo: absoluteUrl("/rampung_space.png"),
    image: absoluteUrl("/rampung_space.png"),
    email: SEO.email,
    description: SEO.description,
    areaServed: {
      "@type": "Country",
      name: "Indonesia",
    },
    sameAs: [SEO.instagram],
    knowsAbout: [
      "MVP development",
      "Web application development",
      "Mobile app development",
      "Software architecture",
      "Technology consultation",
      "Product discovery",
    ],
    slogan: "Make Space. Get Rampung.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SEO.siteName,
    inLanguage: "id-ID",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: SEO.title,
    description: SEO.description,
    inLanguage: "id-ID",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    about: {
      "@id": `${SITE_URL}/#organization`,
    },
    mainEntity: {
      "@id": `${SITE_URL}/#service-catalog`,
    },
  };

  const serviceCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE_URL}/#service-catalog`,
    name: "Layanan rampung.space",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.name,
        description: service.description,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        areaServed: {
          "@type": "Country",
          name: "Indonesia",
        },
      },
    })),
  };

  const jsonLd = [
    organizationSchema,
    websiteSchema,
    webpageSchema,
    serviceCatalogSchema,
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

