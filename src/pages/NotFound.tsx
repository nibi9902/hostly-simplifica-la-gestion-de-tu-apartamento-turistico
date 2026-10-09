import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const { t } = useTranslation("common");
  return (
    <>
      <Helmet>
        <title>{t("not_found.title")}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
        <div className="text-center max-w-md mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-4">
            {t("not_found.badge")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            {t("not_found.heading")}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-8">
            {t("not_found.body")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <LangLink
              to="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <Home className="w-4 h-4" />
              {t("not_found.go_home")}
            </LangLink>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border bg-background text-foreground font-semibold text-sm hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("not_found.go_back")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
