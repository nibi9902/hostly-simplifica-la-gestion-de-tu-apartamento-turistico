/**
 * Els vídeos de clients de la portada (substitueixen les 9 opinions inventades).
 *
 * Decisió del Biel (09-10-2026): «les opinions seran vídeos d'ells parlant en
 * horitzontal, posem-ho i posa fotos stock de mentres per veure-ho». Els vídeos els
 * aconsegueix ell.
 *
 * ⚠️ Mentre un vídeo sigui `exemple: true`, a la targeta hi surt «Gestor N» i
 * l'etiqueta «Ejemplo». Abans de publicar a hostlylabs.com, o hi ha els vídeos de
 * debò (amb el permís de cada persona) o la secció s'amaga: una foto d'estoc
 * presentada com a client seria una opinió falsa.
 *
 * Quan arribi un vídeo: `nom`, `lloc`, `pisos`, `frase`, `video` (mp4 a /public o a
 * Storage) i `poster` (un fotograma del vídeo), i `exemple: false`.
 */
import exemple1 from "@/assets/videos-clients/exemple-1.webp";
import exemple2 from "@/assets/videos-clients/exemple-2.webp";
import exemple3 from "@/assets/videos-clients/exemple-3.webp";

export type VideoClient = {
  nom?: string;
  lloc?: string;
  pisos?: number;
  /** Una frase seva, curta, que surt sota el vídeo. */
  frase?: string;
  video?: string;
  poster: string;
  exemple: boolean;
};

// Fotos d'estoc d'Unsplash (llicència lliure), desades al web per no dependre'n.
export const VIDEOS_CLIENTS: VideoClient[] = [
  { poster: exemple1, exemple: true },
  { poster: exemple2, exemple: true },
  { poster: exemple3, exemple: true },
];

/** Si tots són exemples, la secció no s'ha de veure a producció. */
export const NOMES_EXEMPLES = VIDEOS_CLIENTS.every((v) => v.exemple);
