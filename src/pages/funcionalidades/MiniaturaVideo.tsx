/**
 * La miniatura d'una targeta de /funcionalidades (idea C del llenç del Biel, 17-10): un moment del vídeo
 * de la funcionalitat i la seva durada. Amb el ratolí a sobre, el vídeo es mou sense so (si la persona
 * no ha demanat menys moviment); en tocar-la, s'obre en gran i amb so (`VideoObert`). Al mòbil no hi ha
 * «a sobre»: es toca i s'obre.
 */
import { useRef, useState, type PointerEvent } from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { VideoFuncio } from '@/lib/data/videosFuncions';

interface Props {
  video: VideoFuncio;
  nom: string;
  enObrir: () => void;
}

export default function MiniaturaVideo({ video, nom, enObrir }: Props) {
  const { t } = useTranslation('funcionalidades');
  const ref = useRef<HTMLVideoElement>(null);
  const dins = useRef(false);
  const [mou, setMou] = useState(false);

  const entra = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const v = ref.current;
    if (!v) return;
    dins.current = true;
    v.muted = true;
    v.play()
      .then(() => {
        if (dins.current) setMou(true);
        else v.pause();
      })
      .catch(() => {});
  };

  const surt = () => {
    dins.current = false;
    const v = ref.current;
    if (v && !v.paused) v.pause();
    setMou(false);
  };

  return (
    <button
      type="button"
      className={`pt-ix-mini${mou ? ' mou' : ''}`}
      onClick={enObrir}
      onPointerEnter={entra}
      onPointerLeave={surt}
      aria-label={t('index.video_veure', { nom, durada: video.durada })}
    >
      <img src={video.miniatura} alt="" width={960} height={540} loading="lazy" decoding="async" />
      <video ref={ref} src={video.src} muted loop playsInline preload="none" tabIndex={-1} aria-hidden="true" />
      <span className="pt-ix-durada" aria-hidden="true">
        <Play className="pt-ic" fill="currentColor" strokeWidth={0} />
        {video.durada}
      </span>
    </button>
  );
}
