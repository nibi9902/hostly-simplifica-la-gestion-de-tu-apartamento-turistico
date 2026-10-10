import hostlyLogo from "@/assets/hostly-logo-new.webp";
import { LangLink } from "@/i18n/LangLink";
import { useTranslation } from "react-i18next";

// El peu fa tota l'amplada de la caixa del web (10-10-2026): la marca a l'esquerra i quatre
// columnes amb les mateixes portes que el menú, perquè qui arriba al final no hagi de tornar a dalt.
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
      { clau: "faq", href: "/#faq" },
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
            <LangLink to="/" className="inline-flex items-center gap-2" aria-label="Hostly">
              <img src={hostlyLogo} alt="" className="w-7 h-7 object-contain" loading="lazy" />
              <span className="text-base font-semibold text-foreground">Hostly™</span>
            </LangLink>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">{t("footer.tagline")}</p>
            <a
              href="mailto:hola@hostlylabs.com"
              className="mt-4 inline-block text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
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
                <ul className="space-y-3">
                  {col.enllacos.map((l) => (
                    <li key={l.clau}>
                      <LangLink
                        to={l.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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
