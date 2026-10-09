export type NavDropdownItem = {
  label: string;
  href: string;
  description?: string;
  badge?: string;
};

export type NavDropdownGroup = {
  groupLabel: string;
  items: NavDropdownItem[];
  footerHref?: string;
  footerLabel?: string;
};

export type NavMainItem =
  | { label: string; href: string; dropdown?: never; groups?: never }
  | { label: string; href?: string; dropdown: NavDropdownItem[]; groups?: never }
  | { label: string; href?: string; dropdown?: never; groups: NavDropdownGroup[] };

export type NavConfig = {
  main: NavMainItem[];
  ctas: {
    secondary: { label: string; href: string };
    primary: { label: string };
  };
};

export const NAV: NavConfig = {
  main: [
    {
      label: 'Funcionalidades',
      href: '/funcionalidades',
      dropdown: [
        { label: 'IA en WhatsApp',         href: '/funcionalidades/ia-whatsapp',           description: 'Contesta a tus huéspedes al momento, 24/7.' },
        { label: 'Check-in online',        href: '/funcionalidades/check-in-online',       description: 'Datos del huésped y registro a la policía.', badge: 'Gratis' },
        { label: 'Reservas y calendarios', href: '/funcionalidades/channel-manager',       description: 'Airbnb y Booking en un solo calendario.' },
        { label: 'Precios dinámicos',      href: '/funcionalidades/precios-dinamicos',     description: 'Recomendados por PriceLabs, publicados cada día.' },
        { label: 'Gestión de limpiezas',   href: '/funcionalidades/gestion-de-limpiezas',  description: 'Cada salida crea su limpieza y avisa al equipo.' },
        { label: 'Mensajería programada',  href: '/funcionalidades/mensajeria-programada', description: 'Mensajes automáticos en el idioma del huésped.' },
        { label: 'Roles y permisos',       href: '/funcionalidades/multi-rol',             description: 'Gestor, limpieza y propietario, cada uno lo suyo.' },
        { label: 'Finanzas en orden',      href: '/funcionalidades/finanzas',              description: 'Ingresos, comisiones y liquidaciones a propietarios.' },
        { label: 'Tasa turística',         href: '/funcionalidades/burocracia',            description: 'La de Cataluña, calculada y lista para presentar.' },
        { label: 'Conéctalo todo',         href: '/funcionalidades/conecta-todo',          description: 'Automatizaciones a medida, con cuota mensual.' },
      ],
    },
    {
      label: 'Para quién',
      dropdown: [
        { label: 'Propietarios',       href: '/propietarios',       description: '1-3 pisos sin que te consuman el día.' },
        { label: 'Gestores pequeños',  href: '/gestores-pequenos',  description: '5-15 pisos. Una app, una factura.' },
        { label: 'Segunda residencia', href: '/segunda-residencia', description: 'Que el verano vuelva a ser verano.' },
      ],
    },
    {
      label: 'Recursos',
      groups: [
        {
          groupLabel: 'Guías y compliance',
          footerHref: '/blog',
          footerLabel: 'Ver todas las guías',
          items: [
            { label: 'Super Guía de gestión',        href: '/guia',                                            description: 'La guía completa del propietario turístico.', badge: 'Nuevo' },
            { label: 'SES.Hospedajes: guía 2026',    href: '/blog/ses-hospedajes-guia-completa-2026',          description: 'Todo sobre el registro obligatorio de viajeros.' },
            { label: 'SES + NRUA + tasa turística',  href: '/blog/ses-nrua-taxa-turistica-guia',               description: 'Las 3 obligaciones legales del propietario.' },
            { label: 'Mossos d\'Esquadra: registro', href: '/blog/registro-viajeros-mossos-esquadra-cataluna',  description: 'Guía práctica para Cataluña.' },
            { label: 'Sanciones por no registrar',   href: '/blog/sanciones-por-no-cumplir-registro-viajeros', description: 'Cuánto te puede costar no cumplir.' },
            { label: 'Guía: piso heredado en Airbnb',href: '/hereus',                                          description: 'Heredaste un piso. Ponlo a trabajar.' },
          ],
        },
        {
          groupLabel: 'Gestión y herramientas',
          footerHref: '/blog',
          footerLabel: 'Ver todas las guías',
          items: [
            { label: 'Las 5 horas que te come un piso',  href: '/blog/5-horas-semana-recuperar-apartamento-turistico', description: 'Dónde va el tiempo y cómo recuperarlo.' },
            { label: 'Automatizar con IA: qué funciona', href: '/blog/automatizar-alquiler-vacacional-con-ia',          description: 'Guía honesta de lo que hace y no hace la IA.' },
            { label: 'De 3 a 10 pisos sin colapsar',     href: '/blog/pasar-3-a-10-apartamentos-sin-colapsar',         description: 'Qué sistemas necesitas antes de crecer.' },
            { label: '¿Cuánto cuesta gestionar un piso?',href: '/blog/cuanto-cuesta-gestionar-piso-turistico',          description: 'Calcula el coste real de tu stack.' },
            { label: 'El stack del propietario en 2026', href: '/blog/stack-completo-propietario-airbnb',               description: 'Qué herramientas necesitas y cuáles eliminar.' },
            { label: 'Responder mensajes en Airbnb',     href: '/blog/responder-mensajes-airbnb-automaticamente',       description: 'Sin convertirte en un bot.' },
          ],
        },
        {
          groupLabel: 'Alternativas y comparativas',
          footerHref: '/alternativas',
          footerLabel: 'Ver todas las alternativas',
          items: [
            { label: 'Hostly vs Chekin',     href: '/comparativa/chekin',      description: 'Check-in gratis vs pagar por cada entrada.' },
            { label: 'Hostly vs Icnea',      href: '/alternativas/icnea',      description: 'La opción ibérica vs el veterano.' },
            { label: 'Hostly vs Hostify',    href: '/alternativas/hostify',    description: 'El rival #1 en España.' },
            { label: 'Hostly vs Smoobu',     href: '/alternativas/smoobu',     description: 'App simple vs alternativa con IA.' },
            { label: 'Hostly vs Guesty',     href: '/alternativas/guesty',     description: 'El gigante global vs la app para España.' },
            { label: 'Hostly vs Avantio',    href: '/alternativas/avantio',    description: 'El PMS veterano vs el sistema moderno.' },
          ],
        },
      ],
    },
    { label: 'Precios', href: '/precios' },
  ],

  ctas: {
    secondary: { label: 'Perfil cliente', href: 'https://app.hostlylabs.com' },
    primary:   { label: 'Empezar' },
  },
};
