import PageShell from "@/components/PageShell";
import PaginaLegal from "./PaginaLegal";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { LangLink } from "@/i18n/LangLink";
import { useTranslation } from "react-i18next";
import { TITULAR } from "@/lib/titular";
import { EINES_PUBLICITAT, hiHaPublicitat } from "@/lib/seguiment";

const EMAIL = "hola@hostlylabs.com";

export default function Privacidad() {
  const { t } = useTranslation("legal");
  // Meta i Google només hi surten si la publicitat està activa (`src/lib/seguiment.ts`)
  const empreses = [EINES_PUBLICITAT.meta && t("privacidad.empresa_meta"), EINES_PUBLICITAT.google && t("privacidad.empresa_google")]
    .filter(Boolean)
    .join(t("privacidad.i"));

  return (
    <PageShell
      title={t("privacidad.title")}
      description={t("privacidad.description")}
      path="/privacidad"
      noindex={false}
      schemas={[
        breadcrumbSchema([
          { name: "Hostly", url: "/" },
          { name: t("privacidad.breadcrumb"), url: "/privacidad" },
        ]),
      ]}
    >
      <PaginaLegal titol={t("privacidad.h1")} actual="privacidad">

          <h2>{t("privacidad.h2_responsable")}</h2>
          <p>
            <strong>{TITULAR.nom}</strong> (Hostly) · NIF {TITULAR.nif}<br />
            {TITULAR.domicili && <>{TITULAR.domicili}<br /></>}
            {t("privacidad.p_responsable_contacto")} <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>

          <h2>{t("privacidad.h2_datos")}</h2>
          <p>{t("privacidad.p_datos_intro")}</p>
          <ul>
            <li><strong>{t("privacidad.datos_li1_label")}</strong> {t("privacidad.datos_li1_text")}</li>
            <li><strong>{t("privacidad.datos_li2_label")}</strong> {t("privacidad.datos_li2_text")}</li>
            <li><strong>{t("privacidad.datos_li3_label")}</strong> {t("privacidad.datos_li3_text")}</li>
            <li><strong>{t("privacidad.datos_li4_label")}</strong> {t("privacidad.datos_li4_text")}</li>
            <li><strong>{t("privacidad.datos_li5_label")}</strong> {t("privacidad.datos_li5_text")}</li>
          </ul>

          <h2>{t("privacidad.h2_finalidad")}</h2>
          <ul>
            <li><strong>{t("privacidad.fin_li1_label")}</strong> {t("privacidad.fin_li1_text")}</li>
            <li><strong>{t("privacidad.fin_li2_label")}</strong> {t("privacidad.fin_li2_text")}</li>
            <li><strong>{t("privacidad.fin_li3_label")}</strong> {t("privacidad.fin_li3_text")}</li>
            <li><strong>{t("privacidad.fin_li4_label")}</strong> {t("privacidad.fin_li4_text")}</li>
            <li><strong>{t("privacidad.fin_li5_label")}</strong> {t("privacidad.fin_li5_text")}</li>
            {hiHaPublicitat() && <li><strong>{t("privacidad.fin_li6_label")}</strong> {t("privacidad.fin_li6_text")}</li>}
          </ul>

          <h2>{t("privacidad.h2_conservacion")}</h2>
          <p>{t("privacidad.p_conservacion")}</p>

          <h2>{t("privacidad.h2_destinatarios")}</h2>
          <p>{t("privacidad.p_destinatarios")}</p>
          {hiHaPublicitat() && <p>{t("privacidad.p_destinatarios_publicitat", { empreses })}</p>}

          <h2>{t("privacidad.h2_transferencias")}</h2>
          <p>{t("privacidad.p_transferencias")}</p>
          {hiHaPublicitat() && <p>{t("privacidad.p_transferencias_publicitat", { empreses })}</p>}

          <h2>{t("privacidad.h2_derechos")}</h2>
          <p>{t("privacidad.p_derechos", { email: EMAIL })}</p>
          <p>{t("privacidad.p_derechos_aepd")}</p>

          <h2>{t("privacidad.h2_cookies")}</h2>
          <p>
            {t(hiHaPublicitat() ? "privacidad.p_cookies_pre_publicitat" : "privacidad.p_cookies_pre")}{" "}
            <LangLink to="/cookies">{t("privacidad.p_cookies_link")}</LangLink>{" "}
            {t("privacidad.p_cookies_post")}
          </p>

          <h2>{t("privacidad.h2_cambios")}</h2>
          <p>{t("privacidad.p_cambios")}</p>
      </PaginaLegal>
    </PageShell>
  );
}
