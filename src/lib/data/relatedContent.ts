// Mapa bidireccional: funcions → articles relacionats i articles → funcions relacionades.
// Usar per afegir "Recursos relacionados" a pàgines de funcions
// i "Ver la función" a articles del blog.

export interface RelatedArticle {
  slug: string;
  title: string;
}

export interface RelatedFeature {
  path: string;
  label: string;
  /** El mateix enllaç a /ca: els articles són en castellà, però la capsa de sota és de la web catalana */
  labelCa: string;
}

export const featureToArticles: Record<string, RelatedArticle[]> = {
  "check-in": [
    { slug: "ses-hospedajes-guia-completa-2026",          title: "SES.Hospedajes: guía completa 2026" },
    { slug: "checkin-digital-comparativa-espana",         title: "Check-in digital: comparativa España" },
    { slug: "sanciones-por-no-cumplir-registro-viajeros", title: "Sanciones por no cumplir el registro" },
  ],
  "mensajes": [
    { slug: "responder-mensajes-airbnb-automaticamente",  title: "Responder mensajes de Airbnb automáticamente" },
    { slug: "whatsapp-business-alquiler-vacacional",      title: "WhatsApp Business para alquiler vacacional" },
    { slug: "automatizar-alquiler-vacacional-con-ia",     title: "Automatizar el alquiler vacacional con IA" },
  ],
  "reservas": [
    { slug: "precios-dinamicos-airbnb-booking",           title: "Precios dinámicos en Airbnb y Booking" },
    { slug: "channel-manager-alquiler-vacacional-guia",   title: "Guía de channel managers" },
    { slug: "hostify-vs-lodgify-vs-smoobu-comparativa",   title: "Hostify vs Lodgify vs Smoobu" },
  ],
  "limpiezas": [
    { slug: "coordinacion-limpiezas-excel-sistema",       title: "Coordinación de limpiezas: Excel vs sistema" },
    { slug: "5-horas-semana-recuperar-apartamento-turistico", title: "Recuperar 5 horas semanales" },
    { slug: "pasar-3-a-10-apartamentos-sin-colapsar",     title: "Pasar de 3 a 10 apartamentos sin colapsar" },
  ],
  "pagos": [
    { slug: "cuanto-cuesta-gestionar-piso-turistico",     title: "¿Cuánto cuesta gestionar un piso turístico?" },
    { slug: "gestor-pequeno-5-apps-una-app",              title: "Gestor pequeño: de 5 apps a una" },
    { slug: "stack-completo-propietario-airbnb",          title: "Stack completo para propietario Airbnb" },
  ],
  "precios": [
    { slug: "precios-dinamicos-airbnb-booking",           title: "Precios dinámicos en Airbnb y Booking" },
    { slug: "cuanto-cuesta-gestionar-piso-turistico",     title: "¿Cuánto cuesta gestionar un piso turístico?" },
    { slug: "pms-apartamentos-turisticos-mejores-2026",   title: "Mejores PMS para apartamentos 2026" },
  ],
};

// Articles → funcions (per ArticleLayout)
export const articleToFeature: Record<string, RelatedFeature> = {
  "ses-hospedajes-guia-completa-2026":             { path: "/funcionalidades/check-in-online",  label: "Ver el check-in online", labelCa: "Veure el check-in online" },
  "ses-hospedajes-un-solo-apartamento":            { path: "/funcionalidades/check-in-online",  label: "Ver el check-in online", labelCa: "Veure el check-in online" },
  "ses-nrua-taxa-turistica-guia":                  { path: "/funcionalidades/burocracia",  label: "Ver la tasa turística en Hostly", labelCa: "Veure la taxa turística a Hostly" },
  "sanciones-por-no-cumplir-registro-viajeros":    { path: "/funcionalidades/check-in-online",  label: "Ver el check-in y el registro a la policía", labelCa: "Veure el check-in i el registre a la policia" },
  "registro-viajeros-mossos-esquadra-cataluna":    { path: "/funcionalidades/check-in-online",  label: "Ver el check-in y el registro a la policía", labelCa: "Veure el check-in i el registre a la policia" },
  "checkin-digital-comparativa-espana":            { path: "/funcionalidades/check-in-online",  label: "Ver el check-in online", labelCa: "Veure el check-in online" },
  "responder-mensajes-airbnb-automaticamente":     { path: "/funcionalidades/ia-whatsapp",  label: "Ver los mensajes con IA", labelCa: "Veure els missatges amb IA" },
  "whatsapp-business-alquiler-vacacional":         { path: "/funcionalidades/ia-whatsapp",  label: "Ver los mensajes con IA", labelCa: "Veure els missatges amb IA" },
  "automatizar-alquiler-vacacional-con-ia":        { path: "/funcionalidades/ia-whatsapp",  label: "Ver los mensajes con IA", labelCa: "Veure els missatges amb IA" },
  "precios-dinamicos-airbnb-booking":              { path: "/funcionalidades/precios-dinamicos",   label: "Ver los precios dinámicos", labelCa: "Veure els preus dinàmics" },
  "channel-manager-alquiler-vacacional-guia":      { path: "/funcionalidades/channel-manager",  label: "Ver el channel manager", labelCa: "Veure el channel manager" },
  "hostify-vs-lodgify-vs-smoobu-comparativa":      { path: "/alternativas",        label: "Ver comparativa completa", labelCa: "Veure la comparativa sencera" },
  "coordinacion-limpiezas-excel-sistema":          { path: "/funcionalidades/gestion-de-limpiezas", label: "Ver las limpiezas", labelCa: "Veure les neteges" },
  "5-horas-semana-recuperar-apartamento-turistico":{ path: "/funcionalidades/gestion-de-limpiezas", label: "Ver las limpiezas", labelCa: "Veure les neteges" },
  "pasar-3-a-10-apartamentos-sin-colapsar":        { path: "/funcionalidades/gestion-de-limpiezas", label: "Ver las limpiezas", labelCa: "Veure les neteges" },
  "cuanto-cuesta-gestionar-piso-turistico":        { path: "/funcionalidades/finanzas",     label: "Ver las finanzas", labelCa: "Veure les finances" },
  "gestor-pequeno-5-apps-una-app":                 { path: "/precios",                    label: "Ver qué incluye Hostly", labelCa: "Veure què inclou Hostly" },
  "stack-completo-propietario-airbnb":             { path: "/precios",                    label: "Ver qué incluye Hostly", labelCa: "Veure què inclou Hostly" },
  "pms-apartamentos-turisticos-mejores-2026":      { path: "/alternativas",        label: "Ver comparativa de PMS", labelCa: "Veure la comparativa de PMS" },
};
