import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

type Feature = { icon: string; title: string; desc: string };

export default function SegundaResidencia() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const features = t("segunda_residencia.features", { returnObjects: true }) as Feature[];
  return (
    <PageShell
      title={t("segunda_residencia.meta_title")}
      description={t("segunda_residencia.meta_description")}
      path="/segunda-residencia"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("segunda_residencia.breadcrumb_label"), url: '/segunda-residencia' }])]}
    >
      <HeroPersona
        badge={t("segunda_residencia.badge")}
        h1={t("segunda_residencia.h1")}
        intro={t("segunda_residencia.intro")}
        cta={t("segunda_residencia.cta_primary")}
        ctaSub={t("segunda_residencia.cta_sub")}
        demo="mensajeria-programada"
        onEmpezar={empezar}
      />

      <section className="py-20">
        <div className="contenidor">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-10 max-w-3xl">
            {t("segunda_residencia.section2_h2")}
          </h2>
          {/* A l'ordinador, les quatre en una fila */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                className="bg-white rounded-2xl border border-slate-100 p-6 flex gap-4 lg:flex-col lg:gap-3 shadow-sm"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-bold text-[#0f172a] mb-1">{item.title}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 text-center" style={{ background: "linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)" }}>
        <div className="contenidor">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            {t("segunda_residencia.cta_h2")}
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{t("segunda_residencia.cta_sub2")}</p>
          <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("segunda_residencia.cta_primary")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
