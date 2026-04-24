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
  compute: (remainingYears: number) => number
}

function daysFromYears(remainingYears: number): number {
  return remainingYears * DAYS_PER_YEAR
}

export const UNITS: UnitDef[] = [
  {
    id: 'years',
    label: 'Years',
    shortLabel: 'yr',
    symbol: '≈',
    decimals: 2,
    compute: (y) => y,
  },
  {
    id: 'months',
    label: 'Months',
    shortLabel: 'mo',
    symbol: '≈',
    decimals: 1,
    compute: (y) => y * 12,
  },
  {
    id: 'weeks',
    label: 'Weeks',
    shortLabel: 'wk',
    symbol: '≈',
    decimals: 1,
    compute: (y) => (y * DAYS_PER_YEAR) / 7,
  },
  {
    id: 'days',
    label: 'Days',
    shortLabel: 'd',
    symbol: '≈',
    decimals: 1,
    compute: (y) => daysFromYears(y),
  },
  {
    id: 'hours',
    label: 'Hours',
    shortLabel: 'h',
    symbol: '≈',
    decimals: 0,
    compute: (y) => daysFromYears(y) * HOURS_PER_DAY,
  },
  {
    id: 'minutes',
    label: 'Minutes',
    shortLabel: 'min',
    symbol: '≈',
    decimals: 0,
    compute: (y) => daysFromYears(y) * HOURS_PER_DAY * 60,
  },
  {
    id: 'full_moons',
    label: 'Full moons',
    shortLabel: 'moon',
    symbol: '≈',
    decimals: 0,
    compute: (y) => daysFromYears(y) / SYNODIC_DAYS,
  },
  {
    id: 'seasons',
    label: 'Seasons (4 per year)',
    shortLabel: 'season',
    symbol: '≈',
    decimals: 1,
    compute: (y) => y * 4,
  },
  {
    id: 'sunsets',
    label: 'Sunsets',
    shortLabel: 'sunset',
    symbol: '≈',
    decimals: 0,
    compute: (y) => daysFromYears(y),
  },
  {
    id: 'weekends',
    label: 'Weekend days (Sat–Sun)',
    shortLabel: 'wknd',
    symbol: '≈',
    decimals: 0,
    compute: (y) => (daysFromYears(y) * 2) / 7,
  },
  {
    id: 'heartbeats',
    label: 'Heartbeats (at 72 bpm)',
    shortLabel: 'beats',
    symbol: '≈',
    decimals: 0,
    compute: (y) =>
      daysFromYears(y) * HOURS_PER_DAY * 60 * HEART_BPM,
  },
]

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
