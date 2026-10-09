import React, { useCallback, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Calendar, MessageSquare, ShieldCheck, Sparkles, TrendingUp, Wallet, type LucideIcon } from 'lucide-react';
import { LangLink } from '@/i18n/LangLink';
import { cn } from '@/lib/utils';

/* Demos React lazy-loaded — només es carreguen quan la targeta és la de davant o una veïna */
const CheckinDemo = lazy(() => import('@/pages/funcionalidades/demos/CheckinDemo'));
const LimpiezasDemo = lazy(() => import('@/pages/funcionalidades/demos/LimpiezasDemo'));
const ChannelManagerDemo = lazy(() => import('@/pages/funcionalidades/demos/ChannelManagerDemo'));
const PreciosDinamicosDemo = lazy(() => import('@/pages/funcionalidades/demos/PreciosDinamicosDemo'));
const IAWhatsAppDemo = lazy(() => import('@/pages/funcionalidades/demos/IAWhatsAppDemo'));
const FinanzasDemo = lazy(() => import('@/pages/funcionalidades/demos/FinanzasDemo'));

/* ─────────────────────────────────────────────────────────
   HIGHLIGHT WORD — marker fluorescent que s'anima al ser visible
───────────────────────────────────────────────────────── */
const HighlightedWord: React.FC<{ word: string }> = ({ word }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });

  return (
    <span
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-block',
        fontWeight: 800,
        color: '#0f172a',
        padding: '0 2px',
        zIndex: 1,
      }}
    >
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.77, 0, 0.175, 1] }}
        style={{
          position: 'absolute',
          left: '-3px',
          right: '-3px',
          top: '35%',
          bottom: '-2px',
          background: 'linear-gradient(104deg, rgba(253, 224, 71, 0.85) 0%, rgba(250, 204, 21, 0.9) 50%, rgba(253, 224, 71, 0.85) 100%)',
          transformOrigin: 'left center',
          zIndex: -1,
          borderRadius: '2px',
          filter: 'blur(0.3px)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      {word}
    </span>
  );
};

/* ─────────────────────────────────────────────────────────
   CARD DATA
───────────────────────────────────────────────────────── */

type ReplacePhrase =
  | { phrase: string; price: string; inclusionLabel?: string }
  | { prefix: string; brands: string[]; suffix: string; price: string; inclusionLabel?: string };

interface CardData {
  id: number;
  /** Nom curt de la pestanya */
  tab: string;
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  replaces: ReplacePhrase;
  color: string;
  bg: string;
  textColor: string;
  mutedColor: string;
  /** Demo React animat. Es carrega lazy. Tots accepten `loop` (cicle infinit). */
  demoComponent: React.LazyExoticComponent<React.FC<{ loop?: boolean; staticMode?: boolean }>>;
  /** Slug de la pàgina de funcionalitat (/funcionalidades/{slug}). Si null, no es mostra CTA. */
  featureSlug: string | null;
}

const cardData: CardData[] = [
  // 1. Check-in — compliance legal (badge amb ✓ + fons verd menta)
  {
    id: 1,
    tab: 'Check-in y policía',
    icon: ShieldCheck,
    badge: '✓ Check-in y Policía',
    title: 'Registro de viajeros y taxa turística. Sin gestoría.',
    description: 'Los datos del huésped salen a la policía cada día, solos. Cumples con la normativa sin pensar en ello, y sin pagar a nadie por hacerlo.',
    replaces: {
      prefix: 'Cancela ',
      // Superhog i Akeero són verificació d'hostes i dipòsits: no fan el que fa Hostly.
      brands: ['Chekin', 'Partee'],
      suffix: ' hoy',
      price: '15 €/mes',
      inclusionLabel: 'gratis con Hostly',
    },
    color: 'rgba(34, 197, 94, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    demoComponent: CheckinDemo,
    featureSlug: 'check-in-online',
  },
  // 2. Limpieza — sense xifra (estalvi qualitatiu)
  {
    id: 2,
    tab: 'Limpiezas',
    icon: Sparkles,
    badge: 'Limpiezas y coordinación',
    title: 'Tu equipo recibe el aviso automáticamente.',
    description: 'Cuando el huésped hace la reserva, el sistema asigna el turno y avisa al equipo. Sin llamadas, sin grupos de WhatsApp, sin ti en medio. Automáticamente.',
    replaces: { phrase: 'Dile adiós al WhatsApp', price: '' },
    color: 'rgba(59, 130, 246, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #f0f6ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    demoComponent: LimpiezasDemo,
    featureSlug: 'gestion-de-limpiezas',
  },
  // 3. Reservas (Smoobu / Hostify / ...)
  {
    id: 3,
    tab: 'Calendario',
    icon: Calendar,
    badge: 'Reservas y calendarios',
    title: 'Airbnb y Booking, siempre sincronizados.',
    description: 'Una reserva entra por un canal, el otro se bloquea solo. Sin overbookings. Sin refrescar pestañas. Todo en un mismo lugar.',
    replaces: { prefix: 'Adiós a ', brands: ['Smoobu', 'Hostify', 'Lodgify', 'Hostaway'], suffix: '', price: '20 €/mes' },
    color: 'rgba(96, 165, 250, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    demoComponent: ChannelManagerDemo,
    featureSlug: 'channel-manager',
  },
  // 4. Precios dinámicos — el motor és PriceLabs (no es pot dir «desconecta PriceLabs»)
  {
    id: 4,
    tab: 'Precios',
    icon: TrendingUp,
    badge: 'Precios dinámicos',
    title: 'Precios al día, con PriceLabs dentro.',
    description: 'PriceLabs recomienda el precio de cada noche. Hostly aplica tus mínimos y temporadas y lo publica en Airbnb y Booking cada día.',
    replaces: { phrase: 'Sin abrir otra app', price: '' },
    color: 'rgba(251, 146, 60, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    demoComponent: PreciosDinamicosDemo,
    featureSlug: 'precios-dinamicos',
  },
  // 5. Mensajes — ningú paga 22 €/mes de ChatGPT per contestar hostes: fora la comparació
  {
    id: 5,
    tab: 'Mensajes',
    icon: MessageSquare,
    badge: 'Mensajes con huéspedes',
    title: 'Responde en segundos. Sin tocar el móvil.',
    description: 'Hostly contesta la mayoría al instante, en el idioma del huésped, y te avisa cuando hace falta una persona.',
    replaces: { phrase: 'Responde Hostly, no tú', price: '' },
    color: 'rgba(168, 85, 247, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    demoComponent: IAWhatsAppDemo,
    featureSlug: 'ia-whatsapp',
  },
  // 6. Pagos — "Nunca más un Excel" enlloc de "gestoria"
  {
    id: 6,
    tab: 'Pagos',
    icon: Wallet,
    badge: 'Pagos y facturas',
    title: 'Todo lo que cobras, dentro de Hostly.',
    description: 'Cierra el mes sin abrir Excel. Ingresos por plataforma, comisiones, liquidaciones y reparto propietario–gestor. En un solo lugar.',
    replaces: { phrase: 'Nunca más un Excel', price: '' },
    color: 'rgba(99, 102, 241, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    demoComponent: FinanzasDemo,
    featureSlug: 'finanzas',
  },
];

interface GlassCardText {
  tab?: string;
  badge: string;
  title: string;
  description: string;
  replaces_prefix?: string;
  replaces_suffix?: string;
  replaces_phrase?: string;
  replaces_inclusion?: string;
}

/* Merges i18n text over the static cardData (non-text fields stay from cardData) */
function useMergedCards(): typeof cardData {
  const { t } = useTranslation('home');
  const texts = t('glass_cards.cards', { returnObjects: true }) as GlassCardText[];
  if (!Array.isArray(texts)) return cardData;

  return cardData.map((card, idx) => {
    const tx = texts[idx];
    if (!tx) return card;

    const merged: typeof card = {
      ...card,
      tab: tx.tab ?? card.tab,
      badge: tx.badge ?? card.badge,
      title: tx.title ?? card.title,
      description: tx.description ?? card.description,
    };

    if ('prefix' in card.replaces) {
      merged.replaces = {
        ...card.replaces,
        prefix: tx.replaces_prefix ?? card.replaces.prefix,
        suffix: tx.replaces_suffix ?? card.replaces.suffix,
        ...(tx.replaces_inclusion !== undefined ? { inclusionLabel: tx.replaces_inclusion } : {}),
      };
    } else {
      merged.replaces = {
        ...card.replaces,
        phrase: tx.replaces_phrase ?? (card.replaces as { phrase: string }).phrase,
        ...(tx.replaces_inclusion !== undefined ? { inclusionLabel: tx.replaces_inclusion } : {}),
      };
    }

    return merged;
  });
}

/* Helper — cicle genèric amb crossfade */
function useCyclingItem<T>(items: T[] | undefined, intervalMs = 2600): T | null {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(interval);
  }, [items, intervalMs]);
  if (!items || items.length === 0) return null;
  return items[idx];
}

/* ─────────────────────────────────────────────────────────
   TARGETA — text a l'esquerra, demo animada a la dreta
───────────────────────────────────────────────────────── */

interface TargetaProps {
  card: typeof cardData[number];
  /** La demo només es munta a la targeta de davant i a les veïnes (són animacions contínues) */
  ambDemo: boolean;
}

const Targeta: React.FC<TargetaProps> = ({ card, ambDemo }) => {
  const { t } = useTranslation('home');

  // Si la targeta té marques cícliques, les va rotant
  const cyclingBrand = useCyclingItem('brands' in card.replaces ? card.replaces.brands : undefined, 2600);

  const solid = card.color.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)$/, ')');

  return (
    <div
      className="glass-card-wrapper"
      style={{ position: 'relative', width: '92%', maxWidth: '1200px', height: 'min(76vh, 680px)', minHeight: '600px', borderRadius: '28px', isolation: 'isolate' }}
    >
      {/* Conic border glow */}
      <div style={{
        position: 'absolute', inset: '-1px', borderRadius: '30px',
        background: `conic-gradient(from 0deg, transparent 0deg, ${card.color} 60deg, ${card.color.replace('0.9', '0.35')} 120deg, transparent 180deg, ${card.color.replace('0.9', '0.15')} 240deg, transparent 360deg)`,
        zIndex: -1, opacity: 0.45,
      }} />

      {/* Card body */}
      <div className="glass-card-body" style={{
        position: 'relative', width: '100%', height: '100%',
        display: 'grid', gridTemplateColumns: '2fr 3fr',
        borderRadius: '28px', background: card.bg,
        border: `1px solid ${card.color.replace('0.9', '0.12')}`,
        boxShadow: '0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
        overflow: 'hidden',
      }}>

        {/* Shine */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '50%', background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.15) 50%, transparent 100%)', pointerEvents: 'none', borderRadius: '28px 28px 0 0' }} />

        {/* Left: text */}
        <div className="glass-card-left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem 3rem 3rem 3.5rem', position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '6px', width: 'fit-content', marginBottom: '1.25rem', background: card.color.replace('0.9', '0.1'), color: solid, border: `1px solid ${card.color.replace('0.9', '0.2')}` }}>
            {card.badge}
          </span>
          <h3 className="glass-card-title" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: card.textColor, marginBottom: '1rem' }}>
            {card.title}
          </h3>
          <p className="glass-card-desc" style={{ fontSize: '0.95rem', lineHeight: 1.65, color: card.mutedColor, maxWidth: '380px', marginBottom: '1.5rem' }}>
            {card.description}
          </p>

          {/* Replaces — frase caligràfica amb personalitat per targeta */}
          <div className="glass-card-replaces" style={{
            paddingTop: '1.25rem',
            borderTop: '1px solid rgba(15,23,42,0.08)',
            maxWidth: '380px',
          }}>
            <p
              className="font-accent glass-card-replaces-phrase"
              style={{
                fontSize: 'clamp(1.35rem, 2.1vw, 1.85rem)',
                color: solid,
                letterSpacing: '-0.015em',
                lineHeight: 1.1,
                marginBottom: '0.6rem',
              }}
            >
              {'brands' in card.replaces ? (
                <>
                  {card.replaces.prefix}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cyclingBrand}
                      initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                    >
                      {cyclingBrand}
                    </motion.span>
                  </AnimatePresence>
                  {card.replaces.suffix}
                </>
              ) : (
                card.replaces.phrase
              )}
              .
            </p>
            <p style={{
              fontSize: '13px',
              color: 'rgba(15,23,42,0.5)',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}>
              {/* Si hi ha price, mostra "Te ahorras X · ". Altrament, només inclusionLabel */}
              {card.replaces.price && (
                <>
                  <span>{t('glass_cards.te_ahorras')}</span>
                  {(() => {
                    const isMonetary = card.replaces.price.includes('€');
                    return (
                      <span style={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'rgba(15,23,42,0.72)',
                        textDecoration: isMonetary ? 'line-through' : 'none',
                        textDecorationThickness: isMonetary ? '2px' : undefined,
                        textDecorationColor: isMonetary ? 'rgba(15,23,42,0.6)' : undefined,
                        fontVariantNumeric: isMonetary ? 'tabular-nums' : 'normal',
                      }}>
                        {card.replaces.price}
                      </span>
                    );
                  })()}
                  <span className="glass-card-sep" style={{ color: 'rgba(15,23,42,0.3)' }}>·</span>
                </>
              )}
              {(() => {
                const label = card.replaces.inclusionLabel ?? t('glass_cards.incluido_en_hostly');
                // Si la label comença amb "gratis", la destaquem amb marker florescent
                if (label.toLowerCase().startsWith('gratis')) {
                  const rest = label.replace(/^gratis\s*/i, '');
                  return (
                    <span className="glass-card-incl">
                      <HighlightedWord word="gratis" />{' '}{rest}
                    </span>
                  );
                }
                return <span className="glass-card-incl">{label}</span>;
              })()}
            </p>
          </div>

          {/* CTA — enllaç a la pàgina de funcionalitat (només si la targeta en té) */}
          {card.featureSlug && (
            <LangLink
              to={`/funcionalidades/${card.featureSlug}`}
              className="glass-card-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                marginTop: '1.25rem',
                padding: '0.625rem 1.1rem',
                borderRadius: '999px',
                background: solid,
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '-0.005em',
                width: 'fit-content',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: `0 6px 20px -8px ${card.color.replace('0.9', '0.5')}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `0 10px 24px -8px ${card.color.replace('0.9', '0.6')}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 6px 20px -8px ${card.color.replace('0.9', '0.5')}`;
              }}
            >
              {t('glass_cards.see_more')}
              <ArrowRight style={{ width: 14, height: 14 }} />
            </LangLink>
          )}
        </div>

        {/* Right: demo animada (té el seu propi marc de navegador i 3D) */}
        <div className="glass-card-right" style={{
          position: 'relative',
          zIndex: 1,
          padding: '2rem 2.5rem 2rem 0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: '2200px',
        }}>
          {/* Glow ambient tintat del color de la targeta */}
          <div style={{
            position: 'absolute',
            left: '8%', right: '4%', bottom: '8%', height: '45%',
            background: `radial-gradient(ellipse at center, ${card.color.replace('0.9', '0.35')} 0%, transparent 70%)`,
            filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
          }} />
          {ambDemo && (
            <Suspense fallback={null}>
              <div className="glass-card-demo" style={{
                position: 'relative', zIndex: 1,
                width: '100%',
                transform: 'scale(0.85)',
                transformOrigin: 'center center',
              }}>
                <card.demoComponent loop />
              </div>
            </Suspense>
          )}
        </div>

      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   «LO QUE REEMPLAZA» — 6 targetes en una tira amb pestanyes

   Fins a la versió 05 eren 6 targetes apilades a pantalla completa: 5.400 px de
   scroll només en aquesta secció (la Marta: «la web és un scroll infinit»). Ara és
   una sola targeta amb 6 pestanyes. Mentre es mira, avança sola (la píndola de
   davant s'omple); en el moment que la persona tria una pestanya o llisca amb el
   dit, es queda quieta on ha triat. Al mòbil es passa amb el dit (es veu la vora
   de la següent).
───────────────────────────────────────────────────────── */

const DURADA_MS = 8000;

export const GlassCards: React.FC = () => {
  const { t } = useTranslation('home');
  const cards = useMergedCards();
  const n = cards.length;
  const reduir = useReducedMotion();

  const seccioRef = useRef<HTMLDivElement>(null);
  const filaRef = useRef<HTMLDivElement>(null);
  const tiraRef = useRef<HTMLDivElement>(null);
  const visible = useInView(seccioRef, { amount: 0.35 });

  const [actiu, setActiu] = useState(0);
  const actiuRef = useRef(0);
  // L'usuari ja ha triat: no avancem mai més sols
  const [aturat, setAturat] = useState(false);
  // Ratolí a sobre o focus a dins: esperem
  const [pausa, setPausa] = useState(false);
  // Destí d'un desplaçament fet per nosaltres: mentre hi anem, les targetes que passen no compten
  const destiRef = useRef<number | null>(null);
  const toc = useRef<{ x: number; y: number } | null>(null);

  const progres = useMotionValue(0);
  const omplert = useTransform(progres, (p) => `inset(0 ${(1 - p) * 100}% 0 0 round 999px)`);

  const marca = useCallback((i: number) => {
    actiuRef.current = i;
    setActiu(i);
  }, []);

  // Porta la tira a la targeta i (només es mou la tira, mai la pàgina)
  const vesA = useCallback((i: number) => {
    const tira = tiraRef.current;
    const slide = tira?.children[i] as HTMLElement | undefined;
    if (!tira || !slide) return;
    progres.set(0);
    marca(i);
    const left = slide.offsetLeft - (tira.clientWidth - slide.clientWidth) / 2;
    if (Math.abs(tira.scrollLeft - left) < 2) return;
    destiRef.current = i;
    window.setTimeout(() => { if (destiRef.current === i) destiRef.current = null; }, 1500);
    tira.scrollTo({ left, behavior: reduir ? 'auto' : 'smooth' });
  }, [marca, progres, reduir]);

  const atura = useCallback(() => {
    setAturat(true);
    progres.set(0);
    destiRef.current = null;
  }, [progres]);

  // Quina targeta és la de davant (llisca el dit, o la tira arriba on l'hem enviada)
  useEffect(() => {
    const tira = tiraRef.current;
    if (!tira) return;
    const io = new IntersectionObserver((entrades) => {
      for (const e of entrades) {
        if (e.intersectionRatio < 0.6) continue;
        const i = Number((e.target as HTMLElement).dataset.index);
        if (destiRef.current !== null) {
          if (i !== destiRef.current) continue;
          destiRef.current = null;
        }
        if (i !== actiuRef.current) {
          progres.set(0);
          marca(i);
        }
      }
    }, { root: tira, threshold: [0.6] });
    Array.from(tira.children).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [n, marca, progres]);

  // Avança sola mentre es veu, ningú l'ha tocada i no hi ha el ratolí a sobre
  const corre = visible && !aturat && !pausa && !reduir;
  useEffect(() => {
    if (!corre) return;
    let raf = 0;
    let abans = performance.now();
    const pas = (ara: number) => {
      const p = progres.get() + (ara - abans) / DURADA_MS;
      abans = ara;
      if (p >= 1) vesA((actiuRef.current + 1) % n);
      else progres.set(p);
      raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(raf);
  }, [corre, n, progres, vesA]);

  // La píndola de davant sempre a la vista (al mòbil la fila llisca)
  useEffect(() => {
    const fila = filaRef.current;
    const pill = fila?.children[actiu] as HTMLElement | undefined;
    if (!fila || !pill || fila.scrollWidth <= fila.clientWidth) return;
    fila.scrollTo({ left: pill.offsetLeft - (fila.clientWidth - pill.clientWidth) / 2, behavior: reduir ? 'auto' : 'smooth' });
  }, [actiu, reduir]);

  function tria(i: number) {
    atura();
    vesA(i);
  }

  function teclat(e: React.KeyboardEvent) {
    const desti: Record<string, number> = { ArrowRight: actiu + 1, ArrowLeft: actiu - 1, Home: 0, End: n - 1 };
    if (!(e.key in desti)) return;
    e.preventDefault();
    const i = (desti[e.key] + n) % n;
    tria(i);
    (filaRef.current?.children[i] as HTMLElement | undefined)?.focus();
  }

  return (
    <div
      id="funciones"
      ref={seccioRef}
      className="pt-8 md:pt-10 pb-12 md:pb-16"
      style={{ background: '#f8fafc' }}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPausa(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setPausa(false); }}
      onFocusCapture={() => setPausa(true)}
      onBlurCapture={() => setPausa(false)}
    >
      {/* Pestanyes */}
      <div
        ref={filaRef}
        role="tablist"
        aria-label={t('features.eyebrow')}
        onKeyDown={teclat}
        className="relative flex gap-2 overflow-x-auto px-4 md:px-6 md:flex-wrap md:justify-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card, i) => {
          const Icona = card.icon;
          const sel = i === actiu;
          return (
            <button
              key={card.id}
              id={`reemplaza-tab-${card.id}`}
              type="button"
              role="tab"
              aria-selected={sel}
              aria-controls={`reemplaza-${card.id}`}
              tabIndex={sel ? 0 : -1}
              onClick={() => tria(i)}
              className={cn(
                'relative shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-full border text-sm font-semibold overflow-hidden transition-colors duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
                sel
                  ? 'bg-foreground border-foreground text-white'
                  : 'bg-white border-slate-200 text-foreground/70 hover:bg-slate-50 hover:text-foreground',
              )}
            >
              {sel && corre && (
                <motion.span aria-hidden="true" className="absolute inset-0 bg-white/20" style={{ clipPath: omplert }} />
              )}
              <Icona className="relative w-4 h-4" aria-hidden="true" />
              <span className="relative whitespace-nowrap">{card.tab}</span>
            </button>
          );
        })}
      </div>

      {/* La tira: una targeta per pantalla; al mòbil es veu la vora de les veïnes */}
      <div
        ref={tiraRef}
        className="glass-tira relative flex overflow-x-auto snap-x snap-mandatory py-8 md:py-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onTouchStart={(e) => { const p = e.touches[0]; toc.current = { x: p.clientX, y: p.clientY }; }}
        onTouchMove={(e) => {
          const inici = toc.current;
          if (!inici) return;
          const p = e.touches[0];
          const dx = Math.abs(p.clientX - inici.x);
          if (dx > 10 && dx > Math.abs(p.clientY - inici.y)) { atura(); toc.current = null; }
        }}
        onWheel={(e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) atura(); }}
      >
        {cards.map((card, i) => (
          <div
            key={card.id}
            id={`reemplaza-${card.id}`}
            data-index={i}
            role="tabpanel"
            aria-labelledby={`reemplaza-tab-${card.id}`}
            className="glass-slide snap-center shrink-0 w-full flex justify-center"
            onClick={i !== actiu ? () => tria(i) : undefined}
          >
            {/* Les de darrere no es poden enfocar ni clicar per dins (inert) */}
            <div className="w-full flex justify-center" {...(i !== actiu ? { inert: '' } : {})}>
              <Targeta card={card} ambDemo={Math.abs(i - actiu) <= 1} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlassCards;
