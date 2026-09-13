'use client'

import { useState } from 'react'

/**
 * The video a post was written from, embedded without paying for it upfront.
 *
 * A YouTube iframe pulls in around a megabyte of script before anyone presses
 * play, on every visit, and it would sit exactly where the article's largest
 * image used to be — the element Core Web Vitals measures. So the page shows
 * the thumbnail with a play button, and the iframe is only created on click.
 * Most readers never press play; none of them pay for the player.
 *
 * youtube-nocookie keeps YouTube from setting tracking cookies until the video
 * actually plays, and it is the one origin middleware.ts allows in frame-src.
 */
export function YouTubeEmbed({
  id, title, poster,
}: {
  id: string
  title: string
  poster?: string | null
}) {
  const [playing, setPlaying] = useState(false)
  const [src, setSrc] = useState(poster || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 h-full w-full border-0"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir el video: ${title}`}
      className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        loading="eager"
        draggable={false}
        // maxresdefault does not exist for every video; hqdefault always does.
        onError={() => setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
      />
      <span aria-hidden className="absolute inset-0 bg-ink/25 transition-colors duration-300 group-hover:bg-ink/10" />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper text-ink transition-transform duration-300 group-hover:scale-110 md:h-20 md:w-20"
      >
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 md:h-7 md:w-7" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  )
}
