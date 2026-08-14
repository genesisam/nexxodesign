import { defineRouting } from 'next-intl/routing'

// Spanish only. The audience is Spanish-speaking, and a half-populated English
// tree was costing more than it earned: `story_en` existed but carried no image
// blocks, so every English case study rendered its text without its work.
// next-intl stays in place — it owns the message catalogue and the routing —
// so adding a locale back is a one-line change here plus a message file.
export const routing = defineRouting({
  locales:       ['es'] as const,
  defaultLocale: 'es',
  localePrefix:  'as-needed', // es → /
})
