import { RankRangeId } from '@main/modules/ps/types/rank.types'

export interface GetDuoSynergyListOptions {
  championId?: number
  rankRangeId: RankRangeId
  criterion: 'synergyScore' | 'duoWinrate' | 'pickrate' | 'count'
  order: 'asc' | 'desc'
}
