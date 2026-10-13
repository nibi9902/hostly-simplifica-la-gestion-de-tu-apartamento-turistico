/** «Así se empieza.» — els tres passos, amb el número gran en gris (l'estil 01-02-03 que va triar el Biel). */
import { useTranslation } from "react-i18next";

type Pas = { titol: string; text: string };

export default function Passos() {
  const { t } = useTranslation("home");
  const passos = t("portada.passos.llista", { returnObjects: true }) as Pas[];

  return (
    <section id="como-empieza" className="pt-seccio pt-passos" aria-labelledby="pt-passos-titol">
      <div className="contenidor">
        <div className="pt-cap">
          <div>
            <p className="pt-retol">{t("portada.passos.retol")}</p>
            <h2 id="pt-passos-titol">{t("portada.passos.titol")}</h2>
          </div>
          <p className="pt-nota">{t("portada.passos.nota")}</p>
        </div>
        <ol className="pt-tres">
          {passos.map((p, i) => (
            <li key={i} className="pt-pas">
              <small aria-hidden="true">{String(i + 1).padStart(2, "0")}</small>
              <h3>{p.titol}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
