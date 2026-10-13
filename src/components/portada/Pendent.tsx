/**
 * «Hostly está pendiente. Tú, ya no.», amb la pantalla de Hostly sempre al mig: és la «1 · Amb la
 * pantalla» de docs/exploracions/2026-10-11-web-estil-b/pendent-amb-la-pantalla.html, que el Biel va
 * voler provar a la portada el 13-10-2026. Abans hi havia la 3: el 8 i la llista a dues columnes, i la
 * pantalla només al final.
 *
 * Durant el dia, al Resum de la pantalla hi diu, en verd, «Hostly lo está haciendo por ti», i la foto
 * passa de dia a tarda i a nit. A l'esquerra, el 8 compta i cada cosa que fa Hostly surt gran, d'una en
 * una, amb el moment del dia; sota la pantalla, el punt de la línia mínima avança. Al final, a
 * l'esquerra queden totes vuit en llista, a la pantalla surt la incidència («Para ti») i a la dreta
 * s'encén l'1, l'única cosa que et necessita.
 *
 * Només a l'ordinador ample (≥ 1280 px). Més estret, sense JavaScript o amb «reduir moviment», es veu tal
 * com queda al final del dia (i les fotos de dia i de tarda no es baixen).
 */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check } from "lucide-react";
import PantallaApp from "./PantallaApp";

gsap.registerPlugin(ScrollTrigger);

type Cosa = { titol: string; detall: string };

const T0 = 0.4;
/** Quant dura el dia, en segons (de «Mañana» a «Noche»): 1,4 s per cosa. */
const DIA = 11.2;
/** On canvia el tram del dia (de «Mañana» a «Tarde» i de «Tarde» a «Noche»), en fracció del dia. */
const TRAMS = [0.375, 0.75];
const NO = { immediateRender: false };
const amb = (o: gsap.TweenVars): gsap.TweenVars => ({ ...o, ...NO });

const tots = <T extends Element>(dins: Element, s: string) => Array.from(dins.querySelectorAll<T>(s));

/** El tram del dia en què passa la cosa i de quantes: 0 (matí), 1 (tarda) o 2 (nit). */
const tramDe = (i: number, quantes: number) => {
  const f = (i + 0.5) / quantes;
  return f < TRAMS[0] ? 0 : f < TRAMS[1] ? 1 : 2;
};

function trams(lm: Element, k: number) {
  tots(lm, ".pt-lm-trams span").forEach((t, j) => t.classList.toggle("on", j === k));
}

// La línia mínima: el fil s'omple de gris, el punt blau avança i el tram del dia es fosqueja.
// Torna el moment en què surt cadascuna de les coses.
function liniaMinima(tl: gsap.core.Timeline, lm: Element, quantes: number): number[] {
  tl.set(lm.querySelector(".pt-lm-ple"), amb({ width: "0%" }), 0)
    .set(lm.querySelector(".pt-lm-punt"), amb({ left: "0%" }), 0)
    .call(() => trams(lm, 0), undefined, 0)
    .to(lm.querySelector(".pt-lm-ple"), { width: "100%", duration: DIA, ease: "none" }, T0)
    .to(lm.querySelector(".pt-lm-punt"), { left: "100%", duration: DIA, ease: "none" }, T0)
    .call(() => trams(lm, 1), undefined, T0 + TRAMS[0] * DIA)
    .call(() => trams(lm, 2), undefined, T0 + TRAMS[1] * DIA);
  return Array.from({ length: quantes }, (_, i) => T0 + ((i + 0.5) / quantes) * DIA);
}

/** Com queda tot abans que el dia comenci: res fet, el comptador a 0 i la foto de dia. */
function inici(s: HTMLElement) {
  const lm = s.querySelector(".pt-lm") as HTMLElement;
  gsap.set(s.querySelector(".pt-u-ara"), { autoAlpha: 1 });
  gsap.set(tots(s, ".pt-u-ara p"), { autoAlpha: 0 });
  gsap.set(tots(s, ".pt-u-totes li"), { autoAlpha: 0 });
  gsap.set(tots(s, ".pt-u-dreta > *"), { opacity: 0.18, filter: "blur(2px)" });
  gsap.set(tots(s, ".pt-ft-tarda, .pt-ft-nit"), { opacity: 0 });
  gsap.set(s.querySelector(".pt-targ-pieter"), { autoAlpha: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: -14 });
  gsap.set(s.querySelector(".pt-pantalla .pt-anell"), { autoAlpha: 0 });
  gsap.set(lm.querySelector(".pt-lm-ple"), { width: "0%" });
  gsap.set(lm.querySelector(".pt-lm-punt"), { left: "0%" });
  trams(lm, 0);
  (s.querySelector(".pt-u-n") as HTMLElement).textContent = "0";
}

function construeix(s: HTMLElement): gsap.core.Timeline {
  const n = s.querySelector(".pt-u-n") as HTMLElement;
  const ara = s.querySelector(".pt-u-ara");
  const cadascuna = tots<HTMLElement>(s, ".pt-u-ara p");
  const totes = tots(s, ".pt-u-totes li");
  const dreta = tots(s, ".pt-u-dreta > *");
  const tarda = s.querySelector(".pt-ft-tarda");
  const nit = s.querySelector(".pt-ft-nit");
  const pieter = s.querySelector(".pt-targ-pieter");
  const anell = s.querySelector(".pt-pantalla .pt-anell");
  const lm = s.querySelector(".pt-lm") as HTMLElement;

  inici(s);
  const tl = gsap.timeline({ paused: true });
  tl.set(ara, amb({ autoAlpha: 1 }), 0)
    .set(cadascuna, amb({ autoAlpha: 0 }), 0)
    .set(totes, amb({ autoAlpha: 0, y: 6, filter: "blur(4px)" }), 0)
    .set(dreta, amb({ opacity: 0.18, filter: "blur(2px)" }), 0)
    .set([tarda, nit], amb({ opacity: 0 }), 0)
    .set(pieter, amb({ autoAlpha: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: -14 }), 0)
    .set(anell, amb({ autoAlpha: 0 }), 0)
    .call(() => { n.textContent = "0"; }, undefined, 0);
  // cada cosa surt gran, d'una en una, i s'esvaeix quan arriba la següent
  const ts = liniaMinima(tl, lm, cadascuna.length);
  ts.forEach((t, i) => {
    const el = cadascuna[i];
    const seg = i < ts.length - 1 ? ts[i + 1] : t + 1.2;
    tl.fromTo(el, { autoAlpha: 0, y: 10, filter: "blur(6px)" }, amb({ autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power3.out" }), t)
      .call(() => { n.textContent = String(i + 1); }, undefined, t + 0.05)
      .to(el, { autoAlpha: 0, y: -8, filter: "blur(6px)", duration: 0.4, ease: "power2.in" }, seg - 0.4);
  });
  // la foto del Resum passa de dia a tarda i a nit, al compàs de la línia
  tl.to(tarda, { opacity: 1, duration: 1.2, ease: "sine.inOut" }, T0 + TRAMS[0] * DIA - 0.4)
    .to(nit, { opacity: 1, duration: 1.2, ease: "sine.inOut" }, T0 + TRAMS[1] * DIA - 0.4);
  // al final: totes vuit en llista, la incidència a la pantalla i l'1 que s'encén
  const tf = T0 + DIA + 0.3;
  tl.set(ara, { autoAlpha: 0 }, tf)
    .to(totes, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.09, ease: "power3.out" }, tf)
    .to(pieter, { autoAlpha: 1, height: "auto", paddingTop: 20, paddingBottom: 20, marginBottom: 0, duration: 0.8, ease: "power3.out" }, tf + 0.2)
    .to(dreta, { opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.1, ease: "power3.out" }, tf + 0.6)
    .to(anell, { autoAlpha: 1, duration: 0.9, ease: "sine.out" }, tf + 0.8);
  return tl;
}

export default function Pendent() {
  const { t } = useTranslation("home");
  const coses = t("portada.pendent.coses", { returnObjects: true }) as Cosa[];
  const nomsTrams = t("portada.pendent.trams", { returnObjects: true }) as string[];
  const seccioRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const s = seccioRef.current;
    if (!s) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1280px) and (prefers-reduced-motion: no-preference)", () => {
      const tl = construeix(s);
      // es mou sol quan el tens davant (sense tocar el scroll)
      ScrollTrigger.create({ trigger: s.querySelector(".pt-u"), start: "top 70%", once: true, onEnter: () => { tl.play(0); } });
      // en desfer-se (canvi de mida, reduir moviment), la secció torna a quedar com al final del dia
      return () => {
        tl.kill();
        gsap.set(tots(s, ".pt-u-ara, .pt-u-ara p, .pt-u-totes li, .pt-u-dreta > *, .pt-ft-tarda, .pt-ft-nit, .pt-targ-pieter, .pt-pantalla .pt-anell, .pt-lm-ple, .pt-lm-punt"), { clearProps: "all" });
        (s.querySelector(".pt-u-n") as HTMLElement).textContent = String(coses.length);
        trams(s.querySelector(".pt-lm") as HTMLElement, 2);
      };
    });
    return () => mm.revert();
  }, [coses.length]);

  return (
    <section ref={seccioRef} id="pendiente" className="pt-seccio pt-pend" aria-labelledby="pt-pend-titol">
      <div className="contenidor">
        <div className="pt-centre">
          <p className="pt-retol">{t("portada.pendent.retol")}</p>
          <h2 id="pt-pend-titol" className="pt-h2">{t("portada.pendent.titol")}</h2>
          <p className="pt-lead">{t("portada.pendent.lead")}</p>
        </div>
        <div className="pt-u">
          <div className="pt-u-esq">
            <p className="pt-compte">
              <span className="pt-num pt-u-n">{String(coses.length)}</span>
              <span className="pt-num-t">{t("portada.pendent.fet_1")}<br />{t("portada.pendent.fet_2")}</span>
            </p>
            <div className="pt-u-cos">
              {/* la que passa ara (només mentre corre el dia; la llista de sota ja les diu totes) */}
              <div className="pt-u-ara" aria-hidden="true">
                {coses.map((c, i) => (
                  <p key={i}><small>{nomsTrams[tramDe(i, coses.length)]}</small><b>{c.titol}</b><span>{c.detall}</span></p>
                ))}
              </div>
              <ul className="pt-u-totes">
                {coses.map((c, i) => <li key={i}><Check className="pt-ic" strokeWidth={2.6} aria-hidden="true" />{c.titol}</li>)}
              </ul>
            </div>
          </div>
          <div className="pt-u-mig">
            <PantallaApp diaSencer />
            <div className="pt-lm" aria-hidden="true">
              <div className="pt-lm-pista"><span className="pt-lm-ple" /></div>
              <span className="pt-lm-punt" />
              <div className="pt-lm-trams">
                {nomsTrams.map((nom, i) => <span key={i} className={i === nomsTrams.length - 1 ? "on" : undefined}>{nom}</span>)}
              </div>
            </div>
          </div>
          <div className="pt-u-dreta">
            <p className="pt-compte">
              <span className="pt-num pt-num-blau">1</span>
              <span className="pt-num-t">{t("portada.pendent.tu_1")}<br />{t("portada.pendent.tu_2")}</span>
            </p>
            <p className="pt-u-perti">{t("portada.pendent.incidencia")}</p>
            <span className="pt-boto-blau" aria-hidden="true">{t("portada.pendent.veure")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
