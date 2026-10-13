/**
 * /demo («Ver cómo funciona»), a l'estil de la portada (13-10-2026). A dalt, el vídeo d'un minut d'abril
 * («un día cualquiera con Hostly»): el Biel el volia tal com era, i s'ha tornat a renderitzar amb l'app
 * en castellà (projecte de Remotion a ~/hostly-videos/demo-60s). A sota, els cinc
 * vídeos de la sèrie «Todo va solo» (~/hostly-videos/entregues), un per cosa que Hostly fa per tu.
 *
 * Els vídeos de la web són còpies a 720 px, tallades abans de la píndola final «Pruébala gratis 14
 * días» (ja no és l'oferta): acaben amb el logotip i «Que tu piso no te gestione a ti». Els originals
 * no s'han tocat. Són en castellà (a /ca, una nota ho diu).
 *
 * Les cinc portades van en una fila. En tocar-ne una, el vídeo s'obre gran, gairebé a tota la pantalla
 * (el Biel, 13-10: «pot ser inclús una mica més gran, que ocupi gairebé tot»), amb so i amb fletxes per
 * passar al següent; es tanca amb Esc, la creu o un clic fora. Mirar-ne un compta com a `video_play`
 * (a Meta, «VerVideo»).
 */
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Dialeg from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Play, X } from "lucide-react";
import PageShell from "@/components/PageShell";
import Truca from "@/components/portada/Truca";
import { LangLink } from "@/i18n/LangLink";
import { useEmpezar } from "@/lib/empezar";
import { track } from "@/lib/analytics";
import "@/components/portada/portada.css";

type Video = { id: string; titol: string; text: string };

export default function Demo() {
  const empezar = useEmpezar();
  const { t } = useTranslation("common");
  const videos = t("demo.videos", { returnObjects: true }) as Video[];
  const nota = t("demo.nota_idioma", { defaultValue: "" });
  // el vídeo obert (índex), o cap
  const [obert, setObert] = useState<number | null>(null);
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

  const mira = (i: number) => {
    setObert(i);
    track("video_play", { location: "demo", variant: videos[i].id });
  };
  const passa = (dir: number) => {
    if (obert === null) return;
    mira((obert + dir + videos.length) % videos.length);
  };

  // amb el teclat, ← → passen de vídeo
  useEffect(() => {
    if (obert === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") passa(1);
      if (e.key === "ArrowLeft") passa(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [obert]);

  const actual = obert !== null ? videos[obert] : null;

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

          <h2 className="pt-demo-curts">{t("demo.curts_titol")}</h2>
          <div className="pt-videos">
            {videos.map((v, i) => (
              <figure key={v.id} className="pt-video">
                <div className="pt-video-marc">
                  <button type="button" className="pt-video-boto" onClick={() => mira(i)} aria-label={t("demo.veure", { titol: v.titol })}>
                    <img src={`/assets/funciona/${v.id}.webp`} alt="" width={480} height={854} loading="lazy" decoding="async" />
                    <span className="pt-video-play" aria-hidden="true"><Play className="pt-ic" fill="currentColor" /></span>
                  </button>
                </div>
                <figcaption><b>{v.titol}</b><span>{v.text}</span></figcaption>
              </figure>
            ))}
          </div>

          <div className="pt-demo-peu">
            <div className="pt-demo-botons">
              <button type="button" onClick={empezar} className="pt-pill pt-pill-pri">{t("demo.cta_start")}</button>
              <LangLink to="/precios" className="pt-pill pt-pill-sec">{t("demo.cta_pricing")}</LangLink>
            </div>
            <p>{t("demo.disclaimer")}</p>
          </div>
        </div>
      </section>

      {/* El vídeo obert, gran: gairebé tota l'alçada de la pantalla */}
      <Dialeg.Root open={obert !== null} onOpenChange={(o) => { if (!o) setObert(null); }}>
        <Dialeg.Portal>
          <Dialeg.Overlay className="pt-gran-fons" />
          <Dialeg.Content className="pt-seccio pt-gran" aria-describedby={undefined}>
            {actual && (
              <>
                <Dialeg.Title className="sr-only">{actual.titol}</Dialeg.Title>
                <div className="pt-gran-marc">
                  <video
                    key={actual.id}
                    src={`/assets/funciona/${actual.id}.mp4`}
                    poster={`/assets/funciona/${actual.id}.webp`}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                  />
                </div>
                <div className="pt-gran-peu">
                  <p><b>{actual.titol}</b><span>{actual.text}</span></p>
                  <div className="pt-gran-fletxes">
                    <button type="button" onClick={() => passa(-1)} aria-label={t("demo.anterior")}><ArrowLeft className="pt-ic" aria-hidden="true" /></button>
                    <span>{`${(obert ?? 0) + 1} / ${videos.length}`}</span>
                    <button type="button" onClick={() => passa(1)} aria-label={t("demo.seguent")}><ArrowRight className="pt-ic" aria-hidden="true" /></button>
                  </div>
                </div>
              </>
            )}
            <Dialeg.Close className="pt-gran-x" aria-label={t("demo.tancar")}><X className="pt-ic" /></Dialeg.Close>
          </Dialeg.Content>
        </Dialeg.Portal>
      </Dialeg.Root>

      <Truca />
    </PageShell>
  );
}
