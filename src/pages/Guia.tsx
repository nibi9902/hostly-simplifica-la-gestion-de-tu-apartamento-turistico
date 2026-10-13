import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Link2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import PageShell from "@/components/PageShell";

import Truca from "@/components/portada/Truca";
import "@/components/portada/portada.css";
const ease = [0.22, 1, 0.36, 1] as const;

type ChapterLink = { label: string; href: string };
type Chapter = {
  id: string;
  num: string;
  title: string;
  description: string;
  links: ChapterLink[];
};

export default function Guia() {
  const { t } = useTranslation("common");

  const chapters = t("guia.chapters", { returnObjects: true }) as Chapter[];

  return (
    <PageShell
      title={t("guia.meta_title")}
      description={t("guia.meta_description")}
    >
      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="contenidor">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary bg-[#eff6ff] px-3 py-1.5 rounded-full">
                {t("guia.badge_guide")}
              </span>
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#166534] bg-[#dcfce7] px-3 py-1.5 rounded-full">
                {t("guia.badge_updated")}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight mb-6 leading-tight max-w-4xl">
              {t("guia.heading")}
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-8">
              {t("guia.intro")}
            </p>
            {/* amb les icones de la casa (abans, emojis) */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5"><BookOpen className="w-4 h-4" aria-hidden="true" />{t("guia.stats_chapters")}</span>
              <span className="inline-flex items-center gap-1.5"><Link2 className="w-4 h-4" aria-hidden="true" />{t("guia.stats_resources", { count: chapters.reduce((acc, c) => acc + c.links.length, 0) })}</span>
              <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-4 h-4" aria-hidden="true" />{t("guia.stats_updated")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Índex ràpid */}
      <section className="py-12 bg-[#f8fafc] border-y border-slate-100">
        <div className="contenidor">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-5">{t("guia.toc_label")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {chapters.map((ch) => (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 group"
              >
                <span className="text-xs font-mono font-bold text-slate-500 w-6 shrink-0">{ch.num}</span>
                <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{ch.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Capítols */}
      <section className="py-16">
        <div className="contenidor space-y-16">
          {chapters.map((ch, i) => (
            <motion.div
              key={ch.id}
              id={ch.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05, ease }}
              className="grid gap-8 lg:grid-cols-12 lg:gap-16"
            >
              {/* Chapter header: a l'ordinador, a l'esquerra dels enllaços */}
              <div className="flex items-start gap-5 lg:col-span-4">
                <span aria-hidden="true" className="text-3xl font-black text-slate-300 font-mono leading-none mt-1 shrink-0">{ch.num}</span>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] tracking-tight mb-3">{ch.title}</h2>
                  <p className="text-slate-500 leading-relaxed">{ch.description}</p>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-0 md:ml-14 lg:ml-0 lg:col-span-8 lg:self-start">
                {ch.links.map((link) => (
                  <LangLink
                    key={link.href}
                    to={link.href}
                    className="group flex items-center justify-between p-4 rounded-2xl bg-[#f8fafc] border border-slate-100 hover:bg-white hover:border-primary/20 hover:shadow-sm transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors leading-snug pr-3">
                      {link.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary shrink-0 transition-colors" />
                  </LangLink>
                ))}
              </div>

              {i < chapters.length - 1 && <div className="mt-8 border-t border-slate-100 lg:col-span-12" />}
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {/* Al final, el «Te llamo» de la portada (13-10-2026: abans, una franja blava fosca) */}
      <Truca />
    </PageShell>
  );
}
