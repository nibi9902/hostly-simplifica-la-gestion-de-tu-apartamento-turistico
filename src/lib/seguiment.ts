/**
 * Publicitat i retargeting (10-10-2026): Meta (Instagram i Facebook) i Google Ads.
 *
 * Per què: el Biel vol «trackejar la gent que entra per després fer-li retargeting». Vol dir que,
 * si una persona ho accepta, Meta i Google sàpiguen que ha visitat el web (i si ha deixat el
 * telèfon o ha demanat una demo), per tornar-li a ensenyar Hostly en anuncis i saber quins
 * anuncis porten contactes.
 *
 * Com:
 *   · Només amb consentiment. Sense «Publicidad» acceptada al bàner, no es carrega res de Meta
 *     ni de Google Ads (art. 22.2 LSSI i guia de galetes de l'AEPD).
 *   · Només si hi ha identificadors (variables d'entorn de Vercel). Sense, el web no parla de
 *     publicitat enlloc: ni al bàner, ni a la política de galetes, ni a la de privacitat.
 *       VITE_META_PIXEL_ID           el píxel de Meta (Events Manager → conjunt de dades)
 *       VITE_GOOGLE_ADS_ID           l'etiqueta de Google Ads («AW-…»)
 *       VITE_GOOGLE_ADS_LEAD_LABEL   l'etiqueta de la conversió «Contacto» (opcional)
 *   · Mode de consentiment v2 de Google: tot denegat per defecte; només s'obre el que s'accepta.
 *   · Al píxel, només el nom de l'esdeveniment (cap resposta de la calculadora). El telèfon i el
 *     correu hi arriben xifrats per dues vies, totes dues només amb la publicitat acceptada: la
 *     coincidència avançada automàtica de Meta (el Biel, 13-10: «volem el millor píxel possible») i
 *     l'API de conversions (14-10, «sí, fes l'API de conversions»): el «Lead» i el «Schedule» surten
 *     també del nostre servidor (`api/esdeveniment.js`), amb el mateix identificador que al píxel
 *     perquè Meta no els compti dues vegades. El xifratge (SHA-256) es fa aquí, al navegador.
 *   · Una sola porta per als esdeveniments: `track()` de `analytics.ts` crida `conversio()`.
 *
 * El detall, les opcions i el que ha de fer el Biel: docs/SEGUIMENT-I-RETARGETING.md
 */

import { dadesRecordades, idVisitant } from "@/lib/leads";

const net = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
const META_PIXEL = net(import.meta.env.VITE_META_PIXEL_ID);
const GOOGLE_ADS = net(import.meta.env.VITE_GOOGLE_ADS_ID);
const GOOGLE_ADS_LEAD = net(import.meta.env.VITE_GOOGLE_ADS_LEAD_LABEL);

/** Quines eines de publicitat hi ha configurades (per als textos del bàner i de les polítiques). */
export const EINES_PUBLICITAT = { meta: !!META_PIXEL, google: !!GOOGLE_ADS } as const;

/** Hi ha cap eina de publicitat? Si no, el web no en parla enlloc. */
export function hiHaPublicitat(): boolean {
  return EINES_PUBLICITAT.meta || EINES_PUBLICITAT.google;
}

/**
 * Les eines a què es diu sí o no («meta+google»), per desar-ho amb la resposta: un sí a Meta no
 * val per a Google. Si canvien (p. ex. s'hi afegeix Google Ads), es torna a preguntar.
 */
export const FIRMA_PUBLICITAT = [META_PIXEL && "meta", GOOGLE_ADS && "google"].filter(Boolean).join("+");

type Fbq = {
  (...args: unknown[]): void;
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
  disablePushState?: boolean;
  allowDuplicatePageViews?: boolean;
};
type Finestra = Window & { fbq?: Fbq; _fbq?: Fbq; dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

/* ─── Google: un sol gtag per a Analytics i Ads, amb el mode de consentiment ─── */

/** El `gtag` de la pàgina; el primer cop, amb tot denegat (es va obrint amb `consent update`). */
export function gtagAmbConsentiment(): (...args: unknown[]) => void {
  const w = window as Finestra;
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    w.gtag("js", new Date());
  }
  return w.gtag;
}

let scriptGoogle = false;
/** El fitxer de Google es carrega un sol cop (serveix per a Analytics i per a Ads). */
export function carregaScriptGoogle(id: string): void {
  if (scriptGoogle) return;
  scriptGoogle = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);
}

/* ─── Publicitat ─── */

let activa = false;
let pixelIniciat = false;

/** Carrega Meta i Google Ads. Només s'ha de cridar amb «Publicidad» acceptada. */
export function carregaPublicitat(): void {
  if (typeof document === "undefined" || !hiHaPublicitat()) return;
  const w = window as Finestra;
  if (activa) return;
  activa = true;

  if (GOOGLE_ADS) {
    const gtag = gtagAmbConsentiment();
    gtag("consent", "update", { ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    gtag("config", GOOGLE_ADS);
    carregaScriptGoogle(GOOGLE_ADS);
  }

  if (META_PIXEL) {
    if (!w.fbq) {
      // El codi del píxel de Meta, tal com el dona Meta (traduït a TypeScript)
      const n = function (...args: unknown[]) {
        if (n.callMethod) n.callMethod(...args);
        else n.queue.push(args);
      } as Fbq;
      if (!w._fbq) w._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      // Les pàgines vistes les compta el web, una per canvi de pàgina, igual que a Google Ads
      // (`paginaVista`). Sense això, el píxel mira sol l'historial i compta també cada clic a
      // l'índex dels articles (canvia l'àncora de l'adreça), i descarta les vistes que li enviem
      // (comprovat al fbevents.js del 10-10-2026)
      n.disablePushState = true;
      n.allowDuplicatePageViews = true;
      w.fbq = n;
      const t = document.createElement("script");
      t.async = true;
      t.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(t);
    }
    w.fbq("consent", "grant");
    if (!pixelIniciat) {
      pixelIniciat = true;
      // Sense «configuració automàtica»: el píxel no llegeix sol els botons ni els formularis de la
      // pàgina (el telèfon i el correu de /empezar no han d'arribar a Meta per cap camí)
      w.fbq("set", "autoConfig", false, META_PIXEL);
      w.fbq("init", META_PIXEL);
      w.fbq("track", "PageView");
    }
  }
}

/** Qui ho havia acceptat i ara ho rebutja: es tanca l'aixeta i s'esborren les galetes de publicitat. */
export function retiraPublicitat(): void {
  if (typeof document === "undefined") return;
  const w = window as Finestra;
  activa = false;
  if (w.fbq) w.fbq("consent", "revoke");
  if (w.gtag) w.gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  esborraGaletes(/^(_fbp|_fbc|_gcl_au|_gcl_aw|_gcl_dc|_gcl_gb)$/);
}

/** Esborra les galetes que coincideixen, al domini actual i al principal (.hostlylabs.com). */
export function esborraGaletes(nom: RegExp): void {
  const host = window.location.hostname;
  const principal = host.split(".").slice(-2).join(".");
  for (const parell of document.cookie.split(";")) {
    const clau = parell.split("=")[0]?.trim();
    if (!clau || !nom.test(clau)) continue;
    for (const domini of ["", `; domain=${host}`, `; domain=.${principal}`]) {
      document.cookie = `${clau}=; Max-Age=0; path=/${domini}`;
    }
  }
}

/** Cada canvi de pàgina dins del web (la primera vista ja la compta la càrrega). */
export function paginaVista(): void {
  if (!activa) return;
  const w = window as Finestra;
  if (META_PIXEL && w.fbq) w.fbq("track", "PageView");
  if (GOOGLE_ADS && w.gtag) w.gtag("event", "page_view", { send_to: GOOGLE_ADS });
}

/**
 * Els moments que interessen per als anuncis. Només el nom de l'esdeveniment: res de dades
 * personals. Lead = ha deixat el telèfon (/empezar, calculadora o «Llámame»); Schedule = ha
 * triat hora per a la demo.
 */
const META: Record<string, { estandard?: string; propi?: string }> = {
  empezar_datos: { estandard: "Lead" },
  calcula_telefono: { estandard: "Lead" },
  llamame_enviado: { estandard: "Lead" },
  demo_solicitada: { estandard: "Schedule" },
  empezar_cuenta: { propi: "EmpezarGratis" },
  calcula_resultado: { propi: "Calculadora" },
  video_play: { propi: "VerVideo" },
};
const LEADS = new Set(["empezar_datos", "calcula_telefono", "llamame_enviado"]);

/* ─── L'API de conversions: el mateix esdeveniment, també des del servidor ─── */

const AL_SERVIDOR = new Set(["Lead", "Schedule"]);

function idEsdeveniment(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function galeta(nom: string): string | undefined {
  const m = document.cookie.match(new RegExp(`(?:^|; )${nom}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/** SHA-256 en hexadecimal, com el demana Meta; res si no hi ha valor. */
async function xifra(valor: string | undefined): Promise<string | undefined> {
  if (!valor) return undefined;
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(valor));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * El «Lead» o el «Schedule», cap al nostre servidor, que el passa a Meta. Les dades de contacte surten
 * d'aquí ja xifrades, en el format que demana Meta: el telèfon amb el prefix i només xifres, el correu i
 * el nom en minúscules.
 */
async function alServidor(esdeveniment: string, eventID: string): Promise<void> {
  try {
    const d = dadesRecordades();
    const [nom, ...cognoms] = (d.name ?? "").trim().toLowerCase().split(/\s+/);
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");
    const cos = {
      event_name: esdeveniment,
      event_id: eventID,
      url: window.location.href,
      fbp: galeta("_fbp"),
      fbc: galeta("_fbc") ?? (fbclid ? `fb.1.${Date.now()}.${fbclid}` : undefined),
      ph: await xifra(d.phone?.replace(/\D/g, "")),
      em: await xifra(d.email?.trim().toLowerCase()),
      fn: await xifra(nom),
      ln: await xifra(cognoms.join(" ")),
      external_id: await xifra(idVisitant()),
    };
    await fetch("/api/esdeveniment", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(cos),
    });
  } catch {
    /* sense xarxa o sense xifratge al navegador: ja l'ha comptat el píxel */
  }
}

export function conversio(nom: string): void {
  if (!activa) return;
  const w = window as Finestra;
  const m = META[nom];
  if (META_PIXEL && w.fbq && m) {
    if (m.estandard) {
      const eventID = idEsdeveniment();
      w.fbq("track", m.estandard, {}, { eventID });
      if (AL_SERVIDOR.has(m.estandard)) void alServidor(m.estandard, eventID);
    } else if (m.propi) w.fbq("trackCustom", m.propi);
  }
  if (GOOGLE_ADS && GOOGLE_ADS_LEAD && w.gtag && LEADS.has(nom)) {
    w.gtag("event", "conversion", { send_to: `${GOOGLE_ADS}/${GOOGLE_ADS_LEAD}` });
  }
}
