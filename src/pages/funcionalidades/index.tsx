import { motion } from 'framer-motion';
import { iconaFuncio } from '@/lib/data/iconesFuncions';
import { ArrowRight } from 'lucide-react';
import { useFeatures } from '@/lib/data/useFeatures';
import { useTranslation } from 'react-i18next';
import { LangLink } from '@/i18n/LangLink';
import PageShell from '@/components/PageShell';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import { useEmpezar } from "@/lib/empezar";

const ease = [0.22, 1, 0.36, 1] as const;
// El pla de cada funcionalitat (la resta, Hostly Completo)
const PLA_DE_LA_FUNCIO: Record<string, string> = {
  'check-in-online': 'index.card_plan_gratis',
  burocracia: 'index.card_plan_gratis',
  'conecta-todo': 'index.card_plan_aparte',
};

export default function FuncionalidadesIndex() {
  const empezar = useEmpezar();
  const features = useFeatures();
  const { t } = useTranslation('funcionalidades');
  const { t: tSeo } = useTranslation('seo');

  const principals = features.filter((f) => f.slug !== 'conecta-todo');
  const aMida = features.find((f) => f.slug === 'conecta-todo');

  const targeta = (f: (typeof features)[number], i: number, ampla = false) => {
    const Icon = iconaFuncio(f.iconName);
    return (
      <motion.div
        key={f.slug}
        className="h-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay: i * 0.05, ease }}
      >
        <LangLink
          to={`/funcionalidades/${f.slug}`}
          className={`group h-full flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(37,99,235,0.08)] transition-all duration-250 ${ampla ? 'lg:flex-row lg:items-center lg:gap-8' : ''}`}
        >
          <div className="flex items-center gap-3 lg:shrink-0">
            <div className="w-11 h-11 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              {/* A quin pla és: abans hi deia «Hostly ·» i res més */}
              {t(PLA_DE_LA_FUNCIO[f.slug] ?? 'index.card_plan_completo')}
            </span>
          </div>
          <div className={ampla ? 'flex flex-col gap-4 lg:flex-1 lg:gap-1' : 'contents'}>
            <h2 className="text-xl font-bold text-[#0f172a] group-hover:text-primary transition-colors leading-snug">
              {f.name}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">{f.shortDescription}</p>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-auto pt-2 ${ampla ? 'lg:mt-0 lg:pt-0 lg:shrink-0' : ''}`}>
            {t('index.card_cta')} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </LangLink>
      </motion.div>
    );
  };

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
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="contenidor">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">{t('index.eyebrow')}</p>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight mb-6 leading-[1.05]">
              {t('index.title_1')}<br className="hidden md:block" /> {t('index.title_2')}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed">
              {t('index.subtitle_count', { count: principals.length })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Les funcionalitats: a l'ordinador, tres per fila (nou = tres files plenes); «Conéctalo todo»,
          que va a part i es paga a part, a sota i a tota l'amplada */}
      <section className="py-16">
        <div className="contenidor">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {principals.map((f, i) => targeta(f, i))}
          </div>
          {aMida && <div className="mt-5">{targeta(aMida, principals.length, true)}</div>}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center" style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)' }}>
        <div className="contenidor">
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
        </div>
      </section>
    </PageShell>
  );
}
