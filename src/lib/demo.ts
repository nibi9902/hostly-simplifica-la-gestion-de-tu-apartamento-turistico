/**
 * Les hores que es poden triar per a la demo de 20 minuts.
 *
 * De moment és només el disseny (decisió del Biel, 09-10-2026: es farà amb Cal.com al
 * nostre servidor, però «de moment només fes el disseny»). L'hora triada es desa al
 * contacte (`web_leads.demo_slot`) i el Biel la confirma per WhatsApp. Quan hi hagi
 * Cal.com, aquesta llista sortirà de la seva disponibilitat real.
 *
 * Tot va en hora de Madrid, sigui on sigui el visitant: el client és a Espanya.
 */

const ZONA = "Europe/Madrid";
export const HORES_DEMO = ["10:00", "11:00", "12:00", "13:00", "16:00", "17:00", "18:00"] as const;
const DIES_MAX = 10;
const MARGE_MS = 2 * 60 * 60 * 1000; // com a mínim d'aquí a dues hores

export type DiaDemo = {
  /** `2026-10-15` (data de Madrid) */
  ymd: string;
  /** Les hores encara disponibles aquell dia. */
  hores: string[];
};

/** «+02:00» o «+01:00»: el desfasament de Madrid aquell dia (al migdia). */
function desfasMadrid(ymd: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: ZONA, timeZoneName: "longOffset" })
      .formatToParts(new Date(`${ymd}T12:00:00Z`));
    const tz = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    const m = tz.match(/GMT([+-]\d{2}):?(\d{2})?/);
    if (m) return `${m[1]}:${m[2] ?? "00"}`;
  } catch { /* navegador antic */ }
  return "+01:00";
}

/** L'instant exacte (ISO amb zona) d'una hora de Madrid. */
export function isoDemo(ymd: string, hora: string): string {
  return `${ymd}T${hora}:00${desfasMadrid(ymd)}`;
}

function ymdMadrid(d: Date): { ymd: string; diaSetmana: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ZONA, year: "numeric", month: "2-digit", day: "2-digit", weekday: "short",
  }).formatToParts(d);
  const v = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const dies: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return { ymd: `${v("year")}-${v("month")}-${v("day")}`, diaSetmana: dies[v("weekday")] ?? 0 };
}

/** Els propers dies laborables amb alguna hora lliure (de dilluns a divendres). */
export function diesDemo(ara: Date = new Date()): DiaDemo[] {
  const dies: DiaDemo[] = [];
  for (let i = 0; i < 21 && dies.length < DIES_MAX; i++) {
    const d = new Date(ara.getTime() + i * 24 * 60 * 60 * 1000);
    const { ymd, diaSetmana } = ymdMadrid(d);
    if (diaSetmana < 1 || diaSetmana > 5) continue;
    if (dies.some((x) => x.ymd === ymd)) continue;
    const hores = HORES_DEMO.filter((h) => new Date(isoDemo(ymd, h)).getTime() > ara.getTime() + MARGE_MS);
    if (hores.length) dies.push({ ymd, hores: [...hores] });
  }
  return dies;
}

function migdia(ymd: string): Date {
  return new Date(`${ymd}T12:00:00Z`);
}

/** «jue» + «15» per a la pastilla del dia. */
export function etiquetaDia(ymd: string, lang: string): { setmana: string; dia: string; mes: string } {
  const loc = lang === "ca" ? "ca-ES" : "es-ES";
  const d = migdia(ymd);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(loc, { timeZone: ZONA, ...o }).format(d);
  return {
    setmana: f({ weekday: "short" }).replace(".", ""),
    dia: f({ day: "numeric" }),
    mes: f({ month: "short" }).replace(".", ""),
  };
}

/** «jueves 15 de octubre» / «dijous 15 d’octubre» per a la confirmació. */
export function diaLlarg(ymd: string, lang: string): string {
  const loc = lang === "ca" ? "ca-ES" : "es-ES";
  const d = migdia(ymd);
  const setmana = new Intl.DateTimeFormat(loc, { timeZone: ZONA, weekday: "long" }).format(d);
  const diaMes = new Intl.DateTimeFormat(loc, { timeZone: ZONA, day: "numeric", month: "long" }).format(d);
  return `${setmana} ${diaMes}`;
}
