import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
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
      <HeroPersona
        badge={t("propietarios.badge")}
        h1={t("propietarios.h1")}
        intro={t("propietarios.intro")}
        cta={t("propietarios.cta_primary")}
        ctaSub={t("propietarios.cta_sub")}
        demo="ia-whatsapp"
        onEmpezar={empezar}
      />

      {/* A l'ordinador: el títol a l'esquerra i, a la dreta, cada maldecap amb la seva solució */}
      <section className="py-20">
        <div className="contenidor grid gap-10 lg:grid-cols-12 lg:gap-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight lg:col-span-4 lg:self-start lg:sticky lg:top-28">
            {t("propietarios.section2_h2")}
          </h2>
          <div className="space-y-6 lg:col-span-8">
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

      <section className="py-20 bg-[#f8fafc]">
        <div className="contenidor text-center">
          <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight mb-4">{t("propietarios.section3_h2")}</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            {t("propietarios.section3_body")}
          </p>
        </div>
      </section>

      <section className="py-24 text-center" style={{ background: "linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)" }}>
        <div className="contenidor">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            {t("propietarios.cta_h2")}
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{t("propietarios.cta_sub2")}</p>
          <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("propietarios.cta_primary")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
