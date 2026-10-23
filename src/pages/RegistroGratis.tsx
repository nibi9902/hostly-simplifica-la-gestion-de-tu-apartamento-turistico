/**
 * La landing dels anuncis del registre de viatgers gratis (/registro-de-viajeros-gratis).
 *
 * 15-10-2026: la porta dels anuncis («El registro de viajeros. Gratis.»), feta primer per al mòbil i amb
 * una sola cosa a fer: sense menú ni enllaços cap a fora (només els legals, al peu).
 * 18-10-2026: ara hi ha el vídeo de la funció (29 s), que es veu deixant el nom, el telèfon i els pisos.
 * És la B del llenç «Landings dels anuncis» amb el subtítol de la A, com va demanar el Biel; el com, a
 * `VideoAmbFormulari`. Després del vídeo, «Empieza gratis, sin tarjeta» porta a crear el compte a l'app.
 * No s'indexa (noindex): és per al trànsit dels anuncis.
 * Diu a quins sistemes s'envia (SES.Hospedajes o Mossos d'Esquadra; l'Ertzaintza no, perquè no s'hi envia):
 * decisió del Biel (15-10); si arriba algú d'un sistema que encara no està connectat, es connecta el mateix dia.
 * El vídeo de la funció de moment només és en castellà: a /ca també surt aquest.
 */
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useLang } from "@/i18n/useLang";
import { track } from "@/lib/analytics";
import { urlAlta } from "@/lib/empezar";
import { desaLead } from "@/lib/leads";
import { videoDeLaFuncio } from "@/lib/data/videosFuncions";
import VideoAmbFormulari, { type DadesAnunci, type ReproductorAnunci } from "@/components/anuncis/VideoAmbFormulari";
import { CapcalAnunci, PeuAnunci, XifresAnunci } from "@/components/anuncis/peces";
import ses from "@/assets/connexions/ses-hospedajes.webp";
import "@/components/portada/portada.css";

type Pregunta = { q: string; a: string };

// La portada, el moment que fa la promesa de la pàgina («Enviado a la policía», segon 22): la del vídeo (el
// títol sobre gris) no semblava un vídeo (23-10).
const VIDEO = { ...videoDeLaFuncio("check-in-online", "es")!, portada: "/assets/anuncis/check-in-portada.webp" };

export default function RegistroGratis() {
  const { t } = useTranslation("home");
  const { lang } = useLang();
  const reproductor = useRef<ReproductorAnunci>(null);
  const [dades, setDades] = useState<DadesAnunci | null>(null);
  const preguntes = t("anunci_registre.preguntes", { returnObjects: true }) as Pregunta[];

  // El pla gratis ja es va desar amb el contacte; es torna a enviar tot per si llavors va fallar la xarxa
  const alCompte = (variant: string) => () => {
    track("empezar_cuenta", { variant });
    if (dades) void desaLead({ phone: dades.telefon, name: dades.nom, plan: "gratis", answers: { pisos: dades.pisos } }, lang);
  };

  const primerNom = dades?.nom.split(/\s+/)[0] ?? "";
  const gracies = dades
    ? dades.pisos === 1
      ? t("anunci_registre.gracies_un", { nom: primerNom })
      : t("anunci_registre.gracies", { nom: primerNom, pisos: dades.pisos })
    : "";
  const botoCompte = (variant: string, classe: string) => (
    <a className={`pt-pill ${classe} pt-entrada-boto`} href={urlAlta("gratuit", { nom: dades?.nom, telefon: dades?.telefon, lang })} onClick={alCompte(variant)}>
      {t("portada.entrada.empezar")}
    </a>
  );

  return (
    <div className="pt-ad-pagina min-h-screen bg-white">
      <SEO title={t("anunci_registre.seo_titol")} description={t("anunci_registre.lead")} path="/registro-de-viajeros-gratis" noindex />
      <CapcalAnunci />

      <main>
        <section className="pt-seccio pt-ad-entrada" aria-labelledby="pt-ad-titol">
          <div className="contenidor pt-ad-columna">
            <p className="pt-retol">{t("anunci_registre.retol")}</p>
            <h1 id="pt-ad-titol" className="pt-ad-h1">
              {t("anunci_registre.titol")} <span>{t("anunci_registre.titol_gris")}</span>
            </h1>
            <p className="pt-lead pt-ad-lead">{t("anunci_registre.lead")}</p>

            <VideoAmbFormulari
              ref={reproductor}
              video={VIDEO}
              pla="gratis"
              lloc="anunci-checkin"
              titol={t("anunci_registre.video_titol")}
              ariaVideo={t("anunci_registre.video_aria")}
              enObrir={setDades}
              // Al mòbil, quan s'acaba, el bloc de sota és fora de la pantalla: el final porta el botó (23-10)
              final={
                <>
                  <p>{t("anunci_registre.final_titol")}</p>
                  {botoCompte("anunci_video", "pt-pill-blanc")}
                </>
              }
            />

            {dades && (
              <div className="pt-ad-despres">
                <p className="pt-ad-gracies">{gracies}</p>
                {botoCompte("anunci", "pt-pill-pri")}
                <p className="pt-ad-nota">{t("anunci_registre.nota_compte")}</p>
              </div>
            )}
          </div>
        </section>

        <section className="pt-seccio pt-ad-confianca" aria-label={t("anunci_registre.xifres_aria")}>
          <div className="contenidor pt-ad-columna">
            <XifresAnunci />
            <p className="pt-ad-sistemes">
              <img src={ses} alt="" width={200} height={144} loading="lazy" decoding="async" />
              {t("anunci_registre.sistemes")}
            </p>
          </div>
        </section>

        <section className="pt-seccio pt-ad-preguntes" aria-labelledby="pt-ad-preguntes">
          <div className="contenidor pt-ad-columna">
            <h2 id="pt-ad-preguntes" className="pt-ad-h2">{t("anunci_registre.preguntes_titol")}</h2>
            <dl className="pt-preguntes-llista">
              {preguntes.map((f) => (
                <div key={f.q}>
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="pt-seccio pt-ad-final-s">
          <div className="contenidor pt-ad-columna">
            <div className="pt-ad-final">
              <div>
                <p className="pt-ad-final-t">{t("anunci_registre.final_titol")}</p>
                <p>{t("anunci_registre.final_text")}</p>
              </div>
              {dades ? (
                botoCompte("anunci_final", "pt-pill-blanc")
              ) : (
                <button type="button" className="pt-pill pt-pill-blanc pt-entrada-boto" onClick={() => reproductor.current?.obre()}>
                  {t("anunci_video.veure")}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <PeuAnunci />
    </div>
  );
}
