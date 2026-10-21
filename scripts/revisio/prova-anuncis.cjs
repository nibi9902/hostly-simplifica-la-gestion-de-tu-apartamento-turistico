/**
 * Prova de les landings dels anuncis (18-10-2026): /registro-de-viajeros-gratis i /hostly-completo.
 *
 * El recorregut sencer, al mòbil i a l'ordinador: el play, el formulari a sobre del vídeo (nom, telèfon i
 * pisos), els errors, el vídeo que es destapa amb so, el que es desa, el final del vídeo, la creu i, al
 * Completo, «Sí, llamadme». No desa res de debò: la crida a `web_lead_desa` s'intercepta (cap avís de
 * Telegram ni cap contacte de prova a la BD).
 *
 *   REVISIO_BASE=http://127.0.0.1:8097 node scripts/revisio/prova-anuncis.cjs [carpeta de captures]
 */
// playwright-core: el del projecte si hi és; si no, el del monorepo (on ja està instal·lat)
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
const OUT = process.argv[2] || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'hostly-anuncis-'));
const BASE = process.env.REVISIO_BASE || 'http://127.0.0.1:8094';

(async () => {
  const b = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=user-gesture-required'] });
  const resultats = [];
  const ok = (que, v) => { resultats.push(`${v ? 'ok ' : 'XX '} ${que}`); };

  for (const [nom, w, h] of [['390', 390, 844], ['1440', 1440, 900]]) {
    for (const pagina of ['registro-de-viajeros-gratis', 'hostly-completo']) {
      const completo = pagina === 'hostly-completo';
      const tag = `${nom} · ${completo ? 'completo' : 'check-in'}`;
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

      await p.goto(`${BASE}/es/${pagina}`, { waitUntil: 'networkidle' });
      await p.waitForSelector('.pt-ad-play');
      await p.waitForTimeout(500);
      const lead = await p.locator('.pt-ad-lead').innerText();
      ok(`${tag} · el subtítol és el de la A`, completo
        ? lead.startsWith('Hostly contesta a tus huéspedes, cuadra Airbnb y Booking')
        : lead === 'El huésped hace el check-in desde su móvil y Hostly lo envía a la policía cada día.');
      const h1 = (await p.locator('h1').innerText()).replace(/\s+/g, ' ');
      ok(`${tag} · el títol («${h1}»)`, completo
        ? h1 === 'Los mensajes, las limpiezas, la policía. Te olvidas.'
        : h1 === 'El registro de viajeros. Gratis.');
      ok(`${tag} · d'entrada, el play i cap formulari`, await p.locator('.pt-ad-play').isVisible() && !(await p.locator('.pt-ad-carta').isVisible()));
      const a0 = (await p.locator('.pt-ad-video').boundingBox()).height;
      const amplada = (await p.locator('.pt-ad-video').boundingBox()).width;
      ok(`${tag} · el vídeo, en 16:9 (${Math.round(amplada)}×${Math.round(a0)})`, Math.abs(a0 - (amplada * 9) / 16) < 2);
      const desborda = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      ok(`${tag} · res surt per la dreta`, !desborda);
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-1-play.png` });

      // 1. El play obre el formulari, i el vídeo creix
      await p.click('.pt-ad-play');
      await p.waitForTimeout(800);
      ok(`${tag} · el play obre el formulari`, await p.locator('.pt-ad-carta').isVisible() && !(await p.locator('.pt-ad-play').isVisible()));
      const a1 = (await p.locator('.pt-ad-video').boundingBox()).height;
      const carta = await p.locator('.pt-ad-carta').boundingBox();
      ok(`${tag} · el vídeo creix fins a la targeta (${Math.round(a0)} → ${Math.round(a1)})`, a1 > a0 && a1 >= carta.height + 20);
      ok(`${tag} · els pisos comencen a 1 i «−» no hi baixa`, (await p.inputValue('[id$="-pisos"]')) === '1' && await p.getByRole('button', { name: 'Un piso menos' }).isDisabled());
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-2-formulari.png` });

      // 2. La creu torna al play
      await p.getByRole('button', { name: 'Cerrar' }).click();
      await p.waitForTimeout(700);
      ok(`${tag} · la creu torna al play`, await p.locator('.pt-ad-play').isVisible() && !(await p.locator('.pt-ad-carta').isVisible()));
      await p.click('.pt-ad-play');
      await p.waitForTimeout(700);

      // 3. Sense dades: els errors
      await p.click('.pt-ad-enviar');
      await p.waitForTimeout(400);
      ok(`${tag} · sense dades, l'error del nom i el del telèfon`, (await p.locator('.pt-ad-error').count()) === 2);
      const a2 = (await p.locator('.pt-ad-video').boundingBox()).height;
      const carta2 = await p.locator('.pt-ad-carta').boundingBox();
      ok(`${tag} · amb els errors, la targeta continua cabent (${Math.round(carta2.height)} dins de ${Math.round(a2)})`, a2 >= carta2.height + 20);
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-3-errors.png` });

      // 4. Dades bones: el vídeo es destapa i sona
      await p.fill('[id$="-nom"]', 'Marta Puig');
      await p.fill('[id$="-tel"]', '612 345 678');
      await p.getByRole('button', { name: 'Un piso más' }).click();
      await p.getByRole('button', { name: 'Un piso más' }).click();
      await p.click('.pt-ad-enviar');
      await p.waitForTimeout(1500);
      const v = await p.evaluate(() => { const x = document.querySelector('.pt-ad-video video'); return { pausat: x.paused, mut: x.muted, controls: x.controls, t: x.currentTime }; });
      ok(`${tag} · en enviar, el vídeo es destapa i sona (pausat=${v.pausat}, mut=${v.mut}, controls=${v.controls})`, !v.pausat && !v.mut && v.controls);
      ok(`${tag} · el formulari se'n va`, !(await p.locator('.pt-ad-carta').isVisible()));
      const a3 = (await p.locator('.pt-ad-video').boundingBox()).height;
      ok(`${tag} · el vídeo torna al 16:9`, Math.abs(a3 - a0) < 2);
      const c = crides[0]?.p_dades ?? {};
      ok(`${tag} · desa nom, telèfon, pla i pisos (${c.name} · ${c.phone} · ${c.plan} · pisos=${c.answers?.pisos} · ${c.source})`,
        c.name === 'Marta Puig' && c.phone === '34612345678' && c.plan === (completo ? 'completo' : 'gratis') && c.answers?.pisos === 3 && c.source === 'empezar');
      ok(`${tag} · «Ve de» és la landing (${c.page})`, c.page === `/es/${pagina}`);
      const despres = await p.locator(completo ? '.pt-ad-truca' : '.pt-ad-despres').innerText();
      ok(`${tag} · a sota, la frase amb els seus pisos`, completo
        ? despres.includes('Gracias, Marta. ¿Te llamamos y dejamos tus 3 pisos listos contigo?')
        : despres.includes('Gracias, Marta. Para tus 3 pisos, también gratis'));
      if (!completo) {
        const href = await p.locator('.pt-ad-despres a').getAttribute('href');
        // Des del 21-10: l'alta porta el pla, l'idioma i, darrere de #, el que ja ha escrit
        ok(`${tag} · «Empieza gratis» porta a l'alta gratuïta amb les seves dades (${href})`,
          href === 'https://app.hostlylabs.com/signup?pla=gratuit&lang=es#nom=Marta+Puig&tel=34612345678');
      }
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-4-video.png` });
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-4-video-sencera.png`, fullPage: true });

      // 5. Quan s'acaba el vídeo, el pas següent a sobre
      await p.evaluate(() => { const x = document.querySelector('.pt-ad-video video'); x.currentTime = Math.max(0, x.duration - 0.3); });
      await p.waitForSelector('.pt-ad-fi', { timeout: 8000 }).catch(() => {});
      ok(`${tag} · quan s'acaba, surt el pas següent a sobre del vídeo`, await p.locator('.pt-ad-fi').isVisible());
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-5-final.png` });

      // 6. Completo: «Sí, llamadme» (o «Llamadme mañana» de nit)
      if (completo) {
        await p.locator('.pt-ad-truca button').first().click();
        await p.waitForSelector('.pt-ad-ok');
        const t = crides.find((x) => ['ara', 'demà'].includes(x.p_dades?.answers?.trucar))?.p_dades ?? {};
        ok(`${tag} · la trucada es desa com a /empezar (${t.answers?.trucar} · ${t.demo_slot ?? '—'})`, t.plan === 'completo' && !!t.demo_slot);
        ok(`${tag} · el número es llegeix bé (612 34 56 78)`, (await p.locator('.pt-ad-ok').innerText()).includes('612 34 56 78'));
        // El compte que es crea després de la trucada ja és del Completo (abans: un gratuït)
        const compte = await p.locator('.pt-ad-truca a').getAttribute('href');
        ok(`${tag} · «Crear mi cuenta» porta a l'alta del Completo (${compte})`,
          compte === 'https://app.hostlylabs.com/signup?pla=completo&lang=es#nom=Marta+Puig&tel=34612345678');
        await p.screenshot({ path: `${OUT}/${nom}-${pagina}-6-trucada.png` });
      }

      ok(`${tag} · cap error a la consola${errors.length ? ': ' + errors.slice(0, 3).join(' | ') : ''}`, errors.length === 0);
      await ctx.close();
    }
  }

  // En català: els textos i, al Completo, el vídeo en català
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  await p.goto(`${BASE}/ca/registro-de-viajeros-gratis`, { waitUntil: 'networkidle' });
  ok('ca · check-in · el subtítol en català', (await p.locator('.pt-ad-lead').innerText()) === 'L’hoste fa el check-in des del mòbil i Hostly l’envia a la policia cada dia.');
  await p.screenshot({ path: `${OUT}/ca-registro-1-play.png` });
  await p.goto(`${BASE}/ca/hostly-completo`, { waitUntil: 'networkidle' });
  const src = await p.locator('.pt-ad-video video').getAttribute('src');
  ok(`ca · completo · el vídeo en català (${src})`, src === '/assets/demo/el-que-fa-hostly.mp4');
  await p.click('.pt-ad-play');
  await p.waitForTimeout(700);
  await p.screenshot({ path: `${OUT}/ca-completo-2-formulari.png` });
  await ctx.close();

  await b.close();
  console.log(resultats.join('\n'));
  console.log(`\n${resultats.filter((r) => r.startsWith('XX')).length} fallades · captures a ${OUT}`);
})();
