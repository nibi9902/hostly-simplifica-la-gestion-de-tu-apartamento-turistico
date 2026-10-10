# Seguiment i retargeting

> **Encàrrec del Biel (10-10-2026):** «hem de mirar de tenir alguna opció per trackejar la gent
> que entra i demés per després fer-li retargeting o similar».
>
> **Estat (versió 16):** el codi és a punt i provat, però **apagat**. S'encén sol quan hi hagi
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

## Què fa el web (versió 16)

- **Bàner de galetes amb dues finalitats**: «Rechazar», «Aceptar» i «Configurar» al primer
  nivell; a «Configurar», un interruptor per a **Analítica** i un per a **Publicidad**, tots dos
  apagats (`src/components/AvisGaletes.tsx`).
- **Sense «Publicidad» acceptada no es carrega res** de Meta ni de Google Ads. Si algú ho havia
  acceptat i després ho rebutja («Cambiar mis preferencias»), es tanca l'aixeta i s'esborren les
  galetes `_fbp`, `_fbc` i `_gcl_*` (`src/lib/seguiment.ts`, `src/lib/galetes.ts`).
- **Mode de consentiment v2 de Google**: tot denegat per defecte; s'obre només el que s'accepta.
- **Què s'envia** (només el nom de l'esdeveniment, mai el telèfon, el correu ni les respostes):

  | Al web | Meta | Google Ads |
  |---|---|---|
  | Cada pàgina vista | `PageView` | `page_view` |
  | Deixa el telèfon (`/empezar`, calculadora, «Llámame») | `Lead` | conversió «Contacto» (si hi ha l'etiqueta) |
  | Tria hora per a la demo | `Schedule` | — |
  | Va a crear el compte gratis | `EmpezarGratis` (propi) | — |
  | Acaba la calculadora | `Calculadora` (propi) | — |

- El píxel va **sense «configuració automàtica»** (`autoConfig` apagat): no llegeix sol els
  botons ni els formularis.
- Qui arriba d'un anunci: es desa amb el contacte de quin anunci ve (`gclid` de Google, ja hi
  era, i ara `fbclid` de Meta), per saber quins anuncis porten clients.
- **Les polítiques** de galetes i de privacitat expliquen la publicitat, les galetes i qui rep les
  dades (Meta Platforms Ireland i Google Ireland) **només quan està activa**. Sense
  identificadors, no en diuen res (seria fals).
- **La prova**: `scripts/revisio/prova-publicitat.cjs` (34 comprovacions, amb un segon servidor
  amb identificadors de prova; res surt cap a Meta ni Google de debò).

## El que has de fer tu (Biel)

1. **Meta**
   1. business.facebook.com → **Events Manager** → **Connecta dades** → **Web** → nom
      «hostlylabs.com» → copia l'**identificador del conjunt de dades** (15–16 xifres).
   2. A la configuració del conjunt de dades, **apaga la «coincidència avançada automàtica»**
      (*Automatic advanced matching*). Si queda encesa, el píxel podria enviar a Meta el telèfon i
      el correu dels formularis, i la política diu que no.
   3. **Verifica el domini** hostlylabs.com (Configuració del negoci → Seguretat de la marca →
      Dominis). Cal per a les campanyes i per mesurar els iPhone.
2. **Google Ads**
   1. ads.google.com → **Objectius → Conversions** → nova → **Lloc web** → «Contacto»
      (categoria *Envia un formulari de contacte*) → configurar **amb l'etiqueta de Google**.
   2. Copia l'**identificador** (`AW-…`) i l'**etiqueta de la conversió** (el tros després de la
      barra a `send_to: 'AW-…/…'`).
   3. Deixa **apagades les «conversions millorades»** (*enhanced conversions*), pel mateix motiu
      que la coincidència avançada de Meta.
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
