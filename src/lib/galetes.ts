/**
 * Galetes que no són tècniques: només amb consentiment.
 *
 * Fins al 09-10-2026, GA4 es carregava des d'`index.html` a tothom sense preguntar,
 * mentre la política de galetes parlava d'un consentiment que no existia. Ara:
 *   · per defecte no es carrega res de Google ni de Meta;
 *   · el bàner (`AvisGaletes`) pregunta un cop; la resposta es recorda 12 mesos;
 *   · dues finalitats, cadascuna amb el seu sí o no: analítica (Google Analytics) i, des del
 *     10-10-2026 i només si hi ha cap eina configurada, publicitat (`src/lib/seguiment.ts`);
 *   · «Rechazar» no carrega res; si algú ho havia acceptat i després ho rebutja, es tanca
 *     l'aixeta i s'esborren les galetes.
 * Les galetes tècniques (idioma, el contacte del visitant) no en depenen.
 */
import { carregaPublicitat, carregaScriptGoogle, esborraGaletes, FIRMA_PUBLICITAT, gtagAmbConsentiment, hiHaPublicitat, retiraPublicitat } from "@/lib/seguiment";

export const GA_ID = "G-3LKZXNR4F5";
const CLAU = "hostly_galetes";
const DURADA_MS = 365 * 24 * 60 * 60 * 1000; // 12 mesos

/** `publicitat` i `eines` només hi són si es va preguntar per la publicitat (`FIRMA_PUBLICITAT`). */
export type Consentiment = { analitiques: boolean; publicitat?: boolean; eines?: string; data: number };

export function consentiment(): Consentiment | null {
  try {
    const desat = localStorage.getItem(CLAU);
    if (!desat) return null;
    const c = JSON.parse(desat) as Consentiment;
    if (!c || typeof c.data !== "number" || Date.now() - c.data > DURADA_MS) return null;
    // Una resposta d'abans que hi hagués publicitat, o d'abans que hi hagués aquestes eines, no
    // diu res de les d'ara: es torna a preguntar
    if (hiHaPublicitat() && (typeof c.publicitat !== "boolean" || c.eines !== FIRMA_PUBLICITAT)) return null;
    return c;
  } catch {
    return null;
  }
}

let analiticaCarregada = false;

/** Carrega GA4 (un sol cop). Només s'ha de cridar amb consentiment. */
export function carregaAnalitica(): void {
  if (typeof document === "undefined") return;
  const gtag = gtagAmbConsentiment();
  gtag("consent", "update", { analytics_storage: "granted" });
  if (analiticaCarregada) return;
  analiticaCarregada = true;
  gtag("config", GA_ID, { anonymize_ip: true });
  carregaScriptGoogle(GA_ID);
}

/** Qui ho havia acceptat i ara diu que no: Google deixa de comptar i s'esborren les galetes. */
function retiraAnalitica(): void {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (w.gtag) w.gtag("consent", "update", { analytics_storage: "denied" });
  esborraGaletes(/^(_ga|_ga_.*|_gid)$/);
}

function aplica(c: Pick<Consentiment, "analitiques" | "publicitat">): void {
  if (c.analitiques) carregaAnalitica();
  else retiraAnalitica();
  if (c.publicitat) carregaPublicitat();
  else retiraPublicitat();
}

export function desaConsentiment(analitiques: boolean, publicitat = false): void {
  // Sense eines de publicitat no s'ha preguntat per la publicitat: no es desa cap «no», perquè
  // quan n'hi hagi es pregunti
  const resposta: Pick<Consentiment, "analitiques" | "publicitat" | "eines"> = hiHaPublicitat()
    ? { analitiques, publicitat, eines: FIRMA_PUBLICITAT }
    : { analitiques };
  try {
    localStorage.setItem(CLAU, JSON.stringify({ ...resposta, data: Date.now() } satisfies Consentiment));
  } catch { /* sense emmagatzematge: es tornarà a preguntar */ }
  aplica(resposta);
  window.dispatchEvent(new CustomEvent("hostly:galetes", { detail: resposta }));
}

/** «Cambiar mis preferencias» (pàgina de galetes): es torna a preguntar. */
export function oblidaConsentiment(): void {
  try { localStorage.removeItem(CLAU); } catch { /* res */ }
  window.dispatchEvent(new CustomEvent("hostly:galetes", { detail: null }));
}

/** En arrencar: es carrega el que ja va dir que sí. */
export function aplicaConsentimentDesat(): void {
  const c = consentiment();
  if (c?.analitiques) carregaAnalitica();
  if (c?.publicitat) carregaPublicitat();
}
