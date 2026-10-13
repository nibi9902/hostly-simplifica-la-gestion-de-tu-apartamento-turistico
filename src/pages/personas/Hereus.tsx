/**
 * /hereus, amb les peces de la portada (13-10-2026): el títol i l'explicació a dalt, les tres coses en
 * peces com les de les funcionalitats, i després «Así se empieza», els preus i el «Te llamo» de la portada.
 * Abans: targetes blanques amb ombra, centrades, que apareixien una per una.
 */
import { CheckCheck, UserRound, Video } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
import Passos from "@/components/portada/Passos";
import Preus from "@/components/portada/Preus";
import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";

/** Una icona per cosa, en el mateix ordre que els textos: la videotrucada, tot automàtic i el suport. */
const ICONES = [Video, CheckCheck, UserRound];

type Feature = { title: string; desc: string };

export default function Hereus() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const features = t("hereus.features", { returnObjects: true }) as Feature[];
  return (
    <PageShell
      title={t("hereus.meta_title")}
      description={t("hereus.meta_description")}
      path="/hereus"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("hereus.breadcrumb_label"), url: '/hereus' }])]}
    >
      <HeroPersona clau="hereus" onEmpezar={empezar} />

      <section className="pt-seccio pt-fp-bloc">
        <div className="contenidor">
          <div className="pt-fp-dues">
            <h2 className="pt-fp-h2">{t("hereus.section2_h2")}</h2>
            <p className="pt-fp-text">{t("hereus.section2_body")}</p>
          </div>
          <div className="pt-fp-peces">
            {features.map((item, i) => {
              const Icona = ICONES[i % ICONES.length];
              return (
                <div key={item.title} className="pt-fp-peca">
                  <span className="pt-pp-icona" aria-hidden="true"><Icona className="pt-ic" /></span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Passos />
      <Preus onEmpezar={empezar} />
      <Truca />
    </PageShell>
  );
}
