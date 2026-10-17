/**
 * «Cómo funciona» amb el vídeo de la funcionalitat (idea B del llenç, 17-10). El Biel: la demo a dalt,
 * «que s'entén molt més ràpid», i aquí el vídeo, «per si volen».
 * A l'ordinador, el vídeo a l'esquerra i els passos de la pàgina a la dreta, com a capítols: el pas que
 * surt al vídeo s'obre i avança, i si en toques un, el vídeo hi salta. A la tauleta, el vídeo a dalt i
 * els passos a sota. Al mòbil, el vídeo a dalt i els passos en targetes que llisquen soles al compàs del
 * vídeo, tret que la persona les acabi de tocar. Un pas que no surt al vídeo (`capitols` amb `null`)
 * s'obre en tocar-lo, sense moure el vídeo.
 */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Feature } from '@/lib/data/features';
import { capitolActiu, type VideoFuncio as Video } from '@/lib/data/videosFuncions';
import PuntsLliscador from '@/components/portada/PuntsLliscador';
import { useEsTira, useLliscador } from '@/components/portada/useLliscador';
import VideoFuncio, { type Reproductor } from './VideoFuncio';

interface Props {
  feature: Feature;
  video: Video;
}

export default function PassosVideo({ feature, video }: Props) {
  const { t } = useTranslation('funcionalidades');
  const reproductor = useRef<Reproductor>(null);
  const [segon, setSegon] = useState(0);
  const [obert, setObert] = useState<number | null>(null);
  const { ref, pas, vesA, enLliscar } = useLliscador<HTMLOListElement>();
  const tira = useEsTira();
  const tocat = useRef(0);
  const total = feature.howItWorks.length;
  const { actiu, part } = capitolActiu(video.capitols, segon, video.fi);
  const davant = obert ?? actiu;

  // Quan el vídeo passa a un altre pas, es tanca el que s'havia obert a mà i, al mòbil, la tira el segueix
  useEffect(() => {
    setObert(null);
    if (tira && actiu >= 0 && Date.now() - tocat.current > 4000) vesA(actiu);
  }, [actiu, tira, vesA]);

  return (
    <div className="pt-pv">
      <VideoFuncio ref={reproductor} video={video} nom={feature.name} onTemps={setSegon} />
      <ol
        ref={ref}
        className="pt-pv-passos pt-llisca"
        onScroll={enLliscar}
        onPointerDown={() => { tocat.current = Date.now(); }}
      >
        {feature.howItWorks.map((step, i) => {
          const inici = video.capitols[i] ?? null;
          const ara = i === davant;
          const tria = () => {
            if (inici === null) {
              setObert(i);
              return;
            }
            setObert(null);
            reproductor.current?.salta(inici);
          };
          return (
            // tota la peça es pot tocar; amb el teclat, el botó del títol
            <li key={step.step} className={`pt-pv-pas${ara ? ' ara' : ''}`} onClick={tria}>
              <span className="pt-pv-num" aria-hidden="true">{String(step.step).padStart(2, '0')}</span>
              <div className="pt-pv-cos">
                <p className="pt-pv-pasde" aria-hidden="true">{t('page.step_of', { n: step.step, total })}</p>
                <h3>
                  <button type="button" aria-current={ara ? 'step' : undefined} onClick={(e) => { e.stopPropagation(); tria(); }}>
                    {step.title}
                  </button>
                </h3>
                <div className="pt-pv-text"><div><p>{step.body}</p></div></div>
              </div>
              {inici !== null && (
                <span className="pt-pv-barra" aria-hidden="true">
                  <i style={{ transform: `scaleX(${i === actiu ? part : 0})` }} />
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <PuntsLliscador n={total} pas={pas} vesA={vesA} />
    </div>
  );
}
