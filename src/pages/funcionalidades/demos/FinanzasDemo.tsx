import { useRef } from 'react';
import { ChevronDown, TrendingUp } from 'lucide-react';
import { usePlaybackFrame, spring } from '@/hooks/usePlaybackFrame';
import { useTranslation } from 'react-i18next';

const colors = {
  bg: '#F9FAFB', card: '#FFFFFF',
  foreground: '#111827', mutedFg: '#6B7280', meta: '#9CA3AF',
  border: '#E5E7EB',
  primary: '#2563EB', primarySoft: '#EFF6FF',
  green: '#16A34A', greenSoft: '#ECFDF5',
  amber: '#F59E0B', amberSoft: '#FFFBEB',
  red: '#DC2626', redSoft: '#FEF2F2',
  airbnb: '#FF385C', booking: '#003580',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';
const appleEase = (t: number) => 1 - Math.pow(1 - t, 3);

/* ─────────────────────────────────────────────────────────────
   Vista única — informe de finances (Abril 2026)
   Timeline:
     2  → header (filtres mes + aparell)
    14  → hero card "Ingressos nets"
    28  → stats row (reserves / nits / ocupació)
    44  → "Repartiment" label
    50  → donut anima (3 arcs)
    80  → llegenda rows
   110  → seccions "Reserves" + "Per plataforma"
─────────────────────────────────────────────────────────────── */
const TOTAL_FRAMES = 165;

function FinanzasView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const headerP = spring(frame - 2,   fps, { damping: 20, stiffness: 185 });
  const heroP   = spring(frame - 14,  fps, { damping: 18, stiffness: 170 });
  const statsP  = spring(frame - 28,  fps, { damping: 20, stiffness: 175 });
  const reptP   = spring(frame - 44,  fps, { damping: 20, stiffness: 180 });
  const leg1P   = spring(frame - 80,  fps, { damping: 20, stiffness: 175 });
  const leg2P   = spring(frame - 90,  fps, { damping: 20, stiffness: 175 });
  const leg3P   = spring(frame - 100, fps, { damping: 20, stiffness: 175 });
  const platP   = spring(frame - 112, fps, { damping: 20, stiffness: 175 });
  const plat2P  = spring(frame - 122, fps, { damping: 20, stiffness: 175 });

  // Donut anima
  const propT     = appleEase(Math.max(0, Math.min(1, (frame - 52) / 24)));
  const gestorT   = appleEase(Math.max(0, Math.min(1, (frame - 72) / 18)));
  const cleaningT = appleEase(Math.max(0, Math.min(1, (frame - 88) / 14)));

  return (
    <div style={{ background: colors.bg, padding: '14px 14px 18px', fontFamily, minHeight: '440px' }}>

      {/* Header — filtres */}
      <div style={{ opacity: headerP, transform: `translateY(${(1-headerP)*5}px)`, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: colors.foreground, letterSpacing: -0.3 }}>
            {t('finanzas.title')}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {/* Filtre mes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: colors.card, border: `1px solid ${colors.border}`, fontSize: 11, fontWeight: 600, color: colors.foreground }}>
              {t('finanzas.filterMonth')} <ChevronDown size={11} color={colors.mutedFg} />
            </div>
            {/* Filtre apartament */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: colors.card, border: `1px solid ${colors.border}`, fontSize: 11, fontWeight: 600, color: colors.foreground }}>
              {t('finanzas.filterAll')} <ChevronDown size={11} color={colors.mutedFg} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: colors.meta, marginTop: 3 }}>
          {t('finanzas.summaryLine')}
        </div>
      </div>

      {/* Hero card */}
      <div style={{
        opacity: heroP, transform: `translateY(${(1-heroP)*8}px) scale(${0.97+heroP*0.03})`,
        background: colors.foreground, borderRadius: 14, padding: '14px 16px',
        color: '#fff', marginBottom: 10, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ fontSize: 10, fontWeight: 500, opacity: 0.7, marginBottom: 3 }}>{t('finanzas.netIncome')}</div>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, lineHeight: 1.1 }}>1.240 €</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10, opacity: 0.6 }}>
          <span>{t('finanzas.grossAndFees')}</span>
          <span>{t('finanzas.fees')}</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8, marginBottom: 12,
        opacity: statsP, transform: `translateY(${(1-statsP)*5}px)`,
      }}>
        {[
          { v: '8',    l: t('finanzas.statReservations'), color: colors.primary },
          { v: '74%',  l: t('finanzas.statOccupancy'),    color: colors.green   },
          { v: '173€', l: t('finanzas.statAvgNight'),     color: colors.foreground },
        ].map(({ v, l, color }) => (
          <div key={l} style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 10, padding: '9px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
            <div style={{ fontSize: 9, color: colors.meta, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Repartiment */}
      <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 10 }}>
        <div style={{ opacity: reptP, transform: `translateY(${(1-reptP)*4}px)`, marginBottom: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.foreground }}>{t('finanzas.distribution')}</div>
          <div style={{ fontSize: 10, color: colors.meta, marginTop: 1 }}>{t('finanzas.distributionSubtitle')}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Donut */}
          <svg width="76" height="76" viewBox="0 0 76 76" style={{ flexShrink: 0, opacity: reptP }}>
            {(() => {
              const r = 28; const c = 2 * Math.PI * r;
              return (
                <>
                  <circle cx="38" cy="38" r={r} fill="none" stroke="#F3F4F6" strokeWidth="12" />
                  <circle cx="38" cy="38" r={r} fill="none" stroke={colors.primary} strokeWidth="12"
                    strokeDasharray={`${c*0.75*propT} ${c}`} strokeDashoffset={0} transform="rotate(-90 38 38)" />
                  <circle cx="38" cy="38" r={r} fill="none" stroke={colors.amber} strokeWidth="12"
                    strokeDasharray={`${c*0.19*gestorT} ${c}`} strokeDashoffset={0} transform={`rotate(${-90+360*0.75} 38 38)`} />
                  <circle cx="38" cy="38" r={r} fill="none" stroke={colors.green} strokeWidth="12"
                    strokeDasharray={`${c*0.06*cleaningT} ${c}`} strokeDashoffset={0} transform={`rotate(${-90+360*0.94} 38 38)`} />
                </>
              );
            })()}
          </svg>

          {/* Llegenda */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { p: leg1P, color: colors.primary, label: t('finanzas.ownerShare'),   value: '930 €' },
              { p: leg2P, color: colors.amber,   label: t('finanzas.managerShare'), value: '236 €' },
              { p: leg3P, color: colors.green,   label: t('finanzas.cleaningCost'), value: '−74 €', muted: true },
            ].map(({ p, color, label, value, muted }) => p > 0 && (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, opacity: p, transform: `translateX(${(1-p)*6}px)` }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <div style={{ flex: 1, fontSize: 10, color: muted ? colors.mutedFg : colors.foreground }}>{label}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: muted ? colors.mutedFg : colors.foreground }}>{value}</div>
              </div>
            ))}
            {/* Total gestor */}
            {leg3P > 0.5 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 8px', background: colors.amberSoft, borderRadius: 7, marginTop: 2, opacity: leg3P }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: colors.foreground }}>{t('finanzas.managerTotal')}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: colors.amber }}>162 €</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Per plataforma */}
      {platP > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: platP, transform: `translateY(${(1-platP)*5}px)` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: colors.meta, letterSpacing: 1, padding: '0 2px' }}>{t('finanzas.platformLabel')}</div>
          {[
            { p: platP,  name:'Airbnb',      accent: colors.airbnb, bg:'rgba(255,56,92,0.07)', res:5, brut:'820 €', icon:<TrendingUp size={12} color={colors.airbnb} /> },
            { p: plat2P, name:'Booking.com', accent: colors.booking, bg:'rgba(0,53,128,0.07)', res:3, brut:'530 €', icon:<TrendingUp size={12} color={colors.booking} /> },
          ].map(({ p, name, accent, bg, res, brut, icon }) => p > 0 && (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: bg, opacity: p }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.foreground }}>{name}</div>
                <div style={{ fontSize: 9, color: colors.mutedFg, marginTop: 1 }}>{t('finanzas.platformGross')} {brut}</div>
              </div>
              <div style={{ fontSize: 10, color: colors.mutedFg }}>{res} reserves</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── MAIN ── */
interface FinanzasDemoProps {
  loop?: boolean;
  staticMode?: boolean;
}

const FinanzasDemo: React.FC<FinanzasDemoProps> = ({ loop = false, staticMode = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const FPS = 30;
  const playbackFrame = usePlaybackFrame(TOTAL_FRAMES, FPS, !staticMode, containerRef, loop, loop ? 0 : 3000);
  const frame = staticMode ? TOTAL_FRAMES : playbackFrame;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{
        borderRadius: '14px', overflow: 'hidden', background: '#fff',
        boxShadow: `0 50px 100px -20px rgba(37,99,235,0.28), 0 30px 60px -30px rgba(15,23,42,0.32), 0 0 0 1px rgba(255,255,255,0.9) inset, 0 1px 2px rgba(15,23,42,0.08)`,
        transform: 'rotateY(-2.5deg) rotateX(0.5deg)',
        transformStyle: 'preserve-3d', perspective: '1600px',
      }}>
        {/* macOS chrome */}
        <div style={{ background: 'linear-gradient(180deg,#f8fafc 0%,#eef2f6 100%)', borderBottom: '1px solid rgba(15,23,42,0.06)', padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <div style={{ flex: 1, margin: '0 10px', height: 22, borderRadius: 6, background: 'rgba(15,23,42,0.05)', fontSize: 11, color: 'rgba(15,23,42,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"SF Mono",ui-monospace,Menlo,monospace' }}>
            <span style={{ fontSize: 10, marginRight: 5, opacity: 0.5 }}>🔒</span>
            app.hostlylabs.com/finanzas
          </div>
        </div>
        <FinanzasView frame={frame} fps={FPS} />
      </div>
    </div>
  );
};
export default FinanzasDemo;
