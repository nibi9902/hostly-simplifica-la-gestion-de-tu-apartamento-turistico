import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
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
      <HeroPersona
        badge={t("hereus.badge")}
        h1={t("hereus.h1")}
        intro={t("hereus.intro")}
        cta={t("hereus.cta_primary")}
        ctaSub={t("hereus.cta_sub")}
        demo="check-in-online"
        onEmpezar={empezar}
      />

      {/* A l'ordinador: el títol i l'explicació a l'esquerra, les tres coses a la dreta */}
      <section className="py-20">
        <div className="contenidor grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4 lg:self-start lg:sticky lg:top-28">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-6">
              {t("hereus.section2_h2")}
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">
              {t("hereus.section2_body")}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 lg:col-span-8">
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

      <section className="py-24 text-center" style={{ background: "linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)" }}>
        <div className="contenidor">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            {t("hereus.cta_h2")}
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{t("hereus.cta_sub2")}</p>
          <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("hereus.cta_primary")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
