import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SECTION_IDS = ['pain', 'features', 'funciones', 'steps', 'soporte', 'precios'] as const;

const DOT_GAP  = 28;   // px entre cada marca
const NAV_H    = (SECTION_IDS.length - 1) * DOT_GAP;  // 140px

export default function PageProgress() {
  const { t } = useTranslation('common');
  const SECTIONS = SECTION_IDS.map(id => ({
    id,
    label: t(`page_progress.sections.${id}`),
  }));

  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [visible,   setVisible]   = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);

  // Spring suau per al moviment del punt de llum
  const springY = useSpring(0, { stiffness: 200, damping: 28, mass: 0.6 });

  // Quan canvia el sector actiu, el spring salta a la nova posició
  useEffect(() => {
    if (activeIdx >= 0) springY.set(activeIdx * DOT_GAP);
  }, [activeIdx, springY]);

  // Detecció de secció activa via getBoundingClientRect (funciona amb hero 12000px)
  const detect = useCallback(() => {
    const vCenter = window.innerHeight / 2;
    let closest = -1;
    let closestDist = Infinity;
    let anySectionVisible = false;

    SECTIONS.forEach(({ id }, i) => {
      const el = document.getElementById(id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Si la secció és visible (top < 90% del viewport i bottom > 10%)
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > window.innerHeight * 0.1) {
        anySectionVisible = true;
        const sectionCenter = rect.top + rect.height / 2;
        const dist = Math.abs(sectionCenter - vCenter);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      }
    });

    setVisible(anySectionVisible);
    if (closest >= 0) setActiveIdx(closest);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', detect, { passive: true });
    detect();
    return () => window.removeEventListener('scroll', detect);
  }, [detect]);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Coordenada Y del glow transformada al translate del dot
  const dotTop = useTransform(springY, v => v);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="hidden xl:block"
          style={{
            position: 'fixed',
            right: '28px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 40,
            userSelect: 'none',
          }}
          aria-label={t('page_progress.nav_aria')}
        >
          {/* Contenidor relatiu per tenir la línia i el dot */}
          <div style={{ position: 'relative', width: '32px', height: `${NAV_H}px` }}>

            {/* Línia vertical de fons — molt subtil */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '1px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(15,23,42,0.12) 20%, rgba(15,23,42,0.12) 80%, transparent 100%)',
            }} />

            {/* Punt de llum lliscant — animat amb spring */}
            <motion.div
              style={{
                position: 'absolute',
                left: '50%',
                top: dotTop,
                x: '-50%',
                y: '-50%',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'radial-gradient(circle at center, #2563EB 0%, #1a3a8f 70%)',
                boxShadow: '0 0 0 3px rgba(37,99,235,0.15), 0 0 12px 3px rgba(37,99,235,0.45)',
                zIndex: 2,
              }}
            />

            {/* Marks invisibles — zones clickables per a cada secció */}
            {SECTIONS.map(({ id, label }, i) => {
              const isActive  = activeIdx  === i;
              const isHovered = hoveredIdx === i;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  aria-label={label}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: i * DOT_GAP,
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    outline: 'none',
                    zIndex: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Marca subtle de la posició */}
                  <motion.div
                    animate={{
                      width:  isActive ? 6 : isHovered ? 5 : 3,
                      height: isActive ? 6 : isHovered ? 5 : 3,
                      opacity: isActive ? 0 : isHovered ? 0.6 : 0.25,
                      background: isHovered ? 'hsl(var(--primary))' : 'rgba(15,23,42,1)',
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ borderRadius: '50%' }}
                  />

                  {/* Label — tooltip esquerra, apareix al hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0, x: 6, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 6, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          position: 'absolute',
                          right: '22px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.04em',
                          color: 'rgba(15,23,42,0.7)',
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          background: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(8px)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(15,23,42,0.06)',
                          boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
                        }}
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
