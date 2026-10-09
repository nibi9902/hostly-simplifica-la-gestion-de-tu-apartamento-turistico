import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, Globe, Database, FileSpreadsheet, FolderOpen } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   CONÉCTALO TODO — Hostly al mig, i les eines del gestor al voltant.
   Abans la pàgina esperava un vídeo (`/assets/demos/conecta-todo.mp4`) que no existia:
   el marc sortia buit. Són automatitzacions a mida, així que el dibuix diu «el que facis
   servir», no una integració concreta.
───────────────────────────────────────────────────────────── */

const W = 520;
const H = 380;
const CENTRE = { x: W / 2, y: H / 2 };

const NODES = [
  { clau: 'gestoria', Icona: Briefcase, x: 96, y: 92 },
  { clau: 'web', Icona: Globe, x: 424, y: 92 },
  { clau: 'erp', Icona: Database, x: 452, y: 262 },
  { clau: 'excel', Icona: FileSpreadsheet, x: 68, y: 262 },
  { clau: 'drive', Icona: FolderOpen, x: 260, y: 336 },
] as const;

const ConectaTodoDemo: React.FC<{ loop?: boolean; staticMode?: boolean }> = ({ staticMode = false }) => {
  const { t } = useTranslation('demos');
  const reduir = useReducedMotion() || staticMode;

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: `${W}px`, margin: '0 auto' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${W} / ${H}`,
          borderRadius: 18,
          background: 'linear-gradient(160deg, #ffffff 0%, #f1f5ff 100%)',
          border: '1px solid rgba(15,23,42,0.06)',
          boxShadow: '0 40px 80px -24px rgba(37,99,235,0.25), 0 20px 40px -20px rgba(15,23,42,0.18)',
          overflow: 'hidden',
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {NODES.map((n, i) => (
            <g key={n.clau}>
              <line x1={CENTRE.x} y1={CENTRE.y} x2={n.x} y2={n.y} stroke="#c7d6fb" strokeWidth={2} />
              {/* Les dades que van i venen: un traç que corre per la línia */}
              <motion.line
                x1={CENTRE.x}
                y1={CENTRE.y}
                x2={n.x}
                y2={n.y}
                stroke="#2563EB"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeDasharray="10 190"
                initial={{ strokeDashoffset: 0 }}
                animate={reduir ? undefined : { strokeDashoffset: -200 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'linear', delay: i * 0.35 }}
              />
            </g>
          ))}
        </svg>

        {/* Hostly, al mig */}
        <div
          style={{
            position: 'absolute',
            left: `${(CENTRE.x / W) * 100}%`,
            top: `${(CENTRE.y / H) * 100}%`,
            transform: 'translate(-50%, -50%)',
            width: 92,
            height: 92,
            borderRadius: 24,
            background: '#fff',
            boxShadow: '0 16px 36px -10px rgba(37,99,235,0.45), 0 0 0 6px rgba(37,99,235,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img src="/hostly-logo.png" alt="" style={{ width: 120, height: 120, objectFit: 'contain' }} />
        </div>

        {/* Les eines del gestor */}
        {NODES.map(({ clau, Icona, x, y }) => (
          <div
            key={clau}
            style={{
              position: 'absolute',
              left: `${(x / W) * 100}%`,
              top: `${(y / H) * 100}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 12px 8px 8px',
              borderRadius: 999,
              background: '#fff',
              border: '1px solid rgba(15,23,42,0.08)',
              boxShadow: '0 8px 20px -10px rgba(15,23,42,0.25)',
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, -apple-system, sans-serif',
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: '#eff6ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icona size={15} color="#2563EB" strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{t(`conecta.${clau}`)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConectaTodoDemo;
