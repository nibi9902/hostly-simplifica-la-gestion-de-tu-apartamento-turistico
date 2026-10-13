import type { NavConfig } from './nav';

export const NAV_CA: NavConfig = {
  main: [
    {
      label: 'Funcionalitats',
      href: '/funcionalidades',
      dropdown: [
        { label: 'IA a WhatsApp',          href: '/funcionalidades/ia-whatsapp',           description: 'Contesta els teus hostes al moment, 24/7.', icon: 'MessageCircle', grup: 'Hostes' },
        { label: 'Check-in online',        href: '/funcionalidades/check-in-online',       description: 'Dades de l\'hoste i registre a la policia.', badge: 'Gratis', icon: 'ShieldCheck', grup: 'Hostes' },
        { label: 'Reserves i calendaris',  href: '/funcionalidades/channel-manager',       description: 'Airbnb i Booking en un sol calendari.', icon: 'Calendar', grup: 'Reserves i preus' },
        { label: 'Preus dinàmics',         href: '/funcionalidades/precios-dinamicos',     description: "S'ajusten a la demanda i es publiquen cada dia.", icon: 'TrendingUp', grup: 'Reserves i preus' },
        { label: 'Gestió de neteges',      href: '/funcionalidades/gestion-de-limpiezas',  description: 'Cada sortida crea la seva neteja i avisa l\'equip.', icon: 'Sparkles', grup: 'Equip i comptes' },
        { label: 'Missatgeria programada', href: '/funcionalidades/mensajeria-programada', description: 'Missatges automàtics en l\'idioma de l\'hoste.', icon: 'Send', grup: 'Hostes' },
        { label: 'Rols i permisos',        href: '/funcionalidades/multi-rol',             description: 'Gestor, neteja i propietari, cadascú el seu.', icon: 'Users', grup: 'Equip i comptes' },
        { label: 'Finances en ordre',      href: '/funcionalidades/finanzas',              description: 'Ingressos, comissions i liquidacions a propietaris.', icon: 'BarChart3', grup: 'Equip i comptes' },
        { label: 'Taxa turística',         href: '/funcionalidades/burocracia',            description: 'Calculada i a punt per presentar.', icon: 'Receipt', grup: 'Reserves i preus' },
        { label: 'Connecta-ho tot',        href: '/funcionalidades/conecta-todo',          description: 'Automatitzacions a mida, amb quota mensual.', icon: 'Plug', grup: 'Equip i comptes' },
      ],
    },
    {
      label: 'Per a qui',
      dropdown: [
        { label: 'Propietaris',         href: '/propietarios',       description: '1-3 pisos sense que et consumeixin el dia.', icon: 'Home' },
        { label: 'Gestors petits',      href: '/gestores-pequenos',  description: '5-15 pisos. Una app, una factura.', icon: 'Building2' },
        { label: 'Segona residència',   href: '/segunda-residencia', description: 'Que l\'estiu torni a ser estiu.', icon: 'Sun' },
        { label: 'Pisos heretats',      href: '/hereus',             description: 'L\'has heretat i no el vols vendre.', icon: 'KeyRound' },
      ],
    },
    {
      label: 'Recursos',
      groups: [
        {
          groupLabel: 'Guies i obligacions',
          footerHref: '/blog',
          footerLabel: 'Veure totes les guies',
          items: [
            { label: 'Súper Guia de gestió',         href: '/guia',                                            description: 'La guia completa del propietari turístic.', badge: 'Nou' },
            { label: 'SES.Hospedajes: guia 2026',    href: '/blog/ses-hospedajes-guia-completa-2026',          description: 'Tot sobre el registre obligatori de viatgers.' },
            { label: 'SES + NRUA + taxa turística',  href: '/blog/ses-nrua-taxa-turistica-guia',               description: 'Les 3 obligacions legals del propietari.' },
            { label: "Si l'hoste no fa el check-in", href: '/blog/huesped-no-responde-checkin-online', description: 'Què fer, pas a pas.' },
            { label: 'Sancions per no registrar',    href: '/blog/sanciones-por-no-cumplir-registro-viajeros', description: 'Quant et pot costar no complir.' },
          ],
        },
        {
          groupLabel: 'Gestió i eines',
          items: [
            { label: 'Les 5 hores que et menja un pis',  href: '/blog/5-horas-semana-recuperar-apartamento-turistico', description: 'On va el temps i com recuperar-lo.' },
            { label: 'Automatitzar amb IA: què funciona', href: '/blog/automatizar-alquiler-vacacional-con-ia',         description: 'Guia honesta del que fa i no fa la IA.' },
            { label: 'De 3 a 10 pisos sense col·lapsar',  href: '/blog/pasar-3-a-10-apartamentos-sin-colapsar',         description: 'Quins sistemes necessites abans de créixer.' },
            { label: 'Quant costa gestionar un pis?',     href: '/blog/cuanto-cuesta-gestionar-piso-turistico',         description: 'Calcula el cost real del teu stack.' },
            { label: 'Les eines del propietari el 2026',   href: '/blog/stack-completo-propietario-airbnb',              description: 'Quines eines necessites i quines eliminar.' },
            { label: 'Respondre missatges a Airbnb',      href: '/blog/responder-mensajes-airbnb-automaticamente',      description: 'Sense convertir-te en un bot.' },
          ],
        },
        {
          groupLabel: 'Alternatives i comparatives',
          footerHref: '/alternativas',
          footerLabel: 'Veure totes les alternatives',
          items: [
            { label: 'Hostly vs Chekin',  href: '/comparativa/chekin',   description: 'Check-in gratis vs pagar per cada entrada.' },
            { label: 'Hostly vs Icnea',   href: '/alternativas/icnea',   description: 'Preu per pis vs quota fixa per trams.' },
            { label: 'Hostly vs Hostify', href: '/alternativas/hostify', description: 'Des de 5 unitats vs des d\'1 pis.' },
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
