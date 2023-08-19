import { LaneId } from '@main/modules/league/types/lane.types'

export interface ChampionSelectSession {
  gameId: number
  laneId: LaneId | null
  championId: number | null
  tempChampionId: number | null
}
