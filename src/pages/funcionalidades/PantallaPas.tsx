/**
 * La mini pantalla d'un pas de «Cómo funciona»: al mòbil, a baix de cada targeta del carrusel, com es
 * veu aquell moment a Hostly (opció 8B del Biel, 17-10). A l'ordinador no surt (CSS). És una
 * il·lustració del text del pas, que ja ho diu tot: per això queda fora del lector de pantalla.
 * Les files són a `features.ts` (i `.ca.ts`), al camp `pantalla` de cada pas.
 */
import { Check, FileText } from 'lucide-react';
import type { FilaPantalla } from '@/lib/data/features';
import airbnb from '@/assets/connexions/airbnb.webp';
import booking from '@/assets/connexions/booking.webp';
import whatsapp from '@/assets/connexions/whatsapp.webp';

const LOGO = { airbnb, booking, whatsapp } as const;
/** Els colors de les inicials, com els de l'equip del Completo. */
const COLORS = ['#0f766e', '#b45309', '#6d28d9', '#be123c'];

/** El text d'una plantilla, amb les variables (`[[nom]]`) com a xips. */
function ambVariables(text: string) {
  return text.split(/(\[\[[^\]]+\]\])/g).map((tros, i) =>
    tros.startsWith('[[') ? <span key={i} className="pt-mini-var">{tros.slice(2, -2)}</span> : tros,
  );
}

function Fila({ f, n }: { f: FilaPantalla; n: number }) {
  switch (f.t) {
    case 'cap':
      return <p className="pt-mini-cap"><b>{f.text}</b>{f.nota && <span>{f.nota}</span>}</p>;
    case 'barra':
      return <p className="pt-mini-barra">{Array.from({ length: f.de }, (_, i) => <span key={i} className={i < f.fets ? 'fet' : undefined} />)}</p>;
    case 'camp':
      return <p className="pt-mini-camp"><span>{f.et}</span><b>{f.val}</b></p>;
    case 'ok':
      return <p className="pt-mini-ok"><Check className="pt-ic" strokeWidth={3} /><span>{f.text}</span>{f.val && <b>{f.val}</b>}</p>;
    case 'avis':
      return <p className="pt-mini-avis"><span>{f.text}</span>{f.val && <b>{f.val}</b>}</p>;
    case 'doc':
      return <p className="pt-mini-doc"><FileText className="pt-ic" /><span>{f.text}</span></p>;
    case 'tria':
      return <p className={`pt-mini-tria${f.si ? ' si' : ''}`}><span>{f.si && <Check className="pt-ic" strokeWidth={3} />}</span>{f.text}</p>;
    case 'xifra':
      return <p className={`pt-mini-xifra${f.total ? ' total' : ''}`}><span>{f.et}</span><b>{f.val}</b></p>;
    case 'xips':
      return <p className="pt-mini-xips">{f.items.map((x) => <span key={x.text} className={x.to}>{x.text}</span>)}</p>;
    case 'reserva':
      return <p className={`pt-mini-reserva ${f.canal}${f.despl ? ' despl' : ''}`}><b>{f.qui}</b><span>{f.val}</span></p>;
    case 'persona':
      return (
        <p className="pt-mini-persona">
          <span className="pt-mini-av" style={{ background: COLORS[n % COLORS.length] }}>{f.nom[0]}</span>
          <span><b>{f.nom}</b><small>{f.nota}</small></span>
        </p>
      );
    case 'conversa':
      return (
        <p className="pt-mini-conversa">
          <img src={LOGO[f.canal]} alt="" width={22} height={22} />
          <span><b>{f.qui}</b><small>{f.text}</small></span>
          {f.estat && <em>{f.estat}</em>}
        </p>
      );
    case 'auto':
      return (
        <div className="pt-mini-bomb rebut">
          <small>{f.et}</small>
          <p>{ambVariables(f.text)}{f.enllac && <> <span className="pt-mini-enllac">{f.enllac}</span></>}</p>
        </div>
      );
    case 'rebut':
    case 'enviat':
      return <div className={`pt-mini-bomb ${f.t}`}><small>{f.et}</small><p>{f.text}</p></div>;
    case 'boto':
      return <span className="pt-mini-boto">{f.text}</span>;
    case 'nota':
      return <p className="pt-mini-nota">{f.text}</p>;
  }
}

export default function PantallaPas({ files }: { files: FilaPantalla[] }) {
  // les inicials de cada persona, cadascuna del seu color
  let persones = 0;
  return (
    <div className="pt-mini" aria-hidden="true">
      {files.map((f, i) => <Fila key={i} f={f} n={f.t === 'persona' ? persones++ : 0} />)}
    </div>
  );
}
