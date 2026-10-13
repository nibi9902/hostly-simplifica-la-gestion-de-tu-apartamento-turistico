/**
 * L'entrada de la portada: només el lema, amb el mateix aspecte i la mateixa animació que tenia
 * l'entrada d'abans (CinematicHero). Decisió del Biel (13-10-2026): «l'entrada només volia que fos la
 * part del "¿Gestionas apartamentos en Airbnb? ¿O te gestionan ellos a ti?"». La targeta blava, el
 * telèfon i el tram de pantalla fixat ja no hi són.
 *
 * El capçal surt quan acaba d'aparèixer «…apartamento turístico.» (`hostly:hero-intro-done`), no al
 * final de tot (el Biel, 13-10: «hauria d'anar per quan acabi apartamento turístico»). Quan acaba
 * l'animació, la pàgina baixa una mica sola fins que treu el cap la targeta del 0 €, perquè es vegi
 * que hi ha més a sota: un cop per sessió, només si la persona encara és a dalt i no ha tocat res, i
 * s'atura si mentrestant fa scroll. La segona línia es pinta amb un degradat: el farciment de
 * `.pt-lema-2` fa que el «¿» i la «g» no quedin tallats.
 */
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ArrowDown } from "lucide-react";

const CLAU_PISTA = "hostly_pista_baixa";

export default function Entrada() {
  const { t } = useTranslation("home");
  const ref = useRef<HTMLElement>(null);

  // Abans de pintar, perquè el lema no aparegui un instant i després s'amagui
  useLayoutEffect(() => {
    const s = ref.current;
    if (!s) return;
    const avisa = () => window.dispatchEvent(new CustomEvent("hostly:hero-intro-done"));
    const q = (c: string) => s.querySelector(c) as HTMLElement;
    const l1 = q(".pt-lema-1"), l2 = q(".pt-lema-2"), sub = q(".pt-entrada-sub"), cue = q(".pt-cue");

    // Qualsevol gest de la persona mana més que la pista
    let tocat = false;
    let pista: gsap.core.Tween | null = null;
    const paraPista = () => { pista?.kill(); pista = null; };
    const haTocat = () => { tocat = true; paraPista(); };
    const gestos = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    gestos.forEach((g) => window.addEventListener(g, haTocat, { passive: true }));

    const baixa = () => {
      let feta = false;
      try {
        feta = sessionStorage.getItem(CLAU_PISTA) === "1";
        sessionStorage.setItem(CLAU_PISTA, "1");
      } catch { /* sense memòria de sessió, es fa igualment */ }
      if (feta || tocat || window.scrollY > 8 || document.visibilityState !== "visible") return;
      const zero = document.querySelector("#cero .pt-zf");
      if (!zero) return;
      const alt = window.innerHeight;
      // que es vegin uns 110 px de la targeta del 0 €, sense baixar més del 22 % de la pantalla
      const fins = Math.round(Math.min(zero.getBoundingClientRect().top + window.scrollY + 110 - alt, alt * 0.22));
      if (fins <= 0) return;
      const pos = { y: window.scrollY };
      let posat = pos.y;
      pista = gsap.to(pos, {
        y: fins,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          // si una altra cosa ha mogut la pàgina (un enllaç, el teclat), la pista s'aparta
          if (Math.abs(window.scrollY - posat) > 2) { paraPista(); return; }
          posat = Math.round(pos.y);
          window.scrollTo(0, posat);
        },
        onComplete: () => { pista = null; },
      });
    };

    const mm = gsap.matchMedia();
    // Les dues condicions: GSAP només crida la funció si se'n compleix alguna. Amb només «reduce»,
    // l'animació no corria mai (fins al 13-10 el lema sortia quiet per a tothom).
    mm.add({ mou: "(prefers-reduced-motion: no-preference)", redueix: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      if ((ctx.conditions as { redueix: boolean }).redueix) { avisa(); return; }
      gsap.set(l1, { autoAlpha: 0, y: 60, scale: 0.85, filter: "blur(20px)", rotationX: -20 });
      gsap.set(l2, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(sub, { autoAlpha: 0, y: 24 });
      gsap.set(cue, { autoAlpha: 0, y: 8 });
      gsap.timeline({ delay: 0.3 })
        .to(l1, { duration: 1.8, autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", rotationX: 0, ease: "expo.out" })
        // en acabar es treu el retall, que si no també talla l'ombra de les lletres
        .to(l2, { duration: 1.4, clipPath: "inset(0 0% 0 0)", ease: "power4.inOut", clearProps: "clipPath" }, "-=1.0")
        .to(sub, { duration: 1.0, autoAlpha: 1, y: 0, ease: "expo.out" }, "-=0.4")
        // amb «expo.out», a mig segon el subtítol ja s'hi veu sencer: llavors surt el capçal
        .call(avisa, undefined, "<0.45")
        .to(cue, { duration: 0.6, autoAlpha: 1, y: 0, ease: "power3.out" }, "+=0.1")
        .call(baixa, undefined, "+=0.5");
    });
    return () => {
      mm.revert();
      paraPista();
      gestos.forEach((g) => window.removeEventListener(g, haTocat));
    };
  }, []);

  return (
    // Ocupa tota la pantalla a propòsit: la prova de l'amplada no hi busca la línia del contingut
    <section ref={ref} className="pt-seccio pt-entrada" data-amplada="vora">
      <div className="pt-reixa" aria-hidden="true" />
      <div className="pt-gra" aria-hidden="true" />
      <div className="pt-entrada-in">
        <h1 className="sr-only">{t("hero.h1_line1")} {t("hero.h1_line2")}</h1>
        <span aria-hidden="true" className="pt-lema-1">{t("hero.h1_line1")}</span>
        <span aria-hidden="true" className="pt-lema-2">{t("hero.h1_line2")}</span>
        <p className="pt-entrada-sub">{t("hero.subtitle")}</p>
      </div>
      <a className="pt-cue" href="#cero" aria-label={t("portada.entrada.baixa")}>
        <ArrowDown className="pt-ic" aria-hidden="true" />
      </a>
    </section>
  );
}
