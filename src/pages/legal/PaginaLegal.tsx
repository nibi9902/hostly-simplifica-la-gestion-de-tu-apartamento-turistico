import { useRef, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { IndexLateral, useTitols } from "@/components/IndexLateral";
import { cn } from "@/lib/utils";

const PAGINES = [
  { clau: "privacidad", href: "/privacidad" },
  { clau: "cookies", href: "/cookies" },
  { clau: "terminos", href: "/terminos" },
  { clau: "aviso", href: "/aviso-legal" },
] as const;

/**
 * Les quatre pàgines legals (10-10-2026). El títol, a la línia de tot el web; a sota, a l'ordinador,
 * l'índex dels apartats i les altres pàgines legals a l'esquerra i el text a la dreta (abans, una
 * columna de 768 px al mig). Al mòbil, l'índex és un desplegable abans del text.
 */
export default function PaginaLegal({ titol, actual, children }: { titol: string; actual: (typeof PAGINES)[number]["clau"]; children: ReactNode }) {
  const { t } = useTranslation("legal");
  const { t: tHome } = useTranslation("home");
  const cos = useRef<HTMLDivElement>(null);
  const { titols, actiu } = useTitols(cos);

  return (
    <div className="pt-28 pb-24">
      <div className="contenidor">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t("common.eyebrow")}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-2">{titol}</h1>
        <p className="text-sm text-slate-500 mb-10">{t("common.last_updated", { date: t("common.last_updated_value") })}</p>

        {/* Al mòbil: l'índex, plegat */}
        {titols.length > 1 && (
          <details className="group lg:hidden mb-8 rounded-2xl border border-slate-200 bg-white">
            <summary className="flex items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-foreground cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              {t("common.index")}
              <ChevronDown className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <ol className="px-5 pb-4 space-y-2 text-sm">
              {titols.map((h) => (
                <li key={h.id}><a href={`#${h.id}`} className="text-slate-600 hover:text-foreground">{h.text}</a></li>
              ))}
            </ol>
          </details>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28 space-y-10">
              <IndexLateral titol={t("common.index")} titols={titols} actiu={actiu} />
              <nav aria-label={t("common.otras")} className="text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-3">{t("common.otras")}</p>
                <ul className="space-y-2">
                  {PAGINES.map((p) => (
                    <li key={p.clau}>
                      <LangLink
                        to={p.href}
                        aria-current={p.clau === actual ? "page" : undefined}
                        className={cn("transition-colors", p.clau === actual ? "text-foreground font-medium" : "text-slate-500 hover:text-foreground")}
                      >
                        {tHome(`footer.links.${p.clau}`)}
                      </LangLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
          <div ref={cos} className="min-w-0 prose prose-slate prose-base max-w-[72ch] lg:col-span-9 [&_h2]:scroll-mt-28 [&>h2:first-child]:mt-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
