import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { LangLink } from '@/i18n/LangLink';

/* Demos React lazy-loaded — només es carreguen quan la card és a viewport */
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

/* Real app screenshots — WebP amb PNG fallback */
const appCheckinAutonomo = '/assets/app-screenshots/checkin-autonomo.png';
const appDetallReserva   = '/assets/app-screenshots/detall-reserva.png';
const appXats            = '/assets/app-screenshots/xats.png';
const appNetejaLlista    = '/assets/app-screenshots/neteja-llista.png';
const appCalendari       = '/assets/app-screenshots/calendari.png';
const appFinances        = '/assets/app-screenshots/finances.png';
const appCodiAcces       = '/assets/app-screenshots/codi-acces.png';

function toWebp(src: string): string {
  return src.replace(/\.(png|jpe?g)$/i, '.webp');
}

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────
   CARD DATA
───────────────────────────────────────────────────────── */

type ReplacePhrase =
  | { phrase: string; price: string; inclusionLabel?: string }
  | { prefix: string; brands: string[]; suffix: string; price: string; inclusionLabel?: string };

interface Person {
  name: string;
  photo: string;
  role: string;
  message: string;
}

interface CardData {
  id: number;
  badge: string;
  title: string;
  description: string;
  replaces: ReplacePhrase;
  freeBadge: string | null;
  color: string;
  bg: string;
  textColor: string;
  mutedColor: string;
  imageSrc: string | null;
  screen: React.ReactNode | null;
  /** Demo React animat — té prioritat sobre imageSrc. Es carrega lazy.
   *  Tots els demos accepten `loop` (cicle infinit) i `staticMode` (sense animacions internes). */
  demoComponent?: React.LazyExoticComponent<React.FC<{ loop?: boolean; staticMode?: boolean }>>;
  /** URL mostrada a la chrome del mockup de browser */
  mockupUrl: string;
  /** Slug de la pàgina de funcionalitat (/funcionalidades/{slug}). Si null, no es mostra CTA. */
  featureSlug: string | null;
  /** Variant: 'app' (browser mockup) | 'photo' (retrat humà amb chat overlay) */
  variant?: 'app' | 'photo';
  /** Per variant 'photo': cicle de persones (cada una amb foto + nom + rol + missatge propi) */
  photoBubble?: { people: Person[] };
}

const cardData: CardData[] = [
  // 1. Check-in — compliance legal (badge amb ✓ + fons verd menta)
  {
    id: 1,
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
    freeBadge: null,
    color: 'rgba(34, 197, 94, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    imageSrc: appCheckinAutonomo,
    screen: null,
    demoComponent: CheckinDemo,
    mockupUrl: 'app.hostlylabs.com/check-in',
    featureSlug: 'check-in-online',
  },
  // 2. Limpieza — sense xifra (estalvi qualitatiu)
  {
    id: 2,
    badge: 'Limpiezas y coordinación',
    title: 'Tu equipo recibe el aviso automáticamente.',
    description: 'Cuando el huésped hace la reserva, el sistema asigna el turno y avisa al equipo. Sin llamadas, sin grupos de WhatsApp, sin ti en medio. Automáticamente.',
    replaces: { phrase: 'Dile adiós al WhatsApp', price: '' },
    freeBadge: null,
    color: 'rgba(59, 130, 246, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #f0f6ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    imageSrc: appNetejaLlista,
    screen: null,
    demoComponent: LimpiezasDemo,
    mockupUrl: 'app.hostlylabs.com/limpiezas',
    featureSlug: 'gestion-de-limpiezas',
  },
  // 3. Reservas (Smoobu / Hostify / ...)
  {
    id: 3,
    badge: 'Reservas y calendarios',
    title: 'Airbnb y Booking, siempre sincronizados.',
    description: 'Una reserva entra por un canal, el otro se bloquea solo. Sin overbookings. Sin refrescar pestañas. Todo en un mismo lugar.',
    replaces: { prefix: 'Adiós a ', brands: ['Smoobu', 'Hostify', 'Lodgify', 'Hostaway'], suffix: '', price: '20 €/mes' },
    freeBadge: null,
    color: 'rgba(96, 165, 250, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    imageSrc: appCalendari,
    screen: null,
    demoComponent: ChannelManagerDemo,
    mockupUrl: 'app.hostlylabs.com/calendario',
    featureSlug: 'channel-manager',
  },
  // 4. Precios dinámicos — el motor és PriceLabs (no es pot dir «desconecta PriceLabs»)
  {
    id: 4,
    badge: 'Precios dinámicos',
    title: 'Precios al día, con PriceLabs dentro.',
    description: 'PriceLabs recomienda el precio de cada noche. Hostly aplica tus mínimos y temporadas y lo publica en Airbnb y Booking cada día.',
    replaces: { phrase: 'Sin abrir otra app', price: '' },
    freeBadge: null,
    color: 'rgba(251, 146, 60, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    imageSrc: appDetallReserva,
    screen: null,
    demoComponent: PreciosDinamicosDemo,
    mockupUrl: 'app.hostlylabs.com/precios',
    featureSlug: 'precios-dinamicos',
  },
  // 5. Mensajes — ningú paga 22 €/mes de ChatGPT per contestar hostes: fora la comparació
  {
    id: 5,
    badge: 'Mensajes con huéspedes',
    title: 'Responde en segundos. Sin tocar el móvil.',
    description: 'Hostly contesta la mayoría al instante, en el idioma del huésped, y te avisa cuando hace falta una persona.',
    replaces: { phrase: 'Responde Hostly, no tú', price: '' },
    freeBadge: null,
    color: 'rgba(168, 85, 247, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    imageSrc: appXats,
    screen: null,
    demoComponent: IAWhatsAppDemo,
    mockupUrl: 'app.hostlylabs.com/mensajes',
    featureSlug: 'ia-whatsapp',
  },
  // 6. Pagos — "Nunca más un Excel" enlloc de "gestoria"
  {
    id: 6,
    badge: 'Pagos y facturas',
    title: 'Todo lo que cobras, dentro de Hostly.',
    description: 'Cierra el mes sin abrir Excel. Ingresos por plataforma, comisiones, liquidaciones y reparto propietario–gestor. En un solo lugar.',
    replaces: { phrase: 'Nunca más un Excel', price: '' },
    freeBadge: null,
    color: 'rgba(99, 102, 241, 0.9)',
    bg: 'linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)',
    textColor: '#0f172a',
    mutedColor: 'rgba(15, 23, 42, 0.55)',
    imageSrc: appFinances,
    screen: null,
    demoComponent: FinanzasDemo,
    mockupUrl: 'app.hostlylabs.com/finanzas',
    featureSlug: 'finanzas',
  },
];

interface GlassCardText {
  badge: string;
  title: string;
  description: string;
  replaces_prefix?: string;
  replaces_suffix?: string;
  replaces_phrase?: string;
  replaces_inclusion?: string;
  coach_messages?: Array<{ name: string; role: string; message: string }>;
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

    if (card.photoBubble && tx.coach_messages) {
      merged.photoBubble = {
        people: card.photoBubble.people.map((person, pi) => ({
          ...person,
          role: tx.coach_messages![pi]?.role ?? person.role,
          message: tx.coach_messages![pi]?.message ?? person.message,
        })),
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

/** Retro-compatibility: l'ús existent per brands segueix funcionant */
const useCyclingBrand = (brands: string[] | undefined) => useCyclingItem(brands, 2600);

/* ─────────────────────────────────────────────────────────
   CARD ITEM
───────────────────────────────────────────────────────── */

interface CardItemProps {
  card: typeof cardData[number];
  index: number;
  totalCards: number;
}

const CardItem: React.FC<CardItemProps> = ({ card, index, totalCards }) => {
  const { t } = useTranslation('home');
  const cardRef      = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Si la card té brands cíclics, els rota cada 0.7s
  const cyclingBrand = useCyclingBrand(
    'brands' in card.replaces ? card.replaces.brands : undefined
  );

  // Si la card és variant 'photo', cicla entre les persones (foto + nom + rol)
  const cyclingPerson = useCyclingItem(
    card.variant === 'photo' ? card.photoBubble?.people : undefined,
    3500, // una mica més lent que brands perquè la foto té més pes visual
  );

  useEffect(() => {
    const cardEl    = cardRef.current;
    const container = containerRef.current;
    if (!cardEl || !container) return;

    const isMobile = typeof window !== 'undefined'
      && window.matchMedia('(max-width: 767px)').matches;

    const targetScale = 1 - (totalCards - index) * 0.04;
    gsap.set(cardEl, { scale: 1, transformOrigin: 'center top', autoAlpha: 1 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      onUpdate: (self) => {
        // A mòbil: card visible normal mentre el seu scrub està en curs.
        // Quan acaba (progress > 0.85) fa fade-out → no queda apilada darrere de les següents.
        // A desktop: comportament original (stack visible).
        const fadeStart = 0.85;
        const alpha = isMobile && self.progress > fadeStart
          ? Math.max(0, 1 - (self.progress - fadeStart) / (1 - fadeStart))
          : 1;
        gsap.set(cardEl, {
          scale: Math.max(gsap.utils.interpolate(1, targetScale, self.progress), targetScale),
          transformOrigin: 'center top',
          autoAlpha: alpha,
        });
      },
    });

    return () => { trigger.kill(); };
  }, [index, totalCards]);

  const solid = card.color.replace('rgba', 'rgb').replace(/,\s*[\d.]+\)$/, ')');

  return (
    <div
      ref={containerRef}
      className="glass-sticky-container"
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0 }}
    >
      <div
        ref={cardRef}
        className="glass-card-wrapper"
        style={{ position: 'relative', width: '92%', maxWidth: '1200px', height: '78vh', maxHeight: '720px', minHeight: '620px', borderRadius: '28px', isolation: 'isolate', top: `calc(-4vh + ${index * 20}px)`, transformOrigin: 'top' }}
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
            {/* Row amb el badge + freeBadge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '6px', width: 'fit-content', background: card.color.replace('0.9', '0.1'), color: solid, border: `1px solid ${card.color.replace('0.9', '0.2')}` }}>
                {card.badge}
              </span>
              {card.freeBadge && (
                <span style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '999px', background: '#dcfce7', color: '#16a34a' }}>
                  {card.freeBadge}
                </span>
              )}
            </div>
            <h3 className="glass-card-title" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.1rem)', fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.03em', color: card.textColor, marginBottom: '1rem' }}>
              {card.title}
            </h3>
            <p className="glass-card-desc" style={{ fontSize: '0.95rem', lineHeight: 1.65, color: card.mutedColor, maxWidth: '380px', marginBottom: '1.5rem' }}>
              {card.description}
            </p>

            {/* Replaces — frase caligràfica amb personalitat per card */}
            {card.replaces && (
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
                  ) : card.variant === 'photo' && cyclingPerson ? (
                    <>
                      {t('glass_cards.hola')},{' '}
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={cyclingPerson.name}
                          initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
                          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
                          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
                        >
                          {cyclingPerson.name}
                        </motion.span>
                      </AnimatePresence>
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
                      <span style={{ color: 'rgba(15,23,42,0.3)' }}>·</span>
                    </>
                  )}
                  {(() => {
                    const label = card.replaces.inclusionLabel ?? t('glass_cards.incluido_en_hostly');
                    // Si la label comença amb "gratis", la destaquem amb marker florescent
                    if (label.toLowerCase().startsWith('gratis')) {
                      const rest = label.replace(/^gratis\s*/i, '');
                      return (
                        <span>
                          <HighlightedWord word="gratis" />{' '}{rest}
                        </span>
                      );
                    }
                    return <span>{label}</span>;
                  })()}
                </p>
              </div>
            )}

            {/* CTA — enllaç a la pàgina de funcionalitat (només si la card en té) */}
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

          {/* Right: screenshot integrat amb browser mockup (O portrait + chat bubble si variant='photo') */}
          <div className="glass-card-right" style={{
            position: 'relative',
            zIndex: 1,
            padding: '2rem 2.5rem 2rem 0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '2200px',
          }}>
            {card.variant === 'photo' && cyclingPerson ? (
              /* ─── PHOTO VARIANT — portrait + chat bubble overlay, amb cicle de persones ─── */
              <>
                {/* Glow càlid darrere */}
                <div style={{
                  position: 'absolute',
                  left: '8%', right: '4%', bottom: '8%', height: '55%',
                  background: `radial-gradient(ellipse at center, ${card.color.replace('0.9', '0.4')} 0%, transparent 70%)`,
                  filter: 'blur(45px)', zIndex: 0, pointerEvents: 'none',
                }} />

                <div style={{
                  position: 'relative',
                  width: '100%', maxWidth: '460px',
                  aspectRatio: '4 / 5',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-3deg) rotateX(0.5deg)',
                  boxShadow: `
                    0 60px 120px -20px ${card.color.replace('0.9', '0.35')},
                    0 30px 60px -30px rgba(15, 23, 42, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.9) inset,
                    0 1px 2px rgba(15, 23, 42, 0.08)
                  `,
                  zIndex: 1,
                }}>
                  {/* Foto — crossfade entre persones */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={cyclingPerson.photo}
                      src={cyclingPerson.photo}
                      alt={cyclingPerson.name}
                      initial={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                      transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center top',
                        display: 'block',
                      }}
                    />
                  </AnimatePresence>

                  {/* Gradient inferior per legibilitat de la bubble */}
                  <div style={{
                    position: 'absolute',
                    left: 0, right: 0, bottom: 0,
                    height: '55%',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.15) 40%, rgba(15,23,42,0.55) 100%)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }} />

                  {/* Chat bubble — missatge + autor (tots dos ciclan sincronitzats) */}
                  {card.photoBubble && (
                    <div style={{
                      position: 'absolute',
                      left: '6%', right: '6%', bottom: '14%',
                      padding: '16px 18px',
                      borderRadius: '18px 18px 18px 4px',
                      background: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow: '0 20px 50px -10px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(255,255,255,0.5) inset',
                      zIndex: 2,
                      minHeight: '130px',
                    }}>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={cyclingPerson.name + '-msg'}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            fontSize: '14px',
                            lineHeight: 1.5,
                            color: '#0f172a',
                            margin: 0,
                            fontWeight: 500,
                          }}
                        >
                          {cyclingPerson.message}
                        </motion.p>
                      </AnimatePresence>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        marginTop: '10px', paddingTop: '10px',
                        borderTop: '1px solid rgba(15, 23, 42, 0.06)',
                      }}>
                        {/* Avatar amb inicial de la persona actual */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={cyclingPerson.name + '-avatar'}
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: `linear-gradient(135deg, ${solid}, ${solid.replace('rgb', 'rgba').replace(')', ', 0.7)')})`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#fff', fontSize: '10px', fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {cyclingPerson.name[0]}
                          </motion.div>
                        </AnimatePresence>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={cyclingPerson.name + '-name'}
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
                                {cyclingPerson.name}
                              </div>
                              <div style={{ fontSize: '10px', color: 'rgba(15,23,42,0.5)', marginTop: '2px' }}>
                                {cyclingPerson.role}
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '3px',
                          fontSize: '10px', color: '#16a34a', fontWeight: 600,
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a' }} />
                          {t('glass_cards.en_linea')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reflex fi superior */}
                  <div style={{
                    position: 'absolute',
                    top: '1px', left: '8%', right: '8%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }} />
                </div>
              </>
            ) : card.demoComponent ? (
              /* ─── DEMO REACT ANIMAT — té el seu propi browser chrome i 3D ─── */
              <>
                {/* Glow ambient tintat del color de la card */}
                <div style={{
                  position: 'absolute',
                  left: '8%', right: '4%', bottom: '8%', height: '45%',
                  background: `radial-gradient(ellipse at center, ${card.color.replace('0.9', '0.35')} 0%, transparent 70%)`,
                  filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
                }} />
                <Suspense fallback={
                  <div style={{
                    width: '100%', maxWidth: '520px', aspectRatio: '5/4',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, rgba(255,255,255,0.6), ${card.color.replace('0.9', '0.06')})`,
                    border: '1px solid rgba(15,23,42,0.05)',
                    zIndex: 1,
                  }} />
                }>
                  <div style={{
                    position: 'relative', zIndex: 1,
                    width: '100%',
                    transform: 'scale(0.85)',
                    transformOrigin: 'center center',
                    /* Scale visualment redueix el demo perquè càpiga + deixi
                       espai pels tabs flotants sense que la card els talli. */
                  }}>
                    <card.demoComponent loop />
                  </div>
                </Suspense>
              </>
            ) : card.imageSrc ? (
              <>
                {/* Glow ambient tintat del color de la card — darrere */}
                <div style={{
                  position: 'absolute',
                  left: '8%',
                  right: '4%',
                  bottom: '8%',
                  height: '45%',
                  background: `radial-gradient(ellipse at center, ${card.color.replace('0.9', '0.35')} 0%, transparent 70%)`,
                  filter: 'blur(40px)',
                  zIndex: 0,
                  pointerEvents: 'none',
                }} />

                {/* Mockup wrapper amb perspectiva subtil */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '560px',
                  borderRadius: '14px',
                  background: '#fff',
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-3.5deg) rotateX(1deg)',
                  transformOrigin: 'center center',
                  boxShadow: `
                    0 50px 100px -20px ${card.color.replace('0.9', '0.32')},
                    0 30px 60px -30px rgba(15, 23, 42, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.9) inset,
                    0 1px 2px rgba(15, 23, 42, 0.08)
                  `,
                  overflow: 'hidden',
                  zIndex: 1,
                }}>
                  {/* Browser chrome */}
                  <div style={{
                    background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f6 100%)',
                    borderBottom: '1px solid rgba(15, 23, 42, 0.06)',
                    padding: '9px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    {/* Traffic lights */}
                    <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840', boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)' }} />
                    </div>
                    {/* URL pill */}
                    <div style={{
                      flex: 1,
                      margin: '0 10px',
                      height: 22,
                      borderRadius: 6,
                      background: 'rgba(15, 23, 42, 0.05)',
                      border: '1px solid rgba(15, 23, 42, 0.04)',
                      fontSize: 11,
                      color: 'rgba(15, 23, 42, 0.55)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: '"SF Mono", ui-monospace, Menlo, monospace',
                      letterSpacing: '0.01em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      padding: '0 10px',
                    }}>
                      <span style={{ fontSize: 10, marginRight: 5, opacity: 0.5 }}>🔒</span>
                      {card.mockupUrl}
                    </div>
                  </div>

                  {/* Screenshot — WebP amb PNG fallback */}
                  <picture>
                    <source srcSet={toWebp(card.imageSrc)} type="image/webp" />
                    <img
                      src={card.imageSrc}
                      alt={card.title}
                      loading="lazy"
                      decoding="async"
                      style={{
                        display: 'block',
                        width: '100%',
                        height: 'auto',
                        maxHeight: '420px',
                        objectFit: 'cover',
                        objectPosition: 'top left',
                      }}
                    />
                  </picture>

                  {/* Reflex superior fi */}
                  <div style={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </>
            ) : card.screen ? (
              <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                {card.screen}
              </div>
            ) : (
              <div style={{
                width: '100%', height: '100%', borderRadius: '16px',
                background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${card.color.replace('0.9', '0.05')} 0%, transparent 70%)`,
                border: '1px dashed rgba(0,0,0,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: '#94a3b8', fontWeight: 500,
              }}>
                {t('glass_cards.captura_pendent')}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────────────────── */

export const GlassCards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cards = useMergedCards();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });
  }, []);

  return (
    <div id="funciones" ref={containerRef} style={{ background: '#f8fafc' }}>
      {cards.map((card, index) => (
        <CardItem key={card.id} card={card} index={index} totalCards={cards.length} />
      ))}
    </div>
  );
};

export default GlassCards;
