/**
 * Funcionalidades de Hostly para páginas `/funcionalidades/<slug>` y cards de hub.
 * Tono: verbos concretos, sistema por encima de feature. Castellano neutro.
 */

/**
 * Una fila de la mini pantalla d'un pas: al mòbil, cada pas de «Cómo funciona» és una targeta que
 * llisca i, a baix, ensenya com es veu aquell moment (opció 8B del Biel, 17-10). Només il·lustra el
 * que diu el text del pas: res que l'app no faci. La pinta `PantallaPas.tsx`.
 * Al text d'un missatge, `[[nom]]` és una variable de la plantilla (surt com un xip).
 */
export type FilaPantalla =
  | { t: 'cap'; text: string; nota?: string; val?: string }
  | { t: 'barra'; fets: number; de: number }
  | { t: 'camp'; et: string; val: string }
  | { t: 'ok'; text: string; val?: string }
  | { t: 'avis'; text: string; val?: string }
  | { t: 'doc'; text: string }
  | { t: 'tria'; text: string; si: boolean }
  | { t: 'xifra'; et: string; val: string; total?: boolean }
  | { t: 'xips'; items: { text: string; to: 'blau' | 'ambre' | 'gris' }[] }
  | { t: 'reserva'; qui: string; canal: 'airbnb' | 'booking' | 'directa'; val: string; despl?: boolean }
  | { t: 'persona'; nom: string; nota: string }
  | { t: 'conversa'; qui: string; canal: 'airbnb' | 'booking' | 'whatsapp'; text: string; estat?: string }
  | { t: 'auto'; text: string; et: string; enllac?: string }
  | { t: 'rebut'; text: string; et: string }
  | { t: 'enviat'; text: string; et: string }
  | { t: 'boto'; text: string }
  | { t: 'nota'; text: string };

export type HowItWorksStep = {
  step: number;
  title: string;
  body: string;
  /** La mini pantalla del pas (només al mòbil). */
  pantalla?: FilaPantalla[];
};

export type FeatureUsage = {
  title: string;
  body: string;
};

export type FeatureFAQ = {
  question: string;
  answer: string;
};

export type Feature = {
  slug: string;
  /** Nombre largo para H1 y nav. */
  name: string;
  /** Nombre del icono de lucide-react (ej. 'MessageCircle'). */
  iconName: string;
  /** 1 frase para cards/overviews (máx ~140 chars). */
  shortDescription: string;
  hero: {
    h1: string;
    sub: string;
    primaryCta: string;
    secondaryCta: string;
  };
  problem: {
    title: string;
    body: string;
  };
  howItWorks: HowItWorksStep[];
  advantages: string[];
  usage: FeatureUsage[];
  /** Slugs de otras features relacionadas. */
  relatedFeatures: string[];
  faqs: FeatureFAQ[];
};

/**
 * Les funcionalitats del pla Gratis (per sempre, sense targeta). A la seva pàgina el botó diu «Empieza
 * gratis, sin tarjeta», no hi ha «Ver precios» i, al costat del nom, «Gratis, para siempre» (el Biel,
 * 17-10). També en treu l'etiqueta de cada targeta de /funcionalidades.
 */
export const FUNCIONS_GRATIS = new Set(['check-in-online', 'burocracia']);

/**
 * Les que es fan a mida i es paguen a part: la web de reserves directes i «Conéctalo todo». A
 * /funcionalidades van a sota, l'una al costat de l'altra, i la seva pàgina diu «Aparte, a medida».
 */
export const FUNCIONS_APART = new Set(['web-de-reservas-directas', 'conecta-todo']);

export const FEATURES: Feature[] = [
  // ─────────────────────────────── IA WHATSAPP ───────────────────────────────
  {
    slug: 'ia-whatsapp',
    name: 'IA que responde en WhatsApp',
    iconName: 'MessageCircle',
    shortDescription:
      'Contesta a tus huéspedes por WhatsApp, 24/7 y en su idioma, con la información de cada piso. Te avisa solo cuando hace falta una persona.',
    hero: {
      h1: 'Un agente que responde por WhatsApp mientras tú no miras el móvil',
      sub: 'Contesta dudas de check-in, normas, wifi o incidencias con la información de cada piso. La mayoría, al instante. El resto te lo pasa a ti.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Tu móvil no debería sonar a las 2 de la mañana por preguntar dónde está el garaje',
      body: 'Gestionar pisos turísticos acaba siendo responder las mismas preguntas todo el día. El wifi, cómo abrir la puerta, si pueden entrar antes. Multiplícalo por tres pisos y un fin de semana lleno: ya no descansas.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Conectas tus reservas, no tu WhatsApp',
        body: 'Conectas Airbnb y Booking. Tus huéspedes escriben a un número de WhatsApp gestionado por Hostly, con la API oficial de Meta: no instalas ni configuras nada.',
        pantalla: [
          { t: 'ok', text: 'Airbnb', val: 'Conectado' },
          { t: 'ok', text: 'Booking.com', val: 'Conectado' },
          { t: 'ok', text: 'WhatsApp', val: 'Número de Hostly' },
          { t: 'nota', text: 'Con la API oficial de Meta. No instalas nada.' },
        ],
      },
      {
        step: 2,
        title: 'Rellenas la ficha de cada piso',
        body: 'El wifi, cómo entrar, normas, parking, recomendaciones. La IA responde con eso y con los datos de la reserva: piso, fechas y huéspedes.',
        pantalla: [
          { t: 'cap', text: 'Cala Moreta', nota: 'Ficha del piso' },
          { t: 'camp', et: 'Wifi', val: 'CalaMoreta_5G' },
          { t: 'camp', et: 'Parking', val: 'Plaza 14, planta −1' },
          { t: 'camp', et: 'Normas', val: 'No se fuma' },
        ],
      },
      {
        step: 3,
        title: 'La IA responde y te avisa cuando toca',
        body: 'Contesta al momento, de día o de noche, en el idioma del huésped. Si algo necesita a una persona, te avisa con el piso y las primeras palabras del mensaje.',
        pantalla: [
          { t: 'rebut', text: 'Where can we park the car?', et: 'Thomas · WhatsApp · 23:45' },
          { t: 'enviat', text: 'Space 14, level −1. The remote is in the entrance drawer.', et: 'Contesta la IA · en inglés' },
        ],
      },
      {
        step: 4,
        title: 'Tú lo ves todo en una sola bandeja',
        body: 'WhatsApp, Airbnb y Booking en el mismo sitio. Tomas el control de cualquier conversación cuando quieras. Si corriges una respuesta, la IA guarda la lección y la ves en el chat.',
        pantalla: [
          { t: 'conversa', qui: 'Camille', canal: 'airbnb', text: 'Merci ! À demain.' },
          { t: 'conversa', qui: 'Thomas', canal: 'booking', text: 'What time is check-out?' },
          { t: 'conversa', qui: 'Sophie', canal: 'whatsapp', text: 'Parfait, merci beaucoup.' },
        ],
      },
    ],
    advantages: [
      'Contesta 24/7 en el idioma del huésped, sea cual sea',
      'Responde con la ficha de cada piso y los datos de la reserva, no en genérico',
      'Te avisa cuando hace falta una persona, con el piso y las primeras palabras',
      'Aprende de tus correcciones, y cada lección se ve en el chat',
      'WhatsApp, Airbnb y Booking en una sola bandeja',
      'Cada respuesta de la IA queda marcada como suya',
    ],
    usage: [
      {
        title: 'Llegada a medianoche',
        body: 'El huésped pregunta cómo llegar al piso a las 23:45. La IA le contesta con las instrucciones de ese piso, en su idioma. Tú duermes.',
      },
      {
        title: 'Dudas de última hora',
        body: 'Preguntan si hay parking, si admiten mascotas, si se puede fumar. La IA responde con lo que pone la ficha del piso. Si no lo sabe, te avisa.',
      },
      {
        title: 'Una queja de verdad',
        body: 'El aire acondicionado no enfría. La IA te avisa con el piso y las primeras palabras del mensaje, y tú tomas el control de la conversación.',
      },
    ],
    relatedFeatures: ['mensajeria-programada', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: '¿Puedo revisar lo que responde antes de que se envíe?',
        answer:
          'No. La IA contesta sola, sin pasar antes por ti. Lo que sí puedes es activarla o apagarla en cada piso y tomar el control de cualquier conversación cuando quieras.',
      },
      {
        question: '¿Qué pasa si un huésped pregunta algo que la IA no sabe?',
        answer:
          'Te avisa con el piso y las primeras palabras del mensaje, y contestas tú. Si corriges una respuesta, la IA guarda la lección para la próxima vez.',
      },
      {
        question: '¿Habla catalán de verdad?',
        answer:
          'Sí. Contesta en el idioma en que escribe el huésped: catalán, castellano, inglés, francés o el que sea. No tienes que configurar nada.',
      },
      {
        question: '¿Necesito WhatsApp Business?',
        answer:
          'No. Hostly usa la API oficial de WhatsApp (Meta) con un número gestionado por Hostly. Tus huéspedes escriben a ese número y tú no instalas ni configuras nada.',
      },
    ],
  },

  // ─────────────────────────────── CHECK-IN ONLINE ───────────────────────────────
  {
    slug: 'check-in-online',
    name: 'Check-in online y registro a la policía',
    iconName: 'ShieldCheck',
    shortDescription:
      'El huésped rellena sus datos desde el móvil y Hostly envía el registro a la policía. Gratis para siempre.',
    hero: {
      h1: 'El registro a la policía, sin copiar ni un dato a mano',
      sub: 'El huésped rellena sus datos desde el móvil y Hostly los valida y los envía a la policía cada día. Si quieres, también le cobra la tasa turística.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'El registro de viajeros te ocupa más tiempo del que debería',
      body: 'Cada huésped tiene que quedar registrado en la policía. Muchos propietarios siguen pidiendo los datos por WhatsApp, copiándolos a mano y entrando en el portal uno por uno. En temporada alta es imposible llevarlo al día sin errores.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'El huésped recibe su enlace',
        body: 'En Hostly Completo, le llega con los mensajes automáticos, en su idioma. En el plan Gratis, cada piso tiene su enlace fijo para compartirlo con tus huéspedes.',
        pantalla: [
          { t: 'auto', text: 'Bonjour Camille ! Avant d’arriver, faites le check-in ici :', et: 'Automático · Hostly', enllac: 'hostlylabs.com/i/k7q2' },
        ],
      },
      {
        step: 2,
        title: 'Rellena sus datos desde el móvil',
        body: 'Nombre, documento, fecha de nacimiento, nacionalidad y dirección, en castellano, inglés o francés. Un adulto puede registrar a todo el grupo con el mismo enlace.',
        pantalla: [
          { t: 'cap', text: 'Votre document', nota: '2 / 3' },
          { t: 'barra', fets: 2, de: 3 },
          { t: 'camp', et: 'Nom', val: 'Camille Durand' },
          { t: 'camp', et: 'Document', val: 'Passeport' },
        ],
      },
      {
        step: 3,
        title: 'Hostly comprueba cada dato',
        body: 'Antes de enviar nada, valida cada campo. Si falta algo o no es válido, el huésped lo corrige en el momento. El código de acceso solo aparece cuando el check-in está hecho.',
        pantalla: [
          { t: 'ok', text: 'N° de document' },
          { t: 'ok', text: 'Date de naissance' },
          { t: 'ok', text: 'Nationalité' },
        ],
      },
      {
        step: 4,
        title: 'El huésped paga la tasa turística',
        body: 'Si activas el cobro, el huésped paga la tasa con tarjeta al hacer el check-in, a través de Stripe. El cobro lleva una comisión del 5 %, que puedes hacer pagar al huésped. Tú no persigues a nadie.',
        pantalla: [
          { t: 'cap', text: 'Tasa turística', val: '14,00 €' },
          { t: 'nota', text: '2 personas · 4 noches' },
          { t: 'boto', text: 'Pagar 14,00 €' },
        ],
      },
      {
        step: 5,
        title: 'Hostly lo envía a la policía',
        body: 'Cada día sube el fichero al portal de la policía y archiva el comprobante. Si alguna línea falla, te avisa y te dice cuál.',
        pantalla: [
          { t: 'ok', text: 'Registro de viajeros enviado' },
          { t: 'doc', text: 'Comprobante' },
        ],
      },
    ],
    advantages: [
      'Formulario en el móvil, en castellano, inglés y francés',
      'Cada dato se valida antes de enviarlo',
      'Un adulto registra a todo el grupo con el mismo enlace',
      'El código de acceso, solo cuando el check-in está hecho',
      'Envío diario a la policía, con el comprobante archivado',
      'Aviso si falta un check-in o si un registro falla',
      'Si quieres, el huésped paga la tasa turística con tarjeta al hacer el check-in',
    ],
    usage: [
      {
        title: 'Familia de cuatro',
        body: 'Un adulto registra a los cuatro con el mismo enlace. Si un dato no es válido, lo ve antes de enviar, no cuando ya es tarde.',
      },
      {
        title: 'Varios pisos, un solo envío',
        body: 'Cada día, Hostly sube al portal de la policía los check-ins pendientes de todos tus pisos y guarda el comprobante. Tú no entras en ningún portal.',
      },
      {
        title: 'Llegada a medianoche',
        body: 'El huésped hace el check-in a las 23:00 y solo entonces ve el código de la puerta. El registro sale con el envío del día siguiente, sin que tú te despiertes.',
      },
    ],
    relatedFeatures: ['burocracia', 'mensajeria-programada', 'ia-whatsapp'],
    faqs: [
      {
        question: '¿Sustituye a Chekin?',
        answer:
          'Sí: el check-in y el envío a la policía funcionan solos, sin otra app en medio.',
      },
      {
        question: '¿Qué pasa si un registro falla?',
        answer:
          'Hostly lee la respuesta del portal de la policía línea a línea. Si alguna falla, te avisa y te dice cuál, para que la corrijas.',
      },
      {
        question: '¿El huésped tiene que subir una foto del documento?',
        answer:
          'No. Solo escribe sus datos: tipo y número de documento, nombre, fecha de nacimiento, nacionalidad y dirección. Hostly comprueba que son válidos antes de enviarlos.',
      },
      {
        question: '¿Puedo cobrar la tasa turística al huésped?',
        answer:
          'Sí. Si lo activas, el huésped la paga con tarjeta al hacer el check-in, a través de Stripe. El cobro lleva una comisión del 5 %; tú decides si la paga el huésped.',
      },
      {
        question: '¿Cuánto cuesta?',
        answer:
          'Nada. El check-in online y el registro a la policía son gratis para siempre, sin tarjeta. También el cálculo de la tasa turística.',
      },
    ],
  },

  // ─────────────────────────── RESERVAS Y CALENDARIOS (channel-manager) ───────────────────────────
  {
    slug: 'channel-manager',
    name: 'Reservas y calendarios',
    iconName: 'Calendar',
    shortDescription:
      'Airbnb y Booking en un solo calendario. Las reservas entran al momento y, dentro de Hostly, dos reservas no pueden solaparse.',
    hero: {
      h1: 'Un solo calendario para Airbnb, Booking y tus reservas',
      sub: 'Las reservas entran solas, los bloqueos llegan a los canales al instante y los precios se publican desde un solo sitio.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Llevar varios calendarios a mano acaba en una doble reserva',
      body: 'Tener Airbnb y Booking con calendarios separados es cuestión de tiempo. Un bloqueo que tardas en poner, un cambio de fechas que no actualizas, y acabas con dos reservas la misma noche. Se pierde dinero y reputación.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Conectas Airbnb y Booking',
        body: 'Airbnb, con tu cuenta. Booking.com, con el ID de tu propiedad. Lo hacemos contigo en la configuración del primer mes.',
        pantalla: [
          { t: 'ok', text: 'Airbnb', val: 'Conectado' },
          { t: 'ok', text: 'Booking.com', val: 'Conectado' },
          { t: 'nota', text: 'Lo conectamos contigo el primer mes.' },
        ],
      },
      {
        step: 2,
        title: 'Importamos tu histórico',
        body: 'Traemos tus reservas. A partir de ese momento, cada reserva nueva entra sola, y cada 20 minutos Hostly lo vuelve a comprobar por si alguna se ha quedado por el camino.',
        pantalla: [
          { t: 'reserva', qui: 'Camille', canal: 'airbnb', val: '435 €' },
          { t: 'reserva', qui: 'Thomas', canal: 'booking', val: '555 €', despl: true },
          { t: 'nota', text: 'Cada 20 minutos, Hostly lo vuelve a comprobar.' },
        ],
      },
      {
        step: 3,
        title: 'Lo gestionas todo desde un calendario',
        body: 'Los bloqueos que pones llegan a Airbnb y Booking al instante. Los precios se publican cada mañana y cada vez que cambias algo.',
        pantalla: [
          { t: 'cap', text: 'Bloqueo · 12–16 nov' },
          { t: 'ok', text: 'Airbnb', val: 'Recibido' },
          { t: 'ok', text: 'Booking.com', val: 'Recibido' },
        ],
      },
      {
        step: 4,
        title: 'Y tus reservas directas, también',
        body: 'Las que te llegan por teléfono las apuntas en un momento. Y si quieres web propia con reservas directas, la montamos contigo, a medida.',
        pantalla: [
          { t: 'cap', text: 'Reserva nueva', nota: 'Directa' },
          { t: 'camp', et: 'Huésped', val: 'María López' },
          { t: 'camp', et: 'Fechas', val: '8–11 dic' },
          { t: 'boto', text: 'Guardar' },
        ],
      },
    ],
    advantages: [
      'Airbnb y Booking.com en un solo calendario',
      'Cada reserva entra al momento, con una comprobación cada 20 minutos',
      'Dentro de Hostly, dos reservas no pueden solaparse',
      'Bloqueos que llegan a los canales al instante',
      'Tu histórico de reservas, importado',
      'Tus reservas directas, en el mismo calendario',
    ],
    usage: [
      {
        title: 'Bloqueo por reforma',
        body: 'Marcas cinco días de bloqueo en Hostly. Airbnb y Booking los reciben al instante.',
      },
      {
        title: 'Subida de precio en Semana Santa',
        body: 'Cambias el precio una vez en Hostly. Se publica en Airbnb y Booking en cuanto lo guardas.',
      },
      {
        title: 'Cancelación de última hora',
        body: 'Un huésped cancela en Airbnb. La cancelación entra en Hostly, la limpieza de ese día se cancela y tu equipo recibe el aviso.',
      },
    ],
    relatedFeatures: ['precios-dinamicos', 'gestion-de-limpiezas', 'conecta-todo'],
    faqs: [
      {
        question: '¿Qué plataformas conectáis?',
        answer:
          'Airbnb y Booking.com. Las reservas directas también entran en el mismo calendario; si quieres web propia con reservas, la montamos a medida.',
      },
      {
        question: '¿Necesito otro channel manager?',
        answer:
          'No. Hostly se conecta con Airbnb y Booking a través de un channel manager que trabaja por detrás. Tú lo ves y lo cambias todo desde Hostly.',
      },
      {
        question: '¿Y si una reserva tarda en llegar?',
        answer:
          'Cada reserva entra en cuanto la plataforma la envía. Además, cada 20 minutos Hostly vuelve a comprobar los canales por si alguna se ha quedado por el camino.',
      },
      {
        question: '¿Puedo usar Hostly sin conectar Airbnb ni Booking?',
        answer:
          'Sí. En el plan Gratis, Hostly lee tu calendario de Airbnb y Booking con el enlace iCal cada 30 minutos, para el check-in y el registro a la policía.',
      },
    ],
  },

  // ─────────────────────────────── GESTIÓN LIMPIEZAS ───────────────────────────────
  {
    slug: 'gestion-de-limpiezas',
    name: 'Gestión de limpiezas con app para el equipo',
    iconName: 'Sparkles',
    shortDescription:
      'Cada salida crea su limpieza y avisa a quien le toca. Fotos de salida, incidencias y lo que debes cada mes, sin grupos de WhatsApp caóticos.',
    hero: {
      h1: 'Coordina limpiezas sin vivir en un grupo de WhatsApp',
      sub: 'Cada salida crea su limpieza. Si alguien no puede, pasa a la siguiente del turno. Y al acabar, fotos de cómo queda el piso.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Con más de dos pisos, el grupo de WhatsApp de la limpieza no da abasto',
      body: 'Cuando pasas de dos a cinco pisos, coordinar limpiezas por WhatsApp se vuelve un caos. Mensajes perdidos, horarios que no cuadran, incidencias sin foto y nadie sabe quién va el sábado. Al final eres tú quien lo coordina todo a mano.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Montas el equipo de cada piso',
        body: 'Añades a las personas que limpian cada piso y el orden del turno. Cada una usa su app, en catalán, castellano o inglés, o el asistente de WhatsApp.',
        pantalla: [
          { t: 'persona', nom: 'Pilar', nota: '1.ª del turno · app' },
          { t: 'persona', nom: 'Carmen', nota: '2.ª · WhatsApp' },
          { t: 'persona', nom: 'Anna', nota: '3.ª · app, en catalán' },
        ],
      },
      {
        step: 2,
        title: 'Cada salida crea su limpieza',
        body: 'Por cada salida, Hostly crea la limpieza de ese día y avisa a quien le toca. Si cambian las fechas, avisa del cambio.',
        pantalla: [
          { t: 'ok', text: 'Limpieza creada', val: 'sáb 11:00' },
          { t: 'camp', et: 'Le toca a', val: 'Pilar' },
          { t: 'nota', text: 'Pilar ya tiene el aviso.' },
        ],
      },
      {
        step: 3,
        title: 'Si alguien no puede, pasa a la siguiente',
        body: 'Si la persona dice «no puedo», la limpieza pasa a la siguiente del turno, que recibe el aviso por WhatsApp. Tú no tienes que buscar a nadie.',
        pantalla: [
          { t: 'camp', et: 'Pilar', val: 'No puede' },
          { t: 'ok', text: 'Carmen · mañana 11:00', val: 'Coordinada' },
          { t: 'nota', text: 'Carmen lo ha recibido por WhatsApp.' },
        ],
      },
      {
        step: 4,
        title: 'Al acabar, fotos e incidencias',
        body: 'La limpieza se marca como hecha con fotos de salida. Si algo está roto o el huésped se ha dejado algo, queda como incidencia con fecha, piso y persona.',
        pantalla: [
          { t: 'ok', text: 'Limpieza hecha', val: '4 fotos' },
          { t: 'avis', text: 'Se dejaron una chaqueta', val: 'Incidencia' },
        ],
      },
    ],
    advantages: [
      'Una limpieza por cada salida, creada sola',
      'Equipo por piso, con orden de turno',
      '«No puedo» la pasa a la siguiente, con aviso por WhatsApp',
      'Fotos de salida en cada limpieza',
      'Incidencias con fecha, piso y persona',
      'Historial por piso y lo que debes a cada persona cada mes',
    ],
    usage: [
      {
        title: 'Una baja el sábado por la mañana',
        body: 'La limpiadora dice «no puedo» desde la app o por WhatsApp. La limpieza pasa a la siguiente del turno, que recibe el aviso. Tú no tienes que hacer nada.',
      },
      {
        title: 'Cancelación de última hora',
        body: 'Se cancela una reserva a las 10:00. La limpieza se cancela sola y la persona que la tenía recibe el aviso.',
      },
      {
        title: 'El huésped se dejó ropa',
        body: 'Queda como incidencia, con la fecha, el piso y la persona, y se guarda en el historial del piso. Tú avisas al huésped desde Hostly.',
      },
    ],
    relatedFeatures: ['multi-rol', 'conecta-todo', 'channel-manager'],
    faqs: [
      {
        question: '¿Y si mi equipo no quiere instalar otra app?',
        answer:
          'Puede recibir los avisos y contestar por WhatsApp, con el asistente. Y si usa la app, la tiene en catalán, castellano o inglés.',
      },
      {
        question: '¿Puedo pagar a mi equipo desde Hostly?',
        answer:
          'No. Hostly te dice lo que debes a cada persona cada mes, pero el pago lo haces tú, fuera de Hostly.',
      },
      {
        question: '¿Qué pasa si cambian las fechas de una reserva?',
        answer:
          'La persona que tenía la limpieza recibe el aviso del cambio. Si la reserva se cancela, la limpieza se cancela sola y también se le avisa.',
      },
      {
        question: '¿Funciona con una empresa de limpieza externa?',
        answer:
          'Sí. Añades a sus personas al equipo de los pisos que limpian. Reciben los avisos y marcan las limpiezas como el resto del equipo.',
      },
    ],
  },

  // ─────────────────────────────── PRECIOS DINÁMICOS ───────────────────────────────
  {
    slug: 'precios-dinamicos',
    name: 'Precios dinámicos',
    iconName: 'TrendingUp',
    shortDescription:
      'Un precio recomendado para cada día, según la demanda. Tú pones los límites y Hostly publica el precio en Airbnb y Booking cada día.',
    hero: {
      h1: 'Precios que siguen a la demanda, sin salir de Hostly',
      sub: 'Cada día tiene un precio recomendado según la demanda. Tú pones los límites, ves por qué sale cada precio y Hostly lo publica en Airbnb y Booking.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'El precio fijo te hace perder dinero',
      body: 'Poner el mismo precio todo el año pierde ingresos en temporada alta y te deja vacío en baja. Revisar precios a mano cada semana es una tarea que nunca se acaba. Y tener los precios en una app y el calendario en otra es una cosa más que vigilar.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Pones tus reglas',
        body: 'Precio mínimo y máximo, temporadas, días con precio fijo, noches mínimas y descuentos por semana o por mes.',
        pantalla: [
          { t: 'camp', et: 'Precio mínimo', val: '85 €' },
          { t: 'camp', et: 'Precio máximo', val: '260 €' },
          { t: 'camp', et: 'Noches mínimas', val: '2' },
          { t: 'camp', et: 'Descuento semanal', val: '10 %' },
        ],
      },
      {
        step: 2,
        title: 'Un precio para cada día',
        body: 'Según la demanda, la temporada y los eventos de tu zona, cada día tiene un precio recomendado.',
        pantalla: [
          { t: 'cap', text: 'Semana Santa', nota: 'sábado' },
          { t: 'xips', items: [{ text: 'Demanda +70 %', to: 'blau' }, { text: 'Festivo', to: 'ambre' }] },
          { t: 'xifra', et: 'Precio recomendado', val: '251 €', total: true },
        ],
      },
      {
        step: 3,
        title: 'Tú decides',
        body: 'En el calendario de Hostly ves el precio recomendado y por qué. En modo manual, lo aceptas con un clic. En automático, se aplica solo dentro de tus límites.',
        pantalla: [
          { t: 'cap', text: 'Recomendado: 251 €', nota: 'ahora 190 €' },
          { t: 'nota', text: 'Por qué: demanda +70 % y festivo.' },
          { t: 'boto', text: 'Aceptar' },
        ],
      },
      {
        step: 4,
        title: 'Se publica en Airbnb y Booking',
        body: 'Hostly publica los precios cada mañana y cada vez que cambias algo.',
        pantalla: [
          { t: 'ok', text: 'Airbnb', val: '251 €' },
          { t: 'ok', text: 'Booking.com', val: '251 €' },
          { t: 'nota', text: 'Publicado esta mañana.' },
        ],
      },
    ],
    advantages: [
      'Un precio recomendado para cada día, dentro de Hostly',
      'Mínimos, máximos, temporadas y días con precio fijo',
      'Noches mínimas y descuentos por semana o por mes',
      'Precio recomendado, aceptado con un clic',
      '«¿Por qué este precio?»: ves de dónde sale cada precio',
      'Publicado en Airbnb y Booking cada mañana y en cada cambio',
    ],
    usage: [
      {
        title: 'Un concierto grande en la ciudad',
        body: 'Esos días hay más demanda y el precio recomendado sube. Lo ves en el calendario de Hostly y lo aceptas con un clic.',
      },
      {
        title: 'La temporada de verano',
        body: 'Creas la temporada de julio y agosto. Los precios de esos días salen de tus reglas y Hostly los publica en Airbnb y Booking.',
      },
      {
        title: 'Un precio que no entiendes',
        body: 'Un martes cualquiera sale más caro de lo normal. Abres «¿por qué este precio?» y ves de dónde sale antes de decidir.',
      },
    ],
    relatedFeatures: ['channel-manager', 'conecta-todo'],
    faqs: [
      {
        question: '¿Puedo aprobar los precios a mano?',
        answer:
          'Sí. En modo manual ves el precio recomendado y lo aceptas con un clic. En modo automático se aplica solo, siempre dentro de tus mínimos y máximos.',
      },
      {
        question: '¿Puedo fijar el precio de un día concreto?',
        answer:
          'Sí. Un día con precio fijo se respeta tal cual, aunque el recomendado sea otro.',
      },
      {
        question: '¿Cada cuánto se actualizan los precios en Airbnb y Booking?',
        answer:
          'Hostly los publica cada mañana y cada vez que cambias algo en el calendario.',
      },
    ],
  },

  // ─────────────────────────────── MENSAJERÍA PROGRAMADA ───────────────────────────────
  {
    slug: 'mensajeria-programada',
    name: 'Mensajería programada por reserva',
    iconName: 'Send',
    shortDescription:
      'Bienvenida, check-in, check-out y más, enviados solos en cada reserva. Una versión por piso, traducida al idioma del huésped.',
    hero: {
      h1: 'Mensajes útiles a cada huésped, sin escribir ninguno a mano',
      sub: 'Plantillas por momento de la reserva, adaptadas a cada piso y traducidas solas. Salen por WhatsApp o, si no hay número, por Airbnb o Booking.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Los mensajes repetitivos se te amontonan',
      body: 'Cada reserva necesita varios mensajes: bienvenida, instrucciones de entrada, códigos, despedida. Con tres pisos y veinte reservas al mes, son decenas de mensajes casi iguales. Escribirlos a mano es tiempo perdido.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Escribes cada plantilla una vez',
        body: 'Bienvenida, check-in, check-out, limpieza, entrada anticipada, salida tardía y cuatro mensajes libres. Si quieres, una versión distinta para cada piso.',
        pantalla: [
          { t: 'ok', text: 'Bienvenida' },
          { t: 'ok', text: 'Check-in' },
          { t: 'ok', text: 'Check-out' },
          { t: 'nota', text: 'Y limpieza, entrada anticipada, salida tardía y cuatro libres.' },
        ],
      },
      {
        step: 2,
        title: 'Usas variables',
        body: 'El enlace de check-in, los códigos, las fechas. Hostly los rellena con los datos de cada reserva.',
        pantalla: [
          { t: 'auto', text: 'Hola [[nombre]], haz el check-in aquí: [[enlace de check-in]]', et: 'Plantilla' },
          { t: 'auto', text: 'Hola Marta, haz el check-in aquí:', et: 'Reserva de Marta', enllac: 'hostlylabs.com/i/k7q2' },
        ],
      },
      {
        step: 3,
        title: 'Hostly la traduce',
        body: 'Cada mensaje sale traducido al idioma del huésped. Tú escribes la plantilla una sola vez.',
        pantalla: [
          { t: 'auto', text: '¡Bienvenida! Te esperamos el viernes.', et: 'Tú escribes' },
          { t: 'auto', text: 'Bienvenue ! On vous attend vendredi.', et: 'Le llega a Camille, en francés' },
        ],
      },
      {
        step: 4,
        title: 'Sale por el canal que toca',
        body: 'Por WhatsApp si tienes el número del huésped. Si no, por Airbnb o Booking. Todo queda en el historial de la reserva.',
        pantalla: [
          { t: 'conversa', qui: 'Thomas', canal: 'whatsapp', text: 'Instrucciones de llegada', estat: 'Enviado' },
          { t: 'conversa', qui: 'Camille', canal: 'airbnb', text: 'Instrucciones de llegada', estat: 'Enviado' },
          { t: 'nota', text: 'Sin el número del huésped, por Airbnb o Booking.' },
        ],
      },
    ],
    advantages: [
      'Una plantilla por momento: bienvenida, check-in, check-out y limpieza',
      'Cuatro mensajes libres, y además entrada anticipada y salida tardía',
      'Una versión para cada piso, traducida al idioma del huésped',
      'Variables: enlace de check-in, códigos y fechas',
      'Por WhatsApp o, si no hay número, por Airbnb o Booking',
      'Historial de mensajes en cada reserva',
    ],
    usage: [
      {
        title: 'Una reserva cualquiera',
        body: 'La bienvenida, las instrucciones con el enlace de check-in y el mensaje de salida, cada uno en su momento. Tú no escribes ninguno.',
      },
      {
        title: 'Un mensaje para cada piso',
        body: 'El piso con piscina recibe las normas de uso. El del centro, dónde aparcar. Cada uno, su mensaje.',
      },
      {
        title: 'Huésped de Francia',
        body: 'Los mensajes le llegan en francés, traducidos solos. Tú escribiste la plantilla una vez, en tu idioma.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: '¿Puedo parar un mensaje antes de que salga?',
        answer:
          'Sí. Ves los mensajes en cola y puedes cancelar cualquiera. Para cambiar el texto, editas la plantilla.',
      },
      {
        question: '¿Funciona sin la IA?',
        answer:
          'Sí. Los mensajes automáticos funcionan solos. Si además activas la IA, contesta cuando el huésped responde.',
      },
      {
        question: '¿Cuántas plantillas puedo tener?',
        answer:
          'Una por momento: bienvenida, check-in, check-out, limpieza, entrada anticipada, salida tardía y cuatro libres. Cada una puede tener su versión por piso y se traduce sola.',
      },
      {
        question: '¿Se pueden enviar por email?',
        answer:
          'No. Salen por WhatsApp si tienes el número del huésped y, si no, por Airbnb o Booking.',
      },
    ],
  },

  // ─────────────────────────────── ROLES Y PERMISOS (multi-rol) ───────────────────────────────
  {
    slug: 'multi-rol',
    name: 'Roles y permisos por piso',
    iconName: 'Users',
    shortDescription:
      'Cada persona ve lo suyo: gestores por piso, equipo de limpieza y propietarios en solo lectura. Sin límite de usuarios.',
    hero: {
      h1: 'Cada persona de tu equipo, con su cuenta y sus pisos',
      sub: 'Gestor, limpieza y propietario, con permisos por piso. Los propietarios solo miran: el calendario y las finanzas de sus pisos.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Compartir datos por WhatsApp es mal negocio',
      body: 'Cuando el equipo crece, necesitas dar acceso a la limpieza, a un gestor de confianza o a los propietarios. Pasar datos por WhatsApp o dejarles tu usuario de Airbnb no es opción. Y cuando alguien se va, se lleva tu contraseña.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Invitas a cada persona',
        body: 'Le mandas una invitación con su papel: gestor, limpieza o propietario. Si no la acepta, la invitación caduca.',
        pantalla: [
          { t: 'persona', nom: 'Laura', nota: 'Gestora · invitada' },
          { t: 'persona', nom: 'Jordi', nota: 'Propietario · invitado' },
          { t: 'persona', nom: 'Pilar', nota: 'Limpieza · invitada' },
        ],
      },
      {
        step: 2,
        title: 'Eliges sus pisos',
        body: 'Un gestor puede llevar todos tus pisos o solo algunos. La limpieza y los propietarios, solo los suyos.',
        pantalla: [
          { t: 'cap', text: 'Laura · gestora', nota: 'Sus pisos' },
          { t: 'tria', text: 'Cala Moreta', si: true },
          { t: 'tria', text: 'Ático Born', si: true },
          { t: 'tria', text: 'Mas Pinell', si: false },
        ],
      },
      {
        step: 3,
        title: 'Cada uno entra con su cuenta',
        body: 'Desde el móvil o el ordenador. La limpieza ve sus limpiezas; el propietario, el calendario y las finanzas de sus pisos, sin poder cambiar nada.',
        pantalla: [
          { t: 'persona', nom: 'Pilar', nota: 'Ve sus limpiezas' },
          { t: 'persona', nom: 'Jordi', nota: 'Ve el calendario y las finanzas' },
          { t: 'nota', text: 'El propietario, sin poder cambiar nada.' },
        ],
      },
    ],
    advantages: [
      'Tres papeles claros: gestor, limpieza y propietario',
      'Permisos por piso: cada gestor lleva los pisos que le das',
      'Propietarios en solo lectura: calendario y finanzas',
      'En la app, cada uno ve lo suyo: quien limpia, sus limpiezas; el gestor, sus reservas',
      'Sin límite de usuarios',
      'El huésped no necesita cuenta: recibe un enlace de su estancia',
    ],
    usage: [
      {
        title: 'Gestor con tres propietarios',
        body: 'Cada propietario ve el calendario y las finanzas de sus pisos. No ve los del resto ni puede cambiar nada.',
      },
      {
        title: 'Dos gestores, pisos repartidos',
        body: 'Uno lleva los pisos de la playa y otro los de la ciudad. Cada uno ve y gestiona solo los suyos.',
      },
      {
        title: 'Cambio de personal',
        body: 'Una persona deja el equipo. Le quitas el acceso y deja de ver tus pisos en ese momento.',
      },
    ],
    relatedFeatures: ['gestion-de-limpiezas', 'finanzas'],
    faqs: [
      {
        question: '¿Cuántos usuarios puedo dar de alta?',
        answer:
          'Los que necesites. No hay límite de usuarios.',
      },
      {
        question: '¿Puedo dar acceso temporal?',
        answer:
          'No hay accesos con fecha de caducidad: lo que caduca es la invitación si no se acepta. Cuando alguien deja de trabajar contigo, le quitas el acceso.',
      },
      {
        question: '¿El propietario puede cambiar algo?',
        answer:
          'No. Solo ve el calendario y las finanzas de sus pisos, incluidas las liquidaciones que le preparas.',
      },
      {
        question: '¿Los huéspedes necesitan una cuenta?',
        answer:
          'No. Cada huésped recibe un enlace de su estancia, sin registrarse en nada.',
      },
    ],
  },

  // ─────────────────────────────── WEB DE RESERVAS DIRECTAS ───────────────────────────────
  // El motor de reserves (caserna13.com i les pàgines amb marca pròpia): a mida, a part, com diu la
  // resta de la web. Textos aprovats pel Biel al llenç del 17-10.
  {
    slug: 'web-de-reservas-directas',
    name: 'Web de reservas directas',
    iconName: 'Globe',
    shortDescription:
      'Tu propia web, con reservas y pago online, sin comisiones. Los días se cierran solos en Airbnb y Booking.',
    hero: {
      h1: 'Tu propia web de reservas, sin comisiones',
      sub: 'El huésped reserva y paga en tu web. Los días se cierran solos en Airbnb y Booking, y la reserva entra en Hostly como todas.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'El huésped que repite vuelve a reservar por Airbnb',
      body: 'Te conoce, le gustó el piso y quiere volver. Pero reserva otra vez por la plataforma y pagas la comisión de nuevo. Y si te reserva por WhatsApp, te toca apuntarla a mano, cerrar los días en cada plataforma y perseguir el pago.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Montamos tu web contigo',
        body: 'Con tus fotos, tus textos y tus colores. Los precios y los días libres salen de Hostly, así que siempre están al día.',
        pantalla: [
          { t: 'cap', text: 'tuweb.es', nota: 'Cala Moreta' },
          { t: 'ok', text: 'Fotos y textos' },
          { t: 'ok', text: 'Precios de Hostly' },
          { t: 'ok', text: 'Días libres de Hostly' },
        ],
      },
      {
        step: 2,
        title: 'El huésped reserva y paga',
        body: 'Elige las fechas, ve el precio y paga con tarjeta, Apple Pay o Google Pay. Todo al reservar o solo una señal: lo decides tú.',
        pantalla: [
          { t: 'cap', text: '12 – 15 nov', nota: '3 noches' },
          { t: 'xifra', et: '95 € × 3 noches', val: '285 €' },
          { t: 'xifra', et: 'Total', val: '285 €', total: true },
          { t: 'boto', text: 'Reservar y pagar' },
        ],
      },
      {
        step: 3,
        title: 'Los días se cierran solos',
        body: 'La reserva entra en tu calendario y se cierra en Airbnb y Booking al momento. No puede entrar otra encima.',
        pantalla: [
          { t: 'reserva', qui: 'Laura Vidal · Web', canal: 'directa', val: '12–15 nov' },
          { t: 'ok', text: 'Cerrado en Airbnb' },
          { t: 'ok', text: 'Cerrado en Booking' },
        ],
      },
      {
        step: 4,
        title: 'Y sigue como todas',
        body: 'Le llega la bienvenida con el enlace de check-in, y la limpieza se crea sola.',
        pantalla: [
          { t: 'auto', text: 'Hola Laura, haz el check-in aquí:', et: 'Automático · Hostly', enllac: 'hostlylabs.com/i/k2v8r' },
          { t: 'ok', text: 'Limpieza creada', val: '15 nov' },
        ],
      },
    ],
    advantages: [
      'Sin la comisión de Airbnb ni de Booking',
      'El pago va directo a tu cuenta, con Stripe',
      'Precios y días libres, siempre los de Hostly',
      'Todo al reservar o una señal, como prefieras',
      'Un descuento por reservar directo, si quieres',
      'Si no quieres cobrar online, te llega como solicitud',
    ],
    usage: [
      {
        title: 'Un huésped que repite cada verano',
        body: 'Le pasas el enlace de tu web. Elige sus fechas, paga y le llega el check-in como en cualquier otra reserva.',
      },
      {
        title: 'Agosto, casi lleno',
        body: 'Tu web solo deja reservar los días libres. Y lo que entra por tu web se cierra en Airbnb y Booking al momento.',
      },
      {
        title: 'Una familia que te llama',
        body: 'En vez de apuntarla a mano, le envías el enlace. Reserva y paga, y tú no persigues el pago.',
      },
    ],
    relatedFeatures: ['channel-manager', 'mensajeria-programada', 'check-in-online'],
    faqs: [
      {
        question: '¿Necesito tener web?',
        answer: 'No. La montamos contigo, con tus fotos y tus textos. Si ya tienes una, la conectamos con Hostly.',
      },
      {
        question: '¿Cuánto cuesta?',
        answer: 'Es un servicio aparte, a medida. Te decimos el precio antes de empezar.',
      },
      {
        question: '¿A quién paga el huésped?',
        answer: 'A ti. El pago va a tu cuenta a través de Stripe.',
      },
      {
        question: '¿Pueden entrar dos reservas el mismo día?',
        answer: 'No. Tu web solo deja reservar los días libres, y en cuanto entra una reserva se cierran en Airbnb y Booking.',
      },
    ],
  },

  // ─────────────────────────────── CONECTA TODO ───────────────────────────────
  {
    slug: 'conecta-todo',
    name: 'Conéctalo todo',
    iconName: 'Plug',
    shortDescription:
      'Automatizaciones a medida: conectamos Hostly con tu gestoría, tu web, tu ERP o lo que uses. Es un servicio aparte, con cuota mensual.',
    hero: {
      h1: 'Automatizaciones a medida: si lo usas, lo conectamos.',
      sub: 'Conectamos Hostly con tu gestoría, tu web, tu ERP o lo que uses. Es un servicio aparte, con una cuota mensual según lo que automaticemos.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Hay tareas que ninguna app hace por ti',
      body: 'Cada gestor trabaja a su manera. La gestoría te pide los datos en su formato, tu web va por su lado y hay tareas que repites a mano cada semana. Ninguna app las cubre todas de serie, y acabas haciéndolas tú para siempre.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Nos cuentas qué necesitas',
        body: 'Qué haces a mano, con qué herramientas y cada cuánto. Escríbenos con tu caso.',
        pantalla: [
          { t: 'enviat', text: 'Cada mes paso a mano los datos que me pide la gestoría.', et: 'Tú' },
        ],
      },
      {
        step: 2,
        title: 'Te proponemos cómo y cuánto',
        body: 'Lo estudiamos y te decimos qué se puede automatizar y cuál sería la cuota mensual. No empezamos hasta que nos digas que sí.',
        pantalla: [
          { t: 'rebut', text: 'Se puede automatizar. Aquí tienes la propuesta y la cuota mensual.', et: 'Hostly' },
          { t: 'boto', text: 'Sí, adelante' },
        ],
      },
      {
        step: 3,
        title: 'Lo construimos',
        body: 'Lo conectamos con tu Hostly sin que tengas que tocar nada. Te avisamos cuando esté funcionando.',
        pantalla: [
          { t: 'ok', text: 'Conectado con tu Hostly' },
          { t: 'rebut', text: 'Ya está funcionando.', et: 'Hostly' },
        ],
      },
      {
        step: 4,
        title: 'Funciona solo',
        body: 'Se ejecuta cada vez que toca. Tú no tienes que hacer nada más.',
        pantalla: [
          { t: 'ok', text: 'Datos para la gestoría', val: '1 nov' },
          { t: 'ok', text: 'Datos para la gestoría', val: '1 dic' },
          { t: 'nota', text: 'Cada mes, sin que hagas nada.' },
        ],
      },
    ],
    advantages: [
      'Conectamos Hostly con tu gestoría, tu web, tu ERP o lo que uses',
      'Lo estudiamos contigo antes de empezar',
      'Cuota mensual según lo que automaticemos, acordada antes de empezar',
      'Avisos y tareas a la medida de tu forma de trabajar',
      'Tú no tocas nada: lo montamos nosotros',
      'De serie, Hostly ya exporta a Excel y CSV',
    ],
    usage: [
      {
        title: 'Los datos que pide tu gestoría',
        body: 'Cada mes, la información que necesita tu gestoría, en su formato y sin copiarla a mano.',
      },
      {
        title: 'Tu web, conectada',
        body: 'Si ya tienes web, la conectamos con Hostly para que las reservas directas entren en el mismo calendario.',
      },
      {
        title: 'Avisos a tu manera',
        body: 'Un aviso a tu equipo cuando pasa algo concreto, con los datos que necesita cada persona.',
      },
    ],
    relatedFeatures: ['channel-manager', 'finanzas', 'burocracia'],
    faqs: [
      {
        question: '¿Cuánto cuesta?',
        answer:
          'Una cuota mensual según lo que automaticemos. Te la decimos antes de empezar, cuando sabemos qué necesitas.',
      },
      {
        question: '¿Cómo lo pido?',
        answer:
          'Escríbenos a hola@hostlylabs.com con tu caso: qué haces a mano y con qué herramientas. Lo estudiamos y te contestamos con una propuesta.',
      },
      {
        question: '¿Cuánto tarda?',
        answer:
          'Depende de lo que haya que conectar. Te lo decimos en la propuesta, antes de empezar.',
      },
      {
        question: '¿Qué hace Hostly sin este servicio?',
        answer:
          'Todo lo que ves en sus funciones, y exporta a Excel y CSV. Este servicio es para lo que va más allá: tu gestoría, tu web, tu ERP…',
      },
    ],
  },

  // ─────────────────────────────── FINANZAS EN ORDEN ───────────────────────────────
  {
    slug: 'finanzas',
    name: 'Finanzas en orden',
    iconName: 'BarChart3',
    shortDescription:
      'Ingresos por piso, canal y periodo, con las comisiones de Airbnb y Booking ya calculadas. Y la liquidación de cada propietario en cuatro pasos.',
    hero: {
      h1: 'Cierra el mes en minutos, no en una tarde.',
      sub: 'Ingresos por piso, por canal y por periodo. Las comisiones de Airbnb y Booking, calculadas solas. Y la liquidación de cada propietario en cuatro pasos.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'El cierre de mes: la parte que nadie quería',
      body: 'Abrir el Excel. Copiar las reservas de Airbnb. Descontar la comisión. Hacer lo mismo con Booking. Sumar la tasa turística. Repetirlo con cada piso. Y si gestionas pisos de terceros, preparar la liquidación de cada propietario. Son horas de trabajo que no tendrían que existir.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Tus ingresos, al día',
        body: 'Cada reserva entra con su importe y la comisión de la plataforma ya calculada. Ves lo que te queda sin copiar nada.',
        pantalla: [
          { t: 'xifra', et: 'Reserva de Camille', val: '435,00 €' },
          { t: 'xifra', et: 'Comisión de Airbnb', val: '−13,05 €' },
          { t: 'xifra', et: 'Te queda', val: '421,95 €', total: true },
        ],
      },
      {
        step: 2,
        title: 'Filtra por piso, canal o periodo',
        body: 'Los ingresos de un piso, de Airbnb o de Booking, o de un mes concreto, en un momento.',
        pantalla: [
          { t: 'xips', items: [{ text: 'Cala Moreta', to: 'gris' }, { text: 'Airbnb', to: 'gris' }, { text: 'Agosto', to: 'gris' }] },
          { t: 'xifra', et: 'Ingresos', val: '3.840 €', total: true },
        ],
      },
      {
        step: 3,
        title: 'Liquidación al propietario en cuatro pasos',
        body: 'Si gestionas pisos de terceros, un asistente te guía con tus honorarios y la limpieza ya calculados. Cada propietario ve la suya en su app.',
        pantalla: [
          { t: 'cap', text: 'Liquidación · Jordi', nota: '2 / 4' },
          { t: 'barra', fets: 2, de: 4 },
          { t: 'xifra', et: 'Honorarios', val: '−576 €' },
          { t: 'xifra', et: 'Limpieza', val: '−160 €' },
        ],
      },
      {
        step: 4,
        title: 'Exporta lo que necesites',
        body: 'Las liquidaciones, en CSV o PDF. La tasa turística, en Excel o CSV, lista para presentar.',
        pantalla: [
          { t: 'doc', text: 'Liquidación octubre.pdf' },
          { t: 'doc', text: 'Liquidaciones.csv' },
          { t: 'doc', text: 'Tasa turística.xlsx' },
        ],
      },
    ],
    advantages: [
      'Ingresos por piso, por canal y por periodo',
      'Comisiones de Airbnb y Booking calculadas solas',
      'Tasa turística calculada en cada reserva',
      'Liquidación al propietario con un asistente de cuatro pasos',
      'El propietario ve su liquidación en su app',
      'Liquidaciones en CSV o PDF, y tasa turística en Excel o CSV',
    ],
    usage: [
      {
        title: 'Saber cuánto ganaste en agosto',
        body: 'Sin sumar nada. Filtras agosto y ves el total por piso y por canal: cuánto se quedó Airbnb, cuánto Booking y cuánto tú.',
      },
      {
        title: 'Cerrar el mes con tus propietarios',
        body: 'Preparas la liquidación de cada propietario con el asistente. Él la ve en su app, con sus ingresos, tus honorarios y la limpieza.',
      },
      {
        title: 'Pasar los datos a tu gestoría',
        body: 'Exportas las liquidaciones en CSV o PDF y la tasa turística en Excel. Se lo mandas a tu gestoría sin copiar nada a mano.',
      },
    ],
    relatedFeatures: ['burocracia', 'multi-rol', 'channel-manager'],
    faqs: [
      {
        question: '¿Calcula las comisiones de Airbnb y Booking?',
        answer:
          'Sí. Hostly calcula la comisión de cada reserva según su canal. Ves lo que paga el huésped, lo que se queda la plataforma y lo que te queda a ti.',
      },
      {
        question: '¿Puedo hacer liquidaciones para los propietarios de los pisos que gestiono?',
        answer:
          'Sí. Un asistente de cuatro pasos te ayuda a prepararlas, con tus honorarios y la limpieza. Cada propietario ve la suya en su app; Hostly no la envía por correo.',
      },
      {
        question: '¿Qué puedo exportar para mi gestoría?',
        answer:
          'Las liquidaciones, en CSV o PDF, y la tasa turística, en Excel o CSV. Si necesitas algo a medida, lo vemos con las automatizaciones de «Conéctalo todo».',
      },
    ],
  },

  // ─────────────────────────── TASA TURÍSTICA (slug burocracia) ───────────────────────────
  {
    slug: 'burocracia',
    name: 'Tasa turística',
    iconName: 'Receipt',
    shortDescription:
      'La tasa turística, calculada sola: tarifa según la ley y tu municipio, importe por piso y el Excel listo para presentar.',
    hero: {
      h1: 'La tasa turística, calculada y lista para presentar.',
      sub: 'Hostly calcula la tarifa con la ley y el municipio de cada piso, suma el importe de cada periodo y te prepara el Excel para presentarla. Tú la presentas y la marcas como hecha.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Cada vez, la misma tarde de cuentas',
      body: 'Cada vez que toca presentar la tasa turística hay que buscar la tarifa de tu municipio, contar personas y noches de cada estancia y pasarlo todo al formato que pide la agencia tributaria. Y el plazo no espera.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Hostly sabe qué tarifa te toca',
        body: 'La calcula con la ley vigente y el municipio de cada piso. No tienes que buscar nada.',
        pantalla: [
          { t: 'camp', et: 'Municipio', val: 'Begur' },
          { t: 'camp', et: 'Tipo', val: 'Vivienda de uso turístico' },
          { t: 'camp', et: 'Por persona y noche', val: '1,75 €' },
        ],
      },
      {
        step: 2,
        title: 'Calcula cada estancia',
        body: 'Con los datos de cada reserva, calcula el importe de la tasa y el total por piso de cada periodo.',
        pantalla: [
          { t: 'xifra', et: 'Huéspedes', val: '2' },
          { t: 'xifra', et: 'Noches', val: '4' },
          { t: 'xifra', et: 'Tasa de la estancia', val: '14,00 €', total: true },
        ],
      },
      {
        step: 3,
        title: 'Te avisa cuando toca presentarla',
        body: 'Cuando toca presentarla, ves un aviso en la app.',
        pantalla: [
          { t: 'avis', text: 'Toca presentar la tasa', val: 'abr–sep' },
          { t: 'nota', text: 'Lo ves en la app.' },
        ],
      },
      {
        step: 4,
        title: 'Exportas, presentas y lo marcas',
        body: 'Descargas el Excel o el CSV listo para presentar. Cuando la has presentado, pulsas «ya la he presentado».',
        pantalla: [
          { t: 'doc', text: 'Tasa turística abr–sep.xlsx' },
          { t: 'boto', text: 'Ya la he presentado' },
        ],
      },
    ],
    advantages: [
      'Tarifa según la ley y el municipio de cada piso',
      'Importe de cada reserva y total por piso, de cada periodo',
      'Aviso en la app mientras el plazo está abierto',
      'Excel o CSV listo para presentar',
      'Incluida en el plan Gratis, para siempre',
      'Si quieres, el huésped la paga con tarjeta al hacer el check-in',
    ],
    usage: [
      {
        title: 'Cuando llega el plazo',
        body: 'Hostly te avisa. Descargas el Excel con las estancias del periodo, lo presentas y lo marcas como presentado.',
      },
      {
        title: 'Pisos en municipios distintos',
        body: 'Cada piso tiene la tarifa de su municipio. Hostly la calcula por separado, sin que tengas que buscar nada.',
      },
      {
        title: 'Cobrarla al huésped',
        body: 'Activas el cobro y el huésped paga la tasa con tarjeta al hacer el check-in, a través de Stripe. El cobro lleva una comisión del 5 %, que puedes hacer pagar al huésped. Tú no persigues a nadie.',
      },
    ],
    relatedFeatures: ['check-in-online', 'finanzas', 'conecta-todo'],
    faqs: [
      {
        question: '¿Hostly presenta la tasa por mí?',
        answer:
          'No. La presentas tú, con el Excel que te prepara Hostly. Después la marcas como presentada en la app.',
      },
      {
        question: '¿Cuándo hay que presentarla?',
        answer:
          'Cuando se abre el plazo, Hostly te avisa en la app y te deja el Excel preparado.',
      },
      {
        question: '¿Puedo cobrársela al huésped?',
        answer:
          'Sí. Si lo activas, el huésped la paga con tarjeta al hacer el check-in, a través de Stripe. El cobro lleva una comisión del 5 %; tú decides si la paga el huésped.',
      },
    ],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}
