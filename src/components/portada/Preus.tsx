/**
 * «Un plan gratis. Un plan completo. Nada más.» — els dos plans i, a sota, els referits.
 * Els dos botons porten a /empezar (allà es tria el pla). «Cómo funciona» obre una finestra amb la regla
 * dels referits, la mateixa que diuen els termes (5 propietaris al Completo = un pis teu deixa de pagar).
 * Abans es desplegava a sota; el Biel (13-10): «hauria de sortir un pop-up, no així cap avall».
 * A /precios (`pagina`) és la primera secció: el títol és l'h1, porta una frase a sota i, al final,
 * l'enllaç a la calculadora.
 */
import { useTranslation } from "react-i18next";
import * as Dialeg from "@radix-ui/react-dialog";
import { ArrowRight, Check, Home, UserRound, X } from "lucide-react";
import { LangLink } from "@/i18n/LangLink";

/** La finestra dels referits: cinc propietaris → un pis teu a 0 €, i la regla en dues frases. */
function Referits() {
  const { t } = useTranslation("home");
  return (
    <Dialeg.Root>
      <Dialeg.Trigger className="pt-pill pt-pill-sec">{t("portada.preus.referits.boto")}</Dialeg.Trigger>
      <Dialeg.Portal>
        <Dialeg.Overlay className="pt-dialeg-fons" />
        <Dialeg.Content className="pt-seccio pt-dialeg">
          <p className="pt-retol">{t("portada.preus.referits.etiqueta")}</p>
          <Dialeg.Title className="pt-dialeg-titol">{t("portada.preus.referits.titol")}</Dialeg.Title>
          {/* cinc propietaris i, a canvi, un pis teu deixa de pagar */}
          <div className="pt-dialeg-dibuix" aria-hidden="true">
            <span className="pt-dialeg-cinc">{Array.from({ length: 5 }, (_, i) => <span key={i}><UserRound className="pt-ic" /></span>)}</span>
            <ArrowRight className="pt-ic pt-dialeg-fletxa" />
            <span className="pt-dialeg-pis"><Home className="pt-ic" /><b>0 €</b></span>
          </div>
          <Dialeg.Description asChild>
            <div className="pt-dialeg-text">
              <p><b>{t("pricing.referral_title")}</b></p>
              <p>{t("pricing.referral_desc")}</p>
            </div>
          </Dialeg.Description>
          <Dialeg.Close className="pt-pill pt-pill-pri pt-dialeg-ok">{t("portada.preus.referits.entesos")}</Dialeg.Close>
          <Dialeg.Close className="pt-dialeg-x" aria-label={t("portada.preus.referits.tancar")}><X className="pt-ic" /></Dialeg.Close>
        </Dialeg.Content>
      </Dialeg.Portal>
    </Dialeg.Root>
  );
}

export default function Preus({ onEmpezar, pagina = false }: { onEmpezar: () => void; pagina?: boolean }) {
  const { t } = useTranslation("home");
  const gratis = t("portada.preus.gratis.inclou", { returnObjects: true }) as string[];
  const complet = t("portada.preus.complet.inclou", { returnObjects: true }) as string[];
  const Titol = pagina ? "h1" : "h2";

  return (
    <section id="precios" className={`pt-seccio pt-preus${pagina ? " pt-pagina" : ""}`} aria-labelledby="pt-preus-titol">
      <div className="contenidor">
        <div className="pt-centre">
          <p className="pt-retol">{t("portada.preus.retol")}</p>
          <Titol id="pt-preus-titol" className="pt-h2">
            {t("portada.preus.titol")} <span>{t("portada.preus.titol_gris")}</span>
          </Titol>
          {pagina && <p className="pt-lead">{t("pricing.subtitle")}</p>}
        </div>

        <div className="pt-plans">
          <article className="pt-pla">
            <p className="pt-pla-cap">{t("portada.preus.gratis.nom")}</p>
            <p className="pt-preu"><b>{t("portada.preus.gratis.preu")}</b><span>{t("portada.preus.gratis.periode")}</span></p>
            <p className="pt-preu-nota">{t("portada.preus.gratis.nota")}</p>
            <ul className="pt-inclou">
              {gratis.map((f) => <li key={f}><Check className="pt-ic" strokeWidth={2.6} aria-hidden="true" />{f}</li>)}
            </ul>
            <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-sec">{t("portada.preus.gratis.boto")}</button>
            <p className="pt-pla-fi">{t("portada.preus.gratis.peu")}</p>
          </article>

          <article className="pt-pla pt-pla-top">
            <p className="pt-pla-cap">
              {t("portada.preus.complet.nom")}
              <span className="pt-xip pt-xip-blau">{t("portada.preus.complet.recomanat")}</span>
            </p>
            <p className="pt-preu"><b>{t("portada.preus.complet.preu")}</b><span>{t("portada.preus.complet.periode")}</span></p>
            <p className="pt-preu-nota">{t("portada.preus.complet.nota")}</p>
            <ul className="pt-inclou">
              {complet.map((f) => <li key={f}><Check className="pt-ic" strokeWidth={2.6} aria-hidden="true" />{f}</li>)}
            </ul>
            <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-pri">{t("portada.preus.complet.boto")}</button>
            <p className="pt-pla-fi">{t("portada.preus.complet.peu")}</p>
          </article>
        </div>

        <div className="pt-referits">
          <div className="pt-referits-fila">
            <span className="pt-xip pt-xip-blau">{t("portada.preus.referits.etiqueta")}</span>
            <span>{t("portada.preus.referits.text")}</span>
            <Referits />
          </div>
        </div>
        {pagina && (
          <p className="pt-preus-calcula">
            <LangLink to="/calcula">{t("pricing.calcula_link")}<ArrowRight className="pt-ic" aria-hidden="true" /></LangLink>
          </p>
        )}
      </div>
    </section>
  );
}
