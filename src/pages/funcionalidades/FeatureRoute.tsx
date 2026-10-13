import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useFeatures } from '@/lib/data/useFeatures';
import FeaturePage from './FeaturePage';
import { useLang } from '@/i18n/useLang';

export default function FeatureRoute() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { localized } = useLang();
  const features = useFeatures();
  const feature = slug ? features.find((f) => f.slug === slug) : undefined;

  useEffect(() => {
    if (!feature) navigate(localized('/funcionalidades'), { replace: true });
  }, [feature, navigate, localized]);

  if (!feature) return null;
  // `key`: cada funcionalitat és una pàgina nova (les animacions i la demo tornen a començar)
  return <FeaturePage key={feature.slug} feature={feature} />;
}
