import { RankRangeId } from '@main/modules/ps/types/rank.types'

export type DuoId = 0 | 1 | 2 | 3

export interface GetDuoSynergyListOptions {
  championId?: number
  rankRangeId: RankRangeId
  criterion: 'synergyScore' | 'duoWinrate' | 'pickrate' | 'count'
  order: 'asc' | 'desc'
}

export interface DuoSynergyItemChampion {
  championId: number
  championName: string
  winrate: number
}

export interface DuoSynergyItem {
  ranking: number
  champion1: DuoSynergyItemChampion
  champion2: DuoSynergyItemChampion
  synergyScore: number
  duoWinrate: number
  pickrate: number
  count: number
}

export type DuoSynergyList = DuoSynergyItem[]
