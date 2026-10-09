/**
 * L'única porta del web: «Empezar» → /empezar.
 *
 * Decisió del Biel (09-10-2026): un sol botó a tota la web. «Agendar una demo» no
 * va de primeres: «ha de voler, empezar → empezar → i al final ja li diem que primer
 * farem una demo». El telèfon s'agafa al primer pas de /empezar.
 *
 * Substitueix el `SignupModal` (que desava a la BD vella i prometia «te contactamos
 * en 24 h») i el `QuizModal` del capçal.
 */
import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLang } from "@/i18n/useLang";
import { track } from "@/lib/analytics";

export type EstatEmpezar = { desde?: string };

/** L'alta al pla gratuït de l'app (existeix des del 07-10-2026: `altaGratuita.ts`). */
export const URL_ALTA_GRATUITA = "https://app.hostlylabs.com/signup?pla=gratuit";

/** Retorna la funció que porta a /empezar recordant des de quina pàgina s'hi va. */
export function useEmpezar(): () => void {
  const navigate = useNavigate();
  const { localized } = useLang();
  const { pathname } = useLocation();
  return useCallback(() => {
    track("cta_primary_click", { location: pathname });
    navigate(localized("/empezar"), { state: { desde: pathname } satisfies EstatEmpezar });
  }, [navigate, localized, pathname]);
}
