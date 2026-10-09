import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "@/components/PageShell";
import PricingBlock from "@/components/PricingBlock";

import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

const PreciosPage = () => {
  const empezar = useEmpezar();
  const { t } = useTranslation("home");

  const faqs = t("precios_page.faqs", { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <PageShell
      title={t("precios_page.meta_title")}
      description={t("precios_page.meta_description")}
      path="/precios"
    >
      {/* H1 semàntic per SEO — visualment ocult, el header del PricingBlock és l'H2 */}
      <h1 className="sr-only">{t("precios_page.sr_h1")}</h1>

      {/* Pricing block — el PricingBlock ja té el seu propi header, evitem duplicar-lo */}
      <PricingBlock />

      {/* FAQ de preus */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
            className="text-center mb-14"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
              {t("precios_page.faq_heading")}
            </h2>
            <p className="text-muted-foreground">
              {t("precios_page.faq_subheading")}
            </p>
          </motion.div>

          <div className="flex flex-col divide-y divide-border">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease }}
                className="py-6"
              >
                <p className="font-semibold text-foreground text-sm md:text-base mb-2 leading-snug">
                  {faq.q}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 md:py-24 px-6 md:px-12 lg:px-20 bg-primary text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t("precios_page.cta_heading")}
          </h2>
          <p className="text-white/75 text-lg mb-8">
            {t("precios_page.cta_body")}
          </p>
          <button type="button" onClick={empezar} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-primary font-semibold text-base hover:bg-white/90 transition-colors shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
          >
            {t("precios_page.cta_button")}
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-white/50 text-sm mt-4">
            {t("precios_page.cta_disclaimer")}
          </p>
        </motion.div>
      </section>

    </PageShell>
  );
};

export default PreciosPage;
