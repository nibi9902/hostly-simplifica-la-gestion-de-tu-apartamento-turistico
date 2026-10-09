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
  'Check-in online, registro de viajeros y taxa turística, gratis para siempre. En Cataluña, Hostly envía el registro a los Mossos cada día, sin que hagas nada. Fuera de Cataluña, activamos SES.Hospedajes contigo al darte de alta.';

// Quan no tenim una dada pública fiable d'una funció del competidor, no marquem ✗.
const consultar = 'Consultar';

export const competitors: Competitor[] = [
  {
    slug: 'icnea',
    name: 'Icnea',
    tagline: 'Hostly vs Icnea — La alternativa moderna al PMS ibérico clásico',
    target: 'Gestores de 5-200 unidades en España y Portugal',
    priceNote: 'Icnea: desde ~140 €/mes total · Hostly: 40 €/apartamento/mes',
    advantages: [
      { title: 'IA en WhatsApp', body: 'La IA de Hostly contesta la mayoría de mensajes al momento, en el idioma del huésped y 24/7, por la API oficial de WhatsApp. Cuando hace falta una persona, te avisa.' },
      { title: 'Precios dinámicos incluidos', body: 'PriceLabs integrado dentro del plan: recomienda el precio de cada noche, tú pones mínimos y temporadas, y Hostly lo publica en Airbnb y Booking cada día.' },
      { title: 'App moderna y configuración contigo', body: 'El primer mes configuramos Hostly contigo en una videollamada 1 a 1, sin formaciones de pago.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'Precio transparente', body: '40 €/mes por apartamento, 35 € desde 5, sin comisiones por reserva. El primer mes, gratis.' },
    ],
    comparison: [
      { feature: 'IA en WhatsApp', hostly: true, them: consultar },
      { feature: 'Check-in y registro policial', hostly: 'Gratis para siempre', them: 'Sí' },
      { feature: 'Precios dinámicos', hostly: 'Incluidos (PriceLabs)', them: 'Add-on externo' },
      { feature: 'Configuración 1 a 1 incluida', hostly: true, them: consultar },
      { feature: 'Precio desde 1 apartamento', hostly: '40 €/mes', them: '~140 €/mes' },
      { feature: 'Catalán nativo', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Cuánto tarda la migración desde Icnea?', a: 'Depende de cuántos pisos tengas. El cambio lo hacemos contigo durante el primer mes, en una configuración 1 a 1: pisos, canales y reservas.' },
      { q: '¿Es Hostly más caro que Icnea?', a: 'Depende de cuántos pisos tengas. Hostly cuesta 40 €/mes por apartamento, 35 € desde 5, con la IA y los precios dinámicos con PriceLabs incluidos. El check-in y el registro a la policía son gratis. Compáralo con el presupuesto que te dé Icnea para tu número de pisos.' },
    ],
  },
  {
    slug: 'hostify',
    name: 'Hostify',
    tagline: 'Hostly vs Hostify — Qué cambia para un gestor pequeño en España',
    target: 'Pequeños-medianos gestores (5-70 unidades) en España',
    priceNote: 'Hostify: $20/unidad/mes · Hostly: 40 €/apartamento/mes (todo incluido)',
    advantages: [
      { title: 'IA en WhatsApp incluida', body: 'La IA de Hostly contesta la mayoría de mensajes al momento, en el idioma del huésped y 24/7, con la información de cada piso. Viene dentro del plan.' },
      { title: 'Precios dinámicos incluidos', body: 'Hostify trabaja con herramientas de precios externas, como PriceLabs o Beyond. En Hostly, PriceLabs viene integrado dentro del plan.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'En catalán y castellano', body: 'La app de Hostly está en catalán y castellano, y el soporte te lo da una persona en los dos idiomas.' },
      { title: 'Precio fijo en euros', body: 'Hostify publica sus precios en dólares, así que lo que pagas en euros depende del cambio. Hostly cuesta 40 €/mes por apartamento, 35 € desde 5.' },
    ],
    comparison: [
      { feature: 'IA en WhatsApp incluida', hostly: true, them: consultar },
      { feature: 'WhatsApp como canal principal', hostly: true, them: 'Parcial' },
      { feature: 'Precios dinámicos incluidos', hostly: true, them: 'Herramienta aparte' },
      { feature: 'Check-in y registro policial gratis', hostly: true, them: consultar },
      { feature: 'Catalán nativo', hostly: true, them: consultar },
      { feature: 'Moneda EUR fija', hostly: true, them: false },
    ],
    faqs: [
      { q: '¿Por qué Hostly si Hostify ya tiene WhatsApp?', a: 'Hostly usa la API oficial de WhatsApp con un número gestionado por Hostly, así que no instalas ni configuras nada. La IA contesta con la información de cada piso y de la reserva, en el idioma del huésped, y te avisa cuando hace falta una persona. La activas o la desactivas por apartamento y puedes tomar el control de cualquier conversación.' },
      { q: '¿Son comparables en funcionalidades?', a: 'En lo básico, sí: reservas, check-in y channel manager (Hostly conecta Airbnb y Booking.com). La diferencia está en lo que viene dentro del precio: en Hostly, la IA en WhatsApp y los precios dinámicos con PriceLabs están incluidos, y el check-in con el registro a la policía es gratis.' },
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
    target: 'Hosts con 1-15 unidades que quieren web propia y reservas directas',
    priceNote: 'Lodgify: desde $20/mes + 1.9% fee · Hostly: 40 €/mes por apartamento',
    advantages: [
      { title: 'Gestión operativa completa', body: 'Lodgify está centrado en las reservas directas y su creador de webs. Hostly también incluye limpiezas, mensajes, registro de viajeros y pagos.' },
      { title: 'IA que contesta por ti', body: 'La IA de Hostly contesta la mayoría de mensajes de los huéspedes al momento, 24/7 y en su idioma. Cuando hace falta una persona, te avisa.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'Sin fees por reserva', body: 'Lodgify cobra 1.9% por reserva en el plan Starter. Hostly no tiene fees variables.' },
      { title: 'Precio predecible', body: '40 €/mes por apartamento, 35 € desde 5. Sin porcentajes sobre tus ingresos.' },
    ],
    comparison: [
      { feature: 'Web builder / direct bookings', hostly: 'Motor de reservas con Stripe', them: 'Excelente' },
      { feature: 'IA conversacional 24/7', hostly: true, them: consultar },
      { feature: 'Check-in y registro policial gratis', hostly: true, them: false },
      { feature: 'Sin fees por reserva', hostly: true, them: false },
      { feature: 'Coordinación de limpiezas', hostly: true, them: consultar },
      { feature: 'Precios dinámicos', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Hostly tiene web de reservas directas?', a: 'Sí: Hostly tiene su propio motor de reservas, con pago por Stripe. Si lo que buscas es una web completa con diseño y SEO propios, Lodgify está más centrado en eso. Para el día a día del piso (mensajes, limpiezas, registro de viajeros), Hostly cubre más.' },
      { q: '¿Cuánto me ahorro sin el fee del 1.9%?', a: 'Con 100 noches a 100 €/noche, son 190 €/año solo en fees de Lodgify Starter. Con Hostly pagas 40 €/mes por apartamento (480 €/año), sin comisiones por reserva y con más funciones incluidas.' },
    ],
  },
  {
    slug: 'smoobu',
    name: 'Smoobu',
    tagline: 'Hostly vs Smoobu — Qué incluye cada uno para un piso en España',
    target: 'Host individual y pequeño gestor (1-15 unidades), fuerte en DACH',
    priceNote: 'Smoobu: desde 23 €/mes · Hostly: 40 €/apartamento/mes (con IA)',
    advantages: [
      { title: 'IA en WhatsApp incluida', body: 'La IA de Hostly contesta la mayoría de mensajes al momento, en el idioma del huésped y 24/7, y te avisa cuando hace falta una persona.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'Precios dinámicos incluidos', body: 'En Hostly, los precios dinámicos van con PriceLabs integrado, dentro del plan: PriceLabs recomienda, tú pones los límites y Hostly publica en Airbnb y Booking cada día.' },
      { title: 'WhatsApp como canal principal', body: 'Hostly usa la API oficial de WhatsApp con un número gestionado por Hostly. Tus huéspedes escriben por WhatsApp y tú no instalas ni configuras nada.' },
      { title: 'Soporte en español y catalán', body: 'Smoobu da soporte en varios idiomas. En Hostly, el primer mes lo configuramos contigo en una videollamada y después te atiende una persona, en castellano o catalán.' },
    ],
    comparison: [
      { feature: 'IA conversacional', hostly: true, them: consultar },
      { feature: 'WhatsApp nativo', hostly: true, them: consultar },
      { feature: 'Check-in y registro policial sin add-on', hostly: true, them: 'Vía integración' },
      { feature: 'Channel manager', hostly: true, them: true },
      { feature: 'Precios dinámicos', hostly: true, them: consultar },
      { feature: 'Precio por apartamento', hostly: '40 €/mes', them: '23 €/mes' },
    ],
    faqs: [
      { q: '¿Por qué Hostly si Smoobu es más barato?', a: 'Smoobu empieza en 23 €/mes. Si además necesitas una herramienta aparte para el check-in y el registro a la policía, súmala al coste. En Hostly, el check-in y el registro son gratis, y el plan de 40 €/mes por apartamento incluye la IA en WhatsApp, las limpiezas y los precios con PriceLabs.' },
      { q: '¿Smoobu tiene integración con el mercado español?', a: 'Tiene channel manager para las OTAs principales y se integra con herramientas externas para el registro de viajeros. Hostly está hecho para gestionar en España: registro a los Mossos automático en Cataluña, SES.Hospedajes activado contigo fuera, taxa turística catalana calculada y soporte en castellano y catalán.' },
    ],
  },
  {
    slug: 'hospitable',
    name: 'Hospitable',
    tagline: 'Hostly vs Hospitable — La alternativa ibérica con compliance legal',
    target: 'Hosts individuales sofisticados (1-30 propiedades), muy fuerte en US/UK',
    priceNote: 'Hospitable: desde $29/mes · Hostly: 40 €/mes por apartamento',
    advantages: [
      { title: 'Registro de viajeros en España', body: 'Hospitable es fuerte en EE. UU. y Reino Unido. En Hostly, el check-in online, el registro de viajeros y la taxa turística son gratis para siempre. En Cataluña, el registro va a los Mossos cada día; fuera, activamos SES.Hospedajes contigo al darte de alta.' },
      { title: 'WhatsApp como canal principal', body: 'Hostly está pensado para WhatsApp: API oficial de Meta, un número gestionado por Hostly y la IA contestando ahí mismo.' },
      { title: 'Soporte en español y catalán', body: 'Hostly te atiende en castellano y catalán. Una persona, no un chatbot.' },
      { title: 'Precio en euros, sin conversión', body: 'Hospitable cobra en dólares. Hostly tiene precio fijo en euros sin fluctuaciones de cambio.' },
      { title: 'Taxa turística calculada', body: 'Si tus pisos están en Cataluña, Hostly calcula la taxa turística de cada estancia y te prepara el fichero para presentarla en la ATC cada semestre.' },
    ],
    comparison: [
      { feature: 'Registro de viajeros en España', hostly: true, them: false },
      { feature: 'WhatsApp como canal principal', hostly: true, them: consultar },
      { feature: 'IA conversacional', hostly: true, them: true },
      { feature: 'UI en español/catalán', hostly: true, them: consultar },
      { feature: 'Precio en EUR fijo', hostly: true, them: false },
      { feature: 'Channel manager', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Hospitable no es mejor en IA que Hostly?', a: 'Hospitable tiene una IA de mensajería muy trabajada. La diferencia está en el mercado: Hostly está hecho para gestionar en España, con WhatsApp como canal, el registro de viajeros y la taxa turística catalana dentro de la app, y soporte en castellano y catalán.' },
      { q: '¿Puedo usar Hospitable y Hostly juntos?', a: 'No es lo habitual: los dos se conectan a Airbnb y Booking, y lo normal es tener uno solo. Si tus pisos están en España, Hostly te cubre el día a día y además el registro de viajeros y la taxa turística.' },
    ],
  },
  {
    slug: 'guesty',
    name: 'Guesty',
    tagline: 'Hostly vs Guesty — Pensado para el gestor pequeño',
    target: 'Mid-market y enterprise (10-10.000+ unidades)',
    priceNote: 'Guesty: precio personalizado (estimado 40-70 €/mes Lite) · Hostly: 40 €/mes por apartamento todo incluido',
    advantages: [
      { title: 'Diseñado para 1-20 apartamentos', body: 'Guesty está enfocado sobre todo a gestoras medianas y grandes. Hostly está pensado desde el primer día para el propietario y el gestor pequeño.' },
      { title: 'Empiezas gratis, sin demo', body: 'El plan gratis (check-in, registro de viajeros y taxa turística) lo activas tú solo, sin tarjeta. Para el plan completo hacemos una demo de 20 minutos y lo configuramos contigo.' },
      { title: 'Precio transparente', body: 'Hostly publica su precio: 40 €/mes por apartamento, 35 € desde 5. Guesty trabaja con precio personalizado.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
      { title: 'Soporte cercano', body: 'El primer mes configuramos Hostly contigo en una videollamada. Después te atiende una persona, en castellano o catalán.' },
    ],
    comparison: [
      { feature: 'Diseñado para 1-20 apt.', hostly: true, them: consultar },
      { feature: 'Plan gratis, sin tarjeta', hostly: true, them: consultar },
      { feature: 'Precio público transparente', hostly: true, them: 'Según plan' },
      { feature: 'Check-in y registro policial gratis', hostly: true, them: false },
      { feature: 'IA conversacional', hostly: true, them: true },
      { feature: 'Channel manager', hostly: 'Airbnb y Booking', them: true },
    ],
    faqs: [
      { q: '¿Para qué tipo de cliente es Guesty?', a: 'Guesty está pensado sobre todo para gestoras con muchas unidades que necesitan analítica avanzada, portal de propietarios e integraciones a medida. Para 1-15 apartamentos, puede quedarte grande.' },
      { q: '¿Hostly puede crecer conmigo?', a: 'Hasta 20-30 apartamentos, Hostly está diseñado exactamente para ese perfil. Si llegas a 50+ unidades con un equipo grande, podría tener sentido evaluar opciones más enterprise.' },
    ],
  },
  {
    slug: 'avantio',
    name: 'Avantio',
    tagline: 'Hostly vs Avantio — Modernidad y IA vs PMS tradicional ibérico',
    target: 'Agencias de gestión profesional (20-500+ unidades) en España',
    priceNote: 'Avantio: quote personalizado · Hostly: 40 €/apartamento/mes',
    advantages: [
      { title: 'IA conversacional incluida', body: 'La IA de Hostly contesta la mayoría de mensajes de los huéspedes al momento, 24/7 y en su idioma, y te avisa cuando hace falta una persona.' },
      { title: 'Configuración incluida', body: 'El primer mes configuramos Hostly contigo en una videollamada 1 a 1, sin consultoría de pago.' },
      { title: 'Precio transparente', body: 'Avantio trabaja con presupuesto a medida. Hostly publica su precio: 40 €/mes por apartamento, 35 € desde 5.' },
      { title: 'WhatsApp nativo', body: 'Hostly usa la API oficial de WhatsApp con un número gestionado por Hostly. Tus huéspedes escriben por WhatsApp y la IA contesta ahí mismo.' },
      { title: 'Check-in y registro gratis', body: registroGratis },
    ],
    comparison: [
      { feature: 'IA conversacional', hostly: true, them: consultar },
      { feature: 'WhatsApp nativo', hostly: true, them: consultar },
      { feature: 'Configuración incluida', hostly: true, them: consultar },
      { feature: 'Precio público', hostly: true, them: false },
      { feature: 'Channel manager', hostly: 'Airbnb y Booking', them: true },
      { feature: 'Registro de viajeros integrado', hostly: true, them: true },
    ],
    faqs: [
      { q: '¿Para qué perfil es Avantio?', a: 'Avantio está pensado para agencias grandes (20-200+ unidades) con equipo técnico que necesitan integraciones complejas. Para un gestor pequeño, puede quedarse grande en coste y en complejidad.' },
      { q: '¿Hostly es tan completo como Avantio?', a: 'No en todo. Avantio tiene funciones avanzadas de revenue management y de informes para grandes volúmenes, y conecta más canales. Hostly se centra en Airbnb y Booking.com y en lo que un gestor de 1 a 20 apartamentos usa cada día: mensajes, limpiezas, registro de viajeros, precios con PriceLabs y finanzas.' },
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
