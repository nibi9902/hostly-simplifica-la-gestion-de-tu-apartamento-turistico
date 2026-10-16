/**
 * «Así se empieza.» — els tres passos, amb el número gran en gris (l'estil 01-02-03 que va triar el Biel).
 *
 * Al costat del títol, dues sortides (el Biel, 16-10: la nota d'abans, «¿Solo el check-in? Te creas tú la
 * cuenta…», semblava posada a la força): qui només vol el check-in, «Empieza ya»; qui ho vol parlar, un camp
 * petit per al telèfon i «Te llamamos», que desa com el «Llámame» (`useLlamame`) i avisa al moment.
 * Surt a la portada i a les pàgines de cada perfil.
 */
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEmpezar } from "@/lib/empezar";
import { useLlamame } from "@/lib/useLlamame";

type Pas = { titol: string; text: string };

export default function Passos() {
  const { t } = useTranslation("home");
  const empezar = useEmpezar();
  const passos = t("portada.passos.llista", { returnObjects: true }) as Pas[];
  const { telefon, canvia, error, desant, fet, envia } = useLlamame({ senseMes34: true });

  return (
    <section id="como-empieza" className="pt-seccio pt-passos" aria-labelledby="pt-passos-titol">
      <div className="contenidor">
        <div className="pt-cap">
          <div>
            <p className="pt-retol">{t("portada.passos.retol")}</p>
            <h2 id="pt-passos-titol">{t("portada.passos.titol")}</h2>
          </div>
          <div className="pt-passos-accions">
            <p>{t("portada.passos.checkin")} <button type="button" onClick={empezar} className="pt-passos-enllac">{t("portada.passos.empieza")} →</button></p>
            {fet ? (
              <p className="pt-passos-fet" role="status"><Check className="pt-ic" strokeWidth={2.6} aria-hidden="true" />{t("portada.passos.fet")}</p>
            ) : (
              <form className="pt-passos-truca" onSubmit={envia} noValidate>
                <label htmlFor="pt-passos-tel">{t("portada.passos.parlar")}</label>
                <span className={error ? "pt-passos-camp amb-error" : "pt-passos-camp"}>
                  <span aria-hidden="true">+34</span>
                  <input id="pt-passos-tel" type="tel" inputMode="tel" autoComplete="tel-national" placeholder={t("portada.truca.telefon")}
                    value={telefon} onChange={(e) => canvia(e.target.value)} aria-invalid={!!error} aria-describedby={error ? "pt-passos-error" : undefined} />
                  <button type="submit" disabled={desant}>{t("portada.passos.truquem")}</button>
                </span>
                {error && <span id="pt-passos-error" className="pt-passos-error">{error}</span>}
              </form>
            )}
          </div>
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
