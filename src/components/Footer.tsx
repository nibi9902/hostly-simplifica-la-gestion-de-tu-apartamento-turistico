import hostlyLogo from "@/assets/hostly-logo-new.webp";
import { LangLink } from "@/i18n/LangLink";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation("home");
  return (
    <footer className="border-t border-border/60 py-12 px-6 md:px-12 lg:px-20 bg-background">
      <div className="max-w-6xl mx-auto">

        {/* Top row: brand + nav */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">

          {/* Brand */}
          <div className="flex items-center gap-2">
            <img src={hostlyLogo} alt="Hostly" className="w-7 h-7 object-contain" loading="lazy" />
            <div>
              <span className="text-sm font-semibold text-foreground block leading-none">Hostly™</span>
              <span className="text-[11px] text-muted-foreground/70 leading-none">{t("footer.tagline")}</span>
            </div>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-5 flex-wrap">
            <LangLink
              to="/#faq"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {t("footer.links.faq")}
            </LangLink>
            {[
              { key: "privacidad", href: "/privacidad" },
              { key: "cookies",    href: "/cookies"    },
              { key: "terminos",   href: "/terminos"   },
              { key: "aviso",      href: "/aviso-legal"},
              { key: "sobre",      href: "/sobre-hostly"},
            ].map((l) => (
              <LangLink
                key={l.key}
                to={l.href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t(`footer.links.${l.key}`)}
              </LangLink>
            ))}
            <a
              href="mailto:hola@hostlylabs.com"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {t("footer.links.contacto")}
            </a>
          </nav>
        </div>

        {/* Bottom row: copyright */}
        <div className="border-t border-border/40 pt-6">
          <p className="text-xs text-muted-foreground/50 text-center">
            {t("footer.copyright")}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
