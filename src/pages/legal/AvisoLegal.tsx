import PageShell from "@/components/PageShell";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from "react-i18next";
import { TITULAR } from "@/lib/titular";

const EMAIL = TITULAR.email;
const DOMAIN = TITULAR.web;

export default function AvisoLegal() {
  const { t } = useTranslation("legal");
  const date = t("common.last_updated_value");

  return (
    <PageShell
      title={t("aviso.title")}
      description={t("aviso.description")}
      path="/aviso-legal"
      schemas={[
        breadcrumbSchema([
          { name: "Hostly", url: "/" },
          { name: t("aviso.breadcrumb"), url: "/aviso-legal" },
        ]),
      ]}
    >
      <div className="pt-28 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto prose prose-slate prose-base">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
            {t("common.eyebrow")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-2 not-prose">
            {t("aviso.h1")}
          </h1>
          <p className="text-sm text-slate-500 mb-10 not-prose">
            {t("common.last_updated", { date })}
          </p>

          <p>{t("aviso.p_intro", { domain: DOMAIN })}</p>

          <h2>{t("aviso.h2_titular")}</h2>
          <ul>
            <li><strong>{t("aviso.li_titular")}</strong> {TITULAR.nom}</li>
            <li><strong>{t("aviso.li_nif")}</strong> {TITULAR.nif}</li>
            {TITULAR.domicili && <li><strong>{t("aviso.li_domicilio")}</strong> {TITULAR.domicili}</li>}
            <li><strong>{t("aviso.li_denominacion")}</strong></li>
            <li><strong>{t("aviso.li_email")}</strong> <a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><strong>{t("aviso.li_web")}</strong> https://{DOMAIN}</li>
          </ul>

          <h2>{t("aviso.h2_objeto")}</h2>
          <p>{t("aviso.p_objeto", { domain: DOMAIN })}</p>

          <h2>{t("aviso.h2_propiedad")}</h2>
          <p>{t("aviso.p_propiedad")}</p>

          <h2>{t("aviso.h2_responsabilidad")}</h2>
          <p>{t("aviso.p_responsabilidad")}</p>

          <h2>{t("aviso.h2_legislacion")}</h2>
          <p>{t("aviso.p_legislacion")}</p>
        </div>
      </div>
    </PageShell>
  );
}
