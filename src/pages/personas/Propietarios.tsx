import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

type Pain = { pain: string; fix: string };

export default function Propietarios() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const pains = t("propietarios.pains", { returnObjects: true }) as Pain[];
  return (
    <PageShell
      title={t("propietarios.meta_title")}
      description={t("propietarios.meta_description")}
      path="/propietarios"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("propietarios.breadcrumb_label"), url: '/propietarios' }])]}
    >
      <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">{t("propietarios.badge")}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight mb-6 leading-tight">
              {t("propietarios.h1").split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
              {t("propietarios.intro")}
            </p>
            <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("propietarios.cta_primary")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-slate-500 mt-3">{t("propietarios.cta_sub")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-10">
            {t("propietarios.section2_h2")}
          </h2>
          <div className="space-y-6">
            {pains.map((item, i) => (
              <motion.div
                key={item.pain}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                className="grid md:grid-cols-2 gap-4"
              >
                <div className="rounded-2xl bg-[#fff7f7] border border-red-100 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2">{t("propietarios.label_now")}</p>
                  <p className="text-slate-700 text-sm font-medium">{item.pain}</p>
                </div>
                <div className="rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#15803d] mb-2">{t("propietarios.label_with_hostly")}</p>
                  <p className="text-slate-700 text-sm">{item.fix}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-4">{t("propietarios.section3_h2")}</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            {t("propietarios.section3_body")}
          </p>
        </div>
      </section>

      <section className="py-24 px-6 text-center" style={{ background: "linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)" }}>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          {t("propietarios.cta_h2")}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{t("propietarios.cta_sub2")}</p>
        <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {t("propietarios.cta_primary")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </PageShell>
  );
}
