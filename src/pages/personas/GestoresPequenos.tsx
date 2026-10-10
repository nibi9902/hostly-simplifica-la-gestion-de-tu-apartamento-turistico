import { ArrowRight } from "lucide-react";
import PageShell from "@/components/PageShell";
import HeroPersona from "./HeroPersona";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { useTranslation } from 'react-i18next';
import { useEmpezar } from "@/lib/empezar";

type Tool = { name: string; cost: string };

export default function GestoresPequenos() {
  const empezar = useEmpezar();
  const { t } = useTranslation('personas');
  const tools = t("gestores.tools", { returnObjects: true }) as Tool[];
  return (
    <PageShell
      title={t("gestores.meta_title")}
      description={t("gestores.meta_description")}
      path="/gestores-pequenos"
      schemas={[breadcrumbSchema([{ name: 'Hostly', url: '/' }, { name: t("gestores.breadcrumb_label"), url: '/gestores-pequenos' }])]}
    >
      <HeroPersona
        badge={t("gestores.badge")}
        h1={t("gestores.h1")}
        intro={t("gestores.intro")}
        cta={t("gestores.cta_primary")}
        ctaSub={t("gestores.cta_sub")}
        demo="channel-manager"
        onEmpezar={empezar}
      />

      {/* A l'ordinador: el títol a l'esquerra i, a la dreta, les eines que es paguen avui i el resum */}
      <section className="py-20">
        <div className="contenidor grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5 lg:self-start lg:sticky lg:top-28">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] tracking-tight mb-4">
              {t("gestores.section2_h2")}
            </h2>
            <p className="text-slate-500 text-lg">{t("gestores.section2_sub")}</p>
          </div>
          <div className="lg:col-span-7">
          <div className="space-y-3 mb-8">
            {tools.map((item) => (
              // Al mòbil, el cost a sota del nom (al costat, els textos llargs aixafaven el nom en una columna)
              <div key={item.name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-[#fff7f7] border border-red-100 text-sm">
                <span className="text-slate-700">❌ {item.name}</span>
                <span className="font-semibold text-red-700 pl-6 sm:pl-0 sm:flex-shrink-0 sm:ml-4 sm:text-right">{item.cost}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0]">
            <p className="font-bold text-[#15803d]">{t("gestores.hostly_summary")}</p>
          </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center" style={{ background: "linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)" }}>
        <div className="contenidor">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
            {t("gestores.cta_h2")}
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">{t("gestores.cta_sub2")}</p>
          <button type="button" onClick={empezar} className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white text-[#0f1f5c] font-semibold text-base hover:shadow-[0_8px_40px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            {t("gestores.cta_primary")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </PageShell>
  );
}
