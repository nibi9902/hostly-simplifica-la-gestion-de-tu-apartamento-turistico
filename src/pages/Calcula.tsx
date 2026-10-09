/**
 * /calcula — «¿Te sale a cuenta?». Substitueix el qüestionari de 10 preguntes
 * (`QuizModal`), que només enviava un Telegram i no desava res.
 *
 * Cinc preguntes, una per pantalla, i el resultat a la vista sense demanar res.
 * El detall eina per eina es desbloqueja amb el telèfon (decisió del Biel, 09-10-2026:
 * «sempre hem d'intentar tenir el telèfon… d'alguna manera hàbil i "guai"»). No es
 * promet enviar res per WhatsApp: Meta no deixa escriure primer a un número nou
 * sense una plantilla aprovada, i el compte encara no està verificat.
 */
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lock, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import { useLang } from "@/i18n/useLang";
import { LangLink } from "@/i18n/LangLink";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { useEmpezar } from "@/lib/empezar";
import { dadesRecordades, desaLead, recordaDades, telefonPerBD } from "@/lib/leads";
import {
  OPCIONS_DONDE, OPCIONS_HORAS, OPCIONS_PISOS, OPCIONS_QUIEN, OPCIONS_USAS,
  calcula, euros, respostesPerDesar,
  type Eina, type Respostes,
} from "@/lib/calcula";

const ease = [0.22, 1, 0.36, 1] as const;
const TOTAL = 5;

const opcio =
  "w-full min-h-14 px-5 py-3 rounded-2xl border text-left text-base font-medium flex items-center justify-between gap-3 " +
  "transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

/** Una pregunta d'una sola resposta: es tria i passa sola a la següent. */
function OpcionsSenzilles<T extends string>({ opcions, etiquetes, valor, etiqueta, onTria }: {
  opcions: readonly T[];
  etiquetes: string[];
  valor?: T;
  etiqueta: string;
  onTria: (v: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={etiqueta}>
      {opcions.map((o, i) => {
        const triada = valor === o;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={triada}
            onClick={() => onTria(o)}
            className={cn(opcio, triada ? "bg-foreground border-foreground text-white" : "bg-white border-slate-200 text-foreground hover:border-slate-300")}
          >
            {etiquetes[i]}
            {triada && <Check className="w-4 h-4 shrink-0" strokeWidth={3} />}
          </button>
        );
      })}
    </div>
  );
}

export default function Calcula() {
  const { t } = useTranslation("embut");
  const { lang } = useLang();
  const empezar = useEmpezar();
  const reduir = useReducedMotion();

  const [pas, setPas] = useState(0); // 0..4 preguntes, 5 = resultat
  const [r, setR] = useState<Partial<Respostes>>({ usas: [] });
  const [detall, setDetall] = useState(() => !!dadesRecordades().phone);
  const [telefon, setTelefon] = useState("");
  const [errorTel, setErrorTel] = useState<string | null>(null);
  const [desant, setDesant] = useState(false);
  const desat = useRef(false);

  const complet = pas === TOTAL && r.pisos && r.donde && r.horas && r.quien;
  const res = useMemo(() => (complet ? calcula(r as Respostes) : null), [complet, r]);

  // En arribar al resultat: les respostes es desen (sense telèfon encara) un sol cop.
  useEffect(() => {
    if (!res || desat.current) return;
    desat.current = true;
    track("calcula_resultado", { value: res.avui });
    void desaLead({ source: "calcula", answers: respostesPerDesar(r as Respostes, res) }, lang);
  }, [res, r, lang]);

  const anim = reduir
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, x: 16 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -12 } };

  function tria<K extends keyof Respostes>(clau: K, valor: Respostes[K]) {
    setR((x) => ({ ...x, [clau]: valor }));
    window.setTimeout(() => setPas((p) => p + 1), reduir ? 0 : 160);
  }

  function commuta(e: Eina) {
    setR((x) => {
      const ara = x.usas ?? [];
      if (e === "nada") return { ...x, usas: ara.includes("nada") ? [] : ["nada"] };
      const sense = ara.filter((y) => y !== "nada");
      return { ...x, usas: sense.includes(e) ? sense.filter((y) => y !== e) : [...sense, e] };
    });
  }

  async function desbloqueja(ev: FormEvent) {
    ev.preventDefault();
    const tel = await telefonPerBD(telefon);
    if (!tel) { setErrorTel(t("empezar.error.telefono")); return; }
    setDesant(true);
    const ok = await desaLead(
      { phone: tel, source: "calcula", answers: res ? respostesPerDesar(r as Respostes, res) : undefined },
      lang,
    );
    setDesant(false);
    if (!ok.ok) { setErrorTel(ok.motiu === "telefon" ? t("empezar.error.telefono") : t("empezar.error.guardar")); return; }
    recordaDades({ phone: tel });
    track("calcula_telefono");
    setDetall(true);
  }

  function torna() {
    setR({ usas: [] });
    desat.current = false;
    setPas(0);
  }

  const preguntes: { titol: string; ajuda?: string }[] = [
    { titol: t("calcula.q_pisos") },
    { titol: t("calcula.q_donde") },
    { titol: t("calcula.q_usas"), ajuda: t("calcula.q_usas_ayuda") },
    { titol: t("calcula.q_horas") },
    { titol: t("calcula.q_quien") },
  ];
  const oPisos = t("calcula.o_pisos", { returnObjects: true }) as string[];
  const oDonde = t("calcula.o_donde", { returnObjects: true }) as string[];
  const oHoras = t("calcula.o_horas", { returnObjects: true }) as string[];
  const oQuien = t("calcula.o_quien", { returnObjects: true }) as string[];
  const horasFrase = t("calcula.resultado.horas_frase", { returnObjects: true }) as string[];
  const horasAno = t("calcula.resultado.horas_ano_frase", { returnObjects: true }) as string[];
  const iHoras = r.horas ? OPCIONS_HORAS.indexOf(r.horas) : 0;

  return (
    <PageShell title={t("calcula.meta_title")} description={t("calcula.meta_desc")} path="/calcula">
      <section className="pt-32 md:pt-40 pb-24 px-5 sm:px-6">
        <div className="max-w-xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-3">{t("calcula.eyebrow")}</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">{t("calcula.titulo")}</h1>
          <p className="text-lg text-muted-foreground mb-10">{t("calcula.subtitulo")}</p>

          {pas < TOTAL && (
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm font-medium text-muted-foreground tabular-nums">{t("calcula.pregunta", { n: pas + 1 })}</span>
              <div className="flex gap-1.5" aria-hidden="true">
                {Array.from({ length: TOTAL }, (_, i) => (
                  <span key={i} className={cn("h-1.5 w-6 rounded-full transition-colors duration-300", i <= pas ? "bg-primary" : "bg-slate-200")} />
                ))}
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {pas < TOTAL ? (
              <motion.div key={`q${pas}`} {...anim} transition={{ duration: 0.22, ease }}>
                <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">{preguntes[pas].titol}</h2>
                {preguntes[pas].ajuda && <p className="text-sm text-muted-foreground mb-5">{preguntes[pas].ajuda}</p>}
                {!preguntes[pas].ajuda && <div className="mb-5" />}

                {pas === 0 && <OpcionsSenzilles opcions={OPCIONS_PISOS} etiquetes={oPisos} valor={r.pisos} etiqueta={preguntes[0].titol} onTria={(v) => tria("pisos", v)} />}
                {pas === 1 && <OpcionsSenzilles opcions={OPCIONS_DONDE} etiquetes={oDonde} valor={r.donde} etiqueta={preguntes[1].titol} onTria={(v) => tria("donde", v)} />}
                {pas === 2 && (
                  <>
                    <div className="flex flex-col gap-2.5" role="group" aria-label={preguntes[2].titol}>
                      {OPCIONS_USAS.map((e) => {
                        const triada = (r.usas ?? []).includes(e);
                        return (
                          <button
                            key={e}
                            type="button"
                            role="checkbox"
                            aria-checked={triada}
                            onClick={() => commuta(e)}
                            className={cn(opcio, triada ? "bg-foreground border-foreground text-white" : "bg-white border-slate-200 text-foreground hover:border-slate-300")}
                          >
                            {t(`calcula.o_usas.${e}`)}
                            <span className={cn("w-5 h-5 rounded-full border flex items-center justify-center shrink-0", triada ? "border-white bg-white text-foreground" : "border-slate-300")}>
                              {triada && <Check className="w-3 h-3" strokeWidth={3.5} />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPas(3)}
                      disabled={(r.usas ?? []).length === 0}
                      className="mt-6 w-full inline-flex items-center justify-center gap-2 h-14 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {t("calcula.continuar")}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                {pas === 3 && <OpcionsSenzilles opcions={OPCIONS_HORAS} etiquetes={oHoras} valor={r.horas} etiqueta={preguntes[3].titol} onTria={(v) => tria("horas", v)} />}
                {pas === 4 && <OpcionsSenzilles opcions={OPCIONS_QUIEN} etiquetes={oQuien} valor={r.quien} etiqueta={preguntes[4].titol} onTria={(v) => tria("quien", v)} />}

                {pas > 0 && (
                  <button
                    type="button"
                    onClick={() => setPas((p) => p - 1)}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("calcula.atras")}
                  </button>
                )}
              </motion.div>
            ) : res ? (
              <motion.div key="resultat" {...anim} transition={{ duration: 0.25, ease }}>
                <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">{t("calcula.resultado.eyebrow")}</p>
                  <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug mb-4">
                    {res.avui > 0
                      ? t("calcula.resultado.hoy", { euros: euros(res.avui, lang), horas: horasFrase[iHoras] })
                      : t("calcula.resultado.hoy_sin_apps", { horas: horasFrase[iHoras] })}
                  </p>
                  <p className="text-xl sm:text-2xl font-semibold tracking-tight text-primary leading-snug mb-5">
                    {res.hostly != null
                      ? t("calcula.resultado.hostly", { euros: euros(res.hostly, lang) })
                      : t("calcula.resultado.hostly_medida")}
                  </p>
                  {(res.estalvi != null || res.perHora != null) && (
                    <p className="text-base font-semibold text-foreground mb-3">
                      {res.estalvi != null
                        ? t("calcula.resultado.ahorro", { euros: euros(res.estalvi, lang) })
                        : t("calcula.resultado.por_hora", { euros: euros(res.perHora!, lang) })}
                    </p>
                  )}
                  <p className="text-base text-muted-foreground">
                    {t("calcula.resultado.horas_ano", { ano: horasAno[iHoras] })}{" "}
                    {r.donde === "catalunya" ? t("calcula.resultado.registro_cat") : t("calcula.resultado.registro_otra")}
                  </p>
                  <button
                    type="button"
                    onClick={empezar}
                    className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_hsl(var(--primary)/0.30)] active:scale-[0.98]"
                  >
                    {t("cta")}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* El detall: es desbloqueja amb el telèfon */}
                <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
                  {!detall ? (
                    <form onSubmit={desbloqueja} noValidate>
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <h2 className="text-lg font-bold text-foreground">{t("calcula.resultado.gate_titulo")}</h2>
                      </div>
                      <p className="text-sm text-muted-foreground mb-5">{t("calcula.resultado.gate_texto")}</p>
                      <div className="flex flex-col sm:flex-row gap-2.5">
                        <label htmlFor="calc-tel" className="sr-only">{t("empezar.datos.telefono")}</label>
                        <input
                          id="calc-tel"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={telefon}
                          onChange={(e) => { setTelefon(e.target.value); setErrorTel(null); }}
                          placeholder={t("empezar.datos.telefono_placeholder")}
                          aria-invalid={!!errorTel}
                          aria-describedby={errorTel ? "calc-tel-error" : undefined}
                          className={cn(
                            "sm:flex-1 min-w-0 h-14 shrink-0 px-5 rounded-full border bg-white text-base text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:border-primary",
                            errorTel ? "border-rose-300" : "border-slate-200",
                          )}
                        />
                        <button
                          type="submit"
                          disabled={desant}
                          className="h-14 px-7 rounded-full bg-foreground text-white font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
                        >
                          {desant ? <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : t("calcula.resultado.gate_boton")}
                        </button>
                      </div>
                      {errorTel && <p id="calc-tel-error" className="mt-2 text-sm text-rose-600">{errorTel}</p>}
                      <p className="mt-3 text-xs text-muted-foreground">
                        {t("empezar.datos.privacidad_antes")}{" "}
                        <LangLink to="/privacidad" className="underline underline-offset-2">{t("empezar.datos.privacidad_link")}</LangLink>.
                      </p>
                    </form>
                  ) : (
                    <div>
                      <h2 className="text-lg font-bold text-foreground mb-4">{t("calcula.resultado.detalle_titulo")}</h2>
                      <ul className="flex flex-col divide-y divide-slate-200">
                        {res.eines.map((e) => (
                          <li key={e.eina} className="py-3 flex items-start justify-between gap-4 text-sm">
                            <span>
                              <span className="font-semibold text-foreground">
                                {t(`calcula.resultado.detalle_${e.eina}`)}
                              </span>
                              <span className="block text-muted-foreground">
                                {t("calcula.resultado.detalle_por_piso", { euros: e.perPis })} · {euros(e.total, lang)}/mes
                              </span>
                            </span>
                            <span className="text-emerald-700 font-semibold text-right">
                              {e.eina === "checkin" ? t("calcula.resultado.detalle_checkin_hostly") : t("calcula.resultado.detalle_incluido")}
                            </span>
                          </li>
                        ))}
                        {(r.usas ?? []).includes("excel") && (
                          <li className="py-3 flex items-start justify-between gap-4 text-sm">
                            <span className="font-semibold text-foreground">{t("calcula.resultado.detalle_excel")}</span>
                            <span className="text-foreground/80 text-right">{t("calcula.resultado.detalle_excel_hostly")}</span>
                          </li>
                        )}
                        {(r.usas ?? []).includes("gestoria") && (
                          <li className="py-3 flex items-start justify-between gap-4 text-sm">
                            <span className="font-semibold text-foreground">{t("calcula.resultado.detalle_gestoria")}</span>
                            <span className="text-foreground/80 text-right">
                              {/* La taxa que calcula Hostly és la de Catalunya: fora, la gestoria segueix igual */}
                              {r.donde === "catalunya" ? t("calcula.resultado.detalle_gestoria_hostly") : t("calcula.resultado.detalle_gestoria_otra")}
                            </span>
                          </li>
                        )}
                        <li className="py-3 flex items-start justify-between gap-4 text-sm">
                          <span>
                            <span className="font-semibold text-foreground">{t("calcula.resultado.detalle_horas")}</span>
                            <span className="block text-muted-foreground">{horasFrase[iHoras]}</span>
                          </span>
                          <span className="text-foreground/80 text-right">{t("calcula.resultado.detalle_horas_hostly")}</span>
                        </li>
                      </ul>
                      <p className="mt-4 text-xs text-muted-foreground">{t("calcula.resultado.nota")}</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={torna}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t("calcula.resultado.otra_vez")}
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </section>
    </PageShell>
  );
}
