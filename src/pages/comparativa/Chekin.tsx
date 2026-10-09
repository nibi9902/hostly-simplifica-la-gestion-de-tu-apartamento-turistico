import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import { faqPageSchema, breadcrumbSchema } from "@/lib/seo/schemas";

import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

// `null` = no ho sabem amb certesa (Chekin té cobraments i comunicació amb l'hoste;
// no s'hi pot posar una ✗). Ordre = `chekin.features` del JSON.
// Fila 5 = «Plan gratis para siempre»: Chekin cobra per propietat i només té prova
// gratuïta (pàgina de preus, octubre del 2026). Abans era «Precio por check-in», però
// Chekin ja no cobra per check-in.
const comparisonData: Array<{ hostly: boolean; chekin: boolean | null }> = [
  { hostly: true,  chekin: true  },
  { hostly: true,  chekin: true  },
  { hostly: true,  chekin: true  },
  { hostly: true,  chekin: true  },
  { hostly: true,  chekin: false },
  { hostly: true,  chekin: false },
  { hostly: true,  chekin: null  },
  { hostly: true,  chekin: false },
  { hostly: true,  chekin: false },
  { hostly: true,  chekin: null  },
  { hostly: true,  chekin: true  },
];

export default function ComparativaChekin() {
  const empezar = useEmpezar();
  const { t } = useTranslation("comparativa");

  const features = t("chekin.features", { returnObjects: true }) as Array<{ feature: string }>;
  const faqs = t("chekin.faqs", { returnObjects: true }) as Array<{ q: string; a: string }>;

  const comparison = features.map((f, i) => ({ ...f, ...comparisonData[i] }));

  return (
    <PageShell
      title={t("chekin.meta_title")}
      description={t("chekin.meta_description")}
      path="/comparativa/chekin"
      schemas={[
        faqPageSchema(faqs),
        breadcrumbSchema([
          { name: "Hostly", url: "/" },
          { name: t("chekin.breadcrumb_comparativa"), url: "/comparativa/chekin" },
          { name: t("chekin.breadcrumb_chekin"), url: "/comparativa/chekin" },
        ]),
      ]}
    >
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">{t("chekin.hero_eyebrow")}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight mb-6 leading-tight">
              {t("chekin.hero_heading")}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t("chekin.hero_body")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quiénes son */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease }}
            className="rounded-2xl border border-slate-200 p-8"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{t("chekin.who_chekin_eyebrow")}</p>
            <h2 className="text-xl font-bold text-[#0f172a] mb-4">{t("chekin.who_chekin_heading")}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("chekin.who_chekin_p1")}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              {t("chekin.who_chekin_p2")}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1, ease }}
            className="rounded-2xl border border-primary/20 bg-[#f0f6ff] p-8"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{t("chekin.who_hostly_eyebrow")}</p>
            <h2 className="text-xl font-bold text-[#0f172a] mb-4">{t("chekin.who_hostly_heading")}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t("chekin.who_hostly_p1")}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mt-3">
              {t("chekin.who_hostly_p2")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-10 text-center">{t("chekin.table_heading")}</h2>
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
            {/* Header */}
            <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] bg-[#0f172a] text-white text-xs sm:text-sm font-semibold">
              <div className="p-3 sm:p-4">{t("chekin.table_col_feature")}</div>
              <div className="p-3 sm:p-4 text-center border-l border-white/10 [overflow-wrap:anywhere]">{t("chekin.table_col_hostly")}</div>
              <div className="p-3 sm:p-4 text-center border-l border-white/10 [overflow-wrap:anywhere]">{t("chekin.table_col_chekin")}</div>
            </div>
            {/* Rows */}
            {comparison.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] text-xs sm:text-sm border-t border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}
              >
                <div className="p-3 sm:p-4 text-slate-700 font-medium [overflow-wrap:anywhere]">{row.feature}</div>
                <div className="p-3 sm:p-4 flex justify-center items-center text-center border-l border-slate-100">
                  {row.hostly
                    ? <CheckCircle className="w-5 h-5 text-[#16a34a]" />
                    : <span className="text-xs font-semibold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full leading-tight">{t("chekin.table_badge_free")}</span>}
                </div>
                <div className="p-3 sm:p-4 flex justify-center items-center text-center border-l border-slate-100">
                  {row.chekin === null
                    ? <span className="text-slate-500 font-semibold" title={t("chekin.table_unknown")}>—</span>
                    : row.chekin
                      ? <CheckCircle className="w-5 h-5 text-slate-500" />
                      : <XCircle className="w-5 h-5 text-rose-500" aria-label="No" />}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 text-center mt-4">
            {t("chekin.table_footnote")}
          </p>
        </div>
      </section>

      {/* Coste anual */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-4 text-center">{t("chekin.cost_heading")}</h2>
          <p className="text-slate-500 text-center max-w-xl mx-auto mb-10">{t("chekin.cost_subheading")}</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{t("chekin.cost_chekin_label")}</p>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_chekin_row1_label")}</span><span className="font-semibold text-right shrink-0 max-w-[45%]">{t("chekin.cost_chekin_row1_value")}</span></div>
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_chekin_row2_label")}</span><span className="font-semibold text-right shrink-0 max-w-[45%]">{t("chekin.cost_chekin_row2_value")}</span></div>
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_chekin_row3_label")}</span><span className="font-semibold text-right shrink-0 max-w-[45%]">{t("chekin.cost_chekin_row3_value")}</span></div>
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_chekin_row4_label")}</span><span className="font-semibold text-right shrink-0 max-w-[45%]">{t("chekin.cost_chekin_row4_value")}</span></div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline gap-4 font-bold text-[#0f172a]">
                  <span>{t("chekin.cost_chekin_total_label")}</span><span>{t("chekin.cost_chekin_total_value")}</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-[#f0f6ff] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{t("chekin.cost_hostly_label")}</p>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_hostly_row1_label")}</span><span className="font-semibold text-right shrink-0 max-w-[45%]">{t("chekin.cost_hostly_row1_value")}</span></div>
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_hostly_row2_label")}</span><span className="font-semibold text-[#166534] text-right shrink-0 max-w-[45%]">{t("chekin.cost_hostly_row2_value")}</span></div>
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_hostly_row3_label")}</span><span className="font-semibold text-[#166534] text-right shrink-0 max-w-[45%]">{t("chekin.cost_hostly_row3_value")}</span></div>
                <div className="flex justify-between items-baseline gap-4"><span className="min-w-0">{t("chekin.cost_hostly_row4_label")}</span><span className="font-semibold text-[#166534] text-right shrink-0 max-w-[45%]">{t("chekin.cost_hostly_row4_value")}</span></div>
                <div className="border-t border-primary/20 pt-3 flex justify-between items-baseline gap-4 font-bold text-[#0f172a]">
                  <span>{t("chekin.cost_hostly_total_label")}</span><span>{t("chekin.cost_hostly_total_value")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-10">{t("chekin.faq_heading")}</h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="bg-[#f8fafc] rounded-2xl border border-slate-100 p-6">
                <p className="font-bold text-[#0f172a] mb-2">{f.q}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: "linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)" }}>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 whitespace-pre-line">
          {t("chekin.cta_heading")}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          {t("chekin.cta_body")}
        </p>
        <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {t("chekin.cta_button")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </PageShell>
  );
}
