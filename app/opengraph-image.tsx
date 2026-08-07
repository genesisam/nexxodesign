import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'Nexxo — Diseño de producto y web premium'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'space-between',
          backgroundColor: '#0E0E0E',
          padding:         '72px 80px',
          fontFamily:      'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Top: logo */}
        <div
          style={{
            fontSize:      28,
            fontWeight:    700,
            color:         '#EFEBE3',
            letterSpacing: '-0.03em',
          }}
        >
          NEXXO
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize:      72,
              fontWeight:    700,
              color:         '#EFEBE3',
              lineHeight:    0.92,
              letterSpacing: '-0.04em',
              maxWidth:      800,
            }}
          >
            Diseño de producto y web{' '}
            <span style={{ color: '#5B3DF5' }}>premium.</span>
          </div>
          <div
            style={{
              fontSize:    22,
              color:       '#8B8B85',
              fontWeight:  400,
              marginTop:   8,
              maxWidth:    560,
              lineHeight:  1.5,
            }}
          >
            SaaS · Fintech · IA — Bogotá, Colombia
          </div>
        </div>

        {/* Bottom: accent bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width:           48,
              height:          3,
              backgroundColor: '#5B3DF5',
              borderRadius:    2,
            }}
          />
          <div
            style={{
              fontSize:      13,
              color:         '#8B8B85',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight:    500,
            }}
          >
            nexxodesign.com
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
