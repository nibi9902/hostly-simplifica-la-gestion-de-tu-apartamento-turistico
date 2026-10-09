/**
 * Les icones de les pàgines de funcionalitats, per nom (`iconName` a features.ts).
 *
 * Abans es feia `import * as icons from 'lucide-react'` i s'hi buscava el nom: el
 * paquet arrossegava les ~1.500 icones de lucide i el fragment `useFeatures` pesava
 * 823 kB. Ara només hi van les que es fan servir; un nom desconegut cau a Sparkles.
 */
import {
  BarChart3, Calculator, Calendar, ClipboardCheck, FileText, Landmark, MessageCircle,
  Plug, Receipt, Send, ShieldCheck, Sparkles, TrendingUp, Users, type LucideIcon,
} from "lucide-react";

const ICONES: Record<string, LucideIcon> = {
  BarChart3, Calculator, Calendar, ClipboardCheck, FileText, Landmark, MessageCircle,
  Plug, Receipt, Send, ShieldCheck, Sparkles, TrendingUp, Users,
};

export function iconaFuncio(nom: string | undefined): LucideIcon {
  return (nom && ICONES[nom]) || Sparkles;
}
