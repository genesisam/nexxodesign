// ─── Portable Text ────────────────────────────────────────────────────────────
// Shape mirrors what *[_type=="project"][0]{ ... } returns after GROQ flattening.

export type PTMarkDef = {
  _type: string
  _key:  string
  href?: string
}

export type PTSpan = {
  _type:  'span'
  _key:   string
  text:   string
  marks?: string[]
}

export type PTBlock = {
  _type:     'block'
  _key:      string
  style:     'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
  children:  PTSpan[]
  markDefs?: PTMarkDef[]
  listItem?: 'bullet' | 'number'
  level?:    number
}

export type PTImage = {
  _type:      'image'
  _key:       string
  url:        string | null
  alt?:       string
  caption?:   string
  fullBleed?: boolean
}

export type PTContent = PTBlock | PTImage

// ─── Story blocks (Cuberto block model) ───────────────────────────────────────

export type OverviewBlock = {
  _type:    'overview'
  _key:     string
  label?:   string
  heading?: string
  body:     PTContent[]
  link?:    { label: string; href: string }
}

export type SectionHeaderBlock = {
  _type:    'sectionHeader'
  _key:     string
  heading:  string
  divider?: boolean
}

export type MediaBlock = {
  _type:     'media'
  _key:      string
  mediaType: 'image' | 'video'
  url:       string | null
  caption?:  string
  size?:     'sm' | 'lg'
}

export type SplitItem = {
  _key:      string
  mediaType: 'image' | 'video'
  url:       string | null
  size:      'sm' | 'ms'
  caption?:  string
}

export type SplitShowBlock = {
  _type: 'splitShow'
  _key:  string
  items: SplitItem[]
}

export type QuoteBlock = {
  _type: 'quote'
  _key:  string
  text:  string
}

export type FeedbackBlock = {
  _type:    'feedback'
  _key:     string
  quote:    string
  name:     string
  role:     string
  company?: string
  link?:    { label: string; href: string }
}

export type StoryBlock =
  | OverviewBlock
  | SectionHeaderBlock
  | MediaBlock
  | SplitShowBlock
  | QuoteBlock
  | FeedbackBlock

// ─── Project metadata ─────────────────────────────────────────────────────────

export type Metric = {
  _key:  string
  label: string
  value: string
}

export type ProjectPreview = {
  title:    string
  slug:     { current: string }
  cover:    string | null
  vertical: string
}

// ─── Project (matches GROQ projection) ───────────────────────────────────────

export type Project = {
  _id:          string
  title:        string
  subtitle?:    string
  slug:         { current: string }
  client:       string
  year:         number
  timeline?:    string
  services:     string[]
  vertical:     string
  cover:        string | null
  heroMedia?:   string | null
  metric:       string | null
  metrics?:     Metric[]
  excerpt:      string
  liveUrl?:     string | null
  story:        StoryBlock[]
  nextProject?: ProjectPreview | null
}
