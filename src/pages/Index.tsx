import { SiteHeader } from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import Entrada from "@/components/portada/Entrada";
import Zero from "@/components/portada/Zero";
import Gestors from "@/components/portada/Gestors";
import Pendent from "@/components/portada/Pendent";
import Gratis from "@/components/portada/Gratis";
import Completo from "@/components/portada/Completo";
import Passos from "@/components/portada/Passos";
import Preus from "@/components/portada/Preus";
import Truca from "@/components/portada/Truca";
import Footer from "@/components/Footer";
import "@/components/portada/portada.css";

import { useTranslation } from "react-i18next";
import { useEmpezar } from "@/lib/empezar";
import {
  organizationSchema,
  softwareAppSchema,
  howToSchema,
} from "@/lib/seo/schemas";

/**
 * La portada (redisseny d'octubre 2026). L'entrada és només el lema, amb l'aspecte de l'entrada d'abans
 * (decisió del Biel del 13-10), i just a sota, el 0 € amb la cinta de logotips (també del 13-10). Després,
 * la portada que va aprovar a l'exploració `docs/exploracions/2026-10-11-web-estil-b/`: «Hostly está
 * pendiente» → «Gratis para siempre» → el Completo («Con el Completo, todo lo demás.», des del 14-10) → «Así se empieza» → gestors (des del 13-10, just abans dels preus)
 * → preus → «Te llamo».
 * La portada nova no té preguntes freqüents: per això ja no porta el marcatge FAQPage.
 */
const Index = () => {
  const empezar = useEmpezar();
  const { t: tSeo } = useTranslation("seo");
  const { t: tHome } = useTranslation("home");

  const passos = (tHome("portada.passos.llista", { returnObjects: true }) as Array<{ titol: string; text: string }>)
    .map((p) => ({ name: p.titol, text: p.text }));

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={tSeo("home.title")}
        description={tSeo("home.description")}
        path="/"
        schemas={[
          softwareAppSchema(),
          organizationSchema(),
          howToSchema(tHome("portada.passos.titol"), tHome("portada.passos.nota"), passos),
        ]}
      />
      <SiteHeader />
      <main>
        <Entrada />
        <Zero onEmpezar={empezar} />
        <Pendent />
        <Gratis onEmpezar={empezar} />
        <Completo />
        <Passos />
        {/* els gestors, just abans dels preus (el Biel, 13-10: «a baix de tot, abans del pla gratis i de pagar») */}
        <Gestors />
        <Preus onEmpezar={empezar} />
        <Truca />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
