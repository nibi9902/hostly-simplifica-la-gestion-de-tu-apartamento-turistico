/**
 * «0 € en Hostly. Para siempre.» Va just després del lema: és la franja de l'entrada d'abans
 * (CinematicHero), refeta a l'estil de la portada nova. Decisions del Biel (13-10-2026); els mockups
 * són a docs/exploracions/2026-10-11-web-estil-b/ (zero-*.html i el README):
 *  - la targeta fosca (la 3B): el 0 € sol a l'esquerra i, a la dreta, «Otras apps te lo cobran cada
 *    mes.» amb el preu de les altres al costat, ratllat. «Hasta 95 € al año» és el pla més car que tenim
 *    documentat (7,95 € al mes per pis). Cap nom de competidor ni nombre de pisos, i fora «es nuestra
 *    forma de darnos a conocer»;
 *  - a sota, les xifres i la cinta de logotips (la 4B): passen a poc a poc, sense parar i amb el tic,
 *    sense el nom a sota (surt si hi passes el ratolí, que també atura la cinta). SES.Hospedajes en lloc
 *    de la policía.
 * Sense animació d'entrada (el Biel, 13-10: «no m'agrada que porti animació»): abans la targeta
 * apareixia, el preu es ratllava, el 0 € es desenfocava i les xifres comptaven. Només es mou la cinta;
 * amb «reduir moviment», tampoc.
 */
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { LangLink } from "@/i18n/LangLink";
import airbnb from "@/assets/connexions/airbnb.webp";
import booking from "@/assets/connexions/booking.webp";
import whatsapp from "@/assets/connexions/whatsapp.webp";
import ses from "@/assets/connexions/ses-hospedajes.webp";

/** 7983 → «7.983», com a la franja d'abans (en castellà, Intl no posa el punt als nombres de quatre xifres). */
const punts = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

function Google() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

/** El logotip de Stripe (Wikimedia Commons, domini públic; la marca és de Stripe). */
function Stripe() {
  return (
    <svg viewBox="54 36 360.02 149.84" aria-hidden="true">
      <g fill="#635BFF" fillRule="evenodd" clipRule="evenodd">
        <path d="M414,113.4c0-25.6-12.4-45.8-36.1-45.8c-23.8,0-38.2,20.2-38.2,45.6c0,30.1,17,45.3,41.4,45.3 c11.9,0,20.9-2.7,27.7-6.5v-20c-6.8,3.4-14.6,5.5-24.5,5.5c-9.7,0-18.3-3.4-19.4-15.2h48.9C413.8,121,414,115.8,414,113.4z M364.6,103.9c0-11.3,6.9-16,13.2-16c6.1,0,12.6,4.7,12.6,16H364.6z" />
        <path d="M301.1,67.6c-9.8,0-16.1,4.6-19.6,7.8l-1.3-6.2h-22v116.6l25-5.3l0.1-28.3c3.6,2.6,8.9,6.3,17.7,6.3 c17.9,0,34.2-14.4,34.2-46.1C335.1,83.4,318.6,67.6,301.1,67.6z M295.1,136.5c-5.9,0-9.4-2.1-11.8-4.7l-0.1-37.1 c2.6-2.9,6.2-4.9,11.9-4.9c9.1,0,15.4,10.2,15.4,23.3C310.5,126.5,304.3,136.5,295.1,136.5z" />
        <path d="M223.8,61.7L248.9,56.3V36L223.8,41.3Z M223.8,69.3h25.1v87.5h-25.1Z" />
        <path d="M196.9,76.7l-1.6-7.4h-21.6v87.5h25V97.5c5.9-7.7,15.9-6.3,19-5.2v-23C214.5,68.1,202.8,65.9,196.9,76.7z" />
        <path d="M146.9,47.6l-24.4,5.2l-0.1,80.1c0,14.8,11.1,25.7,25.9,25.7c8.2,0,14.2-1.5,17.5-3.3V135 c-3.2,1.3-19,5.9-19-8.9V90.6h19V69.3h-19L146.9,47.6z" />
        <path d="M79.3,94.7c0-3.9,3.2-5.4,8.5-5.4c7.6,0,17.2,2.3,24.8,6.4V72.2c-8.3-3.3-16.5-4.6-24.8-4.6 C67.5,67.6,54,78.2,54,95.9c0,27.6,38,23.2,38,35.1c0,4.6-4,6.1-9.6,6.1c-8.3,0-18.9-3.4-27.3-8v23.8c9.3,4,18.7,5.7,27.3,5.7 c20.8,0,35.1-10.3,35.1-28.2C117.4,100.6,79.3,105.9,79.3,94.7z" />
      </g>
    </svg>
  );
}

/** A què es connecta Hostly. Els noms no es veuen: són per als lectors de pantalla i per al rètol del ratolí. */
const MARQUES = [
  { id: "airbnb", nom: "Airbnb", logo: <img src={airbnb} alt="" width={121} height={128} loading="lazy" decoding="async" /> },
  { id: "booking", nom: "Booking.com", logo: <img src={booking} alt="" width={128} height={125} loading="lazy" decoding="async" /> },
  // Vrbo: el nom amb el color de la marca, fins que tinguem el logotip oficial
  { id: "vrbo", nom: "Vrbo", logo: <span className="pt-cn-txt" aria-hidden="true">Vrbo</span> },
  { id: "google", nom: "Google", logo: <Google /> },
  { id: "whatsapp", nom: "WhatsApp", logo: <img src={whatsapp} alt="" width={128} height={129} loading="lazy" decoding="async" /> },
  { id: "stripe", nom: "Stripe", logo: <Stripe /> },
  // SES.Hospedajes no té logotip propi: és el dibuix del seu portal (el del Ministerio porta l'escut i no es fa servir)
  { id: "ses", nom: "SES.Hospedajes", logo: <img src={ses} alt="" width={200} height={144} loading="lazy" decoding="async" /> },
];

/** Una tanda de la cinta. Se'n pinten dues, l'una darrere l'altra, perquè la volta no es vegi. */
function Tanda({ copia = false }: { copia?: boolean }) {
  return (
    <ul className="pt-tanda" aria-hidden={copia || undefined}>
      {MARQUES.map((m) => (
        <li key={m.id}>
          <span className={`pt-cn pt-cn-${m.id}`} role="img" aria-label={m.nom} title={m.nom}>
            {m.logo}
            <span className="pt-cn-tic" aria-hidden="true"><Check className="pt-ic" strokeWidth={3.4} /></span>
          </span>
        </li>
      ))}
    </ul>
  );
}

type Xifra = { n: number; text: string };

export default function Zero({ onEmpezar }: { onEmpezar: () => void }) {
  const { t } = useTranslation("home");
  const xifres = t("portada.zero.xifres", { returnObjects: true }) as Xifra[];

  return (
    <section id="cero" className="pt-seccio pt-zero-s" aria-labelledby="pt-zero-titol">
      <div className="contenidor">
        <div className="pt-zf">
          <div className="pt-zf-graella">
            <h2 id="pt-zero-titol" className="pt-zf-esq">
              <span className="pt-zf-zero">{t("portada.zero.zero")}</span>{" "}
              <span className="pt-zf-sempre">{t("portada.zero.sempre")}</span>
            </h2>
            <div className="pt-zf-dreta">
              <p className="pt-retol">{t("portada.zero.retol")}</p>
              <div className="pt-zf-cap">
                <p className="pt-zf-altres">{t("portada.zero.altres")}</p>
                <p className="pt-zf-vell">
                  <small>{t("portada.zero.fins")}</small>{" "}
                  <span className="pt-zf-cent">{t("portada.zero.preu")}<i className="pt-zf-tatxa" aria-hidden="true" /></span>{" "}
                  <small>{t("portada.zero.any")}</small>
                </p>
              </div>
              <p className="pt-zf-txt">{t("portada.zero.text")}</p>
              <div className="pt-zf-botons">
                <button type="button" onClick={onEmpezar} className="pt-pill pt-pill-blanc">{t("portada.zero.empezar")}</button>
                <LangLink to="/demo" className="pt-pill pt-pill-buit">{t("portada.zero.com")}</LangLink>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-zb">
          <ul className="pt-zx">
            {xifres.map((x) => (
              <li key={x.text}><b>{punts(x.n)}</b><span>{x.text}</span></li>
            ))}
          </ul>
          <div className="pt-zc">
            <p id="pt-zero-connectat" className="pt-retol">{t("portada.zero.connectat")}</p>
            <div className="pt-cinta" role="group" aria-labelledby="pt-zero-connectat">
              <div className="pt-cinta-pista">
                <Tanda />
                <Tanda copia />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
