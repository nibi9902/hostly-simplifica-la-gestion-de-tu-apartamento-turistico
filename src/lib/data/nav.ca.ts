import type { NavConfig } from './nav';

export const NAV_CA: NavConfig = {
  main: [
    {
      label: 'Funcionalitats',
      href: '/funcionalidades',
      dropdown: [
        { label: 'IA a WhatsApp',          href: '/funcionalidades/ia-whatsapp',           description: 'Respon als hostes en segons, 24/7.' },
        { label: 'Check-in online',        href: '/funcionalidades/check-in-online',       description: 'Registre digital i enviament automàtic a SES.', badge: 'Gratis' },
        { label: 'Channel manager',        href: '/funcionalidades/channel-manager',       description: 'Sincronitza Airbnb, Booking i més en temps real.' },
        { label: 'Preus dinàmics',         href: '/funcionalidades/precios-dinamicos',     description: 'Optimitza ingressos amb tarifes intel·ligents.' },
        { label: 'Gestió de neteges',      href: '/funcionalidades/gestion-de-limpiezas',  description: 'Coordina l\'equip amb avisos automàtics.' },
        { label: 'Missatgeria programada', href: '/funcionalidades/mensajeria-programada', description: 'Automatitza la comunicació amb els teus hostes.' },
        { label: 'Multi-rol i permisos',   href: '/funcionalidades/multi-rol',             description: 'Propietari, gestor i neteja, cadascú el seu.' },
        { label: 'Finances en ordre',      href: '/funcionalidades/finanzas',              description: 'Tanca el mes en minuts. Liquidacions automàtiques.' },
        { label: 'Sense burocràcia',       href: '/funcionalidades/burocracia',            description: 'NRUA, taxa turística, IRPF i més — guiats pas a pas.' },
        { label: 'Connecta-ho tot',        href: '/funcionalidades/conecta-todo',          description: 'Sistema obert. Demana\'ns el que necessitis.' },
      ],
    },
    {
      label: 'Per a qui',
      dropdown: [
        { label: 'Propietaris',         href: '/propietarios',       description: '1-3 pisos sense que et consumeixin el dia.' },
        { label: 'Gestors petits',      href: '/gestores-pequenos',  description: '5-15 pisos. Una app, una factura.' },
        { label: 'Segona residència',   href: '/segunda-residencia', description: 'Que l\'estiu torni a ser estiu.' },
      ],
    },
    {
      label: 'Recursos',
      groups: [
        {
          groupLabel: 'Guies i compliance',
          footerHref: '/blog',
          footerLabel: 'Veure totes les guies',
          items: [
            { label: 'Súper Guia de gestió',         href: '/guia',                                            description: 'La guia completa del propietari turístic.', badge: 'Nou' },
            { label: 'SES.Hospedajes: guia 2026',    href: '/blog/ses-hospedajes-guia-completa-2026',          description: 'Tot sobre el registre obligatori de viatgers.' },
            { label: 'SES + NRUA + taxa turística',  href: '/blog/ses-nrua-taxa-turistica-guia',               description: 'Les 3 obligacions legals del propietari.' },
            { label: 'Mossos d\'Esquadra: registre', href: '/blog/registro-viajeros-mossos-esquadra-cataluna', description: 'Guia pràctica per a Catalunya.' },
            { label: 'Sancions per no registrar',    href: '/blog/sanciones-por-no-cumplir-registro-viajeros', description: 'Quant et pot costar no complir.' },
            { label: 'Guia: pis heretat a Airbnb',   href: '/hereus',                                          description: 'Has heretat un pis. Posa\'l a treballar.' },
          ],
        },
        {
          groupLabel: 'Gestió i eines',
          footerHref: '/blog',
          footerLabel: 'Veure totes les guies',
          items: [
            { label: 'Les 5 hores que et menja un pis',  href: '/blog/5-horas-semana-recuperar-apartamento-turistico', description: 'On va el temps i com recuperar-lo.' },
            { label: 'Automatitzar amb IA: què funciona', href: '/blog/automatizar-alquiler-vacacional-con-ia',         description: 'Guia honesta del que fa i no fa la IA.' },
            { label: 'De 3 a 10 pisos sense col·lapsar',  href: '/blog/pasar-3-a-10-apartamentos-sin-colapsar',         description: 'Quins sistemes necessites abans de créixer.' },
            { label: 'Quant costa gestionar un pis?',     href: '/blog/cuanto-cuesta-gestionar-piso-turistico',         description: 'Calcula el cost real del teu stack.' },
            { label: 'L\'stack del propietari el 2026',   href: '/blog/stack-completo-propietario-airbnb',              description: 'Quines eines necessites i quines eliminar.' },
            { label: 'Respondre missatges a Airbnb',      href: '/blog/responder-mensajes-airbnb-automaticamente',      description: 'Sense convertir-te en un bot.' },
          ],
        },
        {
          groupLabel: 'Alternatives i comparatives',
          footerHref: '/alternativas',
          footerLabel: 'Veure totes les alternatives',
          items: [
            { label: 'Hostly vs Chekin',  href: '/comparativa/chekin',   description: 'Check-in gratis vs pagar per cada entrada.' },
            { label: 'Hostly vs Icnea',   href: '/alternativas/icnea',   description: 'L\'opció ibèrica vs el veterà.' },
            { label: 'Hostly vs Hostify', href: '/alternativas/hostify', description: 'El rival #1 a Espanya.' },
            { label: 'Hostly vs Smoobu',  href: '/alternativas/smoobu',  description: 'App simple vs alternativa amb IA.' },
            { label: 'Hostly vs Guesty',  href: '/alternativas/guesty',  description: 'El gegant global vs l\'app per a Espanya.' },
            { label: 'Hostly vs Avantio', href: '/alternativas/avantio', description: 'El PMS veterà vs el sistema modern.' },
          ],
        },
      ],
    },
    { label: 'Preus', href: '/precios' },
  ],

  ctas: {
    secondary: { label: 'Perfil client', href: 'https://app.hostlylabs.com' },
    primary:   { label: 'Començar' },
  },
};
