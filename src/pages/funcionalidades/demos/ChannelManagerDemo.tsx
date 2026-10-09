import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Sparkles, Zap } from 'lucide-react';
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
  booking: '#003580',
  airbnb: '#FF5A5F',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';
const GAP = 3; // px gap between cells

/* ─── Calendar data ─────────────────────────────────────────── */
interface Day { date: number; inMonth: boolean; isToday?: boolean; }
interface Stripe { initials: string; name: string; weekIdx: number; col: number; span: number; platform: 'airbnb' | 'booking' | 'hostly'; }

const WEEKS: Day[][] = [
  [{date:30,inMonth:false},{date:31,inMonth:false},{date:1,inMonth:true},{date:2,inMonth:true},{date:3,inMonth:true},{date:4,inMonth:true},{date:5,inMonth:true}],
  [{date:6,inMonth:true},{date:7,inMonth:true},{date:8,inMonth:true},{date:9,inMonth:true},{date:10,inMonth:true},{date:11,inMonth:true},{date:12,inMonth:true}],
  [{date:13,inMonth:true},{date:14,inMonth:true},{date:15,inMonth:true},{date:16,inMonth:true},{date:17,inMonth:true},{date:18,inMonth:true},{date:19,inMonth:true}],
  [{date:20,inMonth:true},{date:21,inMonth:true},{date:22,inMonth:true,isToday:true},{date:23,inMonth:true},{date:24,inMonth:true},{date:25,inMonth:true},{date:26,inMonth:true}],
  [{date:27,inMonth:true},{date:28,inMonth:true},{date:29,inMonth:true},{date:30,inMonth:true},{date:1,inMonth:false},{date:2,inMonth:false},{date:3,inMonth:false}],
];
const DAYS = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'];

const EXISTING: Stripe[] = [
  { initials:'RC', name:'Rosa Camps',  weekIdx:0, col:2, span:3, platform:'hostly'  },
  { initials:'MP', name:'Marta Pujol', weekIdx:1, col:0, span:3, platform:'airbnb'  },
  { initials:'AG', name:'Anna García', weekIdx:2, col:1, span:3, platform:'booking' },
];
const NEW: Stripe = { initials:'DT', name:'David Taisne', weekIdx:3, col:2, span:4, platform:'booking' };

function stripeTheme(p: 'airbnb'|'booking'|'hostly') {
  if (p === 'airbnb')
    return { bg:'rgba(255,90,95,0.13)', avatar:'linear-gradient(135deg,#FF7A75,#FFA97A)', text:'#9B2335', border:'rgba(255,90,95,0.2)' };
  if (p === 'hostly')
    return { bg:'rgba(99,102,241,0.11)', avatar:'linear-gradient(135deg,#6366F1,#8B5CF6)', text:'#3730A3', border:'rgba(99,102,241,0.22)' };
  return   { bg:'rgba(0,53,128,0.10)',   avatar:'linear-gradient(135deg,#003580,#2563EB)', text:'#1E3A8A', border:'rgba(0,53,128,0.18)' };
}

/* ─── Stripe geometry helpers ────────────────────────────────── */
const stripeLeft  = (col:  number) => `calc(${col}  * (100% - ${6*GAP}px) / 7 + ${col  * GAP + 3}px)`;
const stripeWidth = (span: number) => `calc(${span} * (100% - ${6*GAP}px) / 7 + ${(span-1)*GAP - 6}px)`;

/* ─────────────────────────────────────────────────────────────
   MAIN VIEW — Calendari abril 2026
   Timeline:
     0  → calendar fades in (existing stripes already present)
    14  → "Nueva reserva" notification badge slides in
    30  → David Taisne stripe slides in from left
    42  → glow peaks
    80  → glow fades out
─────────────────────────────────────────────────────────────── */
function CalendarView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const calP   = spring(frame - 0,  fps, { damping: 20, stiffness: 160 });
  const badgeP = spring(frame - 14, fps, { damping: 16, stiffness: 210 });
  const newP   = spring(frame - 30, fps, { damping: 17, stiffness: 180 });

  const glowRise = Math.max(0, Math.min(1, (frame - 42) / 16));
  const glowFade = Math.max(0, Math.min(1, (frame - 70) / 30));
  const glow     = glowRise * (1 - glowFade);

  const CELL_H = 56;

  return (
    <div style={{ background: colors.bg, padding: '14px 14px 18px', fontFamily, minHeight: '440px' }}>

      {/* ── Header ── */}
      <div style={{ opacity: calP, transform: `translateY(${(1-calP)*6}px)` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:17, fontWeight:700, color:colors.foreground, letterSpacing:-0.3 }}>{t('channelManager.calendar')}</span>
            <div style={{
              display:'flex', alignItems:'center', gap:4,
              padding:'2px 8px', borderRadius:999,
              background:colors.primarySoft, color:colors.primary,
              fontSize:9, fontWeight:700, letterSpacing:0.3,
            }}>
              <Sparkles size={9} /> {t('channelManager.automaticBadge')}
            </div>
          </div>

          {/* Notification badge */}
          <div style={{
            display:'flex', alignItems:'center', gap:5,
            padding:'5px 10px', borderRadius:999,
            background:'linear-gradient(135deg,#003580,#2563EB)',
            color:'#fff', fontSize:9, fontWeight:700,
            opacity: badgeP,
            transform: `translateY(${(1 - badgeP) * -8}px) scale(${0.8 + badgeP * 0.2})`,
            boxShadow: badgeP > 0 ? '0 4px 14px rgba(0,53,128,0.35)' : 'none',
            whiteSpace:'nowrap',
          }}>
            <Zap size={9} fill="#fff" color="#fff" />
            {t('channelManager.newBooking')}
          </div>
        </div>

        {/* Apartment selector + month nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:10, color:colors.mutedFg }}>
            Luminoso Apartamento · Dalí <ChevronDown size={11} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <ChevronLeft size={14} color={colors.foreground} />
            <span style={{ fontSize:12, fontWeight:600, color:colors.foreground, padding:'0 6px' }}>abril 2026</span>
            <ChevronRight size={14} color={colors.foreground} />
          </div>
        </div>

        {/* Weekday labels */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:`${GAP}px`, marginBottom:`${GAP}px` }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign:'center', fontSize:9, fontWeight:500, color:colors.meta, padding:'3px 0' }}>{d}</div>
          ))}
        </div>
      </div>

      {/* ── Calendar grid ── */}
      <div style={{ opacity: calP, display:'flex', flexDirection:'column', gap:`${GAP}px` }}>
        {WEEKS.map((week, wIdx) => {
          const existingHere = EXISTING.filter(s => s.weekIdx === wIdx);
          const newHere = NEW.weekIdx === wIdx;

          // which cols are occupied (to dim the price)
          const occupiedCols = new Set<number>();
          existingHere.forEach(s => { for(let c = s.col; c < s.col + s.span; c++) occupiedCols.add(c); });
          if (newHere && newP > 0.05) { for(let c = NEW.col; c < NEW.col + NEW.span; c++) occupiedCols.add(c); }

          return (
            <div key={wIdx} style={{ position:'relative' }}>
              {/* Day cells */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:`${GAP}px` }}>
                {week.map((day, cIdx) => (
                  <div key={cIdx} style={{
                    height: CELL_H,
                    borderRadius: 8,
                    background: day.inMonth ? colors.card : '#F4F5F7',
                    border: `1px solid ${day.inMonth ? colors.border : 'transparent'}`,
                    display:'flex', flexDirection:'column',
                    alignItems:'center', justifyContent:'space-between',
                    padding: '7px 2px 6px',
                    overflow:'hidden',
                  }}>
                    {day.isToday ? (
                      <div style={{
                        width:24, height:24, borderRadius:'50%',
                        background:'linear-gradient(135deg,#FF7A75,#FFA97A)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'#fff', fontSize:11, fontWeight:700,
                        boxShadow:'0 2px 8px rgba(255,122,117,0.4)',
                      }}>{day.date}</div>
                    ) : (
                      <div style={{
                        fontSize:11, fontWeight:600,
                        color: day.inMonth ? colors.foreground : '#D1D5DB',
                      }}>{day.date}</div>
                    )}
                    <div style={{
                      fontSize:8, fontWeight:400,
                      color: occupiedCols.has(cIdx) ? '#D1D5DB' : colors.meta,
                      textDecoration: occupiedCols.has(cIdx) ? 'line-through' : 'none',
                    }}>
                      {day.inMonth ? '170€' : ''}
                    </div>
                  </div>
                ))}
              </div>

              {/* Existing stripes (static, already there) */}
              {existingHere.map((s, i) => (
                <StripeEl key={i} stripe={s} progress={1} glow={0} cellH={CELL_H} badgeNew={t('channelManager.badgeNew')} />
              ))}

              {/* New booking stripe */}
              {newHere && newP > 0 && (
                <StripeEl stripe={NEW} progress={newP} glow={glow} cellH={CELL_H} isNew badgeNew={t('channelManager.badgeNew')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Stripe component ───────────────────────────────────────── */
const StripeEl: React.FC<{ stripe: Stripe; progress: number; glow: number; cellH: number; isNew?: boolean; badgeNew: string }> = ({
  stripe, progress, glow, cellH, isNew, badgeNew,
}) => {
  const theme = stripeTheme(stripe.platform);
  const slideX = isNew ? (1 - progress) * -50 : 0;

  return (
    <div style={{
      position:'absolute',
      top: cellH / 2 - 14,
      height: 28,
      left: stripeLeft(stripe.col),
      width: stripeWidth(stripe.span),
      pointerEvents:'none',
    }}>
      {/* Glow ring */}
      {isNew && glow > 0.02 && (
        <div style={{
          position:'absolute', inset:-5, borderRadius:22,
          boxShadow:`0 0 0 2px rgba(37,99,235,${glow*0.5}), 0 0 24px rgba(37,99,235,${glow*0.4})`,
        }} />
      )}

      {/* Stripe body */}
      <div style={{
        position:'absolute', inset:0,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: 18,
        display:'flex', alignItems:'center', padding:'0 7px', gap:6,
        opacity: progress,
        transform: `translateX(${slideX}px)`,
        overflow:'hidden',
      }}>
        <div style={{
          flexShrink:0, width:20, height:20, borderRadius:'50%',
          background: theme.avatar,
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontSize:7, fontWeight:700, letterSpacing:0.2,
        }}>{stripe.initials}</div>

        <div style={{
          fontSize:10, fontWeight:600, color:theme.text,
          whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
          flex:1,
        }}>{stripe.name}</div>

        {isNew && (
          <div style={{
            flexShrink:0,
            fontSize:7, fontWeight:800, color:'#fff', letterSpacing:0.4,
            background: colors.booking,
            padding:'2px 6px', borderRadius:999,
          }}>{badgeNew}</div>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN ──────────────────────────────────────────────────── */
const TOTAL_FRAMES = 160;

interface ChannelManagerDemoProps {
  /** Loop continu: repeteix sense delay. Default: false (replay cada 3s). */
  loop?: boolean;
  /** Static mode: salta animacions internes. Default: false. */
  staticMode?: boolean;
}

const ChannelManagerDemo: React.FC<ChannelManagerDemoProps> = ({ loop = false, staticMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const FPS = 30;
  const playbackFrame = usePlaybackFrame(TOTAL_FRAMES, FPS, !staticMode, containerRef, loop, loop ? 0 : 3000);
  const frame = staticMode ? TOTAL_FRAMES : playbackFrame;

  return (
    <div ref={containerRef} style={{ position:'relative', width:'100%', maxWidth:'520px', margin:'0 auto' }}>
      <div style={{
        borderRadius:'14px', overflow:'hidden', background:'#fff',
        boxShadow:`
          0 50px 100px -20px rgba(37,99,235,0.28),
          0 30px 60px -30px rgba(15,23,42,0.32),
          0 0 0 1px rgba(255,255,255,0.9) inset,
          0 1px 2px rgba(15,23,42,0.08)
        `,
        transform:'rotateY(-2.5deg) rotateX(0.5deg)',
        transformStyle:'preserve-3d', perspective:'1600px',
      }}>
        {/* macOS chrome */}
        <div style={{
          background:'linear-gradient(180deg,#f8fafc 0%,#eef2f6 100%)',
          borderBottom:'1px solid rgba(15,23,42,0.06)',
          padding:'9px 12px', display:'flex', alignItems:'center', gap:6,
        }}>
          <div style={{ display:'flex', gap:5 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#ff5f57' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#febc2e' }} />
            <div style={{ width:10, height:10, borderRadius:'50%', background:'#28c840' }} />
          </div>
          <div style={{
            flex:1, margin:'0 10px', height:22, borderRadius:6,
            background:'rgba(15,23,42,0.05)', fontSize:11, color:'rgba(15,23,42,0.55)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontFamily:'"SF Mono",ui-monospace,Menlo,monospace',
          }}>
            <span style={{ fontSize:10, marginRight:5, opacity:0.5 }}>🔒</span>
            app.hostlylabs.com/calendario
          </div>
        </div>

        <CalendarView frame={frame} fps={FPS} />
      </div>


      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
};

export default ChannelManagerDemo;
