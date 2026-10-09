import { SiteHeader } from "@/components/SiteHeader";
import PageProgress from "@/components/PageProgress";
import SEO from "@/components/SEO";
import { CinematicHero } from "@/components/ui/cinematic-hero";
import PainBlock from "@/components/PainBlock";
import FeaturesBlock from "@/components/FeaturesBlock";
import { GlassCards } from "@/components/ui/glass-cards";
import StepsBlock from "@/components/StepsBlock";
import TestimonialBlock from "@/components/TestimonialBlock";
import PricingBlock from "@/components/PricingBlock";
import FAQBlock from "@/components/FAQBlock";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

import { useTranslation } from "react-i18next";
import { useEmpezar } from "@/lib/empezar";
import {
  organizationSchema,
  softwareAppSchema,
  faqPageSchema,
  howToSchema,
} from "@/lib/seo/schemas";

const Index = () => {
  const empezar = useEmpezar();
  const { t: tSeo } = useTranslation("seo");
  const { t: tHome } = useTranslation("home");

  const homeFaqs = (tHome("faq.list", { returnObjects: true }) as Array<{ q: string; a: string }>)
    .map((f) => ({ q: f.q, a: f.a }));

  const setupSteps = (tHome("steps.list", { returnObjects: true }) as Array<{ tag: string; title: string; description: string }>)
    .map((s) => ({ name: s.title, text: s.description }));

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={tSeo("home.title")}
        description={tSeo("home.description")}
        path="/"
        schemas={[
          softwareAppSchema(),
          organizationSchema(),
          faqPageSchema(homeFaqs),
          howToSchema(
            tHome("steps.title_1"),
            tHome("steps.subtitle"),
            setupSteps
          ),
        ]}
      />
      <SiteHeader />
      <main>
        <CinematicHero onEmpezar={empezar} />
        <PainBlock />
        <FeaturesBlock />
        <GlassCards />
        <StepsBlock />
        <TestimonialBlock />
        <PricingBlock />
        <FAQBlock />
        <FinalCTA onEmpezar={empezar} />
      </main>
      <Footer />
      <PageProgress />
    </div>
  );
};

export default Index;
