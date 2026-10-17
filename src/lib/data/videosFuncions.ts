/**
 * El vídeo de cada funcionalitat (el Biel, 17-10-2026): a «Cómo funciona», amb els passos com a
 * capítols (a dalt de la pàgina es queda la demo, que s'entén més de pressa), i a la seva targeta de
 * /funcionalidades. Els fa el kit de vídeos de la demo animada (un per funcionalitat, amb veu) i
 * `scripts/exporta-videos-funcions.py` els posa a `public/assets/funcions/`:
 *   <slug>.mp4        el vídeo (1280×720)
 *   <slug>.webp       la portada (el títol, el primer que es veu)
 *   <slug>-mini.webp  la miniatura de l'índex (un moment del segon pas)
 *   <slug>.es.vtt     els subtítols de la veu
 * Si el kit torna a renderitzar un vídeo, es torna a passar el script i s'hi posen la durada i els
 * capítols nous (el script imprimeix on comença cada frase). De moment només n'hi ha en castellà: en
 * català, «Cómo funciona» es queda com era i la targeta, sense vídeo.
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
  /**
   * El segon on comença cada pas de la pàgina (`howItWorks`, en el mateix ordre): una mica abans de la
   * frase de la veu que l'explica. `null`: aquest pas no surt al vídeo.
   */
  capitols: (number | null)[];
  /** On s'acaba la veu (després hi ha el final amb el logotip) */
  fi: number;
};

type Dades = { segons: number; capitols: (number | null)[]; fi: number };

/** Els capítols surten de les frases de la veu (el script les imprimeix) i dels passos de cada pàgina */
const DADES_ES: Record<string, Dades> = {
  // la IA respon (13,0) i recomana i ofereix extres; «te avisa» i la safata, al final (29,7)
  'ia-whatsapp': { segons: 38, capitols: [2.0, 7.3, 13.0, 29.7], fi: 32.3 },
  // «Hostly comprueba» és a mitja frase de les dades (8,1); els extres (16,0) van dins del pas de la taxa
  'check-in-online': { segons: 29, capitols: [2.0, 5.7, 8.1, 11.4, 19.7], fi: 22.8 },
  // «traemos tus reservas» (5,9): l'històric
  'channel-manager': { segons: 25, capitols: [2.0, 5.9, 7.1, 16.8], fi: 21.1 },
  'gestion-de-limpiezas': { segons: 32, capitols: [2.0, 7.4, 11.7, 17.4], fi: 27.3 },
  // al vídeo es publica (17,2) abans del «decides tú» (24,0)
  'precios-dinamicos': { segons: 33, capitols: [2.0, 7.0, 24.0, 17.2], fi: 28.4 },
  'mensajeria-programada': { segons: 25, capitols: [2.0, 7.1, 11.7, 16.7], fi: 21.0 },
  'multi-rol': { segons: 25, capitols: [2.0, 7.0, 10.7], fi: 21.6 },
  // «Y sigue como todas» (la benvinguda i la neteja) no surt al vídeo
  'web-de-reservas-directas': { segons: 25, capitols: [2.0, 6.7, 12.4, null], fi: 19.5 },
  'conecta-todo': { segons: 25, capitols: [2.0, 6.7, 11.7, 16.7], fi: 20.4 },
  'finanzas': { segons: 33, capitols: [2.0, 7.5, 17.5, 25.5], fi: 27.9 },
  // «estancia por estancia» (6,0); el NRUA i l'INE (13,0) van dins del pas de l'avís
  'burocracia': { segons: 26, capitols: [2.0, 6.0, 7.7, 17.7], fi: 20.1 },
};

const durada = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

const VIDEOS: Partial<Record<Lang, Record<string, VideoFuncio>>> = {
  es: Object.fromEntries(
    Object.entries(DADES_ES).map(([slug, d]) => [
      slug,
      {
        src: `/assets/funcions/${slug}.mp4`,
        portada: `/assets/funcions/${slug}.webp`,
        miniatura: `/assets/funcions/${slug}-mini.webp`,
        subtitols: `/assets/funcions/${slug}.es.vtt`,
        idioma: 'es',
        durada: durada(d.segons),
        capitols: d.capitols,
        fi: d.fi,
      },
    ]),
  ),
};

export function videoDeLaFuncio(slug: string, lang: Lang): VideoFuncio | undefined {
  return VIDEOS[lang]?.[slug];
}

/**
 * El pas que surt al vídeo en aquest segon (el que ha començat més tard) i quant n'ha passat (0–1).
 * Abans del primer, el primer amb 0; després de la veu, l'últim, ple.
 */
export function capitolActiu(capitols: (number | null)[], t: number, fi: number): { actiu: number; part: number } {
  const inicis = capitols
    .map((s, i) => ({ s, i }))
    .filter((c): c is { s: number; i: number } => c.s !== null)
    .sort((a, b) => a.s - b.s);
  if (inicis.length === 0) return { actiu: -1, part: 0 };
  if (t < inicis[0].s) return { actiu: inicis[0].i, part: 0 };
  let k = 0;
  for (let j = 0; j < inicis.length; j++) if (t >= inicis[j].s) k = j;
  const seguent = k + 1 < inicis.length ? inicis[k + 1].s : fi;
  const part = seguent > inicis[k].s ? Math.min(1, Math.max(0, (t - inicis[k].s) / (seguent - inicis[k].s))) : 1;
  return { actiu: inicis[k].i, part };
}
