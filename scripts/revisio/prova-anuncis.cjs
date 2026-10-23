/**
 * Prova de les landings dels anuncis: /registro-de-viajeros-gratis i /hostly-completo (18-10-2026; refeta el
 * 23-10-2026, quan el formulari va sortir del vídeo cap a una finestra).
 *
 * El recorregut sencer, al mòbil (390) i a l'ordinador (1440): el play obre el formulari (al mòbil, una pantalla
 * sencera amb el nom i el telèfon a dalt; a l'ordinador, un diàleg) sense moure la pàgina; la creu i el gest
 * d'enrere el tanquen sense sortir de la pàgina; el que s'havia escrit no es perd; els errors; els pisos amb «−» i
 * «+» (i mantenint premut); en enviar, el vídeo comença amb so; el que es desa; el final del vídeo, amb el botó del
 * pas següent i, al Completo, «Sí, llamadme». No desa res de debò: la crida a `web_lead_desa` s'intercepta (cap avís de Telegram ni cap
 * contacte de prova a la BD).
 *
 *   REVISIO_BASE=http://127.0.0.1:8097 node scripts/revisio/prova-anuncis.cjs [carpeta de captures]
 */
// playwright-core: el del projecte si hi és; si no, el del monorepo (on ja està instal·lat)
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
const OUT = process.argv[2] || require('fs').mkdtempSync(require('path').join(require('os').tmpdir(), 'hostly-anuncis-'));
const BASE = process.env.REVISIO_BASE || 'http://127.0.0.1:8094';

// Si el vídeo s'ha posat a pantalla completa (el mòbil que no és iPhone), se'n surt, com faria la persona
const surtDePantallaCompleta = (p) => p.evaluate(() => { if (document.fullscreenElement) return document.exitFullscreen().catch(() => {}); });

(async () => {
  const b = await chromium.launch({ channel: 'chrome', args: ['--autoplay-policy=user-gesture-required'] });
  const resultats = [];
  const ok = (que, v) => { resultats.push(`${v ? 'ok ' : 'XX '} ${que}`); };

  for (const [nom, w, h] of [['390', 390, 844], ['1440', 1440, 900]]) {
    for (const pagina of ['registro-de-viajeros-gratis', 'hostly-completo']) {
      const completo = pagina === 'hostly-completo';
      const mobil = w < 768;
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
      ok(`${tag} · d'entrada, el play i cap finestra`, await p.locator('.pt-ad-play').isVisible() && !(await p.locator('.pt-ad-finestra').count()));
      const caixa = await p.locator('.pt-ad-video').boundingBox();
      ok(`${tag} · el vídeo, en 16:9 (${Math.round(caixa.width)}×${Math.round(caixa.height)})`, Math.abs(caixa.height - (caixa.width * 9) / 16) < 2);
      // Al mòbil, d'una vora a l'altra de la pantalla (MAQUETACIO: l'excepció `data-amplada="vora"`)
      if (mobil) ok(`${tag} · al mòbil, el vídeo d'una vora a l'altra`, Math.round(caixa.x) === 0 && Math.round(caixa.width) === w);
      const desborda = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      ok(`${tag} · res surt per la dreta`, !desborda);
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-1-play.png` });

      // 1. El play obre la finestra, i la pàgina no es mou
      const y0 = await p.evaluate(() => window.scrollY);
      await p.click('.pt-ad-play');
      await p.waitForTimeout(800);
      const finestra = await p.locator('.pt-ad-finestra').boundingBox();
      ok(`${tag} · el play obre el formulari (${mobil ? 'a pantalla sencera' : 'al mig'})`, !!finestra && (mobil ? Math.round(finestra.y) === 0 && Math.round(finestra.height) === h : finestra.y > 0 && finestra.y + finestra.height < h));
      // Al mòbil, el nom i el telèfon a dalt: amb el teclat obert (~380 px a l'iPhone) es veuen sense moure res
      if (mobil) {
        const tel = await p.locator('.pt-ad-finestra input[type="tel"]').boundingBox();
        ok(`${tag} · el telèfon, per sobre del teclat (acaba a ${Math.round(tel.y + tel.height)} px)`, tel.y + tel.height <= h - 380);
      }
      ok(`${tag} · la finestra hi cap sencera, amb el botó`, (await p.locator('.pt-ad-finestra .pt-ad-enviar').boundingBox()).y + 52 <= h);
      ok(`${tag} · la pàgina de sota no s'ha mogut`, (await p.evaluate(() => window.scrollY)) === y0);
      ok(`${tag} · els pisos comencen a 1 i el «−» no hi baixa`,
        (await p.locator('.pt-ad-num').innerText()) === '1' && (await p.getByRole('button', { name: 'Un piso menos' }).getAttribute('aria-disabled')) === 'true');
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-2-finestra.png` });

      // 2. La creu la tanca; el gest d'enrere també, sense sortir de la pàgina
      await p.locator('.pt-ad-finestra').getByRole('button', { name: 'Cerrar' }).click();
      await p.waitForTimeout(700);
      ok(`${tag} · la creu la tanca`, !(await p.locator('.pt-ad-finestra').count()) && await p.locator('.pt-ad-play').isVisible());
      const adreca = p.url();
      await p.click('.pt-ad-play');
      await p.waitForTimeout(700);
      await p.fill('[id$="-nom"]', 'Marta Puig');
      await p.goBack();
      await p.waitForTimeout(700);
      ok(`${tag} · enrere tanca la finestra i es queda a la pàgina`, !(await p.locator('.pt-ad-finestra').count()) && p.url() === adreca);
      await p.click('.pt-ad-play');
      await p.waitForTimeout(700);
      ok(`${tag} · el que havia escrit encara hi és`, (await p.inputValue('[id$="-nom"]')) === 'Marta Puig');

      // 3. Sense telèfon: l'error
      await p.fill('[id$="-nom"]', '');
      await p.click('.pt-ad-finestra .pt-ad-enviar');
      await p.waitForTimeout(400);
      ok(`${tag} · sense dades, l'error del nom i el del telèfon`, (await p.locator('.pt-ad-finestra .pt-ad-error').count()) === 2);
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-3-errors.png` });

      // 4. Dades bones: la finestra es tanca i el vídeo comença amb so
      await p.fill('[id$="-nom"]', 'Marta Puig');
      await p.fill('[id$="-tel"]', '612 345 678');
      await p.getByRole('button', { name: 'Un piso más' }).click();
      await p.getByRole('button', { name: 'Un piso más' }).click();
      await p.click('.pt-ad-finestra .pt-ad-enviar');
      await p.waitForTimeout(1500);
      const v = await p.evaluate(() => { const x = document.querySelector('.pt-ad-video video'); return { pausat: x.paused, mut: x.muted, controls: x.controls }; });
      ok(`${tag} · en enviar, el vídeo comença amb so (pausat=${v.pausat}, mut=${v.mut}, controls=${v.controls})`, !v.pausat && !v.mut && v.controls);
      ok(`${tag} · la finestra se'n va`, !(await p.locator('.pt-ad-finestra').count()));
      await surtDePantallaCompleta(p);
      await p.waitForTimeout(400);
      const c = crides[0]?.p_dades ?? {};
      ok(`${tag} · desa nom, telèfon, pla i pisos (${c.name} · ${c.phone} · ${c.plan} · pisos=${c.answers?.pisos} · ${c.source})`,
        c.name === 'Marta Puig' && c.phone === '34612345678' && c.plan === (completo ? 'completo' : 'gratis') && c.answers?.pisos === 3 && c.source === 'empezar');
      ok(`${tag} · «Ve de» és la landing (${c.page})`, c.page === `/es/${pagina}`);
      const despres = await p.locator(completo ? '.pt-ad-truca' : '.pt-ad-despres').innerText();
      ok(`${tag} · a sota, la frase amb els seus pisos`, completo
        ? despres.includes('Gracias, Marta. ¿Te llamamos y dejamos tus 3 pisos listos contigo?')
        : despres.includes('Gracias, Marta. Para tus 3 pisos, también gratis'));
      // Des del 21-10: l'alta porta el pla, l'idioma i, darrere de #, el que ja ha escrit
      const alta = 'https://app.hostlylabs.com/signup?pla=gratuit&lang=es#nom=Marta+Puig&tel=34612345678';
      if (!completo) {
        const href = await p.locator('.pt-ad-despres a').getAttribute('href');
        ok(`${tag} · «Empieza gratis» porta a l'alta gratuïta amb les seves dades (${href})`, href === alta);
      }
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-4-video.png` });

      // 5. Quan s'acaba el vídeo, a sobre, el pas següent amb el seu botó (al mòbil, el de sota no es veu)
      await p.evaluate(() => { const x = document.querySelector('.pt-ad-video video'); x.currentTime = Math.max(0, x.duration - 0.3); });
      await p.waitForSelector('.pt-ad-fi', { timeout: 8000 }).catch(() => {});
      await surtDePantallaCompleta(p);
      await p.waitForTimeout(400);
      const boto = await p.locator('.pt-ad-fi .pt-pill').boundingBox();
      ok(`${tag} · quan s'acaba, el pas següent a sobre del vídeo, amb el botó a la vista`, await p.locator('.pt-ad-fi').isVisible() && !!boto && boto.y >= 0 && boto.y + boto.height <= h);
      if (!completo) ok(`${tag} · el botó del final porta a la mateixa alta`, (await p.locator('.pt-ad-fi a').getAttribute('href')) === alta);
      await p.screenshot({ path: `${OUT}/${nom}-${pagina}-5-final.png` });

      // 6. Completo: «Sí, llamadme» (o «Llamadme mañana» de nit), des del final del vídeo
      if (completo) {
        await p.locator('.pt-ad-fi .pt-pill').click();
        await p.waitForSelector('.pt-ad-ok');
        const t = crides.find((x) => ['ara', 'demà'].includes(x.p_dades?.answers?.trucar))?.p_dades ?? {};
        ok(`${tag} · la trucada es desa com a /empezar (${t.answers?.trucar} · ${t.demo_slot ?? '—'})`, t.plan === 'completo' && !!t.demo_slot && t.answers?.pisos === 3);
        ok(`${tag} · el final i el bloc de sota diuen que ja està`, await p.locator('.pt-ad-fi .pt-ad-fi-ok').isVisible() && (await p.locator('.pt-ad-ok').innerText()).includes('612 34 56 78'));
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

  // Molts pisos: mantenint premut el «+», el número corre sol; el que es desa és el que es veu
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: false, data: Date.now() })); } catch (e) {} });
    const p = await ctx.newPage();
    const crides = [];
    await p.route('**/rest/v1/rpc/web_lead_desa', async (route) => {
      crides.push(JSON.parse(route.request().postData() || '{}'));
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok": true}' });
    });
    await p.goto(`${BASE}/es/hostly-completo`, { waitUntil: 'networkidle' });
    await p.click('.pt-ad-play');
    await p.waitForTimeout(700);
    await p.fill('[id$="-nom"]', 'Jordi');
    await p.fill('[id$="-tel"]', '612345678');
    await p.getByRole('button', { name: 'Un piso más' }).hover();
    await p.mouse.down();
    await p.waitForTimeout(1500);
    await p.mouse.up();
    await p.waitForTimeout(300);
    const n = parseInt(await p.locator('.pt-ad-num').innerText(), 10);
    ok(`molts pisos · mantenint premut el «+», corre sol (${n})`, n >= 8);
    await p.waitForTimeout(500);
    ok(`molts pisos · en deixar-lo, s'atura (${n})`, parseInt(await p.locator('.pt-ad-num').innerText(), 10) === n);
    await p.click('.pt-ad-finestra .pt-ad-enviar');
    await p.waitForTimeout(1200);
    ok(`molts pisos · desa els que es veuen (${crides[0]?.p_dades?.answers?.pisos})`, crides[0]?.p_dades?.answers?.pisos === n);
    await ctx.close();
  }

  // En català: els textos i els vídeos en català
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
  ok('ca · la finestra en català («Mira-ho en un minut i mig», «Veure el vídeo»)',
    (await p.locator('.pt-ad-finestra-t').innerText()) === 'Mira-ho en un minut i mig' && (await p.locator('.pt-ad-finestra .pt-ad-enviar').innerText()).includes('Veure el vídeo'));
  await p.screenshot({ path: `${OUT}/ca-completo-2-finestra.png` });
  await ctx.close();

  await b.close();
  console.log(resultats.join('\n'));
  console.log(`\n${resultats.filter((r) => r.startsWith('XX')).length} fallades · captures a ${OUT}`);
})();
