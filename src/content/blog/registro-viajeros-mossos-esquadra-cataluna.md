---
title: "Cómo registrar a los viajeros en Mossos d'Esquadra (Cataluña)"
description: "Guía práctica del registro de viajeros en Mossos d'Esquadra para apartamentos turísticos en Cataluña: qué datos, plazos, diferencias con SES y cómo automatizarlo."
slug: "registro-viajeros-mossos-esquadra-cataluna"
category: "ses-hospedajes-y-compliance"
author: "biel-alsina"
publishedAt: "2026-04-19"
keywords:
  - "mossos d'esquadra registre viatgers"
  - "registre viatgers Mossos"
  - "ses hospedajes mossos"
  - "registro viajeros cataluña"
  - "apartamento turístico cataluña"
relatedSlugs:
  - "ses-hospedajes-guia-completa-2026"
  - "ses-hospedajes-un-solo-apartamento"
  - "sanciones-por-no-cumplir-registro-viajeros"
faqs:
  - question: "¿Si envío a Mossos también tengo que enviar a SES.Hospedajes?"
    answer: "No. Los apartamentos en Cataluña cumplen enviando a Mossos d'Esquadra. SES.Hospedajes no aplica si ya has registrado al huésped en el sistema de Mossos."
  - question: "¿Qué pasa si tengo apartamentos en Cataluña y en Madrid?"
    answer: "Necesitas cubrir ambos canales: los de Cataluña van a Mossos y los de Madrid, a SES.Hospedajes. Con Hostly, el envío a los Mossos es automático, y la conexión con SES.Hospedajes para los pisos de Madrid la activamos contigo."
  - question: "¿El plazo para enviar a Mossos es el mismo que SES?"
    answer: "Sí, 24 horas desde el check-in del huésped. Mossos aplica el mismo criterio temporal que el Real Decreto 933/2021."
---

Si gestionas apartamentos turísticos en Cataluña, el registro de viajeros **no se envía a SES.Hospedajes** sino al sistema propio de los Mossos d'Esquadra. Es una de las confusiones más habituales. Esta guía aclara **qué hacer, cómo hacerlo y cómo automatizarlo** sin tocarlo cada día.

## Por qué Cataluña usa Mossos y no SES

España tiene cuerpos policiales estatales y autonómicos con competencias propias: Policía Nacional y Guardia Civil a nivel estatal, Mossos d'Esquadra en Cataluña y Ertzaintza en Euskadi. El Real Decreto 933/2021 obliga a registrar huéspedes en España, pero deja que las **comunidades con policía propia mantengan su sistema**.

En Cataluña, el sistema se llama **"Registre de Viatgers"** y lo gestionan los Mossos. Cumple la misma función que SES.Hospedajes pero es su propio canal.

## Qué datos hay que enviar

Los datos son prácticamente los mismos que SES, con alguna adaptación local:

- Nombre completo y apellidos
- Sexo, fecha de nacimiento, nacionalidad
- Documento de identidad (tipo, número, fecha de expedición)
- Dirección, teléfono, email
- Fechas de entrada y salida
- Número de habitación / referencia del apartamento
- Relación con acompañantes menores

Los menores de 14 años no se registran individualmente.

## Plazo y formato

El plazo es **24 horas desde el check-in**. Mismo criterio que SES.

El envío se hace vía web oficial o por API si tu PMS tiene integración. Hostly lo hace automáticamente; otras herramientas lo resuelven con integraciones propias o de terceros: pregunta antes de contratar.

## Alta: qué necesitas

Para poder enviar datos a Mossos:

1. **Tener licencia turística** (HUT — Habitatge d'Ús Turístic) emitida por la Generalitat.
2. **Certificado digital** o IdCAT Mòbil para acceder al portal.
3. **Número identificador del establecimiento** (asignado al darte de alta en turisme de Catalunya).
4. **Alta en el sistema de registro de viajeros** de Mossos.

El alta suele tardar entre 48 y 72 horas.

## Diferencias prácticas con SES

| | Mossos | SES.Hospedajes |
|---|---|---|
| Territorio | Cataluña | Resto de España (salvo Euskadi) |
| Organismo | Mossos d'Esquadra | Ministerio del Interior |
| Acceso | Portal Generalitat | sede.mir.gob.es |
| API pública | Sí, para PMS | Sí, para PMS |
| Plazo | 24 h desde el check-in | 24 h desde el check-in |
| Datos | Mismos que SES | Mismos que Mossos |

## Si tienes apartamentos en varias comunidades

Si gestionas apartamentos en Cataluña y fuera (Baleares, Madrid, Valencia, Andalucía…), necesitas:

- **Enviar a Mossos** los que están en Cataluña.
- **Enviar a SES** los del resto del Estado.
- **Enviar a Ertzaintza** si tienes en Euskadi.

Hacerlo a mano acaba, tarde o temprano, en un error. Lo práctico es dejar configurado desde el alta a qué sistema envía cada piso. En Hostly, los pisos de Cataluña envían a los Mossos de forma automática; para los del resto de España, activamos contigo la conexión con la policía que toque.

## Cómo automatizarlo completamente

El flujo óptimo:

1. El huésped reserva en Airbnb/Booking.
2. Recibe por WhatsApp o por el chat de la plataforma un enlace para hacer check-in online antes de llegar.
3. Rellena sus datos desde el móvil y cada campo se valida antes de enviarlo.
4. El PMS prepara el fichero con los datos de cada huésped.
5. Lo envía a los Mossos cada día y guarda el comprobante.
6. Tú ves en el panel "Registrado ✓" sin haber hecho nada. Si algo falla, te avisa.

Es lo que hace Hostly con los pisos de Cataluña, de forma nativa. Otras herramientas lo resuelven con una integración propia o a través de partners: antes de elegir, comprueba que la tuya cubre Mossos y no solo SES.

## Resumen

Si tus apartamentos están en Cataluña:

- **No envíes a SES**, envía a Mossos.
- **Plazo**: 24 h desde el check-in.
- **Datos**: los mismos 14 que SES.
- **Automatización**: imprescindible si gestionas más de un apartamento.

La decisión práctica es elegir un PMS que cubra Mossos nativamente, no como plugin de terceros. Así no tienes que acordarte de enviar el registro.
