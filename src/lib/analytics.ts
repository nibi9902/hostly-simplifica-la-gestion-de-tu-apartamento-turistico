/**
 * Els esdeveniments del web: una sola porta.
 *
 * - Publicitat (Meta, Google Ads): `conversio()` de `seguiment.ts`, només si la persona ha
 *   acceptat «Publicidad» i hi ha identificadors; només el nom de l'esdeveniment.
 * - Google Analytics: `gtag()`, que només existeix si s'han acceptat les galetes (`galetes.ts`).
 * - En desenvolupament, a més, a la consola amb el prefix [analytics].
 */
import { conversio } from '@/lib/seguiment';


type EventName =
  | 'cta_primary_click'      // Botó "Empezar gratis" a qualsevol lloc
  | 'cta_demo_click'         // "Ver cómo funciona" / demo
  | 'cta_secondary_click'    // CTAs secundaris
  | 'pricing_view'           // Usuari arriba a secció preus
  | 'replaces_section_view'  // Usuari veu "el que reemplaces"
  | 'article_read_percent'   // 25/50/75/100
  | 'blog_category_click'    // Clic a categoria del blog
  | 'nav_dropdown_open'      // Obre mega-menú
  | 'signup_start'           // Clic final al link signup
  // L'embut del redisseny d'octubre 2026 (/empezar, /calcula, «Te llamo»)
  | 'empezar_datos'          // Pas 1 de /empezar desat (telèfon, nom, correu)
  | 'empezar_plan'           // Pas 2: tria gratis o complet
  | 'empezar_cuenta'         // Pas 3 gratis: va a crear el compte a l'app
  | 'demo_solicitada'        // Pas 3 complet: ha triat dia i hora
  | 'calcula_resultado'      // Ha acabat les preguntes de /calcula
  | 'calcula_telefono'       // Ha deixat el telèfon per veure el detall
  | 'llamame_enviado';       // «Te llamo» de preus

interface EventParams {
  location?: string;   // 'hero' | 'pricing' | 'final-cta' | 'navbar' | 'article' ...
  variant?: string;
  value?: number;
  [key: string]: unknown;
}

declare global {
  interface Window {
    gtag?: (command: 'event', name: string, params?: Record<string, unknown>) => void;
    dataLayer?: unknown[];
  }
}

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

export function track(name: EventName, params: EventParams = {}): void {
  conversio(name);
  if (isDev) {
    console.log(`[analytics] ${name}`, params);
    return;
  }
  if (isProd && typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }
}

/** Helper per trackear scroll depth en articles */
export function trackArticleScrollDepth(slug: string) {
  if (typeof window === 'undefined') return;
  const milestones = [25, 50, 75, 100];
  const reached = new Set<number>();

  const handler = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const percent = Math.round((scrolled / total) * 100);
    for (const m of milestones) {
      if (percent >= m && !reached.has(m)) {
        reached.add(m);
        track('article_read_percent', { value: m, slug });
      }
    }
  };

  window.addEventListener('scroll', handler, { passive: true });
  return () => window.removeEventListener('scroll', handler);
}
