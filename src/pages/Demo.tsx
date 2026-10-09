import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import PageShell from "@/components/PageShell";

import { useEmpezar } from "@/lib/empezar";

export default function Demo() {
  const empezar = useEmpezar();
  const { t } = useTranslation("common");

  const features = t("demo.features", { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>;

  return (
    <PageShell
      title={t("demo.meta_title")}
      description={t("demo.meta_description")}
      path="/demo"
    >
      {/* Hero fosc — no tot en blanc, fons naval que dona profunditat */}
      <section
        className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 md:pt-32 md:pb-24 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0c1a4a 0%, #0f172a 60%, #111827 100%)" }}
      >
        {/* Glow blau ambient */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 25%, rgba(37,99,235,0.18) 0%, transparent 70%)" }}
        />
        {/* Textura de punts */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-5xl mx-auto text-center"
        >
          {/* Eyebrow */}
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/70 mb-5">
            {t("demo.eyebrow")}
          </p>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.05] mb-4">
            {t("demo.heading")}
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto mb-10">
            {t("demo.subheading")}
          </p>

          {/* Video — framing premium amb chrome de browser */}
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 40px 80px -10px rgba(0,0,0,0.6), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Video */}
            <video
              src="/assets/demos/hostly-demo.mp4"
              controls
              autoPlay
              muted
              playsInline
              className="w-full block"
              style={{ background: "#0f172a" }}
            />
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button type="button" onClick={empezar} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0c1a4a] font-semibold text-sm hover:bg-white/90 transition-colors shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            >
              {t("demo.cta_start")}
              <ArrowRight className="w-4 h-4" />
            </button>
            <LangLink
              to="/precios"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white/75 font-medium text-sm hover:border-white/40 hover:text-white transition-colors"
            >
              {t("demo.cta_pricing")}
            </LangLink>
          </div>
          <p className="text-white/70 text-xs mt-4">
            {t("demo.disclaimer")}
          </p>
        </motion.div>
      </section>

      {/* Contextualització — fons blanc, 3 punts clau del que es veu al vídeo */}
      <section className="py-16 md:py-20 px-6 md:px-12 lg:px-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-10 md:text-center">
            {t("demo.video_section_eyebrow")}
          </p>
          <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
            {features.map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold text-foreground text-sm leading-snug">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
