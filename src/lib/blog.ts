// Parser de frontmatter lleuger — sense dependències de Node.js
function matter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const yamlStr = match[1];
  const content = match[2].trim();
  const data: Record<string, unknown> = {};
  let currentKey = '';
  let inArray = false;
  const arr: string[] = [];
  for (const line of yamlStr.split('\n')) {
    const arrayItem = line.match(/^  - (.+)/);
    const kvMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)/);
    if (arrayItem) {
      if (inArray) arr.push(arrayItem[1].replace(/^["']|["']$/g, ''));
    } else if (kvMatch) {
      if (inArray && currentKey) { data[currentKey] = arr.splice(0); inArray = false; }
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val === '') { inArray = true; arr.length = 0; }
      else if (val === 'true') data[currentKey] = true;
      else if (val === 'false') data[currentKey] = false;
      else if (!isNaN(Number(val))) data[currentKey] = Number(val);
      else data[currentKey] = val.replace(/^["']|["']$/g, '');
    }
  }
  if (inArray && currentKey) data[currentKey] = [...arr];
  return { data, content };
}

// Raw imports de tots els articles — Vite els processa com a strings
import raw_ses_guia from '@/content/blog/ses-hospedajes-guia-completa-2026.md?raw';
import raw_ses_un_solo from '@/content/blog/ses-hospedajes-un-solo-apartamento.md?raw';
import raw_ses_nrua from '@/content/blog/ses-nrua-taxa-turistica-guia.md?raw';
import raw_sanciones from '@/content/blog/sanciones-por-no-cumplir-registro-viajeros.md?raw';
import raw_mossos from '@/content/blog/registro-viajeros-mossos-esquadra-cataluna.md?raw';
import raw_checkin_digital from '@/content/blog/checkin-digital-comparativa-espana.md?raw';
import raw_cuanto from '@/content/blog/cuanto-cuesta-gestionar-piso-turistico.md?raw';
import raw_stack from '@/content/blog/stack-completo-propietario-airbnb.md?raw';
import raw_gestor from '@/content/blog/gestor-pequeno-5-apps-una-app.md?raw';
import raw_channel from '@/content/blog/channel-manager-alquiler-vacacional-guia.md?raw';
import raw_automatizar from '@/content/blog/automatizar-alquiler-vacacional-con-ia.md?raw';
import raw_precios_dinamicos from '@/content/blog/precios-dinamicos-airbnb-booking.md?raw';
import raw_mensajes from '@/content/blog/responder-mensajes-airbnb-automaticamente.md?raw';
import raw_whatsapp from '@/content/blog/whatsapp-business-alquiler-vacacional.md?raw';
import raw_limpiezas from '@/content/blog/coordinacion-limpiezas-excel-sistema.md?raw';
import raw_5horas from '@/content/blog/5-horas-semana-recuperar-apartamento-turistico.md?raw';
import raw_escalar from '@/content/blog/pasar-3-a-10-apartamentos-sin-colapsar.md?raw';
import raw_pms from '@/content/blog/pms-apartamentos-turisticos-mejores-2026.md?raw';
import raw_comparativa from '@/content/blog/hostify-vs-lodgify-vs-smoobu-comparativa.md?raw';
import raw_huesped from '@/content/blog/huesped-no-responde-checkin-online.md?raw';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  keywords: string[];
  readingTime: number;
  content: string;
}

function parse(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  return {
    slug,
    title:       String(data.title ?? slug),
    description: String(data.description ?? ''),
    publishedAt: String(data.publishedAt ?? ''),
    keywords:    Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    readingTime: Number(data.readingTime ?? 5),
    content,
  };
}

export const blogPosts: BlogPost[] = [
  parse('ses-hospedajes-guia-completa-2026',            raw_ses_guia),
  parse('ses-hospedajes-un-solo-apartamento',           raw_ses_un_solo),
  parse('ses-nrua-taxa-turistica-guia',                 raw_ses_nrua),
  parse('sanciones-por-no-cumplir-registro-viajeros',   raw_sanciones),
  parse('registro-viajeros-mossos-esquadra-cataluna',   raw_mossos),
  parse('checkin-digital-comparativa-espana',           raw_checkin_digital),
  parse('cuanto-cuesta-gestionar-piso-turistico',       raw_cuanto),
  parse('stack-completo-propietario-airbnb',            raw_stack),
  parse('gestor-pequeno-5-apps-una-app',                raw_gestor),
  parse('channel-manager-alquiler-vacacional-guia',     raw_channel),
  parse('automatizar-alquiler-vacacional-con-ia',       raw_automatizar),
  parse('precios-dinamicos-airbnb-booking',             raw_precios_dinamicos),
  parse('responder-mensajes-airbnb-automaticamente',    raw_mensajes),
  parse('whatsapp-business-alquiler-vacacional',        raw_whatsapp),
  parse('coordinacion-limpiezas-excel-sistema',         raw_limpiezas),
  parse('5-horas-semana-recuperar-apartamento-turistico', raw_5horas),
  parse('pasar-3-a-10-apartamentos-sin-colapsar',       raw_escalar),
  parse('pms-apartamentos-turisticos-mejores-2026',     raw_pms),
  parse('hostify-vs-lodgify-vs-smoobu-comparativa',     raw_comparativa),
  parse('huesped-no-responde-checkin-online',           raw_huesped),
];

export function getPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
