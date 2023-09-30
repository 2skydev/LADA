import { LaneId } from '@main/modules/league/types/lane.types'
import { Summoner } from '@main/modules/league/types/summoner.types'

export type GameMode = 'CLASSIC' | 'ARAM' | 'URF'
export type PickType =
  | 'SimulPickStrategy'
  | 'TournamentPickStrategy'
  | 'DraftModeSinglePickStrategy'
  | 'AllRandomPickStrategy'

export interface Lobby {
  title: string
  gameMode: GameMode
  pickType: PickType | null
  summoners: LobbySummoner[]
  spectators: Summoner[]
  teams: [Summoner[], Summoner[]]
  isCustom: boolean
}

export interface LobbySummoner extends Summoner {
  firstLaneId: LaneId | null
  secondLaneId: LaneId | null
}
