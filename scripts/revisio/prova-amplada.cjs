/**
 * La caixa del web (10-10-2026): tot el contingut a la mateixa línia, a totes les pàgines i amplades.
 *   node prova-amplada.cjs [carpeta-captures]
 *   NOMES_RUTES=/es/precios,/es/blog node prova-amplada.cjs     (només unes rutes)
 *
 * Les regles (docs/MAQUETACIO.md):
 *   R1 línia      — tots els `.contenidor` de la pàgina tenen el contingut entre les mateixes dues vores.
 *   R2 dins       — cap text, imatge ni botó surt de la línia (excepte files que llisquen i el que
 *                   va d'una vora a l'altra a propòsit: `data-amplada="vora"`).
 *   R3 comença    — una secció alineada a l'esquerra comença a la línia, no uns centímetres més endins.
 *   R4 franja     — a l'ordinador, cap secció blanca és una columna estreta al mig amb dos marges buits
 *                   (`data-estret` si és volgut).
 *   R5 mòbil      — 20 px de marge a cada costat i res que surti per la dreta.
 */
const { chromium } = (() => { try { return require('playwright-core'); } catch { return require('/Users/bielalsinailla/Desktop/Hostly - 1.1 Migration/node_modules/playwright-core'); } })();
const fs = require('fs');
const path = require('path');

const OUT = process.argv[2];
const BASE = process.env.REVISIO_BASE || 'http://127.0.0.1:8094';
if (OUT) fs.mkdirSync(OUT, { recursive: true });

const BLOG = ['cuanto-cuesta-gestionar-piso-turistico', 'ses-hospedajes-guia-completa-2026', 'hostify-vs-lodgify-vs-smoobu-comparativa'];
const RUTES = (process.env.NOMES_RUTES ? process.env.NOMES_RUTES.split(',') : [
  '/es', '/es/empezar', '/es/calcula', '/es/precios', '/es/demo', '/es/guia', '/es/comparativa/chekin',
  '/es/propietarios', '/es/gestores-pequenos', '/es/segunda-residencia', '/es/hereus',
  '/es/blog', ...BLOG.map((s) => `/es/blog/${s}`),
  '/es/alternativas', '/es/alternativas/smoobu', '/es/alternativas/icnea',
  '/es/funcionalidades', '/es/funcionalidades/check-in-online', '/es/funcionalidades/multi-rol', '/es/funcionalidades/conecta-todo',
  '/es/sobre-hostly', '/es/privacidad', '/es/cookies', '/es/terminos', '/es/aviso-legal',
  '/ca', '/ca/precios', '/ca/funcionalidades/ia-whatsapp', '/ca/propietarios',
]);
const AMPLADES = (process.env.AMPLADES || '1280,1440,1920,390,360').split(',').map(Number);

(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const errors = [];
  let pagines = 0;
  for (const w of AMPLADES) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 768 ? 844 : Math.round(w * 0.5625) } });
    await ctx.route('**/rest/v1/rpc/**', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
    await ctx.addInitScript(() => { try { localStorage.setItem('hostly_galetes', JSON.stringify({ analitiques: false, data: Date.now() })); } catch (e) {} });
    for (const ruta of RUTES) {
      const p = await ctx.newPage();
      await p.goto(BASE + ruta, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
      await p.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
      // Baixar a poc a poc: les seccions entren animades i, fins que no s'hi arriba, són fora de lloc
      const alt = await p.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < alt; y += 450) { await p.evaluate((v) => window.scrollTo(0, v), y); await p.waitForTimeout(80); }
      await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await p.waitForTimeout(900);
      const r = await p.evaluate((ample) => {
        const vw = document.documentElement.clientWidth;
        const visible = (el) => {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) < 0.05) return false;
          const rr = el.getBoundingClientRect();
          return rr.width > 1 && rr.height > 1;
        };
        const nom = (el) => {
          const h = el.matches('h1,h2,h3') ? el : el.querySelector('h1,h2,h3');
          const text = (h ? h.textContent : el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
          return `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} «${text}»`;
        };
        // On és «fora del joc»: files que llisquen, el que va d'una vora a l'altra, el que és fix (menys el capçal)
        const exempt = (el) => {
          if (el.closest('[data-amplada="vora"]')) return true;
          for (let a = el.parentElement; a; a = a.parentElement) {
            const cs = getComputedStyle(a);
            if (cs.position === 'fixed' && a.tagName !== 'HEADER') return true;
            if (['auto', 'scroll'].includes(cs.overflowX) && a.scrollWidth > a.clientWidth + 2) return true;
            if (['hidden', 'clip'].includes(cs.overflowX) && a.scrollWidth > a.clientWidth + 2 && a !== document.body) return true;
          }
          return false;
        };
        const teText = (el) => Array.from(el.childNodes).some((n) => n.nodeType === 3 && n.textContent.trim().length > 0);
        const caixa = (el) => {
          const rr = el.getBoundingClientRect();
          if (teText(el) && !['IMG', 'VIDEO', 'BUTTON', 'INPUT'].includes(el.tagName)) {
            const rg = document.createRange();
            rg.selectNodeContents(el);
            const rs = rg.getBoundingClientRect();
            if (rs.width > 0) return { l: Math.max(rr.left, rs.left), r: Math.min(rr.right, rs.right) };
          }
          return { l: rr.left, r: rr.right };
        };
        // Una targeta (vora o fons propi) també és contingut: el seu text va a dins, amb marge
        const targeta = (d) => {
          const cs = getComputedStyle(d);
          const vora = parseFloat(cs.borderLeftWidth) > 0 && cs.borderLeftColor !== 'rgba(0, 0, 0, 0)' && cs.borderLeftStyle !== 'none';
          const fonsPropi = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none';
          const rr = d.getBoundingClientRect();
          // (no els embolcalls de pàgina ni les franges de fons d'una vora a l'altra, que no són targetes)
          // (i amb alguna cosa a dins: un resplendor decoratiu no és una targeta)
          const teContingut = d.textContent.trim().length > 0 || !!d.querySelector('img,video');
          return (vora || fonsPropi) && teContingut && getComputedStyle(d).pointerEvents !== 'none' && rr.width > 40 && rr.height > 24 && rr.width < vw - 1 && !d.querySelector('.contenidor') && !['SECTION', 'MAIN', 'HEADER', 'FOOTER', 'BODY'].includes(d.tagName) && !d.classList.contains('contenidor');
        };
        const continguts = (arrel) => Array.from(arrel.querySelectorAll('*')).filter((d) => {
          const media = ['IMG', 'VIDEO', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'IFRAME'].includes(d.tagName);
          return (media || teText(d) || targeta(d)) && visible(d) && !exempt(d) && !d.closest('[aria-hidden="true"] svg') && !(d.getAttribute('aria-hidden') === 'true' && !teText(d));
        });

        // R1 · la línia
        const conts = Array.from(document.querySelectorAll('.contenidor')).filter(visible);
        // Sense caixa només a propòsit (la 404, a pantalla completa): `data-sense-caixa`
        if (!conts.length) return document.querySelector('[data-sense-caixa]') ? { sense: true } : { L: 0, R: vw, errs: ['R1 la pàgina no fa servir la caixa del web (cap `.contenidor`)'] };
        const vores = conts.map((c) => {
          const rr = c.getBoundingClientRect();
          const cs = getComputedStyle(c);
          return { el: c, l: Math.round(rr.left + parseFloat(cs.paddingLeft)), r: Math.round(rr.right - parseFloat(cs.paddingRight)) };
        });
        const L = vores[0].l, R = vores[0].r;
        const errs = [];
        vores.forEach((v) => {
          if (Math.abs(v.l - L) > 1 || Math.abs(v.r - R) > 1) errs.push(`R1 línia: ${nom(v.el.closest('section,header,footer,main,div') || v.el)} va de ${v.l} a ${v.r} (la línia, de ${L} a ${R})`);
        });

        // R2 · res fora de la línia
        const fora = [];
        continguts(document.body).forEach((d) => {
          if (d.closest('#root') === null) return;
          const c = caixa(d);
          if (c.l < L - 2 || c.r > R + 2) fora.push(`${d.tagName.toLowerCase()} «${(d.textContent || d.getAttribute('aria-label') || d.getAttribute('alt') || '').trim().slice(0, 40)}» (${Math.round(c.l)}–${Math.round(c.r)})`);
        });
        if (fora.length) errs.push(`R2 fora de la línia (${L}–${R}): ${fora.slice(0, 4).join(' · ')}${fora.length > 4 ? ` · i ${fora.length - 4} més` : ''}`);

        // R3 i R4 · per secció
        const main = document.querySelector('main');
        const seccions = main ? Array.from(main.querySelectorAll('section')).filter((x) => !x.parentElement.closest('section')) : [];
        const blocs = [...document.querySelectorAll('#root header'), ...(seccions.length ? seccions : main ? [main] : []), document.querySelector('footer')].filter((x) => x && visible(x));
        const fons = (x) => { const c = getComputedStyle(x); return (c.backgroundColor !== 'rgba(0, 0, 0, 0)' && c.backgroundColor !== 'rgb(255, 255, 255)') || c.backgroundImage !== 'none'; };
        for (const bl of blocs) {
          if (bl.closest('[data-amplada="vora"]') || bl.querySelector(':scope[data-amplada="vora"]')) continue;
          const ds = continguts(bl);
          if (!ds.length) continue;
          let l = Infinity, r = -Infinity;
          ds.forEach((d) => { const c = caixa(d); l = Math.min(l, c.l); r = Math.max(r, c.r); });
          const gl = l - L, gr = R - r;
          if (gl > 4 && Math.abs(gl - gr) > 32) errs.push(`R3 no comença a la línia: ${nom(bl)} comença ${Math.round(gl)} px més endins`);
          if (ample >= 1280 && !bl.hasAttribute('data-estret') && !fons(bl) && !(bl.firstElementChild && fons(bl.firstElementChild))) {
            const lw = R - L;
            if (gl > lw * 0.15 && gr > lw * 0.15) errs.push(`R4 franja al mig: ${nom(bl)} ocupa ${Math.round((r - l) / lw * 100)} % de la línia, centrat`);
          }
        }

        // R5 · mòbil
        if (ample < 768) {
          if (L !== 20 || R !== vw - 20) errs.push(`R5 marges del mòbil: ${L} i ${vw - R} px (han de ser 20)`);
          if (document.documentElement.scrollWidth > vw + 1) errs.push(`R5 la pàgina surt per la dreta (${document.documentElement.scrollWidth} px)`);
        }
        return { L, R, errs };
      }, w);
      pagines++;
      if (r.sense) { /* p. ex. la 404: sense caixa, a propòsit */ }
      else if (r.errs.length) {
        errors.push({ w, ruta, errs: r.errs });
        if (OUT) await p.screenshot({ path: path.join(OUT, `${w}${ruta.replace(/\//g, '_')}.png`), fullPage: true }).catch(() => {});
      }
      process.stdout.write(r.errs && r.errs.length ? 'x' : '.');
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  console.log(`\n${pagines - errors.length}/${pagines} pàgines a la línia`);
  for (const e of errors) {
    console.log(`\n${e.w} ${e.ruta}`);
    e.errs.forEach((x) => console.log('  · ' + x));
  }
  if (OUT) fs.writeFileSync(path.join(OUT, 'amplada.json'), JSON.stringify(errors, null, 1));
  process.exit(errors.length ? 1 : 0);
})();
