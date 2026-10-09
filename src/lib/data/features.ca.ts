/**
 * Versió catalana de FEATURES. Mateixa estructura que features.ts.
 * Slug i iconName no es tradueixen. Tota la resta està en català.
 */

import type { Feature } from './features';

export const FEATURES_CA: Feature[] = [
  // ─────────────────────────────── IA WHATSAPP ───────────────────────────────
  {
    slug: 'ia-whatsapp',
    name: 'IA que respon a WhatsApp',
    iconName: 'MessageCircle',
    shortDescription:
      'Un agent que contesta els teus hostes per WhatsApp amb el teu to, 24/7, i et deixa només les converses que de veritat necessiten la teva atenció.',
    hero: {
      h1: 'Un agent que respon per WhatsApp mentre tu no mires el mòbil',
      sub: 'Contesta dubtes de check-in, normes, Wi-Fi o incidències amb el to que li marques. Escala a tu només quan cal.',
      primaryCta: 'Provar la IA gratis',
      secondaryCta: 'Veure com respon',
    },
    problem: {
      title: 'El teu mòbil no hauria de sonar a les 2 de la matinada per preguntar on és el garatge',
      body: 'Gestionar apartaments turístics acaba sent respondre les mateixes 20 preguntes tot el dia. Hostes que pregunten el Wi-Fi, com obrir la porta, si poden fer early check-in. Multiplica-ho per 3 apartaments i un cap de setmana: ja no descanses.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Connectes el teu WhatsApp i el teu canal OTA',
        body: 'Enllaces WhatsApp Business i Airbnb/Booking. L\'agent llegeix el context de la reserva (apartament, dates, hoste) automàticament.',
      },
      {
        step: 2,
        title: 'Li dones les teves normes i el teu to',
        body: 'Omples una guia per apartament: Wi-Fi, check-in, normes, millors restaurants. Marques el to (proper, formal, en català, en castellà).',
      },
      {
        step: 3,
        title: 'La IA respon i escala quan toca',
        body: 'Respon dubtes repetitius a l\'instant. Si detecta queixa, petició fora de norma o alguna cosa tècnica, et passa la conversa amb un resum.',
      },
      {
        step: 4,
        title: 'Tu ho veus tot en una safata unificada',
        body: 'Revises què ha respost, edites el to sobre la marxa i aprens quines preguntes es repeteixen per apartament.',
      },
    ],
    advantages: [
      'Contesta en castellà, català i anglès sense canviar de configuració',
      'Llegeix el context de la reserva — no respon genèric, respon per reserva',
      'Escala a tu amb resum clar quan detecta alguna cosa delicada',
      'Aprèn de les teves correccions per respondre cada cop més com tu',
      'Deixa traçabilitat completa: què va respondre, a qui, quan',
      'Safata unificada: WhatsApp, Airbnb, Booking i email en una sola vista',
    ],
    usage: [
      {
        title: 'Check-in del divendres a la nit',
        body: 'L\'hoste pregunta com obrir la porta a les 23:45. La IA li envia el codi i les instruccions de l\'apartament concret a l\'instant. Tu dorms.',
      },
      {
        title: 'Dubtes d\'última hora',
        body: 'Pregunten si hi ha pàrquing, si admeten mascotes, si poden fumar. La IA respon amb les teves normes. Si insisteixen, t\'avisa.',
      },
      {
        title: 'Incidència real',
        body: 'Es queixa de l\'aire condicionat. La IA detecta la queixa, respon per calmar, obre incidència a neteges/manteniment i et notifica.',
      },
    ],
    relatedFeatures: ['mensajeria-programada', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: 'Puc revisar el que respon abans que s\'enviï?',
        answer:
          'Sí. Tens dos modes: enviament automàtic o revisió prèvia. Pots començar en mode revisió fins que el to estigui calibrat i després passar a automàtic.',
      },
      {
        question: 'Què passa si un hoste pregunta una cosa que la IA no sap?',
        answer:
          'T\'escala la conversa amb un resum del que s\'ha parlat. L\'hoste no veu cap tall: la IA li diu que consulta un moment i tu apareixes.',
      },
      {
        question: 'Parla català de veritat?',
        answer:
          'Sí. Català, castellà, anglès, francès i italià. Canvia l\'idioma segons l\'hoste sense que tu hagis de configurar res.',
      },
      {
        question: 'Necessito WhatsApp Business?',
        answer:
          'Sí. Fem servir WhatsApp Business API via Evolution. Si no el tens configurat, et guiem en l\'onboarding sense cost extra.',
      },
    ],
  },

  // ─────────────────────────────── CHECK-IN ONLINE ───────────────────────────────
  {
    slug: 'check-in-online',
    name: 'Check-in online amb SES automàtic',
    iconName: 'ShieldCheck',
    shortDescription:
      'L\'hoste signa, envia document i dades des del seu mòbil. Hostly els envia automàticament a SES.Hospedajes i a Mossos o Ertzaintza.',
    hero: {
      h1: 'Check-in legal fet abans que l\'hoste arribi a l\'apartament',
      sub: 'El viatger puja DNI, signa i dades des del seu mòbil. Hostly ho envia a SES.Hospedajes i registres autonòmics sense que toquis res.',
      primaryCta: 'Veure flux complet',
      secondaryCta: 'Parlar amb vendes',
    },
    problem: {
      title: 'El part de viatgers t\'ocupa més temps del que hauria',
      body: 'Des del 2 de gener de 2025 el SES.Hospedajes és obligatori. Molts propietaris encara omplen dades a mà, envien formularis a cada hoste, els passen al portal del Ministeri un per un. En alta ocupació és impossible mantenir-ho al dia sense errors.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'L\'hoste rep un enllaç en confirmar la reserva',
        body: 'Arriba automàticament per WhatsApp o email segons la teva configuració, amb les instruccions en el seu idioma.',
      },
      {
        step: 2,
        title: 'Fa el check-in des del mòbil en 3 minuts',
        body: 'Puja foto del document, omple dades i signa. El formulari valida que no falti cap camp obligatori.',
      },
      {
        step: 3,
        title: 'Hostly envia el part a SES i registres autonòmics',
        body: 'Genera el XML correcte, el signa i l\'envia a SES.Hospedajes, Mossos d\'Esquadra o Ertzaintza segons la comunitat.',
      },
      {
        step: 4,
        title: 'Reps confirmació i guardem la prova',
        body: 'Si hi ha error de validació al Ministeri, el detectem i t\'avisem. Si tot va bé, queda arxivat per si et demanen justificació.',
      },
    ],
    advantages: [
      'Compleix SES.Hospedajes, Mossos i Ertzaintza sense intervenció manual',
      'Signatura digital vàlida amb auditoria per reserva',
      'Formulari mòbil en 5 idiomes',
      'Detecta documents borrosos abans que els enviïs',
      'Guarda justificants durant el termini legal requerit',
      'Evita sancions per parts sense enviar o amb dades incompletes',
    ],
    usage: [
      {
        title: 'Família amb 4 persones',
        body: 'Un adult omple dades de tots, puja els 4 DNIs i signa. En 4 minuts queda tot registrat al SES.',
      },
      {
        title: 'Apartaments a Catalunya',
        body: 'Enviament automàtic al Registre de Viatgers de Mossos d\'Esquadra, a més del SES nacional. Sense doble feina.',
      },
      {
        title: 'Arribada nocturna sense presència',
        body: 'L\'hoste fa check-in a les 23:00, accedeix amb codi a l\'apartament i el part queda enviat abans que tu te n\'assabentis.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'mensajeria-programada', 'multi-rol'],
    faqs: [
      {
        question: 'Substitueix Chekin?',
        answer:
          'Sí. Hostly fa check-in, signatura i enviament SES sense necessitat de Chekin com a intermediari. Si ja fas servir Chekin, la migració es fa en una sessió.',
      },
      {
        question: 'Què passa si SES.Hospedajes rebutja el part?',
        answer:
          'Ho detectem immediatament, t\'avisem i et mostrem quin camp ha fallat. Pots corregir-lo en un parell de clics.',
      },
      {
        question: 'I si tinc apartaments a Catalunya i Andalusia alhora?',
        answer:
          'Hostly detecta la comunitat autònoma de l\'apartament i envia al registre correcte (Mossos, Ertzaintza o només SES).',
      },
      {
        question: 'Quant de temps guardeu els parts?',
        answer:
          'Els mantenim arxivats durant el termini legal exigit (3 anys) perquè puguis justificar qualsevol registre si hi ha inspecció.',
      },
    ],
  },

  // ─────────────────────────────── CHANNEL MANAGER ───────────────────────────────
  {
    slug: 'channel-manager',
    name: 'Channel manager unificat',
    iconName: 'Calendar',
    shortDescription:
      'Calendari únic per a Airbnb, Booking i la teva web. Se sincronitza en temps real i et protegeix de dobles reserves.',
    hero: {
      h1: 'Un calendari únic per a Airbnb, Booking i la teva web',
      sub: 'Sincronització en temps real, anti-overbooking i canvis de preu des d\'un sol lloc.',
      primaryCta: 'Connectar les meves OTAs',
      secondaryCta: 'Veure integracions',
    },
    problem: {
      title: 'Gestionar 3 calendaris a mà sempre acaba en overbooking',
      body: 'Tenir Airbnb, Booking i la web amb calendaris separats és qüestió de temps. Un bloqueig que tardes a moure, un canvi de dates que no actualitzes, i acabes amb dues reserves la mateixa nit. Es perd diners i reputació.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Connectes les teves OTAs des del panell',
        body: 'Airbnb, Booking.com i Beds24 es connecten en uns minuts. La teva web s\'enllaça via widget de reserva.',
      },
      {
        step: 2,
        title: 'Importem el teu històric',
        body: 'Portem reserves actuals i futures. A partir d\'aquell moment tot se sincronitza en temps real.',
      },
      {
        step: 3,
        title: 'Edites disponibilitat i preus en un sol lloc',
        body: 'Un canvi de preu es propaga a totes les plataformes. Un bloqueig es reflecteix a l\'instant a totes.',
      },
    ],
    advantages: [
      'Anti-overbooking real: impossible solapar reserves',
      'Sincronització bidireccional en temps real',
      'Bloquejos i preus editables des d\'un únic calendari',
      'Històric complet per apartament',
      'Alertes quan una OTA falla en sincronització',
      'Suport per a Airbnb, Booking, Vrbo i web directa',
    ],
    usage: [
      {
        title: 'Pujada de preu a Setmana Santa',
        body: 'Canvies preu una vegada a Hostly. Airbnb i Booking ho reflecteixen en minuts.',
      },
      {
        title: 'Bloqueig per reforma',
        body: 'Marques 5 dies de bloqueig. Totes les OTAs ho reben abans que ningú pugui reservar.',
      },
      {
        title: 'Cancel·lació d\'hoste',
        body: 'Quan una reserva cau, el forat queda lliure automàticament a totes les plataformes.',
      },
    ],
    relatedFeatures: ['precios-dinamicos', 'gestion-de-limpiezas', 'conecta-todo'],
    faqs: [
      {
        question: 'Quines OTAs admeteu?',
        answer:
          'Airbnb, Booking.com, Vrbo i més via Beds24. Si tens web directa, connectem el motor de reserves per widget o iframe.',
      },
      {
        question: 'Què passa si Airbnb té una fallada d\'API?',
        answer:
          'T\'avisem en temps real i protegim els teus calendaris per evitar overbooking. Quan Airbnb torna, resincronitzem sols.',
      },
      {
        question: 'Puc fer servir Hostly sense connectar cap OTA?',
        answer:
          'Sí, però perds el valor principal. Hostly està pensat per unificar, no per anar aïllat.',
      },
    ],
  },

  // ─────────────────────────────── GESTIÓ NETEGES ───────────────────────────────
  {
    slug: 'gestion-de-limpiezas',
    name: 'Gestió de neteges amb app per a l\'equip',
    iconName: 'Sparkles',
    shortDescription:
      'Assigna neteges, rep fotos de sortida i controla incidències sense grups de WhatsApp caòtics.',
    hero: {
      h1: 'Coordina neteges sense viure en un grup de WhatsApp',
      sub: 'Assignació automàtica, app per a l\'equip, fotos de sortida i historial per apartament.',
      primaryCta: 'Veure l\'app de l\'equip',
      secondaryCta: 'Provar gratis',
    },
    problem: {
      title: 'Els grups de WhatsApp amb netejadores no escalen',
      body: 'Quan passes de 2 a 5 apartaments, coordinar neteges per WhatsApp es torna un caos. Missatges perduts, horaris que no quadren, incidències sense foto, materials que falten i no saps quin dia. Al final ets tu qui coordina tot a mà.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Dones d\'alta el teu equip',
        body: 'Afegeixes les teves netejadores o empresa externa. Cadascuna té la seva app amb els apartaments assignats.',
      },
      {
        step: 2,
        title: 'Hostly genera el calendari de neteges',
        body: 'Detecta check-outs i crea torns automàticament. Pots ajustar manualment abans d\'assignar.',
      },
      {
        step: 3,
        title: 'L\'equip confirma i fa fotos',
        body: 'Confirmen torn des de l\'app, marquen quan entren i quan acaben, pugen fotos de l\'estat final.',
      },
      {
        step: 4,
        title: 'Tu ho veus tot i registres incidències',
        body: 'Revises fotos, incidències (alguna cosa trencada, oblit de l\'hoste) i l\'històric per apartament.',
      },
    ],
    advantages: [
      'App dedicada per a netejadores, sense necessitat de WhatsApp',
      'Generació automàtica de torns a partir de reserves',
      'Fotos de sortida signades per netejadora',
      'Registre d\'incidències amb data, apartament i responsable',
      'Notificacions push a l\'equip',
      'Pagament per torns: saps què cobres i què deus cada mes',
    ],
    usage: [
      {
        title: 'Agència amb 3 netejadores i 12 apartaments',
        body: 'Cada netejadora veu només els apartaments que li toquen. L\'encarregat ho veu tot des d\'una vista de calendari.',
      },
      {
        title: 'Incidència: hoste va deixar roba',
        body: 'La netejadora puja foto des de l\'app. Queda registrat. Avises l\'hoste per WhatsApp des del mateix fil.',
      },
      {
        title: 'Canvi d\'última hora',
        body: 'Reserva cancel·lada a les 10:00. El torn es reprograma automàticament i la netejadora rep l\'actualització.',
      },
    ],
    relatedFeatures: ['multi-rol', 'conecta-todo', 'channel-manager'],
    faqs: [
      {
        question: 'I si la meva netejadora no vol instal·lar una altra app?',
        answer:
          'L\'app és lleugera, en el seu idioma i només veu el seu. Solem recomanar-la en el mateix onboarding de l\'equip perquè vegin que els simplifica el dia.',
      },
      {
        question: 'Puc pagar el meu equip des de la plataforma?',
        answer:
          'No. Hostly calcula imports per torn i et dóna el resum mensual, però el pagament es continua fent fora.',
      },
      {
        question: 'Funciona amb empresa de neteja externa?',
        answer:
          'Sí. Donem un accés d\'"equip extern" perquè coordinin torns sense veure dades sensibles del negoci.',
      },
    ],
  },

  // ─────────────────────────────── PREUS DINÀMICS ───────────────────────────────
  {
    slug: 'precios-dinamicos',
    name: 'Preus dinàmics integrats',
    iconName: 'TrendingUp',
    shortDescription:
      'Ajusta el preu cada dia segons demanda, competència i esdeveniments. Sense contractar PriceLabs a part.',
    hero: {
      h1: 'Preus que s\'ajusten sols segons demanda i competència',
      sub: 'Motor de preus dinàmics integrat a Hostly. Sense partners, sense add-ons, sense complicar-te.',
      primaryCta: 'Veure com calcula preus',
      secondaryCta: 'Provar gratis',
    },
    problem: {
      title: 'El preu fix et deixa diners sobre la taula',
      body: 'Posar el mateix preu tot l\'any perd ingressos en temporada alta i et deixa buit en baixa. Revisar preus manualment cada setmana és una feina a temps parcial. I contractar PriceLabs a part són uns altres 20 €/mes per apartament.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Defineixes preu base i límits',
        body: 'Preu mínim i màxim per apartament. Quines temporades consideres altes. Dies mínims d\'estada.',
      },
      {
        step: 2,
        title: 'Hostly analitza demanda i competència',
        body: 'Estudia ocupació a la teva zona, esdeveniments, festius i competidors directes.',
      },
      {
        step: 3,
        title: 'Proposa preus per dia',
        body: 'Et mostra calendari amb preus suggerits. Pots acceptar-ho tot, ajustar manualment o fixar regles.',
      },
      {
        step: 4,
        title: 'Es publica a totes les teves OTAs',
        body: 'Els preus aprovats se sincronitzen a Airbnb, Booking i la teva web via channel manager.',
      },
    ],
    advantages: [
      'Integrat a Hostly, sense contractar PriceLabs ni Beyond',
      'Considera esdeveniments, festius i temporades automàticament',
      'Regles personalitzades (mín/màx, descomptes llarga estada)',
      'Simulació d\'ingressos abans d\'aplicar',
      'Es publica a OTAs en temps real',
      'Traçabilitat: per què va pujar o baixar el preu cada dia',
    ],
    usage: [
      {
        title: 'Concert gran a la ciutat',
        body: 'Detecta esdeveniment, puja el preu aquells dies i recupera ingressos que s\'escaparien amb preu fix.',
      },
      {
        title: 'Setmana fluixa en temporada baixa',
        body: 'Baixa el preu lleugerament 72 hores abans per omplir el forat sense cremar la marca.',
      },
      {
        title: 'Forat entre reserves',
        body: 'Ofereix descompte només per a estades d\'1-2 nits que omplin el gap.',
      },
    ],
    relatedFeatures: ['channel-manager', 'conecta-todo'],
    faqs: [
      {
        question: 'Substitueix PriceLabs?',
        answer:
          'Per a la majoria de propietaris d\'1-15 apartaments, sí. Si tens un cas molt complex (centenars d\'unitats, estratègia avançada), pots seguir amb PriceLabs i Hostly s\'integra.',
      },
      {
        question: 'Puc aprovar els preus manualment?',
        answer:
          'Sí. Pots triar mode automàtic, mode revisió prèvia (et proposa i tu aproves) o mode manual amb alertes.',
      },
      {
        question: 'Com sap què fan els competidors?',
        answer:
          'Fem servir dades públiques d\'ocupació i rangs de preu a la teva zona. No fem scraping agressiu ni entrem en àrees privades d\'altres plataformes.',
      },
    ],
  },

  // ─────────────────────────────── MISSATGERIA PROGRAMADA ───────────────────────────────
  {
    slug: 'mensajeria-programada',
    name: 'Missatgeria programada per reserva',
    iconName: 'Send',
    shortDescription:
      'Plantilles automàtiques per a confirmació, check-in, mitja estada i comiat. Adaptades per apartament i idioma.',
    hero: {
      h1: 'Missatges útils a cada hoste, sense escriure\'n cap a mà',
      sub: 'Plantilles programades per moment de reserva, adaptades a apartament, idioma i canal (WhatsApp, email o OTA).',
      primaryCta: 'Veure plantilles',
      secondaryCta: 'Provar gratis',
    },
    problem: {
      title: 'Els missatges repetitius se t\'acumulen',
      body: 'Cada reserva necessita 4-5 missatges: confirmació, instruccions de check-in, recordatori, comiat, petició de review. Si tens 3 apartaments i 20 reserves al mes, són 80 missatges. Escriure cadascun a mà és una pèrdua clara de temps.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Tries plantilles o crees les teves',
        body: 'Plantilles per moment (confirmació, 48 h abans del check-in, durant l\'estada, comiat).',
      },
      {
        step: 2,
        title: 'Programes quan s\'envia cadascuna',
        body: 'En confirmar reserva, 48h abans d\'arribada, dia de sortida... Tu decideixes la cadència.',
      },
      {
        step: 3,
        title: 'Hostly adapta per hoste',
        body: 'Detecta idioma de l\'hoste, apartament concret i tipus de reserva. Personalitza variables automàticament.',
      },
      {
        step: 4,
        title: 'Envia pel canal òptim',
        body: 'WhatsApp si tens número, email com a fallback, plataforma OTA quan no hi ha cap altra via.',
      },
    ],
    advantages: [
      'Plantilles per moment de reserva i apartament',
      'Detecció automàtica d\'idioma',
      'Variables: nom, apartament, codi, dates, instruccions',
      'Canal òptim automàtic (WhatsApp, email, OTA)',
      'Historial complet per reserva',
      'Compatible amb l\'agent IA: si responen, la IA continua',
    ],
    usage: [
      {
        title: 'Flux estàndard d\'una reserva',
        body: 'Confirmació en reservar, recordatori 48h abans amb instruccions, missatge de benvinguda el dia d\'entrada, comiat amb petició de review.',
      },
      {
        title: 'Plantilla específica per apartament',
        body: 'L\'apartament amb piscina rep instruccions extra d\'ús. L\'urbà rep info de pàrquing. Cadascun el seu missatge.',
      },
      {
        title: 'Idioma de l\'hoste',
        body: 'Reserva des de França → plantilles en francès. Reserva local → català o castellà segons preferència.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: 'Puc pausar un missatge abans que s\'enviï?',
        answer:
          'Sí. Tens cua visible amb el que sortirà a les pròximes hores i pots editar o cancel·lar.',
      },
      {
        question: 'Funciona sense l\'agent IA?',
        answer:
          'Sí. La missatgeria programada funciona sola. Si a més actives la IA, l\'hoste rep el missatge programat i si respon, la IA continua.',
      },
      {
        question: 'Quantes plantilles puc tenir?',
        answer:
          'Il·limitades. Pots crear per apartament, per idioma o per tipus de reserva.',
      },
    ],
  },

  // ─────────────────────────────── MULTI-ROL ───────────────────────────────
  {
    slug: 'multi-rol',
    name: 'Multi-rol i permisos per usuari',
    iconName: 'Users',
    shortDescription:
      'Cada persona del teu equip veu només el seu: netejadores, gestor, propietari. Sense ensenyar dades que no toquen.',
    hero: {
      h1: 'Cada persona del teu equip veu exactament el que necessita',
      sub: 'Rols per a netejadora, gestor, propietari i hoste. Permisos granulars per apartament.',
      primaryCta: 'Veure rols',
      secondaryCta: 'Parlar amb vendes',
    },
    problem: {
      title: 'Compartir dades per WhatsApp és mal negoci',
      body: 'Quan l\'equip creix necessites donar accés a netejadores, a un gestor de confiança o a propietaris. Passar dades per WhatsApp o donar-los el teu usuari d\'Airbnb no és opció. Acabes amb informació sensible en mans de massa gent.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Crees rols',
        body: 'Netejadora, gestor, propietari extern, manteniment. Cadascun amb els seus permisos.',
      },
      {
        step: 2,
        title: 'Assignes apartaments per rol',
        body: 'La netejadora A veu només els apartaments B i C. El propietari extern veu només els seus.',
      },
      {
        step: 3,
        title: 'Cada persona entra amb el seu compte',
        body: 'App mòbil o web segons el rol. Veuen només la informació permesa.',
      },
    ],
    advantages: [
      'Rols predefinits: netejadora, gestor, propietari, hoste',
      'Permisos granulars per apartament',
      'Registre d\'accions per usuari (auditoria)',
      'Baixes i altes ràpides quan canvia l\'equip',
      'Vistes adaptades al rol (netejadora veu torns, gestor veu reserves)',
      'Accés hoste només a la seva estada',
    ],
    usage: [
      {
        title: 'Agència amb 3 propietaris externs',
        body: 'Cada propietari veu ingressos i ocupació dels seus. No veu els de la resta.',
      },
      {
        title: 'Equip intern',
        body: 'Gestor ho veu tot. Netejadora veu només torns. Manteniment veu incidències obertes.',
      },
      {
        title: 'Canvi de personal',
        body: 'La netejadora deixa l\'equip. Desactives el seu compte i perd accés a l\'acte.',
      },
    ],
    relatedFeatures: ['gestion-de-limpiezas', 'conecta-todo'],
    faqs: [
      {
        question: 'Quants usuaris puc donar d\'alta?',
        answer:
          'Depèn del pla. Starter inclou un usuari propietari + 3 externs. Pro i Agency són il·limitats.',
      },
      {
        question: 'Puc donar accés temporal?',
        answer:
          'Sí. Pots crear accessos amb caducitat (útil per a suplències o auditories).',
      },
      {
        question: 'Hi ha auditoria d\'accions?',
        answer:
          'Sí. Cada acció queda registrada per usuari, apartament i data. Útil si necessites revisar què va passar amb una reserva.',
      },
    ],
  },

  // ─────────────────────────────── CONECTA-HO TOT ───────────────────────────────
  {
    slug: 'conecta-todo',
    name: 'Connecta-ho tot',
    iconName: 'Plug',
    shortDescription:
      'Hostly és un sistema obert. Si hi ha alguna cosa de la teva operativa que falta, ens ho dius i ho implementem.',
    hero: {
      h1: 'Si ho necessites, ho connectem.',
      sub: 'No som un sistema rígid. Cada gestor té la seva pròpia operativa i Hostly creix amb ella. Digues-nos què falta — ho implementem.',
      primaryCta: 'Explica\'ns què necessites',
      secondaryCta: 'Veure integracions',
    },
    problem: {
      title: 'Els sistemes tancats t\'obliguen a adaptar-te a ells',
      body: 'La majoria de plataformes de gestió són rígides. Tenen les funcions que van decidir al seu full de ruta i punt. Si la teva operativa necessita una cosa que no hi és, et toca fer-la a mà per sempre. Hostly funciona al revés: som nosaltres els que ens adaptem a tu.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Ens expliques què necessites',
        body: 'Una integració amb el teu gestor fiscal, un avís automàtic específic, una cosa que fas a mà cada setmana. Escriu-nos amb el teu cas.',
      },
      {
        step: 2,
        title: 'Ho valorem junts',
        body: 'En 48h et confirmem si és viable i quan estaria llest. Sense costos ocults, sense sorpreses.',
      },
      {
        step: 3,
        title: 'Ho implementem',
        body: 'Entra al teu Hostly sense que toquis res. T\'avisem quan estigui actiu.',
      },
      {
        step: 4,
        title: 'Funciona en segon pla per sempre',
        body: 'S\'executa automàticament cada cop que toca. Tu no has de fer res més.',
      },
    ],
    advantages: [
      'Sistema obert — no et limita al que decidim nosaltres',
      'Les peticions més demanades s\'implementen primer',
      'Integracions amb gestors fiscals, ERPs i eines d\'equip',
      'Connecta amb la teva web de reserves directes o qualsevol canal extern',
      'Avisos personalitzats a la teva mida',
      'T\'escoltem — el roadmap el construïu vosaltres',
    ],
    usage: [
      {
        title: 'Dades al teu gestor fiscal, automàtiques',
        body: 'Cada reserva confirmada, la informació va sola on la necessites. Sense copiar. Sense oblidar.',
      },
      {
        title: 'Notificacions al teu equip com tu les vols',
        body: 'Per WhatsApp, email o l\'eina que facis servir. Amb les dades exactes que necessita cada persona.',
      },
      {
        title: 'La teva web de reserves directes connectada',
        body: 'Si tens canal propi, el sincronitzem. Calendari, preus i reserves en temps real.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'gestion-de-limpiezas', 'precios-dinamicos'],
    faqs: [
      {
        question: 'Com demano una integració o funció nova?',
        answer:
          'Escriu-nos a hola@hostlylabs.com amb el teu cas concret. Ho valorem en 48h i et diem si és viable i quan. La majoria de peticions no tenen cost addicional.',
      },
      {
        question: 'Quant tarda a implementar-se?',
        answer:
          'Depèn de la complexitat. Les integracions més habituals solen estar llestes en dies. Les més específiques, entre 1 i 4 setmanes. Sempre t\'ho confirmem abans de començar.',
      },
      {
        question: 'Té cost addicional?',
        answer:
          'Les integracions estàndard estan incloses al teu pla. Les personalitzades les valorem cas a cas, però l\'objectiu és que tot estigui inclòs sense sorpreses.',
      },
    ],
  },

  // ─────────────────────────────── FINANCES EN ORDRE ───────────────────────────────
  {
    slug: 'finanzas',
    name: 'Finances en ordre',
    iconName: 'BarChart3',
    shortDescription:
      'Tanca el mes en minuts, no en una tarda. Ingressos per pis, comissions automàtiques, liquidacions a propietaris i exportació per al teu gestor fiscal.',
    hero: {
      h1: 'Tanca el mes en minuts, no en una tarda.',
      sub: 'Ingressos per pis, per plataforma i per període. Comissions d\'Airbnb i Booking calculades soles. Liquidacions a propietaris en un clic. Tot llest per al teu gestor fiscal.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure com funciona',
    },
    problem: {
      title: 'El tancament de mes: la part que ningú volia',
      body: 'Obrir l\'Excel. Copiar les reserves d\'Airbnb. Descomptar la comissió del 3%. Les de Booking al 15%. Sumar la taxa turística cobrada. Calcular el net. Repetir-ho per cada pis. I si gestiones pisos de tercers, preparar la liquidació per a cada propietari. Són hores de feina que no haurien d\'existir.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Els teus ingressos, al dia',
        body: 'Cada reserva entra automàticament amb import brut, comissió de plataforma descomptada i net real que reps. Sense copiar res.',
      },
      {
        step: 2,
        title: 'Tria període, pis o plataforma',
        body: 'Filtra per apartament, per Airbnb/Booking/canal directe o per mes. El quadre financer apareix en segons.',
      },
      {
        step: 3,
        title: 'Liquidació al propietari en un clic',
        body: 'Si gestiones pisos de tercers, l\'informe mensual surt sol amb el desglossament que cada propietari necessita. El dia que marquis.',
      },
      {
        step: 4,
        title: 'Exporta per al teu gestor fiscal',
        body: 'Un arxiu amb tot l\'any. La teva assessoria l\'obre i ja té el que necessita per a la declaració. Sense retocar-lo.',
      },
    ],
    advantages: [
      'Comissions d\'Airbnb i Booking calculades automàticament',
      'Taxa turística recaptada i traçada per reserva',
      'P&L per apartament, per plataforma i per període',
      'Liquidacions mensuals a propietaris automatitzades',
      'Exportació compatible amb la teva gestoria (Excel i CSV)',
      'Comparativa mensual i anual d\'ingressos',
    ],
    usage: [
      {
        title: 'Saber quant vas guanyar a l\'agost en 10 segons',
        body: 'Sense sumar res. Filtres agost, veus el total per pis i per plataforma. Quant va cobrar Airbnb, quant Booking, quant tu.',
      },
      {
        title: 'Enviar el tancament mensual als teus propietaris',
        body: 'Cada propietari rep la seva liquidació detallada automàticament. Ingressos, la teva comissió de gestió, despeses i net. Sense que tu ho preparis.',
      },
      {
        title: 'Preparar la declaració de la renda',
        body: 'Tot l\'any en un arxiu. El teu gestor l\'obre i ja sap el que necessita. Sense correus de "em pots passar les dades dels pisos?".',
      },
    ],
    relatedFeatures: ['channel-manager', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: 'Calcula automàticament les comissions d\'Airbnb i Booking?',
        answer:
          'Sí. La comissió d\'Airbnb (~3%) i la de Booking (~15%) s\'apliquen automàticament segons el canal de cada reserva. El net que veus és el que realment cobres, sense haver-ho de calcular tu.',
      },
      {
        question: 'Puc generar liquidacions per a propietaris de pisos que gestiono?',
        answer:
          'Sí. Configures el percentatge de gestió per propietat i l\'informe mensual de cada propietari surt automàticament el dia que marques. Amb el desglossament d\'ingressos, la teva comissió i el net que els correspon.',
      },
      {
        question: 'El format d\'exportació és compatible amb assessories?',
        answer:
          'Sí. Exportem en Excel i CSV amb el desglossament estàndard que demanen la majoria de gestories. Si la teva en necessita un d\'específic, ens ho dius i l\'adaptem.',
      },
    ],
  },

  // ─────────────────────────────── SENSE BUROCRÀCIA ───────────────────────────────
  {
    slug: 'burocracia',
    name: 'Sense burocràcia',
    iconName: 'ClipboardCheck',
    shortDescription:
      'NRUA, taxa turística, declaració de la renda, impostos municipals i tot el que l\'administració et demana. Hostly t\'avisa, et prepara les dades i et guia pas a pas.',
    hero: {
      h1: 'La burocràcia del pis turístic, resolta.',
      sub: 'Els únics a Espanya que cobrim tota la burocràcia del lloguer turístic — no només el registre policial. NRUA, taxa turística, declaració de la renda, impostos municipals. Hostly t\'avisa, et prepara les dades i et guia pas a pas.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure el calendari fiscal',
    },
    problem: {
      title: 'Cada trimestre, una sorpresa nova',
      body: 'El registre NRUA que se t\'havia passat. La taxa turística que va vèncer ahir. L\'IRPF dels rendiments del lloguer que no saps com calcular. El número d\'inscripció que demana la CCAA. Cada administració et demana una cosa diferent, en formats diferents, i ningú t\'ho explica clar. La majoria de gestors se\'n assabenten quan arriba la sanció.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Calendari fiscal personalitzat per CCAA',
        body: 'Hostly sap quins impostos i terminis t\'apliquen segons la teva comunitat autònoma, el tipus de propietat i els teus ingressos. Veus tots els venciments de l\'any en una sola vista.',
      },
      {
        step: 2,
        title: 'Avisos abans del venciment — no després',
        body: '15 dies abans del termini t\'avisem perquè preparis el que calgui. 24h abans, t\'avisem un altre cop. Mai arribes tard a una presentació.',
      },
      {
        step: 3,
        title: 'Dades preparades, no en brut',
        body: 'Generem l\'informe o l\'arxiu en el format que demana cada administració — amb les dades del període corresponent, llestes per presentar.',
      },
      {
        step: 4,
        title: 'Pas a pas o automàtic',
        body: 'El que es pot presentar automàticament, ho presentem. El que requereix la teva signatura o el teu gestor, et guiem pas a pas pel portal corresponent.',
      },
    ],
    advantages: [
      'Calendari fiscal específic per CCAA (Catalunya, Balears, Madrid, Andalusia…)',
      'Avisos abans del venciment — no després',
      'Dades per al teu gestor preparades sense retocs',
      'Guies pas a pas per a portals d\'ajuntaments i administracions',
      'Rendiments per a IRPF calculats i agrupats per any',
      'Cobertura única a Espanya: no només el registre policial, també la fiscalitat',
    ],
    usage: [
      {
        title: 'Presentar la taxa turística trimestral',
        body: 'Hostly genera l\'informe amb totes les pernoctacions del trimestre. T\'explica què clicar al portal de l\'ajuntament i en quin camp va cada dada. En 5 minuts, presentada.',
      },
      {
        title: 'Preparar la declaració de la renda',
        body: 'Tots els rendiments del lloguer turístic de l\'any, en un arxiu organitzat. La teva gestoria l\'obre i té el que necessita — sense fer-te preguntes, sense retocs.',
      },
      {
        title: 'Inscripció al NRUA per primera vegada',
        body: 'Si mai has registrat la teva propietat al NRUA (Andalusia), et guiem pel formulari. Et diem quins documents preparar i on trobar cada dada.',
      },
    ],
    relatedFeatures: ['check-in-online', 'finanzas', 'conecta-todo'],
    faqs: [
      {
        question: 'Hostly presenta directament la meva declaració de la renda?',
        answer:
          'No la presentem directament perquè cada cas fiscal és diferent. El que fem és preparar-te TOTES les dades de l\'any en un arxiu clar i ordenat que la teva gestoria obre i processa sense retocs. Només això ja estalvia hores de feina cada any.',
      },
      {
        question: 'Cobriu la fiscalitat de totes les comunitats autònomes?',
        answer:
          'Sí. El calendari fiscal és específic per cada CCAA. Si gestiones pisos a Catalunya, Aragó, Balears, Madrid, Andalusia o qualsevol altra, Hostly coneix els requeriments i terminis de cada lloc. Si l\'administració canvia alguna cosa, ho actualitzem nosaltres.',
      },
      {
        question: 'Quina diferència hi ha amb el check-in i el registre policial?',
        answer:
          'El check-in s\'ocupa del que passa a cada reserva: registre policial, taxa cobrada a l\'hoste, comunicació a les autoritats. La burocràcia s\'ocupa del que passa cada trimestre o cada any: presentacions fiscals, inscripcions, declaració de la renda, impostos municipals. Són dues capes diferents que Hostly cobreix per separat.',
      },
    ],
  },
];
