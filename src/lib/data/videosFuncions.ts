/**
 * El vídeo de cada funcionalitat (el Biel, 17-10-2026): a dalt de la seva pàgina, en lloc de la demo
 * animada, i a la seva targeta de /funcionalidades. Els fa el kit de vídeos de la demo animada (un per
 * funcionalitat, amb veu i els mateixos passos que la pàgina) i són a `public/assets/funcions/`:
 *   <slug>.mp4        el vídeo (1280×720)
 *   <slug>.webp       la portada (el títol, el primer que es veu)
 *   <slug>-mini.webp  la miniatura de l'índex (un moment del segon pas)
 *   <slug>.es.vtt     els subtítols de la veu
 * Si el kit torna a renderitzar un vídeo, es tornen a exportar els quatre fitxers i s'hi posa la
 * durada nova. De moment només n'hi ha en castellà: en català, la pàgina continua amb la demo animada
 * (`MiniDemo`) i la targeta, sense vídeo.
 */
import type { Lang } from '@/i18n/config';

export type VideoFuncio = {
  src: string;
  portada: string;
  miniatura: string;
  subtitols: string;
  /** L'idioma de la veu i dels subtítols */
  idioma: Lang;
  /** Com es llegeix a la píndola: «0:25» */
  durada: string;
};

/** Els segons de cada vídeo, arrodonits */
const SEGONS_ES: Record<string, number> = {
  'ia-whatsapp': 38,
  'check-in-online': 29,
  'channel-manager': 25,
  'web-de-reservas-directas': 25,
  'gestion-de-limpiezas': 32,
  'precios-dinamicos': 33,
  'mensajeria-programada': 25,
  'multi-rol': 25,
  'conecta-todo': 25,
  'finanzas': 33,
  'burocracia': 26,
};

const durada = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const VIDEOS: Partial<Record<Lang, Record<string, VideoFuncio>>> = {
  es: Object.fromEntries(
    Object.entries(SEGONS_ES).map(([slug, s]) => [
      slug,
      {
        src: `/assets/funcions/${slug}.mp4`,
        portada: `/assets/funcions/${slug}.webp`,
        miniatura: `/assets/funcions/${slug}-mini.webp`,
        subtitols: `/assets/funcions/${slug}.es.vtt`,
        idioma: 'es',
        durada: durada(s),
      },
    ]),
  ),
};

export function videoDeLaFuncio(slug: string, lang: Lang): VideoFuncio | undefined {
  return VIDEOS[lang]?.[slug];
}
