/**
 * «Gratis para siempre: el check-in y la policía.» — el bloc gran del pla gratis (la targeta fosca
 * amb el 0 €) i, al costat, quatre peces: el check-in, la policia, la taxa que es calcula i la taxa
 * pagada online.
 *
 * La taxa: es compta de nou cada vegada (hostes × pernoctacions × preu per nit = el que toca pagar) i
 * es declara per SEMESTRES («De abril a septiembre»), encara que el Biel en digués «trimestre». La
 * xifra és un exemple: 310 pernoctacions × 1,75 € (pis turístic fora de Barcelona) = 542,50 €.
 * El pagament: l'hoste toca «Pagar», el botó es fa una roda, «Pagada» i els diners arriben.
 * Les dues es mouen només mentre es veuen, i tornen a començar.
 */
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, FileText } from "lucide-react";
import { useLang } from "@/i18n/useLang";

gsap.registerPlugin(ScrollTrigger);

const NO = { immediateRender: false };
const amb = (o: gsap.TweenVars): gsap.TweenVars => ({ ...o, ...NO });

/** El tic que es dibuixa (la seva traça s'anima). */
function TicDibuixat() {
  return (
    <svg className="pt-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path className="pt-chk" d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function construeixTaxa(m: HTMLElement, eur: Intl.NumberFormat): gsap.core.Timeline {
  const q = (s: string) => m.querySelector(s) as HTMLElement;
  const esc = q(".pt-escaner");
  const r1 = q(".pt-r1"), r2 = q(".pt-r2"), r3 = q(".pt-r3");
  const regla = q(".pt-regla"), total = q(".pt-total"), totalB = total.querySelector("b");
  const nHu = q(".pt-n-hu"), nPe = q(".pt-n-pe"), nTo = q(".pt-n-eur");
  const eCalc = q(".pt-e-calc"), eLl = q(".pt-e-llesta"), chk = eLl.querySelector(".pt-chk");
  const y1 = r1.offsetTop - 3, y2 = r2.offsetTop - 3, y3 = r3.offsetTop - 3;
  const hu = { v: 0 }, pe = { v: 0 }, to = { v: 0 };
  const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.3, defaults: { ease: "power3.out", duration: 0.5 } });
  tl.set([r1, r2, r3, total], amb({ autoAlpha: 0, y: 6 }), 0)
    .set(regla, amb({ scaleX: 0, autoAlpha: 1 }), 0)
    .set(eLl, amb({ autoAlpha: 0, y: 6 }), 0)
    .set(eCalc, amb({ autoAlpha: 1, y: 0 }), 0)
    .set(esc, amb({ autoAlpha: 0, y: y1 }), 0)
    .call(() => { hu.v = 0; pe.v = 0; to.v = 0; nHu.textContent = "0"; nPe.textContent = "0"; nTo.textContent = eur.format(0); }, undefined, 0)
    // primera fila: les persones
    .to(esc, { autoAlpha: 1, duration: 0.25 }, 0.25)
    .to(r1, { autoAlpha: 1, y: 0 }, 0.25)
    .to(hu, { v: 72, duration: 0.8, ease: "power2.out", onUpdate: () => { nHu.textContent = String(Math.round(hu.v)); } }, 0.3)
    // segona: les nits
    .to(esc, { y: y2, duration: 0.45, ease: "power3.inOut" }, 0.85)
    .to(r2, { autoAlpha: 1, y: 0 }, 0.85)
    .to(pe, { v: 310, duration: 0.9, ease: "power2.out", onUpdate: () => { nPe.textContent = String(Math.round(pe.v)); } }, 0.9)
    // tercera: el preu
    .to(esc, { y: y3, duration: 0.45, ease: "power3.inOut" }, 1.5)
    .to(r3, { autoAlpha: 1, y: 0 }, 1.5)
    // el total
    .to(esc, { autoAlpha: 0, duration: 0.3 }, 2.05)
    .to(regla, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 2.0)
    .to(total, { autoAlpha: 1, y: 0 }, 2.2)
    .to(to, { v: 542.5, duration: 1.2, ease: "power3.out", onUpdate: () => { nTo.textContent = eur.format(to.v); } }, 2.25)
    .fromTo(totalB, { scale: 0.9 }, { scale: 1, duration: 1.2, ease: "power3.out" }, 2.25)
    // llesta per presentar
    .to(eCalc, { autoAlpha: 0, y: -6, duration: 0.25, ease: "power2.in" }, 3.35)
    .to(eLl, { autoAlpha: 1, y: 0, duration: 0.4 }, 3.45)
    .fromTo(chk, { strokeDashoffset: 24 }, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 3.55)
    // es queda un moment i torna a començar
    .to([r1, r2, r3, total, regla, eLl], { autoAlpha: 0, duration: 0.35, ease: "power2.in" }, 9.2);
  return tl;
}

function construeixPagament(m: HTMLElement): gsap.core.Timeline {
  const q = (s: string) => m.querySelector(s) as HTMLElement;
  const boto = q(".pt-boto-pagar"), spin = q(".pt-spin"), pagada = q(".pt-pagada");
  const chk = pagada.querySelector(".pt-chk"), dit = q(".pt-dit"), cobrat = q(".pt-cobrat");
  const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.3, defaults: { ease: "power3.out", duration: 0.4 } });
  tl.set(boto, amb({ autoAlpha: 1, scale: 1 }), 0)
    .set(spin, amb({ autoAlpha: 0, scale: 0.6, rotation: 0 }), 0)
    .set(pagada, amb({ autoAlpha: 0, scale: 0.85 }), 0)
    .set(cobrat, amb({ autoAlpha: 0, y: 8 }), 0)
    .set(dit, amb({ autoAlpha: 0, scale: 0.3 }), 0)
    // l'hoste toca «Pagar»
    .to(dit, { autoAlpha: 0.6, scale: 1, duration: 0.25, ease: "power2.out" }, 1.0)
    .to(dit, { autoAlpha: 0, scale: 1.9, duration: 0.45, ease: "power2.out" }, 1.25)
    .to(boto, { scale: 0.94, duration: 0.12, ease: "power1.in" }, 1.0)
    .to(boto, { scale: 1, duration: 0.3 }, 1.12)
    // el botó es fa una roda que gira
    .to(boto, { autoAlpha: 0, scale: 0.6, duration: 0.3, ease: "power2.in" }, 1.45)
    .to(spin, { autoAlpha: 1, scale: 1, duration: 0.3 }, 1.55)
    .to(spin, { rotation: 540, duration: 1.1, ease: "none" }, 1.55)
    // pagada, i els diners arriben
    .to(spin, { autoAlpha: 0, scale: 0.6, duration: 0.25, ease: "power2.in" }, 2.6)
    .to(pagada, { autoAlpha: 1, scale: 1, duration: 0.45 }, 2.7)
    .fromTo(chk, { strokeDashoffset: 24 }, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, 2.8)
    .to(cobrat, { autoAlpha: 1, y: 0, duration: 0.5 }, 3.2)
    .to(cobrat, { autoAlpha: 0, y: -8, duration: 0.45, ease: "power2.in" }, 7.6)
    .to(pagada, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 8.0);
  return tl;
}

export default function Gratis({ onEmpezar, nou = false }: { onEmpezar: () => void; nou?: boolean }) {
  const { t } = useTranslation("home");
  const { lang } = useLang();
  const seccioRef = useRef<HTMLElement>(null);
  const eur = new Intl.NumberFormat(lang === "ca" ? "ca-ES" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    const s = seccioRef.current;
    if (!s) return;
    const format = new Intl.NumberFormat(lang === "ca" ? "ca-ES" : "es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const taxa = s.querySelector(".pt-tile-taxa") as HTMLElement;
      const pago = s.querySelector(".pt-tile-pago") as HTMLElement;
      const tlT = construeixTaxa(taxa.querySelector(".pt-calc") as HTMLElement, format);
      const tlG = construeixPagament(pago.querySelector(".pt-pago") as HTMLElement);
      // es mouen mentre es veuen
      ScrollTrigger.create({ trigger: taxa, start: "top 85%", end: "bottom 10%", onToggle: (st) => { if (st.isActive) tlT.play(); else tlT.pause(); } });
      ScrollTrigger.create({ trigger: pago, start: "top 85%", end: "bottom 10%", onToggle: (st) => { if (st.isActive) tlG.play(); else tlG.pause(); } });
      return () => {
        tlT.kill();
        tlG.kill();
        // en repòs, les xifres del final
        (taxa.querySelector(".pt-n-hu") as HTMLElement).textContent = "72";
        (taxa.querySelector(".pt-n-pe") as HTMLElement).textContent = "310";
        (taxa.querySelector(".pt-n-eur") as HTMLElement).textContent = format.format(542.5);
      };
    });
    return () => mm.revert();
  }, [lang]);

  return (
    <section ref={seccioRef} id="gratis" className={`pt-seccio pt-gratis${nou ? " pt-gratis-nou" : ""}`} aria-labelledby="pt-gratis-titol">
      <div className="contenidor">
        <div className="pt-centre">
          <p className="pt-retol">{nou ? t("portada.gratis.pla") : t("portada.gratis.retol")}</p>
          <h2 id="pt-gratis-titol" className="pt-h2">{t("portada.gratis.titol")}</h2>
        </div>
        <div className="pt-bento">
          {/* La versió «nova» (?gratis=nou, 15-10, per comparar): sense la segona targeta fosca del 0 €, que
              ja és al Zero; els quatre passos numerats i, a sota, el 0 € i el botó. Quan el Biel triï, se'n queda una. */}
          {!nou && <div className="pt-fosca">
            <p className="pt-retol">{t("portada.gratis.pla")}</p>
            <p className="pt-zero">{t("portada.gratis.zero")}</p>
            <p className="pt-sempre">{t("portada.gratis.sempre")}</p>
            <p className="pt-txt">{t("portada.gratis.text")}</p>
            <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-blanc">{t("portada.gratis.boto")}</button>
          </div>}

          <div className="pt-tile">
            <h3>{t("portada.gratis.checkin.titol")}</h3>
            <p>{t("portada.gratis.checkin.text")}</p>
            <div className="pt-mostra" aria-hidden="true">
              <p className="pt-fila"><b>{t("portada.gratis.checkin.document")}</b><span className="pt-et">{t("portada.gratis.checkin.pas")}</span></p>
              <div className="pt-barra"><span className="fet" /><span className="fet" /><span /></div>
              <p className="pt-fila"><span className="pt-et">{t("portada.gratis.checkin.passaport")}</span><span className="pt-ok"><Check className="pt-ic" strokeWidth={3} /></span></p>
            </div>
          </div>

          <div className="pt-tile">
            <h3>{t("portada.gratis.policia.titol")}</h3>
            <p>{t("portada.gratis.policia.text")}</p>
            <div className="pt-mostra" aria-hidden="true">
              <p className="pt-ok"><Check className="pt-ic" strokeWidth={3} />{t("portada.gratis.policia.enviat")}</p>
              <span className="pt-pdf"><FileText className="pt-ic" />{t("portada.gratis.policia.comprovant")}</span>
            </div>
          </div>

          <div className="pt-tile pt-tile-taxa">
            <h3>{t("portada.gratis.taxa.titol")}</h3>
            <p>{t("portada.gratis.taxa.text")}</p>
            <div className="pt-mostra pt-calc" role="group" aria-label={t("portada.gratis.taxa.aria")}>
              <span className="pt-escaner" aria-hidden="true" />
              <p className="pt-estat" aria-hidden="true">
                <span className="pt-xip-gris pt-e-calc"><span className="pt-punts"><i /><i /><i /></span>{t("portada.gratis.taxa.calculant")}</span>
                <span className="pt-xip-verd pt-e-llesta"><TicDibuixat />{t("portada.gratis.taxa.llesta")}</span>
              </p>
              <p className="pt-fila pt-r1" aria-hidden="true"><span className="pt-et">{t("portada.gratis.taxa.hostes")}</span><b className="pt-n pt-n-hu">72</b></p>
              <p className="pt-fila pt-r2" aria-hidden="true"><span className="pt-et">{t("portada.gratis.taxa.nits")}</span><b className="pt-n pt-n-pe">310</b></p>
              <p className="pt-fila pt-r3" aria-hidden="true"><span className="pt-et"><i className="pt-op">×</i>{t("portada.gratis.taxa.preu")}</span><b>{`${eur.format(1.75)} €`}</b></p>
              <span className="pt-regla" aria-hidden="true" />
              <p className="pt-fila pt-total" aria-hidden="true">
                <span><i className="pt-op">=</i>{t("portada.gratis.taxa.total")}</span>
                <b><span className="pt-n-eur">{eur.format(542.5)}</span>€</b>
              </p>
            </div>
          </div>

          <div className="pt-tile pt-tile-pago">
            <h3>{t("portada.gratis.pagament.titol")}</h3>
            <p>{t("portada.gratis.pagament.text")}</p>
            <div className="pt-mostra pt-pago">
              <p className="pt-fila"><b>{t("portada.gratis.pagament.concepte")}</b><b>{`${eur.format(14)} €`}</b></p>
              <p className="pt-fila"><span className="pt-et">{t("portada.gratis.pagament.detall")}</span></p>
              <div className="pt-accio">
                <span className="pt-boto-pagar" aria-hidden="true">{t("portada.gratis.pagament.pagar")}</span>
                <span className="pt-dit" aria-hidden="true" />
                <span className="pt-spin" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /></svg></span>
                <span className="pt-xip-verd pt-pagada"><TicDibuixat />{t("portada.gratis.pagament.pagada")}</span>
              </div>
              <span className="pt-cobrat" aria-hidden="true">{t("portada.gratis.pagament.cobrat")}</span>
            </div>
          </div>
        </div>
        {nou && (
          <div className="pt-gratis-peu">
            <p><b>{t("portada.gratis.zero")}</b> · {t("portada.gratis.peu_nou")}</p>
            <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-pri">{t("portada.gratis.boto")}</button>
          </div>
        )}
      </div>
    </section>
  );
}
