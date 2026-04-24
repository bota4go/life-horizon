const DAYS_PER_YEAR = 365.242199
const HOURS_PER_DAY = 24
const SYNODIC_DAYS = 29.53058867
const HEART_BPM = 72

export type UnitId =
  | 'years'
  | 'months'
  | 'weeks'
  | 'days'
  | 'hours'
  | 'minutes'
  | 'full_moons'
  | 'seasons'
  | 'sunsets'
  | 'weekends'
  | 'heartbeats'

export type UnitDef = {
  id: UnitId
  label: string
  shortLabel: string
  symbol: string
  decimals: number
  /** Values at or above this fill every slot in the dot ring (when count exceeds ring slots). */
  visualCap: number
  compute: (remainingYears: number) => number
}

function daysFromYears(remainingYears: number): number {
  return remainingYears * DAYS_PER_YEAR
}

/** Slots on the ring; small counts map one-to-one, larger values scale to this cap. */
export const DOT_RING_SLOTS = 72

export const UNITS: UnitDef[] = [
  {
    id: 'years',
    label: 'Years',
    shortLabel: 'yr',
    symbol: '≈',
    decimals: 2,
    visualCap: 90,
    compute: (y) => y,
  },
  {
    id: 'months',
    label: 'Months',
    shortLabel: 'mo',
    symbol: '≈',
    decimals: 1,
    visualCap: 1080,
    compute: (y) => y * 12,
  },
  {
    id: 'weeks',
    label: 'Weeks',
    shortLabel: 'wk',
    symbol: '≈',
    decimals: 1,
    visualCap: 4700,
    compute: (y) => (y * DAYS_PER_YEAR) / 7,
  },
  {
    id: 'days',
    label: 'Days',
    shortLabel: 'd',
    symbol: '≈',
    decimals: 1,
    visualCap: 32850,
    compute: (y) => daysFromYears(y),
  },
  {
    id: 'hours',
    label: 'Hours',
    shortLabel: 'h',
    symbol: '≈',
    decimals: 0,
    visualCap: 788400,
    compute: (y) => daysFromYears(y) * HOURS_PER_DAY,
  },
  {
    id: 'minutes',
    label: 'Minutes',
    shortLabel: 'min',
    symbol: '≈',
    decimals: 0,
    visualCap: 4.73e7,
    compute: (y) => daysFromYears(y) * HOURS_PER_DAY * 60,
  },
  {
    id: 'full_moons',
    label: 'Full moons',
    shortLabel: 'moon',
    symbol: '≈',
    decimals: 0,
    visualCap: 1100,
    compute: (y) => daysFromYears(y) / SYNODIC_DAYS,
  },
  {
    id: 'seasons',
    label: 'Seasons (4 per year)',
    shortLabel: 'season',
    symbol: '≈',
    decimals: 1,
    visualCap: 360,
    compute: (y) => y * 4,
  },
  {
    id: 'sunsets',
    label: 'Sunsets',
    shortLabel: 'sunset',
    symbol: '≈',
    decimals: 0,
    visualCap: 32850,
    compute: (y) => daysFromYears(y),
  },
  {
    id: 'weekends',
    label: 'Weekend days (Sat–Sun)',
    shortLabel: 'wknd',
    symbol: '≈',
    decimals: 0,
    visualCap: 9380,
    compute: (y) => (daysFromYears(y) * 2) / 7,
  },
  {
    id: 'heartbeats',
    label: 'Heartbeats (at 72 bpm)',
    shortLabel: 'beats',
    symbol: '≈',
    decimals: 0,
    visualCap: 3.4e9,
    compute: (y) =>
      daysFromYears(y) * HOURS_PER_DAY * 60 * HEART_BPM,
  },
]

/** How many dots are “on” for this value (0 … DOT_RING_SLOTS). */
export function dotRingFilledCount(unitValue: number, visualCap: number): number {
  if (!Number.isFinite(unitValue) || unitValue <= 0) return 0
  const slots = DOT_RING_SLOTS
  if (unitValue <= slots) {
    return Math.min(slots, Math.max(0, Math.round(unitValue)))
  }
  const ratio = Math.min(1, unitValue / Math.max(visualCap, 1e-9))
  return Math.min(slots, Math.round(slots * ratio))
}

export function formatUnitValue(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '—'
  const abs = Math.abs(value)
  if (abs >= 1e15) {
    return value.toExponential(2)
  }
  if (abs >= 1e6) {
    return new Intl.NumberFormat(undefined, {
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value)
  }
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(value)
}
