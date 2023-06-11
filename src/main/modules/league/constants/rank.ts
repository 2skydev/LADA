export const TIERS = [
  'IRON',
  'BRONZE',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'DIAMOND',
  'MASTER',
  'GRANDMASTER',
  'CHALLENGER',
] as const

export const NO_DIVISION_TIERS = ['MASTER', 'GRANDMASTER', 'CHALLENGER']

export const DIVISION_ROMAN_TO_NUMBER_MAP = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
}
