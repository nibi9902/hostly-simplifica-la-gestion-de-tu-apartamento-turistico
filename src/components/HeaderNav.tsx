import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, Play, Home, Building2, Sun, KeyRound, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NavConfig, NavDropdownItem, NavMainItem } from '@/lib/data/nav';
import { iconaFuncio } from '@/lib/data/iconesFuncions';
import { cn } from '@/lib/utils';
import { LangLink } from '@/i18n/LangLink';
import { useLang } from '@/i18n/useLang';
import hostlyMarca from '@/assets/hostly-marca.webp';

/** Un apartat de la píndola del mig (enllaç o botó que obre el desplegable). */
const PINDOLA = 'h-9 px-4 rounded-full inline-flex items-center gap-1 text-sm font-medium text-[hsl(220_14%_20%)] transition-colors duration-150 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';

/* Els desplegables (13-10-2026): abans eren un tauler blanc d'una vora a l'altra que baixava en
   450 ms sobre la pàgina desenfocada, amb només text. Ara són una targeta blanca que surt sota el
   capçal, amb les peces de la portada: icona, títol i una línia. Entra en 200 ms i surt en 150,
   sense rebot; amb «reduir moviment», sense moure's. */
type MegaState = 'closed' | 'opening' | 'open' | 'closing';
const ESPERA_TANCA = 180; // el temps per anar del botó a la targeta sense que es tanqui
const DURA_SORTIDA = 150;

/** Les icones dels apartats de «Para quién»; les de les funcionalitats, `iconaFuncio`. */
const ICONES_PERSONES: Record<string, LucideIcon> = { Home, Building2, Sun, KeyRound };
const icona = (nom: string) => ICONES_PERSONES[nom] || iconaFuncio(nom);
/** El distintiu en verd només quan vol dir «gratis»; la resta, neutre. */
const DISTINTIU_VERD = new Set(['Gratis']);

const GRIS = 'text-[hsl(220_9%_46%)]';
const RETOL = 'text-[12px] leading-4 font-semibold uppercase tracking-[0.08em] text-[hsl(220_9%_46%)]';

function Distintiu({ text }: { text: string }) {
  return (
    <span className={cn('text-[10px] leading-4 font-semibold uppercase tracking-[0.06em] px-1.5 rounded-full',
      DISTINTIU_VERD.has(text) ? 'bg-[hsl(142_76%_93%)] text-[hsl(142_72%_29%)]' : 'bg-[hsl(210_20%_94%)] text-[hsl(220_9%_40%)]')}>
      {text}
    </span>
  );
}

/** Una peça del desplegable: la icona en un quadradet gris, el títol i una línia. */
function Peca({ item, onTria, mobil = false }: { item: NavDropdownItem; onTria: () => void; mobil?: boolean }) {
  const Icona = item.icon ? icona(item.icon) : null;
  return (
    <LangLink
      to={item.href}
      onClick={onTria}
      className={cn('group flex items-start gap-3.5 rounded-2xl transition-colors duration-150 hover:bg-[hsl(210_20%_97%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        mobil ? 'px-2 py-2.5 -mx-2' : 'p-3')}
    >
      {Icona && (
        <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-[hsl(210_20%_95%)] text-[hsl(220_14%_20%)] transition-[background-color,box-shadow] duration-150 group-hover:bg-white group-hover:shadow-[0_1px_3px_rgba(15,23,42,0.1)]" aria-hidden="true">
          <Icona className="w-[18px] h-[18px]" />
        </span>
      )}
      <span className="min-w-0 pt-0.5">
        <span className="flex items-center gap-2 text-[15px] leading-snug font-semibold text-[hsl(220_14%_11%)]">
          {item.label}
          {item.badge && <Distintiu text={item.badge} />}
        </span>
        {item.description && <span className={cn('block mt-0.5 text-[13.5px] leading-snug', GRIS)}>{item.description}</span>}
      </span>
    </LangLink>
  );
}

/** Un enllaç de «Recursos»: sense icona, el títol i una línia. */
function Enllac({ item, onTria }: { item: NavDropdownItem; onTria: () => void }) {
  return (
    <LangLink
      to={item.href}
      onClick={onTria}
      className="block rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-[hsl(210_20%_97%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="flex items-center gap-2 text-[14.5px] leading-snug font-semibold text-[hsl(220_14%_11%)]">
        {item.label}
        {item.badge && <Distintiu text={item.badge} />}
      </span>
      {item.description && <span className={cn('block mt-0.5 text-[13px] leading-snug', GRIS)}>{item.description}</span>}
    </LangLink>
  );
}

/** Les peces per grups (`grup` a nav.ts), en l'ordre en què surten. */
function perGrups(items: NavDropdownItem[]): Array<{ grup: string; items: NavDropdownItem[] }> {
  const grups: Array<{ grup: string; items: NavDropdownItem[] }> = [];
  for (const it of items) {
    const g = it.grup ?? '';
    const ja = grups.find((x) => x.grup === g);
    if (ja) ja.items.push(it);
    else grups.push({ grup: g, items: [it] });
  }
  return grups;
}

/** El contingut de cada desplegable. */
function Contingut({ item, onTria }: { item: NavMainItem; onTria: () => void }) {
  const { t } = useTranslation('common');
  // Funcionalitats: una columna per grup, com a Recursos (13-10: «hauria de ser més ampli»), i al costat
  // «Cómo funciona», amb la pantalla de Hostly (abans, la caràtula d'un dels vídeos: «aquest no és el vídeo»)
  if (item.dropdown && item.href) {
    return (
      <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_272px] gap-2">
        {perGrups(item.dropdown).map((g, i) => (
          <div key={g.grup} className="flex flex-col">
            <p className={cn(RETOL, 'px-3 pt-2 pb-1')}>{g.grup}</p>
            <ul className="flex flex-col">
              {g.items.map((sub) => <li key={sub.href}><Peca item={sub} onTria={onTria} /></li>)}
            </ul>
            {/* «Veure-les totes», a sota de la primera columna */}
            {i === 0 && (
              <LangLink to={item.href!} onClick={onTria} className="mt-auto mx-3 mb-1 pt-2 self-start inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(220_14%_11%)] hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
                {t('nav.menu.totes')} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </LangLink>
            )}
          </div>
        ))}
        <LangLink to="/demo" onClick={onTria} className="flex flex-col gap-3 overflow-hidden rounded-[22px] bg-[hsl(220_14%_11%)] p-3 pb-5 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
          <img src="/assets/menu/app-resumen.webp" alt="" width={560} height={425} loading="lazy" decoding="async" className="w-full rounded-[14px] bg-white/5" />
          <span className="flex flex-col gap-2 px-2.5">
            <span className="text-[12px] leading-4 font-semibold uppercase tracking-[0.08em] text-white/60">{t('demo.eyebrow')}</span>
            <span className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">{t('demo.subheading')}</span>
            <span className="mt-1 self-start inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white text-[hsl(220_14%_11%)] text-sm font-medium">
              <Play className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true" />{t('nav.menu.videos')}
            </span>
          </span>
        </LangLink>
      </div>
    );
  }
  // Per a qui: les quatre peces, dues i dues
  if (item.dropdown) {
    return (
      <ul className="grid grid-cols-2 gap-0.5">
        {item.dropdown.map((sub) => <li key={sub.href}><Peca item={sub} onTria={onTria} /></li>)}
      </ul>
    );
  }
  // Recursos: una columna per grup, amb el seu enllaç a baix
  return (
    <div className="grid grid-cols-3 gap-2">
      {item.groups?.map((group) => (
        <div key={group.groupLabel} className="flex flex-col">
          <p className={cn(RETOL, 'px-3 pt-2 pb-1.5')}>{group.groupLabel}</p>
          <ul className="flex flex-col">
            {group.items.map((sub) => <li key={sub.href}><Enllac item={sub} onTria={onTria} /></li>)}
          </ul>
          {group.footerHref && (
            <LangLink to={group.footerHref} onClick={onTria} className="mt-auto mx-3 pt-2 pb-1 self-start inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(220_14%_11%)] hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full">
              {group.footerLabel} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </LangLink>
          )}
        </div>
      ))}
    </div>
  );
}

/** El mateix al menú del mòbil: les peces una sota l'altra i, a Recursos, els enllaços sense la línia. */
function ContingutMobil({ item, onTria }: { item: NavMainItem; onTria: () => void }) {
  const { t } = useTranslation('common');
  const peu = 'self-start inline-flex items-center gap-1.5 py-2 text-[15px] font-medium text-[hsl(220_14%_11%)]';
  if (item.dropdown) {
    return (
      <div className="flex flex-col">
        {perGrups(item.dropdown).map((g) => (
          <div key={g.grup} className="flex flex-col">
            {g.grup && <p className={cn(RETOL, 'pt-2 pb-1')}>{g.grup}</p>}
            <ul className="flex flex-col">
              {g.items.map((sub) => <li key={sub.href}><Peca item={sub} onTria={onTria} mobil /></li>)}
            </ul>
          </div>
        ))}
        {item.href && (
          <div className="flex flex-col mt-2">
            <LangLink to={item.href} onClick={onTria} className={peu}>{t('nav.menu.totes')} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" /></LangLink>
            <LangLink to="/demo" onClick={onTria} className={peu}><Play className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true" />{t('nav.menu.videos')}</LangLink>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5">
      {item.groups?.map((group) => (
        <div key={group.groupLabel} className="flex flex-col">
          <p className={cn(RETOL, 'pb-1.5')}>{group.groupLabel}</p>
          <ul className="flex flex-col">
            {group.items.map((sub) => (
              <li key={sub.href}>
                <LangLink to={sub.href} onClick={onTria} className="flex items-center gap-2 py-2 text-[15px] font-medium text-[hsl(220_14%_11%)]">
                  {sub.label}
                  {sub.badge && <Distintiu text={sub.badge} />}
                </LangLink>
              </li>
            ))}
          </ul>
          {group.footerHref && (
            <LangLink to={group.footerHref} onClick={onTria} className={cn(peu, 'text-primary')}>{group.footerLabel} <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" /></LangLink>
          )}
        </div>
      ))}
    </div>
  );
}

/** ES / CA: al capçal (des de 640 px) i, al mòbil, dins del menú (abans no hi era: al mòbil no es podia canviar). */
function SelectorIdioma({ lang, setLang, gran = false }: { lang: string; setLang: (l: 'es' | 'ca') => void; gran?: boolean }) {
  return (
    <div className={cn('flex items-center gap-0.5 p-0.5 rounded-full bg-[hsl(210_20%_94%)] font-semibold', gran ? 'text-sm' : 'text-[11px]')} role="group" aria-label="Idioma">
      {(['es', 'ca'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={l === 'es' ? 'Español' : 'Català'}
          className={cn(
            'rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            gran ? 'h-10 min-w-[64px] px-4' : 'h-7 min-w-[34px] px-2.5',
            lang === l ? 'bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-slate-500 hover:text-foreground',
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
type Props = { nav: NavConfig };

export function HeaderNav({ nav }: Props) {
  const { t } = useTranslation('common');
  const { lang, setLang } = useLang();
  const [megaState, setMegaStateReal] = useState<MegaState>('closed');
  // l'estat també en una ref: el clic fora i el focus que surt arriben junts, abans de tornar a pintar
  const estat = useRef<MegaState>('closed');
  const setMegaState = (e: MegaState) => { estat.current = e; setMegaStateReal(e); };
  const [megaLabel, setMegaLabel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  // al mòbil, l'apartat obert (un cada vegada)
  const [obertMobil, setObertMobil] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botons = useRef<Record<string, HTMLButtonElement | null>>({});
  const { pathname } = useLocation();

  const netejaTemps = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
  };

  const triggerOpen = (label: string) => {
    netejaTemps();
    setMegaLabel(label);
    if (estat.current === 'closed' || estat.current === 'closing') {
      setMegaState('opening');
      // dos fotogrames després (perquè la transició surti), si no s'ha tancat pel camí
      requestAnimationFrame(() => requestAnimationFrame(() => { if (estat.current === 'opening') setMegaState('open'); }));
    }
  };

  // Tancar ara (Esc, un clic fora, triar un enllaç) o d'aquí a una mica (el ratolí ha sortit)
  const tancaAra = () => {
    if (estat.current === 'closed' || estat.current === 'closing') return;
    netejaTemps();
    setMegaState('closing');
    exitTimer.current = setTimeout(() => { setMegaState('closed'); setMegaLabel(null); }, DURA_SORTIDA);
  };
  const triggerClose = () => {
    if (estat.current === 'closed' || estat.current === 'closing') return;
    netejaTemps();
    closeTimer.current = setTimeout(tancaAra, ESPERA_TANCA);
  };

  useEffect(() => {
    setMobileOpen(false);
    tancaAra();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) setObertMobil(null);
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Obert: Esc el tanca (i torna el focus al botó) i un clic fora del capçal, també
  useEffect(() => {
    if (megaState === 'closed' || megaState === 'closing') return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const boto = megaLabel ? botons.current[megaLabel] : null;
      tancaAra();
      boto?.focus();
    };
    const fora = (e: PointerEvent) => { if (!(e.target as Element | null)?.closest('header')) tancaAra(); };
    document.addEventListener('keydown', tecla);
    document.addEventListener('pointerdown', fora);
    return () => { document.removeEventListener('keydown', tecla); document.removeEventListener('pointerdown', fora); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [megaState, megaLabel]);

  const isOpen = megaState === 'open' || megaState === 'opening';
  const visible = megaState === 'open';

  return (
    <>
      {/* Ordinador: els apartats, en una píndola grisa al mig */}
      <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-full bg-[hsl(210_20%_94%)] justify-self-center" aria-label="Primary">
        {nav.main.map((item) => {
          if (!item.dropdown && !item.groups) {
            const isActive = pathname === item.href || pathname.endsWith(item.href);
            return (
              <LangLink
                key={item.label}
                to={item.href}
                onMouseEnter={triggerClose}
                className={cn(PINDOLA, isActive && 'bg-white')}
              >
                {item.label}
              </LangLink>
            );
          }
          const itemOpen = megaLabel === item.label && isOpen;
          const mostra = megaLabel === item.label && megaState !== 'closed';
          return (
            <div
              key={item.label}
              onMouseEnter={() => triggerOpen(item.label)}
              onMouseLeave={triggerClose}
              // amb el teclat: en sortir el focus de l'apartat i del seu desplegable, es tanca
              onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) triggerClose(); }}
            >
              <button
                type="button"
                ref={(b) => { botons.current[item.label] = b; }}
                // amb el ratolí, el clic l'obre (ja s'havia obert en passar-hi i no s'ha de tancar);
                // amb el teclat (Enter o espai, `detail` 0), l'obre i el tanca
                onClick={(e) => (itemOpen && e.detail === 0 ? tancaAra() : triggerOpen(item.label))}
                className={cn(PINDOLA, itemOpen && 'bg-white')}
                aria-expanded={itemOpen}
              >
                {item.label}
                <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', itemOpen && 'rotate-180')} aria-hidden="true" />
              </button>
              {/* El desplegable va just després del seu botó (el tabulador hi entra), però es posa sota el
                  capçal, al mig de la pàgina. El marge de dalt és transparent: el ratolí hi passa sense tancar-lo. */}
              {mostra && (
                <div className="absolute inset-x-0 top-[62px] flex justify-center pointer-events-none">
                  <div
                    className={cn(
                      'pointer-events-auto pt-[26px] origin-top',
                      'transition-[opacity,transform] motion-reduce:transition-opacity',
                      visible ? 'duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] opacity-100 translate-y-0 scale-100'
                        : 'duration-150 ease-in opacity-0 -translate-y-1.5 scale-[0.985] motion-reduce:translate-y-0 motion-reduce:scale-100',
                      item.groups || item.href ? 'w-[min(1240px,calc(100vw_-_2*var(--web-marge)))]' : 'w-[min(680px,calc(100vw_-_2*var(--web-marge)))]',
                    )}
                  >
                    <div className="rounded-[28px] bg-white p-2 shadow-[0_24px_64px_-24px_rgba(15,23,42,0.28),0_2px_8px_rgba(15,23,42,0.04)] ring-1 ring-[hsl(220_13%_91%)]">
                      <div key={item.label} className="animate-in fade-in-0 duration-200 motion-reduce:animate-none">
                        <Contingut item={item} onTria={tancaAra} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* A la dreta: l'idioma, «Iniciar sesión» i «Empezar»; al mòbil, l'idioma i el menú */}
      <div className="flex items-center justify-end gap-5 justify-self-end">
        <div className="hidden sm:flex"><SelectorIdioma lang={lang} setLang={setLang} /></div>
        <a
          href={nav.ctas.secondary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          {t('nav.login')}
        </a>
        <LangLink to="/empezar" state={{ desde: pathname }}
          className="hidden lg:inline-flex items-center justify-center h-11 px-5 rounded-full bg-primary text-primary-foreground text-[15px] font-medium shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:bg-[#1d4ed8] transition-colors">
          {nav.ctas.primary.label}
        </LangLink>
        <button type="button" onClick={() => setMobileOpen(true)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors" aria-label={t('nav.aria_open_menu')}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }} className="lg:hidden bg-white overflow-y-auto animate-in fade-in-0 duration-200 motion-reduce:animate-none">
          <div className="contenidor flex items-center justify-between h-20 border-b border-slate-100">
            <LangLink to="/" onClick={() => setMobileOpen(false)} className="inline-flex items-center" aria-label="Hostly">
              <img src={hostlyMarca} alt="" width={160} height={24} className="h-6 w-auto" />
            </LangLink>
            <button type="button" onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors" aria-label={t('nav.aria_close_menu')}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="contenidor py-4" aria-label="Mobile primary">
            <ul>
              {nav.main.map((item) => {
                if (!item.dropdown && !item.groups) {
                  return (
                    <li key={item.label} className="border-b border-[hsl(220_13%_93%)]">
                      <LangLink to={item.href} onClick={() => setMobileOpen(false)} className="flex items-center py-4 text-[17px] font-semibold text-foreground">{item.label}</LangLink>
                    </li>
                  );
                }
                const obert = obertMobil === item.label;
                const id = `menu-mobil-${item.label.toLowerCase().replace(/[^a-z]+/g, '-')}`;
                return (
                  <li key={item.label} className="border-b border-[hsl(220_13%_93%)]">
                    <button
                      type="button"
                      aria-expanded={obert}
                      aria-controls={id}
                      onClick={() => setObertMobil(obert ? null : item.label)}
                      className="w-full flex items-center justify-between py-4 text-[17px] font-semibold text-foreground"
                    >
                      {item.label}
                      <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-200', obert && 'rotate-180')} aria-hidden="true" />
                    </button>
                    {/* s'obre i es tanca fent créixer l'alçada (0fr → 1fr); tancat, ni es veu ni s'hi arriba amb el tabulador */}
                    <div id={id} className={cn('grid transition-[grid-template-rows] duration-[250ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none', obert ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                      <div className={cn('min-h-0 overflow-hidden transition-[visibility] duration-[250ms] motion-reduce:transition-none', obert ? 'visible' : 'invisible')}>
                        <div className="pb-4">
                          <ContingutMobil item={item} onTria={() => setMobileOpen(false)} />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 space-y-3">
              <div className="flex justify-center pb-3"><SelectorIdioma lang={lang} setLang={setLang} gran /></div>
              <a href={nav.ctas.secondary.href} target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-full border border-slate-200 text-foreground font-semibold">
                {t('nav.login')}
              </a>
              <LangLink to="/empezar" state={{ desde: pathname }} onClick={() => setMobileOpen(false)}
                className="block w-full text-center py-3 rounded-full bg-primary text-primary-foreground font-semibold">
                {nav.ctas.primary.label}
              </LangLink>
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </>
  );
}
