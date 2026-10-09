/**
 * Galetes analítiques (Google Analytics 4) només amb consentiment.
 *
 * Fins al 09-10-2026, GA4 es carregava des d'`index.html` a tothom sense preguntar,
 * mentre la política de galetes parlava d'un consentiment que no existia. Ara:
 *   · per defecte no es carrega res de Google;
 *   · el bàner (`AvisGaletes`) pregunta un cop; la resposta es recorda 12 mesos;
 *   · «Aceptar» carrega GA4 en aquell moment; «Rechazar» no carrega res.
 * Les galetes tècniques (idioma, el contacte del visitant) no en depenen.
 */

const GA_ID = "G-3LKZXNR4F5";
const CLAU = "hostly_galetes";
const DURADA_MS = 365 * 24 * 60 * 60 * 1000; // 12 mesos

export type Consentiment = { analitiques: boolean; data: number };

export function consentiment(): Consentiment | null {
  try {
    const desat = localStorage.getItem(CLAU);
    if (!desat) return null;
    const c = JSON.parse(desat) as Consentiment;
    if (!c || typeof c.data !== "number" || Date.now() - c.data > DURADA_MS) return null;
    return c;
  } catch {
    return null;
  }
}

let carregada = false;

/** Carrega GA4 (un sol cop). Només s'ha de cridar amb consentiment. */
export function carregaAnalitica(): void {
  if (carregada || typeof document === "undefined") return;
  carregada = true;
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  w.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_ID, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

export function desaConsentiment(analitiques: boolean): void {
  try {
    localStorage.setItem(CLAU, JSON.stringify({ analitiques, data: Date.now() } satisfies Consentiment));
  } catch { /* sense emmagatzematge: es tornarà a preguntar */ }
  if (analitiques) carregaAnalitica();
  window.dispatchEvent(new CustomEvent("hostly:galetes", { detail: { analitiques } }));
}

/** «Cambiar mis preferencias» (pàgina de galetes): es torna a preguntar. */
export function oblidaConsentiment(): void {
  try { localStorage.removeItem(CLAU); } catch { /* res */ }
  window.dispatchEvent(new CustomEvent("hostly:galetes", { detail: null }));
}

/** En arrencar: si ja va dir que sí, es carrega GA4. */
export function aplicaConsentimentDesat(): void {
  if (consentiment()?.analitiques) carregaAnalitica();
}
