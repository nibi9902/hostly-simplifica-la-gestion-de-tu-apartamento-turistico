/**
 * /empezar — l'única porta del web (redisseny d'octubre 2026).
 *
 * Tres passos, una pregunta per pantalla:
 *   1. Les dades: telèfon primer, nom i correu. Es desen abans de continuar: si marxa
 *      al pas 2, el Biel ja té el telèfon (avís a Telegram en menys d'un minut).
 *   2. Què necessita: «Solo el check-in y la policía» (gratis) o «Hostly completo».
 *   3. Gratis → crea el compte a l'app (`/signup?pla=gratuit`, ja existeix des del 7-10).
 *      Complet → «Antes de activarlo, una demo de 20 minutos»: tria dia i hora.
 *
 * Decisions del Biel (09-10-2026): un sol botó «Empezar» a tota la web; la demo no va
 * de primeres sinó al final del recorregut; el telèfon abans que el correu; la demo
 * no pot prometre «con tus pisos» (caldria connectar-los).
 */
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CalendarCheck, ShieldCheck, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { LangLink } from "@/i18n/LangLink";
import { useLang } from "@/i18n/useLang";
import hostlyLogo from "@/assets/hostly-logo-new.webp";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { correuValid, dadesRecordades, desaLead, recordaDades, telefonPerBD } from "@/lib/leads";
import { diaLlarg, diesDemo, etiquetaDia, isoDemo } from "@/lib/demo";
import { URL_ALTA_GRATUITA, type EstatEmpezar } from "@/lib/empezar";

type Pas = "datos" | "plan" | "gratis" | "demo" | "demo_hecha";
const NUM_PAS: Record<Pas, number> = { datos: 1, plan: 2, gratis: 3, demo: 3, demo_hecha: 3 };

const CLAU_DESDE = "hostly_empezar_desde";
const ease = [0.22, 1, 0.36, 1] as const;

const camp =
  "w-full h-14 px-5 rounded-2xl border bg-white text-base text-foreground placeholder:text-slate-400 " +
  "transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-4 " +
  "focus-visible:ring-primary/15 focus-visible:border-primary";
const botoPrimari =
  "inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-primary text-primary-foreground " +
  "font-semibold text-base transition-all duration-200 hover:-translate-y-0.5 " +
  "hover:shadow-[0_10px_28px_hsl(var(--primary)/0.30)] active:scale-[0.98] focus-visible:outline-none " +
  "focus-visible:ring-4 focus-visible:ring-primary/25 disabled:opacity-60 disabled:pointer-events-none";

function llegeixDesde(estat: unknown): string | undefined {
  const des = (estat as EstatEmpezar | null)?.desde;
  try {
    if (des) sessionStorage.setItem(CLAU_DESDE, des);
    return des ?? sessionStorage.getItem(CLAU_DESDE) ?? undefined;
  } catch {
    return des;
  }
}

export default function Empezar() {
  const { t } = useTranslation("embut");
  const { lang } = useLang();
  const location = useLocation();
  const reduir = useReducedMotion();
  const desde = useMemo(() => llegeixDesde(location.state), [location.state]);

  const recordades = useMemo(() => dadesRecordades(), []);
  const [pas, setPas] = useState<Pas>("datos");
  const [telefon, setTelefon] = useState(recordades.phone ? `+${recordades.phone}` : "");
  const [nom, setNom] = useState(recordades.name ?? "");
  const [correu, setCorreu] = useState(recordades.email ?? "");
  const [errors, setErrors] = useState<{ telefon?: string; nom?: string; correu?: string; general?: string }>({});
  const [desant, setDesant] = useState(false);

  const dies = useMemo(() => diesDemo(), []);
  const [dia, setDia] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);

  const titolRef = useRef<HTMLHeadingElement>(null);
  const primerNom = nom.trim().split(/\s+/)[0] ?? "";

  // Cada pas nou: el focus al títol (lector de pantalla) i a dalt de tot.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: reduir ? "auto" : "smooth" });
    if (pas !== "datos") titolRef.current?.focus({ preventScroll: true });
  }, [pas, reduir]);

  const anim = reduir
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

  async function enviaDades(e: FormEvent) {
    e.preventDefault();
    const tel = await telefonPerBD(telefon);
    const nous: typeof errors = {};
    if (!tel) nous.telefon = t("empezar.error.telefono");
    if (nom.trim().length < 2) nous.nom = t("empezar.error.nombre");
    if (!correuValid(correu)) nous.correu = t("empezar.error.correo");
    setErrors(nous);
    if (Object.keys(nous).length) return;

    setDesant(true);
    const r = await desaLead(
      { phone: tel!, name: nom.trim(), email: correu.trim(), source: "empezar" },
      lang,
      desde,
    );
    setDesant(false);
    if (!r.ok) {
      setErrors(r.motiu === "telefon" ? { telefon: t("empezar.error.telefono") } : { general: t("empezar.error.guardar") });
      return;
    }
    recordaDades({ phone: tel!, name: nom.trim(), email: correu.trim() });
    track("empezar_datos", { location: desde ?? "directe" });
    setPas("plan");
  }

  function triaPla(pla: "gratis" | "completo") {
    track("empezar_plan", { variant: pla });
    // No fa esperar: el pla és secundari i `desaLead` ja reintenta.
    void desaLead({ plan: pla }, lang, desde);
    setPas(pla === "gratis" ? "gratis" : "demo");
  }

  async function reservaDemo() {
    if (!dia || !hora) return;
    setDesant(true);
    const r = await desaLead({ plan: "completo", demo_slot: isoDemo(dia, hora) }, lang, desde);
    setDesant(false);
    if (!r.ok) {
      setErrors({ general: t("empezar.error.guardar") });
      return;
    }
    setErrors({});
    track("demo_solicitada", { variant: `${dia} ${hora}` });
    setPas("demo_hecha");
  }

  const enrere: Partial<Record<Pas, Pas>> = { plan: "datos", gratis: "plan", demo: "plan" };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO title={t("empezar.meta_title")} description={t("empezar.meta_desc")} path="/empezar" noindex />

      {/* Capçal mínim: on ets i com tornar. Res més que distregui. */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-slate-100">
        <div className="contenidor h-16 flex items-center justify-between gap-4">
          <LangLink to="/" className="flex items-center gap-1 shrink-0" aria-label={t("empezar.inicio")}>
            <img src={hostlyLogo} alt="" width={28} height={28} className="h-7 w-auto" />
            <span className="font-semibold text-base tracking-tight text-foreground">Hostly™</span>
          </LangLink>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground tabular-nums">
              {t("empezar.paso", { n: NUM_PAS[pas] })}
            </span>
            <div className="flex gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "h-1.5 w-7 rounded-full transition-colors duration-300",
                    n <= NUM_PAS[pas] ? "bg-primary" : "bg-slate-200",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* A l'ordinador: el pas a l'esquerra (a la línia del logotip) i, al costat, com va tot plegat */}
      <main className="flex-1 contenidor pt-10 sm:pt-16 pb-20 lg:grid lg:grid-cols-12 lg:gap-16 lg:items-start">
        <div className="w-full max-w-xl lg:col-span-6 xl:col-span-5">
        {enrere[pas] && (
          <button
            type="button"
            onClick={() => { setErrors({}); setPas(enrere[pas]!); }}
            className="mb-6 -ml-1 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("empezar.atras")}
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* ── 1 · Les dades ─────────────────────────────────────────── */}
          {pas === "datos" && (
            <motion.section key="datos" {...anim} transition={{ duration: 0.25, ease }}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-3">
                {t("empezar.datos.titulo")}
              </h1>
              <p className="text-lg text-muted-foreground mb-10">{t("empezar.datos.subtitulo")}</p>

              <form onSubmit={enviaDades} noValidate className="flex flex-col gap-5">
                <div>
                  <label htmlFor="emp-tel" className="block text-sm font-semibold text-foreground mb-2">
                    {t("empezar.datos.telefono")}
                  </label>
                  <input
                    id="emp-tel"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    autoFocus
                    value={telefon}
                    onChange={(e) => { setTelefon(e.target.value); setErrors((x) => ({ ...x, telefon: undefined })); }}
                    placeholder={t("empezar.datos.telefono_placeholder")}
                    aria-invalid={!!errors.telefon}
                    aria-describedby="emp-tel-ajuda"
                    className={cn(camp, errors.telefon ? "border-rose-300" : "border-slate-200")}
                  />
                  <p id="emp-tel-ajuda" className={cn("mt-2 text-sm", errors.telefon ? "text-rose-600" : "text-muted-foreground")}>
                    {errors.telefon ?? t("empezar.datos.telefono_ayuda")}
                  </p>
                </div>

                <div>
                  <label htmlFor="emp-nom" className="block text-sm font-semibold text-foreground mb-2">
                    {t("empezar.datos.nombre")}
                  </label>
                  <input
                    id="emp-nom"
                    type="text"
                    autoComplete="name"
                    value={nom}
                    onChange={(e) => { setNom(e.target.value); setErrors((x) => ({ ...x, nom: undefined })); }}
                    placeholder={t("empezar.datos.nombre_placeholder")}
                    aria-invalid={!!errors.nom}
                    aria-describedby={errors.nom ? "emp-nom-error" : undefined}
                    className={cn(camp, errors.nom ? "border-rose-300" : "border-slate-200")}
                  />
                  {errors.nom && <p id="emp-nom-error" className="mt-2 text-sm text-rose-600">{errors.nom}</p>}
                </div>

                <div>
                  <label htmlFor="emp-correu" className="block text-sm font-semibold text-foreground mb-2">
                    {t("empezar.datos.correo")}
                  </label>
                  <input
                    id="emp-correu"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={correu}
                    onChange={(e) => { setCorreu(e.target.value); setErrors((x) => ({ ...x, correu: undefined })); }}
                    placeholder={t("empezar.datos.correo_placeholder")}
                    aria-invalid={!!errors.correu}
                    aria-describedby={errors.correu ? "emp-correu-error" : undefined}
                    className={cn(camp, errors.correu ? "border-rose-300" : "border-slate-200")}
                  />
                  {errors.correu && <p id="emp-correu-error" className="mt-2 text-sm text-rose-600">{errors.correu}</p>}
                </div>

                {errors.general && (
                  <p role="alert" className="text-sm text-rose-700 bg-rose-50 rounded-2xl px-4 py-3">{errors.general}</p>
                )}

                <button type="submit" disabled={desant} className={cn(botoPrimari, "w-full mt-2")}>
                  {desant ? (
                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-label={t("empezar.datos.continuar")} />
                  ) : (
                    <>
                      {t("empezar.datos.continuar")}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  {t("empezar.datos.privacidad_antes")}{" "}
                  <LangLink to="/privacidad" className="underline underline-offset-2 hover:text-foreground">
                    {t("empezar.datos.privacidad_link")}
                  </LangLink>
                  .
                </p>
              </form>
            </motion.section>
          )}

          {/* ── 2 · Què necessita ─────────────────────────────────────── */}
          {pas === "plan" && (
            <motion.section key="plan" {...anim} transition={{ duration: 0.25, ease }}>
              <h1 ref={titolRef} tabIndex={-1} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3 focus:outline-none">
                {t("empezar.plan.titulo")}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">{t("empezar.plan.subtitulo")}</p>

              <div className="flex flex-col gap-4">
                <button
                  type="button"
                  onClick={() => triaPla("completo")}
                  className="group relative text-left rounded-3xl p-6 sm:p-7 text-white overflow-hidden bg-gradient-to-br from-[hsl(var(--dark-blue))] to-[hsl(var(--primary))] shadow-[0_14px_40px_hsl(var(--primary)/0.25)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xl font-bold tracking-tight">{t("empezar.plan.completo_nombre")}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 rounded-full px-2.5 py-1">
                      {t("empezar.plan.recomendado")}
                    </span>
                  </div>
                  <p className="text-sm text-white/85 mb-5">{t("empezar.plan.completo_precio")}</p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {(t("empezar.plan.completo_items", { returnObjects: true }) as string[]).map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-sm text-white/95">
                        <Check className="w-4 h-4 mt-0.5 shrink-0" strokeWidth={3} />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-white text-[hsl(var(--dark-blue))] font-semibold text-sm">
                    {t("empezar.plan.elegir")}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => triaPla("gratis")}
                  className="group text-left rounded-3xl p-6 sm:p-7 bg-white border border-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xl font-bold tracking-tight text-foreground">{t("empezar.plan.gratis_nombre")}</span>
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-sm font-semibold text-emerald-700 mb-5">{t("empezar.plan.gratis_precio")}</p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {(t("empezar.plan.gratis_items", { returnObjects: true }) as string[]).map((x) => (
                      <li key={x} className="flex items-start gap-2.5 text-sm text-foreground/85">
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-600" strokeWidth={3} />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 h-11 px-6 rounded-full border border-slate-200 text-foreground font-semibold text-sm group-hover:bg-slate-50 transition-colors">
                    {t("empezar.plan.elegir")}
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </button>
              </div>
            </motion.section>
          )}

          {/* ── 3a · Gratis: crear el compte a l'app ─────────────────────── */}
          {pas === "gratis" && (
            <motion.section key="gratis" {...anim} transition={{ duration: 0.25, ease }} className="text-center sm:text-left">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-6 mx-auto sm:mx-0">
                <Check className="w-7 h-7 text-emerald-600" strokeWidth={2.5} />
              </div>
              <h1 ref={titolRef} tabIndex={-1} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3 focus:outline-none">
                {t("empezar.gratis.titulo", { nombre: primerNom })}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">{t("empezar.gratis.subtitulo")}</p>
              <a
                href={URL_ALTA_GRATUITA}
                onClick={() => track("empezar_cuenta", { variant: "gratis" })}
                className={cn(botoPrimari, "w-full sm:w-auto")}
              >
                {t("empezar.gratis.boton")}
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="mt-4 text-sm text-muted-foreground">{t("empezar.gratis.nota")}</p>
            </motion.section>
          )}

          {/* ── 3b · Complet: la demo ─────────────────────────────────── */}
          {pas === "demo" && (
            <motion.section key="demo" {...anim} transition={{ duration: 0.25, ease }}>
              <h1 ref={titolRef} tabIndex={-1} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3 focus:outline-none">
                {t("empezar.demo.titulo")}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">{t("empezar.demo.subtitulo")}</p>

              <h2 className="text-sm font-semibold text-foreground mb-3">{t("empezar.demo.dia")}</h2>
              <div className="-mx-5 sm:mx-0 px-5 sm:px-0 flex gap-2 overflow-x-auto pb-2 snap-x sm:[mask-image:linear-gradient(to_right,black_88%,transparent)]" role="radiogroup" aria-label={t("empezar.demo.dia")}>
                {dies.map((d) => {
                  const e = etiquetaDia(d.ymd, lang);
                  const triat = dia === d.ymd;
                  return (
                    <button
                      key={d.ymd}
                      type="button"
                      role="radio"
                      aria-checked={triat}
                      onClick={() => { setDia(d.ymd); if (hora && !d.hores.includes(hora)) setHora(null); }}
                      className={cn(
                        "snap-start shrink-0 w-[72px] rounded-2xl border py-3 flex flex-col items-center gap-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                        triat
                          ? "bg-foreground border-foreground text-white"
                          : "bg-white border-slate-200 text-foreground hover:border-slate-300",
                      )}
                    >
                      <span className={cn("text-[11px] font-semibold uppercase tracking-wide", triat ? "text-white/70" : "text-muted-foreground")}>
                        {e.setmana}
                      </span>
                      <span className="text-xl font-bold tabular-nums leading-tight">{e.dia}</span>
                      <span className={cn("text-[11px]", triat ? "text-white/70" : "text-muted-foreground")}>{e.mes}</span>
                    </button>
                  );
                })}
              </div>

              <div className={cn("transition-opacity duration-300", dia ? "opacity-100" : "opacity-40 pointer-events-none")}>
                <h2 className="text-sm font-semibold text-foreground mt-7 mb-3">{t("empezar.demo.hora")}</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2" role="radiogroup" aria-label={t("empezar.demo.hora")}>
                  {(dies.find((d) => d.ymd === dia)?.hores ?? dies[0]?.hores ?? []).map((h) => {
                    const triada = hora === h;
                    return (
                      <button
                        key={h}
                        type="button"
                        role="radio"
                        aria-checked={triada}
                        disabled={!dia}
                        onClick={() => setHora(h)}
                        className={cn(
                          "h-12 rounded-full border text-sm font-semibold tabular-nums inline-flex items-center justify-center gap-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
                          triada
                            ? "bg-foreground border-foreground text-white"
                            : "bg-white border-slate-200 text-foreground hover:border-slate-300",
                        )}
                      >
                        {triada && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        {h}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{t("empezar.demo.zona")}</p>
              </div>

              {errors.general && (
                <p role="alert" className="mt-6 text-sm text-rose-700 bg-rose-50 rounded-2xl px-4 py-3">{errors.general}</p>
              )}

              <button
                type="button"
                onClick={reservaDemo}
                disabled={!dia || !hora || desant}
                className={cn(botoPrimari, "w-full mt-8")}
              >
                {desant ? (
                  <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-label={t("empezar.demo.boton")} />
                ) : dia && hora ? (
                  <>
                    <CalendarCheck className="w-5 h-5" />
                    {t("empezar.demo.boton")}
                  </>
                ) : (
                  t("empezar.demo.boton_falta")
                )}
              </button>
            </motion.section>
          )}

          {/* ── 3b · Demo reservada ───────────────────────────────────── */}
          {pas === "demo_hecha" && dia && hora && (
            <motion.section key="demo_hecha" {...anim} transition={{ duration: 0.25, ease }}>
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CalendarCheck className="w-7 h-7 text-primary" strokeWidth={2.2} />
              </div>
              <h1 ref={titolRef} tabIndex={-1} className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3 focus:outline-none">
                {t("empezar.demo.hecho_titulo", { nombre: primerNom, dia: diaLlarg(dia, lang), hora })}
              </h1>
              <p className="text-lg text-muted-foreground mb-10">{t("empezar.demo.hecho_texto")}</p>

              <div className="rounded-3xl bg-white border border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/85">{t("empezar.demo.mientras")}</p>
                </div>
                <a
                  href={URL_ALTA_GRATUITA}
                  onClick={() => track("empezar_cuenta", { variant: "despues_demo" })}
                  className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full border border-slate-200 text-sm font-semibold text-foreground hover:bg-slate-50 transition-colors shrink-0"
                >
                  {t("empezar.demo.mientras_boton")}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => setPas("demo")}
                className="mt-6 text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                {t("empezar.demo.cambiar")}
              </button>
            </motion.section>
          )}
        </AnimatePresence>
        </div>

        <aside className="hidden lg:block lg:col-span-6 xl:col-span-6 xl:col-start-7 lg:sticky lg:top-28">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 xl:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-6">{t("empezar.costat.titulo")}</p>
            <ol className="space-y-6">
              {(t("empezar.costat.pasos", { returnObjects: true }) as Array<{ titulo: string; texto: string }>).map((p, i) => {
                const n = i + 1;
                const fet = n < NUM_PAS[pas];
                const ara = n === NUM_PAS[pas];
                return (
                  <li key={p.titulo} className="flex gap-4" aria-current={ara ? "step" : undefined}>
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-300",
                        fet ? "bg-emerald-100 text-emerald-700" : ara ? "bg-primary text-white" : "bg-slate-100 text-slate-500",
                      )}
                      aria-hidden="true"
                    >
                      {fet ? <Check className="w-4 h-4" strokeWidth={3} /> : n}
                    </span>
                    <div>
                      <p className={cn("font-semibold leading-snug", ara ? "text-foreground" : "text-slate-600")}>{p.titulo}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{p.texto}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
            <ul className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              {(t("empezar.costat.garantias", { returnObjects: true }) as string[]).map((g) => (
                <li key={g} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" strokeWidth={2.5} aria-hidden="true" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </main>
    </div>
  );
}
