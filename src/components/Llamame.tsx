/**
 * «¿Prefieres hablarlo? Déjame tu número y te llamo hoy.» — signat pel Biel.
 *
 * Va sota els preus: és on algú que dubta del preu decideix. Un camp i un botó; el
 * telèfon arriba al Biel per Telegram en menys d'un minut (`web_leads`, origen
 * `llamame`). Decisió del 09-10-2026: el telèfon de tothom que s'hi hagi interessat,
 * i que hi surti ell, no unes assessores inventades.
 */
import { useState, type FormEvent } from "react";
import { Check, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/i18n/useLang";
import { LangLink } from "@/i18n/LangLink";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { dadesRecordades, desaLead, recordaDades, telefonPerBD } from "@/lib/leads";

export default function Llamame({ className }: { className?: string }) {
  const { t } = useTranslation("embut");
  const { lang } = useLang();
  const [telefon, setTelefon] = useState(() => {
    const p = dadesRecordades().phone;
    return p ? `+${p}` : "";
  });
  const [error, setError] = useState<string | null>(null);
  const [desant, setDesant] = useState(false);
  const [fet, setFet] = useState(false);

  async function envia(e: FormEvent) {
    e.preventDefault();
    const tel = await telefonPerBD(telefon);
    if (!tel) { setError(t("empezar.error.telefono")); return; }
    setDesant(true);
    const r = await desaLead({ phone: tel, source: "llamame" }, lang);
    setDesant(false);
    if (!r.ok) { setError(r.motiu === "telefon" ? t("empezar.error.telefono") : t("empezar.error.guardar")); return; }
    recordaDades({ phone: tel });
    track("llamame_enviado");
    setFet(true);
  }

  return (
    <div className={cn("rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center gap-6", className)}>
      <div className="flex items-start gap-4 md:flex-1">
        <span className="w-12 h-12 rounded-full bg-foreground text-white flex items-center justify-center font-semibold text-lg shrink-0" aria-hidden="true">
          B
        </span>
        <div>
          <p className="text-lg font-bold text-foreground tracking-tight">{t("llamame.titulo")}</p>
          <p className="text-sm text-muted-foreground">{t("llamame.texto")}</p>
          <p className="text-xs text-muted-foreground/80 mt-1">{t("llamame.firma")}</p>
        </div>
      </div>

      {fet ? (
        <p className="md:flex-1 flex items-center gap-2 text-emerald-700 font-semibold" role="status">
          <Check className="w-5 h-5" strokeWidth={2.5} />
          {t("llamame.hecho")}
        </p>
      ) : (
        <form onSubmit={envia} noValidate className="md:flex-1">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <label htmlFor="llamame-tel" className="sr-only">{t("empezar.datos.telefono")}</label>
            <input
              id="llamame-tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telefon}
              onChange={(e) => { setTelefon(e.target.value); setError(null); }}
              placeholder={t("llamame.placeholder")}
              aria-invalid={!!error}
              aria-describedby={error ? "llamame-error" : undefined}
              className={cn(
                "flex-1 min-w-0 h-12 px-5 rounded-full border bg-white text-base text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary",
                error ? "border-rose-300" : "border-slate-200",
              )}
            />
            <button
              type="submit"
              disabled={desant}
              className="h-12 px-6 rounded-full bg-foreground text-white font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 shrink-0"
            >
              {desant ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Phone className="w-4 h-4" />
                  {t("llamame.boton")}
                </>
              )}
            </button>
          </div>
          {error && <p id="llamame-error" className="mt-2 text-sm text-rose-600">{error}</p>}
          <p className="mt-2 text-xs text-muted-foreground">
            {t("empezar.datos.privacidad_antes")}{" "}
            <LangLink to="/privacidad" className="underline underline-offset-2 hover:text-foreground">
              {t("empezar.datos.privacidad_link")}
            </LangLink>
            .
          </p>
        </form>
      )}
    </div>
  );
}
