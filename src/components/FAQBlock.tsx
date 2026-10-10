import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslation } from "react-i18next";

const ease = [0.22, 1, 0.36, 1] as const;

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04, ease }}
      className="border-b border-border last:border-0"
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md"
        aria-expanded={open}
      >
        <span className="text-sm md:text-base font-semibold text-foreground leading-snug group-hover:text-primary transition-colors duration-150">
          {q}
        </span>
        <span className="shrink-0 w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors duration-150">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQBlock() {
  const { t } = useTranslation("home");
  const faqs = t("faq.list", { returnObjects: true }) as Array<{ q: string; a: string }>;

  return (
    <section id="faq" className="py-20 md:py-28 bg-background">
      {/* A l'ordinador: el títol a l'esquerra (es queda a la vista mentre es baixa) i les preguntes a la dreta */}
      <div className="contenidor grid gap-12 lg:grid-cols-12 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center lg:text-left lg:col-span-5 lg:self-start lg:sticky lg:top-28"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-3">
            {t("faq.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3 lg:mb-5">
            {t("faq.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("faq.contact_pre")}{" "}
            <a href="mailto:hola@hostlylabs.com" className="text-primary hover:underline font-medium">
              hola@hostlylabs.com
            </a>
          </p>
        </motion.div>

        <div className="lg:col-span-7 lg:-mt-5">
          {faqs.map((faq, i) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
