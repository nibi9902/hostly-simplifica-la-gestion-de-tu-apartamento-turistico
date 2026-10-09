/**
 * El bàner de galetes: es pregunta un cop, «Rechazar» tan a mà com «Aceptar».
 * Sense resposta, Google Analytics no es carrega (`src/lib/galetes.ts`).
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { consentiment, desaConsentiment } from "@/lib/galetes";

export default function AvisGaletes() {
  const { t } = useTranslation("common");
  const reduir = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Un moment de marge: que no tapi l'entrada de la portada just en obrir.
    const id = window.setTimeout(() => setVisible(consentiment() === null), 1200);
    const torna = () => setVisible(consentiment() === null);
    window.addEventListener("hostly:galetes", torna);
    return () => { window.clearTimeout(id); window.removeEventListener("hostly:galetes", torna); };
  }, []);

  function respon(analitiques: boolean) {
    desaConsentiment(analitiques);
    setVisible(false);
  }

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
            {t("galetes.text")}{" "}
            <LangLink to="/cookies" className="underline underline-offset-2 text-muted-foreground hover:text-foreground">
              {t("galetes.mes")}
            </LangLink>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => respon(false)}
              className="h-11 rounded-full border border-slate-200 bg-white text-sm font-semibold text-foreground hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              {t("galetes.rebutjar")}
            </button>
            <button
              type="button"
              onClick={() => respon(true)}
              className="h-11 rounded-full bg-foreground text-sm font-semibold text-white hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              {t("galetes.acceptar")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
