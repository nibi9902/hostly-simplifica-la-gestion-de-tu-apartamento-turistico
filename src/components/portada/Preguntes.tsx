/**
 * Cinc preguntes curtes a la portada, entre els preus i el «Llámame» (revisió de màrqueting del 15-10:
 * les objeccions d'aquest públic —permanència, si el gratis és gratis de debò, qui envia el registre a la
 * policia, passar-se al Completo, quant es tarda— no es responien enlloc de la portada). Mateix disseny
 * que les de /precios, amb els textos d'allà i una de nova (qui envia el registre).
 */
import { useTranslation } from "react-i18next";

export type Pregunta = { q: string; a: string };

export default function Preguntes() {
  const { t } = useTranslation("home");
  const llista = t("portada.preguntes.llista", { returnObjects: true }) as Pregunta[];
  return (
    <section id="preguntas" className="pt-seccio pt-preguntes" aria-labelledby="pt-preguntes-titol">
      <div className="contenidor pt-preguntes-graella">
        <div className="pt-preguntes-cap">
          <h2 id="pt-preguntes-titol">{t("portada.preguntes.titol")}</h2>
          <p>{t("portada.preguntes.sub")}</p>
        </div>
        <dl className="pt-preguntes-llista">
          {llista.map((f) => (
            <div key={f.q}>
              <dt>{f.q}</dt>
              <dd>{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
