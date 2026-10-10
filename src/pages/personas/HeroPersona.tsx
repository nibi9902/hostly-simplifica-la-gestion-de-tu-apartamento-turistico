import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import MiniDemo from "@/pages/funcionalidades/MiniDemo";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * L'entrada de les pàgines «Para quién» (10-10-2026). Abans era només text i, a l'ordinador, la
 * meitat dreta de la pantalla quedava buida. Ara, com a les funcionalitats: el text a l'esquerra i,
 * a la dreta, la demo de la funció que més li toca a cada perfil. Al mòbil, només el text (com abans).
 */
export default function HeroPersona({
  badge,
  h1,
  intro,
  cta,
  ctaSub,
  demo,
  onEmpezar,
}: {
  badge: string;
  /** Línies separades amb «\n» */
  h1: string;
  intro: string;
  cta: string;
  ctaSub?: string;
  /** Slug de la funcionalitat de la demo (`MiniDemo`) */
  demo: string;
  onEmpezar: () => void;
}) {
  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-[#f0f6ff] to-white overflow-hidden">
      <div className="contenidor grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center [&>*]:min-w-0">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">{badge}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#0f172a] tracking-tight mb-6 leading-tight">
            {h1.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 leading-relaxed">{intro}</p>
          <button
            type="button"
            onClick={onEmpezar}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-white font-semibold text-base hover:shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {cta}
            <ArrowRight className="w-4 h-4" />
          </button>
          {ctaSub && <p className="text-sm text-slate-500 mt-3">{ctaSub}</p>}
        </motion.div>

        {/* La demo és una il·lustració: el text de la pàgina ja ho explica */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
          className="relative hidden lg:block"
          aria-hidden="true"
        >
          <div
            className="pointer-events-none absolute -inset-[10%]"
            style={{ background: "radial-gradient(circle at center, rgba(37,99,235,0.15) 0%, transparent 65%)", filter: "blur(40px)" }}
          />
          <div className="relative">
            <MiniDemo slug={demo} iconName="" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
