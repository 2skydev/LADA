import { DIVISION_ROMAN_TO_NUMBER_MAP } from '@main/modules/league/constants/rank'
import { Tier } from '@main/modules/league/types/rank'

export const getDivision = (tier: Tier, roman: keyof typeof DIVISION_ROMAN_TO_NUMBER_MAP) =>
  ['MASTER', 'GRANDMASTER', 'CHALLENGER'].includes(tier)
    ? null
    : DIVISION_ROMAN_TO_NUMBER_MAP[roman]
