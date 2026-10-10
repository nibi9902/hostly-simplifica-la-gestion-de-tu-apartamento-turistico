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
   - **Dades**: telèfon, nom i correu. El telèfon es normalitza amb la mateixa regla que
     l'app (`libphonenumber`, E.164 sense «+»; la llibreria es carrega només en enviar).
     Es desa abans de continuar.
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

## Preguntes obertes per al Biel

1. **Segon cognom i adreça fiscal** per a l'avís legal (LSSI art. 10): `src/lib/titular.ts`.
2. **IVA**: els termes diuen que els preus l'inclouen; les targetes no ho diuen. ¿40 € IVA
   inclòs o + IVA?
3. **PriceLabs**: ¿la subscripció de PriceLabs va inclosa en els 40 €? El web diu «con PriceLabs
   integrado» i no promet res més.
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
   presenta per semestres; i atribueix l'ajust de preus a «Hostly Automàtic» (el fa PriceLabs).
   Cal tornar-lo a renderitzar amb l'app d'ara.
7. **Detalls de disseny** que va trobar la revisió visual i no s'han tocat (són de criteri):
   a les pàgines de funcionalitats, el títol, «El problema» i la resta comencen a tres marges
   esquerres diferents; hi ha tres estils de preguntes freqüents (portada, funcionalitats i
   preus); i la secció del fundador apareix amb un fos lligat a l'scroll.
8. **Pes de la primera càrrega**: totes les traduccions (castellà i català, 22 fitxers, 200 KB)
   van dins de `index-*.js` (410 KB, 129 KB comprimit). Carregar només l'idioma i els espais
   de noms de cada pàgina (`i18next-resources-to-backend` + `import()`) en trauria uns 50 KB
   comprimits. Cal una vora de Suspense i provar que no parpelleja.
