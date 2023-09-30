import { Champion } from '@main/modules/league/types/champion.types'

export type ChampionTier = 1 | 2 | 3 | 4 | 5 | 6

export interface ChampionTierItem {
  champion: Champion
  rankingVariation: number
  ranking: number
  isHoney: boolean
  isOp: boolean
  tier: ChampionTier
  opScore: number
  honeyScore: number
  winRate: number
  pickRate: number
  banRate: number
  count: number
  updatedAt: string
}
