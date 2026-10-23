/**
 * El formulari de les landings dels anuncis (23-10-2026).
 *
 * Abans vivia a sobre del vídeo (`VideoAmbFormulari`, 18-10): al mòbil no hi cabia, el vídeo borrós feia de
 * marc i, amb el teclat obert, la pàgina saltava (el Biel, 23-10: «el formulari es queda dins del vídeo… es veu
 * molt malament»). Ara és el contingut d'una pantalla pròpia (al mòbil) o d'un diàleg (a l'ordinador), i aquí
 * només hi ha els camps:
 *   · nom i telèfon, a dalt de tot (el +34 ja hi és; un número d'un altre país s'escriu amb el +);
 *   · quants pisos: «−», el número i «+» (el Biel, 23-10: «simplement un + i un − amb el número al mig»).
 *     Comença a 1, i qui en té un no ha de tocar res. El número no s'escriu (no obre el teclat); mantenint
 *     premut el «+» o el «−», corre sol, com el selector de l'iPhone;
 *   · el botó, que ja diu què passa: «Ver el vídeo».
 * La comprovació de debò del telèfon (`telefonPerBD`) la fa qui el rep, just després: el vídeo s'ha de
 * començar dins del mateix toc (si no, el mòbil no el deixa sonar), i aquí només es mira que sembli un número.
 */
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type MutableRefObject, type PointerEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { cn } from "@/lib/utils";
import { dadesRecordades } from "@/lib/leads";

/** El que surt del formulari: el telèfon tal com l'ha escrit (sense el +34 del davant si és d'aquí). */
export type RespostaAnunci = { nom: string; telefon: string; pisos: number };
/** El que porta escrit (encara que no l'hagi enviat): si tanca la pantalla i la torna a obrir, hi és. */
export type EsborranyAnunci = { nom: string; telefon: string; pisos: number };

/** Quants pisos es poden dir (com a /empezar). */
const PISOS_MIN = 1;
const PISOS_MAX = 999;
const limita = (n: number) => Math.min(PISOS_MAX, Math.max(PISOS_MIN, n));

/** La comprovació ràpida, dins del toc. La bona ve just després. */
function semblaTelefon(s: string): boolean {
  const net = s.trim();
  const xifres = net.replace(/\D/g, "");
  if (net.startsWith("+") || net.startsWith("00")) return xifres.length >= 8 && xifres.length <= 17;
  return /^(34)?[6789]\d{8}$/.test(xifres);
}

/**
 * Un botó del «−» / «+» que, mantingut premut, repeteix: el primer pas de seguida, i després cada vegada més de
 * pressa. Amb el teclat (Enter o espai), un pas per prémer.
 */
function useRepeteix(pas: () => boolean) {
  const rellotge = useRef<number | null>(null);
  const atura = () => {
    if (rellotge.current !== null) window.clearTimeout(rellotge.current);
    rellotge.current = null;
  };
  useEffect(() => atura, []);
  return {
    onPointerDown: (e: PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      e.preventDefault(); // ni selecció de text ni el menú de mantenir premut
      atura();
      if (!pas()) return;
      let n = 0;
      const seguent = () => {
        n += 1;
        rellotge.current = pas() ? window.setTimeout(seguent, n < 6 ? 140 : 60) : null;
      };
      rellotge.current = window.setTimeout(seguent, 420);
    },
    onPointerUp: atura,
    onPointerLeave: atura,
    onPointerCancel: atura,
    onClick: (e: { detail: number }) => {
      if (e.detail === 0) pas(); // el teclat (el toc ja l'ha comptat `onPointerDown`)
    },
    onContextMenu: (e: { preventDefault: () => void }) => e.preventDefault(),
  };
}

const Play = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4.5v15l12.5-7.5z" />
  </svg>
);

interface Props {
  /** El que s'ha escrit, dins del mateix toc del botó (vegeu la capçalera). */
  onEnvia: (r: RespostaAnunci) => void;
  /** Un error del telèfon que ha vist la comprovació de debò, després d'enviar. */
  errorTelefon?: string | null;
  /** On es guarda el que porta escrit (el té qui obre i tanca la pantalla). */
  esborrany?: MutableRefObject<EsborranyAnunci | null>;
}

export default function FormulariAnunci({ onEnvia, errorTelefon, esborrany }: Props) {
  const { t } = useTranslation("home");
  const { t: tE } = useTranslation("embut");
  const base = useId();
  const id = { nom: `${base}-nom`, tel: `${base}-tel`, pisos: `${base}-pisos` };
  const recordades = useMemo(() => dadesRecordades(), []);
  const previ = esborrany?.current ?? null;
  const telRef = useRef<HTMLInputElement>(null);

  const [nom, setNom] = useState(previ?.nom ?? recordades.name ?? "");
  // «+34» ja hi és al davant: un número d'aquí recordat s'hi posa sense
  const [telefon, setTelefon] = useState(() => {
    if (previ) return previ.telefon;
    const p = recordades.phone;
    if (!p) return "";
    return p.startsWith("34") && p.length === 11 ? p.slice(2) : `+${p}`;
  });
  const [pisos, setPisos] = useState(() => limita(previ?.pisos ?? recordades.pisos ?? PISOS_MIN));
  // El valor d'ara, per al botó que repeteix (el seu rellotge no veu els canvis d'estat)
  const pisosRef = useRef(pisos);
  pisosRef.current = pisos;
  useEffect(() => {
    if (esborrany) esborrany.current = { nom, telefon, pisos };
  }, [esborrany, nom, telefon, pisos]);
  const [errors, setErrors] = useState<{ nom?: string; telefon?: string }>({});
  const errorTel = errors.telefon ?? errorTelefon ?? undefined;

  const mou = (d: number) => () => {
    const nou = limita(pisosRef.current + d);
    if (nou === pisosRef.current) return false;
    pisosRef.current = nou;
    setPisos(nou);
    return true;
  };
  const menys = useRepeteix(mou(-1));
  const mes = useRepeteix(mou(1));

  function envia(e: FormEvent) {
    e.preventDefault();
    const nous: typeof errors = {};
    if (nom.trim().length < 2) nous.nom = tE("empezar.error.nombre");
    if (!semblaTelefon(telefon)) nous.telefon = tE("empezar.error.telefono");
    setErrors(nous);
    if (nous.nom || nous.telefon) return;
    onEnvia({ nom: nom.trim(), telefon: telefon.trim(), pisos });
  }

  return (
    <form className="pt-ad-form" onSubmit={envia} noValidate>
      <div className="pt-ad-camp">
        <label htmlFor={id.nom}>{tE("empezar.datos.nombre")}</label>
        <input
          id={id.nom}
          data-primer
          className="pt-ad-input"
          type="text"
          autoComplete="given-name"
          autoCapitalize="words"
          enterKeyHint="next"
          placeholder={tE("empezar.datos.nombre_placeholder")}
          value={nom}
          onChange={(e) => {
            setNom(e.target.value);
            setErrors((x) => ({ ...x, nom: undefined }));
          }}
          // «Siguiente» del teclat: al telèfon, sense enviar
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              telRef.current?.focus();
            }
          }}
          aria-invalid={!!errors.nom}
          aria-describedby={errors.nom ? `${id.nom}-error` : undefined}
        />
        {errors.nom && <p id={`${id.nom}-error`} className="pt-ad-error" role="alert">{errors.nom}</p>}
      </div>

      <div className="pt-ad-camp">
        <label htmlFor={id.tel}>{tE("empezar.datos.telefono")}</label>
        <div className={cn("pt-ad-tel", errorTel && "amb-error")}>
          <span aria-hidden="true">+34</span>
          <input
            ref={telRef}
            id={id.tel}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            enterKeyHint="done"
            placeholder={tE("empezar.datos.telefono_placeholder")}
            value={telefon}
            onChange={(e) => {
              setTelefon(e.target.value);
              setErrors((x) => ({ ...x, telefon: undefined }));
            }}
            aria-invalid={!!errorTel}
            aria-describedby={errorTel ? `${id.tel}-error` : undefined}
          />
        </div>
        {errorTel && <p id={`${id.tel}-error`} className="pt-ad-error" role="alert">{errorTel}</p>}
      </div>

      <div className="pt-ad-camp">
        <span id={`${id.pisos}-t`} className="pt-ad-etiqueta">{tE("empezar.datos.pisos")}</span>
        <div className="pt-ad-pisos" role="group" aria-labelledby={`${id.pisos}-t`}>
          <button type="button" className="pt-ad-pas" aria-label={tE("empezar.datos.pisos_menos")} aria-disabled={pisos <= PISOS_MIN} {...menys}>
            <Minus className="pt-ic" aria-hidden="true" />
          </button>
          <output id={id.pisos} className="pt-ad-num" aria-live="polite">
            {pisos}
          </output>
          <button type="button" className="pt-ad-pas" aria-label={tE("empezar.datos.pisos_mas")} aria-disabled={pisos >= PISOS_MAX} {...mes}>
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
  );
}
