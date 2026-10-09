/**
 * La calculadora de /calcula: «¿Te sale a cuenta?».
 *
 * Decisió del Biel (09-10-2026): qui la faci «ha de sortir pensant: hòstia, potser sí
 * que em val la pena 40 euros». Però amb números que es puguin defensar: només es
 * compten com a estalvi les eines que Hostly substitueix de debò (check-in, channel
 * manager, preus); l'Excel i la gestoria surten al detall però no sumen euros.
 *
 * Preus orientatius per apartament i mes (els mateixos que diu la resta del web):
 *   · App de check-in (Chekin…)        15 €  → «180 € al año en otras apps»
 *   · Channel manager (Smoobu…)        20 €
 *   · App de preus (PriceLabs…)        20 €
 * Hostly: 40 € per apartament, 35 € des de 5. Més de 15 pisos: preu a mida.
 */

export const OPCIONS_PISOS = ["1", "2-4", "5-15", "15+"] as const;
export const OPCIONS_DONDE = ["catalunya", "altra"] as const;
export const OPCIONS_USAS = ["checkin", "canales", "precios", "excel", "gestoria", "nada"] as const;
export const OPCIONS_HORAS = ["<2", "2-5", "5-10", "10+"] as const;
export const OPCIONS_QUIEN = ["jo", "familia", "contractada"] as const;

export type Pisos = (typeof OPCIONS_PISOS)[number];
export type Donde = (typeof OPCIONS_DONDE)[number];
export type Eina = (typeof OPCIONS_USAS)[number];
export type Horas = (typeof OPCIONS_HORAS)[number];
export type Quien = (typeof OPCIONS_QUIEN)[number];

export type Respostes = {
  pisos: Pisos;
  donde: Donde;
  usas: Eina[];
  horas: Horas;
  quien: Quien;
};

/** Hores a la setmana amb què es fa el compte (el punt mig de cada resposta). */
export const HORES_SETMANA: Record<Horas, number> = { "<2": 1.5, "2-5": 3.5, "5-10": 7.5, "10+": 12 };

/** El nombre de pisos amb què es fa el compte, per a cada resposta. */
const PISOS_COMPTE: Record<Pisos, number> = { "1": 1, "2-4": 3, "5-15": 8, "15+": 16 };
// Preus per pis i mes, a la baixa: Chekin des de 3,95 € (web de Chekin, octubre 2026), un channel
// manager ~20 € (Smoobu, 29 € per a 1 pis, baixa amb volum), PriceLabs ~20 €.
export const PREU_EINA: Partial<Record<Eina, number>> = { checkin: 4, canales: 20, precios: 20 };
export const PREU_HOSTLY = 40;
export const PREU_HOSTLY_VOLUM = 35;

export type Resultat = {
  pisos: number;
  /** Euros al mes que paga avui en eines que Hostly substitueix. */
  avui: number;
  /** Euros al mes amb Hostly; `null` = més de 15 pisos, preu a mida. */
  hostly: number | null;
  /** Les eines que compten, amb el que costen al mes (tots els pisos). */
  eines: { eina: Eina; perPis: number; total: number }[];
  /** Euros al mes que s'estalvia en eines (només si Hostly surt més barat). */
  estalvi: number | null;
  /** El que costa Hostly per cada hora al mes que avui hi dedica. */
  perHora: number | null;
};

export function calcula(r: Respostes): Resultat {
  const pisos = PISOS_COMPTE[r.pisos];
  const eines = r.usas
    .filter((e) => PREU_EINA[e] != null)
    .map((eina) => ({ eina, perPis: PREU_EINA[eina]!, total: PREU_EINA[eina]! * pisos }));
  const avui = eines.reduce((s, e) => s + e.total, 0);
  const hostly = r.pisos === "15+" ? null : pisos * (pisos >= 5 ? PREU_HOSTLY_VOLUM : PREU_HOSTLY);
  const horesMes = HORES_SETMANA[r.horas] * 4.33;
  const estalvi = hostly != null && avui > hostly ? avui - hostly : null;
  const perHora = hostly != null && estalvi == null ? Math.max(1, Math.round(hostly / horesMes)) : null;
  return { pisos, avui, hostly, eines, estalvi, perHora };
}

/** El que es desa al contacte (claus estables, llegibles al Telegram del Biel). */
export function respostesPerDesar(r: Respostes, res: Resultat): Record<string, string | number> {
  return {
    pisos: r.pisos,
    donde: r.donde,
    usas: r.usas.join(",") || "nada",
    horas: r.horas,
    quien: r.quien,
    avui_eur_mes: res.avui,
    hostly_eur_mes: res.hostly ?? "a mida",
  };
}

export function euros(n: number, lang: string): string {
  return new Intl.NumberFormat(lang === "ca" ? "ca-ES" : "es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
  }).format(n);
}
