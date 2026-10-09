import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Sparkles, TrendingUp } from 'lucide-react';
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
  green: '#16A34A',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';
const GAP = 3;
const appleEase = (t: number) => 1 - Math.pow(1 - t, 3);

/* ─── Calendar data ─────────────────────────────────────────── */
interface Day { date: number; inMonth: boolean; isToday?: boolean; isSurge?: boolean; }
interface Stripe { initials: string; name: string; weekIdx: number; col: number; span: number; platform: 'airbnb' | 'booking'; }

const WEEKS: Day[][] = [
  [{date:30,inMonth:false},{date:31,inMonth:false},{date:1,inMonth:true},{date:2,inMonth:true},{date:3,inMonth:true},{date:4,inMonth:true},{date:5,inMonth:true}],
  [{date:6,inMonth:true},{date:7,inMonth:true},{date:8,inMonth:true},{date:9,inMonth:true},{date:10,inMonth:true},{date:11,inMonth:true},{date:12,inMonth:true}],
  [{date:13,inMonth:true},{date:14,inMonth:true},{date:15,inMonth:true},{date:16,inMonth:true},{date:17,inMonth:true},{date:18,inMonth:true},{date:19,inMonth:true}],
  [{date:20,inMonth:true},{date:21,inMonth:true},{date:22,inMonth:true,isToday:true},{date:23,inMonth:true},{date:24,inMonth:true,isSurge:true},{date:25,inMonth:true,isSurge:true},{date:26,inMonth:true,isSurge:true}],
  [{date:27,inMonth:true,isSurge:true},{date:28,inMonth:true,isSurge:true},{date:29,inMonth:true},{date:30,inMonth:true},{date:1,inMonth:false},{date:2,inMonth:false},{date:3,inMonth:false}],
];
const BASE_PRICE = 170;
const SURGE_DELTA = 27; // → 197€ (+16%)

const STRIPES: Stripe[] = [
  { initials:'MP', name:'Marta Pujol', weekIdx:1, col:0, span:3, platform:'airbnb'  },
  { initials:'AG', name:'Anna García', weekIdx:2, col:1, span:3, platform:'booking' },
];

function stripeTheme(p: 'airbnb' | 'booking') {
  return p === 'airbnb'
    ? { bg:'rgba(255,90,95,0.13)', avatar:'linear-gradient(135deg,#FF7A75,#FFA97A)', text:'#9B2335', border:'rgba(255,90,95,0.2)' }
    : { bg:'rgba(0,53,128,0.10)',  avatar:'linear-gradient(135deg,#003580,#2563EB)', text:'#1E3A8A', border:'rgba(0,53,128,0.18)' };
}

const stripeLeft  = (col:  number) => `calc(${col}  * (100% - ${6*GAP}px) / 7 + ${col  * GAP + 3}px)`;
const stripeWidth = (span: number) => `calc(${span} * (100% - ${6*GAP}px) / 7 + ${(span-1)*GAP - 6}px)`;

/* ─────────────────────────────────────────────────────────────
   MAIN VIEW
   Timeline:
     0  → calendar grid fades in (estàtic, preus a 170€)
    10  → notificació llisca des de dalt-dreta
    22  → surge progress comença (preus pugen, cel·les es tenyeixen)
    56  → surge arriba al màxim (197€)
    60+ → tot estàtic
─────────────────────────────────────────────────────────────── */
function PreciosDinamicosView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const calP    = spring(frame - 0,  fps, { damping: 20, stiffness: 160 });
  const notifP  = spring(frame - 10, fps, { damping: 16, stiffness: 180, mass: 0.8 });

  // Surge: comença a frame 22, dura 34 frames
  const surgeRaw = Math.max(0, Math.min(1, (frame - 22) / 34));
  const surgeProgress = appleEase(surgeRaw);
  const newPrice = Math.round(BASE_PRICE + SURGE_DELTA * surgeProgress);

  const CELL_H = 56;

  return (
    <div style={{ background: colors.bg, padding: '14px 14px 18px', fontFamily, minHeight: '440px', position: 'relative' }}>

      {/* ── Header ── */}
      <div style={{ opacity: calP, transform: `translateY(${(1-calP)*6}px)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <span style={{ fontSize:17, fontWeight:700, color:colors.foreground, letterSpacing:-0.3 }}>{t('precios.dynamicPrices')}</span>
          <div style={{
            display:'flex', alignItems:'center', gap:4,
            padding:'2px 8px', borderRadius:999,
            background:colors.primarySoft, color:colors.primary,
            fontSize:9, fontWeight:700, letterSpacing:0.3,
          }}>
            <Sparkles size={9} /> {t('precios.automaticBadge')}
          </div>
        </div>

        {/* Apartment + month nav */}
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
          {(t('comu.diesSetmana', { returnObjects: true }) as string[]).map(d => (
            <div key={d} style={{ textAlign:'center', fontSize:9, fontWeight:500, color:colors.meta, padding:'3px 0' }}>{d}</div>
          ))}
        </div>
      </div>

      {/* ── Calendar grid ── */}
      <div style={{ opacity: calP, display:'flex', flexDirection:'column', gap:`${GAP}px` }}>
        {WEEKS.map((week, wIdx) => {
          const stripesHere = STRIPES.filter(s => s.weekIdx === wIdx);
          const occupiedCols = new Set<number>();
          stripesHere.forEach(s => { for(let c = s.col; c < s.col + s.span; c++) occupiedCols.add(c); });

          return (
            <div key={wIdx} style={{ position:'relative' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:`${GAP}px` }}>
                {week.map((day, cIdx) => {
                  // Per les cel·les de surge, calcula el delay escalonat
                  const surgeIdx = day.isSurge ? (day.date >= 27 ? day.date - 27 + 3 : day.date - 24) : 0;
                  const cellDelay = surgeIdx * 0.12;
                  const cellP = day.isSurge ? Math.max(0, Math.min(1, (surgeProgress - cellDelay) / (1 - cellDelay + 0.01))) : 0;
                  const cellPrice = day.isSurge ? Math.round(BASE_PRICE + SURGE_DELTA * cellP) : BASE_PRICE;
                  const isSurging = day.isSurge && cellP > 0.01;

                  return (
                    <div key={cIdx} style={{
                      height: CELL_H,
                      borderRadius: 8,
                      background: isSurging
                        ? `rgba(37,99,235,${0.04 + 0.06 * cellP})`
                        : day.inMonth ? colors.card : '#F4F5F7',
                      border: `1px solid ${isSurging ? `rgba(37,99,235,${0.2 + 0.15 * cellP})` : day.inMonth ? colors.border : 'transparent'}`,
                      display:'flex', flexDirection:'column',
                      alignItems:'center', justifyContent:'space-between',
                      padding:'7px 2px 6px',
                      overflow:'hidden',
                      transition: 'background 0.15s, border-color 0.15s',
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
                        fontSize:8,
                        fontWeight: isSurging ? 700 : 400,
                        color: occupiedCols.has(cIdx)
                          ? '#D1D5DB'
                          : isSurging ? colors.primary : colors.meta,
                        textDecoration: occupiedCols.has(cIdx) ? 'line-through' : 'none',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        {day.inMonth ? `${cellPrice}€` : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Booking stripes */}
              {stripesHere.map((s, i) => {
                const theme = stripeTheme(s.platform);
                return (
                  <div key={i} style={{
                    position:'absolute',
                    top: CELL_H / 2 - 14, height: 28,
                    left: stripeLeft(s.col), width: stripeWidth(s.span),
                    pointerEvents:'none',
                  }}>
                    <div style={{
                      position:'absolute', inset:0,
                      background: theme.bg, border: `1px solid ${theme.border}`,
                      borderRadius: 18,
                      display:'flex', alignItems:'center', padding:'0 7px', gap:6,
                      overflow:'hidden',
                    }}>
                      <div style={{
                        flexShrink:0, width:20, height:20, borderRadius:'50%',
                        background: theme.avatar,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        color:'#fff', fontSize:7, fontWeight:700,
                      }}>{s.initials}</div>
                      <div style={{
                        fontSize:10, fontWeight:600, color:theme.text,
                        whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      }}>{s.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* ── Notification card (overlay dalt-dreta) ── */}
      {notifP > 0.02 && (
        <div style={{
          position:'absolute',
          top: 56, right: 14,
          width: 196,
          background: colors.card,
          borderRadius: 14,
          border: `1px solid ${colors.border}`,
          boxShadow: '0 12px 32px rgba(15,23,42,0.13), 0 2px 6px rgba(15,23,42,0.05)',
          padding: '12px 14px',
          fontFamily,
          opacity: notifP,
          transform: `translateY(${(1-notifP)*-14}px) scale(${0.92 + notifP*0.08})`,
          transformOrigin: 'top right',
          zIndex: 10,
        }}>
          {/* Brand strip */}
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
            <div style={{
              width:22, height:22, borderRadius:6,
              background:'linear-gradient(135deg,#2563EB,#3B82F6)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Sparkles size={11} color="#fff" strokeWidth={2.4} />
            </div>
            <div style={{ fontSize:9, fontWeight:700, color:colors.mutedFg, letterSpacing:0.8 }}>
              PRICELABS
            </div>
            <div style={{ marginLeft:'auto', fontSize:9, color:colors.meta }}>{t('precios.notifNow')}</div>
          </div>

          {/* Title */}
          <div style={{ fontSize:13, fontWeight:700, color:colors.foreground, lineHeight:1.3, marginBottom:4 }}>
            {t('precios.easterDetected')}
          </div>
          <div style={{ fontSize:10, color:colors.mutedFg, lineHeight:1.5, marginBottom:10 }}>
            {t('precios.pricesAdjusted')}
          </div>

          {/* Delta strip */}
          <div style={{
            background:'#F8FAFC', borderRadius:10, padding:'9px 10px',
            display:'flex', alignItems:'center', gap:8,
          }}>
            <TrendingUp size={14} color={colors.primary} strokeWidth={2.2} style={{ flexShrink:0 }} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9, color:colors.mutedFg, marginBottom:3 }}>{t('precios.surgeRange')}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                <span style={{ fontSize:11, color:colors.meta, textDecoration:'line-through' }}>170€</span>
                <span style={{ fontSize:15, fontWeight:800, color:colors.foreground, fontVariantNumeric:'tabular-nums' }}>
                  {newPrice}€
                </span>
                <span style={{ fontSize:10, fontWeight:700, color:colors.primary }}>+16%</span>
              </div>
            </div>
          </div>

          {/* Sync status */}
          <div style={{
            marginTop:8, fontSize:9, color:colors.meta,
            display:'flex', alignItems:'center', gap:5,
          }}>
            <div style={{
              width:5, height:5, borderRadius:'50%',
              background:colors.green,
              boxShadow:`0 0 5px ${colors.green}`,
              animation:'pulse 1.8s ease-in-out infinite',
            }} />
            {t('precios.syncedWith')}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

/* ─── MAIN ──────────────────────────────────────────────────── */
const TOTAL_FRAMES = 150;

interface PreciosDinamicosDemoProps {
  loop?: boolean;
  staticMode?: boolean;
}

const PreciosDinamicosDemo: React.FC<PreciosDinamicosDemoProps> = ({ loop = false, staticMode = false }) => {
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
            app.hostlylabs.com/precios
          </div>
        </div>

        <PreciosDinamicosView frame={frame} fps={FPS} />
      </div>

    </div>
  );
};
export default PreciosDinamicosDemo;
