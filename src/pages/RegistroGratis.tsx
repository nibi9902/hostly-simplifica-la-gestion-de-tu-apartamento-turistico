/**
 * La pàgina per als anuncis del registre de viatgers gratis (/registro-de-viajeros-gratis), 15-10-2026.
 *
 * Surt de la revisió de màrqueting de la portada: qui ve d'un anunci («El registro de viajeros. Gratis.»)
 * ha de trobar a dalt de tot el que li ha promès l'anunci i el botó. La portada continua sent la casa de
 * la marca; aquesta és la porta dels anuncis, feta primer per al mòbil. Una sola cosa a fer: sense menú
 * ni enllaços cap a fora (només els legals, al peu). Mockup aprovat pel Biel:
 * `docs/exploracions/2026-10-15-portada-arreglada/`.
 * No s'indexa (noindex): és per al trànsit dels anuncis i diria el mateix que la fitxa del check-in.
 * Diu a quins sistemes s'envia (SES.Hospedajes o Mossos d'Esquadra; l'Ertzaintza no, perquè no s'hi envia): decisió del Biel (15-10); si arriba
 * algú d'un sistema que encara no està connectat, es connecta el mateix dia.
 */
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import SEO from "@/components/SEO";
import { LangLink } from "@/i18n/LangLink";
import { useEmpezar } from "@/lib/empezar";
import BarraMobil from "@/components/portada/BarraMobil";
import hostlyMarca from "@/assets/hostly-marca.webp";
import ses from "@/assets/connexions/ses-hospedajes.webp";
import "@/components/portada/portada.css";

type Pas = { titol: string; text: string };
type Camp = { nom: string; valor: string };
type Pregunta = { q: string; a: string };

export default function RegistroGratis() {
  const { t } = useTranslation("home");
  const empezar = useEmpezar();
  const passos = t("anunci_registre.passos", { returnObjects: true }) as Pas[];
  const camps = t("anunci_registre.mobil.camps", { returnObjects: true }) as Camp[];
  const preguntes = t("anunci_registre.preguntes", { returnObjects: true }) as Pregunta[];

  return (
    <div className="min-h-screen bg-white">
      <SEO title={t("anunci_registre.seo_titol")} description={t("anunci_registre.lead")} path="/registro-de-viajeros-gratis" noindex />
      {/* un capçal mínim: la marca i el botó */}
      <header className="pt-seccio pt-ad-capcal">
        <div className="contenidor pt-ad-capcal-in">
          <LangLink to="/" aria-label="Hostly"><img src={hostlyMarca} alt="" width={160} height={24} className="h-6 w-auto" /></LangLink>
          <button type="button" onClick={empezar} className="pt-pill pt-pill-pri pt-ad-capcal-boto">{t("anunci_registre.boto")}</button>
        </div>
      </header>

      <main>
        <section className="pt-seccio pt-ad-hero" aria-labelledby="pt-ad-titol">
          <div className="contenidor pt-ad-dues">
            <div>
              <p className="pt-retol">{t("anunci_registre.retol")}</p>
              <h1 id="pt-ad-titol" className="pt-ad-h1">{t("anunci_registre.titol")} <span>{t("anunci_registre.titol_gris")}</span></h1>
              <p className="pt-lead pt-ad-lead">{t("anunci_registre.lead")}</p>
              <div className="pt-ad-accio">
                <button type="button" onClick={empezar} className="pt-pill pt-pill-pri pt-entrada-boto">{t("anunci_registre.boto")}</button>
                <span>{t("anunci_registre.peu_boto")}</span>
              </div>
            </div>
            <div className="pt-ad-mobil" aria-hidden="true">
              <div>
                <p className="pt-ad-mobil-t">{t("anunci_registre.mobil.titol")}</p>
                {camps.map((c) => <p key={c.nom} className="pt-ad-camp"><span>{c.nom}</span><b>{c.valor}</b></p>)}
                <p className="pt-ad-ok"><Check className="pt-ic" strokeWidth={3} />{t("anunci_registre.mobil.ok")}</p>
              </div>
            </div>
          </div>
          <div className="contenidor">
            <p className="pt-ad-sistemes"><img src={ses} alt="" width={200} height={144} loading="lazy" decoding="async" />{t("anunci_registre.sistemes")}</p>
          </div>
        </section>

        <section className="pt-seccio pt-ad-passos-s" aria-labelledby="pt-ad-passos">
          <div className="contenidor">
            <p className="pt-retol">{t("anunci_registre.passos_retol")}</p>
            <h2 id="pt-ad-passos" className="pt-h2 pt-ad-h2">{t("anunci_registre.passos_titol")} <span className="pt-cmp-gris">{t("anunci_registre.passos_titol_gris")}</span></h2>
            <ol className="pt-ad-passos">
              {passos.map((p, i) => <li key={p.titol}><b>{i + 1}</b><h3>{p.titol}</h3><p>{p.text}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="pt-seccio pt-preguntes pt-ad-preguntes" aria-labelledby="pt-ad-preguntes">
          <div className="contenidor pt-preguntes-graella">
            <div className="pt-preguntes-cap"><h2 id="pt-ad-preguntes">{t("anunci_registre.preguntes_titol")}</h2></div>
            <dl className="pt-preguntes-llista">
              {preguntes.map((f) => <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>)}
            </dl>
          </div>
        </section>

        <section id="ad-final" className="pt-seccio pt-ad-final-s">
          <div className="contenidor">
            <div className="pt-ad-final">
              <div><p className="pt-ad-final-t">{t("anunci_registre.final_titol")}</p><p>{t("anunci_registre.final_text")}</p></div>
              <button type="button" onClick={empezar} className="pt-pill pt-pill-blanc pt-entrada-boto">{t("anunci_registre.boto")}</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="pt-seccio pt-ad-peu">
        <div className="contenidor pt-ad-peu-in">
          <span>© 2026 Hostly</span>
          <LangLink to="/privacidad">{t("anunci_registre.legal.privacitat")}</LangLink>
          <LangLink to="/cookies">{t("anunci_registre.legal.galetes")}</LangLink>
          <LangLink to="/aviso-legal">{t("anunci_registre.legal.avis")}</LangLink>
        </div>
      </footer>
      <BarraMobil onEmpezar={empezar} entrada=".pt-ad-hero" fins="ad-final" />
    </div>
  );
}
