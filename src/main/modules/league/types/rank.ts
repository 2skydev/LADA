import { TIERS } from '../constants/rank'

export type Tier = (typeof TIERS)[number]
export type Division = 1 | 2 | 3 | 4 | null

export interface Rank {
  tier: Tier
  division: Division
  lp: number
}
