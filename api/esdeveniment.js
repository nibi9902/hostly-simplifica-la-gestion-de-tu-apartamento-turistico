/**
 * L'API de conversions de Meta (14-10-2026, el Biel: «sí, fes l'API de conversions»).
 *
 * El web hi envia el mateix «Lead» o «Schedule» que envia el píxel, amb el mateix identificador
 * (`event_id`), i aquesta funció el passa a Meta des del servidor. Així Meta compta també els contactes
 * que el navegador no li deixa veure (bloquejadors, Safari), sense comptar-los dues vegades.
 *
 * - Només hi arriba qui ha acceptat les galetes de publicitat: ho decideix el web (`src/lib/seguiment.ts`).
 * - El telèfon, el correu i el nom arriben ja xifrats (SHA-256). Aquí no es veuen mai en clar.
 * - Variables d'entorn de Vercel:
 *     VITE_META_PIXEL_ID    el píxel (la mateixa que fa servir el web)
 *     META_CAPI_TOKEN       el testimoni d'accés de l'API de conversions (Events Manager)
 *     META_CAPI_TEST_CODE   opcional: el codi de «Probar eventos», per veure-ho arribar sense comptar-ho
 *   Sense el píxel o el testimoni, no fa res i contesta 204.
 */

const PIXEL = process.env.VITE_META_PIXEL_ID?.trim();
const TOKEN = process.env.META_CAPI_TOKEN?.trim();
const PROVA = process.env.META_CAPI_TEST_CODE?.trim();

const ESDEVENIMENTS = new Set(["Lead", "Schedule"]);
const XIFRAT = /^[a-f0-9]{64}$/;
// Només des del web: hostlylabs.com, les prèvies de Vercel i l'ordinador de proves
const ORIGENS = /^(https:\/\/(www\.)?hostlylabs\.com|https:\/\/[a-z0-9-]+\.vercel\.app|http:\/\/(127\.0\.0\.1|localhost)(:\d+)?)$/;

const xifrat = (v) => (typeof v === "string" && XIFRAT.test(v) ? [v] : undefined);
const text = (v, max) => (typeof v === "string" && v.length > 0 && v.length <= max ? v : undefined);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  const origen = req.headers.origin;
  if (origen && !ORIGENS.test(origen)) {
    res.status(403).end();
    return;
  }
  if (!PIXEL || !TOKEN) {
    res.status(204).end();
    return;
  }

  let cos = req.body;
  if (typeof cos === "string") {
    try {
      cos = JSON.parse(cos);
    } catch {
      cos = null;
    }
  }
  if (!cos || !ESDEVENIMENTS.has(cos.event_name) || !/^[\w-]{8,64}$/.test(cos.event_id || "")) {
    res.status(400).end();
    return;
  }

  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const dades = {
    data: [
      {
        event_name: cos.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: cos.event_id,
        action_source: "website",
        event_source_url: text(cos.url, 2000),
        user_data: {
          em: xifrat(cos.em),
          ph: xifrat(cos.ph),
          fn: xifrat(cos.fn),
          ln: xifrat(cos.ln),
          external_id: xifrat(cos.external_id),
          client_ip_address: ip || undefined,
          client_user_agent: text(req.headers["user-agent"], 1000),
          fbp: text(cos.fbp, 200),
          fbc: text(cos.fbc, 500),
        },
      },
    ],
    ...(PROVA ? { test_event_code: PROVA } : {}),
  };

  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${PIXEL}/events?access_token=${encodeURIComponent(TOKEN)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dades),
    });
    res.status(r.ok ? 204 : 502).end();
  } catch {
    res.status(502).end();
  }
}
