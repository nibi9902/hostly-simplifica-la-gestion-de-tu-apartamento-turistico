import { motion } from "framer-motion";
import { CheckCheck, UserRound, Video } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";
const ease = [0.22, 1, 0.36, 1] as const;

// Les icones de la casa (abans, emojis)
const ICONES = [Video, CheckCheck, UserRound];

type Feature = { title: string; desc: string };

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
                {(() => { const Icona = ICONES[i % ICONES.length]; return <Icona className="w-7 h-7 mx-auto mb-3 text-foreground" strokeWidth={1.8} aria-hidden="true" />; })()}
                <p className="font-bold text-[#0f172a] mb-2">{item.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Al final, el «Te llamo» de la portada (13-10-2026: abans, una franja blava fosca) */}
      <Truca />
    </PageShell>
  );
}
