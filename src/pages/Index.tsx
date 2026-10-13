import { SiteHeader } from "@/components/SiteHeader";
import SEO from "@/components/SEO";
import { CinematicHero } from "@/components/ui/cinematic-hero";
import Gestors from "@/components/portada/Gestors";
import Pendent from "@/components/portada/Pendent";
import Gratis from "@/components/portada/Gratis";
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
 * La portada (redisseny d'octubre 2026). L'entrada és la de sempre (CinematicHero: decisió del Biel del
 * 13-10). A sota, la portada que va aprovar a l'exploració `docs/exploracions/2026-10-11-web-estil-b/`:
 * gestors → «Hostly está pendiente» → «Gratis para siempre» → «Así se empieza» → preus → «Te llamo».
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
        <CinematicHero onEmpezar={empezar} />
        <Gestors />
        <Pendent />
        <Gratis onEmpezar={empezar} />
        <Passos />
        <Preus onEmpezar={empezar} />
        <Truca />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
