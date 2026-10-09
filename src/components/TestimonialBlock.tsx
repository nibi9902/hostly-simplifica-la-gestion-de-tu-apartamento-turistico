import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { MessageCircle, Play, Unlock, Video } from "lucide-react";
import { VIDEOS_CLIENTS, type VideoClient } from "@/lib/data/videosClients";
import { useTranslation } from "react-i18next";

const appleEase = [0.22, 1, 0.36, 1] as const;

const supportIcons = [Video, MessageCircle, Unlock];

/**
 * Un vídeo de client en horitzontal. Mentre sigui un exemple (foto d'estoc), ho diu
 * a la mateixa targeta: «Gestor N» i l'etiqueta «Ejemplo».
 */
const VideoCard = ({ v, n }: { v: VideoClient; n: number }) => {
  const { t } = useTranslation("home");
  const [reprodueix, setReprodueix] = useState(false);
  const nom = v.exemple || !v.nom ? t("testimonials.placeholder_name", { n }) : v.nom;
  const meta = v.exemple
    ? t("testimonials.placeholder_meta")
    : [v.lloc, v.pisos ? `${v.pisos} ${v.pisos === 1 ? t("testimonials.apt_singular") : t("testimonials.apt_plural")}` : null]
        .filter(Boolean)
        .join(" · ");

  return (
    <figure className="flex flex-col gap-4">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 shadow-[0_14px_40px_rgba(15,23,42,0.10)]">
        {reprodueix && v.video ? (
          <video src={v.video} poster={v.poster} controls autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <button
            type="button"
            onClick={() => v.video && setReprodueix(true)}
            disabled={!v.video}
            aria-label={t("testimonials.play_aria", { nom })}
            className="group absolute inset-0 w-full h-full text-left disabled:cursor-default focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
          >
            <img src={v.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
            <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" aria-hidden="true" />
            {v.exemple && (
              <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider bg-white/90 text-foreground rounded-full px-2.5 py-1">
                {t("testimonials.example_tag")}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span className="w-16 h-16 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                <Play className="w-6 h-6 text-foreground translate-x-0.5" fill="currentColor" />
              </span>
            </span>
            <span className="absolute bottom-4 left-5 right-5 text-white">
              <span className="block font-semibold text-base leading-tight">{nom}</span>
              <span className="block text-sm text-white/80">{meta}</span>
            </span>
          </button>
        )}
      </div>
      {v.frase && !v.exemple && (
        <figcaption className="text-sm text-muted-foreground leading-relaxed px-1">«{v.frase}»</figcaption>
      )}
    </figure>
  );
};

const TestimonialBlock = () => {
  const { t } = useTranslation("home");

  const promises = t("support.promises", { returnObjects: true }) as Array<{ title: string; desc: string }>;

  const supportRef = useRef(null);
  const { scrollYProgress: sq } = useScroll({ target: supportRef, offset: ["start 90%", "start 40%"] });
  const sqOpacity = useTransform(sq, [0, 1], [0, 1]);
  const sqY       = useTransform(sq, [0, 1], [30, 0]);

  return (
    <>
      <section className="py-24 md:py-32 px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: appleEase }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              {t("testimonials.eyebrow")}
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              {t("testimonials.title_start")}{" "}
              <span className="text-primary">{t("testimonials.title_accent")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>

          {/* Al mòbil, en fila que llisca amb el dit (es veu la vora del següent); a l'ordinador, 3 columnes */}
          <div tabIndex={0} role="region" aria-label={`${t("testimonials.title_start")} ${t("testimonials.title_accent")}`} className="-mx-6 px-6 -my-10 py-10 flex gap-4 overflow-x-auto focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 md:focus-visible:ring-0 snap-x snap-mandatory scroll-pl-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:m-0 md:p-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
            {VIDEOS_CLIENTS.map((v, i) => (
              <div key={v.poster} className="w-[82%] shrink-0 snap-start md:w-auto">
                <VideoCard v={v} n={i + 1} />
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section
        ref={supportRef}
        id="soporte"
        className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-card border-y border-border"
      >
        <motion.div
          style={{ opacity: sqOpacity, y: sqY }}
          className="max-w-6xl mx-auto will-change-transform"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div className="rounded-2xl bg-background border border-border p-8 md:p-10 shadow-[var(--shadow-card)]">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
                {t("support.founder_badge")}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-4">
                {t("support.founder_title")}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed mb-8">
                {t("support.founder_quote")}
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-border/60">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  B
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{t("support.founder_name")}</p>
                  <p className="text-muted-foreground text-xs">{t("support.founder_role")}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
                {t("support.promises_title_start")}{" "}
                <span className="text-primary">{t("support.promises_title_accent")}</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">
                {t("support.promises_subtitle")}
              </p>
              <ul className="space-y-6">
                {promises.map((p, i) => {
                  const Icon = supportIcons[i];
                  return (
                    <li key={p.title} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm mb-1">{p.title}</p>
                        <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default TestimonialBlock;
