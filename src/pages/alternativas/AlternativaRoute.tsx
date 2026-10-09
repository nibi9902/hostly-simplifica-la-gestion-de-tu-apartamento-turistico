import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useCompetitor } from '@/lib/data/useCompetitors';
import AlternativaPage from './AlternativaPage';
import { useLang } from '@/i18n/useLang';

export default function AlternativaRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { localized } = useLang();
  // Castellà o català segons l'idioma de la URL.
  const competitor = useCompetitor(slug);

  useEffect(() => {
    if (!competitor) navigate(localized('/alternativas'), { replace: true });
  }, [competitor, navigate, localized]);

  if (!competitor) return null;
  return <AlternativaPage competitor={competitor} />;
}
