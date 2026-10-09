import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Briefcase, Globe, Database, FileSpreadsheet, FolderOpen } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   CONÉCTALO TODO — Hostly al mig, i les eines del gestor al voltant.
   Abans la pàgina esperava un vídeo (`/assets/demos/conecta-todo.mp4`) que no existia:
   el marc sortia buit. Són automatitzacions a mida, així que el dibuix diu «el que facis
   servir», no una integració concreta.
───────────────────────────────────────────────────────────── */

type Node = { clau: string; Icona: typeof Briefcase; x: number; y: number };
type Disposicio = { w: number; h: number; cy: number; nodes: Node[]; lletra: number };

// Ordinador: les eines en rodona al voltant de Hostly
const AMPLA: Disposicio = {
  w: 520, h: 380, cy: 190, lletra: 12,
  nodes: [
    { clau: 'gestoria', Icona: Briefcase, x: 104, y: 92 },
    { clau: 'web', Icona: Globe, x: 416, y: 92 },
    { clau: 'erp', Icona: Database, x: 440, y: 262 },
    { clau: 'excel', Icona: FileSpreadsheet, x: 86, y: 262 },
    { clau: 'drive', Icona: FolderOpen, x: 260, y: 336 },
  ],
};
// Mòbil: dues columnes, a dalt i a baix (la rodona no hi cabia i les píndoles es tallaven)
const ESTRETA: Disposicio = {
  w: 320, h: 420, cy: 188, lletra: 11,
  nodes: [
    { clau: 'gestoria', Icona: Briefcase, x: 84, y: 52 },
    { clau: 'web', Icona: Globe, x: 236, y: 52 },
    { clau: 'excel', Icona: FileSpreadsheet, x: 84, y: 322 },
    { clau: 'erp', Icona: Database, x: 236, y: 322 },
    { clau: 'drive', Icona: FolderOpen, x: 160, y: 384 },
  ],
};

const Diagrama: React.FC<{ d: Disposicio; reduir: boolean }> = ({ d, reduir }) => {
  const { t } = useTranslation('demos');
  const centre = { x: d.w / 2, y: d.cy };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${d.w} / ${d.h}`,
        borderRadius: 18,
        background: 'linear-gradient(160deg, #ffffff 0%, #f1f5ff 100%)',
        border: '1px solid rgba(15,23,42,0.06)',
        boxShadow: '0 40px 80px -24px rgba(37,99,235,0.25), 0 20px 40px -20px rgba(15,23,42,0.18)',
        overflow: 'hidden',
      }}
    >
      <svg viewBox={`0 0 ${d.w} ${d.h}`} width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        {d.nodes.map((n, i) => (
          <g key={n.clau}>
            <line x1={centre.x} y1={centre.y} x2={n.x} y2={n.y} stroke="#c7d6fb" strokeWidth={2} />
            {/* Les dades que van i venen: un traç que corre per la línia */}
            <motion.line
              x1={centre.x}
              y1={centre.y}
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
          left: `${(centre.x / d.w) * 100}%`,
          top: `${(centre.y / d.h) * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: 88,
          height: 88,
          borderRadius: 24,
          background: '#fff',
          boxShadow: '0 16px 36px -10px rgba(37,99,235,0.45), 0 0 0 6px rgba(37,99,235,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src="/hostly-logo.png" alt="" style={{ width: 116, height: 116, objectFit: 'contain' }} />
      </div>

      {/* Les eines del gestor */}
      {d.nodes.map(({ clau, Icona, x, y }) => (
        <div
          key={clau}
          style={{
            position: 'absolute',
            left: `${(x / d.w) * 100}%`,
            top: `${(y / d.h) * 100}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px 6px 6px',
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
              width: 24,
              height: 24,
              borderRadius: 999,
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icona size={13} color="#2563EB" strokeWidth={2.2} />
          </span>
          <span style={{ fontSize: d.lletra, fontWeight: 600, color: '#0f172a' }}>{t(`conecta.${clau}`)}</span>
        </div>
      ))}
    </div>
  );
};

const ConectaTodoDemo: React.FC<{ loop?: boolean; staticMode?: boolean }> = ({ staticMode = false }) => {
  const reduir = !!useReducedMotion() || staticMode;
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '0 auto' }}>
      <div className="hidden sm:block"><Diagrama d={AMPLA} reduir={reduir} /></div>
      <div className="sm:hidden"><Diagrama d={ESTRETA} reduir={reduir} /></div>
    </div>
  );
};

export default ConectaTodoDemo;
