# Llista per publicar la web nova

L'encàrrec del Biel (13-10-2026): «vés fent punt per punt el que queda del web… que quedi perfecte per
començar a enviar trànsit i poder fer el seguiment de tothom… revisa cada pantalla i cada pas, amb el
redisseny, l'estil i la manera de parlar… i vés autoavaluant si tot és correcte».

Res no es publica fins que la llista és sencera i el Biel ho ha vist a la previsualització.

## Com s'avalua cada punt

Abans de donar un punt per fet, ha de complir tot això:

- **Estil.** El de la portada nova: `src/components/portada/portada.css` i `docs/MAQUETACIO.md`. Inter,
  la caixa `.contenidor`, les píndoles, i colors només amb significat.
- **Textos.** Literals, curts i sense vendre (`feedback_web_to_literal`). Es diu «la policía», sense
  hores ni dates, i parlant de tu. Passats per la skill *humanizer* quan cal.
- **Pantalles.** Al mòbil (390 i 360 px) i a l'ordinador (1280, 1440 i 1920 px), res tallat, res que surti
  per la dreta i res aixafat.
- **Proves.** `revisio-web`, `prova-amplada`, `prova-embut`, `prova-galetes`, `prova-publicitat`, `tsc`
  i `vite build`.
- **Seguiment.** Cada pas important deixa rastre: Analytics sempre, i Meta i Google Ads quan hi hagi
  els identificadors (`docs/SEGUIMENT-I-RETARGETING.md`).

## Els punts

| # | Punt | Estat |
|---|---|---|
| 1 | Portada: el 0 € amb la cinta de logotips (la 4B), just després del lema | Fet (13-10, 9901cf1). Vespre: sense animació d'entrada (el Biel: «no m'agrada que porti animació»); només es mou la cinta. Nit: el capçal surt quan acaba el subtítol del lema i, en acabar l'entrada, la pàgina baixa una mica sola (un cop per sessió) |
| 2 | Portada al mòbil, secció per secció (el trànsit dels anuncis arriba pel mòbil) | Fet (13-10): el 0 €, la pantalla de Hostly estreta i llegible, «Gratis» sense forats, gestors sense marcadors |
| 3 | El recorregut de qui ve d'un anunci: `/empezar`, la calculadora, `/demo` i `/precios` | Fet (13-10): `/precios` i `/demo` refetes; textos de l'embut iguals que la portada. Nit: `/demo` torna a tenir a dalt el vídeo d'un minut (refet, amb l'app en castellà; projecte a `~/hostly-videos/demo-60s`) i a sota els cinc curts; el pas del Completo de `/empezar` ja no parla de «demo de 20 minutos»: «Llamadme ahora» o triar dia, i es pot desfer fins a triar el pla |
| 4 | Seguiment: Analytics, el píxel de Meta i Google Ads, provats de cap a peus | Codi a punt (prova-publicitat 42/42, `VerVideo` nou). Falten els identificadors (Biel) |
| 5 | Portada a l'ordinador: el 0 € repetit a «Gratis para siempre», les pantalles de 1280 px i els textos | Fet (13-10). Vespre: la targeta fosca del 0 € torna a «Gratis para siempre» (la vaig treure sense que el Biel ho decidís); el lema torna a animar-se (no corria per a ningú); «Hostly está pendiente» amb la pantalla sempre al mig (la «1 · Amb la pantalla») |
| 6 | Funcionalitats: l'índex i les deu pàgines | Plantilla nova i textos repassats (13-10). Vespre: d'una funcionalitat a una altra, la pàgina nova comença a dalt, i passar a «Burocracia» ja no la deixa en blanc. Falta: les demos animades ensenyen l'app d'abril |
| 7 | Per a qui és: propietaris, gestors petits, segona residència i hereus | Fet (13-10, vespre): l'entrada amb la targeta «Hoy, en …», la secció de cada perfil amb les peces de la portada, i després «Así se empieza», els preus i «Te llamo» |
| 8 | Alternatives (l'índex i les set) i la comparativa amb Chekin | Fet (13-10): textos repassats, acaben amb «Te llamo»; l'estil (taules, targetes) es queda |
| 9 | El blog (l'índex i la plantilla dels articles) i la guia | Fet (13-10): la targeta dels articles al fosc de la casa, la guia sense emojis. Els 40 articles no s'han reescrit |
| 10 | «Sobre Hostly» i les pàgines legals | Textos repassats. Falta: la foto del Biel (ara una «B») i, a l'avís legal, el segon cognom i l'adreça fiscal |
| 11 | El català, sencer | Les proves automàtiques passen (cap paraula castellana a les pàgines en català). Convé que el Biel en llegeixi la portada i l'embut |
| 12 | Tècnic: velocitat de càrrega, SEO, redireccions i la pàgina 404 | En curs: mapa del web sense els articles en català (canònica castellana), capçaleres de seguretat a `vercel.json`. Velocitat mesurada (mòbil, 4G lenta, CPU 4×, web construïda): LCP portada 2,5 s · preus 2,3 · empezar 2,6 · demo 2,8 · funcionalitat 3,0; 330–420 KB per pàgina. Carregar només l'idioma estalviaria unes dècimes: no ara. Falta la 404 |
| 13 | Revisió final i previsualització a Vercel, amb l'OK del Biel abans de pujar res | Proves (13-10, vespre): revisio-web 224/224, prova-amplada 155/155, prova-embut 44/44, prova-galetes i prova-publicitat 42/42, tsc i build. Falta l'OK per pujar la branca (previsualització). Repetides a la nit, després de la segona ronda: revisio-web 224/224, prova-amplada 155/155, prova-embut 44/44, prova-galetes, prova-publicitat 42/42, tsc i build |
| 14 | El capçal: els desplegables i el menú del mòbil | Fet (13-10, vespre): targeta flotant amb icona, títol i una línia (abans un tauler d'una vora a l'altra sobre la pàgina desenfocada), amb teclat i Esc; al mòbil, les mateixes peces |

## El que ha de decidir o passar el Biel

Mentre no hi sigui, es treballa amb marcadors i no bloqueja la resta.

- **Gestors 2 i 3.** Les frases i els vídeos. També el vídeo vertical de l'Àngel i el seu permís. De
  moment (el Biel, 13-10: «posarem algun vídeo que tinguem de mentres»), la bombolla de l'Àngel porta el
  vídeo dels missatges (`/assets/funciona/mensajes.mp4`): s'ha de canviar abans de publicar.
- **Preus.**
  - Si els 40 € porten l'IVA inclòs.
  - Si la comissió del pla gratis surt a la targeta.
  - Si es pot dir «partner oficial».
- **Avís legal.** El segon cognom i l'adreça fiscal (`src/lib/titular.ts`).
- **Seguiment.**
  - El píxel de Meta: es pot crear amb el token de l'«hostlyadsbot».
  - La conversió de Google Ads: la crea ell i en passa els identificadors.
- **GitHub.** Si el repo passa a privat.

## Trobat pel camí (per al Biel)

- **Els cinc vídeos** (`~/hostly-videos/entregues`) acaben amb «Pruébala gratis 14 días», i el text de
  publicació també ho diu. Ja no és l'oferta: el check-in i la policia són gratis per sempre, i el
  Completo té el primer mes gratis. A `/demo` es fan servir còpies tallades abans d'aquesta píndola.
  Abans d'usar-los en anuncis, cal canviar la targeta final. El de la policia diu també «Mossos».
- **Trucar «ara».** A `/empezar`, «Llamadme ahora» promet una trucada «en unos minutos» a qualsevol hora.
  Si de nit no hi ha ningú, caldria un horari (fora d'hores: «te llamamos mañana a primera hora»). Ho
  decideix el Biel.
- **Seguiment de tothom.** Analytics, Meta i Google Ads només compten qui accepta les galetes (sovint la
  meitat o menys). Els contactes sí que es desen tots, amb la font: UTM, `gclid`, `fbclid`, la pàgina
  d'entrada i la web d'on venen. Per comptar totes les visites sense galetes, una opció és Vercel Web
  Analytics, que no en fa servir. Ho decideix el Biel.
