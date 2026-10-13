// Generadors de JSON-LD (schema.org) reutilitzables.
// Qualsevol pàgina pot importar aquests helpers i passar el resultat a <SEO schemas={[...]} />.

import { SITE, absoluteUrl } from "./config";

type Schema = Record<string, unknown>;

// ─── Organization ─────────────────────────────────────────
export function organizationSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    // TODO: verifica que les URLs de xarxes socials son correctes
    sameAs: [
      "https://twitter.com/hostlylabs",
      "https://www.linkedin.com/company/hostlylabs",
      "https://www.instagram.com/hostlylabs",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["Spanish", "Catalan"],
    },
  };
}

// ─── SoftwareApplication ──────────────────────────────────
export function softwareAppSchema(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    url: SITE.url,
    description:
      "La app que simplifica todo lo que implica tener un piso turístico. Reservas, check-in, mensajes, limpiezas, compliance y precios dinámicos en una sola plataforma.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: ["es-ES", "ca-ES"],
    offers: {
      "@type": "Offer",
      price: "40",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "40",
        priceCurrency: "EUR",
        unitText: "mes por apartamento",
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
      priceValidUntil: "2027-01-01",
    },
  };
}

// ─── FAQPage ──────────────────────────────────────────────
export interface FAQItem {
  q: string;
  a: string;
}

export function faqPageSchema(items: FAQItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

// ─── BreadcrumbList ───────────────────────────────────────
export interface BreadcrumbItem {
  name: string;
  url: string; // path relatiu (ex: "/blog") o absolut
}

export function breadcrumbSchema(items: BreadcrumbItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

// ─── BlogPosting / Article ────────────────────────────────
export interface BlogPostingInput {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string; // ISO
  updatedAt?: string; // ISO
  image?: string; // path relatiu o absolut
  keywords?: string[];
  readingTime?: number; // minuts
  wordCount?: number;
}

export function blogPostingSchema(input: BlogPostingInput): Schema {
  const url = absoluteUrl(`/blog/${input.slug}`);
  const image = input.image ? absoluteUrl(input.image) : absoluteUrl(SITE.defaultOgImage);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image,
    datePublished: input.publishedAt || undefined,
    dateModified: input.updatedAt || input.publishedAt || undefined,
    inLanguage: "es-ES",
    author: { "@type": "Organization", name: SITE.name, url: SITE.url },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: absoluteUrl(SITE.logo) },
    },
    keywords: input.keywords?.join(", "),
    timeRequired: input.readingTime ? `PT${input.readingTime}M` : undefined,
    wordCount: input.wordCount,
  };
}

// ─── Product (per pàgines de comparativa / alternatives) ──
export interface ProductComparisonInput {
  name: string; // "Hostly vs Hostify"
  description: string;
  url: string; // path relatiu
}

export function productComparisonSchema(input: ProductComparisonInput): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      price: "40",
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "40",
        priceCurrency: "EUR",
        unitText: "mes por apartamento",
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
      url: SITE.signupUrl,
    },
  };
}

// ─── HowTo (per «Así se empieza» de la portada) ──────────
export interface HowToStep {
  name: string;
  text: string;
}

export function howToSchema(name: string, description: string, steps: HowToStep[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
