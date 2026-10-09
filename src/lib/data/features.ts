/**
 * Funcionalidades de Hostly para páginas `/funcionalidades/<slug>` y cards de hub.
 * Tono: verbos concretos, sistema por encima de feature. Castellano neutro.
 */

export type HowItWorksStep = {
  step: number;
  title: string;
  body: string;
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
      },
      {
        step: 2,
        title: 'Rellenas la ficha de cada piso',
        body: 'El wifi, cómo entrar, normas, parking, recomendaciones. La IA responde con eso y con los datos de la reserva: piso, fechas y huéspedes.',
      },
      {
        step: 3,
        title: 'La IA responde y te avisa cuando toca',
        body: 'Contesta al momento, de día o de noche, en el idioma del huésped. Si algo necesita a una persona, te avisa con el piso y las primeras palabras del mensaje.',
      },
      {
        step: 4,
        title: 'Tú lo ves todo en una sola bandeja',
        body: 'WhatsApp, Airbnb y Booking en el mismo sitio. Tomas el control de cualquier conversación cuando quieras. Si corriges una respuesta, la IA guarda la lección y la ves en el chat.',
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
          'No hay revisión previa: la IA contesta sola. Lo que sí puedes es activarla o apagarla en cada piso y tomar el control de cualquier conversación cuando quieras.',
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
      'El huésped rellena sus datos desde el móvil y Hostly envía el registro a la policía. En Cataluña, a los Mossos d\'Esquadra. Gratis para siempre.',
    hero: {
      h1: 'El registro a la policía, sin copiar ni un dato a mano',
      sub: 'El huésped rellena sus datos desde el móvil y Hostly los valida. En Cataluña, los envía cada día a los Mossos d\'Esquadra. En el resto de España, la conexión la activamos contigo al darte de alta.',
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
        body: 'En el plan completo, le llega con los mensajes automáticos, en su idioma. En el plan gratis, cada piso tiene su enlace fijo para compartirlo con tus huéspedes.',
      },
      {
        step: 2,
        title: 'Rellena sus datos desde el móvil',
        body: 'Nombre, documento, fecha de nacimiento, nacionalidad y dirección, en castellano, inglés o francés. Un adulto puede registrar a todo el grupo con el mismo enlace.',
      },
      {
        step: 3,
        title: 'Hostly comprueba cada dato',
        body: 'Antes de enviar nada, valida cada campo. Si falta algo o no es válido, el huésped lo corrige en el momento. El código de acceso solo aparece cuando el check-in está hecho.',
      },
      {
        step: 4,
        title: 'Hostly lo envía a la policía',
        body: 'En Cataluña, cada día a las 15:00 sube el fichero al portal de los Mossos d\'Esquadra y archiva el comprobante. Si alguna línea falla, te avisa y te dice cuál.',
      },
    ],
    advantages: [
      'Formulario en el móvil, en castellano, inglés y francés',
      'Cada dato se valida antes de enviarlo',
      'Un adulto registra a todo el grupo con el mismo enlace',
      'El código de acceso, solo cuando el check-in está hecho',
      'Envío diario a los Mossos d\'Esquadra, con el comprobante archivado',
      'Aviso si falta un check-in o si un registro falla',
    ],
    usage: [
      {
        title: 'Familia de cuatro',
        body: 'Un adulto registra a los cuatro con el mismo enlace. Si un dato no es válido, lo ve antes de enviar, no cuando ya es tarde.',
      },
      {
        title: 'Pisos en Cataluña',
        body: 'Cada día a las 15:00, Hostly sube a los Mossos los check-ins pendientes y guarda el comprobante. Tú no entras en ningún portal.',
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
          'Si tus pisos están en Cataluña, sí: el check-in y el envío a los Mossos funcionan solos, sin otra app en medio. En el resto de España, activamos la conexión con la policía contigo al darte de alta.',
      },
      {
        question: '¿Qué pasa si un registro falla?',
        answer:
          'Hostly lee la respuesta del portal de los Mossos línea a línea. Si alguna falla, te avisa y te dice cuál, para que la corrijas.',
      },
      {
        question: '¿El huésped tiene que subir una foto del documento?',
        answer:
          'No. Solo escribe sus datos: tipo y número de documento, nombre, fecha de nacimiento, nacionalidad y dirección. Hostly comprueba que son válidos antes de enviarlos.',
      },
      {
        question: '¿Cuánto cuesta?',
        answer:
          'Nada. El check-in online y el registro a la policía son gratis para siempre, sin tarjeta. En Cataluña, también la tasa turística.',
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
      },
      {
        step: 2,
        title: 'Importamos tu histórico',
        body: 'Traemos tus reservas. A partir de ese momento, cada reserva nueva entra sola, y cada 20 minutos Hostly lo vuelve a comprobar por si alguna se ha quedado por el camino.',
      },
      {
        step: 3,
        title: 'Lo gestionas todo desde un calendario',
        body: 'Los bloqueos que pones llegan a Airbnb y Booking al instante. Los precios se publican cada mañana y cada vez que cambias algo.',
      },
      {
        step: 4,
        title: 'Y tus reservas directas, también',
        body: 'Las que te llegan por teléfono las apuntas en un momento. Y si quieres web propia con reservas directas, la montamos contigo, a medida.',
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
          'Sí. En el plan gratis, Hostly lee tu calendario de Airbnb y Booking con el enlace iCal cada 30 minutos, para el check-in y el registro a la policía.',
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
      title: 'Los grupos de WhatsApp con el equipo de limpieza no escalan',
      body: 'Cuando pasas de dos a cinco pisos, coordinar limpiezas por WhatsApp se vuelve un caos. Mensajes perdidos, horarios que no cuadran, incidencias sin foto y nadie sabe quién va el sábado. Al final eres tú quien lo coordina todo a mano.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Montas el equipo de cada piso',
        body: 'Añades a las personas que limpian cada piso y el orden del turno. Cada una usa su app, en catalán, castellano o inglés, o el asistente de WhatsApp.',
      },
      {
        step: 2,
        title: 'Cada salida crea su limpieza',
        body: 'Por cada salida, Hostly crea la limpieza de ese día y avisa a quien le toca. Si cambian las fechas, avisa del cambio.',
      },
      {
        step: 3,
        title: 'Si alguien no puede, pasa a la siguiente',
        body: 'Si la persona dice «no puedo», la limpieza pasa a la siguiente del turno, que recibe el aviso por WhatsApp. Tú no tienes que buscar a nadie.',
      },
      {
        step: 4,
        title: 'Al acabar, fotos e incidencias',
        body: 'La limpieza se marca como hecha con fotos de salida. Si algo está roto o el huésped se ha dejado algo, queda como incidencia con fecha, piso y persona.',
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
    name: 'Precios dinámicos con PriceLabs',
    iconName: 'TrendingUp',
    shortDescription:
      'Las recomendaciones de PriceLabs, dentro de Hostly. Tú pones los límites y Hostly publica el precio en Airbnb y Booking cada día.',
    hero: {
      h1: 'Precios que siguen a la demanda, sin salir de Hostly',
      sub: 'PriceLabs recomienda un precio para cada día. Tú pones los límites, ves por qué sale cada precio y Hostly lo publica en Airbnb y Booking.',
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
      },
      {
        step: 2,
        title: 'PriceLabs recomienda',
        body: 'Analiza la demanda, la temporada y los eventos de tu zona, y propone un precio para cada día.',
      },
      {
        step: 3,
        title: 'Tú decides',
        body: 'En el calendario de Hostly ves el precio recomendado y por qué. En modo manual, lo aceptas con un clic. En automático, se aplica solo dentro de tus límites.',
      },
      {
        step: 4,
        title: 'Se publica en Airbnb y Booking',
        body: 'Hostly publica los precios cada mañana y cada vez que cambias algo.',
      },
    ],
    advantages: [
      'Las recomendaciones de PriceLabs, dentro de Hostly',
      'Mínimos, máximos, temporadas y días con precio fijo',
      'Noches mínimas y descuentos por semana o por mes',
      'Precio recomendado, aceptado con un clic',
      '«¿Por qué este precio?»: ves de dónde sale cada precio',
      'Publicado en Airbnb y Booking cada mañana y en cada cambio',
    ],
    usage: [
      {
        title: 'Un concierto grande en la ciudad',
        body: 'PriceLabs detecta la demanda de esos días y recomienda subir el precio. Lo ves en el calendario de Hostly y lo aceptas con un clic.',
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
        question: '¿Hostly usa PriceLabs?',
        answer:
          'Sí. Las recomendaciones vienen de PriceLabs, que analiza la demanda, la temporada y los eventos de tu zona. Tú lo ves y lo decides todo desde Hostly.',
      },
      {
        question: '¿Puedo aprobar los precios a mano?',
        answer:
          'Sí. En modo manual ves el precio recomendado y lo aceptas con un clic. En modo automático se aplica solo, siempre dentro de tus mínimos y máximos.',
      },
      {
        question: '¿Puedo fijar el precio de un día concreto?',
        answer:
          'Sí. Un día con precio fijo se respeta tal cual, aunque PriceLabs recomiende otro.',
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
      },
      {
        step: 2,
        title: 'Usas variables',
        body: 'El enlace de check-in, los códigos, las fechas. Hostly los rellena con los datos de cada reserva.',
      },
      {
        step: 3,
        title: 'Hostly la traduce',
        body: 'Cada mensaje sale traducido al idioma del huésped. Tú escribes la plantilla una sola vez.',
      },
      {
        step: 4,
        title: 'Sale por el canal que toca',
        body: 'Por WhatsApp si tienes el número del huésped. Si no, por Airbnb o Booking. Todo queda en el historial de la reserva.',
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
      },
      {
        step: 2,
        title: 'Eliges sus pisos',
        body: 'Un gestor puede llevar todos tus pisos o solo algunos. La limpieza y los propietarios, solo los suyos.',
      },
      {
        step: 3,
        title: 'Cada uno entra con su cuenta',
        body: 'Desde el móvil o el ordenador. La limpieza ve sus limpiezas; el propietario, el calendario y las finanzas de sus pisos, sin poder cambiar nada.',
      },
    ],
    advantages: [
      'Tres papeles claros: gestor, limpieza y propietario',
      'Permisos por piso: cada gestor lleva los pisos que le das',
      'Propietarios en solo lectura: calendario y finanzas',
      'En la app, cada uno ve lo suyo: la limpieza, sus limpiezas; el gestor, sus reservas',
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
      },
      {
        step: 2,
        title: 'Te proponemos cómo y cuánto',
        body: 'Lo estudiamos y te decimos qué se puede automatizar y cuál sería la cuota mensual. No empezamos hasta que nos digas que sí.',
      },
      {
        step: 3,
        title: 'Lo construimos',
        body: 'Lo conectamos con tu Hostly sin que tengas que tocar nada. Te avisamos cuando esté funcionando.',
      },
      {
        step: 4,
        title: 'Funciona solo',
        body: 'Se ejecuta cada vez que toca. Tú no tienes que hacer nada más.',
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
      },
      {
        step: 2,
        title: 'Filtra por piso, canal o periodo',
        body: 'Los ingresos de un piso, de Airbnb o de Booking, o de un mes concreto, en un momento.',
      },
      {
        step: 3,
        title: 'Liquidación al propietario en cuatro pasos',
        body: 'Si gestionas pisos de terceros, un asistente te guía con tus honorarios y la limpieza ya calculados. El propietario la ve en su app.',
      },
      {
        step: 4,
        title: 'Exporta lo que necesites',
        body: 'Las liquidaciones, en CSV o PDF. La tasa turística, en Excel o CSV, lista para presentar.',
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
          'Sí. Un asistente de cuatro pasos te ayuda a prepararlas, con tus honorarios y la limpieza. El propietario la ve en su app; Hostly no la envía por correo.',
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
      'La tasa turística de Cataluña, calculada sola: tarifa según la ley y tu municipio, importe por piso y el Excel listo para presentar.',
    hero: {
      h1: 'La tasa turística, calculada y lista para presentar.',
      sub: 'Hostly calcula la tarifa con la ley y el municipio de cada piso, suma el importe de cada semestre y te prepara el Excel para la Agència Tributària de Catalunya. Tú la presentas y la marcas como hecha.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver precios',
    },
    problem: {
      title: 'Cada semestre, la misma tarde de cuentas',
      body: 'En Cataluña, la tasa turística se presenta dos veces al año: del 1 al 20 de abril y del 1 al 20 de octubre. Toca buscar la tarifa de tu municipio, contar personas y noches de cada estancia y pasarlo todo al formato que pide la ATC. Y el plazo no espera.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Hostly sabe qué tarifa te toca',
        body: 'La calcula con la ley vigente y el municipio de cada piso. No tienes que buscar nada.',
      },
      {
        step: 2,
        title: 'Calcula cada estancia',
        body: 'Con los datos de cada reserva, calcula el importe de la tasa y el total por piso de cada semestre.',
      },
      {
        step: 3,
        title: 'Te avisa cuando toca presentarla',
        body: 'Mientras el plazo está abierto, del 1 al 20 de abril y del 1 al 20 de octubre, ves un aviso en la app.',
      },
      {
        step: 4,
        title: 'Exportas, presentas y lo marcas',
        body: 'Descargas el Excel o el CSV listo para presentar en la ATC. Cuando la has presentado, pulsas «ya la he presentado».',
      },
    ],
    advantages: [
      'Tarifa según la ley y el municipio de cada piso',
      'Importe de cada reserva y total por piso, cada semestre',
      'Aviso en la app mientras el plazo está abierto',
      'Excel o CSV listo para presentar en la ATC',
      'Incluida en el plan gratis, para siempre',
      'Si quieres, el huésped la paga con tarjeta al hacer el check-in',
    ],
    usage: [
      {
        title: 'Presentar el semestre de verano',
        body: 'En octubre, Hostly te avisa. Descargas el Excel con las estancias de abril a septiembre, lo presentas en la ATC y lo marcas como presentado.',
      },
      {
        title: 'Pisos en municipios distintos',
        body: 'Cada piso tiene la tarifa de su municipio. Hostly la calcula por separado, sin que tengas que buscar nada.',
      },
      {
        title: 'Cobrarla al huésped',
        body: 'Activas el cobro y el huésped paga la tasa con tarjeta al hacer el check-in, a través de Stripe. El cobro lleva una pequeña comisión, que puedes hacer pagar al huésped. Tú no persigues a nadie.',
      },
    ],
    relatedFeatures: ['check-in-online', 'finanzas', 'conecta-todo'],
    faqs: [
      {
        question: '¿Hostly presenta la tasa por mí?',
        answer:
          'No. La presentas tú en la Agència Tributària de Catalunya, con el Excel que te prepara Hostly. Después la marcas como presentada en la app.',
      },
      {
        question: '¿Cuándo hay que presentarla?',
        answer:
          'Dos veces al año: del 1 al 20 de abril, por las estancias de octubre a marzo, y del 1 al 20 de octubre, por las de abril a septiembre. Hostly te avisa en la app mientras el plazo está abierto.',
      },
      {
        question: '¿Funciona fuera de Cataluña?',
        answer:
          'Hoy, la tasa que calcula Hostly es la de Cataluña. Si tus pisos están en otra comunidad, Hostly te sirve igual para todo lo demás.',
      },
      {
        question: '¿Puedo cobrársela al huésped?',
        answer:
          'Sí. Si lo activas, el huésped la paga con tarjeta al hacer el check-in, a través de Stripe. El cobro lleva una pequeña comisión; tú decides si la paga el huésped.',
      },
    ],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}
