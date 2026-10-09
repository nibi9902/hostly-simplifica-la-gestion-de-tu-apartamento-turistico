import { useLang } from '@/i18n/useLang';
import { uniqueCompetitors, type Competitor } from './competitors';
import { uniqueCompetitorsCa } from './competitors.ca';

/** Retorna les comparatives amb competidors en l'idioma actual. */
export function useCompetitors(): Competitor[] {
  const { lang } = useLang();
  return lang === 'ca' ? uniqueCompetitorsCa : uniqueCompetitors;
}

/** Retorna una comparativa concreta per slug en l'idioma actual. */
export function useCompetitor(slug: string | undefined): Competitor | undefined {
  const competitors = useCompetitors();
  return slug ? competitors.find((c) => c.slug === slug) : undefined;
}
