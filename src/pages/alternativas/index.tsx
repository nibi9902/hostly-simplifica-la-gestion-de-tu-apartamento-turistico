import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { uniqueCompetitors } from '@/lib/data/competitors';
import PageShell from '@/components/PageShell';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import { useTranslation } from 'react-i18next';
import { MotionLangLink } from '@/i18n/LangLink';

/* Fins a l'octubre del 2026 aquí hi havia una matriu de 7 competidors × 10 funcions
 * amb ✓ i ✗. La majoria de ✗ no es podien demostrar (i alguns ja eren falsos: diversos
 * d'ells tenen IA). La publicitat comparativa ha de ser objectiva i verificable, així
 * que ara la pàgina diu només el que és cert de Hostly; cada comparativa té la seva. */
const ease = [0.22, 1, 0.36, 1] as const;

export default function AlternativasIndex() {
  const { t } = useTranslation('alternativas');

  return (
    <PageShell
      title="Alternativas a los PMS más populares | Hostly"
      description="Compara Hostly con Icnea, Hostify, Lodgify, Smoobu, Hospitable, Guesty y Avantio. La alternativa ibérica con IA, check-in gratis y compliance español."
      path="/alternativas"
      schemas={[
        breadcrumbSchema([
          { name: 'Hostly', url: '/' },
          { name: 'Alternativas', url: '/alternativas' },
        ]),
      ]}
    >
      <section className="pt-32 pb-16 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-[#f8fafc] to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-4">{t('index.eyebrow')}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#0f172a] tracking-tight mb-5 leading-tight">
              {t('index.h1')}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl leading-relaxed">
              {t('index.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* El que distingeix Hostly (només afirmacions sobre Hostly) */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-[#f8fafc] border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
              {t('index.distingue.eyebrow')}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight mb-8">
              {t('index.distingue.h2')}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(t('index.distingue.items', { returnObjects: true }) as Array<{ titol: string; text: string }>).map((x) => (
                <div key={x.titol} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="font-semibold text-[#0f172a] mb-1.5">{x.titol}</p>
                  <p className="text-sm text-slate-500 leading-relaxed">{x.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-5">
          {uniqueCompetitors.map((c, i) => (
            <MotionLangLink
              key={c.slug}
              to={`/alternativas/${c.slug}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06, ease }}
              className="group flex items-center justify-between p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:shadow-md transition-all duration-200"
            >
              <div>
                <p className="font-bold text-[#0f172a] group-hover:text-primary transition-colors mb-1">{t('index.cardTitle', { name: c.name })}</p>
                <p className="text-sm text-slate-500 line-clamp-1">{c.target}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary shrink-0 transition-colors ml-4" />
            </MotionLangLink>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
