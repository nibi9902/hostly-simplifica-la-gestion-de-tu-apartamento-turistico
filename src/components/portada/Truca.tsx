/**
 * «¿Prefieres hablarlo? Déjame tu teléfono y te llamo yo.» — signat pel Biel, dins d'una targeta.
 * Desa igual que el de sota els preus (`useLlamame`): el telèfon arriba al Biel en menys d'un minut.
 * El camp ja porta «+34» al davant; si algú escriu un número d'un altre país amb el «+», també val.
 */
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { useLlamame } from "@/lib/useLlamame";

export default function Truca() {
  const { t } = useTranslation("home");
  const { t: tEmbut } = useTranslation("embut");
  const { telefon, canvia, error, desant, fet, envia } = useLlamame({ senseMes34: true });

  return (
    <section id="llamame" className="pt-seccio pt-truca" aria-labelledby="pt-truca-titol">
      <div className="contenidor">
        <div className="pt-targeta">
          <div>
            <h2 id="pt-truca-titol">
              {t("portada.truca.titol")} <span>{t("portada.truca.titol_gris")}</span>
            </h2>
            <small className="pt-signa">{t("portada.truca.signa")}</small>
          </div>
          <div>
            {fet ? (
              <p className="pt-fet-ok" role="status">
                <Check className="pt-ic" strokeWidth={2.5} aria-hidden="true" />
                {tEmbut("llamame.hecho")}
              </p>
            ) : (
              <form onSubmit={envia} noValidate>
                <div className={error ? "pt-camp amb-error" : "pt-camp"}>
                  <span className="pt-prefix" aria-hidden="true">{t("portada.truca.prefix")}</span>
                  <label className="sr-only" htmlFor="pt-truca-tel">{t("portada.truca.telefon")}</label>
                  <input
                    id="pt-truca-tel"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder={t("portada.truca.telefon")}
                    value={telefon}
                    onChange={(e) => canvia(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? "pt-truca-error" : "pt-truca-nota"}
                  />
                  <button type="submit" disabled={desant} className="pt-pill pt-pill-pri">
                    {desant
                      ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      : t("portada.truca.boto")}
                  </button>
                </div>
                {error
                  ? <p id="pt-truca-error" className="pt-error">{error}</p>
                  : <p id="pt-truca-nota" className="pt-nota">{t("portada.truca.nota")}</p>}
                <p className="pt-privacitat">
                  {tEmbut("empezar.datos.privacidad_antes")}{" "}
                  <LangLink to="/privacidad">{tEmbut("empezar.datos.privacidad_link")}</LangLink>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
