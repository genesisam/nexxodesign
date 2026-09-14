import type { VideoDetail, TranscriptSource } from '@/lib/youtube'

/**
 * Turns a video into a draft article.
 *
 * The model is asked for a flat block list, not Portable Text. Portable Text
 * needs a unique `_key` on every block and span, and a model inventing those
 * will eventually repeat one — which Sanity accepts and the renderer then
 * draws twice. Keys are generated here instead.
 *
 * The article is written from the transcript; description and chapters give it
 * structure. It may explain further than the video does, but never assert
 * facts, figures or tool features the material does not contain — the byline
 * is Alexander's, and so is anything wrong in it.
 */

export type DraftArticle = {
  title:       string
  excerpt:     string
  category:    'Diseño' | 'IA' | 'UX' | 'Proceso' | 'Producto' | 'E-commerce'
  tags:        string[]
  blocks:      { style: 'normal' | 'h2' | 'blockquote'; text: string; bullet?: boolean }[]
  /** Screenshots Alexander could add from his own material, by section. */
  images?:     { after: string; capture: string }[]
}

/** A 26-minute video is ~25k characters of speech; this leaves headroom. */
const TRANSCRIPT_LIMIT = 45_000

const SYSTEM = `Escribes para el journal de Nexxo, un estudio de diseño de producto colombiano. Alexander Moreno firma los artículos.

VOZ DEL JOURNAL
- Frases cortas y afirmaciones directas. Nada de "en el mundo actual" ni "hoy en día".
- Se moja: dice qué está mal y por qué, no enumera opciones neutras.
- Concreta: nombres de herramientas, pasos, decisiones. Cero adjetivos de relleno.
- Reconoce límites. Un método que solo enumera sus virtudes es una página de ventas.
- Español neutro, sin anglicismos innecesarios.

FUENTES
- TRANSCRIPCIÓN: lo que Alexander dice en el video. Es la fuente principal: las ideas, ejemplos y opiniones salen de aquí.
- DESCRIPCIÓN y CAPÍTULOS: úsalos para entender la estructura y el orden del argumento.
- Si la transcripción es automática trae errores de reconocimiento, sobre todo en nombres de herramientas y términos en inglés. Corrige lo evidente por contexto. Si una frase no se entiende, omítela en lugar de adivinar.
- Si no hay transcripción, escribe solo con la descripción y los capítulos.

QUÉ PUEDES Y QUÉ NO
- SÍ: desarrollar las ideas del video con más orden y profundidad que en el video, explicar el porqué y añadir pasos prácticos que se desprendan de lo que se dice.
- NO: inventar cifras, estudios, clientes, resultados, citas ni funciones de herramientas que no aparezcan en el material. Si el material no respalda algo, no lo afirmes.
- NO escribas "en este video", "como explico en el video" ni pidas suscripciones: el video va incrustado en la misma página.
- NO incluyas URLs ni enlaces.
- NO es una transcripción limpia ni un resumen: es un artículo que alguien puede leer sin ver el video.

ESTRUCTURA
- Entre 5 y 8 secciones h2. Una cita destacada como máximo. Viñetas solo si enumeran algo real.

Devuelve SOLO un objeto JSON válido, sin markdown ni explicación, con esta forma exacta:
{"title":string,"excerpt":string,"category":"Diseño"|"IA"|"UX"|"Proceso"|"Producto"|"E-commerce","tags":string[],"blocks":[{"style":"normal"|"h2"|"blockquote","text":string,"bullet":boolean}],"images":[{"after":string,"capture":string}]}

title: distinto al del video, escrito para quien llega desde Google.
excerpt: una frase, máximo 160 caracteres.
bullet: true solo en los items de una lista.
images: 2 o 3 capturas que Alexander puede sacar de su propio material para acompañar el texto: pantallas, renders o resultados de herramientas que aparezcan en la transcripción. after: el texto exacto de un h2 del artículo. capture: qué debe mostrar la captura, en una frase. Nada decorativo ni genérico; si el material no da para capturas concretas, devuelve una lista vacía.`

export async function writeArticle(
  video: VideoDetail,
  transcript: string,
  source: TranscriptSource,
): Promise<DraftArticle> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY no configurada')

  const chapters = video.chapters.length
    ? video.chapters.map(c => `${c.at} — ${c.label}`).join('\n')
    : '(el video no trae capítulos marcados)'

  const transcriptBlock = transcript
    ? `TRANSCRIPCIÓN (${source}):\n${transcript.slice(0, TRANSCRIPT_LIMIT)}`
    : 'TRANSCRIPCIÓN: no disponible. Escribe solo con la descripción y los capítulos.'

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key':         key,
      'anthropic-version': '2023-06-01',
      'content-type':      'application/json',
    },
    body: JSON.stringify({
      model:      process.env.ARTICLE_MODEL ?? 'claude-sonnet-5',
      // Sonnet 5 thinks by default, its thinking block comes first, and
      // thinking tokens count toward max_tokens. The first production run
      // failed reading that block as the article; the second hit the old
      // 3,500-token ceiling before the article was done. Writing from a
      // transcript doesn't need the reasoning pass, so it is off, and the
      // ceiling leaves room for a long article in Spanish plus its JSON.
      thinking:   { type: 'disabled' },
      max_tokens: 8000,
      system:     SYSTEM,
      messages: [{
        role: 'user',
        content:
          `TÍTULO DEL VIDEO: ${video.title}\n` +
          `DURACIÓN: ${Math.round(video.seconds / 60)} minutos\n\n` +
          `DESCRIPCIÓN:\n${video.description || '(sin descripción)'}\n\n` +
          `CAPÍTULOS:\n${chapters}\n\n` +
          transcriptBlock,
      }],
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 300)}`)

  return readArticle(await res.json())
}

type ContentBlock = { type?: string; text?: string }

/**
 * The article out of a Messages API response.
 *
 * Reads every text block rather than `content[0]`. The first production run
 * read `content[0].text`; when that first block is not text — a thinking
 * block, or no block at all on a refusal — it is undefined, JSON.parse('')
 * throws "Unexpected end of JSON input", and the email said nothing about what
 * the model had actually sent. Every failure here names the stop reason, the
 * block types and the output tokens, so the next one can be fixed from the
 * email alone.
 */
export function readArticle(response: unknown): DraftArticle {
  const res = (response ?? {}) as {
    stop_reason?: string
    content?:     ContentBlock[]
    usage?:       { output_tokens?: number }
  }
  const blocks = Array.isArray(res.content) ? res.content : []
  const shape  =
    `stop_reason: ${res.stop_reason ?? '?'}; ` +
    `bloques: ${blocks.map(b => b.type).join(', ') || 'ninguno'}; ` +
    `tokens de salida: ${res.usage?.output_tokens ?? '?'}`

  if (res.stop_reason === 'max_tokens') {
    throw new Error(`El artículo generado se cortó por longitud antes de terminar (${shape}).`)
  }
  if (res.stop_reason === 'refusal') {
    throw new Error(`El modelo se negó a escribir este artículo (${shape}).`)
  }

  const text = blocks
    .filter(b => b.type === 'text' && typeof b.text === 'string')
    .map(b => b.text)
    .join('')
    .trim()
  if (!text) throw new Error(`El modelo no devolvió texto (${shape}).`)

  // Models sometimes wrap the object in a fence or a sentence even when told
  // not to; the object itself runs from the first brace to the last.
  const start = text.indexOf('{')
  const end   = text.lastIndexOf('}')
  if (start === -1 || end <= start) {
    throw new Error(`El modelo no devolvió un objeto JSON (${shape}). Empieza por: ${JSON.stringify(text.slice(0, 120))}`)
  }

  let parsed: DraftArticle
  try {
    parsed = JSON.parse(text.slice(start, end + 1))
  } catch (e) {
    throw new Error(`El modelo devolvió JSON inválido: ${e instanceof Error ? e.message : String(e)} (${shape}).`)
  }

  if (!parsed?.title || !Array.isArray(parsed.blocks) || !parsed.blocks.length) {
    throw new Error('El modelo devolvió un artículo vacío o mal formado')
  }
  return parsed
}

/**
 * Capture suggestions as email lines. They go in the email, never in the body:
 * a placeholder in the text gets published the one time it is forgotten. Only
 * suggestions pinned to a heading the article actually has survive — one that
 * names a section it didn't write sends Alexander looking for nothing.
 */
export function captureSuggestions(article: DraftArticle): string[] {
  const headings = new Set(article.blocks.filter(b => b.style === 'h2').map(b => b.text.trim()))
  return (article.images ?? [])
    .filter(i => i?.capture?.trim() && headings.has(String(i.after ?? '').trim()))
    .slice(0, 3)
    .map(i => `  · Tras «${i.after.trim()}»: ${i.capture.trim()}`)
}

/**
 * Minutes at 200 words a minute, counted from the article itself. The model's
 * own estimate put an 810-word article at 6 minutes.
 */
export function readingMinutes(article: DraftArticle): number {
  const words = article.blocks.map(b => b.text).join(' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
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
    .replace(/-$/, '')
}
