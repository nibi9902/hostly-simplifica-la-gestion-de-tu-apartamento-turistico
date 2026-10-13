/**
 * /segunda-residencia, amb les peces de la portada (13-10-2026): les quatre coses en peces com les de les
 * funcionalitats, i després «Así se empieza», els preus i el «Te llamo» de la portada. Abans: targetes
 * blanques amb ombra que apareixien una per una.
 */
import { KeyRound, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
import Passos from "@/components/portada/Passos";
import Preus from "@/components/portada/Preus";
import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";

/** Una icona per cosa, en el mateix ordre que els textos: el codi, la neteja, els missatges i el registre. */
const ICONES = [KeyRound, Sparkles, MessageCircle, ShieldCheck];

type Feature = { title: string; desc: string };

export default function SegundaResidencia() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const features = t("segunda_residencia.features", { returnObjects: true }) as Feature[];
  return (
    <PageShell
      title={t("segunda_residencia.meta_title")}
      description={t("segunda_residencia.meta_description")}
      path="/segunda-residencia"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("segunda_residencia.breadcrumb_label"), url: '/segunda-residencia' }])]}
    >
      <HeroPersona clau="segunda_residencia" onEmpezar={empezar} />

      <section className="pt-seccio pt-fp-bloc">
        <div className="contenidor">
          <h2 className="pt-fp-h2">{t("segunda_residencia.section2_h2")}</h2>
          <div className="pt-fp-peces pt-pp-quatre">
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
