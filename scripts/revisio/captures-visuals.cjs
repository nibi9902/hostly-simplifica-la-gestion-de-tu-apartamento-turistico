// Captures senceres, a trossos de 1,4 pantalles, d'un exemple de cada plantilla de pàgina.
// node captura-trossos-pagines.cjs <carpeta>
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
const BASE = process.env.REVISIO_BASE || 'http://127.0.0.1:8094';
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const RUTES = [
  '/es', '/ca', '/es/empezar', '/es/calcula', '/es/precios', '/es/funcionalidades', '/es/funcionalidades/check-in-online',
  '/ca/funcionalidades/conecta-todo', '/es/alternativas', '/ca/alternativas/smoobu', '/es/comparativa/chekin', '/es/blog',
  '/es/blog/cuanto-cuesta-gestionar-piso-turistico', '/es/propietarios', '/es/gestores-pequenos', '/ca/hereus',
  '/es/sobre-hostly', '/es/guia', '/es/demo', '/es/terminos',
];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    await ctx.route('**/rest/v1/rpc/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
    await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: false, data: Date.now() })); } catch (e) {} });
    for (const r of RUTES) {
      const p = await ctx.newPage();
      await p.goto(BASE + r, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
      await p.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      // Baixar a poc a poc perquè apareguin les animacions d'entrada
      const alt = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < alt; y += 400) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(120); }
      await p.waitForTimeout(800);
      // Treure el capçal fix de les captures a trossos (tapa el contingut)
      await p.addStyleTag({ content: 'header{position:static!important} .fixed.top-0{position:absolute!important}' }).catch(() => {});
      const total = await p.evaluate(() => document.documentElement.scrollHeight);
      const tros = Math.round(h * 1.4);
      let i = 0;
      for (let y = 0; y < total && i < 14; y += tros, i++) {
        await p.evaluate((v) => window.scrollTo(0, v), y);
        await p.waitForTimeout(450);
        const nom = `${w}${r.replace(/\//g, '_')}-${String(i).padStart(2, '0')}.png`;
        await p.screenshot({ path: path.join(OUT, nom), clip: { x: 0, y, width: w, height: Math.min(tros, total - y) }, fullPage: true });
      }
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  console.log('fet', fs.readdirSync(OUT).length, 'captures');
})();
