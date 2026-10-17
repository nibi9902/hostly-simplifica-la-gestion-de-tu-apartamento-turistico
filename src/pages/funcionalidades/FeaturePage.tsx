/**
 * La pàgina de cada funcionalitat (/funcionalidades/<slug>), amb les peces de la portada (13-10-2026):
 * el retol i els títols de la casa, els passos amb el número gran en gris (com «Así se empieza»), els
 * avantatges com una llista amb el tic (com als preus), els exemples i les relacionades en peces com
 * les de «Gratis para siempre», les preguntes obertes (com a /precios) i, al final, el «Te llamo».
 * Abans: fons blau clar amb lluïssor, números en quadrats amb degradat, caixes verdes i preguntes
 * desplegables. Els textos són a `src/lib/data/features.ts` (i `.ca.ts`).
 * Al mòbil (17-10, opcions 8B i 9A del Biel): els passos són targetes que llisquen, cadascuna amb la
 * seva mini pantalla (`PantallaPas`), i «En la práctica» i les relacionades també llisquen. A
 * l'ordinador no canvia res.
 * A dalt, la demo animada (`MiniDemo`), que s'entén més de pressa; el vídeo de la funcionalitat va a
 * «Cómo funciona», amb els passos com a capítols (idea B del llenç del 17-10, `PassosVideo`). Sense
 * vídeo en aquest idioma (ara, tot el català), «Cómo funciona» es queda com era.
 */
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { iconaFuncio } from '@/lib/data/iconesFuncions';
import { ArrowRight, Check } from 'lucide-react';
import { FUNCIONS_APART, FUNCIONS_GRATIS, type Feature } from '@/lib/data/features';
import { useFeatures } from '@/lib/data/useFeatures';
import { videoDeLaFuncio } from '@/lib/data/videosFuncions';
import { useLang } from '@/i18n/useLang';
import { useTranslation } from 'react-i18next';
import PageShell from '@/components/PageShell';
import MiniDemo from './MiniDemo';
import PassosVideo from './PassosVideo';
import PantallaPas from './PantallaPas';
import PuntsLliscador from '@/components/portada/PuntsLliscador';
import { useEsTira, useLliscador } from '@/components/portada/useLliscador';
import { faqPageSchema, breadcrumbSchema, howToSchema } from '@/lib/seo/schemas';
import { LangLink } from '@/i18n/LangLink';
import { useEmpezar } from "@/lib/empezar";
import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";

const ease = [0.22, 1, 0.36, 1] as const;
// Cada bloc entra una sola vegada, en arribar-hi (sense rebot)
const entra = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease },
};

interface Props {
  feature: Feature;
}

export default function FeaturePage({ feature }: Props) {
  const empezar = useEmpezar();
  const { t } = useTranslation('funcionalidades');
  const { t: tEmbut } = useTranslation('embut');
  const allFeatures = useFeatures();
  const passos = useLliscador<HTMLOListElement>();
  const { lang } = useLang();
  const video = videoDeLaFuncio(feature.slug, lang);
  const gratis = FUNCIONS_GRATIS.has(feature.slug);
  const aparte = FUNCIONS_APART.has(feature.slug);
  // Al mòbil les peces són tires que llisquen: sense l'entrada d'una en una (pujaven en lliscar)
  const tira = useEsTira();
  const entraPeca = (i: number) => (tira ? {} : { ...entra, transition: { ...entra.transition, delay: i * 0.06 } });
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
      {/* ── L'entrada: el text a l'esquerra i la demo a la dreta ── */}
      <section className="pt-seccio pt-fp-entrada">
        <div className="contenidor pt-fp-entrada-graella">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="pt-fp-entrada-text">
            <nav aria-label="breadcrumb" className="pt-molles">
              <LangLink to="/">{t('page.breadcrumb_home')}</LangLink>
              <span aria-hidden="true">/</span>
              <LangLink to="/funcionalidades">{t('page.breadcrumb_features')}</LangLink>
              <span aria-hidden="true">/</span>
              <span>{feature.name}</span>
            </nav>
            {gratis || aparte ? (
              <div className="pt-fp-retols">
                <p className="pt-retol">{feature.name}</p>
                {gratis
                  ? <span className="pt-fp-gratis">{t('index.card_plan_gratis')}</span>
                  : <span className="pt-fp-aparte">{t('index.card_plan_aparte')}</span>}
              </div>
            ) : (
              <p className="pt-retol">{feature.name}</p>
            )}
            <h1 className="pt-fp-h1">{feature.hero.h1}</h1>
            <p className="pt-lead">{feature.hero.sub}</p>
            <div className="pt-fp-botons">
              {/* al pla Gratis, el botó diu que és gratis i no cal mirar preus (el Biel, 17-10) */}
              <button type="button" onClick={empezar} className="pt-pill pt-pill-pri">{gratis ? t('page.cta_gratis') : tEmbut('cta')}</button>
              {!gratis && <LangLink to="/precios" className="pt-pill pt-pill-sec">{t('page.ver_precios')}</LangLink>}
            </div>
          </motion.div>
          {/* La demo és una il·lustració: el text de la pàgina ja ho explica */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15, ease }} className="pt-fp-demo" aria-hidden="true">
            <MiniDemo slug={feature.slug} iconName={feature.iconName} />
          </motion.div>
        </div>
      </section>

      {/* ── El problema ── */}
      <section className="pt-seccio pt-fp-bloc">
        <motion.div {...entra} className="contenidor pt-fp-dues">
          <div>
            <p className="pt-retol">{t('page.problem_eyebrow')}</p>
            <h2 className="pt-fp-h2">{feature.problem.title}</h2>
          </div>
          <p className="pt-fp-text">{feature.problem.body}</p>
        </motion.div>
      </section>

      {/* ── Com funciona: el número gran en gris, com «Así se empieza» ── */}
      <section className="pt-seccio pt-fp-bloc pt-fp-gris">
        <div className="contenidor">
          <motion.div {...entra}>
            <p className="pt-retol">{t('page.how_eyebrow')}</p>
            <h2 className="pt-fp-h2">{t('page.how_title', { count: feature.howItWorks.length })}</h2>
          </motion.div>
          {video ? (
            // key: d'una funcionalitat a una altra, el vídeo torna a començar de zero
            <PassosVideo key={feature.slug} feature={feature} video={video} />
          ) : (
            <>
              <ol ref={passos.ref} className="pt-fp-passos pt-llisca" onScroll={passos.enLliscar} style={{ '--n': feature.howItWorks.length } as CSSProperties}>
                {feature.howItWorks.map((step, i) => (
                  <motion.li key={step.step} {...entraPeca(i)} className="pt-pas">
                    <small aria-hidden="true">{String(step.step).padStart(2, '0')}</small>
                    <p className="pt-fp-paso" aria-hidden="true">{t('page.step_of', { n: step.step, total: feature.howItWorks.length })}</p>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                    {step.pantalla && <PantallaPas files={step.pantalla} />}
                  </motion.li>
                ))}
              </ol>
              <PuntsLliscador n={feature.howItWorks.length} pas={passos.pas} vesA={passos.vesA} />
            </>
          )}
        </div>
      </section>

      {/* ── El que notaràs: una llista amb el tic, com als preus ── */}
      <section className="pt-seccio pt-fp-bloc">
        <div className="contenidor">
          <motion.div {...entra}>
            <p className="pt-retol">{t('page.advantages_eyebrow')}</p>
            <h2 className="pt-fp-h2">{t('page.advantages_title')}</h2>
          </motion.div>
          <motion.ul {...entra} className="pt-fp-checks">
            {feature.advantages.map((adv) => (
              <li key={adv}><Check className="pt-ic" strokeWidth={2.6} aria-hidden="true" />{adv}</li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* ── A la pràctica ── */}
      <section className="pt-seccio pt-fp-bloc pt-fp-gris">
        <div className="contenidor">
          <motion.div {...entra}>
            <p className="pt-retol">{t('page.usage_eyebrow')}</p>
            <h2 className="pt-fp-h2">{t('page.usage_title')}</h2>
          </motion.div>
          <div className="pt-fp-peces pt-llisca">
            {feature.usage.map((u, i) => (
              <motion.div key={u.title} {...entraPeca(i)} className="pt-fp-peca">
                <h3>{u.title}</h3>
                <p>{u.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Les relacionades ── */}
      {related.length > 0 && (
        <section className="pt-seccio pt-fp-bloc">
          <div className="contenidor">
            <motion.div {...entra}>
              <p className="pt-retol">{t('page.related_eyebrow')}</p>
              <h2 className="pt-fp-h2">{t('page.related_title')}</h2>
            </motion.div>
            <div className="pt-fp-peces pt-fp-relacionades pt-llisca">
              {related.map((rf) => {
                const RIcon = iconaFuncio(rf.iconName);
                return (
                  <LangLink key={rf.slug} to={`/funcionalidades/${rf.slug}`} className="pt-fp-peca pt-fp-enllac">
                    <RIcon className="pt-ic" aria-hidden="true" />
                    <h3>{rf.name}</h3>
                    <p>{rf.shortDescription}</p>
                    <span className="pt-fp-mes">{t('page.related_cta')} <ArrowRight className="pt-ic" aria-hidden="true" /></span>
                  </LangLink>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Les preguntes, obertes (com a /precios) ── */}
      <section className="pt-seccio pt-preguntes" aria-labelledby="pt-fp-preguntes">
        <div className="contenidor pt-preguntes-graella">
          <div className="pt-preguntes-cap">
            <p className="pt-retol">{t('page.faqs_eyebrow')}</p>
            <h2 id="pt-fp-preguntes">{t('page.faqs_title')}</h2>
          </div>
          <dl className="pt-preguntes-llista">
            {feature.faqs.map((faq) => (
              <div key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Al final, el «Te llamo» de la portada */}
      <Truca />
    </PageShell>
  );
}
