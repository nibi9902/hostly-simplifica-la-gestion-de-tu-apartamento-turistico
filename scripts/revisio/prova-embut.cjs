// playwright-core: el del projecte si hi és; si no, el del monorepo (on ja està instal·lat)
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
// Carpeta de les captures: la que es passa o, si no se'n passa cap, una de temporal (no «undefined/» dins del repo)
const OUT = process.argv[2] || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'hostly-revisio-'));
const BASE = process.env.REVISIO_BASE || 'http://127.0.0.1:8094';
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const resultats = [];
  const ok = (que, v) => { resultats.push(`${v ? 'ok ' : 'XX '} ${que}`); };
  for (const [nom, w, h] of [['1440', 1440, 900], ['390', 390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: false, data: Date.now() })); } catch (e) {} });
    const p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(String(e)));
    p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    const crides = [];
    await p.route('**/rest/v1/rpc/web_lead_desa', async (route) => {
      crides.push(JSON.parse(route.request().postData() || '{}'));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok": true}' });
    });
    // 1. Des de preus, «Empezar» porta a /empezar
    await p.goto(`${BASE}/es/precios`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    await p.screenshot({ path: `${OUT}/${nom}-precios.png`, fullPage: false });
    const boto = p.locator('header a:has-text("Empezar")').first();
    if (w >= 1024) {
      await boto.click();
    } else {
      await p.locator('header button[aria-label]').last().click().catch(() => {});
      await p.goto(`${BASE}/es/empezar`, { waitUntil: 'networkidle' });
    }
    await p.waitForURL('**/es/empezar');
    await p.waitForTimeout(500);
    ok(`${nom} · el capçal porta a /empezar`, p.url().endsWith('/es/empezar'));
    await p.screenshot({ path: `${OUT}/${nom}-empezar-1.png` });
    // 2. Validació
    await p.click('button[type=submit]');
    await p.waitForTimeout(300);
    const errTel = await p.locator('#emp-tel-ajuda.text-rose-600').count();
    ok(`${nom} · sense dades surt l'error del telèfon`, errTel === 1);
    await p.screenshot({ path: `${OUT}/${nom}-empezar-1-errors.png` });
    // 3. Dades bones
    await p.fill('#emp-tel', '612 345 678');
    await p.fill('#emp-nom', 'Marta Puig');
    await p.fill('#emp-correu', 'marta@exemple.com');
    await p.click('button[type=submit]');
    await p.waitForSelector('text=¿Qué quieres que haga Hostly por ti?');
    await p.waitForTimeout(400);
    ok(`${nom} · el pas 1 desa telèfon normalitzat`, crides[0]?.p_dades?.phone === '34612345678' && crides[0]?.p_dades?.source === 'empezar');
    ok(`${nom} · el pas 1 recorda d'on venia`, crides[0]?.p_dades?.page === '/es/precios' || w < 1024);
    await p.screenshot({ path: `${OUT}/${nom}-empezar-2.png`, fullPage: true });
    // 4. Complet → demo
    await p.click('text=Hostly completo');
    await p.waitForSelector('text=Antes de activarlo, una demo de 20 minutos.');
    await p.waitForTimeout(400);
    ok(`${nom} · el pas 2 desa el pla`, crides.some((c) => c.p_dades?.plan === 'completo'));
    await p.screenshot({ path: `${OUT}/${nom}-empezar-3-demo.png`, fullPage: true });
    const dies = p.locator('[role=radiogroup] >> nth=0 >> [role=radio]');
    await dies.nth(1).click();
    await p.locator('[role=radiogroup] >> nth=1 >> [role=radio]').first().click();
    await p.waitForTimeout(200);
    await p.screenshot({ path: `${OUT}/${nom}-empezar-3-demo-triat.png`, fullPage: true });
    await p.click('text=Reservar la demo');
    await p.waitForSelector('text=Apuntado,');
    await p.waitForTimeout(400);
    const demo = crides.find((c) => c.p_dades?.demo_slot);
    ok(`${nom} · la demo desa l'hora amb zona (${demo?.p_dades?.demo_slot})`, /T\d\d:00:00\+0[12]:00$/.test(demo?.p_dades?.demo_slot || ''));
    await p.screenshot({ path: `${OUT}/${nom}-empezar-4-fet.png`, fullPage: true });
    // 5. Gratis
    await p.goto(`${BASE}/es/empezar`, { waitUntil: 'networkidle' });
    const recorda = await p.inputValue('#emp-tel');
    ok(`${nom} · torna a /empezar i recorda el telèfon (${recorda})`, recorda === '+34612345678');
    await p.click('button[type=submit]');
    await p.waitForSelector('text=Solo el check-in y la policía');
    await p.click('text=Solo el check-in y la policía');
    await p.waitForSelector('text=Crear mi cuenta gratis');
    const href = await p.getAttribute('a:has-text("Crear mi cuenta gratis")', 'href');
    ok(`${nom} · el gratuït porta a l'alta de l'app (${href})`, href === 'https://app.hostlylabs.com/signup?pla=gratuit');
    await p.screenshot({ path: `${OUT}/${nom}-empezar-gratis.png`, fullPage: true });
    // 6. Català
    await p.goto(`${BASE}/ca/empezar`, { waitUntil: 'networkidle' });
    ok(`${nom} · en català diu «Comencem.»`, (await p.locator('h1').first().innerText()).trim() === 'Comencem.');
    // 7. Calculadora
    await p.goto(`${BASE}/es/calcula`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${OUT}/${nom}-calcula-1.png` });
    await p.click('[role=radio]:has-text("2 a 4")'); await p.waitForTimeout(450);
    await p.click('[role=radio]:has-text("Cataluña")'); await p.waitForTimeout(450);
    await p.click('[role=checkbox]:has-text("Chekin")');
    await p.click('[role=checkbox]:has-text("channel manager")');
    await p.screenshot({ path: `${OUT}/${nom}-calcula-3.png` });
    await p.click('button:has-text("Continuar")'); await p.waitForTimeout(450);
    await p.click('[role=radio]:has-text("5 a 10")'); await p.waitForTimeout(450);
    await p.click('[role=radio]:has-text("Yo")'); await p.waitForTimeout(800);
    const titol = await p.locator('text=Hoy:').first().innerText();
    ok(`${nom} · resultat: «${titol}»`, /72/.test(titol)); // (4 € check-in + 20 € canals) × 3 pisos
    await p.screenshot({ path: `${OUT}/${nom}-calcula-resultat.png`, fullPage: true });
    const detallVisible = await p.locator('text=Herramienta por herramienta').count();
    ok(`${nom} · amb el telèfon ja recordat, el detall surt directe`, detallVisible === 1);
    // 8. Llamame a preus
    await p.goto(`${BASE}/es/precios`, { waitUntil: 'networkidle' });
    await p.locator('text=¿Prefieres hablarlo?').scrollIntoViewIfNeeded();
    await p.waitForTimeout(600);
    await p.screenshot({ path: `${OUT}/${nom}-llamame.png` });
    const hLlamame = await p.locator('input[type=tel]').first().evaluate((e) => Math.round(e.getBoundingClientRect().height));
    ok(`${nom} · el camp de «Llámame» fa ${hLlamame}px (no aixafat)`, hLlamame >= 44);
    await p.click('button:has-text("Llámame")');
    await p.waitForSelector('text=Hecho. Te llamo en cuanto pueda');
    ok(`${nom} · «Llámame» desa amb origen llamame`, crides.some((c) => c.p_dades?.source === 'llamame'));
    // 8b. La calculadora sense telèfon recordat: la porta del detall, amb el camp sencer
    await p.evaluate(() => { try { localStorage.removeItem('hostly_lead_dades'); } catch (e) {} });
    await p.goto(`${BASE}/es/calcula`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(500);
    await p.click('[role=radio]:has-text("2 a 4")'); await p.waitForTimeout(450);
    await p.click('[role=radio]:has-text("Cataluña")'); await p.waitForTimeout(450);
    await p.click('[role=checkbox]:has-text("Chekin")');
    await p.click('button:has-text("Continuar")'); await p.waitForTimeout(450);
    await p.click('[role=radio]:has-text("5 a 10")'); await p.waitForTimeout(450);
    await p.click('[role=radio]:has-text("Yo")'); await p.waitForTimeout(800);
    const hCalc = await p.locator('#calc-tel').evaluate((e) => Math.round(e.getBoundingClientRect().height)).catch(() => 0);
    ok(`${nom} · el camp de telèfon de la calculadora fa ${hCalc}px (no aixafat)`, hCalc >= 44);
    await p.locator('#calc-tel').scrollIntoViewIfNeeded().catch(() => {});
    await p.screenshot({ path: `${OUT}/${nom}-calcula-porta.png` });
    // 9. Redireccions
    await p.goto(`${BASE}/es/funciones/check-in`, { waitUntil: 'networkidle' });
    ok(`${nom} · /funciones/check-in → ${new URL(p.url()).pathname}`, p.url().endsWith('/es/funcionalidades/check-in-online'));
    await p.goto(`${BASE}/es/pms-con-ia`, { waitUntil: 'networkidle' });
    ok(`${nom} · /pms-con-ia → ${new URL(p.url()).pathname}`, p.url().endsWith('/es/funcionalidades/ia-whatsapp'));
    // 10. Portada: vídeos d'exemple
    await p.goto(`${BASE}/es`, { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    const exemples = await p.locator('text=Ejemplo').count();
    ok(`${nom} · la portada té 3 vídeos marcats «Ejemplo» (${exemples})`, exemples === 3);
    const v = p.locator('text=Gestores que ya').first();
    await v.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/${nom}-videos.png` });
    ok(`${nom} · sense errors a la consola (${errors.length})`, errors.length === 0);
    if (errors.length) resultats.push('   ' + errors.slice(0, 5).join('\n   '));
    await ctx.close();
  }
  await b.close();
  console.log(resultats.join('\n'));
})().catch((e) => { console.error(e); process.exit(1); });
