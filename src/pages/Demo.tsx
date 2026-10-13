/**
 * /demo («Ver cómo funciona»), a l'estil de la portada (13-10-2026): els cinc vídeos de la sèrie
 * «Todo va solo» (~/hostly-videos/entregues), un per cosa que Hostly fa per tu. Abans hi havia un sol
 * vídeo de Remotion amb l'app d'abril, en català i amb «Hostly Automàtic».
 *
 * Els vídeos de la web són còpies a 720 px, tallades abans de la píndola final «Pruébala gratis 14
 * días» (ja no és l'oferta): acaben amb el logotip i «Que tu piso no te gestione a ti». Els originals
 * no s'han tocat. Són en castellà (a /ca, una nota ho diu).
 *
 * Cada targeta ensenya la portada; en tocar-la, el vídeo surt al seu lloc i comença amb so. Només en
 * sona un alhora. Mirar-ne un compta com a `video_play` (a Meta, «VerVideo»).
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

type Video = { id: string; titol: string; text: string };

export default function Demo() {
  const empezar = useEmpezar();
  const { t } = useTranslation("common");
  const videos = t("demo.videos", { returnObjects: true }) as Video[];
  const nota = t("demo.nota_idioma", { defaultValue: "" });
  const [enMarxa, setEnMarxa] = useState<string | null>(null);
  const graella = useRef<HTMLDivElement>(null);

  const mira = (id: string) => {
    // només un alhora: els altres es paren
    graella.current?.querySelectorAll("video").forEach((v) => { if (v.dataset.id !== id) v.pause(); });
    setEnMarxa(id);
    track("video_play", { location: "demo", variant: id });
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

          <div ref={graella} className="pt-videos">
            {videos.map((v) => (
              <figure key={v.id} className="pt-video">
                <div className="pt-video-marc">
                  {enMarxa === v.id ? (
                    <video
                      data-id={v.id}
                      src={`/assets/funciona/${v.id}.mp4`}
                      poster={`/assets/funciona/${v.id}.webp`}
                      controls
                      autoPlay
                      playsInline
                      preload="auto"
                      onPlay={(e) => graella.current?.querySelectorAll("video").forEach((o) => { if (o !== e.currentTarget) o.pause(); })}
                    />
                  ) : (
                    <button type="button" className="pt-video-boto" onClick={() => mira(v.id)} aria-label={t("demo.veure", { titol: v.titol })}>
                      <img src={`/assets/funciona/${v.id}.webp`} alt="" width={480} height={854} loading="lazy" decoding="async" />
                      <span className="pt-video-play" aria-hidden="true"><Play className="pt-ic" fill="currentColor" /></span>
                    </button>
                  )}
                </div>
                <figcaption><b>{v.titol}</b><span>{v.text}</span></figcaption>
              </figure>
            ))}
          </div>
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
