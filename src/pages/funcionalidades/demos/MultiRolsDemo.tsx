import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, ChevronDown, Sparkles,
  CheckCircle2, Star, Camera, User, Wrench, Calendar as CalIcon,
  TrendingUp,
} from 'lucide-react';
import { usePlaybackFrame, spring } from '@/hooks/usePlaybackFrame';
import { useTranslation } from 'react-i18next';

const colors = {
  bg: '#F9FAFB', card: '#FFFFFF',
  foreground: '#111827', mutedFg: '#6B7280', meta: '#9CA3AF',
  border: '#E5E7EB',
  primary: '#2563EB', primarySoft: '#EFF6FF',
  green: '#16A34A', greenSoft: '#ECFDF5',
  orange: '#F97316', orangeSoft: '#FFF7ED',
  amber: '#F59E0B',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';
const GAP = 3;

/* ══════════════════════════════════════════════════════════════
   PROPIETARI — Calendari + Finances (tab switch intern)
   Timeline:
     0   → calendari tab actiu, grid apareix
    80   → tab commuta a Finances
    88   → hero ingressos
   100   → stats (ocupació / €/nit)
   112   → donut + llegenda
   130   → plataformes
══════════════════════════════════════════════════════════════ */

/* ── Calendar data (reutilitzem del ChannelManagerDemo) ─── */
interface Day { date: number; inMonth: boolean; isToday?: boolean; }
interface Stripe { initials: string; name: string; weekIdx: number; col: number; span: number; platform: 'airbnb'|'booking'|'hostly'; }

const WEEKS: Day[][] = [
  [{date:30,inMonth:false},{date:31,inMonth:false},{date:1,inMonth:true},{date:2,inMonth:true},{date:3,inMonth:true},{date:4,inMonth:true},{date:5,inMonth:true}],
  [{date:6,inMonth:true},{date:7,inMonth:true},{date:8,inMonth:true},{date:9,inMonth:true},{date:10,inMonth:true},{date:11,inMonth:true},{date:12,inMonth:true}],
  [{date:13,inMonth:true},{date:14,inMonth:true},{date:15,inMonth:true},{date:16,inMonth:true},{date:17,inMonth:true},{date:18,inMonth:true},{date:19,inMonth:true}],
  [{date:20,inMonth:true},{date:21,inMonth:true},{date:22,inMonth:true,isToday:true},{date:23,inMonth:true},{date:24,inMonth:true},{date:25,inMonth:true},{date:26,inMonth:true}],
  [{date:27,inMonth:true},{date:28,inMonth:true},{date:29,inMonth:true},{date:30,inMonth:true},{date:1,inMonth:false},{date:2,inMonth:false},{date:3,inMonth:false}],
];
const STRIPES: Stripe[] = [
  { initials:'RC', name:'Rosa Camps',  weekIdx:0, col:2, span:3, platform:'hostly'  },
  { initials:'MP', name:'Marta Pujol', weekIdx:1, col:0, span:3, platform:'airbnb'  },
  { initials:'AG', name:'Anna García', weekIdx:2, col:1, span:3, platform:'booking' },
  { initials:'DT', name:'David Taisne',weekIdx:3, col:2, span:4, platform:'booking' },
];

function stripeTheme(p: Stripe['platform']) {
  if (p==='airbnb')  return { bg:'rgba(255,90,95,0.13)',  avatar:'linear-gradient(135deg,#FF7A75,#FFA97A)', text:'#9B2335', border:'rgba(255,90,95,0.2)'  };
  if (p==='hostly')  return { bg:'rgba(99,102,241,0.11)', avatar:'linear-gradient(135deg,#6366F1,#8B5CF6)', text:'#3730A3', border:'rgba(99,102,241,0.22)' };
  return               { bg:'rgba(0,53,128,0.10)',  avatar:'linear-gradient(135deg,#003580,#2563EB)', text:'#1E3A8A', border:'rgba(0,53,128,0.18)' };
}
const stripeLeft  = (col:number)  => `calc(${col}  * (100% - ${6*GAP}px) / 7 + ${col  * GAP + 3}px)`;
const stripeWidth = (span:number) => `calc(${span} * (100% - ${6*GAP}px) / 7 + ${(span-1)*GAP - 6}px)`;

const PROPIETARI_TAB_SWITCH = 115;

function PropietariView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const calP    = spring(frame - 0,   fps, { damping: 20, stiffness: 160 });
  const tabSwP  = spring(frame - PROPIETARI_TAB_SWITCH, fps, { damping: 18, stiffness: 200 });
  const heroP   = spring(frame - 125, fps, { damping: 18, stiffness: 170 });
  const statsP  = spring(frame - 140, fps, { damping: 20, stiffness: 175 });
  const donutP  = spring(frame - 155, fps, { damping: 18, stiffness: 170 });
  const platP   = spring(frame - 175, fps, { damping: 20, stiffness: 175 });

  const showFinances = frame >= PROPIETARI_TAB_SWITCH + 5;
  const finActiu = tabSwP > 0.5;

  // Donut animat (3 segments)
  const propT     = Math.max(0, Math.min(1, (frame - 158) / 25));
  const gestorT   = Math.max(0, Math.min(1, (frame - 178) / 18));
  const cleaningT = Math.max(0, Math.min(1, (frame - 193) / 14));
  const CELL_H  = 46;

  return (
    <div style={{ background: colors.bg, fontFamily, minHeight: '440px' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px 8px', background: colors.card, borderBottom: `1px solid ${colors.border}`, opacity: calP }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg,#1a3a8f,#2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={11} color="#fff" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: colors.foreground }}>Luminoso Dalí</span>
            <ChevronDown size={12} color={colors.mutedFg} />
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#374151,#111827)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>JM</div>
        </div>

        {/* Tabs interns */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
          {([t('multiRols.tabCalendar'), t('multiRols.tabFinances')] as const).map((label, i) => {
            const isActive = i === 0 ? !finActiu : finActiu;
            return (
              <div key={label} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: isActive ? colors.foreground : 'transparent', color: isActive ? '#fff' : colors.mutedFg, border: isActive ? 'none' : `1px solid ${colors.border}`, transition: 'background 0.25s, color 0.25s' }}>
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CALENDARI ── */}
      {!showFinances && (
        <div style={{ padding: '10px 12px', opacity: calP }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontSize: 10, color: colors.mutedFg }}>Luminoso Apartamento · Dalí <ChevronDown size={10} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronLeft size={13} color={colors.foreground} />
              <span style={{ fontSize: 11, fontWeight: 600, color: colors.foreground, padding: '0 5px' }}>abril 2026</span>
              <ChevronRight size={13} color={colors.foreground} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: `${GAP}px`, marginBottom: `${GAP}px` }}>
            {(t('comu.diesSetmana', { returnObjects: true }) as string[]).map(d => <div key={d} style={{ textAlign: 'center', fontSize: 8, fontWeight: 500, color: colors.meta, padding: '2px 0' }}>{d}</div>)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
            {WEEKS.map((week, wIdx) => {
              const stripesHere = STRIPES.filter(s => s.weekIdx === wIdx);
              const occupied = new Set<number>();
              stripesHere.forEach(s => { for (let c = s.col; c < s.col + s.span; c++) occupied.add(c); });
              return (
                <div key={wIdx} style={{ position: 'relative' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: `${GAP}px` }}>
                    {week.map((day, cIdx) => (
                      <div key={cIdx} style={{ height: CELL_H, borderRadius: 6, background: day.inMonth ? colors.card : '#F4F5F7', border: `1px solid ${day.inMonth ? colors.border : 'transparent'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '5px 2px 4px', overflow: 'hidden' }}>
                        {day.isToday ? (
                          <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#FF7A75,#FFA97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700 }}>{day.date}</div>
                        ) : (
                          <div style={{ fontSize: 9, fontWeight: 600, color: day.inMonth ? colors.foreground : '#D1D5DB' }}>{day.date}</div>
                        )}
                        <div style={{ fontSize: 7, color: occupied.has(cIdx) ? '#D1D5DB' : colors.meta, textDecoration: occupied.has(cIdx) ? 'line-through' : 'none' }}>
                          {day.inMonth ? '170€' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                  {stripesHere.map((s, i) => {
                    const th = stripeTheme(s.platform);
                    return (
                      <div key={i} style={{ position: 'absolute', top: CELL_H/2 - 11, height: 22, left: stripeLeft(s.col), width: stripeWidth(s.span), pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', inset: 0, background: th.bg, border: `1px solid ${th.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', padding: '0 5px', gap: 4, overflow: 'hidden' }}>
                          <div style={{ flexShrink: 0, width: 15, height: 15, borderRadius: '50%', background: th.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 5.5, fontWeight: 700 }}>{s.initials}</div>
                          <div style={{ fontSize: 8, fontWeight: 600, color: th.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FINANCES ── */}
      {showFinances && (
        <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Hero */}
          <div style={{ opacity: heroP, transform: `translateY(${(1-heroP)*8}px) scale(${0.97+heroP*0.03})`, background: colors.primary, borderRadius: 14, padding: '14px 16px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -50, right: -50, width: 130, height: 130, borderRadius: 999, background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.85 }}>{t('multiRols.netIncome')}</div>
            <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1, margin: '4px 0' }}>1.240 €</div>
            <div style={{ fontSize: 9, opacity: 0.75 }}>{t('multiRols.grossAndFees')}</div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 20, padding: '2px 4px', opacity: statsP, transform: `translateY(${(1-statsP)*5}px)` }}>
            {[{ v: '74 %', l: t('multiRols.statOccupancy') },{ v: '173 €', l: t('multiRols.statAvgNight') }].map(({ v, l }) => (
              <div key={l}>
                <div style={{ fontSize: 20, fontWeight: 800, color: colors.foreground, letterSpacing: -0.5 }}>{v}</div>
                <div style={{ fontSize: 10, color: colors.mutedFg }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Donut + llegenda */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: donutP, transform: `translateY(${(1-donutP)*5}px)` }}>
            <MiniDonut propP={propT} gestorP={gestorT} cleaningP={cleaningT} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <LegRow color={colors.primary} label={t('multiRols.ownerShare')}   value="930 €" />
              <LegRow color={colors.amber}   label={t('multiRols.managerShare')} value="236 €" />
              <LegRow color={colors.green}   label={t('multiRols.cleaningCost')} value="−74 €" muted />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: colors.bg, borderRadius: 8, marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.foreground }}>{t('multiRols.managerTotal')}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.amber }}>173 €</span>
              </div>
            </div>
          </div>

          {/* Per plataforma */}
          {platP > 0 && (
            <div style={{ opacity: platP, transform: `translateY(${(1-platP)*4}px)`, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: colors.meta, letterSpacing: 1, padding: '0 2px' }}>{t('multiRols.platformLabel')}</div>
              {[
                { name:'Airbnb', accent:'#FF385C', bg:'rgba(255,56,92,0.06)', res:4, brut:'720 €' },
                { name:'Booking.com', accent:'#2563EB', bg:'rgba(37,99,235,0.06)', res:3, brut:'530 €' },
              ].map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: p.bg }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.accent, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: colors.foreground }}>{p.name}</div>
                    <div style={{ fontSize: 9, color: colors.mutedFg }}>{t('multiRols.platformGross')} {p.brut}</div>
                  </div>
                  <div style={{ fontSize: 10, color: colors.mutedFg }}>{p.res} {t('multiRols.reservations')}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const MiniDonut: React.FC<{ propP: number; gestorP: number; cleaningP: number }> = ({ propP, gestorP, cleaningP }) => {
  const r = 30; const c = 2 * Math.PI * r;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{ flexShrink: 0 }}>
      <circle cx="40" cy="40" r={r} fill="none" stroke="#F3F4F6" strokeWidth="14" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={colors.primary} strokeWidth="14" strokeDasharray={`${c*0.75*propP} ${c}`}    strokeDashoffset={0} transform="rotate(-90 40 40)" />
      <circle cx="40" cy="40" r={r} fill="none" stroke={colors.amber}   strokeWidth="14" strokeDasharray={`${c*0.19*gestorP} ${c}`}   strokeDashoffset={0} transform={`rotate(${-90+360*0.75} 40 40)`} />
      <circle cx="40" cy="40" r={r} fill="none" stroke={colors.green}   strokeWidth="14" strokeDasharray={`${c*0.06*cleaningP} ${c}`} strokeDashoffset={0} transform={`rotate(${-90+360*0.94} 40 40)`} />
    </svg>
  );
};

const LegRow: React.FC<{ color: string; label: string; value: string; muted?: boolean }> = ({ color, label, value, muted }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '3px 2px' }}>
    <div style={{ width: 7, height: 7, borderRadius: 999, background: color, flexShrink: 0 }} />
    <div style={{ flex: 1, fontSize: 10, color: muted ? colors.mutedFg : colors.foreground }}>{label}</div>
    <div style={{ fontSize: 10, fontWeight: 600, color: muted ? colors.mutedFg : colors.foreground }}>{value}</div>
  </div>
);

/* ══════════════════════════════════════════════════════════════
   NETEJADORA
   Timeline:
     2  → header
    14  → tabs (Calendari actiu primer)
    22  → setmana 0
    38  → setmana 1
    54  → setmana 2
    70  → setmana 3
    86  → setmana 4
   104  → detall dia avui
   170  → tab switch a "Avui" (~5.7s al calendari)
   180  → card urgent
   198  → botó
   210  → botó prem
   210  → botó prem (press visual)
   215  → botó mostra "✓ Neteja marcada!" (~1.5s visible)
   255  → COMPLETION
   265  → fotos
   290  → estrelles
   330  → preu + confirmació
══════════════════════════════════════════════════════════════ */
const CAL_TAB_SWITCH  = 170;
const BTN_PRESS_FRAME = 210;
const COMPLETION_FRAME = 255;

function NetejadoraView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const headerP  = spring(frame - 2,  fps, { damping: 20, stiffness: 185 });
  const tabsP    = spring(frame - 14, fps, { damping: 20, stiffness: 185 });

  // Calendari tab items (setmanes escalonades)
  const calItem1P = spring(frame - 22, fps, { damping: 20, stiffness: 175 });
  const calItem2P = spring(frame - 38, fps, { damping: 20, stiffness: 175 });
  const calItem3P = spring(frame - 54, fps, { damping: 20, stiffness: 175 });

  // Tab switch → Avui
  const tabSwP   = spring(frame - CAL_TAB_SWITCH, fps, { damping: 18, stiffness: 200 });
  const showAvui = frame >= CAL_TAB_SWITCH + 5;

  // Avui content
  const cardP   = spring(frame - 180, fps, { damping: 18, stiffness: 175 });
  const btnP    = spring(frame - 198, fps, { damping: 18, stiffness: 180 });

  // Botó press animation — 3 fases:
  // 1) Normal (btnP fins BTN_PRESS_FRAME)
  // 2) Pressed/confirming (BTN_PRESS_FRAME → COMPLETION_FRAME, ~1.5s)
  // 3) Done (COMPLETION_FRAME+)
  const pressing   = frame >= BTN_PRESS_FRAME && frame < COMPLETION_FRAME;
  const pressT     = Math.max(0, Math.min(1, (frame - BTN_PRESS_FRAME) / 6));
  const confirming = frame >= BTN_PRESS_FRAME + 6 && frame < COMPLETION_FRAME;
  const btnScale   = pressT < 1 && pressing ? 1 - pressT * 0.05 : 1;
  // Pols de "confirmant" (ressalta el botó mentre espera)
  const pulseT     = confirming ? 0.92 + 0.08 * Math.sin(((frame - BTN_PRESS_FRAME - 6) / 18) * Math.PI * 2) : 1;
  const btnDone    = frame >= COMPLETION_FRAME;

  // Post-completion
  const photo1P  = spring(frame - 265, fps, { damping: 18, stiffness: 175 });
  const photo2P  = spring(frame - 277, fps, { damping: 18, stiffness: 175 });
  const photo3P  = spring(frame - 289, fps, { damping: 18, stiffness: 175 });
  const star1P   = spring(frame - 301, fps, { damping: 16, stiffness: 210 });
  const star2P   = spring(frame - 309, fps, { damping: 16, stiffness: 210 });
  const star3P   = spring(frame - 317, fps, { damping: 16, stiffness: 210 });
  const star4P   = spring(frame - 325, fps, { damping: 16, stiffness: 210 });
  const star5P   = spring(frame - 333, fps, { damping: 16, stiffness: 210 });
  const preuP    = spring(frame - 347, fps, { damping: 18, stiffness: 185 });
  const doneP    = spring(frame - 359, fps, { damping: 18, stiffness: 185 });

  const avuiActiu = tabSwP > 0.5;
  const stars = [star1P, star2P, star3P, star4P, star5P];

  // ── Calendar data for April 2026 ──
  // State per date (Apr): 'occ'=occupied, 'done'=cleaned✓, 'urgent'=today, 'conf'=confirmed, 'pend'=pending
  type DayState = 'occ'|'done'|'urgent'|'conf'|'pend'|null;
  const APR_STATES: Record<number,DayState> = {
    1:'occ',2:'occ',3:'occ',
    6:'occ',7:'occ',8:'done',
    14:'occ',15:'occ',16:'done',
    22:'urgent', 23:'occ',24:'occ',25:'occ',26:'conf',
    27:'occ',28:'occ',29:'occ',
  };
  const MAY_PEND = new Set([3]); // May 3 pending

  const dayStyle = (state: DayState, inMonth: boolean): React.CSSProperties => {
    if (!inMonth) return { background:'transparent', color:'#D1D5DB' };
    if (state==='urgent') return { background:'#FFF7ED', border:`1.5px solid ${colors.orange}` };
    if (state==='done')   return { background:'#DCFCE7', border:'1px solid #86EFAC' };
    if (state==='conf')   return { background:'#DCFCE7', border:'1px solid #86EFAC' };
    if (state==='pend')   return { background:'#DBEAFE', border:'1px solid #93C5FD' };
    if (state==='occ')    return { background:'#EFF6FF', border:`1px solid ${colors.border}` };
    return { background: colors.card, border:`1px solid ${colors.border}` };
  };
  const dotColor = (state: DayState): string|null => {
    if (state==='urgent') return colors.orange;
    if (state==='done'||state==='conf') return colors.green;
    if (state==='pend') return colors.primary;
    return null;
  };

  // Info per cada dia d'abril (tot dins la cel·la, sense franges superposades)
  interface DayInfo { bg: string; border: string; nameColor: string; name?: string; clean?: 'done'|'today'|'conf'; }
  const APRIL: Record<number, DayInfo> = {
    // Rosa Camps (Hostly, viola)
    1:  { bg:'rgba(99,102,241,0.09)', border:'rgba(99,102,241,0.2)',  nameColor:'#4F46E5', name:'Rosa' },
    2:  { bg:'rgba(99,102,241,0.09)', border:'rgba(99,102,241,0.2)',  nameColor:'#4F46E5' },
    3:  { bg:'#F0FDF4', border:'#86EFAC', nameColor:colors.green, clean:'done' },
    // Marta Pujol (Airbnb, vermell)
    6:  { bg:'rgba(255,90,95,0.09)',  border:'rgba(255,90,95,0.2)',   nameColor:'#9B2335', name:'Marta' },
    7:  { bg:'rgba(255,90,95,0.09)',  border:'rgba(255,90,95,0.2)',   nameColor:'#9B2335' },
    8:  { bg:'#F0FDF4', border:'#86EFAC', nameColor:colors.green, clean:'done' },
    // Anna García (Booking, blau)
    14: { bg:'rgba(0,53,128,0.08)',   border:'rgba(0,53,128,0.2)',    nameColor:'#1E3A8A', name:'Anna' },
    15: { bg:'rgba(0,53,128,0.08)',   border:'rgba(0,53,128,0.2)',    nameColor:'#1E3A8A' },
    16: { bg:'#F0FDF4', border:'#86EFAC', nameColor:colors.green, clean:'done' },
    // Judit Masip (Airbnb)
    20: { bg:'rgba(255,90,95,0.09)',  border:'rgba(255,90,95,0.2)',   nameColor:'#9B2335', name:'Judit' },
    21: { bg:'rgba(255,90,95,0.09)',  border:'rgba(255,90,95,0.2)',   nameColor:'#9B2335' },
    // Avui: neteja urgent
    22: { bg:'#FFF7ED', border:colors.orange, nameColor:colors.orange, clean:'today' },
    // David Taisne (Booking)
    23: { bg:'rgba(0,53,128,0.08)',   border:'rgba(0,53,128,0.2)',    nameColor:'#1E3A8A', name:'David' },
    24: { bg:'rgba(0,53,128,0.08)',   border:'rgba(0,53,128,0.2)',    nameColor:'#1E3A8A' },
    25: { bg:'rgba(0,53,128,0.08)',   border:'rgba(0,53,128,0.2)',    nameColor:'#1E3A8A' },
    // Neteja David
    26: { bg:'#F0FDF4', border:'#86EFAC', nameColor:colors.green, clean:'conf' },
    // Marc Rovira (Airbnb)
    27: { bg:'rgba(255,90,95,0.09)',  border:'rgba(255,90,95,0.2)',   nameColor:'#9B2335', name:'Marc' },
    28: { bg:'rgba(255,90,95,0.09)',  border:'rgba(255,90,95,0.2)',   nameColor:'#9B2335' },
    29: { bg:'#F0FDF4', border:'#86EFAC', nameColor:colors.green, clean:'conf' },
  };

  // Week springs staggered
  const wkProgs = [calItem1P, calItem2P, calItem3P,
    spring(frame - 70,  fps, { damping: 20, stiffness: 175 }),
    spring(frame - 86,  fps, { damping: 20, stiffness: 175 }),
  ];
  const detailP = spring(frame - 104, fps, { damping: 18, stiffness: 175 });

  return (
    <div style={{ background: colors.bg, fontFamily, minHeight: '440px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '12px 14px 8px', background: colors.card, borderBottom: `1px solid ${colors.border}`, opacity: headerP, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.foreground }}>{t('limpiezas.greetingEva')}</div>
          <div style={{ fontSize: 10, color: colors.meta, marginTop: 1 }}>{t('limpiezas.cleanerRole')}</div>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#F97316,#EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>E</div>
      </div>

      {/* Tabs — commuta de Calendari a Avui */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${colors.border}`, background: colors.card, opacity: tabsP }}>
        {[t('limpiezas.tabToday'), t('limpiezas.tabAll'), t('limpiezas.tabCalendar'), 'Perfil'].map((label, i) => {
          const isCalTab  = label === 'Calendario';
          const isAvuiTab = label === 'Hoy';
          const isActive  = avuiActiu ? isAvuiTab : isCalTab;
          return (
            <div key={label} style={{ flex: 1, textAlign: 'center', padding: '9px 0', fontSize: 10, fontWeight: isActive?700:500, color: isActive?colors.primary:colors.meta, borderBottom: isActive?`2px solid ${colors.primary}`:'2px solid transparent', transition: 'color 0.25s, border-color 0.25s' }}>{label}</div>
          );
        })}
      </div>

      {/* ── CALENDARI TAB ── */}
      {!showAvui && (
        <div style={{ background: colors.card, flex: 1 }}>
          {/* Month nav */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 18px 6px', opacity: calItem1P }}>
            <ChevronLeft size={16} color={colors.mutedFg} />
            <span style={{ fontSize:14, fontWeight:700, color:colors.foreground }}>abril 2026</span>
            <ChevronRight size={16} color={colors.mutedFg} />
          </div>
          {/* Weekday labels */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', padding:'0 10px 4px', opacity: calItem1P }}>
            {['DL','DT','DC','DJ','DV','DS','DG'].map(d => (
              <div key={d} style={{ textAlign:'center', fontSize:9, fontWeight:600, color:colors.meta, letterSpacing:'0.04em' }}>{d}</div>
            ))}
          </div>
          {/* Grid */}
          <div style={{ padding:'0 10px 6px', display:'flex', flexDirection:'column', gap:3 }}>
            {WEEKS.map((week, wIdx) => {
              const wp = wkProgs[wIdx] || 0;
              return (
                <div key={wIdx} style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3, opacity:wp, transform:`translateY(${(1-wp)*5}px)` }}>
                  {week.map((day, cIdx) => {
                    const info = day.inMonth ? (day.date <= 30 ? APRIL[day.date] : undefined) : undefined;
                    const isToday = !!day.isToday;
                    const bg     = !day.inMonth ? 'transparent' : (info?.bg     ?? colors.card);
                    const border = !day.inMonth ? 'none'        : (info?.border ? `1.5px solid ${info.border}` : `1px solid ${colors.border}`);
                    const boxShadow = isToday ? `0 0 0 2px rgba(249,115,22,0.25)` : 'none';
                    return (
                      <div key={cIdx} style={{ height:56, borderRadius:9, background:bg, border, boxShadow, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', padding:'6px 0 5px', overflow:'hidden' }}>
                        {/* Data */}
                        {isToday ? (
                          <div style={{ width:22, height:22, borderRadius:'50%', background:colors.orange, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:800 }}>{day.date}</div>
                        ) : (
                          <span style={{ fontSize:10, fontWeight: day.inMonth?600:400, color: !day.inMonth?'#D1D5DB': colors.foreground }}>{day.date}</span>
                        )}
                        {/* Contingut cel·la */}
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                          {info?.name && (
                            <span style={{ fontSize:8, fontWeight:700, color:info.nameColor, lineHeight:1, maxWidth:50, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{info.name}</span>
                          )}
                          {info?.clean && (
                            <span style={{ fontSize:info.clean==='today'?13:11, lineHeight:1 }}>
                              {info.clean==='done' ? <span style={{ color:colors.green, fontWeight:800, fontSize:13 }}>✓</span> : '🧹'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
          {/* Llegenda */}
          <div style={{ display:'flex', gap:14, padding:'0 14px 6px', opacity: wkProgs[4] }}>
            {[
              { icon:'🧹', label: t('limpiezas.legendPending') },
              { icon:'✓',  label: t('limpiezas.legendDone'), color:colors.green },
            ].map(({ icon, label, color }) => (
              <div key={label} style={{ display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ fontSize:11 }}>{icon}</span>
                <span style={{ fontSize:9, color: color || colors.mutedFg }}>{label}</span>
              </div>
            ))}
          </div>
          {/* Detall avui */}
          {detailP > 0 && (
            <div style={{ margin:'2px 12px 10px', background:'#FFF7ED', border:`2px solid ${colors.orange}`, borderRadius:12, padding:'10px 13px', opacity:detailP, transform:`translateY(${(1-detailP)*6}px)` }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:11, fontWeight:700, color:colors.orange }}>{t('limpiezas.cleaningToday')}</span>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:999, background:colors.orangeSoft, color:colors.orange }}>{t('limpiezas.urgentBadge')}</span>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:colors.foreground }}>Luminoso Dalí</div>
              <div style={{ fontSize:10, color:colors.meta, marginTop:2 }}>Judit sale 11:00 · David entra 15:00 · 2 adultos + 1 niño</div>
            </div>
          )}
        </div>
      )}

      {/* ── AVUI TAB ── */}
      {showAvui && (
        <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* ── PRE-COMPLETION: card + botó ── */}
          {!btnDone && cardP > 0 && (
            <div style={{ background: colors.card, borderRadius: 14, border: `2px solid ${colors.orange}`, boxShadow: `0 0 0 4px ${colors.orangeSoft}`, padding: '12px 13px', opacity: cardP, transform: `translateY(${(1-cardP)*6}px)` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 7 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: colors.foreground }}>Luminoso Dalí</div>
                  <div style={{ fontSize: 10, color: colors.meta, marginTop: 1 }}>{t('limpiezas.exitTime')}</div>
                </div>
                <div style={{ padding: '3px 9px', borderRadius: 999, background: colors.orangeSoft, fontSize: 9, fontWeight: 700, color: colors.orange }}>{t('limpiezas.todayBadge')}</div>
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
                {['2 adultos','1 niño','David entra 15:00'].map(t => (
                  <div key={t} style={{ fontSize: 8, fontWeight: 500, padding: '2px 6px', borderRadius: 999, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.mutedFg }}>{t}</div>
                ))}
              </div>
              {btnP > 0 && (
                <button style={{
                  width: '100%', height: 42, borderRadius: 10,
                  background: confirming ? '#15803d' : colors.green,
                  color: '#fff', fontSize: 12, fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                  opacity: btnP,
                  transform: `scale(${btnScale * pulseT})`,
                  transition: 'background 0.2s',
                  boxShadow: confirming
                    ? `0 0 0 3px rgba(21,128,61,0.25), 0 4px 14px rgba(21,128,61,0.4)`
                    : `0 4px 14px rgba(22,163,74,0.35)`,
                }}>
                  <CheckCircle2 size={16} />
                  {confirming ? t('limpiezas.markingDone') : t('limpiezas.markAsDone')}
                </button>
              )}
            </div>
          )}

          {/* ── POST-COMPLETION ── */}
          {btnDone && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Fotos */}
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: colors.mutedFg, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Camera size={12} /> {t('limpiezas.photosAttached')}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                  {[
                    { p: photo1P, grad: 'linear-gradient(135deg,#6366F1,#8B5CF6)' },
                    { p: photo2P, grad: 'linear-gradient(135deg,#0EA5E9,#2563EB)' },
                    { p: photo3P, grad: 'linear-gradient(135deg,#10B981,#16A34A)' },
                  ].map(({ p, grad }, i) => p > 0 && (
                    <div key={i} style={{ height: 64, borderRadius: 10, background: grad, opacity: p, transform: `scale(${0.85+p*0.15})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={18} color="rgba(255,255,255,0.7)" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Valoració */}
              <div style={{ background: colors.card, borderRadius: 12, border: `1px solid ${colors.border}`, padding: '11px 13px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.foreground, marginBottom: 8 }}>{t('limpiezas.guestRating')}</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {stars.map((p, i) => p > 0 && (
                    <div key={i} style={{ opacity: p, transform: `scale(${0.5+p*0.5})` }}>
                      <Star size={22} color="#F59E0B" fill={p > 0.5 ? '#F59E0B' : 'none'} />
                    </div>
                  ))}
                </div>
                {star5P > 0.3 && (
                  <div style={{ fontSize: 10, color: colors.mutedFg, opacity: star5P }}>
                    {t('limpiezas.guestLeftInGoodState')}
                  </div>
                )}
              </div>
              {/* Preu + confirmació */}
              {preuP > 0 && (
                <div style={{ display: 'flex', gap: 8, opacity: preuP, transform: `translateY(${(1-preuP)*5}px)` }}>
                  <div style={{ flex: 1, background: colors.greenSoft, border: '1px solid #BBF7D0', borderRadius: 12, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <TrendingUp size={16} color={colors.green} style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 9, color: colors.green, fontWeight: 700 }}>{t('limpiezas.earnsPerCleaning')}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: colors.green, fontVariantNumeric: 'tabular-nums' }}>25 €</div>
                    </div>
                  </div>
                  {doneP > 0 && (
                    <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '10px 13px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, opacity: doneP }}>
                      <CheckCircle2 size={20} color={colors.green} />
                      <div style={{ fontSize: 9, fontWeight: 700, color: colors.green, textAlign: 'center' }}>{t('limpiezas.registered')}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
type View = 'propietari' | 'netejadora';
const PROPIETARI_FRAMES = 245;
const NETEJADORA_FRAMES = 410;
const VIEW_ORDER: View[] = ['propietari', 'netejadora'];
const FRAMES_BY_VIEW: Record<View, number> = { propietari: PROPIETARI_FRAMES, netejadora: NETEJADORA_FRAMES };
const fadeVariants = { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } };

export default function MultiRolsDemo() {
  const { t } = useTranslation('demos');
  const containerRef = useRef<HTMLDivElement>(null);
  const FPS = 30;
  const [view, setView]     = useState<View>('propietari');
  const [toured, setToured] = useState(false);

  useEffect(() => {
    if (toured) return;
    const ms = FRAMES_BY_VIEW[view] / FPS * 1000 + 400;
    const t = setTimeout(() => {
      const idx = VIEW_ORDER.indexOf(view);
      if (idx < VIEW_ORDER.length - 1) setView(VIEW_ORDER[idx + 1]);
      else setToured(true);
    }, ms);
    return () => clearTimeout(t);
  }, [view, toured]);

  function goTo(next: View) { setView(next); }

  const propietariFrame = usePlaybackFrame(PROPIETARI_FRAMES, FPS, view === 'propietari', containerRef);
  const netejadoraFrame = usePlaybackFrame(NETEJADORA_FRAMES, FPS, view === 'netejadora', containerRef);

  const chromeUrl = view === 'propietari'
    ? 'app.hostlylabs.com · Propietario'
    : 'app.hostlylabs.com · Limpieza';

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ borderRadius: '14px', overflow: 'hidden', background: '#fff', boxShadow: `0 50px 100px -20px rgba(37,99,235,0.28), 0 30px 60px -30px rgba(15,23,42,0.32), 0 0 0 1px rgba(255,255,255,0.9) inset, 0 1px 2px rgba(15,23,42,0.08)`, transform: 'rotateY(-2.5deg) rotateX(0.5deg)', transformStyle: 'preserve-3d', perspective: '1600px' }}>
        {/* chrome */}
        <div style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#eef2f6 100%)', borderBottom: '1px solid rgba(15,23,42,0.06)', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, margin: '0 10px', height: 22, borderRadius: 6, background: 'rgba(15,23,42,0.05)', fontSize: 11, color: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"SF Mono",ui-monospace,Menlo,monospace' }}>
            <span style={{ fontSize: 10, marginRight: 5, opacity: 0.5 }}>🔒</span>{chromeUrl}
          </div>
        </div>

        <div style={{ position: 'relative', minHeight: '440px', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} variants={fadeVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.18, ease: 'easeInOut' }} style={{ width: '100%' }}>
              {view === 'propietari'  && <PropietariView  frame={propietariFrame}  fps={FPS} />}
              {view === 'netejadora' && <NetejadoraView frame={netejadoraFrame} fps={FPS} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ position: 'absolute', bottom: '-14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, padding: 4, background: '#fff', borderRadius: 999, boxShadow: '0 4px 16px rgba(15,23,42,0.12), 0 0 0 1px rgba(15,23,42,0.06) inset', zIndex: 10, whiteSpace: 'nowrap', fontFamily }}>
        <TabBtn active={view==='propietari'}  onClick={() => goTo('propietari')}  icon={<CalIcon size={11} />}  label={t('multiRols.tabOwner')} />
        <TabBtn active={view==='netejadora'} onClick={() => goTo('netejadora')} icon={<Wrench size={11} />} label={t('multiRols.tabCleaning')} />
      </div>


      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

const TabBtn: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 999, fontSize: 10, fontWeight: active?700:500, color: active?'#fff':'#9CA3AF', background: active?'linear-gradient(135deg,#1a3a8f,#2563EB)':'transparent', transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)', cursor: 'pointer', fontFamily }}>
    {icon} {label}
  </div>
);
