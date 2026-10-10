/**
 * Contactes del web → base de dades nova de Hostly (`web_lead_desa`).
 *
 * Per què (09-10-2026, Biel): «sempre hem d'intentar tenir el correu i/o telèfon de
 * tota persona que hagi estat una mica interessada… jo truco al moment». Cada pas de
 * /empezar, de /calcula i del «Te llamo» de preus desa aquí, i la base de dades avisa
 * el Biel per Telegram (cron `web-leads-avisa`, cada minut).
 *
 * Abans d'això el formulari desava a la base de dades VELLA (`early_access`) i el
 * qüestionari només enviava un Telegram sense desar res enlloc.
 *
 * Un visitant = un identificador al navegador: tots els seus passos (telèfon, pla,
 * hora de la demo, respostes de la calculadora) s'ajunten en un sol contacte.
 * Migració: `supabase/migracions-bd-nova/20261009142325_web_leads.sql` del monorepo.
 */

// Públiques per naturalesa (com a l'app): la funció només deixa desar, no llegir.
const URL_BD =
  (import.meta.env.VITE_HOSTLY_SUPABASE_URL as string | undefined) ??
  "https://uyaycbrjdgabzrpugznd.supabase.co";
const CLAU_PUBLICA =
  (import.meta.env.VITE_HOSTLY_SUPABASE_KEY as string | undefined) ??
  "sb_publishable_A6le892szm76_SkZ5s_j1Q_GGtrqT9a";

export type OrigenLead = "empezar" | "calcula" | "llamame" | "guia";
export type PlaLead = "gratis" | "completo";

export type DadesLead = {
  phone?: string;
  name?: string;
  email?: string;
  source?: OrigenLead;
  plan?: PlaLead;
  /** ISO amb zona: l'hora que ha triat per a la demo. */
  demo_slot?: string;
  answers?: Record<string, string | number>;
};

/** `motiu` només quan `ok` és fals: telefon · origen · pla · hora · mida · dades · error · xarxa. */
export type ResultatDesa = { ok: boolean; motiu?: string };

/* ─── Telèfon: la mateixa regla que `packages/core/src/telefon.ts` (phoneToDb) ─── */

// La llibreria pesa ~100 kB: es carrega només quan algú envia un telèfon.
let llibreria: Promise<typeof import("libphonenumber-js")> | null = null;

/** Qualsevol format → dígits E.164 sense «+» (`34612345678`), o `null` si no és vàlid. */
export async function telefonPerBD(input: string | null | undefined): Promise<string | null> {
  if (input == null) return null;
  const str = String(input).trim();
  if (!str) return null;
  const { parsePhoneNumberFromString } = await (llibreria ??= import("libphonenumber-js"));
  let normalitzat = str;
  if (str.startsWith("00")) normalitzat = `+${str.slice(2)}`;
  else if (/^\d{10,}$/.test(str)) normalitzat = `+${str}`;
  const a = parsePhoneNumberFromString(normalitzat, "ES");
  if (a?.isValid()) return a.format("E.164").replace("+", "");
  const b = parsePhoneNumberFromString(str, "ES");
  if (b?.isValid()) return b.format("E.164").replace("+", "");
  return null;
}

export function correuValid(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());
}

/* ─── El visitant i d'on ha arribat ─── */

const CLAU_ID = "hostly_lead_id";
let idEnMemoria: string | null = null;

function nouId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Navegadors antics: uuid v4 amb Math.random (només serveix per agrupar passos).
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function idVisitant(): string {
  try {
    const desat = localStorage.getItem(CLAU_ID);
    if (desat) return desat;
    const id = nouId();
    localStorage.setItem(CLAU_ID, id);
    return id;
  } catch {
    // Navegació privada o galetes bloquejades: el contacte es desa igual, només
    // que els passos d'una altra visita no s'hi ajuntaran.
    idEnMemoria ??= nouId();
    return idEnMemoria;
  }
}

type Arribada = { entrada?: string; referrer?: string; [utm: string]: string | undefined };

// Només en memòria: res al navegador abans que la persona ens deixi les dades (sense
// consentiment no hi pot haver cap identificador ni seguiment desat al dispositiu).
// Dura tota la visita (el web és d'una sola pàgina); si es recarrega, es torna a mirar.
let arribadaEnMemoria: Arribada | null = null;

/** Es crida un cop en arrencar: la primera pàgina de la visita i les UTM, si n'hi ha. */
export function apuntaArribada(): void {
  if (arribadaEnMemoria) return;
  const dades: Arribada = { entrada: window.location.pathname };
  try {
    const params = new URLSearchParams(window.location.search);
    // gclid i fbclid: de quin anunci de Google o de Meta ve, si ve d'un anunci
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"]) {
      const v = params.get(k);
      if (v) dades[k] = v.slice(0, 120);
    }
    if (document.referrer) {
      const host = new URL(document.referrer).host;
      if (host && host !== window.location.host) dades.referrer = host;
    }
  } catch { /* URL o referrer estranys: s'ignoren */ }
  arribadaEnMemoria = dades;
}

function arribada(): Arribada {
  return arribadaEnMemoria ?? {};
}

/* ─── Desar ─── */

/**
 * Desa un pas. `pagina` és d'on ve (la pàgina on ha premut «Empezar», o on és ara).
 * Torna-ho a provar un cop si la xarxa falla; mai llença.
 */
export async function desaLead(dades: DadesLead, lang: string, pagina?: string): Promise<ResultatDesa> {
  const cos = {
    p_id: idVisitant(),
    p_dades: {
      ...dades,
      lang,
      page: pagina ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
      utm: arribada(),
    },
  };
  for (let intent = 0; intent < 2; intent++) {
    try {
      const r = await fetch(`${URL_BD}/rest/v1/rpc/web_lead_desa`, {
        method: "POST",
        headers: { apikey: CLAU_PUBLICA, "Content-Type": "application/json" },
        body: JSON.stringify(cos),
      });
      if (r.ok) {
        const j = (await r.json()) as { ok?: boolean; motiu?: string } | null;
        return j?.ok ? { ok: true } : { ok: false, motiu: j?.motiu ?? "error" };
      }
    } catch {
      /* xarxa: es torna a provar */
    }
    if (intent === 0) await new Promise((res) => setTimeout(res, 700));
  }
  return { ok: false, motiu: "xarxa" };
}

/* ─── El que el visitant ja ens ha dit (per no tornar-li a demanar) ─── */

const CLAU_DADES = "hostly_lead_dades";

export type DadesRecordades = { phone?: string; name?: string; email?: string };

export function dadesRecordades(): DadesRecordades {
  try {
    const desat = localStorage.getItem(CLAU_DADES);
    return desat ? (JSON.parse(desat) as DadesRecordades) : {};
  } catch {
    return {};
  }
}

export function recordaDades(d: DadesRecordades): void {
  try {
    localStorage.setItem(CLAU_DADES, JSON.stringify({ ...dadesRecordades(), ...d }));
  } catch { /* sense emmagatzematge: no passa res */ }
}
