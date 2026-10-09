import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ExternalLink } from 'lucide-react';
import { usePlaybackFrame, spring } from '@/hooks/usePlaybackFrame';

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKENS — còpia de VIDEO/src/tokens.ts
───────────────────────────────────────────────────────────── */
const colors = {
  bg: '#F9FAFB',
  foreground: '#111827',
  mutedFg: '#6B7280',
  meta: '#9CA3AF',
  primary: '#2563EB',
  accentSoft: '#EFF6FF',
  border: '#E5E7EB',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';

/* ─────────────────────────────────────────────────────────────
   TEXTS — mateix contingut que SceneChatDavid.tsx de Remotion
───────────────────────────────────────────────────────────── */
const WELCOME_TEXT = `¡Bienvenido a tu alojamiento en Figueres!

Hola David 😊
¡Estamos encantados de recibiros y esperamos que disfrutéis mucho de la estancia!

**Check-in online (obligatorio)**
caserna13.com
(Al completarlo recibiréis los códigos de acceso)

**Horarios**
Check-in: desde 15:00 h
Check-out: antes de 11:00 h

Cualquier duda, estamos disponibles 😊
Biel`;

const IA_DINNER_REPLY = `¡Hola David! 😊

Para cenar esta noche os recomiendo 2 sitios que me encantan:

🍽️ **El Motel** – cocina ampurdanesa, a 8 min en coche. El arroz con gambas es imprescindible.

🥩 **Sidrería Txot's** – carne a la brasa y sidra, a 5 min andando del piso. La chuleta no os la podéis perder.

Si queréis os hago yo la reserva, solo decidme hora 🍷
Biel`;

/* ─────────────────────────────────────────────────────────────
   RENDER RICH — markdown bold inline
───────────────────────────────────────────────────────────── */
function renderRich(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight: 700 }}>{p}</strong>
      : <span key={i}>{p}</span>,
  );
}

/* ─────────────────────────────────────────────────────────────
   MESSAGE BUBBLE — adaptat per web, conserva l'estètica exacta
───────────────────────────────────────────────────────────── */
interface BubbleProps {
  frame: number;
  fps: number;
  enterFrame: number;
  side: 'left' | 'right';
  variant?: 'guest' | 'bot' | 'ai';
  text: string;
  time?: string;
  autoSent?: boolean;
  /** Chars per frame. Si està configurat, el text apareix caràcter a caràcter */
  typingSpeed?: number;
}

const MessageBubble: React.FC<BubbleProps> = ({
  frame, fps, enterFrame, side, variant = 'guest', text, time, autoSent, typingSpeed,
}) => {
  const { t } = useTranslation('demos');
  const progress = spring(frame - enterFrame, fps, { damping: 18, stiffness: 180 });
  if (progress <= 0) return null;

  const translateY = (1 - progress) * 10;
  const isRight = side === 'right';
  const isAi = variant === 'ai';
  const isBot = variant === 'bot' || isAi;

  // Character-by-character reveal
  const charsSinceEnter = Math.max(0, frame - enterFrame);
  const visibleChars = typingSpeed
    ? Math.min(text.length, Math.round(charsSinceEnter * typingSpeed))
    : text.length;
  const displayedText = text.slice(0, visibleChars);
  const isStillTyping = typingSpeed ? visibleChars < text.length : false;
  const caretOn = typingSpeed ? Math.floor(frame / 6) % 2 === 0 : false;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isRight ? 'flex-end' : 'flex-start',
        opacity: progress,
        transform: `translateY(${translateY}px)`,
        fontFamily,
      }}
    >
      {isAi && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          marginBottom: 4,
          marginLeft: isRight ? 0 : 3,
          marginRight: isRight ? 3 : 0,
        }}>
          <div style={{
            width: 15, height: 15, borderRadius: 999,
            background: 'linear-gradient(135deg, #6366F1 0%, #2563EB 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 1px 2px rgba(99,102,241,0.3)',
          }}>
            <Sparkles size={8} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 0.4, color: '#2563EB',
          }}>HOSTLY IA</span>
        </div>
      )}
      <div style={{
        maxWidth: '82%',
        padding: '9px 12px',
        borderRadius: 12,
        backgroundColor: isBot ? '#EFF6FF' : '#FFFFFF',
        color: colors.foreground,
        border: isBot ? 'none' : `1px solid ${colors.border}`,
        fontSize: 11.5,
        lineHeight: 1.5,
        borderBottomRightRadius: isRight ? 3 : 12,
        borderBottomLeftRadius: isRight ? 12 : 3,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {typingSpeed ? displayedText : renderRich(text)}
        {isStillTyping && (
          <span style={{
            display: 'inline-block',
            width: 2, height: '1em', marginLeft: 2,
            verticalAlign: '-0.15em',
            backgroundColor: colors.foreground,
            opacity: caretOn ? 0.55 : 0,
          }} />
        )}
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5,
        marginTop: 3,
        marginLeft: isRight ? 0 : 3,
        marginRight: isRight ? 3 : 0,
      }}>
        {time && <span style={{ fontSize: 9, color: colors.meta }}>{time}</span>}
        {isAi && (
          <>
            <span style={{ fontSize: 9, color: colors.meta }}>·</span>
            <span style={{ fontSize: 9, color: colors.primary, fontWeight: 700, letterSpacing: 0.3 }}>IA</span>
          </>
        )}
        {autoSent && (
          <span style={{
            fontSize: 9, color: colors.primary, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 3,
          }}>
            <Sparkles size={8} color={colors.primary} />
            {t('iaWhatsapp.sentAuto')}
          </span>
        )}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   TYPING INDICATOR
───────────────────────────────────────────────────────────── */
const TypingIndicator: React.FC<{
  frame: number; fps: number; enterFrame: number; exitFrame: number;
}> = ({ frame, fps, enterFrame, exitFrame }) => {
  const { t } = useTranslation('demos');
  const enterP = spring(frame - enterFrame, fps, { damping: 18, stiffness: 200 });
  const exitT = Math.max(0, Math.min(1, (frame - exitFrame) / 6));
  const opacity = enterP * (1 - exitT);
  if (opacity <= 0) return null;

  const localFrame = frame - enterFrame;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      opacity, fontFamily,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4, marginRight: 3,
      }}>
        <div style={{
          width: 15, height: 15, borderRadius: 999,
          background: 'linear-gradient(135deg, #6366F1 0%, #2563EB 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={8} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#2563EB', letterSpacing: 0.4 }}>
          {t('iaWhatsapp.typing')}
        </span>
      </div>
      <div style={{
        padding: '10px 14px',
        borderRadius: 12,
        borderBottomRightRadius: 3,
        backgroundColor: '#EFF6FF',
        display: 'flex', alignItems: 'center', gap: 4,
      }}>
        {[0, 1, 2].map((i) => {
          const phase = (localFrame / 6 - i * 0.35) % 2;
          const dotOpacity = 0.35 + 0.65 * Math.max(0, Math.sin(phase * Math.PI));
          return (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: 999,
              backgroundColor: colors.primary, opacity: dotOpacity,
            }} />
          );
        })}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   DAY SEPARATOR CHIP — "Avui · 19:14"
───────────────────────────────────────────────────────────── */
const DaySeparator: React.FC<{ frame: number; fps: number; enterFrame: number; label: string }> = ({
  frame, fps, enterFrame, label,
}) => {
  const p = spring(frame - enterFrame, fps, { damping: 20, stiffness: 180 });
  if (p <= 0) return null;
  return (
    <div style={{
      alignSelf: 'center',
      fontSize: 9, fontWeight: 600,
      color: colors.meta, letterSpacing: 0.6,
      padding: '3px 10px',
      borderRadius: 999,
      backgroundColor: '#FFFFFF',
      border: `1px solid ${colors.border}`,
      opacity: p,
      transform: `translateY(${(1 - p) * 4}px)`,
      fontFamily,
    }}>
      {label}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   CHECK-IN CARD (sota welcome bubble)
───────────────────────────────────────────────────────────── */
const CheckinCard: React.FC<{ frame: number; fps: number; enterFrame: number }> = ({
  frame, fps, enterFrame,
}) => {
  const p = spring(frame - enterFrame, fps, { damping: 18, stiffness: 170 });
  if (p <= 0) return null;
  return (
    <div style={{
      alignSelf: 'flex-end',
      marginTop: -4,
      padding: '9px 12px',
      backgroundColor: '#FFFFFF',
      border: `1px solid ${colors.border}`,
      borderRadius: 12,
      maxWidth: 260,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 2px 8px rgba(15,23,42,0.05)',
      opacity: p,
      transform: `translateY(${(1 - p) * 8}px)`,
      fontFamily,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        backgroundColor: colors.accentSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <ExternalLink size={13} color={colors.primary} strokeWidth={2.2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.foreground }}>Check-in online</div>
        <div style={{
          fontSize: 10, color: colors.primary, marginTop: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          caserna13.com
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   RECOMMENDATIONS PILL — "RECOMANACIONS TEVES · 12 LLOCS GUARDATS"
───────────────────────────────────────────────────────────── */
const RecommendationsPill: React.FC<{ frame: number; fps: number; enterFrame: number }> = ({
  frame, fps, enterFrame,
}) => {
  const { t } = useTranslation('demos');
  const p = spring(frame - enterFrame, fps, { damping: 20, stiffness: 180 });
  if (p <= 0) return null;
  return (
    <div style={{
      alignSelf: 'flex-end',
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '3px 9px',
      borderRadius: 999,
      background: 'linear-gradient(135deg, rgba(99,102,241,0.14) 0%, rgba(37,99,235,0.14) 100%)',
      color: colors.primary,
      fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
      opacity: p,
      transform: `translateY(${(1 - p) * 4}px)`,
      marginBottom: -4, marginRight: 3,
      fontFamily,
    }}>
      <Sparkles size={9} color={colors.primary} strokeWidth={2.5} />
      {t('iaWhatsapp.recommendations')}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN DEMO — recreació exacta de SceneChatDavid
───────────────────────────────────────────────────────────── */
const TOTAL_FRAMES_IA = 520;

interface IAWhatsAppDemoProps {
  loop?: boolean;
  staticMode?: boolean;
}

const IAWhatsAppDemo: React.FC<IAWhatsAppDemoProps> = ({ loop = false, staticMode = false }) => {
  const { t } = useTranslation('demos');
  const containerRef = useRef<HTMLDivElement>(null);
  const FPS = 30;
  const playbackFrame = usePlaybackFrame(TOTAL_FRAMES_IA, FPS, !staticMode, containerRef, loop, loop ? 0 : 3000);
  const frame = staticMode ? TOTAL_FRAMES_IA : playbackFrame;

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
      {/* Window chrome premium */}
      <div
        style={{
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
        }}
      >
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
            app.hostlylabs.com/mensajes
          </div>
        </div>

        {/* Chat content */}
        <div style={{
          background: colors.bg,
          minHeight: '480px',
          maxHeight: '480px',
          padding: '16px 18px 18px',
          display: 'flex', flexDirection: 'column',
          fontFamily,
          overflow: 'hidden',
        }}>
          {/* Header — David Taisne */}
          <div style={{ fontSize: 13, fontWeight: 600, color: colors.foreground }}>
            David Taisne · Luminoso Apartamento
          </div>
          <div style={{ fontSize: 10, color: colors.meta, marginBottom: 12 }}>
            {t('iaWhatsapp.header')}
          </div>

          {/* Messages — ancorats al fons perquè els nous pushin els vells amunt */}
          <div style={{
            flex: 1,
            display: 'flex', flexDirection: 'column',
            gap: 9,
            justifyContent: 'flex-end',
            minHeight: 0,
            overflow: 'hidden',
          }}>
            <MessageBubble
              frame={frame} fps={FPS}
              enterFrame={2} side="right" variant="bot"
              text={WELCOME_TEXT}
              time="09:12" autoSent
            />
            <CheckinCard frame={frame} fps={FPS} enterFrame={12} />

            <MessageBubble
              frame={frame} fps={FPS}
              enterFrame={65} side="left"
              text="Hola! Hi ha pàrquing a prop per aparcar durant la nostra estada?"
              time="09:41"
              typingSpeed={1.1}
            />

            <TypingIndicator
              frame={frame} fps={FPS}
              enterFrame={128} exitFrame={146}
            />

            <MessageBubble
              frame={frame} fps={FPS}
              enterFrame={148} side="right" variant="ai"
              text="Sí! A 120 m teniu el pàrquing Passeig del Mar (8 €/dia) i un altre privat a 200 m per 15 €/dia. Us envio la ubicació del més proper: maps.app.goo.gl/xk3M9"
              time="09:42"
            />

            <DaySeparator
              frame={frame} fps={FPS}
              enterFrame={255} label={t('iaWhatsapp.today')}
            />

            <MessageBubble
              frame={frame} fps={FPS}
              enterFrame={263} side="left"
              text="¡Hola! ¿Nos podéis recomendar algún sitio para cenar esta noche en Figueres?"
              time="19:14"
              typingSpeed={1.1}
            />

            <TypingIndicator
              frame={frame} fps={FPS}
              enterFrame={332} exitFrame={350}
            />

            <RecommendationsPill
              frame={frame} fps={FPS}
              enterFrame={350}
            />

            <MessageBubble
              frame={frame} fps={FPS}
              enterFrame={352} side="right" variant="ai"
              text={IA_DINNER_REPLY}
              time="19:14"
            />
          </div>
        </div>
      </div>


      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
    </div>
  );
};
export default IAWhatsAppDemo;
