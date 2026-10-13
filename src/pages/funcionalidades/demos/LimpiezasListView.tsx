import { spring } from '@/hooks/usePlaybackFrame';
import { useTranslation } from 'react-i18next';

/* ─── Tokens ─── */
const colors = {
  bg: '#FFFFFF',
  foreground: '#111827',
  mutedFg: '#6B7280',
  meta: '#9CA3AF',
  primary: '#2563EB',
  border: '#E5E7EB',
  success: '#16A34A',
  successSoft: '#ECFDF5',
} as const;
const fontFamily = 'Inter, -apple-system, sans-serif';

/* ─── Sub-components ─── */
const SubTab: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div style={{
    fontSize: 11, fontWeight: active ? 600 : 500,
    color: active ? colors.foreground : colors.mutedFg,
    paddingBottom: 6,
    borderBottom: active ? `2px solid ${colors.foreground}` : '2px solid transparent',
    marginBottom: -1,
  }}>{label}</div>
);

const LittlePill: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div style={{
    fontSize: 10, fontWeight: 500,
    color: active ? '#FFF' : colors.mutedFg,
    backgroundColor: active ? colors.primary : '#F3F4F6',
    padding: '4px 10px', borderRadius: 999,
  }}>{label}</div>
);

const Chip: React.FC<{ label: string; active?: boolean }> = ({ label, active }) => (
  <div style={{
    fontSize: 10, fontWeight: active ? 600 : 500,
    color: active ? '#FFF' : colors.mutedFg,
    backgroundColor: active ? colors.primary : '#F3F4F6',
    padding: '4px 10px', borderRadius: 999,
    whiteSpace: 'nowrap',
  }}>{label}</div>
);

const ColumnHeader: React.FC<{ colGuest: string; colCleaner: string; colApartment: string; colStatus: string }> = ({ colGuest, colCleaner, colApartment, colStatus }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 2.4fr 0.9fr',
    gap: 10,
    padding: '7px 4px',
    fontSize: 8, fontWeight: 600,
    color: colors.meta, letterSpacing: 1,
    borderBottom: `1px solid ${colors.border}`,
  }}>
    <div>{colGuest}</div>
    <div>{colCleaner}</div>
    <div>{colApartment}</div>
    <div style={{ textAlign: 'right' }}>{colStatus}</div>
  </div>
);

const DayHeader: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ padding: '9px 4px 5px', fontSize: 8, color: colors.meta, letterSpacing: 0.5 }}>
    {label}
  </div>
);

interface RowProps {
  progress: number;
  host: string;
  refCode: string;
  cleaner: string;
  apartment: string;
  statusLabel: string;
  statusColor: string;
  statusT: number;
  isNew?: boolean;
  badgeNew?: string;
}

const Row: React.FC<RowProps> = ({
  progress, host, refCode, cleaner, apartment, statusLabel, statusColor, statusT, isNew, badgeNew,
}) => {
  if (progress <= 0) return null;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1fr 2.4fr 0.9fr',
      gap: 10,
      padding: '11px 8px',
      fontSize: 11,
      color: colors.foreground,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 6}px)`,
      borderBottom: `1px solid ${colors.border}`,
      alignItems: 'center',
      backgroundColor: isNew ? colors.successSoft : 'transparent',
      borderLeft: isNew ? `3px solid ${colors.success}` : '3px solid transparent',
      borderRadius: isNew ? 5 : 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {host}
          </div>
          <div style={{ fontSize: 9, color: colors.meta, marginTop: 1 }}>{refCode}</div>
        </div>
        {isNew && (
          <div style={{
            fontSize: 7, fontWeight: 700, letterSpacing: 0.6,
            color: colors.success, backgroundColor: '#FFF',
            border: `1px solid ${colors.success}`,
            padding: '1px 5px', borderRadius: 999,
            flexShrink: 0,
          }}>{badgeNew}</div>
        )}
      </div>
      <div style={{ color: colors.mutedFg, fontSize: 11 }}>{cleaner}</div>
      <div style={{
        color: colors.foreground, overflow: 'hidden',
        whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 10,
      }}>{apartment}</div>
      <div style={{
        textAlign: 'right', fontSize: 10, fontWeight: 500,
        color: statusColor,
        opacity: 0.6 + 0.4 * statusT,
      }}>{statusLabel}</div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   MAIN — vista llista de neteges
   Frames relatius a l'inici de la vista (no a SCENE_START).
   Timeline:
      5  → header
      15 → tabs
      22 → chips
      35 → row 1 (Clara — "Pendent" canvia a "Confirmada")
      45 → row 2 (Marc)
      55 → row 3 (Elena)
      62 → day2 header (Diumenge 26)
      70 → row 4 (Nora — amb glow verd NOU)
─────────────────────────────────────────────────────────────── */

export default function LimpiezasListView({ frame, fps }: { frame: number; fps: number }) {
  const { t } = useTranslation('demos');
  const headerP = spring(frame - 5, fps, { damping: 20, stiffness: 180 });
  const tabsP = spring(frame - 15, fps, { damping: 20, stiffness: 180 });
  const chipsP = spring(frame - 22, fps, { damping: 20, stiffness: 180 });
  const row1P = spring(frame - 35, fps, { damping: 20, stiffness: 170 });
  const row2P = spring(frame - 45, fps, { damping: 20, stiffness: 170 });
  const row3P = spring(frame - 55, fps, { damping: 20, stiffness: 170 });
  const day2P = spring(frame - 62, fps, { damping: 20, stiffness: 180 });
  const row4P = spring(frame - 70, fps, { damping: 18, stiffness: 170 });
  const statusT = Math.max(0, Math.min(1, (frame - 70) / 18));

  return (
    <div style={{
      background: colors.bg,
      padding: '18px 20px 20px',
      fontFamily,
      minHeight: '440px',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ opacity: headerP, transform: `translateY(${(1 - headerP) * 6}px)` }}>
        <h3 style={{
          fontSize: 20, fontWeight: 700,
          color: colors.foreground, margin: 0, letterSpacing: -0.3,
        }}>{t('limpiezas.listTitle')}</h3>
        <div style={{ fontSize: 11, color: colors.mutedFg, marginTop: 3 }}>
          {t('limpiezas.listSubtitle')}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        marginTop: 14, display: 'flex', gap: 18,
        borderBottom: `1px solid ${colors.border}`,
        opacity: tabsP,
      }}>
        <SubTab label={t('limpiezas.tabGeneral')} />
        <SubTab label={t('limpiezas.tabTeam')} active />
      </div>

      {/* Pills view */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, opacity: tabsP }}>
        <LittlePill label={t('limpiezas.viewCalendar')} />
        <LittlePill label={t('limpiezas.viewList')} active />
      </div>

      {/* Chips filtre */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, opacity: chipsP }}>
        <Chip label={t('limpiezas.filterAll')} active />
        <Chip label="Moderna casa…" />
        <Chip label="Cala Moreta…" />
      </div>

      {/* Llista */}
      <div style={{ marginTop: 16 }}>
        <ColumnHeader
          colGuest={t('limpiezas.colGuest')}
          colCleaner={t('limpiezas.colCleaner')}
          colApartment={t('limpiezas.colApartment')}
          colStatus={t('limpiezas.colStatus')}
        />
        <DayHeader label={t('limpiezas.dayMonday21')} />
        <Row
          progress={row1P}
          host="Olivia Bennett" refCode="HMZ8Q2LK4V" cleaner="Carmen"
          apartment="Casa del Puerto"
          statusLabel={statusT > 0 ? t('limpiezas.statusConfirmed') : t('limpiezas.statusPending')}
          statusColor={statusT > 0.1 ? colors.primary : colors.meta}
          statusT={statusT}
        />
        <Row
          progress={row2P}
          host="Giulia Romano" refCode="HM4TR7XWQ9" cleaner="Pilar"
          apartment="Ático del Mar"
          statusLabel={t('limpiezas.statusConfirmed')}
          statusColor={colors.primary}
          statusT={1}
        />
        <Row
          progress={row3P}
          host="Jonas Keller" refCode="4409158263" cleaner="Carmen"
          apartment="Estudio La Caleta"
          statusLabel={t('limpiezas.statusConfirmed')}
          statusColor={colors.primary}
          statusT={1}
        />
        <div style={{ opacity: day2P, transform: `translateY(${(1 - day2P) * 4}px)` }}>
          <DayHeader label={t('limpiezas.daySunday26')} />
        </div>
        <Row
          progress={row4P}
          host="Nora Vidal" refCode="4419302858" cleaner="Pilar"
          apartment="Apartamento Cala Moreta"
          statusLabel={t('limpiezas.statusConfirmed')}
          statusColor={colors.success}
          statusT={1}
          isNew
          badgeNew={t('limpiezas.badgeNew')}
        />
      </div>
    </div>
  );
}
