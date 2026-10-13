import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNav } from '@/lib/data/useNav';
import { HeaderNav } from './HeaderNav';
import hostlyMarca from '@/assets/hostly-marca.webp';
import { cn } from '@/lib/utils';
import { LangLink } from '@/i18n/LangLink';

/**
 * El capçal, com el de la portada aprovada (13-10-2026): la marca a l'esquerra, els apartats en una
 * píndola grisa al mig i, a la dreta, l'idioma, «Iniciar sesión» i «Empezar» (`HeaderNav`).
 */
export function SiteHeader() {
  const { pathname } = useLocation();
  const NAV = useNav();
  // Home: tant `/` com `/es` o `/ca`
  const segments = pathname.split('/').filter(Boolean);
  const isHome = segments.length === 0 || (segments.length === 1 && (segments[0] === 'es' || segments[0] === 'ca'));
  const [visible, setVisible] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    // A la home el menú espera que acabi l'animació d'ENTRADA (~3 s, s'acaba
    // sola). L'avís que s'escoltava abans —`hero-cta-visible`— surt de la
    // seqüència lligada al scroll, així que qui entrava i no baixava els
    // ~3.200 px del hero es quedava sense menú.
    setVisible(false);
    const show = () => setVisible(true);
    window.addEventListener('hostly:hero-intro-done', show);
    // Xarxa de seguretat: si l'entrada no arriba a acabar (pestanya en segon
    // pla, animacions reduïdes, GSAP que falla), el menú surt igualment.
    const tard = setTimeout(show, 4500);
    return () => {
      window.removeEventListener('hostly:hero-intro-done', show);
      clearTimeout(tard);
    };
  }, [isHome]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white/95 backdrop-blur-md border-b border-slate-100',
        'transition-all duration-300 ease-in-out',
        !visible && '-translate-y-full opacity-0 pointer-events-none',
      )}
    >
      {/* A l'ordinador, tres columnes: la píndola dels apartats queda al mig de la pàgina */}
      <div className="contenidor h-20 flex items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <LangLink to="/" className="flex items-center shrink-0 justify-self-start" aria-label="Hostly">
          <img src={hostlyMarca} alt="" width={160} height={24} className="h-6 w-auto" />
        </LangLink>
        <HeaderNav nav={NAV} />
      </div>
    </header>
  );
}
