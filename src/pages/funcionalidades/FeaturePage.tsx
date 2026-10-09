import { motion } from 'framer-motion';
import { iconaFuncio } from '@/lib/data/iconesFuncions';
import { ArrowRight, Check } from 'lucide-react';
import type { Feature } from '@/lib/data/features';
import { useFeatures } from '@/lib/data/useFeatures';
import { useTranslation } from 'react-i18next';
import PageShell from '@/components/PageShell';
import MiniDemo from './MiniDemo';
import { faqPageSchema, breadcrumbSchema, howToSchema } from '@/lib/seo/schemas';
import { LangLink } from '@/i18n/LangLink';

import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
  feature: Feature;
}

export default function FeaturePage({ feature }: Props) {
  const empezar = useEmpezar();
  const { t } = useTranslation('funcionalidades');
  const { t: tEmbut } = useTranslation('embut');
  const allFeatures = useFeatures();
  const Icon = iconaFuncio(feature.iconName);
  const related = feature.relatedFeatures
    .map((s) => allFeatures.find((f) => f.slug === s))
    .filter((f): f is Feature => Boolean(f));

  const faqsForSchema = feature.faqs.map((f) => ({ q: f.question, a: f.answer }));

  return (
    <PageShell
      title={`${feature.name} · Hostly`}
      description={feature.shortDescription}
      path={`/funcionalidades/${feature.slug}`}
      schemas={[
        faqPageSchema(faqsForSchema),
        howToSchema(
          feature.hero.h1,
          feature.shortDescription,
          feature.howItWorks.map((s) => ({ name: s.title, text: s.body })),
        ),
        breadcrumbSchema([
          { name: 'Hostly', url: '/' },
          { name: t('page.breadcrumb_features'), url: '/funcionalidades' },
          { name: feature.name, url: `/funcionalidades/${feature.slug}` },
        ]),
      ]}
    >
      {/* ── HERO ── (2 columnes en desktop: text + mini-demo animada) */}
      <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f0f6ff] to-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center">

            {/* Left — text */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              {/* Breadcrumb */}
              <nav aria-label="breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <LangLink to="/" className="hover:text-slate-600 transition-colors">{t('page.breadcrumb_home')}</LangLink>
                <span>/</span>
                <LangLink to="/funcionalidades" className="hover:text-slate-600 transition-colors">{t('page.breadcrumb_features')}</LangLink>
                <span>/</span>
                <span className="text-slate-600">{feature.name}</span>
              </nav>

              {/* Icon + eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-[#eff6ff] flex items-center justify-center">
                  <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {feature.name}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-[#0f172a] tracking-tight mb-6 leading-[1.08]">
                {feature.hero.h1}
              </h1>
              <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-10">
                {feature.hero.sub}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  {tEmbut('cta')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <LangLink
                  to="/precios"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-slate-200 text-slate-700 font-semibold text-base hover:bg-slate-50 transition-all duration-300"
                >
                  {t('page.ver_precios')}
                </LangLink>
              </div>
            </motion.div>

            {/* Right — mini-demo animada */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="relative"
            >
              {/* Glow subtil darrere */}
              <div style={{
                position: 'absolute',
                inset: '-10%',
                background: 'radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, transparent 65%)',
                filter: 'blur(40px)',
                zIndex: 0,
                pointerEvents: 'none',
              }} />
              <div className="relative z-10">
                <MiniDemo slug={feature.slug} iconName={feature.iconName} />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── PROBLEMA ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
              {t('page.problem_eyebrow')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-6 leading-tight">
              {feature.problem.title}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              {feature.problem.body}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
              {t('page.how_eyebrow')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight leading-tight">
              {t('page.how_title', { count: feature.howItWorks.length })}
            </h2>
          </motion.div>

          <ol className="space-y-6">
            {feature.howItWorks.map((step, i) => (
              <motion.li
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07, ease }}
                className="flex gap-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
              >
                <div
                  className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg, #1a3a8f 0%, #2563EB 100%)' }}
                >
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] mb-2 leading-snug">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── ADVANTAGES ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
              {t('page.advantages_eyebrow')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight leading-tight">
              {t('page.advantages_title')}
            </h2>
          </motion.div>

          <ul className="grid md:grid-cols-2 gap-4">
            {feature.advantages.map((adv, i) => (
              <motion.li
                key={adv}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className="flex gap-3 p-5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]"
              >
                <Check className="w-5 h-5 text-[#16a34a] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-sm text-slate-700 leading-relaxed font-medium">{adv}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── USAGE SCENARIOS ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
            className="mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
              {t('page.usage_eyebrow')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight leading-tight">
              {t('page.usage_title')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {feature.usage.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease }}
                className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-3"
              >
                <p className="font-bold text-[#0f172a] leading-snug">{u.title}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{u.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED FEATURES ── */}
      {related.length > 0 && (
        <section className="py-20 px-6 md:px-12 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease }} className="mb-10">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
                {t('page.related_eyebrow')}
              </p>
              <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">
                {t('page.related_title')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5">
              {related.map((rf) => {
                const RIcon = iconaFuncio(rf.iconName);
                return (
                  <LangLink
                    key={rf.slug}
                    to={`/funcionalidades/${rf.slug}`}
                    className="group flex flex-col gap-3 p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                      <RIcon className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                    </div>
                    <h3 className="font-bold text-[#0f172a] text-base leading-snug group-hover:text-primary transition-colors">
                      {rf.name}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{rf.shortDescription}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-auto">
                      {t('page.related_cta')} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </LangLink>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── FAQs ── */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease }} className="mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">{t('page.faqs_eyebrow')}</p>
            <h2 className="text-3xl font-bold text-[#0f172a] tracking-tight">
              {t('page.faqs_title')}
            </h2>
          </motion.div>

          <div className="space-y-4">
            {feature.faqs.map((faq) => (
              <details key={faq.question} className="group bg-white rounded-2xl border border-slate-100 p-6">
                <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-[#0f172a]">
                  <span className="leading-snug">{faq.question}</span>
                  <span className="flex-shrink-0 text-slate-400 group-open:rotate-45 transition-transform duration-200 text-2xl leading-none">+</span>
                </summary>
                <p className="text-slate-500 text-sm leading-relaxed mt-4 pt-4 border-t border-slate-100">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)' }}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          {t('page.final_title')}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          {t('page.final_subtitle')}
        </p>
        <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('page.final_cta')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </PageShell>
  );
}
