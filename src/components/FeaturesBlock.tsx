import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const ease = [0.22, 1, 0.36, 1] as const;

const FeaturesBlock = () => {
  const { t } = useTranslation("home");
  return (
    <section id="features" className="pt-20 md:pt-28 pb-0 bg-[#f8fafc]">
      <div className="contenidor">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-3">
            {t("features.eyebrow")}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f172a] tracking-tight leading-tight">
            {t("features.title")}
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesBlock;
