import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { LangLink } from "@/i18n/LangLink";
import { useTranslation } from "react-i18next";
import { useEmpezar } from "@/lib/empezar";

const ease = [0.22, 1, 0.36, 1] as const;

export default function ComplianceBlock() {
  const empezar = useEmpezar();
  const { t } = useTranslation("home");

  const includes = t("compliance.includes", { returnObjects: true }) as string[];
  const bodies = t("compliance.bodies", { returnObjects: true }) as Array<{ label: string; color: string }>;

  return (
    <section
      id="compliance"
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20"
      style={{ background: "linear-gradient(180deg, #f8fafc 0%, white 100%)" }}
    >
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-10 md:mb-12"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1a3a8f] mb-4">
            {t("compliance.eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.18] mb-6">
            <span className="text-slate-400 line-through decoration-slate-300 decoration-[3px]">
              {t("compliance.title_crossed")}
            </span>
            <br />
            <span className="text-[#0f172a]">
              <span
                className="font-black tracking-[-0.05em] inline-block align-baseline"
                style={{ color: "#16a34a", fontSize: "1.25em" }}
              >
                {t("compliance.title_price")}
              </span>
              {" "}{t("compliance.title_rest")}
            </span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            {t("compliance.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease }}
          className="mb-12 md:mb-14"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px flex-1 max-w-[120px] bg-slate-200" />
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              {t("compliance.connected_label")}
            </p>
            <div className="h-px flex-1 max-w-[120px] bg-slate-200" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {bodies.map((b) => (
              <div key={b.label} className="flex items-center gap-2.5 text-sm font-semibold tracking-tight" style={{ color: b.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                {b.label}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="relative rounded-3xl border border-slate-100 bg-white p-6 md:p-12 shadow-[0_4px_32px_rgba(15,23,42,0.04)]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(26,58,143,0.08) 0%, transparent 70%)" }}
          />

          <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-10 md:gap-14 items-center">

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16a34a] mb-3">
                {t("compliance.hook")}
              </p>
              <h3 className="text-2xl md:text-[1.85rem] font-bold text-[#0f172a] tracking-tight leading-[1.1] mb-4">
                {t("compliance.no_catch").split("\n").map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed mb-3">
                {t("compliance.body_1")}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {t("compliance.body_2")}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button type="button" onClick={empezar} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1a3a8f] text-white font-semibold text-sm hover:bg-[#142d6e] transition-colors shadow-[0_4px_14px_rgba(26,58,143,0.25)]"
                >
                  {t("compliance.cta_button")}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-slate-400 font-medium">
                  {t("compliance.cta_fine")}
                </p>
              </div>
            </div>

            <div className="md:pl-10 md:border-l md:border-slate-100">
              <div className="flex items-baseline justify-between mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#16a34a]">
                  {t("compliance.checklist_eyebrow")}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t("compliance.checklist_forever")}
                </p>
              </div>
              <ul className="space-y-3.5">
                {includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-700 leading-snug"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-[#16a34a]" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="text-center mt-10"
        >
          <LangLink
            to="/funcionalidades/check-in-online"
            className="inline-flex items-center gap-2 text-[#1a3a8f] font-semibold text-sm hover:underline"
          >
            {t("compliance.link_text")}
            <ArrowRight className="w-4 h-4" />
          </LangLink>
        </motion.div>

      </div>
    </section>
  );
}
