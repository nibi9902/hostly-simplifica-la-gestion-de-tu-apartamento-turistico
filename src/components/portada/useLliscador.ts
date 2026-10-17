/**
 * Al mòbil, una tira de peces que llisca amb el dit i, a sota, els punts que diuen on ets (opcions 2A,
 * 3B, 8B i 9A del Biel, 17-10). El lliscament és només CSS (`.pt-llisca`, dins de `max-width: 640px`):
 * a l'ordinador i a la tauleta les mateixes peces es queden a la seva graella i els punts no surten.
 *
 * `useLliscador` diu quina peça tens davant (la més propera a la vora d'inici) i hi porta quan toques
 * un punt (`PuntsLliscador`). Les distàncies es mesuren a la pantalla, com feia el carrusel del Completo.
 */
import { useCallback, useRef, useState } from "react";

export function useLliscador<T extends HTMLElement = HTMLDivElement>(peces = ":scope > *") {
  const ref = useRef<T>(null);
  const [pas, setPas] = useState(0);
  const llista = useCallback(() => [...(ref.current?.querySelectorAll<HTMLElement>(peces) ?? [])], [peces]);
  const vora = (g: HTMLElement) => g.getBoundingClientRect().left + (parseFloat(getComputedStyle(g).scrollPaddingInlineStart) || 0);

  const vesA = useCallback((i: number) => {
    const g = ref.current;
    const p = llista()[i];
    if (!g || !p) return;
    const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    g.scrollTo({ left: g.scrollLeft + p.getBoundingClientRect().left - vora(g), behavior: quiet ? "auto" : "smooth" });
  }, [llista]);

  const enLliscar = useCallback(() => {
    const g = ref.current;
    if (!g) return;
    const v = vora(g);
    const dist = llista().map((p) => Math.abs(p.getBoundingClientRect().left - v));
    if (dist.length) setPas(dist.indexOf(Math.min(...dist)));
  }, [llista]);

  return { ref, pas, vesA, enLliscar };
}
