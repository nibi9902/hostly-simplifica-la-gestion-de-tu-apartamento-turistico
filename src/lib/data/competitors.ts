export interface Competitor {
  slug: string;
  name: string;
  tagline: string;
  target: string;
  priceNote: string;
  advantages: { title: string; body: string }[];
  comparison: { feature: string; hostly: boolean | string; them: boolean | string }[];
  faqs: { q: string; a: string }[];
}

// El que fa Hostly amb el registre de viatgers, dit igual a totes les comparatives.
const registroGratis =
  'Check-in online, registro de viajeros y tasa turística de Cataluña, gratis para siempre. Allí, Hostly envía el registro a los Mossos cada día, sin que hagas nada. En el resto de España, activamos contigo la conexión con la policía que te toque.';

// Quan no tenim una dada pública fiable d'una funció del competidor, no marquem ✗.
const consultar = 'Consultar';

/* Preus dels competidors: només els que surten a la seva pàgina oficial de preus,
 * comprovats l'octubre del 2026 (Icnea, Hostify, Smoobu, Hospitable, Guesty, Avantio).
 * Lodgify no es deixa llegir: sense xifra. Si un preu canvia, s'ha de tornar a mirar
 * a la seva web abans de tocar-lo aquí (i a competitors.ca.ts). */
export const competitors: Competitor[] = [
  {
    slug: 'icnea',
    name: 'Icnea',
    tagline: 'Hostly vs Icnea — La alternativa moderna al PMS español clásico',
    target: 'Gestores de 5-200 unidades en España y Portugal',
    priceNote: 'Icnea: desde 150 €/mes, hasta 10 propiedades (precio publicado en octubre de 2026) · Hostly: 40 €/mes por piso, 35 € desde 5',
    advantages: [
      { title: 'IA en WhatsApp', body: 'La IA de Hostly contesta la mayoría de mensajes al momento, en el idioma del huésped y 24/7, por la API oficial de WhatsApp. Cuando hace falta una persona, te avisa.' },
      { title: 'Precios con PriceLabs integrado', body: 'PriceLabs recomienda el precio de cada noche, tú pones mínimos y temporadas, y Hostly lo publica en Airbnb y Booking cada día.' },
      { title: 'App moderna y configuración contigo', body: 'En Hostly Completo, el primer mes lo configuramos todo contigo en una videollamada 1 a 1: pisos, canales y reservas.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'Pagas por piso', body: '40 €/mes por piso, 35 € desde 5, sin comisiones por reserva: con uno o dos pisos, pagas solo por esos. El primer mes, gratis.' },
    ],
    comparison: [
      { feature: 'IA en WhatsApp', hostly: true, them: consultar },
      { feature: 'Check-in y registro policial', hostly: 'Gratis para siempre', them: 'Sí' },
      { feature: 'Precios dinámicos', hostly: 'PriceLabs integrado', them: 'Vía integración' },
      { feature: 'Configuración 1 a 1 incluida', hostly: 'Con Hostly Completo', them: consultar },
      { feature: 'Precio con 1 piso', hostly: '40 €/mes', them: '150 €/mes (hasta 10)' },
      { feature: 'Catalán nativo', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Cuánto tarda la migración desde Icnea?', a: 'Depende de cuántos pisos tengas. En Hostly Completo, el cambio lo hacemos contigo durante el primer mes, en una configuración 1 a 1: pisos, canales y reservas.' },
      { q: '¿Es Hostly más caro que Icnea?', a: 'Depende de cuántos pisos tengas y de lo que necesites. Hostly cuesta 40 €/mes por piso, 35 € desde 5, con la IA en WhatsApp y los precios con PriceLabs integrado; el check-in y el registro a la policía son gratis. Icnea publica una cuota desde 150 €/mes para hasta 10 propiedades (precio de octubre de 2026). Haz números con tus pisos y compara lo que incluye cada uno.' },
    ],
  },
  {
    slug: 'hostify',
    name: 'Hostify',
    tagline: 'Hostly vs Hostify — Qué cambia para un gestor pequeño en España',
    target: 'Gestores pequeños y medianos (5-70 alojamientos) en España',
    priceNote: 'Hostify: desde 20 $ por alojamiento al mes, con tramos a partir de 5 alojamientos (precio publicado en octubre de 2026) · Hostly: 40 €/mes por piso, 35 € desde 5',
    advantages: [
      { title: 'IA en WhatsApp', body: 'La IA de Hostly contesta la mayoría de mensajes al momento, en el idioma del huésped y 24/7, con la información de cada piso. Viene con Hostly Completo.' },
      { title: 'Desde el primer piso', body: 'Los tramos de precio de Hostify empiezan en 5 alojamientos. Hostly cobra por piso desde el primero: 40 €/mes, 35 € desde 5. Y el check-in y el registro a la policía son gratis.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'En catalán y castellano', body: 'La app de Hostly está en catalán y castellano, y el soporte te lo da una persona, en los dos idiomas.' },
      { title: 'Precio en euros', body: 'Hostify publica sus precios en dólares, así que lo que pagas en euros puede variar con el cambio. Hostly cuesta 40 €/mes por piso, 35 € desde 5.' },
    ],
    comparison: [
      { feature: 'IA en WhatsApp', hostly: true, them: consultar },
      { feature: 'WhatsApp como canal principal', hostly: true, them: 'Parcial' },
      { feature: 'Precios dinámicos', hostly: 'PriceLabs integrado', them: 'Vía PriceLabs o Beyond' },
      { feature: 'Check-in y registro policial gratis', hostly: true, them: consultar },
      { feature: 'Catalán nativo', hostly: true, them: consultar },
      { feature: 'Precio en euros', hostly: true, them: false },
    ],
    faqs: [
      { q: '¿Por qué Hostly si Hostify ya tiene WhatsApp?', a: 'Hostly usa la API oficial de WhatsApp con un número gestionado por Hostly, así que no instalas ni configuras nada. La IA contesta con la información de cada piso y de la reserva, en el idioma del huésped, y te avisa cuando hace falta una persona. La activas o la desactivas por apartamento y puedes tomar el control de cualquier conversación.' },
      { q: '¿Son comparables en funcionalidades?', a: 'En lo básico, sí: reservas, check-in y channel manager (Hostly conecta Airbnb y Booking.com; Hostify, muchos más canales). La diferencia está en el enfoque: en Hostly, la IA contesta por WhatsApp, los precios van con PriceLabs integrado y el check-in con el registro a la policía es gratis, también si tienes un solo piso.' },
    ],
  },
  {
    slug: 'icnea',
    name: 'Icnea',
    tagline: '',
    target: '',
    priceNote: '',
    advantages: [],
    comparison: [],
    faqs: [],
  },
  {
    slug: 'lodgify',
    name: 'Lodgify',
    tagline: 'Hostly vs Lodgify — Gestión completa vs foco en reservas directas',
    target: 'Anfitriones con 1-15 alojamientos que quieren web propia y reservas directas',
    priceNote: 'Lodgify: precio según plan y número de alojamientos; consulta su web · Hostly: 40 €/mes por piso, 35 € desde 5',
    advantages: [
      { title: 'El día a día del piso', body: 'Lodgify está centrado en las reservas directas y su creador de webs. Hostly se centra en el día a día del piso: limpiezas, mensajes, registro de viajeros y finanzas.' },
      { title: 'IA que contesta por ti', body: 'La IA de Hostly contesta la mayoría de mensajes de los huéspedes al momento, 24/7 y en su idioma. Cuando hace falta una persona, te avisa.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'En Hostly Completo, lo configuramos contigo', body: 'El primer mes, en una videollamada 1 a 1, dejamos listos tus pisos, tus canales y tus mensajes. Después te atiende una persona, en castellano o catalán.' },
      { title: 'Precio predecible', body: '40 €/mes por piso, 35 € desde 5, sin comisiones por reserva ni porcentajes sobre tus ingresos. El primer mes, gratis.' },
    ],
    comparison: [
      { feature: 'Web propia / reservas directas', hostly: 'A medida, aparte', them: 'Su punto fuerte' },
      { feature: 'IA conversacional 24/7', hostly: true, them: consultar },
      { feature: 'Check-in y registro policial gratis', hostly: true, them: false },
      { feature: 'Sin comisiones por reserva', hostly: true, them: consultar },
      { feature: 'Coordinación de limpiezas', hostly: true, them: consultar },
      { feature: 'Precios dinámicos', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Hostly tiene web de reservas directas?', a: 'No viene de serie. Si la necesitas, te hacemos una web propia con reservas directas, a medida, como automatización aparte. Si lo que buscas es sobre todo una web con diseño y SEO propios, Lodgify está más centrado en eso. Para el día a día del piso (mensajes, limpiezas, registro de viajeros), Hostly cubre más.' },
      { q: '¿Qué pagas en cada uno?', a: 'En Hostly, el check-in y el registro a la policía son gratis, y Hostly Completo cuesta 40 €/mes por piso (480 €/año con un piso), 35 € desde 5, sin comisiones por reserva. Lodgify tiene varios planes según las funciones y el número de alojamientos: consulta su web para tu caso y mira si tu plan cobra algo por reserva.' },
    ],
  },
  {
    slug: 'smoobu',
    name: 'Smoobu',
    tagline: 'Hostly vs Smoobu — Qué incluye cada uno para un piso en España',
    target: 'Anfitrión particular y pequeño gestor (1-15 alojamientos), fuerte en Alemania, Austria y Suiza',
    priceNote: 'Smoobu: desde 29 €/mes por un alojamiento, más un 0,9 % por reserva (plan Profesional Flex; precio publicado en octubre de 2026) · Hostly: 40 €/mes por piso, sin comisiones',
    advantages: [
      { title: 'IA en WhatsApp', body: 'La IA de Hostly contesta la mayoría de mensajes al momento, en el idioma del huésped y 24/7, y te avisa cuando hace falta una persona.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'Precios con PriceLabs integrado', body: 'En Hostly, PriceLabs recomienda el precio de cada noche, tú pones los límites y Hostly lo publica en Airbnb y Booking cada día.' },
      { title: 'WhatsApp como canal principal', body: 'Hostly usa la API oficial de WhatsApp con un número gestionado por Hostly. Tus huéspedes escriben por WhatsApp y tú no instalas ni configuras nada.' },
      { title: 'Soporte en castellano y catalán', body: 'Smoobu da soporte en varios idiomas. En Hostly Completo, el primer mes lo configuramos contigo en una videollamada y después te atiende una persona, en castellano o catalán.' },
    ],
    comparison: [
      { feature: 'IA conversacional', hostly: true, them: consultar },
      { feature: 'WhatsApp nativo', hostly: true, them: consultar },
      { feature: 'Check-in y registro policial sin complementos', hostly: true, them: 'Vía integración' },
      { feature: 'Channel manager', hostly: true, them: true },
      { feature: 'Precios dinámicos', hostly: 'PriceLabs integrado', them: 'Propios' },
      { feature: 'Precio con 1 piso', hostly: '40 €/mes', them: 'Desde 29 €/mes + 0,9 %' },
    ],
    faqs: [
      { q: '¿Por qué Hostly si Smoobu es más barato?', a: 'Smoobu empieza en 29 €/mes por un alojamiento con el plan Profesional Flex, que además cobra un 0,9 % por reserva, o en 35 €/mes en prepago (31,50 €/mes con pago anual). Si necesitas una herramienta aparte para el check-in y el registro a la policía, súmala al coste. En Hostly, el check-in y el registro son gratis, y Hostly Completo, a 40 €/mes por piso, junta la IA en WhatsApp, las limpiezas y los precios con PriceLabs integrado.' },
      { q: '¿Smoobu tiene integración con el mercado español?', a: 'Tiene channel manager para las OTAs principales y se integra con herramientas externas para el registro de viajeros. Hostly está hecho para gestionar en España: registro automático a los Mossos en Cataluña (en el resto de España, activamos contigo la conexión con la policía que te toque), tasa turística de Cataluña lista para declarar y soporte en castellano y catalán.' },
    ],
  },
  {
    slug: 'hospitable',
    name: 'Hospitable',
    tagline: 'Hostly vs Hospitable — La alternativa pensada para España, con el registro de viajeros incluido',
    target: 'Anfitriones particulares exigentes (1-30 propiedades), muy fuerte en EE. UU. y Reino Unido',
    priceNote: 'Hospitable: plan Essentials gratis; de pago, desde 29 €/mes + IVA para 1 propiedad (precio publicado en octubre de 2026) · Hostly: check-in gratis y 40 €/mes por piso con Hostly Completo',
    advantages: [
      { title: 'Registro de viajeros en España', body: 'Hospitable es fuerte en EE. UU. y Reino Unido. En Hostly, el check-in online, el registro de viajeros y la tasa turística de Cataluña son gratis para siempre. Allí, el registro va a los Mossos cada día; en el resto de España, activamos contigo la conexión con la policía que te toque.' },
      { title: 'WhatsApp como canal principal', body: 'Hostly está pensado para WhatsApp: API oficial de Meta, un número gestionado por Hostly y la IA que contesta ahí mismo.' },
      { title: 'Soporte en castellano y catalán', body: 'Con Hostly Completo, te atiende una persona en castellano o catalán, no un chatbot. Con el plan Gratis, nos escribes a hola@hostlylabs.com.' },
      { title: 'Configuración contigo', body: 'En Hostly Completo, el primer mes lo configuramos todo contigo en una videollamada 1 a 1: pisos, canales y mensajes.' },
      { title: 'Tasa turística lista para declarar', body: 'Si tus pisos están en Cataluña, Hostly calcula la tasa turística de cada estancia y la deja lista para declarar en la ATC cada semestre.' },
    ],
    comparison: [
      { feature: 'Registro de viajeros en España', hostly: true, them: false },
      { feature: 'WhatsApp como canal principal', hostly: true, them: consultar },
      { feature: 'IA conversacional', hostly: true, them: true },
      { feature: 'App en castellano y catalán', hostly: true, them: consultar },
      { feature: 'Tasa turística de Cataluña', hostly: true, them: false },
      { feature: 'Channel manager', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Hospitable no es mejor en IA que Hostly?', a: 'Hospitable tiene una IA de mensajería muy trabajada. La diferencia está en el mercado: Hostly está hecho para gestionar en España, con WhatsApp como canal, el registro de viajeros y la tasa turística de Cataluña dentro de la app, y soporte en castellano y catalán.' },
      { q: '¿Puedo usar Hospitable y Hostly juntos?', a: 'Sí: con el plan Gratis, Hostly lee tu calendario y se ocupa del check-in, del registro a la policía y de la tasa turística de Cataluña, y Hospitable sigue con lo demás. Si prefieres tenerlo todo en una sola app, Hostly Completo suma mensajes, limpiezas y precios.' },
    ],
  },
  {
    slug: 'guesty',
    name: 'Guesty',
    tagline: 'Hostly vs Guesty — Pensado para el gestor pequeño',
    target: 'De 1 anuncio (Lite) a miles de unidades; su fuerte, las gestoras medianas y grandes',
    priceNote: 'Guesty: plan Lite (1-3 anuncios) desde 9 $ por anuncio al mes; Pro y Enterprise, presupuesto a medida (precio publicado en octubre de 2026) · Hostly: 40 €/mes por piso, 35 € desde 5',
    advantages: [
      { title: 'Pensado para 1 a 15 pisos', body: 'Guesty está enfocado sobre todo a gestoras medianas y grandes. Hostly está pensado desde el primer día para el propietario y el gestor pequeño, de 1 a 15 pisos.' },
      { title: 'Empiezas gratis, sin demo', body: 'El plan Gratis (check-in, registro de viajeros y tasa turística de Cataluña) lo activas tú solo, sin tarjeta. Para Hostly Completo hacemos una demo y lo configuramos contigo.' },
      { title: 'Precio público, tengas los pisos que tengas', body: 'Hostly publica su precio: 40 €/mes por piso, 35 € desde 5. Guesty publica precio solo para Lite (de 1 a 3 anuncios); a partir de ahí, trabaja con presupuesto a medida.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'Soporte cercano', body: 'En Hostly Completo, el primer mes lo configuramos todo contigo en una videollamada. Después te atiende una persona, en castellano o catalán.' },
    ],
    comparison: [
      { feature: 'Pensado para 1-15 pisos', hostly: true, them: consultar },
      { feature: 'Plan gratis, sin tarjeta', hostly: true, them: consultar },
      { feature: 'Precio público', hostly: true, them: 'Solo Lite (1-3)' },
      { feature: 'Check-in y registro policial gratis', hostly: true, them: false },
      { feature: 'IA conversacional', hostly: true, them: true },
      { feature: 'Channel manager', hostly: 'Airbnb y Booking', them: true },
    ],
    faqs: [
      { q: '¿Para qué tipo de cliente es Guesty?', a: 'Tiene un plan Lite para 1 a 3 anuncios, pero su fuerte son las gestoras con muchas unidades que necesitan analítica avanzada, portal de propietarios e integraciones a medida. Para un propietario o un gestor pequeño, puede quedarse grande.' },
      { q: '¿Hostly puede crecer conmigo?', a: 'Hostly está pensado para propietarios y gestores de 1 a 15 pisos. Si creces mucho más, con un equipo grande, puede tener sentido mirar herramientas pensadas para gestoras grandes.' },
    ],
  },
  {
    slug: 'avantio',
    name: 'Avantio',
    tagline: 'Hostly vs Avantio — Modernidad y IA vs PMS tradicional español',
    target: 'Agencias de gestión profesional (20 o más propiedades) en España',
    priceNote: 'Avantio: cuota mínima de 295 €/mes + IVA, hasta 20 propiedades (precio publicado en octubre de 2026) · Hostly: 40 €/mes por piso, 35 € desde 5',
    advantages: [
      { title: 'IA conversacional incluida', body: 'La IA de Hostly contesta la mayoría de mensajes de los huéspedes al momento, 24/7 y en su idioma, y te avisa cuando hace falta una persona.' },
      { title: 'Configuración incluida', body: 'En Hostly Completo, el primer mes lo configuramos todo contigo en una videollamada 1 a 1.' },
      { title: 'Pensado para pocos pisos', body: 'Avantio aplica una cuota mínima de 295 €/mes + IVA para carteras de hasta 20 propiedades. Hostly cuesta 40 €/mes por piso, 35 € desde 5: con pocos pisos, pagas solo por los que tienes.' },
      { title: 'WhatsApp nativo', body: 'Hostly usa la API oficial de WhatsApp con un número gestionado por Hostly. Tus huéspedes escriben por WhatsApp y la IA contesta ahí mismo.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
    ],
    comparison: [
      { feature: 'IA conversacional', hostly: true, them: consultar },
      { feature: 'WhatsApp nativo', hostly: true, them: consultar },
      { feature: 'Configuración incluida', hostly: 'Con Hostly Completo', them: consultar },
      { feature: 'Precio con 1 piso', hostly: '40 €/mes', them: 'Mínimo 295 €/mes' },
      { feature: 'Channel manager', hostly: 'Airbnb y Booking', them: true },
      { feature: 'Registro de viajeros integrado', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Para qué perfil es Avantio?', a: 'Avantio recomienda su uso a partir de 20 propiedades y está pensado para agencias con equipo que necesitan integraciones complejas. Para un gestor pequeño, puede quedarse grande en coste y en complejidad.' },
      { q: '¿Hostly es tan completo como Avantio?', a: 'No en todo. Avantio tiene funciones avanzadas de gestión de ingresos y de informes para grandes volúmenes, y conecta más canales. Hostly se centra en Airbnb y Booking.com y en lo que un gestor de 1 a 15 pisos usa cada día: mensajes, limpiezas, registro de viajeros, precios con PriceLabs integrado y finanzas.' },
    ],
  },
];

// Deduplicar (teníem icnea dos vegades per error)
const seen = new Set<string>();
export const uniqueCompetitors = competitors.filter((c) => {
  if (seen.has(c.slug)) return false;
  seen.add(c.slug);
  return c.advantages.length > 0;
});

export function getCompetitor(slug: string) {
  return uniqueCompetitors.find((c) => c.slug === slug);
}
