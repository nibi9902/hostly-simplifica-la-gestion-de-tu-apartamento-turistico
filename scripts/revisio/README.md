# Revisió del web (redisseny d'octubre 2026)

Proves que es passen abans de donar una versió per bona. Necessiten el web en marxa
(`npm run dev -- --port 8094`; mai el 8080) i Chrome instal·lat (Playwright fa servir el
canal `chrome`). Cap de les proves escriu a la base de dades: les crides a `web_lead_desa`
es contesten al mateix navegador.

| Prova | Què mira | Com |
|---|---|---|
| `revisio-web.cjs` | Totes les pàgines × ES/CA × 1440/390: errors, enllaços interns, desbordament al mòbil, h1, imatges sense alt, camps aixafats, textos prohibits (el que no és cert), paraules de l'altra llengua (també a les vistes amagades de les demos), claus de traducció a la vista, botons amb etiquetes velles, SEO (una sola descripció i canònica, `<html lang>`). Desa una captura per pàgina i `resum.json`. | `node revisio-web.cjs <carpeta>` · només unes rutes: `NOMES_RUTES=",/precios" node …` (la coma inicial = portada) |
| `prova-embut.cjs` | El recorregut: «Empezar» → /empezar (telèfon, pla, demo), /calcula, «Llámame», redireccions, alçada dels camps de telèfon. | `node prova-embut.cjs <carpeta-captures>` |
| `prova-galetes.cjs` | Bàner de galetes: GA4 només amb «Aceptar», «Rechazar» no carrega res, «Cambiar mis preferencias». | `node prova-galetes.cjs <carpeta>` |
| `prova-reemplaza.cjs` | La tira de «Lo que reemplaza»: 6 pestanyes, avança sola, s'atura en tocar-la, teclat, lliscar al mòbil, l'alçada no salta. | `node prova-reemplaza.cjs <carpeta>` |
| `captures-visuals.cjs` | Un exemple de cada plantilla de pàgina, sencer i a trossos (1440 i 390), per mirar-ho amb ulls: solapaments, textos tallats, columnes aixafades, coses desquadrades. | `node captures-visuals.cjs <carpeta>` |
| `prova-amplada.cjs` | La caixa del web (`docs/MAQUETACIO.md`): tot el contingut a la mateixa línia (R1), res fora (R2), cap secció que comenci més endins (R3), cap columna estreta al mig a l'ordinador (R4), 20 px al mòbil i res que surti per la dreta (R5). 31 pàgines × 1280/1440/1920/390/360. | `node prova-amplada.cjs [carpeta]` (captura les que fallen) · `AMPLADES=1440 NOMES_RUTES=/es/blog node …` |
| `prova-publicitat.cjs` | Retargeting (`docs/SEGUIMENT-I-RETARGETING.md`): sense identificadors, el web no parla de publicitat; amb identificadors (segon servidor al 8096), res abans de respondre, «Rechazar» i «Configurar» respectats, Meta i Google Ads només amb «Aceptar», pàgines vistes i `Lead` sense dades personals, i en rebutjar després s'esborren les galetes; els esdeveniments d'Analytics no van a Google Ads; el píxel no compta pàgines pel seu compte; una resposta només val per a les eines que hi havia (42 comprovacions). | Amb `export VITE_META_PIXEL_ID=000000000000001 VITE_GOOGLE_ADS_ID=AW-000000001 VITE_GOOGLE_ADS_LEAD_LABEL=prova`: `npx vite build --outDir /tmp/web-publi --emptyOutDir`, `npx vite preview --outDir /tmp/web-publi --port 8096 --strictPort --host 127.0.0.1` i `node prova-publicitat.cjs` (amb `npx vite` en comptes del web construït, una comprovació se salta) |
| `textos-web.cjs` + `idioma-scan.py` | Treu tot el text visible de cada pàgina (per revisar-ne la coherència) i hi busca paraules de l'altra llengua. | `node textos-web.cjs textos-es.md es` · `python3 idioma-scan.py textos-es.md textos-ca.md` |

Una altra adreça: `REVISIO_BASE=http://127.0.0.1:8095 node …`.

Quan una prova falla per un canvi volgut (un text nou, un preu nou), es canvia la prova en el
mateix commit i es diu per què.
