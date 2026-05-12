import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export const alt = 'Fermaj SAS - Instalaciones Profesionales en Colombia'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/jpeg'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'radial-gradient(circle at 70% 50%, rgba(200, 255, 0, 0.15), transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '30%',
            background: 'radial-gradient(circle at 30% 100%, rgba(200, 255, 0, 0.08), transparent 60%)',
          }}
        />
        <svg width="120" height="120" viewBox="0 0 180 180" fill="none" style={{ marginBottom: 30 }}>
          <rect width="180" height="180" rx="37" fill="#c8ff00" />
          <path d="M101.141 53H136.632C151.023 53 162.689 64.6662 162.689 79.0573V112.904H148.112V79.0573C148.112 78.7105 148.098 78.3662 148.072 78.0251L112.581 112.898C112.701 112.902 112.821 112.904 112.941 112.904H148.112V126.672H112.941C98.5504 126.672 86.5638 114.891 86.5638 100.5V66.7434H101.141V100.5C101.141 101.15 101.191 101.792 101.289 102.422L137.56 66.7816C137.255 66.7563 136.945 66.7434 136.632 66.7434H101.141V53Z" fill="#0a0a0a" />
          <path d="M65.2926 124.136L14 66.7372H34.6355L64.7495 100.436V66.7372H80.1365V118.47C80.1365 126.278 70.4953 129.958 65.2926 124.136Z" fill="#0a0a0a" />
        </svg>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 80px',
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              textAlign: 'center',
              letterSpacing: '-1px',
            }}
          >
            Fermaj SAS
          </h1>
          <p
            style={{
              fontSize: 28,
              color: '#c8ff00',
              margin: '12px 0 0 0',
              textAlign: 'center',
              fontWeight: 500,
            }}
          >
            Instalaciones Profesionales en Colombia
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
