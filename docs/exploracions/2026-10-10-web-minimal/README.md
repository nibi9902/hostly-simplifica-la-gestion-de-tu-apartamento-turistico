# Exploració · la web, minimal (10-10-2026)

> **Encàrrec del Biel (10-10-2026):** «vull que apart redissenyem una mica la idea de la web… que
> sigui minimal, i que tingui a veure amb la plataforma i el redisseny que hem fet; observa i
> utilitza les fotos que et vaig passar i dona'm 3 mockups diferents de com faries les diferents
> parts de la web… abans de res pensa en quines parts creus que hauria de tenir el web».
>
> **On es veu:** el llenç https://claude.ai/artifact/Hm7ESQLfTJeZJ2vHuL5aTs (privat: només el
> Biel; per ensenyar-lo cal compartir-lo des del menú «Share»).
>
> **És apart:** no toca la web de la branca (versió 17) ni `main`. Aquí només hi ha la còpia dels
> fitxers del llenç.

## Què hi ha al llenç

- **`Main.dc.html` · Les parts del web.** La portada en sis pantalles (entrada, què fa sol, el
  ganxo gratis, preus, confiança, tancament), les pàgines (funcionalitats ×8, cómo funciona,
  precios, empezar, para quién ×4, recursos, sobre Hostly, legal ×4), les peces de tot arreu
  (capçal amb el menú d'ara, un sol botó «Empezar», el telèfon primer, peu, galetes, mòbil) i el
  recorregut (Empezar → telèfon → pla → compte gratis o hora de la trucada).
- **Tres direccions, en columnes**, cadascuna amb les mateixes quatre parts (inici · una
  funcionalitat: el check-in i la policia · Empezar · tres pantalles de mòbil):

| | Idea | Què hi mana |
|---|---|---|
| **A · La finestra** | La web és el Resum de l'app: el menjador a tota pantalla, amb la llum de l'hora del visitant (matí, tarda, nit, pluja). «Todo va solo.» | La foto i el vidre |
| **B · L'aparador** | L'app de debò és la protagonista (ordinador i telèfon), amb el lema de sempre i les cinc portes de l'app com a pestanyes | El producte |
| **C · Un dia amb Hostly** | La web explica un dia, hora a hora: 08:00 reserva, 11:00 neteja, 19:40 arribada, 22:15 avaria, 23:47 el wifi | La història i l'hora |

Interactiu (botó Play del llenç): a A la llum de la foto; a B les cinc portes i les tres peces de
la funcionalitat; els tres Empezar es poden recórrer sencers.

Es manté de les decisions del 09-10: un sol botó «Empezar», el telèfon abans que el correu, Gratis
(check-in + policia) i Completo (40 €, 35 € des de 5, el primer mes gratis, es contracta a la
trucada), els vídeos «Gestor 1-3 · Ejemplo», el Biel amb la seva frase de la web, «Conectado con»
amb les insígnies, i les xifres estàtiques (només a B). Fets del check-in comprovats contra
`~/Desktop/Hostly/coneixement/03-funcionament/checkin-mossos-i-taxa.md` (Mossos cada dia a les
15:00 amb comprovant, taxa semestral de l'1 al 20 d'abril i d'octubre, cobrament amb targeta
opcional, comissió del gratuït 0,25 € + 5 %). La demo de dies salta el 12 d'octubre (festiu).

## Les fotos (pujades al llenç)

| Foto | Al llenç | D'on surt |
|---|---|---|
| Menjador, dia / capvespre / nit / pluja | `/_blob/5e3adeea…`, `866e693d…`, `2ba8da52…`, `a0b96243…` | `apps/web/public/cel/cel-*.jpg` (el fons del Resum, triat el 02-10) |
| Menjador vertical, dia / nit / capvespre | `91b729d6…`, `da1886bc…`, `6c334a21…` | `~/hostly-videos/01-legal/kit/assets/menjador-*-916.jpg` |
| Arbre, dia / capvespre / pluja | `8305486f…`, `ab5218e3…`, `b59fc021…` | SeaDrive · `Biel Alsina Illa/Hostly/fotos hostly background/` |
| Sala amb vistes al bosc | `e4b72dde…` | SeaDrive · `Fotos/2026/image99.png` |
| Logotip, icona de l'app, Airbnb, Booking, insígnies | `3fb0ded8…`, `e157402e…`, `47cae697…`, `effe796b…`, `27cba136…`, `2861b099…`, `d0939e9a…` | `~/hostly-videos/…/assets`, `src/assets/badge-*.png` |

## Com es torna a obrir o es canvia

Els `.dc.html` són el format del llenç de disseny de Claude (no són pàgines de la web). Per canviar
un artboard: editar el fitxer de `project/` i publicar-lo al mateix llenç (la `url` de dalt) amb
`root` = aquesta carpeta. Les direccions no es construeixen a la web fins que el Biel en triï una
(o una barreja).
