/**
 * Prova de la secció «Lo que reemplaza» (pestanyes + tira).
 *   node prova-reemplaza.cjs <carpeta> [base-url]
 * Comprova: 6 pestanyes, la de davant canvia sola, clicar atura, el teclat mou,
 * al mòbil es llisca, l'alçada no salta i no hi ha errors.
 */
// playwright-core: el del projecte si hi és; si no, el del monorepo (on ja està instal·lat)
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
const fs = require('fs');
const path = require('path');

// Carpeta de les captures: la que es passa o, si no se'n passa cap, una de temporal (no «undefined/» dins del repo)
const OUT = process.argv[2] || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'hostly-revisio-'));
const BASE = process.argv[3] || process.env.REVISIO_BASE || 'http://127.0.0.1:8094';
fs.mkdirSync(OUT, { recursive: true });

let ok = 0, ko = 0;
function check(nom, cond, detall = '') {
  if (cond) { ok++; console.log(`ok  ${nom}`); } else { ko++; console.log(`KO  ${nom} ${detall}`); }
}

async function estat(p) {
  return p.evaluate(() => {
    const tabs = [...document.querySelectorAll('#funciones [role=tab]')];
    const tira = document.querySelector('.glass-tira');
    return {
      tabs: tabs.map((t) => t.textContent.trim()),
      actiu: tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true'),
      scroll: tira ? Math.round(tira.scrollLeft) : -1,
      ample: tira ? tira.clientWidth : 0,
      alcada: tira ? Math.round(tira.getBoundingClientRect().height) : 0,
      seccio: Math.round(document.querySelector('#funciones').getBoundingClientRect().height),
      pagina: document.documentElement.scrollHeight,
      desborda: document.documentElement.scrollWidth > window.innerWidth + 1,
      inerts: [...document.querySelectorAll('#funciones [role=tabpanel] > [inert]')].length,
    };
  });
}

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  for (const [amplada, alcada] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: amplada, height: alcada }, hasTouch: amplada < 768, isMobile: amplada < 768 });
    await ctx.route('**/rest/v1/rpc/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
    await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: false, data: Date.now() })); } catch (e) {} });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await p.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
    const tag = `${amplada}`;

    // Fins a la secció
    await p.evaluate(() => document.querySelector('#features').scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(1200);
    let e0 = await estat(p);
    check(`${tag} 6 pestanyes`, e0.tabs.length === 6, JSON.stringify(e0.tabs));
    check(`${tag} comença per la primera`, e0.actiu === 0, `actiu=${e0.actiu}`);
    check(`${tag} 5 targetes inerts`, e0.inerts === 5, `inerts=${e0.inerts}`);
    check(`${tag} sense desbordament`, !e0.desborda);
    await p.screenshot({ path: path.join(OUT, `${tag}-1-inici.png`) });

    // Avança sola (8 s per targeta)
    await p.waitForTimeout(9000);
    const e1 = await estat(p);
    check(`${tag} avança sola`, e1.actiu === 1, `actiu=${e1.actiu}`);
    check(`${tag} la tira s'ha mogut`, e1.scroll > 0, `scroll=${e1.scroll}`);
    check(`${tag} l'alçada no salta`, Math.abs(e1.alcada - e0.alcada) <= 2, `${e0.alcada} → ${e1.alcada}`);
    await p.screenshot({ path: path.join(OUT, `${tag}-2-sola.png`) });

    if (amplada >= 768) {
      // Clicar una pestanya: hi va i s'atura
      await p.click('#funciones [role=tab] >> nth=4');
      await p.waitForTimeout(1200);
      const e2 = await estat(p);
      check(`${tag} clic porta a la 5a`, e2.actiu === 4, `actiu=${e2.actiu}`);
      await p.screenshot({ path: path.join(OUT, `${tag}-3-clic.png`) });
      await p.waitForTimeout(9000);
      const e3 = await estat(p);
      check(`${tag} després de clicar no avança`, e3.actiu === 4, `actiu=${e3.actiu}`);
      // Teclat
      await p.focus('#funciones [role=tab][aria-selected=true]');
      await p.keyboard.press('ArrowRight');
      await p.waitForTimeout(1000);
      const e4 = await estat(p);
      check(`${tag} fletxa dreta → 6a`, e4.actiu === 5, `actiu=${e4.actiu}`);
      await p.keyboard.press('Home');
      await p.waitForTimeout(2500);
      const e5 = await estat(p);
      check(`${tag} Inici → 1a`, e5.actiu === 0 && e5.scroll < 5, `actiu=${e5.actiu} scroll=${e5.scroll}`);
      // La pàgina no s'ha mogut en vertical per culpa de la tira
      const y = await p.evaluate(() => Math.round(document.querySelector('#features').getBoundingClientRect().top));
      check(`${tag} la pàgina no salta`, Math.abs(y) < 40, `top=${y}`);
    } else {
      // Mòbil: lliscar amb el dit a la següent (gest de pantalla tàctil de debò)
      const caixa = await p.locator('.glass-tira').boundingBox();
      const cdp = await ctx.newCDPSession(p);
      const yy = Math.min(caixa.y + 160, 700);
      const abans = (await estat(p)).actiu;
      await cdp.send('Input.synthesizeScrollGesture', { x: 300, y: yy, xDistance: -240, yDistance: 0, gestureSourceType: 'touch', speed: 900 });
      await p.waitForTimeout(1500);
      const e2 = await estat(p);
      check(`${tag} lliscar passa a la següent`, e2.actiu === abans + 1, `actiu=${e2.actiu} scroll=${e2.scroll}`);
      await p.screenshot({ path: path.join(OUT, `${tag}-3-llisca.png`) });
      await p.waitForTimeout(9000);
      const e3 = await estat(p);
      check(`${tag} després de lliscar no avança`, e3.actiu === e2.actiu, `actiu=${e3.actiu}`);
      // Tocar una pestanya
      await p.tap('#funciones [role=tab] >> nth=5');
      await p.waitForTimeout(1500);
      const e4 = await estat(p);
      check(`${tag} tocar pestanya → 6a`, e4.actiu === 5, `actiu=${e4.actiu}`);
      await p.screenshot({ path: path.join(OUT, `${tag}-4-ultima.png`) });
    }
    const final = await estat(p);
    console.log(`   ${tag}: secció ${final.seccio}px · pàgina ${final.pagina}px`);
    check(`${tag} cap error`, errors.length === 0, errors.slice(0, 3).join(' | '));
    await ctx.close();
  }
  console.log(`\n${ok} ok · ${ko} KO`);
  await b.close();
  process.exit(ko ? 1 : 0);
})();
