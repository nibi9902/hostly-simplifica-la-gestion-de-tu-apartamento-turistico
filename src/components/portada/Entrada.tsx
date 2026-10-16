/**
 * L'entrada de la portada: el lema, què fa Hostly en una frase i el botó.
 *
 * Fins al 15-10 era només el lema (decisió del 13-10), amb una entrada lenta i desenfocada, el capçal
 * que no sortia fins al final i una pista que baixava la pàgina sola. La revisió de màrqueting del 15-10
 * (trànsit d'anuncis, sobretot al mòbil) va veure que no passava la prova dels 5 segons: no deia què és
 * Hostly ni hi havia res a fer. El Biel va aprovar el mockup (`docs/exploracions/2026-10-15-portada-arreglada/`):
 * - el lema es queda; a sota, què fa Hostly, literal, i la promesa dels anuncis (el check-in i la
 *   policia, gratis); un botó i «Sin tarjeta.»;
 * - el text es llegeix a l'instant (una entrada curta, sense desenfocar) i el capçal surt de seguida;
 * - l'entrada ja no ocupa tota la pantalla: es veu el cap de la targeta del 0 €, i la pista que baixava
 *   la pàgina sola ja no cal.
 * La segona línia es pinta amb un degradat: el farciment de `.pt-lema-2` fa que el «¿» i la «g» no
 * quedin tallats.
 */
import { useLayoutEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";

export default function Entrada({ onEmpezar }: { onEmpezar: () => void }) {
  const { t } = useTranslation("home");
  const ref = useRef<HTMLElement>(null);

  // Abans de pintar, perquè el lema no aparegui un instant i després s'amagui
  useLayoutEffect(() => {
    const s = ref.current;
    if (!s) return;
    // el capçal surt de seguida (el SiteHeader de la portada l'espera)
    window.dispatchEvent(new CustomEvent("hostly:hero-intro-done"));
    const q = (c: string) => s.querySelector(c) as HTMLElement;
    const l1 = q(".pt-lema-1"), l2 = q(".pt-lema-2"), resta = s.querySelectorAll(".pt-entrada-sub, .pt-entrada-accio");
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(l1, { autoAlpha: 0, y: 18 });
      gsap.set(l2, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(resta, { autoAlpha: 0, y: 12 });
      gsap.timeline({ delay: 0.05 })
        .to(l1, { duration: 0.7, autoAlpha: 1, y: 0, ease: "power3.out" })
        // en acabar es treu el retall, que si no també talla l'ombra de les lletres
        .to(l2, { duration: 0.8, clipPath: "inset(0 0% 0 0)", ease: "power3.inOut", clearProps: "clipPath" }, "-=0.45")
        .to(resta, { duration: 0.6, autoAlpha: 1, y: 0, ease: "power3.out", stagger: 0.08 }, "-=0.45");
    });
    return () => mm.revert();
  }, []);

  return (
    // Ocupa tota l'amplada a propòsit: la prova de l'amplada no hi busca la línia del contingut
    <section ref={ref} className="pt-seccio pt-entrada" data-amplada="vora">
      <div className="pt-reixa" aria-hidden="true" />
      <div className="pt-gra" aria-hidden="true" />
      <div className="pt-entrada-in">
        <h1 className="sr-only">{t("hero.h1_line1")} {t("hero.h1_line2")}</h1>
        <span aria-hidden="true" className="pt-lema-1">{t("hero.h1_line1")}</span>
        <span aria-hidden="true" className="pt-lema-2">{t("hero.h1_line2")}</span>
        <p className="pt-entrada-sub">{t("hero.subtitle")}</p>
        <div className="pt-entrada-accio">
          <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-pri pt-entrada-boto">{t("portada.entrada.empezar")}</button>
        </div>
      </div>
    </section>
  );
}
