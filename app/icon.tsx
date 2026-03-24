import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 900,
          borderRadius: '8px',
          border: '2px solid rgba(255,255,255,0.2)'
        }}
      >
        W<span style={{ color: '#FF6B9D' }}>.</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
