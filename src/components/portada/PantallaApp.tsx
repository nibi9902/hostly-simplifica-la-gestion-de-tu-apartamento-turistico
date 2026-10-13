/**
 * La pantalla principal de Hostly a l'ordinador (el Resum), «com sempre»: al Resum només hi surt el que
 * et necessita (una incidència, «Para ti») i, a sota, en verd, «Hostly lo está haciendo por ti».
 * Es dibuixa a mida real (1100 × 580) i s'escala amb CSS (`.pt-pantalla .pt-fin`).
 * La foto és el fons del Resum de l'app, de nit.
 */
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";
import fotoNit from "@/assets/portada/menjador-nit.webp";
import iconaApp from "@/assets/portada/icona-app.webp";

type Xifra = { xifra: string; text: string };

export default function PantallaApp() {
  const { t } = useTranslation("home");
  const portes = t("portada.pendent.pantalla.portes", { returnObjects: true }) as string[];
  const tira = t("portada.pendent.pantalla.tira", { returnObjects: true }) as Xifra[];

  return (
    <div className="pt-pantalla" role="img" aria-label={t("portada.pendent.pantalla.aria")}>
      <div className="pt-fin" aria-hidden="true">
        <div className="pt-crom"><i /><i /><i /><span className="pt-adreca">app.hostlylabs.com</span></div>
        <div className="pt-app">
          <div className="pt-app-cap">
            <div className="pt-marca-app">
              <img src={iconaApp} alt="" width={22} height={22} />
              Hostly
              <span className="pt-sel">{t("portada.pendent.pantalla.tots")}</span>
            </div>
            <div className="pt-portes">
              {portes.map((p, i) => <span key={i} className={i === 0 ? "on" : undefined}>{p}</span>)}
            </div>
            <div className="pt-dreta-cap">
              <span className="pt-campana"><Bell className="pt-ic" /></span>
              <span className="pt-inicials">MR</span>
            </div>
          </div>
          <div className="pt-fons">
            <span className="pt-ft" style={{ backgroundImage: `url(${fotoNit})` }} />
            <div className="pt-vel" />
          </div>
          <div className="pt-cos">
            <div className="pt-targ pt-targ-pieter">
              <span className="pt-anell"><em>{t("portada.pendent.pantalla.per_tu")}</em></span>
              <p className="pt-que">
                <span className="pt-vermell">{t("portada.pendent.pantalla.urgent")}</span>
                <i />
                <span className="pt-gris">{t("portada.pendent.pantalla.tipus")}</span>
              </p>
              <h3>{t("portada.pendent.pantalla.titol")}</h3>
              <p className="pt-petit">{t("portada.pendent.pantalla.qui")}</p>
              <span className="pt-m-pill">{t("portada.pendent.pantalla.boto")}</span>
            </div>
            <div className="pt-targ">
              <p className="pt-que"><span className="pt-verd">{t("portada.pendent.pantalla.marxa")}</span></p>
              <h4>{t("portada.pendent.pantalla.marxa_titol")}</h4>
              <p className="pt-petit">{t("portada.pendent.pantalla.marxa_detall")}</p>
            </div>
          </div>
          <div className="pt-tira">
            {tira.map((x, i) => <div key={i}><b>{x.xifra}</b><small>{x.text}</small></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
