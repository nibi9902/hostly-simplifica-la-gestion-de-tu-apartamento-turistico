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
   substitueix (check-in 15 €, channel manager 20 €, preus 20 €, per pis i mes).
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
- `tsc` del projecte ja tenia 14 errors abans d'aquesta feina (blog, SEO, demos, legals); el
  `build` de Vite no en depèn. Aquesta feina no n'afegeix cap.
- `useFeatures` pesa 823 kB perquè `FeaturePage` importa totes les icones de lucide
  (`import * as icons`). Pendent.

## Pendents i oberts

1. **Portada**: reordenar-la en 9 seccions (fora «Compliance» duplicat, targetes de 7 a 6 —
   fora «Cierra el ChatGPT» i la del coach amb la Laura i la Marta—, escurçar el tram buit de
   l'entrada).
2. **Unificar l'aspecte amb l'app**: una sola tipografia, tot el que es prem en píndola, els
   colors de l'app (avui el web té el seu propi blau i un taronja d'accent).
3. **Les 10 pàgines de funcionalitats**: corregir les afirmacions falses (SES automàtic,
   Ertzaintza, signatura digital, PriceLabs «integrado», «Sin burocracia»…). I `public/llms.txt`.
4. **Legals**: bàner de galetes (GA4 s'activa sense consentiment), NIF i adreça a l'avís
   legal, els contactes del web a la política de privacitat, els referits als termes.
5. **Cal.com** al servidor (Easypanel) en lloc de l'hora desada a mà.
6. **A l'app** (web i nativa, al unison): el telèfon com a segon camp de l'alta, i el botó
   «Quiero Hostly completo» que porta a la demo. Omplir l'alta amb les dades de `/empezar`.
7. El preu de «Conéctalo todo».
