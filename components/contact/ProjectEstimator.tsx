'use client'

import {
  useState, useMemo, useEffect, useRef,
  useLayoutEffect, useCallback,
} from 'react'
import { useTranslations } from 'next-intl'

// ─── Business logic constants (locale-independent) ────────────────────────────

const BASE_PRICES = {
  landing:   200,
  corporate: 650,
  ecommerce: 1600,
  app:       2800,
} as const

const PRICE_PER_PAGE = 50

const QUALITY_MULT = {
  esencial: 0.85,
  amedida:  1.15,
  premium:  1.5,
} as const

const ADDON_PRICES = {
  cms:    180,
  motion: 220,
  seo:    120,
  ia:     280,
} as const

const PROJECT_KEYS  = ['landing', 'corporate', 'ecommerce', 'app']     as const
const QUALITY_KEYS  = ['esencial', 'amedida', 'premium']               as const
const ADDON_KEYS    = ['cms', 'motion', 'seo', 'ia']                   as const

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectType  = keyof typeof BASE_PRICES
type QualityLevel = keyof typeof QUALITY_MULT
type AddonKey     = keyof typeof ADDON_PRICES
type Addons       = Record<AddonKey, boolean>

export type EstimateValue = {
  total:       number
  formatted:   string
  projectType: string
  pages:       number
  quality:     string
  addons:      string[]
  isRedesign:  boolean
}

type Props = {
  onEstimateChange?: (e: EstimateValue) => void
  onCtaClick?:       () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

function fmt(n: number) {
  return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SelOpt({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="est-opt"
      style={{
        background: active ? 'var(--color-accent)' : 'rgba(242,239,233,0.05)',
        color:      active ? '#fff'                : 'rgba(242,239,233,0.75)',
        fontWeight: active ? 600                   : 400,
      }}
    >
      {children}
    </button>
  )
}

function ToggleOpt({
  label, active, onClick, locked, includedLabel,
}: {
  label: string; active: boolean; onClick: () => void
  locked?: boolean; includedLabel: string
}) {
  const on = active || !!locked
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      aria-pressed={on}
      aria-disabled={locked}
      className="est-toggle"
      style={{ opacity: locked ? 0.6 : 1, cursor: locked ? 'default' : 'pointer' }}
    >
      <span className="est-toggle-lbl">
        {label}
        {locked && (
          <span style={{ marginLeft: 6, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}>
            {includedLabel}
          </span>
        )}
      </span>
      <div
        className="est-track"
        style={{ background: on ? 'var(--color-accent)' : 'rgba(242,239,233,0.15)' }}
      >
        <div
          className="est-thumb"
          style={{ transform: on ? 'translateX(20px)' : 'translateX(0px)' }}
        />
      </div>
    </button>
  )
}

// ─── CSS (injected once into the shadow) ─────────────────────────────────────
const CSS = `
.est-root {
  width: 100%;
  background: rgba(242,239,233,0.08);
  display: flex;
  flex-direction: column;
  gap: 1px;
  border: 1px solid rgba(242,239,233,0.08);
  border-radius: 14px;
  overflow: hidden;
  box-sizing: border-box;
}
.est-root * { box-sizing: border-box; }

/* ─ Rows ─ */
.est-row {
  display: flex;
  gap: 1px;
  background: rgba(242,239,233,0.08);
  align-items: stretch;
  flex: 1;
}
.est-mb .est-row,
.est-tb .est-row  { flex-direction: column; }
.est-dt .est-row  { flex-direction: row; }

/* ─ Columns ─ */
.est-col {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(242,239,233,0.08);
  flex: 1 1 0%;
  min-width: 0;
}

/* ─ Cell ─ */
.est-cell {
  background: var(--color-ink);
  display: flex;
  flex-direction: column;
}
.est-grow { flex: 1 1 0%; }

/* ─ Grid 4 ─ */
.est-g4  { display: grid; gap: 1px; background: rgba(242,239,233,0.08); flex: 1 1 0%; }
.est-dt  .est-g4 { grid-template-columns: repeat(4,1fr); }
.est-tb  .est-g4,
.est-mb  .est-g4 { grid-template-columns: 1fr 1fr; }

/* ─ Grid 3 ─ */
.est-g3  { display: grid; gap: 1px; background: rgba(242,239,233,0.08); flex: 1 1 0%; }
.est-dt  .est-g3,
.est-tb  .est-g3 { grid-template-columns: repeat(3,1fr); }
.est-mb  .est-g3 { grid-template-columns: 1fr; }

/* ─ Grid 2 ─ */
.est-g2  { display: grid; gap: 1px; background: rgba(242,239,233,0.08); flex: 1 1 0%; }
.est-dt  .est-g2,
.est-tb  .est-g2 { grid-template-columns: 1fr 1fr; }
.est-mb  .est-g2 { grid-template-columns: 1fr; }

/* ─ Grid 2×2 (add-ons) ─ */
.est-g22 { display: grid; gap: 1px; background: rgba(242,239,233,0.08); flex: 1 1 0%; }
.est-dt  .est-g22,
.est-tb  .est-g22 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
.est-mb  .est-g22  { grid-template-columns: 1fr; }

/* ─ Split row ─ */
.est-split { display: flex; gap: 1px; background: rgba(242,239,233,0.08); flex: 1 1 0%; align-items: stretch; }
.est-dt    .est-split,
.est-tb    .est-split { flex-direction: row; }
.est-mb    .est-split { flex-direction: column; }

.est-split-lbl {
  background: var(--color-ink);
  display: flex;
  align-items: center;
}
.est-dt .est-split-lbl { width: 35%; flex-shrink: 0; }

/* ─ Padding helpers ─ */
.est-p-main { padding: 56px 40px; }
.est-tb  .est-p-main { padding: 44px 32px; }
.est-mb  .est-p-main { padding: 32px 24px; }

.est-p-sec  { padding: 36px 32px; }
.est-mb  .est-p-sec  { padding: 24px 20px; }

.est-p-lbl  { padding: 18px 32px; }
.est-mb  .est-p-lbl  { padding: 14px 20px; }

/* ─ Typography ─ */
.est-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--color-paper);
}
.est-dt  .est-title { font-size: clamp(2.2rem, 3.2vw, 3.4rem); }
.est-tb  .est-title { font-size: 2.4rem; }
.est-mb  .est-title { font-size: 1.9rem; }

.est-lbl {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(242,239,233,0.4);
}

.est-price {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.04em;
  color: var(--color-accent);
  display: inline-block;
}
.est-dt  .est-price { font-size: clamp(2.2rem, 3.2vw, 3.6rem); }
.est-tb  .est-price { font-size: 2.6rem; }
.est-mb  .est-price { font-size: 2rem; }

.est-muted {
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(242,239,233,0.35);
  letter-spacing: 0.12em;
}

.est-disclaimer {
  font-family: var(--font-body);
  font-size: 11px;
  color: rgba(242,239,233,0.35);
  margin: 10px 0 0;
  line-height: 1.55;
}

/* ─ Select option buttons ─ */
.est-opt {
  padding: 22px 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 13px;
  text-align: center;
  transition: background 0.15s, color 0.15s;
  width: 100%;
  min-height: 60px;
}
.est-mb  .est-opt { padding: 16px 10px; font-size: 12px; }
.est-opt:focus-visible { box-shadow: inset 0 0 0 2px var(--color-accent); z-index: 1; outline: none; }

/* ─ Toggle option buttons ─ */
.est-toggle {
  padding: 22px 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: var(--color-ink);
  border: none;
  outline: none;
  font-family: var(--font-body);
  width: 100%;
}
.est-mb  .est-toggle { padding: 16px 18px; }
.est-toggle:focus-visible { box-shadow: inset 0 0 0 2px var(--color-accent); z-index: 1; outline: none; }

.est-toggle-lbl {
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(242,239,233,0.8);
  text-align: left;
}
.est-mb  .est-toggle-lbl { font-size: 12px; }

/* ─ Toggle track & thumb ─ */
.est-track {
  width: 44px;
  height: 24px;
  border-radius: 24px;
  position: relative;
  flex-shrink: 0;
  transition: background 0.22s;
}
.est-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--color-paper);
  box-shadow: 0 1px 4px rgba(0,0,0,0.18);
  transition: transform 0.2s cubic-bezier(0.4,0,0.2,1);
}

/* ─ Slider ─ */
.est-slider {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  cursor: pointer;
}
.est-slider:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 4px; border-radius: 2px; }
.est-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px; width: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  cursor: pointer;
  margin-top: -8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.22);
}
.est-slider::-webkit-slider-runnable-track {
  width: 100%; height: 4px;
  background: rgba(242,239,233,0.2);
  border-radius: 2px;
}
.est-slider::-moz-range-thumb {
  height: 20px; width: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  border: none;
}
.est-slider::-moz-range-track {
  height: 4px;
  background: rgba(242,239,233,0.2);
  border-radius: 2px;
}

/* ─ Breakdown ─ */
.est-bd { margin-top: 20px; border-top: 1px solid rgba(242,239,233,0.1); }
.est-bd-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid rgba(242,239,233,0.06);
}
.est-bd-row:last-child { border-bottom: none; }
.est-bd-lbl { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em; color: rgba(242,239,233,0.4); }
.est-bd-val { font-family: var(--font-mono); font-size: 10px; font-weight: 600; color: var(--color-paper); letter-spacing: 0.06em; }

/* ─ CTA ─ */
.est-cta {
  display: block;
  width: 100%;
  padding: 20px 24px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  text-align: center;
  transition: background 0.2s;
}
.est-cta:hover        { background: #4a2fd1; }
.est-cta:focus-visible { outline: 2px solid var(--color-paper); outline-offset: -4px; }

/* ─ Price animation ─ */
@keyframes est-price-in {
  from { opacity: 0; transform: translateY(7px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.est-price-anim { animation: est-price-in 0.22s ease-out both; }

/* ─ prefers-reduced-motion ─ */
@media (prefers-reduced-motion: reduce) {
  .est-price-anim { animation: none; }
  .est-thumb  { transition: none; }
  .est-track  { transition: none; }
  .est-cta    { transition: none; }
  .est-opt    { transition: none; }
}
`

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectEstimator({ onEstimateChange, onCtaClick }: Props) {
  const t = useTranslations('contact.estimador')

  const containerRef              = useRef<HTMLDivElement>(null)
  const [containerWidth, setW]    = useState(1200)

  const [projectType, setType]    = useState<ProjectType>('corporate')
  const [isRedesign, setRedesign] = useState(false)
  const [pages, setPages]         = useState(8)
  const [quality, setQuality]     = useState<QualityLevel>('amedida')
  const [addons, setAddons]       = useState<Addons>({ cms: false, motion: false, seo: false, ia: false })

  // Translated display arrays (built inside component so t() is available)
  const projectOpts = PROJECT_KEYS.map(key => ({ key, label: t(`projectOpts.${key}`) }))
  const qualityOpts = QUALITY_KEYS.map(key => ({ key, label: t(`qualityOpts.${key}`) }))
  const addonOpts   = ADDON_KEYS.map(key  => ({ key, label: t(`addonOpts.${key}`),  price: ADDON_PRICES[key] }))

  useIsoLayoutEffect(() => {
    if (!containerRef.current) return
    setW(containerRef.current.offsetWidth)
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(entries => setW(entries[0].contentRect.width))
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const isTablet  = containerWidth >= 500 && containerWidth < 810
  const isDesktop = containerWidth >= 810
  const layoutCls = isDesktop ? 'est-dt' : isTablet ? 'est-tb' : 'est-mb'

  const isPremium = quality === 'premium'

  const total = useMemo(() => {
    const base     = BASE_PRICES[projectType]
    const pages_c  = pages * PRICE_PER_PAGE
    const mult     = QUALITY_MULT[quality]
    const redesign = isRedesign ? 0.85 : 1
    const sub      = (base + pages_c) * mult * redesign
    const useCms    = isPremium || addons.cms
    const useMotion = isPremium || addons.motion
    const useSeo    = isPremium || addons.seo
    const useIa     = isPremium || addons.ia
    const addonSum  = (useCms    ? ADDON_PRICES.cms    : 0)
                    + (useMotion ? ADDON_PRICES.motion  : 0)
                    + (useSeo    ? ADDON_PRICES.seo     : 0)
                    + (useIa     ? ADDON_PRICES.ia      : 0)
    return Math.round(sub + addonSum)
  }, [projectType, isRedesign, pages, quality, isPremium, addons])

  const formattedPrice = fmt(total)

  useEffect(() => {
    if (!onEstimateChange) return
    onEstimateChange({
      total,
      formatted:   formattedPrice,
      projectType: projectOpts.find(o => o.key === projectType)?.label ?? projectType,
      pages,
      quality:     qualityOpts.find(o => o.key === quality)?.label ?? quality,
      addons:      addonOpts.filter(a => addons[a.key as AddonKey]).map(a => a.label),
      isRedesign,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total, formattedPrice, projectType, pages, quality, isRedesign,
      addons.cms, addons.motion, addons.seo, addons.ia, onEstimateChange])

  const toggleAddon = useCallback((key: AddonKey) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const basePrice    = BASE_PRICES[projectType]
  const qualityLabel = qualityOpts.find(o => o.key === quality)?.label ?? quality
  const multLabel    = `×${QUALITY_MULT[quality]}`
  const allAddonsTotal = Object.values(ADDON_PRICES).reduce((a, b) => a + b, 0)
  const activeAddonTotal = (!isPremium)
    ? (addons.cms ? ADDON_PRICES.cms : 0)
      + (addons.motion ? ADDON_PRICES.motion : 0)
      + (addons.seo ? ADDON_PRICES.seo : 0)
      + (addons.ia ? ADDON_PRICES.ia : 0)
    : 0

  return (
    <div ref={containerRef} className={`est-root ${layoutCls}`}>
      <style>{CSS}</style>

      {/* ── Row 1: Title | Project type ───────────────────────────────────────── */}
      <div className="est-row">
        <div className="est-col">
          <div className="est-cell est-grow est-p-main" style={{ justifyContent: 'center' }}>
            <h2 className="est-title">
              {t('titleLine1')}
              <br />
              <span style={{ color: 'var(--color-accent)' }}>{t('titleLine2')}</span>
            </h2>
          </div>
        </div>
        <div className="est-col">
          <div className="est-cell est-p-lbl">
            <span className="est-lbl">{t('labelType')}</span>
          </div>
          <div className="est-g4 est-grow">
            {projectOpts.map(({ key, label }) => (
              <SelOpt key={key} active={projectType === key} onClick={() => setType(key as ProjectType)}>
                {label}
              </SelOpt>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 2: Slider | Redesign + Design level ───────────────────────────── */}
      <div className="est-row">
        <div className="est-col">
          <div className="est-cell est-grow est-p-sec" style={{ justifyContent: 'center' }}>
            <label htmlFor="est-slider" className="est-lbl">{t('labelVolume')}</label>
            <div style={{ marginTop: 28, marginBottom: 14 }}>
              <input
                id="est-slider"
                type="range"
                min="1" max="50"
                value={pages}
                onChange={e => setPages(Number(e.target.value))}
                className="est-slider"
                aria-label={t('labelVolume')}
                aria-valuemin={1}
                aria-valuemax={50}
                aria-valuenow={pages}
                aria-valuetext={`${pages} ${t('volSuffix')}`}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="est-muted">{t('volMin')}</span>
              <span className="est-lbl" style={{ color: 'var(--color-paper)' }}>
                {pages} {t('volSuffix')}
              </span>
              <span className="est-muted">{t('volMax')}</span>
            </div>
          </div>
        </div>
        <div className="est-col">
          {/* Redesign */}
          <div className="est-split est-grow">
            <div className="est-split-lbl est-p-lbl">
              <span className="est-lbl">{t('labelRedesign')}</span>
            </div>
            <div className="est-g2 est-grow">
              <SelOpt active={isRedesign}  onClick={() => setRedesign(true)}>
                {t('optYes')}
              </SelOpt>
              <SelOpt active={!isRedesign} onClick={() => setRedesign(false)}>
                {t('optNo')}
              </SelOpt>
            </div>
          </div>
          {/* Design level */}
          <div className="est-split est-grow">
            <div className="est-split-lbl est-p-lbl">
              <span className="est-lbl">{t('labelDesign')}</span>
            </div>
            <div className="est-g3 est-grow">
              {qualityOpts.map(({ key, label }) => (
                <SelOpt key={key} active={quality === key} onClick={() => setQuality(key as QualityLevel)}>
                  {label}
                </SelOpt>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: Add-ons | Estimate + CTA ──────────────────────────────────── */}
      <div className="est-row">
        <div className="est-col">
          <div className="est-g22 est-grow">
            {addonOpts.map(({ key, label }) => (
              <ToggleOpt
                key={key}
                label={label}
                active={addons[key as AddonKey]}
                onClick={() => toggleAddon(key as AddonKey)}
                locked={isPremium}
                includedLabel={t('included')}
              />
            ))}
          </div>
        </div>
        <div className="est-col">
          <div className="est-cell est-grow est-p-sec" style={{ justifyContent: 'center' }}>
            <span className="est-lbl">{t('labelEstimate')}</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 10 }}>
              <span key={total} className="est-price est-price-anim">
                {formattedPrice}
              </span>
              <span className="est-muted">{t('estimateSuffix')}</span>
            </div>
            <p className="est-disclaimer">{t('disclaimer')}</p>

            {/* Breakdown */}
            <div className="est-bd">
              <div className="est-bd-row">
                <span className="est-bd-lbl">{t('bdBase')}</span>
                <span className="est-bd-val">{fmt(basePrice)}</span>
              </div>
              <div className="est-bd-row">
                <span className="est-bd-lbl">{t('bdPages')} ({pages})</span>
                <span className="est-bd-val">{fmt(pages * PRICE_PER_PAGE)}</span>
              </div>
              <div className="est-bd-row">
                <span className="est-bd-lbl">{t('bdDesign')} — {qualityLabel}</span>
                <span className="est-bd-val">{multLabel}</span>
              </div>
              {isPremium && (
                <div className="est-bd-row">
                  <span className="est-bd-lbl" style={{ color: 'var(--color-accent)' }}>
                    {t('allAddons')}
                  </span>
                  <span className="est-bd-val" style={{ color: 'var(--color-accent)' }}>
                    +{fmt(allAddonsTotal)}
                  </span>
                </div>
              )}
              {!isPremium && activeAddonTotal > 0 && (
                <div className="est-bd-row">
                  <span className="est-bd-lbl">{t('selectedAddons')}</span>
                  <span className="est-bd-val">+{fmt(activeAddonTotal)}</span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="est-cell">
            <button type="button" onClick={onCtaClick} className="est-cta">
              {t('ctaText')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
