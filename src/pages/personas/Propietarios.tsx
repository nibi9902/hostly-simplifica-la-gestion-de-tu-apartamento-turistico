/**
 * /propietarios, amb les peces de la portada (13-10-2026). Abans: targetes vermelles («Ahora») i verdes
 * («Con Hostly») i una franja «40 € al mes por piso»; ara cada maldecap amb la seva solució en una fila, i
 * després «Así se empieza», els preus i el «Te llamo» de la portada.
 */
import { Check } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
import Passos from "@/components/portada/Passos";
import Preus from "@/components/portada/Preus";
import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";

type Pain = { pain: string; fix: string };

export default function Propietarios() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const pains = t("propietarios.pains", { returnObjects: true }) as Pain[];
  return (
    <PageShell
      title={t("propietarios.meta_title")}
      description={t("propietarios.meta_description")}
      path="/propietarios"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("propietarios.breadcrumb_label"), url: '/propietarios' }])]}
    >
      <HeroPersona clau="propietarios" onEmpezar={empezar} />

      {/* El títol a l'esquerra i, a la dreta, cada maldecap amb la seva solució */}
      <section className="pt-seccio pt-fp-bloc">
        <div className="contenidor pt-fp-dues">
          <h2 className="pt-fp-h2 pt-pp-enganxat">{t("propietarios.section2_h2")}</h2>
          <ul className="pt-pp-parells">
            {pains.map((item) => (
              <li key={item.pain}>
                <div className="pt-pp-abans">
                  <p className="pt-retol">{t("propietarios.label_now")}</p>
                  <p>{item.pain}</p>
                </div>
                <div className="pt-pp-ara">
                  <p className="pt-retol"><Check className="pt-ic" strokeWidth={3} aria-hidden="true" />{t("propietarios.label_with_hostly")}</p>
                  <p>{item.fix}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Passos />
      <Preus onEmpezar={empezar} />
      <Truca />
    </PageShell>
  );
}
