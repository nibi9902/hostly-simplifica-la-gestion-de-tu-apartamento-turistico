import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";

const appleEase = [0.22, 1, 0.36, 1] as const;

/* ─── Brand tokens ─── */
const BRAND_BLUE = "#1a3a8f";

/* ─── Steps (només els 3 conceptuals — sense mockups) ─── */
const STEP_NUMS = ["01", "02", "03"] as const;

/* ─────────────────────────────────────────────────────────
   STEP CARD — horitzontal, sense mockup
───────────────────────────────────────────────────────── */
type StepData = { num: string; tag: string; title: string; description: string };

const StepCard = ({ step, index, total }: { step: StepData; index: number; total: number }) => {
  const isLast = index === total - 1;
  const circleColor = isLast ? "#16a34a" : BRAND_BLUE;
  const circleGradEnd = isLast ? "#22c55e" : "#2563EB";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: appleEase }}
      className="relative flex flex-col items-center text-center px-4"
    >
      {/* Watermark number — subtle bg */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "clamp(8rem, 12vw, 12rem)",
          fontWeight: 900,
          color: "rgba(15, 23, 42, 0.03)",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          userSelect: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        {step.num}
      </div>

      {/* Number badge */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${circleColor} 0%, ${circleGradEnd} 100%)`,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 800,
          fontVariantNumeric: "tabular-nums",
          boxShadow: `0 0 0 6px #fff, 0 0 0 8px ${circleColor}22, 0 14px 30px -6px ${circleColor}55`,
          marginBottom: 28,
          position: "relative",
          zIndex: 2,
        }}
      >
        {index + 1}
      </div>

      {/* Tag */}
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: circleColor,
          marginBottom: 14,
          position: "relative",
          zIndex: 1,
        }}
      >
        {step.tag}
      </span>

      {/* Title */}
      <h3
        style={{
          fontSize: "clamp(1.3rem, 1.9vw, 1.7rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          color: "#0B0F1A",
          marginBottom: 14,
          maxWidth: "340px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {step.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "0.98rem",
          lineHeight: 1.65,
          color: "#475569",
          maxWidth: "340px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {step.description}
      </p>
    </motion.div>
  );
};

/* ─────────────────────────────────────────────────────────
   MAIN
───────────────────────────────────────────────────────── */
const StepsBlock = () => {
  const { t } = useTranslation("home");
  const stepList = t("steps.list", { returnObjects: true }) as Array<{
    tag: string;
    title: string;
    description: string;
  }>;
  const steps: StepData[] = STEP_NUMS.map((num, i) => ({
    num,
    tag: stepList[i]?.tag ?? "",
    title: stepList[i]?.title ?? "",
    description: stepList[i]?.description ?? "",
  }));

  const headerRef = useRef(null);
  const { scrollYProgress: headerProgress } = useScroll({
    target: headerRef,
    offset: ["start 90%", "start 40%"],
  });
  const headerOpacity = useTransform(headerProgress, [0, 1], [0, 1]);
  const headerY = useTransform(headerProgress, [0, 1], [30, 0]);

  return (
    <section id="steps" className="py-24 md:py-32 px-6 md:px-12 lg:px-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headerRef}
          style={{ opacity: headerOpacity, y: headerY }}
          className="text-center mb-16 md:mb-24"
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: BRAND_BLUE,
              marginBottom: "16px",
            }}
          >
            {t("steps.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 3.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              color: "#0B0F1A",
              marginBottom: "18px",
            }}
          >
            {t("steps.title_1")}<br />
            <span className="font-accent" style={{ color: BRAND_BLUE, fontWeight: 300, fontSize: "1.15em" }}>
              {t("steps.title_2")}
            </span>
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto" }}>
            {t("steps.subtitle")}
          </p>
        </motion.div>

        {/* Steps horizontal grid */}
        <div className="relative">
          {/* Horizontal connector — visible només a desktop */}
          <div
            className="hidden lg:block absolute pointer-events-none"
            style={{
              top: 32, // centre vertical del badge de 64px
              left: "16.66%", // 1/6 (centre 1a columna)
              right: "16.66%", // 1/6 (centre 3a columna)
              height: 2,
              background: `linear-gradient(to right, ${BRAND_BLUE}30 0%, ${BRAND_BLUE}25 50%, #16a34a30 100%)`,
              zIndex: 0,
            }}
            aria-hidden="true"
          />

          {/* Grid 3 columns desktop, 1 column mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 relative">
            {steps.map((step, i) => (
              <StepCard key={step.num} step={step} index={i} total={steps.length} />
            ))}
          </div>
        </div>

        {/* Footer tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ marginTop: 64, textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              borderRadius: 999,
              background: "#F7F8FA",
              border: "1px solid #E6E8EC",
              fontSize: 13,
              color: "#64748b",
            }}
          >
            <span style={{ display: "inline-flex", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a" }} />
            </span>
            <span>{t("steps.footer_tagline")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StepsBlock;
