import PageShell from "@/components/PageShell";
import PaginaLegal from "./PaginaLegal";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from "react-i18next";
import { TITULAR } from "@/lib/titular";

const EMAIL = "hola@hostlylabs.com";
const APP_URL = "https://app.hostlylabs.com";

export default function Terminos() {
  const { t } = useTranslation("legal");

  return (
    <PageShell
      title={t("terminos.title")}
      description={t("terminos.description")}
      path="/terminos"
      schemas={[
        breadcrumbSchema([
          { name: "Hostly", url: "/" },
          { name: t("terminos.breadcrumb"), url: "/terminos" },
        ]),
      ]}
    >
      <PaginaLegal titol={t("terminos.h1")} actual="terminos">

          <h2>{t("terminos.h2_1")}</h2>
          <p>{t("terminos.p_1", { appUrl: APP_URL, titular: TITULAR.nom, nif: TITULAR.nif })}</p>

          <h2>{t("terminos.h2_2")}</h2>
          <p>{t("terminos.p_2")}</p>

          <h2>{t("terminos.h2_3")}</h2>
          <ul>
            <li>{t("terminos.li_3_1")}</li>
            <li>{t("terminos.li_3_2")}</li>
            <li>{t("terminos.li_3_3")}</li>
          </ul>

          <h2>{t("terminos.h2_4")}</h2>
          <p>{t("terminos.p_4")}</p>

          <h2>{t("terminos.h2_5")}</h2>
          <ul>
            <li>{t("terminos.li_5_1")}</li>
            <li>{t("terminos.li_5_2")}</li>
            <li>{t("terminos.li_5_3")}</li>
            <li>{t("terminos.li_5_4")}</li>
            <li>{t("terminos.li_5_5")}</li>
          </ul>

          <h2>{t("terminos.h2_6")}</h2>
          <p>{t("terminos.p_6", { email: EMAIL })}</p>

          <h2>{t("terminos.h2_7")}</h2>
          <p>{t("terminos.p_7")}</p>
          <ul>
            <li>{t("terminos.li_7_1")}</li>
            <li>{t("terminos.li_7_2")}</li>
            <li>{t("terminos.li_7_3")}</li>
            <li>{t("terminos.li_7_4")}</li>
          </ul>

          <h2>{t("terminos.h2_8")}</h2>
          <p>{t("terminos.p_8", { titular: TITULAR.nom })}</p>

          <h2>{t("terminos.h2_9")}</h2>
          <p>{t("terminos.p_9")}</p>

          <h2>{t("terminos.h2_10")}</h2>
          <p>{t("terminos.p_10")}</p>

          <h2>{t("terminos.h2_huespedes")}</h2>
          <p>{t("terminos.p_huespedes")}</p>
          <ul>
            {(t("terminos.li_huespedes", { returnObjects: true }) as string[]).map((li) => (
              <li key={li}>{li}</li>
            ))}
          </ul>
          <h2>{t("terminos.h2_11")}</h2>
          <p>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
      </PaginaLegal>
    </PageShell>
  );
}
