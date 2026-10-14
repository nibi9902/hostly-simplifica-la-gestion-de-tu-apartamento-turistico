# Seguiment i retargeting

> **Encàrrec del Biel (10-10-2026):** «hem de mirar de tenir alguna opció per trackejar la gent
> que entra i demés per després fer-li retargeting o similar».
>
> **Estat (versió 17):** el codi és a punt i provat, però **apagat**. S'encén sol quan hi hagi
> els identificadors de Meta i/o de Google Ads a Vercel (més avall, pas a pas). Sense
> identificadors, el web és exactament el de la versió 15.

## Què és el retargeting

Tornar a ensenyar Hostly, en anuncis, a qui ja ha entrat al web: a Instagram i Facebook (Meta)
i a Google i YouTube. Perquè Meta i Google sàpiguen qui ha entrat, el web ha de carregar el seu
codi (el **píxel de Meta**, l'**etiqueta de Google Ads**), que deixa una galeta al navegador.
Amb això també es veu quins anuncis porten contactes (telèfons deixats, demos demanades).

## Les opcions

| Opció | Per a què | Recomanació |
|---|---|---|
| **Meta: píxel** | Públics de qui ha visitat el web (p. ex. «ha mirat preus i no ha deixat el telèfon»), anuncis a Instagram i Facebook, i saber quins anuncis porten contactes | **Sí.** El propietari de 35–65 anys és a Facebook i Instagram |
| **Google Ads: etiqueta** | Llistes de remàrqueting per a la Xarxa de Display i YouTube, i la conversió «Contacto» per a les campanyes de cerca | **Sí**, sobretot si es fan anuncis de cerca («software apartamentos turísticos») |
| Google Analytics → Google Ads | Importar públics de GA4 (ja el tenim) a Google Ads | Es pot fer des del panell de GA4 sense tocar el web, però amb l'etiqueta de Google Ads és més directe |
| LinkedIn Insight, TikTok | Gestors professionals (LinkedIn), públic jove (TikTok) | No ara: s'afegeixen igual quan calgui |
| Servidor a servidor (API de conversions de Meta, conversions offline de Google) | Més precís (no el bloquegen els bloquejadors) i permet pujar «aquest contacte s'ha fet client» | Més endavant: cal un token i decidir-ho legalment (el contacte del formulari no ha acceptat que les seves dades vagin a Meta) |

## Què fa el web (versió 17)

- **Bàner de galetes amb dues finalitats**: «Rechazar», «Aceptar» i «Configurar» al primer
  nivell; a «Configurar», un interruptor per a **Analítica** i un per a **Publicidad**, tots dos
  apagats (`src/components/AvisGaletes.tsx`).
- **Sense «Publicidad» acceptada no es carrega res** de Meta ni de Google Ads. Si algú ho havia
  acceptat i després ho rebutja («Cambiar mis preferencias»), es tanca l'aixeta i s'esborren les
  galetes `_fbp`, `_fbc` i `_gcl_*` (`src/lib/seguiment.ts`, `src/lib/galetes.ts`).
- **Mode de consentiment v2 de Google**: tot denegat per defecte; s'obre només el que s'accepta.
- **Què s'envia** al píxel (el nom de l'esdeveniment, mai les respostes de la calculadora; el
  telèfon, el correu i el nom només xifrats, vegeu la coincidència avançada i l'API de conversions):

  | Al web | Meta | Google Ads |
  |---|---|---|
  | Cada pàgina vista | `PageView` | `page_view` |
  | Deixa el telèfon (`/empezar`, calculadora, «Llámame») | `Lead` | conversió «Contacto» (si hi ha l'etiqueta) |
  | Tria hora per a la demo | `Schedule` | — |
  | Va a crear el compte gratis | `EmpezarGratis` (propi) | — |
  | Acaba la calculadora | `Calculadora` (propi) | — |
  | Mira un vídeo de `/demo` (13-10-2026) | `VerVideo` (propi) | — |

- El píxel va **sense «configuració automàtica»** (`autoConfig` apagat): no compta sol els clics
  dels botons; els esdeveniments són els de la taula.
- **Coincidència avançada automàtica, encesa** (decisió del Biel, 13-10-2026: «volem el millor
  píxel possible»): si qui ha acceptat la publicitat escriu el telèfon o el correu en un
  formulari, Meta els rep codificats i reconeix més visites. Les polítiques de galetes i de
  privacitat ho diuen (només quan el píxel és actiu). Camps: correu, nom, cognoms, telèfon,
  població, província, codi postal, país i identificador extern.
- **API de conversions, feta** (el Biel, 14-10-2026: «sí, fes l'API de conversions»). El `Lead` i el
  `Schedule` surten del navegador cap al píxel i, a la vegada, cap al nostre servidor
  (`api/esdeveniment.js`, una funció de Vercel), que els passa a Meta. Porten el **mateix identificador**
  (`eventID` al píxel, `event_id` a l'API), i així Meta no els compta dues vegades. Del navegador
  surten ja **xifrats** (SHA-256): el telèfon amb el prefix i només xifres, el correu i el nom en
  minúscules, i l'identificador del visitant. El servidor hi afegeix l'adreça IP i el navegador, i les
  galetes `_fbp`/`_fbc`. Tot plegat **només amb la publicitat acceptada**. Sense el testimoni
  (`META_CAPI_TOKEN`), la funció no fa res. Les polítiques ho diuen.
  *Per què:* Meta compta els contactes que el píxel perd (bloquejadors, Safari) i aprèn millor a qui
  ensenyar els anuncis. Segons Meta, de mitjana, un 17,8 % menys de cost per resultat que sense.
- **Les pàgines vistes les compta el web**, una per canvi de pàgina, igual a Meta que a Google Ads.
  Al píxel s'hi posa `disablePushState` i `allowDuplicatePageViews`; sense, el píxel mirava sol
  l'historial del navegador i comptava també cada clic a l'índex dels articles (comprovat al
  `fbevents.js` del 10-10-2026). *(Versió 17.)*
- **Google Analytics no passa res a Google Ads.** Els esdeveniments del web (`track()`) van amb
  `send_to` cap a Analytics: sense, quan també hi ha Google Ads, gtag els enviava a tots dos amb
  els seus paràmetres (el resultat de la calculadora, el dia triat per a la demo). *(Versió 17.)*
- **El sí o el no val per a les eines d'aquell moment.** La resposta es desa amb les eines que hi
  havia (`"eines": "meta+google"`): si després se n'hi afegeix una (p. ex. Google Ads quan ja hi
  havia Meta), es torna a preguntar. I mentre no hi hagi cap identificador, no es desa cap «no» a
  la publicitat: quan s'hi posin, es preguntarà a tothom, també a qui ja havia respost el bàner
  d'analítica. *(Versió 17; a la 16, aquestes persones quedaven com si haguessin dit que no.)*
- Qui arriba d'un anunci: es desa amb el contacte de quin anunci ve (`gclid` de Google, ja hi
  era, i ara `fbclid` de Meta), per saber quins anuncis porten clients.
- **Les polítiques** de galetes i de privacitat expliquen la publicitat, les galetes i qui rep les
  dades (Meta Platforms Ireland i Google Ireland) **només quan està activa**. Sense
  identificadors, no en diuen res (seria fals).
- **La prova**: `scripts/revisio/prova-publicitat.cjs` (46 comprovacions; quatre són de l'API de
  conversions: mateix identificador, dades xifrades com demana Meta, res en clar i res sense
  publicitat acceptada; amb un segon servidor
  amb identificadors de prova, millor el web construït; res surt cap a Meta ni Google de debò).
  Amb el codi de la versió 16 en falla 5: les de les tres esmenes de dalt.

## El que has de fer tu (Biel)

1. **Meta**
   1. ✅ Fet el 13-10-2026: el píxel «hostlylabs pixel» (`1924919248483047`), al portfoli de Hostly.
      `VITE_META_PIXEL_ID` és a Vercel només per a la previsualització de la branca
      `redisseny-2026-10`; en publicar, cal afegir-lo a *Production*.
   2. ✅ La «coincidència avançada automàtica», **encesa** (vegeu més amunt).
   3. **Verifica el domini** hostlylabs.com (Configuració del negoci → Seguretat de la marca →
      Dominis). Cal per a les campanyes i per mesurar els iPhone.
   4. ✅ **El testimoni de l'API de conversions.** Fet el 14-10: és a Vercel com a `META_CAPI_TOKEN`
      (*Sensitive*, *Preview* i *Production*) i a `~/.config/hostly/meta_capi_token`. Meta l'accepta per
      al píxel; la previsualització s'ha tornat a desplegar i hi han passat dos `Lead` de prova
      (`prova-capi-14-10-001` i `-002`). Si mai s'ha de tornar a generar:
      1. Events Manager → «hostlylabs pixel» → **Configuració** → apartat *API de conversions* →
         **«Generar identificador de acceso»** (o *Generate access token*). Copia'l.
      2. Desa'l a `~/.config/hostly/meta_capi_token` (com la clau d'n8n: `chmod 600`) i digues-m'ho:
         el poso a Vercel com a `META_CAPI_TOKEN` (*Sensitive*, *Preview* i *Production*). O posa'l tu
         directament a Vercel → Settings → Environment Variables. No me'l enganxis al xat.
      3. Per veure-ho arribar sense comptar-ho: Events Manager → **Probar eventos** → copia el codi
         (`TEST…`). Va a `META_CAPI_TEST_CODE`, només a *Preview*.
      4. Després, cal tornar a desplegar. A l'Events Manager, els `Lead` sortiran «Navegador y servidor»
         i «Desduplicado».
2. **Google Ads**
   1. ads.google.com → **Objectius → Conversions** → nova → **Lloc web** → «Contacto»
      (categoria *Envia un formulari de contacte*) → configurar **amb l'etiqueta de Google**.
   2. Copia l'**identificador** (`AW-…`) i l'**etiqueta de la conversió** (el tros després de la
      barra a `send_to: 'AW-…/…'`).
   3. Les **«conversions millorades»** (*enhanced conversions*) són l'equivalent de la coincidència
      avançada de Meta: per tenir-les, cal dir-ho a les polítiques com s'ha fet amb Meta.
3. **Passa'm els identificadors** (o posa'ls tu a Vercel → Settings → Environment Variables,
   entorn *Production* i *Preview*):
   `VITE_META_PIXEL_ID` · `VITE_GOOGLE_ADS_ID` · `VITE_GOOGLE_ADS_LEAD_LABEL`.
   Es pot posar només un dels dos (només Meta o només Google): el bàner i les polítiques s'hi
   adapten soles. Després d'afegir-los, cal tornar a desplegar.
4. Als comptes de publicitat, crea els públics: «visitants dels últims 30 dies», «han vist
   `/precios` i no han fet `Lead`», etc.

## Legal, en resum

- Les galetes de publicitat necessiten **consentiment previ i informat**: «Rechazar» tan a mà com
  «Aceptar», poder triar per finalitat i poder-ho canviar (art. 22.2 LSSI; guia de galetes de
  l'AEPD). És el que fa el bàner.
- Meta i Google també són responsables de les dades que reben; i les poden tractar als EUA
  (Marc de Privacitat de Dades UE-EUA). La política de privacitat ho diu quan la publicitat és
  activa.
- **Qui rebutja no entra a cap públic.** El retargeting arribarà només a la part dels visitants
  que ho accepti (sovint la meitat o menys).
