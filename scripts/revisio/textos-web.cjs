/**
 * Treu el text visible de cada pàgina del web (per revisar-ne la coherència).
 *   node textos-web.cjs <fitxer-sortida.md> [idioma=es] [base-url]
 * Una secció per pàgina: títol de la pestanya, meta description i el text del <main>
 * (o del body si no n'hi ha), sense capçalera ni peu repetits.
 */
// playwright-core: el del projecte si hi és; si no, el del monorepo (on ja està instal·lat)
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
const fs = require('fs');

// Carpeta de les captures: la que es passa o, si no se'n passa cap, una de temporal (no «undefined/» dins del repo)
const OUT = process.argv[2] || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'hostly-revisio-'));
const LANG = process.argv[3] || 'es';
const BASE = process.argv[4] || process.env.REVISIO_BASE || 'http://127.0.0.1:8094';

const BLOG = ['5-horas-semana-recuperar-apartamento-turistico', 'automatizar-alquiler-vacacional-con-ia', 'channel-manager-alquiler-vacacional-guia', 'checkin-digital-comparativa-espana', 'coordinacion-limpiezas-excel-sistema', 'cuanto-cuesta-gestionar-piso-turistico', 'gestor-pequeno-5-apps-una-app', 'hostify-vs-lodgify-vs-smoobu-comparativa', 'huesped-no-responde-checkin-online', 'pasar-3-a-10-apartamentos-sin-colapsar', 'pms-apartamentos-turisticos-mejores-2026', 'precios-dinamicos-airbnb-booking', 'registro-viajeros-mossos-esquadra-cataluna', 'responder-mensajes-airbnb-automaticamente', 'sanciones-por-no-cumplir-registro-viajeros', 'ses-hospedajes-guia-completa-2026', 'ses-hospedajes-un-solo-apartamento', 'ses-nrua-taxa-turistica-guia', 'stack-completo-propietario-airbnb', 'whatsapp-business-alquiler-vacacional'];
const ALTERNATIVES = ['icnea', 'hostify', 'lodgify', 'smoobu', 'hospitable', 'guesty', 'avantio'];
const FUNCIONS = ['ia-whatsapp', 'check-in-online', 'channel-manager', 'gestion-de-limpiezas', 'precios-dinamicos', 'mensajeria-programada', 'multi-rol', 'conecta-todo', 'finanzas', 'burocracia'];
const RUTES = [
  '', '/empezar', '/calcula', '/precios', '/demo', '/guia', '/comparativa/chekin',
  '/propietarios', '/gestores-pequenos', '/segunda-residencia', '/hereus',
  '/funcionalidades', ...FUNCIONS.map((s) => `/funcionalidades/${s}`),
  '/alternativas', ...ALTERNATIVES.map((s) => `/alternativas/${s}`),
  '/blog', ...BLOG.map((s) => `/blog/${s}`),
  '/sobre-hostly', '/privacidad', '/cookies', '/terminos', '/aviso-legal',
];

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route('**/rest/v1/rpc/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: false, data: Date.now() })); } catch (e) {} });
  const p = await ctx.newPage();
  const parts = [];
  for (const r of RUTES) {
    const url = `${BASE}/${LANG}${r}`;
    await p.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
    // Baixa fins al final perquè es pintin les seccions que apareixen en fer scroll
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((res) => setTimeout(res, 60)); }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(400);
    const d = await p.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      const clon = main.cloneNode(true);
      clon.querySelectorAll('script, style, noscript, svg, header, footer, nav').forEach((n) => n.remove());
      // Un tros per node de text, separats: si no, «NetegesLimpieza» amaga les paraules
      const tw = document.createTreeWalker(clon, NodeFilter.SHOW_TEXT);
      const trossos = []; while (tw.nextNode()) { const v = tw.currentNode.nodeValue.replace(/\s+/g, ' ').trim(); if (v) trossos.push(v); }
      const text = trossos.join(' · ');
      const desc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      return { title: document.title, desc, text };
    });
    parts.push(`\n\n========== ${url}\nTÍTOL: ${d.title}\nDESCRIPCIÓ: ${d.desc}\n\n${d.text}`);
    process.stdout.write('.');
  }
  // Capçalera i peu, un sol cop
  await p.goto(`${BASE}/${LANG}`, { waitUntil: 'networkidle' }).catch(() => {});
  const comu = await p.evaluate(() => {
    const h = document.querySelector('header')?.innerText || '';
    const f = document.querySelector('footer')?.innerText || '';
    return `CAPÇALERA:\n${h}\n\nPEU:\n${f}`;
  });
  fs.writeFileSync(OUT, `# Textos del web (${LANG})\n\n${comu}${parts.join('')}\n`);
  console.log(`\n${RUTES.length} pàgines → ${OUT}`);
  await b.close();
})();
