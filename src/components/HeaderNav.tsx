import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NavConfig } from '@/lib/data/nav';
import { cn } from '@/lib/utils';
import { LangLink } from '@/i18n/LangLink';

type MegaState = 'closed' | 'opening' | 'open' | 'closing';
type Props = { nav: NavConfig };

export function HeaderNav({ nav }: Props) {
  const { t } = useTranslation('common');
  const [megaState, setMegaState] = useState<MegaState>('closed');
  const [megaLabel, setMegaLabel] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    triggerClose();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const triggerOpen = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    if (megaState === 'closed' || megaState === 'closing') {
      setMegaLabel(label);
      setMegaState('opening');
      requestAnimationFrame(() => requestAnimationFrame(() => setMegaState('open')));
    } else {
      setMegaLabel(label);
    }
  };

  const triggerClose = () => {
    closeTimer.current = setTimeout(() => {
      setMegaState('closing');
      exitTimer.current = setTimeout(() => { setMegaState('closed'); setMegaLabel(null); }, 450);
    }, 80);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (exitTimer.current) clearTimeout(exitTimer.current);
    if (megaState === 'closing') setMegaState('open');
  };

  const isOpen = megaState === 'open' || megaState === 'opening';
  const visible = megaState === 'open';
  const activeItem = nav.main.find((item) => (item.dropdown || item.groups) && item.label === megaLabel);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden lg:flex items-center gap-9 text-sm font-medium" aria-label="Primary">
        {nav.main.map((item) => {
          if (!item.dropdown && !item.groups) {
            const isActive = pathname === item.href || pathname.endsWith(item.href);
            return (
              <LangLink
                key={item.label}
                to={item.href}
                onMouseEnter={triggerClose}
                className={cn(
                  'relative py-1 text-foreground/60 hover:text-foreground transition-colors duration-150',
                  'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full',
                  'after:bg-foreground/40 after:scale-x-0 after:origin-left',
                  'after:transition-transform after:duration-200 hover:after:scale-x-100',
                  isActive && 'text-foreground after:scale-x-100 after:bg-foreground',
                )}
              >
                {item.label}
              </LangLink>
            );
          }
          const itemOpen = megaLabel === item.label && isOpen;
          return (
            <div key={item.label} onMouseEnter={() => triggerOpen(item.label)} onMouseLeave={triggerClose}>
              <button
                type="button"
                onClick={() => (itemOpen ? triggerClose() : triggerOpen(item.label))}
                className={cn(
                  'relative flex items-center gap-1 py-1 transition-colors duration-150 text-foreground/60 hover:text-foreground',
                  'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full',
                  'after:bg-foreground/40 after:scale-x-0 after:origin-left',
                  'after:transition-transform after:duration-200 hover:after:scale-x-100',
                  itemOpen && 'text-foreground after:scale-x-100 after:bg-foreground',
                )}
                aria-expanded={itemOpen}
                aria-haspopup="true"
              >
                {item.label}
                <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', itemOpen && 'rotate-180')} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Desktop CTAs */}
      <div className="hidden lg:flex items-center gap-5 ml-8">
        <a
          href={nav.ctas.secondary.href}
          target="_blank"
          rel="noopener noreferrer"
          title="Acceder a la app"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-[11px] font-semibold text-foreground/60 hover:text-foreground hover:border-slate-300 hover:bg-slate-50 transition-all duration-150"
        >
          <LogIn className="w-3 h-3" />
          App
        </a>
        <LangLink to="/empezar" state={{ desde: pathname }}
          className="inline-flex items-center px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-[0_4px_20px_hsl(var(--primary)/0.3)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]">
          {nav.ctas.primary.label}
        </LangLink>
      </div>

      {/* Mega menu portal */}
      {megaState !== 'closed' && activeItem &&
        createPortal(
          <>
            {/* Backdrop */}
            <div
              style={{ position: 'fixed', top: '80px', left: 0, right: 0, bottom: 0, zIndex: 9989 }}
              className={cn('bg-foreground/5 backdrop-blur-md transition-opacity duration-[450ms] ease-out', visible ? 'opacity-100' : 'opacity-0')}
              onClick={triggerClose}
            />
            {/* Panel */}
            <div
              style={{ position: 'fixed', top: '80px', left: 0, right: 0, zIndex: 9990 }}
              className={cn('bg-white border-b border-slate-100 transition-all duration-[450ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]', visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1')}
              onMouseEnter={cancelClose}
              onMouseLeave={triggerClose}
            >
              <div className="max-w-6xl mx-auto px-6 md:px-8 py-10">

                {/* ── Flat dropdown (Funciones, Para quién) ── */}
                {activeItem.dropdown && (
                  <div className="grid grid-cols-3 gap-x-16 gap-y-9">
                    {activeItem.dropdown.map((sub) => (
                      <LangLink key={sub.href} to={sub.href} className="group flex flex-col gap-1.5" onClick={triggerClose}>
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-semibold text-foreground group-hover:text-primary transition-colors duration-150 leading-snug">{sub.label}</span>
                          {sub.badge && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a]">{sub.badge}</span>}
                        </div>
                        {sub.description && <span className="text-sm text-muted-foreground leading-relaxed">{sub.description}</span>}
                      </LangLink>
                    ))}
                  </div>
                )}

                {/* ── Grouped dropdown (Recursos) — layout horitzontal: cada grup ocupa tot l'ample ── */}
                {activeItem.groups && (
                  <div className="flex flex-col gap-8">
                    {activeItem.groups.map((group) => (
                      <div key={group.groupLabel}>
                        {/* Group header */}
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-4">
                          {group.groupLabel}
                        </p>
                        {/* Items en grid horitzontal */}
                        <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                          {group.items.map((sub) => (
                            <LangLink key={sub.href} to={sub.href} className="group flex flex-col gap-0.5" onClick={triggerClose}>
                              <div className="flex items-center gap-2">
                                <span className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors duration-150 leading-snug">{sub.label}</span>
                                {sub.badge && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[#dbeafe] text-primary">{sub.badge}</span>}
                              </div>
                              {sub.description && <span className="text-xs text-muted-foreground leading-relaxed">{sub.description}</span>}
                            </LangLink>
                          ))}
                        </div>
                        {/* Group footer link */}
                        {group.footerHref && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <LangLink to={group.footerHref} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline" onClick={triggerClose}>
                              {group.footerLabel}
                              <ArrowRight className="w-3 h-3" />
                            </LangLink>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          </>,
          document.body,
        )}

      {/* Mobile burger */}
      <button type="button" onClick={() => setMobileOpen(true)}
        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors" aria-label={t('nav.aria_open_menu')}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile menu */}
      {mobileOpen && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999 }} className="lg:hidden bg-white overflow-y-auto">
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-100">
            <LangLink to="/" onClick={() => setMobileOpen(false)} className="font-semibold text-lg text-foreground">Hostly</LangLink>
            <button type="button" onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-md text-foreground hover:bg-muted transition-colors" aria-label={t('nav.aria_close_menu')}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="px-6 py-6" aria-label="Mobile primary">
            <ul className="space-y-2">
              {nav.main.map((item) => (
                <li key={item.label}>
                  {!item.dropdown && !item.groups ? (
                    <LangLink to={item.href} onClick={() => setMobileOpen(false)} className="block py-3 font-semibold text-foreground hover:text-primary">{item.label}</LangLink>
                  ) : (
                    <details className="group">
                      <summary className="flex items-center justify-between py-3 font-semibold text-foreground cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                      </summary>

                      {/* Flat items */}
                      {item.dropdown && (
                        <ul className="pl-3 pb-2 space-y-3">
                          {item.dropdown.map((sub) => (
                            <li key={sub.href}>
                              <LangLink to={sub.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground hover:text-primary">{sub.label}</LangLink>
                              {sub.description && <p className="text-xs text-muted-foreground mt-0.5">{sub.description}</p>}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Grouped items */}
                      {item.groups && (
                        <div className="pl-3 pb-2 space-y-5">
                          {item.groups.map((group) => (
                            <div key={group.groupLabel}>
                              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 mb-2">{group.groupLabel}</p>
                              <ul className="space-y-2">
                                {group.items.map((sub) => (
                                  <li key={sub.href}>
                                    <LangLink to={sub.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-foreground hover:text-primary">{sub.label}</LangLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </details>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
              <a href={nav.ctas.secondary.href} target="_blank" rel="noopener noreferrer"
                className="block w-full text-center py-3 rounded-full border border-slate-200 text-foreground font-semibold">
                {nav.ctas.secondary.label}
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
