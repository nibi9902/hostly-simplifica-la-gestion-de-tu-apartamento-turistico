/**
 * La landing dels anuncis de Hostly Completo (/hostly-completo), 18-10-2026.
 *
 * Com la del registre (`RegistroGratis`), però per a tot el Completo: el lema de la portada, el vídeo de
 * /demo (minut i mig) amb el formulari a dins (`VideoAmbFormulari`) i, després, la trucada: «¿Te llamamos
 * y dejamos tus pisos listos contigo?», amb la foto del Biel. El Complet no s'activa sol: el Biel truca i
 * el deixa llest amb la persona (17/18-10), per això aquí no hi ha cap botó per començar-lo sol.
 * La trucada es desa com «Llamadme ahora» de /empezar (de 21 a 9, hora de Madrid, «Llamadme mañana») i
 * als anuncis compta com a «Schedule». /demo es queda com està. No s'indexa (noindex).
 */
import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { useLang } from "@/i18n/useLang";
import type { Lang } from "@/i18n/config";
import { track } from "@/lib/analytics";
import { trucadaDema } from "@/lib/demo";
import { URL_ALTA_GRATUITA } from "@/lib/empezar";
import { desaLead, telefonVisible } from "@/lib/leads";
import VideoAmbFormulari, { type DadesAnunci, type ReproductorAnunci, type VideoAnunci } from "@/components/anuncis/VideoAmbFormulari";
import { CapcalAnunci, PeuAnunci, XifresAnunci } from "@/components/anuncis/peces";
import fotoBiel from "@/assets/portada/biel.webp";
import airbnb from "@/assets/connexions/airbnb.webp";
import booking from "@/assets/connexions/booking.webp";
import whatsapp from "@/assets/connexions/whatsapp.webp";
import ses from "@/assets/connexions/ses-hospedajes.webp";
import "@/components/portada/portada.css";

type Pregunta = { q: string; a: string };
type Trucada = "no" | "desant" | "feta" | "error";

/** El vídeo de /demo, en castellà o en català (els mateixos fitxers que `Demo.tsx`). */
const VIDEOS: Record<Lang, VideoAnunci> = {
  es: {
    src: "/assets/demo/lo-que-hace-hostly.mp4",
    portada: "/assets/demo/lo-que-hace-hostly.webp",
    subtitols: "/assets/demo/lo-que-hace-hostly.es.vtt",
    idioma: "es",
    durada: "1:35",
  },
  ca: {
    src: "/assets/demo/el-que-fa-hostly.mp4",
    portada: "/assets/demo/el-que-fa-hostly.webp",
    subtitols: "/assets/demo/el-que-fa-hostly.ca.vtt",
    idioma: "ca",
    durada: "1:37",
  },
};

const CONNEXIONS = [
  { nom: "Airbnb", logo: airbnb },
  { nom: "Booking.com", logo: booking },
  { nom: "WhatsApp", logo: whatsapp },
  { nom: "SES.Hospedajes", logo: ses },
];

export default function HostlyCompleto() {
  const { t } = useTranslation("home");
  const { t: tE } = useTranslation("embut");
  const { lang } = useLang();
  const reproductor = useRef<ReproductorAnunci>(null);
  const [dades, setDades] = useState<DadesAnunci | null>(null);
  const [trucada, setTrucada] = useState<Trucada>("no");
  // De 21:00 a 9:00 (Madrid), «Llamadme mañana»
  const dema = trucadaDema();
  const preguntes = t("anunci_completo.preguntes", { returnObjects: true }) as Pregunta[];

  async function truca() {
    if (!dades || trucada === "desant" || trucada === "feta") return;
    setTrucada("desant");
    const r = await desaLead(
      {
        phone: dades.telefon,
        name: dades.nom,
        plan: "completo",
        demo_slot: dema ?? new Date().toISOString(),
        answers: { pisos: dades.pisos, trucar: dema ? "demà" : "ara" },
      },
      lang,
    );
    if (!r.ok) {
      setTrucada("error");
      return;
    }
    track("demo_solicitada", { variant: dema ? "dema" : "ara", location: "anunci-completo" });
    setTrucada("feta");
  }

  const primerNom = dades?.nom.split(/\s+/)[0] ?? "";
  const titolTruca = dades
    ? dades.pisos === 1
      ? t("anunci_completo.truca_titol_un", { nom: primerNom })
      : t("anunci_completo.truca_titol", { nom: primerNom, pisos: dades.pisos })
    : "";
  const notaTrucada = dades ? tE(dema ? "empezar.demo.dema_nota" : "empezar.demo.ara_nota", { telefon: telefonVisible(dades.telefon) }) : "";
  const textBotoTruca = dema ? tE("empezar.demo.dema") : t("anunci_completo.truca_boto");

  return (
    <div className="min-h-screen bg-white">
      <SEO title={t("anunci_completo.seo_titol")} description={t("anunci_completo.lead")} path="/hostly-completo" noindex />
      <CapcalAnunci />

      <main>
        <section className="pt-seccio pt-ad-entrada" aria-labelledby="pt-ad-titol">
          <div className="contenidor pt-ad-columna">
            <p className="pt-retol">{t("anunci_registre.retol")}</p>
            <h1 id="pt-ad-titol" className="pt-ad-h1 pt-ad-h1-llarg">
              {t("hero.h1_line1")} <span>{t("hero.h1_line2")}</span>
            </h1>
            <p className="pt-lead pt-ad-lead">{t("anunci_completo.lead")}</p>

            <VideoAmbFormulari
              ref={reproductor}
              video={VIDEOS[lang] ?? VIDEOS.es}
              pla="completo"
              lloc="anunci-completo"
              titol={t("anunci_completo.video_titol")}
              ariaVideo={t("anunci_completo.video_aria")}
              enObrir={setDades}
              final={
                <>
                  <p>{t("anunci_completo.final_video")}</p>
                  {trucada === "feta" ? (
                    <p className="pt-ad-fi-ok">{notaTrucada}</p>
                  ) : (
                    <button type="button" className="pt-pill pt-pill-blanc pt-entrada-boto" onClick={truca} disabled={trucada === "desant"}>
                      {textBotoTruca}
                    </button>
                  )}
                </>
              }
            />

            {dades && (
              <div className="pt-ad-truca">
                <p className="pt-ad-gracies">{titolTruca}</p>
                <p className="pt-signa-fila">
                  <img className="pt-signa-av" src={fotoBiel} alt="" width={104} height={104} loading="lazy" decoding="async" />
                  <small className="pt-signa">{t("portada.truca.signa")}</small>
                </p>
                {trucada === "feta" ? (
                  <>
                    <p className="pt-ad-ok" role="status">
                      <Check className="pt-ic" strokeWidth={3} aria-hidden="true" />
                      {notaTrucada}
                    </p>
                    <p className="pt-ad-nota">{tE("empezar.demo.mientras")}</p>
                    <a
                      className="pt-pill pt-pill-sec pt-entrada-boto"
                      href={URL_ALTA_GRATUITA}
                      onClick={() => track("empezar_cuenta", { variant: "anunci_despues_llamada" })}
                    >
                      {tE("empezar.demo.mientras_boton")}
                    </a>
                  </>
                ) : (
                  <>
                    <button type="button" className="pt-pill pt-pill-pri pt-entrada-boto" onClick={truca} disabled={trucada === "desant"}>
                      {textBotoTruca}
                    </button>
                    {trucada === "error" ? (
                      <p className="pt-ad-error" role="alert">{tE("empezar.error.guardar")}</p>
                    ) : (
                      <p className="pt-ad-nota">{t("anunci_completo.truca_nota")}</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="pt-seccio pt-ad-confianca" aria-label={t("anunci_registre.xifres_aria")}>
          <div className="contenidor pt-ad-columna">
            <div className="pt-ad-con">
              <p className="pt-retol">{t("portada.zero.connectat")}</p>
              <ul className="pt-ad-connexions">
                {CONNEXIONS.map((c) => (
                  <li key={c.nom}>
                    <img src={c.logo} alt={c.nom} width={30} height={30} loading="lazy" decoding="async" />
                  </li>
                ))}
              </ul>
            </div>
            <XifresAnunci />
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
                <p className="pt-ad-final-t">{t("anunci_completo.final_titol")}</p>
                <p>{t("anunci_completo.final_text")}</p>
              </div>
              {!dades ? (
                <button type="button" className="pt-pill pt-pill-blanc pt-entrada-boto" onClick={() => reproductor.current?.obre()}>
                  {t("anunci_video.veure")}
                </button>
              ) : trucada === "feta" ? (
                <p className="pt-ad-final-ok">{notaTrucada}</p>
              ) : (
                <button type="button" className="pt-pill pt-pill-blanc pt-entrada-boto" onClick={truca} disabled={trucada === "desant"}>
                  {textBotoTruca}
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
