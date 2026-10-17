# Maquetació del web · la caixa, l'ordinador i el mòbil

> **Encàrrec del Biel (10-10-2026):** «revisa que utilitzem en tot moment l'ample de l'ordinador,
> o sigui hi ha vegades que la pàgina es veu com que està tallada o que té uns marcs NO correctes;
> a part també haurem de definir com es veu a mòbil això».
>
> **La regla, en una frase:** tot el contingut de totes les pàgines (capçal, seccions i peu)
> comença i acaba a la mateixa línia. Els fons van d'una vora a l'altra de la pantalla; el
> contingut, dins de la caixa.

## Què passava (mesurat el 10-10-2026, versió 14)

- Cada secció triava la seva amplada: 768, 896, 1024, 1152 o 1200 px (`max-w-3xl` … `max-w-6xl`,
  més `px-6 md:px-12 lg:px-20`). El capçal en tenia una altra (1088 px) i el peu una altra (1152).
- A 1920 px, la portada tenia **9 vores esquerres diferents** (de 384 a 682 px): el contingut feia
  salts d'una secció a l'altra. Aquest era el «marc no correcte».
- Les pàgines interiors només ocupaven entre el **30 i el 45 %** de la pantalla; els articles i
  els legals, una columna de 768 px al mig. Aquesta era la «pàgina tallada».
- Les entrades dels perfils («Para quién») eren només text: mitja pantalla buida.

## La caixa

| | Mòbil (< 640) | Tauleta (640–1023) | Ordinador (1024–1279) | Ordinador gran (≥ 1280) |
|---|---|---|---|---|
| Marge a cada costat | **20 px** | 32 px | 48 px | 64 px |
| Amplada del contingut | pantalla − 40 | pantalla − 64 | pantalla − 96 | **fins a 1440 px** |

- Font única: `--web-ample` i `--web-marge` a `src/index.css`, i la classe **`.contenidor`**.
- Una secció = `<section className="py-… bg-…">` (el fons, d'una vora a l'altra) amb un
  `<div className="contenidor">` a dins. **Mai** `max-w-*xl mx-auto` + `px-*` en una secció.
- Dins de la caixa, el text llarg no passa de ~70 caràcters per línia (`max-w-[68ch]`,
  `max-w-[70ch]`, `max-w-[72ch]`): el que sobra de l'amplada s'omple amb columnes, no estirant
  les línies.
- Una fila que llisca amb el dit al mòbil (vídeos, pestanyes) fa servir **`.fins-a-la-vora`**:
  arriba a les vores de la pantalla, però la primera targeta comença a la línia.

## A l'ordinador: com s'omple l'amplada

| Patró | On | Com |
|---|---|---|
| **Text + demo** | entrada de les funcionalitats i dels perfils | text a l'esquerra, demo animada a la dreta (els perfils: IA de WhatsApp, calendari, missatges programats, check-in) |
| **Títol al costat** | el problema de cada funcionalitat, preguntes freqüents, perfils, «Sobre Hostly», capítols de la guia | títol (4–5 columnes de 12, es queda a la vista en baixar) i el contingut a la dreta |
| **Graella plena** | avantatges (3), casos (3), funcionalitats (3 × 3 + «Conéctalo todo» a sota), alternatives (4 × 2) | el nombre de columnes es tria perquè les files quedin plenes |
| **Preus** | `/precios` | els dos plans (8 columnes) i, al costat, «¿Prefieres hablarlo?», la calculadora i els referits; més estret, un sota l'altre |
| **La portada nova** (13-10-2026) | `/` | les seccions de la portada aprovada (`src/components/portada/`): la caixa de sempre, i a dins les mides de l'exploració. «Hostly está pendiente» és llista · pantalla · «1 cosa para ti» en tres columnes, amb la pantalla al centre de la pàgina (més petita entre 1296 i 1383 px); per sota de 1296 px, un sota l'altre. Els preus de la portada són els seus (dos plans i els referits a sota) |
| **Lectura** | articles del blog, pàgines legals | el text en la seva columna i, al costat, l'índex dels apartats (sap on ets) i «Empezar» o les altres pàgines legals |
| **Formulari** | `/empezar`, `/calcula` | el pas a l'esquerra (a la línia del logotip) i, al costat, «Cómo funciona» / «Cómo lo calculamos» |
| **Franja** | el blau del final de cada pàgina | el fons d'una vora a l'altra; el text, centrat dins de la caixa |
| **Peu** | totes | la marca a l'esquerra i quatre columnes (Producto, Para quién, Recursos, Hostly) |

## Al mòbil (< 768 px)

1. **20 px de marge a cada costat, a totes les pàgines.** Res surt per la dreta (ni enllaços
   llargs dins dels articles: `break-words`; ni taules: llisquen dins seu).
2. **Una columna.** Tot el que a l'ordinador va al costat va **a sota**, en l'ordre de lectura:
   títol → contingut → botó. Les columnes laterals que només acompanyen (la demo dels perfils,
   «Cómo funciona» de `/empezar`, «Cómo lo calculamos») **no surten**: al mòbil la pàgina ha de ser curta.
3. **L'índex** dels textos llargs: a les legals, un desplegable «Índice» abans del text; als
   articles, no cal (el text ja és el protagonista) i «Empezar» va al final.
4. **Files que llisquen** amb la vora de la següent a la vista, sempre començant a la línia de
   20 px.
5. **Botons principals a tota l'amplada** del contingut (entrada, preus, franja del final).
6. Els plans: **un commutador «Gratis · 0 € / Completo · 40 €» i un sol pla a la vista, el
   Completo d'entrada** (opció 6A del Biel, 17-10; abans, els dos plans un sota l'altre amb el
   Completo primer, decisió de la versió 09).
7. Capçal: el logotip a la línia, «Empezar» i el menú (☰) a l'altra vora; el menú obert fa
   servir els mateixos 20 px. **Se'n va mentre baixes i torna quan puges** (opció 1B, amb
   «Empezar», 17-10): dalt de tot sempre hi és (`useCapcalQueMarxa`, a `SiteHeader.tsx`).
8. **Les peces que a l'ordinador són una graella, al mòbil llisquen** (17-10): les quatre de
   «Gratis para siempre» (2A), les cinc rajoles del Completo amb les seves demos (3B), els passos
   de cada funcionalitat (8B, cadascun amb la seva mini pantalla: el camp `pantalla` de
   `features.ts` i `PantallaPas.tsx`), i «En la práctica» i «Funciona mejor con» (9A). Una sola
   peça per a totes: la classe `.pt-llisca` (només fa res per sota de 641 px), `useLliscador` i
   `PuntsLliscador` (els punts de sota; a 9A no n'hi ha). Les rodones de «Y además» van sempre
   en una sola fila: s'encongeixen, no salten de línia. **Una tira només llisca de costat**: cap peça
   hi entra d'una en una (amb l'entrada, pujaven 16 px mentre lliscaves i la tira es movia amunt i
   avall) i porta `overflow-y: hidden` (`useEsTira` diu quan les graelles són tires).
   Al Completo, **es mou la rajola que tens davant mentre el mòdul es veu**; el dit no la mou (a
   l'ordinador, el ratolí a sobre, com sempre).
9. **«Hostly está pendiente»**: en lloc de la U, dues targetes (el 8 i l'1) que canvien el que
   es veu a sota (opció 4C). La pantalla de l'app, a 320 px, no es llegia.
10. **El dit**: tot el que es toca fa com a mínim 44 px d'alt (capçal, peu, molles de pa,
    «Atrás», l'índex de les legals). Quan créixer moveria el text, l'enllaç creix cap enfora
    (`padding-block` + `margin-block` negatiu). Els enllaços dins d'una frase no es toquen.
11. **La lletra, mai per sota de 12 px.** Per pujar-la només al mòbil: `text-[11px]
    max-md:text-xs`, no `text-xs md:text-[11px]` (`text-xs` també posa l'alçada de línia i a
    l'ordinador canviava l'alçada de la pàgina).
12. La barra fixa de baix («Empieza gratis» i «Llámame») se'n va mentre escrius en un camp.
13. Les tres xifres de sota el 0 € (mensajes, registros, limpiezas), en una sola fila.
14. Un camp dins d'una píndola (el telèfon d'«Así se empieza» i el de «Llámame») no porta el
    rectangle blau del focus: s'il·lumina la píndola sencera (també a l'ordinador).
15. **Els vídeos de les funcionalitats** (17-10): a «Cómo funciona», al mòbil, el vídeo a tota
    l'amplada (16:9) i, a sota, els passos en targetes que llisquen i el segueixen. Els botons de
    sobre el vídeo («Escúchalo» i la pausa) fan 44 px. Cap vídeo va sol si la persona ha demanat
    menys moviment o estalvi de dades, ni abans que la pàgina hagi acabat de carregar; el que va sol
    sempre es pot aturar. A l'índex, al mòbil no hi ha «a sobre»: la miniatura es toca i el vídeo
    s'obre.

## Excepcions volgudes

- **L'entrada animada de la portada** (`CinematicHero`) ocupa tota la pantalla: `data-amplada="vora"`.
  La fase del telèfon sí que fa servir la caixa.
- **La 404** és un missatge al mig de la pantalla, sense capçal: `data-sense-caixa`.
- El vídeo de `/demo` es queda a 1024 px centrat (un vídeo més gran no cap amb el text a la vista).

## La prova

`scripts/revisio/prova-amplada.cjs` (31 pàgines × 1280, 1440, 1920, 390 i 360 px):

| Regla | Què enxampa |
|---|---|
| R1 línia | algun `.contenidor` amb unes vores diferents de la resta, o una pàgina sense caixa |
| R2 dins | text, imatge o botó fora de la línia (menys les files que llisquen i el `data-amplada="vora"`) |
| R3 comença | una secció alineada a l'esquerra que comença més endins que la línia (el «marc» de la v14) |
| R4 franja | a l'ordinador, una secció blanca que és una columna estreta al mig (`data-estret` si és volgut) |
| R5 mòbil | marges diferents de 20 px o una pàgina que surt per la dreta |

Resultat de la versió 15: **155/155**. A la versió 14 no es podia passar (cap pàgina feia servir la caixa).
