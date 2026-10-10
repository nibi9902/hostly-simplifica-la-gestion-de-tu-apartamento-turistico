import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Calendar, ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/blog';
import { blogPosts } from '@/lib/blog';
import { SiteHeader } from '@/components/SiteHeader';
import { LangLink, MotionLangLink } from '@/i18n/LangLink';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { blogPostingSchema, breadcrumbSchema } from '@/lib/seo/schemas';
import { track, trackArticleScrollDepth } from '@/lib/analytics';
import { articleToFeature } from '@/lib/data/relatedContent';
import { useTranslation } from 'react-i18next';
import { IndexLateral, useTitols } from '@/components/IndexLateral';
import { useLang } from '@/i18n/useLang';

import { useEmpezar } from "@/lib/empezar";

/* Dins dels articles: un enllaç intern («/funcionalidades/…») porta l'idioma i no recarrega
 * la pàgina; un d'extern s'obre a part. Les taules llisquen dins seu al mòbil (abans una
 * comparativa desbordava 112 px per la dreta). */
const COMPONENTS_ARTICLE = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) =>
    href && href.startsWith('/')
      ? <LangLink to={href}>{children}</LangLink>
      : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
  table: ({ children }: { children?: React.ReactNode }) => (
    // tabIndex: al mòbil la taula llisca i s'ha de poder moure amb el teclat
    <div className="overflow-x-auto -mx-1 px-1" tabIndex={0} role="region" aria-label="Tabla"><table>{children}</table></div>
  ),
  // Les llistes «- [ ]» del markdown són llistes de comprovació per llegir, no formularis:
  // una casella dibuixada (sense etiqueta, la casella real no s'entenia amb lector de pantalla)
  input: ({ type, checked }: { type?: string; checked?: boolean }) =>
    type === 'checkbox'
      ? <span aria-hidden="true" className="inline-block mr-2 text-slate-500">{checked ? '☑' : '☐'}</span>
      : null,
};
const ease = [0.22, 1, 0.36, 1] as const;

interface Props { post: BlogPost }

export default function ArticleLayout({ post }: Props) {
  const empezar = useEmpezar();
  const { t } = useTranslation('blog');
  const { lang } = useLang();

  // Scroll-depth tracking — manté analytics, sense tocar els meta tags (gestio via SEO component)
  useEffect(() => {
    const cleanup = trackArticleScrollDepth(post.slug);
    return cleanup;
  }, [post.slug]);

  const wordCount = Math.round(post.content.replace(/<[^>]+>/g, '').split(/\s+/).length);

  // Articles relacionats — 3 de la mateixa categoria de keywords
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.keywords.some((k) => post.keywords.includes(k)))
    .slice(0, 3);

  // Funció relacionada (article → feature link)
  const relatedFeature = articleToFeature[post.slug];

  const cos = useRef<HTMLElement>(null);
  const { titols, actiu } = useTitols(cos, post.slug);

  // «Empezar»: a la columna del costat (estreta, apilada) o després del text (al mòbil)
  const cta = (costat: boolean) => (
    <div
      className={costat ? 'rounded-3xl p-7 flex flex-col gap-5' : 'rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-6'}
      style={{ background: 'linear-gradient(135deg, #0f1f5c 0%, #1a3a8f 100%)' }}
    >
      <div className={costat ? '' : 'flex-1 text-center md:text-left'}>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/70 mb-2">{t('article.cta_eyebrow')}</p>
        <p className={`${costat ? 'text-lg' : 'text-xl md:text-2xl'} font-bold text-white mb-2`}>
          {t('article.cta_title')}
        </p>
        <p className="text-white/60 text-sm leading-relaxed">
          {t('article.cta_body')}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          track('cta_primary_click', { location: costat ? 'article-costat' : 'article', slug: post.slug });
          empezar();
        }}
        className={`${costat ? 'self-start' : 'flex-shrink-0'} inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-[#0f1f5c] font-semibold text-sm hover:shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap`}
      >
        {t('article.cta_button')} <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );

  // Funció relacionada — link article → feature
  const funcio = relatedFeature && (
    <LangLink
      to={relatedFeature.path}
      className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-primary/15 bg-[#eff6ff] hover:border-primary/30 hover:bg-[#e0eeff] transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <span className="text-primary text-lg">⚡</span>
        <p className="text-sm font-semibold text-primary">{lang === 'ca' ? relatedFeature.labelCa : relatedFeature.label}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </LangLink>
  );

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${post.title} | Hostly`}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogType="article"
        nomesCastella
        schemas={[
          blogPostingSchema({
            title: post.title,
            description: post.description,
            slug: post.slug,
            publishedAt: post.publishedAt,
            keywords: post.keywords,
            readingTime: post.readingTime,
            wordCount,
          }),
          breadcrumbSchema([
            { name: 'Hostly', url: '/' },
            { name: t('index.breadcrumb'), url: '/blog' },
            { name: post.title, url: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <SiteHeader />

      {/* Hero de l'article: a la línia de tot el web (10-10-2026; abans, una columna de 768 px al mig) */}
      <header className="pt-28 pb-12 bg-gradient-to-b from-[#f0f6ff] to-white">
        <div className="contenidor">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease }}>
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
              <LangLink to="/" className="hover:text-slate-600 transition-colors">Hostly</LangLink>
              <span>/</span>
              <LangLink to="/blog" className="hover:text-slate-600 transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> {t('index.breadcrumb')}
              </LangLink>
            </div>

            {/* Avís CA — articles encara no traduïts */}
            {lang === 'ca' && (
              <div className="mb-8 max-w-3xl flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50/60">
                <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 leading-snug">
                    {t('article.ca_notice_title')}
                  </p>
                  <p className="text-sm text-amber-800/80 leading-relaxed mt-1">
                    {t('article.ca_notice_body')}
                  </p>
                </div>
              </div>
            )}

            {/* Keyword pill */}
            {post.keywords[0] && (
              <span className="inline-flex items-center text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-[#eff6ff] text-primary mb-5">
                {post.keywords[0]}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] tracking-tight leading-[1.1] mb-6 max-w-4xl">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-slate-500 leading-relaxed mb-8 max-w-3xl">
              {post.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 pb-8 border-b border-slate-100">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString(lang === 'ca' ? 'ca-ES' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {t('article.min_read_full', { count: post.readingTime })}
                </span>
              )}
              <span className="ml-auto text-xs font-medium text-primary bg-[#eff6ff] px-2.5 py-1 rounded-full">
                {t('article.updated_2026')}
              </span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Contingut: a l'ordinador, el text a l'esquerra i, al costat, l'índex i «Empezar» (es queden a la
          vista mentre es llegeix); al mòbil, tot un sota l'altre com abans */}
      <main className="pb-24">
        <div className="contenidor grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
            className="min-w-0 lg:col-span-8"
          >
            <article ref={cos} className="
              prose prose-slate prose-lg max-w-[70ch] pt-12 break-words
              prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#0f172a] prose-headings:scroll-mt-24
              prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-h2:pb-3 prose-h2:border-b prose-h2:border-slate-100
              prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-primary
              prose-h4:text-lg prose-h4:mt-8 prose-h4:mb-3
              prose-p:text-slate-600 prose-p:leading-[1.85] prose-p:my-5
              prose-strong:text-[#0f172a] prose-strong:font-semibold
              prose-a:text-primary prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary
              prose-ul:text-slate-600 prose-ul:my-5 prose-li:my-2 prose-li:leading-relaxed
              prose-ol:text-slate-600 prose-ol:my-5
              prose-code:text-primary prose-code:bg-[#eff6ff] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-[#0f172a] prose-pre:text-slate-300 prose-pre:rounded-2xl prose-pre:shadow-xl
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-[#f0f6ff] prose-blockquote:rounded-r-xl prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:not-italic prose-blockquote:text-slate-700
              prose-table:text-sm prose-table:border-collapse
              prose-thead:bg-[#f8fafc]
              prose-th:text-[#0f172a] prose-th:font-bold prose-th:px-4 prose-th:py-3 prose-th:border prose-th:border-slate-200
              prose-td:text-slate-600 prose-td:px-4 prose-td:py-3 prose-td:border prose-td:border-slate-100
              prose-tr:even:bg-[#f8fafc]/50
              prose-img:rounded-2xl prose-img:shadow-md
              prose-hr:border-slate-100 prose-hr:my-12
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={COMPONENTS_ARTICLE}>
                {post.content}
              </ReactMarkdown>
            </article>
          </motion.div>

          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 pt-12 space-y-8">
              <IndexLateral titol={t('article.index')} titols={titols} actiu={actiu} />
              {cta(true)}
              {funcio}
            </div>
          </aside>
        </div>

        {/* Mòbil i tauleta: «Empezar» i la funció relacionada, després del text */}
        <div className="contenidor lg:hidden mt-16 space-y-6">
          {cta(false)}
          {funcio}
        </div>

        {/* Articles relacionats */}
        {related.length > 0 && (
          <div className="contenidor mt-16">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500 mb-6">{t('article.related_label')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p, i) => (
                <MotionLangLink
                  key={p.slug}
                  to={`/blog/${p.slug}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease }}
                  className="group flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 bg-[#f8fafc] hover:bg-white hover:border-primary/20 hover:shadow-md transition-all duration-200"
                >
                  <h3 className="text-sm font-bold text-[#0f172a] group-hover:text-primary transition-colors leading-snug">
                    {p.title}
                  </h3>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 mt-auto">
                    <Clock className="w-3 h-3" /> {p.readingTime} min
                  </span>
                </MotionLangLink>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
