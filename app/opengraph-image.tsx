import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SuratResmi.Online — Pembuat Surat Resmi Online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2E6DAD 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'white',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              color: '#1E3A5F',
              fontWeight: 800,
            }}
          >
            S
          </div>
          <div style={{ fontSize: '36px', fontWeight: 700, letterSpacing: '-0.5px' }}>
            SuratResmi.Online
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: '72px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              maxWidth: '900px',
            }}
          >
            Buat Surat Resmi dalam 30 Detik
          </div>
          <div style={{ fontSize: '32px', opacity: 0.85, fontWeight: 400 }}>
            Surat kuasa, perjanjian, jual beli — gratis 3 surat pertama
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '22px',
            opacity: 0.7,
          }}
        >
          <div style={{ display: 'flex', gap: '32px' }}>
            <span>50+ template</span>
            <span>·</span>
            <span>PDF siap cetak</span>
            <span>·</span>
            <span>Sesuai UU PDP</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
