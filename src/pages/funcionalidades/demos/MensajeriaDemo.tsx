import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, LayoutList, MessageCircle, Plus } from 'lucide-react';
import { usePlaybackFrame, spring } from '@/hooks/usePlaybackFrame';
import { useTranslation } from 'react-i18next';

const colors = {
  bg: '#F9FAFB',
  card: '#FFFFFF',
  foreground: '#111827',
  mutedFg: '#6B7280',
  meta: '#9CA3AF',
  border: '#E5E7EB',
  primary: '#2563EB',
  primarySoft: '#EFF6FF',
  aiBg: '#EFF6FF',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((p, i) =>
    i % 2 === 1 ? <strong key={i} style={{ fontWeight: 700 }}>{p}</strong> : <span key={i}>{p}</span>
  );
}

/* ─── Channel badges ─────────────────────────────────────────── */
const WaBadge = () => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    padding: '2px 7px', borderRadius: 999,
    background: '#ECFDF5', border: '1px solid #BBF7D0',
    fontSize: 9, fontWeight: 700, color: '#16A34A',
  }}>
    <svg width="9" height="9" viewBox="0 0 24 24" fill="#16A34A">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.526 5.847L0 24l6.303-1.504A11.933 11.933 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.667-.498-5.2-1.369l-.373-.214-3.742.893.937-3.631-.242-.386A9.937 9.937 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
    </svg>
    WhatsApp
  </div>
);

const OtaBadge = ({ name, color, bg, border }: { name: string; color: string; bg: string; border: string }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    padding: '2px 7px', borderRadius: 999,
    background: bg, border: `1px solid ${border}`,
    fontSize: 9, fontWeight: 700, color,
  }}>{name}</div>
);

/* ─── AI Bubble ──────────────────────────────────────────────── */
const AiBubble: React.FC<{
  frame: number; fps: number; enterFrame: number;
  text: string; time: string; channels: React.ReactNode;
}> = ({ frame, fps, enterFrame, text, time, channels }) => {
  const p = spring(frame - enterFrame, fps, { damping: 18, stiffness: 180 });
  if (p <= 0) return null;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', opacity:p, transform:`translateY(${(1-p)*8}px)` }}>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4, marginRight:3 }}>
        <div style={{ width:16, height:16, borderRadius:999, background:'linear-gradient(135deg,#6366F1,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Sparkles size={8} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize:9, fontWeight:700, color:colors.primary, letterSpacing:0.4 }}>HOSTLY IA</span>
      </div>
      <div style={{
        maxWidth:'86%', padding:'9px 12px',
        borderRadius:12, borderBottomRightRadius:3,
        background:colors.aiBg,
        fontSize:11.5, lineHeight:1.5, color:colors.foreground,
        whiteSpace:'pre-wrap', wordBreak:'break-word',
      }}>
        {renderBold(text)}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:4, marginRight:3, flexWrap:'wrap', justifyContent:'flex-end' }}>
        <span style={{ fontSize:9, color:colors.meta }}>{time}</span>
        <span style={{ fontSize:9, color:colors.meta }}>·</span>
        {channels}
      </div>
    </div>
  );
};

/* ─── Typing ─────────────────────────────────────────────────── */
const Typing: React.FC<{ frame: number; fps: number; enterFrame: number; exitFrame: number; label: string }> = ({
  frame, fps, enterFrame, exitFrame, label,
}) => {
  const enterP = spring(frame - enterFrame, fps, { damping: 18, stiffness: 200 });
  const exitT  = Math.max(0, Math.min(1, (frame - exitFrame) / 6));
  const opacity = enterP * (1 - exitT);
  if (opacity <= 0) return null;
  const lf = frame - enterFrame;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', opacity }}>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4, marginRight:3 }}>
        <div style={{ width:16, height:16, borderRadius:999, background:'linear-gradient(135deg,#6366F1,#2563EB)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Sparkles size={8} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontSize:9, fontWeight:700, color:colors.primary, letterSpacing:0.4 }}>{label}</span>
      </div>
      <div style={{ padding:'9px 13px', borderRadius:12, borderBottomRightRadius:3, background:colors.aiBg, display:'flex', gap:4 }}>
        {[0,1,2].map(i => {
          const phase = (lf/6 - i*0.35) % 2;
          const op = 0.35 + 0.65 * Math.max(0, Math.sin(phase * Math.PI));
          return <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:colors.primary, opacity:op }} />;
        })}
      </div>
    </div>
  );
};

/* ─── Day separator ──────────────────────────────────────────── */
const DaySep: React.FC<{ frame: number; fps: number; enterFrame: number; label: string }> = ({
  frame, fps, enterFrame, label,
}) => {
  const p = spring(frame - enterFrame, fps, { damping: 20, stiffness: 180 });
  if (p <= 0) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, opacity:p, margin:'4px 0' }}>
      <div style={{ flex:1, height:1, background:colors.border }} />
      <span style={{ fontSize:9, fontWeight:600, color:colors.meta, whiteSpace:'nowrap' }}>{label}</span>
      <div style={{ flex:1, height:1, background:colors.border }} />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   VIEW 1 — Chat amb missatges automàtics
─────────────────────────────────────────────────────────────── */
function ChatView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const headerP = spring(frame - 2, fps, { damping: 20, stiffness: 185 });
  return (
    <div style={{ background:colors.bg, padding:'16px 16px 20px', fontFamily, minHeight:'440px' }}>
      <div style={{ opacity:headerP, transform:`translateY(${(1-headerP)*5}px)`, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ fontSize:14, fontWeight:700, color:colors.foreground }}>David Taisne</div>
          <div style={{ display:'flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:999, background:colors.primarySoft, color:colors.primary, fontSize:9, fontWeight:700, letterSpacing:0.3 }}>
            <Sparkles size={9} /> {t('mensajeria.automaticBadge')}
          </div>
        </div>
        <div style={{ fontSize:10, color:colors.meta, marginTop:2 }}>Luminoso Apartamento · ref. 5770048427</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

        <DaySep frame={frame} fps={fps} enterFrame={10} label="22 abr. · Al confirmar la reserva" />

        <AiBubble frame={frame} fps={fps} enterFrame={18}
          text={'✨ **¡Bienvenido David!**\n\nQué ilusión tenerte en tu casa para estos días 😊\n\n· Check-in autónomo a las **15:00**\n· Check-out antes de las **11:00**\n· Caja fuerte: **432126**\n\n¡Disfruta mucho! 😊'}
          time="15:31"
          channels={<div style={{ display:'flex', gap:4 }}><WaBadge /><OtaBadge name="Booking.com" color="#003580" bg="#EEF4FF" border="#BFDBFE" /></div>}
        />

        <DaySep frame={frame} fps={fps} enterFrame={68} label="25 abr. · 1 día antes del check-in" />

        <Typing frame={frame} fps={fps} enterFrame={76} exitFrame={92} label={t('mensajeria.typingLabel')} />

        <AiBubble frame={frame} fps={fps} enterFrame={94}
          text={'📋 **Instrucciones de acceso**\n\nPortal del edificio: **#2847**\nPiso 3º izquierda · ascensor disponible\n\nCualquier duda, escríbeme 🙌'}
          time="09:00"
          channels={<div style={{ display:'flex', gap:4 }}><WaBadge /><OtaBadge name="Booking.com" color="#003580" bg="#EEF4FF" border="#BFDBFE" /></div>}
        />

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VIEW 2 — Llista de plantilles
─────────────────────────────────────────────────────────────── */

const TAB_SWITCH_FRAME = 68; // frame en què commuta a Limpieza

function TemplateRow({ t }: { t: { label: string; preview: string; timing: string; timingColor: string; timingBg: string }; progress: number }) {
  return null; // placeholder — replaced below
}

function PlantillasView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const headerP   = spring(frame - 2,  fps, { damping: 20, stiffness: 185 });
  const tabsP     = spring(frame - 12, fps, { damping: 20, stiffness: 185 });
  const hRows     = [20, 30, 40, 50].map(f => spring(frame - f, fps, { damping: 20, stiffness: 175 }));
  const tabSwitchP = spring(frame - TAB_SWITCH_FRAME, fps, { damping: 18, stiffness: 200 });
  const nRows     = [76, 86, 96].map(f => spring(frame - f, fps, { damping: 20, stiffness: 175 }));

  const showNeteja = frame >= TAB_SWITCH_FRAME;
  const limpiezaActive = tabSwitchP > 0.5;

  const HOSTES_TEMPLATES = [
    { label: t('mensajeria.templateWelcome'),       preview:'✨ ¡Bienvenido David! Qué ilusión tenerte…',      timing: t('mensajeria.timingOnConfirm'),    timingColor:colors.primary, timingBg:colors.primarySoft },
    { label: t('mensajeria.templateCheckin'),       preview:'El check-in es autónomo a partir de las 15:00…', timing: t('mensajeria.timing1DayCheckin'),  timingColor:'#7C3AED',      timingBg:'#F5F3FF'           },
    { label: t('mensajeria.templateDataReminder'),  preview:'Hola David! 👋 Necesitamos que nos envíes…',     timing: t('mensajeria.timing3DaysCheckin'), timingColor:'#D97706',      timingBg:'#FFFBEB'           },
    { label: t('mensajeria.templateCheckout'),      preview:'Recuerda que el check-out debe hacerse antes…',  timing: t('mensajeria.timingCheckoutDay'),  timingColor:'#16A34A',      timingBg:'#ECFDF5'           },
  ];
  const NETEJA_TEMPLATES = [
    { label: t('mensajeria.templateNewCleaning'),      preview:'Hola Eva, hay una nueva reserva en Luminoso…',    timing: t('mensajeria.timingOnConfirm'),      timingColor:colors.primary, timingBg:colors.primarySoft },
    { label: t('mensajeria.templateCancelledCleaning'),preview:'Hola Eva, la reserva prevista ha sido cancelada…', timing: t('mensajeria.timingOnCancel'),       timingColor:'#DC2626',      timingBg:'#FEF2F2'           },
    { label: t('mensajeria.templateCleaningReminder'), preview:'Recuerda que mañana hay limpieza a las 11:00…',   timing: t('mensajeria.timing1DayCheckout'),   timingColor:'#D97706',      timingBg:'#FFFBEB'           },
  ];

  return (
    <div style={{ background:colors.card, fontFamily, minHeight:'440px' }}>
      <div style={{ padding:'14px 16px 8px', opacity:headerP, transform:`translateY(${(1-headerP)*5}px)` }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:colors.foreground, letterSpacing:-0.3 }}>{t('mensajeria.automaticMessages')}</div>
            <div style={{ fontSize:11, color:colors.meta, marginTop:2 }}>{t('mensajeria.activeTemplates')}</div>
          </div>
          <button style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:999, background:colors.foreground, color:'#fff', fontSize:11, fontWeight:600, border:'none', cursor:'pointer', flexShrink:0 }}>
            <Plus size={11} /> {t('mensajeria.newButton')}
          </button>
        </div>
      </div>

      {/* Tabs — la pestanya activa commuta animada */}
      <div style={{ padding:'0 16px 8px', display:'flex', gap:8, opacity:tabsP }}>
        {([t('mensajeria.tabGuests'), t('mensajeria.tabCleaning')] as const).map((label, i) => {
          const isActive = i === 0 ? !limpiezaActive : limpiezaActive;
          return (
            <div key={label} style={{
              padding:'5px 12px', borderRadius:999, fontSize:11, fontWeight:600,
              background: isActive ? colors.foreground : 'transparent',
              color: isActive ? '#fff' : colors.mutedFg,
              border: isActive ? 'none' : `1px solid ${colors.border}`,
              transition: 'background 0.25s, color 0.25s',
            }}>{label}</div>
          );
        })}
      </div>

      {/* Contingut de la pestanya activa */}
      <div style={{ borderTop:`1px solid ${colors.border}` }}>
        {!showNeteja
          ? HOSTES_TEMPLATES.map((tmpl, i) => <TemplateRowItem key={i} tmpl={tmpl} progress={hRows[i]} />)
          : NETEJA_TEMPLATES.map((tmpl, i) => <TemplateRowItem key={i} tmpl={tmpl} progress={nRows[i]} />)
        }
      </div>
    </div>
  );
}

function TemplateRowItem({ tmpl, progress }: { tmpl: { label: string; preview: string; timing: string; timingColor: string; timingBg: string }; progress: number }) {
  if (progress <= 0) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderTop:`1px solid ${colors.border}`, opacity:progress, transform:`translateY(${(1-progress)*6}px)` }}>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, fontWeight:600, color:colors.foreground, marginBottom:2 }}>{tmpl.label}</div>
        <div style={{ fontSize:10, color:colors.meta, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'90%', marginBottom:5 }}>{tmpl.preview}</div>
        <span style={{ fontSize:9, fontWeight:600, padding:'2px 8px', borderRadius:999, color:tmpl.timingColor, background:tmpl.timingBg }}>{tmpl.timing}</span>
      </div>
      <div style={{ flexShrink:0, width:36, height:20, borderRadius:999, background:colors.foreground, position:'relative' }}>
        <div style={{ position:'absolute', top:2, right:2, width:16, height:16, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  );
}

// Suppress unused warning
void TemplateRow;

/* ─────────────────────────────────────────────────────────────
   MAIN
─────────────────────────────────────────────────────────────── */
type View = 'chat' | 'plantillas';
const CHAT_FRAMES       = 140;
const PLANTILLAS_FRAMES = 160;
const VIEW_ORDER: View[] = ['plantillas', 'chat'];
const FRAMES_BY_VIEW: Record<View, number> = { chat: CHAT_FRAMES, plantillas: PLANTILLAS_FRAMES };

const fadeVariants = { enter:{ opacity:0 }, center:{ opacity:1 }, exit:{ opacity:0 } };

export default function MensajeriaDemo() {
  const { t } = useTranslation('demos');
  const containerRef = useRef<HTMLDivElement>(null);
  const FPS = 30;
  const [view, setView]     = useState<View>('plantillas');
  const [toured, setToured] = useState(false);

  useEffect(() => {
    if (toured) return;
    const ms = FRAMES_BY_VIEW[view] / FPS * 1000 + 400;
    const timer = setTimeout(() => {
      const idx = VIEW_ORDER.indexOf(view);
      if (idx < VIEW_ORDER.length - 1) setView(VIEW_ORDER[idx + 1]);
      else setToured(true);
    }, ms);
    return () => clearTimeout(timer);
  }, [view, toured]);

  function goTo(next: View) { setView(next); }

  const chatFrame       = usePlaybackFrame(CHAT_FRAMES,       FPS, view === 'chat',       containerRef);
  const plantillasFrame = usePlaybackFrame(PLANTILLAS_FRAMES, FPS, view === 'plantillas', containerRef);

  const chromeUrl = view === 'chat' ? 'app.hostlylabs.com/mensajes/david' : 'app.hostlylabs.com/mensajes';

  return (
    <div ref={containerRef} style={{ position:'relative', width:'100%', maxWidth:'520px', margin:'0 auto' }}>
      <div style={{ borderRadius:'14px', overflow:'hidden', background:'#fff', boxShadow:`0 50px 100px -20px rgba(37,99,235,0.28), 0 30px 60px -30px rgba(15,23,42,0.32), 0 0 0 1px rgba(255,255,255,0.9) inset, 0 1px 2px rgba(15,23,42,0.08)`, transform:'rotateY(-2.5deg) rotateX(0.5deg)', transformStyle:'preserve-3d', perspective:'1600px' }}>
        {/* chrome */}
        <div style={{ background:'linear-gradient(180deg,#f8fafc 0%,#eef2f6 100%)', borderBottom:'1px solid rgba(15,23,42,0.06)', padding:'9px 12px', display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ display:'flex', gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff5f57' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#febc2e' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#28c840' }} />
          </div>
          <div style={{ flex:1, margin:'0 10px', height:22, borderRadius:6, background:'rgba(15,23,42,0.05)', fontSize:11, color:'rgba(15,23,42,0.55)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'"SF Mono",ui-monospace,Menlo,monospace' }}>
            <span style={{ fontSize:10, marginRight:5, opacity:0.5 }}>🔒</span>{chromeUrl}
          </div>
        </div>

        <div style={{ position:'relative', minHeight:'440px', overflow:'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration:0.18, ease:'easeInOut' }} style={{ width:'100%' }}>
              {view === 'chat'       && <ChatView       frame={chatFrame}       fps={FPS} />}
              {view === 'plantillas' && <PlantillasView frame={plantillasFrame} fps={FPS} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ position:'absolute', bottom:'-14px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:4, padding:4, background:'#fff', borderRadius:999, boxShadow:'0 4px 16px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.06) inset', zIndex:10, whiteSpace:'nowrap', fontFamily }}>
        <TabBtn active={view==='chat'}       onClick={() => goTo('chat')}       icon={<MessageCircle size={11}/>} label={t('mensajeria.tabMessages')} />
        <TabBtn active={view==='plantillas'} onClick={() => goTo('plantillas')} icon={<LayoutList size={11}/>}    label={t('mensajeria.tabTemplates')} />
      </div>


      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

const TabBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <div onClick={onClick} style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:999, fontSize:10, fontWeight:active?700:500, color:active?'#fff':'#9CA3AF', background:active?'linear-gradient(135deg,#1a3a8f,#2563EB)':'transparent', transition:'all 0.3s cubic-bezier(0.22,1,0.36,1)', cursor:'pointer', fontFamily }}>
    {icon} {label}
  </div>
);
