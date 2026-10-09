import { Helmet } from "react-helmet-async";
import { SITE, absoluteUrl } from "@/lib/seo/config";
import { useLang } from "@/i18n/useLang";

interface SEOProps {
  title: string;
  description: string;
  /** Path canonical relatiu sense prefix d'idioma (ex: "/funcionalidades/check-in-online"). */
  path: string;
  image?: string;
  ogType?: "website" | "article" | "product";
  schemas?: Array<Record<string, unknown>>;
  noindex?: boolean;
  /** El contingut només existeix en castellà (articles del blog): a /ca, la canònica és la de /es. */
  nomesCastella?: boolean;
}

const LANG_LOCALE: Record<string, string> = {
  es: "es_ES",
  ca: "ca_ES",
};

export default function SEO({
  title,
  description,
  path,
  image,
  ogType = "website",
  schemas = [],
  noindex = false,
  nomesCastella = false,
}: SEOProps) {
  const { lang } = useLang();

  // Canonical inclou el prefix d'idioma
  const canonicalPath = `/${lang}${path === "/" ? "" : path}`;
  const url = absoluteUrl(canonicalPath);
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(SITE.defaultOgImage);
  const hasBrand = /\bHostly\b/i.test(title);
  const finalTitle = hasBrand ? title : `${title} | ${SITE.name}`;
  const ogLocale = LANG_LOCALE[lang] ?? "es_ES";

  // URLs hreflang per ambdós idiomes
  const basePath = path === "/" ? "" : path;
  const hreflangEs = absoluteUrl(`/es${basePath}`);
  const hreflangCa = absoluteUrl(`/ca${basePath}`);
  // Una pàgina en castellà servida a /ca no és una versió catalana: no es declara com a tal
  const canonical = nomesCastella ? hreflangEs : url;

  return (
    <Helmet>
      {/* Idioma de la pàgina (index.html diu «es» per a tothom) */}
      <html lang={nomesCastella ? "es" : lang} />
      {/* SEO bàsic */}
      <title>{finalTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      {/* hreflang — SEO multiidioma */}
      <link rel="alternate" hrefLang="es-ES" href={hreflangEs} />
      {!nomesCastella && <link rel="alternate" hrefLang="ca-ES" href={hreflangCa} />}
      <link rel="alternate" hrefLang="x-default" href={hreflangEs} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={lang === "es" ? "ca_ES" : "es_ES"} />
      <meta property="og:site_name" content={SITE.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE.twitter} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD schemas */}
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
}
