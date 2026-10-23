/**
 * El formulari de les landings dels anuncis (23-10-2026).
 *
 * Abans vivia a sobre del vídeo (`VideoAmbFormulari`, 18-10): al mòbil no hi cabia, el vídeo borrós feia de
 * marc i, amb el teclat obert, la pàgina saltava (el Biel, 23-10: «el formulari es queda dins del vídeo… es veu
 * molt malament»). Ara és el contingut d'una finestra que puja des de baix (al mòbil) o d'un diàleg (a
 * l'ordinador), i aquí només hi ha els camps:
 *   · nom i telèfon (el +34 ja hi és; un número d'un altre país s'escriu amb el +);
 *   · quants pisos, d'un sol toc: 1, 2, 3, 4, 5 o «6+» («Más de 5» per al lector de pantalla; amb el text
 *     sencer no hi cabien en un iPhone petit), que obre un camp. De l'1 al 5 el número és exacte, que és el
 *     que decideix a quin compte del channel manager va el client (Sympl fins a 5);
 *   · el botó, que ja diu què passa: «Ver el vídeo».
 * La comprovació de debò del telèfon (`telefonPerBD`) la fa qui el rep, just després: el vídeo s'ha de
 * començar dins del mateix toc (si no, el mòbil no el deixa sonar), i aquí només es mira que sembli un número.
 */
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import { LangLink } from "@/i18n/LangLink";
import { cn } from "@/lib/utils";
import { dadesRecordades } from "@/lib/leads";

/** El que surt del formulari: el telèfon tal com l'ha escrit (sense el +34 del davant si és d'aquí). */
export type RespostaAnunci = { nom: string; telefon: string; pisos: number };
/** El que porta escrit (encara que no l'hagi enviat): si tanca la finestra i la torna a obrir, hi és. */
export type EsborranyAnunci = { nom: string; telefon: string; tria: number | "mes"; quants: string };

const OPCIONS = [1, 2, 3, 4, 5] as const;
const PISOS_MAX = 999;

/** La comprovació ràpida, dins del toc. La bona ve just després. */
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
  /** El que s'ha escrit, dins del mateix toc del botó (vegeu la capçalera). */
  onEnvia: (r: RespostaAnunci) => void;
  /** Un error del telèfon que ha vist la comprovació de debò, després d'enviar. */
  errorTelefon?: string | null;
  /** On es guarda el que porta escrit (el té qui obre i tanca la finestra). */
  esborrany?: MutableRefObject<EsborranyAnunci | null>;
}

export default function FormulariAnunci({ onEnvia, errorTelefon, esborrany }: Props) {
  const { t } = useTranslation("home");
  const { t: tE } = useTranslation("embut");
  const base = useId();
  const id = { nom: `${base}-nom`, tel: `${base}-tel`, pisos: `${base}-pisos`, quants: `${base}-quants` };
  const recordades = useMemo(() => dadesRecordades(), []);
  const previ = esborrany?.current ?? null;
  const telRef = useRef<HTMLInputElement>(null);
  const quantsRef = useRef<HTMLInputElement>(null);
  const quantsCaixaRef = useRef<HTMLDivElement>(null);

  const [nom, setNom] = useState(previ?.nom ?? recordades.name ?? "");
  // «+34» ja hi és al davant: un número d'aquí recordat s'hi posa sense
  const [telefon, setTelefon] = useState(() => {
    if (previ) return previ.telefon;
    const p = recordades.phone;
    if (!p) return "";
    return p.startsWith("34") && p.length === 11 ? p.slice(2) : `+${p}`;
  });
  // Qui en té un no ha de tocar res; qui en va dir més de 5 un altre dia, ho troba posat
  const [tria, setTria] = useState<number | "mes">(() => {
    if (previ) return previ.tria;
    const n = recordades.pisos;
    return n && n > 5 ? "mes" : n && n >= 1 ? n : 1;
  });
  const [quants, setQuants] = useState(() => previ?.quants ?? (recordades.pisos && recordades.pisos > 5 ? String(recordades.pisos) : ""));
  useEffect(() => {
    if (esborrany) esborrany.current = { nom, telefon, tria, quants };
  }, [esborrany, nom, telefon, tria, quants]);
  const [errors, setErrors] = useState<{ nom?: string; telefon?: string; pisos?: string }>({});
  const errorTel = errors.telefon ?? errorTelefon ?? undefined;

  function envia(e: FormEvent) {
    e.preventDefault();
    const nQuants = parseInt(quants, 10);
    const nous: typeof errors = {};
    if (nom.trim().length < 2) nous.nom = tE("empezar.error.nombre");
    if (!semblaTelefon(telefon)) nous.telefon = tE("empezar.error.telefono");
    if (tria === "mes" && !(nQuants > 5 && nQuants <= PISOS_MAX)) nous.pisos = t("anunci_video.error_pisos");
    setErrors(nous);
    if (nous.nom || nous.telefon || nous.pisos) return;
    onEnvia({ nom: nom.trim(), telefon: telefon.trim(), pisos: tria === "mes" ? nQuants : tria });
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

      <fieldset className="pt-ad-camp">
        <legend id={id.pisos}>{tE("empezar.datos.pisos")}</legend>
        <div className="pt-ad-xips" role="group" aria-labelledby={id.pisos}>
          {OPCIONS.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={tria === n}
              className={cn("pt-ad-xip", tria === n && "triat")}
              onClick={() => {
                setTria(n);
                setErrors((x) => ({ ...x, pisos: undefined }));
              }}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={tria === "mes"}
            aria-label={t("anunci_video.pisos_mes")}
            className={cn("pt-ad-xip pt-ad-xip-mes", tria === "mes" && "triat")}
            onClick={() => {
              // El camp del número es destapa i s'enfoca DINS del toc: si no, l'iPhone no obre el teclat
              if (quantsCaixaRef.current) quantsCaixaRef.current.hidden = false;
              quantsRef.current?.focus();
              setTria("mes");
            }}
          >
            6+
          </button>
        </div>
        {/* sempre hi és (amagat): així es pot enfocar dins del toc de «Más de 5» */}
        <div ref={quantsCaixaRef} className="pt-ad-quants" hidden={tria !== "mes"}>
            <label htmlFor={id.quants}>{t("anunci_video.pisos_quants")}</label>
            <input
              ref={quantsRef}
              id={id.quants}
              className="pt-ad-input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              enterKeyHint="done"
              maxLength={3}
              placeholder="6"
              value={quants}
              onChange={(e) => {
                setQuants(e.target.value.replace(/\D/g, "").slice(0, 3));
                setErrors((x) => ({ ...x, pisos: undefined }));
              }}
              aria-invalid={!!errors.pisos}
              aria-describedby={errors.pisos ? `${id.quants}-error` : undefined}
            />
        </div>
        {errors.pisos && <p id={`${id.quants}-error`} className="pt-ad-error" role="alert">{errors.pisos}</p>}
      </fieldset>

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
