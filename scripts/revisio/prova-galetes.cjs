// playwright-core: el del projecte si hi és; si no, el del monorepo (on ja està instal·lat)
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const r = [];
  const ok = (q, v) => r.push(`${v ? 'ok ' : 'XX '} ${q}`);
  for (const decisio of ['Rechazar', 'Aceptar']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    const ga = [];
    p.on('request', (q) => { if (/googletagmanager|google-analytics/.test(q.url())) ga.push(q.url()); });
    await p.goto((process.env.REVISIO_BASE || 'http://127.0.0.1:8094') + '/es/precios', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1800);
    ok(`[${decisio}] el bàner surt`, await p.locator('[role=dialog]:has-text("cookies analíticas")').count() === 1);
    ok(`[${decisio}] abans de respondre, cap petició a Google (${ga.length})`, ga.length === 0);
    if (decisio === 'Rechazar') await p.screenshot({ path: process.argv[2] + '/galetes-banner.png' });
    await p.click(`[role=dialog] button:has-text("${decisio}")`);
    await p.waitForTimeout(1500);
    ok(`[${decisio}] el bàner marxa`, await p.locator('[role=dialog]:has-text("cookies analíticas")').count() === 0);
    ok(`[${decisio}] Google: ${ga.length} peticions`, decisio === 'Aceptar' ? ga.length > 0 : ga.length === 0);
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(1800);
    ok(`[${decisio}] en tornar, no es torna a preguntar`, await p.locator('[role=dialog]:has-text("cookies analíticas")').count() === 0);
    await p.goto((process.env.REVISIO_BASE || 'http://127.0.0.1:8094') + '/es/cookies', { waitUntil: 'networkidle' });
    await p.click('button:has-text("Cambiar mis preferencias")');
    await p.waitForTimeout(600);
    ok(`[${decisio}] «Cambiar mis preferencias» torna a preguntar`, await p.locator('[role=dialog]:has-text("cookies analíticas")').count() === 1);
    await ctx.close();
  }
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto((process.env.REVISIO_BASE || 'http://127.0.0.1:8094') + '/es/aviso-legal', { waitUntil: 'networkidle' });
  const txt = await p.locator('main').innerText();
  ok(`avís legal amb titular i NIF`, txt.includes('Biel Alsina') && txt.includes('40456798M'));
  await p.goto((process.env.REVISIO_BASE || 'http://127.0.0.1:8094') + '/es/terminos', { waitUntil: 'networkidle' });
  const tt = await p.locator('main').innerText();
  ok(`termes: 35 € i referits, sense 37 €`, tt.includes('35 €/mes') && tt.includes('Programa de referidos') && !tt.includes('37 €'));
  await b.close();
  console.log(r.join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
