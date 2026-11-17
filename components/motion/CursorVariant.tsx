'use client'

import { useEffect } from 'react'
import { LegoCursor } from './LegoCursor'

/**
 * Activa una variante del cursor personalizado mientras la página está montada.
 * `<CursorVariant variant="lego" />` cambia el punto + anillo por la mano LEGO de
 * partículas (LegoCursor), que se desarma al moverse y se vuelve a armar al parar.
 */
export function CursorVariant({ variant }: { variant: 'lego' }) {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.cursorVariant = variant
    return () => { delete root.dataset.cursorVariant }
  }, [variant])
  return variant === 'lego' ? <LegoCursor /> : null
}
