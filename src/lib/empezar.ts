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
import { origenDeLaVisita } from "@/lib/leads";

export type EstatEmpezar = { desde?: string };

/**
 * L'alta a l'app amb el que ja sabem (21-10-2026).
 *
 * Abans tots els botons portaven a `signup?pla=gratuit` i prou: qui havia escrit nom i
 * telèfon a la landing els havia de tornar a escriure, en català encara que vingués de
 * /es, i qui volia el Completo acabava fent-se un compte gratuït. Ara l'adreça porta el
 * pla, l'idioma i d'on ve la visita (UTM); el nom, el telèfon i el correu van darrere de
 * `#`, que el navegador no envia a cap servidor ni deixa als registres. L'app ho llegeix
 * i ho esborra de l'adreça (`dadesDeLaWeb` del core de l'app).
 */
export function urlAlta(
  pla: "gratuit" | "completo",
  dades: { nom?: string | null; telefon?: string | null; correu?: string | null; lang?: string } = {},
): string {
  const consulta = new URLSearchParams({ pla });
  if (dades.lang) consulta.set("lang", dades.lang);
  for (const [k, v] of Object.entries(origenDeLaVisita())) consulta.set(k, v);
  const privat = new URLSearchParams();
  if (dades.nom?.trim()) privat.set("nom", dades.nom.trim());
  if (dades.telefon?.trim()) privat.set("tel", dades.telefon.trim());
  if (dades.correu?.trim()) privat.set("email", dades.correu.trim());
  const cua = privat.toString();
  return `https://app.hostlylabs.com/signup?${consulta.toString()}${cua ? `#${cua}` : ""}`;
}

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
