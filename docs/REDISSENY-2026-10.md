# Redisseny de hostlylabs.com · octubre 2026

> **En poques paraules:** el web passa de «llista d'espera» a porta d'entrada de debò.
> Un sol botó, «Empezar», porta a `/empezar`. Allà es deixa el telèfon, es tria entre
> el pla gratuït (compte a l'app al moment) i el complet (demo de 20 minuts), i el Biel
> rep l'avís a Telegram en menys d'un minut per trucar.
>
> **Branca:** `redisseny-2026-10` · **Previsualització:** la de Vercel per a la branca
> (protegida amb l'inici de sessió de Vercel). **Res a `main`** fins que el Biel ho vegi.

## D'on surt

- Reunions amb la Marta del 30-07-2026 (`docs/reunions/` del monorepo) i de l'01-10-2026.
- Les decisions del Biel del 09-10-2026, a la conversa del redisseny de la webapp.
- Tres documents de treball (artefactes privats del Biel):
  - definició: https://claude.ai/artifact/XfVJxwyfkDiEdUSRLxew5P
  - afirmacions certes o falses: https://claude.ai/artifact/KLRiafTVLdPncDMQaPX73G
  - recorreguts abans/després: https://claude.ai/artifact/CoLCLNJjwCewNK8ftK2fgN

## Regles i decisions (09-10-2026)

| Decisió | Per què |
|---|---|
| **Un sol botó a tota la web: «Empezar»** (ca: «Començar») | «Agendar una demo» no va de primeres: «ha de voler, empezar → empezar → i al final ja li diem que primer farem una demo». |
| **El telèfon, abans que el correu**, i a cada pas | «Sempre hem d'intentar tenir el telèfon de tota persona que hagi estat una mica interessada… jo truco al moment.» |
| **El pla principal és el complet**; el gratuït és per tenir el client dins | Si no ho veu clar, comença gratis i des de l'app pot demanar el complet. |
| **Complet: 40 €/apartament, 35 € des de 5**, el primer mes gratis, es contracta a la demo | Fora el «14 días» (a l'app no hi ha ni prova ni cobrament). |
| **La demo: Cal.com al nostre servidor**, sense marca de tercers | «No amb la marca de Calendly per allà… super professional.» De moment només el disseny: l'hora es desa i el Biel la confirma per WhatsApp. |
| La demo **no** promet «con tus pisos» | Caldria connectar-los abans. |
| **Opinions: vídeos dels gestors en horitzontal** | Les 9 opinions eren inventades (fotos d'estoc). Mentre no hi hagi vídeos: «Gestor 1, 2, 3» amb l'etiqueta «Ejemplo». |
| L'animació d'entrada i el lema es queden | «¿Gestionas apartamentos en Airbnb? ¿O te gestionan ellos a ti?» és «un bon lema». |
| Les insígnies de partner es queden | «Són importants.» |
| La Laura i la Marta (assessores d'estoc) fora: **hi surt el Biel** | |
| Xifres de l'entrada (7.983 / 4.271 / 3.548): estàtiques | «Així no hem d'anar-ho carregant cada vegada que obrim el web.» |
| Programa de referits: es queda | Cal posar-lo als termes. |
| «Conéctalo todo»: automatitzacions a mida **de pagament** | «Valen X al mes, però podem automatitzar i connectar tot.» Preu pendent. |
| La calculadora, pàgina pròpia (`/calcula`), 5 preguntes | Qui la fa «ha de sortir pensant: hòstia, potser sí que em val la pena 40 euros». |

## Com funciona avui (branca `redisseny-2026-10`)

1. Qualsevol botó «Empezar» (capçal, portada, preus, funcionalitats, perfils, blog,
   comparatives) crida `useEmpezar()` (`src/lib/empezar.ts`), que porta a `/:lang/empezar`
   recordant des de quina pàgina venia.
2. **`/empezar`** (`src/pages/Empezar.tsx`), tres passos:
   - **Dades**: telèfon, nom, correu i quants pisos gestiona. El telèfon es normalitza amb la
     mateixa regla que l'app (`libphonenumber`, E.164 sense «+»; la llibreria es carrega només
     en enviar). Els pisos (el Biel, 17-10: saber-ho abans del pla, dins d'aquest pas): un número
     amb − i + (d'1 a 999, també s'hi pot escriure), a `answers.pisos`; surt a l'avís de Telegram
     («Respostes: pisos = 3») i es recorda si hi torna. Es desa abans de continuar.
   - **Pla**: «Hostly completo» (recomanat) o «Solo el check-in y la policía». Un clic.
   - **Gratis** → `https://app.hostlylabs.com/signup?pla=gratuit` (l'alta gratuïta de l'app,
     des del 07-10-2026). **Complet** → tria dia i hora (de dilluns a divendres, 10–13 h i
     16–18 h, hora de Madrid, com a mínim d'aquí a 2 hores) → «Te confirmamos la hora por
     WhatsApp».
3. **`/calcula`** (`src/pages/Calcula.tsx` + `src/lib/calcula.ts`): pisos, on, què fa servir,
   hores a la setmana, qui ho porta. El resultat es veu sense demanar res; el detall eina per
   eina es desbloqueja amb el telèfon. Només compten com a estalvi les eines que Hostly
   substitueix (check-in 4 €, channel manager 20 €, preus 20 €, per pis i mes; preus publicats
   l'octubre de 2026, `PREU_EINA` a `src/lib/calcula.ts`).
4. **«¿Prefieres hablarlo?»** (`src/components/Llamame.tsx`), sota els plans de preus.
5. Tots tres desen amb `desaLead()` (`src/lib/leads.ts`) a la BD nova.

## Les peces

- **BD nova** (`uyaycbrjdgabzrpugznd`), migració `20261009142325_web_leads.sql` del monorepo:
  - `web_leads`: un contacte per visitant (uuid generat al navegador), amb telèfon, nom,
    correu, origen (`empezar` · `calcula` · `llamame` · `guia`), pla, hora de la demo,
    respostes, pàgina, idioma i UTM.
  - `web_lead_events`: un avís per cada telèfon nou i per cada demo demanada.
  - `web_lead_desa(id, dades)`: l'única porta (anon pot executar-la, no llegir la taula).
  - `web_leads_avisa()` + cron `web-leads-avisa` (cada minut): envia l'avís a Telegram
    (`integration_secrets`: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`), 5 intents, i si falla
    deixa un apunt a Salut del sistema.
  - Provat de punta a punta el 09-10-2026: contacte desat → avís lliurat en 11 s.
- **Web**: `src/lib/leads.ts` (desar, telèfon, identificador del visitant, d'on arriba),
  `src/lib/empezar.ts`, `src/lib/demo.ts` (hores de la demo), `src/lib/calcula.ts`,
  `src/lib/data/videosClients.ts` (els vídeos de clients i els exemples), l'espai d'i18n
  `embut` (`src/i18n/locales/{es,ca}/embut.json`).
- **Redireccions**: `/funciones/*` → `/funcionalidades/*`, i les rutes pont
  (`casos-de-uso`, `integraciones`, `pms-con-ia`…) al seu lloc, a `vercel.json` (301) i a
  `App.tsx` (navegació interna).

## Trampes conegudes

- **WhatsApp no pot escriure primer a un número nou** sense una plantilla aprovada de Meta,
  i el compte encara no està verificat. Per això el web no promet «te lo enviamos por
  WhatsApp»: el detall de la calculadora surt en pantalla i el Biel truca.
- **Els vídeos d'exemple no poden anar a producció com si fossin clients.** Abans de publicar:
  vídeos de debò (amb permís) o la secció fora (`NOMES_EXEMPLES` a `videosClients.ts`).
- La previsualització de Vercel demana iniciar sessió a Vercel.
- **Preus de la competència: només els publicats i amb data** (llei de competència deslleial,
  art. 10: la publicitat comparativa ha de ser objectiva i verificable). Verificats a les webs
  oficials el 09-10-2026: Chekin 3,95 / 5,95 / 7,95 € per pis i mes · Smoobu 29 €/mes + 0,9 %
  (Flex) o 35 €/mes (31,50 € anual) · Hostify 20 $ per allotjament (des de 5) · Hospitable
  Essentials gratis, Host des de 29 € + IVA · Icnea 150 €/mes fins a 10 pisos · Avantio des de
  295 €/mes + IVA · Guesty Lite des de 9 $ per anunci · PriceLabs 19,99 $ per anunci · Beyond
  des de l'1 % de les reserves · Wheelhouse 1 % o 19,99 $ per anunci · Prohost pla gratis, de
  pagament des de 10 $ (mínim 30 $/mes). Hostaway
  i Lodgify: sense xifra (no la publiquen o no s'ha pogut verificar). El web deia «15 €/mes» i
  «180 € a l'any» per a Chekin i «des de 23 €» per a Smoobu: ja no.
- **`index.html` porta etiquetes SEO per defecte amb `data-rh="true"`.** Així el component
  `SEO` (react-helmet-async) les substitueix en carregar (abans hi havia dues canòniques, la
  de la portada a totes les pàgines, i dues descripcions). WhatsApp i les xarxes, que no
  executen JS, veuen les per defecte.
- **Res al navegador abans del consentiment.** L'origen de la visita (UTM, d'on ve) es queda
  en memòria (`leads.ts`); l'identificador i el contacte només es desen quan la persona envia
  un formulari.
- Les demos animades tenen rètols propis: van a `demos.json` (castellà i català). Una paraula
  catalana a la versió castellana (o al revés) la detecta la revisió (`textTot`, amb les
  vistes amagades incloses).
- **A `portada.css`, una regla de mòbil escrita abans de la regla base perd** (tenen la mateixa
  especificitat i guanya la de més avall). El 17-10 la U de «Hostly está pendiente» encara sortia
  al mòbil per això. Les regles de mòbil d'una peça van després de la seva regla base i dels seus
  `@media` més amples.

## La portada nova (13-10-2026)

El Biel va aprovar la portada de l'exploració (`docs/exploracions/2026-10-11-web-estil-b/`,
`portada.html`) i va decidir:
- **Primer la portada.** Les altres pàgines passen a l'estil nou després.
- **El mòbil, després.**
- **L'entrada, la d'ara** (`CinematicHero`), «però sense el tall d'alguna de les lletres».

Què hi ha:
- **L'entrada** de sempre. El «¿» i la «g» de «¿O te gestionan ellos a ti?» i la «y» de «Hostly»
  ja no queden tallats. El degradat de les lletres només pintava fins a la vora de la caixa.
- **A sota, sis seccions** (`src/components/portada/`):
  1. els gestors (`Gestors`): una pantalla per gestor, i el vídeo que s'obre cap amunt;
  2. «Hostly está pendiente» (`Pendent` + `PantallaApp`);
  3. «Gratis para siempre» (`Gratis`): la taxa que es calcula i el pagament online;
  4. «Así se empieza» (`Passos`);
  5. els preus (`Preus`);
  6. «Te llamo» (`Truca`).
- **Estils, textos i fotos.** Els estils són a `portada.css`, amb les mides de l'exploració i el
  prefix `pt-`. Els textos, a `home.json` › `portada` (castellà i català). Les fotos, a
  `src/assets/portada/`.
- **«Te llamo»** desa igual que el «¿Prefieres hablarlo?» de preus (`src/lib/useLlamame.ts`).
- **Fora de la portada vella:** el dolor, les funcionalitats, «Lo que reemplaza», els passos,
  els vídeos d'exemple, les preguntes, la franja del final i la barra de punts del costat (els
  components i els seus textos s'han esborrat).
- **Les preguntes freqüents.** «Preguntas frecuentes» del peu porta a les preguntes de
  `/precios`. La portada ja no porta el marcatge FAQPage.
- **Proves:**
  - `revisio-web`: portada ES/CA a 1440 i 390, cap problema;
  - `prova-amplada`: 15/15;
  - `prova-embut`: 40/40, i ara també mira el «Te llamo» de la portada;
  - `prova-galetes`: totes passen;
  - `vite build` passa.
  - `prova-reemplaza` s'ha tret.

Falta per **publicar-la** (mentrestant, marcadors):
- **Gestors:** les frases i els vídeos dels gestors 2 i 3. El vídeo vertical de l'Àngel i el seu
  permís per sortir-hi; avui la boleta ensenya la foto del menjador i fa veure que parla.
- **Preus:** si la comissió del pla gratis (0,25 € + 5 %) surt a la targeta, l'IVA dels 40 € i
  «Partner oficial» (preguntes 2, 6 i 12).
- **Català:** revisar els textos. La frase de l'Àngel s'hi ha traduït.
- **Mòbil:** el disseny del mòbil. Ara només no es trenca: tot va en una columna.
- **Pantalles d'ordinador de 1280 px:** «Hostly está pendiente» hi va un sota l'altre. La
  composició de tres columnes només cap a partir de 1296 px.
- **Dues vegades el 0 €:** l'entrada acaba amb «0 € en Hostly. Para siempre.» i, una mica més
  avall, «Gratis para siempre». Cal decidir si es deixen totes dues.

## Els vídeos de les funcionalitats i la web de reserves (17-10-2026)

El Biel va triar al llenç de quatre idees (https://claude.ai/artifact/KZKCRpbPnjm8VjFLudxLtU):

- **B, el vídeo a «Cómo funciona», amb els passos com a capítols** (`PassosVideo.tsx` i
  `VideoFuncio.tsx`). Primer es va fer la A (el vídeo a dalt, en lloc de la demo) i, en veure-la,
  el Biel la va canviar: «la demo a l'inici, que s'entén molt més ràpid, i després tenen el vídeo
  per si volen». A l'ordinador, el vídeo a l'esquerra i els passos a la dreta: el que surt al vídeo
  s'obre i avança, i tocar-ne un hi fa saltar el vídeo. Al mòbil, el vídeo a dalt i les targetes dels
  passos, que llisquen soles al compàs (si no les acabes de tocar). El vídeo va sol, sense so i en
  bucle quan es veu i quan la pàgina ja ha carregat; no va sol si la persona ha demanat menys
  moviment o estalvi de dades. «Escúchalo» el torna a començar amb veu i amb els controls del
  navegador (subtítols inclosos); el botó rodó l'atura. On comença cada pas de la pàgina dins del
  vídeo és a `videosFuncions.ts` (`capitols`; `null` si el pas no surt al vídeo, com «Y sigue como
  todas» de la web de reserves). Sense vídeo en aquell idioma (avui, tot el català), «Cómo
  funciona» es queda com era.
- **C, a /funcionalidades, cada targeta amb el seu vídeo** (`MiniaturaVideo.tsx` i
  `VideoObert.tsx`): es mou amb el ratolí a sobre i, en tocar-lo, s'obre en gran i amb so, amb
  «Empezar» i l'enllaç a la funcionalitat. La resta de la targeta porta a la pàgina, com abans.
- **La web de reserves directes**, funcionalitat nova (`web-de-reservas-directas`): «Aparte, a
  medida» com a la resta de la web, a sota de l'índex al costat de «Conéctalo todo»
  (`FUNCIONS_APART`), i al menú, a «Reservas y precios». La bombolla «Tu web propia» de la portada
  ara hi porta.

**D'on surten els vídeos.** Del kit de vídeos de la demo animada (un `*-landing.mp4` per
funcionalitat, amb veu i els mateixos passos que la pàgina). S'exporten a `public/assets/funcions/`
(720p, ~1 MB cadascun): el vídeo, la portada (el títol), la miniatura de l'índex i els subtítols
(`.es.vtt`, de la línia de temps de la veu), amb `scripts/exporta-videos-funcions.py`. Si el kit en
torna a renderitzar algun, es torna a passar i la durada i els capítols nous van a
`src/lib/data/videosFuncions.ts` (el script imprimeix on comença cada frase).

**La demo general (/demo):** ara és la v6 de la demo animada, «Lo que hace Hostly por ti» (94 s,
aprovada pel Biel el 17-10), amb els subtítols de la veu; el mateix script l'exporta a
`public/assets/demo/lo-que-hace-hostly.*`. Abans hi havia el vídeo d'un minut d'abril («un día
cualquiera con Hostly»), que el Biel deia que era «només per la idea»; és a l'historial (versio-18).
En català, /ca/demo porta la versió catalana, «El que fa Hostly per tu» (veu de l'Anna; les pantalles
de l'app, en castellà, com es fa servir l'app), i ja no diu «El vídeo és en castellà».

**Vídeos que deien més que la seva pàgina** (renderitzats el 17-10 a la tarda amb apunts del
Biel). Resolt el 17-10 a la nit («està tot okay; la IA és de WhatsApp i totes les plataformes»):
- *IA*: la pàgina ara és «IA que responde a tus huéspedes» i diu que respon per WhatsApp, Airbnb o
  Booking (el menú, «IA que responde»); l'adreça es queda `/funcionalidades/ia-whatsapp`.
- *Finanzas*: la pregunta ara diu que la liquidació li arriba al propietari en PDF al correu, com
  diu el vídeo.
- *Tasa turística* (`burocracia`, vídeo «Burocracia al día», amb el NRUA i l'INE) i *Check-in* (el
  vídeo diu que ofereix extres): bé com són. La pàgina de la taxa no parla del NRUA
  (`revisio-web` encara el prohibeix a les pàgines de Hostly).

## Les landings dels anuncis (18-10-2026)

El Biel volia, per als anuncis d'Instagram, una landing del check-in i una de tot el Completo,
«que només sigui la landing directa, amb formulari, i fins que no facin el formulari no poden veure
el vídeo», i que «converteixi el màxim». Al llenç de tres maneres
(https://claude.ai/artifact/JgrtWC7Seow6o7M2Ny1wz2) va triar la **B, «primer el que guanyes»**, amb
dos canvis: el formulari no surt de primeres («si no, la gent se n'anirà de primeres»): primer el
vídeo amb el play i, en prémer-lo, el formulari; i demana **nom, telèfon i pisos**. El subtítol, el de
la A.

- `/registro-de-viajeros-gratis` (la del check-in): la mateixa adreça que ja porten els anuncis; el que
  hi havia del 15-10 (el mòbil amb el check-in i els tres passos) és a l'historial. El vídeo de la
  funció només és en castellà: a /ca també surt aquest.
- `/hostly-completo` (nova): «Los mensajes, las limpiezas, la policía. *Te olvidas.*» i el vídeo de
  /demo (en català a /ca). Primer hi havia el lema de la portada, i el Biel el va trobar «molt
  genèric»: el va voler «més punyent». El títol nou fa servir «te olvidas», que el Biel va aprovar el
  17-10, i segueix el ritme del check-in. /demo es queda com està.
- Totes dues, sense menú ni enllaços cap a fora (els legals, al peu), i fora del cercador (noindex).
- De moment, pensades per al mòbil, d'on ve la gent dels anuncis. A l'ordinador es veu la mateixa
  columna, centrada. El Biel ho vol així de moment (18-10). El disseny per a l'ordinador queda pendent.

**Com va** (`src/components/anuncis/VideoAmbFormulari.tsx`): el vídeo net amb el play a baix (que no
tapi el títol de la portada); en prémer-lo, el vídeo creix i la targeta del formulari surt a sobre,
amb el vídeo en marxa per sota, borrós i sense so; els pisos comencen a 1. En enviar-lo, el vídeo es
destapa i comença amb so **dins del mateix clic** (la comprovació bona del telèfon i el desat van
just després; si no, el mòbil no el deixa sonar). La creu torna al play. A sota del vídeo, la frase
amb els seus pisos i el pas següent; quan el vídeo s'acaba, el mateix pas surt a sobre:
- check-in: «Empieza gratis, sin tarjeta» → l'alta gratuïta de l'app;
- Completo: «¿Te llamamos y dejamos tus N pisos listos contigo?» amb la foto del Biel i «Sí,
  llamadme» (de 21 a 9, «Llamadme mañana»). Cap botó per començar el Complet sol.

**On van els contactes.** Com el pas 1 de /empezar (`web_lead_desa`, origen `empezar`), amb el pla de
la pàgina i `answers.pisos`: l'avís de Telegram surt al cap de 2 minuts (nom, telèfon, pla, pisos i
«Ve de» amb l'adreça de la landing) o de seguida si demana la trucada, que es desa com «Llamadme
ahora» de /empezar. Sense tocar la base de dades. Als anuncis: prémer el play és `VerVideo` (per
tornar a ensenyar l'anunci a qui no va deixar les dades), el formulari és `Lead`, crear el compte és
`EmpezarGratis` i la trucada, `Schedule`.

**La prova:** `scripts/revisio/prova-anuncis.cjs` fa el recorregut sencer al mòbil i a l'ordinador
(sense desar res: la crida a `web_lead_desa` es contesta al navegador). Les dues adreces també són a
`revisio-web` i a `prova-amplada`. L'estil és a `portada.css` (`.pt-ad-*`); l'alçada del vídeo surt de
l'amplada de la columna (unitats de contenidor), i la columna porta `.contenidor.pt-ad-columna` perquè
la regla general de `.contenidor`, que es carrega després, no li torni a posar l'amplada de tot el web.

## Preguntes obertes per al Biel

1. **Segon cognom i adreça fiscal** per a l'avís legal (LSSI art. 10): `src/lib/titular.ts`.
2. **IVA**: els termes diuen que els preus l'inclouen; les targetes no ho diuen. ¿40 € IVA
   inclòs o + IVA?
3. **Preus dinàmics**: ¿el cost de l'eina de preus va inclòs en els 40 €? El web només diu «precios
   dinámicos» i no promet res més. El nom de l'eina no surt enlloc (13-10).
4. **Referits**: he posat que compten els propietaris que entren a **Hostly Completo** (amb el
   pla gratis, 5 altes gratuïtes regalarien un pis per sempre). ¿Correcte?
5. **Reserves directes amb Stripe**: el web deia que Hostly té motor de reserves propi amb
   Stripe. Ara diu «web propia con reservas directas, a medida». ¿Es pot vendre ja de sèrie?
6. **Cobrar la taxa amb targeta**: el web diu «una pequeña comisión, que puede pagar el
   huésped». ¿Quant és?
7. **Preu de «Conéctalo todo»** (les automatitzacions a mida).
8. «Déjame tu número y te llamo, normalmente el mismo día» (abans «te llamo hoy»). ¿D'acord?
9. **Encàrrec del tractament** (dades dels hostes, art. 28 RGPD): hi ha una clàusula nova als
   termes (apartat 11), amb els punts de l'art. 28.3, i el desistiment de 14 dies per a
   consumidors. Convé que la miri un assessor. Atenció: si les converses reals dels hostes
   serveixen per avaluar o millorar la IA (el joc de proves de l'avaluació en surt), això no és
   «només per prestar-te el servei» i cal dir-ho i tenir-ne base legal.
10. Fotos i vídeos reals de gestors (amb permís) i una foto del Biel (ara surt una «B»).
11. **El missatge de preu.** Amb els preus reals de la competència, Hostly **no sempre surt més
    barat**: Chekin + Smoobu per a 1 pis fan uns 400 €/any i Hostly Completo, 480 €; Icnea
    costa menys a partir de 4 pisos. El web ja no diu el contrari: l'argument és que el
    check-in i la policia són gratis per sempre i que tot és en una app (IA, neteges,
    finances), més el temps que estalvia (la calculadora ho compta en hores). ¿Aquest és el
    missatge que vols, o es revisa el preu?
12. **«Partner oficial de» Airbnb, Booking i Google.** Les insígnies es queden (decisió teva),
    però el partner oficial és Tokeet/Sympl, per on Hostly es connecta, no Hostly directament.
    Si no hi ha acord propi, dir-ne «partner» pot ser publicitat enganyosa (LCD art. 21). A la
    versió 11 el text diu «Conectado con» (es desfà amb un `git revert`). Si Hostly és partner
    de debò, torna-ho a posar.
13. **La calculadora demana el telèfon per veure el detall.** Ara el text diu que, en enviar-lo,
    acceptes que et truquem. Condicionar el detall al telèfon pot no ser un consentiment
    «lliure» (RGPD 7.4): l'alternativa és deixar veure el detall i demanar el telèfon a part.
14. **Netejadores**: el web diu que, a l'app, cadascú veu el seu. Segons l'estudi de seguretat
    (ajornat), una netejadora encara pot llegir per l'API les reserves i els DNI dels seus pisos.
    Convé tancar-ho abans de vendre a gestors nous.
15. **Telegram rep les dades dels contactes del web** (nom, telèfon, correu, pla, respostes de
    la calculadora) perquè puguis trucar al moment. Telegram és fora de l'Espai Econòmic Europeu
    i no signa contracte d'encarregat del tractament; i els missatges no s'esborren als 12 mesos
    que promet la política. La política ja diu el que rep, però el buit legal hi és. Opcions:
    (a) que l'avís de Telegram no porti dades personals («contacte nou») i les miris en un lloc
    amb contracte (la BD, l'app o un correu d'un proveïdor europeu); (b) deixar-ho com està
    assumint el risc. Recomano (a), amb un enllaç directe al contacte.

## Pendents

> **Retargeting (versió 16):** el codi és fet i provat però apagat fins que hi hagi els
> identificadors de Meta i de Google Ads a Vercel. Què has de fer, pas a pas:
> `docs/SEGUIMENT-I-RETARGETING.md`.

1. **Cal.com** al servidor (Easypanel) en lloc de l'hora desada a mà.
2. **A l'app** (web i nativa, al unison): el telèfon com a segon camp de l'alta, i el botó
   «Quiero Hostly completo» que porta a la demo. Omplir l'alta amb les dades de `/empezar`.
3. Els articles del blog en català (ara surten en castellà amb un avís; la canònica és la
   castellana).
4. Adreces en català (`/ca/precios` → `/ca/preus`…), amb redireccions.
5. Revisar la informació legal general del blog (dates del RD 933/2021, sancions, trams de la
   taxa).
6. **El vídeo de /demo** (`public/assets/demos/hostly-demo.mp4`, 60 s, fet amb Remotion) mostra
   l'app d'abans i diu «Taxa turística · 1r trimestre 2026», quan la taxa de Catalunya es
   presenta per semestres.
   Cal tornar-lo a renderitzar amb l'app d'ara.
7. **Detalls de disseny** que va trobar la revisió visual i no s'han tocat (són de criteri):
   hi ha tres estils de preguntes freqüents (portada, funcionalitats i preus) i la secció del
   fundador apareix amb un fos lligat a l'scroll. (Els marges esquerres diferents de les
   funcionalitats: resolts a la versió 15, `docs/MAQUETACIO.md`.)
8. **Pes de la primera càrrega**: totes les traduccions (castellà i català, 22 fitxers, 200 KB)
   van dins de `index-*.js` (410 KB, 129 KB comprimit). Carregar només l'idioma i els espais
   de noms de cada pàgina (`i18next-resources-to-backend` + `import()`) en trauria uns 50 KB
   comprimits. Cal una vora de Suspense i provar que no parpelleja.
