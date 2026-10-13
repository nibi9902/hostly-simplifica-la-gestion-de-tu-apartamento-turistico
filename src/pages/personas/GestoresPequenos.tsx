/**
 * /gestores-pequenos, amb les peces de la portada (13-10-2026). «¿Con cuántas apps?»: les eines d'avui com
 * una factura (cadascuna amb el seu cost) i, a sota, la targeta fosca amb el preu de Hostly per a qui en porta
 * vuit. Abans: files vermelles amb una creu i un requadre verd. Després, «Así se empieza», els preus i el
 * «Te llamo» de la portada.
 */
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";
import Passos from "@/components/portada/Passos";
import Preus from "@/components/portada/Preus";
import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";

type Tool = { name: string; cost: string };

export default function GestoresPequenos() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const tools = t("gestores.tools", { returnObjects: true }) as Tool[];
  return (
    <PageShell
      title={t("gestores.meta_title")}
      description={t("gestores.meta_description")}
      path="/gestores-pequenos"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("gestores.breadcrumb_label"), url: '/gestores-pequenos' }])]}
    >
      <HeroPersona clau="gestores" onEmpezar={empezar} />

      {/* El títol a l'esquerra; a la dreta, el que es paga avui i el que costa amb Hostly */}
      <section className="pt-seccio pt-fp-bloc">
        <div className="contenidor pt-fp-dues">
          <div className="pt-pp-enganxat">
            <h2 className="pt-fp-h2">{t("gestores.section2_h2")}</h2>
            <p className="pt-pp-sub">{t("gestores.section2_sub")}</p>
          </div>
          <div>
            <ul className="pt-pp-factura">
              {tools.map((item) => (
                <li key={item.name}><span>{item.name}</span><b>{item.cost}</b></li>
              ))}
            </ul>
            <div className="pt-pp-fosca">
              <p className="pt-retol">{t("gestores.hostly.retol")}</p>
              <p className="pt-pp-xifra"><b>{t("gestores.hostly.xifra")}</b><span>{t("gestores.hostly.unitat")}</span></p>
              <p className="pt-pp-fosca-txt">{t("gestores.hostly.text")}</p>
            </div>
          </div>
        </div>
      </section>

      <Passos />
      <Preus onEmpezar={empezar} />
      <Truca />
    </PageShell>
  );
}
