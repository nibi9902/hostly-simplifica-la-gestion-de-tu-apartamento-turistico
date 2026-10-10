import PageShell from "@/components/PageShell";
import PaginaLegal from "./PaginaLegal";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from "react-i18next";
import { TITULAR } from "@/lib/titular";

const EMAIL = TITULAR.email;
const DOMAIN = TITULAR.web;

export default function AvisoLegal() {
  const { t } = useTranslation("legal");

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
      <PaginaLegal titol={t("aviso.h1")} actual="aviso">

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
      </PaginaLegal>
    </PageShell>
  );
}
