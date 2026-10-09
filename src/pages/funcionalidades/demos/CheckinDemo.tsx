import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Copy, Home, CheckCircle, User, Shield, Loader, FileCheck, Building2 } from 'lucide-react';
import { usePlaybackFrame, spring } from '@/hooks/usePlaybackFrame';
import { useTranslation } from 'react-i18next';

/* ─── Tokens ─── */
const colors = {
  bg: '#FFFFFF',
  bgLight: '#F9FAFB',
  foreground: '#111827',
  mutedFg: '#6B7280',
  meta: '#9CA3AF',
  border: '#E5E7EB',
  red: '#E53E2F',
  redSoft: '#FEF2F2',
  redMid: '#FECACA',
  green: '#16A34A',
  greenSoft: '#ECFDF5',
  primary: '#2563EB',
  primarySoft: '#EFF6FF',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';

/* ─────────────────────────────────────────────────────────────
   VIEW 1 — Huesped: pàgina de codi d'accés
   Timeline:
     3  → checkmark
    12  → títol
    20  → "Check-in completado"
    28  → subtítol
    38  → card apartament
    50  → dates
    64  → box codi accés + botó
    90  → Volver al inicio
─────────────────────────────────────────────────────────────── */
function HuespedView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const iconP     = spring(frame - 3,  fps, { damping: 15, stiffness: 210 });
  const titleP    = spring(frame - 12, fps, { damping: 18, stiffness: 185 });
  const statusP   = spring(frame - 20, fps, { damping: 18, stiffness: 185 });
  const subP      = spring(frame - 28, fps, { damping: 20, stiffness: 180 });
  const aptP      = spring(frame - 38, fps, { damping: 20, stiffness: 175 });
  const datesP    = spring(frame - 50, fps, { damping: 20, stiffness: 175 });
  const codeP     = spring(frame - 64, fps, { damping: 18, stiffness: 175 });
  const backP     = spring(frame - 90, fps, { damping: 20, stiffness: 180 });

  return (
    <div style={{
      background: colors.bg,
      padding: '28px 22px 22px',
      fontFamily,
      minHeight: '480px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Checkmark */}
      <div style={{
        opacity: iconP,
        transform: `scale(${0.4 + iconP * 0.6})`,
        marginBottom: 14,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: `3px solid ${colors.red}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircle size={32} color={colors.red} strokeWidth={1.8} />
        </div>
      </div>

      {/* Títol */}
      <div style={{
        opacity: titleP,
        transform: `translateY(${(1 - titleP) * 6}px)`,
        fontSize: 24, fontWeight: 800,
        color: colors.red, textAlign: 'center',
        marginBottom: 6,
      }}>
        {t('checkin.accessCode')}
      </div>

      {/* Check-in completado */}
      <div style={{
        opacity: statusP,
        transform: `translateY(${(1 - statusP) * 5}px)`,
        fontSize: 14, fontWeight: 600,
        color: colors.green, marginBottom: 6,
      }}>
        {t('checkin.checkinCompleted')}
      </div>

      {/* Subtítol */}
      <div style={{
        opacity: subP,
        fontSize: 11.5, color: colors.mutedFg,
        textAlign: 'center', marginBottom: 18,
        maxWidth: 270,
        lineHeight: 1.5,
      }}>
        {t('checkin.allGuestsCheckedIn')}
      </div>

      {/* Card apartament */}
      <div style={{
        width: '100%',
        opacity: aptP,
        transform: `translateY(${(1 - aptP) * 6}px)`,
        background: colors.bgLight,
        border: `1px solid ${colors.border}`,
        borderRadius: 12, padding: '11px 16px',
        marginBottom: 10,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: colors.mutedFg, marginBottom: 4 }}>{t('checkin.apartment')}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: colors.foreground }}>
          Luminoso Apartamento a 4 min del Museo Dalí
        </div>
      </div>

      {/* Dates */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 8, width: '100%', marginBottom: 14,
        opacity: datesP,
        transform: `translateY(${(1 - datesP) * 6}px)`,
      }}>
        {[
          { label: t('checkin.checkInDate'), date: '07 de abril de 2026' },
          { label: t('checkin.checkOutDate'),  date: '10 de abril de 2026' },
        ].map(({ label, date }) => (
          <div key={label} style={{
            background: colors.bgLight,
            border: `1px solid ${colors.border}`,
            borderRadius: 10, padding: '10px 12px',
            display: 'flex', alignItems: 'flex-start', gap: 7,
          }}>
            <Calendar size={14} color={colors.red} style={{ marginTop: 1, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 9, color: colors.mutedFg }}>{label}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: colors.foreground, marginTop: 2 }}>{date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Codi accés */}
      <div style={{
        width: '100%',
        opacity: codeP,
        transform: `translateY(${(1 - codeP) * 6}px)`,
        background: colors.redSoft,
        border: `1px solid ${colors.redMid}`,
        borderRadius: 14, padding: '16px 18px 12px',
        textAlign: 'center',
        marginBottom: 12,
      }}>
        <div style={{ fontSize: 11, color: colors.red, marginBottom: 4 }}>{t('checkin.accessCodeLabel')}</div>
        <div style={{
          fontSize: 40, fontWeight: 800, color: colors.red,
          fontVariantNumeric: 'tabular-nums', letterSpacing: 4,
          marginBottom: 12,
        }}>
          432126
        </div>
        <button style={{
          width: '100%', height: 38,
          borderRadius: 8,
          background: colors.red,
          color: '#fff',
          fontSize: 13, fontWeight: 700,
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <Copy size={14} /> {t('checkin.copyCode')}
        </button>
      </div>

      {/* Volver */}
      <div style={{
        opacity: backP,
        display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 12, fontWeight: 600, color: colors.foreground,
      }}>
        <Home size={13} /> {t('checkin.backToHome')}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VIEW 2 — Propietari: registre policial automàtic
   Timeline:
     5  → header reserva
    18  → badge "Processant legalment…"
    30  → item 1 Dades validades (loading → done a frame 58)
    45  → item 2 Mossos (loading → done a frame 74)
    60  → item 3 Taxa turística (loading → done a frame 90)
    (Fins a l'octubre del 2026 hi sortien «SES» i «NRUA»: Hostly no fa ni l'un ni l'altre.)
   110  → banner verd "Tot registrat automàticament"
─────────────────────────────────────────────────────────────── */

type IconComponent = React.ComponentType<{ size?: number | string; color?: string }>;

interface LegalItemProps {
  frame: number; fps: number;
  enterFrame: number; doneFrame: number;
  Icon: IconComponent;
  label: string;
  sublabel: string;
}

const LegalItem: React.FC<LegalItemProps> = ({ frame, fps, enterFrame, doneFrame, Icon, label, sublabel }) => {
  const p     = spring(frame - enterFrame, fps, { damping: 20, stiffness: 175 });
  const done  = frame >= doneFrame;
  const doneP = spring(frame - doneFrame, fps, { damping: 16, stiffness: 220 });

  if (p <= 0) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 12px',
      borderRadius: 10,
      background: done ? colors.greenSoft : colors.bgLight,
      border: `1px solid ${done ? '#BBF7D0' : colors.border}`,
      opacity: p,
      transform: `translateY(${(1 - p) * 6}px)`,
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: done ? '#DCFCE7' : '#F3F4F6',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        transition: 'background 0.4s',
      }}>
        <Icon size={16} color={done ? colors.green : colors.mutedFg} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: colors.foreground }}>{label}</div>
        <div style={{ fontSize: 10, color: colors.mutedFg, marginTop: 1 }}>{sublabel}</div>
      </div>
      <div style={{ flexShrink: 0 }}>
        {done ? (
          <div style={{
            opacity: doneP,
            transform: `scale(${0.5 + doneP * 0.5})`,
          }}>
            <CheckCircle size={18} color={colors.green} />
          </div>
        ) : (
          <Loader size={16} color={colors.mutedFg} style={{ animation: 'spin 1s linear infinite' }} />
        )}
      </div>
    </div>
  );
};

function PropietariView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const headerP = spring(frame - 5,   fps, { damping: 18, stiffness: 185 });
  const badgeP  = spring(frame - 18,  fps, { damping: 20, stiffness: 180 });
  const bannerP = spring(frame - 110, fps, { damping: 18, stiffness: 175 });

  return (
    <div style={{
      background: colors.bg,
      padding: '20px 18px 20px',
      fontFamily,
      minHeight: '480px',
    }}>
      {/* Header reserva */}
      <div style={{
        opacity: headerP,
        transform: `translateY(${(1 - headerP) * 6}px)`,
        background: colors.primarySoft,
        border: `1px solid #BFDBFE`,
        borderRadius: 12,
        padding: '12px 14px',
        marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: colors.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <User size={16} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.foreground }}>Judit Masip</div>
            <div style={{ fontSize: 10, color: colors.mutedFg }}>2 {t('checkin.adults')} · 1 {t('checkin.child')} · ref. 5770048427</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { icon: <Calendar size={10} />, text: t('checkin.checkInShort') },
            { icon: <Calendar size={10} />, text: t('checkin.checkOutShort') },
            { icon: <Building2 size={10} />, text: 'Luminoso Dalí' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 4,
              fontSize: 10, color: colors.primary,
              background: '#DBEAFE', borderRadius: 999,
              padding: '3px 8px',
            }}>
              {icon} {text}
            </div>
          ))}
        </div>
      </div>

      {/* Badge processant */}
      <div style={{
        opacity: badgeP,
        transform: `translateY(${(1 - badgeP) * 4}px)`,
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 12,
      }}>
        <Shield size={13} color={colors.primary} />
        <span style={{ fontSize: 11, fontWeight: 700, color: colors.primary }}>
          {t('checkin.legalRegistration')}
        </span>
        <span style={{ fontSize: 10, color: colors.mutedFg }}>{t('checkin.checkinCompletedByGuest')}</span>
      </div>

      {/* Items legals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        <LegalItem
          frame={frame} fps={fps}
          enterFrame={30} doneFrame={58}
          Icon={FileCheck}
          label={t('checkin.validatLabel')}
          sublabel={t('checkin.validatSubtitle')}
        />
        <LegalItem
          frame={frame} fps={fps}
          enterFrame={45} doneFrame={74}
          Icon={Shield}
          label="Mossos d'Esquadra"
          sublabel={t('checkin.mossosSubtitle')}
        />
        <LegalItem
          frame={frame} fps={fps}
          enterFrame={60} doneFrame={90}
          Icon={Building2}
          label={t('checkin.taxLabel')}
          sublabel={t('checkin.taxSubtitle')}
        />
      </div>

      {/* Banner verd final */}
      {bannerP > 0 && (
        <div style={{
          opacity: bannerP,
          transform: `translateY(${(1 - bannerP) * 6}px)`,
          background: colors.greenSoft,
          border: '1px solid #BBF7D0',
          borderRadius: 12,
          padding: '12px 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <CheckCircle size={20} color={colors.green} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.green }}>
              {t('checkin.allRegistered')}
            </div>
            <div style={{ fontSize: 10, color: '#166534', marginTop: 2 }}>
              {t('checkin.nothingToDo')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN
─────────────────────────────────────────────────────────────── */

type View = 'huesped' | 'propietari';
const HUESPED_FRAMES    = 160;
const PROPIETARI_FRAMES = 175;
const VIEW_ORDER: View[] = ['propietari', 'huesped'];
const FRAMES_BY_VIEW: Record<View, number> = {
  huesped: HUESPED_FRAMES, propietari: PROPIETARI_FRAMES,
};

const fadeVariants = {
  enter:  { opacity: 0 },
  center: { opacity: 1 },
  exit:   { opacity: 0 },
};

interface CheckinDemoProps {
  /** Loop continu: cicla totes les vistes infinitament. Default: false (tour una vegada). */
  loop?: boolean;
  /** Static mode: salta animacions internes (només transició entre vistes). Default: false. */
  staticMode?: boolean;
}

const CheckinDemo: React.FC<CheckinDemoProps> = ({ loop = false, staticMode = false }) => {
  const { t } = useTranslation('demos');
  const containerRef = useRef<HTMLDivElement>(null);
  const FPS = 30;
  const [view, setView] = useState<View>('propietari');
  const [toured, setToured] = useState(false);

  // Tour: si loop=true, cicla infinit. Si no, recorre les vistes una sola vegada.
  // En staticMode: temps fix de 4s per vista (sense esperar animacions internes).
  useEffect(() => {
    if (toured && !loop) return;
    const ms = staticMode ? 4000 : (FRAMES_BY_VIEW[view] / FPS * 1000 + 400);
    const t = setTimeout(() => {
      const idx = VIEW_ORDER.indexOf(view);
      if (idx < VIEW_ORDER.length - 1) {
        setView(VIEW_ORDER[idx + 1]);
      } else if (loop) {
        setView(VIEW_ORDER[0]); // reinicia el cicle
      } else {
        setToured(true);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [view, toured, loop, staticMode]);

  function goTo(next: View) {
    setView(next);
  }

  // Static mode: salta directament al frame final (springs ja resoltes a 1).
  // Mode normal: anima amb usePlaybackFrame.
  const huespedFramePlayback    = usePlaybackFrame(HUESPED_FRAMES,    FPS, view === 'huesped'    && !staticMode, containerRef, loop);
  const propietariFramePlayback = usePlaybackFrame(PROPIETARI_FRAMES, FPS, view === 'propietari' && !staticMode, containerRef, loop);
  const huespedFrame    = staticMode ? HUESPED_FRAMES    : huespedFramePlayback;
  const propietariFrame = staticMode ? PROPIETARI_FRAMES : propietariFramePlayback;

  const chromeUrl = view === 'huesped'
    ? 'checkin.hostlylabs.com/acceso/5770048427'
    : 'app.hostlylabs.com/checkins/5770048427';

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      <div style={{
        borderRadius: '14px',
        overflow: 'hidden',
        background: '#fff',
        boxShadow: `
          0 50px 100px -20px rgba(26, 58, 143, 0.28),
          0 30px 60px -30px rgba(15, 23, 42, 0.32),
          0 0 0 1px rgba(255, 255, 255, 0.9) inset,
          0 1px 2px rgba(15, 23, 42, 0.08)
        `,
        transform: 'rotateY(-2.5deg) rotateX(0.5deg)',
        transformStyle: 'preserve-3d',
        perspective: '1600px',
      }}>
        {/* macOS chrome */}
        <div style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f6 100%)',
          borderBottom: '1px solid rgba(15,23,42,0.06)',
          padding: '9px 12px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ display: 'flex', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div style={{
            flex: 1, margin: '0 10px',
            height: 22, borderRadius: 6,
            background: 'rgba(15,23,42,0.05)',
            fontSize: 11, color: 'rgba(15,23,42,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"SF Mono", ui-monospace, Menlo, monospace',
          }}>
            <span style={{ fontSize: 10, marginRight: 5, opacity: 0.5 }}>🔒</span>
            {chromeUrl}
          </div>
        </div>

        {/* Views */}
        <div style={{ position: 'relative', minHeight: '480px', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              style={{ width: '100%' }}
            >
              {view === 'huesped'    && <HuespedView    frame={huespedFrame}    fps={FPS} />}
              {view === 'propietari' && <PropietariView frame={propietariFrame} fps={FPS} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        position: 'absolute',
        bottom: '-14px', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 4,
        padding: 4,
        background: '#fff',
        borderRadius: 999,
        boxShadow: '0 4px 16px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.06) inset',
        zIndex: 10,
        whiteSpace: 'nowrap',
        fontFamily,
      }}>
        <TabIndicator active={view === 'propietari'} icon={<Shield size={11} />} label={t('checkin.tabOwner')} onClick={() => goTo('propietari')} />
        <TabIndicator active={view === 'huesped'}    icon={<User size={11} />}   label={t('checkin.tabGuest')}     onClick={() => goTo('huesped')} />
      </div>


      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
        @keyframes spin   { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
    </div>
  );
};

export default CheckinDemo;

const TabIndicator: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ active, icon, label, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '5px 10px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: active ? 700 : 500,
    color: active ? '#fff' : '#9CA3AF',
    background: active ? 'linear-gradient(135deg, #1a3a8f 0%, #2563EB 100%)' : 'transparent',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    cursor: 'pointer',
    fontFamily,
  }}>
    {icon}
    {label}
  </div>
);
