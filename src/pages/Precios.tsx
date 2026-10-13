/**
 * /precios, amb les peces de la portada (13-10-2026): els dos plans (el títol és l'h1), les preguntes
 * sobre el preu i, al final, el «Te llamo». Abans tenia el seu propi bloc de preus (PricingBlock), d'un
 * altre estil, i una franja blava al final.
 * Les preguntes porten el marcatge FAQPage.
 */
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import Preus from "@/components/portada/Preus";
import Truca from "@/components/portada/Truca";
import { faqPageSchema } from "@/lib/seo/schemas";
import { useEmpezar } from "@/lib/empezar";
import "@/components/portada/portada.css";

const PreciosPage = () => {
  const empezar = useEmpezar();
  const { t } = useTranslation("home");
  const faqs = t("precios_page.faqs", { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <PageShell
      title={t("precios_page.meta_title")}
      description={t("precios_page.meta_description")}
      path="/precios"
      schemas={[faqPageSchema(faqs)]}
    >
      <Preus onEmpezar={empezar} pagina />

      {/* A l'ordinador, el títol a l'esquerra i les preguntes a la dreta */}
      <section id="preguntas" className="pt-seccio pt-preguntes" aria-labelledby="pt-preguntes-titol">
        <div className="contenidor pt-preguntes-graella">
          <div className="pt-preguntes-cap">
            <h2 id="pt-preguntes-titol">{t("precios_page.faq_heading")}</h2>
            <p>{t("precios_page.faq_subheading")}</p>
          </div>
          <dl className="pt-preguntes-llista">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Truca />
    </PageShell>
  );
};

export default PreciosPage;
