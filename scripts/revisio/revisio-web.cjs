/**
 * Revisió automàtica de tot hostlylabs.com (redisseny d'octubre 2026).
 *   node revisio-web.cjs <carpeta-sortida> [base-url]
 * Per cada pàgina × idioma × amplada: errors, enllaços interns, desbordament al mòbil,
 * textos prohibits, claus de traducció a la vista, h1, imatges sense alt, captura.
 */
// playwright-core: el del projecte si hi és; si no, el del monorepo (on ja està instal·lat)
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const BASE = process.argv[3] || process.env.REVISIO_BASE || 'http://127.0.0.1:8094';
fs.mkdirSync(path.join(OUT, 'captures'), { recursive: true });

const BLOG = ['5-horas-semana-recuperar-apartamento-turistico', 'automatizar-alquiler-vacacional-con-ia', 'channel-manager-alquiler-vacacional-guia', 'checkin-digital-comparativa-espana', 'coordinacion-limpiezas-excel-sistema', 'cuanto-cuesta-gestionar-piso-turistico', 'gestor-pequeno-5-apps-una-app', 'hostify-vs-lodgify-vs-smoobu-comparativa', 'huesped-no-responde-checkin-online', 'pasar-3-a-10-apartamentos-sin-colapsar', 'pms-apartamentos-turisticos-mejores-2026', 'precios-dinamicos-airbnb-booking', 'registro-viajeros-mossos-esquadra-cataluna', 'responder-mensajes-airbnb-automaticamente', 'sanciones-por-no-cumplir-registro-viajeros', 'ses-hospedajes-guia-completa-2026', 'ses-hospedajes-un-solo-apartamento', 'ses-nrua-taxa-turistica-guia', 'stack-completo-propietario-airbnb', 'whatsapp-business-alquiler-vacacional'];
const ALTERNATIVES = ['icnea', 'hostify', 'lodgify', 'smoobu', 'hospitable', 'guesty', 'avantio'];
const FUNCIONS = ['ia-whatsapp', 'check-in-online', 'channel-manager', 'gestion-de-limpiezas', 'precios-dinamicos', 'mensajeria-programada', 'multi-rol', 'conecta-todo', 'finanzas', 'burocracia'];

const RUTES = [
  '', '/empezar', '/calcula', '/precios', '/demo', '/guia', '/comparativa/chekin',
  '/propietarios', '/gestores-pequenos', '/segunda-residencia', '/hereus',
  '/blog', ...BLOG.map((s) => `/blog/${s}`),
  '/alternativas', ...ALTERNATIVES.map((s) => `/alternativas/${s}`),
  '/funcionalidades', ...FUNCIONS.map((s) => `/funcionalidades/${s}`),
  '/sobre-hostly', '/privacidad', '/cookies', '/terminos', '/aviso-legal',
];
const SOLO_DESKTOP_BLOG = true;
// NOMES_RUTES=/alternativas,/blog/x → revisa només aquestes (iteració ràpida)
const NOMES_RUTES = process.env.NOMES_RUTES ? process.env.NOMES_RUTES.split(',') : null; // els articles, només a 1440 i a 390 (no cal res més)

// Patrons de rutes vàlides per validar enllaços interns
const VALIDES = [
  /^\/(es|ca)\/?$/, /^\/(es|ca)\/(empezar|calcula|precios|demo|guia|propietarios|gestores-pequenos|segunda-residencia|hereus|blog|alternativas|funcionalidades|sobre-hostly|privacidad|cookies|terminos|aviso-legal)\/?$/,
  /^\/(es|ca)\/comparativa\/chekin$/, new RegExp(`^/(es|ca)/blog/(${BLOG.join('|')})$`),
  new RegExp(`^/(es|ca)/alternativas/(${ALTERNATIVES.join('|')})$`), new RegExp(`^/(es|ca)/funcionalidades/(${FUNCIONS.join('|')})$`),
  /^\/i\//,
];

// Textos que no poden sortir enlloc (el que no és cert o ja no existeix)
const PROHIBITS = {
  comu: [/14 d[ií]as/i, /14 dies/i, /\b37 ?€/, /€ ?37\b/, /Superhog/i, /Akeero/i, /\b5 idiom(as|es)\b/i, /25 idiomas/i, /Evolution API|vía Evolution/i,
    /asesora|assessora/i, /coach personal/i, /revisión previa|revisió prèvia/i, /firma digital|signatura digital/i, /Probar 14|Provar 14/i,
    /los únicos en España|els únics a Espanya/i, /\{\{|\}\}/, /undefined|NaN €|\[object Object\]/,
    // Auditoria de textos del 09-10-2026: el que no és cert o no es pot defensar
    /Todo incluido|Tot inclòs|Sin módulos aparte|Sense mòduls a part/i, /180 €|~ ?120 €/, /Sin overbookings|Sense overbookings/i,
    /·\s*sin errores|·\s*sense errors/i, /De 6 suscripciones|De 6 subscripcions|seis herramientas|sis eines/i,
    /motor de reservas con|motor de reserves amb/i, /Setup guia|Onboarding/i, /ibéric|ibèric/i,
    /Cumples con la normativa sin|Compleixes la normativa sense/i, /te llamo hoy\.|et truco avui\./i],
  // Afirmacions que només són correctes com a informació general (blog, guia, comparatives)
  hostly: [/Ertzaintza/i, /parte de viajeros|part de viatgers/i, /SES enviado|SES enviat/i, /trimestr/i, /Sin burocracia|Sense burocràcia/i, /NRUA/i, /Beds24/i, /\bStarter\b|\bAgency\b/],
  // Paraules que només existeixen en l'altra llengua (amb límits Unicode: \b de JS no entén «ò»)
  es: [/\bneteg?(es|ja)\b/i, /\bComençar\b/,
    /(?<![\p{L}/.])(escrivint|automàticament|enviat|nits?|mig|amb|però|perquè|també|només|avui|demà|hostes?|missatges?|setmana|gràcies|això|aquesta?|pagaments?|configuració)(?![\p{L}])/iu],
  ca: [/\bEmpezar\b/, /\bPrecios\b(?!\s*din)/, /\bSin tarjeta\b/,
    /(?<![\p{L}/.])(también|pero|porque|mañana|noches?|huésped(es)?|limpiezas?|mensajes?|semana|gracias|está|más|hasta|días|piso|automáticamente|enviados?|escribiendo|ahora|nuestr[oa]s?|usted|tarjeta|puedes|reservas|precios?)(?![\p{L}])/iu],
};
const CLAU_I18N = /\b(?:hero|pain|steps|pricing|faq|final_cta|glass_cards|testimonials|support|empezar|calcula|llamame|page|index|nav|footer|galetes|aviso|privacidad|cookies|terminos)\.[a-z_]+(?:\.[a-z_]+)*\b/;

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const resultats = [];
  const enllacosDolents = new Map();
  for (const amplada of [1440, 390]) {
    const ctx = await b.newContext({ viewport: { width: amplada, height: amplada === 390 ? 844 : 900 } });
    // Cap petició real a la BD des de la revisió (no volem contactes de prova)
    await ctx.route('**/rest/v1/rpc/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
    // El bàner de galetes es respon abans: que no tapi les captures
    await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: false, data: Date.now() })); } catch (e) {} });
    for (const lang of ['es', 'ca']) {
      for (const ruta of (NOMES_RUTES || RUTES)) {
        const url = `${BASE}/${lang}${ruta}`;
        const p = await ctx.newPage();
        const errors = [];
        const fallades = [];
        p.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)));
        p.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
        p.on('response', (r) => { const u = r.url(); if (u.startsWith(BASE) && r.status() >= 400) fallades.push(`${r.status()} ${u.replace(BASE, '')}`); });
        let ok = true;
        try {
          await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
        } catch (e) { ok = false; errors.push('goto: ' + String(e).slice(0, 160)); }
        await p.waitForTimeout(ruta === '' ? 3500 : 900);
        // Baixar per activar les animacions «whileInView»
        const alt = await p.evaluate(() => document.documentElement.scrollHeight).catch(() => 0);
        for (let y = 0; y < alt; y += 700) { await p.evaluate((v) => window.scrollTo(0, v), y).catch(() => {}); await p.waitForTimeout(90); }
        await p.waitForTimeout(500);
        const info = await p.evaluate(() => {
          const visibles = (sel) => Array.from(document.querySelectorAll(sel)).filter((e) => e.offsetParent !== null || getComputedStyle(e).position === 'fixed');
          const text = document.body.innerText || '';
          const h1 = visibles('h1').length;
          const imgsSenseAlt = Array.from(document.querySelectorAll('img')).filter((i) => !i.hasAttribute('alt')).map((i) => i.src.slice(-60));
          const desborda = document.documentElement.scrollWidth - window.innerWidth;
          const culpables = desborda > 1 ? Array.from(document.querySelectorAll('body *')).filter((e) => { const r = e.getBoundingClientRect(); return r.right > window.innerWidth + 2 && r.width > 0 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 4).map((e) => `${e.tagName.toLowerCase()}.${String(e.className).split(' ').slice(0, 3).join('.')}`) : [];
          const enllacos = Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')).filter((h) => h && h.startsWith('/'));
          const ctas = Array.from(document.querySelectorAll('a, button')).filter((e) => e.offsetParent !== null).map((e) => (e.innerText || '').trim()).filter(Boolean);
          const titol = document.title;
          const descripcio = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
          // Camps aixafats (p. ex. flex-1 dins d'una columna: el h-12 no mana)
          const campsBaixos = Array.from(document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), textarea, select'))
            .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 32; })
            .map((e) => `${e.id || e.name || e.type} ${Math.round(e.getBoundingClientRect().height)}px`);
          // Tot el text, també el de les vistes amagades de les demos (per l'idioma)
          const arrel = document.querySelector('main') || document.body;
          const tw = document.createTreeWalker(arrel, NodeFilter.SHOW_TEXT);
          const trossos = []; while (tw.nextNode()) { const v = tw.currentNode.nodeValue.trim(); if (v) trossos.push(v); }
          const textTot = trossos.join(' ');
          // SEO: una sola descripció i una sola canònica, i l'idioma de la pàgina al <html>
          const seo = {
            descs: document.querySelectorAll('meta[name="description"]').length,
            canons: Array.from(document.querySelectorAll('link[rel="canonical"]')).map((l) => l.getAttribute('href')),
            ogds: document.querySelectorAll('meta[property="og:description"]').length,
            htmlLang: document.documentElement.lang,
          };
          return { text, textTot, h1, imgsSenseAlt, desborda, culpables, enllacos, titol, descripcio, final: location.pathname, ctas, campsBaixos, seo };
        }).catch((e) => ({ text: '', h1: 0, imgsSenseAlt: [], desborda: 0, culpables: [], enllacos: [], titol: '', descripcio: '', final: '', err: String(e) }));
        const problemes = [];
        if (!ok) problemes.push('no carrega');
        if (errors.length) problemes.push(...errors.slice(0, 4));
        if (fallades.length) problemes.push('recursos fallits: ' + fallades.slice(0, 4).join(', '));
        if (info.h1 !== 1) problemes.push(`h1 visibles: ${info.h1}`);
        if (info.desborda > 1) problemes.push(`desborda ${info.desborda}px per la dreta: ${info.culpables.join(' · ')}`);
        if (info.imgsSenseAlt.length) problemes.push(`imatges sense alt: ${info.imgsSenseAlt.length}`);
        if (info.campsBaixos && info.campsBaixos.length) problemes.push(`camps aixafats: ${info.campsBaixos.join(', ')}`);
        if (info.seo) {
          const esArticle = /^\/blog\/./.test(ruta);
          const canonEsperada = `https://hostlylabs.com/${esArticle ? 'es' : lang}${ruta}`;
          if (info.seo.descs !== 1) problemes.push(`SEO: ${info.seo.descs} meta description`);
          if (info.seo.ogds !== 1) problemes.push(`SEO: ${info.seo.ogds} og:description`);
          if (info.seo.canons.length !== 1 || info.seo.canons[0] !== canonEsperada) problemes.push(`SEO: canònica ${JSON.stringify(info.seo.canons)} (esperada ${canonEsperada})`);
          const langEsperat = esArticle ? 'es' : lang;
          if (info.seo.htmlLang !== langEsperat) problemes.push(`SEO: <html lang="${info.seo.htmlLang}"> (esperat ${langEsperat})`);
        }
        const esArticleLegal = /^\/(blog|guia|comparativa|alternativas)/.test(ruta);
        const nomesCastella = lang === 'ca' && /^\/(blog\/|alternativas\/)/.test(ruta); // contingut només en castellà, amb avís
        for (const re of PROHIBITS.comu) { const m = info.text.match(re); if (m) problemes.push(`text prohibit «${m[0]}»: …${info.text.slice(Math.max(0, m.index - 50), m.index + 60).replace(/\s+/g, ' ')}…`); }
        if (!esArticleLegal) for (const re of PROHIBITS.hostly) { const m = info.text.match(re); if (m) problemes.push(`afirmació a revisar «${m[0]}»: …${info.text.slice(Math.max(0, m.index - 50), m.index + 60).replace(/\s+/g, ' ')}…`); }
        const textIdioma = info.textTot || info.text;
        for (const re of (nomesCastella ? [] : PROHIBITS[lang])) { const m = textIdioma.match(re); if (m) problemes.push(`idioma barrejat «${m[0]}»: …${textIdioma.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, ' ')}…`); }
        for (const c of (info.ctas || [])) {
          if (/Empezar gratis|Començar gratis|Crear cuenta|Crear compte|^Probar|^Provar|Hablar con ventas|Parlar amb vendes|Agendar/i.test(c)) problemes.push(`botó amb etiqueta vella: «${c.slice(0, 60)}»`);
        }
        const k = info.text.match(CLAU_I18N); if (k) problemes.push(`clau de traducció a la vista: ${k[0]}`);
        if (!info.titol || info.titol.length < 10) problemes.push(`títol de pestanya buit o curt: «${info.titol}»`);
        if (!info.descripcio) problemes.push('sense meta description');
        for (const h of new Set(info.enllacos)) {
          const net = h.split('#')[0].split('?')[0].replace(/\/$/, '') || '/';
          if (!VALIDES.some((re) => re.test(net)) && !/\.(pdf|png|jpg|webp|svg|xml|txt|html)$/.test(net)) {
            enllacosDolents.set(h, (enllacosDolents.get(h) || new Set()).add(`/${lang}${ruta}`));
          }
        }
        const nom = `${amplada}-${lang}${(ruta || '-portada').replace(/\//g, '_')}`;
        if (!(esArticleLegal && SOLO_DESKTOP_BLOG && lang === 'ca')) {
          await p.screenshot({ path: path.join(OUT, 'captures', `${nom}.png`) }).catch(() => {});
        }
        resultats.push({ amplada, lang, ruta: ruta || '/', final: info.final, alcada: alt, problemes });
        process.stdout.write(problemes.length ? 'x' : '.');
        await p.close();
      }
    }
    await ctx.close();
  }
  await b.close();
  const resum = {
    data: new Date().toISOString(),
    pagines: resultats.length,
    ambProblemes: resultats.filter((r) => r.problemes.length).length,
    resultats,
    enllacosDolents: Array.from(enllacosDolents.entries()).map(([href, on]) => ({ href, on: Array.from(on).slice(0, 5) })),
  };
  fs.writeFileSync(path.join(OUT, 'resum.json'), JSON.stringify(resum, null, 2));
  console.log(`\n${resum.pagines} pàgines · ${resum.ambProblemes} amb problemes · ${resum.enllacosDolents.length} enllaços interns dubtosos`);
})().catch((e) => { console.error(e); process.exit(1); });
