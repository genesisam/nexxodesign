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
  readingTime: number
  blocks:      { style: 'normal' | 'h2' | 'blockquote'; text: string; bullet?: boolean }[]
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
{"title":string,"excerpt":string,"category":"Diseño"|"IA"|"UX"|"Proceso"|"Producto"|"E-commerce","tags":string[],"readingTime":number,"blocks":[{"style":"normal"|"h2"|"blockquote","text":string,"bullet":boolean}]}

title: distinto al del video, escrito para quien llega desde Google.
excerpt: una frase, máximo 160 caracteres.
readingTime: minutos, entero.
bullet: true solo en los items de una lista.`

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
      max_tokens: 3500,
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

  const json = await res.json()
  if (json?.stop_reason === 'max_tokens') {
    throw new Error('El artículo generado se cortó por longitud antes de terminar.')
  }

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
    .replace(/-$/, '')
}
