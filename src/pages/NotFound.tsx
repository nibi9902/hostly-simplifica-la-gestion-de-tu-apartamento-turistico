import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { ArrowLeft, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import "@/components/portada/portada.css";

/**
 * La 404, amb una broma de la casa (13-10-2026; el Biel: «hauria de ser algo una mica més divertit»):
 * «Esta página ya ha hecho el check-out», un clauer d'apartament amb el 404 que es gronxa i l'avís de
 * Hostly, «Salió a las 4:04. Sin incidencias.». Porta el capçal i el peu de la web: qui hi arriba (un
 * enllaç vell, un anunci) veu on és i pot seguir.
 */
function Clauer() {
  return (
    <svg viewBox="0 0 220 300" className="pt-404-clauer" aria-hidden="true">
      <circle cx="110" cy="26" r="18" fill="none" stroke="currentColor" strokeWidth="6" opacity=".28" />
      <rect x="40" y="52" width="140" height="222" rx="38" className="pt-404-cos" />
      <circle cx="110" cy="86" r="12" className="pt-404-forat" />
      <text x="110" y="190" textAnchor="middle" className="pt-404-n">404</text>
      <text x="110" y="232" textAnchor="middle" className="pt-404-marca">HOSTLY</text>
    </svg>
  );
}

const NotFound = () => {
  const { t } = useTranslation("common");
  const enllacos = t("not_found.enllacos", { returnObjects: true }) as Array<[string, string]>;
  return (
    <>
      <Helmet>
        <title>{t("not_found.title")}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <SiteHeader />
      <main data-sense-caixa className="pt-seccio pt-404">
        <div className="contenidor pt-404-graella">
          <div className="pt-404-text">
            <p className="pt-retol">{t("not_found.badge")}</p>
            <h1 className="pt-fp-h1">{t("not_found.heading")}</h1>
            <p className="pt-lead">{t("not_found.body")}</p>
            <div className="pt-fp-botons">
              <LangLink to="/" className="pt-pill pt-pill-pri">{t("not_found.go_home")}</LangLink>
              <button type="button" onClick={() => window.history.back()} className="pt-pill pt-pill-sec">
                <ArrowLeft className="pt-ic" aria-hidden="true" />{t("not_found.go_back")}
              </button>
            </div>
            <p className="pt-404-ves">
              {t("not_found.o_ves")}{" "}
              {enllacos.map(([href, nom], i) => (
                <span key={href}>{i > 0 && " · "}<LangLink to={href}>{nom}</LangLink></span>
              ))}
            </p>
          </div>
          <div className="pt-404-dibuix">
            <div className="pt-404-gronxa"><Clauer /></div>
            <div className="pt-404-avis" aria-hidden="true">
              <span className="pt-pp-marca"><Check className="pt-ic" strokeWidth={2.8} /></span>
              <p>
                <small>{t("not_found.avis_que")}</small>
                <b>{t("not_found.avis_titol")}</b>
                <span>{t("not_found.avis_text")}</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
