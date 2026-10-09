import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/lib/blog';
import PageShell from '@/components/PageShell';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import { useTranslation } from 'react-i18next';
import { LangLink } from '@/i18n/LangLink';
import { useLang } from '@/i18n/useLang';
import { useEmpezar } from "@/lib/empezar";

const ease = [0.22, 1, 0.36, 1] as const;

const CATEGORY_KEYS = [
  {
    key: 'legal' as const,
    color: 'bg-[#eff6ff] text-primary',
    slugs: [
      'ses-hospedajes-guia-completa-2026',
      'ses-hospedajes-un-solo-apartamento',
      'ses-nrua-taxa-turistica-guia',
      'sanciones-por-no-cumplir-registro-viajeros',
      'registro-viajeros-mossos-esquadra-cataluna',
      'checkin-digital-comparativa-espana',
    ],
  },
  {
    key: 'stack' as const,
    color: 'bg-[#faf5ff] text-[#7c3aed]',
    slugs: [
      'cuanto-cuesta-gestionar-piso-turistico',
      'stack-completo-propietario-airbnb',
      'channel-manager-alquiler-vacacional-guia',
      'pms-apartamentos-turisticos-mejores-2026',
      'hostify-vs-lodgify-vs-smoobu-comparativa',
    ],
  },
  {
    key: 'ops' as const,
    color: 'bg-[#f0fdf4] text-[#15803d]',
    slugs: [
      'gestor-pequeno-5-apps-una-app',
      'coordinacion-limpiezas-excel-sistema',
      'pasar-3-a-10-apartamentos-sin-colapsar',
      '5-horas-semana-recuperar-apartamento-turistico',
      'huesped-no-responde-checkin-online',
    ],
  },
  {
    key: 'ai' as const,
    color: 'bg-[#fff7f0] text-[#c2410c]',
    slugs: [
      'automatizar-alquiler-vacacional-con-ia',
      'responder-mensajes-airbnb-automaticamente',
      'whatsapp-business-alquiler-vacacional',
      'precios-dinamicos-airbnb-booking',
    ],
  },
];

const featuredSlug = 'ses-hospedajes-guia-completa-2026';

export default function BlogIndex() {
  const empezar = useEmpezar();
  const { t } = useTranslation('blog');
  const { lang } = useLang();
  const featured = blogPosts.find((p) => p.slug === featuredSlug);

  return (
    <PageShell
      title={t('index.title')}
      description={t('index.description')}
      path="/blog"
      schemas={[
        breadcrumbSchema([
          { name: 'Hostly', url: '/' },
          { name: t('index.breadcrumb'), url: '/blog' },
        ]),
      ]}
    >
      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-5">{t('index.eyebrow')}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight leading-[1.05] mb-6">
              {t('index.h1_1')}<br className="hidden md:block" /> {t('index.h1_2')}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10">
              {t('index.subtitle', { count: blogPosts.length })}
            </p>
            {/* Els articles encara només són en castellà: a /ca ho diem abans que hi entrin. */}
            {lang === 'ca' && (
              <p className="text-sm text-slate-500 max-w-2xl -mt-6 mb-10">{t('index.ca_articles_note')}</p>
            )}
            <div className="flex flex-wrap gap-6">
              {[
                { num: `${blogPosts.length}`, label: t('index.stats_guides') },
                { num: '4', label: t('index.stats_categories') },
                { num: '2026', label: t('index.stats_updated') },
              ].map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#0f172a]">{s.num}</span>
                  <span className="text-sm text-slate-500">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article destacat */}
      {featured && (
        <section className="py-12 px-6 md:px-12 lg:px-20 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-6">{t('index.featured_eyebrow')}</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease }}
            >
              <LangLink
                to={`/blog/${featured.slug}`}
                className="group grid md:grid-cols-[1fr_auto] gap-8 p-8 rounded-3xl border border-slate-100 bg-gradient-to-br from-[#f8fafc] to-white hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#eff6ff] text-primary mb-4">
                    {t('categories.legal.label')}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] group-hover:text-primary transition-colors tracking-tight leading-snug mb-3">
                    {featured.title}
                  </h2>
                  <p className="text-slate-500 leading-relaxed mb-5 max-w-xl">{featured.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {t('index.featured_cta')} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="flex flex-col items-end justify-center gap-2 text-sm text-slate-500 whitespace-nowrap">
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t('index.min_read', { count: featured.readingTime })}</span>
                </div>
              </LangLink>
            </motion.div>
          </div>
        </section>
      )}

      {/* Articles per categoria */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto space-y-20">
          {CATEGORY_KEYS.map((cat, ci) => {
            const posts = cat.slugs.map((s) => blogPosts.find((p) => p.slug === s)).filter(Boolean);
            if (!posts.length) return null;
            return (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: ci * 0.05, ease }}
              >
                <div className="flex items-start justify-between mb-8 gap-6">
                  <div>
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full mb-3 ${cat.color}`}>
                      {t(`categories.${cat.key}.label`)}
                    </span>
                    <p className="text-sm text-slate-500 max-w-sm">{t(`categories.${cat.key}.description`)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post, pi) => (
                    <motion.div
                      key={post!.slug}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: pi * 0.06, ease }}
                    >
                      <LangLink
                        to={`/blog/${post!.slug}`}
                        className="group flex flex-col gap-3 p-5 rounded-2xl border border-slate-100 bg-white hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(37,99,235,0.08)] transition-all duration-250 h-full"
                      >
                        <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-primary transition-colors leading-snug">
                          {post!.title}
                        </h3>
                        {/* Sense flex-1 al text retallat: si s'estira, es veu la 4a línia sota els «…» */}
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                          {post!.description}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-50">
                          <span className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3" /> {t('index.min_read', { count: post!.readingTime })}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                        </div>
                      </LangLink>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 md:px-12 lg:px-20 bg-[#f8fafc] border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-4">{t('index.final_eyebrow')}</p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-4">
            {t('index.final_title')}
          </h2>
          <p className="text-slate-500 text-lg mb-8 max-w-xl mx-auto">
            {t('index.final_subtitle')}
          </p>
          <button type="button" onClick={empezar} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all duration-300">
            {t('index.final_cta')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
