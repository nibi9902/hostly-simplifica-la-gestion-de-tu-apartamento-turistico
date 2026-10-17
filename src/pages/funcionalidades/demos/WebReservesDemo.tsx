import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Check, Lock } from 'lucide-react';
import menjador from '@/assets/portada/menjador-dia.webp';
import sofa from '@/assets/portada/pis-sofa.webp';
import sala from '@/assets/portada/pis-sala.webp';
import airbnb from '@/assets/connexions/airbnb.webp';
import booking from '@/assets/connexions/booking.webp';

/* ─────────────────────────────────────────────────────────────
   WEB DE RESERVES DIRECTES — la web del gestor, des del costat de l'hoste: les fotos del pis, les
   dates, el preu i «Reservar y pagar». Al cap d'un moment arriba l'avís de Hostly: la reserva és a
   dins i els dies, tancats a Airbnb i Booking. És la demo de la maqueta del 17-10; on hi ha vídeo
   (en castellà), surt el vídeo.
───────────────────────────────────────────────────────────── */

const WebReservesDemo: React.FC = () => {
  const { t } = useTranslation('demos');
  const reduir = useReducedMotion();

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 594, margin: '0 auto', paddingTop: 4 }}>
      <div
        style={{
          borderRadius: 16,
          background: '#fff',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(15,23,42,0.06), 0 30px 60px -28px rgba(15,23,42,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 40, padding: '0 12px', background: '#F3F4F6', borderBottom: '1px solid #E5E7EB' }}>
          <span style={{ display: 'flex', gap: 6 }}>
            {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
              <i key={c} style={{ display: 'block', width: 10, height: 10, borderRadius: 9999, background: c }} />
            ))}
          </span>
          <span
            style={{
              flex: 1, minWidth: 0, height: 26, borderRadius: 7, background: '#E8EAEE', color: '#4B5563',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12,
              overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
            }}
          >
            <Lock style={{ width: 11, height: 11, color: '#9CA3AF', flexShrink: 0 }} />
            {t('webReserves.url')}
          </span>
        </div>

        <div style={{ padding: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 5, aspectRatio: '16 / 6.2', borderRadius: 10, overflow: 'hidden' }}>
            <img src={menjador} alt="" style={{ gridRow: 'span 2', width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <img src={sofa} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <img src={sala} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 14, marginTop: 14 }}>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <p style={{ fontSize: 17, lineHeight: 1.25, fontWeight: 700, color: '#181B20' }}>{t('webReserves.nom')}</p>
              <p style={{ marginTop: 4, fontSize: 12.5, color: '#6B7280' }}>{t('webReserves.dades')}</p>
              <p style={{ marginTop: 10, fontSize: 13, lineHeight: 1.55, color: '#4B5563' }}>{t('webReserves.desc')}</p>
            </div>
            <div
              style={{
                flex: '1 1 200px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, padding: 12,
                borderRadius: 12, background: '#fff', boxShadow: '0 0 0 1px #E5E7EB, 0 10px 24px -16px rgba(15,23,42,0.3)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <p style={{ fontSize: 12.5, color: '#6B7280' }}>
                <b style={{ fontSize: 17, color: '#181B20' }}>95 €</b> {t('webReserves.perNit')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderRadius: 9, boxShadow: 'inset 0 0 0 1px #D1D5DB', overflow: 'hidden' }}>
                {[
                  [t('webReserves.arribada'), t('webReserves.dataArribada')],
                  [t('webReserves.sortida'), t('webReserves.dataSortida')],
                ].map(([et, data], i) => (
                  <span key={et} style={{ display: 'flex', flexDirection: 'column', padding: '6px 10px', fontSize: 13, color: '#181B20', boxShadow: i ? 'inset 1px 0 0 #D1D5DB' : undefined }}>
                    <small style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6B7280' }}>{et}</small>
                    <b>{data}</b>
                  </span>
                ))}
              </div>
              <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#4B5563' }}>
                <span>{t('webReserves.linia')}</span><span>285 €</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 7, borderTop: '1px solid #E5E7EB', fontSize: 13, fontWeight: 700, color: '#181B20' }}>
                <span>{t('webReserves.total')}</span><span>285 €</span>
              </p>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 38, borderRadius: 9, background: '#181B20', color: '#fff', fontSize: 13.5, fontWeight: 600 }}>
                {t('webReserves.boto')}
              </span>
              <p style={{ fontSize: 11, textAlign: 'center', color: '#6B7280' }}>{t('webReserves.pagament')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* L'avís de Hostly: la reserva ja és a dins i els dies, tancats */}
      <motion.div
        initial={reduir ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', right: 10, top: 58, width: 'min(290px, calc(100% - 20px))', padding: '10px 12px 12px',
          borderRadius: 14, background: 'rgba(255,255,255,0.97)',
          boxShadow: '0 22px 46px -16px rgba(15,23,42,0.45), 0 0 0 1px rgba(15,23,42,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
          <span style={{ display: 'grid', placeItems: 'center', flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: '#181B20', color: '#fff' }}>
            <Check style={{ width: 15, height: 15 }} strokeWidth={3} />
          </span>
          <p style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, fontSize: 12.5, lineHeight: 1.35, color: '#181B20' }}>
            <b>{t('webReserves.avisTitol')}</b>
            <span style={{ fontSize: 12, color: '#6B7280' }}>{t('webReserves.avisText')}</span>
          </p>
          <small style={{ fontSize: 11, color: '#9CA3AF' }}>{t('webReserves.ara')}</small>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
          {[
            [airbnb, t('webReserves.tancatAirbnb')],
            [booking, t('webReserves.tancatBooking')],
          ].map(([logo, text]) => (
            <span
              key={text}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 26, padding: '0 9px 0 5px', borderRadius: 9999, background: '#F0FDF4', color: '#166534', fontSize: 11.5, fontWeight: 600 }}
            >
              <img src={logo} alt="" width={15} height={15} style={{ display: 'block', borderRadius: 4, objectFit: 'contain', background: '#fff' }} />
              {text}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WebReservesDemo;
