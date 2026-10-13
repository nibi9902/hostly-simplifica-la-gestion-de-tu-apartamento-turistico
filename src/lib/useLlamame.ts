/**
 * «Déjame tu teléfono y te llamo»: el que fan els dos formularis de trucada del web, el de sota els
 * preus (`Llamame`) i el de la portada (`portada/Truca`). Un camp i un botó; el telèfon es desa a la
 * BD nova (`web_leads`, origen `llamame`) i arriba al Biel per Telegram en menys d'un minut.
 */
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "@/i18n/useLang";
import { track } from "@/lib/analytics";
import { dadesRecordades, desaLead, recordaDades, telefonPerBD } from "@/lib/leads";

/** `senseMes34`: el camp ja ensenya «+34» al davant; un número espanyol recordat s'hi posa sense. */
export function useLlamame({ senseMes34 = false }: { senseMes34?: boolean } = {}) {
  const { t } = useTranslation("embut");
  const { lang } = useLang();
  const [telefon, setTelefon] = useState(() => {
    const p = dadesRecordades().phone;
    if (!p) return "";
    return senseMes34 && p.startsWith("34") ? p.slice(2) : `+${p}`;
  });
  const [error, setError] = useState<string | null>(null);
  const [desant, setDesant] = useState(false);
  const [fet, setFet] = useState(false);

  function canvia(valor: string) {
    setTelefon(valor);
    setError(null);
  }

  async function envia(e: FormEvent) {
    e.preventDefault();
    const tel = await telefonPerBD(telefon);
    if (!tel) { setError(t("empezar.error.telefono")); return; }
    setDesant(true);
    const r = await desaLead({ phone: tel, source: "llamame" }, lang);
    setDesant(false);
    if (!r.ok) { setError(r.motiu === "telefon" ? t("empezar.error.telefono") : t("empezar.error.guardar")); return; }
    recordaDades({ phone: tel });
    track("llamame_enviado");
    setFet(true);
  }

  return { telefon, canvia, error, desant, fet, envia };
}
