/**
 * /demo («Ver cómo funciona»), a l'estil de la portada (13-10-2026). A dalt, el vídeo d'un minut d'abril
 * («un día cualquiera con Hostly»): el Biel el volia tal com era, i s'ha tornat a renderitzar amb l'app
 * en castellà (projecte de Remotion a ~/hostly-videos/demo-60s).
 * Fins al 15-10 hi havia, a sota, els cinc vídeos curts de la sèrie «Todo va solo»: el Biel els va fer
 * treure («hem de treure els 5 vídeos»). Els fitxers continuen a /assets/funciona.
 */
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play } from "lucide-react";
import PageShell from "@/components/PageShell";
import Truca from "@/components/portada/Truca";
import { LangLink } from "@/i18n/LangLink";
import { useEmpezar } from "@/lib/empezar";
import { track } from "@/lib/analytics";
import "@/components/portada/portada.css";

export default function Demo() {
  const empezar = useEmpezar();
  const { t } = useTranslation("common");
  const nota = t("demo.nota_idioma", { defaultValue: "" });
  // el vídeo gran: fins que no el posen en marxa, la portada amb el botó; després, els controls del navegador
  const principal = useRef<HTMLVideoElement>(null);
  const [enMarxa, setEnMarxa] = useState(false);
  const comptat = useRef(false);
  const posaEnMarxa = () => {
    setEnMarxa(true);
    const v = principal.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    void v.play().catch(() => {});
    // Al mòbil, aquest vídeo (apaïsat i amb el text de l'app petit) es mira a pantalla completa
    if (window.matchMedia("(max-width: 640px)").matches) {
      if (v.requestFullscreen) void v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
      else v.webkitEnterFullscreen?.();
    }
  };
  const quanComenca = () => {
    setEnMarxa(true);
    if (comptat.current) return;
    comptat.current = true;
    track("video_play", { location: "demo", variant: "un-dia" });
  };


  return (
    <PageShell title={t("demo.meta_title")} description={t("demo.meta_description")} path="/demo">
      <section className="pt-seccio pt-demo" aria-labelledby="pt-demo-titol">
        <div className="contenidor">
          <div className="pt-centre">
            <p className="pt-retol">{t("demo.eyebrow")}</p>
            <h1 id="pt-demo-titol" className="pt-h2">{t("demo.heading")}</h1>
            <p className="pt-lead">{t("demo.subheading")}</p>
          </div>

          <figure className="pt-demo-gran">
            <div className="pt-demo-gran-marc">
              <video
                ref={principal}
                src="/assets/demo/un-dia-con-hostly.mp4"
                poster="/assets/demo/un-dia-con-hostly.webp"
                preload="none"
                playsInline
                controls={enMarxa}
                onPlay={quanComenca}
              />
              {!enMarxa && (
                <button type="button" className="pt-video-boto" onClick={posaEnMarxa} aria-label={t("demo.principal_veure")}>
                  <span className="pt-video-play pt-video-play-gran" aria-hidden="true"><Play className="pt-ic" fill="currentColor" /></span>
                </button>
              )}
            </div>
          </figure>
          {nota && <p className="pt-videos-nota">{nota}</p>}


          <div className="pt-demo-peu">
            <div className="pt-demo-botons">
              <button type="button" onClick={empezar} className="pt-pill pt-pill-pri">{t("demo.cta_start")}</button>
              <LangLink to="/precios" className="pt-pill pt-pill-sec">{t("demo.cta_pricing")}</LangLink>
            </div>
            <p>{t("demo.disclaimer")}</p>
          </div>
        </div>
      </section>


      <Truca />
    </PageShell>
  );
}
