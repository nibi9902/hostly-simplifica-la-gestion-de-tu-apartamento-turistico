/**
 * El reproductor del vídeo d'una funcionalitat (17-10): el fa servir «Cómo funciona» (`PassosVideo`),
 * on els passos de la pàgina són els capítols del vídeo.
 * Quan es veu, es posa en marxa sol, sense so i en bucle, si la persona no ha demanat menys moviment ni
 * estalvi de dades, i no abans que la pàgina hagi acabat de carregar. «Escúchalo» el torna a començar
 * amb la veu i amb els controls del navegador (pausa, subtítols, pantalla completa); quan s'acaba, torna
 * al bucle sense so. Mentre va sol, el botó rodó l'atura: res es mou més de cinc segons sense poder-ho
 * parar. `salta(segon)` el porta a un capítol.
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { VideoFuncio as Video } from '@/lib/data/videosFuncions';

interface Props {
  video: Video;
  /** El nom de la funcionalitat, per al lector de pantalla */
  nom: string;
  /** Cada vegada que avança (uns quatre cops per segon) */
  onTemps?: (segon: number) => void;
}

export type Reproductor = { salta: (segon: number) => void };

/** «sol»: en bucle i sense so · «so»: amb veu i controls · «quiet»: aturat */
type Mode = 'sol' | 'so' | 'quiet';

const VideoFuncio = forwardRef<Reproductor, Props>(function VideoFuncio({ video, nom, onTemps }, mana) {
  const { t } = useTranslation('funcionalidades');
  const ref = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>('quiet');
  const [progres, setProgres] = useState(0);
  const [potAnarSol, setPotAnarSol] = useState(false);
  const modeRef = useRef<Mode>('quiet');
  modeRef.current = mode;
  const potAnarSolRef = useRef(false);
  // l'ha aturat la persona: ja no es torna a posar en marxa sol
  const aturat = useRef(false);

  const enBucle = useCallback((v: HTMLVideoElement) => {
    v.muted = true;
    v.play().then(() => setMode('sol')).catch(() => setMode('quiet'));
  }, []);

  const ambSo = useCallback((v: HTMLVideoElement) => {
    aturat.current = false;
    v.muted = false;
    v.controls = true;
    setMode('so');
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const menysMoviment = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const estalvi = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (menysMoviment || estalvi || !('IntersectionObserver' in window)) return;
    potAnarSolRef.current = true;
    setPotAnarSol(true);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (modeRef.current === 'quiet' && !aturat.current) enBucle(v);
        } else if (!v.paused) {
          v.pause();
          if (modeRef.current === 'sol') setMode('quiet');
        }
      },
      { threshold: 0.35 },
    );
    // el vídeo no ha de competir amb la càrrega de la pàgina
    const comenca = () => io.observe(v);
    if (document.readyState === 'complete') comenca();
    else window.addEventListener('load', comenca, { once: true });
    return () => {
      window.removeEventListener('load', comenca);
      io.disconnect();
    };
  }, [enBucle]);

  useImperativeHandle(
    mana,
    () => ({
      salta: (segon: number) => {
        const v = ref.current;
        if (!v) return;
        v.currentTime = segon;
        aturat.current = false;
        if (modeRef.current === 'so') v.play().catch(() => {});
        else if (potAnarSolRef.current) enBucle(v);
        else ambSo(v);
      },
    }),
    [enBucle, ambSo],
  );

  const escolta = () => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    ambSo(v);
  };

  const pausa = () => {
    const v = ref.current;
    if (!v) return;
    if (mode === 'sol') {
      v.pause();
      aturat.current = true;
      setMode('quiet');
    } else {
      aturat.current = false;
      enBucle(v);
    }
  };

  const enAcabar = () => {
    const v = ref.current;
    if (!v) return;
    v.controls = false;
    v.currentTime = 0;
    if (potAnarSol && !aturat.current) enBucle(v);
    else {
      v.muted = true;
      setMode('quiet');
    }
  };

  const enTemps = () => {
    const v = ref.current;
    if (!v || !v.duration) return;
    onTemps?.(v.currentTime);
    const p = v.currentTime / v.duration;
    setProgres((ant) => (Math.abs(p - ant) > 0.004 ? p : ant));
  };

  return (
    <div className="pt-fv">
      <video
        ref={ref}
        src={video.src}
        poster={video.portada}
        preload="none"
        muted
        playsInline
        aria-label={t('page.video_aria', { nom })}
        onTimeUpdate={enTemps}
        onEnded={enAcabar}
      >
        <track kind="captions" src={video.subtitols} srcLang={video.idioma} label={t('page.video_subtitols')} />
      </video>
      {mode !== 'so' && (
        <>
          <button type="button" className="pt-fv-so" onClick={escolta}>
            {potAnarSol ? <Volume2 className="pt-ic" aria-hidden="true" /> : <Play className="pt-ic" aria-hidden="true" />}
            <span>{potAnarSol ? t('page.video_escuchalo') : t('page.video_ver')}</span>
            <small>{video.durada}</small>
          </button>
          {(mode === 'sol' || aturat.current) && (
            <button
              type="button"
              className="pt-fv-pausa"
              onClick={pausa}
              aria-label={mode === 'sol' ? t('page.video_pausa') : t('page.video_play')}
            >
              {mode === 'sol' ? <Pause className="pt-ic" aria-hidden="true" /> : <Play className="pt-ic" aria-hidden="true" />}
            </button>
          )}
          <span className="pt-fv-barra" aria-hidden="true">
            <i style={{ transform: `scaleX(${progres})` }} />
          </span>
        </>
      )}
    </div>
  );
});

export default VideoFuncio;
