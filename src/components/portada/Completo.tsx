/**
 * «Con el Completo, todo lo demás.» — el mòdul del pla Completo, just després del Gratis.
 *
 * Surt de la «G · El taulell» (14-10) i de vuit voltes de mockup amb el Biel
 * (`docs/exploracions/2026-10-11-web-estil-b/completo-una-pantalla.font.html`). El que va decidir:
 * - Tot ha de cabre en una pantalla: cinc rajoles (Mensajes alta, Precios, Limpieza, Calendario, Extras
 *   y cuentas) i, a sota, una barra llarga amb les altres funcions en rodones petites a la dreta.
 * - Res es mou sol: cada mòdul es mou NOMÉS mentre hi tens el ratolí a sobre. Al mòbil, on les rajoles
 *   llisquen, es mou la que tens davant mentre el mòdul es veu; tocar-la amb el dit no la mou (17-10).
 *   L'única cosa que travessa mòduls és el late checkout: a Mensajes, un missatge automàtic de Hostly
 *   l'ofereix, la Camille l'accepta i una bombolla vola fins a Extras y cuentas, on s'hi suma.
 * - Moviments suaus (corbes «sine», fosos), mai de cop.
 * - Precios: primer puja la demanda, després surt «Festivo» i després puja el preu.
 * - Limpieza: el torn (la Pilar no pot → passa a la Carmen → Coordinada → feta), i en acabar les fotos
 *   de dins del pis, d'una en una amb un flaix, i el preu a la dreta. Les fotos són retalls de la
 *   portada d'un pis de l'app (amb el permís del Biel, 15-10).
 * - «late checkout» en cursiva fina i en minúscula, només a Extras y cuentas (al títol, gris com la resta).
 * - Els textos diuen què fa Hostly per tu, literal (15-10: «falta que es vegi que tot és automàtic»).
 * Tot el que s'hi diu és el que fa l'app: el late checkout l'ofereix un missatge automàtic amb l'enllaç
 * de l'app (hostlylabs.com/i/…) i es paga en línia; la web pròpia i «Conéctalo todo» són a part.
 * Amb «reduir moviment», tot quiet en l'estat final.
 * Al mòbil, les cinc rajoles llisquen amb el dit, amb els punts a sota (opció 3B del Biel, 17-10; fins
 * llavors hi havia una llista de cinc línies sense les demos).
 */
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight, Check, ClipboardList, Clock, Globe, Link2, LineChart, Plus, Receipt, RefreshCw, Sparkles, Users, Zap } from "lucide-react";
import { LangLink } from "@/i18n/LangLink";
import { useLang } from "@/i18n/useLang";
import fotoMissatges from "@/assets/portada/gestor-tarda.webp";
import fotoPreus from "@/assets/portada/menjador-dia.webp";
import pisSofa from "@/assets/portada/pis-sofa.webp";
import pisMenjador from "@/assets/portada/pis-menjador.webp";
import pisSala from "@/assets/portada/pis-sala.webp";
import airbnb from "@/assets/connexions/airbnb.webp";
import booking from "@/assets/connexions/booking.webp";
import whatsapp from "@/assets/connexions/whatsapp.webp";
import iconaApp from "@/assets/portada/icona-app.webp";
import PuntsLliscador from "./PuntsLliscador";
import { useEsTira, useLliscador } from "./useLliscador";

gsap.registerPlugin(ScrollTrigger);

type Conversa = { idioma: string; qui: string; canal: "airbnb" | "booking" | "whatsapp"; hoste: string; traduccio: string; ia: string };
type Upsell = { et: string; auto: string; auto_trad: string; enllac: string; resposta: string; resposta_trad: string; idioma: string };
type Funcio = { id: string; nom: string; pla: string; text: string; a: string };
const LOGO = { airbnb, booking, whatsapp } as const;
const FOTOS_PIS = [pisSofa, pisMenjador, pisSala];
const ICONES: Record<string, typeof Clock> = { checkin: ClipboardList, programats: Clock, taxa: Receipt, finances: LineChart, rols: Users, web: Globe, connecta: Plus };
/** Les funcions que són a part (no entren al Completo): la rodona va sense fons. */
const A_PART = new Set(["web", "connecta"]);
const EQUIP = [{ l: "P", c: "#0f766e" }, { l: "C", c: "#b45309" }, { l: "M", c: "#6d28d9" }, { l: "L", c: "#be123c" }];

/** «8.549», com a l'app (amb Intl, en castellà i català el punt dels milers no surt fins a cinc xifres). */
const milers = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

/** La rodona amb fletxa: porta a la pàgina de la funció. */
function Fletxa({ a, que, vidre = false }: { a: string; que: string; vidre?: boolean }) {
  const { t } = useTranslation("home");
  return (
    <LangLink to={a} className={`pt-cmp-fletxa${vidre ? " pt-cmp-vidre" : ""}`} aria-label={t("portada.completo.veure", { que })}>
      <ArrowUpRight className="pt-ic" aria-hidden="true" />
    </LangLink>
  );
}

/**
 * Es mou només mentre hi ets a sobre: `sobre` diu si hi ets; `props` va a l'article.
 * A l'ordinador (`actiu` null), «a sobre» és el ratolí. Al mòbil, `actiu` diu si és la rajola que tens
 * davant de la tira mentre el mòdul es veu: aquesta es mou sola i el dit no hi fa res (el Biel, 17-10).
 */
function useSobre(quiet: boolean, enEntrar: () => void, actiu: boolean | null) {
  const sobre = useRef(false);
  const entra = useRef(enEntrar);
  entra.current = enEntrar;
  useEffect(() => {
    if (actiu === null) return;
    sobre.current = actiu;
    if (actiu && !quiet) entra.current();
  }, [actiu, quiet]);
  const props = {
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType !== "mouse" || actiu !== null) return; sobre.current = true; if (!quiet) entra.current(); },
    onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType !== "mouse" || actiu !== null) return; sobre.current = false; },
  };
  return { sobre, props };
}

/** Uns quants temporitzadors que es poden aturar tots alhora. */
function useTemps() {
  const ids = useRef<number[]>([]);
  const atura = useCallback(() => { ids.current.forEach((id) => window.clearTimeout(id)); ids.current = []; }, []);
  const despres = useCallback((ms: number, f: () => void) => { ids.current.push(window.setTimeout(f, ms)); }, []);
  useEffect(() => atura, [atura]);
  return { despres, atura };
}

// ─────────────────────────── Mensajes ───────────────────────────
function Missatges({ quiet, actiu, enOferir, enAcceptar }: { quiet: boolean; actiu: boolean | null; enOferir: () => void; enAcceptar: (des: HTMLElement) => void }) {
  const { t } = useTranslation("home");
  const converses = t("portada.completo.missatges.converses", { returnObjects: true }) as Conversa[];
  const up = t("portada.completo.missatges.upsell", { returnObjects: true }) as Upsell;
  // 0 = el late checkout; 1… = les converses amb la IA. Fase: 1 primer missatge, 2 escrivint, 3 resposta.
  const [idx, setIdx] = useState(0);
  const [fase, setFase] = useState(3);
  const xatRef = useRef<HTMLDivElement>(null);
  const siRef = useRef<HTMLDivElement>(null);
  const { despres, atura } = useTemps();
  const total = converses.length + 1;

  const juga = (i: number) => {
    atura();
    const xat = xatRef.current;
    const posa = () => {
      setIdx(i); setFase(1);
      if (i === 0) {
        enOferir();
        despres(1500, () => setFase(2));
        despres(2500, () => setFase(3));
        despres(3100, () => { if (siRef.current) enAcceptar(siRef.current); });
      } else despres(1300, () => setFase(3));
      despres(i === 0 ? 8000 : 6000, () => { if (sobre.current) juga((i + 1) % total); });
    };
    if (!xat || quiet) return posa();
    gsap.killTweensOf(xat);
    gsap.to(xat, { opacity: 0, y: -4, duration: 0.3, ease: "sine.in", onComplete: () => { posa(); gsap.fromTo(xat, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.6, ease: "sine.out" }); } });
  };
  const { sobre, props } = useSobre(quiet, () => juga(0), actiu);

  const c = idx === 0 ? null : converses[idx - 1];
  const qui = c ? c.qui : "Camille";
  const canal = c ? c.canal : "airbnb";
  const idioma = c ? c.idioma : up.idioma;

  return (
    <article className="pt-cmp-t pt-cmp-missatges" {...props}>
      <img className="pt-cmp-foto" src={fotoMissatges} alt="" width={720} height={1280} loading="lazy" decoding="async" />
      <div className="pt-cmp-dalt">
        <div>
          <h3 className="pt-cmp-gros">{t("portada.completo.missatges.titol")}</h3>
          <p className="pt-cmp-sub">{t("portada.completo.missatges.text")}</p>
        </div>
        <Fletxa a="/funcionalidades/ia-whatsapp" que={t("portada.completo.missatges.titol")} vidre />
      </div>
      <div ref={xatRef} className="pt-cmp-xat pt-cmp-vidre" role="img" aria-label={t("portada.completo.missatges.aria")}>
        <div className="pt-cmp-xat-cap" aria-hidden="true">
          <img src={LOGO[canal]} alt="" width={28} height={28} />
          <span><b>{qui}</b><small>{t("portada.completo.missatges.pis")}</small></span>
          <em>{t("portada.completo.missatges.xip")}</em>
        </div>
        <div className="pt-cmp-xat-cos" aria-hidden="true">
          {c ? (
            <>
              <div className="pt-cmp-bh pt-cmp-entra">
                <p>{c.hoste}</p>
                {c.traduccio && <small>{t("portada.completo.missatges.traduit")} · {c.traduccio}</small>}
              </div>
              <p className="pt-cmp-ia-et"><Sparkles className="pt-ic" />{t("portada.completo.missatges.contesta")}</p>
              {fase < 3
                ? <div className="pt-cmp-bi pt-cmp-escriu pt-cmp-entra"><i /><i /><i /></div>
                : <div className="pt-cmp-bi pt-cmp-entra"><p>{c.ia}</p></div>}
            </>
          ) : (
            <>
              <p className="pt-cmp-ia-et pt-cmp-auto-et"><Zap className="pt-ic" />{up.et}</p>
              <div className="pt-cmp-bi pt-cmp-auto pt-cmp-entra">
                <p>{up.auto}</p>
                <span className="pt-cmp-enllac"><Link2 className="pt-ic" />{up.enllac}</span>
              </div>
              {fase === 2 && <div className="pt-cmp-bh pt-cmp-escriu pt-cmp-entra"><i /><i /><i /></div>}
              {fase === 3 && (
                <div ref={siRef} className="pt-cmp-bh pt-cmp-entra">
                  <p>{up.resposta}</p>
                  <small>{t("portada.completo.missatges.traduit")} · {up.resposta_trad}</small>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="pt-cmp-barra pt-cmp-vidre">
        <span aria-live="polite">{t("portada.completo.missatges.idioma", { idioma })}</span>
        <button type="button" onClick={() => juga((idx + 1) % total)} aria-label={t("portada.completo.missatges.seguent")}>
          <ArrowRight className="pt-ic" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

// ─────────────────────────── Precios ───────────────────────────
function Preus({ quiet, actiu }: { quiet: boolean; actiu: boolean | null }) {
  const { t } = useTranslation("home");
  const demRef = useRef<HTMLSpanElement>(null);
  const demNRef = useRef<HTMLSpanElement>(null);
  const festiuRef = useRef<HTMLSpanElement>(null);
  const preuRef = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const juga = () => {
    if (tl.current?.isActive()) return;
    const dem = { v: 0 }, preu = { v: 145 };
    tl.current?.kill();
    tl.current = gsap.timeline({ onComplete: () => { if (sobre.current) gsap.delayedCall(2.4, () => { if (sobre.current) juga(); }); } })
      .to([festiuRef.current, preuRef.current], { opacity: 0.25, duration: 0.35, ease: "sine.in" })
      .call(() => { if (demNRef.current) demNRef.current.textContent = "0"; if (preuRef.current) preuRef.current.textContent = milers(145); })
      .to(preuRef.current, { opacity: 1, duration: 0.4 })
      // 1 · la demanda puja
      .to(dem, { v: 70, duration: 1.4, ease: "sine.inOut", onUpdate: () => { if (demNRef.current) demNRef.current.textContent = String(Math.round(dem.v)); } })
      .fromTo(demRef.current, { scale: 1 }, { scale: 1.08, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }, "-=.35")
      // 2 · és festiu
      .to(festiuRef.current, { opacity: 1, duration: 0.5, ease: "sine.out" })
      // 3 · i el preu puja
      .to(preu, { v: 251, duration: 1.9, ease: "sine.inOut", onUpdate: () => { if (preuRef.current) preuRef.current.textContent = milers(preu.v); } }, "+=.2");
  };
  const { sobre, props } = useSobre(quiet, juga, actiu);
  useEffect(() => () => { tl.current?.kill(); }, []);
  const [demA, demB] = t("portada.completo.preus.demanda", { n: "§" }).split("§");

  return (
    <article className="pt-cmp-t pt-cmp-preus" {...props}>
      <img className="pt-cmp-foto" src={fotoPreus} alt="" width={1200} height={675} loading="lazy" decoding="async" />
      <div className="pt-cmp-dalt">
        <div>
          <h3 className="pt-cmp-gros">{t("portada.completo.preus.titol")}</h3>
          <p className="pt-cmp-sub">{t("portada.completo.preus.text")}</p>
        </div>
        <Fletxa a="/funcionalidades/precios-dinamicos" que={t("portada.completo.preus.titol")} vidre />
      </div>
      <div className="pt-cmp-preus-baix" aria-hidden="true">
        <span className="pt-cmp-xip pt-cmp-vidre"><RefreshCw className="pt-ic" />{t("portada.completo.preus.xip")}</span>
        <div className="pt-cmp-dia pt-cmp-vidre">
          <small>{t("portada.completo.preus.dia")}</small>
          <p><b><span ref={preuRef}>{milers(251)}</span> €</b><span>{t("portada.completo.preus.nit")}</span></p>
          <div className="pt-cmp-xs">
            <span ref={demRef} className="pt-cmp-x pt-cmp-x-verd">{demA}<span ref={demNRef}>70</span>{demB}</span>
            <span ref={festiuRef} className="pt-cmp-x pt-cmp-x-ambre">{t("portada.completo.preus.festiu")}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────── Limpieza: el torn ───────────────────────────
function Neteja({ quiet, actiu, nom }: { quiet: boolean; actiu: boolean | null; nom: string }) {
  const { t } = useTranslation("home");
  // 0 Pilar, preguntant · 1 Pilar no pot · 2 Carmen, coordinada · 3 feta, amb fotos · 4 i el preu
  const [estat, setEstat] = useState(4);
  const estatRef = useRef(4);
  const animat = useRef(false);
  const fotosRef = useRef<HTMLDivElement>(null);
  const preuRef = useRef<HTMLElement>(null);
  const { despres, atura } = useTemps();

  const segueix = () => {
    atura();
    // si ja s'ha acabat (el preu) i ja no hi ets, no torna a començar
    if (!sobre.current && estatRef.current === 4) return;
    const i = (estatRef.current + 1) % 5;
    estatRef.current = i; animat.current = true; setEstat(i);
    // amb el ratolí a sobre continua; si no, acaba fins al preu i s'atura
    if (sobre.current || i < 4) despres(i === 4 ? 4000 : i === 3 ? 2800 : 2300, segueix);
  };
  const { sobre, props } = useSobre(quiet, () => { if (estatRef.current === 4) segueix(); }, actiu);

  useEffect(() => {
    if (!animat.current || quiet) return;
    if (estat === 3 && fotosRef.current) {
      // cada foto entra com si es fes en aquell moment: un flaix, una mica girada, i es posa al seu lloc
      gsap.fromTo(fotosRef.current.children, { opacity: 0, scale: 1.3, rotation: (k: number) => [-7, 5, -4][k] ?? 0, y: -6, "--flash": 1 },
        { opacity: 1, scale: 1, rotation: 0, y: 0, "--flash": 0, duration: 0.9, ease: "sine.out", stagger: 0.5, delay: 0.3 });
    }
    if (estat === 4 && preuRef.current) {
      const el = preuRef.current, v = { x: 0 };
      gsap.fromTo(el.parentElement, { opacity: 0, x: 10 }, { opacity: 1, x: 0, duration: 0.7, ease: "sine.out" });
      gsap.to(v, { x: 45, duration: 1.3, ease: "sine.out", onUpdate: () => { el.textContent = `${Math.round(v.x)} €`; } });
    }
  }, [estat, quiet]);

  const qui = estat <= 1 ? 0 : 1;
  const CHK = <Check className="pt-ic" strokeWidth={3} />;
  let frase: ReactNode;
  if (estat === 0) frase = <><span><b>Pilar</b> · {t("portada.completo.neteja.dema")}</span><span className="pt-cmp-estat">{t("portada.completo.neteja.preguntant")}</span></>;
  else if (estat === 1) frase = <><span><b>Pilar</b> {t("portada.completo.neteja.no_pot")}</span><span className="pt-cmp-estat ambre">{t("portada.completo.neteja.passa", { qui: "Carmen" })}</span></>;
  else if (estat === 2) frase = <><span><b>Carmen</b> · {t("portada.completo.neteja.dema")}</span><span className="pt-cmp-estat">{CHK}{t("portada.completo.neteja.coordinada")}</span></>;
  else frase = <><span><b>Carmen</b> · {t("portada.completo.neteja.feta_frase")}</span><span className="pt-cmp-estat feta">{CHK}{t("portada.completo.neteja.feta")}</span></>;

  return (
    <article className="pt-cmp-t pt-cmp-clar pt-cmp-neteja" {...props}>
      <div className="pt-cmp-dalt">
        <p className="pt-cmp-pindola">{nom}</p>
        <Fletxa a="/funcionalidades/gestion-de-limpiezas" que={nom} />
      </div>
      <h3 className="pt-cmp-h3">{t("portada.completo.neteja.titol")} <span className="pt-cmp-gris">{t("portada.completo.neteja.titol_gris")}</span></h3>
      <div className="pt-cmp-torn" role="img" aria-label={t("portada.completo.neteja.aria")}>
        <div className="pt-cmp-equip" aria-hidden="true">
          {EQUIP.map((p, k) => <span key={p.l} className={`pt-cmp-av${k === qui && estat !== 1 ? " ara" : ""}${k === 0 && estat >= 1 ? " no" : ""}`} style={{ background: p.c }}>{p.l}</span>)}
        </div>
        <div className="pt-cmp-caixa" aria-hidden="true">
          <div className="pt-cmp-frase pt-cmp-entra" key={estat <= 2 ? estat : "feta"}>{frase}</div>
          {estat >= 3 && (
            <div className="pt-cmp-fila-fotos">
              <div className="pt-cmp-fotos" ref={fotosRef}>{FOTOS_PIS.map((f) => <i key={f} style={{ backgroundImage: `url(${f})` }} />)}</div>
              {estat === 4 && <span className="pt-cmp-preu-n"><small>{t("portada.completo.neteja.comptes")}</small><b className="pt-cmp-num" ref={preuRef}>45 €</b></span>}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────── Calendario ───────────────────────────
function Calendari({ nom }: { nom: string }) {
  const { t } = useTranslation("home");
  return (
    <article className="pt-cmp-t pt-cmp-clar pt-cmp-cal">
      <div className="pt-cmp-dalt">
        <p className="pt-cmp-pindola">{nom}</p>
        <Fletxa a="/funcionalidades/channel-manager" que={nom} />
      </div>
      <div className="pt-cmp-cal-text">
        <h3 className="pt-cmp-h3">{t("portada.completo.calendari.titol")}</h3>
        <p className="pt-cmp-p">{t("portada.completo.calendari.text")}</p>
      </div>
      <div className="pt-cmp-mini" aria-hidden="true">
        <div className="pt-cmp-mini-cap"><span /><b>Lu</b><b>Ma</b><b>Mi</b><b>Ju</b><b>Vi</b><b>Sá</b><b>Do</b></div>
        <div className="pt-cmp-mini-f"><span>Cala Moreta</span>
          <i className="pt-cmp-r airbnb" style={{ gridColumn: "2 / 5" }}><img src={airbnb} alt="" />Camille <small>435 €</small></i>
          <em style={{ gridColumn: "6 / 7" }}>145 €</em><em style={{ gridColumn: "7 / 8" }}>145 €</em>
        </div>
        <div className="pt-cmp-mini-f"><span>Ático del Mar</span>
          <em style={{ gridColumn: "2 / 3" }}>165 €</em>
          <i className="pt-cmp-r directa" style={{ gridColumn: "3 / 7" }}><img src={iconaApp} alt="" />Nora <small>{t("portada.completo.calendari.directa")}</small></i>
        </div>
        <div className="pt-cmp-mini-f"><span>Casa del Puerto</span>
          <i className="pt-cmp-r booking" style={{ gridColumn: "2 / 6" }}><img src={booking} alt="" />Thomas <small>555 €</small></i>
          <em style={{ gridColumn: "7 / 8" }}>210 €</em>
        </div>
      </div>
    </article>
  );
}

// ─────────────────────────── Extras y cuentas ───────────────────────────
function Extres({ quiet, actiu, nom, aterrat, filaRef, totalRef, enEntrar }: {
  quiet: boolean; actiu: boolean | null; nom: string; aterrat: boolean;
  filaRef: React.RefObject<HTMLDivElement>; totalRef: React.RefObject<HTMLSpanElement>; enEntrar: () => void;
}) {
  const { t } = useTranslation("home");
  const { props } = useSobre(quiet, enEntrar, actiu);
  return (
    <article className="pt-cmp-t pt-cmp-clar pt-cmp-extres" {...props}>
      <div className="pt-cmp-dalt">
        <p className="pt-cmp-pindola">{nom}</p>
        <Fletxa a="/funcionalidades/finanzas" que={nom} />
      </div>
      <h3 className="pt-cmp-h3">
        {t("portada.completo.extres.titol")}{" "}
        <span className="pt-cmp-gris">{t("portada.completo.extres.titol_a")} <em className="pt-cmp-terme">{t("portada.completo.extres.terme")}</em>{t("portada.completo.extres.titol_b")}</span>
      </h3>
      <p className="pt-cmp-p pt-cmp-ext-p">{t("portada.completo.extres.text")}</p>
      <div className="pt-cmp-mostra" role="img" aria-label={t("portada.completo.extres.aria")}>
        <div ref={filaRef} className={`pt-cmp-fila pt-cmp-nova${aterrat ? " hi" : ""}`} aria-hidden="true">
          <span className="pt-cmp-av" style={{ background: "#be123c" }}>C</span>
          <span className="pt-cmp-qui"><b><em className="pt-cmp-terme">{t("portada.completo.extres.terme")}</em></b><small>{t("portada.completo.extres.detall")}</small></span>
          <b className="pt-cmp-num">25 €</b>
          <span className="pt-cmp-estat feta"><Check className="pt-ic" strokeWidth={3} />{t("portada.completo.extres.pagat")}</span>
        </div>
        <p className="pt-cmp-mes" aria-hidden="true"><b><span ref={totalRef} className="pt-cmp-num">{milers(8549)}</span> €</b><small>{t("portada.completo.extres.mes")}</small></p>
      </div>
    </article>
  );
}

// ─────────────────────────── Y además: les altres funcions ───────────────────────────
function Funcions() {
  const { t } = useTranslation("home");
  const items = t("portada.completo.funcions.items", { returnObjects: true }) as Funcio[];
  const [obert, setObert] = useState<string | null>(null);
  const [pos, setPos] = useState({ esq: 0, fletxa: 24, ample: 300 });
  const barraRef = useRef<HTMLDivElement>(null);
  const f = items.find((x) => x.id === obert);

  useEffect(() => {
    if (!obert) return;
    const tanca = (e: Event) => { if (!(e.target as HTMLElement).closest?.(".pt-cmp-fn, .pt-cmp-pop")) setObert(null); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setObert(null); };
    document.addEventListener("click", tanca);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", tanca); document.removeEventListener("keydown", esc); };
  }, [obert]);

  const obre = (id: string, boto: HTMLElement) => {
    if (obert === id) { setObert(null); return; }
    const L = barraRef.current!.getBoundingClientRect(), B = boto.getBoundingClientRect();
    const ample = Math.min(300, L.width);
    const centre = B.left - L.left + B.width / 2;
    const esq = Math.min(Math.max(centre - ample / 2, 0), L.width - ample);
    setPos({ esq, ample, fletxa: Math.min(ample - 18, Math.max(14, centre - esq - 6)) });
    setObert(id);
  };

  return (
    <div className="pt-cmp-funcions" ref={barraRef}>
      <p><b>{t("portada.completo.funcions.retol")}</b> <span>{t("portada.completo.funcions.text")}</span></p>
      <div className="pt-cmp-rodones">
        {items.map((x) => {
          const Icona = ICONES[x.id] ?? Plus;
          return (
            <button key={x.id} type="button" className={`pt-cmp-fn${A_PART.has(x.id) ? " apart" : ""}`}
              data-nom={x.nom} aria-label={x.nom} aria-expanded={obert === x.id} onClick={(e) => obre(x.id, e.currentTarget)}>
              <Icona className="pt-ic" aria-hidden="true" />
            </button>
          );
        })}
        <LangLink to="/funcionalidades" className="pt-cmp-fletxa pt-cmp-fletxa-petita" aria-label={t("portada.completo.funcions.totes")}>
          <ArrowUpRight className="pt-ic" aria-hidden="true" />
        </LangLink>
      </div>
      <div className={`pt-cmp-pop${f ? " obert" : ""}`} role={f ? "dialog" : undefined} aria-hidden={!f}
        style={{ left: pos.esq, width: pos.ample, ["--fletxa" as string]: `${pos.fletxa}px` }}>
        {f && (
          <>
            <div className="pt-cmp-pop-dalt"><h4>{f.nom}</h4><span className={`pt-cmp-pla${f.id === "checkin" ? " gratis" : ""}`}>{f.pla}</span></div>
            <p>{f.text}</p>
            <LangLink to={f.a}>{t("portada.completo.funcions.veure")} <ArrowUpRight className="pt-ic" aria-hidden="true" /></LangLink>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────── El mòdul ───────────────────────────
export default function Completo({ onEmpezar }: { onEmpezar: () => void }) {
  const { t } = useTranslation("home");
  const { lang } = useLang();
  const seccioRef = useRef<HTMLElement>(null);
  const llisca = useLliscador(":scope > .pt-cmp-t");
  const graellaRef = llisca.ref;
  const tira = useEsTira();
  const [enPantalla, setEnPantalla] = useState(false);
  const volRef = useRef<HTMLDivElement>(null);
  const filaRef = useRef<HTMLDivElement>(null);
  const totalRef = useRef<HTMLSpanElement>(null);
  const [quiet, setQuiet] = useState(false);
  const [aterrat, setAterrat] = useState(true);
  const noms = t("portada.completo.nom_pas", { returnObjects: true }) as string[];

  useEffect(() => { setQuiet(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);

  // Al mòbil, la tira compta com a vista quan se'n veu la meitat
  useEffect(() => {
    const g = graellaRef.current;
    if (!g || !tira) return;
    const io = new IntersectionObserver(([e]) => setEnPantalla(e.isIntersecting), { threshold: 0.5 });
    io.observe(g);
    return () => io.disconnect();
  }, [tira, graellaRef]);
  // Al mòbil es mou la rajola que tens davant; a l'ordinador (null), la que té el ratolí a sobre
  const actiu = (i: number) => (tira ? enPantalla && llisca.pas === i : null);

  // El late checkout a Extras y cuentas: se'n va (abans de l'oferta) i hi torna (quan l'accepten)
  const treu = useCallback(() => {
    if (filaRef.current) gsap.killTweensOf(filaRef.current);
    setAterrat(false);
    if (totalRef.current) totalRef.current.textContent = milers(8524);
  }, []);
  const aterra = useCallback(() => {
    setAterrat(true);
    const el = totalRef.current, v = { x: 8524 };
    if (el) gsap.to(v, { x: 8549, duration: 1.4, ease: "sine.out", onUpdate: () => { el.textContent = milers(v.x); } });
    if (filaRef.current) gsap.fromTo(filaRef.current, { scale: 0.97 }, { scale: 1, duration: 0.8, ease: "sine.out" });
  }, []);
  // La bombolla vola del «sí» de la Camille a la fila d'Extras, per sobre del calendari
  const vola = useCallback((des: HTMLElement) => {
    const g = graellaRef.current, vol = volRef.current, fila = filaRef.current;
    if (!g || !vol || !fila || window.matchMedia("(max-width: 640px)").matches) { aterra(); return; }
    const G = g.getBoundingClientRect(), A = des.getBoundingClientRect(), B = fila.getBoundingClientRect();
    const x0 = A.right - G.left - 20, y0 = A.top - G.top + A.height / 2 - 18;
    const x1 = B.left - G.left + 12, y1 = B.top - G.top + B.height / 2 - 18;
    gsap.killTweensOf(vol);
    gsap.set(vol, { x: x0, y: y0, scale: 0.6, opacity: 0 });
    gsap.timeline()
      .to(vol, { opacity: 1, scale: 1, duration: 0.45, ease: "sine.out" })
      .to(vol, { x: x1, duration: 1.7, ease: "sine.inOut" }, 0.3)
      .to(vol, { y: Math.min(y0, y1) - 70, duration: 0.8, ease: "sine.out" }, 0.3)
      .to(vol, { y: y1, duration: 0.9, ease: "sine.in" }, 1.1)
      .to(vol, { opacity: 0, scale: 0.9, duration: 0.4, ease: "sine.in" }, 1.85)
      .call(aterra, undefined, 1.9);
  }, [aterra, graellaRef]);
  // Amb el ratolí a sobre d'Extras, només Extras: la fila torna a entrar i el total torna a sumar
  const extresEntra = useCallback(() => { treu(); window.setTimeout(aterra, 350); }, [treu, aterra]);

  // L'entrada de la secció (un fos, una sola vegada); els mòduls no es mouen fins que hi passes el ratolí
  useEffect(() => {
    const s = seccioRef.current;
    if (!s) return;
    const mm = gsap.matchMedia();
    // al mòbil no: les rajoles de la tira entraven d'una en una mentre lliscaves
    mm.add("(min-width: 641px) and (prefers-reduced-motion: no-preference)", () => {
      const peces = s.querySelectorAll(".pt-cmp-t, .pt-cmp-funcions");
      gsap.set(peces, { autoAlpha: 0, y: 14 });
      const entra = ScrollTrigger.create({
        trigger: s, start: "top 75%", once: true,
        onEnter: () => gsap.to(peces, { autoAlpha: 1, y: 0, duration: 0.8, ease: "sine.out", stagger: 0.06 }),
      });
      return () => { entra.kill(); gsap.set(peces, { clearProps: "all" }); };
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section ref={seccioRef} id="completo" className="pt-seccio pt-cmp" aria-labelledby="pt-cmp-titol">
      <div className="contenidor">
        <div className="pt-centre">
          <p className="pt-cmp-pindola">{t("portada.completo.retol")}</p>
          <h2 id="pt-cmp-titol" className="pt-h2">
            {t("portada.completo.titol")} <span className="pt-cmp-gris">{t("portada.completo.titol_gris")}</span>
          </h2>
          {/* el botó aquí mateix (revisió de màrqueting del 15-10: el Completo no tancava). El preu no: el Biel
              (16-10) el vol només a la secció dels preus; aquí, el primer mes gratis, en negreta */}
          <div className="pt-cmp-preu">
            <p><b>{t("portada.completo.primer_mes")}</b> {t("portada.completo.sense_permanencia")}</p>
            <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-pri">{t("portada.completo.empezar")}</button>
          </div>
        </div>

        {/* A l'ordinador i a la tauleta, la graella; al mòbil, la mateixa tira de rajoles llisca amb el dit */}
        <div ref={graellaRef} className="pt-cmp-graella pt-llisca" onScroll={llisca.enLliscar}>
          <Missatges quiet={quiet} actiu={actiu(0)} enOferir={treu} enAcceptar={vola} />
          <Preus quiet={quiet} actiu={actiu(1)} />
          <Neteja quiet={quiet} actiu={actiu(2)} nom={noms[2]} />
          <Calendari nom={noms[3]} />
          <Extres quiet={quiet} actiu={actiu(4)} nom={noms[4]} aterrat={aterrat} filaRef={filaRef} totalRef={totalRef} enEntrar={extresEntra} />
          {/* la bombolla que vola de Mensajes a Extras */}
          <div ref={volRef} className="pt-cmp-vol" aria-hidden="true">
            <span className="pt-cmp-av" style={{ background: "#be123c" }}>C</span>{t("portada.completo.extres.vol")} <span className="pt-cmp-num">· 25 €</span>
          </div>
        </div>

        <PuntsLliscador n={noms.length} pas={llisca.pas} vesA={llisca.vesA} />

        <Funcions />
      </div>
    </section>
  );
}
