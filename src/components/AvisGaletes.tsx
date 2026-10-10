/**
 * El bàner de galetes: es pregunta un cop, «Rechazar» tan a mà com «Aceptar».
 * Sense resposta, no es carrega res de Google ni de Meta (`src/lib/galetes.ts`).
 *
 * Des del 10-10-2026, si hi ha publicitat configurada (`src/lib/seguiment.ts`), són dues
 * finalitats i cadascuna es pot triar a part a «Configurar» (guia de l'AEPD: decidir per
 * finalitat, des del primer nivell). Sense publicitat, el bàner és el d'abans: només analítica.
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
    <label htmlFor={id} className="flex items-start justify-between gap-4 py-3 cursor-pointer">
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
  // «Meta y Google» i «Instagram, Facebook, Google y YouTube», segons el que hi hagi configurat
  const { lang } = useLang();
  const llista = (xs: string[]) =>
    xs.length <= 1 ? xs[0] ?? "" : `${xs.slice(0, -1).join(", ")}${lang === "ca" ? " i " : " y "}${xs[xs.length - 1]}`;
  const empreses = llista([EINES_PUBLICITAT.meta && "Meta", EINES_PUBLICITAT.google && "Google"].filter(Boolean) as string[]);
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
          className="fixed z-[60] bottom-4 left-4 right-4 sm:right-auto sm:max-w-md rounded-3xl bg-white border border-slate-200 shadow-[0_18px_50px_rgba(15,23,42,0.16)] p-5"
          style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <p className="text-sm text-foreground leading-relaxed">
            {ambPublicitat ? t("galetes.text_publicitat", { empreses }) : t("galetes.text")}{" "}
            <LangLink to="/cookies" className="underline underline-offset-2 text-muted-foreground hover:text-foreground">
              {t("galetes.mes")}
            </LangLink>
          </p>

          {ambPublicitat && configurant && (
            <div className="mt-3 divide-y divide-slate-100 border-y border-slate-100">
              <Interruptor id="galeta-analitica" titol={t("galetes.analitica_titol")} text={t("galetes.analitica_text")} valor={analitica} onCanvia={setAnalitica} />
              <Interruptor id="galeta-publicitat" titol={t("galetes.publicitat_titol")} text={t("galetes.publicitat_text", { llocs })} valor={publicitat} onCanvia={setPublicitat} />
            </div>
          )}

          {ambPublicitat && configurant ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => respon(false, false)} className={cn(boto, "border border-slate-200 bg-white text-foreground hover:bg-slate-50")}>
                {t("galetes.rebutjar")}
              </button>
              <button type="button" onClick={() => respon(analitica, publicitat)} className={cn(boto, "bg-foreground text-white hover:opacity-90")}>
                {t("galetes.desar")}
              </button>
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => respon(false, false)} className={cn(boto, "border border-slate-200 bg-white text-foreground hover:bg-slate-50")}>
                  {t("galetes.rebutjar")}
                </button>
                <button type="button" onClick={() => respon(true, true)} className={cn(boto, "bg-foreground text-white hover:opacity-90")}>
                  {t("galetes.acceptar")}
                </button>
              </div>
              {ambPublicitat && (
                <button
                  type="button"
                  onClick={() => setConfigurant(true)}
                  className="mt-2 w-full h-9 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  {t("galetes.configurar")}
                </button>
              )}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
