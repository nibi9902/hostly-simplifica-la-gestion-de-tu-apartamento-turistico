/**
 * Publicitat i retargeting (10-10-2026): Meta i Google Ads, només amb consentiment.
 *   node prova-publicitat.cjs
 *
 * Necessita DOS servidors:
 *   · el normal, sense identificadors (REVISIO_BASE, per defecte 8094): el web no ha de parlar de publicitat enlloc;
 *   · un amb identificadors de prova (PUBLI_BASE, per defecte 8096; mai el 8080). Millor el web
 *     construït: en desenvolupament `track()` no envia res a Analytics i una comprovació se salta.
 *       export VITE_META_PIXEL_ID=000000000000001 VITE_GOOGLE_ADS_ID=AW-000000001 VITE_GOOGLE_ADS_LEAD_LABEL=prova
 *       npx vite build --outDir /tmp/web-publi --emptyOutDir
 *       npx vite preview --outDir /tmp/web-publi --port 8096 --strictPort --host 127.0.0.1
 *     (o, en desenvolupament, el mateix `export` i `npx vite --port 8096 --strictPort --host 127.0.0.1`)
 * Res surt cap a Meta ni Google de debò: els seus fitxers es contesten aquí mateix i es compten.
 */
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();

const BASE = process.env.REVISIO_BASE || 'http://127.0.0.1:8094';
const PUBLI = process.env.PUBLI_BASE || 'http://127.0.0.1:8096';
// el bàner de galetes pel seu nom: a la portada hi ha més d'un «dialog» (la finestreta de «Y además» del Completo)
const BANNER = '[role="dialog"][aria-label="Cookies"]';
const PIXEL = '000000000000001';
const ADS = 'AW-000000001';
const GA = 'G-3LKZXNR4F5';

// Un fbevents.js de mentida: apunta cada crida a window.__fb (el de debò enviaria a facebook.com),
// i a window.__fbOpcions les opcions que el web ha posat al píxel abans de carregar-lo
const FB_STUB = `(function(){var o=window.fbq;window.__fbOpcions={disablePushState:!!(o&&o.disablePushState),allowDuplicatePageViews:!!(o&&o.allowDuplicatePageViews)};var q=(o&&o.queue)||[];window.__fb=window.__fb||[];var f=function(){window.__fb.push(Array.prototype.slice.call(arguments));};q.forEach(function(a){f.apply(null,a);});window.fbq=f;window._fbq=f;})();`;

let ok = 0, ko = 0;
const prova = (cond, text) => { if (cond) { ok++; console.log('ok  ' + text); } else { ko++; console.log('KO  ' + text); } };

async function context(b) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const peticions = { meta: [], google: [], servidor: [] };
  await ctx.route('**/rest/v1/rpc/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  // L'API de conversions: el que el web envia al nostre servidor (es contesta aquí mateix)
  await ctx.route('**/api/esdeveniment', (r) => { try { peticions.servidor.push(JSON.parse(r.request().postData() || '{}')); } catch (e) { peticions.servidor.push({}); } r.fulfill({ status: 204, body: '' }); });
  await ctx.route(/connect\.facebook\.net|facebook\.com\/tr/, (r) => { peticions.meta.push(r.request().url()); r.fulfill({ status: 200, contentType: 'application/javascript', body: FB_STUB }); });
  await ctx.route(/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/, (r) => { peticions.google.push(r.request().url()); r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }); });
  return { ctx, peticions };
}
const dataLayer = (p) => p.evaluate(() => (window.dataLayer || []).map((a) => Array.prototype.slice.call(a)));
const fb = (p) => p.evaluate(() => window.__fb || []);
const te = (llista, pred) => llista.some(pred);

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  let respostaSenseIds = null;

  // ── 1. Sense identificadors (el web d'avui): ni una paraula de publicitat ──
  {
    const { ctx, peticions } = await context(b);
    const p = await ctx.newPage();
    await p.goto(BASE + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const text = await p.locator(BANNER).innerText().catch(() => '');
    prova(text && !/publicidad/i.test(text), 'sense identificadors: el bàner només parla d\'analítica');
    prova(await p.locator(BANNER).getByRole('button', { name: 'Configurar', exact: true }).count() === 0, 'sense identificadors: no hi ha «Configurar»');
    await p.locator(BANNER).getByRole('button', { name: 'Aceptar', exact: true }).click();
    await p.waitForTimeout(1200);
    prova(peticions.meta.length === 0, `sense identificadors: «Aceptar» no carrega res de Meta (${peticions.meta.length})`);
    prova(peticions.google.some((u) => u.includes(GA)), 'sense identificadors: «Aceptar» carrega Google Analytics');
    respostaSenseIds = await p.evaluate(() => localStorage.getItem('hostly_galetes'));
    const desat = JSON.parse(respostaSenseIds || 'null');
    prova(desat && desat.analitiques === true && !('publicitat' in desat), `sense identificadors: no es desa cap «no» a la publicitat, perquè no s'ha preguntat (${respostaSenseIds})`);
    await p.goto(BASE + '/es/cookies', { waitUntil: 'load' });
    await p.waitForTimeout(800);
    const cookies = await p.locator('main').innerText();
    prova(!/Meta|Google Ads|publicidad/i.test(cookies), 'sense identificadors: la política de galetes no parla de publicitat');
    await p.goto(BASE + '/es/privacidad', { waitUntil: 'load' });
    await p.waitForTimeout(800);
    prova(!/Meta Platforms|retargeting/i.test(await p.locator('main').innerText()), 'sense identificadors: la privacitat no parla de Meta');
    await ctx.close();
  }

  // ── 2. Amb identificadors, abans de respondre: res ──
  {
    const { ctx, peticions } = await context(b);
    const p = await ctx.newPage();
    await p.goto(PUBLI + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const text = await p.locator(BANNER).innerText().catch(() => '');
    // des del 17-10 el bàner és curt i sense noms (el Biel: «només el necessari»); els noms, a «Configurar» i a la política
    prova(/anuncios/.test(text) && !/Meta|Google/.test(text), 'amb identificadors: el bàner parla d\'anuncis, curt i sense noms');
    prova(peticions.meta.length === 0 && peticions.google.length === 0, `abans de respondre no es carrega res (${peticions.meta.length}/${peticions.google.length})`);
    prova(await p.evaluate(() => typeof window.fbq) === 'undefined', 'abans de respondre no hi ha fbq');

    // «Rechazar»: res
    await p.locator(BANNER).getByRole('button', { name: 'Rechazar', exact: true }).click();
    await p.waitForTimeout(1200);
    prova(peticions.meta.length === 0 && peticions.google.length === 0, '«Rechazar» no carrega res');
    const desat = await p.evaluate(() => JSON.parse(localStorage.getItem('hostly_galetes') || 'null'));
    prova(desat && desat.analitiques === false && desat.publicitat === false, '«Rechazar» desa les dues respostes en «no»');
    await ctx.close();
  }

  // ── 3. «Configurar»: només analítica ──
  {
    const { ctx, peticions } = await context(b);
    const p = await ctx.newPage();
    await p.goto(PUBLI + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    await p.locator(BANNER).getByRole('button', { name: 'Configurar', exact: true }).click();
    prova(await p.locator(BANNER).getByRole('switch').count() === 2, '«Configurar» ensenya dos interruptors (analítica i publicitat)');
    prova(/Instagram, Facebook, Google y YouTube/.test(await p.locator(BANNER).innerText()), '«Configurar» diu on surten els anuncis (Instagram, Facebook, Google y YouTube)');
    prova(await p.getByRole('switch').first().isChecked() === false && await p.getByRole('switch').nth(1).isChecked() === false, 'els dos comencen apagats');
    await p.locator(BANNER).getByText('Analítica', { exact: true }).click();
    await p.locator(BANNER).getByRole('button', { name: 'Guardar', exact: true }).click();
    await p.waitForTimeout(1500);
    prova(peticions.meta.length === 0, `només analítica: res de Meta (${peticions.meta.length})`);
    prova(peticions.google.some((u) => u.includes(GA)), 'només analítica: Google Analytics carregat');
    const dl = await dataLayer(p);
    prova(te(dl, (a) => a[0] === 'consent' && a[1] === 'update' && a[2] && a[2].analytics_storage === 'granted'), 'mode de consentiment: analytics_storage obert');
    prova(!te(dl, (a) => a[0] === 'consent' && a[1] === 'update' && a[2] && a[2].ad_storage === 'granted'), 'mode de consentiment: ad_storage tancat');
    prova(!te(dl, (a) => a[0] === 'config' && a[1] === ADS), 'Google Ads no es configura');
    await p.goto(PUBLI + '/es/empezar', { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    await p.fill('#emp-tel', '612345678');
    await p.fill('#emp-nom', 'Prova');
    await p.fill('#emp-correu', 'prova@example.com');
    await p.getByRole('button', { name: /Continuar/ }).click();
    await p.waitForTimeout(2000);
    prova(peticions.servidor.length === 0, `només analítica: deixar el telèfon no envia res a l'API de conversions (${peticions.servidor.length})`);
    await ctx.close();
  }

  // ── 4. «Aceptar»: Meta i Google Ads, pàgines vistes i conversions ──
  {
    const { ctx, peticions } = await context(b);
    const p = await ctx.newPage();
    await p.goto(PUBLI + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    await p.locator(BANNER).getByRole('button', { name: 'Aceptar', exact: true }).click();
    await p.waitForTimeout(1500);
    prova(peticions.meta.some((u) => u.includes('fbevents.js')), '«Aceptar» carrega el píxel de Meta');
    let crides = await fb(p);
    prova(te(crides, (c) => c[0] === 'init' && c[1] === PIXEL) && te(crides, (c) => c[0] === 'track' && c[1] === 'PageView'), 'el píxel s\'inicia i compta la pàgina');
    prova(te(crides, (c) => c[0] === 'set' && c[1] === 'autoConfig' && c[2] === false), 'el píxel no llegeix sol els formularis (autoConfig apagat)');
    const opcions = await p.evaluate(() => window.__fbOpcions || {});
    prova(opcions.disablePushState === true && opcions.allowDuplicatePageViews === true, 'les pàgines vistes les compta el web: el píxel no mira sol l\'historial (ni els clics a l\'índex) ni descarta les repetides');
    let dl = await dataLayer(p);
    prova(te(dl, (a) => a[0] === 'config' && a[1] === ADS), 'Google Ads configurat');
    prova(te(dl, (a) => a[0] === 'consent' && a[1] === 'update' && a[2] && a[2].ad_storage === 'granted' && a[2].ad_personalization === 'granted'), 'mode de consentiment: publicitat oberta');

    // Canvi de pàgina dins del web
    const pvAbans = crides.filter((c) => c[0] === 'track' && c[1] === 'PageView').length;
    await p.evaluate(() => { const a = Array.from(document.querySelectorAll('header a')).find((x) => /precios$/.test(x.getAttribute('href') || '')); a && a.click(); });
    await p.waitForTimeout(1500);
    crides = await fb(p);
    dl = await dataLayer(p);
    prova(crides.filter((c) => c[0] === 'track' && c[1] === 'PageView').length === pvAbans + 1, 'canviar de pàgina compta una pàgina vista més a Meta');
    prova(te(dl, (a) => a[0] === 'event' && a[1] === 'page_view' && a[2] && a[2].send_to === ADS), 'i a Google Ads');

    // Deixar el telèfon a /empezar → «Lead» (i res de dades personals)
    await p.goto(PUBLI + '/es/empezar', { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    await p.fill('#emp-tel', '612345678');
    await p.fill('#emp-nom', 'Prova');
    await p.fill('#emp-correu', 'prova@example.com');
    await p.getByRole('button', { name: /Continuar/ }).click();
    await p.waitForTimeout(2000);
    crides = await fb(p);
    dl = await dataLayer(p);
    prova(te(crides, (c) => c[0] === 'track' && c[1] === 'Lead'), 'deixar el telèfon = «Lead» a Meta');
    prova(te(dl, (a) => a[0] === 'event' && a[1] === 'conversion' && a[2] && a[2].send_to === `${ADS}/prova`), 'i conversió «Contacto» a Google Ads');
    const tot = JSON.stringify(crides) + JSON.stringify(dl);
    prova(!/612345678|prova@example\.com|Prova"/.test(tot), 'cap dada personal cap a Meta ni Google');
    // L'API de conversions: el mateix «Lead», amb el mateix identificador, i les dades xifrades al navegador
    const lead = crides.find((c) => c[0] === 'track' && c[1] === 'Lead');
    const idLead = lead && lead[3] && lead[3].eventID;
    const leadServidor = peticions.servidor.find((x) => x.event_name === 'Lead');
    prova(!!idLead && !!leadServidor && leadServidor.event_id === idLead, `el «Lead» surt també cap a l'API de conversions, amb el mateix identificador (${idLead ? idLead.slice(0, 8) : '—'})`);
    const sha = (v) => require('crypto').createHash('sha256').update(v).digest('hex');
    prova(!!leadServidor && leadServidor.ph === sha('34612345678') && leadServidor.em === sha('prova@example.com') && leadServidor.fn === sha('prova'), 'el telèfon (amb el prefix), el correu i el nom hi van xifrats com demana Meta');
    prova(!/612345678|prova@example\.com|"Prova"/.test(JSON.stringify(peticions.servidor)), 'cap dada en clar cap al nostre servidor');
    // Sense `send_to`, gtag envia l'esdeveniment a tots els destinataris: també a Google Ads,
    // amb els seus paràmetres (el resultat de la calculadora, el dia de la demo)
    const sense = dl.filter((a) => a[0] === 'event' && !(a[2] && a[2].send_to));
    prova(sense.length === 0, `cap esdeveniment de Google sense destinatari (${sense.map((a) => a[1]).join(', ') || 'cap'})`);
    const desenvolupament = await p.evaluate(() => !!document.querySelector('script[src*="/@vite/client"]'));
    if (desenvolupament) console.log("--  en desenvolupament track() no envia res a Analytics: la comprovació següent necessita el web construït (vegeu la capçalera)");
    else prova(te(dl, (a) => a[0] === 'event' && a[1] === 'empezar_datos' && a[2] && a[2].send_to === GA), 'els esdeveniments del web van només a Google Analytics');

    // Canviar d'opinió: «Cambiar mis preferencias» → «Rechazar»
    await p.evaluate(() => { document.cookie = '_fbp=fb.1.123.456; path=/'; document.cookie = '_gcl_au=1.1.789; path=/'; });
    await p.goto(PUBLI + '/es/cookies', { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    const cookies = await p.locator('main').innerText();
    prova(/Meta \(_fbp, _fbc\)/.test(cookies) && /Google Ads \(_gcl_au, _gcl_aw\)/.test(cookies), 'amb identificadors: la política de galetes llista Meta i Google Ads');
    prova(/Cookies de publicidad/.test(cookies), 'i explica les galetes de publicitat');
    await p.getByRole('button', { name: /Cambiar mis preferencias/ }).click();
    await p.waitForTimeout(800);
    await p.locator(BANNER).getByRole('button', { name: 'Rechazar', exact: true }).click();
    await p.waitForTimeout(800);
    crides = await fb(p);
    prova(te(crides, (c) => c[0] === 'consent' && c[1] === 'revoke'), 'en rebutjar després, Meta deixa de comptar');
    const galetes = await p.evaluate(() => document.cookie);
    prova(!/_fbp=|_gcl_au=/.test(galetes), `i s'esborren les galetes de publicitat (${galetes || 'cap'})`);
    await p.goto(PUBLI + '/es/privacidad', { waitUntil: 'load' });
    await p.waitForTimeout(800);
    prova(/Meta Platforms Ireland/.test(await p.locator('main').innerText()), 'amb identificadors: la privacitat diu qui rep les dades');
    await ctx.close();
  }

  // ── 5. Respostes desades d'abans: només val la que va dir sí o no a aquestes mateixes eines ──
  async function ambResposta(valor) {
    const { ctx, peticions } = await context(b);
    await ctx.addInitScript((v) => { try { localStorage.setItem('hostly_galetes', v); } catch (e) {} }, valor);
    const p = await ctx.newPage();
    await p.goto(PUBLI + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const r = { banner: await p.locator(BANNER).count() === 1, meta: peticions.meta.length };
    await ctx.close();
    return r;
  }
  const ara = () => Date.now();
  let r = await ambResposta(JSON.stringify({ analitiques: true, data: ara() }));
  prova(r.banner && r.meta === 0, 'una resposta d\'abans de la publicitat torna a preguntar');
  if (respostaSenseIds) {
    r = await ambResposta(respostaSenseIds);
    prova(r.banner && r.meta === 0, 'la resposta desada al web sense identificadors torna a preguntar quan n\'hi ha');
  }
  r = await ambResposta(JSON.stringify({ analitiques: true, publicitat: false, data: ara() }));
  prova(r.banner, 'un «no» desat sense dir a quines eines (versió 16) torna a preguntar');
  r = await ambResposta(JSON.stringify({ analitiques: true, publicitat: true, eines: 'meta', data: ara() }));
  prova(r.banner && r.meta === 0, 'un sí només a Meta no val per a Meta i Google: torna a preguntar');
  r = await ambResposta(JSON.stringify({ analitiques: true, publicitat: true, eines: 'meta+google', data: ara() }));
  prova(!r.banner && r.meta > 0, 'un sí a aquestes mateixes eines no torna a preguntar i carrega el píxel');

  await b.close();
  console.log(`\n${ok} ok · ${ko} KO`);
  process.exit(ko ? 1 : 0);
})();
