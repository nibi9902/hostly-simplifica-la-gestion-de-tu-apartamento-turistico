/**
 * «Les preguntamos a gestores qué es Hostly» — una pantalla per gestor.
 *
 * La frase a l'esquerra i, al costat, la boleta amb el vídeo ja en marxa (sense so; l'anell de fora
 * avança com el vídeo). Quan fa 4,5 s que la frase es veu sencera, la boleta s'obre cap amunt i el
 * vídeo passa al davant; les lletres es queden darrere, esvaïdes. ← → passen al gestor següent.
 * Decisions del Biel (12-10-2026): «s'obri cap adalt i que tapi les lletres», «hi ha d'haver més
 * d'una review», «cadascú té una pantalla», «la boleta a un costat».
 *
 * La boleta només surt quan TOTS els gestors tenen el vídeo (`src` a home.json): mentre no n'hi ha,
 * la frase va sola, al mig, i no hi ha res que faci veure que parla (13-10-2026). Els gestors 2 i 3
 * s'hi afegiran quan el Biel en tingui les frases i els vídeos; amb més d'un, surten les fletxes.
 * Amb vídeo, en tocar la boleta oberta se sent (es treu el silenci).
 *
 * La boleta creix dins del seu forat (posició absoluta), no es mou a un altre lloc del DOM: així React
 * no perd el fil si es torna a pintar (canvi d'idioma).
 */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, Volume2, VolumeX, X } from "lucide-react";
import fotoDia from "@/assets/portada/gestor-dia.webp";
import fotoTarda from "@/assets/portada/gestor-tarda.webp";
import fotoNit from "@/assets/portada/gestor-nit.webp";

gsap.registerPlugin(ScrollTrigger);

type Gestor = { frase: string; nom: string; detall: string; video: string; src?: string };

const FOTOS = [fotoDia, fotoTarda, fotoNit];
const OMBRA_PETITA = "0 0 0 4px #fff, 0 18px 40px -16px rgba(15,23,42,.35)";
const OMBRA_GRAN = "0 0 0 0px #fff, 0 50px 120px -30px rgba(15,23,42,.6)";

export default function Gestors() {
  const { t } = useTranslation("home");
  const gestors = t("portada.gestors.llista", { returnObjects: true }) as Gestor[];
  const ambVideo = gestors.length > 0 && gestors.every((g) => Boolean(g.src));
  const seccioRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const seccio = seccioRef.current;
    if (!seccio) return;
    const tots = <T extends Element>(s: string) => Array.from(seccio.querySelectorAll<T>(s));
    const cites = tots<HTMLElement>(".pt-cita");
    // Sense vídeos: només la frase; si n'hi ha més d'una, les fletxes passen a la següent
    if (!ambVideo) {
      const ant = seccio.querySelector(".pt-ant"), seg = seccio.querySelector(".pt-seg");
      const compta = seccio.querySelector(".pt-compta") as HTMLElement | null;
      if (!ant || !seg || !compta || cites.length < 2) return;
      let actiu = 0;
      const ves = (dir: number) => {
        const a = actiu;
        actiu = (actiu + dir + cites.length) % cites.length;
        gsap.to(cites[a], { autoAlpha: 0, x: -28 * dir, duration: 0.35, ease: "power2.in" });
        gsap.fromTo(cites[actiu], { autoAlpha: 0, x: 28 * dir }, { autoAlpha: 1, x: 0, duration: 0.6, delay: 0.2, ease: "power3.out" });
        compta.textContent = `${actiu + 1} / ${cites.length}`;
      };
      const alAnt = () => ves(-1), alSeg = () => ves(1);
      ant.addEventListener("click", alAnt);
      seg.addEventListener("click", alSeg);
      return () => {
        ant.removeEventListener("click", alAnt);
        seg.removeEventListener("click", alSeg);
        gsap.killTweensOf(cites);
      };
    }
    const llocs = tots<HTMLElement>(".pt-lloc");
    const forats = llocs.map((l) => l.querySelector(".pt-forat") as HTMLElement);
    const boletes = llocs.map((l) => l.querySelector(".pt-boleta") as HTMLButtonElement);
    const anells = llocs.map((l) => l.querySelector(".pt-anell-p .pt-fet") as SVGCircleElement);
    const torna = seccio.querySelector(".pt-torna") as HTMLButtonElement;
    // amb un sol gestor no hi ha fletxes
    const compta = seccio.querySelector(".pt-compta") as HTMLElement | null;
    const ant = seccio.querySelector(".pt-ant") as HTMLButtonElement | null;
    const seg = seccio.querySelector(".pt-seg") as HTMLButtonElement | null;
    const fons = [seccio.querySelector(".pt-columna-text"), seccio.querySelector(".pt-peu-b")] as HTMLElement[];
    const n = cites.length;
    let actiu = 0;
    let obert = -1;
    let automatic = false;
    let mou = 1;
    let espera: gsap.core.Tween | null = null;
    let roda: gsap.core.Tween | null = null;
    let barra: gsap.core.Tween | null = null;
    let seguent: gsap.core.Tween | null = null;

    // La boleta ja es veu en marxa (sense so): l'anell de fora avança com el vídeo
    function giraAnell(i: number) {
      roda?.kill();
      roda = null;
      if (mou < 0.01) return;
      roda = gsap.fromTo(anells[i], { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 16, ease: "none", repeat: -1 });
    }
    function mostra(i: number, dir: number) {
      if (i === actiu) return;
      const a = actiu;
      actiu = i;
      espera?.kill();
      espera = null;
      gsap.to(cites[a], { autoAlpha: 0, x: -28 * dir, duration: 0.35 * mou, ease: "power2.in" });
      gsap.fromTo(cites[i], { autoAlpha: 0, x: 28 * dir }, { autoAlpha: 1, x: 0, duration: 0.6 * mou, delay: 0.2 * mou, ease: "power3.out" });
      gsap.to(llocs[a], { autoAlpha: 0, scale: 0.8, duration: 0.3 * mou, ease: "power2.in" });
      gsap.fromTo(llocs[i], { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.55 * mou, delay: 0.25 * mou, ease: "power3.out" });
      if (compta) compta.textContent = `${i + 1} / ${n}`;
      giraAnell(i);
      if (automatic) programa();
    }
    function ves(dir: number) {
      automatic = false;
      const desti = (actiu + dir + n) % n;
      if (obert !== -1) {
        encongeix(false);
        seguent?.kill();
        seguent = gsap.delayedCall(0.6 * mou, () => mostra(desti, dir));
      } else mostra(desti, dir);
    }
    // El vídeo creix cap amunt: la vora de baix es queda on és la boleta, i es posa una mica a la dreta
    // del centre. La boleta és dins del seu forat: el lloc es compta des del forat. La capçalera del web
    // és fixa (80 px): el vídeo obert no s'hi posa a sota.
    function geometria(i: number) {
      const s = seccio!.getBoundingClientRect();
      const b = forats[i].getBoundingClientRect();
      const capcal = document.querySelector("header");
      const sostre = capcal ? Math.max(0, capcal.getBoundingClientRect().bottom) : 0;
      const baix = b.bottom - s.top;
      const alt = Math.round(Math.min(533, Math.max(240, Math.min(baix - 32, b.bottom - sostre - 16))));
      const ample = Math.round((alt * 9) / 16);
      const dalt = Math.max(16, baix - alt);
      const centre = s.width > 1100 ? s.width * 0.6 : s.width / 2;
      const esq = Math.round(Math.max(16, Math.min(s.width - ample - 76, centre - ample / 2)));
      return {
        boleta: { left: esq - (b.left - s.left), top: dalt - (b.top - s.top), width: ample, height: alt },
        torna: { left: esq + ample + 16, top: dalt },
      };
    }
    function creix(i: number) {
      if (obert !== -1) return;
      espera?.kill();
      espera = null;
      obert = i;
      const f = boletes[i];
      const g = geometria(i);
      f.classList.add("es-gran");
      seccio!.classList.add("es-gran");
      gsap.to(f, { ...g.boleta, borderRadius: 28, boxShadow: OMBRA_GRAN, duration: 0.95 * mou, ease: "power3.inOut" });
      gsap.set(torna, g.torna);
      // les lletres passen al darrere: es queden, però esvaïdes
      gsap.to(fons, { opacity: 0.25, scale: 0.97, filter: "blur(2.5px)", duration: 0.8 * mou, ease: "power3.out" });
      gsap.to(torna, { autoAlpha: 1, duration: 0.3 * mou, delay: 0.7 * mou });
      barra?.kill();
      barra = gsap.fromTo(f.querySelector(".pt-progres i"), { scaleX: 0 }, { scaleX: 1, duration: 14, ease: "none", onComplete: () => encongeix(true) });
    }
    function encongeix(perqueAcaba: boolean) {
      if (obert === -1) return;
      const i = obert;
      obert = -1;
      barra?.kill();
      barra = null;
      const f = boletes[i];
      const mida = forats[i].offsetWidth;
      f.classList.remove("es-gran", "amb-so");
      const v = f.querySelector("video");
      if (v) v.muted = true;
      seccio!.classList.remove("es-gran");
      gsap.to(f, {
        left: 0, top: 0, width: mida, height: mida, borderRadius: mida / 2, boxShadow: OMBRA_PETITA, zIndex: 10,
        duration: 0.8 * mou, ease: "power3.inOut",
        onComplete: () => { gsap.set(f, { clearProps: "left,top,width,height,borderRadius,boxShadow,zIndex" }); },
      });
      gsap.to(fons, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.6 * mou, delay: 0.15 * mou, ease: "power3.out" });
      gsap.to(torna, { autoAlpha: 0, duration: 0.2 * mou });
      // el gestor següent: primer la seva frase, després el seu vídeo
      if (perqueAcaba && automatic) {
        seguent?.kill();
        seguent = gsap.delayedCall(0.9, () => mostra((i + 1) % n, 1));
      }
    }
    function programa() {
      if (!automatic) return;
      espera?.kill();
      espera = gsap.delayedCall(4.5, () => {
        espera = null;
        if (obert === -1 && automatic && ScrollTrigger.isInViewport(seccio!, 0.6)) creix(actiu);
        else if (automatic && obert === -1) programa();
      });
    }

    const alClicBoleta = boletes.map((f, i) => () => {
      if (obert === i) {
        f.classList.toggle("amb-so");
        const v = f.querySelector("video");
        if (v) v.muted = !f.classList.contains("amb-so");
        return;
      }
      automatic = false;
      espera?.kill();
      espera = null;
      creix(i);
    });
    const alAnt = () => ves(-1);
    const alSeg = () => ves(1);
    const alTorna = () => { automatic = false; encongeix(false); };
    const alTecla = (e: KeyboardEvent) => { if (e.key === "Escape" && obert !== -1) { automatic = false; encongeix(false); } };
    const alCanviMida = () => {
      if (obert === -1) return;
      const g = geometria(obert);
      gsap.set(boletes[obert], g.boleta);
      gsap.set(torna, g.torna);
    };
    boletes.forEach((f, i) => f.addEventListener("click", alClicBoleta[i]));
    ant?.addEventListener("click", alAnt);
    seg?.addEventListener("click", alSeg);
    torna.addEventListener("click", alTorna);
    document.addEventListener("keydown", alTecla);
    window.addEventListener("resize", alCanviMida);

    const mm = gsap.matchMedia();
    mm.add({ escriptori: "(min-width: 1101px)", redueix: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { escriptori, redueix } = ctx.conditions as { escriptori: boolean; redueix: boolean };
      mou = redueix ? 0.001 : 1;
      if (redueix) return;
      giraAnell(actiu);
      // A l'ordinador, quan ja s'ha llegit la frase, el vídeo s'obre sol
      if (escriptori) {
        automatic = true;
        ScrollTrigger.create({ trigger: seccio.querySelector(".pt-cites"), start: "bottom 85%", once: true, onEnter: programa });
      }
      return () => { automatic = false; };
    });

    return () => {
      mm.revert();
      [espera, roda, barra, seguent].forEach((tw) => tw?.kill());
      gsap.killTweensOf([...cites, ...llocs, ...boletes, ...fons, torna, ...anells]);
      boletes.forEach((f, i) => f.removeEventListener("click", alClicBoleta[i]));
      ant?.removeEventListener("click", alAnt);
      seg?.removeEventListener("click", alSeg);
      torna.removeEventListener("click", alTorna);
      document.removeEventListener("keydown", alTecla);
      window.removeEventListener("resize", alCanviMida);
    };
  }, [ambVideo]);

  return (
    <section ref={seccioRef} id="gestores" className={`pt-seccio pt-angel${ambVideo ? "" : " sense-video"}`} aria-labelledby="pt-gestors-retol">
      <div className="contenidor pt-graella">
        <div className="pt-columna-text">
          <p id="pt-gestors-retol" className="pt-retol">{t("portada.gestors.retol")}</p>
          <div className="pt-cites">
            {gestors.map((g, i) => (
              <figure key={i} className={i === 0 ? "pt-cita activa" : "pt-cita"}>
                <blockquote><q>{g.frase}</q></blockquote>
                <figcaption><b>{g.nom}</b> · {g.detall}</figcaption>
              </figure>
            ))}
          </div>
          {gestors.length > 1 && (
            <div className="pt-nav">
              <button className="pt-ant" type="button" aria-label={t("portada.gestors.anterior")}>
                <ArrowLeft className="pt-ic" aria-hidden="true" />
              </button>
              <button className="pt-seg" type="button" aria-label={t("portada.gestors.seguent")}>
                <ArrowRight className="pt-ic" aria-hidden="true" />
              </button>
              <span className="pt-compta" aria-live="polite">{`1 / ${gestors.length}`}</span>
            </div>
          )}
        </div>
        {ambVideo && <div className="pt-columna-video">
          <div className="pt-boletes">
            {gestors.map((g, i) => (
              <div key={i} className={i === 0 ? "pt-lloc activa" : "pt-lloc"}>
                <span className="pt-forat">
                  <svg className="pt-anell-p" viewBox="0 0 100 100" aria-hidden="true">
                    <circle className="pt-pista" cx="50" cy="50" r="48" />
                    <circle className="pt-fet" cx="50" cy="50" r="48" pathLength={100} />
                  </svg>
                  <button className="pt-boleta" type="button" aria-label={g.video}>
                    <video className="pt-foto pt-video" src={g.src} poster={FOTOS[i % FOTOS.length]} muted loop playsInline autoPlay preload="metadata" aria-hidden="true" />
                    <span className="pt-ombra-v" aria-hidden="true" />
                    <span className="pt-viu" aria-hidden="true">
                      <span className="pt-progres"><i /></span>
                      <span className="pt-so">
                        <VolumeX className="pt-ic pt-so-off" />
                        <Volume2 className="pt-ic pt-so-on" />
                      </span>
                      <span className="pt-ona"><i /><i /><i /><i /></span>
                      <span className="pt-xip-so">{t("portada.gestors.oir")}</span>
                    </span>
                  </button>
                </span>
              </div>
            ))}
          </div>
          <p className="pt-peu-b">{t("portada.gestors.gran")}</p>
        </div>}
      </div>
      {ambVideo && (
        <button className="pt-torna" type="button" aria-label={t("portada.gestors.torna")}>
          <X className="pt-ic" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
