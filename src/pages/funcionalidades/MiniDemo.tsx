import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * MiniDemo — mostra una demo animada per cada funcionalitat.
 *
 * Si la funcionalitat té un component React dedicat (recreació dels components
 * Remotion), l'usa; si no, mostra un indicador genèric.
 */

// Components React nadius (migracions de les escenes Remotion)
const REACT_DEMOS: Record<string, React.LazyExoticComponent<React.FC>> = {
  'ia-whatsapp': lazy(() => import('./demos/IAWhatsAppDemo')),
  'gestion-de-limpiezas': lazy(() => import('./demos/LimpiezasDemo')),
  'check-in-online': lazy(() => import('./demos/CheckinDemo')),
  'channel-manager': lazy(() => import('./demos/ChannelManagerDemo')),
  'precios-dinamicos':   lazy(() => import('./demos/PreciosDinamicosDemo')),
  'mensajeria-programada': lazy(() => import('./demos/MensajeriaDemo')),
  'multi-rol': lazy(() => import('./demos/MultiRolsDemo')),
  'finanzas':  lazy(() => import('./demos/FinanzasDemo')),
  'conecta-todo': lazy(() => import('./demos/ConectaTodoDemo')),
};

interface Props {
  slug: string;
  iconName: string;
}

/* Sense cap hook abans del retorn: la mateixa instància passa d'una funcionalitat a una altra, i
 * abans, d'una amb demo a una sense («burocracia»), React petava («Rendered more hooks…») i la
 * pàgina quedava en blanc. La branca de vídeo (cap funcionalitat en tenia) s'ha tret. */
export default function MiniDemo({ slug }: Props) {
  const ReactDemo = REACT_DEMOS[slug];
  if (!ReactDemo) return <GenericFallback />;
  return (
    <Suspense fallback={<GenericFallback />}>
      <ReactDemo />
    </Suspense>
  );
}

/* Per a les funcionalitats sense demo */
const GenericFallback: React.FC = () => {
  const { t } = useTranslation('demos');
  return (
  <div
    style={{
      width: '100%',
      maxWidth: '520px',
      aspectRatio: '16/10',
      margin: '0 auto',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #F7F8FA, #EEF2F6)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      boxShadow: '0 30px 60px -20px rgba(15, 23, 42, 0.2)',
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      style={{
        width: 70,
        height: 70,
        borderRadius: '50%',
        border: '2px solid transparent',
        borderTopColor: 'hsl(var(--primary))',
        borderRightColor: 'hsl(var(--primary))',
      }}
    />
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#0B0F1A' }}>{t('comu.sistemaTreballant')}</div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 3 }}>{t('comu.tuJaNo')}</div>
    </div>
  </div>
  );
};
