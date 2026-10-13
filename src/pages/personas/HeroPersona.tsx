import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import iconaApp from "@/assets/portada/icona-app.webp";

const ease = [0.22, 1, 0.36, 1] as const;

export type ClauPersona = "propietarios" | "gestores" | "segunda_residencia" | "hereus";
type Fila = { quan: string; titol: string; detall: string };
type Dia = { titol: string; files: Fila[] };

/**
 * L'entrada de les pàgines «Para quién», amb les peces de la portada (13-10-2026): el text a l'esquerra
 * i, a la dreta, la targeta «Hoy, en …», el que Hostly ha fet avui en un pis d'aquest perfil (com la llista
 * de «Hostly está pendiente»). Abans: un degradat blau i, a la dreta, la demo animada de l'app d'abril,
 * amagada al mòbil. Els pisos i els hostes són inventats (comprovat a la BD que no hi són).
 */
export default function HeroPersona({ clau, onEmpezar }: { clau: ClauPersona; onEmpezar: () => void }) {
  const { t } = useTranslation("personas");
  const dia = t(`${clau}.dia`, { returnObjects: true }) as Dia;

  return (
    <section className="pt-seccio pt-fp-entrada">
      <div className="contenidor pt-fp-entrada-graella">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <p className="pt-retol">{t(`${clau}.badge`)}</p>
          <h1 className="pt-fp-h1">
            {t(`${clau}.h1`).split("\n").map((linia, i) => <span key={i} className="pt-pp-linia">{linia}</span>)}
          </h1>
          <p className="pt-lead">{t(`${clau}.intro`)}</p>
          <div className="pt-fp-botons">
            <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-pri">{t(`${clau}.cta_primary`)}</button>
            <LangLink to="/demo" className="pt-pill pt-pill-sec">{t("comu.com_funciona")}</LangLink>
          </div>
          <p className="pt-pp-nota">{t(`${clau}.cta_sub`)}</p>
        </motion.div>

        <motion.figure
          className="pt-pp-dia"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <figcaption className="pt-pp-dia-cap">
            <img src={iconaApp} alt="" width={28} height={28} />
            {dia.titol}
          </figcaption>
          <ul>
            {dia.files.map((f, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 + i * 0.12, ease }}
              >
                <span className="pt-pp-marca" aria-hidden="true"><Check className="pt-ic" strokeWidth={2.8} /></span>
                <p><b>{f.titol}</b><span>{f.detall}</span></p>
                <small>{f.quan}</small>
              </motion.li>
            ))}
          </ul>
          <p className="pt-pp-dia-peu"><b>{t("comu.marxa")}</b> {t("comu.res")}</p>
        </motion.figure>
      </div>
    </section>
  );
}
