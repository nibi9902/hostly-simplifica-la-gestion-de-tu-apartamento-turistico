import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import { breadcrumbSchema } from "@/lib/seo/schemas";

import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

export default function SobreHostly() {
  const empezar = useEmpezar();
  const { t } = useTranslation("common");

  const values = t("sobre.values", { returnObjects: true }) as Array<{ title: string; body: string }>;

  return (
    <PageShell
      title={t("sobre.meta_title")}
      description={t("sobre.meta_description")}
      path="/sobre-hostly"
      schemas={[
        breadcrumbSchema([
          { name: "Hostly", url: "/" },
          { name: t("sobre.eyebrow"), url: "/sobre-hostly" },
        ]),
      ]}
    >
      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="contenidor">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-5">
              {t("sobre.eyebrow")}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight leading-[1.05] mb-6 max-w-4xl">
              {t("sobre.hero_heading")}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl">
              {t("sobre.hero_body")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* La història i, al costat (a l'ordinador), la targeta del fundador; al mòbil, una sota l'altra */}
      <section className="py-20">
        <div className="contenidor grid gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
            className="prose prose-slate prose-lg max-w-[68ch] lg:col-span-7"
          >
            <p>{t("sobre.story_p1")}</p>
            <p>{t("sobre.story_p2")}</p>
            <p>{t("sobre.story_p3")}</p>
            <p className="font-semibold text-[#0f172a]">
              {t("sobre.story_p4")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="lg:col-span-5 lg:self-start lg:sticky lg:top-28 flex items-start gap-5 p-8 rounded-3xl bg-[#f8fafc] border border-slate-100"
          >
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              B
            </div>
            <div>
              <p className="font-bold text-[#0f172a] text-lg mb-0.5">{t("sobre.founder_name")}</p>
              <p className="text-sm text-slate-500 mb-4">{t("sobre.founder_role")}</p>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                {t("sobre.founder_quote")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-20 bg-[#f8fafc] border-t border-slate-100">
        <div className="contenidor grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
              {t("sobre.values_eyebrow")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight">
              {t("sobre.values_heading")}
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07, ease }}
                className="flex gap-5"
              >
                <div className="w-8 h-8 rounded-full bg-[#eff6ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <p className="font-bold text-[#0f172a] mb-1">{v.title}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{v.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="py-20 border-t border-slate-100">
        <div className="contenidor grid gap-8 lg:grid-cols-12 lg:gap-16 lg:items-center">
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-4">
              {t("sobre.contact_heading")}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
              {t("sobre.contact_body")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:col-span-6 lg:justify-end">
            <a
              href="mailto:hola@hostlylabs.com"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
              hola@hostlylabs.com
            </a>
            <button type="button" onClick={empezar} className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-slate-200 text-[#0f172a] font-medium text-base hover:bg-[#f8fafc] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("sobre.contact_cta_start")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
