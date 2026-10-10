import { useEffect, useState, type RefObject, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

/**
 * L'índex del costat dels textos llargs (articles del blog i pàgines legals), a l'ordinador.
 * 10-10-2026: abans aquestes pàgines eren una columna de 768 px al mig de la pantalla; ara el
 * text ocupa la seva columna i, al costat, l'índex diu on ets i et porta a cada apartat.
 * Es construeix sol a partir dels h2 del text (no s'ha de mantenir cap llista a mà).
 */

export type Titol = { id: string; text: string };

/** «2. Datos que recogemos» → «datos-que-recogemos» */
export function slugTitol(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^\s*\d+[.)]\s*/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Els h2 d'un bloc (els hi posa un id si no en tenen) i quin és el que es llegeix ara. */
export function useTitols(ref: RefObject<HTMLElement>, clau?: unknown): { titols: Titol[]; actiu: string | null } {
  const [titols, setTitols] = useState<Titol[]>([]);
  const [actiu, setActiu] = useState<string | null>(null);

  useEffect(() => {
    const arrel = ref.current;
    if (!arrel) return;
    const usats = new Set<string>();
    const hs = Array.from(arrel.querySelectorAll("h2"));
    setTitols(
      hs.map((h) => {
        const text = (h.textContent || "").trim();
        const base = h.id || slugTitol(text) || "apartat";
        let id = base;
        for (let n = 2; usats.has(id); n++) id = `${base}-${n}`;
        usats.add(id);
        h.id = id;
        return { id, text };
      }),
    );
    // L'apartat actiu: l'últim títol que ja ha passat per sota del capçal (en baixar i en pujar;
    // abans del primer, cap)
    let marc = 0;
    const mira = () => {
      marc = 0;
      let id: string | null = null;
      for (const h of hs) {
        if (h.getBoundingClientRect().top <= 140) id = h.id;
        else break;
      }
      setActiu(id);
    };
    const enScroll = () => { if (!marc) marc = requestAnimationFrame(mira); };
    mira();
    window.addEventListener("scroll", enScroll, { passive: true });
    window.addEventListener("resize", enScroll);
    return () => {
      window.removeEventListener("scroll", enScroll);
      window.removeEventListener("resize", enScroll);
      if (marc) cancelAnimationFrame(marc);
    };
  }, [ref, clau]);

  return { titols, actiu };
}

function baixa(e: MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduir ? "auto" : "smooth", block: "start" });
  try { history.replaceState(history.state, "", `#${id}`); } catch { /* res */ }
}

export function IndexLateral({ titol, titols, actiu }: { titol: string; titols: Titol[]; actiu: string | null }) {
  if (titols.length < 2) return null;
  return (
    <nav aria-label={titol} className="text-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">{titol}</p>
      <ol className="border-l border-slate-200">
        {titols.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => baixa(e, h.id)}
              aria-current={actiu === h.id ? "location" : undefined}
              className={cn(
                "block -ml-px border-l-2 pl-4 py-1.5 leading-snug transition-colors duration-200",
                actiu === h.id ? "border-primary text-foreground font-medium" : "border-transparent text-slate-500 hover:text-foreground",
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
