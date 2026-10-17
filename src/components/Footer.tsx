import hostlyMarca from "@/assets/hostly-marca.webp";
import { LangLink } from "@/i18n/LangLink";
import { useTranslation } from "react-i18next";

// El peu fa tota l'amplada de la caixa del web (10-10-2026): la marca a l'esquerra i quatre
// columnes amb les mateixes portes que el menú, perquè qui arriba al final no hagi de tornar a dalt.
// Al mòbil, cada enllaç fa 44 px d'alt perquè el dit no falli (17-10).
const COLUMNES: Array<{ titol: string; enllacos: Array<{ clau: string; href: string }> }> = [
  {
    titol: "producto",
    enllacos: [
      { clau: "funcionalidades", href: "/funcionalidades" },
      { clau: "precios", href: "/precios" },
      { clau: "calcula", href: "/calcula" },
      { clau: "demo", href: "/demo" },
    ],
  },
  {
    titol: "para_quien",
    enllacos: [
      { clau: "propietarios", href: "/propietarios" },
      { clau: "gestores", href: "/gestores-pequenos" },
      { clau: "segunda", href: "/segunda-residencia" },
      { clau: "hereus", href: "/hereus" },
    ],
  },
  {
    titol: "recursos",
    enllacos: [
      { clau: "blog", href: "/blog" },
      { clau: "guia", href: "/guia" },
      { clau: "alternativas", href: "/alternativas" },
      // la portada nova (13-10-2026) ja no té preguntes: les de preus són a /precios
      { clau: "faq", href: "/precios#preguntas" },
    ],
  },
  {
    titol: "hostly",
    enllacos: [
      { clau: "sobre", href: "/sobre-hostly" },
      { clau: "privacidad", href: "/privacidad" },
      { clau: "cookies", href: "/cookies" },
      { clau: "terminos", href: "/terminos" },
      { clau: "aviso", href: "/aviso-legal" },
    ],
  },
];

const Footer = () => {
  const { t } = useTranslation("home");
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="contenidor pt-14 pb-10 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">

          {/* Marca i contacte */}
          <div className="lg:col-span-4">
            {/* el mateix logotip que el capçal */}
            <LangLink to="/" className="inline-flex items-center max-md:min-h-11" aria-label="Hostly">
              <img src={hostlyMarca} alt="" width={160} height={24} className="h-6 w-auto" loading="lazy" />
            </LangLink>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">{t("footer.tagline")}</p>
            <a
              href="mailto:hola@hostlylabs.com"
              className="mt-4 inline-block max-md:mt-1 max-md:inline-flex max-md:min-h-11 max-md:items-center text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              hola@hostlylabs.com
            </a>
          </div>

          {/* Les portes del web */}
          <nav className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-10" aria-label={t("footer.aria")}>
            {COLUMNES.map((col) => (
              <div key={col.titol}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-4">
                  {t(`footer.cols.${col.titol}`)}
                </p>
                <ul className="space-y-3 max-md:space-y-0">
                  {col.enllacos.map((l) => (
                    <li key={l.clau}>
                      <LangLink
                        to={l.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 max-md:inline-flex max-md:min-h-11 max-md:items-center"
                      >
                        {t(`footer.links.${l.clau}`)}
                      </LangLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Peu del peu */}
        <div className="mt-12 border-t border-border/40 pt-6">
          <p className="text-xs text-muted-foreground">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
