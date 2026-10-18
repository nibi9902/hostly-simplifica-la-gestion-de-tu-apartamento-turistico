/**
 * El que comparteixen les dues landings dels anuncis (/registro-de-viajeros-gratis i /hostly-completo,
 * 18-10-2026): el capçal amb la marca i res més (a la landing hi ha una sola cosa a fer), les tres xifres
 * reals de la portada i el peu amb els legals.
 */
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import hostlyMarca from "@/assets/hostly-marca.webp";

/** 7983 → «7.983», com a la portada (`portada/Zero`): en castellà, Intl no posa el punt als nombres de quatre xifres. */
const punts = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export function CapcalAnunci() {
  return (
    <header className="pt-seccio pt-ad-capcal">
      <div className="contenidor pt-ad-columna pt-ad-capcal-in">
        <LangLink to="/" aria-label="Hostly">
          <img src={hostlyMarca} alt="" width={160} height={24} className="h-6 w-auto" />
        </LangLink>
      </div>
    </header>
  );
}

export function XifresAnunci() {
  const { t } = useTranslation("home");
  const xifres = t("portada.zero.xifres", { returnObjects: true }) as { n: number; text: string }[];
  return (
    <ul className="pt-ad-xifres">
      {xifres.map((x) => (
        <li key={x.text}>
          <b>{punts(x.n)}</b>
          {x.text}
        </li>
      ))}
    </ul>
  );
}

export function PeuAnunci() {
  const { t } = useTranslation("home");
  return (
    <footer className="pt-seccio pt-ad-peu">
      <div className="contenidor pt-ad-columna pt-ad-peu-in">
        <span>© 2026 Hostly</span>
        <LangLink to="/privacidad">{t("anunci_registre.legal.privacitat")}</LangLink>
        <LangLink to="/cookies">{t("anunci_registre.legal.galetes")}</LangLink>
        <LangLink to="/aviso-legal">{t("anunci_registre.legal.avis")}</LangLink>
      </div>
    </footer>
  );
}
