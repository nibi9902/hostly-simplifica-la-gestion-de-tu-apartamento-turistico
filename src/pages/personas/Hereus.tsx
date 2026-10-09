import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

type Feature = { icon: string; title: string; desc: string };

export default function Hereus() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const features = t("hereus.features", { returnObjects: true }) as Feature[];
  return (
    <PageShell
      title={t("hereus.meta_title")}
      description={t("hereus.meta_description")}
      path="/hereus"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("hereus.breadcrumb_label"), url: '/hereus' }])]}
    >
      <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1a3a8f] mb-4">{t("hereus.badge")}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight mb-6 leading-tight">
              {t("hereus.h1").split('\n').map((line, i, arr) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">
              {t("hereus.intro")}
            </p>
            <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1a3a8f] text-white font-semibold text-base hover:shadow-[0_8px_30px_rgba(26,58,143,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {t("hereus.cta_primary")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-sm text-slate-400 mt-3">{t("hereus.cta_sub")}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-6">
            {t("hereus.section2_h2")}
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl leading-relaxed">
            {t("hereus.section2_body")}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                className="bg-white rounded-2xl border border-slate-100 p-6 text-center shadow-sm"
              >
                <span className="text-3xl block mb-3">{item.icon}</span>
                <p className="font-bold text-[#0f172a] mb-2">{item.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 text-center" style={{ background: "linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)" }}>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          {t("hereus.cta_h2")}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{t("hereus.cta_sub2")}</p>
        <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {t("hereus.cta_primary")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </PageShell>
  );
}
