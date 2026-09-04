import type { VideoDetail } from '@/lib/youtube'
import { watchUrl } from '@/lib/youtube'

/**
 * Turns a video into a draft article.
 *
 * The model is asked for a flat block list, not Portable Text. Portable Text
 * needs a unique `_key` on every block and every span, and a model asked to
 * invent those will eventually repeat one — which Sanity accepts and the
 * renderer then draws twice. Generating the keys here is deterministic and
 * removes a whole class of silent corruption.
 */

export type DraftArticle = {
  title:       string
  excerpt:     string
  category:    'Diseño' | 'IA' | 'UX' | 'Proceso' | 'Producto' | 'E-commerce'
  tags:        string[]
  readingTime: number
  blocks:      { style: 'normal' | 'h2' | 'blockquote'; text: string; bullet?: boolean }[]
}

const SYSTEM = `Escribes para el journal de Nexxo, un estudio de diseño de producto colombiano. Alexander Moreno firma los artículos.

La voz del journal, tal como está escrita en los artículos existentes:
- Frases cortas y afirmaciones directas. Nada de "en el mundo actual" ni "hoy en día".
- Se moja: dice qué está mal y por qué, no enumera opciones neutras.
- Concreta. Números, plazos, nombres de herramientas. Cero adjetivos de relleno.
- Reconoce límites. Un método que solo enumera sus virtudes es una página de ventas.
- Español de España/LatAm neutro, sin anglicismos innecesarios.

Reglas del artículo:
- NO es una transcripción ni un resumen del video. Es una pieza que se sostiene sola y que alguien puede leer sin verlo.
- Usa los capítulos del video como esqueleto de argumentación, no como índice a copiar.
- Entre 5 y 8 secciones h2. Una cita destacada como máximo. Viñetas solo si enumeran algo real.
- No inventes datos, cifras, clientes ni resultados que no estén en el material.
- Si el material no da para afirmar algo, no lo afirmes.

Devuelve SOLO un objeto JSON válido, sin markdown ni explicación, con esta forma exacta:
{"title":string,"excerpt":string,"category":"Diseño"|"IA"|"UX"|"Proceso"|"Producto"|"E-commerce","tags":string[],"readingTime":number,"blocks":[{"style":"normal"|"h2"|"blockquote","text":string,"bullet":boolean}]}

title: distinto al del video, escrito para quien llega desde Google.
excerpt: una frase, máximo 160 caracteres.
readingTime: minutos, entero.
bullet: true solo en los items de una lista.`

export async function writeArticle(video: VideoDetail): Promise<DraftArticle> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY no configurada')

  const chapters = video.chapters.length
    ? video.chapters.map(c => `${c.at} — ${c.label}`).join('\n')
    : '(el video no trae capítulos marcados)'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         key,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      process.env.ARTICLE_MODEL ?? 'claude-sonnet-5',
      max_tokens: 4000,
      system:     SYSTEM,
      messages: [{
        role: 'user',
        content:
          `Escribe el artículo a partir de este video.\n\n` +
          `TÍTULO: ${video.title}\n` +
          `DURACIÓN: ${Math.round(video.seconds / 60)} minutos\n` +
          `URL: ${watchUrl(video.id)}\n\n` +
          `DESCRIPCIÓN:\n${video.description}\n\n` +
          `CAPÍTULOS:\n${chapters}`,
      }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`)

  const json = await res.json()
  const text = json?.content?.[0]?.text ?? ''

  // Models sometimes wrap JSON in a fence even when told not to.
  const raw = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')

  const parsed = JSON.parse(raw) as DraftArticle
  if (!parsed?.title || !Array.isArray(parsed.blocks) || !parsed.blocks.length) {
    throw new Error('El modelo devolvió un artículo vacío o mal formado')
  }
  return parsed
}

/** Flat blocks → Portable Text, with keys generated here so they cannot collide. */
export function toPortableText(article: DraftArticle) {
  return article.blocks
    .filter(b => b?.text?.trim())
    .map((b, i) => ({
      _type:    'block',
      _key:     `b${i}`,
      style:    b.style === 'h2' || b.style === 'blockquote' ? b.style : 'normal',
      markDefs: [],
      ...(b.bullet && { listItem: 'bullet', level: 1 }),
      children: [{ _type: 'span', _key: `s${i}`, marks: [], text: b.text.trim() }],
    }))
}

export function slugify(title: string): string {
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 70)
}
