import PageShell from "@/components/PageShell";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from "react-i18next";
import { oblidaConsentiment } from "@/lib/galetes";

const EMAIL = "hola@hostlylabs.com";

export default function Cookies() {
  const { t } = useTranslation("legal");
  const { t: tc } = useTranslation("common");
  const date = t("common.last_updated_value");
  const cookieTable = t("cookies.table", { returnObjects: true }) as Array<{
    name: string;
    type: string;
    purpose: string;
    duration: string;
    thirdParty: string;
  }>;

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
      <div className="pt-28 pb-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto prose prose-slate prose-base">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            {t("common.eyebrow")}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-2 not-prose">
            {t("cookies.h1")}
          </h1>
          <p className="text-sm text-slate-400 mb-10 not-prose">
            {t("common.last_updated", { date })}
          </p>

          <h2>{t("cookies.h2_que_son")}</h2>
          <p>{t("cookies.p_que_son")}</p>

          <h2>{t("cookies.h2_que_usamos")}</h2>
          <div className="not-prose overflow-x-auto rounded-2xl border border-slate-100">
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
        </div>
      </div>
    </PageShell>
  );
}
