import PageShell from "@/components/PageShell";
import PaginaLegal from "./PaginaLegal";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from "react-i18next";
import { oblidaConsentiment } from "@/lib/galetes";
import { EINES_PUBLICITAT, hiHaPublicitat } from "@/lib/seguiment";

const EMAIL = "hola@hostlylabs.com";

export default function Cookies() {
  const { t } = useTranslation("legal");
  const { t: tc } = useTranslation("common");
  type Fila = { name: string; type: string; purpose: string; duration: string; thirdParty: string };
  // Les de publicitat només hi surten si estan actives (sense identificadors, el web no en fa servir)
  const publi = t("cookies.table_publicitat", { returnObjects: true }) as Record<"meta" | "google", Fila>;
  const cookieTable = [
    ...(t("cookies.table", { returnObjects: true }) as Fila[]),
    ...(EINES_PUBLICITAT.meta ? [publi.meta] : []),
    ...(EINES_PUBLICITAT.google ? [publi.google] : []),
  ];
  const eines = [EINES_PUBLICITAT.meta && t("cookies.eina_meta"), EINES_PUBLICITAT.google && t("cookies.eina_google")]
    .filter(Boolean)
    .join(t("cookies.i"));

  return (
    <PageShell
      title={t("cookies.title")}
      description={t("cookies.description")}
      path="/cookies"
      schemas={[
        breadcrumbSchema([
          { name: "Hostly", url: "/" },
          { name: t("cookies.breadcrumb"), url: "/cookies" },
        ]),
      ]}
    >
      <PaginaLegal titol={t("cookies.h1")} actual="cookies">

          <h2>{t("cookies.h2_que_son")}</h2>
          <p>{t("cookies.p_que_son")}</p>

          <h2>{t("cookies.h2_que_usamos")}</h2>
          <div className="not-prose overflow-x-auto rounded-2xl border border-slate-100" tabIndex={0} role="region" aria-label={t("cookies.h2_que_usamos")}>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f8fafc] text-left">
                  <th className="px-4 py-3 font-semibold text-[#0f172a]">{t("cookies.th_cookie")}</th>
                  <th className="px-4 py-3 font-semibold text-[#0f172a]">{t("cookies.th_tipo")}</th>
                  <th className="px-4 py-3 font-semibold text-[#0f172a]">{t("cookies.th_finalidad")}</th>
                  <th className="px-4 py-3 font-semibold text-[#0f172a]">{t("cookies.th_duracion")}</th>
                  <th className="px-4 py-3 font-semibold text-[#0f172a]">{t("cookies.th_tercero")}</th>
                </tr>
              </thead>
              <tbody>
                {cookieTable.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-4 py-3 text-slate-700 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-slate-500">{c.type}</td>
                    <td className="px-4 py-3 text-slate-500">{c.purpose}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{c.duration}</td>
                    <td className="px-4 py-3 text-slate-500">{c.thirdParty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>{t("cookies.h2_tecnicas")}</h2>
          <p>{t("cookies.p_tecnicas")}</p>

          <h2>{t("cookies.h2_analiticas")}</h2>
          <p>
            {t("cookies.p_analiticas_pre")}{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer">
              tools.google.com/dlpage/gaoptout
            </a>.
          </p>

          {hiHaPublicitat() && (
            <>
              <h2>{t("cookies.h2_publicitat")}</h2>
              <p>{t("cookies.p_publicitat", { eines })}</p>
              <p>
                {t("cookies.p_publicitat_control")}{" "}
                {EINES_PUBLICITAT.meta && <a href="https://www.facebook.com/adpreferences" target="_blank" rel="noreferrer">Meta</a>}
                {EINES_PUBLICITAT.meta && EINES_PUBLICITAT.google && t("cookies.i")}
                {EINES_PUBLICITAT.google && <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer">Google</a>}.
              </p>
            </>
          )}

          <h2>{t("cookies.h2_gestionar")}</h2>
          <p>
            <button
              type="button"
              onClick={oblidaConsentiment}
              className="not-prose inline-flex items-center h-11 px-5 rounded-full border border-slate-200 text-sm font-semibold text-foreground hover:bg-slate-50 transition-colors"
            >
              {tc("galetes.canviar")}
            </button>
          </p>
          <p>{t("cookies.p_gestionar")}</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies" target="_blank" rel="noreferrer">Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a></li>
          </ul>

          <h2>{t("cookies.h2_contacto")}</h2>
          <p>
            {t("cookies.p_contacto")}{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
      </PaginaLegal>
    </PageShell>
  );
}
