import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNav } from '@/lib/data/useNav';
import { HeaderNav } from './HeaderNav';
import hostlyMarca from '@/assets/hostly-marca.webp';
import { cn } from '@/lib/utils';
import { LangLink } from '@/i18n/LangLink';

/**
 * Al mòbil (< 768 px), el capçal se'n va mentre baixes i torna quan puges (opció 1B del Biel, 17-10):
 * el text té tota la pantalla i, en tornar, porta «Empezar» i el menú. Dalt de tot sempre hi és.
 * A l'ordinador no es mou mai.
 */
function useCapcalQueMarxa(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const mobil = window.matchMedia('(max-width: 767px)');
    let ultim = window.scrollY;
    let pendent = false;
    const mira = () => {
      pendent = false;
      const y = window.scrollY;
      if (!mobil.matches || y < 80) { setVisible(true); ultim = y; return; }
      const d = y - ultim;
      if (Math.abs(d) < 8) return; // el tremolor del dit no el mou
      setVisible(d < 0);
      ultim = y;
    };
    const enScroll = () => { if (!pendent) { pendent = true; requestAnimationFrame(mira); } };
    window.addEventListener('scroll', enScroll, { passive: true });
    mobil.addEventListener('change', mira);
    return () => { window.removeEventListener('scroll', enScroll); mobil.removeEventListener('change', mira); };
  }, []);
  return visible;
}

/**
 * El capçal, com el de la portada aprovada (13-10-2026): la marca a l'esquerra, els apartats en una
 * píndola grisa al mig i, a la dreta, l'idioma, «App» i «Empezar» (`HeaderNav`).
 */
export function SiteHeader() {
  const { pathname } = useLocation();
  const NAV = useNav();
  // Home: tant `/` com `/es` o `/ca`
  const segments = pathname.split('/').filter(Boolean);
  const isHome = segments.length === 0 || (segments.length === 1 && (segments[0] === 'es' || segments[0] === 'ca'));
  // Des del 15-10 el capçal surt de seguida també a la portada (revisió de màrqueting: qui ve d'un anunci
  // ha de tenir «Empezar» a mà des del primer moment). Abans esperava que acabés l'entrada (~2,6 s).
  const visible = useCapcalQueMarxa();
  void isHome;

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
      <div className="contenidor h-20 flex items-center justify-between gap-3 sm:gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <LangLink to="/" className="flex items-center shrink-0 justify-self-start max-md:min-h-11" aria-label="Hostly">
          <img src={hostlyMarca} alt="" width={160} height={24} className="h-6 w-auto" />
        </LangLink>
        <HeaderNav nav={NAV} />
      </div>
    </header>
  );
}
