/**
 * «Con el Completo, todo lo demás.» — el mòdul del pla Completo, just després del Gratis.
 *
 * És la «G · El taulell» de les idees noves del 14-10 (el Biel: «el G m'agrada moltíssim la idea, fem
 * algo així però personalitzem-ho per Hostly de la millor manera possible»). Rajoles de mides diferents
 * i, dins de cadascuna, un tros de l'app tal com és:
 * - Mensajes: la conversa amb la IA, amb la traducció que veu el gestor; canvia d'idioma sola (o amb la
 *   barra de sota) i la IA «escriu» abans de contestar.
 * - Precios: el detall d'un dia de Setmana Santa, amb el preu que puja, la demanda i el festiu.
 * - Limpieza (alta): el WhatsApp de Hostly amb la Pilar, amb les hores com a WhatsApp. Ella confirma, la
 *   neteja passa a «Coordinada» sense que el gestor faci res, i l'endemà envia les fotos: «Hecha». Si no
 *   pot, passa a la següent del torn.
 * - Calendario: les reserves de cada canal en un sol calendari, com la vista General de l'app.
 * - Extras y cuentas (ampla, a sota de Mensajes): el missatge automàtic que ofereix la sortida tardana
 *   (l'enllaç és com els de l'app, hostlylabs.com/i/…), el pagament en línia i la confirmació sola, amb la
 *   Pilar avisada; a la dreta, el que cobraràs aquest mes i quant hi posen els extres. Una píndola la
 *   lliga amb Mensajes.
 * - Conéctalo todo: la idea que, si fas servir una altra eina, la connectem (servei a part, a mida).
 * El Biel (14-10, segona volta): «la neteja… com confirma automàticament la neteja amb el teu equip…
 * els extres ha de quedar clar que automàticament es ven un late checkout i que es cobra… un enllaç
 * entre el mòdul de missatges automàtics i els cobraments extres i apart un lloc on surti la idea de
 * que podem connectar i automatitzar el que es necessiti». Tot el que s'hi diu és el que fa l'app: la
 * sortida tardana l'ofereix un missatge automàtic, es paga en línia i es confirma sola si hi cap.
 * Les frases són les de la targeta del Completo als preus. La rodona amb fletxa porta a la pàgina de
 * cada funció. Al mòbil, les rajoles llisquen de costat.
 * Moviment: GSAP i estats de React, només mentre es veu; amb «reduir moviment», quiet i sencer.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight, Briefcase, Check, CheckCheck, Database, Globe, Plus, RefreshCw, Sparkles, Table2, Zap } from "lucide-react";
import { LangLink } from "@/i18n/LangLink";
import { useLang } from "@/i18n/useLang";
import fotoMissatges from "@/assets/portada/gestor-tarda.webp";
import fotoPreus from "@/assets/portada/menjador-dia.webp";
import airbnb from "@/assets/connexions/airbnb.webp";
import booking from "@/assets/connexions/booking.webp";
import whatsapp from "@/assets/connexions/whatsapp.webp";
import iconaApp from "@/assets/portada/icona-app.webp";

gsap.registerPlugin(ScrollTrigger);

type Conversa = { idioma: string; qui: string; canal: "airbnb" | "booking" | "whatsapp"; hoste: string; traduccio: string; ia: string };
const LOGO = { airbnb, booking, whatsapp } as const;
const ICONES_NODES = [Briefcase, Globe, Database, Table2, Plus];

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

/** Un pas que avança sol mentre es veu: 0, 1, 2… fins a `fins`, s'hi queda una estona i torna a començar. */
function usePassos(actiu: boolean, quiet: boolean, fins: number, cada = 1300, espera = 3800) {
  const [pas, setPas] = useState(fins);
  useEffect(() => {
    if (!actiu || quiet) { setPas(fins); return; }
    let viu = true;
    let id = 0;
    const segueix = (p: number) => {
      if (!viu) return;
      setPas(p);
      id = window.setTimeout(() => segueix(p >= fins ? 0 : p + 1), p >= fins ? espera : cada);
    };
    segueix(0);
    return () => { viu = false; window.clearTimeout(id); };
  }, [actiu, quiet, fins, cada, espera]);
  return pas;
}

function Missatges({ actiu, quiet }: { actiu: boolean; quiet: boolean }) {
  const { t } = useTranslation("home");
  const converses = t("portada.completo.missatges.converses", { returnObjects: true }) as Conversa[];
  const [n, setN] = useState(0);
  const [escriu, setEscriu] = useState(false);
  const tocat = useRef(false);
  const c = converses[n % converses.length];

  // La IA «escriu» un moment abans de contestar
  useEffect(() => {
    if (quiet) { setEscriu(false); return; }
    setEscriu(true);
    const id = window.setTimeout(() => setEscriu(false), 1100);
    return () => window.clearTimeout(id);
  }, [n, quiet]);

  // Canvia d'idioma sola mentre es veu, fins que algú toca la barra
  useEffect(() => {
    if (!actiu || quiet) return;
    const id = window.setInterval(() => { if (!tocat.current) setN((x) => x + 1); }, 6500);
    return () => window.clearInterval(id);
  }, [actiu, quiet]);

  return (
    <article className="pt-cmp-t pt-cmp-missatges">
      <img className="pt-cmp-foto" src={fotoMissatges} alt="" width={720} height={1280} loading="lazy" decoding="async" />
      <div className="pt-cmp-dalt">
        <h3 className="pt-cmp-gros">{t("portada.completo.missatges.titol")}</h3>
        <Fletxa a="/funcionalidades/ia-whatsapp" que={t("portada.completo.missatges.titol")} vidre />
      </div>
      <div className="pt-cmp-xat pt-cmp-vidre" role="img" aria-label={t("portada.completo.missatges.aria")}>
        <div className="pt-cmp-xat-cap" aria-hidden="true">
          <img src={LOGO[c.canal]} alt="" width={28} height={28} />
          <span><b>{c.qui}</b><small>{t("portada.completo.missatges.pis")}</small></span>
          <em>{t("portada.completo.missatges.xip")}</em>
        </div>
        <div className="pt-cmp-xat-cos" aria-hidden="true" key={n}>
          <div className="pt-cmp-bh">
            <p>{c.hoste}</p>
            {c.traduccio && <small>{t("portada.completo.missatges.traduit")} · {c.traduccio}</small>}
          </div>
          <p className="pt-cmp-ia-et"><Sparkles className="pt-ic" />{t("portada.completo.missatges.contesta")}</p>
          {escriu
            ? <div className="pt-cmp-bi pt-cmp-escriu"><i /><i /><i /></div>
            : <div className="pt-cmp-bi"><p>{c.ia}</p></div>}
        </div>
      </div>
      <div className="pt-cmp-barra pt-cmp-vidre">
        <span aria-live="polite">{t("portada.completo.missatges.idioma", { idioma: c.idioma })}</span>
        <button type="button" onClick={() => { tocat.current = true; setN((x) => x + 1); }} aria-label={t("portada.completo.missatges.seguent")}>
          <ArrowRight className="pt-ic" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

/** La neteja: el WhatsApp de Hostly amb la Pilar, de la sortida a «Hecha». */
function Neteja({ actiu, quiet, nom }: { actiu: boolean; quiet: boolean; nom: string }) {
  const { t } = useTranslation("home");
  // 0 avui · 1 Hostly escriu · 2 la Pilar escriu · 3 «sí» i Coordinada · 4 l'endemà, les fotos · 5 Hecha
  const pas = usePassos(actiu, quiet, 5);
  const k = (n: number) => `pt-cmp-pas${pas >= n ? " vist" : ""}`;
  return (
    <article className="pt-cmp-t pt-cmp-clar pt-cmp-neteja">
      <div className="pt-cmp-dalt">
        <p className="pt-cmp-pindola">{nom}</p>
        <Fletxa a="/funcionalidades/gestion-de-limpiezas" que={nom} />
      </div>
      <h3 className="pt-cmp-h3">{t("portada.completo.neteja.titol")} <span className="pt-cmp-gris">{t("portada.completo.neteja.titol_gris")}</span></h3>
      <p className="pt-cmp-p">{t("portada.completo.neteja.text")}</p>
      <div className="pt-cmp-wa" role="img" aria-label={t("portada.completo.neteja.aria")}>
        <div className="pt-cmp-wa-cap" aria-hidden="true">
          <span className="pt-cmp-av" style={{ background: "#0f766e" }}>P</span>
          <span className="pt-cmp-qui"><b>Pilar</b><small>{t("portada.completo.neteja.rol")}</small></span>
          <img src={whatsapp} alt="" width={20} height={20} />
        </div>
        <div className="pt-cmp-wa-cos" aria-hidden="true">
          <p className={`pt-cmp-wa-dia ${k(0)}`}>{t("portada.completo.neteja.avui")}</p>
          <div className={`pt-cmp-wa-b surt ${k(1)}`}>
            {t("portada.completo.neteja.hostly")}
            <small className="pt-cmp-wa-h">18:02<CheckCheck className="pt-ic" /></small>
          </div>
          {pas === 2
            ? <div className="pt-cmp-wa-b entra pt-cmp-escriu pt-cmp-pas vist"><i /><i /><i /></div>
            : <div className={`pt-cmp-wa-b entra ${k(3)}`}>{t("portada.completo.neteja.resposta")}<small className="pt-cmp-wa-h">18:05</small></div>}
          <p className={`pt-cmp-wa-estat ${k(3)}`}>
            <span className="pt-cmp-estat"><Check className="pt-ic" strokeWidth={3} />{t("portada.completo.neteja.coordinada")}</span>
            <small>{t("portada.completo.neteja.sola")}</small>
          </p>
          <p className={`pt-cmp-wa-dia ${k(4)}`}>{t("portada.completo.neteja.dema")}</p>
          <div className={`pt-cmp-wa-b entra ${k(4)}`}>
            <span className="pt-cmp-wa-fotos">
              {["15% 60%", "55% 70%", "90% 55%"].map((pos) => <i key={pos} style={{ backgroundImage: `url(${fotoPreus})`, backgroundPosition: pos }} />)}
            </span>
            {t("portada.completo.neteja.fotos")}
            <small className="pt-cmp-wa-h">13:40</small>
          </div>
          <p className={`pt-cmp-wa-estat ${k(5)}`}>
            <span className="pt-cmp-estat feta"><Check className="pt-ic" strokeWidth={3} />{t("portada.completo.neteja.feta")}</span>
            <small>{t("portada.completo.neteja.llesta")}</small>
          </p>
        </div>
      </div>
      <p className="pt-cmp-seg">
        <span className="pt-cmp-av" style={{ background: "#b45309" }} aria-hidden="true">C</span>
        {t("portada.completo.neteja.seguent")}
      </p>
    </article>
  );
}

/** Els extres: el missatge automàtic → el pagament → la confirmació sola. */
function Extres({ actiu, quiet, nom }: { actiu: boolean; quiet: boolean; nom: string }) {
  const { t } = useTranslation("home");
  // 0 el missatge automàtic · 1 el pagament (Pagar) · 2 Pagado · 3 confirmada i la Pilar avisada
  const pas = usePassos(actiu, quiet, 3, 1500, 4200);
  const k = (n: number) => `pt-cmp-pas${pas >= n ? " vist" : ""}`;
  return (
    <article className="pt-cmp-t pt-cmp-clar pt-cmp-extres">
      <div className="pt-cmp-dalt">
        <p className="pt-cmp-pindola">{nom}</p>
        <Fletxa a="/funcionalidades/finanzas" que={nom} />
      </div>
      <div className="pt-cmp-ext-cap">
        <div className="pt-cmp-ext-text">
          <h3 className="pt-cmp-h3">{t("portada.completo.extres.titol")} <span className="pt-cmp-gris">{t("portada.completo.extres.titol_gris")}</span></h3>
          <p className="pt-cmp-p">{t("portada.completo.extres.text")}</p>
        </div>
        <p className="pt-cmp-mes" aria-hidden="true">
          <b><span className="pt-cmp-mes-n">{milers(8549)}</span> €</b>
          <small>{t("portada.completo.extres.mes")}</small>
          <span className="pt-cmp-x pt-cmp-x-verd">{t("portada.completo.extres.mes_extres")}</span>
        </p>
      </div>
      <div className="pt-cmp-ext-flux" role="img" aria-label={t("portada.completo.extres.aria")}>
        <div className={`pt-cmp-ext-pas ${k(0)}`} aria-hidden="true">
          <small className="pt-cmp-ext-et"><Zap className="pt-ic" />{t("portada.completo.extres.auto_et")}</small>
          <p className="pt-cmp-ext-auto">{t("portada.completo.extres.auto")}</p>
        </div>
        <span className={`pt-cmp-ext-fl ${k(1)}`} aria-hidden="true"><ArrowRight className="pt-ic" /></span>
        <div className={`pt-cmp-ext-pas ${k(1)}`} aria-hidden="true">
          <small className="pt-cmp-ext-et">{t("portada.completo.extres.pagament_et")}</small>
          <p className="pt-cmp-fila-p"><b>{t("portada.completo.extres.pagament")}</b><b className="pt-cmp-num">25 €</b></p>
          {pas >= 2
            ? <span className="pt-cmp-estat feta"><Check className="pt-ic" strokeWidth={3} />{t("portada.completo.extres.pagat")}</span>
            : <span className="pt-cmp-ext-pagar">{t("portada.completo.extres.pagar")}</span>}
        </div>
        <span className={`pt-cmp-ext-fl ${k(3)}`} aria-hidden="true"><ArrowRight className="pt-ic" /></span>
        <div className={`pt-cmp-ext-pas ${k(3)}`} aria-hidden="true">
          <small className="pt-cmp-ext-et">{t("portada.completo.extres.confirmat_et")}</small>
          <p className="pt-cmp-ext-conf"><b>{t("portada.completo.extres.confirmat")}</b></p>
          <span className="pt-cmp-ext-pilar"><span className="pt-cmp-av" style={{ background: "#0f766e" }}>P</span>{t("portada.completo.extres.neteja_avisada")}<Check className="pt-ic" strokeWidth={3} /></span>
        </div>
      </div>
    </article>
  );
}

/** «Conéctalo todo»: Hostly al mig i, al voltant, el que el gestor ja fa servir. */
function Connecta({ nom }: { nom: string }) {
  const { t } = useTranslation("home");
  const nodes = t("portada.completo.connecta.nodes", { returnObjects: true }) as string[];
  return (
    <article className="pt-cmp-t pt-cmp-clar pt-cmp-connecta">
      <div className="pt-cmp-dalt">
        <p className="pt-cmp-pindola">{t("portada.completo.connecta.retol")}</p>
        <Fletxa a="/funcionalidades/conecta-todo" que={nom} />
      </div>
      <h3 className="pt-cmp-h3">{t("portada.completo.connecta.titol")} <span className="pt-cmp-gris">{t("portada.completo.connecta.titol_gris")}</span></h3>
      <div className="pt-cmp-xarxa" aria-hidden="true">
        <svg className="pt-cmp-fils" viewBox="0 0 300 120" preserveAspectRatio="none">
          {[[66, 19], [234, 19], [54, 98], [246, 98], [150, 115]].map(([x, y], i) => (
            <path key={i} d={`M150 60 L${x} ${y}`} />
          ))}
        </svg>
        <span className="pt-cmp-cor"><img src={iconaApp} alt="" width={30} height={30} /></span>
        {nodes.map((n, i) => {
          const Icona = ICONES_NODES[i] ?? Plus;
          return <span key={n} className={`pt-cmp-node n${i}`}><Icona className="pt-ic" />{n}</span>;
        })}
      </div>
      <p className="pt-cmp-p">{t("portada.completo.connecta.text")}</p>
    </article>
  );
}

export default function Completo() {
  const { t } = useTranslation("home");
  const { lang } = useLang();
  const seccioRef = useRef<HTMLElement>(null);
  const graellaRef = useRef<HTMLDivElement>(null);
  const [actiu, setActiu] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [pas, setPas] = useState(0);
  const noms = t("portada.completo.nom_pas", { returnObjects: true }) as string[];

  // Es mou només mentre es veu; amb «reduir moviment», quiet
  useEffect(() => {
    const s = seccioRef.current;
    if (!s) return;
    setQuiet(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setActiu(e.isIntersecting), { threshold: 0.12 });
    io.observe(s);
    return () => io.disconnect();
  }, []);

  // L'entrada de les rajoles, el preu que puja i el que cobraràs
  useEffect(() => {
    const s = seccioRef.current;
    if (!s) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rajoles = s.querySelectorAll(".pt-cmp-t, .pt-cmp-pont");
      gsap.set(rajoles, { autoAlpha: 0, y: 18 });
      const entra = ScrollTrigger.create({
        trigger: s, start: "top 75%", once: true,
        onEnter: () => gsap.to(rajoles, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.07 }),
      });
      const nPreu = s.querySelector(".pt-cmp-preu-n") as HTMLElement;
      const xipsPreu = s.querySelectorAll(".pt-cmp-dia .pt-cmp-x");
      const preu = { v: 145 };
      const tlPreu = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
      tlPreu.set(xipsPreu, { autoAlpha: 0, y: 4 }, 0)
        .call(() => { preu.v = 145; nPreu.textContent = milers(145); }, undefined, 0)
        .to(preu, { v: 251, duration: 1.3, ease: "power3.out", onUpdate: () => { nPreu.textContent = milers(preu.v); } }, 0.5)
        .to(xipsPreu, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.12 }, 1.2)
        .to(xipsPreu, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 6.4);
      const viu = ScrollTrigger.create({ trigger: s, start: "top 85%", end: "bottom 10%", onToggle: (st) => { if (st.isActive) tlPreu.play(); else tlPreu.pause(); } });
      const nMes = s.querySelector(".pt-cmp-mes-n") as HTMLElement;
      const mes = { v: 0 };
      const compta = ScrollTrigger.create({
        trigger: nMes, start: "top 90%", once: true,
        onEnter: () => gsap.to(mes, { v: 8549, duration: 1.6, ease: "power3.out", onUpdate: () => { nMes.textContent = milers(mes.v); } }),
      });
      return () => {
        entra.kill(); viu.kill(); compta.kill(); tlPreu.kill();
        gsap.set(rajoles, { clearProps: "all" });
        gsap.set(xipsPreu, { clearProps: "all" });
        nPreu.textContent = milers(251);
        nMes.textContent = milers(8549);
      };
    });
    return () => mm.revert();
  }, [lang]);

  // Al mòbil, les rajoles llisquen: els botons i els punts. Les distàncies es mesuren a la pantalla (no amb
  // offsetLeft, que canvia de referència si la graella passa a estar posicionada).
  const rajoles = () => [...(graellaRef.current?.querySelectorAll<HTMLElement>(":scope > .pt-cmp-t") ?? [])];
  const inici = (g: HTMLElement) => g.getBoundingClientRect().left + (parseFloat(getComputedStyle(g).scrollPaddingInlineStart) || 0);
  const vesA = useCallback((i: number) => {
    const g = graellaRef.current;
    const fill = rajoles()[i];
    if (g && fill) g.scrollTo({ left: g.scrollLeft + fill.getBoundingClientRect().left - inici(g), behavior: quiet ? "auto" : "smooth" });
  }, [quiet]);
  const enLliscar = () => {
    const g = graellaRef.current;
    if (!g) return;
    const vora = inici(g);
    const dist = rajoles().map((f) => Math.abs(f.getBoundingClientRect().left - vora));
    setPas(dist.indexOf(Math.min(...dist)));
  };

  return (
    <section ref={seccioRef} id="completo" className="pt-seccio pt-cmp" aria-labelledby="pt-cmp-titol">
      <div className="contenidor">
        <div className="pt-centre">
          <p className="pt-cmp-pindola">{t("portada.completo.retol")}</p>
          <h2 id="pt-cmp-titol" className="pt-h2">
            {t("portada.completo.titol")} <span className="pt-cmp-gris">{t("portada.completo.titol_gris")}</span>
          </h2>
        </div>

        <div ref={graellaRef} className="pt-cmp-graella" onScroll={enLliscar}>
          <Missatges actiu={actiu} quiet={quiet} />

          <article className="pt-cmp-t pt-cmp-preus">
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
                <p><b><span className="pt-cmp-preu-n">{milers(251)}</span> €</b><span>{t("portada.completo.preus.nit")}</span></p>
                <div className="pt-cmp-xs">
                  <span className="pt-cmp-x pt-cmp-x-verd">{t("portada.completo.preus.demanda")}</span>
                  <span className="pt-cmp-x pt-cmp-x-ambre">{t("portada.completo.preus.festiu")}</span>
                </div>
              </div>
            </div>
          </article>

          <Neteja actiu={actiu} quiet={quiet} nom={noms[2]} />

          <article className="pt-cmp-t pt-cmp-clar pt-cmp-cal">
            <div className="pt-cmp-dalt">
              <p className="pt-cmp-pindola">{noms[3]}</p>
              <Fletxa a="/funcionalidades/channel-manager" que={noms[3]} />
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

          <Extres actiu={actiu} quiet={quiet} nom={noms[4]} />
          <Connecta nom={noms[5]} />

          {/* L'enllaç entre Mensajes (a dalt) i els extres (a sota): els cobra un missatge automàtic */}
          <p className="pt-cmp-pont" aria-hidden="true"><Zap className="pt-ic" />{t("portada.completo.extres.pont")}</p>
        </div>

        {/* Al mòbil: per passar d'una rajola a l'altra */}
        <div className="pt-cmp-control">
          <button type="button" onClick={() => vesA(Math.max(0, pas - 1))} aria-label={t("portada.completo.anterior")} disabled={pas === 0}><ArrowLeft className="pt-ic" aria-hidden="true" /></button>
          <div className="pt-cmp-punts" aria-hidden="true">{noms.map((_, i) => <i key={i} className={i === pas ? "ara" : undefined} />)}</div>
          <span className="pt-cmp-nom" aria-live="polite">{noms[pas]}</span>
          <button type="button" onClick={() => vesA(Math.min(noms.length - 1, pas + 1))} aria-label={t("portada.completo.seguent")} disabled={pas === noms.length - 1}><ArrowRight className="pt-ic" aria-hidden="true" /></button>
        </div>
      </div>
    </section>
  );
}
