import PageShell from "@/components/PageShell";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { LangLink } from "@/i18n/LangLink";
import { useTranslation } from "react-i18next";
import { TITULAR } from "@/lib/titular";

const EMAIL = "hola@hostlylabs.com";

export default function Privacidad() {
  const { t } = useTranslation("legal");
  const date = t("common.last_updated_value");

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
      <div className="pt-28 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto prose prose-slate prose-base">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            {t("common.eyebrow")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-2 not-prose">
            {t("privacidad.h1")}
          </h1>
          <p className="text-sm text-slate-500 mb-10 not-prose">
            {t("common.last_updated", { date })}
          </p>

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
          </ul>

          <h2>{t("privacidad.h2_conservacion")}</h2>
          <p>{t("privacidad.p_conservacion")}</p>

          <h2>{t("privacidad.h2_destinatarios")}</h2>
          <p>{t("privacidad.p_destinatarios")}</p>

          <h2>{t("privacidad.h2_transferencias")}</h2>
          <p>{t("privacidad.p_transferencias")}</p>

          <h2>{t("privacidad.h2_derechos")}</h2>
          <p>{t("privacidad.p_derechos", { email: EMAIL })}</p>
          <p>{t("privacidad.p_derechos_aepd")}</p>

          <h2>{t("privacidad.h2_cookies")}</h2>
          <p>
            {t("privacidad.p_cookies_pre")}{" "}
            <LangLink to="/cookies">{t("privacidad.p_cookies_link")}</LangLink>{" "}
            {t("privacidad.p_cookies_post")}
          </p>

          <h2>{t("privacidad.h2_cambios")}</h2>
          <p>{t("privacidad.p_cambios")}</p>
        </div>
      </div>
    </PageShell>
  );
}
