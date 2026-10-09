import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS, DEFAULT_LANG, type Lang } from "./i18n/config";

// Crítiques (part del first-paint)
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AvisGaletes from "./components/AvisGaletes";

// Lazy — només es carreguen quan l'usuari hi navega
const Empezar = lazy(() => import("./pages/Empezar"));
const Calcula = lazy(() => import("./pages/Calcula"));
const Guia = lazy(() => import("./pages/Guia"));
const ComparativaChekin = lazy(() => import("./pages/comparativa/Chekin"));
const Propietarios = lazy(() => import("./pages/personas/Propietarios"));
const GestoresPequenos = lazy(() => import("./pages/personas/GestoresPequenos"));
const SegundaResidencia = lazy(() => import("./pages/personas/SegundaResidencia"));
const Hereus = lazy(() => import("./pages/personas/Hereus"));
const BlogIndex = lazy(() => import("./pages/blog/index"));
const BlogArticle = lazy(() => import("./pages/blog/Article"));
const AlternativasIndex = lazy(() => import("./pages/alternativas/index"));
const AlternativaRoute = lazy(() => import("./pages/alternativas/AlternativaRoute"));
const FuncionalidadesIndex = lazy(() => import("./pages/funcionalidades/index"));
const FeatureRoute = lazy(() => import("./pages/funcionalidades/FeatureRoute"));
const PreciosPage = lazy(() => import("./pages/Precios"));
const Demo = lazy(() => import("./pages/Demo"));
const SobreHostly = lazy(() => import("./pages/SobreHostly"));
const Privacidad = lazy(() => import("./pages/legal/Privacidad"));
const Cookies = lazy(() => import("./pages/legal/Cookies"));
const Terminos = lazy(() => import("./pages/legal/Terminos"));
const AvisoLegal = lazy(() => import("./pages/legal/AvisoLegal"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-primary animate-spin" />
  </div>
);

/* ─── Detector inicial d'idioma per redirects arrel ─── */
function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  // 1. localStorage
  try {
    const stored = localStorage.getItem('hostly_lang');
    if (stored && (SUPPORTED_LANGS as readonly string[]).includes(stored)) return stored as Lang;
  } catch { /* ignora */ }
  // 2. navigator
  const nav = (navigator.language || 'es').toLowerCase();
  if (nav.startsWith('ca')) return 'ca';
  if (nav.startsWith('es')) return 'es';
  return DEFAULT_LANG;
}

/* ─── Layout que valida :lang i sincronitza i18n ─── */
function LangLayout() {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  const isValid = lang && (SUPPORTED_LANGS as readonly string[]).includes(lang);

  useEffect(() => {
    if (isValid && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      try { localStorage.setItem('hostly_lang', lang!); } catch { /* ignora */ }
      document.documentElement.lang = lang === 'ca' ? 'ca-ES' : 'es-ES';
    }
  }, [lang, isValid, i18n]);

  if (!isValid) return <Navigate to={`/${detectInitialLang()}`} replace />;
  return <Outlet />;
}

/* ─── Pàgines que ja no hi són: el mateix contingut a la pàgina que el substitueix ───
 * Redisseny d'octubre 2026: `/funciones/*` duplicava `/funcionalidades/*` amb textos
 * diferents, i les rutes «pont» ensenyaven una pantalla de programador en producció.
 * Els mateixos salts són a `vercel.json` com a 301 (per als cercadors); aquests
 * cobreixen la navegació dins de l'app. */
function Redirigeix({ a }: { a: string }) {
  const { lang } = useParams<{ lang: string }>();
  return <Navigate to={`/${lang}${a}`} replace />;
}

/* ─── Enllaços amb # (/es#faq, /es/precios#precios): baixar fins a la secció ───
 * React Router no ho fa sol, i la portada triga a tenir l'alçada final (animació fixada
 * de l'entrada, pàgines que es carreguen a part): es torna a provar uns segons. */
function ScrollAHash() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    let intents = 0;
    let temps = 0;
    const prova = () => {
      const el = document.getElementById(id);
      if (el) {
        const reduir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ behavior: reduir ? 'auto' : 'smooth', block: 'start' });
        return;
      }
      if (++intents < 20) temps = window.setTimeout(prova, 150);
    };
    temps = window.setTimeout(prova, 350);
    return () => window.clearTimeout(temps);
  }, [pathname, hash]);
  return null;
}

/* ─── Redirect per rutes legacy (sense prefix d'idioma) ─── */
function LegacyRedirect() {
  const location = useLocation();
  const path = location.pathname + location.search + location.hash;
  return <Navigate to={`/${detectInitialLang()}${path}`} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Arrel → idioma detectat */}
            <Route path="/" element={<Navigate to={`/${detectInitialLang()}`} replace />} />

            {/* Rutes amb prefix d'idioma */}
            <Route path="/:lang" element={<LangLayout />}>
              <Route index element={<Index />} />

              {/* L'única porta del web i la calculadora (octubre 2026) */}
              <Route path="empezar" element={<Empezar />} />
              <Route path="calcula" element={<Calcula />} />

              {/* Funciones (velles) → Funcionalidades */}
              <Route path="funciones/check-in" element={<Redirigeix a="/funcionalidades/check-in-online" />} />
              <Route path="funciones/mensajes" element={<Redirigeix a="/funcionalidades/ia-whatsapp" />} />
              <Route path="funciones/reservas" element={<Redirigeix a="/funcionalidades/channel-manager" />} />
              <Route path="funciones/limpiezas" element={<Redirigeix a="/funcionalidades/gestion-de-limpiezas" />} />
              <Route path="funciones/pagos" element={<Redirigeix a="/funcionalidades/finanzas" />} />
              <Route path="funciones/precios" element={<Redirigeix a="/funcionalidades/precios-dinamicos" />} />

              {/* Super Guia */}
              <Route path="guia" element={<Guia />} />

              {/* Comparatives */}
              <Route path="comparativa/chekin" element={<ComparativaChekin />} />

              {/* Landings per persona */}
              <Route path="propietarios" element={<Propietarios />} />
              <Route path="gestores-pequenos" element={<GestoresPequenos />} />
              <Route path="segunda-residencia" element={<SegundaResidencia />} />
              <Route path="hereus" element={<Hereus />} />

              {/* Blog */}
              <Route path="blog" element={<BlogIndex />} />
              <Route path="blog/:slug" element={<BlogArticle />} />

              {/* Alternativas */}
              <Route path="alternativas" element={<AlternativasIndex />} />
              <Route path="alternativas/:slug" element={<AlternativaRoute />} />

              {/* Funcionalidades */}
              <Route path="funcionalidades" element={<FuncionalidadesIndex />} />
              <Route path="funcionalidades/:slug" element={<FeatureRoute />} />

              {/* Rutes pont (abans: pantalla de programador) */}
              <Route path="casos-de-uso/*" element={<Redirigeix a="/blog" />} />
              <Route path="casos-de-uso" element={<Redirigeix a="/blog" />} />
              <Route path="integraciones/*" element={<Redirigeix a="/funcionalidades/conecta-todo" />} />
              <Route path="integraciones" element={<Redirigeix a="/funcionalidades/conecta-todo" />} />
              <Route path="precios" element={<PreciosPage />} />
              <Route path="sobre-hostly" element={<SobreHostly />} />
              <Route path="privacidad" element={<Privacidad />} />
              <Route path="cookies" element={<Cookies />} />
              <Route path="terminos" element={<Terminos />} />
              <Route path="aviso-legal" element={<AvisoLegal />} />
              <Route path="demo" element={<Demo />} />
              <Route path="para-asesorias-inmobiliarias" element={<Redirigeix a="/blog" />} />
              <Route path="para-empresas-de-limpieza" element={<Redirigeix a="/funcionalidades/gestion-de-limpiezas" />} />
              <Route path="software-apartamentos-turisticos" element={<Redirigeix a="" />} />
              <Route path="pms-con-ia" element={<Redirigeix a="/funcionalidades/ia-whatsapp" />} />
              <Route path="whatsapp-airbnb" element={<Redirigeix a="/funcionalidades/ia-whatsapp" />} />

              {/* Catch-all dins idioma vàlid */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Rutes legacy sense prefix → redirect a /es/path */}
            <Route path="*" element={<LegacyRedirect />} />
          </Routes>
        </Suspense>
        <AvisGaletes />
        <ScrollAHash />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
