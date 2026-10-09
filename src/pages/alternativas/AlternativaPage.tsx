import { motion } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import type { Competitor } from '@/lib/data/competitors';
import PageShell from '@/components/PageShell';
import { faqPageSchema, breadcrumbSchema, productComparisonSchema } from '@/lib/seo/schemas';
import { useTranslation } from 'react-i18next';

import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

export default function AlternativaPage({ competitor: c }: { competitor: Competitor }) {
  const empezar = useEmpezar();
  const { t } = useTranslation('alternativas');

  return (
    <PageShell
      title={`${c.tagline} | Hostly`}
      description={`Compara Hostly con ${c.name}. ${c.priceNote}. Alternativa con IA, check-in gratis y compliance español.`}
      path={`/alternativas/${c.slug}`}
      schemas={[
        ...(c.faqs.length > 0 ? [faqPageSchema(c.faqs)] : []),
        productComparisonSchema({
          name: `Hostly vs ${c.name}`,
          description: `Compara Hostly con ${c.name}. ${c.priceNote}.`,
          url: `/alternativas/${c.slug}`,
        }),
        breadcrumbSchema([
          { name: 'Hostly', url: '/' },
          { name: 'Alternativas', url: '/alternativas' },
          { name: `Hostly vs ${c.name}`, url: `/alternativas/${c.slug}` },
        ]),
      ]}
    >
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">{t('page.heroEyebrow')}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] tracking-tight mb-5 leading-tight">
              {c.tagline}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed mb-4">{c.target}</p>
            <p className="text-sm font-medium text-slate-400">{c.priceNote}</p>
          </motion.div>
        </div>
      </section>

      {/* Ventajas Hostly */}
      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-8">{t('page.advantagesEyebrow', { name: c.name })}</p>
          <div className="grid md:grid-cols-2 gap-5">
            {c.advantages.map((adv, i) => (
              <motion.div
                key={adv.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06, ease }}
                className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-5"
              >
                <p className="font-bold text-[#0f172a] mb-1">{adv.title}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{adv.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabla comparativa */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-[#f8fafc]">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-6">{t('page.comparisonEyebrow')}</p>
          <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <div className="grid grid-cols-3 bg-[#0f172a] text-white text-sm font-semibold">
              <div className="p-4">{t('page.colFeature')}</div>
              <div className="p-4 text-center border-l border-white/10">{t('page.colHostly')}</div>
              <div className="p-4 text-center border-l border-white/10">{c.name}</div>
            </div>
            {c.comparison.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-3 text-sm border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                <div className="p-4 text-slate-700 font-medium">{row.feature}</div>
                <div className="p-4 flex justify-center items-center border-l border-slate-100">
                  {row.hostly === true
                    ? <CheckCircle className="w-5 h-5 text-[#16a34a]" />
                    : row.hostly === false
                    ? <XCircle className="w-5 h-5 text-slate-200" />
                    : <span className="text-xs font-semibold text-primary bg-[#eff6ff] px-2 py-0.5 rounded-full">{row.hostly}</span>}
                </div>
                <div className="p-4 flex justify-center items-center border-l border-slate-100">
                  {row.them === true
                    ? <CheckCircle className="w-5 h-5 text-slate-400" />
                    : row.them === false
                    ? <XCircle className="w-5 h-5 text-slate-200" />
                    : <span className="text-xs text-slate-500">{row.them}</span>}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">{t('page.verifiedNote')}</p>
        </div>
      </section>

      {/* FAQs */}
      {c.faqs.length > 0 && (
        <section className="py-16 px-6 md:px-12 lg:px-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-6">{t('page.faqsEyebrow')}</p>
            <div className="space-y-4">
              {c.faqs.map((faq) => (
                <div key={faq.q} className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-6">
                  <p className="font-bold text-[#0f172a] mb-2">{faq.q}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)' }}>
        <h2 className="text-4xl font-bold text-white tracking-tight mb-5">
          {t('page.ctaH2')}
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          {t('page.ctaSubtitle')}
        </p>
        <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300">
          {t('page.ctaButton')} <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </PageShell>
  );
}
