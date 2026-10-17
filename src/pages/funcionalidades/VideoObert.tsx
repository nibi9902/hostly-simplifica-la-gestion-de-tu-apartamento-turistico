/**
 * El vídeo d'una funcionalitat, en gran i amb so (idea C del llenç del Biel, 17-10): s'obre en tocar la
 * miniatura d'una targeta de /funcionalidades. Porta els controls del navegador (pausa, subtítols,
 * pantalla completa), «Empezar» i l'enllaç a la funcionalitat. Si el navegador no deixa que comenci amb
 * so, comença sense i els controls ho deixen canviar.
 */
import { useCallback } from 'react';
import * as Dialeg from '@radix-ui/react-dialog';
import { ArrowRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LangLink } from '@/i18n/LangLink';
import { useEmpezar } from '@/lib/empezar';
import type { VideoFuncio } from '@/lib/data/videosFuncions';

export type VideoAObrir = { slug: string; nom: string; video: VideoFuncio };

interface Props {
  obert: VideoAObrir | null;
  enTancar: () => void;
}

export default function VideoObert({ obert, enTancar }: Props) {
  const { t } = useTranslation('funcionalidades');
  const { t: tEmbut } = useTranslation('embut');
  const empezar = useEmpezar();

  const arrenca = useCallback((v: HTMLVideoElement | null) => {
    if (!v) return;
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, []);

  return (
    <Dialeg.Root open={Boolean(obert)} onOpenChange={(o) => { if (!o) enTancar(); }}>
      <Dialeg.Portal>
        <Dialeg.Overlay className="pt-dialeg-fons" />
        {obert && (
          <Dialeg.Content className="pt-seccio pt-dialeg pt-dialeg-video" aria-describedby={undefined}>
            <div className="pt-dv-cap">
              <Dialeg.Title className="pt-dv-titol">
                {obert.nom} <span>{obert.video.durada}</span>
              </Dialeg.Title>
              <Dialeg.Close className="pt-dv-x" aria-label={t('index.video_tancar')}>
                <X className="pt-ic" aria-hidden="true" />
              </Dialeg.Close>
            </div>
            <video ref={arrenca} src={obert.video.src} poster={obert.video.portada} controls playsInline preload="auto">
              <track kind="captions" src={obert.video.subtitols} srcLang={obert.video.idioma} label={t('page.video_subtitols')} />
            </video>
            <div className="pt-dv-peu">
              <button type="button" onClick={empezar} className="pt-pill pt-pill-pri">{tEmbut('cta')}</button>
              <LangLink to={`/funcionalidades/${obert.slug}`} className="pt-dv-mes" onClick={enTancar}>
                {t('index.video_ver_funcionalidad')} <ArrowRight className="pt-ic" aria-hidden="true" />
              </LangLink>
            </div>
          </Dialeg.Content>
        )}
      </Dialeg.Portal>
    </Dialeg.Root>
  );
}
