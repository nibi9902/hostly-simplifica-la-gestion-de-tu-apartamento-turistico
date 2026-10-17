/**
 * El vídeo de dalt de cada funcionalitat (idea A del llenç del Biel, 17-10): ocupa el lloc de la demo
 * animada, que es queda per a les que no tenen vídeo (ara, totes en català).
 * Quan es veu, es posa en marxa sol, sense so i en bucle, si la persona no ha demanat menys moviment ni
 * estalvi de dades, i no abans que la pàgina hagi acabat de carregar. «Escúchalo» el torna a començar
 * amb la veu i amb els controls del navegador (pausa, subtítols, pantalla completa); quan s'acaba, torna
 * al bucle sense so. Mentre va sol, el botó rodó l'atura: res es mou més de cinc segons sense poder-ho
 * parar.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { VideoFuncio as Video } from '@/lib/data/videosFuncions';

interface Props {
  video: Video;
  /** El nom de la funcionalitat, per al lector de pantalla */
  nom: string;
}

/** «sol»: en bucle i sense so · «so»: amb veu i controls · «quiet»: aturat */
type Mode = 'sol' | 'so' | 'quiet';

export default function VideoFuncio({ video, nom }: Props) {
  const { t } = useTranslation('funcionalidades');
  const ref = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>('quiet');
  const [progres, setProgres] = useState(0);
  const [potAnarSol, setPotAnarSol] = useState(false);
  const modeRef = useRef<Mode>('quiet');
  modeRef.current = mode;
  // l'ha aturat la persona: ja no es torna a posar en marxa sol
  const aturat = useRef(false);

  const enBucle = useCallback((v: HTMLVideoElement) => {
    v.muted = true;
    v.play().then(() => setMode('sol')).catch(() => setMode('quiet'));
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const menysMoviment = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const estalvi = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    if (menysMoviment || estalvi || !('IntersectionObserver' in window)) return;
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

  const escolta = () => {
    const v = ref.current;
    if (!v) return;
    aturat.current = false;
    v.currentTime = 0;
    v.muted = false;
    v.controls = true;
    setMode('so');
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
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
}
