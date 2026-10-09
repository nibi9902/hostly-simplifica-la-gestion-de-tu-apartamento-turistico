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
      'Un agente que contesta a tus huéspedes por WhatsApp con tu tono, 24/7, y te deja solo las conversaciones que de verdad necesitan tu atención.',
    hero: {
      h1: 'Un agente que responde por WhatsApp mientras tú no miras el móvil',
      sub: 'Contesta dudas de check-in, normas, Wi-Fi o incidencias con el tono que le marcas. Escala a ti solo cuando hace falta.',
      primaryCta: 'Probar la IA gratis',
      secondaryCta: 'Ver cómo responde',
    },
    problem: {
      title: 'Tu móvil no debería sonar a las 2 de la mañana por preguntar dónde está el garaje',
      body: 'Gestionar apartamentos turísticos acaba siendo responder las mismas 20 preguntas todo el día. Huéspedes que preguntan el Wi-Fi, cómo abrir la puerta, si pueden hacer early check-in. Multiplícalo por 3 apartamentos y un fin de semana: ya no descansas.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Conectas tu WhatsApp y tu canal OTA',
        body: 'Enlazas WhatsApp Business y Airbnb/Booking. El agente lee el contexto de la reserva (apartamento, fechas, huésped) automáticamente.',
      },
      {
        step: 2,
        title: 'Le das tus normas y tu tono',
        body: 'Rellenas una guía por apartamento: Wi-Fi, check-in, normas, mejores restaurantes. Marcas el tono (cercano, formal, en catalán, en castellano).',
      },
      {
        step: 3,
        title: 'La IA responde y escala cuando toca',
        body: 'Responde dudas repetitivas al instante. Si detecta queja, petición fuera de norma o algo técnico, te pasa la conversación a ti con un resumen.',
      },
      {
        step: 4,
        title: 'Tú ves todo en un inbox unificado',
        body: 'Revisas qué ha respondido, editas tono sobre la marcha y aprendes qué preguntas se repiten por apartamento.',
      },
    ],
    advantages: [
      'Contesta en castellano, catalán e inglés sin cambiar de configuración',
      'Lee el contexto de la reserva — no responde genérico, responde por reserva',
      'Escala a ti con resumen claro cuando detecta algo delicado',
      'Aprende de tus correcciones para responder cada vez más como tú',
      'Deja trazabilidad completa: qué respondió, a quién, cuándo',
      'Inbox unificado: WhatsApp, Airbnb, Booking y email en una sola vista',
    ],
    usage: [
      {
        title: 'Check-in del viernes noche',
        body: 'El huésped pregunta cómo abrir la puerta a las 23:45. La IA le manda el código y las instrucciones del apartamento concreto al instante. Tú duermes.',
      },
      {
        title: 'Dudas de última hora',
        body: 'Preguntan si hay parking, si admiten mascotas, si pueden fumar. La IA responde con tus normas. Si insisten, te avisa.',
      },
      {
        title: 'Incidencia real',
        body: 'Se queja del aire acondicionado. La IA detecta la queja, responde para calmar, abre incidencia en limpiezas/mantenimiento y te notifica.',
      },
    ],
    relatedFeatures: ['mensajeria-programada', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: '¿Puedo revisar lo que responde antes de que se envíe?',
        answer:
          'Sí. Tienes dos modos: envío automático o revisión previa. Puedes empezar en modo revisión hasta que el tono esté calibrado y después pasar a automático.',
      },
      {
        question: '¿Qué pasa si un huésped pregunta algo que la IA no sabe?',
        answer:
          'Te escala la conversación con un resumen de lo hablado. El huésped no ve ningún corte: la IA le dice que consulta un momento y tú apareces.',
      },
      {
        question: '¿Habla catalán de verdad?',
        answer:
          'Sí. Catalán, castellano, inglés, francés e italiano. Cambia el idioma según el huésped sin que tengas que configurarlo.',
      },
      {
        question: '¿Necesito WhatsApp Business?',
        answer:
          'Sí. Usamos WhatsApp Business API vía Evolution. Si no lo tienes configurado, te guiamos en el onboarding sin coste extra.',
      },
    ],
  },

  // ─────────────────────────────── CHECK-IN ONLINE ───────────────────────────────
  {
    slug: 'check-in-online',
    name: 'Check-in online con SES automático',
    iconName: 'ShieldCheck',
    shortDescription:
      'El huésped firma, envía documento y datos desde su móvil. Hostly los manda automáticamente a SES.Hospedajes y a Mossos o Ertzaintza.',
    hero: {
      h1: 'Check-in legal hecho antes de que el huésped llegue al apartamento',
      sub: 'El viajero sube DNI, firma y datos desde su móvil. Hostly lo envía a SES.Hospedajes y registros autonómicos sin que tú toques nada.',
      primaryCta: 'Ver flujo completo',
      secondaryCta: 'Hablar con ventas',
    },
    problem: {
      title: 'El parte de viajeros te ocupa más tiempo del que debería',
      body: 'Desde el 2 de enero de 2025 el SES.Hospedajes es obligatorio. Muchos propietarios siguen rellenando datos a mano, enviando formularios a cada huésped, pasándolos al portal del Ministerio uno por uno. En alta ocupación es imposible mantenerlo al día sin errores.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'El huésped recibe un enlace al confirmar reserva',
        body: 'Llega automáticamente por WhatsApp o email según tu configuración, con las instrucciones en su idioma.',
      },
      {
        step: 2,
        title: 'Hace el check-in desde el móvil en 3 minutos',
        body: 'Sube foto del documento, rellena datos y firma. El formulario valida que no falten campos obligatorios.',
      },
      {
        step: 3,
        title: 'Hostly envía el parte a SES y registros autonómicos',
        body: 'Genera el XML correcto, lo firma y lo envía a SES.Hospedajes, Mossos d\'Esquadra o Ertzaintza según la comunidad.',
      },
      {
        step: 4,
        title: 'Recibes confirmación y guardamos la prueba',
        body: 'Si hay error de validación en el Ministerio, lo detectamos y te avisamos. Si todo va bien, queda archivado por si te piden justificación.',
      },
    ],
    advantages: [
      'Cumple SES.Hospedajes, Mossos y Ertzaintza sin intervención manual',
      'Firma digital válida con auditoría por reserva',
      'Formulario móvil en 5 idiomas',
      'Detecta documentos borrosos antes de que los envíes',
      'Guarda justificantes durante el plazo legal requerido',
      'Evita sanciones por partes sin enviar o con datos incompletos',
    ],
    usage: [
      {
        title: 'Familia con 4 personas',
        body: 'Un adulto rellena datos de todos, sube los 4 DNIs y firma. En 4 minutos queda todo registrado en SES.',
      },
      {
        title: 'Apartamentos en Catalunya',
        body: 'Envío automático al Registre de Viatgers de Mossos d\'Esquadra, además del SES nacional. Sin doble trabajo.',
      },
      {
        title: 'Llegada nocturna sin presencia',
        body: 'El huésped hace check-in a las 23:00, accede con código al apartamento y el parte queda enviado antes de que tú te enteres.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'mensajeria-programada', 'multi-rol'],
    faqs: [
      {
        question: '¿Sustituye a Chekin?',
        answer:
          'Sí. Hostly hace check-in, firma y envío SES sin necesidad de Chekin como intermediario. Si ya usas Chekin, la migración se hace en una sesión.',
      },
      {
        question: '¿Qué pasa si SES.Hospedajes rechaza el parte?',
        answer:
          'Lo detectamos inmediatamente, te avisamos y te mostramos qué campo falló. Puedes corregirlo en un par de clics.',
      },
      {
        question: '¿Y si tengo apartamentos en Catalunya y Andalucía a la vez?',
        answer:
          'Hostly detecta la comunidad autónoma del apartamento y envía al registro correcto (Mossos, Ertzaintza o solo SES).',
      },
      {
        question: '¿Cuánto tiempo guardáis los partes?',
        answer:
          'Los mantenemos archivados durante el plazo legal exigido (3 años) para que puedas justificar cualquier registro si hay inspección.',
      },
    ],
  },

  // ─────────────────────────────── CHANNEL MANAGER ───────────────────────────────
  {
    slug: 'channel-manager',
    name: 'Channel manager unificado',
    iconName: 'Calendar',
    shortDescription:
      'Calendario único para Airbnb, Booking y tu web. Se sincroniza en tiempo real y te protege de dobles reservas.',
    hero: {
      h1: 'Un calendario único para Airbnb, Booking y tu web',
      sub: 'Sincronización en tiempo real, anti-overbooking y cambios de precio desde un solo sitio.',
      primaryCta: 'Conectar mis OTAs',
      secondaryCta: 'Ver integraciones',
    },
    problem: {
      title: 'Gestionar 3 calendarios a mano siempre acaba en overbooking',
      body: 'Tener Airbnb, Booking y la web con calendarios separados es cuestión de tiempo. Un bloqueo que tardas en mover, un cambio de fechas que no actualizas, y acabas con dos reservas en la misma noche. Se pierde dinero y reputación.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Conectas tus OTAs desde el panel',
        body: 'Airbnb, Booking.com y Beds24 se conectan en unos minutos. Tu web se enlaza vía widget de reserva.',
      },
      {
        step: 2,
        title: 'Importamos tu histórico',
        body: 'Traemos reservas actuales y futuras. A partir de ese momento todo se sincroniza en tiempo real.',
      },
      {
        step: 3,
        title: 'Editas disponibilidad y precios en un sitio',
        body: 'Un cambio de precio se propaga a todas las plataformas. Un bloqueo se refleja al instante en todas.',
      },
    ],
    advantages: [
      'Anti-overbooking real: imposible solapar reservas',
      'Sincronización bidireccional en tiempo real',
      'Bloqueos y precios editables desde un único calendario',
      'Histórico completo por apartamento',
      'Alertas cuando una OTA falla en sincronización',
      'Soporte para Airbnb, Booking, Vrbo y web directa',
    ],
    usage: [
      {
        title: 'Subida de precio en Semana Santa',
        body: 'Cambias precio una vez en Hostly. Airbnb y Booking lo reflejan en minutos.',
      },
      {
        title: 'Bloqueo por reforma',
        body: 'Marcas 5 días de bloqueo. Todas las OTAs lo reciben antes de que nadie pueda reservar.',
      },
      {
        title: 'Cancelación de huésped',
        body: 'Cuando una reserva cae, el hueco queda libre automáticamente en todas las plataformas.',
      },
    ],
    relatedFeatures: ['precios-dinamicos', 'gestion-de-limpiezas', 'conecta-todo'],
    faqs: [
      {
        question: '¿Qué OTAs soportáis?',
        answer:
          'Airbnb, Booking.com, Vrbo y más vía Beds24. Si tienes web directa, conectamos el motor de reservas por widget o iframe.',
      },
      {
        question: '¿Qué pasa si Airbnb tiene un fallo de API?',
        answer:
          'Te avisamos en tiempo real y protegemos tus calendarios para evitar overbooking. Cuando Airbnb vuelve, resincronizamos solo.',
      },
      {
        question: '¿Puedo usar Hostly sin conectar ninguna OTA?',
        answer:
          'Sí, pero pierdes el valor principal. Hostly está pensado para unificar, no para ir aislado.',
      },
    ],
  },

  // ─────────────────────────────── GESTIÓN LIMPIEZAS ───────────────────────────────
  {
    slug: 'gestion-de-limpiezas',
    name: 'Gestión de limpiezas con app para el equipo',
    iconName: 'Sparkles',
    shortDescription:
      'Asigna limpiezas, recibe fotos de salida y controla incidencias sin grupos de WhatsApp caóticos.',
    hero: {
      h1: 'Coordina limpiezas sin vivir en un grupo de WhatsApp',
      sub: 'Asignación automática, app para el equipo, fotos de salida y historial por apartamento.',
      primaryCta: 'Ver la app del equipo',
      secondaryCta: 'Probar gratis',
    },
    problem: {
      title: 'Los grupos de WhatsApp con limpiadoras no escalan',
      body: 'Cuando pasas de 2 a 5 apartamentos, coordinar limpiezas por WhatsApp se vuelve un caos. Mensajes perdidos, horarios que no cuadran, incidencias sin foto, materiales que faltan y no sabes qué día. Al final eres tú quien coordina todo a mano.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Das de alta a tu equipo',
        body: 'Añades a tus limpiadoras o empresa externa. Cada una tiene su app con los apartamentos asignados.',
      },
      {
        step: 2,
        title: 'Hostly genera el calendario de limpiezas',
        body: 'Detecta check-outs y crea turnos automáticamente. Puedes ajustar manualmente antes de asignar.',
      },
      {
        step: 3,
        title: 'El equipo confirma y hace fotos',
        body: 'Confirman turno desde la app, marcan cuando entran y cuando acaban, suben fotos del estado final.',
      },
      {
        step: 4,
        title: 'Tú ves todo y registras incidencias',
        body: 'Revisas fotos, incidencias (algo roto, olvido del huésped) y el histórico por apartamento.',
      },
    ],
    advantages: [
      'App dedicada para limpiadoras, sin necesidad de WhatsApp',
      'Generación automática de turnos a partir de reservas',
      'Fotos de salida firmadas por limpiadora',
      'Registro de incidencias con fecha, apartamento y responsable',
      'Notificaciones push al equipo',
      'Pago por turnos: sabes qué cobras y qué debes cada mes',
    ],
    usage: [
      {
        title: 'Agencia con 3 limpiadoras y 12 apartamentos',
        body: 'Cada limpiadora ve solo los apartamentos que le tocan. El encargado ve todo desde una vista de calendario.',
      },
      {
        title: 'Incidencia: huésped dejó ropa',
        body: 'La limpiadora sube foto desde la app. Queda registrado. Avisas al huésped por WhatsApp desde el mismo hilo.',
      },
      {
        title: 'Cambio de última hora',
        body: 'Reserva cancelada a las 10:00. El turno se reprograma automáticamente y la limpiadora recibe la actualización.',
      },
    ],
    relatedFeatures: ['multi-rol', 'conecta-todo', 'channel-manager'],
    faqs: [
      {
        question: '¿Y si mi limpiadora no quiere instalar otra app?',
        answer:
          'La app es ligera, en su idioma y solo ve lo suyo. Solemos recomendarla en el mismo onboarding del equipo para que vean que les simplifica el día.',
      },
      {
        question: '¿Puedo pagar a mi equipo desde la plataforma?',
        answer:
          'No. Hostly calcula importes por turno y te da el resumen mensual, pero el pago sigue haciéndose fuera.',
      },
      {
        question: '¿Funciona con empresa de limpieza externa?',
        answer:
          'Sí. Damos un acceso de "equipo externo" para que coordinen turnos sin ver datos sensibles del negocio.',
      },
    ],
  },

  // ─────────────────────────────── PRECIOS DINÁMICOS ───────────────────────────────
  {
    slug: 'precios-dinamicos',
    name: 'Precios dinámicos integrados',
    iconName: 'TrendingUp',
    shortDescription:
      'Ajusta precio cada día según demanda, competencia y eventos. Sin contratar PriceLabs aparte.',
    hero: {
      h1: 'Precios que se ajustan solos según demanda y competencia',
      sub: 'Motor de precios dinámicos integrado en Hostly. Sin partners, sin add-ons, sin complicarte.',
      primaryCta: 'Ver cómo calcula precios',
      secondaryCta: 'Probar gratis',
    },
    problem: {
      title: 'El precio fijo te deja dinero sobre la mesa',
      body: 'Poner el mismo precio todo el año pierde ingresos en temporada alta y te deja vacío en baja. Revisar precios manualmente cada semana es un trabajo a tiempo parcial. Y contratar PriceLabs aparte son otros 20 €/mes por apartamento.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Defines precio base y límites',
        body: 'Precio mínimo y máximo por apartamento. Qué temporadas consideras altas. Días mínimos de estancia.',
      },
      {
        step: 2,
        title: 'Hostly analiza demanda y competencia',
        body: 'Estudia ocupación en tu zona, eventos, festivos y competidores directos.',
      },
      {
        step: 3,
        title: 'Propone precios por día',
        body: 'Te muestra calendario con precios sugeridos. Puedes aceptar todo, ajustar manualmente o fijar reglas.',
      },
      {
        step: 4,
        title: 'Se publica en todas tus OTAs',
        body: 'Los precios aprobados se sincronizan a Airbnb, Booking y tu web vía channel manager.',
      },
    ],
    advantages: [
      'Integrado en Hostly, sin contratar PriceLabs ni Beyond',
      'Considera eventos, festivos y temporadas automáticamente',
      'Reglas personalizadas (mín/máx, descuentos larga estancia)',
      'Simulación de ingresos antes de aplicar',
      'Se publica a OTAs en tiempo real',
      'Trazabilidad: por qué subió o bajó el precio cada día',
    ],
    usage: [
      {
        title: 'Concierto grande en la ciudad',
        body: 'Detecta evento, sube precio en esos días y recupera ingresos que se te escaparían con precio fijo.',
      },
      {
        title: 'Semana floja en temporada baja',
        body: 'Baja precio ligeramente 72 horas antes para llenar hueco sin quemar la marca.',
      },
      {
        title: 'Hueco entre reservas',
        body: 'Ofrece descuento solo para estancias de 1-2 noches que rellenen el gap.',
      },
    ],
    relatedFeatures: ['channel-manager', 'conecta-todo'],
    faqs: [
      {
        question: '¿Sustituye a PriceLabs?',
        answer:
          'Para la mayoría de propietarios de 1-15 apartamentos, sí. Si tienes un caso muy complejo (cientos de unidades, estrategia avanzada), puedes seguir con PriceLabs y Hostly se integra.',
      },
      {
        question: '¿Puedo aprobar los precios manualmente?',
        answer:
          'Sí. Puedes elegir modo automático, modo revisión previa (te propone y tú apruebas) o modo manual con alertas.',
      },
      {
        question: '¿Cómo sabe qué hacen los competidores?',
        answer:
          'Usamos datos públicos de ocupación y rangos de precio en tu zona. No hacemos scraping agresivo ni entramos en áreas privadas de otras plataformas.',
      },
    ],
  },

  // ─────────────────────────────── MENSAJERÍA PROGRAMADA ───────────────────────────────
  {
    slug: 'mensajeria-programada',
    name: 'Mensajería programada por reserva',
    iconName: 'Send',
    shortDescription:
      'Plantillas automáticas para confirmación, check-in, media estancia y despedida. Adaptadas por apartamento e idioma.',
    hero: {
      h1: 'Mensajes útiles a cada huésped, sin escribir ninguno a mano',
      sub: 'Plantillas programadas por momento de reserva, adaptadas a apartamento, idioma y canal (WhatsApp, email u OTA).',
      primaryCta: 'Ver plantillas',
      secondaryCta: 'Probar gratis',
    },
    problem: {
      title: 'Los mensajes repetitivos se te amontonan',
      body: 'Cada reserva necesita 4-5 mensajes: confirmación, instrucciones de check-in, recordatorio, despedida, petición de review. Si tienes 3 apartamentos y 20 reservas al mes, son 80 mensajes. Escribir cada uno a mano es una pérdida clara de tiempo.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Eliges plantillas o creas las tuyas',
        body: 'Plantillas por momento (confirmación, 48 h antes de check-in, durante estancia, despedida).',
      },
      {
        step: 2,
        title: 'Programas cuándo se envía cada una',
        body: 'Al confirmar reserva, 48h antes de llegada, día de salida... Tú decides la cadencia.',
      },
      {
        step: 3,
        title: 'Hostly adapta por huésped',
        body: 'Detecta idioma del huésped, apartamento concreto y tipo de reserva. Personaliza variables automáticamente.',
      },
      {
        step: 4,
        title: 'Envía por el canal óptimo',
        body: 'WhatsApp si tienes número, email como fallback, plataforma OTA cuando no hay otra vía.',
      },
    ],
    advantages: [
      'Plantillas por momento de reserva y apartamento',
      'Detección automática de idioma',
      'Variables: nombre, apartamento, código, fechas, instrucciones',
      'Canal óptimo automático (WhatsApp, email, OTA)',
      'Historial completo por reserva',
      'Compatible con el agente IA: si responden, la IA continúa',
    ],
    usage: [
      {
        title: 'Flujo estándar de una reserva',
        body: 'Confirmación al reservar, recordatorio 48h antes con instrucciones, mensaje de bienvenida el día de entrada, despedida con petición de review.',
      },
      {
        title: 'Plantilla específica por apartamento',
        body: 'El apartamento con piscina recibe instrucciones extra de uso. El urbano recibe info de parking. Cada uno su mensaje.',
      },
      {
        title: 'Idioma del huésped',
        body: 'Reserva desde Francia → plantillas en francés. Reserva local → catalán o castellano según preferencia.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: '¿Puedo pausar un mensaje antes de que se envíe?',
        answer:
          'Sí. Tienes cola visible con lo que va a salir en las próximas horas y puedes editar o cancelar.',
      },
      {
        question: '¿Funciona sin el agente IA?',
        answer:
          'Sí. La mensajería programada funciona sola. Si además activas la IA, el huésped recibe el mensaje programado y si responde, la IA continúa.',
      },
      {
        question: '¿Cuántas plantillas puedo tener?',
        answer:
          'Ilimitadas. Puedes crear por apartamento, por idioma o por tipo de reserva.',
      },
    ],
  },

  // ─────────────────────────────── MULTI-ROL ───────────────────────────────
  {
    slug: 'multi-rol',
    name: 'Multi-rol y permisos por usuario',
    iconName: 'Users',
    shortDescription:
      'Cada persona de tu equipo ve solo lo suyo: limpiadoras, gestor, propietario. Sin enseñar datos que no tocan.',
    hero: {
      h1: 'Cada persona de tu equipo ve exactamente lo que necesita',
      sub: 'Roles para limpiadora, gestor, propietario y huésped. Permisos granulares por apartamento.',
      primaryCta: 'Ver roles',
      secondaryCta: 'Hablar con ventas',
    },
    problem: {
      title: 'Compartir datos por WhatsApp es mal negocio',
      body: 'Cuando el equipo crece necesitas dar acceso a limpiadoras, a un gestor de confianza o a propietarios. Pasar datos por WhatsApp o darles tu usuario de Airbnb no es opción. Acabas con información sensible en manos de demasiada gente.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Creas roles',
        body: 'Limpiadora, gestor, propietario externo, mantenimiento. Cada uno con sus permisos.',
      },
      {
        step: 2,
        title: 'Asignas apartamentos por rol',
        body: 'La limpiadora A ve solo los apartamentos B y C. El propietario externo ve solo los suyos.',
      },
      {
        step: 3,
        title: 'Cada persona entra con su cuenta',
        body: 'App móvil o web según el rol. Ven solo la información permitida.',
      },
    ],
    advantages: [
      'Roles predefinidos: limpiadora, gestor, propietario, huésped',
      'Permisos granulares por apartamento',
      'Registro de acciones por usuario (auditoría)',
      'Bajas y altas rápidas cuando cambia el equipo',
      'Vistas adaptadas al rol (limpiadora ve turnos, gestor ve reservas)',
      'Acceso huésped solo a su estancia',
    ],
    usage: [
      {
        title: 'Agencia con 3 propietarios externos',
        body: 'Cada propietario ve ingresos y ocupación de los suyos. No ve los del resto.',
      },
      {
        title: 'Equipo interno',
        body: 'Gestor ve todo. Limpiadora ve solo turnos. Mantenimiento ve incidencias abiertas.',
      },
      {
        title: 'Cambio de personal',
        body: 'La limpiadora deja el equipo. Desactivas su cuenta y pierde acceso en el acto.',
      },
    ],
    relatedFeatures: ['gestion-de-limpiezas', 'conecta-todo'],
    faqs: [
      {
        question: '¿Cuántos usuarios puedo dar de alta?',
        answer:
          'Depende del plan. Starter incluye un usuario propietario + 3 externos. Pro y Agency son ilimitados.',
      },
      {
        question: '¿Puedo dar acceso temporal?',
        answer:
          'Sí. Puedes crear accesos con caducidad (útil para suplencias o auditorías).',
      },
      {
        question: '¿Hay auditoría de acciones?',
        answer:
          'Sí. Cada acción queda registrada por usuario, apartamento y fecha. Útil si necesitas revisar qué pasó con una reserva.',
      },
    ],
  },

  // ─────────────────────────────── CONECTA TODO ───────────────────────────────
  {
    slug: 'conecta-todo',
    name: 'Conéctalo todo',
    iconName: 'Plug',
    shortDescription:
      'Hostly es un sistema abierto. Si hay algo en tu operativa que falta, nos lo dices y lo implementamos.',
    hero: {
      h1: 'Si lo necesitas, lo conectamos.',
      sub: 'No somos un sistema rígido. Cada gestor tiene su propia operativa y Hostly crece con ella. Dinos qué falta — lo implementamos.',
      primaryCta: 'Cuéntanos qué necesitas',
      secondaryCta: 'Ver integraciones',
    },
    problem: {
      title: 'Los sistemas cerrados te obligan a adaptarte a ellos',
      body: 'La mayoría de plataformas de gestión son rígidas. Tienen las funciones que decidieron en su hoja de ruta y punto. Si tu operativa necesita algo que no está, te toca hacerlo a mano para siempre. Hostly funciona al revés: somos nosotros los que nos adaptamos a ti.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Nos cuentas qué necesitas',
        body: 'Una integración con tu gestor fiscal, un aviso automático específico, algo que haces a mano cada semana. Escríbenos con tu caso.',
      },
      {
        step: 2,
        title: 'Lo valoramos juntos',
        body: 'En 48h te confirmamos si es viable y cuándo estaría listo. Sin costes ocultos, sin sorpresas.',
      },
      {
        step: 3,
        title: 'Lo implementamos',
        body: 'Entra en tu Hostly sin que tú toques nada. Te avisamos cuando esté activo.',
      },
      {
        step: 4,
        title: 'Funciona en segundo plano para siempre',
        body: 'Se ejecuta automáticamente cada vez que toca. Tú no tienes que hacer nada más.',
      },
    ],
    advantages: [
      'Sistema abierto — no te limita a lo que decidimos nosotros',
      'Las peticiones más pedidas se implementan primero',
      'Integraciones con gestores fiscales, ERPs y herramientas de equipo',
      'Conecta con tu web de reservas directas o cualquier canal externo',
      'Avisos personalizados a tu medida',
      'Te escuchamos — el roadmap lo construís vosotros',
    ],
    usage: [
      {
        title: 'Datos a tu gestor fiscal, automáticos',
        body: 'Cada reserva confirmada, la información va sola a donde la necesitas. Sin copiar. Sin olvidar.',
      },
      {
        title: 'Notificaciones a tu equipo como tú las quieres',
        body: 'Por WhatsApp, email o la herramienta que uses. Con los datos exactos que necesita cada persona.',
      },
      {
        title: 'Tu web de reservas directas conectada',
        body: 'Si tienes canal propio, lo sincronizamos. Calendario, precios y reservas en tiempo real.',
      },
    ],
    relatedFeatures: ['ia-whatsapp', 'gestion-de-limpiezas', 'precios-dinamicos'],
    faqs: [
      {
        question: '¿Cómo pido una integración o función nueva?',
        answer:
          'Escríbenos a hola@hostlylabs.com con tu caso concreto. Lo valoramos en 48h y te decimos si es viable y cuándo. La mayoría de peticiones no tienen coste adicional.',
      },
      {
        question: '¿Cuánto tarda en implementarse?',
        answer:
          'Depende de la complejidad. Las integraciones más habituales suelen estar listas en días. Las más específicas, entre 1 y 4 semanas. Siempre te lo confirmamos antes de empezar.',
      },
      {
        question: '¿Tiene coste adicional?',
        answer:
          'Las integraciones estándar están incluidas en tu plan. Las personalizadas las valoramos caso a caso, pero el objetivo es que todo esté incluido sin sorpresas.',
      },
    ],
  },

  // ─────────────────────────────── FINANZAS EN ORDEN ───────────────────────────────
  {
    slug: 'finanzas',
    name: 'Finanzas en orden',
    iconName: 'BarChart3',
    shortDescription:
      'Cierra el mes en minutos, no en una tarde. Ingresos por piso, comisiones automáticas, liquidaciones a propietarios y exportación para tu gestor fiscal.',
    hero: {
      h1: 'Cierra el mes en minutos, no en una tarde.',
      sub: 'Ingresos por piso, por plataforma y por periodo. Comisiones de Airbnb y Booking calculadas solas. Liquidaciones a propietarios en un clic. Todo listo para tu gestor fiscal.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver cómo funciona',
    },
    problem: {
      title: 'El cierre de mes: la parte que nadie quería',
      body: 'Abrir el Excel. Copiar las reservas de Airbnb. Descontar la comisión del 3%. Las de Booking al 15%. Sumar la taxa turística cobrada. Calcular el neto. Repetirlo por cada piso. Y si gestionas pisos de terceros, preparar la liquidación para cada propietario. Son horas de trabajo que no tendrían que existir.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Tus ingresos, al día',
        body: 'Cada reserva entra automáticamente con importe bruto, comisión de plataforma descontada y neto real que recibes. Sin copiar nada.',
      },
      {
        step: 2,
        title: 'Elige periodo, piso o plataforma',
        body: 'Filtra por apartamento, por Airbnb/Booking/canal directo o por mes. El cuadro financiero aparece en segundos.',
      },
      {
        step: 3,
        title: 'Liquidación al propietario en un clic',
        body: 'Si gestionas pisos de terceros, el informe mensual sale solo con el desglose que cada propietario necesita. El día que marques.',
      },
      {
        step: 4,
        title: 'Exporta para tu gestor fiscal',
        body: 'Un archivo con todo el año. Tu asesoría lo abre y ya tiene lo que necesita para la declaración. Sin retocarlo.',
      },
    ],
    advantages: [
      'Comisiones de Airbnb y Booking calculadas automáticamente',
      'Taxa turística recaudada y trazada por reserva',
      'P&L por apartamento, por plataforma y por periodo',
      'Liquidaciones mensuales a propietarios automatizadas',
      'Exportación compatible con tu gestoría (Excel y CSV)',
      'Comparativa mensual y anual de ingresos',
    ],
    usage: [
      {
        title: 'Saber cuánto ganaste en agosto en 10 segundos',
        body: 'Sin sumar nada. Filtras agosto, ves el total por piso y por plataforma. Cuánto cobró Airbnb, cuánto Booking, cuánto tú.',
      },
      {
        title: 'Enviar el cierre mensual a tus propietarios',
        body: 'Cada propietario recibe su liquidación detallada automáticamente. Ingresos, tu comisión de gestión, gastos y neto. Sin que tú lo prepares.',
      },
      {
        title: 'Preparar la declaración de la renta',
        body: 'Todo el año en un archivo. Tu gestor lo abre y ya sabe lo que necesita. Sin emails de "¿me puedes pasar los datos de los pisos?".',
      },
    ],
    relatedFeatures: ['channel-manager', 'check-in-online', 'conecta-todo'],
    faqs: [
      {
        question: '¿Calcula automáticamente las comisiones de Airbnb y Booking?',
        answer:
          'Sí. La comisión de Airbnb (~3%) y la de Booking (~15%) se aplican automáticamente según el canal de cada reserva. El neto que ves es lo que realmente cobras, sin tener que calcularlo tú.',
      },
      {
        question: '¿Puedo generar liquidaciones para propietarios de pisos que gestiono?',
        answer:
          'Sí. Configuras el porcentaje de gestión por propiedad y el informe mensual de cada propietario sale automáticamente el día que marcas. Con el desglose de ingresos, tu comisión y el neto que les corresponde.',
      },
      {
        question: '¿El formato de exportación es compatible con asesorías?',
        answer:
          'Sí. Exportamos en Excel y CSV con el desglose estándar que piden la mayoría de gestorías. Si la tuya necesita un formato específico, nos lo dices y lo adaptamos.',
      },
    ],
  },

  // ─────────────────────────────── SIN BUROCRACIA ───────────────────────────────
  {
    slug: 'burocracia',
    name: 'Sin burocracia',
    iconName: 'ClipboardCheck',
    shortDescription:
      'NRUA, taxa turística, declaración de la renta, impuestos municipales y todo lo que la administración te pide. Hostly te avisa, te prepara los datos y te guía paso a paso.',
    hero: {
      h1: 'La burocracia del piso turístico, resuelta.',
      sub: 'Los únicos en España que cubrimos toda la burocracia del alquiler turístico — no solo el registro policial. NRUA, taxa turística, declaración de la renta, impuestos municipales. Hostly te avisa, te prepara los datos y te guía paso a paso.',
      primaryCta: 'Empezar',
      secondaryCta: 'Ver el calendario fiscal',
    },
    problem: {
      title: 'Cada trimestre, una sorpresa nueva',
      body: 'El registro NRUA que se te había pasado. La taxa turística que venció ayer. El IRPF de los rendimientos del alquiler que no sabes cómo calcular. El número de inscripción que pide la CCAA. Cada administración te pide algo distinto, en formatos distintos, y nadie te lo explica claro. La mayoría de gestores se enteran cuando llega la sanción.',
    },
    howItWorks: [
      {
        step: 1,
        title: 'Calendario fiscal personalizado por CCAA',
        body: 'Hostly sabe qué impuestos y plazos te aplican según tu comunidad autónoma, el tipo de propiedad y tus ingresos. Ves todos los vencimientos del año en una sola vista.',
      },
      {
        step: 2,
        title: 'Avisos antes del vencimiento — no después',
        body: '15 días antes del plazo te avisamos para que prepares lo que haga falta. 24h antes, te avisamos otra vez. Nunca llegas tarde a una presentación.',
      },
      {
        step: 3,
        title: 'Datos preparados, no en bruto',
        body: 'Generamos el informe o el archivo en el formato que pide cada administración — con los datos del periodo correspondiente, listos para presentar.',
      },
      {
        step: 4,
        title: 'Paso a paso o automático',
        body: 'Lo que se puede presentar automáticamente, lo presentamos. Lo que requiere tu firma o tu gestor, te guiamos paso a paso por el portal correspondiente.',
      },
    ],
    advantages: [
      'Calendario fiscal específico por CCAA (Cataluña, Baleares, Madrid, Andalucía…)',
      'Avisos antes del vencimiento — no después',
      'Datos para tu gestor preparados sin retoques',
      'Guías paso a paso para portales de ayuntamientos y administraciones',
      'Rendimientos para IRPF calculados y agrupados por año',
      'Cobertura única en España: no solo el registro policial, también la fiscalidad',
    ],
    usage: [
      {
        title: 'Presentar la taxa turística trimestral',
        body: 'Hostly genera el informe con todos los pernoctas del trimestre. Te explica qué clicar en el portal del ayuntamiento y en qué campo va cada dato. En 5 minutos, presentada.',
      },
      {
        title: 'Preparar la declaración de la renta',
        body: 'Todos los rendimientos del alquiler turístico del año, en un archivo organizado. Tu gestoría lo abre y tiene lo que necesita — sin hacerte preguntas, sin retoques.',
      },
      {
        title: 'Inscripción al NRUA por primera vez',
        body: 'Si nunca has registrado tu propiedad en el NRUA (Andalucía), te guiamos por el formulario. Te decimos qué documentos preparar y dónde encontrar cada dato.',
      },
    ],
    relatedFeatures: ['check-in-online', 'finanzas', 'conecta-todo'],
    faqs: [
      {
        question: '¿Hostly presenta directamente mi declaración de la renta?',
        answer:
          'No la presentamos directamente porque cada caso fiscal es distinto. Lo que hacemos es prepararte TODOS los datos del año en un archivo claro y ordenado que tu gestoría abre y procesa sin retoques. Solo eso ya ahorra horas de trabajo cada año.',
      },
      {
        question: '¿Cubrís la fiscalidad de todas las comunidades autónomas?',
        answer:
          'Sí. El calendario fiscal es específico por cada CCAA. Si gestionas pisos en Cataluña, Aragón, Baleares, Madrid, Andalucía o cualquier otra, Hostly conoce los requerimientos y plazos de cada lugar. Si la administración cambia algo, lo actualizamos nosotros.',
      },
      {
        question: '¿Qué diferencia hay con el check-in y el registro policial?',
        answer:
          'El check-in se ocupa de lo que pasa en cada reserva: registro policial, taxa cobrada al huésped, comunicación a las autoridades. La burocracia se ocupa de lo que pasa cada trimestre o cada año: presentaciones fiscales, inscripciones, declaración de la renta, impuestos municipales. Son dos capas distintas que Hostly cubre por separado.',
      },
    ],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return FEATURES.find((f) => f.slug === slug);
}
