// One-time setup for the YouTube → journal job.
//
// Asks Google for permission to read your channel (including caption tracks,
// which only the owner can download) and prints the refresh token the daily
// job uses from Vercel.
//
//   1. Put YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET in .env.local
//   2. node scripts/youtube-auth.mjs
//   3. Choose the ALEXUI-UX channel in the browser and allow access
//   4. Copy the printed YOUTUBE_REFRESH_TOKEN into Vercel
//
// The token is a password to your channel. Don't paste it anywhere but Vercel.

import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { exec } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root    = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const envFile = path.join(root, '.env.local')

const fileEnv = fs.existsSync(envFile)
  ? Object.fromEntries(
      fs.readFileSync(envFile, 'utf8')
        .split(/\r?\n/)
        .filter(l => l.includes('=') && !l.trim().startsWith('#'))
        .map(l => {
          const i = l.indexOf('=')
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
        }),
    )
  : {}

const CLIENT_ID     = process.env.YOUTUBE_CLIENT_ID ?? fileEnv.YOUTUBE_CLIENT_ID
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET ?? fileEnv.YOUTUBE_CLIENT_SECRET

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nFalta YOUTUBE_CLIENT_ID o YOUTUBE_CLIENT_SECRET en .env.local.\n')
  process.exit(1)
}

const PORT     = 53682
const REDIRECT = `http://127.0.0.1:${PORT}`
// force-ssl is the scope the captions download endpoint requires.
const SCOPE    = 'https://www.googleapis.com/auth/youtube.force-ssl'

const authUrl =
  'https://accounts.google.com/o/oauth2/v2/auth?' +
  new URLSearchParams({
    client_id:     CLIENT_ID,
    redirect_uri:  REDIRECT,
    response_type: 'code',
    scope:         SCOPE,
    access_type:   'offline',
    // Without prompt=consent Google skips re-issuing a refresh token.
    prompt:        'consent',
  })

function page(res, message) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(
    `<!doctype html><meta charset="utf-8"><title>Nexxo</title>` +
    `<body style="margin:0;height:100vh;display:grid;place-items:center;` +
    `background:#0e0e0e;color:#efebe3;font:16px system-ui,sans-serif">` +
    `<p>${message}</p></body>`,
  )
}

const server = http.createServer(async (req, res) => {
  const url   = new URL(req.url ?? '/', REDIRECT)
  const code  = url.searchParams.get('code')
  const error = url.searchParams.get('error')

  if (!code && !error) {
    res.writeHead(404).end()
    return
  }

  if (error) {
    page(res, 'Autorización cancelada. Vuelve a la terminal.')
    console.error('\nGoogle devolvió:', error, '\n')
    process.exitCode = 1
    server.close()
    return
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri:  REDIRECT,
        grant_type:    'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.refresh_token) {
      throw new Error(tokens.error_description || tokens.error || 'Google no devolvió un refresh token.')
    }

    // Confirm which channel was authorised — an account can own several.
    const me = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }).then(r => r.json())
    const channel = me?.items?.[0]?.snippet?.title

    page(res, 'Listo. Puedes cerrar esta pestaña y volver a la terminal.')

    console.log('\nCanal autorizado:', channel ?? '(no se pudo leer — ¿elegiste la cuenta correcta?)')
    if (channel && channel !== 'ALEXUI-UX') {
      console.log('Ojo: no es ALEXUI-UX. Si no es el canal correcto, repite y elige el otro.')
    }
    console.log('\nAñade esta variable en Vercel (solo Production):\n')
    console.log(`YOUTUBE_REFRESH_TOKEN=${tokens.refresh_token}\n`)
  } catch (e) {
    page(res, 'Algo falló. Mira la terminal.')
    console.error('\n' + (e instanceof Error ? e.message : String(e)) + '\n')
    process.exitCode = 1
  } finally {
    server.close()
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('\nAbriendo Google para autorizar el acceso a tu canal…')
  console.log('Si no se abre solo, pega esta URL en el navegador:\n')
  console.log(authUrl + '\n')

  const open =
    process.platform === 'win32'  ? `start "" "${authUrl}"` :
    process.platform === 'darwin' ? `open "${authUrl}"` :
                                    `xdg-open "${authUrl}"`
  exec(open)
})
