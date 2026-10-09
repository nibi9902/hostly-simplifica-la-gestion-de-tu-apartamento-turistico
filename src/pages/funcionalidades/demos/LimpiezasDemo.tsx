import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, MessageCircle, List, User } from 'lucide-react';
import { usePlaybackFrame, spring } from '@/hooks/usePlaybackFrame';
import { useTranslation } from 'react-i18next';
import LimpiezasListView from './LimpiezasListView';
import LimpiezasProfileView from './LimpiezasProfileView';

/* ─── Tokens ─── */
const colors = {
  bg: '#F9FAFB',
  foreground: '#111827',
  meta: '#9CA3AF',
  primary: '#2563EB',
  border: '#E5E7EB',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';

/* ─── Textos: a demos.json (limpiezas.iaAEva, respostaEva, iaConfirma), en l'idioma de la pàgina ─── */

function renderRich(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1
      ? <strong key={i} style={{ fontWeight: 700 }}>{p}</strong>
      : <span key={i}>{p}</span>,
  );
}

/* ─── Message bubble ─── */
interface BubbleProps {
  frame: number; fps: number; enterFrame: number;
  side: 'left' | 'right';
  variant?: 'guest' | 'ai';
  text: string;
  time?: string;
}

const MessageBubble: React.FC<BubbleProps> = ({
  frame, fps, enterFrame, side, variant = 'guest', text, time,
}) => {
  const progress = spring(frame - enterFrame, fps, { damping: 18, stiffness: 180 });
  if (progress <= 0) return null;
  const translateY = (1 - progress) * 10;
  const isRight = side === 'right';
  const isAi = variant === 'ai';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isRight ? 'flex-end' : 'flex-start',
      opacity: progress,
      transform: `translateY(${translateY}px)`,
      fontFamily,
    }}>
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
        backgroundColor: isAi ? '#EFF6FF' : '#FFFFFF',
        color: colors.foreground,
        border: isAi ? 'none' : `1px solid ${colors.border}`,
        fontSize: 11.5,
        lineHeight: 1.5,
        borderBottomRightRadius: isRight ? 3 : 12,
        borderBottomLeftRadius: isRight ? 12 : 3,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {renderRich(text)}
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
      </div>
    </div>
  );
};

/* ─── Typing indicator ─── */
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
          {t('limpiezas.typing')}
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

/* ─── Chat view (Eva) ─── */
function ChatView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  return (
    <div style={{
      background: colors.bg,
      padding: '16px 18px 18px',
      fontFamily,
      minHeight: '440px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: colors.foreground }}>
          Eva · Luminoso Apartamento
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '2px 8px', borderRadius: 999,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(37,99,235,0.12) 100%)',
          color: colors.primary, fontSize: 9, fontWeight: 700, letterSpacing: 0.3,
        }}>
          <Sparkles size={9} color={colors.primary} strokeWidth={2.5} />
          {t('limpiezas.coordinatedByAI')}
        </div>
      </div>
      <div style={{ fontSize: 10, color: colors.meta, marginBottom: 14 }}>
        {t('limpiezas.cleaningTeamShared')}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <MessageBubble
          frame={frame} fps={fps}
          enterFrame={1} side="right" variant="ai"
          text={t('limpiezas.iaAEva')} time="22:29"
        />
        <MessageBubble
          frame={frame} fps={fps}
          enterFrame={8} side="left"
          text={t('limpiezas.respostaEva')} time="23:35"
        />
        <TypingIndicator
          frame={frame} fps={fps}
          enterFrame={28} exitFrame={46}
        />
        <MessageBubble
          frame={frame} fps={fps}
          enterFrame={48} side="right" variant="ai"
          text={t('limpiezas.iaConfirma')} time="23:36"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN — alterna entre CHAT (Eva) i LLISTA
   Cada vista té la seva pròpia playback timeline (reinicia en canviar)
   Transició: crossfade 400ms
─────────────────────────────────────────────────────────────── */

type View = 'chat' | 'list' | 'profile';
const CHAT_FRAMES    = 160;
const LIST_FRAMES    = 130;
const PROFILE_FRAMES = 150;
const VIEW_ORDER: View[] = ['chat', 'list', 'profile'];
const FRAMES_BY_VIEW: Record<View, number> = {
  chat: CHAT_FRAMES, list: LIST_FRAMES, profile: PROFILE_FRAMES,
};

const fadeVariants = {
  enter:  { opacity: 0 },
  center: { opacity: 1 },
  exit:   { opacity: 0 },
};

interface LimpiezasDemoProps {
  /** Loop continu: cicla totes les vistes infinitament. Default: false (tour una vegada). */
  loop?: boolean;
  /** Static mode: salta animacions internes (només transició entre vistes). Default: false. */
  staticMode?: boolean;
}

const LimpiezasDemo: React.FC<LimpiezasDemoProps> = ({ loop = false, staticMode = false }) => {
  const { t } = useTranslation('demos');
  const containerRef = useRef<HTMLDivElement>(null);
  const FPS = 30;
  const [view, setView] = useState<View>('chat');
  const [toured, setToured] = useState(false);

  // Tour: si loop=true, cicla infinit. Si no, recorre les vistes una sola vegada.
  // En staticMode: temps fix de 4s per vista.
  useEffect(() => {
    if (toured && !loop) return;
    const ms = staticMode ? 4000 : (FRAMES_BY_VIEW[view] / FPS * 1000 + 400);
    const timer = setTimeout(() => {
      const idx = VIEW_ORDER.indexOf(view);
      if (idx < VIEW_ORDER.length - 1) {
        setView(VIEW_ORDER[idx + 1]);
      } else if (loop) {
        setView(VIEW_ORDER[0]); // reinicia el cicle
      } else {
        setToured(true);
      }
    }, ms);
    return () => clearTimeout(timer);
  }, [view, toured, loop, staticMode]);

  function goTo(next: View) {
    setView(next);
  }

  // Static mode: salta directament al frame final (springs ja resoltes a 1).
  const chatFramePlayback    = usePlaybackFrame(CHAT_FRAMES,    FPS, view === 'chat'    && !staticMode, containerRef, loop);
  const listFramePlayback    = usePlaybackFrame(LIST_FRAMES,    FPS, view === 'list'    && !staticMode, containerRef, loop);
  const profileFramePlayback = usePlaybackFrame(PROFILE_FRAMES, FPS, view === 'profile' && !staticMode, containerRef, loop);
  const chatFrame    = staticMode ? CHAT_FRAMES    : chatFramePlayback;
  const listFrame    = staticMode ? LIST_FRAMES    : listFramePlayback;
  const profileFrame = staticMode ? PROFILE_FRAMES : profileFramePlayback;

  // URL de la chrome segons vista
  const chromeUrl = view === 'chat'
    ? 'app.hostlylabs.com/limpiezas/equipo'
    : view === 'list'
    ? 'app.hostlylabs.com/limpiezas/lista'
    : 'app.hostlylabs.com/limpiezas/eva';

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
      {/* Window chrome */}
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
            transition: 'all 0.3s ease',
          }}>
            <span style={{ fontSize: 10, marginRight: 5, opacity: 0.5 }}>🔒</span>
            {chromeUrl}
          </div>
        </div>

        {/* Views wrapper amb fade */}
        <div style={{ position: 'relative', minHeight: '440px', overflow: 'hidden' }}>
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
              {view === 'chat'    && <ChatView frame={chatFrame} fps={FPS} />}
              {view === 'list'    && <LimpiezasListView frame={listFrame} fps={FPS} />}
              {view === 'profile' && <LimpiezasProfileView frame={profileFrame} fps={FPS} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs flotants per indicar les 3 vistes */}
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
      }}>
        <TabIndicator active={view === 'chat'}    icon={<MessageCircle size={11} />} label={t('limpiezas.tabChat')}    onClick={() => goTo('chat')} />
        <TabIndicator active={view === 'list'}    icon={<List size={11} />}          label={t('limpiezas.tabList')}    onClick={() => goTo('list')} />
        <TabIndicator active={view === 'profile'} icon={<User size={11} />}          label={t('limpiezas.tabProfile')} onClick={() => goTo('profile')} />
      </div>


      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
    </div>
  );
};

export default LimpiezasDemo;

const TabIndicator: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ active, icon, label, onClick }) => (
  <div onClick={onClick} style={{
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '5px 10px',
    borderRadius: 999,
    fontSize: 10,
    fontWeight: active ? 700 : 500,
    color: active ? '#fff' : colors.meta,
    background: active ? 'linear-gradient(135deg, #1a3a8f 0%, #2563EB 100%)' : 'transparent',
    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    cursor: 'pointer',
    fontFamily,
  }}>
    {icon}
    {label}
  </div>
);
