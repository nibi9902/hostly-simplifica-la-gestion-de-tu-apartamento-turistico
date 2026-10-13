/**
 * «Un plan gratis. Un plan completo. Nada más.» — els dos plans i, a sota, els referits.
 * Els dos botons porten a /empezar (allà es tria el pla). «Cómo funciona» desplega la regla dels
 * referits, la mateixa que diuen els termes (5 propietaris al Completo = un pis teu deixa de pagar).
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

export default function Preus({ onEmpezar }: { onEmpezar: () => void }) {
  const { t } = useTranslation("home");
  const [referitsObert, setReferitsObert] = useState(false);
  const gratis = t("portada.preus.gratis.inclou", { returnObjects: true }) as string[];
  const complet = t("portada.preus.complet.inclou", { returnObjects: true }) as string[];

  return (
    <section id="precios" className="pt-seccio pt-preus" aria-labelledby="pt-preus-titol">
      <div className="contenidor">
        <div className="pt-centre">
          <p className="pt-retol">{t("portada.preus.retol")}</p>
          <h2 id="pt-preus-titol" className="pt-h2">
            {t("portada.preus.titol")} <span>{t("portada.preus.titol_gris")}</span>
          </h2>
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
            <button
              type="button"
              className="pt-pill pt-pill-sec"
              aria-expanded={referitsObert}
              aria-controls="pt-referits-detall"
              onClick={() => setReferitsObert((o) => !o)}
            >
              {t("portada.preus.referits.boto")}
            </button>
          </div>
          <p id="pt-referits-detall" className="pt-referits-detall" hidden={!referitsObert}>
            <b>{t("pricing.referral_title")}</b> {t("pricing.referral_desc")}
          </p>
        </div>
      </div>
    </section>
  );
}
