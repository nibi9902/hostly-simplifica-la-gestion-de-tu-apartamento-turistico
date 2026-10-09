import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import * as icons from 'lucide-react';
import { useFeatures } from '@/lib/data/useFeatures';
import { useTranslation } from 'react-i18next';
import { LangLink } from '@/i18n/LangLink';
import PageShell from '@/components/PageShell';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import { useEmpezar } from "@/lib/empezar";

const ease = [0.22, 1, 0.36, 1] as const;
const IconMap = icons as unknown as Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>>;

export default function FuncionalidadesIndex() {
  const empezar = useEmpezar();
  const features = useFeatures();
  const { t } = useTranslation('funcionalidades');
  const { t: tSeo } = useTranslation('seo');

  return (
    <PageShell
      title={tSeo('funcionalidades.title')}
      description={tSeo('funcionalidades.description')}
      path="/funcionalidades"
      schemas={[
        breadcrumbSchema([
          { name: 'Hostly', url: '/' },
          { name: t('page.breadcrumb_features'), url: '/funcionalidades' },
        ]),
      ]}
    >
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1a3a8f] mb-4">{t('index.eyebrow')}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight mb-6 leading-[1.05]">
              {t('index.title_1')}<br className="hidden md:block" /> {t('index.title_2')}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed">
              {t('index.subtitle_count', { count: features.length })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {features.map((f, i) => {
              const Icon = IconMap[f.iconName] ?? icons.Sparkles;
              return (
                <motion.div
                  key={f.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.05, ease }}
                >
                  <LangLink
                    to={`/funcionalidades/${f.slug}`}
                    className="group flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-white hover:border-[#1a3a8f]/25 hover:shadow-[0_8px_32px_rgba(26,58,143,0.08)] transition-all duration-250"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#eff6ff] flex items-center justify-center">
                        <Icon className="w-5 h-5" style={{ color: '#1a3a8f' }} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#1a3a8f]">
                        {t('index.card_eyebrow')}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#0f172a] group-hover:text-[#1a3a8f] transition-colors leading-snug">
                      {f.name}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">{f.shortDescription}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a3a8f] mt-auto pt-2">
                      {t('index.card_cta')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </LangLink>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 text-center" style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)' }}>
        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
          {t('index.final_title')}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          {t('index.final_subtitle')}
        </p>
        <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {t('index.final_cta')} <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </PageShell>
  );
}
