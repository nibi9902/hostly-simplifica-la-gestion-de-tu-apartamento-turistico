import { useState } from 'react';
import { motion } from 'framer-motion';
import { iconaFuncio } from '@/lib/data/iconesFuncions';
import { ArrowRight } from 'lucide-react';
import { useFeatures } from '@/lib/data/useFeatures';
import { FUNCIONS_APART, FUNCIONS_GRATIS, type Feature } from '@/lib/data/features';
import { videoDeLaFuncio } from '@/lib/data/videosFuncions';
import { useLang } from '@/i18n/useLang';
import { useTranslation } from 'react-i18next';
import { LangLink } from '@/i18n/LangLink';
import PageShell from '@/components/PageShell';
import { breadcrumbSchema } from '@/lib/seo/schemas';
import MiniaturaVideo from './MiniaturaVideo';
import VideoObert, { type VideoAObrir } from './VideoObert';

import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";
const ease = [0.22, 1, 0.36, 1] as const;
// El pla de cada funcionalitat (la resta, Hostly Completo)
const plaDeLaFuncio = (slug: string) =>
  FUNCIONS_GRATIS.has(slug) ? 'index.card_plan_gratis' : FUNCIONS_APART.has(slug) ? 'index.card_plan_aparte' : 'index.card_plan_completo';

export default function FuncionalidadesIndex() {
  const features = useFeatures();
  const { lang } = useLang();
  const { t } = useTranslation('funcionalidades');
  const { t: tSeo } = useTranslation('seo');
  const [obert, setObert] = useState<VideoAObrir | null>(null);

  const principals = features.filter((f) => !FUNCIONS_APART.has(f.slug));
  const aMida = features.filter((f) => FUNCIONS_APART.has(f.slug));

  const targeta = (f: Feature, i: number) => {
    const Icon = iconaFuncio(f.iconName);
    const video = videoDeLaFuncio(f.slug, lang);
    const entrada = {
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-40px' },
      transition: { duration: 0.45, delay: i * 0.05, ease },
    };

    // Amb vídeo (17-10, idea C): la miniatura s'obre en gran; la resta de la targeta porta a la pàgina
    if (video) {
      return (
        <motion.div key={f.slug} className="h-full" {...entrada}>
          <article className="pt-ix-targeta">
            <MiniaturaVideo video={video} nom={f.name} enObrir={() => setObert({ slug: f.slug, nom: f.name, video })} />
            <LangLink to={`/funcionalidades/${f.slug}`} className="pt-ix-cos">
              <span className="pt-ix-pla">
                <span className="pt-ix-ic"><Icon className="pt-ic" aria-hidden="true" /></span>
                {t(plaDeLaFuncio(f.slug))}
              </span>
              <h2>{f.name}</h2>
              <p>{f.shortDescription}</p>
              <span className="pt-ix-mes">{t('index.card_cta')} <ArrowRight className="pt-ic" aria-hidden="true" /></span>
            </LangLink>
          </article>
        </motion.div>
      );
    }

    return (
      <motion.div key={f.slug} className="h-full" {...entrada}>
        <LangLink
          to={`/funcionalidades/${f.slug}`}
          className="group h-full flex flex-col gap-4 p-6 rounded-2xl border border-slate-100 bg-white hover:border-primary/25 hover:shadow-[0_8px_32px_rgba(37,99,235,0.08)] transition-all duration-250"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#eff6ff] flex items-center justify-center">
              <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
            </div>
            <span className="text-[11px] max-md:text-xs font-bold uppercase tracking-[0.15em] text-primary">
              {/* A quin pla és: abans hi deia «Hostly ·» i res més */}
              {t(plaDeLaFuncio(f.slug))}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#0f172a] group-hover:text-primary transition-colors leading-snug">
            {f.name}
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed">{f.shortDescription}</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-auto pt-2">
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

      {/* Les funcionalitats: a l'ordinador, tres per fila (nou = tres files plenes). Les dues que es fan
          a mida i es paguen a part (la web de reserves i «Conéctalo todo»), a sota, l'una al costat de
          l'altra. Cada targeta porta el vídeo de la seva funcionalitat, si n'hi ha en aquest idioma. */}
      <section className="pt-seccio py-16">
        <div className="contenidor">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {principals.map((f, i) => targeta(f, i))}
          </div>
          {aMida.length > 0 && (
            <div className="pt-ix-baix grid md:grid-cols-2 gap-5 mt-5">
              {aMida.map((f, i) => targeta(f, principals.length + i))}
            </div>
          )}
        </div>
      </section>

      <VideoObert obert={obert} enTancar={() => setObert(null)} />

      {/* Al final, el «Te llamo» de la portada (13-10-2026: abans, una franja blava fosca) */}
      <Truca />
    </PageShell>
  );
}
