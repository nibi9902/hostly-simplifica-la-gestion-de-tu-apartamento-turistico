/**
 * Publicitat i retargeting (10-10-2026): Meta i Google Ads, només amb consentiment.
 *   node prova-publicitat.cjs
 *
 * Necessita DOS servidors:
 *   · el normal, sense identificadors (REVISIO_BASE, per defecte 8094): el web no ha de parlar de publicitat enlloc;
 *   · un amb identificadors de prova (PUBLI_BASE, per defecte 8096; mai el 8080):
 *       VITE_META_PIXEL_ID=000000000000001 VITE_GOOGLE_ADS_ID=AW-000000001 VITE_GOOGLE_ADS_LEAD_LABEL=prova \
 *         npx vite --port 8096 --strictPort --host 127.0.0.1
 * Res surt cap a Meta ni Google de debò: els seus fitxers es contesten aquí mateix i es compten.
 */
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();

const BASE = process.env.REVISIO_BASE || 'http://127.0.0.1:8094';
const PUBLI = process.env.PUBLI_BASE || 'http://127.0.0.1:8096';
const PIXEL = '000000000000001';
const ADS = 'AW-000000001';

// Un fbevents.js de mentida: apunta cada crida a window.__fb (el de debò enviaria a facebook.com)
const FB_STUB = `(function(){var q=(window.fbq&&window.fbq.queue)||[];window.__fb=window.__fb||[];var f=function(){window.__fb.push(Array.prototype.slice.call(arguments));};q.forEach(function(a){f.apply(null,a);});window.fbq=f;window._fbq=f;})();`;

let ok = 0, ko = 0;
const prova = (cond, text) => { if (cond) { ok++; console.log('ok  ' + text); } else { ko++; console.log('KO  ' + text); } };

async function context(b) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const peticions = { meta: [], google: [] };
  await ctx.route('**/rest/v1/rpc/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
  await ctx.route(/connect\.facebook\.net|facebook\.com\/tr/, (r) => { peticions.meta.push(r.request().url()); r.fulfill({ status: 200, contentType: 'application/javascript', body: FB_STUB }); });
  await ctx.route(/googletagmanager\.com|google-analytics\.com|googleadservices\.com|doubleclick\.net/, (r) => { peticions.google.push(r.request().url()); r.fulfill({ status: 200, contentType: 'application/javascript', body: '' }); });
  return { ctx, peticions };
}
const dataLayer = (p) => p.evaluate(() => (window.dataLayer || []).map((a) => Array.prototype.slice.call(a)));
const fb = (p) => p.evaluate(() => window.__fb || []);
const te = (llista, pred) => llista.some(pred);

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });

  // ── 1. Sense identificadors (el web d'avui): ni una paraula de publicitat ──
  {
    const { ctx, peticions } = await context(b);
    const p = await ctx.newPage();
    await p.goto(BASE + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    const text = await p.locator('[role="dialog"]').innerText().catch(() => '');
    prova(text && !/publicidad/i.test(text), 'sense identificadors: el bàner només parla d\'analítica');
    prova(await p.locator('[role="dialog"]').getByRole('button', { name: 'Configurar', exact: true }).count() === 0, 'sense identificadors: no hi ha «Configurar»');
    await p.locator('[role="dialog"]').getByRole('button', { name: 'Aceptar', exact: true }).click();
    await p.waitForTimeout(1200);
    prova(peticions.meta.length === 0, `sense identificadors: «Aceptar» no carrega res de Meta (${peticions.meta.length})`);
    prova(peticions.google.some((u) => u.includes('G-3LKZXNR4F5')), 'sense identificadors: «Aceptar» carrega Google Analytics');
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
    const text = await p.locator('[role="dialog"]').innerText().catch(() => '');
    prova(/Meta y Google/.test(text), 'amb identificadors: el bàner diu «Meta y Google»');
    prova(peticions.meta.length === 0 && peticions.google.length === 0, `abans de respondre no es carrega res (${peticions.meta.length}/${peticions.google.length})`);
    prova(await p.evaluate(() => typeof window.fbq) === 'undefined', 'abans de respondre no hi ha fbq');

    // «Rechazar»: res
    await p.locator('[role="dialog"]').getByRole('button', { name: 'Rechazar', exact: true }).click();
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
    await p.locator('[role="dialog"]').getByRole('button', { name: 'Configurar', exact: true }).click();
    prova(await p.locator('[role="dialog"]').getByRole('switch').count() === 2, '«Configurar» ensenya dos interruptors (analítica i publicitat)');
    prova(await p.getByRole('switch').first().isChecked() === false && await p.getByRole('switch').nth(1).isChecked() === false, 'els dos comencen apagats');
    await p.locator('[role="dialog"]').getByText('Analítica', { exact: true }).click();
    await p.locator('[role="dialog"]').getByRole('button', { name: 'Guardar', exact: true }).click();
    await p.waitForTimeout(1500);
    prova(peticions.meta.length === 0, `només analítica: res de Meta (${peticions.meta.length})`);
    prova(peticions.google.some((u) => u.includes('G-3LKZXNR4F5')), 'només analítica: Google Analytics carregat');
    const dl = await dataLayer(p);
    prova(te(dl, (a) => a[0] === 'consent' && a[1] === 'update' && a[2] && a[2].analytics_storage === 'granted'), 'mode de consentiment: analytics_storage obert');
    prova(!te(dl, (a) => a[0] === 'consent' && a[1] === 'update' && a[2] && a[2].ad_storage === 'granted'), 'mode de consentiment: ad_storage tancat');
    prova(!te(dl, (a) => a[0] === 'config' && a[1] === ADS), 'Google Ads no es configura');
    await ctx.close();
  }

  // ── 4. «Aceptar»: Meta i Google Ads, pàgines vistes i conversions ──
  {
    const { ctx, peticions } = await context(b);
    const p = await ctx.newPage();
    await p.goto(PUBLI + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    await p.locator('[role="dialog"]').getByRole('button', { name: 'Aceptar', exact: true }).click();
    await p.waitForTimeout(1500);
    prova(peticions.meta.some((u) => u.includes('fbevents.js')), '«Aceptar» carrega el píxel de Meta');
    let crides = await fb(p);
    prova(te(crides, (c) => c[0] === 'init' && c[1] === PIXEL) && te(crides, (c) => c[0] === 'track' && c[1] === 'PageView'), 'el píxel s\'inicia i compta la pàgina');
    prova(te(crides, (c) => c[0] === 'set' && c[1] === 'autoConfig' && c[2] === false), 'el píxel no llegeix sol els formularis (autoConfig apagat)');
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

    // Canviar d'opinió: «Cambiar mis preferencias» → «Rechazar»
    await p.evaluate(() => { document.cookie = '_fbp=fb.1.123.456; path=/'; document.cookie = '_gcl_au=1.1.789; path=/'; });
    await p.goto(PUBLI + '/es/cookies', { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    const cookies = await p.locator('main').innerText();
    prova(/Meta \(_fbp, _fbc\)/.test(cookies) && /Google Ads \(_gcl_au, _gcl_aw\)/.test(cookies), 'amb identificadors: la política de galetes llista Meta i Google Ads');
    prova(/Cookies de publicidad/.test(cookies), 'i explica les galetes de publicitat');
    await p.getByRole('button', { name: /Cambiar mis preferencias/ }).click();
    await p.waitForTimeout(800);
    await p.locator('[role="dialog"]').getByRole('button', { name: 'Rechazar', exact: true }).click();
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

  // ── 5. Una resposta d'abans (sense publicitat) torna a preguntar ──
  {
    const { ctx } = await context(b);
    await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: true, data: Date.now() })); } catch (e) {} });
    const p = await ctx.newPage();
    await p.goto(PUBLI + '/es', { waitUntil: 'load' });
    await p.waitForTimeout(2500);
    prova(await p.locator('[role="dialog"]').count() === 1, 'una resposta d\'abans de la publicitat torna a preguntar');
    await ctx.close();
  }

  await b.close();
  console.log(`\n${ok} ok · ${ko} KO`);
  process.exit(ko ? 1 : 0);
})();
