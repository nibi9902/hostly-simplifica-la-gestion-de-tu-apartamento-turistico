# Llista per publicar la web nova

L'encàrrec del Biel (13-10-2026): «vés fent punt per punt el que queda del web… que quedi perfecte per
començar a enviar trànsit i poder fer el seguiment de tothom… revisa cada pantalla i cada pas, amb el
redisseny, l'estil i la manera de parlar… i vés autoavaluant si tot és correcte».

Res no es publica fins que la llista és sencera i el Biel ho ha vist a la previsualització.

> **Publicada el 17-10-2026** (`versio-18`, `docs/VERSIONS.md`). El Biel: «pujem-ho». El píxel de Meta
> (`VITE_META_PIXEL_ID`) es va posar a *Production* el mateix dia, abans de pujar. Queden per després: els
> identificadors de Google Ads, el vídeo de l'Àngel (sense vídeo no cal el permís) i les dades que rep
> Telegram (el Biel: «de moment no tocarem res perquè en breus farem algunes connexions noves»).

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
| 4 | Seguiment: Analytics, el píxel de Meta i Google Ads, provats de cap a peus | Meta, fet: el píxel (a la previsualització) i l'API de conversions, amb el testimoni a Vercel des del 14-10 (prova-publicitat 46/46). En publicar, posar `VITE_META_PIXEL_ID` també a *Production*. Falten els identificadors de Google Ads (Biel) |
| 5 | Portada a l'ordinador: el 0 € repetit a «Gratis para siempre», les pantalles de 1280 px i els textos | Fet (13-10). Vespre: la targeta fosca del 0 € torna a «Gratis para siempre» (la vaig treure sense que el Biel ho decidís); el lema torna a animar-se (no corria per a ningú); «Hostly está pendiente» amb la pantalla sempre al mig (la «1 · Amb la pantalla») |
| 6 | Funcionalitats: l'índex i les deu pàgines | Plantilla nova i textos repassats (13-10). Vespre: d'una funcionalitat a una altra, la pàgina nova comença a dalt, i passar a «Burocracia» ja no la deixa en blanc. Falta: les demos animades ensenyen l'app d'abril |
| 7 | Per a qui és: propietaris, gestors petits, segona residència i hereus | Fet (13-10, vespre): l'entrada amb la targeta «Hoy, en …», la secció de cada perfil amb les peces de la portada, i després «Así se empieza», els preus i «Te llamo» |
| 8 | Alternatives (l'índex i les set) i la comparativa amb Chekin | Fet (13-10): textos repassats, acaben amb «Te llamo»; l'estil (taules, targetes) es queda |
| 9 | El blog (l'índex i la plantilla dels articles) i la guia | Fet (13-10): la targeta dels articles al fosc de la casa, la guia sense emojis. Els 40 articles no s'han reescrit |
| 10 | «Sobre Hostly» i les pàgines legals | Textos repassats. L'avís legal ja porta el nom sencer i l'adreça amb «17002 Girona» (14-10). Falta la foto del Biel (ara una «B») |
| 11 | El català, sencer | Les proves automàtiques passen (cap paraula castellana a les pàgines en català). Convé que el Biel en llegeixi la portada i l'embut |
| 12 | Tècnic: velocitat de càrrega, SEO, redireccions i la pàgina 404 | En curs: mapa del web sense els articles en català (canònica castellana), capçaleres de seguretat a `vercel.json`. Velocitat mesurada (mòbil, 4G lenta, CPU 4×, web construïda): LCP portada 2,5 s · preus 2,3 · empezar 2,6 · demo 2,8 · funcionalitat 3,0; 330–420 KB per pàgina. Carregar només l'idioma estalviaria unes dècimes: no ara. La 404 ja és la nova (capçal, peu i el clauer) |
| 13 | Revisió final i previsualització a Vercel, amb l'OK del Biel abans de pujar res | Proves (13-10, vespre): revisio-web 224/224, prova-amplada 155/155, prova-embut 44/44, prova-galetes i prova-publicitat 42/42, tsc i build. Falta l'OK per pujar la branca (previsualització). Repetides a la nit, després de la segona ronda: revisio-web 224/224, prova-amplada 155/155, prova-embut 44/44, prova-galetes, prova-publicitat 42/42, tsc i build |
| 14 | El capçal: els desplegables i el menú del mòbil | Fet (13-10, vespre): targeta flotant amb icona, títol i una línia (abans un tauler d'una vora a l'altra sobre la pàgina desenfocada), amb teclat i Esc; al mòbil, les mateixes peces |
| 15 | El mòdul del Completo, després de «Gratis para siempre» | Fet (14-10): la «G · El taulell» que el Biel va triar, amb trossos de l'app de debò (la conversa amb la IA que canvia d'idioma, el detall d'un dia de Setmana Santa, la neteja que passa a «Hecha», el calendari amb els canals i els extres pagats); cada rajola porta a la seva funcionalitat; al mòbil llisquen. revisio-web de la portada i preus 8/8, prova-amplada 155/155, tsc i build. Segona volta (14-10, vespre, el Biel: «la neteja i els extres haurien d'ensenyar més coses»): la neteja és el WhatsApp de Hostly amb la Pilar (ella confirma → «Coordinada» sense que facis res → l'endemà, fotos → «Hecha»; si no pot, la següent del torn); els extres, ample, ensenyen el missatge automàtic que ofereix la sortida tardana → el pagament en línia → la confirmació sola amb la neteja avisada, i una píndola el lliga amb Mensajes; rajola nova «Conéctalo todo» (servei a part, a mida). Tauleta reordenada; arreglades les fletxes del carrusel del mòbil. revisio-web 8/8, prova-amplada de la portada (es i ca, 7 amplades) 14/14, tsc i build. **Tercera volta (15-10), la definitiva, del mockup `docs/exploracions/2026-10-11-web-estil-b/completo-una-pantalla.font.html` (8 voltes amb el Biel):** tot en una pantalla (764 px del rètol a la barra a 1440); cada mòdul es mou només amb el ratolí a sobre (al mòbil, tocant), suau; Mensajes amb el late checkout automàtic que vola fins a Extras; Precios: demanda → Festivo → preu; Limpieza: el torn amb les fotos de dins del pis (retalls de la portada d'un pis de l'app, amb l'OK del Biel) i el preu; «Late checkout» en cursiva només a Extras; a sota, «Y además» amb 7 rodones (nova: «Tu web propia», a part) i un mini pop-up. revisio-web 8/8, prova-amplada 14/14, tsc i build |
| 16 | La portada, arreglada després de la revisió de màrqueting, i la pàgina dels anuncis | Fet (15-10, mockup `docs/exploracions/2026-10-15-portada-arreglada/` aprovat): «Empezar» també al capçal del mòbil i el capçal surt de seguida; l'entrada amb subtítol literal, botó i «Sin tarjeta.» (sense desenfocament ni pista que baixa sola); el Zero diu «hasta 95 € al año por piso»; Pendent «Con Hostly Completo» i la incidència és una etiqueta (no un botó fals), 4 coses al mòbil; el Completo amb preu i botó, i al mòbil en llista; l'Àngel sense el vídeo de mostra; cinc preguntes (amb FAQPage); al mòbil, barra fixa amb «Empezar» i «Llámame». El Gratis: es queda el d'ara; la versió nova (sense la segona targeta del 0 €) es veu amb `?gratis=nou` fins que el Biel triï. Pàgina nova `/registro-de-viajeros-gratis` (noindex). Arreglat també: «/» → «/es» perdia els paràmetres dels anuncis (utm, fbclid, gclid). Després (15-10): el subtítol de l'entrada és «Lo que hoy te quita horas, Hostly lo hace por ti. Empieza gratis con el registro de viajeros.»; la pàgina dels anuncis i les preguntes diuen «SES.Hospedajes o Mossos d'Esquadra» (decisió del Biel; si arriba algú d'un sistema no connectat, es fa el mateix dia); la foto del Biel al «Llámame»; les xifres del Zero, confirmades com a reals pel Biel. 16-10: el Gratis porta el 0 € en una banda blava a dalt de les quatre peces (opció C de quatre; fora la targeta fosca que repetia el Zero, i fora `?gratis=…`), amb «¿Solo quieres el check-in y la policía? Es gratis, para siempre.»; l'Àngel es queda abans dels preus |

## El que ha de decidir o passar el Biel

Mentre no hi sigui, es treballa amb marcadors i no bloqueja la resta.

- **Gestors 2 i 3.** Les frases i els vídeos. També el vídeo vertical de l'Àngel i el seu permís. De
  moment (el Biel, 13-10: «posarem algun vídeo que tinguem de mentres»), la bombolla de l'Àngel porta el
  vídeo dels missatges (`/assets/funciona/mensajes.mp4`): s'ha de canviar abans de publicar.
- **Preus.**
  - Si els 40 € porten l'IVA inclòs.
  - Si la comissió del pla gratis surt a la targeta.
  - Si es pot dir «partner oficial».
- **Seguiment.**
  - Meta: fet (píxel i API de conversions). Queda posar el píxel a *Production* el dia de publicar.
  - La conversió de Google Ads: la crea ell i en passa els identificadors.
- **GitHub.** Si el repo passa a privat.

## Trobat pel camí (per al Biel)

- **Els cinc vídeos** (`~/hostly-videos/entregues`) acaben amb «Pruébala gratis 14 días», i el text de
  publicació també ho diu. Ja no és l'oferta: el check-in i la policia són gratis per sempre, i el
  Completo té el primer mes gratis. A `/demo` es fan servir còpies tallades abans d'aquesta píndola.
  Abans d'usar-los en anuncis, cal canviar la targeta final. El de la policia diu també «Mossos».
- **Trucar «ara».** Fet (14-10, el Biel: «Llamadme mañana»): de 21:00 a 9:00 el botó diu «Llamadme mañana» i la
  trucada es desa per a les 9 del matí següent.
- **Seguiment de tothom.** Analytics, Meta i Google Ads només compten qui accepta les galetes (sovint la
  meitat o menys). Els contactes sí que es desen tots, amb la font: UTM, `gclid`, `fbclid`, la pàgina
  d'entrada i la web d'on venen. Per comptar totes les visites sense galetes, una opció és Vercel Web
  Analytics, que no en fa servir. Ho decideix el Biel.
