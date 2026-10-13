/**
 * «Hostly está pendiente. Tú, ya no.»
 *
 * Durant el dia, el 8 compta i les coses que fa Hostly surten a l'esquerra, a dues columnes (com al
 * «vuit i una»), una rere l'altra mentre el punt de la línia del dia avança. Al final, la segona columna
 * s'esvaeix i reapareix a sota de la primera, s'encén l'1 («cosa para ti») i, després, surt la pantalla
 * de Hostly amb l'única cosa que et necessita: una incidència greu.
 * Decisions del Biel (12 i 13-10-2026): sense jugar amb el scroll; línia «supermínima»; «primer l'1 i
 * després la pantalla»; la llista a dues columnes durant el dia («al centre i llista única queda molt
 * atapeït»); el canvi a una columna, curt i sense que res travessi la pantalla.
 *
 * Sense JavaScript o amb «reduir moviment» es veu tal com queda al final del dia.
 */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PantallaApp from "./PantallaApp";

gsap.registerPlugin(ScrollTrigger);

type Cosa = { titol: string; detall: string };

const T0 = 0.4;
/** Quant dura el dia, en segons (de «Mañana» a «Noche»). */
const DIA = 8;
const NO = { immediateRender: false };
const amb = (o: gsap.TweenVars): gsap.TweenVars => ({ ...o, ...NO });

const tots = <T extends Element>(dins: Element, s: string) => Array.from(dins.querySelectorAll<T>(s));

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
    .call(() => trams(lm, 1), undefined, T0 + 0.375 * DIA)
    .call(() => trams(lm, 2), undefined, T0 + 0.75 * DIA);
  return Array.from({ length: quantes }, (_, i) => T0 + ((i + 0.5) / quantes) * DIA);
}

/* A l'ordinador (≥ 1280 px), durant el dia la llista va a dues columnes. L'alçada del final es
   reserva des del principi: la línia de sota no es mou quan la llista canvia. */
function fase(e3: HTMLElement, f: "dia" | "final") {
  e3.classList.toggle("fase-dia", f === "dia");
  e3.classList.toggle("fase-final", f !== "dia");
}
function reserva(e3: HTMLElement) {
  const dia = e3.classList.contains("fase-dia");
  e3.style.minHeight = "";
  fase(e3, "final");
  const h = e3.offsetHeight;
  fase(e3, dia ? "dia" : "final");
  e3.style.minHeight = `${h}px`;
}
function aDia(e3: HTMLElement) {
  reserva(e3);
  fase(e3, "dia");
}
function aFinal(e3: HTMLElement) {
  // quines files canvien de lloc (la segona columna): es mira el final sense pintar-lo i es torna al dia
  const files = tots<HTMLElement>(e3, ".pt-e3-fila");
  const abans = files.map((f) => f.getBoundingClientRect());
  fase(e3, "final");
  const mouen = files.filter((f, i) => {
    const b = f.getBoundingClientRect();
    return Math.abs(b.left - abans[i].left) > 1 || Math.abs(b.top - abans[i].top) > 1;
  });
  fase(e3, "dia");
  // s'esvaeixen on són i reapareixen al lloc nou, una rere l'altra: res no travessa la pantalla
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to(mouen, { autoAlpha: 0, x: -10, filter: "blur(4px)", duration: 0.22, ease: "power2.in" })
    .call(() => fase(e3, "final"))
    .fromTo(mouen, { x: 14, filter: "blur(4px)" }, { autoAlpha: 1, x: 0, filter: "blur(0px)", duration: 0.45, stagger: 0.05 });
}

function construeix(s: HTMLElement, e3: HTMLElement, ample: boolean): gsap.core.Timeline {
  const n = s.querySelector(".pt-e3-n") as HTMLElement;
  const items = tots<HTMLElement>(s, ".pt-e3-fila");
  const lm = s.querySelector(".pt-lm") as HTMLElement;
  const pant = s.querySelector(".pt-e3-pant");
  const dreta = tots(s, ".pt-e3-dreta > *");
  const pieter = s.querySelector(".pt-targ-pieter");
  const anell = s.querySelector(".pt-pantalla .pt-anell");

  // Abans d'arribar-hi, el dia encara no ha començat: res fet, el comptador a 0 i el punt a l'esquerra
  if (ample) aDia(e3);
  gsap.set([pant, ...dreta, ...items], { autoAlpha: 0 });
  gsap.set(lm.querySelector(".pt-lm-ple"), { width: "0%" });
  gsap.set(lm.querySelector(".pt-lm-punt"), { left: "0%" });
  trams(lm, 0);
  n.textContent = "0";

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  tl.call(() => { if (ample) aDia(e3); }, undefined, 0)
    .set(pant, amb({ autoAlpha: 0, y: 24, scale: 0.96, filter: "blur(6px)" }), 0)
    .set(dreta, amb({ autoAlpha: 0, y: 12 }), 0)
    .set(items, amb({ autoAlpha: 0, y: 6, filter: "blur(4px)" }), 0)
    .set(items.map((f) => f.querySelector(".pt-e3-lava")), amb({ opacity: 0 }), 0)
    .set(items.map((f) => f.querySelector(".pt-e3-marca")), amb({ scale: 0.6 }), 0)
    .set(pieter, amb({ autoAlpha: 0, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: -14 }), 0)
    .set(anell, amb({ autoAlpha: 0 }), 0)
    .call(() => { n.textContent = "0"; }, undefined, 0);
  liniaMinima(tl, lm, items.length).forEach((t, i) => {
    const f = items[i];
    const lava = f.querySelector(".pt-e3-lava");
    tl.to(f, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7 }, t)
      .to(f.querySelector(".pt-e3-marca"), { scale: 1, duration: 0.6 }, t + 0.1)
      .to(lava, { opacity: 1, duration: 0.35, ease: "sine.out" }, t)
      .to(lava, { opacity: 0, duration: 1.1, ease: "sine.inOut" }, t + 0.6)
      .call(() => { n.textContent = String(i + 1); }, undefined, t + 0.05);
  });
  // al final: la llista es fa d'una columna, primer l'1 («cosa para ti») i, després, la pantalla que l'ensenya
  const tf = T0 + DIA + 0.5;
  tl.call(() => { if (ample) aFinal(e3); }, undefined, tf)
    .to(dreta, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.12 }, tf + 0.6)
    .to(pant, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1 }, tf + 2.0)
    .to(pieter, { autoAlpha: 1, height: "auto", paddingTop: 20, paddingBottom: 20, marginBottom: 0, duration: 0.8 }, tf + 2.9)
    .to(anell, { autoAlpha: 1, duration: 0.9, ease: "sine.out" }, tf + 3.5);
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
    const e3 = s.querySelector(".pt-e3") as HTMLElement;
    const lm = s.querySelector(".pt-lm") as HTMLElement;
    const quantes = tots(s, ".pt-e3-fila").length;
    const mm = gsap.matchMedia();
    mm.add({ ample: "(min-width: 1280px)", redueix: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      const { ample, redueix } = ctx.conditions as { ample: boolean; redueix: boolean };
      if (redueix) return;
      const tl = construeix(s, e3, ample);
      // es mou sol quan el tens davant (sense tocar el scroll)
      ScrollTrigger.create({ trigger: e3, start: "top 70%", once: true, onEnter: () => { tl.play(0); } });
      // en desfer-se (canvi de mida, reduir moviment), la secció torna a quedar sencera, al final del dia
      return () => {
        tl.kill();
        e3.style.minHeight = "";
        fase(e3, "final");
        (s.querySelector(".pt-e3-n") as HTMLElement).textContent = String(quantes);
        trams(lm, 2);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={seccioRef} id="pendiente" className="pt-seccio pt-pend" aria-labelledby="pt-pend-titol">
      <div className="contenidor">
        <div className="pt-centre">
          <p className="pt-retol">{t("portada.pendent.retol")}</p>
          <h2 id="pt-pend-titol" className="pt-h2">{t("portada.pendent.titol")}</h2>
          <p className="pt-lead">{t("portada.pendent.lead")}</p>
        </div>
        <div className="pt-e3 fase-final">
          <div className="pt-e3-esq">
            <p className="pt-compte">
              <span className="pt-num pt-e3-n">{String(coses.length)}</span>
              <span className="pt-num-t">{t("portada.pendent.fet_1")}<br />{t("portada.pendent.fet_2")}</span>
            </p>
            <ol className="pt-e3-llista">
              {coses.map((c, i) => (
                <li key={i} className="pt-e3-fila">
                  <span className="pt-e3-lava" aria-hidden="true" />
                  <span className="pt-e3-marca" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <p><b>{c.titol}</b><span className="pt-e3-det">{c.detall}</span></p>
                </li>
              ))}
            </ol>
          </div>
          <div className="pt-e3-pant">
            <PantallaApp />
          </div>
          <div className="pt-e3-dreta">
            <p className="pt-compte">
              <span className="pt-num pt-num-blau">1</span>
              <span className="pt-num-t">{t("portada.pendent.tu_1")}<br />{t("portada.pendent.tu_2")}</span>
            </p>
            <p className="pt-u-perti">{t("portada.pendent.incidencia")}</p>
            <span className="pt-boto-blau" aria-hidden="true">{t("portada.pendent.veure")}</span>
          </div>
        </div>
        <div className="pt-lm" aria-hidden="true">
          <div className="pt-lm-pista"><span className="pt-lm-ple" /></div>
          <span className="pt-lm-punt" />
          <div className="pt-lm-trams">
            {nomsTrams.map((nom, i) => <span key={i} className={i === nomsTrams.length - 1 ? "on" : undefined}>{nom}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
