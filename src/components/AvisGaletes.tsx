/**
 * El bàner de galetes: es pregunta un cop. Sense resposta, no es carrega res de Google ni de Meta
 * (`src/lib/galetes.ts`).
 *
 * 23-10-2026 (el Biel: «el truc que fa servir molta gent»): més petit i amb dos botons, «Aceptar» i «Solo
 * necesarias», i un enllaç petit, «Personalizar», que obre les tres finalitats: les necessàries (sempre actives),
 * l'analítica i la publicitat, cadascuna amb el seu sí o no (guia de l'AEPD: rebutjar ha de ser tan fàcil com
 * acceptar, des del primer nivell, i res marcat d'entrada). Meta és publicitat, no una galeta necessària: si es
 * posés a les necessàries es carregaria sense permís (art. 22.2 LSSI). Qui accepta després d'haver deixat el
 * telèfon no es perd per als anuncis: el «Lead» surt en aquell moment (`seguiment.ts`, els pendents).
 * Sense publicitat configurada, el bàner és el d'abans: només analítica.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { useLang } from "@/i18n/useLang";
import { consentiment, desaConsentiment } from "@/lib/galetes";
import { EINES_PUBLICITAT, hiHaPublicitat } from "@/lib/seguiment";
import { cn } from "@/lib/utils";

function Interruptor({ id, titol, text, valor, onCanvia }: { id: string; titol: string; text: string; valor: boolean; onCanvia: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex items-start justify-between gap-4 py-2.5 cursor-pointer">
      <span>
        <span className="block text-sm font-semibold text-foreground">{titol}</span>
        <span className="block text-xs text-muted-foreground leading-relaxed mt-0.5">{text}</span>
      </span>
      <span className="relative shrink-0 mt-0.5">
        <input id={id} type="checkbox" role="switch" checked={valor} onChange={(e) => onCanvia(e.target.checked)} className="peer sr-only" />
        <span
          aria-hidden="true"
          className={cn(
            "block w-11 h-6 rounded-full transition-colors duration-200 peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20",
            valor ? "bg-primary" : "bg-slate-300",
          )}
        />
        <span
          aria-hidden="true"
          className={cn("absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200", valor && "translate-x-5")}
        />
      </span>
    </label>
  );
}

export default function AvisGaletes() {
  const { t } = useTranslation("common");
  const reduir = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [configurant, setConfigurant] = useState(false);
  const [analitica, setAnalitica] = useState(false);
  const [publicitat, setPublicitat] = useState(false);
  const ambPublicitat = hiHaPublicitat();
  // «Instagram, Facebook, Google y YouTube», segons el que hi hagi configurat (a «Configurar»). El bàner
  // en si, curt i sense noms (el Biel, 17-10: «només el necessari»); els noms, aquí i a la política.
  const { lang } = useLang();
  const llista = (xs: string[]) =>
    xs.length <= 1 ? xs[0] ?? "" : `${xs.slice(0, -1).join(", ")}${lang === "ca" ? " i " : " y "}${xs[xs.length - 1]}`;
  const llocs = llista([...(EINES_PUBLICITAT.meta ? ["Instagram", "Facebook"] : []), ...(EINES_PUBLICITAT.google ? ["Google", "YouTube"] : [])]);

  useEffect(() => {
    // Un moment de marge: que no tapi l'entrada de la portada just en obrir.
    const id = window.setTimeout(() => setVisible(consentiment() === null), 1200);
    const torna = () => { setConfigurant(false); setVisible(consentiment() === null); };
    window.addEventListener("hostly:galetes", torna);
    return () => { window.clearTimeout(id); window.removeEventListener("hostly:galetes", torna); };
  }, []);

  function respon(analitiques: boolean, publi: boolean) {
    desaConsentiment(analitiques, publi);
    setVisible(false);
  }

  const boto = "h-11 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";
  const enllac = "underline underline-offset-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t("galetes.titol")}
          initial={reduir ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduir ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduir ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="pt-galetes fixed z-[60] bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-sm rounded-2xl bg-white border border-slate-200 shadow-[0_14px_40px_rgba(15,23,42,0.16)] px-4 py-3 max-h-[calc(100dvh-24px)] overflow-y-auto"
          style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          {ambPublicitat && configurant ? (
            <>
              <p className="text-sm font-semibold text-foreground">{t("galetes.configurar_titol")}</p>
              <div className="mt-1 divide-y divide-slate-100 border-b border-slate-100">
                <div className="flex items-start justify-between gap-4 py-2.5">
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{t("galetes.necessaries_titol")}</span>
                    <span className="block text-xs text-muted-foreground leading-relaxed mt-0.5">{t("galetes.necessaries_text")}</span>
                  </span>
                  <span className="shrink-0 mt-0.5 text-xs font-semibold text-muted-foreground">{t("galetes.sempre")}</span>
                </div>
                <Interruptor id="galeta-analitica" titol={t("galetes.analitica_titol")} text={t("galetes.analitica_text")} valor={analitica} onCanvia={setAnalitica} />
                <Interruptor id="galeta-publicitat" titol={t("galetes.publicitat_titol")} text={t("galetes.publicitat_text", { llocs })} valor={publicitat} onCanvia={setPublicitat} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => respon(analitica, publicitat)} className={cn(boto, "border border-slate-200 bg-white text-foreground hover:bg-slate-50")}>
                  {t("galetes.desar_tria")}
                </button>
                <button type="button" onClick={() => respon(true, true)} className={cn(boto, "bg-foreground text-white hover:opacity-90")}>
                  {t("galetes.acceptar_totes")}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[12.5px] text-foreground leading-[1.45]">
                {ambPublicitat ? t("galetes.text_curt") : t("galetes.text")}{" "}
                <LangLink to="/cookies" className={enllac}>
                  {t("galetes.mes")}
                </LangLink>
                {ambPublicitat && (
                  <>
                    {" · "}
                    <button type="button" onClick={() => setConfigurant(true)} className={enllac}>
                      {t("galetes.personalitzar")}
                    </button>
                  </>
                )}
              </p>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => respon(false, false)} className={cn(boto, "border border-slate-200 bg-white text-foreground hover:bg-slate-50")}>
                  {ambPublicitat ? t("galetes.necessaries") : t("galetes.rebutjar")}
                </button>
                <button type="button" onClick={() => respon(true, true)} className={cn(boto, "bg-foreground text-white hover:opacity-90")}>
                  {t("galetes.acceptar")}
                </button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
