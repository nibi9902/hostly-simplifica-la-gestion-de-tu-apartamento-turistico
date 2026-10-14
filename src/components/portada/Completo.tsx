/**
 * «Con el Completo, todo lo demás.» — el mòdul del pla Completo, just després del Gratis.
 *
 * És la «G · El taulell» de les idees noves del 14-10 (el Biel: «el G m'agrada moltíssim la idea, fem
 * algo així però personalitzem-ho per Hostly de la millor manera possible»). Rajoles de mides diferents
 * i, dins de cadascuna, un tros de l'app tal com és:
 * - Mensajes: la conversa amb la IA, amb la traducció que veu el gestor; canvia d'idioma sola (o amb la
 *   barra de sota) i la IA «escriu» abans de contestar.
 * - Precios: el detall d'un dia de Setmana Santa, amb el preu que puja, la demanda i el festiu.
 * - Limpieza: la neteja de la Pilar, que passa de «Coordinada» a «Hecha».
 * - Calendario: les reserves de cada canal en un sol calendari, com la vista General de l'app.
 * - Extras y cuentas: la sortida tardana pagada i «lo que cobrarás este mes».
 * Les frases són les de la targeta del Completo als preus. La rodona amb fletxa porta a la pàgina de
 * cada funció. Al mòbil, les rajoles llisquen de costat.
 * Moviment: GSAP com la resta de la portada, només mentre es veu; amb «reduir moviment», quiet i sencer.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, RefreshCw, Sparkles } from "lucide-react";
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

/** La rodona amb fletxa: porta a la pàgina de la funció. */
function Fletxa({ a, que, vidre = false }: { a: string; que: string; vidre?: boolean }) {
  const { t } = useTranslation("home");
  return (
    <LangLink to={a} className={`pt-cmp-fletxa${vidre ? " pt-cmp-vidre" : ""}`} aria-label={t("portada.completo.veure", { que })}>
      <ArrowUpRight className="pt-ic" aria-hidden="true" />
    </LangLink>
  );
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

export default function Completo() {
  const { t } = useTranslation("home");
  const { lang } = useLang();
  const seccioRef = useRef<HTMLElement>(null);
  const graellaRef = useRef<HTMLDivElement>(null);
  const [actiu, setActiu] = useState(false);
  const [quiet, setQuiet] = useState(false);
  const [neteja, setNeteja] = useState<"coordinada" | "feta">("feta");
  const [pas, setPas] = useState(0);
  const noms = t("portada.completo.nom_pas", { returnObjects: true }) as string[];
  // «8.549», com a l'app (amb Intl, en castellà i català el punt dels milers no surt fins a cinc xifres)
  const eur = { format: (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") };

  // Es mou només mentre es veu; amb «reduir moviment», quiet
  useEffect(() => {
    const s = seccioRef.current;
    if (!s) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setQuiet(mq.matches);
    const io = new IntersectionObserver(([e]) => setActiu(e.isIntersecting), { threshold: 0.15 });
    io.observe(s);
    return () => io.disconnect();
  }, []);

  // La neteja: «Coordinada» → «Hecha», i torna a començar
  useEffect(() => {
    if (!actiu || quiet) { setNeteja("feta"); return; }
    let viu = true;
    const volta = () => {
      if (!viu) return;
      setNeteja("coordinada");
      window.setTimeout(() => { if (viu) setNeteja("feta"); }, 1800);
    };
    volta();
    const id = window.setInterval(volta, 6000);
    return () => { viu = false; window.clearInterval(id); };
  }, [actiu, quiet]);

  // L'entrada de les rajoles, el preu que puja i el que cobraràs
  useEffect(() => {
    const s = seccioRef.current;
    if (!s) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rajoles = s.querySelectorAll(".pt-cmp-t");
      gsap.set(rajoles, { autoAlpha: 0, y: 18 });
      const entra = ScrollTrigger.create({
        trigger: s, start: "top 75%", once: true,
        onEnter: () => gsap.to(rajoles, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }),
      });
      const nPreu = s.querySelector(".pt-cmp-preu-n") as HTMLElement;
      const xipsPreu = s.querySelectorAll(".pt-cmp-dia .pt-cmp-x");
      const preu = { v: 145 };
      const tlPreu = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
      tlPreu.set(xipsPreu, { autoAlpha: 0, y: 4 }, 0)
        .call(() => { preu.v = 145; nPreu.textContent = eur.format(145); }, undefined, 0)
        .to(preu, { v: 251, duration: 1.3, ease: "power3.out", onUpdate: () => { nPreu.textContent = eur.format(Math.round(preu.v)); } }, 0.5)
        .to(xipsPreu, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.12 }, 1.2)
        .to(xipsPreu, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 6.4);
      const viu = ScrollTrigger.create({ trigger: s, start: "top 85%", end: "bottom 10%", onToggle: (st) => { if (st.isActive) tlPreu.play(); else tlPreu.pause(); } });
      const nMes = s.querySelector(".pt-cmp-mes-n") as HTMLElement;
      const mes = { v: 0 };
      const compta = ScrollTrigger.create({
        trigger: nMes, start: "top 90%", once: true,
        onEnter: () => gsap.to(mes, { v: 8549, duration: 1.6, ease: "power3.out", onUpdate: () => { nMes.textContent = eur.format(Math.round(mes.v)); } }),
      });
      return () => {
        entra.kill(); viu.kill(); compta.kill(); tlPreu.kill();
        gsap.set(rajoles, { clearProps: "all" });
        gsap.set(xipsPreu, { clearProps: "all" });
        nPreu.textContent = eur.format(251);
        nMes.textContent = eur.format(8549);
      };
    });
    return () => mm.revert();
    // eur canvia amb l'idioma
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Al mòbil, les rajoles llisquen: els botons i els punts
  const vesA = useCallback((i: number) => {
    const g = graellaRef.current;
    const fill = g?.children[i] as HTMLElement | undefined;
    if (g && fill) g.scrollTo({ left: fill.offsetLeft - g.offsetLeft, behavior: quiet ? "auto" : "smooth" });
  }, [quiet]);
  const enLliscar = () => {
    const g = graellaRef.current;
    if (!g) return;
    const fills = [...g.children] as HTMLElement[];
    let millor = 0;
    fills.forEach((f, i) => { if (Math.abs(f.offsetLeft - g.offsetLeft - g.scrollLeft) < Math.abs(fills[millor].offsetLeft - g.offsetLeft - g.scrollLeft)) millor = i; });
    setPas(millor);
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
                <p><b><span className="pt-cmp-preu-n">{eur.format(251)}</span> €</b><span>{t("portada.completo.preus.nit")}</span></p>
                <div className="pt-cmp-xs">
                  <span className="pt-cmp-x pt-cmp-x-verd">{t("portada.completo.preus.demanda")}</span>
                  <span className="pt-cmp-x pt-cmp-x-ambre">{t("portada.completo.preus.festiu")}</span>
                </div>
              </div>
            </div>
          </article>

          <article className="pt-cmp-t pt-cmp-clar pt-cmp-neteja">
            <div className="pt-cmp-dalt">
              <p className="pt-cmp-pindola">{noms[2]}</p>
              <Fletxa a="/funcionalidades/gestion-de-limpiezas" que={noms[2]} />
            </div>
            <h3 className="pt-cmp-h3">{t("portada.completo.neteja.titol")} <span className="pt-cmp-gris">{t("portada.completo.neteja.titol_gris")}</span></h3>
            <p className="pt-cmp-p">{t("portada.completo.neteja.text")}</p>
            <div className="pt-cmp-mostra" aria-hidden="true">
              <div className="pt-cmp-fila">
                <span className="pt-cmp-av" style={{ background: "#0f766e" }}>P</span>
                <span className="pt-cmp-qui"><b>Pilar</b><small>{t("portada.completo.neteja.pis")}</small></span>
                <span className={`pt-cmp-estat ${neteja === "feta" ? "feta" : ""}`}>
                  {neteja === "feta" ? <><Check className="pt-ic" strokeWidth={3} />{t("portada.completo.neteja.feta")}</> : t("portada.completo.neteja.coordinada")}
                </span>
              </div>
              <div className="pt-cmp-equip">
                <span className="pt-cmp-av petit" style={{ background: "#0f766e" }}>P</span>
                <span className="pt-cmp-av petit" style={{ background: "#b45309" }}>C</span>
                <span className="pt-cmp-av petit" style={{ background: "#6d28d9" }}>M</span>
                <small>{t("portada.completo.neteja.equip")}</small>
                <img src={whatsapp} alt="" width={18} height={18} />
              </div>
            </div>
          </article>

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

          <article className="pt-cmp-t pt-cmp-clar pt-cmp-extres">
            <div className="pt-cmp-dalt">
              <p className="pt-cmp-pindola">{noms[4]}</p>
              <Fletxa a="/funcionalidades/finanzas" que={noms[4]} />
            </div>
            <h3 className="pt-cmp-h3">{t("portada.completo.extres.titol")} <span className="pt-cmp-gris">{t("portada.completo.extres.titol_gris")}</span></h3>
            <div className="pt-cmp-mostra" aria-hidden="true">
              <div className="pt-cmp-fila"><span className="pt-cmp-qui"><b>{t("portada.completo.extres.concepte")}</b></span><b className="pt-cmp-num">25 €</b></div>
              <span className="pt-cmp-estat feta"><Check className="pt-ic" strokeWidth={3} />{t("portada.completo.extres.pagat")}</span>
              <p className="pt-cmp-mes"><b><span className="pt-cmp-mes-n">{eur.format(8549)}</span> €</b><small>{t("portada.completo.extres.mes")}</small></p>
            </div>
          </article>
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
