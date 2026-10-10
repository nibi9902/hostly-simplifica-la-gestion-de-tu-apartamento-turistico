import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useEmpezar } from "@/lib/empezar";
const ease = [0.22, 1, 0.36, 1] as const;

type Notif = {
  icon: string;
  title: string;
  sub: string;
  iconBg: string;
  iconColor: string;
};

const PAIR_META = [
  { beforeIcon: "💬", afterIcon: "🛡️", beforeBg: "#fef3c7", beforeColor: "#d97706", afterBg: "#dcfce7", afterColor: "#16a34a", rb: -1, ra: 1 },
  { beforeIcon: "📅", afterIcon: "✨", beforeBg: "#dbeafe", beforeColor: "#2563eb", afterBg: "#dcfce7", afterColor: "#16a34a", rb: 1,  ra: -1 },
  { beforeIcon: "🧾", afterIcon: "💳", beforeBg: "#ede9fe", beforeColor: "#7c3aed", afterBg: "#dcfce7", afterColor: "#16a34a", rb: -1, ra: 1 },
  { beforeIcon: "📋", afterIcon: "🏛️", beforeBg: "#fee2e2", beforeColor: "#dc2626", afterBg: "#dcfce7", afterColor: "#16a34a", rb: -1, ra: 1 },
  { beforeIcon: "📱", afterIcon: "🤖", beforeBg: "#ffedd5", beforeColor: "#ea580c", afterBg: "#dcfce7", afterColor: "#16a34a", rb: 1,  ra: -1 },
];

const Bubble = ({
  n,
  rotate,
  isAfter,
  delay,
}: {
  n: Notif;
  rotate: number;
  isAfter: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45, delay, ease }}
    style={{
      rotate: `${rotate}deg`,
      border: isAfter ? "1px solid rgba(34,197,94,0.25)" : "1px solid rgba(15,23,42,0.07)",
      boxShadow: isAfter
        ? "0 4px 20px rgba(34,197,94,0.10), 0 1px 3px rgba(15,23,42,0.04), inset 3px 0 0 #22c55e"
        : "0 4px 20px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)",
    }}
    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white w-full"
  >
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
      style={{ background: n.iconBg, border: `1px solid ${n.iconColor}25` }}
    >
      {n.icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className={`text-sm font-bold leading-tight ${isAfter ? "text-emerald-800" : "text-slate-900"}`}>
        {n.title}
      </p>
      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
        {n.sub}
      </p>
    </div>
  </motion.div>
);

const PainBlock = () => {
  const empezar = useEmpezar();
  const { t } = useTranslation("home");
  const pairs = t("pain.pairs", { returnObjects: true }) as Array<{
    before_title: string;
    before_sub: string;
    after_title: string;
    after_sub: string;
  }>;

  // Les dues columnes van per files (subgrid): cada «sin sistema» queda a l'altura del seu «con Hostly»
  // encara que un dels dos textos faci dues línies.
  const columna = (despres: boolean) => (
    <motion.div
      initial={{ opacity: 0, x: despres ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: despres ? 0.1 : 0, ease }}
      className="grid gap-3 md:row-span-6 md:grid-rows-subgrid"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`h-px flex-1 ${despres ? "bg-emerald-200/70" : "bg-rose-200/70"}`} />
        <span className={`text-[10px] font-bold uppercase tracking-widest flex-shrink-0 ${despres ? "text-emerald-700" : "text-rose-700"}`}>
          {t(despres ? "pain.col_after" : "pain.col_before")}
        </span>
        <div className={`h-px flex-1 ${despres ? "bg-emerald-200/70" : "bg-rose-200/70"}`} />
      </div>
      {pairs.map((p, i) => {
        const meta = PAIR_META[i];
        const notif: Notif = despres
          ? { icon: meta.afterIcon, title: p.after_title, sub: p.after_sub, iconBg: meta.afterBg, iconColor: meta.afterColor }
          : { icon: meta.beforeIcon, title: p.before_title, sub: p.before_sub, iconBg: meta.beforeBg, iconColor: meta.beforeColor };
        return (
          <div key={i} className="flex" style={{ transform: `rotate(${despres ? meta.ra : meta.rb}deg)` }}>
            <div
              className="rounded-2xl bg-white flex w-full"
              style={despres
                ? { border: "1px solid rgba(34,197,94,0.25)", boxShadow: "0 4px 20px rgba(34,197,94,0.10), 0 1px 3px rgba(15,23,42,0.04), inset 3px 0 0 #22c55e" }
                : { border: "1px solid rgba(15,23,42,0.07)", boxShadow: "0 4px 20px rgba(15,23,42,0.06), 0 1px 3px rgba(15,23,42,0.04)" }}
            >
              <Bubble n={notif} rotate={0} isAfter={despres} delay={i * 0.08 + (despres ? 0.15 : 0)} />
            </div>
          </div>
        );
      })}
    </motion.div>
  );

  return (
    <section id="pain" className="py-14 md:py-28 bg-background">
      {/* A l'ordinador gran: el títol i el botó a l'esquerra, les dues columnes a la dreta (tota l'amplada) */}
      <div className="contenidor grid gap-y-14 md:gap-y-16 xl:grid-cols-12 xl:gap-x-16 xl:gap-y-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center xl:text-left xl:col-span-4 xl:row-start-1 xl:self-end"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
            {t("pain.eyebrow")}
          </p>
          <h2 className="text-2xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.05] mb-4">
            {t("pain.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto xl:mx-0">
            {t("pain.subtitle")}
          </p>
        </motion.div>

        {/* Dues columnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 md:gap-x-10 xl:col-span-8 xl:col-start-5 xl:row-start-1 xl:row-span-2">
          {columna(false)}
          {columna(true)}
        </div>

        {/* Closer + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="text-center xl:text-left xl:col-span-4 xl:row-start-2 xl:self-start"
        >
          <p className="text-foreground text-base md:text-lg font-semibold mb-2">
            {t("pain.closer_title")}
          </p>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto xl:mx-0">
            {t("pain.closer_sub")}
          </p>
          <button type="button" onClick={empezar} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_4px_14px_rgba(37,99,235,0.25)]"
          >
            {t("pain.closer_cta")}
            <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-xs text-muted-foreground mt-3">
            {t("pain.closer_fine")}
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default PainBlock;
