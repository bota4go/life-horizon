/** World Bank series is population-weighted combined sexes; approximate split for UX. */
const SEX_GAP_YEARS = 4.6

export type Sex = 'male' | 'female' | 'average'

export function adjustedLifeExpectancy(
  combinedAtBirth: number,
  sex: Sex,
): number {
  if (sex === 'average') return combinedAtBirth
  const half = SEX_GAP_YEARS / 2
  return sex === 'female' ? combinedAtBirth + half : combinedAtBirth - half
}

export function remainingYears(age: number, lifeExpectancy: number): number {
  return Math.max(0, lifeExpectancy - age)
}
