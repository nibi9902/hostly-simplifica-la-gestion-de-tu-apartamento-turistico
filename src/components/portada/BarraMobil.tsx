/**
 * Al mòbil, una barra fixa a baix amb «Empezar» i «Llámame» (revisió de màrqueting del 15-10: qui ve
 * d'un anunci decideix amb el polze, i abans hi havia 4,6 pantalles seguides sense cap botó).
 * Surt quan ja has passat l'entrada (que té el seu botó) i s'amaga quan arriben els preus, que ja en
 * tenen, i tot el que ve després (les preguntes, el «Llámame» i el peu). Només al mòbil (CSS).
 * A la pàgina dels anuncis, l'entrada és el seu hero i s'amaga al bloc final (`entrada`, `fins`).
 * Mentre escrius en un camp també se'n va, perquè no quedi enganxada a sobre del teclat (17-10).
 */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function BarraMobil({ onEmpezar, entrada: selEntrada = ".pt-entrada", fins = "precios" }: { onEmpezar: () => void; entrada?: string; fins?: string }) {
  const { t } = useTranslation("home");
  const [vista, setVista] = useState(false);
  const [escrivint, setEscrivint] = useState(false);

  useEffect(() => {
    const mira = () => {
      const entrada = document.querySelector(selEntrada);
      const preus = document.getElementById(fins);
      const passada = entrada ? entrada.getBoundingClientRect().bottom < 40 : window.scrollY > 400;
      const abansDelsPreus = preus ? preus.getBoundingClientRect().top > window.innerHeight * 0.85 : true;
      setVista(passada && abansDelsPreus);
    };
    mira();
    window.addEventListener("scroll", mira, { passive: true });
    window.addEventListener("resize", mira);
    return () => { window.removeEventListener("scroll", mira); window.removeEventListener("resize", mira); };
  }, [selEntrada, fins]);

  useEffect(() => {
    const esCamp = (el: EventTarget | null) =>
      el instanceof HTMLElement && el.matches('input:not([type="checkbox"]):not([type="radio"]), textarea, select, [contenteditable="true"]');
    const entra = (e: FocusEvent) => { if (esCamp(e.target)) setEscrivint(true); };
    const surt = (e: FocusEvent) => setEscrivint(esCamp(e.relatedTarget));
    document.addEventListener("focusin", entra);
    document.addEventListener("focusout", surt);
    return () => { document.removeEventListener("focusin", entra); document.removeEventListener("focusout", surt); };
  }, []);

  const mostra = vista && !escrivint;

  return (
    <div className={`pt-seccio pt-barra-mobil${mostra ? " vista" : ""}`} aria-hidden={!mostra}>
      <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-pri" tabIndex={mostra ? 0 : -1}>{t("portada.entrada.empezar")}</button>
      <a href="#llamame" className="pt-pill pt-pill-sec" tabIndex={mostra ? 0 : -1}>{t("portada.truca.boto")}</a>
    </div>
  );
}
