import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

/**
 * MiniDemo — mostra una demo animada per cada funcionalitat.
 *
 * 1. Si la funcionalitat té un component React dedicat (recreació dels
 *    components Remotion), l'usa (millor qualitat, escala vectorial).
 * 2. Si té clip de vídeo pre-renderitzat, l'usa com a fallback web.
 * 3. Altrament, mostra un spinner genèric.
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
};

// Slugs que tenen clip de vídeo pre-renderitzat (fallback)
const HAS_CLIP = new Set([
  'conecta-todo',
]);

interface Props {
  slug: string;
  iconName: string;
}

export default function MiniDemo({ slug }: Props) {
  // Prioritat 1: component React nadiu
  const ReactDemo = REACT_DEMOS[slug];
  if (ReactDemo) {
    return (
      <Suspense fallback={<GenericFallback />}>
        <ReactDemo />
      </Suspense>
    );
  }
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Comença reproduir al carregar. IntersectionObserver pausa quan surt de vista.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => void 0);
        else v.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  if (!HAS_CLIP.has(slug)) {
    return <GenericFallback />;
  }

  const base = `/assets/demos/${slug}`;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
      }}
    >
      {/* Browser chrome — reforça "producte real" */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
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
        {/* Chrome (macOS traffic lights + URL) */}
        <div
          style={{
            background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f6 100%)',
            borderBottom: '1px solid rgba(15,23,42,0.06)',
            padding: '9px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', gap: '5px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
          </div>
          <div
            style={{
              flex: 1,
              margin: '0 10px',
              height: 22,
              borderRadius: 6,
              background: 'rgba(15,23,42,0.05)',
              fontSize: 11,
              color: 'rgba(15,23,42,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: '"SF Mono", ui-monospace, Menlo, monospace',
            }}
          >
            <span style={{ fontSize: 10, marginRight: 5, opacity: 0.5 }}>🔒</span>
            app.hostlylabs.com
          </div>
        </div>

        {/* Vídeo */}
        <video
          ref={videoRef}
          poster={`${base}.jpg`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            background: '#f8fafc',
          }}
        >
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`}  type="video/mp4" />
        </video>

        {/* "LIVE DEMO" badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.8 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          style={{
            position: 'absolute',
            top: '52px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 8px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            color: '#16a34a',
            boxShadow: '0 4px 12px rgba(15,23,42,0.1)',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#16a34a',
              boxShadow: '0 0 8px #16a34a',
              animation: 'pulse 1.8s ease-in-out infinite',
            }}
          />
          DEMO EN VIVO
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </div>
  );
}

/* Fallback per funcionalitats sense clip */
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
