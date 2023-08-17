import { DIVISION_ROMAN_TO_NUMBER_MAP } from '@main/modules/league/league.constants'
import type { Tier } from '@main/modules/league/types/rank.types'

export const getDivision = (
  tier: Tier | undefined | null,
  roman: keyof typeof DIVISION_ROMAN_TO_NUMBER_MAP | undefined | null,
) =>
  ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier ?? 'UNRANKED')
    ? null
    : roman
    ? DIVISION_ROMAN_TO_NUMBER_MAP[roman]
    : null
