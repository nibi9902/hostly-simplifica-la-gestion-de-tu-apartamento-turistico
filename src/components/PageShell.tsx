import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface PageShellProps {
  title: string;
  description: string;
  /** Path canonical relatiu, ex: "/funcionalidades/check-in-online". Fallback: pathname actual. */
  path?: string;
  /** Imatge OG específica de la pàgina. */
  image?: string;
  /** Schemas JSON-LD addicionals per a aquesta pàgina. */
  schemas?: Array<Record<string, unknown>>;
  children: React.ReactNode;
}

export default function PageShell({
  title,
  description,
  path,
  image,
  schemas = [],
  children,
}: PageShellProps) {
  const canonicalPath = path ?? (typeof window !== "undefined" ? window.location.pathname : "/");

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={title}
        description={description}
        path={canonicalPath}
        image={image}
        schemas={schemas}
      />
      <SiteHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
