import type { Competitor } from './competitors';

// Mateixes comparatives que competitors.ts, en català. Si canvies una xifra o una afirmació
// allà, canvia-la també aquí (i al revés): els preus dels competidors són els de la seva
// pàgina oficial de preus, comprovats l'octubre del 2026.

// El que fa Hostly amb el registre de viatgers, dit igual a totes les comparatives.
const registreGratis =
  "Check-in online, registre de viatgers i taxa turística de Catalunya, gratis per sempre. Allà, Hostly envia el registre als Mossos cada dia, sense que hagis de fer res. A la resta d'Espanya, activem amb tu la connexió amb la policia que et toqui.";

// Quan no tenim una dada pública fiable d'una funció del competidor, no marquem ✗.
const consultar = 'Consultar';

export const competitorsCa: Competitor[] = [
  {
    slug: 'icnea',
    name: 'Icnea',
    tagline: "Hostly vs Icnea — L'alternativa moderna al PMS espanyol clàssic",
    target: 'Gestors de 5‑200 unitats a Espanya i Portugal',
    priceNote: "Icnea: des de 150 €/mes, fins a 10 propietats (preu publicat l'octubre del 2026) · Hostly: 40 €/mes per pis, 35 € a partir de 5",
    advantages: [
      { title: 'IA a WhatsApp', body: "La IA de Hostly contesta la majoria de missatges a l'instant, en l'idioma de l'hoste i les 24 hores, per l'API oficial de WhatsApp. Quan cal una persona, t'avisa." },
      { title: 'Preus amb PriceLabs integrat', body: 'PriceLabs recomana el preu de cada nit, tu hi poses mínims i temporades, i Hostly el publica a Airbnb i Booking cada dia.' },
      { title: 'App moderna i configuració amb tu', body: 'A Hostly Complet, el primer mes ho configurem tot amb tu en una videotrucada 1 a 1: pisos, canals i reserves.' },
      { title: 'Check-in i registre gratis', body: registreGratis },
      { title: 'Pagues per pis', body: '40 €/mes per pis, 35 € a partir de 5, sense comissions per reserva: amb un o dos pisos, pagues només per aquests. El primer mes, gratis.' },
    ],
    comparison: [
      { feature: 'IA a WhatsApp', hostly: true, them: consultar },
      { feature: 'Check-in i registre policial', hostly: 'Gratis per sempre', them: 'Sí' },
      { feature: 'Preus dinàmics', hostly: 'PriceLabs integrat', them: 'Via integració' },
      { feature: 'Configuració 1 a 1 inclosa', hostly: 'Amb Hostly Complet', them: consultar },
      { feature: 'Preu amb 1 pis', hostly: '40 €/mes', them: '150 €/mes (fins a 10)' },
      { feature: 'Català natiu', hostly: true, them: true },
    ],
    faqs: [
      { q: "Quant triga la migració des d'Icnea?", a: 'Depèn de quants pisos tinguis. A Hostly Complet, el canvi el fem amb tu durant el primer mes, en una configuració 1 a 1: pisos, canals i reserves.' },
      { q: 'Hostly és més car que Icnea?', a: "Depèn de quants pisos tinguis i del que necessitis. Hostly costa 40 €/mes per pis, 35 € a partir de 5, amb la IA a WhatsApp i els preus amb PriceLabs integrat; el check-in i el registre a la policia són gratis. Icnea publica una quota des de 150 €/mes per a fins a 10 propietats (preu de l'octubre del 2026). Fes números amb els teus pisos i compara què inclou cadascun." },
    ],
  },
  {
    slug: 'hostify',
    name: 'Hostify',
    tagline: 'Hostly vs Hostify — Què canvia per a un gestor petit a Espanya',
    target: 'Gestors petits i mitjans (5‑70 allotjaments) a Espanya',
    priceNote: "Hostify: des de 20 $ per allotjament al mes, amb trams a partir de 5 allotjaments (preu publicat l'octubre del 2026) · Hostly: 40 €/mes per pis, 35 € a partir de 5",
    advantages: [
      { title: 'IA a WhatsApp', body: "La IA de Hostly contesta la majoria de missatges a l'instant, en l'idioma de l'hoste i les 24 hores, amb la informació de cada pis. Ve amb Hostly Complet." },
      { title: 'Des del primer pis', body: 'Els trams de preu de Hostify comencen a 5 allotjaments. Hostly cobra per pis des del primer: 40 €/mes, 35 € a partir de 5. I el check-in i el registre a la policia són gratis.' },
      { title: 'Check-in i registre gratis', body: registreGratis },
      { title: 'En català i castellà', body: "L'app de Hostly és en català i castellà, i el suport te'l dona una persona, en tots dos idiomes." },
      { title: 'Preu en euros', body: 'Hostify publica els preus en dòlars, així que el que pagues en euros pot variar amb el canvi. Hostly costa 40 €/mes per pis, 35 € a partir de 5.' },
    ],
    comparison: [
      { feature: 'IA a WhatsApp', hostly: true, them: consultar },
      { feature: 'WhatsApp com a canal principal', hostly: true, them: 'Parcial' },
      { feature: 'Preus dinàmics', hostly: 'PriceLabs integrat', them: 'Via PriceLabs o Beyond' },
      { feature: 'Check-in i registre policial gratis', hostly: true, them: consultar },
      { feature: 'Català natiu', hostly: true, them: consultar },
      { feature: 'Preu en euros', hostly: true, them: false },
    ],
    faqs: [
      { q: 'Per què Hostly si Hostify ja té WhatsApp?', a: "Hostly fa servir l'API oficial de WhatsApp amb un número gestionat per Hostly, així que no has d'instal·lar ni configurar res. La IA contesta amb la informació de cada pis i de la reserva, en l'idioma de l'hoste, i t'avisa quan cal una persona. L'actives o la desactives per apartament i pots prendre el control de qualsevol conversa." },
      { q: 'Són comparables en funcionalitats?', a: "En el bàsic, sí: reserves, check-in i channel manager (Hostly connecta Airbnb i Booking.com; Hostify, molts més canals). La diferència és l'enfocament: a Hostly, la IA contesta per WhatsApp, els preus van amb PriceLabs integrat i el check-in amb el registre a la policia és gratis, també si només tens un pis." },
    ],
  },
  {
    slug: 'lodgify',
    name: 'Lodgify',
    tagline: 'Hostly vs Lodgify — Gestió completa vs focus en les reserves directes',
    target: 'Amfitrions amb 1‑15 allotjaments que volen web propi i reserves directes',
    priceNote: "Lodgify: preu segons el pla i el nombre d'allotjaments; consulta el seu web · Hostly: 40 €/mes per pis, 35 € a partir de 5",
    advantages: [
      { title: 'El dia a dia del pis', body: 'Lodgify se centra en les reserves directes i el seu creador de webs. Hostly se centra en el dia a dia del pis: neteges, missatges, registre de viatgers i finances.' },
      { title: 'IA que contesta per tu', body: "La IA de Hostly contesta la majoria de missatges dels hostes a l'instant, les 24 hores i en el seu idioma. Quan cal una persona, t'avisa." },
      { title: 'Check-in i registre gratis', body: registreGratis },
      { title: 'A Hostly Complet, ho configurem amb tu', body: "El primer mes, en una videotrucada 1 a 1, deixem a punt els teus pisos, els teus canals i els teus missatges. Després t'atén una persona, en català o castellà." },
      { title: 'Preu previsible', body: '40 €/mes per pis, 35 € a partir de 5, sense comissions per reserva ni percentatges sobre els teus ingressos. El primer mes, gratis.' },
    ],
    comparison: [
      { feature: 'Web propi / reserves directes', hostly: 'A mida, a part', them: 'El seu punt fort' },
      { feature: 'IA conversacional 24/7', hostly: true, them: consultar },
      { feature: 'Check-in i registre policial gratis', hostly: true, them: false },
      { feature: 'Sense comissions per reserva', hostly: true, them: consultar },
      { feature: 'Coordinació de neteges', hostly: true, them: consultar },
      { feature: 'Preus dinàmics', hostly: true, them: true },
    ],
    faqs: [
      { q: 'Hostly té web de reserves directes?', a: 'No ve de sèrie. Si el necessites, et fem un web propi amb reserves directes, a mida, com a automatització a part. Si el que busques és sobretot un web amb disseny i SEO propis, Lodgify hi està més centrat. Per al dia a dia del pis (missatges, neteges, registre de viatgers), Hostly està pensat justament per a això.' },
      { q: 'Què pagues en cadascun?', a: "A Hostly, el check-in i el registre a la policia són gratis, i Hostly Complet costa 40 €/mes per pis (480 €/any amb un pis), 35 € a partir de 5, sense comissions per reserva. Lodgify té diversos plans segons les funcions i el nombre d'allotjaments: consulta el seu web per al teu cas i mira si el teu pla cobra res per reserva." },
    ],
  },
  {
    slug: 'smoobu',
    name: 'Smoobu',
    tagline: 'Hostly vs Smoobu — Què inclou cadascun per a un pis a Espanya',
    target: 'Amfitrió particular i gestor petit (1‑15 allotjaments), fort a Alemanya, Àustria i Suïssa',
    priceNote: "Smoobu: des de 29 €/mes per un allotjament, més un 0,9 % per reserva (pla Profesional Flex; preu publicat l'octubre del 2026) · Hostly: 40 €/mes per pis, sense comissions",
    advantages: [
      { title: 'IA a WhatsApp', body: "La IA de Hostly contesta la majoria de missatges a l'instant, en l'idioma de l'hoste i les 24 hores, i t'avisa quan cal una persona." },
      { title: 'Check-in i registre gratis', body: registreGratis },
      { title: 'Preus amb PriceLabs integrat', body: 'A Hostly, PriceLabs recomana el preu de cada nit, tu hi poses els límits i Hostly el publica a Airbnb i Booking cada dia.' },
      { title: 'WhatsApp com a canal principal', body: "Hostly fa servir l'API oficial de WhatsApp amb un número gestionat per Hostly. Els teus hostes escriuen per WhatsApp i tu no has d'instal·lar ni configurar res." },
      { title: 'Suport en català i castellà', body: "Smoobu dona suport en diversos idiomes. A Hostly Complet, el primer mes el configurem amb tu en una videotrucada i després t'atén una persona, en català o castellà." },
    ],
    comparison: [
      { feature: 'IA conversacional', hostly: true, them: consultar },
      { feature: 'WhatsApp natiu', hostly: true, them: consultar },
      { feature: 'Check-in i registre policial sense complements', hostly: true, them: 'Via integració' },
      { feature: 'Channel manager', hostly: true, them: true },
      { feature: 'Preus dinàmics', hostly: 'PriceLabs integrat', them: 'Propis' },
      { feature: 'Preu amb 1 pis', hostly: '40 €/mes', them: 'Des de 29 €/mes + 0,9 %' },
    ],
    faqs: [
      { q: 'Per què Hostly si Smoobu és més barat?', a: 'Smoobu comença a 29 €/mes per un allotjament amb el pla Profesional Flex, que a més cobra un 0,9 % per reserva, o a 35 €/mes en prepagament (31,50 €/mes amb pagament anual). Si necessites una eina a part per al check-in i el registre a la policia, suma-la al cost. A Hostly, el check-in i el registre són gratis, i Hostly Complet, a 40 €/mes per pis, aplega la IA a WhatsApp, les neteges i els preus amb PriceLabs integrat.' },
      { q: 'Smoobu té integració amb el mercat espanyol?', a: "Té channel manager per a les OTA principals i s'integra amb eines externes per al registre de viatgers. Hostly està fet per gestionar a Espanya: registre automàtic als Mossos a Catalunya (a la resta d'Espanya, activem amb tu la connexió amb la policia que et toqui), taxa turística de Catalunya a punt per declarar i suport en català i castellà." },
    ],
  },
  {
    slug: 'hospitable',
    name: 'Hospitable',
    tagline: "Hostly vs Hospitable — L'alternativa pensada per a Espanya, amb el registre de viatgers inclòs",
    target: 'Amfitrions particulars exigents (1‑30 propietats); molt fort als EUA i al Regne Unit',
    priceNote: "Hospitable: pla Essentials gratis; de pagament, des de 29 €/mes + IVA per a 1 propietat (preu publicat l'octubre del 2026) · Hostly: check-in gratis i 40 €/mes per pis amb Hostly Complet",
    advantages: [
      { title: 'Registre de viatgers a Espanya', body: "Hospitable és fort als EUA i al Regne Unit. A Hostly, el check-in online, el registre de viatgers i la taxa turística de Catalunya són gratis per sempre. Allà, el registre va als Mossos cada dia; a la resta d'Espanya, activem amb tu la connexió amb la policia que et toqui." },
      { title: 'WhatsApp com a canal principal', body: 'Hostly està pensat per a WhatsApp: API oficial de Meta, un número gestionat per Hostly i la IA que hi contesta.' },
      { title: 'Suport en català i castellà', body: "Amb Hostly Complet, t'atén una persona en català o castellà, no un xatbot. Amb el pla Gratis, ens escrius a hola@hostlylabs.com." },
      { title: 'Configuració amb tu', body: 'A Hostly Complet, el primer mes ho configurem tot amb tu en una videotrucada 1 a 1: pisos, canals i missatges.' },
      { title: 'Taxa turística a punt per declarar', body: "Si els teus pisos són a Catalunya, Hostly calcula la taxa turística de cada estada i la deixa a punt per declarar a l'ATC cada semestre." },
    ],
    comparison: [
      { feature: 'Registre de viatgers a Espanya', hostly: true, them: false },
      { feature: 'WhatsApp com a canal principal', hostly: true, them: consultar },
      { feature: 'IA conversacional', hostly: true, them: true },
      { feature: 'App en català i castellà', hostly: true, them: consultar },
      { feature: 'Taxa turística de Catalunya', hostly: true, them: false },
      { feature: 'Channel manager', hostly: true, them: true },
    ],
    faqs: [
      { q: 'Hospitable no és millor en IA que Hostly?', a: "Hospitable té una IA de missatgeria molt treballada. La diferència és el mercat: Hostly està fet per gestionar a Espanya, amb WhatsApp com a canal, el registre de viatgers i la taxa turística de Catalunya dins de l'app, i suport en català i castellà." },
      { q: 'Puc fer servir Hospitable i Hostly alhora?', a: "Sí: amb el pla Gratis, Hostly llegeix el teu calendari i s'ocupa del check-in, del registre a la policia i de la taxa turística de Catalunya, i Hospitable continua amb la resta. Si prefereixes tenir-ho tot en una sola app, Hostly Complet hi suma missatges, neteges i preus." },
    ],
  },
  {
    slug: 'guesty',
    name: 'Guesty',
    tagline: 'Hostly vs Guesty — Pensat per al gestor petit',
    target: "D'1 anunci (Lite) a milers d'unitats; el seu fort, les empreses de gestió mitjanes i grans",
    priceNote: "Guesty: pla Lite (1‑3 anuncis) des de 9 $ per anunci al mes; Pro i Enterprise, pressupost a mida (preu publicat l'octubre del 2026) · Hostly: 40 €/mes per pis, 35 € a partir de 5",
    advantages: [
      { title: 'Pensat per a 1 a 15 pisos', body: "Guesty se centra sobretot en empreses de gestió mitjanes i grans. Hostly està pensat des del primer dia per al propietari i el gestor petit, d'1 a 15 pisos." },
      { title: 'Comences gratis, sense demo', body: "El pla Gratis (check-in, registre de viatgers i taxa turística de Catalunya) l'actives tu sol, sense targeta (fora de Catalunya, la connexió amb la policia l'activem amb tu). Per a Hostly Complet fem una demo i el configurem amb tu." },
      { title: 'Preu públic, tinguis els pisos que tinguis', body: "Hostly publica el seu preu: 40 €/mes per pis, 35 € a partir de 5. Guesty publica preu només per al pla Lite (d'1 a 3 anuncis); a partir d'aquí, treballa amb pressupost a mida." },
      { title: 'Check-in i registre gratis', body: registreGratis },
      { title: 'Suport proper', body: "A Hostly Complet, el primer mes ho configurem tot amb tu en una videotrucada. Després t'atén una persona, en català o castellà." },
    ],
    comparison: [
      { feature: 'Pensat per a 1‑15 pisos', hostly: true, them: consultar },
      { feature: 'Pla gratis, sense targeta', hostly: true, them: consultar },
      { feature: 'Preu públic', hostly: true, them: 'Només Lite (1‑3)' },
      { feature: 'Check-in i registre policial gratis', hostly: true, them: false },
      { feature: 'IA conversacional', hostly: true, them: true },
      { feature: 'Channel manager', hostly: 'Airbnb i Booking', them: true },
    ],
    faqs: [
      { q: 'Per a quin tipus de client és Guesty?', a: 'Té un pla Lite per a 1 a 3 anuncis, però el seu fort són les empreses de gestió amb moltes unitats que necessiten analítica avançada, portal de propietaris i integracions a mida. A un propietari o a un gestor petit, li pot venir gran.' },
      { q: 'Hostly pot créixer amb mi?', a: "Hostly està pensat per a propietaris i gestors d'1 a 15 pisos. Si creixes molt més, amb un equip gran, pot tenir sentit mirar eines pensades per a empreses de gestió grans." },
    ],
  },
  {
    slug: 'avantio',
    name: 'Avantio',
    tagline: 'Hostly vs Avantio — Modernitat i IA vs PMS tradicional espanyol',
    target: 'Agències de gestió professional (20 o més propietats) a Espanya',
    priceNote: "Avantio: quota mínima de 295 €/mes + IVA, fins a 20 propietats (preu publicat l'octubre del 2026) · Hostly: 40 €/mes per pis, 35 € a partir de 5",
    advantages: [
      { title: 'IA conversacional inclosa', body: "La IA de Hostly contesta la majoria de missatges dels hostes a l'instant, les 24 hores i en el seu idioma, i t'avisa quan cal una persona." },
      { title: 'Configuració inclosa', body: 'A Hostly Complet, el primer mes ho configurem tot amb tu en una videotrucada 1 a 1.' },
      { title: 'Pensat per a pocs pisos', body: 'Avantio aplica una quota mínima de 295 €/mes + IVA per a carteres de fins a 20 propietats. Hostly costa 40 €/mes per pis, 35 € a partir de 5: amb pocs pisos, pagues només pels que tens.' },
      { title: 'WhatsApp natiu', body: "Hostly fa servir l'API oficial de WhatsApp amb un número gestionat per Hostly. Els teus hostes escriuen per WhatsApp i la IA hi contesta directament." },
      { title: 'Check-in i registre gratis', body: registreGratis },
    ],
    comparison: [
      { feature: 'IA conversacional', hostly: true, them: consultar },
      { feature: 'WhatsApp natiu', hostly: true, them: consultar },
      { feature: 'Configuració inclosa', hostly: 'Amb Hostly Complet', them: consultar },
      { feature: 'Preu amb 1 pis', hostly: '40 €/mes', them: 'Mínim 295 €/mes' },
      { feature: 'Channel manager', hostly: 'Airbnb i Booking', them: true },
      { feature: 'Registre de viatgers integrat', hostly: true, them: true },
    ],
    faqs: [
      { q: 'Per a quin perfil és Avantio?', a: "Avantio en recomana l'ús a partir de 20 propietats i està pensat per a agències amb equip que necessiten integracions complexes. A un gestor petit, li pot venir gran en cost i en complexitat." },
      { q: 'Hostly és tan complet com Avantio?', a: "No en tot. Avantio té funcions avançades de gestió d'ingressos i d'informes per a grans volums, i connecta més canals. Hostly se centra en Airbnb i Booking.com i en el que un gestor d'1 a 15 pisos fa servir cada dia: missatges, neteges, registre de viatgers, preus amb PriceLabs integrat i finances." },
    ],
  },
];

// Mateix filtre que a competitors.ts (per si mai s'hi cola un buit o un repetit).
const vists = new Set<string>();
export const uniqueCompetitorsCa = competitorsCa.filter((c) => {
  if (vists.has(c.slug)) return false;
  vists.add(c.slug);
  return c.advantages.length > 0;
});
