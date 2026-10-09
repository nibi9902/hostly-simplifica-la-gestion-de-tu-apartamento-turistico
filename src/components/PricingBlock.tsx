import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";

import { useEmpezar } from "@/lib/empezar";
import Llamame from "@/components/Llamame";
const ease = [0.22, 1, 0.36, 1] as const;

const PricingBlock = () => {
  const empezar = useEmpezar();
  const { t } = useTranslation("home");
  const freeFeatures = t("pricing.free_features", { returnObjects: true }) as string[];
  const paidFeatures = t("pricing.paid_features", { returnObjects: true }) as string[];

  return (
    <section
      id="precios"
      className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-background"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="max-w-5xl mx-auto"
      >
        {/* ── Header ── */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
            {t("pricing.title")}<br className="hidden md:block" /> {t("pricing.title_sub")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* ── Two-tier grid ── */}
        <div className="grid lg:grid-cols-2 gap-5 md:gap-6 mb-10">

          {/* ─── TIER GRATIS ─── */}
          <div className="relative rounded-3xl bg-card border border-border p-6 md:p-10 flex flex-col">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#166534] bg-[#dcfce7] px-2.5 py-1 rounded-full">
                {t("pricing.free_badge")}
              </span>
            </div>

            {/* Price */}
            <div className="mb-2">
              <span className="text-5xl md:text-6xl font-black tracking-tight text-foreground" style={{ color: "#16a34a" }}>
                0&nbsp;€
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {t("pricing.free_price_note")}
            </p>

            <p className="text-foreground text-sm leading-relaxed mb-7 max-w-sm">
              {t("pricing.free_desc")}
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground leading-snug">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-[#16a34a]" strokeWidth={3} />
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button type="button" onClick={empezar} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted transition-colors"
            >
              {t("pricing.free_cta")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ─── TIER COMPLET ─── */}
          <div
            className="relative rounded-3xl p-6 md:p-10 flex flex-col text-white overflow-hidden"
            style={{ background: "linear-gradient(160deg, #1a3a8f 0%, #2563EB 100%)" }}
          >
            {/* Glow accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-20 w-60 h-60 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)" }}
            />

            <div className="relative flex flex-col flex-1">
              {/* Eyebrow + popular badge */}
              <div className="flex items-center justify-between gap-2 mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 bg-white/15 px-2.5 py-1 rounded-full">
                  {t("pricing.paid_badge")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e40af] bg-[#fde68a] px-2.5 py-1 rounded-full">
                  {t("pricing.paid_badge_recommended")}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl md:text-6xl font-black tracking-tight">40&nbsp;€</span>
                <span className="text-white/70 text-base">{t("pricing.paid_price_per")}</span>
              </div>
              <p className="text-sm text-white/70 mb-5">
                <span className="font-semibold text-white">{t("pricing.paid_price_bulk_prefix")}</span>{" "}
                {t("pricing.paid_price_bulk_suffix")}
              </p>

              <p className="text-white/90 text-sm leading-relaxed mb-7 max-w-sm">
                {t("pricing.paid_desc")}
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {paidFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white/95 leading-snug">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button type="button" onClick={empezar} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
              >
                {t("pricing.paid_cta")}
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-white/60 mt-3 text-center">
                {t("pricing.paid_fine")}
              </p>
            </div>
          </div>

        </div>

        {/* ── Qui dubta del preu: que el truqui el Biel (el telèfon li arriba al moment) ── */}
        <Llamame className="mb-10" />

        {/* ── Qui dubta del preu: la calculadora fa els números amb els seus pisos ── */}
        <div className="text-center mb-10">
          <LangLink
            to="/calcula"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            {t("pricing.calcula_link")}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </LangLink>
        </div>

        {/* ── Referral ── */}
        <div className="rounded-2xl bg-primary/5 border border-primary/12 p-6 md:p-7">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-base">🎁</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {t("pricing.referral_badge")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
            {/* Formula visual */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-foreground tabular-nums leading-none">5</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-600 font-bold mt-1">
                  {t("pricing.referral_num_label")}
                </div>
              </div>
              <ArrowRight className="w-6 h-6 text-primary/40 flex-shrink-0" strokeWidth={2.5} />
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black tabular-nums leading-none" style={{ color: "#16a34a" }}>1</div>
                <div className="text-[10px] uppercase tracking-wider font-bold mt-1" style={{ color: "#166534" }}>
                  {t("pricing.referral_reward_label")}
                </div>
              </div>
            </div>

            {/* Explicació */}
            <div className="flex-1 sm:border-l sm:border-primary/12 sm:pl-7">
              <p className="font-semibold text-foreground text-sm leading-snug mb-1">
                {t("pricing.referral_title")}
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t("pricing.referral_desc")}
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default PricingBlock;
