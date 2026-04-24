import { useMemo } from 'react'
import { DOT_RING_SLOTS, dotRingFilledCount } from '../lib/units'

const CX = 50
const CY = 50
const R = 38
const DOT_R = 1.35

type Props = {
  unitLabel: string
  unitValue: number
  visualCap: number
}

const slotAngles = (() => {
  const out: number[] = []
  for (let i = 0; i < DOT_RING_SLOTS; i++) {
    out.push(-Math.PI / 2 + (i / DOT_RING_SLOTS) * Math.PI * 2)
  }
  return out
})()

export function CountDotRing({ unitLabel, unitValue, visualCap }: Props) {
  const filled = dotRingFilledCount(unitValue, visualCap)

  const dots = useMemo(
    () =>
      slotAngles.map((angle, i) => ({
        cx: CX + R * Math.cos(angle),
        cy: CY + R * Math.sin(angle),
        on: i < filled,
      })),
    [filled],
  )

  const modeHint =
    unitValue <= DOT_RING_SLOTS
      ? 'One dot per unit up to 72.'
      : `Ring scaled to ~${new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 1 }).format(visualCap)} units (full ring).`

  return (
    <div className="dot-ring-wrap">
      <svg
        className="dot-ring"
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${filled} of ${DOT_RING_SLOTS} markers for ${unitLabel}`}
      >
        <title>
          {filled} of {DOT_RING_SLOTS} dots around the circle for {unitLabel}
        </title>
        <defs>
          <radialGradient id="dot-ring-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.22)" />
            <stop offset="70%" stopColor="rgba(56, 189, 248, 0.06)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          cx={CX}
          cy={CY}
          r={R + 6}
          fill="url(#dot-ring-glow)"
          className="dot-ring-halo"
        />
        <circle
          cx={CX}
          cy={CY}
          r={R + 2.5}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={0.35}
        />
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={DOT_R}
            className={d.on ? 'dot-ring-dot dot-ring-dot-on' : 'dot-ring-dot'}
          />
        ))}
      </svg>
      <p className="dot-ring-caption">{modeHint}</p>
    </div>
  )
}
