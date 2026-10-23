/**
 * El vídeo de les landings dels anuncis, amb el formulari per veure'l (18-10-2026; refet el 23-10-2026).
 *
 * El 18-10 era la B del llenç «Landings dels anuncis»: el play i, en prémer-lo, el formulari a sobre del vídeo,
 * que creixia per fer-hi lloc. Al mòbil no funcionava (el Biel, 23-10: «la pàgina sola va cap avall… el
 * formulari es queda dins del vídeo… es veu molt malament»): el formulari no hi cabia, el vídeo borrós feia de
 * marc i, amb el teclat obert, la caixa creixia i s'encongia i la pàgina saltava. Ara:
 *   1. el vídeo, quiet, amb el play (al mòbil d'una vora a l'altra de la pantalla);
 *   2. en prémer el play, el formulari surt en una pantalla sencera al mòbil (amb el nom i el telèfon a dalt, on
 *      el teclat no els tapa; es tanca amb la creu o amb el gest d'enrere del mòbil) i en un diàleg al mig a
 *      l'ordinador. La pàgina de sota no es mou;
 *   3. en enviar, la finestra es tanca i el vídeo comença amb so DINS del mateix toc (si no, el mòbil no el deixa
 *      sonar): al mòbil, a pantalla completa (l'iPhone el posa sol si no és «playsinline»; l'Android, amb
 *      `requestFullscreen`), perquè les pantalles de l'app es llegeixin girant el mòbil. Quan s'acaba, se'n surt
 *      i a sobre del vídeo hi ha el pas següent, amb el seu botó: al mòbil, el bloc de sota queda fora de la
 *      pantalla i una pregunta sense botó obligava a buscar-lo.
 * La comprovació bona del telèfon i el desat van just després d'arrencar el vídeo; si el telèfon no és bo, el
 * vídeo s'atura i la finestra torna a sortir amb l'error i el que ja havia escrit.
 *
 * El contacte es desa com el pas 1 de /empezar, amb el pla de la pàgina: `web_lead_desa` avisa el Biel per
 * Telegram i als anuncis compta com a «Lead» (`empezar_datos`). Prémer el play ja és «VerVideo».
 */
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RotateCcw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/i18n/useLang";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { desaLead, precarregaTelefon, recordaDades, telefonPerBD, type PlaLead } from "@/lib/leads";
import FormulariAnunci, { type EsborranyAnunci, type RespostaAnunci } from "./FormulariAnunci";

export type VideoAnunci = { src: string; portada: string; subtitols: string; idioma: string; durada: string };
/** El que ha deixat: el nom, el telèfon tal com es desa (`34612345678`) i quants pisos gestiona. */
export type DadesAnunci = { nom: string; telefon: string; pisos: number };
/** `obre()`: el que fa el play, des d'un altre botó de la pàgina (el del final). */
export type ReproductorAnunci = { obre: () => void };

type Fase = "play" | "obert";

const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4.5v15l12.5-7.5z" />
  </svg>
);

/** Mateix tall que el CSS (i que `useIsMobile`): per sota de 768 px és el mòbil. */
const esMobil = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
/** iPhone i iPad (l'iPad es presenta com un Mac amb pantalla tàctil). */
const esIOS = () =>
  typeof navigator !== "undefined" &&
  (/iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

type VideoIOS = HTMLVideoElement & { webkitDisplayingFullscreen?: boolean; webkitExitFullscreen?: () => void };

function surtDePantallaCompleta(v: HTMLVideoElement | null) {
  const vi = v as VideoIOS | null;
  try {
    if (vi?.webkitDisplayingFullscreen) vi.webkitExitFullscreen?.();
    else if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  } catch {
    /* ja n'havia sortit */
  }
}

interface Props {
  video: VideoAnunci;
  /** El pla que es desa amb el contacte: el de la pàgina. */
  pla: PlaLead;
  /** D'on ve, per als esdeveniments i els identificadors: «anunci-checkin», «anunci-completo». */
  lloc: string;
  /** El títol de la finestra del formulari: «Míralo en 29 segundos». */
  titol: string;
  /** Què és el vídeo, per al lector de pantalla. */
  ariaVideo: string;
  /** Ja l'ha obert: la pàgina hi posa a sota el pas següent. */
  enObrir: (d: DadesAnunci) => void;
  /** El que surt a sobre del vídeo quan s'acaba: una frase i el botó del pas següent (el mateix que a sota). */
  final: ReactNode;
}

/**
 * On surt el formulari: al mòbil, una pantalla sencera amb el nom i el telèfon a dalt de tot; a l'ordinador, un
 * diàleg al mig. Es pinta en un portal, fora de la pàgina: porta `pt-seccio` perquè hi arribin els colors i la
 * lletra del web.
 * Al mòbil, abans (23-10, matí) era una finestra que pujava des de baix (`vaul`), i a l'iPhone de debò, en tocar
 * el nom o el telèfon, la pantalla baixava molt (el Biel: «queda super malament»): el teclat tapava els camps,
 * l'iPhone movia la pàgina per ensenyar-los i la finestra es recol·locava alhora. Amb els camps a dalt, el teclat
 * surt per sota i no cal moure res. A dalt de tot, la portada del vídeo en petit i el títol.
 */
function Finestra({
  mobil,
  obert,
  onCanvi,
  titol,
  portada,
  tancar,
  children,
}: {
  mobil: boolean;
  obert: boolean;
  onCanvi: (v: boolean) => void;
  titol: string;
  /** La portada del vídeo: surt petita al costat del títol (és el que veurà). */
  portada: string;
  tancar: string;
  children: ReactNode;
}) {
  // A l'ordinador, el cursor al nom (el més ràpid); al mòbil no: el teclat s'obre quan toca el camp
  const enfocaElNom = (e: Event) => {
    e.preventDefault();
    if (!mobil) (document.querySelector(".pt-ad-finestra [data-primer]") as HTMLElement | null)?.focus();
  };
  // En tancar-se, el focus no torna al play (ja no hi és si el vídeo s'ha obert) ni mou la pàgina
  const quiet = (e: Event) => e.preventDefault();
  return (
    <Dialog.Root open={obert} onOpenChange={onCanvi}>
      <Dialog.Portal>
        {!mobil && <Dialog.Overlay className="pt-ad-fosc" />}
        <Dialog.Content
          className={cn("pt-seccio pt-ad-finestra", mobil ? "pt-ad-pantalla" : "pt-ad-modal")}
          aria-describedby={undefined}
          onOpenAutoFocus={enfocaElNom}
          onCloseAutoFocus={quiet}
        >
          <div className="pt-ad-finestra-cap">
            <span className="pt-ad-miniatura" aria-hidden="true">
              <img src={portada} alt="" width={76} height={43} decoding="async" />
              <i>
                <Play />
              </i>
            </span>
            <Dialog.Title className="pt-ad-finestra-t">{titol}</Dialog.Title>
            <Dialog.Close className="pt-ad-tanca" aria-label={tancar}>
              <X className="pt-ic" aria-hidden="true" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const VideoAmbFormulari = forwardRef<ReproductorAnunci, Props>(function VideoAmbFormulari(
  { video, pla, lloc, titol, ariaVideo, enObrir, final },
  mana,
) {
  const { t } = useTranslation("home");
  const { t: tE } = useTranslation("embut");
  const { lang } = useLang();
  const mobil = useIsMobile();

  const [fase, setFase] = useState<Fase>("play");
  const [obert, setObert] = useState(false);
  const [acabat, setAcabat] = useState(false);
  const [errorTel, setErrorTel] = useState<string | null>(null);
  // El que ha escrit, perquè no es perdi si tanca la finestra o si torna amb un error
  const esborrany = useRef<EsborranyAnunci | null>(null);

  const escRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* El gest d'enrere del mòbil (i el botó del navegador) tanca la finestra en lloc de sortir de la pàgina: en
     obrir-la es posa una entrada a l'historial (la mateixa adreça i el mateix estat del router) i, si es tanca
     d'una altra manera, es treu. */
  useEffect(() => {
    if (!obert) return;
    window.history.pushState({ ...(window.history.state ?? {}), hostlyFinestraAnunci: true }, "");
    let perEnrere = false;
    const enrere = () => {
      perEnrere = true;
      setObert(false);
    };
    window.addEventListener("popstate", enrere);
    return () => {
      window.removeEventListener("popstate", enrere);
      if (!perEnrere && window.history.state?.hostlyFinestraAnunci) window.history.back();
    };
  }, [obert]);

  const obre = useCallback(() => {
    if (fase !== "play") return;
    setErrorTel(null);
    setObert(true);
    precarregaTelefon();
    track("video_play", { location: lloc, variant: "formulari" });
    // Mentre escriu, el vídeo es va carregant (sense reproduir-se): en enviar, comença de seguida
    const v = videoRef.current;
    if (v && v.preload !== "auto") {
      v.preload = "auto";
      v.load();
    }
  }, [fase, lloc]);

  useImperativeHandle(mana, () => ({
    obre: () => {
      // Primer, el vídeo a la vista (de cop: la finestra bloqueja l'scroll mentre és oberta)
      escRef.current?.scrollIntoView({ block: "center" });
      obre();
    },
  }));

  // Dins del mateix toc del botó: si no, el mòbil no deixa que soni ni que es posi a pantalla completa
  function arrenca() {
    const v = videoRef.current;
    if (!v) return;
    const mob = esMobil();
    const ios = esIOS();
    v.currentTime = 0;
    v.muted = false;
    v.controls = true;
    // L'iPhone (també dins d'Instagram) posa a pantalla completa el vídeo que no és «playsinline»
    if (mob && ios) v.playsInline = false;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    if (mob && !ios && v.requestFullscreen) v.requestFullscreen().catch(() => {});
  }

  async function desa(r: RespostaAnunci) {
    const tel = await telefonPerBD(r.telefon);
    if (!tel) {
      // La comprovació bona no l'accepta: s'atura el vídeo i la finestra torna amb l'error
      const v = videoRef.current;
      surtDePantallaCompleta(v);
      if (v) {
        v.pause();
        v.controls = false;
        v.playsInline = true;
      }
      setFase("play");
      setErrorTel(tE("empezar.error.telefono"));
      setObert(true);
      return;
    }
    const d: DadesAnunci = { nom: r.nom, telefon: tel, pisos: r.pisos };
    recordaDades({ phone: tel, name: d.nom, pisos: d.pisos });
    enObrir(d);
    const resultat = await desaLead({ phone: tel, name: d.nom, source: "empezar", plan: pla, answers: { pisos: d.pisos } }, lang);
    if (resultat.ok) track("empezar_datos", { location: lloc });
  }

  function envia(r: RespostaAnunci) {
    arrenca();
    setErrorTel(null);
    setAcabat(false);
    setFase("obert");
    setObert(false);
    void desa(r);
  }

  function torna() {
    setAcabat(false);
    arrenca();
  }

  return (
    <>
      <div ref={escRef} className={cn("pt-ad-video", fase === "obert" && "obert")} data-amplada="vora">
        <video
          ref={videoRef}
          src={video.src}
          poster={video.portada}
          preload="none"
          playsInline
          aria-label={ariaVideo}
          onEnded={() => {
            if (fase !== "obert") return;
            setAcabat(true);
            surtDePantallaCompleta(videoRef.current);
          }}
          onPlay={() => setAcabat(false)}
        >
          <track kind="captions" src={video.subtitols} srcLang={video.idioma} label={t("anunci_video.subtitols")} />
        </video>

        {fase === "play" && (
          <button type="button" className="pt-ad-play" onClick={obre} aria-label={t("anunci_video.play_aria", { durada: video.durada })}>
            {/* a baix, perquè no tapi el títol de la portada del vídeo */}
            <span className="pt-ad-play-pindola">
              <i><Play /></i>
              {t("anunci_video.play")} <small>{video.durada}</small>
            </span>
          </button>
        )}

        {fase === "obert" && acabat && (
          <div className="pt-ad-fi">
            {final}
            <button type="button" className="pt-ad-fi-torna" onClick={torna}>
              <RotateCcw className="pt-ic" aria-hidden="true" />
              {t("anunci_video.tornar")}
            </button>
          </div>
        )}
      </div>

      <Finestra mobil={mobil} obert={obert} onCanvi={setObert} titol={titol} portada={video.portada} tancar={t("anunci_video.tancar")}>
        <FormulariAnunci onEnvia={envia} errorTelefon={errorTel} esborrany={esborrany} />
      </Finestra>
    </>
  );
});

export default VideoAmbFormulari;
