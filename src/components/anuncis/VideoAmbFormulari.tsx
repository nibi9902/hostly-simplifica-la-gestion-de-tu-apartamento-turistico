/**
 * El vídeo de les landings dels anuncis, amb el formulari a dins (18-10-2026).
 *
 * És la B del llenç «Landings dels anuncis», amb el que hi va canviar el Biel: «quan li donin, que surti
 * el play, i quan pitxin el play, que surti el formulari; si no, la gent se n'anirà de primeres». Tres
 * moments del mateix vídeo:
 *   1. net, amb el play gran;
 *   2. en prémer el play, creix i el formulari surt a sobre (nom, telèfon i quants pisos; els pisos
 *      comencen a 1, i qui en té un no ha de tocar res), amb el vídeo en marxa per sota, borrós i mut;
 *   3. en enviar-lo, el vídeo es destapa i torna a començar amb so i amb els controls del navegador.
 *      Comença dins del mateix clic (la comprovació bona del telèfon i el desat van just després): si
 *      no, el navegador del mòbil no el deixa sonar.
 * La creu torna al play. Quan el vídeo s'acaba, surt a sobre el pas següent (`final`).
 *
 * El contacte es desa com el pas 1 de /empezar, amb el pla de la pàgina: `web_lead_desa` avisa el Biel
 * per Telegram (nom, telèfon, pla, pisos i, a «Ve de», l'adreça de la landing) i als anuncis compta com
 * a «Lead» (`empezar_datos`). Prémer el play ja és «VerVideo»: serveix per tornar a ensenyar l'anunci a
 * qui el va prémer i no va deixar les dades.
 */
import {
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { Minus, Plus, RotateCcw, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { useLang } from "@/i18n/useLang";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { dadesRecordades, desaLead, precarregaTelefon, recordaDades, telefonPerBD, type PlaLead } from "@/lib/leads";

export type VideoAnunci = { src: string; portada: string; subtitols: string; idioma: string; durada: string };
/** El que ha deixat: el nom, el telèfon tal com es desa (`34612345678`) i quants pisos gestiona. */
export type DadesAnunci = { nom: string; telefon: string; pisos: number };
/** `obre()`: el que fa el play, des d'un altre botó de la pàgina (el del final). */
export type ReproductorAnunci = { obre: () => void };

type Fase = "play" | "form" | "obert";

/** Quants pisos es poden dir (com a /empezar). */
const PISOS_MIN = 1;
const PISOS_MAX = 999;
/** L'aire entre la targeta del formulari i la vora del vídeo. */
const MARGE = 12;

/** La comprovació ràpida, dins del clic. La bona (`telefonPerBD`) ve just després. */
function semblaTelefon(s: string): boolean {
  const net = s.trim();
  const xifres = net.replace(/\D/g, "");
  if (net.startsWith("+") || net.startsWith("00")) return xifres.length >= 8 && xifres.length <= 17;
  return /^(34)?[6789]\d{8}$/.test(xifres);
}

const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4.5v15l12.5-7.5z" />
  </svg>
);

interface Props {
  video: VideoAnunci;
  /** El pla que es desa amb el contacte: el de la pàgina. */
  pla: PlaLead;
  /** D'on ve, per als esdeveniments i els identificadors: «anunci-checkin», «anunci-completo». */
  lloc: string;
  /** El títol de la targeta: «Míralo en 29 segundos». */
  titol: string;
  /** Què és el vídeo, per al lector de pantalla. */
  ariaVideo: string;
  /** Ja l'ha obert: la pàgina hi posa a sota el pas següent. */
  enObrir: (d: DadesAnunci) => void;
  /** El que surt a sobre del vídeo quan s'acaba. */
  final: ReactNode;
}

const VideoAmbFormulari = forwardRef<ReproductorAnunci, Props>(function VideoAmbFormulari(
  { video, pla, lloc, titol, ariaVideo, enObrir, final },
  mana,
) {
  const { t } = useTranslation("home");
  const { t: tE } = useTranslation("embut");
  const { lang } = useLang();
  const reduir = useReducedMotion();
  const recordades = useMemo(() => dadesRecordades(), []);

  const [fase, setFase] = useState<Fase>("play");
  const [nom, setNom] = useState(recordades.name ?? "");
  // «+34» ja hi és al davant: un número d'aquí recordat s'hi posa sense
  const [telefon, setTelefon] = useState(() => {
    const p = recordades.phone;
    if (!p) return "";
    return p.startsWith("34") && p.length === 11 ? p.slice(2) : `+${p}`;
  });
  // Es pot escriure o canviar amb − i +; en sortir del camp, es posa entre 1 i 999
  const [pisos, setPisos] = useState(String(recordades.pisos ?? PISOS_MIN));
  const nPisos = Math.min(PISOS_MAX, Math.max(PISOS_MIN, parseInt(pisos, 10) || PISOS_MIN));
  const posaPisos = (n: number) => setPisos(String(Math.min(PISOS_MAX, Math.max(PISOS_MIN, n))));
  const [errors, setErrors] = useState<{ nom?: string; telefon?: string }>({});
  const [acabat, setAcabat] = useState(false);
  const [alcadaForm, setAlcadaForm] = useState(0);

  const escRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cartaRef = useRef<HTMLFormElement>(null);
  const titolRef = useRef<HTMLHeadingElement>(null);
  const playRef = useRef<HTMLButtonElement>(null);

  const id = { titol: `${lloc}-titol`, nom: `${lloc}-nom`, tel: `${lloc}-tel`, pisos: `${lloc}-pisos` };

  // Amb el formulari obert, el vídeo fa l'alçada de la targeta (la base, el 16:9, la posa el CSS).
  // Es torna a mesurar si surt un error o si canvia l'amplada.
  useLayoutEffect(() => {
    if (fase !== "form") return;
    const mesura = () => setAlcadaForm((cartaRef.current?.offsetHeight ?? 0) + 2 * MARGE);
    mesura();
    window.addEventListener("resize", mesura);
    return () => window.removeEventListener("resize", mesura);
  }, [fase, errors]);

  function obre() {
    if (fase !== "play") return;
    setErrors({});
    setFase("form");
    precarregaTelefon();
    track("video_play", { location: lloc, variant: "formulari" });
    // Per sota del formulari, el vídeo en marxa (borrós i sense so), si no s'ha demanat menys moviment
    const v = videoRef.current;
    if (v && !reduir) {
      v.muted = true;
      v.loop = true;
      v.play().catch(() => {});
    }
    requestAnimationFrame(() => titolRef.current?.focus({ preventScroll: true }));
  }

  useImperativeHandle(mana, () => ({
    obre: () => {
      escRef.current?.scrollIntoView({ behavior: reduir ? "auto" : "smooth", block: "center" });
      obre();
    },
  }));

  function tanca() {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.loop = false;
      v.load(); // torna a ensenyar la portada
    }
    setErrors({});
    setFase("play");
    requestAnimationFrame(() => playRef.current?.focus({ preventScroll: true }));
  }

  // Dins del mateix clic: si no, el navegador del mòbil no deixa que soni
  function destapa() {
    const v = videoRef.current;
    if (v) {
      v.loop = false;
      v.currentTime = 0;
      v.muted = false;
      v.controls = true;
      v.play().catch(() => {
        v.muted = true;
        v.play().catch(() => {});
      });
    }
    setAcabat(false);
    setFase("obert");
  }

  async function desa() {
    const tel = await telefonPerBD(telefon);
    if (!tel) {
      // La comprovació bona no l'accepta: es torna al formulari, amb el vídeo aturat i sense so
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.controls = false;
        v.muted = true;
      }
      setFase("form");
      setErrors({ telefon: tE("empezar.error.telefono") });
      return;
    }
    const d: DadesAnunci = { nom: nom.trim(), telefon: tel, pisos: nPisos };
    recordaDades({ phone: tel, name: d.nom, pisos: d.pisos });
    enObrir(d);
    const r = await desaLead({ phone: tel, name: d.nom, source: "empezar", plan: pla, answers: { pisos: d.pisos } }, lang);
    if (r.ok) track("empezar_datos", { location: lloc });
  }

  function envia(e: FormEvent) {
    e.preventDefault();
    const nous: typeof errors = {};
    if (nom.trim().length < 2) nous.nom = tE("empezar.error.nombre");
    if (!semblaTelefon(telefon)) nous.telefon = tE("empezar.error.telefono");
    setErrors(nous);
    if (nous.nom || nous.telefon) return;
    destapa();
    void desa();
  }

  function torna() {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    setAcabat(false);
  }

  return (
    <div
      ref={escRef}
      className={cn("pt-ad-video", fase !== "play" && fase)}
      style={{ "--alcada-form": `${alcadaForm}px` } as CSSProperties}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.portada}
        preload="none"
        playsInline
        aria-label={ariaVideo}
        onEnded={() => fase === "obert" && setAcabat(true)}
      >
        <track kind="captions" src={video.subtitols} srcLang={video.idioma} label={t("anunci_video.subtitols")} />
      </video>

      <button ref={playRef} type="button" className="pt-ad-play" onClick={obre} aria-label={t("anunci_video.play_aria", { durada: video.durada })}>
        {/* a baix, perquè no tapi el títol de la portada del vídeo */}
        <span className="pt-ad-play-pindola">
          <i><Play /></i>
          {t("anunci_video.play")} <small>{video.durada}</small>
        </span>
      </button>

      <form ref={cartaRef} className="pt-ad-carta" onSubmit={envia} noValidate aria-labelledby={id.titol}>
        <div className="pt-ad-carta-cap">
          <h2 ref={titolRef} id={id.titol} className="pt-ad-carta-t" tabIndex={-1}>{titol}</h2>
          <button type="button" className="pt-ad-tanca" onClick={tanca} aria-label={t("anunci_video.tancar")}>
            <X className="pt-ic" aria-hidden="true" />
          </button>
        </div>

        <div className="pt-ad-camp">
          <label htmlFor={id.nom}>{tE("empezar.datos.nombre")}</label>
          <input
            id={id.nom}
            className="pt-ad-input"
            type="text"
            autoComplete="given-name"
            placeholder={tE("empezar.datos.nombre_placeholder")}
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              setErrors((x) => ({ ...x, nom: undefined }));
            }}
            aria-invalid={!!errors.nom}
            aria-describedby={errors.nom ? `${id.nom}-error` : undefined}
          />
          {errors.nom && <p id={`${id.nom}-error`} className="pt-ad-error" role="alert">{errors.nom}</p>}
        </div>

        <div className="pt-ad-camp">
          <label htmlFor={id.tel}>{tE("empezar.datos.telefono")}</label>
          <div className={cn("pt-ad-tel", errors.telefon && "amb-error")}>
            <span aria-hidden="true">+34</span>
            <input
              id={id.tel}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={tE("empezar.datos.telefono_placeholder")}
              value={telefon}
              onChange={(e) => {
                setTelefon(e.target.value);
                setErrors((x) => ({ ...x, telefon: undefined }));
              }}
              aria-invalid={!!errors.telefon}
              aria-describedby={errors.telefon ? `${id.tel}-error` : undefined}
            />
          </div>
          {errors.telefon && <p id={`${id.tel}-error`} className="pt-ad-error" role="alert">{errors.telefon}</p>}
        </div>

        <div className="pt-ad-camp">
          <label htmlFor={id.pisos}>{tE("empezar.datos.pisos")}</label>
          <div className="pt-ad-pisos">
            <button
              type="button"
              onClick={() => posaPisos(nPisos - 1)}
              disabled={nPisos <= PISOS_MIN}
              aria-label={tE("empezar.datos.pisos_menos")}
              aria-controls={id.pisos}
            >
              <Minus className="pt-ic" aria-hidden="true" />
            </button>
            <input
              id={id.pisos}
              className="pt-ad-input"
              type="number"
              inputMode="numeric"
              min={PISOS_MIN}
              max={PISOS_MAX}
              value={pisos}
              onChange={(e) => setPisos(e.target.value)}
              onBlur={() => posaPisos(nPisos)}
            />
            <button
              type="button"
              onClick={() => posaPisos(nPisos + 1)}
              disabled={nPisos >= PISOS_MAX}
              aria-label={tE("empezar.datos.pisos_mas")}
              aria-controls={id.pisos}
            >
              <Plus className="pt-ic" aria-hidden="true" />
            </button>
          </div>
        </div>

        <button type="submit" className="pt-pill pt-pill-pri pt-ad-enviar">
          <Play />
          {t("anunci_video.veure")}
        </button>
        <p className="pt-ad-privacitat">
          {tE("empezar.datos.privacidad_antes")} <LangLink to="/privacidad">{tE("empezar.datos.privacidad_link")}</LangLink>.
        </p>
      </form>

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
  );
});

export default VideoAmbFormulari;
