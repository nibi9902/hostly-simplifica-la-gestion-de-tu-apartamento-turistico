import { writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE = 'https://hostlylabs.com';
const TODAY = new Date().toISOString().split('T')[0];
const ROOT = join(__dirname, '..');
const LANGS = ['es', 'ca'] as const;

interface UrlEntry {
  loc: string;
  lastmod?: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

// Llegeix els slugs dels articles del blog
const blogDir = join(ROOT, 'src', 'content', 'blog');
const blogSlugs = readdirSync(blogDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace('.md', ''));

// Parser simple de frontmatter per extreure publishedAt
function getPublishedAt(slug: string): string {
  const raw = readFileSync(join(blogDir, `${slug}.md`), 'utf8');
  const match = raw.match(/publishedAt:\s*["']?([0-9-]+)["']?/);
  return match ? match[1] : TODAY;
}

// Slugs d'alternativas (hardcoded — mateixos que a competitors.ts)
const alternativasSlugs = ['icnea', 'hostify', 'lodgify', 'smoobu', 'hospitable', 'guesty', 'avantio'];

// Slugs de funcionalidades (hardcoded — mateixos que a features.ts)
const funcionalidadesSlugs = [
  'ia-whatsapp',
  'check-in-online',
  'channel-manager',
  'gestion-de-limpiezas',
  'precios-dinamicos',
  'mensajeria-programada',
  'multi-rol',
  'finanzas',
  'burocracia',
  'conecta-todo',
];

// Paths sense prefix d'idioma — el generador els emet per cada idioma amb hreflang
const basePaths: UrlEntry[] = [
  { loc: '/', changefreq: 'weekly', priority: 1.0 },

  { loc: '/guia', changefreq: 'monthly', priority: 0.95 },
  { loc: '/blog', changefreq: 'weekly', priority: 0.9 },
  { loc: '/alternativas', changefreq: 'monthly', priority: 0.8 },
  { loc: '/funcionalidades', changefreq: 'monthly', priority: 0.9 },

  // Les antigues /funciones/* redirigeixen (301) a /funcionalidades/* des d'octubre 2026.
  { loc: '/precios', changefreq: 'monthly', priority: 0.9 },
  { loc: '/calcula', changefreq: 'monthly', priority: 0.8 },
  { loc: '/demo', changefreq: 'monthly', priority: 0.6 },

  { loc: '/comparativa/chekin', changefreq: 'monthly', priority: 0.9 },

  { loc: '/propietarios', changefreq: 'monthly', priority: 0.85 },
  { loc: '/gestores-pequenos', changefreq: 'monthly', priority: 0.85 },
  { loc: '/segunda-residencia', changefreq: 'monthly', priority: 0.8 },
  { loc: '/hereus', changefreq: 'monthly', priority: 0.8 },

  // Legals
  { loc: '/privacidad', changefreq: 'yearly', priority: 0.3 },
  { loc: '/cookies', changefreq: 'yearly', priority: 0.3 },
  { loc: '/terminos', changefreq: 'yearly', priority: 0.3 },
  { loc: '/aviso-legal', changefreq: 'yearly', priority: 0.3 },
  { loc: '/sobre-hostly', changefreq: 'monthly', priority: 0.6 },

  ...alternativasSlugs.map((slug) => ({
    loc: `/alternativas/${slug}`,
    changefreq: 'monthly' as const,
    priority: 0.75,
  })),

  ...funcionalidadesSlugs.map((slug) => ({
    loc: `/funcionalidades/${slug}`,
    changefreq: 'monthly' as const,
    priority: 0.85,
  })),

  ...blogSlugs.map((slug) => ({
    loc: `/blog/${slug}`,
    lastmod: getPublishedAt(slug),
    changefreq: 'monthly' as const,
    priority: 0.7,
  })),
];

// XML serializer amb hreflang per a cada path en cada idioma
const xmlEntries = basePaths.flatMap((u) =>
  LANGS.map((lang) => {
    const localizedPath = u.loc === '/' ? `/${lang}` : `/${lang}${u.loc}`;
    const alternates = LANGS.map(
      (alt) => `    <xhtml:link rel="alternate" hreflang="${alt === 'ca' ? 'ca-ES' : 'es-ES'}" href="${BASE}${alt === 'es' && u.loc === '/' ? '/es' : `/${alt}${u.loc === '/' ? '' : u.loc}`}"/>`,
    ).join('\n');
    const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}/es${u.loc === '/' ? '' : u.loc}"/>`;
    return (
      `  <url>\n` +
      `    <loc>${BASE}${localizedPath}</loc>\n` +
      `    <lastmod>${u.lastmod ?? TODAY}</lastmod>\n` +
      `    <changefreq>${u.changefreq}</changefreq>\n` +
      `    <priority>${u.priority}</priority>\n` +
      `${alternates}\n` +
      `${xDefault}\n` +
      `  </url>`
    );
  }),
);

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  xmlEntries.join('\n') +
  `\n</urlset>\n`;

const output = join(ROOT, 'public', 'sitemap.xml');
writeFileSync(output, xml);
console.log(`✓ Sitemap generat amb ${xmlEntries.length} URLs (${basePaths.length} paths × ${LANGS.length} idiomes) → ${output}`);
console.log(`   · ${blogSlugs.length} articles de blog`);
console.log(`   · ${alternativasSlugs.length} alternativas`);
console.log(`   · ${funcionalidadesSlugs.length} funcionalidades`);
