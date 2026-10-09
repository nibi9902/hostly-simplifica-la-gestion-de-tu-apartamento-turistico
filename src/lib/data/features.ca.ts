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
      'Contesta els teus hostes per WhatsApp, 24/7 i en el seu idioma, amb la informació de cada pis. T\'avisa només quan cal una persona.',
    hero: {
      h1: 'Un agent que respon per WhatsApp mentre tu no mires el mòbil',
      sub: 'Contesta dubtes de check-in, normes, wifi o incidències amb la informació de cada pis. La majoria, a l\'instant. La resta te la passa a tu.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'El teu mòbil no hauria de sonar a les 2 de la matinada per preguntar on és el garatge',
      body: 'Gestionar pisos turístics acaba sent respondre les mateixes preguntes tot el dia. El wifi, com obrir la porta, si poden entrar abans. Multiplica-ho per tres pisos i un cap de setmana ple: ja no descanses.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Connectes les reserves, no el teu WhatsApp',
        body: 'Connectes Airbnb i Booking. Els teus hostes escriuen a un número de WhatsApp gestionat per Hostly, amb l\'API oficial de Meta: no instal·les ni configures res.',
      },
      {
        step: 2,
        title: 'Omples la fitxa de cada pis',
        body: 'El wifi, com entrar, normes, pàrquing, recomanacions. La IA respon amb això i amb les dades de la reserva: pis, dates i hostes.',
      },
      {
        step: 3,
        title: 'La IA respon i t\'avisa quan toca',
        body: 'Contesta al moment, de dia o de nit, en l\'idioma de l\'hoste. Si alguna cosa necessita una persona, t\'avisa amb el pis i les primeres paraules del missatge.',
      },
      {
        step: 4,
        title: 'Tu ho veus tot en una sola safata',
        body: 'WhatsApp, Airbnb i Booking al mateix lloc. Prens el control de qualsevol conversa quan vulguis. Si corregeixes una resposta, la IA en guarda la lliçó i la veus al xat.',
      },
    ],
    advantages: [
      'Contesta 24/7 en l\'idioma de l\'hoste, sigui quin sigui',
      'Respon amb la fitxa de cada pis i les dades de la reserva, no en genèric',
      'T\'avisa quan cal una persona, amb el pis i les primeres paraules',
      'Aprèn de les teves correccions, i cada lliçó es veu al xat',
      'WhatsApp, Airbnb i Booking en una sola safata',
      'Cada resposta de la IA queda marcada com a seva',
    ],
    usage: [
      {
        title: 'Arribada a mitjanit',
        body: 'L\'hoste pregunta com arribar al pis a les 23:45. La IA li contesta amb les instruccions d\'aquell pis, en el seu idioma. Tu dorms.',
      },
      {
        title: 'Dubtes d\'última hora',
        body: 'Pregunten si hi ha pàrquing, si admeten mascotes, si es pot fumar. La IA respon amb el que diu la fitxa del pis. Si no ho sap, t\'avisa.',
      },
      {
        title: 'Una queixa de debò',
        body: 'L\'aire condicionat no refreda. La IA t\'avisa amb el pis i les primeres paraules del missatge, i tu prens el control de la conversa.',
      },
    ],
    relatedFeatures: ['mensajeria-programada', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: 'Puc revisar el que respon abans que s\'enviï?',
        answer:
          'No hi ha revisió prèvia: la IA contesta sola. El que sí que pots fer és activar-la o apagar-la a cada pis i prendre el control de qualsevol conversa quan vulguis.',
      },
      {
        question: 'Què passa si un hoste pregunta una cosa que la IA no sap?',
        answer:
          'T\'avisa amb el pis i les primeres paraules del missatge, i contestes tu. Si corregeixes una resposta, la IA en guarda la lliçó per a la propera vegada.',
      },
      {
        question: 'Parla català de veritat?',
        answer:
          'Sí. Contesta en l\'idioma en què escriu l\'hoste: català, castellà, anglès, francès o el que sigui. No has de configurar res.',
      },
      {
        question: 'Necessito WhatsApp Business?',
        answer:
          'No. Hostly fa servir l\'API oficial de WhatsApp (Meta) amb un número gestionat per Hostly. Els teus hostes escriuen a aquest número i tu no instal·les ni configures res.',
      },
    ],
  },

  // ─────────────────────────────── CHECK-IN ONLINE ───────────────────────────────
  {
    slug: 'check-in-online',
    name: 'Check-in online i registre a la policia',
    iconName: 'ShieldCheck',
    shortDescription:
      'L\'hoste omple les seves dades des del mòbil i Hostly envia el registre a la policia. A Catalunya, als Mossos d\'Esquadra. Gratis per sempre.',
    hero: {
      h1: 'El registre a la policia, sense copiar ni una dada a mà',
      sub: 'L\'hoste omple les seves dades des del mòbil i Hostly les valida. A Catalunya, les envia cada dia als Mossos d\'Esquadra. A la resta d\'Espanya, la connexió l\'activem amb tu quan et dones d\'alta.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'El registre de viatgers t\'ocupa més temps del que caldria',
      body: 'Cada hoste ha de quedar registrat a la policia. Molts propietaris encara demanen les dades per WhatsApp, les copien a mà i entren al portal un per un. En temporada alta és impossible portar-ho al dia sense errors.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'L\'hoste rep el seu enllaç',
        body: 'A Hostly Complet, li arriba amb els missatges automàtics, en el seu idioma. Al pla Gratis, cada pis té el seu enllaç fix per compartir-lo amb els teus hostes.',
      },
      {
        step: 2,
        title: 'Omple les seves dades des del mòbil',
        body: 'Nom, document, data de naixement, nacionalitat i adreça, en castellà, anglès o francès. Un adult pot registrar tot el grup amb el mateix enllaç.',
      },
      {
        step: 3,
        title: 'Hostly comprova cada dada',
        body: 'Abans d\'enviar res, valida cada camp. Si falta alguna cosa o no és vàlida, l\'hoste la corregeix al moment. El codi d\'accés només apareix quan el check-in està fet.',
      },
      {
        step: 4,
        title: 'Hostly ho envia a la policia',
        body: 'A Catalunya, cada dia a les 15:00 puja el fitxer al portal dels Mossos d\'Esquadra i n\'arxiva el comprovant. Si alguna línia falla, t\'avisa i et diu quina.',
      },
    ],
    advantages: [
      'Formulari al mòbil, en castellà, anglès i francès',
      'Cada dada es valida abans d\'enviar-la',
      'Un adult registra tot el grup amb el mateix enllaç',
      'El codi d\'accés, només quan el check-in està fet',
      'Enviament diari als Mossos d\'Esquadra, amb el comprovant arxivat',
      'Avís si falta un check-in o si un registre falla',
    ],
    usage: [
      {
        title: 'Família de quatre',
        body: 'Un adult registra els quatre amb el mateix enllaç. Si una dada no és vàlida, ho veu abans d\'enviar, no quan ja és tard.',
      },
      {
        title: 'Pisos a Catalunya',
        body: 'Cada dia a les 15:00, Hostly puja als Mossos els check-ins pendents i en guarda el comprovant. Tu no entres a cap portal.',
      },
      {
        title: 'Arribada a mitjanit',
        body: 'L\'hoste fa el check-in a les 23:00 i només llavors veu el codi de la porta. El registre surt amb l\'enviament de l\'endemà, sense que tu et despertis.',
      },
    ],
    relatedFeatures: ['burocracia', 'mensajeria-programada', 'ia-whatsapp'],
    faqs: [
      {
        question: 'Substitueix Chekin?',
        answer:
          'Si els teus pisos són a Catalunya, sí: el check-in i l\'enviament als Mossos funcionen sols, sense cap altra app pel mig. A la resta d\'Espanya, activem la connexió amb la policia amb tu quan et dones d\'alta.',
      },
      {
        question: 'Què passa si un registre falla?',
        answer:
          'Hostly llegeix la resposta del portal dels Mossos línia a línia. Si alguna falla, t\'avisa i et diu quina, perquè la corregeixis.',
      },
      {
        question: 'L\'hoste ha de pujar una foto del document?',
        answer:
          'No. Només escriu les seves dades: tipus i número de document, nom, data de naixement, nacionalitat i adreça. Hostly comprova que són vàlides abans d\'enviar-les.',
      },
      {
        question: 'Quant costa?',
        answer:
          'Res. El check-in online i el registre a la policia són gratis per sempre, sense targeta. A Catalunya, també la taxa turística.',
      },
    ],
  },

  // ─────────────────────────── RESERVES I CALENDARIS (channel-manager) ───────────────────────────
  {
    slug: 'channel-manager',
    name: 'Reserves i calendaris',
    iconName: 'Calendar',
    shortDescription:
      'Airbnb i Booking en un sol calendari. Les reserves entren al moment i, dins de Hostly, dues reserves no es poden solapar.',
    hero: {
      h1: 'Un sol calendari per a Airbnb, Booking i les teves reserves',
      sub: 'Les reserves entren soles, els bloquejos arriben als canals a l\'instant i els preus es publiquen des d\'un sol lloc.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'Portar diversos calendaris a mà acaba en una doble reserva',
      body: 'Tenir Airbnb i Booking amb calendaris separats és qüestió de temps. Un bloqueig que tardes a posar, un canvi de dates que no actualitzes, i acabes amb dues reserves la mateixa nit. Es perden diners i reputació.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Connectes Airbnb i Booking',
        body: 'Airbnb, amb el teu compte. Booking.com, amb l\'ID de la teva propietat. Ho fem amb tu a la configuració del primer mes.',
      },
      {
        step: 2,
        title: 'Importem el teu històric',
        body: 'Portem les teves reserves. A partir d\'aquell moment, cada reserva nova entra sola, i cada 20 minuts Hostly ho torna a comprovar per si se n\'ha quedat alguna pel camí.',
      },
      {
        step: 3,
        title: 'Ho gestiones tot des d\'un calendari',
        body: 'Els bloquejos que poses arriben a Airbnb i Booking a l\'instant. Els preus es publiquen cada matí i cada cop que canvies alguna cosa.',
      },
      {
        step: 4,
        title: 'I les teves reserves directes, també',
        body: 'Les que t\'arriben per telèfon les apuntes en un moment. I si vols un web propi amb reserves directes, el muntem amb tu, a mida.',
      },
    ],
    advantages: [
      'Airbnb i Booking.com en un sol calendari',
      'Cada reserva entra al moment, amb una comprovació cada 20 minuts',
      'Dins de Hostly, dues reserves no es poden solapar',
      'Bloquejos que arriben als canals a l\'instant',
      'El teu històric de reserves, importat',
      'Les teves reserves directes, al mateix calendari',
    ],
    usage: [
      {
        title: 'Bloqueig per reforma',
        body: 'Marques cinc dies de bloqueig a Hostly. Airbnb i Booking els reben a l\'instant.',
      },
      {
        title: 'Pujada de preu per Setmana Santa',
        body: 'Canvies el preu una vegada a Hostly. Es publica a Airbnb i Booking tan bon punt el deses.',
      },
      {
        title: 'Cancel·lació d\'última hora',
        body: 'Un hoste cancel·la a Airbnb. La cancel·lació entra a Hostly, la neteja d\'aquell dia es cancel·la i el teu equip en rep l\'avís.',
      },
    ],
    relatedFeatures: ['precios-dinamicos', 'gestion-de-limpiezas', 'conecta-todo'],
    faqs: [
      {
        question: 'Quines plataformes connecteu?',
        answer:
          'Airbnb i Booking.com. Les reserves directes també entren al mateix calendari; si vols un web propi amb reserves, el muntem a mida.',
      },
      {
        question: 'Necessito un altre channel manager?',
        answer:
          'No. Hostly es connecta amb Airbnb i Booking a través d\'un channel manager que treballa per darrere. Tu ho veus i ho canvies tot des de Hostly.',
      },
      {
        question: 'I si una reserva tarda a arribar?',
        answer:
          'Cada reserva entra tan bon punt la plataforma l\'envia. A més, cada 20 minuts Hostly torna a comprovar els canals per si se n\'ha quedat alguna pel camí.',
      },
      {
        question: 'Puc fer servir Hostly sense connectar Airbnb ni Booking?',
        answer:
          'Sí. Al pla Gratis, Hostly llegeix el teu calendari d\'Airbnb i Booking amb l\'enllaç iCal cada 30 minuts, per al check-in i el registre a la policia.',
      },
    ],
  },

  // ─────────────────────────────── GESTIÓ NETEGES ───────────────────────────────
  {
    slug: 'gestion-de-limpiezas',
    name: 'Gestió de neteges amb app per a l\'equip',
    iconName: 'Sparkles',
    shortDescription:
      'Cada sortida crea la seva neteja i avisa qui li toca. Fotos de sortida, incidències i el que deus cada mes, sense grups de WhatsApp caòtics.',
    hero: {
      h1: 'Coordina neteges sense viure en un grup de WhatsApp',
      sub: 'Cada sortida crea la seva neteja. Si algú no pot, passa a la següent del torn. I en acabar, fotos de com queda el pis.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'Els grups de WhatsApp amb l\'equip de neteja no escalen',
      body: 'Quan passes de dos a cinc pisos, coordinar neteges per WhatsApp es torna un caos. Missatges perduts, horaris que no quadren, incidències sense foto i ningú no sap qui hi va dissabte. Al final ets tu qui ho coordina tot a mà.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Muntes l\'equip de cada pis',
        body: 'Afegeixes les persones que netegen cada pis i l\'ordre del torn. Cadascuna fa servir la seva app, en català, castellà o anglès, o l\'assistent de WhatsApp.',
      },
      {
        step: 2,
        title: 'Cada sortida crea la seva neteja',
        body: 'Per cada sortida, Hostly crea la neteja d\'aquell dia i avisa qui li toca. Si canvien les dates, avisa del canvi.',
      },
      {
        step: 3,
        title: 'Si algú no pot, passa a la següent',
        body: 'Si la persona diu «no puc», la neteja passa a la següent del torn, que en rep l\'avís per WhatsApp. Tu no has de buscar ningú.',
      },
      {
        step: 4,
        title: 'En acabar, fotos i incidències',
        body: 'La neteja es marca com a feta amb fotos de sortida. Si hi ha alguna cosa trencada o l\'hoste s\'ha deixat alguna cosa, queda com a incidència amb data, pis i persona.',
      },
    ],
    advantages: [
      'Una neteja per cada sortida, creada sola',
      'Equip per pis, amb ordre de torn',
      '«No puc» la passa a la següent, amb avís per WhatsApp',
      'Fotos de sortida a cada neteja',
      'Incidències amb data, pis i persona',
      'Historial per pis i el que deus a cada persona cada mes',
    ],
    usage: [
      {
        title: 'Una baixa dissabte al matí',
        body: 'La netejadora diu «no puc» des de l\'app o per WhatsApp. La neteja passa a la següent del torn, que en rep l\'avís. Tu no has de fer res.',
      },
      {
        title: 'Cancel·lació d\'última hora',
        body: 'Es cancel·la una reserva a les 10:00. La neteja es cancel·la sola i la persona que la tenia en rep l\'avís.',
      },
      {
        title: 'L\'hoste s\'ha deixat roba',
        body: 'Queda com a incidència, amb la data, el pis i la persona, i es guarda a l\'historial del pis. Tu avises l\'hoste des de Hostly.',
      },
    ],
    relatedFeatures: ['multi-rol', 'conecta-todo', 'channel-manager'],
    faqs: [
      {
        question: 'I si el meu equip no vol instal·lar una altra app?',
        answer:
          'Pot rebre els avisos i contestar per WhatsApp, amb l\'assistent. I si fa servir l\'app, la té en català, castellà o anglès.',
      },
      {
        question: 'Puc pagar el meu equip des de Hostly?',
        answer:
          'No. Hostly et diu el que deus a cada persona cada mes, però el pagament el fas tu, fora de Hostly.',
      },
      {
        question: 'Què passa si canvien les dates d\'una reserva?',
        answer:
          'La persona que tenia la neteja rep l\'avís del canvi. Si la reserva es cancel·la, la neteja es cancel·la sola i també se l\'avisa.',
      },
      {
        question: 'Funciona amb una empresa de neteja externa?',
        answer:
          'Sí. Afegeixes les seves persones a l\'equip dels pisos que netegen. Reben els avisos i marquen les neteges com la resta de l\'equip.',
      },
    ],
  },

  // ─────────────────────────────── PREUS DINÀMICS ───────────────────────────────
  {
    slug: 'precios-dinamicos',
    name: 'Preus dinàmics amb PriceLabs',
    iconName: 'TrendingUp',
    shortDescription:
      'Les recomanacions de PriceLabs, dins de Hostly. Tu poses els límits i Hostly publica el preu a Airbnb i Booking cada dia.',
    hero: {
      h1: 'Preus que segueixen la demanda, sense sortir de Hostly',
      sub: 'PriceLabs recomana un preu per a cada dia. Tu poses els límits, veus per què surt cada preu i Hostly el publica a Airbnb i Booking.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'El preu fix et fa perdre diners',
      body: 'Posar el mateix preu tot l\'any et fa perdre ingressos en temporada alta i et deixa el pis buit en temporada baixa. Revisar preus a mà cada setmana és una feina que no s\'acaba mai. I tenir els preus en una app i el calendari en una altra és una cosa més a vigilar.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Poses les teves regles',
        body: 'Preu mínim i màxim, temporades, dies amb preu fix, nits mínimes i descomptes per setmana o per mes.',
      },
      {
        step: 2,
        title: 'PriceLabs recomana',
        body: 'Analitza la demanda, la temporada i els esdeveniments de la teva zona, i proposa un preu per a cada dia.',
      },
      {
        step: 3,
        title: 'Tu decideixes',
        body: 'Al calendari de Hostly veus el preu recomanat i per què. En mode manual, l\'acceptes amb un clic. En automàtic, s\'aplica sol dins dels teus límits.',
      },
      {
        step: 4,
        title: 'Es publica a Airbnb i Booking',
        body: 'Hostly publica els preus cada matí i cada cop que canvies alguna cosa.',
      },
    ],
    advantages: [
      'Les recomanacions de PriceLabs, dins de Hostly',
      'Mínims, màxims, temporades i dies amb preu fix',
      'Nits mínimes i descomptes per setmana o per mes',
      'Preu recomanat, acceptat amb un clic',
      '«Per què aquest preu?»: veus d\'on surt cada preu',
      'Publicat a Airbnb i Booking cada matí i a cada canvi',
    ],
    usage: [
      {
        title: 'Un concert gran a la ciutat',
        body: 'PriceLabs detecta la demanda d\'aquells dies i recomana apujar el preu. Ho veus al calendari de Hostly i ho acceptes amb un clic.',
      },
      {
        title: 'La temporada d\'estiu',
        body: 'Crees la temporada de juliol i agost. Els preus d\'aquells dies surten de les teves regles i Hostly els publica a Airbnb i Booking.',
      },
      {
        title: 'Un preu que no entens',
        body: 'Un dimarts qualsevol surt més car del normal. Obres «per què aquest preu?» i veus d\'on surt abans de decidir.',
      },
    ],
    relatedFeatures: ['channel-manager', 'conecta-todo'],
    faqs: [
      {
        question: 'Hostly fa servir PriceLabs?',
        answer:
          'Sí. Les recomanacions venen de PriceLabs, que analitza la demanda, la temporada i els esdeveniments de la teva zona. Tu ho veus i ho decideixes tot des de Hostly.',
      },
      {
        question: 'Puc aprovar els preus a mà?',
        answer:
          'Sí. En mode manual veus el preu recomanat i l\'acceptes amb un clic. En mode automàtic s\'aplica sol, sempre dins dels teus mínims i màxims.',
      },
      {
        question: 'Puc fixar el preu d\'un dia concret?',
        answer:
          'Sí. Un dia amb preu fix es respecta tal com el poses, encara que PriceLabs en recomani un altre.',
      },
      {
        question: 'Cada quant s\'actualitzen els preus a Airbnb i Booking?',
        answer:
          'Hostly els publica cada matí i cada cop que canvies alguna cosa al calendari.',
      },
    ],
  },

  // ─────────────────────────────── MISSATGERIA PROGRAMADA ───────────────────────────────
  {
    slug: 'mensajeria-programada',
    name: 'Missatgeria programada per reserva',
    iconName: 'Send',
    shortDescription:
      'Benvinguda, check-in, check-out i més, enviats sols a cada reserva. Una versió per pis, traduïda a l\'idioma de l\'hoste.',
    hero: {
      h1: 'Missatges útils a cada hoste, sense escriure\'n cap a mà',
      sub: 'Plantilles per moment de la reserva, adaptades a cada pis i traduïdes soles. Surten per WhatsApp o, si no hi ha número, per Airbnb o Booking.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'Els missatges repetitius se t\'acumulen',
      body: 'Cada reserva necessita diversos missatges: benvinguda, instruccions d\'entrada, codis, comiat. Amb tres pisos i vint reserves al mes, són desenes de missatges gairebé iguals. Escriure\'ls a mà és temps perdut.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Escrius cada plantilla una vegada',
        body: 'Benvinguda, check-in, check-out, neteja, entrada anticipada, sortida tardana i quatre missatges lliures. Si vols, una versió diferent per a cada pis.',
      },
      {
        step: 2,
        title: 'Fas servir variables',
        body: 'L\'enllaç de check-in, els codis, les dates. Hostly les omple amb les dades de cada reserva.',
      },
      {
        step: 3,
        title: 'Hostly la tradueix',
        body: 'Cada missatge surt traduït a l\'idioma de l\'hoste. Tu escrius la plantilla una sola vegada.',
      },
      {
        step: 4,
        title: 'Surt pel canal que toca',
        body: 'Per WhatsApp si tens el número de l\'hoste. Si no, per Airbnb o Booking. Tot queda a l\'historial de la reserva.',
      },
    ],
    advantages: [
      'Una plantilla per moment: benvinguda, check-in, check-out i neteja',
      'Quatre missatges lliures, i a més entrada anticipada i sortida tardana',
      'Una versió per a cada pis, traduïda a l\'idioma de l\'hoste',
      'Variables: enllaç de check-in, codis i dates',
      'Per WhatsApp o, si no hi ha número, per Airbnb o Booking',
      'Historial de missatges a cada reserva',
    ],
    usage: [
      {
        title: 'Una reserva qualsevol',
        body: 'La benvinguda, les instruccions amb l\'enllaç de check-in i el missatge de sortida, cadascun en el seu moment. Tu no n\'escrius cap.',
      },
      {
        title: 'Un missatge per a cada pis',
        body: 'El pis amb piscina rep les normes d\'ús. El del centre, on aparcar. Cadascun, el seu missatge.',
      },
      {
        title: 'Hoste de França',
        body: 'Els missatges li arriben en francès, traduïts sols. Tu vas escriure la plantilla una vegada, en el teu idioma.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: 'Puc aturar un missatge abans que surti?',
        answer:
          'Sí. Veus els missatges a la cua i en pots cancel·lar qualsevol. Per canviar-ne el text, edites la plantilla.',
      },
      {
        question: 'Funciona sense la IA?',
        answer:
          'Sí. Els missatges automàtics funcionen sols. Si a més actives la IA, contesta quan l\'hoste respon.',
      },
      {
        question: 'Quantes plantilles puc tenir?',
        answer:
          'Una per moment: benvinguda, check-in, check-out, neteja, entrada anticipada, sortida tardana i quatre de lliures. Cadascuna pot tenir la seva versió per pis i es tradueix sola.',
      },
      {
        question: 'Es poden enviar per correu electrònic?',
        answer:
          'No. Surten per WhatsApp si tens el número de l\'hoste i, si no, per Airbnb o Booking.',
      },
    ],
  },

  // ─────────────────────────────── ROLS I PERMISOS (multi-rol) ───────────────────────────────
  {
    slug: 'multi-rol',
    name: 'Rols i permisos per pis',
    iconName: 'Users',
    shortDescription:
      'Cadascú veu el seu: gestors per pis, equip de neteja i propietaris només de lectura. Sense límit d\'usuaris.',
    hero: {
      h1: 'Cada persona del teu equip, amb el seu compte i els seus pisos',
      sub: 'Gestor, neteja i propietari, amb permisos per pis. Els propietaris només miren: el calendari i les finances dels seus pisos.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'Compartir dades per WhatsApp és mal negoci',
      body: 'Quan l\'equip creix, has de donar accés a la neteja, a un gestor de confiança o als propietaris. Passar dades per WhatsApp o deixar-los el teu usuari d\'Airbnb no és una opció. I quan algú se\'n va, s\'emporta la teva contrasenya.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Convides cada persona',
        body: 'Li envies una invitació amb el seu paper: gestor, neteja o propietari. Si no l\'accepta, la invitació caduca.',
      },
      {
        step: 2,
        title: 'Tries els seus pisos',
        body: 'Un gestor pot portar tots els teus pisos o només alguns. La neteja i els propietaris, només els seus.',
      },
      {
        step: 3,
        title: 'Cadascú entra amb el seu compte',
        body: 'Des del mòbil o l\'ordinador. La neteja veu les seves neteges; el propietari, el calendari i les finances dels seus pisos, sense poder canviar res.',
      },
    ],
    advantages: [
      'Tres papers clars: gestor, neteja i propietari',
      'Permisos per pis: cada gestor porta els pisos que li dones',
      'Propietaris només de lectura: calendari i finances',
      'A l\'app, cadascú veu el seu: qui neteja, les seves neteges; el gestor, les seves reserves',
      'Sense límit d\'usuaris',
      'L\'hoste no necessita compte: rep un enllaç de la seva estada',
    ],
    usage: [
      {
        title: 'Gestor amb tres propietaris',
        body: 'Cada propietari veu el calendari i les finances dels seus pisos. No veu els de la resta ni pot canviar res.',
      },
      {
        title: 'Dos gestors, pisos repartits',
        body: 'Un porta els pisos de la platja i l\'altre els de la ciutat. Cadascun veu i gestiona només els seus.',
      },
      {
        title: 'Canvi de personal',
        body: 'Una persona deixa l\'equip. Li treus l\'accés i deixa de veure els teus pisos en aquell moment.',
      },
    ],
    relatedFeatures: ['gestion-de-limpiezas', 'finanzas'],
    faqs: [
      {
        question: 'Quants usuaris puc donar d\'alta?',
        answer:
          'Tots els que necessitis. No hi ha límit d\'usuaris.',
      },
      {
        question: 'Puc donar accés temporal?',
        answer:
          'No hi ha accessos amb data de caducitat: el que caduca és la invitació si no s\'accepta. Quan algú deixa de treballar amb tu, li treus l\'accés.',
      },
      {
        question: 'El propietari pot canviar alguna cosa?',
        answer:
          'No. Només veu el calendari i les finances dels seus pisos, incloses les liquidacions que li prepares.',
      },
      {
        question: 'Els hostes necessiten un compte?',
        answer:
          'No. Cada hoste rep un enllaç de la seva estada, sense registrar-se enlloc.',
      },
    ],
  },

  // ─────────────────────────────── CONECTA-HO TOT ───────────────────────────────
  {
    slug: 'conecta-todo',
    name: 'Connecta-ho tot',
    iconName: 'Plug',
    shortDescription:
      'Automatitzacions a mida: connectem Hostly amb la teva gestoria, el teu web, el teu ERP o el que facis servir. Servei a part, amb quota mensual.',
    hero: {
      h1: 'Automatitzacions a mida: si ho fas servir, ho connectem.',
      sub: 'Connectem Hostly amb la teva gestoria, el teu web, el teu ERP o el que facis servir. És un servei a part, amb una quota mensual segons el que automatitzem.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'Hi ha feines que cap app no fa per tu',
      body: 'Cada gestor treballa a la seva manera. La gestoria et demana les dades en el seu format, el teu web va per lliure i hi ha feines que repeteixes a mà cada setmana. Cap app no les cobreix totes de sèrie, i acabes fent-les tu per sempre.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Ens expliques què necessites',
        body: 'Què fas a mà, amb quines eines i cada quant. Escriu-nos amb el teu cas.',
      },
      {
        step: 2,
        title: 'Et proposem com i quant',
        body: 'Ho estudiem i et diem què es pot automatitzar i quina seria la quota mensual. No comencem fins que ens diguis que sí.',
      },
      {
        step: 3,
        title: 'Ho construïm',
        body: 'Ho connectem amb el teu Hostly sense que hagis de tocar res. T\'avisem quan estigui funcionant.',
      },
      {
        step: 4,
        title: 'Funciona sol',
        body: 'S\'executa cada cop que toca. Tu no has de fer res més.',
      },
    ],
    advantages: [
      'Connectem Hostly amb la teva gestoria, el teu web, el teu ERP o el que facis servir',
      'Ho estudiem amb tu abans de començar',
      'Quota mensual segons el que automatitzem, pactada abans de començar',
      'Avisos i tasques a la mida de la teva manera de treballar',
      'Tu no toques res: ho muntem nosaltres',
      'De sèrie, Hostly ja exporta a Excel i CSV',
    ],
    usage: [
      {
        title: 'Les dades que demana la teva gestoria',
        body: 'Cada mes, la informació que necessita la teva gestoria, en el seu format i sense copiar-la a mà.',
      },
      {
        title: 'El teu web, connectat',
        body: 'Si ja tens web, el connectem amb Hostly perquè les reserves directes entrin al mateix calendari.',
      },
      {
        title: 'Avisos a la teva manera',
        body: 'Un avís al teu equip quan passa alguna cosa concreta, amb les dades que necessita cada persona.',
      },
    ],
    relatedFeatures: ['channel-manager', 'finanzas', 'burocracia'],
    faqs: [
      {
        question: 'Quant costa?',
        answer:
          'Una quota mensual segons el que automatitzem. Te la diem abans de començar, quan sabem què necessites.',
      },
      {
        question: 'Com ho demano?',
        answer:
          'Escriu-nos a hola@hostlylabs.com amb el teu cas: què fas a mà i amb quines eines. Ho estudiem i et responem amb una proposta.',
      },
      {
        question: 'Quant tarda?',
        answer:
          'Depèn del que calgui connectar. T\'ho diem a la proposta, abans de començar.',
      },
      {
        question: 'Què fa Hostly sense aquest servei?',
        answer:
          'Tot el que veus a les seves funcions, i exporta a Excel i CSV. Aquest servei és per al que va més enllà: la teva gestoria, el teu web, el teu ERP…',
      },
    ],
  },

  // ─────────────────────────────── FINANCES EN ORDRE ───────────────────────────────
  {
    slug: 'finanzas',
    name: 'Finances en ordre',
    iconName: 'BarChart3',
    shortDescription:
      'Ingressos per pis, canal i període, amb les comissions d\'Airbnb i Booking ja calculades. I la liquidació de cada propietari en quatre passos.',
    hero: {
      h1: 'Tanca el mes en minuts, no en una tarda.',
      sub: 'Ingressos per pis, per canal i per període. Les comissions d\'Airbnb i Booking, calculades soles. I la liquidació de cada propietari en quatre passos.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'El tancament de mes: la part que ningú volia',
      body: 'Obrir l\'Excel. Copiar les reserves d\'Airbnb. Descomptar-ne la comissió. Fer el mateix amb Booking. Sumar la taxa turística. Repetir-ho amb cada pis. I si gestiones pisos de tercers, preparar la liquidació de cada propietari. Són hores de feina que no haurien d\'existir.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Els teus ingressos, al dia',
        body: 'Cada reserva entra amb el seu import i la comissió de la plataforma ja calculada. Veus el que et queda sense copiar res.',
      },
      {
        step: 2,
        title: 'Filtra per pis, canal o període',
        body: 'Els ingressos d\'un pis, d\'Airbnb o de Booking, o d\'un mes concret, en un moment.',
      },
      {
        step: 3,
        title: 'Liquidació al propietari en quatre passos',
        body: 'Si gestiones pisos de tercers, un assistent et guia amb els teus honoraris i la neteja ja calculats. Cada propietari veu la seva a la seva app.',
      },
      {
        step: 4,
        title: 'Exporta el que necessitis',
        body: 'Les liquidacions, en CSV o PDF. La taxa turística, en Excel o CSV, a punt per presentar.',
      },
    ],
    advantages: [
      'Ingressos per pis, per canal i per període',
      'Comissions d\'Airbnb i Booking calculades soles',
      'Taxa turística de Catalunya calculada a cada reserva',
      'Liquidació al propietari amb un assistent de quatre passos',
      'El propietari veu la seva liquidació a la seva app',
      'Liquidacions en CSV o PDF, i taxa turística en Excel o CSV',
    ],
    usage: [
      {
        title: 'Saber quant vas guanyar a l\'agost',
        body: 'Sense sumar res. Filtres agost i veus el total per pis i per canal: quant es va quedar Airbnb, quant Booking i quant tu.',
      },
      {
        title: 'Tancar el mes amb els teus propietaris',
        body: 'Prepares la liquidació de cada propietari amb l\'assistent. Ell la veu a la seva app, amb els seus ingressos, els teus honoraris i la neteja.',
      },
      {
        title: 'Passar les dades a la teva gestoria',
        body: 'Exportes les liquidacions en CSV o PDF i la taxa turística en Excel. Les envies a la teva gestoria sense copiar res a mà.',
      },
    ],
    relatedFeatures: ['burocracia', 'multi-rol', 'channel-manager'],
    faqs: [
      {
        question: 'Calcula les comissions d\'Airbnb i Booking?',
        answer:
          'Sí. Hostly calcula la comissió de cada reserva segons el canal. Veus el que paga l\'hoste, el que es queda la plataforma i el que et queda a tu.',
      },
      {
        question: 'Puc fer liquidacions per als propietaris dels pisos que gestiono?',
        answer:
          'Sí. Un assistent de quatre passos t\'ajuda a preparar-les, amb els teus honoraris i la neteja. Cada propietari veu la seva a la seva app; Hostly no l\'envia per correu.',
      },
      {
        question: 'Què puc exportar per a la meva gestoria?',
        answer:
          'Les liquidacions, en CSV o PDF, i la taxa turística, en Excel o CSV. Si necessites alguna cosa a mida, ho mirem amb les automatitzacions de «Connecta-ho tot».',
      },
    ],
  },

  // ─────────────────────────── TAXA TURÍSTICA (slug burocracia) ───────────────────────────
  {
    slug: 'burocracia',
    name: 'Taxa turística',
    iconName: 'Receipt',
    shortDescription:
      'La taxa turística de Catalunya, calculada sola: tarifa segons la llei i el teu municipi, import per pis i l\'Excel a punt per presentar.',
    hero: {
      h1: 'La taxa turística, calculada i a punt per presentar.',
      sub: 'Hostly calcula la tarifa amb la llei i el municipi de cada pis, suma l\'import de cada semestre i et prepara l\'Excel per a l\'Agència Tributària de Catalunya. Tu la presentes i la marques com a feta.',
      primaryCta: 'Començar',
      secondaryCta: 'Veure preus',
    },
    problem: {
      title: 'Cada semestre, la mateixa tarda de comptes',
      body: 'A Catalunya, la taxa turística es presenta dues vegades l\'any: de l\'1 al 20 d\'abril i de l\'1 al 20 d\'octubre. Toca buscar la tarifa del teu municipi, comptar persones i nits de cada estada i passar-ho tot al format que demana l\'ATC. I el termini no espera.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Hostly sap quina tarifa et toca',
        body: 'La calcula amb la llei vigent i el municipi de cada pis. No has de buscar res.',
      },
      {
        step: 2,
        title: 'Calcula cada estada',
        body: 'Amb les dades de cada reserva, calcula l\'import de la taxa i el total per pis de cada semestre.',
      },
      {
        step: 3,
        title: 'T\'avisa quan toca presentar-la',
        body: 'Mentre el termini és obert, de l\'1 al 20 d\'abril i de l\'1 al 20 d\'octubre, veus un avís a l\'app.',
      },
      {
        step: 4,
        title: 'Exportes, presentes i ho marques',
        body: 'Descarregues l\'Excel o el CSV a punt per presentar a l\'ATC. Quan l\'has presentada, prems «ja l\'he presentada».',
      },
    ],
    advantages: [
      'Tarifa segons la llei i el municipi de cada pis',
      'Import de cada reserva i total per pis, cada semestre',
      'Avís a l\'app mentre el termini és obert',
      'Excel o CSV a punt per presentar a l\'ATC',
      'Inclosa al pla Gratis, per sempre',
      'Si vols, l\'hoste la paga amb targeta en fer el check-in',
    ],
    usage: [
      {
        title: 'Presentar el semestre d\'estiu',
        body: 'A l\'octubre, Hostly t\'avisa. Descarregues l\'Excel amb les estades d\'abril a setembre, el presentes a l\'ATC i la marques com a presentada.',
      },
      {
        title: 'Pisos en municipis diferents',
        body: 'Cada pis té la tarifa del seu municipi. Hostly la calcula per separat, sense que hagis de buscar res.',
      },
      {
        title: 'Cobrar-la a l\'hoste',
        body: 'Actives el cobrament i l\'hoste paga la taxa amb targeta en fer el check-in, a través de Stripe. El cobrament porta una petita comissió, que pots fer pagar a l\'hoste. Tu no has de perseguir ningú.',
      },
    ],
    relatedFeatures: ['check-in-online', 'finanzas', 'conecta-todo'],
    faqs: [
      {
        question: 'Hostly presenta la taxa per mi?',
        answer:
          'No. La presentes tu a l\'Agència Tributària de Catalunya, amb l\'Excel que et prepara Hostly. Després la marques com a presentada a l\'app.',
      },
      {
        question: 'Quan s\'ha de presentar?',
        answer:
          'Dues vegades l\'any: de l\'1 al 20 d\'abril, per les estades d\'octubre a març, i de l\'1 al 20 d\'octubre, per les d\'abril a setembre. Hostly t\'avisa a l\'app mentre el termini és obert.',
      },
      {
        question: 'Funciona fora de Catalunya?',
        answer:
          'Avui, la taxa que calcula Hostly és la de Catalunya. Si els teus pisos són en una altra comunitat, Hostly et serveix igual per a tota la resta.',
      },
      {
        question: 'Puc cobrar-la a l\'hoste?',
        answer:
          'Sí. Si ho actives, l\'hoste la paga amb targeta en fer el check-in, a través de Stripe. El cobrament porta una petita comissió; tu decideixes si la paga l\'hoste.',
      },
    ],
  },
];
