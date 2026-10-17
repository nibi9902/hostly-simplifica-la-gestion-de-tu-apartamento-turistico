/**
 * Els punts de sota d'una tira que llisca (`useLliscador`): el de la peça que tens davant, allargat i
 * blau. Són una drecera per al dit (el lector de pantalla ja llegeix totes les peces seguides), per
 * això no entren al tabulador. Només surten al mòbil (CSS).
 */
export default function PuntsLliscador({ n, pas, vesA }: { n: number; pas: number; vesA: (i: number) => void }) {
  return (
    <div className="pt-llisca-punts" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => (
        <button key={i} type="button" tabIndex={-1} className={i === pas ? "ara" : undefined} onClick={() => vesA(i)}><i /></button>
      ))}
    </div>
  );
}
